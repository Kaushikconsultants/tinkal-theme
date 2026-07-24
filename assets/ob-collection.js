/* Ombre Bliss — collection page. Editorial metadata is brand content;
   variants/images/urls come from window.OB_COL (injected by the section). */
(function(){
'use strict';
var OB = window.OB_COL || {};
var ROOT = document.querySelector('.obcol');
if(!ROOT) return;
var $=function(i){return document.getElementById(i);};
var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN');};

var SIZE_LABEL={'100':'100ml','25':'25ml','set':'4 × 25ml'};
var PRODUCTS=[
 {id:'smoky',name:'Smoky Rum',color:'#8C3A1E',col:'cou',fam:'Smoky',gender:'Unisex',occ:['Evening','Party'],notes:'Pink pepper, rum, tobacco leaf',rank:1,rating:4.8,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}},tag:'Bestseller'},
 {id:'oud',name:'Nawab Oud',color:'#6B2237',col:'cou',fam:'Oud',gender:'Unisex',occ:['Evening','Wedding'],notes:'Oud, rose, agarwood, amber',rank:2,rating:4.9,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}},tag:'Bestseller'},
 {id:'leather',name:'Classic Leather',color:'#5B4636',col:'cou',fam:'Leather',gender:'For Him',occ:['Work','Evening'],notes:'Cardamom, leather, vetiver',rank:3,rating:4.7,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}}},
 {id:'blu',name:'Ombre Blu',color:'#2C5A8C',col:'cou',fam:'Fresh',gender:'Unisex',occ:['Work','Everyday'],notes:'Bergamot, ginger, black tea',rank:4,rating:4.6,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}}},
 {id:'tobacco',name:'Royale Tobacco',color:'#7A4A1F',col:'cou',fam:'Spicy',gender:'For Him',occ:['Evening','Wedding'],notes:'Cinnamon, tobacco, tonka bean',rank:5,rating:4.7,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}}},
 {id:'vanilla',name:'Vanilla Kiss',color:'#B98A4E',col:'cou',fam:'Gourmand',gender:'Unisex',occ:['Date','Everyday'],notes:'Vanilla, rum, brown sugar, oud',rank:6,rating:4.8,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}}},
 {id:'amberrose',name:'Amber Rose',color:'#A8546A',col:'cou',fam:'Floral',gender:'For Her',occ:['Date','Wedding'],notes:'Damask rose, amber, white musk',rank:7,rating:4.7,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}}},
 {id:'angel',name:'Angel',color:'#7A6BA8',col:'cou',fam:'Gourmand',gender:'For Her',occ:['Evening','Party'],notes:'Lavender, cocoa, vanilla caviar',rank:8,rating:4.6,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}},tag:'New'},
 {id:'pistachio',name:'Pistachio Pop',color:'#6E8F4E',col:'cou',fam:'Gourmand',gender:'For Her',occ:['Everyday','Date'],notes:'Pistachio, gelato, cacao',rank:9,rating:4.6,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}},tag:'New'},
 {id:'candy',name:'Lush Candy',color:'#C4527D',col:'cou',fam:'Gourmand',gender:'For Her',occ:['Everyday','Party'],notes:'Candied pear, caramel, soft musk',rank:10,rating:4.5,sizes:{'100':{p:1499,m:1999},'25':{p:499,m:599}}},
 {id:'marino',name:'Marino',color:'#3E7A9E',col:'cla',fam:'Fresh',gender:'For Him',occ:['Work','Everyday'],notes:'Marine accord, lavender, musk',rank:11,rating:4.5,sizes:{'100':{p:699,m:1199}}},
 {id:'vicious',name:'Vicious',color:'#43342E',col:'cla',fam:'Oud',gender:'For Him',occ:['Evening','Party'],notes:'Black pepper, amber, deep woods',rank:12,rating:4.6,sizes:{'100':{p:699,m:1199}}},
 {id:'yakuza',name:'Yakuza',color:'#6B5230',col:'cla',fam:'Oud',gender:'For Him',occ:['Work','Party'],notes:'Yuzu, pepper, cedarwood',rank:13,rating:4.5,sizes:{'100':{p:699,m:1199}}},
 {id:'honour',name:'Honour',color:'#8A7A4E',col:'cla',fam:'Woody',gender:'For Him',occ:['Work','Everyday'],notes:'Bergamot, jasmine, soft woods',rank:14,rating:4.6,sizes:{'100':{p:699,m:1199}}},
 {id:'bouquet',name:'The Bouquet',color:'#C77B93',col:'cla',fam:'Floral',gender:'For Her',occ:['Everyday','Date'],notes:'Rose, jasmine, white musk',rank:15,rating:4.5,sizes:{'100':{p:699,m:1199}}},
 {id:'obsessed',name:'Obsessed',color:'#9B5B5B',col:'cla',fam:'Floral',gender:'For Her',occ:['Date','Party'],notes:'Pink pepper, amber, musk',rank:16,rating:4.5,sizes:{'100':{p:699,m:1199}}},
 {id:'luna',name:'Luna',color:'#C29A6B',col:'cla',fam:'Gourmand',gender:'For Her',occ:['Date','Everyday'],notes:'Orange blossom, vanilla, musk',rank:17,rating:4.6,sizes:{'100':{p:699,m:1199}}},
 {id:'pierce',name:'Pierce',color:'#7E9B86',col:'cla',fam:'Fresh',gender:'Unisex',occ:['Work','Everyday'],notes:'Lemon, lavender, cedarwood',rank:18,rating:4.4,sizes:{'100':{p:699,m:1199}}},
 {id:'gsHim',name:'Gift Set — for Him',color:'#43342E',col:'gift',fam:'Gift set',gender:'For Him',occ:['Gifting'],notes:'Vicious, Honour, Marino, Yakuza — 4 × 25ml',rank:19,rating:4.7,sizes:{'set':{p:699,m:1399}}},
 {id:'gsHer',name:'Gift Set — for Her',color:'#C77B93',col:'gift',fam:'Gift set',gender:'For Her',occ:['Gifting'],notes:'The Bouquet, Obsessed, Luna, Pierce — 4 × 25ml',rank:20,rating:4.7,sizes:{'set':{p:699,m:1399}}}
];
/* merge real Shopify data; drop products that don't resolve to a variant */
PRODUCTS=PRODUCTS.filter(function(p){
  var r=(OB.products||{})[p.id]; if(!r) return false;
  p.img=r.img; p.url=r.url||'#'; p.v100=r.v100; p.v25=r.v25; p.vset=r.vset;
  return !!(p.v100||p.v25||p.vset);
});

