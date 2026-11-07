/* NohobaLab · 5e · DIL-02 · Des métaux différents.
   Modèle : allongements qualitatifs (NohobaDilatation5e.res2). Chauffage réalisé par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaDilatation5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · comparer des barres',idObs:'e-obs',placeholder:'J’observe que la barre…',
      intro:'Je choisis une barre et son état. Le chauffage est réalisé par le professeur : ici, je l’observe en simulation.',
      fiche:()=>window.FICHE_5E_DIL02,
      groupes:[{legende:'Barre',nom:'e-b',items:N.BARRES,def:'fer'},{legende:'État',nom:'e-s',items:N.ETATS2,def:'chaud'}],
      rendre:v=>{const r=N.res2(v['e-b'],v['e-s']);return {montage:N.montage2(r.b,r.s),schema:N.schema2(r.b,r.s),lecture:cap(r.txt),essai:{b:r.b,s:r.s,allong:r.allong}};}});
    function cap(t){return t.charAt(0).toUpperCase()+t.slice(1);}
  }
  const AL=['ne change pas','un peu','moyennement','beaucoup'];
  window.FICHE_5E_DIL02={
    id:'NL-5E-DIL-02',version:'0.9',modele:'solides-compares-v1',
    titre:'Tous les métaux se dilatent-ils pareil ?',niveau:'5e',
    theme:'Propriétés physiques de la matière',chapitre:'La dilatation des solides',
    competenceVisee:'Comparer la dilatation de solides de nature différente.',
    objectifsPedagogiques:['Chauffer des barres de même longueur de façon identique','Classer les barres d’après leur allongement','Conclure que la dilatation dépend de la nature du solide'],
    situationEvaluation:'Kofi doit tendre un fil électrique en plein soleil. Pourquoi laisse-t-il du jeu ? Justifie avec tes comparaisons.',
    objectif:'Comparer la dilatation de différents métaux.',
    objectifEleve:'Savoir classer des métaux d’après leur allongement.',
    situation:'À l’atelier, Awa a trois barres de même longueur : fer, cuivre, aluminium. Elle se demande si elles s’allongent pareil quand on les chauffe de la même façon.',
    materiel:'Barres de fer, de cuivre et d’aluminium, support, brûleur (manipulé par le professeur), simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['differents','Les trois métaux ne s’allongent pas pareil'],['identiques','Les trois métaux s’allongent exactement pareil'],['fer','Le fer s’allonge le plus'],['aucun','Aucun métal ne s’allonge']]},
    protocole:['Observer chaque barre à la température ambiante.','Le professeur chauffe chaque barre de la même façon.','Observer l’allongement de chaque barre.','Noter une observation par essai.'],
    variable:'La nature du métal',maintenu:'La longueur de départ et le chauffage',
    colonnes:['Barre','État','Allongement','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[M().res2(e.b,e.s).nom,e.s==='chaud'?'chauffée':'ambiante',AL[e.allong],e.observation||'—']),
    resume:e=>M().res2(e.b,e.s).nom+' '+(e.s==='chaud'?'chauffée':'ambiante')+' : '+AL[e.allong],
    confrontation:'1. Les trois barres s’allongent-elles ? 2. Classe-les du plus petit au plus grand allongement. 3. La dilatation est-elle la même pour tous ? Compare à ton hypothèse.',
    retroaction:'Cite deux métaux et dis lequel s’allonge le plus.',
    transfert:{q:'Un fil électrique en cuivre est tendu entre deux poteaux. Pourquoi laisse-t-on du jeu ?',rep:'jeu',options:[['jeu','Le fil s’allonge quand il chauffe, il faut lui laisser de la place'],['rien','Un fil ne change jamais de longueur'],['raccourcit','Le fil rétrécit au soleil'],['poids','Pour qu’il soit plus lourd']],expl:'Un solide chauffé se dilate : le fil s’allonge au soleil. Trop tendu, il risquerait de se rompre au refroidissement.'},
    critere:'Chauffer les trois métaux et les classer d’après leur allongement.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne compare pas les barres.'],['MF','Constate l’allongement sans classer les métaux.'],['MS','Classe les métaux d’après leur allongement.'],['TBM','Classe, conclut que la dilatation dépend de la nature du solide et applique au fil électrique.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=4&&['fer','cuivre','alu'].every(b=>v.some(e=>e.b===b&&e.s==='chaud'));},
    aides:['Compare la fin de chaque barre au trait de départ.','Chauffe les trois barres de la même façon.','As-tu chauffé le fer, le cuivre et l’aluminium ?'],
    synthese:'Tous les solides se dilatent quand on les chauffe, mais pas autant : la dilatation dépend de la nature du solide. Pour un même échauffement, l’aluminium s’allonge plus que le cuivre, et le cuivre plus que le fer.',
    prof:{reference:'Même chauffage : fer allongement le plus petit, cuivre moyen, aluminium le plus grand. Classement qualitatif ; aucune valeur de coefficient. Chauffage réalisé par le professeur uniquement.',attendus:['Hypothèse notée avant les essais.','Trois métaux chauffés et classés.','Phrase : la dilatation dépend de la nature du solide.'],erreurs:['Croire que tous les métaux se dilatent pareil.','Chauffer plus un métal que l’autre.','Confondre longueur finale et allongement.']},
    diagnostic:st=>E().valides(st).some(e=>e.s==='chaud')?['Compare l’allongement de ce métal à celui des autres.']:['Chauffe une barre pour la comparer.']
  };
})();
