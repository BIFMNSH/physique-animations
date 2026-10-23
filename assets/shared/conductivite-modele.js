/* Modèle qualitatif commun aux leçons Studio et aux activités d'investigation.
   Pas de calcul d'intensité : un montage fermé, alimenté et un conducteur
   suffisant sont nécessaires pour allumer la lampe. */
(function(){
'use strict';
var MATERIALS={
 cuivre:{nom:'Cuivre',conducteur:true,couleur:'#bd7438'},
 acier:{nom:'Acier',conducteur:true,couleur:'#8896a5'},
 aluminium:{nom:'Aluminium',conducteur:true,couleur:'#bec9d6'},
 plastique:{nom:'Plastique',conducteur:false,couleur:'#6bb6e7'},
 bois:{nom:'Bois sec',conducteur:false,couleur:'#b38b56'},
 graphite:{nom:'Graphite (mine de crayon)',conducteur:true,couleur:'#3a3f47'},
 mine:{nom:'Mine de crayon',conducteur:true,couleur:'#3a3f47'},
 clou:{nom:'Clou en fer',conducteur:true,couleur:'#8896a5'},
 cle:{nom:'Clé',conducteur:true,couleur:'#f2b24c'},
 piece:{nom:'Pièce de monnaie',conducteur:true,couleur:'#f7c948'},
 couteau:{nom:'Couteau',conducteur:true,couleur:'#d3d7dd'},
 fourchette:{nom:'Fourchette',conducteur:true,couleur:'#c9ced5'},
 regle:{nom:'Règle en plastique',conducteur:false,couleur:'#6bb6e7'},
 gomme:{nom:'Gomme',conducteur:false,couleur:'#5bb5f0'},
 verre:{nom:'Tube en verre',conducteur:false,couleur:'#dff0f7'},
 air:{nom:'Air (espace vide)',conducteur:false,couleur:'#dbe7f5'}
};
function evaluate(o){
 var p=o||{},m=MATERIALS[p.id]||null;
 var control=p.contact!==false&&p.pile!==false;
 return {valide:control,allumee:!!(m&&m.conducteur&&control),conducteur:m?m.conducteur:null,materiau:m?m.nom:'Matériau inconnu'};
}
window.NohobaConductivite=Object.freeze({materiaux:Object.freeze(MATERIALS),evaluer:evaluate});
})();