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
 bois:{nom:'Bois sec',conducteur:false,couleur:'#b38b56'}
};
function evaluate(o){
 var p=o||{},m=MATERIALS[p.id]||null;
 var control=p.contact!==false&&p.pile!==false;
 return {valide:control,allumee:!!(m&&m.conducteur&&control),conducteur:m?m.conducteur:null,materiau:m?m.nom:'Matériau inconnu'};
}
window.NohobaConductivite=Object.freeze({materiaux:Object.freeze(MATERIALS),evaluer:evaluate});
})();