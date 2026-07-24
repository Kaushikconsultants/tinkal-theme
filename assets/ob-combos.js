/* Ombre Bliss — combos page. Ladders/combos are brand content; variants/images
   come from window.OB_CMB. Add-box/combo -> clear cart + clear codes + add + apply tier code. */
(function(){
'use strict';
var OB = window.OB_CMB || {};
var ROOT = document.querySelector('.obcmb');
if(!ROOT) return;
var $=function(i){return document.getElementById(i);};
var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN');};

var LINES = {
  cou100:{ label:'Couture 100ml', sub:'Full size · our strongest', unit:1499, mrp:1999, max:10, code:'OBC100Q', size:'100', pool:'cou',
           px:[0,1499,2549,2999,3799,4649,5449,6249,6999,7749,8449] },
  cou25 :{ label:'Couture 25ml',  sub:'Travel size · same juice',  unit:499,  mrp:599,  max:10, code:'OBC25Q', size:'25', pool:'cou',
           px:[0,499,899,1249,1599,1899,2199,2499,2749,2999,3199] },
  cla100:{ label:'Classic 100ml', sub:'Full size · lighter, everyday', unit:699, mrp:1199, max:8, code:'OBCLA100Q', size:'100', pool:'cla',
           px:[0,699,1299,1799,2249,2699,3099,3449,3799] }
};
var SC = [
 {id:'smoky',n:'Smoky Rum',c:'#8C3A1E',f:'Smoky'},{id:'oud',n:'Nawab Oud',c:'#6B2237',f:'Oud'},
 {id:'leather',n:'Classic Leather',c:'#5B4636',f:'Leather'},{id:'blu',n:'Ombre Blu',c:'#2C5A8C',f:'Fresh'},
 {id:'tobacco',n:'Royale Tobacco',c:'#7A4A1F',f:'Spicy'},{id:'vanilla',n:'Vanilla Kiss',c:'#B98A4E',f:'Gourmand'},
 {id:'amberrose',n:'Amber Rose',c:'#A8546A',f:'Floral'},{id:'angel',n:'Angel',c:'#7A6BA8',f:'Gourmand'},
 {id:'pistachio',n:'Pistachio Pop',c:'#6E8F4E',f:'Gourmand'},{id:'candy',n:'Lush Candy',c:'#C4527D',f:'Gourmand'},
 {id:'marino',n:'Marino',c:'#3E7A9E',f:'Fresh',cla:true},{id:'vicious',n:'Vicious',c:'#43342E',f:'Oud',cla:true},
 {id:'yakuza',n:'Yakuza',c:'#6B5230',f:'Oud',cla:true},{id:'honour',n:'Honour',c:'#8A7A4E',f:'Woody',cla:true},
 {id:'bouquet',n:'The Bouquet',c:'#C77B93',f:'Floral',cla:true},{id:'obsessed',n:'Obsessed',c:'#9B5B5B',f:'Floral',cla:true},
 {id:'luna',n:'Luna',c:'#C29A6B',f:'Gourmand',cla:true},{id:'pierce',n:'Pierce',c:'#7E9B86',f:'Fresh',cla:true}
];
SC.forEach(function(s){ var r=(OB.variants||{})[s.id]||{}; s.v100=r.v100; s.v25=r.v25; s.img=r.img; });
var COMBOS = [
 {t:'Layering',n:'Rum & Cream',f:'96% match · our best pair',line:'cou25',ids:['smoky','vanilla'],d:'Smoky Rum lays down tobacco and rum. Vanilla Kiss pours cream over it. The smoke turns to dessert.',how:'Two sprays Smoky Rum · wait 30 seconds · one spray Vanilla Kiss'},
 {t:'Layering',n:'Oud Rose',f:'95% match · the classic',line:'cou25',ids:['oud','amberrose'],d:'The pairing perfumery was built on. Nawab Oud gives the depth, Amber Rose gives the bloom.',how:'Two sprays Nawab Oud · wait 30 seconds · one spray Amber Rose'},
 {t:'Layering',n:'The Cigar Lounge',f:'93% match · for cold nights',line:'cou25',ids:['tobacco','vanilla'],d:'Cinnamon and pipe tobacco softened with brown sugar. If Royale Tobacco feels too dry alone, this fixes it.',how:'Two sprays Royale Tobacco · wait 30 seconds · one spray Vanilla Kiss'},
 {t:'Personality',n:'The Showstopper',f:'Never underdressed',line:'cou100',ids:['oud','angel','tobacco'],d:'Nawab Oud, Angel and Royale Tobacco — our three loudest, boxed together.'},
 {t:'Personality',n:'The Quiet Power',f:'Never raises their voice',line:'cou100',ids:['leather','blu','honour'],d:'Classic Leather, Ombre Blu and Honour. Nothing here shouts.'},
 {t:'Personality',n:'The Sweet Tooth',f:'People hug you longer',line:'cou100',ids:['vanilla','pistachio','candy'],d:'Vanilla Kiss, Pistachio Pop and Lush Candy. Three gourmands that make people lean in.'},
 {t:'Occasion',n:'Wedding Season',f:'Sangeet, reception, the lot',line:'cou100',ids:['oud','tobacco','amberrose'],d:'Built for rooms full of people, heavy fabric and long nights.'},
 {t:'Occasion',n:'Office to Evening',f:'One day, two versions of you',line:'cou100',ids:['blu','leather'],d:'Ombre Blu at your desk, Classic Leather after seven.'},
 {t:'Occasion',n:'The Everyday Three',f:'New to perfume? Start here',line:'cla100',ids:['marino','honour','pierce'],d:'Three Classic eau de parfums at their easiest and most wearable.'},
 {t:'Occasion',n:'The Discovery Five',f:"Can't decide? Try five",line:'cou25',ids:['smoky','leather','oud','blu','vanilla'],d:'Five 25ml Couture scents, five weeks to find your signature.'}
];

var S=function(id){for(var i=0;i<SC.length;i++){if(SC[i].id===id)return SC[i];}return null;};
var priceFor=function(k,q){return LINES[k].px[Math.max(1,Math.min(LINES[k].max,q))];};
var offFor=function(k,q){return q<1?0:Math.round((1-priceFor(k,q)/(LINES[k].mrp*q))*100);};
var line='cou100', box={}, cat='All', busy=false;
var nBox=function(){var t=0;for(var k in box)t+=box[k];return t;};
var poolFor=function(k){return LINES[k].pool==='cla'?SC.filter(function(s){return s.cla;}):SC.filter(function(s){return !s.cla;});};
var art=function(id){var s=S(id);return s&&s.img?'<img class="imgbox" src="'+s.img+'" loading="lazy" alt="'+s.n+'">':'<span style="display:block;width:100%;height:100%;background:'+(s?s.c:'#ccc')+'"></span>';};
var variantFor=function(id,ln){var s=S(id);if(!s)return null;return LINES[ln].size==='25'?s.v25:s.v100;};
var lineCode=function(ln,q){return q<2?null:LINES[ln].code+q;};

$('tabs').onclick=function(e){var b=e.target.closest('.tab');if(!b)return;
  Array.prototype.forEach.call($('tabs').querySelectorAll('.tab'),function(x){x.classList.toggle('on',x===b);});
  $('paneByo').classList.toggle('on',b.dataset.p==='byo');$('panePre').classList.toggle('on',b.dataset.p==='pre');
  $('mbar').classList.toggle('up',b.dataset.p==='byo'&&nBox()>0);window.scrollTo({top:0,behavior:'smooth'});};

function renderLines(){
  $('lines').innerHTML=Object.keys(LINES).map(function(k){var L=LINES[k];return '<button class="ln '+(k===line?'on':'')+'" data-l="'+k+'"><div class="t">'+L.label+'</div><div class="s">'+L.sub+'</div><div class="p">from '+inr(L.unit)+' · up to '+offFor(k,L.max)+'% off</div></button>';}).join('');
  Array.prototype.forEach.call($('lines').querySelectorAll('.ln'),function(b){b.onclick=function(){line=b.dataset.l;box={};renderLines();renderPick();renderLad();renderSum();};});
}
function renderLad(){
  var L=LINES[line], q=nBox(), best=priceFor(line,L.max)/L.max;
  $('ladSub').innerHTML='<b>'+inr(L.unit)+'</b> each → <b>'+inr(best)+'</b> each at '+L.max+' bottles';
  $('rungs').style.setProperty('--rn',L.max);
  var h='';for(var i=0;i<L.max;i++){var n=i+1,o=offFor(line,n);h+='<button class="rg '+(n===q?'on':'')+' '+(n<=q?'rc':'')+'" data-r="'+n+'" title="'+n+' — '+inr(priceFor(line,n))+'"><span class="q">'+n+'</span><span class="o">'+(o?o+'%':'—')+'</span></button>';}
  $('rungs').innerHTML=h;
  Array.prototype.forEach.call($('rungs').querySelectorAll('.rg'),function(r){r.onclick=function(){jump(+r.dataset.r);};});
  var paid=q?priceFor(line,q):0, saved=L.unit*q-paid, free=saved/L.unit;
  $('hook').innerHTML = q<2
    ? '<span class="l">Take a second bottle and the discount starts. By <b>'+L.max+'</b> you pay <b>'+inr(best)+'</b> a bottle.</span><span class="r"><span class="n">'+offFor(line,L.max)+'%</span><span class="x">Max discount</span></span>'
    : '<span class="l">At '+q+' bottles you\'re saving <b>'+inr(saved)+'</b> against the single-bottle price.</span><span class="r"><span class="n">'+(free>=1?free.toFixed(1).replace('.0','')+'×':'—')+'</span><span class="x">'+(free>=1?'bottles free, in effect':'keep going')+'</span></span>';
}
function jump(t){
  var pool=poolFor(line), flat=[];Object.keys(box).forEach(function(id){for(var i=0;i<box[id];i++)flat.push(id);});
  while(flat.length>t)flat.pop();
  while(flat.length<t){var cand=null;for(var j=0;j<pool.length;j++){if(flat.indexOf(pool[j].id)<0){cand=pool[j].id;break;}}flat.push(cand||pool[flat.length%pool.length].id);}
  box={};flat.forEach(function(id){box[id]=(box[id]||0)+1;});
  renderPick();renderLad();renderSum();
}
function renderPick(){
  var L=LINES[line], q=nBox();
  $('pkH').textContent='Add '+L.label+' — up to '+L.max;
  $('pk').innerHTML=poolFor(line).map(function(s){var n=box[s.id]||0;
    return '<div class="pc '+(n?'on':'')+' '+(q>=L.max&&!n?'off':'')+'" data-s="'+s.id+'"><span class="pc-m">'+art(s.id)+'</span><span class="pc-i"><span class="pc-n">'+s.n+'</span><span class="pc-f">'+s.f+' · '+inr(L.unit)+'</span></span>'+(n?'<span class="pc-q"><button data-m="'+s.id+'">−</button><span class="n">'+n+'</span><button data-p="'+s.id+'">+</button></span>':'<span class="pc-add" data-a="'+s.id+'">Add</span>')+'</div>';
  }).join('');
  Array.prototype.forEach.call($('pk').querySelectorAll('[data-a],[data-p]'),function(b){b.onclick=function(){chg(b.dataset.a||b.dataset.p,1);};});
  Array.prototype.forEach.call($('pk').querySelectorAll('[data-m]'),function(b){b.onclick=function(){chg(b.dataset.m,-1);};});
}
function chg(id,d){var L=LINES[line];if(d>0&&nBox()>=L.max){toast(L.max+' is the maximum for this box');return;}box[id]=(box[id]||0)+d;if(box[id]<=0)delete box[id];renderPick();renderLad();renderSum();}
function renderSum(){
  var L=LINES[line], q=nBox();
  if(!q){$('sum').innerHTML='<div class="sum-h"><span class="t">Your box</span></div><div class="sum-e">Add a scent to start.<br>The more you add, the less each costs.</div>';$('mbar').classList.remove('up');$('mGo').disabled=true;return;}
  var p=priceFor(line,q), mrp=L.mrp*q, slots=[];Object.keys(box).forEach(function(id){for(var i=0;i<box[id];i++)slots.push(id);});
  var h='<div class="sum-h"><span class="t">Your box</span><span class="c">'+q+' of '+L.max+'</span></div><div class="slot-row">';
  for(var i=0;i<L.max;i++){h+=slots[i]?'<span class="slot f">'+art(slots[i])+'</span>':'<span class="slot"></span>';}
  h+='</div>';
  Object.keys(box).forEach(function(id){var n=box[id];h+='<div class="sl"><span>'+S(id).n+(n>1?' ×'+n:'')+'</span><b>'+inr(L.unit*n)+'</b></div>';});
  if(q<L.max){var ex=priceFor(line,q+1)-p;h+='<div class="nudge">Your next bottle costs just <b>'+inr(ex)+'</b> instead of '+inr(L.unit)+' — the box drops to <b>'+offFor(line,q+1)+'% off</b>.</div>';}
  else h+='<div class="nudge">Maximum box · <b>'+offFor(line,L.max)+'% off</b>. Nothing goes lower.</div>';
  h+='<div class="sum-t"><span class="l">Box total</span><span><span class="was">'+inr(mrp)+'</span><span class="amt">'+inr(p)+'</span></span></div><button class="btn solid full" style="margin-top:14px" id="addBox">Add box to cart · '+inr(p)+'</button><button class="btn full sm" style="margin-top:7px" id="clrBox">Clear box</button>';
  $('sum').innerHTML=h;
  $('addBox').onclick=function(){addBox($('addBox'));};$('clrBox').onclick=function(){box={};renderPick();renderLad();renderSum();};
  $('mbar').classList.toggle('up',$('paneByo').classList.contains('on'));$('mGo').disabled=false;
  $('mT').textContent=inr(p);$('mS').textContent=q+' bottles · '+offFor(line,q)+'% off';
}
function checkout(items,code,btn){
  if(busy||!items.length){if(!items.length)toast('Add a scent first');return;}
  busy=true; var old=btn?btn.textContent:''; if(btn){btn.disabled=true;btn.textContent='Adding…';}
  fetch('/cart/clear.js',{method:'POST'})
   .then(function(){return fetch('/cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount:''})});})
   .then(function(){return fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:items})});})
   .then(function(r){if(!r.ok)throw 0;return r.json();})
   .then(function(){ window.location.href = code?('/discount/'+encodeURIComponent(code)+'?redirect=/cart'):'/cart'; })
   .catch(function(){ busy=false; if(btn){btn.disabled=false;btn.textContent=old;} toast('Could not add — please try again'); });
}
function addBox(btn){
  var q=nBox(); if(!q)return;
  var items=[];Object.keys(box).forEach(function(id){var v=variantFor(id,line);if(v)items.push({id:v,quantity:box[id]});});
  checkout(items,lineCode(line,q),btn);
}
$('mGo').onclick=function(){addBox($('mGo'));};

function renderPills(){
  var cats=['All'];COMBOS.forEach(function(c){if(cats.indexOf(c.t)<0)cats.push(c.t);});
  $('pills').innerHTML=cats.map(function(c){return '<button class="pill '+(c===cat?'on':'')+'" data-c="'+c+'">'+c+'</button>';}).join('');
  Array.prototype.forEach.call($('pills').querySelectorAll('.pill'),function(b){b.onclick=function(){cat=b.dataset.c;renderPills();renderCombos();};});
}
function renderCombos(){
  var list=COMBOS.filter(function(c){return cat==='All'||c.t===cat;});
  $('combos').innerHTML=list.map(function(c,idx){
    var L=LINES[c.line], q=c.ids.length, p=priceFor(c.line,q), mrp=L.mrp*q;
    return '<div class="cb"><div class="cb-m" style="background:'+S(c.ids[0]).c+'12"><span class="cb-ty">'+c.t+'</span><span class="cb-sv">Save '+inr(mrp-p)+'</span>'+c.ids.map(function(id){return art(id).replace('imgbox','cbimg');}).join('')+'</div><div class="cb-b"><div class="cb-n">'+c.n+'</div><div class="cb-f">'+c.f+'</div><div class="cb-d">'+c.d+'</div><div class="cb-l">'+c.ids.map(function(id){return S(id).n;}).join(' · ')+'<br><span style="color:var(--i3)">'+q+' × '+L.label+'</span>'+(c.how?'<br><span style="color:var(--terra);font-weight:600">'+c.how+'</span>':'')+'</div><div class="cb-p"><span class="a">'+inr(p)+'</span><span class="b">'+inr(mrp)+'</span><span class="o">'+Math.round((1-p/mrp)*100)+'% off</span></div><button class="btn solid full sm" data-cb="'+idx+'">Add combo to cart</button></div></div>';
  }).join('');
  Array.prototype.forEach.call($('combos').querySelectorAll('[data-cb]'),function(b){b.onclick=function(){
    var c=list[+b.dataset.cb], counts={};c.ids.forEach(function(id){counts[id]=(counts[id]||0)+1;});
    var items=[];Object.keys(counts).forEach(function(id){var v=variantFor(id,c.line);if(v)items.push({id:v,quantity:counts[id]});});
    checkout(items,lineCode(c.line,c.ids.length),b);
  };});
}
var tt;function toast(m,w){$('toast').textContent=m;$('toast').className='obcmb-toast up'+(w?' win':'');clearTimeout(tt);tt=setTimeout(function(){$('toast').classList.remove('up');},2400);}
renderLines();renderPick();renderLad();renderSum();renderPills();renderCombos();
})();
