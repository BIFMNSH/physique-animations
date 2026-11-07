# Voix off neuronale des résumés animés

Le lecteur (`assets/studio/studio.js`) joue d'abord un fichier mp3 enregistré (`assets/voix/<leçon>/<empreinte>.mp3`).
S'il n'existe pas (leçon pas encore générée, texte modifié depuis) ou si la lecture échoue, il retombe sur la voix de l'appareil.
L'empreinte est un FNV-1a 32 bits du texte dit : corriger un texte de leçon désactive l'ancien fichier jusqu'à la prochaine génération.

## Générer ou mettre à jour
Prérequis : Python 3.10+, `ffmpeg` (libmp3lame), `pip install sherpa-onnx==1.12.40 numpy` (les versions 2.x ne lisent pas le phonémiseur Piper).
Modèles Piper français (voix `siwis-medium`, `tom-medium`, `upmc-medium`) : archives `vits-piper-fr_FR-<voix>.tar.bz2` de la
page « tts-models » des publications de https://github.com/k2-fsa/sherpa-onnx, à extraire dans un dossier `modeles/`.

    node tools/voix/extraire.cjs 5e > /tmp/phrases.json      # niveau (5e, 6e, 4e, 3e), slug de leçon ou « tout »
    python3 tools/voix/generer.py /tmp/phrases.json --modeles modeles --voix siwis-medium

- Seules les phrases nouvelles ou modifiées sont synthétisées ; `--refaire` recommence tout (à utiliser pour changer de voix).
- Le script écrit aussi `assets/voix/index.json`, la liste des phrases enregistrées (le lecteur n'appelle que celles-là).
- Poids : environ 30 à 40 Ko par phrase pour les 13 leçons de 5e (voir `du -sh assets/voix`).
- Lecture à voix haute : unités (« 6 V » → « six volts »), formules (CO₂ → « C O deux ») et symboles sont remplacés dans `generer.py` (fonction `oral`), sans changer le texte affiché ni l'empreinte.

## Licence
Voix en service : `siwis-medium` (base SIWIS, CC BY 4.0) ; attribution dans `credits/index.html`. Les voix `tom-medium` (AGPLv3) et `upmc-medium` ne sont pas utilisées : vérifier la licence de toute voix avant de la publier.
