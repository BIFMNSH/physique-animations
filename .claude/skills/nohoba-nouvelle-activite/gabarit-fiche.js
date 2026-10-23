/* NohobaLab · 6e Côte d'Ivoire · <THÈME>-<nn> · <titre>.
   Modèle qualitatif : décrire en une phrase la règle de la simulation et ses limites. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const CHOIX=[['a','Option A'],['b','Option B']];
  const nom=id=>(CHOIX.filter(x=>x[0]===id)[0]||['',id])[1];
  function regle(a,b){return a!==b;} /* règle physique de la simulation */
  function dessin(a,b){const A=window.NohobaAtelier;return A.svg(A.pile45(30,96,.9)+A.lampe(360,100,regle(a,b),1),'0 0 460 250','Montage : '+(regle(a,b)?'la lampe brille':'la lampe est éteinte'));}
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier · titre de la manipulation'},sec);
    h('p',{text:'Consigne courte pour l’élève.'},sec);
    const fig=A.paire(sec,h);
    const f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,'Je choisis…');
    CHOIX.forEach((c,i)=>h('label',{class:'opt',style:'flex:1 1 200px;margin:0'},f,'<input type="radio" name="g-a" value="'+c[0]+'"'+(i===0?' checked':'')+'><span>'+esc(c[1])+'</span>'));
    const S=A.saisie(sec,h,'g-obs','J’observe que…');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);const table=h('div',{},res);
    const val=()=>sec.querySelector('input[name=g-a]:checked').value;
    function maj(){const a=val(),on=regle(a,'b');fig.montage(dessin(a,'b'));fig.schema(A.schema({cotes:{droite:'lampe',bas:on?'fil':'vide'},legende:on?'Boucle fermée':'Boucle ouverte',label:'Schéma normalisé'}));S.out.textContent=nom(a)+' : lampe '+(on?'allumée':'éteinte')+'.';}
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_GABARIT,window.FICHE_CI_GABARIT.lignes(st),'Mes essais.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}const a=val();X.addEssai({choix:a,allumee:regle(a,'b'),observation:S.note()});paint();S.msg.textContent='Observation enregistrée.';S.vide();};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();
  }
  window.FICHE_CI_GABARIT={
    id:'NL-CI-6E-XXX-00',version:'0.9',modele:'nom-du-modele-v1',
    titre:'Titre de l’activité',niveau:'6e',theme:'Thème',chapitre:'Chapitre',
    competenceVisee:'Une seule compétence observable.',
    objectifsPedagogiques:['Capacité 1','Capacité 2','Capacité 3'],
    situationEvaluation:'Situation d’évaluation contextualisée (Côte d’Ivoire).',
    objectif:'Objectif en une phrase.',objectifEleve:'Objectif en « je ».',
    situation:'Situation-problème contextualisée avec Awa ou Kofi.',
    materiel:'Matériel fictif de la simulation.',
    prevision:{consigne:'Avant les essais, choisis… Justifie ton hypothèse.',choix:[['juste','Hypothèse juste'],['faux1','Hypothèse fausse 1'],['faux2','Hypothèse fausse 2'],['faux3','Hypothèse fausse 3']]},
    protocole:['Étape 1.','Étape 2.','Étape 3.'],
    variable:'La grandeur qui change',maintenu:'Ce qui reste identique',
    colonnes:['Choix','Lampe','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[nom(e.choix),e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>nom(e.choix)+' : lampe '+(e.allumee?'allumée':'éteinte'),
    confrontation:'1. … 2. … 3. … Compare ensuite à ton hypothèse.',
    retroaction:'Cite un résultat précis.',
    transfert:{q:'Question de transfert.',rep:'non',expl:'Explication.'},
    critere:'Critère de réussite observable.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','…'],['MF','…'],['MS','…'],['TBM','…']],
    peutConfronter:st=>{const v=st.essais.filter(e=>typeof e.observation==='string'&&e.observation.trim().length>=10);return v.length>=3&&v.some(e=>e.allumee)&&v.some(e=>!e.allumee);},
    aides:['Aide 1.','Aide 2.','Aide 3.'],
    synthese:'Synthèse scientifique.',
    prof:{reference:'Résultat attendu.',attendus:['Attendu 1.','Attendu 2.'],erreurs:['Erreur fréquente 1.','Erreur fréquente 2.']},
    diagnostic:st=>st.essais.length?['Indicatif.']:['Fais un premier essai.']
  };
})();
