#!/usr/bin/env python3
"""
Gera uma trilha sonora ambiente cinematografica (livre de direitos), sintetizada.
Estilo: drone grave + pad em re menor + swells lentos + pulso sutil de tensao.
Saida: video-studio/public/trilha.wav  (regeneravel; nao versionar o .wav)

Uso: python3 assets-gen/gen_trilha.py
Trocar por uma trilha licenciada depois e so substituir public/trilha.wav.
"""
import numpy as np
import wave
import struct
import os

SR = 32000          # sample rate
DUR = 120.0         # segundos (bate com o video: 4 blocos de 30s)
t = np.linspace(0, DUR, int(SR * DUR), endpoint=False)

def note(freq, amp=1.0, detune=0.0):
    # oscilador com leve detune para "largura" analogica
    return amp * (
        np.sin(2 * np.pi * freq * t)
        + 0.5 * np.sin(2 * np.pi * (freq * (1 + detune)) * t)
    )

# Acorde de Re menor (Dm) - sobrio, contemplativo, combina com narrativa biblica
D2, D3, F3, A3, D4 = 73.42, 146.83, 174.61, 220.00, 293.66

pad = (
    note(D2, 0.35, 0.004)
    + note(D3, 0.25, 0.005)
    + note(F3, 0.18, 0.006)
    + note(A3, 0.16, 0.006)
    + note(D4, 0.10, 0.007)
)

# LFO de swell lento (respiro cinematografico ~8s)
swell = 0.55 + 0.45 * (0.5 - 0.5 * np.cos(2 * np.pi * t / 8.0))
pad *= swell

# "Ar" - ruido filtrado bem sutil para textura
noise = np.random.normal(0, 1, len(t))
# filtro passa-baixa simples (media movel) para tirar o aspero
k = 200
noise = np.convolve(noise, np.ones(k) / k, mode="same")
pad += 0.06 * noise / (np.max(np.abs(noise)) + 1e-9)

# Pulso grave de tensao (entra mais forte na 2a metade - clima de teste/climax)
pulse_env = np.clip((t - 45) / 30.0, 0, 1)  # cresce de 45s a 75s
beat = np.zeros_like(t)
period = 2.0  # a cada 2s
for i in range(int(DUR / period)):
    c = i * period
    env = np.exp(-((t - c) ** 2) / (2 * 0.05 ** 2))
    beat += env
beat *= np.sin(2 * np.pi * 55 * t)  # sub grave
pad += 0.25 * pulse_env * beat

# Reverb barato (feedback delay) para dar "sala"/profundidade
def cheap_reverb(x, delay_s=0.09, decay=0.35, taps=6):
    out = x.copy()
    d = int(delay_s * SR)
    for i in range(1, taps + 1):
        shift = d * i
        if shift < len(x):
            out[shift:] += (decay ** i) * x[:-shift]
    return out

pad = cheap_reverb(pad)

# Fade in/out cinematografico
fade = int(2.5 * SR)
pad[:fade] *= np.linspace(0, 1, fade)
pad[-fade:] *= np.linspace(1, 0, fade)

# Normaliza com headroom (-3 dBFS) para nao clipar sob a narracao
pad = pad / (np.max(np.abs(pad)) + 1e-9) * 0.7

# Estereo com leve diferenca de fase (largura)
left = pad
right = np.roll(pad, int(0.012 * SR)) * 0.98
stereo = np.stack([left, right], axis=1)
stereo = np.clip(stereo, -1, 1)

out_dir = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.abspath(os.path.join(out_dir, "trilha.wav"))

with wave.open(out_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    data = (stereo * 32767).astype(np.int16)
    wf.writeframes(data.tobytes())

print(f"OK: {out_path}  ({os.path.getsize(out_path)/1e6:.1f} MB, {DUR:.0f}s)")
