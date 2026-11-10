#!/usr/bin/env python3
"""Génère la voix off neuronale (fichiers mp3) des résumés animés NOHOBA-Lab, hors ligne.

Usage :
  node tools/voix/extraire.cjs 5e > /tmp/phrases.json
  python3 tools/voix/generer.py /tmp/phrases.json --modeles /chemin/vers/modeles [--voix siwis-medium]

Sortie : assets/voix/<leçon>/<empreinte>.mp3 et assets/voix/index.json (liste des phrases enregistrées).
Le lecteur (assets/studio/studio.js) joue le fichier dont l'empreinte correspond au texte dit ; sinon il utilise la voix de l'appareil.
Les fichiers déjà présents sont conservés (seules les phrases nouvelles ou modifiées sont synthétisées) ; --refaire recommence tout.
Voir tools/voix/LISEZ-MOI.md pour l'installation (sherpa-onnx 1.12.40, modèles Piper français).
"""
import argparse, json, os, re, subprocess, sys, tempfile, wave
import numpy as np
import sherpa_onnx

def empreinte(t):  # identique à empreinte() de studio.js : FNV-1a 32 bits sur les unités UTF-16
    h = 0x811c9dc5
    b = t.encode('utf-16-le')
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 0x01000193) & 0xffffffff
    return '%08x' % h

SUB = {'₀': 'zéro', '₁': 'un', '₂': 'deux', '₃': 'trois', '₄': 'quatre', '₅': 'cinq', '₆': 'six', '₇': 'sept', '₈': 'huit', '₉': 'neuf'}
UNITES = [(r'°C', 'degrés Celsius'), (r'mA', 'milliampères'), (r'hPa', 'hectopascals'), (r'kg', 'kilogrammes'), (r'mL', 'millilitres'), (r'cm', 'centimètres'),
          (r'mm', 'millimètres'), (r'V', 'volts'), (r'A', 'ampères'), (r'g', 'grammes')]

def oral(t):
    """Ce qui est lu à voix haute (l'empreinte, elle, se calcule sur le texte d'origine) : unités, formules chimiques, symboles."""
    for sym, mot in UNITES:                      # « 6 V » → « 6 volts »
        t = re.sub(r'(\d)\s*' + sym + r'(?![A-Za-z])', r'\1 ' + mot, t)
    def formule(m):                               # « CO₂ » → « C O deux »
        sorties = []
        for sym, ind in re.findall(r'([A-Z][a-z]?)([₀-₉]*)', m.group(0)):
            sorties.append(' '.join(sym)); sorties += [SUB[c] for c in ind]
        return ' '.join(sorties)
    t = re.sub(r'\b(?:[A-Z][a-z]?[₀-₉]*){2,}\b|\b[A-Z][a-z]?[₀-₉]+', formule, t)
    return t.replace('×', ' fois ').replace('−', ' moins ').replace('→', ' donne ').replace('=', ' égale ').replace('%', ' pour cent')

PAUSE = {'.': 0.32, '!': 0.32, '?': 0.38, '…': 0.30}

def morceaux(texte):
    """Phrases + pause de fin (en s) : une respiration plus longue après un point qu'une virgule."""
    out = []
    for ph in re.split(r'(?<=[.!?…])\s+', oral(texte).strip()):
        if ph:
            out.append((ph, PAUSE.get(ph[-1], 0.2)))
    return out

def charger(modeles, voix):
    d = os.path.join(modeles, 'vits-piper-fr_FR-' + voix) + '/'
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=d + 'fr_FR-%s.onnx' % voix, tokens=d + 'tokens.txt',
                                                   data_dir=d + 'espeak-ng-data', length_scale=1.08),
        num_threads=4, provider='cpu'))
    return sherpa_onnx.OfflineTts(cfg)

def synthese(tts, texte, sid):
    sons, sr = [], None
    for ph, pause in morceaux(texte):
        a = tts.generate(ph, sid=sid, speed=1.0)
        if not len(a.samples):
            raise RuntimeError('synthèse vide pour : ' + ph)
        sr = a.sample_rate
        sons.append(np.array(a.samples, dtype=np.float32)); sons.append(np.zeros(int(sr * pause), dtype=np.float32))
    return np.concatenate([np.zeros(int(sr * 0.08), dtype=np.float32)] + sons), sr

def vers_mp3(samples, sr, chemin):
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        nom = f.name
    with wave.open(nom, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(samples, -1, 1) * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', nom, '-af', 'loudnorm=I=-19:LRA=7:TP=-2', '-ac', '1', '-ar', '24000',
                    '-c:a', 'libmp3lame', '-b:a', '40k', chemin], check=True)
    os.unlink(nom)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('phrases'); ap.add_argument('--modeles', required=True); ap.add_argument('--voix', default='siwis-medium')
    ap.add_argument('--sid', type=int, default=0); ap.add_argument('--refaire', action='store_true')
    ap.add_argument('--sortie', default=os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'voix'))
    a = ap.parse_args()
    sortie = os.path.abspath(a.sortie); os.makedirs(sortie, exist_ok=True)
    tts = charger(a.modeles, a.voix); lecons = json.load(open(a.phrases, encoding='utf-8')); neuf = 0
    for L in lecons:
        dossier = os.path.join(sortie, L['slug']); os.makedirs(dossier, exist_ok=True)
        for t in L['items']:
            clean = re.sub(r'<[^>]+>', '', t); f = os.path.join(dossier, empreinte(clean) + '.mp3')
            if os.path.exists(f) and not a.refaire:
                continue
            s, sr = synthese(tts, clean, a.sid); vers_mp3(s, sr, f); neuf += 1
        print(L['slug'], len(L['items']), 'phrases', flush=True)
    # manifeste : tout ce qui est présent sur le disque
    man = {}
    for slug in sorted(os.listdir(sortie)):
        d = os.path.join(sortie, slug)
        if os.path.isdir(d):
            man[slug] = sorted(x[:-4] for x in os.listdir(d) if x.endswith('.mp3'))
    json.dump({'voix': 'piper-fr_FR-' + a.voix, 's': man}, open(os.path.join(sortie, 'index.json'), 'w', encoding='utf-8'), separators=(',', ':'))
    print('nouveaux fichiers :', neuf)

if __name__ == '__main__':
    main()
