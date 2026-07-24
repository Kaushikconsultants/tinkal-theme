/* Ombre Bliss — cart page. Reads the REAL Shopify cart; quantity/remove/size via
   the AJAX cart API; the tier code (OBC…) is applied silently via /cart/update.js
   and NEVER shown. Summary reads /cart.js so displayed always equals charged. */
(function(){
'use strict';
var OB = window.OB_CART || {};
var ROOT = document.querySelector('.obcart');
if(!ROOT) return;
var $=function(i){return document.getElementById(i);};
var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN');};
var FREE_SHIP=OB.freeShipAt||1499;

var SC=[
 {id:'smoky',name:'Smoky Rum',family:'Smoky · Boozy',pairs:'vanilla',reason:'cream over the smoke'},
 {id:'oud',name:'Nawab Oud',family:'Oud · Oriental',pairs:'amberrose',reason:'rose sits on oud perfectly'},
 {id:'leather',name:'Classic Leather',family:'Leather · Woody',pairs:'oud',reason:'two heavyweights that stack'},
 {id:'blu',name:'Ombre Blu',family:'Fresh · Spicy',pairs:'leather',reason:'citrus opens the leather up'},
 {id:'tobacco',name:'Royale Tobacco',family:'Spicy · Tobacco',pairs:'vanilla',reason:'softens a dry tobacco'},
 {id:'vanilla',name:'Vanilla Kiss',family:'Vanilla · Boozy',pairs:'smoky',reason:'cream over the smoke'},
 {id:'amberrose',name:'Amber Rose',family:'Rose · Amber',pairs:'oud',reason:'rose sits on oud perfectly'},
 {id:'angel',name:'Angel',family:'Gourmand · Oriental',pairs:'blu',reason:'bergamot cools the cocoa'},
 {id:'pistachio',name:'Pistachio Pop',family:'Gourmand · Nutty',pairs:'tobacco',reason:'like the best mithai shop'},
 {id:'candy',name:'Lush Candy',family:'Gourmand · Sweet',pairs:'vanilla',reason:'anchors the sugar'},
 {id:'marino',name:'Marino',family:'Fresh · EDP',pairs:'honour',reason:'clean over clean'},
 {id:'vicious',name:'Vicious',family:'Oud · EDP',pairs:'yakuza',reason:'dark on dark'},
 {id:'yakuza',name:'Yakuza',family:'Oud · EDP',pairs:'vicious',reason:'smoke meets citrus'},
 {id:'honour',name:'Honour',family:'Woody · EDP',pairs:'marino',reason:'sea air under warm wood'},
 {id:'bouquet',name:'The Bouquet',family:'Floral · EDP',pairs:'obsessed',reason:'two florals, one bloom'},
 {id:'obsessed',name:'Obsessed',family:'Floral · EDP',pairs:'bouquet',reason:'rose meets musk'},
 {id:'luna',name:'Luna',family:'Gourmand · EDP',pairs:'pierce',reason:'sweet meets fresh'},
 {id:'pierce',name:'Pierce',family:'Fresh · EDP',pairs:'luna',reason:'citrus lifts the vanilla'}
];
SC.forEach(function(s){var r=(OB.scents||{})[s.id]||{};s.v100=r.v100;s.v25=r.v25;s.img=r.img;s.url=r.url;});
var S=function(id){for(var i=0;i<SC.length;i++){if(SC[i].id===id)return SC[i];}return null;};
/* variantMap: variantId -> {scent,size,group}  (group c100/c25/cl100) */
var VMAP=OB.variantMap||{};
var GIFTS=OB.gifts||[{at:1499,label:'Free shipping',icon:'truck'},{at:2499,label:'Free 25ml travel spray',icon:'bottle'},{at:3999,label:'Luxury gift box',icon:'gift'},{at:5999,label:'Free 100ml bottle',icon:'crown'}];
var ICON={truck:'<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/></svg>',bottle:'<svg viewBox="0 0 24 24"><rect x="9" y="8" width="6" height="13" rx="1"/><path d="M10 8V5h4v3"/><path d="M14 3h3"/></svg>',gift:'<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="11"/><path d="M3 13h18M12 9v11"/><path d="M12 9S9 4 7 5.5 9 9 12 9zM12 9s3-5 5-3.5S15 9 12 9z"/></svg>',crown:'<svg viewBox="0 0 24 24"><path d="M4 18h16l1-9-5 3-4-6-4 6-5-3z"/><path d="M4 21h16"/></svg>'};

var CART={items:[],total:0,orig:0,discount:0,codes:[]};
var busy=false, lastUnlocked=0;

function getCart(){ return fetch('/cart.js').then(function(r){return r.json();}); }
/* the correct silent tier code from cart composition (single tier-group only) */
function tierCode(){
  var g={c100:0,c25:0,cl100:0};
  CART.items.forEach(function(it){ var m=VMAP[it.variant_id]||VMAP[String(it.variant_id)]; if(m&&g.hasOwnProperty(m.group)) g[m.group]+=it.quantity; });
  var groups=[]; if(g.c100)groups.push('c100'); if(g.c25)groups.push('c25'); if(g.cl100)groups.push('cl100');
  if(groups.length!==1) return null;
  var k=groups[0], n=g[k];
  if(k==='c100') return n>=2?'OBC100Q'+Math.min(n,10):null;
  if(k==='c25')  return n>=2?'OBC25Q'+Math.min(n,10):null;
  if(k==='cl100')return n>=2?'OBCLA100Q'+Math.min(n,8):null;
  return null;
}
function applyTier(){ /* silent: clear codes, apply the one correct tier code */
  var code=tierCode();
  return fetch('/cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount:''})})
    .then(function(){ return code?fetch('/cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount:code})}):null; });
}
function refresh(applyCode){
  return getCart().then(function(c){
    CART.items=c.items;
    if(applyCode){ return applyTier().then(getCart).then(function(c2){ store(c2); render(); }); }
    store(c); render();
  });
}
function store(c){ CART.items=c.items; CART.total=c.total_price/100; CART.orig=c.original_total_price/100; CART.discount=c.total_discount/100; CART.codes=c.discount_codes||[]; }

/* line lookups */
function metaFor(it){ var m=VMAP[it.variant_id]||VMAP[String(it.variant_id)]; return m||{}; }
function imgFor(it){ var m=metaFor(it); var s=m.scent?S(m.scent):null; return (s&&s.img)?s.img:(it.image||''); }

/* ── render ── */
function render(){ renderItems(); renderGifts(); renderUpsell(); renderSum(); }

function renderItems(){
  var n=CART.items.reduce(function(a,i){return a+i.quantity;},0);
  $('cCount').textContent=n+' '+(n===1?'bottle':'bottles');
  if(!CART.items.length){ $('items').innerHTML='<div class="empty"><h2>Your cart is empty</h2><p>Ten Couture extraits are waiting.</p><a href="/collections/premium-collection">Shop the collection</a></div>'; return; }
  $('items').innerHTML=CART.items.map(function(it,i){
    var m=metaFor(it), s=m.scent?S(m.scent):null;
    var name=s?s.name:(it.product_title||it.title);
    var fam=s?s.family:(it.variant_title||'');
    var line=it.final_line_price/100, was=(it.original_line_price||it.line_price)/100;
    var save=was-line;
    var sw='';
    if(s && s.v100 && s.v25 && (m.group==='c100'||m.group==='c25')){
      sw='<div><span class="szsw">'
        +'<button data-sz="'+i+'|100" class="'+(m.size==='100'?'on':'')+'">100ml</button>'
        +'<button data-sz="'+i+'|25" class="'+(m.size==='25'?'on':'')+'">25ml</button>'
        +'</span></div>';
    }
    return '<div class="it" data-key="'+it.key+'">'
      +'<div class="it-m">'+(imgFor(it)?'<img src="'+imgFor(it)+'" loading="lazy" alt="">':'')+'</div>'
      +'<div><div class="it-n">'+name+'</div><div class="it-v">'+fam+' · '+(m.size?m.size+'ml':'')+'</div>'
      +(save>0?'<span class="it-tag">Save '+inr(save)+'</span>':'')+sw
      +'<div class="it-ct"><span class="qty"><button data-q="'+i+'|-1">−</button><span class="n">'+it.quantity+'</span><button data-q="'+i+'|1">+</button></span><button class="rm" data-rm="'+i+'">Remove</button></div></div>'
      +'<div class="it-p">'+(was>line?'<span class="b">'+inr(was)+'</span>':'')+'<span class="a">'+inr(line)+'</span>'+(it.quantity>1?'<div class="e">'+inr(line/it.quantity)+' each</div>':'')+'</div></div>';
  }).join('');
  Array.prototype.forEach.call($('items').querySelectorAll('[data-q]'),function(b){b.onclick=function(){var a=b.dataset.q.split('|');changeQty(+a[0],+a[1]);};});
  Array.prototype.forEach.call($('items').querySelectorAll('[data-rm]'),function(b){b.onclick=function(){removeLine(+b.dataset.rm);};});
  Array.prototype.forEach.call($('items').querySelectorAll('[data-sz]'),function(b){b.onclick=function(){var a=b.dataset.sz.split('|');switchSize(+a[0],a[1]);};});
}
function changeQty(i,d){ if(busy)return; var it=CART.items[i]; var q=it.quantity+d; busy=true;
  fetch('/cart/change.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:it.key,quantity:Math.max(0,q)})})
    .then(function(r){return r.json();}).then(function(){ busy=false; refresh(true); }).catch(function(){busy=false;});
}
function removeLine(i){ if(busy)return; var it=CART.items[i]; busy=true;
  fetch('/cart/change.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:it.key,quantity:0})})
    .then(function(r){return r.json();}).then(function(){ busy=false; refresh(true); }).catch(function(){busy=false;});
}
function switchSize(i,z){ if(busy)return; var it=CART.items[i], m=metaFor(it), s=m.scent?S(m.scent):null; if(!s)return;
  var newVar = z==='100'?s.v100:s.v25; if(!newVar||newVar===it.variant_id){ return; }
  busy=true;
  fetch('/cart/change.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:it.key,quantity:0})})
    .then(function(){return fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{id:newVar,quantity:it.quantity}]})});})
    .then(function(){ busy=false; toast('Switched to '+z+'ml'); refresh(true); }).catch(function(){busy=false;});
}

function renderGifts(){
  var s=CART.orig || CART.total, got=GIFTS.filter(function(g){return s>=g.at;}).length, max=GIFTS[GIFTS.length-1].at;
  $('gH').innerHTML=got?'You\'ve unlocked <b>'+got+'</b> of '+GIFTS.length+' gifts':'Unlock <b>'+GIFTS.length+'</b> rewards';
  var next=GIFTS.filter(function(g){return s<g.at;})[0];
  $('gS').innerHTML=next?'<b>'+inr(next.at-s)+'</b> away from '+next.label.toLowerCase():'Every reward unlocked';
  $('gFill').style.width=Math.min(100,s/max*100)+'%';
  $('gNodes').innerHTML=GIFTS.map(function(g){var on=s>=g.at;return '<div class="nd '+(on?'on':'')+'"><div class="nd-dot"></div><div class="nd-ic">'+(ICON[g.icon]||ICON.gift)+'</div><div class="nd-t">'+g.label+'</div><div class="nd-v">'+(on?'✓ Unlocked':inr(g.at))+'</div></div>';}).join('');
  if(next){$('gCta').style.display='flex';$('gCta').innerHTML='<span class="g">Add <b>'+inr(next.at-s)+'</b> more and <b>'+next.label.toLowerCase()+'</b> is on us.</span><button id="gJump">Show me what to add</button>';var gj=$('gJump');if(gj)gj.onclick=function(){var u=$('upsellCard');if(u)u.scrollIntoView({behavior:'smooth',block:'center'});};}
  else $('gCta').style.display='none';
  if(got>lastUnlocked && lastUnlocked>0) toast('Unlocked — '+GIFTS[got-1].label+'!',true);
  lastUnlocked=got;
}

function renderUpsell(){
  var have={}; CART.items.forEach(function(it){var m=metaFor(it);if(m.scent)have[m.scent]=1;});
  var list=[];
  CART.items.forEach(function(it){var m=metaFor(it),me=m.scent?S(m.scent):null;if(me&&me.pairs&&!have[me.pairs]&&!list.some(function(x){return x.id===me.pairs;})){var pr=S(me.pairs);if(pr&&pr.v25)list.push({id:me.pairs,why:'Layers with '+me.name+' — <em>'+me.reason+'</em>'});}});
  var bs=SC.filter(function(p){return !have[p.id]&&!list.some(function(x){return x.id===p.id;})&&(p.v100||p.v25);})[0];
  if(bs&&list.length<3)list.push({id:bs.id,why:'A bestseller people add most often'});
  var show=list.slice(0,3);
  if(!show.length){$('upsellCard').style.display='none';return;}
  $('upsellCard').style.display='block';
  $('upT').textContent='Goes well with your order';
  $('upS').innerHTML='Chosen to layer with what’s already in your cart.';
  $('upList').innerHTML=show.map(function(u){var p=S(u.id);var v=p.v25||p.v100;var sz=p.v25?'25ml':'100ml';
    return '<div class="up"><div class="up-m">'+(p.img?'<img src="'+p.img+'" loading="lazy" alt="">':'')+'</div><div class="up-i"><div class="up-n">'+p.name+' · '+sz+'</div><div class="up-s">'+u.why+'</div></div><div class="up-r"><button class="up-add" data-u="'+v+'">Add</button></div></div>';
  }).join('');
  Array.prototype.forEach.call($('upList').querySelectorAll('[data-u]'),function(b){b.onclick=function(){ if(busy)return; busy=true; b.textContent='✓ Added'; b.classList.add('done');
    fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{id:+b.dataset.u,quantity:1}]})}).then(function(){busy=false;refresh(true);}).catch(function(){busy=false;});
  };});
}