var TABS=[
 {k:'all',n:'Shop All',eye:'Every scent we make',h:'Shop All Perfumes',p:'Filter by who it’s for, the scent family, or the occasion.'},
 {k:'cou',n:'Couture',eye:'Extrait de Parfum · 25% concentration',h:'The Couture Collection',p:'Our highest concentration. Ten scents, each in a 100ml signature bottle and a 25ml you can travel with.'},
 {k:'cla',n:'Classic',eye:'Eau de Parfum · 100ml',h:'The Classic Collection',p:'Eight everyday eau de parfums at ₹699. Lighter, easier, and the best place to start.'},
 {k:'gift',n:'Gift Sets',eye:'Four scents, boxed',h:'Gift Sets',p:'Four 25ml bottles in one box.'}
];

var tab='all', F={gender:[],fam:[],occ:[]}, sort='pop';
var P=function(id){for(var i=0;i<PRODUCTS.length;i++){if(PRODUCTS[i].id===id)return PRODUCTS[i];}return null;};
var sizesOf=function(p){return Object.keys(p.sizes);};
var uniq=function(fn){var s={},o=[];PRODUCTS.forEach(function(p){[].concat(fn(p)).forEach(function(v){if(v&&!s[v]){s[v]=1;o.push(v);}});});return o;};
var FACETS=[
 {k:'gender',h:'Who it’s for',vals:['For Her','For Him','Unisex']},
 {k:'fam',h:'Scent family',vals:uniq(function(p){return p.fam;}).sort()},
 {k:'occ',h:'Occasion',vals:uniq(function(p){return p.occ;}).sort()}
];
function inTab(p){return tab==='all'?true:p.col===tab;}
function results(){
  var r=PRODUCTS.filter(function(p){return inTab(p)&&(!F.gender.length||F.gender.indexOf(p.gender)>-1)&&(!F.fam.length||F.fam.indexOf(p.fam)>-1)&&(!F.occ.length||F.occ.some(function(o){return p.occ.indexOf(o)>-1;}));});
  var pr=function(p){return p.sizes[sizesOf(p)[0]].p;};
  var by={pop:function(a,b){return a.rank-b.rank;},new:function(a,b){return (b.tag==='New')-(a.tag==='New')||a.rank-b.rank;},plo:function(a,b){return pr(a)-pr(b);},phi:function(a,b){return pr(b)-pr(a);},rate:function(a,b){return b.rating-a.rating;}};
  return r.sort(by[sort]);
}
var count=function(k,v){return PRODUCTS.filter(function(p){return inTab(p)&&(k==='occ'?p.occ.indexOf(v)>-1:p[k]===v);}).length;};

