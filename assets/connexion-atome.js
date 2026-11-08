/* Atome interactif de la page de connexion (décoratif). Rien n'est envoyé ni stocké. */
(function(){
  'use strict';
  var svg=document.getElementById('atome');if(!svg)return;
  var reduit=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS='http://www.w3.org/2000/svg',cx=200,cy=200,rx=165,ry=58;
  var gO=svg.querySelector('#atOrb'),gN=svg.querySelector('#atNoy');
  var cols=['#5CC8FF','#FFB547','#7CE3A1'];
  var elec=[];
  [0,60,120].forEach(function(ang,i){
    var e=document.createElementNS(NS,'ellipse');
    e.setAttribute('cx',cx);e.setAttribute('cy',cy);e.setAttribute('rx',rx);e.setAttribute('ry',ry);
    e.setAttribute('transform','rotate('+ang+' '+cx+' '+cy+')');e.setAttribute('class','orb');gO.appendChild(e);
    for(var k=0;k<(i===0?2:1)+1;k++){
      var c=document.createElementNS(NS,'circle');c.setAttribute('r',7);c.setAttribute('fill',cols[i]);c.setAttribute('class','el');
      gO.appendChild(c);elec.push({c:c,a:ang*Math.PI/180,t:Math.random()*6.28+k*3.14,v:(0.55+i*0.12)*(k?-1:1)});
    }
  });
  /* noyau : protons rouges, neutrons gris (CPK) */
  [[-9,-6,'#E5484D'],[8,-9,'#9AA5B5'],[-2,8,'#E5484D'],[11,5,'#9AA5B5'],[-13,6,'#9AA5B5'],[2,-1,'#E5484D']].forEach(function(p){
    var c=document.createElementNS(NS,'circle');c.setAttribute('cx',cx+p[0]);c.setAttribute('cy',cy+p[1]);c.setAttribute('r',10);c.setAttribute('fill',p[2]);gN.appendChild(c);
  });
  var boost=1,cible=1,px=0,py=0,tx=0,ty=0,last=0,pulse=0;
  function place(){
    elec.forEach(function(o){
      var x=rx*Math.cos(o.t),y=ry*Math.sin(o.t),ca=Math.cos(o.a),sa=Math.sin(o.a);
      o.c.setAttribute('cx',(cx+x*ca-y*sa).toFixed(1));o.c.setAttribute('cy',(cy+x*sa+y*ca).toFixed(1));
    });
  }
  function frame(ts){
    var dt=Math.min(.05,(ts-last)/1000||0);last=ts;
    boost+=(cible-boost)*Math.min(1,dt*4);px+=(tx-px)*Math.min(1,dt*5);py+=(ty-py)*Math.min(1,dt*5);
    elec.forEach(function(o){o.t+=o.v*dt*boost;});place();
    pulse=Math.max(0,pulse-dt*1.4);
    svg.style.transform='perspective(900px) rotateX('+(py*-9).toFixed(2)+'deg) rotateY('+(px*11).toFixed(2)+'deg)';
    svg.style.setProperty('--pulse',pulse.toFixed(3));
    requestAnimationFrame(frame);
  }
  place();
  window.NLAtome={pulse:function(){pulse=1;cible=1;boost=7;setTimeout(function(){boost=1;},900);},ecoute:function(on){cible=on?2.6:1;}};
  if(reduit)return;
  window.addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;},{passive:true});
  var tm;document.addEventListener('input',function(){cible=3;clearTimeout(tm);tm=setTimeout(function(){cible=1;},900);});
  document.addEventListener('visibilitychange',function(){last=performance.now();});
  requestAnimationFrame(frame);
  /* succès : le compte s'affiche */
  var vc=document.getElementById('vCompte');
  if(vc&&window.MutationObserver)new MutationObserver(function(){if(!vc.hidden)window.NLAtome.pulse();}).observe(vc,{attributes:true,attributeFilter:['hidden']});
})();
