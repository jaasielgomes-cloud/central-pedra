#!/usr/bin/env bash
# compose.sh — montagem de vídeos verticais (1080x1920, 30fps) com ffmpeg.
# Uso: compose.sh <comando> [args]   |   compose.sh help
set -euo pipefail

W=1080; H=1920; FPS=30
VENC=(-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r "$FPS")
AENC=(-c:a aac -b:a 192k -ar 48000 -ac 2)

die() { echo "erro: $*" >&2; exit 1; }
need() { [[ -f "$1" ]] || die "arquivo não encontrado: $1"; }
has_audio() { [[ -n "$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$1")" ]]; }
duration() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
# Acrescenta ao array AIN a entrada de áudio do arquivo (ou silêncio, para nunca quebrar o filtro).
add_audio() { if has_audio "$1"; then AIN+=(-i "$1"); else AIN+=(-f lavfi -t "$(duration "$1")" -i anullsrc=r=48000:cl=stereo); fi; }
fill() { echo "scale=$1:$2:force_original_aspect_ratio=increase,crop=$1:$2,setsar=1"; }

usage() {
  cat <<'EOF'
Comandos:
  split TOP BOTTOM OUT [RATIO] [AUDIO]  Tela dividida. RATIO = fração do topo (padrão 0.5).
                                        AUDIO = top|bottom|mix (padrão mix: topo -8dB + reação)
  pip BG FG OUT [POS] [SIZE] [CHROMA]   Pessoa sobre fundo. POS = bl|br|tl|tr|bottom (padrão bottom)
                                        SIZE = fração da largura (0.6). CHROMA = cor p/ remover (ex. 0x00FF00) ou none
  stack A B OUT                         Diálogo: A em cima, B embaixo, ambos visíveis (dois papéis)
  still IMG SECONDS OUT [ZOOM]          Imagem -> clipe vertical. ZOOM=1 aplica zoom lento (padrão 1)
  concat OUT IN1 IN2 [...]              Normaliza e junta clipes em sequência
  captions IN SUBS OUT                  Queima legenda .srt ou .ass
  music IN TRACK OUT [DB]               Trilha de fundo em DB relativo (padrão -22)
  loudnorm IN OUT                       Normaliza voz para -14 LUFS
EOF
}

cmd_split() {
  local top=$1 bot=$2 out=$3 ratio=${4:-0.5} mode=${5:-mix}
  need "$top"; need "$bot"
  local th bh; th=$(awk "BEGIN{printf \"%d\", $H*$ratio/2*2}"); bh=$((H - th))
  local amap
  case $mode in
    top) amap="[2:a]anull[a]" ;;
    bottom) amap="[3:a]anull[a]" ;;
    mix) amap="[2:a]volume=-8dB[t];[3:a]anull[b];[t][b]amix=inputs=2:duration=shortest:normalize=0[a]" ;;
    *) die "AUDIO deve ser top|bottom|mix" ;;
  esac
  AIN=(); add_audio "$top"; add_audio "$bot"
  ffmpeg -y -i "$top" -i "$bot" "${AIN[@]}" -filter_complex \
    "[0:v]$(fill $W "$th")[t0];[1:v]$(fill $W "$bh")[b0];[t0][b0]vstack=shortest=1[v];$amap" \
    -map "[v]" -map "[a]" -shortest "${VENC[@]}" "${AENC[@]}" "$out"
}

cmd_pip() {
  local bg=$1 fg=$2 out=$3 pos=${4:-bottom} size=${5:-0.6} chroma=${6:-none}
  need "$bg"; need "$fg"
  local fw; fw=$(awk "BEGIN{printf \"%d\", $W*$size/2*2}")
  local key=""; [[ $chroma != none ]] && key="chromakey=$chroma:0.15:0.08,"
  local xy
  case $pos in
    bl) xy="40:H-h-360" ;; br) xy="W-w-40:H-h-360" ;;
    tl) xy="40:240" ;; tr) xy="W-w-40:240" ;;
    bottom) xy="(W-w)/2:H-h" ;; *) die "POS inválida" ;;
  esac
  local bgin=(-i "$bg")
  [[ ${bg,,} =~ \.(png|jpe?g|webp)$ ]] && bgin=(-loop 1 -i "$bg")  # imagem: repetir até o fim do primeiro plano
  AIN=(); add_audio "$fg"
  ffmpeg -y "${bgin[@]}" -i "$fg" "${AIN[@]}" -filter_complex \
    "[0:v]$(fill $W $H)[b];[1:v]${key}scale=$fw:-2[f];[b][f]overlay=$xy:shortest=1[v]" \
    -map "[v]" -map 2:a -shortest "${VENC[@]}" "${AENC[@]}" "$out"
}