function renderTabs(){
  $('tabs').innerHTML=TABS.map(function(t){var n=t.k==='all'?PRODUCTS.length:PRODUCTS.filter(function(p){return p.col===t.k;}).length;return '<button class="tab '+(t.k===tab?'on':'')+'" data-t="'+t.k+'">'+t.n+'<span class="n">'+n+'</span></button>';}).join('');
  Array.prototype.forEach.call($('tabs').querySelectorAll('.tab'),function(b){b.onclick=function(){tab=b.dataset.t;F={gender:[],fam:[],occ:[]};var t=TABS.filter(function(x){return x.k===tab;})[0];$('heroEye').textContent=t.eye;$('heroH').textContent=t.h;$('heroP').textContent=t.p;renderTabs();renderSheet();render();window.scrollTo({top:0,behavior:'smooth'});};});
}
function renderSheet(){
  $('sheetB').innerHTML=FACETS.map(function(f){return '<div class="fg"><div class="h">'+f.h+'</div><div class="fo">'+f.vals.filter(function(v){return count(f.k,v)>0;}).map(function(v){return '<button data-f="'+f.k+'|'+v+'" class="'+(F[f.k].indexOf(v)>-1?'on':'')+'">'+v+'<span class="n">'+count(f.k,v)+'</span></button>';}).join('')+'</div></div>';}).join('');
  Array.prototype.forEach.call($('sheetB').querySelectorAll('[data-f]'),function(b){b.onclick=function(){var a=b.dataset.f.split('|'),k=a[0],v=a[1];if(F[k].indexOf(v)>-1)F[k]=F[k].filter(function(x){return x!==v;});else F[k].push(v);renderSheet();render();};});
}
var activeN=function(){return F.gender.length+F.fam.length+F.occ.length;};
function renderChips(){
  var all=F.gender.map(function(v){return ['gender',v];}).concat(F.fam.map(function(v){return ['fam',v];}),F.occ.map(function(v){return ['occ',v];}));
  $('chips').innerHTML=all.length?all.map(function(a){return '<button class="chip" data-x="'+a[0]+'|'+a[1]+'">'+a[1]+' <i>×</i></button>';}).join('')+'<button class="chip clear" id="clr">Clear all</button>':'';
  Array.prototype.forEach.call($('chips').querySelectorAll('[data-x]'),function(b){b.onclick=function(){var a=b.dataset.x.split('|');F[a[0]]=F[a[0]].filter(function(x){return x!==a[1];});renderSheet();render();};});
  if($('clr'))$('clr').onclick=function(){F={gender:[],fam:[],occ:[]};renderSheet();render();};
  $('fBtn').classList.toggle('act',activeN()>0);
  $('fBtn').innerHTML='<span class="dot"></span>Filter'+(activeN()?' ('+activeN()+')':'');
}
function render(){
  var r=results();
  $('cnt').textContent=r.length+' '+(r.length===1?'product':'products');
  renderChips();
  if(!r.length){ $('grid').innerHTML='<div class="empty"><div class="t">Nothing matches that yet</div><p>Try loosening one filter.</p></div>'; return; }
  $('grid').innerHTML=r.map(function(p){
    var av=sizesOf(p), lo=Math.min.apply(null,av.map(function(a){return p.sizes[a].p;}));
    var hi=p.sizes[av[0]], off=Math.round((1-hi.p/hi.m)*100);
    var range=av.length>1?av.map(function(a){return SIZE_LABEL[a];}).join(' & '):SIZE_LABEL[av[0]];
    var both=av.reduce(function(a,z){return a+p.sizes[z].p;},0);
    var opts=av.length>1?'<div class="c-opts">'+av.map(function(z){return '<button class="c-opt" data-a="'+p.id+'|'+z+'"><span class="l">'+SIZE_LABEL[z]+'</span><span class="p">'+inr(p.sizes[z].p)+'</span></button>';}).join('')+'<button class="c-opt both" data-a="'+p.id+'|ALL"><span class="l">Both sizes</span><span class="p">'+inr(both)+'</span></button></div>':'';
    return '<div class="card"><a class="c-m" href="'+p.url+'">'+(p.tag?'<span class="c-tag '+(p.tag==='New'?'new':'hot')+'">'+p.tag+'</span>':'')+(off?'<span class="c-off">'+off+'% off</span>':'')+'<img src="'+(p.img||'')+'" loading="lazy" alt="'+p.name+'"></a><div class="c-b"><a href="'+p.url+'"><div class="c-n">'+p.name+'</div></a><div class="c-f">'+p.fam+' · '+range+'</div><div class="c-nt">'+p.notes+'</div><div class="c-p"><span class="a">'+(av.length>1?'From ':'')+inr(lo)+'</span>'+(off?'<span class="b">'+inr(hi.m)+'</span>':'')+'</div><div class="c-act" data-act="'+p.id+'"><button class="c-add" data-open="'+p.id+'" '+(av.length===1?'data-a="'+p.id+'|'+av[0]+'"':'')+'>Add to cart</button>'+opts+'</div></div></div>';
  }).join('');
  bindAdds();
}
function bindAdds(){
  Array.prototype.forEach.call($('grid').querySelectorAll('[data-open]'),function(b){b.onclick=function(){var wrap=b.closest('.c-act');if(!wrap.querySelector('.c-opts')){doAdd(b.dataset.open,sizesOf(P(b.dataset.open))[0],b);return;}Array.prototype.forEach.call(document.querySelectorAll('.c-act.open'),function(x){if(x!==wrap)x.classList.remove('open');});wrap.classList.toggle('open');};});
  Array.prototype.forEach.call($('grid').querySelectorAll('.c-opt'),function(b){b.onclick=function(){var a=b.dataset.a.split('|');doAdd(a[0],a[1],b.closest('.c-act').querySelector('.c-add'));b.closest('.c-act').classList.remove('open');};});
}
function variantFor(p,z){ return z==='100'?p.v100 : z==='25'?p.v25 : p.vset; }
function doAdd(id,z,btn){
  var p=P(id); var list=z==='ALL'?sizesOf(p):[z];
  var items=[]; list.forEach(function(s){var v=variantFor(p,s); if(v)items.push({id:v,quantity:1});});
  if(!items.length){toast('Unavailable');return;}
  if(btn)btn.disabled=true;
  fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:items})})
   .then(function(r){if(!r.ok)throw 0;return r.json();})
   .then(function(){ if(btn){btn.textContent='✓ Added';btn.classList.add('done');btn.disabled=false;setTimeout(function(){btn.textContent='Add to cart';btn.classList.remove('done');},1500);} toast(z==='ALL'?p.name+' — both sizes added':p.name+' · '+SIZE_LABEL[z]+' added'); renderCart(); })
   .catch(function(){ if(btn)btn.disabled=false; toast('Could not add — please try again'); });
}
function renderCart(){
  fetch('/cart.js').then(function(r){return r.json();}).then(function(c){
    var n=c.item_count, tot=c.total_price/100;
    $('cbar').classList.toggle('up',n>0);
    if(!n)return;
    $('cbT').textContent=n+' '+(n===1?'bottle':'bottles')+' · '+inr(tot);
    var gap=1499-tot;
    $('cbS').innerHTML=gap>0?'<b>'+inr(gap)+'</b> more for free shipping':'Free shipping unlocked';
  }).catch(function(){});
}
$('cbGo').onclick=function(){window.location.href='/cart';};
document.addEventListener('click',function(e){ if(!e.target.closest('.c-act')) Array.prototype.forEach.call(document.querySelectorAll('.c-act.open'),function(x){x.classList.remove('open');}); });
$('fBtn').onclick=function(){$('sheet').classList.add('on');};
document.addEventListener('click',function(e){if(e.target.closest('[data-close]'))$('sheet').classList.remove('on');});
$('clrAll').onclick=function(){F={gender:[],fam:[],occ:[]};renderSheet();render();};
$('srt').onchange=function(e){sort=e.target.value;render();};
var tt; function toast(m,w){$('toast').textContent=m;$('toast').className='obcol-toast up'+(w?' win':'');clearTimeout(tt);tt=setTimeout(function(){$('toast').classList.remove('up');},2200);}
var t0=TABS[0];$('heroEye').textContent=t0.eye;$('heroH').textContent=t0.h;$('heroP').textContent=t0.p;
window.addEventListener('pageshow',function(){ render(); renderCart(); });
renderTabs();renderSheet();render();renderCart();
})();
