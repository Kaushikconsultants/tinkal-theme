/* Ombre Bliss — v4 product page logic. Editorial data is brand content;
   pricing, variants and cart come from window.OB_V4 (injected by the section). */
(function(){
  'use strict';
  var OB = window.OB_V4 || {};
  var root = document.querySelector('.obv4');
  if(!root || !OB.sizes) return;

  var SIZES = OB.sizes;                 // {'100':{ml,label,unit,mrp,px[]}, '25':{...}}
  var MAXQ = 10;
  var FREE_SHIP_MIN = OB.freeShipMin || 1499;
  var CODE_PREFIX = OB.codePrefix || 'OBC';

  var priceFor = function(sz,q){ return SIZES[sz].px[Math.max(1,Math.min(MAXQ,q))]; };
  var offFor   = function(sz,q){ return Math.round((1 - priceFor(sz,q)/(SIZES[sz].unit*q))*100); };

  /* ── EDITORIAL DATA (brand content) ── */
  var FAM = {
    citrus:{c:'#E9A93B',bg:'#FBF2E0',d:'Cold-pressed peel. Sharp, sunny, gone in twenty minutes.'},
    pepper:{c:'#B4485C',bg:'#F8ECEE',d:'Dried berries. A dry, prickly heat that opens the nose.'},
    spice:{c:'#B5762C',bg:'#F8F0E3',d:'Ground bark and pods. Warm, dry, faintly sweet.'},
    wood:{c:'#7A6A52',bg:'#F1EEE7',d:'Rasped heartwood. Dry, grounding, quietly green.'},
    oud:{c:'#4B2A2F',bg:'#F1E8E9',d:'Resin-soaked agarwood. Smoky, animalic, worth the price.'},
    leather:{c:'#6B4B33',bg:'#F2ECE5',d:'Tanned hide. Dry, smoky, slightly smoked-out.'},
    tobacco:{c:'#7C5A22',bg:'#F5F0E3',d:'Cured leaf. Honeyed, dry, a little like an old library.'},
    vanilla:{c:'#9A6B3A',bg:'#F8F1E6',d:'Cured pod, split open. Creamy, boozy, never sugary.'},
    sugar:{c:'#D98CA6',bg:'#FBEFF3',d:'Spun and caramelised. Sweet, sticky, unapologetic.'},
    nut:{c:'#8CA35C',bg:'#F0F3E7',d:'Shelled and roasted. Green, buttery, faintly milky.'},
    cacao:{c:'#5A3A26',bg:'#F1EAE4',d:'Roasted nib. Bitter, dusty, dark.'},
    rose:{c:'#C2607B',bg:'#FAEDF0',d:'Petals picked at dawn. Fresh, green, honeyed.'},
    floral:{c:'#D8C68B',bg:'#F8F4E7',d:'Night-picked petals. Creamy, heady, a little indolic.'},
    amber:{c:'#C08B3A',bg:'#F9F1E2',d:'Fossilised resin. Warm, sweet, glowing.'},
    musk:{c:'#C3BDB1',bg:'#F4F2ED',d:'Clean, warm, skin-like. The reason it smells like you.'},
    tea:{c:'#5E6B4A',bg:'#EFF1EA',d:'Dried and smoked leaf. Tannic, dry, faintly bitter.'},
    booze:{c:'#8C5A2B',bg:'#F6EFE5',d:'Aged in oak. Sweet, sharp, warming on contact.'},
    lavender:{c:'#8C86BE',bg:'#F1F0F8',d:'Steam-distilled flower. Herbal, cool, slightly medicinal.'},
    moss:{c:'#5F7248',bg:'#EFF2EA',d:'Forest floor. Damp, green, mineral.'}
  };
  var NOTE_FAM = {
    'Lemon':'citrus','Citrus':'citrus','Bergamot':'citrus','Sicilian Orange':'citrus','Citron':'citrus',
    'Pink Pepper':'pepper','Cardamom':'spice','Ginger':'spice','Cinnamon':'spice','Spice Mix':'spice','Angelica':'spice','Clary Sage':'spice',
    'Vetiver':'wood','Vetiver Oil':'wood','Sandalwood':'wood','Guaiac Wood':'wood','Cashmeran':'wood','Patchouli':'wood','Galbanum':'wood','Violet Leaves':'wood',
    'Moss':'moss','Oud':'oud','Agarwood':'oud','Styrax':'oud','Leather':'leather','Tobacco':'tobacco','Tobacco Leaf':'tobacco',
    'Vanilla':'vanilla','Vanilla Bean':'vanilla','Vanilla Fusion':'vanilla','Vanilla Caviar':'vanilla','Tonka Bean':'vanilla','Tonka Beans':'vanilla',
    'Brown Sugar':'sugar','White Caramel':'sugar','Rock Sugar':'sugar','Cotton Candy':'sugar','Marshmallow':'sugar','Bubble Gum':'sugar','Candied Pear':'sugar','Gelato':'sugar','Raspberry':'sugar',
    'Pistachio':'nut','Hazelnut':'nut','Cacao':'cacao','Cocoa':'cacao','Rose':'rose','Damask Rose':'rose','Rose Bloom':'rose',
    'Neroli':'floral','Tunisian Neroli':'floral','Jasmine':'floral','Sambac':'floral','Peony':'floral','Orchid':'floral','Floral':'floral',
    'Amber':'amber','White Musk':'musk','Black Tea':'tea','Rum':'booze','Lavender':'lavender'
  };
  var SCENTS = [
    {id:'smoky',name:'Smoky Rum',hex:'#8C3A1E',soft:'#F6EBE6',fam:'Smoky · Boozy',weight:8,sweet:4,line:'Dark rum spilled on tobacco leaf. Warm, smoky, and impossible to ignore.',top:['Pink Pepper','Lemon','Neroli'],mid:['Rum','Clary Sage','Vetiver Oil'],base:['Tobacco Leaf','Vanilla Bean','Styrax'],longevity:9,sillage:8,s:{winter:3,monsoon:2,summer:1,night:3,day:2},pIf:"You're the last one to leave, and everyone remembers it.",pFor:'Late dinners, winter weddings, anything after 8pm.'},
    {id:'leather',name:'Classic Leather',hex:'#5B4636',soft:'#F1EDE8',fam:'Leather · Woody',weight:9,sweet:2,line:'Cardamom and cured leather. The scent of a very good jacket.',top:['Cardamom','Leather','Citrus'],mid:['Jasmine','Sambac','Moss'],base:['Vetiver','Patchouli','Amber'],longevity:9,sillage:7,s:{winter:3,monsoon:2,summer:1,night:3,day:2},pIf:'You own one good watch and wear it every single day.',pFor:'Boardrooms, first meetings, evenings that matter.'},
    {id:'oud',name:'Nawab Oud',hex:'#6B2237',soft:'#F5E9EC',fam:'Oud · Oriental',weight:10,sweet:3,line:'Agarwood and rose, the way Lucknow does it. Regal, not loud.',top:['Oud','Bergamot','Neroli'],mid:['Rose','Patchouli','Floral'],base:['Amber','Vanilla Bean','Agarwood'],longevity:10,sillage:9,s:{winter:3,monsoon:3,summer:1,night:3,day:1},pIf:'You walk into a room slowly and it still turns.',pFor:'Sangeets, receptions, Eid, anything with a dress code.'},
    {id:'pistachio',name:'Pistachio Pop',hex:'#6E8F4E',soft:'#EDF2E7',fam:'Gourmand · Nutty',weight:4,sweet:9,line:'Pistachio gelato on a hot afternoon. Sweet, creamy, ridiculously moreish.',top:['Pistachio','Gelato','Hazelnut'],mid:['Peony','Jasmine','Raspberry'],base:['Cotton Candy','Marshmallow','Cacao'],longevity:7,sillage:7,s:{winter:2,monsoon:2,summer:3,night:2,day:3},pIf:"People hug you and then ask what you're wearing.",pFor:'Brunch, dates, college, anywhere you want to be liked.'},
    {id:'candy',name:'Lush Candy',hex:'#C4527D',soft:'#FAECF1',fam:'Gourmand · Sweet',weight:3,sweet:10,line:'Candied pear and bubblegum over warm sandalwood. Playful, then grown-up.',top:['Candied Pear','Violet Leaves'],mid:['Jasmine','Bubble Gum','White Caramel'],base:['Sandalwood','Patchouli','Rock Sugar'],longevity:7,sillage:6,s:{winter:2,monsoon:2,summer:3,night:2,day:3},pIf:'Your laugh is the loudest thing in the room and you like it that way.',pFor:'Birthdays, house parties, day-outs.'},
    {id:'blu',name:'Ombre Blu',hex:'#2C5A8C',soft:'#E9EFF6',fam:'Fresh · Spicy',weight:3,sweet:3,line:'Sicilian citrus with a warm spine of ginger and black tea. Clean, never boring.',top:['Bergamot','Sicilian Orange','Citron'],mid:['Tunisian Neroli','Ginger','Cinnamon'],base:['Black Tea','Guaiac Wood','Amber'],longevity:7,sillage:6,s:{winter:2,monsoon:3,summer:3,night:2,day:3},pIf:'You show up early and everything about you is ironed.',pFor:'Office, daytime, Indian summers.'},
    {id:'tobacco',name:'Royale Tobacco',hex:'#7A4A1F',soft:'#F4EDE4',fam:'Spicy · Tobacco',weight:9,sweet:5,line:'Cinnamon and pipe tobacco wrapped in tonka. Old money, no logo.',top:['Cinnamon','Tobacco','Cardamom'],mid:['Sandalwood','Patchouli','Floral'],base:['Spice Mix','Vanilla','Tonka Bean'],longevity:9,sillage:8,s:{winter:3,monsoon:2,summer:1,night:3,day:2},pIf:"You'd rather be underestimated than announced.",pFor:'Winter evenings, long dinners, cold weather travel.'},
    {id:'vanilla',name:'Vanilla Kiss',hex:'#B98A4E',soft:'#F8F1E7',fam:'Vanilla · Boozy',weight:6,sweet:9,line:'Vanilla with rum and brown sugar, grounded by oud. Soft, then addictive.',top:['Vanilla','Orchid','Jasmine'],mid:['Brown Sugar','Rum','Tonka Beans'],base:['Oud','Patchouli','Amber'],longevity:8,sillage:7,s:{winter:3,monsoon:2,summer:2,night:3,day:2},pIf:'People remember your hug before your face.',pFor:'Dates, winters, anything close-range.'},
    {id:'amberrose',name:'Amber Rose',hex:'#A8546A',soft:'#F8EDF0',fam:'Rose · Amber',weight:6,sweet:6,line:'Damask rose with pink pepper and cashmere musk. Romantic, with an edge.',top:['Bergamot','Galbanum','Pink Pepper'],mid:['Damask Rose','Angelica','Amber'],base:['White Musk','Cashmeran','Rose Bloom'],longevity:8,sillage:7,s:{winter:3,monsoon:2,summer:2,night:3,day:3},pIf:'Soft on the outside, absolutely not on the inside.',pFor:'Dates, weddings, evenings out.'},
    {id:'angel',name:'Angel',hex:'#7A6BA8',soft:'#F0EEF7',fam:'Gourmand · Oriental',weight:8,sweet:8,line:'Lavender and cocoa over vanilla caviar. Sweet, strange, unforgettable.',top:['Vanilla Fusion','Lavender','Cocoa'],mid:['Ginger','Vanilla Caviar','Tonka Beans'],base:['Spice Mix','Sandalwood','Amber'],longevity:9,sillage:9,s:{winter:3,monsoon:2,summer:1,night:3,day:2},pIf:"You don't follow the trend, you predate it.",pFor:'Nights out, statement moments.'}
  ];
  /* attach real variant ids + images from Liquid */
  SCENTS.forEach(function(s){
    var v = (OB.variants||{})[s.id] || {};
    s.v100 = v.v100; s.v25 = v.v25; s.img = v.img; s.url = v.url;
  });
  var PAIRS = [
    {a:'smoky',b:'vanilla',n:'Rum & Cream',score:96,d:'Smoky Rum lays down tobacco and rum. Vanilla Kiss pours cream over it. The smoke stops being harsh and starts being dessert — and it lasts even longer than either bottle alone.'},
    {a:'leather',b:'oud',n:"The Nawab's Jacket",score:94,d:'Leather underneath, agarwood on top. Two heavyweights that share an amber base, so instead of fighting, they stack. Wear this once a month and only after dark.'},
    {a:'oud',b:'amberrose',n:'Oud Rose',score:95,d:'The oldest pairing in perfumery, and still the best. Nawab Oud gives the depth, Amber Rose gives the bloom.'},
    {a:'tobacco',b:'pistachio',n:'Halwa',score:92,d:'Spiced tobacco under pistachio gelato. Sounds mad, smells like the best mithai shop in the city. Cold weather only.'},
    {a:'vanilla',b:'candy',n:'Double Sweet',score:88,d:'Vanilla anchors, Lush Candy sparkles on top. Go easy — one spray each.'},
    {a:'leather',b:'blu',n:'Weekday Armour',score:90,d:"Ombre Blu's citrus opens leather up and makes it office-safe, without losing the backbone."},
    {a:'angel',b:'blu',n:'Cold Front',score:87,d:"Angel's cocoa-lavender is loud. Blu's bergamot cools it down and makes it wearable in daylight."},
    {a:'tobacco',b:'vanilla',n:'The Cigar Lounge',score:93,d:'Cinnamon and pipe tobacco, softened with brown sugar and rum.'}
  ];
  var STAGES = [
    {t:'0 — 15 minutes',s:'The opening',k:'top',d:function(s){return 'Sharp and bright. '+s.top.slice(0,2).join(' and ')+' hit first'+(s.top[2]?', with a lift of '+s.top[2].toLowerCase():'')+'. This is what strangers notice from across a room.';}},
    {t:'15 min — 2 hours',s:'The heart',k:'mid',d:function(s){return 'The opening burns off and the real scent arrives. '+s.mid.slice(0,2).join(' and ')+' take over.';}},
    {t:'2 — 6 hours',s:'The base settles',k:'base',d:function(s){return 'It stops projecting and starts belonging to you. '+s.base.slice(0,2).join(' and ')+' sit close to the skin, warm and quiet.';}},
    {t:'6 — 10 hours',s:'Skin scent',k:'base',d:function(s){return 'Barely there, but there. '+s.base[s.base.length-1]+' is the last thing standing.';}}
  ];
  var SETS = [
    {sz:'100',n:'The Trio',ids:['smoky','leather','oud'],d:'Our three loudest personalities, boxed.'},
    {sz:'100',n:'The Gourmand',ids:['pistachio','candy','vanilla'],d:'Sweet enough to be a problem.'},
    {sz:'100',n:'Day & Night',ids:['blu','amberrose'],d:'Ombre Blu for the office. Amber Rose for after.'},
    {sz:'25',n:'The Discovery Five',ids:['smoky','leather','oud','blu','vanilla'],d:'Five scents, five weeks. Find your signature.'},
    {sz:'25',n:'The Layering Kit',ids:['oud','amberrose','vanilla'],d:'Three bottles chosen to stack.'},
    {sz:'25',n:'The Sweet Three',ids:['pistachio','candy','angel'],d:'The gourmand starter pack.'}
  ];
  var CREDS = [
    ['IFRA compliant','Every formula filed and within limits.'],['Dermatologically tested','Patch-tested. Safe on skin.'],
    ['Cruelty free','Never tested on animals.'],['Paraben & phthalate free','No shortcuts in the base.'],
    ['Made in India','Blended and bottled in our own unit.'],['GST invoice','On every order. Batch code on every bottle.']
  ];
  var FAQ = [
    ['Is the 25ml a weaker version?','No. Identical Extrait concentration. Same juice, smaller bottle. The only difference is how long it lasts you, not how long it lasts on you.'],
    ['Which size should I buy first?','If you already love the scent — 100ml, it works out cheaper per ml. If you\'re guessing — 25ml, and we credit it back when you upgrade.'],
    ['What is layering, actually?','Wearing two perfumes at once. Spray the heavier one first, let it settle thirty seconds, then one spray of the lighter one on top.'],
    ['How do I know it\'s authentic?','Every bottle carries a batch code on the base, traceable to the day it was filled in our unit.'],
    ['Is it safe for sensitive skin?','All formulas are IFRA compliant and dermatologically tested. Spray on clothing rather than skin if you\'re sensitive.'],
    ['Can I mix scents inside a combo?','Yes. Every multi-bottle tier lets you pick any scents from the collection.']
  ];

  /* ── STATE ── */
  var startId = OB.currentScent || 'smoky';
  var size='100', cur=S(startId)||SCENTS[0], qty=2, combo=[cur.id,'vanilla'], addons={}, setSize='100', layA=cur.id, layB='vanilla', ddVal=4;
  function $(id){return document.getElementById(id);}
  function S(id){for(var i=0;i<SCENTS.length;i++){if(SCENTS[i].id===id)return SCENTS[i];}return null;}
  function inr(n){return '₹'+Math.round(n).toLocaleString('en-IN');}
  function cfg(){return SIZES[size];}

  function fitCombo(){ while(combo.length<qty) combo.push(bestPartner(combo[combo.length-1]||cur.id).id); combo=combo.slice(0,qty); combo[0]=cur.id; }
  function setQty(n,openBulk){ qty=Math.max(1,Math.min(MAXQ,n)); fitCombo(); if(openBulk)$('bulk').classList.add('open'); renderTiers(); renderBulk(); renderPicker(); calc(); }

  /* ── CART (real Shopify) ── */
  function variantFor(id,sz){ var s=S(id); return s ? (sz==='100'?s.v100:s.v25) : null; }
  function cartItems(){
    var counts={}; combo.forEach(function(id){ var v=variantFor(id,size); if(v) counts[v]=(counts[v]||0)+1; });
    return Object.keys(counts).map(function(v){ return {id:parseInt(v,10),quantity:counts[v]}; });
  }
  function tierCode(){ return qty>1 ? CODE_PREFIX+size+'Q'+qty : null; }
  function checkout(items, code, dest){
    fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:items})})
      .then(function(r){ if(!r.ok) throw new Error('add'); return r.json(); })
      .then(function(){ window.location.href = code ? ('/discount/'+encodeURIComponent(code)+'?redirect='+encodeURIComponent(dest)) : dest; })
      .catch(function(){ $('cta').disabled=false; $('ctaBuy').disabled=false; toast('Could not add to cart — please try again'); });
  }
  function addToCart(dest){
    var items=cartItems();
    if(!items.length){ toast('Pick a scent first'); return; }
    $('cta').disabled=true; $('ctaBuy').disabled=true;
    toast('Adding to cart…');
    checkout(items, tierCode(), dest || '/cart');
  }

  /* ── RENDERERS ── */
  $('creds').innerHTML = CREDS.map(function(a){return '<div class="cred"><div class="ct">'+a[0]+'</div><div class="cs">'+a[1]+'</div></div>';}).join('');

  function noteCard(name,layer){
    var f=FAM[NOTE_FAM[name]||'wood'];
    return '<div class="ing"><div class="ing-img" style="background:'+f.bg+'"><span class="ing-layer">'+layer+'</span></div>'
      +'<div class="ing-b"><div class="ing-n">'+name+'</div><div class="ing-d">'+f.d+'</div></div></div>';
  }
  function renderIngredients(){
    $('ingH').textContent='What '+cur.name+' is actually made of';
    var all=cur.top.map(function(n){return [n,'Top'];}).concat(cur.mid.map(function(n){return [n,'Heart'];}),cur.base.map(function(n){return [n,'Base'];}));
    $('ingGrid').innerHTML=all.map(function(x){return noteCard(x[0],x[1]);}).join('');
  }
  function renderSizes(){
    var perMl=function(k){return SIZES[k].unit/SIZES[k].ml;};
    var better=Math.round((1-perMl('100')/perMl('25'))*100);
    $('sizes').innerHTML=Object.keys(SIZES).map(function(k){
      var c=SIZES[k], win=k==='100';
      return '<button class="size '+(k===size?'on':'')+'" data-sz="'+k+'">'+(win?'<span class="badge">Save '+better+'% per ml</span>':'')
        +'<div class="sz-t">'+c.label+'</div><div class="sz-r">'+(win?'Your signature':'Travel & layering')+'</div>'
        +'<div class="sz-p">'+inr(c.unit)+' <span style="text-decoration:line-through;color:var(--ink-3)">'+inr(c.mrp)+'</span></div>'
        +'<div class="sz-ml '+(win?'win':'')+'">'+perMl(k).toFixed(2)+' per ml</div></button>';
    }).join('');
    $('sizeHint').innerHTML = size==='100'
      ? 'Not sure yet? <b data-go="25">Start with 25ml</b> — '+inr(SIZES['25'].unit)+', the layering size.'
      : '25ml is the layering size. Own three, and you can build blends nobody else is wearing. <b data-go="lab">See the layering lab ↓</b>';
  }
  function setSizeTo(k){
    size=k; setSize=k; fitCombo();
    $('bottle').className='bottle '+(k==='100'?'big':'small');
    $('scaleNote').textContent=SIZES[k].label+' — shown to scale';
    $('labelSize').textContent='Extrait · '+SIZES[k].label;
    renderSizes(); renderTiers(); renderBulk(); renderPicker(); renderAddons(); calc(); renderCombos(); paintSeg();
  }
  function renderTiers(){
    var quick = size==='100' ? [{q:1,name:'One bottle',sub:'Your signature scent'},{q:2,name:'Two bottles',sub:'One for day, one for night',badge:'Most popular'},{q:3,name:'Three bottles',sub:'A full wardrobe',badge:'Best value',good:true}]
                             : [{q:1,name:'One bottle',sub:'Try before you commit'},{q:3,name:'Three bottles',sub:'Enough to start layering',badge:'Most popular'},{q:5,name:'Five bottles',sub:'The full wardrobe, in a bag',badge:'Best value',good:true}];
    $('tiers').innerHTML=quick.map(function(t){
      var p=priceFor(size,t.q), mrp=t.q*cfg().mrp;
      return '<button class="tier '+(t.q===qty?'on':'')+'" data-q="'+t.q+'">'+(t.badge?'<span class="badge '+(t.good?'g':'')+'">'+t.badge+'</span>':'')
        +'<span class="radio"></span><span><span class="tier-name">'+t.name+' · '+cfg().label+'</span><span class="tier-sub">'+t.sub+(t.q>1?' · '+inr(p/t.q)+' each · '+offFor(size,t.q)+'% off':'')+'</span></span>'
        +'<span class="tier-price">'+(t.q>1?'<div class="strike">'+inr(mrp)+'</div>':'')+'<div class="p">'+inr(p)+'</div></span></button>';
    }).join('');
  }
  function renderBulk(){
    $('ladder').innerHTML=Array.apply(null,{length:MAXQ}).map(function(_,i){
      var q=i+1, off=offFor(size,q);
      return '<button class="rung '+(q===qty?'on':'')+' '+(q<=qty?'reached':'')+'" data-q="'+q+'" title="'+q+' × '+cfg().label+' — '+inr(priceFor(size,q))+'"><span class="rq">'+q+'</span><span class="ro">'+(off?off+'%':'—')+'</span></button>';
    }).join('');
    Array.prototype.forEach.call($('ladder').querySelectorAll('.rung'),function(r){ r.onclick=function(){setQty(+r.dataset.q,true);}; });
    var p=priceFor(size,qty);
    $('qVal').textContent=qty; $('qLab').textContent=(qty===1?'bottle':'bottles')+' · '+cfg().label;
    $('qPrice').textContent=inr(p); $('qEach').textContent=inr(p/qty)+' each · '+offFor(size,qty)+'% off';
    if(qty<MAXQ){
      var now=priceFor(size,qty), next=priceFor(size,qty+1), extra=next-now, newOff=offFor(size,qty+1);
      $('nudge').innerHTML='<span>One more bottle costs only <b>'+inr(extra)+'</b> — takes you to '+newOff+'% off, '+inr(next/(qty+1))+' each.</span><button id="nudgeBtn">Add one →</button>';
      $('nudgeBtn').onclick=function(){setQty(qty+1,true);};
    } else {
      $('nudge').innerHTML='<span>Maximum box. <b>'+offFor(size,MAXQ)+'% off</b> — '+inr(priceFor(size,MAXQ)/MAXQ)+' a bottle. Nothing goes lower.</span>';
    }
  }
  function renderPicker(){
    if(qty===1){$('picker').style.display='none'; return;}
    $('picker').style.display='block';
    var tip = qty>=3 ? '<div class="pick-tip">Tip — pair one heavy scent (Oud, Leather, Tobacco) with one sweet one (Vanilla, Pistachio, Candy). Duplicates are fine too.</div>' : '';
    var rows=combo.map(function(id,i){ return '<div class="pick-row"><span class="pick-n">No. '+(i+1)+'</span><select data-i="'+i+'">'+SCENTS.map(function(s){return '<option value="'+s.id+'" '+(s.id===id?'selected':'')+'>'+s.name+'</option>';}).join('')+'</select></div>'; }).join('');
    $('picker').innerHTML=(qty>3?'<div class="grid2">'+rows+'</div>':rows)+tip;
    Array.prototype.forEach.call($('picker').querySelectorAll('select'),function(sel){ sel.onchange=function(e){combo[+e.target.dataset.i]=e.target.value; calc();}; });
  }
  function renderAddons(){
    var rows = size==='100'
      ? [['gift',0,'Gift box + handwritten card','Free. Add your message at checkout.']]
      : [['gift',0,'Gift box + handwritten card','Free. Add your message at checkout.']];
    $('addons').innerHTML=rows.map(function(a){ var k=a[0],p=a[1],t=a[2],s=a[3];
      return '<button class="addon '+(addons[k]?'on':'')+'" data-a="'+k+'" data-p="'+p+'"><span class="box"></span><span class="ad-t">'+t+'<span class="ad-s">'+s+'</span></span><span class="ad-p">'+(p?'+'+inr(p):'Free')+'</span></button>';
    }).join('');
    Array.prototype.forEach.call($('addons').querySelectorAll('.addon'),function(a){ a.onclick=function(){var k=a.dataset.a; addons[k]=!addons[k]; a.classList.toggle('on',addons[k]); calc();}; });
  }
  function calc(){
    var base=priceFor(size,qty), sub=base;
    var mrp=qty*cfg().mrp;
    $('totalAmt').textContent=inr(sub); $('wasAmt').textContent=inr(mrp);
    $('wasAmt').style.display=mrp>sub?'inline':'none';
    var saved=mrp-sub;
    $('savings').style.display=saved>0?'flex':'none';
    $('savingsAmt').innerHTML=inr(saved)+" <span style=\"font-family:'Space Mono',monospace;font-size:10px;font-weight:400\">· "+offFor(size,qty)+'% off</span>';
    var ml=qty*cfg().ml;
    $('ctaNote').innerHTML=qty+' × '+cfg().label+' · '+ml+'ml total · '+inr(sub/ml)+' per ml · GST included';
    var pct=Math.min(100,sub/FREE_SHIP_MIN*100);
    $('shipFill').style.width=pct+'%';
    if(sub>=FREE_SHIP_MIN){$('shipTxt').textContent='Free shipping unlocked'; $('shipTxt').classList.add('done');}
    else {$('shipTxt').textContent='Add '+inr(FREE_SHIP_MIN-sub)+' more for free shipping'; $('shipTxt').classList.remove('done');}
    $('snPrice').textContent=inr(sub)+' · '+qty+' × '+cfg().label;
    $('snName').textContent=qty>1?qty+' bottles':cur.name;
  }
  function paintScent(){
    root.style.setProperty('--accent',cur.hex); root.style.setProperty('--accent-soft',cur.soft);
    $('heroFrame').style.background=cur.soft; $('liquid').style.background=cur.hex; if($('swLiquid'))$('swLiquid').style.background=cur.hex;
    if(cur.img){ $('heroImg').src=cur.img; $('heroImg').style.display='block'; $('bottle').style.display='none'; }
    else { $('heroImg').style.display='none'; $('bottle').style.display='block'; }
    $('labelName').textContent=cur.name; $('pName').textContent=cur.name; $('pLine').textContent=cur.line; $('famLabel').textContent=cur.fam;
    $('pIf').textContent=cur.pIf; $('pFor').textContent=cur.pFor;
    var best=bestPartner(cur.id);
    $('pLike').textContent=S(best.id).name+' — '+best.score+'% match.'+(best.n?' We call it "'+best.n+'".':'');
    Array.prototype.forEach.call(document.querySelectorAll('#scents .chip'),function(c){c.classList.toggle('on',c.dataset.s===cur.id);});
    $('pyramid').innerHTML=[['Top notes',cur.top,'First 15 min'],['Heart notes',cur.mid,'Hours 1 to 3'],['Base notes',cur.base,'Hours 3 to 10']]
      .map(function(x){return '<div class="pyr-row"><div class="pyr-lab">'+x[0]+'<br/><span style="color:var(--line-2)">'+x[2]+'</span></div><div class="pyr-notes">'+x[1].join(' · ')+'</div></div>';}).join('');
    $('mLong').style.width=cur.longevity*10+'%'; $('mSil').style.width=cur.sillage*10+'%';
    $('mLongV').textContent=cur.longevity>=9?'8–10 hrs':cur.longevity>=8?'7–9 hrs':'5–7 hrs';
    $('mSilV').textContent=cur.sillage>=8?'Strong':cur.sillage>=7?'Moderate':'Close to skin';
    Array.prototype.forEach.call(document.querySelectorAll('.pips'),function(p){var v=cur.s[p.dataset.s]||0; p.innerHTML=[1,2,3].map(function(i){return '<span class="pip '+(i<=v?'on':'')+'"></span>';}).join('');});
  }
  function drydown(){
    var v=+$('ddSlider').value; var st=STAGES[v<15?0:v<35?1:v<70?2:3];
    $('ddTime').textContent=st.t; $('ddStage').textContent=st.s; $('ddDesc').textContent=st.d(cur);
    var all=cur.top.map(function(n){return [n,'top'];}).concat(cur.mid.map(function(n){return [n,'mid'];}),cur.base.map(function(n){return [n,'base'];}));
    $('ddNotes').innerHTML=all.map(function(x){return '<span class="dd-note '+(x[1]===st.k?'lit':'')+'">'+x[0]+'</span>';}).join('');
  }

  /* ── LAYERING ── */
  function shared(a,b){return S(a).base.filter(function(n){return S(b).base.indexOf(n)>-1;}).length;}
  function pairOf(a,b){for(var i=0;i<PAIRS.length;i++){if((PAIRS[i].a===a&&PAIRS[i].b===b)||(PAIRS[i].a===b&&PAIRS[i].b===a))return PAIRS[i];}return null;}
  function scoreOf(a,b){ if(a===b)return 0; var p=pairOf(a,b); if(p)return p.score; var A=S(a),B=S(b),sc=52; sc+=Math.min(24,Math.abs(A.weight-B.weight)*3.2); sc+=shared(a,b)*9; sc+=A.weight>=B.weight?8:-6; if(A.sweet>7&&B.sweet>7)sc-=8; return Math.max(38,Math.min(98,Math.round(sc))); }
  function bestPartner(a){ var best=null; SCENTS.forEach(function(s){ if(s.id===a)return; var sc=scoreOf(a,s.id); if(!best||sc>best.score){var p=pairOf(a,s.id); best={id:s.id,score:sc,n:p?p.n:null};} }); return best||{id:'vanilla',score:80,n:null}; }
  function renderLab(){
    var mk=function(w,sel){return SCENTS.map(function(s){return '<button class="lab-chip '+(s.id===sel?'on':'')+'" data-w="'+w+'" data-s="'+s.id+'"><span class="dot" style="background:'+s.hex+'"></span>'+s.name+'</button>';}).join('');};
    $('labA').innerHTML=mk('a',layA); $('labB').innerHTML=mk('b',layB); paintMix();
  }
  function paintMix(){
    var p=pairOf(layA,layB), sc=scoreOf(layA,layB), A=S(layA), B=S(layB);
    $('mixName').textContent=p?p.n:A.name+' × '+B.name; $('mixTag').textContent=p?'A blend we know works':'Your blend';
    $('mixNum').textContent=sc+'% match'; $('mixFill').style.width=sc+'%';
    var col=sc>=85?'#5DCAA5':sc>=70?'#EF9F27':'#F09595'; $('mixFill').style.background=col; $('mixNum').style.color=col;
    $('mixDesc').textContent=p?p.d:(A.name+' goes down first, '+B.name+' lands on top.');
    $('mixHow').innerHTML='<b>1.</b> Two sprays of '+A.name+' on the chest and wrists.<br/><b>2.</b> Wait 30 seconds.<br/><b>3.</b> One spray of '+B.name+' over the top.';
    $('mixBuy').textContent='Add both — 25ml · '+inr(priceFor('25',2));
    $('mixBuyBig').textContent='Add both — 100ml · '+inr(priceFor('100',2));
  }
  function loadPair(sz){ if(layA===layB){toast('Pick two different scents');return;} size=sz; cur=S(layA); qty=2; combo=[layA,layB]; setSizeTo(sz); paintScent(); calc(); drydown(); renderIngredients(); window.scrollTo({top:0,behavior:'smooth'}); toast(S(layA).name+' + '+S(layB).name+' — '+SIZES[sz].label); }
  function renderPresets(){
    $('presets').innerHTML=PAIRS.slice(0,4).map(function(p){var A=S(p.a),B=S(p.b);return '<button class="preset" data-a="'+p.a+'" data-b="'+p.b+'"><span class="pdots"><i style="background:'+A.hex+'"></i><i style="background:'+B.hex+'"></i></span><div class="pn">'+p.n+'</div><div class="pp">'+A.name+' + '+B.name+'<br/>'+p.score+'% match · '+inr(priceFor('25',2))+' in 25ml</div></button>';}).join('');
    Array.prototype.forEach.call($('presets').querySelectorAll('.preset'),function(b){b.onclick=function(){layA=b.dataset.a;layB=b.dataset.b;renderLab();$('layering').scrollIntoView({behavior:'smooth'});};});
  }

  /* ── SETS ── */
  function paintSeg(){Array.prototype.forEach.call($('setSeg').querySelectorAll('button'),function(b){b.classList.toggle('on',b.dataset.sz===setSize);});}
  function renderCombos(){
    var list=SETS.filter(function(s){return s.sz===setSize;}), c=SIZES[setSize];
    $('combos').innerHTML=list.map(function(s){
      var n=s.ids.length, p=priceFor(setSize,n), mrp=n*c.mrp, ml=n*c.ml;
      var bots=s.ids.map(function(id){var sc=S(id);return '<span class="mini '+(setSize==='100'?'big':'small')+'" style="background:'+sc.soft+';border:1px solid '+sc.hex+'33"><i style="background:'+sc.hex+'"></i></span>';}).join('');
      return '<div class="combo"><div class="combo-top">'+bots+'</div><div class="combo-body"><div class="combo-n">'+s.n+'</div><div class="combo-d">'+s.d+'</div>'
        +'<div class="combo-p"><span class="a">'+inr(p)+'</span><span class="b">'+inr(mrp)+'</span><span class="c">Save '+inr(mrp-p)+'</span></div>'
        +'<div class="combo-ml">'+n+' × '+c.label+' · '+ml+'ml</div><button class="combo-btn" data-set="'+s.n+'">Add the set</button>'
        +'<div class="combo-perk">Free shipping · gift box included</div></div></div>';
    }).join('');
    Array.prototype.forEach.call($('combos').querySelectorAll('.combo-btn'),function(b){
      b.onclick=function(){ var s=SETS.filter(function(x){return x.n===b.dataset.set;})[0]; size=s.sz; qty=s.ids.length; combo=s.ids.slice(); cur=S(combo[0]); setSizeTo(size); paintScent(); calc(); drydown(); renderIngredients(); window.scrollTo({top:0,behavior:'smooth'}); toast(s.n+' loaded — press Add to cart'); };
    });
  }

  /* ── FAQ / PIN ── */
  $('faq').innerHTML=FAQ.map(function(x){return '<div class="q"><div class="q-t"><span>'+x[0]+'</span><span class="pm">+</span></div><div class="q-a">'+x[1]+'</div></div>';}).join('');
  $('faq').onclick=function(e){var q=e.target.closest('.q'); if(q)q.classList.toggle('open');};
  $('pinBtn').onclick=function(){ var p=$('pinIn').value.trim(); if(!/^\d{6}$/.test(p)){toast('Enter a valid 6-digit pincode');return;} var days=2+(+p.slice(-1)%3); var d=new Date(Date.now()+days*864e5); var fmt=d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}); $('pinOut').className='pin-out show'; $('pinOut').innerHTML='<div class="pin-line"><span class="ic">✓</span><span>Arrives by <b style="font-weight:500">'+fmt+'</b> — ships within 24 hours</span></div><div class="pin-line"><span class="ic">✓</span><span>Free shipping on orders over ₹1,499</span></div>'; };
  $('pinIn').onkeydown=function(e){if(e.key==='Enter')$('pinBtn').click();};

  /* ── EVENTS ── */
  $('scents').innerHTML=SCENTS.map(function(s){return '<button class="chip '+(s.id===cur.id?'on':'')+'" data-s="'+s.id+'"><span class="dot" style="background:'+s.hex+'"></span>'+s.name+'</button>';}).join('');
  $('scents').onclick=function(e){var b=e.target.closest('.chip'); if(!b)return; cur=S(b.dataset.s); combo[0]=cur.id; paintScent(); calc(); drydown(); renderIngredients();};
  $('sizes').onclick=function(e){var b=e.target.closest('.size'); if(b)setSizeTo(b.dataset.sz);};
  $('sizeHint').onclick=function(e){var b=e.target.closest('b'); if(!b)return; if(b.dataset.go==='25')setSizeTo('25'); else $('layering').scrollIntoView({behavior:'smooth'});};
  $('tiers').onclick=function(e){var b=e.target.closest('.tier'); if(!b)return; $('bulk').classList.remove('open'); setQty(+b.dataset.q);};
  $('bulkH').onclick=function(){$('bulk').classList.toggle('open');};
  $('qMinus').onclick=function(){setQty(qty-1,true);};
  $('qPlus').onclick=function(){setQty(qty+1,true);};
  $('ddSlider').oninput=drydown;
  ['labA','labB'].forEach(function(id){ $(id).onclick=function(e){var b=e.target.closest('.lab-chip'); if(!b)return; if(b.dataset.w==='a')layA=b.dataset.s; else layB=b.dataset.s; if(layA===layB)toast('Pick two different scents to layer'); renderLab();}; });
  $('mixBuy').onclick=function(){loadPair('25');}; $('mixBuyBig').onclick=function(){loadPair('100');};
  $('setSeg').onclick=function(e){var b=e.target.closest('button'); if(!b)return; setSize=b.dataset.sz; paintSeg(); renderCombos();};
  $('thumbs').onclick=function(e){var t=e.target.closest('.thumb'); if(!t)return; Array.prototype.forEach.call(document.querySelectorAll('.thumb'),function(x){x.classList.remove('on');}); t.classList.add('on'); $('galTag').textContent=t.dataset.t;};
  $('cta').onclick=function(){addToCart('/cart');}; $('stickyCta').onclick=function(){addToCart('/cart');};
  $('ctaBuy').onclick=function(){addToCart('/checkout');}; $('stickyBuy').onclick=function(){addToCart('/checkout');};

  var tt; function toast(m){$('toast').textContent=m; $('toast').classList.add('up'); clearTimeout(tt); tt=setTimeout(function(){$('toast').classList.remove('up');},3200);}
  if($('cta')){ try{ new IntersectionObserver(function(e){$('sticky').classList.toggle('up',!e[0].isIntersecting);},{threshold:0}).observe($('cta')); }catch(e){} }

  /* boot */
  fitCombo();
  renderSizes(); renderTiers(); renderBulk(); renderPicker(); renderAddons(); paintScent(); calc(); drydown(); renderIngredients(); renderLab(); renderPresets(); renderCombos(); paintSeg();
})();