cmd_stack() {
  local a=$1 b=$2 out=$3; need "$a"; need "$b"
  AIN=(); add_audio "$a"; add_audio "$b"
  ffmpeg -y -i "$a" -i "$b" "${AIN[@]}" -filter_complex \
    "[0:v]$(fill $W $((H/2)))[x];[1:v]$(fill $W $((H/2)))[y];[x][y]vstack=shortest=0[v];[2:a][3:a]amix=inputs=2:duration=longest:normalize=0[a]" \
    -map "[v]" -map "[a]" "${VENC[@]}" "${AENC[@]}" "$out"
}

cmd_still() {
  local img=$1 secs=$2 out=$3 zoom=${4:-1}; need "$img"
  local frames; frames=$(awk "BEGIN{printf \"%d\", $secs*$FPS}")
  local vf="scale=$W:$H:force_original_aspect_ratio=decrease,pad=$W:$H:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1"
  [[ $zoom == 1 ]] && vf="scale=$((W*2)):-2,zoompan=z='min(zoom+0.0008,1.12)':d=$frames:s=${W}x${H}:fps=$FPS:x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2',setsar=1"
  ffmpeg -y -loop 1 -i "$img" -f lavfi -i anullsrc=r=48000:cl=stereo -t "$secs" -vf "$vf" \
    -shortest "${VENC[@]}" "${AENC[@]}" "$out"
}

cmd_concat() {
  local out=$1; shift; (( $# >= 2 )) || die "concat precisa de 2+ clipes"
  local tmp; tmp=$(mktemp -d)
  local i=0 list="$tmp/list.txt"
  for f in "$@"; do
    need "$f"
      AIN=(); add_audio "$f"
    ffmpeg -y -loglevel error -i "$f" "${AIN[@]}" -map 0:v -map 1:a -vf "$(fill $W $H)" \
      -shortest "${VENC[@]}" "${AENC[@]}" "$tmp/$i.mp4"
    echo "file '$tmp/$i.mp4'" >> "$list"; i=$((i+1))
  done
  ffmpeg -y -f concat -safe 0 -i "$list" -c:v copy "${AENC[@]}" -movflags +faststart "$out"
  rm -rf "$tmp"
}

cmd_captions() {
  local in=$1 subs=$2 out=$3; need "$in"; need "$subs"
  local style="FontName=Montserrat Black,FontSize=16,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=3,Shadow=0,Alignment=2,MarginV=420"
  local vf="subtitles='$subs'"; [[ $subs == *.srt ]] && vf="subtitles='$subs':force_style='$style'"
  ffmpeg -y -i "$in" -vf "$vf" "${VENC[@]}" -c:a copy "$out"
}

cmd_music() {
  local in=$1 track=$2 out=$3 db=${4:--22}; need "$in"; need "$track"
  AIN=(); add_audio "$in"
  ffmpeg -y -i "$in" "${AIN[@]}" -stream_loop -1 -i "$track" -filter_complex \
    "[2:a]volume=${db}dB[m];[1:a][m]amix=inputs=2:duration=first:normalize=0[a]" \
    -map 0:v -map "[a]" -c:v copy "${AENC[@]}" "$out"
}

cmd_loudnorm() {
  local in=$1 out=$2; need "$in"
  ffmpeg -y -i "$in" -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy "${AENC[@]}" "$out"
}

main() {
  local c=${1:-help}; shift || true
  case $c in
    split) (( $# >= 3 )) || die "uso: split TOP BOTTOM OUT [RATIO] [AUDIO]"; cmd_split "$@" ;;
    pip) (( $# >= 3 )) || die "uso: pip BG FG OUT [POS] [SIZE] [CHROMA]"; cmd_pip "$@" ;;
    stack) (( $# == 3 )) || die "uso: stack A B OUT"; cmd_stack "$@" ;;
    still) (( $# >= 3 )) || die "uso: still IMG SECONDS OUT [ZOOM]"; cmd_still "$@" ;;
    concat) cmd_concat "$@" ;;
    captions) (( $# == 3 )) || die "uso: captions IN SUBS OUT"; cmd_captions "$@" ;;
    music) (( $# >= 3 )) || die "uso: music IN TRACK OUT [DB]"; cmd_music "$@" ;;
    loudnorm) (( $# == 2 )) || die "uso: loudnorm IN OUT"; cmd_loudnorm "$@" ;;
    help|-h|--help) usage ;;
    *) usage; die "comando desconhecido: $c" ;;
  esac
}
main "$@"
