# PEDRA STUDIO — instalação no Windows (rode UMA vez, no PowerShell, dentro da pasta pedra-studio)
# Pré-requisitos: Python 3.11 (python.org) e Node.js LTS (nodejs.org)
$ErrorActionPreference = "Stop"
Write-Host "1/4 Ambiente Python..." -ForegroundColor Cyan
py -3.11 -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
Write-Host "2/4 Ferramentas de IA (corte, legenda, voz)..." -ForegroundColor Cyan
.\.venv\Scripts\pip install -r pipeline\requirements.txt
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
  Write-Host "   Placa NVIDIA detectada: ativando aceleração (GPU)" -ForegroundColor Green
  .\.venv\Scripts\pip install --force-reinstall torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
} else { Write-Host "   Sem NVIDIA: vai rodar no processador (mais lento, funciona)" -ForegroundColor Yellow }
Write-Host "3/4 Motor de vídeo (Remotion)..." -ForegroundColor Cyan
npm ci
Write-Host "4/4 Baixando modelos (só na 1ª vez, alguns GB)..." -ForegroundColor Cyan
.\.venv\Scripts\python -c "from faster_whisper import WhisperModel; WhisperModel('small')"
Write-Host "`nPRONTO! Teste: .\.venv\Scripts\python pipeline\reel.py fala SEU_VIDEO.mp4 --nome teste" -ForegroundColor Green
