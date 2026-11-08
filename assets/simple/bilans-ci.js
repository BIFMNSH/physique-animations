/* NohobaLab · 6e Côte d'Ivoire · bilans de leçon « L'essentiel » (lot Mesure de grandeurs physiques).
   Textes et schémas originaux. Un bilan ne remplace pas la conclusion que l'élève rédige dans chaque fiche.
   Chaque élément renvoie à sa fiche par son titre (aucun code interne affiché). Les schémas utilisent les dessins du lot (mesures-dessins.js). */
(function(){
  'use strict';
  var B={};
  function Dm(){return window.NohobaMesures.dessin;}
  function T(x,y,t,s,c,w){return window.NohobaAtelier.T(x,y,t,s||12,c||'#243049',w||700);}

  B.volume={
    slug:'volume',lecon:'Volume d’un liquide et d’un solide',theme:'Mesure de grandeurs physiques',
    savoir:[
      ['Le volume d’un corps est la place qu’il occupe. Son unité internationale est le mètre cube (m³) ; on utilise aussi le dm³, le cm³ et le mm³.','01'],
      ['La capacité d’un récipient est le volume de liquide qu’il peut contenir. Elle s’exprime en litres (L), et en kL, hL, daL, dL, cL, mL.','01'],
      ['1 L = 1 dm³ ; 1 mL = 1 cm³ ; 1 m³ = 1 000 L.','01'],
      ['La forme d’un solide ne change pas son volume.','03']
    ],
    faire:[
      ['Lire le volume d’un liquide',['Poser l’éprouvette sur un plan horizontal.','Trouver la valeur d’une division.','Placer l’œil à la hauteur du bas du ménisque.','Écrire le volume avec son unité.'],'02'],
      ['Mesurer le volume d’un solide par déplacement d’eau',['Lire V₁.','Faire glisser le solide le long de la paroi.','Lire V₂ quand il est entièrement immergé.','Calculer V = V₂ − V₁ (solide insoluble, qui coule).'],'03'],
      ['Calculer le volume d’un solide de forme simple',['Cube : V = a × a × a.','Pavé : V = L × ℓ × h.','Cylindre : V = 3,14 × r × r × h, avec r = diamètre ÷ 2.','Toutes les longueurs dans la même unité.'],'04']
    ],
    conversions:['1 m³ = 1 000 dm³ = 1 000 L','1 dm³ = 1 000 cm³ = 1 L','1 L = 10 dL = 100 cL = 1 000 mL','1 cm³ = 1 mL = 1 000 mm³'],
    mots:['volume','capacité','éprouvette graduée','division','ménisque','déplacement d’eau'],
    verifie:[
      ['Quelle est l’unité internationale de volume ?','Le mètre cube (m³).'],
      ['2,5 L = … mL ?','2 500 mL.'],
      ['Où place-t-on l’œil pour lire une éprouvette ?','À la hauteur du bas du ménisque.'],
      ['V₁ = 30 mL et V₂ = 42 mL : quel est le volume du solide ?','V = 42 − 30 = 12 mL, soit 12 cm³.'],
      ['Quel est le volume d’un pavé de 5 cm × 2 cm × 3 cm ?','V = 5 × 2 × 3 = 30 cm³.']
    ],
    image:function(){
      var D=Dm(),m='montage',s=D.sol(m,236);
      var a=D.eprouvette(80,236,{id:'A',V:64,mode:m,H:158}),b=D.eprouvette(230,236,{id:'A',V:62,mode:m,H:158});
      s+=a.svg+b.svg+'<path d="M218 222 L216 208 L226 198 L240 202 L243 216 L238 222 Z" fill="#8E949D" stroke="#243049" stroke-width="2"/>';
      s+='<path d="M330 236 V206 Q330 198 338 198 H452 Q460 198 460 206 V236" fill="rgba(190,220,245,.28)" stroke="#243049" stroke-width="2"/><rect x="332" y="208" width="126" height="26" fill="#5BA8E0" opacity=".7"/>';
      s+='<path d="M378 214 V40 H412 V214" fill="none" stroke="#243049" stroke-width="2.5"/><rect x="380" y="140" width="30" height="72" fill="#5BA8E0" opacity=".7"/>'+[0,1,2,3,4].map(function(k){return '<line x1="412" y1="'+(60+k*20)+'" x2="402" y2="'+(60+k*20)+'" stroke="#243049" stroke-width="1.4"/>';}).join('');
      s+='<path d="M300 150 Q340 160 360 200 L392 224" fill="none" stroke="#E8A02A" stroke-width="5" stroke-linecap="round"/>';
      s+=T(80,18,'un liquide',13)+T(230,18,'un solide : V₂ − V₁',13)+T(395,18,'un gaz, sur l’eau',13);
      return D.vue(s,'Schéma de synthèse : trois éprouvettes graduées, pour un liquide, pour un solide plongé dans l’eau, pour un gaz recueilli sur l’eau','0 0 470 250');
    }
  };

  B.masse={
    slug:'masse',lecon:'Masse d’un solide et d’un liquide',theme:'Mesure de grandeurs physiques',
    savoir:[
      ['La masse d’un corps se mesure avec une balance. Son unité internationale est le kilogramme (kg) ; on utilise aussi t, q, hg, dag, g, dg, cg, mg.','05'],
      ['La masse ne change pas quand on déforme ou découpe un corps sans rien perdre.','05'],
      ['Simple pesée : à l’équilibre, la masse de l’objet est égale à la somme des masses marquées.','07'],
      ['Double pesée : m = m₂ − m₁ ; le résultat reste juste même si la balance est déréglée.','09'],
      ['Chaque balance a une portée (masse maximale) et une précision : on la choisit selon ce que l’on pèse.','10'],
      ['Pour une même matière, la masse et le volume sont proportionnels.','11']
    ],
    faire:[
      ['Peser un solide par simple pesée',['Vérifier l’équilibre à vide.','Poser l’objet sur un plateau.','Poser les masses marquées, de la plus grande à la plus petite, avec la pince.','À l’équilibre, additionner les masses : résultat, unité, précision.'],'07'],
      ['Trouver la masse d’un liquide',['Peser le récipient vide : m₁.','Peser le récipient avec le liquide : m₂.','Calculer m = m₂ − m₁.','Ou bien : poser le récipient, appuyer sur « tare », verser et lire.'],'08'],
      ['Faire une double pesée',['Équilibre 1 : l’objet et des masses m₁ face à une tare.','Équilibre 2 : des masses seules m₂ face à la même tare.','Calculer m = m₂ − m₁.'],'09'],
      ['Prévoir une masse',['Pour une même matière, chercher le coefficient qui multiplie la quantité.','Multiplier la masse par le même coefficient (tableau de proportionnalité).'],'11']
    ],
    conversions:['1 t = 10 q = 1 000 kg','1 q = 100 kg','1 kg = 10 hg = 100 dag = 1 000 g','1 g = 10 dg = 100 cg = 1 000 mg'],
    mots:['masse','balance de Roberval','masses marquées','équilibre','tare','portée','précision'],
    verifie:[
      ['3 kg = … g ?','3 000 g.'],
      ['À l’équilibre, le plateau des masses porte 100 g, 20 g et 5 g. Quelle est la masse de l’objet ?','100 + 20 + 5 = 125 g.'],
      ['Un bécher vide a une masse de 80 g ; avec de l’eau, 230 g. Quelle est la masse de l’eau ?','m = 230 − 80 = 150 g.'],
      ['Pourquoi la double pesée reste-t-elle juste sur une balance déréglée ?','Face à la même tare, les masses marquées prennent exactement la place de l’objet.'],
      ['Un jeton de laiton a une masse de 51 g. Quelle est la masse de 4 jetons identiques ?','Même matière : 51 × 4 = 204 g.']
    ],
    image:function(){
      var D=Dm(),m='montage',s='',A=window.NohobaAtelier;
      /* 1. la balance de Roberval à l'équilibre */
      s+='<g transform="translate(-26 4) scale(.56)">'+D.sol(m,250,60,400)+D.roberval(230,250,{penche:'aucun',gauche:['bois'],droite:[],masses:[100,20,10,5,2],cote:'droite',mode:m})+'</g>'+T(92,176,'Simple pesée : équilibre',12)+T(92,194,'bois = 100 + 20 + 10 + 5 + 2',11,'#243049',400)+T(92,210,'= 137 g',11,'#243049',700);
      /* 2. la pesée d'un liquide avec la tare, en quatre étapes */
      var et=[['0 g',[]],['74 g',['becher_vide']],['0 g',['becher_vide']],['103 g',['becher_eau']]],lab=['plateau vide','bécher posé','« tare »','lait versé'];
      et.forEach(function(e,k){var cx=208+(k%2)*66,cy=24+Math.floor(k/2)*86;s+='<g transform="translate('+(cx-20)+' '+(cy-26)+') scale(.34)">'+D.electronique(140,212,e[0],e[1],m)+'</g>'+'<circle cx="'+(cx-10)+'" cy="'+(cy+4)+'" r="8" fill="#C2410C"/>'+A.T(cx-10,cy+8,String(k+1),10,'#fff',800)+T(cx+28,cy+62,lab[k],10,'#243049',700);});
      s+=T(275,194,'Liquide : la tare',12)+T(275,210,'remet l’écran à zéro',11,'#243049',400);
      /* 3. même matière : volume × 2, masse × 2 */
      s+='<circle cx="410" cy="56" r="17" fill="#4FA37A" stroke="#243049" stroke-width="2"/>'+T(410,92,'V et m',11);
      s+='<circle cx="392" cy="134" r="17" fill="#4FA37A" stroke="#243049" stroke-width="2"/><circle cx="428" cy="134" r="17" fill="#4FA37A" stroke="#243049" stroke-width="2"/>'+T(410,170,'2 × V et 2 × m',11);
      s+=D.fleche(410,100,410,112,'#243049',2)+T(410,194,'Même matière :',12)+T(410,210,'proportionnels',11,'#243049',400);
      s+='<line x1="186" y1="20" x2="186" y2="214" stroke="#CBD4E1" stroke-width="1.5"/><line x1="358" y1="20" x2="358" y2="214" stroke="#CBD4E1" stroke-width="1.5"/>';
      return D.vue(s,'Schéma de synthèse : balance de Roberval à l’équilibre ; pesée d’un liquide avec la tare en quatre étapes ; une boule puis deux boules identiques, volume et masse multipliés par deux','0 0 470 222');
    }
  };
  window.NohobaBilansCI=B;
})();
