# Travailler en local sur le PC

1. Installer Git, Node.js 20+ et Claude Code (https://claude.com/claude-code).
2. Cloner : `git clone https://github.com/BIFMNSH/physique-animations.git NOHOBA-Lab` puis `cd NOHOBA-Lab`.
3. Branche de la collection CI : `git checkout feat/catalogues-france-ci-investigation`.
4. Tests : `cd qa && npm install && npm test`.
5. Voir le site : `python3 -m http.server 8000` à la racine, puis http://localhost:8000/activites-ci/?a=NL-CI-6E-ELE-02.
6. Lancer `claude` à la racine : `CLAUDE.md` et les skills de `.claude/skills/` sont chargés automatiquement.
7. Un lot = une conversation. Toujours travailler sur la branche, jamais sur `main`.
