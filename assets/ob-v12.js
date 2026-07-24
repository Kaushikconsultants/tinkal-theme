/* Ombre Bliss — v12 product page logic. Editorial is brand content;
   variants/prices/cart come from window.OB_V12 (injected by the section). */
(function(){
'use strict';
var OB = window.OB_V12 || {};
var ROOT = document.querySelector('.obv12');
if(!ROOT) return;

var SIZES = OB.sizes || {
  '100':{ml:100,label:'100ml',role:'Your signature',unit:1499,mrp:1999,
    px:[0,1499,2549,2999,3799,4649,5449,6249,6999,7749,8449],
    quick:[{q:1,n:'One bottle',s:'Your signature'},{q:2,n:'Two bottles',s:'Day and night',b:'Most popular'},{q:3,n:'Three bottles',s:'A full wardrobe',b:'Best value',o:1}]},
  '25':{ml:25,label:'25ml',role:'Travel & layering',unit:499,mrp:599,
    px:[0,499,899,1249,1599,1899,2199,2499,2749,2999,3199],
    quick:[{q:1,n:'One bottle',s:'Try before you commit'},{q:3,n:'Three bottles',s:'Enough to layer',b:'Most popular'},{q:5,n:'Five bottles',s:'The whole wardrobe',b:'Best value',o:1}]}
};
var FREE_SHIP=1499, MAXQ=(OB.maxQ||10), CODE_PREFIX=OB.codePrefix||'OBC', HAS25=!!SIZES['25'];
var priceFor=function(z,q){return SIZES[z].px[Math.max(1,Math.min(MAXQ,q))];};
var offFor=function(z,q){return Math.round((1-priceFor(z,q)/(SIZES[z].mrp*q))*100);};
var pctFor=function(z,q){return 1-priceFor(z,q)/(SIZES[z].unit*q);};   /* real code fraction */

var NOTE_IMAGES=Object.assign({
  'Clary Sage':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Clary_Sage.webp?v=1750158959',
  'Lemon':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Lemon_222.avif?v=1750159250',
  'Neroli':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Neroli.jpg?v=1750158959',
  'Pink Pepper':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/pink-pepper-isolated-white-background_269410-1578.avif?v=1750157354',
  'Rum':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/istockphoto-1140849064-612x612.jpg?v=1750152974',
  'Styrax':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Styrax.webp?v=1750158959',
  'Tobacco Leaf':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Tobacco_Leaf.webp?v=1750158959',
  'Vanilla Bean':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Vanilla_Bean.webp?v=1750158959',
  'Vetiver Oil':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Vetiver_Oil.jpg?v=1750158959',
  /* real store photos reused for matching Couture notes */
  'Bergamot':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/bergamot.webp?v=1782296301',
  'Jasmine':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/Jasmin_2010a34c-0b81-48f2-9871-b05c4b50a00c.webp?v=1782293377',
  'Patchouli':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/patchouli_fbf193f2-0d6d-4975-836e-ff7d6426c05a.webp?v=1782298796',
  'Vetiver':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/vetiver_8ce949bd-93da-4b6a-98be-6439e1d4116e.webp?v=1782294875',
  'Sandalwood':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/sandal_wood.jpg?v=1742376493',
  'Vanilla':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/vanilla.jpg?v=1742376493',
  'Leather':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/leather.jpg?v=1742383224',
  'Agarwood':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/agarwood.jpg?v=1742376493',
  'Rose':'https://cdn.shopify.com/s/files/1/0694/0478/6914/files/rose_888124a9-9de1-4f31-95d9-61efab00f24a.webp?v=1782297808'
}, OB.noteImages||{});
/* real store photo per scent family — every note resolves to a real image, no SVG */
var IB='https://cdn.shopify.com/s/files/1/0694/0478/6914/files/';
var FAMIMG={
  citrus:IB+'lemon.webp?v=1782296301', pepper:IB+'pepper.webp?v=1782294875',
  spice:IB+'piecrec_Warm_spicy.webp?v=1742382749', wood:IB+'cedar.webp?v=1782294875',
  moss:IB+'vetiver_8ce949bd-93da-4b6a-98be-6439e1d4116e.webp?v=1782294875',
  oud:IB+'agarwood.jpg?v=1742376493', leather:IB+'leather.jpg?v=1742383224',
  tobacco:IB+'Tobacco_Leaf.webp?v=1750158959', vanilla:IB+'vanilla.jpg?v=1742376493',
  sugar:IB+'sugar.webp?v=1742376493', nut:IB+'almonds.webp?v=1782296301',
  cacao:IB+'coffee.webp?v=1782296301', rose:IB+'rose_888124a9-9de1-4f31-95d9-61efab00f24a.webp?v=1782297808',
  floral:IB+'Jasmin_2010a34c-0b81-48f2-9871-b05c4b50a00c.webp?v=1782293377',
  amber:IB+'woody-amber.webp?v=1782298796', musk:IB+'benzoin_b41c289f-a5f0-4be4-b973-7a0d5464453d.webp?v=1782294875',
  tea:IB+'sage.webp?v=1782297066', booze:IB+'istockphoto-1140849064-612x612.jpg?v=1750152974',
  lavender:IB+'geranium.webp?v=1782297066'
};
function noteImg(n){ return NOTE_IMAGES[n] || FAMIMG[NF[n]||'wood'] || FAMIMG.wood; }

var FAM={
 citrus:{bg:'#FBF2E0',d:'Cold-pressed peel. Sharp, sunny, gone in twenty minutes.',g:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#E9A93B"/><circle cx="50" cy="50" r="27" fill="#F6CE79"/><g stroke="#FBF2E0" stroke-width="2"><line x1="50" y1="50" x2="50" y2="23"/><line x1="50" y1="50" x2="77" y2="50"/><line x1="50" y1="50" x2="50" y2="77"/><line x1="50" y1="50" x2="23" y2="50"/><line x1="50" y1="50" x2="69" y2="31"/><line x1="50" y1="50" x2="69" y2="69"/><line x1="50" y1="50" x2="31" y2="69"/><line x1="50" y1="50" x2="31" y2="31"/></g><circle cx="50" cy="50" r="4" fill="#FBF2E0"/></svg>'},
 pepper:{bg:'#F8ECEE',d:'Dried berries. A dry, prickly heat that opens the nose.',g:'<svg viewBox="0 0 100 100"><circle cx="36" cy="42" r="12" fill="#B4485C"/><circle cx="60" cy="34" r="9" fill="#CE6C7E"/><circle cx="54" cy="60" r="14" fill="#9E3A4D"/><circle cx="32" cy="66" r="8" fill="#CE6C7E"/><circle cx="72" cy="58" r="7" fill="#B4485C"/></svg>'},
 spice:{bg:'#F8F0E3',d:'Ground bark and pods. Warm, dry, faintly sweet.',g:'<svg viewBox="0 0 100 100"><rect x="24" y="30" width="10" height="46" rx="5" fill="#8E5A1E"/><rect x="38" y="24" width="10" height="52" rx="5" fill="#B5762C"/><rect x="52" y="30" width="10" height="46" rx="5" fill="#8E5A1E"/><rect x="66" y="34" width="10" height="42" rx="5" fill="#C99150"/></svg>'},
 wood:{bg:'#F1EEE7',d:'Rasped heartwood. Dry, grounding, quietly green.',g:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#9C8A6E"/><circle cx="50" cy="50" r="27" fill="none" stroke="#7A6A52" stroke-width="3"/><circle cx="50" cy="50" r="19" fill="none" stroke="#7A6A52" stroke-width="3"/><circle cx="50" cy="50" r="11" fill="none" stroke="#7A6A52" stroke-width="3"/><circle cx="50" cy="50" r="4" fill="#5E5140"/></svg>'},
 oud:{bg:'#F1E8E9',d:'Resin-soaked agarwood. Smoky, animalic, worth the price.',g:'<svg viewBox="0 0 100 100"><path d="M28 74 L38 26 L50 46 L60 22 L72 74 Z" fill="#4B2A2F"/><path d="M38 74 L46 40 L54 58 L62 74 Z" fill="#6E4046"/></svg>'},
 leather:{bg:'#F2ECE5',d:'Tanned hide. Dry, smoky, a little smoked-out.',g:'<svg viewBox="0 0 100 100"><rect x="22" y="26" width="56" height="48" rx="4" fill="#6B4B33"/><rect x="28" y="32" width="44" height="36" rx="2" fill="none" stroke="#A0785A" stroke-width="1.5" stroke-dasharray="4 3"/></svg>'},
 tobacco:{bg:'#F5F0E3',d:'Cured leaf. Honeyed, dry, like an old library.',g:'<svg viewBox="0 0 100 100"><path d="M50 20 C24 34 24 66 50 82 C76 66 76 34 50 20 Z" fill="#7C5A22"/><path d="M50 20 V82" stroke="#A98442" stroke-width="2"/></svg>'},
 vanilla:{bg:'#F8F1E6',d:'Cured pod, split open. Creamy, boozy, never sugary.',g:'<svg viewBox="0 0 100 100"><rect x="30" y="22" width="9" height="58" rx="4.5" fill="#4E3620"/><rect x="45" y="18" width="9" height="64" rx="4.5" fill="#6B4A2C"/><rect x="60" y="24" width="9" height="56" rx="4.5" fill="#4E3620"/></svg>'},
 sugar:{bg:'#FBEFF3',d:'Spun and caramelised. Sweet, sticky, unapologetic.',g:'<svg viewBox="0 0 100 100"><circle cx="50" cy="44" r="26" fill="#E9AEC2"/><circle cx="50" cy="44" r="18" fill="#F5D2DD"/><rect x="47" y="66" width="6" height="18" rx="3" fill="#C9C1B4"/></svg>'},
 nut:{bg:'#F0F3E7',d:'Shelled and roasted. Green, buttery, faintly milky.',g:'<svg viewBox="0 0 100 100"><ellipse cx="38" cy="52" rx="18" ry="24" fill="#B79A6A"/><ellipse cx="38" cy="52" rx="12" ry="17" fill="#8CA35C"/><ellipse cx="66" cy="44" rx="14" ry="19" fill="#C9AE80"/><ellipse cx="66" cy="44" rx="9" ry="13" fill="#A3B876"/></svg>'},
 cacao:{bg:'#F1EAE4',d:'Roasted nib. Bitter, dusty, dark.',g:'<svg viewBox="0 0 100 100"><rect x="24" y="30" width="52" height="40" rx="3" fill="#5A3A26"/><g stroke="#7E5537" stroke-width="2"><path d="M24 43 h52 M24 57 h52 M41 30 v40 M59 30 v40"/></g></svg>'},
 rose:{bg:'#FAEDF0',d:'Petals picked at dawn. Fresh, green, honeyed.',g:'<svg viewBox="0 0 100 100"><circle cx="50" cy="46" r="28" fill="#E0A0B4"/><circle cx="50" cy="46" r="21" fill="#C2607B"/><circle cx="50" cy="46" r="13" fill="#A34561"/><circle cx="50" cy="46" r="6" fill="#8A3550"/></svg>'},
 floral:{bg:'#F8F4E7',d:'Night-picked petals. Creamy, heady, a little indolic.',g:'<svg viewBox="0 0 100 100"><g fill="#F2E6BE"><ellipse cx="50" cy="30" rx="13" ry="8"/><ellipse cx="67" cy="42" rx="13" ry="8" transform="rotate(60 67 42)"/><ellipse cx="67" cy="62" rx="13" ry="8" transform="rotate(120 67 62)"/><ellipse cx="50" cy="72" rx="13" ry="8"/><ellipse cx="33" cy="62" rx="13" ry="8" transform="rotate(60 33 62)"/><ellipse cx="33" cy="42" rx="13" ry="8" transform="rotate(120 33 42)"/></g><circle cx="50" cy="51" r="9" fill="#D8C68B"/></svg>'},
 amber:{bg:'#F9F1E2',d:'Fossilised resin. Warm, sweet, glowing.',g:'<svg viewBox="0 0 100 100"><path d="M50 20 C70 26 80 46 76 64 C72 80 56 84 50 84 C44 84 28 80 24 64 C20 46 30 26 50 20 Z" fill="#C08B3A"/></svg>'},
 musk:{bg:'#F4F2ED',d:'Clean, warm, skin-like. Why it smells like you.',g:'<svg viewBox="0 0 100 100"><circle cx="42" cy="48" r="20" fill="#DAD5CA"/><circle cx="60" cy="42" r="16" fill="#C3BDB1"/><circle cx="56" cy="62" r="14" fill="#EAE7E0"/></svg>'},
 tea:{bg:'#EFF1EA',d:'Dried and smoked leaf. Tannic, dry, faintly bitter.',g:'<svg viewBox="0 0 100 100"><path d="M50 22 C28 36 26 62 44 78 C64 66 70 40 50 22 Z" fill="#5E6B4A"/></svg>'},
 booze:{bg:'#F6EFE5',d:'Aged in oak. Sweet, sharp, warming on contact.',g:'<svg viewBox="0 0 100 100"><path d="M32 22 h36 l-4 46 a14 10 0 0 1 -28 0 Z" fill="none" stroke="#8C5A2B" stroke-width="3"/><path d="M35 42 h30 l-2.5 26 a12 8 0 0 1 -25 0 Z" fill="#B5762C"/></svg>'},
 lavender:{bg:'#F1F0F8',d:'Steam-distilled flower. Herbal, cool, faintly medicinal.',g:'<svg viewBox="0 0 100 100"><path d="M50 84 V44" stroke="#6E8F4E" stroke-width="3"/><g fill="#8C86BE"><ellipse cx="44" cy="20" rx="6" ry="4"/><ellipse cx="56" cy="26" rx="6" ry="4"/><ellipse cx="44" cy="32" rx="6" ry="4"/><ellipse cx="56" cy="38" rx="6" ry="4"/></g></svg>'},
 moss:{bg:'#EFF2EA',d:'Forest floor. Damp, green, mineral.',g:'<svg viewBox="0 0 100 100"><circle cx="34" cy="58" r="14" fill="#5F7248"/><circle cx="56" cy="50" r="18" fill="#7A8F5E"/><circle cx="68" cy="66" r="11" fill="#5F7248"/></svg>'}
};
var NF={'Lemon':'citrus','Citrus':'citrus','Bergamot':'citrus','Sicilian Orange':'citrus','Citron':'citrus','Pink Pepper':'pepper','Cardamom':'spice','Ginger':'spice','Cinnamon':'spice','Spice Mix':'spice','Angelica':'spice','Clary Sage':'spice','Vetiver':'wood','Vetiver Oil':'wood','Sandalwood':'wood','Guaiac Wood':'wood','Cashmeran':'wood','Patchouli':'wood','Galbanum':'wood','Violet Leaves':'wood','Moss':'moss','Oud':'oud','Agarwood':'oud','Styrax':'oud','Leather':'leather','Tobacco':'tobacco','Tobacco Leaf':'tobacco','Vanilla':'vanilla','Vanilla Bean':'vanilla','Vanilla Fusion':'vanilla','Vanilla Caviar':'vanilla','Tonka Bean':'vanilla','Tonka Beans':'vanilla','Brown Sugar':'sugar','White Caramel':'sugar','Rock Sugar':'sugar','Cotton Candy':'sugar','Marshmallow':'sugar','Bubble Gum':'sugar','Candied Pear':'sugar','Gelato':'sugar','Raspberry':'sugar','Pistachio':'nut','Hazelnut':'nut','Cacao':'cacao','Cocoa':'cacao','Rose':'rose','Damask Rose':'rose','Rose Bloom':'rose','Neroli':'floral','Tunisian Neroli':'floral','Jasmine':'floral','Sambac':'floral','Peony':'floral','Orchid':'floral','Floral':'floral','Amber':'amber','White Musk':'musk','Black Tea':'tea','Rum':'booze','Lavender':'lavender'};

var SC = OB.scents || [
 {id:'smoky',name:'Smoky Rum',hex:'#8C3A1E',soft:'#F7EDE7',fam:'Smoky · Boozy',lean:'Unisex, leans masculine',short:'Pepper | Rum | Woody',line:'Dark rum spilled on tobacco leaf. Warm, smoky, impossible to ignore.',top:['Pink Pepper','Lemon','Neroli'],mid:['Rum','Clary Sage','Vetiver Oil'],base:['Tobacco Leaf','Vanilla Bean','Styrax'],lg:9,sl:8,sw:4,s:{winter:3,summer:1,night:3,day:2},wear:"You're the last one to leave, and everyone remembers it."},
 {id:'blu',name:'Ombre Blu',hex:'#2C5A8C',soft:'#EAF0F7',fam:'Fresh · Spicy',lean:'Unisex',short:'Citrus | Ginger | Tea',line:'Sicilian citrus with a warm spine of ginger and black tea. Clean, never boring.',top:['Bergamot','Sicilian Orange','Citron'],mid:['Tunisian Neroli','Ginger','Cinnamon'],base:['Black Tea','Guaiac Wood','Amber'],lg:7,sl:6,sw:3,s:{winter:2,summer:3,night:2,day:3},wear:'You show up early and everything about you is ironed.'},
 {id:'leather',name:'Classic Leather',hex:'#5B4636',soft:'#F2EEE9',fam:'Leather · Woody',lean:'Leans masculine',short:'Leather | Floral | Spicy',line:'Cardamom and cured leather. The scent of a very good jacket.',top:['Cardamom','Leather','Citrus'],mid:['Jasmine','Sambac','Moss'],base:['Vetiver','Patchouli','Amber'],lg:9,sl:7,sw:2,s:{winter:3,summer:1,night:3,day:2},wear:'You own one good watch and wear it every single day.'},
 {id:'oud',name:'Nawab Oud',hex:'#6B2237',soft:'#F6EAED',fam:'Oud · Oriental',lean:'Unisex',short:'Oud | Rose | Amber',line:'Agarwood and rose, the way Lucknow does it. Regal, not loud.',top:['Oud','Bergamot','Neroli'],mid:['Rose','Patchouli','Floral'],base:['Amber','Vanilla Bean','Agarwood'],lg:10,sl:9,sw:3,s:{winter:3,summer:1,night:3,day:1},wear:'You walk into a room slowly and it still turns.'},
 {id:'tobacco',name:'Royale Tobacco',hex:'#7A4A1F',soft:'#F5EEE5',fam:'Spicy · Tobacco',lean:'Leans masculine',short:'Cinnamon | Tonka | Tobacco',line:'Cinnamon and pipe tobacco wrapped in tonka. Old money, no logo.',top:['Cinnamon','Tobacco','Cardamom'],mid:['Sandalwood','Patchouli','Floral'],base:['Spice Mix','Vanilla','Tonka Bean'],lg:9,sl:8,sw:5,s:{winter:3,summer:1,night:3,day:2},wear:"You'd rather be underestimated than announced."},
 {id:'vanilla',name:'Vanilla Kiss',hex:'#B98A4E',soft:'#F9F2E8',fam:'Vanilla · Boozy',lean:'Unisex',short:'Vanilla | Rum | Amber',line:'Vanilla with rum and brown sugar, grounded by oud. Soft, then addictive.',top:['Vanilla','Orchid','Jasmine'],mid:['Brown Sugar','Rum','Tonka Beans'],base:['Oud','Patchouli','Amber'],lg:8,sl:7,sw:9,s:{winter:3,summer:2,night:3,day:2},wear:'People remember your hug before your face.'},
 {id:'amberrose',name:'Amber Rose',hex:'#A8546A',soft:'#F9EEF1',fam:'Rose · Amber',lean:'Leans feminine',short:'Rose | Amber | Musk',line:'Damask rose with pink pepper and cashmere musk. Romantic, with an edge.',top:['Bergamot','Galbanum','Pink Pepper'],mid:['Damask Rose','Angelica','Amber'],base:['White Musk','Cashmeran','Rose Bloom'],lg:8,sl:7,sw:6,s:{winter:3,summer:2,night:3,day:3},wear:'Soft on the outside, absolutely not on the inside.'},
 {id:'angel',name:'Angel',hex:'#7A6BA8',soft:'#F1EFF8',fam:'Gourmand · Oriental',lean:'Leans feminine',short:'Lavender | Spicy | Cocoa',line:'Lavender and cocoa over vanilla caviar. Sweet, strange, unforgettable.',top:['Vanilla Fusion','Lavender','Cocoa'],mid:['Ginger','Vanilla Caviar','Tonka Beans'],base:['Spice Mix','Sandalwood','Amber'],lg:9,sl:9,sw:8,s:{winter:3,summer:1,night:3,day:2},wear:"You don't follow the trend, you predate it."},
 {id:'pistachio',name:'Pistachio Pop',hex:'#6E8F4E',soft:'#EEF3E8',fam:'Gourmand · Nutty',lean:'Leans feminine',short:'Nutty | Creamy | Sweet',line:'Pistachio gelato on a hot afternoon. Sweet, creamy, ridiculously moreish.',top:['Pistachio','Gelato','Hazelnut'],mid:['Peony','Jasmine','Raspberry'],base:['Cotton Candy','Marshmallow','Cacao'],lg:7,sl:7,sw:9,s:{winter:2,summer:3,night:2,day:3},wear:"People hug you and then ask what you're wearing."},
 {id:'candy',name:'Lush Candy',hex:'#C4527D',soft:'#FBEDF2',fam:'Gourmand · Sweet',lean:'Leans feminine',short:'Berries | Vanilla | Musk',line:'Candied pear and bubblegum over warm sandalwood. Playful, then grown-up.',top:['Candied Pear','Violet Leaves'],mid:['Jasmine','Bubble Gum','White Caramel'],base:['Sandalwood','Patchouli','Rock Sugar'],lg:7,sl:6,sw:10,s:{winter:2,summer:3,night:2,day:3},wear:'Your laugh is the loudest thing in the room and you like it that way.'}
];
SC.forEach(function(s){ var v=(OB.variants||{})[s.id]||{}; s.v100=v.v100; s.v25=v.v25; s.imgs=v.imgs||[]; s.img100=v.img100; s.img25=v.img25; s.url=v.url; });

var PARTNER={smoky:['vanilla','the smoke turns to dessert'],blu:['leather','citrus opens the leather up'],leather:['oud','two heavyweights that stack'],oud:['amberrose','the oldest pairing there is'],tobacco:['vanilla','softens a dry tobacco'],vanilla:['smoky','cream over the smoke'],amberrose:['oud','rose sits on oud perfectly'],angel:['blu','bergamot cools the cocoa'],pistachio:['tobacco','smells like the best mithai shop'],candy:['vanilla','anchors the sugar']};

var size='100', cur=null, qty=2, combo=[], addons=(HAS25?{layer:true,travel:true}:{}), stage=0, pick=null;
var $=function(i){return document.getElementById(i);};
var S=function(id){for(var i=0;i<SC.length;i++){if(SC[i].id===id)return SC[i];}return null;};
var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN');};
var cf=function(){return SIZES[size];};
cur=S(OB.currentScent)||SC[0];
combo=[cur.id, (PARTNER[cur.id]||['vanilla'])[0]];

var STAGES=[{k:'top',t:'First spray',w:'0–15 min'},{k:'mid',t:'The heart',w:'15 min – 3 hr'},{k:'base',t:'The dry-down',w:'3 – 10 hr'}];
function fit(){ while(combo.length<qty) combo.push(SC[combo.length%SC.length].id); combo=combo.slice(0,qty); combo[0]=cur.id; }
function setQty(n,open){ qty=Math.max(1,Math.min(MAXQ,n)); fit(); if(open)$('bulk').classList.add('open'); tiers(); bulk(); picker(); renderFbt(); calc(); }

/* GALLERY */
function heroList(){
  var l=(cur.imgs&&cur.imgs.length)?cur.imgs.slice():[];
  var si=size==='100'?cur.img100:cur.img25;
  if(si){ var idx=l.indexOf(si); if(idx>0){l.splice(idx,1);l.unshift(si);} else if(idx<0){l.unshift(si);} }
  if(!l.length){ var f=cur.img100||cur.img25; if(f)l=[f]; }
  return l;
}
function renderGallery(){
  var list=heroList();
  if($('mainImg')) $('mainImg').src=list[0]||'';
  $('thumbs').innerHTML=list.map(function(u,i){return '<button class="th '+(i===0?'on':'')+'" data-src="'+u+'"><img src="'+u+'" loading="lazy" alt=""></button>';}).join('');
  Array.prototype.forEach.call($('thumbs').querySelectorAll('.th'),function(t){ t.onclick=function(){ setMain(t.dataset.src); Array.prototype.forEach.call($('thumbs').querySelectorAll('.th'),function(x){x.classList.toggle('on',x===t);}); }; });
}
function setMain(src){ if($('mainImg')&&src)$('mainImg').src=src; }

/* PROFILE */
function profile(){
  var s=cur;
  var mts=[['Longevity',s.lg,s.lg>=9?'8–10 hrs':s.lg>=8?'7–9 hrs':'5–7 hrs'],['Projection',s.sl,s.sl>=8?'Strong':s.sl>=7?'Moderate':'Close'],['Sweetness',s.sw,s.sw>=8?'Very sweet':s.sw>=5?'Balanced':'Dry']];
  var pip=function(n){return [1,2,3].map(function(i){return '<span class="pip '+(i<=n?'on':'')+'"></span>';}).join('');};
  var rows=[['Winter',s.s.winter],['Summer',s.s.summer],['Night',s.s.night],['Day',s.s.day]];
  $('prof').innerHTML='<div class="pf-band"><span class="fam">'+s.fam+'</span><span class="con">Extrait · 25% · '+s.lean+'</span></div><div class="pf-mid"><div class="pf-mt">'+mts.map(function(m){return '<div class="mt"><span class="l">'+m[0]+'</span><span class="t"><span class="f" style="width:'+(m[1]*10)+'%"></span></span><span class="v">'+m[2]+'</span></div>';}).join('')+'</div><div class="pf-wh">'+rows.map(function(r){return '<div class="wr"><span>'+r[0]+'</span><span class="pips">'+pip(r[1])+'</span></div>';}).join('')+'</div></div><div class="pf-if"><b>Wear this if</b><div class="v">'+s.wear+'</div></div>';
}
/* STRIP */
function allNotes(){ return cur.top.map(function(n){return [n,'top'];}).concat(cur.mid.map(function(n){return [n,'mid'];}),cur.base.map(function(n){return [n,'base'];})); }
function strip(){
  var st=STAGES[stage];
  $('stTab').innerHTML=STAGES.map(function(s,i){return '<button class="st-b '+(i===stage?'on':'')+'" data-s="'+i+'"><span class="a">'+s.w+'</span><span class="b">'+s.t+'</span></button>';}).join('');
  $('stTab').style.setProperty('--sx',(stage*100)+'%');
  Array.prototype.forEach.call($('stTab').querySelectorAll('.st-b'),function(b){b.onclick=function(){stage=+b.dataset.s;pick=null;strip();};});
  var inSt=allNotes().filter(function(a){return a[1]===st.k;});
  $('stDots').innerHTML=inSt.map(function(a){var n=a[0],f=FAM[NF[n]||'wood'];return '<span class="nd lit '+(pick===n?'sel':'')+'" data-n="'+n+'" title="'+n+'" style="background:'+f.bg+'"><img src="'+noteImg(n)+'" alt="'+n+'" loading="lazy"></span>';}).join('');
  Array.prototype.forEach.call($('stDots').querySelectorAll('.nd'),function(d){d.onclick=function(){pick=pick===d.dataset.n?null:d.dataset.n;strip();};});
  if(pick){ $('stN').textContent=pick; $('stD').textContent=(FAM[NF[pick]||'wood']).d; }
  else{ $('stN').textContent=inSt.map(function(a){return a[0];}).join(' · '); $('stD').textContent=stage===0?'What people notice first, across a room.':stage===1?'The real scent, once the opening burns off.':'Close to the skin — still there tomorrow morning.'; }
}
/* SIZE */
function sizes(){
  var pm=function(k){return SIZES[k].unit/SIZES[k].ml;};
  var better=HAS25?Math.round((1-pm('100')/pm('25'))*100):0;
  $('sizes').innerHTML=Object.keys(SIZES).map(function(k){var c=SIZES[k],win=k==='100';return '<button class="sz '+(k===size?'on':'')+'" data-z="'+k+'">'+(win&&better>0?'<span class="bdg">'+better+'% better value</span>':'')+'<div class="t">'+c.label+'</div><div class="r">'+c.role+'</div><div class="p">'+inr(c.unit)+'<s>'+inr(c.mrp)+'</s></div><div class="m">₹'+pm(k).toFixed(2)+' per ml</div></button>';}).join('');
  Array.prototype.forEach.call($('sizes').querySelectorAll('.sz'),function(b){b.onclick=function(){setSizeTo(b.dataset.z);};});
}
function setSizeTo(k){ size=k; fit(); $('gscale').textContent=SIZES[k].label+' — shown to scale'; renderGallery(); sizes(); tiers(); bulk(); picker(); renderFbt(); calc(); }
/* TIERS */
function tiers(){
  $('tiers').innerHTML=cf().quick.map(function(t){var p=priceFor(size,t.q),mrp=t.q*cf().mrp;return '<button class="tier '+(t.q===qty?'on':'')+'" data-q="'+t.q+'">'+(t.b?'<span class="bdg2 '+(t.o?'o':'')+'">'+t.b+'</span>':'')+'<span class="rad"></span><span><span class="n">'+t.n+'</span><span class="s">'+t.s+(t.q>1?' · '+inr(p/t.q)+' each · '+offFor(size,t.q)+'% off':'')+'</span></span><span class="pr">'+(t.q>1?'<span class="b">'+inr(mrp)+'</span>':'')+'<span class="a">'+inr(p)+'</span></span></button>';}).join('');
  Array.prototype.forEach.call($('tiers').querySelectorAll('.tier'),function(b){b.onclick=function(){$('bulk').classList.remove('open');setQty(+b.dataset.q);};});
}
/* BULK */
function bulk(){
  var u=cf().unit, best=priceFor(size,MAXQ)/MAXQ;
  $('bulkSub').innerHTML='<b>'+inr(u)+'</b> each &rarr; <b>'+inr(best)+'</b> each at '+MAXQ+' bottles';
  $('bulkCta').textContent=$('bulk').classList.contains('open')?'Close':'Open';
  $('lad').innerHTML=Array.apply(null,{length:MAXQ}).map(function(_,i){var q=i+1,o=offFor(size,q);return '<button class="rg '+(q===qty?'on':'')+' '+(q<=qty?'reached':'')+'" data-q="'+q+'" title="'+q+' × '+cf().label+' — '+inr(priceFor(size,q))+'"><span class="rq">'+q+'</span><span class="ro">'+(o?o+'%':'—')+'</span></button>';}).join('');
  Array.prototype.forEach.call($('lad').querySelectorAll('.rg'),function(r){r.onclick=function(){setQty(+r.dataset.q,true);};});
  var paid=priceFor(size,qty), full=u*qty, saved=full-paid, free=saved/u;
  $('bulkHook').innerHTML=qty<2?'<span class="bh-l">Take a second bottle and the discount starts. By <b>'+MAXQ+'</b> you\'re paying <b>'+inr(best)+'</b> a bottle.</span><span class="bh-r"><span class="n">'+offFor(size,MAXQ)+'%</span><span class="x">Max discount</span></span>':'<span class="bh-l">At '+qty+' bottles you\'re saving <b>'+inr(saved)+'</b> against the single-bottle price.</span><span class="bh-r"><span class="n">'+(free>=1?free.toFixed(1).replace('.0','')+'×':'—')+'</span><span class="x">'+(free>=1?'bottles free, in effect':'keep going')+'</span></span>';
  if(qty<MAXQ){ var ex=priceFor(size,qty+1)-priceFor(size,qty); $('nudge').innerHTML='<span>Your next bottle costs just <b>'+inr(ex)+'</b> instead of '+inr(u)+' — the whole box drops to <b>'+offFor(size,qty+1)+'% off</b>.</span><button id="nB">Add one</button>'; $('nB').onclick=function(){setQty(qty+1,true);}; }
  else $('nudge').innerHTML='<span>Maximum box · <b>'+offFor(size,MAXQ)+'% off</b> · '+inr(best)+' a bottle. Nothing goes lower.</span>';
}
/* PICKER */
function picker(){
  if(qty===1){$('pick').style.display='none';return;}
  $('pick').style.display='block';
  var tip=qty>=3?'<div class="pr-tip">Tip — pair one heavy scent (Oud, Leather, Tobacco) with one sweet one (Vanilla, Pistachio, Candy). That\'s a layering pair.</div>':'';
  var rows=combo.map(function(id,i){return '<div class="pr-r"><span class="n">No. '+(i+1)+'</span><select data-i="'+i+'">'+SC.map(function(s){return '<option value="'+s.id+'" '+(s.id===id?'selected':'')+'>'+s.name+'</option>';}).join('')+'</select></div>';}).join('');
  $('pick').innerHTML=(qty>3?'<div class="g2">'+rows+'</div>':rows)+tip;
  Array.prototype.forEach.call($('pick').querySelectorAll('select'),function(s){s.onchange=function(e){combo[+e.target.dataset.i]=e.target.value;calc();};});
}
/* FBT — honest: no fake bundle; add-ons discounted by the same code fraction */
function addonList(){
  var out=[]; var p=(PARTNER[cur.id]||['vanilla'])[0]; var why=(PARTNER[cur.id]||['vanilla',''])[1];
  if(addons.layer) out.push({k:'layer',scent:S(p),n:S(p).name+' · 25ml',s:'Layers with '+cur.name+' — <em>'+why+'</em>'});
  if(addons.travel) out.push({k:'travel',scent:cur,n:cur.name+' travel spray · 25ml',s:'The same scent, pocket sized'});
  return out;
}
function renderFbt(){
  var pc=pctFor(size,qty);
  var pAd=499;
  var p=(PARTNER[cur.id]||['vanilla'])[0], why=(PARTNER[cur.id]||['vanilla',''])[1];
  var items=[{k:'this',lock:1,n:cur.name+' · '+cf().label,s:qty+' bottle'+(qty>1?'s':'')+(qty>1?' · mix any scents':''),p:priceFor(size,qty),was:qty*cf().mrp}];
  if(HAS25){ items.push({k:'layer',n:S(p).name+' · 25ml',s:'Layers with '+cur.name+' — <em>'+why+'</em>',p:pAd,was:599},{k:'travel',n:cur.name+' travel spray · 25ml',s:'The same scent, pocket sized',p:pAd,was:599}); }
  function on(k){return k==='this'||addons[k];}
  $('fbtList').innerHTML=items.map(function(it){return '<button class="fbt-i '+(on(it.k)?'on':'')+' '+(it.lock?'lock':'')+'" data-k="'+it.k+'"><span class="bx"></span><span class="t"><span class="n">'+(it.lock?'This item — ':'')+it.n+'</span><span class="s">'+it.s+'</span></span><span class="p">'+inr(it.p)+(it.was>it.p?'<s>'+inr(it.was)+'</s>':'')+'</span></button>';}).join('');
  Array.prototype.forEach.call($('fbtList').querySelectorAll('.fbt-i'),function(b){b.onclick=function(){var k=b.dataset.k;if(k==='this')return;addons[k]=!addons[k];renderFbt();calc();};});
  var onItems=items.filter(function(it){return on(it.k);});
  var tot=onItems.reduce(function(a,i){return a+i.p;},0);
  var was=onItems.reduce(function(a,i){return a+i.was;},0);
  $('fbtN').textContent=onItems.length;
  $('fbtAmt').textContent=inr(tot);
  $('fbtWas').textContent=was>tot?inr(was):'';
  $('fbtSv').textContent=was>tot?'You save '+inr(was-tot):'';
  $('fbtSv').style.display=was>tot?'block':'none';
  $('fbtBtn').textContent='Add all '+onItems.length+' to cart · '+inr(tot);
}
/* CALC */
function calc(){
  var pc=pctFor(size,qty), pAd=499;
  var nAd=(addons.layer?1:0)+(addons.travel?1:0);
  var sub=priceFor(size,qty)+nAd*pAd;
  var mrp=qty*cf().mrp+nAd*599;
  var saved=mrp-sub;
  $('totAmt').textContent=inr(sub);
  $('wasAmt').textContent=mrp>sub?inr(mrp):'';
  $('save').style.display=saved>0?'flex':'none';
  $('saveAmt').innerHTML=inr(saved)+' <span style="font-size:11px;font-weight:600">· '+offFor(size,qty)+'% off</span>';
  var ml=qty*cf().ml+nAd*25;
  $('ctaN').textContent=qty+' × '+cf().label+' · '+ml+'ml · '+inr(sub/ml)+' per ml · GST included';
  var pct=Math.min(100,sub/FREE_SHIP*100);
  $('shipF').style.width=pct+'%';
  if(sub>=FREE_SHIP){$('shipX').textContent='✓ Free shipping unlocked';$('shipX').classList.add('done');}else{$('shipX').textContent='Add '+inr(FREE_SHIP-sub)+' more for free shipping';$('shipX').classList.remove('done');}
  $('satcN').textContent=qty>1?qty+' bottles':cur.name;
  $('satcM').textContent=cf().label+' · '+combo.slice(0,qty).map(function(i){return S(i).name;}).join(', ');
  $('satcA').textContent=inr(sub);
  $('satcW').textContent=mrp>sub?inr(mrp):'';
  $('satcSv').textContent=saved>0?'Save '+inr(saved):'';
  $('satcSv').style.display=saved>0?'block':'none';
  $('satcJ').style.background=cur.hex;
}
/* PAINT */
function paint(){
  ROOT.style.setProperty('--scent',cur.hex); ROOT.style.setProperty('--scent-soft',cur.soft);
  $('frame').style.background=cur.soft;
  $('pName').textContent=cur.name; $('pLine').textContent=cur.line; $('famL').textContent=cur.fam;
  Array.prototype.forEach.call(document.querySelectorAll('#chips .ch'),function(c){c.classList.toggle('on',c.dataset.s===cur.id);});
  renderGallery();
}
/* CART */
function variantFor(id,sz){ var s=S(id); return s?(sz==='100'?s.v100:s.v25):null; }
function cartItems(){
  var counts={};
  combo.slice(0,qty).forEach(function(id){var v=variantFor(id,size); if(v)counts[v]=(counts[v]||0)+1;});
  if(addons.layer){ var lp=(PARTNER[cur.id]||['vanilla'])[0]; var v=variantFor(lp,'25'); if(v)counts[v]=(counts[v]||0)+1; }
  if(addons.travel){ var v2=variantFor(cur.id,'25'); if(v2)counts[v2]=(counts[v2]||0)+1; }
  return Object.keys(counts).map(function(v){return {id:parseInt(v,10),quantity:counts[v]};});
}
function tierCode(){ return qty>1 ? CODE_PREFIX+size+'Q'+qty : null; }
var busy=false;
function setBusy(b,btn){ busy=b; ['cta','ctaBuy','satcAdd','satcBuy','fbtBtn'].forEach(function(i){var e=$(i);if(e){e.disabled=b;e.classList.remove('is-loading');}}); if(b&&btn)btn.classList.add('is-loading'); }
function go(dest,btn){
  if(busy)return;
  var items=cartItems();
  if(!items.length){toast('Pick a scent first');return;}
  dest=dest||'/cart'; setBusy(true,btn);
  var done=false, timer=setTimeout(function(){if(!done){done=true;setBusy(false);toast('Network slow — please tap again');}},12000);
  fetch('/cart/clear.js',{method:'POST'})
   .then(function(){return fetch('/cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount:''})});})
   .then(function(){return fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:items})});})
   .then(function(r){if(!r.ok)throw new Error('add');return r.json();})
   .then(function(){if(done)return;done=true;clearTimeout(timer);var c=tierCode();window.location.href=c?('/discount/'+encodeURIComponent(c)+'?redirect='+encodeURIComponent(dest)):dest;})
   .catch(function(){if(done)return;done=true;clearTimeout(timer);setBusy(false);toast('Could not add to cart — please try again');});
}
var tt; function toast(m){$('toast').textContent=m;$('toast').classList.add('up');clearTimeout(tt);tt=setTimeout(function(){$('toast').classList.remove('up');},3000);}

/* FAQ */
var FAQ=[['Is the 25ml a weaker version?','No — identical Extrait, 25% oil. Same juice, smaller bottle.'],['Which size should I buy first?','If you know you love it, 100ml is cheaper per ml. If you\'re guessing, start at 25ml.'],['How long does it actually last?','Customers report 8.4 hours on average. Spray on pulse points and clothing.'],['How do I know it\'s authentic?','Every bottle carries a batch code traceable to the day it was filled in our own unit.'],['Is it safe for sensitive skin?','IFRA compliant and dermatologically tested. Patch-test first if you\'re sensitive.'],['Can I mix scents in a multi-pack?','Yes — every multi-bottle tier lets you pick any scents. The price doesn\'t change.']];
$('faq').innerHTML=FAQ.map(function(x){return '<div class="q"><div class="q-t"><span>'+x[0]+'</span><span class="pm">+</span></div><div class="q-a">'+x[1]+'</div></div>';}).join('');
$('faq').onclick=function(e){var q=e.target.closest('.q');if(q)q.classList.toggle('open');};

/* CHIPS + EVENTS */
$('chips').innerHTML=SC.map(function(s){return '<button class="ch '+(s.id===cur.id?'on':'')+'" data-s="'+s.id+'"><span class="d" style="background:'+s.hex+'"></span>'+s.name+'</button>';}).join('');
$('chips').onclick=function(e){var b=e.target.closest('.ch');if(!b)return;cur=S(b.dataset.s);combo[0]=cur.id;stage=0;pick=null;paint();tiers();bulk();picker();renderFbt();calc();strip();profile();};
$('bulkH').onclick=function(){$('bulk').classList.toggle('open');$('bulkCta').textContent=$('bulk').classList.contains('open')?'Close':'Open';};
$('cta').onclick=function(){go('/cart',$('cta'));}; $('satcAdd').onclick=function(){go('/cart',$('satcAdd'));}; $('fbtBtn').onclick=function(){go('/cart',$('fbtBtn'));};
$('ctaBuy').onclick=function(){go('/checkout',$('ctaBuy'));}; $('satcBuy').onclick=function(){go('/checkout',$('satcBuy'));};
if($('cta')){ try{ new IntersectionObserver(function(e){$('satc').classList.toggle('up',!e[0].isIntersecting);},{threshold:0,rootMargin:'-10px 0px 0px 0px'}).observe($('cta')); }catch(e){} }
window.addEventListener('pageshow',function(){ setBusy(false); if($('toast'))$('toast').classList.remove('up'); });

/* boot */
fit(); sizes(); tiers(); bulk(); picker(); renderFbt(); paint(); profile(); strip(); calc();
})();