function renderSum(){
  var s=CART.orig||CART.total, disc=CART.discount, ship=(CART.total>=FREE_SHIP)?0:0, t=CART.total;
  var saved=(CART.orig-CART.total);
  var h='<div class="sr"><span>Subtotal ('+CART.items.reduce(function(a,i){return a+i.quantity;},0)+' items)</span><b>'+inr(CART.orig)+'</b></div>';
  if(disc>0) h+='<div class="sr dis"><span>Bundle discount</span><b>− '+inr(disc)+'</b></div>';
  h+='<div class="sr"><span>Shipping</span><b>'+(CART.total>=FREE_SHIP?'Free':'Calculated at checkout')+'</b></div><div class="sdiv"></div><div class="stot"><span class="l">Total</span><span class="r"><div class="amt">'+inr(t)+'</div><div class="tax">GST included</div></span></div>';
  if(saved>0) h+='<div class="saved"><span>You’re saving</span><b>'+inr(saved)+'</b></div>';
  h+='<button class="co" id="coBtn"'+(CART.items.length?'':' disabled')+'>Checkout securely</button><div class="co-s">Extra 5% off when you pay online</div><a class="cont" href="/collections/premium-collection">Continue shopping</a>';
  $('sumB').innerHTML=h;
  var cb=$('coBtn'); if(cb) cb.onclick=checkout;
  $('mA').textContent=inr(t); $('mS').textContent=saved>0?'Saving '+inr(saved):'';
  var mg=$('mGo'); if(mg){ mg.disabled=!CART.items.length; mg.onclick=checkout; }
}
function checkout(){ if(busy)return; busy=true; applyTier().then(function(){ window.location.href='/checkout'; }).catch(function(){ busy=false; window.location.href='/checkout'; }); }

/* customer coupon (NOT the OBC tier codes) */
var cpBtn=$('cpBtn'); if(cpBtn) cpBtn.onclick=function(){
  var c=$('cp').value.trim(); if(!c){return;}
  fetch('/cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount:c})})
    .then(getCart).then(function(cart){ store(cart); var applied=(cart.discount_codes||[]).some(function(d){return d.code.toUpperCase()===c.toUpperCase()&&d.applicable;});
      $('cpMsg').className='msg '+(applied?'ok':'no'); $('cpMsg').textContent=applied?(c.toUpperCase()+' applied.'):'That code isn’t valid for this cart.'; render(); });
};
var cp=$('cp'); if(cp) cp.onkeydown=function(e){if(e.key==='Enter')cpBtn.click();};

var tt; function toast(m,w){$('toast').textContent=m;$('toast').className='obcart-toast up'+(w?' win':'');clearTimeout(tt);tt=setTimeout(function(){$('toast').classList.remove('up');},w?3200:2200);}
window.addEventListener('pageshow',function(){busy=false;refresh(false);});

/* boot: apply the correct tier code once, then render */
refresh(true).then(function(){ lastUnlocked=GIFTS.filter(function(g){return (CART.orig||CART.total)>=g.at;}).length; });
})();
