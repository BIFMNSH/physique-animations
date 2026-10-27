/* NohobaLab · 6e Côte d'Ivoire · ENE-09 · Choisir une installation de production d'électricité. « Pour aller plus loin », hors programme officiel.
   Les trois écoles A, B, C sont des SCÉNARIOS fictifs. Seuls deux repères sont réels, datés et sourcés (voir la zone « Documents »). Rien n'est inventé. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const INST=[['solaire','Panneaux solaires'],['eolienne','Éolienne'],['gaz','Groupe électrogène à gaz']];
  const LIEUX=[['A','École A : soleil toute l’année, vent faible, grande cour, aucun gaz livré'],['B','École B : colline très ventée, grande cour, soleil moyen, gaz non disponible'],['C','École C : en ville, toit très petit, réseau de gaz à côté, bruit gênant']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    const h=window.Activite.h,N=NE();
    const d=h('div',{class:'card'},panel);h('h3',{text:'Documents'},d);
    h('p',{},d,'<b>Les trois écoles sont imaginées pour l’exercice</b> (scénarios fictifs). Deux repères réels, pour t’aider à réfléchir :');
    const ul=h('ul',{},d);
    N.REPERES.forEach(r=>{const li=h('li',{},ul,'');li.appendChild(document.createTextNode(r.texte+' '));const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Source : '+r.source;li.appendChild(a);});
    h('p',{class:'msg',role:'note'},d,'<b>Attention.</b> « N’émet pas de gaz en fonctionnant » ne veut pas dire « n’a aucun impact » : fabriquer et installer le matériel a aussi un impact. Le vent local est à mesurer sur place : ici, il est donné par le scénario.');
    M().bloc(panel,X,{n:9,titre:'Atelier · je teste une installation dans une école',
      intro:'Je choisis une école et une installation. Je regarde le montage, le schéma, la chaîne énergétique (dessin séparé) et le verdict du scénario.',
      controles:[{cle:'l',legende:'L’école',items:LIEUX},{cle:'i',legende:'L’installation',items:INST}],
      saisie:'J’observe que cette installation… dans cette école…',legendeTable:'Mes essais : école, installation et verdict.',F:()=>window.FICHE_CI_ENE09,
      extra:true,
      render:v=>{const r=N.installation(v.l,v.i),sc=N.sceneInstallation(v.i);return {montage:sc.montage,schema:sc.schema,extra:sc.extra,txt:(r.adaptee?'Adaptée. ':'Peu adaptée. ')+r.txt+' Elle '+r.emet+'. '+r.precision,essai:{lieu:v.l,inst:v.i,adaptee:r.adaptee,renouvelable:r.renouvelable}};}});
  }
  window.FICHE_CI_ENE09={
    id:'NL-CI-6E-ENE-09',version:'0.9',modele:'choix-installation-qualitatif-v1',
    titre:'Choisir une installation de production d’électricité',niveau:'6e',
    theme:'Énergie',chapitre:'Produire de l’énergie électrique',
    competenceVisee:'Justifier le choix d’une installation pour un lieu donné.',
    objectifsPedagogiques:['Relier une installation à la ressource qu’elle utilise','Choisir une installation en fonction du lieu et de critères','Dire qu’aucune solution n’est parfaite'],
    situationEvaluation:'Le directeur de l’école C veut un groupe électrogène à gaz parce que « le gaz est tout près ». Donne un argument pour et un argument contre.',
    objectif:'Justifier un choix d’installation à partir de critères.',objectifEleve:'Savoir choisir et argumenter.',
    situation:'Trois écoles de Côte d’Ivoire (imaginées) doivent choisir comment produire de l’électricité : panneaux solaires, éolienne ou groupe électrogène à gaz. Les élèves comparent les trois solutions pour chaque lieu.',
    materiel:'Simulation : trois écoles (scénarios fictifs), trois installations ; deux repères réels sourcés.',
    prevision:{consigne:'Avant de tester, choisis la meilleure installation pour l’école A (soleil toute l’année, vent faible, aucun gaz). Justifie ton hypothèse.',choix:[['solaire','Les panneaux solaires'],['eolienne','L’éolienne'],['gaz','Le groupe électrogène à gaz'],['aucune','Aucune : il n’y a pas de solution']]},
    protocole:['Lire les documents et le portrait de l’école.','Choisir une école puis une installation.','Lire le verdict : ressource, place, bruit, émissions.','Tester les trois installations pour au moins deux écoles, puis justifier.'],
    variable:'L’installation (ou l’école)',maintenu:'L’autre choix',
    colonnes:['École','Installation','Verdict','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>['École '+e.lieu,lib(INST,e.inst),e.adaptee?'Adaptée':'Peu adaptée',e.observation||'—']),
    resume:e=>'école '+e.lieu+', '+lib(INST,e.inst).toLowerCase()+' : '+(e.adaptee?'adaptée':'peu adaptée'),
    confrontation:'1. Quelle installation convient à chaque école ? 2. Pourquoi ? 3. Une solution est-elle parfaite ? Quels inconvénients restent ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une école, une installation et deux critères qui justifient ton choix.',
    transfert:{q:'Un groupe électrogène à gaz est-il une solution parfaite pour l’école C ?',rep:'non',expl:'Non : il fonctionne bien là où le gaz est disponible, mais il est bruyant, il brûle une ressource non renouvelable et émet du gaz en fonctionnant. Une solution parfaite n’existe pas : le choix dépend du lieu et des critères.'},
    critere:'Justifier le choix d’une installation pour une école avec deux critères.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Choisit sans critère.'],['MF','Choisit avec un seul critère.'],['MS','Choisit avec deux critères et cite les limites.'],['TBM','Compare plusieurs écoles et dit qu’aucune solution n’est parfaite.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=4&&M().distincts(v,'inst')>=3&&M().distincts(v,'lieu')>=2;},
    aides:['Pour chaque école, la ressource est-elle disponible ?','Regarde aussi la place, le bruit et les émissions.','Aucune solution n’est parfaite : cherche les inconvénients.'],
    synthese:'Le bon choix dépend du lieu : le soleil pour une école ensoleillée, l’éolienne pour une colline ventée, le gaz seulement s’il est disponible. Chaque solution a des limites ; une solution parfaite n’existe pas.',
    prof:{reference:'École A : solaire. École B : éolienne. École C : gaz possible mais bruyant et non renouvelable. Les écoles sont des scénarios ; seuls deux repères sont réels (voir Documents).',attendus:['Tester les trois installations pour au moins deux écoles.','Justifier par deux critères.'],erreurs:['Croire qu’une énergie renouvelable n’a aucun impact.','Dire « il n’y a pas de vent en Côte d’Ivoire » : le vent dépend du lieu et se mesure sur place.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste les trois installations pour deux écoles.']:['Fais un premier essai.']
  };
})();
