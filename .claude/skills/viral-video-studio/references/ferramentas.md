# Ferramentas e quando usar

Todas as gerações do Higgsfield custam créditos. **Sempre** informar a estimativa e pedir confirmação antes de gerar.

| Necessidade | Ferramenta | Observação |
|---|---|---|
| Foto + voz → pessoa falando | Higgsfield `generate_video` modelo `intone` | 4–30s por clipe, 720p/1080p, 9:16. Imagem do personagem + áudio de referência |
| Voz clonada do usuário | Higgsfield `create_voice` | Exige amostra de áudio limpa do próprio usuário |
| Texto → fala (TTS) | Higgsfield `generate_audio` | Usar voz clonada ou voz de catálogo (`list_voices`) |
| Cena/B-roll gerado | `generate_video` com `kling3_0`, `seedance_2_5` ou `flux_3_video` | Rodar `models_explore` (action `recommend`) se em dúvida |
| Variação de roupa/cenário da mesma pessoa | `generate_image` com a foto de referência | Para dois papéis, novelinha |
| Analisar vídeo viral cena a cena | `video_analysis_create` → `video_analysis_status` | Upload do vídeo ou link do YouTube. Vídeos curtos dão melhor precisão |
| Prever potencial viral | `virality_predictor` | Depois da montagem |
| Montagem, trilha, legenda queimada | workflow `video-montage` (Higgsfield) ou `scripts/compose.sh` local | Local não gasta crédito |
| Recriar um anúncio com outro elenco/produto | workflow `ad-multiplier` | Vídeo fonte de 4–30s |
| Templates do app Captions | App Captions (manual) | Não há conector do Captions. O usuário aplica o template no app; Claude entrega roteiro, cortes e textos prontos |

## Clipes longos com Intone

O Intone aceita até 30s por geração. Para falas maiores: dividir o roteiro em blocos de 8–25s em pausas naturais, gerar cada bloco com o mesmo personagem e voz, e juntar com `compose.sh concat` intercalando B-roll ou punch-in para esconder a emenda.

## Uploads

Arquivos locais vão para o Higgsfield por `media_upload` → `curl PUT` → `media_confirm`. Guardar os `media_id` retornados para reutilizar o mesmo personagem.
