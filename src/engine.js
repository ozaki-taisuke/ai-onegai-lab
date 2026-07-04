document.title = 'おねがいラボ — AIのくせずかん';

/* ============================================================
   状態
============================================================ */
const app=document.getElementById('app');
const S={lv:0, stars:{}, zukan:[], asks:0, reasonUsed:false, reasonFirstTry:true,
  lateShown:false, sel:[], phase:'title'};

function save(){
  try{localStorage.setItem('onegai_v1',JSON.stringify({lv:S.lv,stars:S.stars,zukan:S.zukan}));}catch(e){}
}
function load(){
  try{return JSON.parse(localStorage.getItem('onegai_v1')||'null');}catch(e){return null;}
}
function starTotal(){
  const t2=(typeof T!=='undefined')?Object.values(T.stars2).reduce((a,b)=>a+b,0):0;
  return Object.values(S.stars).reduce((a,b)=>a+b,0)+t2;
}
function wipeAll(){
  try{localStorage.removeItem('onegai_v1');localStorage.removeItem('onegai_v2ch2');}catch(e){}
  Object.assign(S,{lv:0,stars:{},zukan:[],sel:[]});
  if(typeof T!=='undefined'){T.stars2={};T.zukan2=[];}
}
function updHeader(){document.getElementById('starcount').textContent='⭐'+starTotal();}
function render(html){app.innerHTML='<div class="pop">'+html+'</div>';window.scrollTo(0,0);}
function on(sel,fn){app.querySelectorAll(sel).forEach(el=>el.addEventListener('click',fn));}
function toast(m){const t=document.getElementById('toast');t.textContent=m;
  t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700);}

function ainaBub(text){
  return '<div class="aina"><div class="aina-face">🤖</div><div class="bub">'+
    '<div class="nm">アイナ</div>'+text+'</div></div>';
}
function quirkCard(no,isNew){
  const q=QUIRKS[no];
  return '<div class="quirk"><div class="qh"><span class="qno">くせずかん '+q.no+'</span>'+
    '<span class="qname">'+q.name+'</span>'+(isNew?'<span class="new">NEW!</span>':'')+
    '</div><div class="qb">'+q.tx+'</div></div>';
}
function lvDots(){
  return '<div class="lvdots">'+LEVELS.map((_,k)=>
    '<span class="lvdot'+(k<S.lv?' done':k===S.lv?' now':'')+'"></span>').join('')+'</div>';
}

/* ============================================================
   タイトル
============================================================ */
function showTitle(){
  S.phase='title';
  updHeader();
  const sv=load();
  render(
  '<div class="herobot">🤖</div>'+
  '<h1 class="bigtitle">おねがい<span>ラボ</span></h1>'+
  '<div class="subtitle">— AIの くせずかん・1しょう —</div>'+
  '<div class="card"><p class="lead">おてつだいAIの <b>アイナ</b>は、とっても ゆうしゅう。でも、ちょっと かわった <b>くせ</b>が あるんだ。</p>'+
  '<p class="lead">じょうずに おねがい できるかな？ しっぱいしても だいじょうぶ。<b>しっぱいすると、ずかんが うまる</b>からね！</p></div>'+
  '<div class="card" style="font-size:14px">'+
  '<b>あそびかた</b><br>'+
  '① ことばタイルを えらんで、アイナに おねがい<br>'+
  '② アイナは <b>いわれた とおり</b>に ぜんりょくで やる<br>'+
  '③ 「あれっ？」て なったら、<b>なんでか</b>を かんがえよう<br>'+
  '④ AIの くせが わかったら、ずかんに とうろく！</div>'+
  '<button class="btn btn-go" id="start">'+(hasSave(sv)?'つづきから あそぶ！':'はじめる！')+'</button>'+
  (hasSave(sv)?'<button class="btn btn-sub" id="wipe">データを けして さいしょから</button>':''));
  on('#start',()=>{
    const sv2=load();
    if(hasSave(sv2)) Object.assign(S,{lv:sv2.lv||0,stars:sv2.stars||{},zukan:sv2.zukan||[],phase:'map'});
    else {Object.assign(S,{lv:0,stars:{},zukan:[],phase:'map'});save();}
    updHeader(); showMap();
  });
  on('#wipe',(e)=>{
    const b=e.currentTarget;
    if(b.dataset.arm){wipeAll();updHeader();showTitle();toast('データを けしたよ！');}
    else {b.dataset.arm='1';b.textContent='ほんとに けす？（もういちど タップ）';}
  });
}

function hasSave(sv){return !!(sv&&sv.stars&&Object.keys(sv.stars).length>0);}

/* ============================================================
   マップ（ステージせんたく）
   解放ルール = 依存関係の写し: 首と尻が固定、腹は自由。
   LV1(文法/用語の導入)クリア → LV2〜4が一斉解放（順不同） → 3つ揃えてボス。
============================================================ */
function ch1Cleared(i){return S.stars[i]!=null;}
function ch1Open(i){
  if(i===0) return true;
  if(i<=3) return ch1Cleared(0);
  return ch1Cleared(1)&&ch1Cleared(2)&&ch1Cleared(3);
}
function mapNode(ch,i,name,cleared,open,starsN){
  const cls=cleared?'cleared':open?'open':'locked';
  return '<button class="mapnode '+cls+'" data-ch="'+ch+'" data-lv="'+i+'"'+(open?'':' disabled')+'>'+
    '<span class="mn-no">'+(i+1)+'</span>'+
    '<span class="mn-name">'+(open?name:'？？？')+'</span>'+
    '<span class="mn-st">'+(cleared?'⭐'.repeat(starsN):open?'▶':'🔒')+'</span></button>';
}
function showMap(){
  S.phase='map'; S.sel=[]; updHeader();
  let html='<div class="rq">🗺️ どの おだいに ちょうせんする？</div>'+
  '<div class="card"><b class="map-ch">1しょう たのみかた</b>'+
  LEVELS.map((L,k)=>mapNode(1,k,L.name,ch1Cleared(k),ch1Open(k),S.stars[k]||0)).join('')+
  (ch1Cleared(4)?'<button class="btn btn-sub" id="end1">🎉 1しょうの けっか・ずかんを みる</button>':'')+
  '</div>';
  if(typeof LEVELS2!=='undefined'){
    html+='<div class="card"><b class="map-ch">2しょう じしんまんまん</b>'+
      (ch2Gate()
        ? LEVELS2.map((L,k)=>mapNode(2,k,L.name,ch2Cleared(k),ch2Open(k),T.stars2[k]||0)).join('')+
          (ch2Cleared(4)?'<button class="btn btn-sub" id="end2">🎉 2しょうの けっかを みる</button>':'')
        : '<div class="zk-item locked"><div class="nm">🔒 1しょうを クリアすると あそべるよ</div></div>')+
      '</div>';
  }else{
    html+='<div class="card"><b class="map-ch">🔒 つぎの ぼうけん（じゅんびちゅう）</b>'+
      LOCKED_CH.map(c=>'<div class="zk-item locked"><div class="nm">'+c.name+'</div><div class="tx">'+c.tx+'</div></div>').join('')+'</div>';
  }
  render(html);
  on('.mapnode[data-ch="1"]',(e)=>startLevel(+e.currentTarget.dataset.lv));
  on('.mapnode[data-ch="2"]',(e)=>startCh2(+e.currentTarget.dataset.lv));
  on('#end1',showEnding);
  on('#end2',()=>showCh2Ending());
}

/* ============================================================
   レベル進行
============================================================ */
function startLevel(i){
  if(i>=LEVELS.length) return showEnding();
  S.lv=i; S.asks=0; S.reasonUsed=false; S.reasonFirstTry=true;
  S.lateShown=false; S.sel=[];
  showCompose(i,null);
}

function visibleTiles(L){
  return L.tiles.filter(t=>!t.late||S.lateShown);
}

function showCompose(i,notice){
  const L=LEVELS[i];
  S.phase='compose'; S.sel=S.sel.filter(id=>visibleTiles(L).some(t=>t.id===id));
  render(
  '<div style="font-size:12px;font-weight:800;color:var(--dim)">レベル '+(i+1)+'／'+LEVELS.length+'　'+L.name+'</div>'+
  lvDots()+
  '<div class="card goal"><span class="tag">おだい</span>'+
  '<h2>'+L.goalTitle+'</h2>'+
  '<div class="goalart">'+L.goalArt+'</div>'+
  '<div class="note">'+L.goalNote+'</div></div>'+
  ainaBub(notice||L.aidaIntro)+
  '<div class="slots" id="slots"></div>'+
  '<div class="slotcount">タイルは <b>'+Math.min(L.slots,visibleTiles(L).length)+'まい</b>まで（はずすときは うえの タイルを タップ）</div>'+
  '<div class="tray" id="tray"></div>'+
  '<button class="btn btn-go" id="go" disabled>おねがいする！</button>');
  drawTiles(i);
  on('#go',()=>doAsk(i));
}

function drawTiles(i){
  const L=LEVELS[i];
  const slots=document.getElementById('slots');
  const tray=document.getElementById('tray');
  slots.innerHTML=S.sel.length
    ? S.sel.map(id=>'<button class="tile" data-id="'+id+'">'+L.tiles.find(t=>t.id===id).t+'</button>').join('')
    : '<span class="ph">ここに おねがいの ことばが ならぶよ</span>';
  tray.innerHTML=visibleTiles(L).map(t=>
    '<button class="tile'+(S.sel.includes(t.id)?' used':'')+'" data-id="'+t.id+'">'+t.t+'</button>').join('');
  slots.querySelectorAll('.tile').forEach(el=>el.addEventListener('click',()=>{
    S.sel=S.sel.filter(x=>x!==el.dataset.id); drawTiles(i);
  }));
  tray.querySelectorAll('.tile:not(.used)').forEach(el=>el.addEventListener('click',()=>{
    if(S.sel.length>=L.slots){toast('タイルは '+L.slots+'まい まで！ いらない タイルを タップして はずそう');return;}
    S.sel.push(el.dataset.id); drawTiles(i);
  }));
  document.getElementById('go').disabled=S.sel.length===0;
}

function doAsk(i){
  const L=LEVELS[i];
  S.asks++;
  const key=L.eval(new Set(S.sel));
  showOutcome(i,key);
}

function showOutcome(i,key){
  const L=LEVELS[i]; const o=L.outcomes[key];
  S.phase='outcome';
  const sentence=S.sel.map(id=>L.tiles.find(t=>t.id===id).t).join(' ');
  const aidaTxt=typeof o.aida==='function'?o.aida(new Set(S.sel)):o.aida;
  // アイナの復唱: 正準順(echo)に並べ直して言い返す。どの語順で選んでも同じ復唱に収束する
  const canon=(L.echo||S.sel).filter(id=>S.sel.includes(id));
  const echoTxt=canon.map(id=>L.tiles.find(t=>t.id===id).t).join('、');
  const reordered=canon.join('|')!==S.sel.join('|');
  let html='<div style="font-size:12.5px;color:var(--dim);text-align:center">きみの おねがい：「'+sentence+'」</div>'+
    '<div class="echo"><span class="enm">🤖 アイナの ふくしょう</span>「'+echoTxt+'、だね！ りょうかい！」'+
    (reordered?'<div class="eno">じゅんばんが ちがっても、アイナには おなじ いみで とどくよ</div>':'')+
    '</div>'+
    '<div class="stage">'+o.art+(o.cap?'<div class="cap">'+o.cap+'</div>':'')+'</div>'+
    ainaBub(aidaTxt);

  if(o.kind==='success'){
    return showSuccess(i,html);
  }
  if(o.kind==='confirm'){
    html+='<div class="rq">どうする？</div>';
    o.btns.forEach(b=>{
      html+='<button class="btn '+(b.cls||'btn-sub')+'" data-to="'+b.to+'" data-cb="1">'+b.t+'</button>';
    });
    render(html);
    on('[data-cb]',(e)=>showOutcome(i,e.currentTarget.dataset.to));
    return;
  }
  if(o.kind==='fail'||o.kind==='fail2'){
    html+='<div class="resh fail">おおっと！ ……でも これは はっけんの チャンス！</div>'+
      '<button class="btn btn-go" id="why">なんで こう なったんだろう？</button>';
    render(html);
    on('#why',()=>showReason(i, o.kind==='fail2'&&L.reason2 ? L.reason2 : L.reason));
    return;
  }
  // soft
  html+=(o.hint?'<div class="hint">💡 '+o.hint+'</div>':'')+
    '<button class="btn btn-go" id="retry">もういちど おねがいする</button>';
  render(html);
  on('#retry',()=>{if(o.clearSel)S.sel=[];showCompose(i,'よーし、もういっかい！');});
}

/* ---- なんでフェーズ（理由の言語化） ---- */
function showReason(i,R){
  const L=LEVELS[i];
  S.phase='reason'; S.reasonUsed=true;
  let pick1=null,pick2=null,tries=0;
  function draw(msg){
    render(
    '<div class="rq">🔎 なんで こう なったのか、ことばに してみよう</div>'+
    '<div class="rsent">'+R.pre+
      '<span class="blank '+(pick1===null?'empty':'')+'" id="b1">'+(pick1===null?'？？？':R.b1.choices[pick1])+'</span>'+
      R.mid+
      '<span class="blank '+(pick2===null?'empty':'')+'" id="b2">'+(pick2===null?'？？？':R.b2.choices[pick2])+'</span>'+
      R.post+'</div>'+
    '<div class="rgroup"><div class="lb">'+R.b1.lb+'</div><div class="chips">'+
      R.b1.choices.map((c,k)=>'<button class="chip'+(pick1===k?' on':'')+'" data-g="1" data-k="'+k+'">'+c+'</button>').join('')+'</div></div>'+
    '<div class="rgroup"><div class="lb">'+R.b2.lb+'</div><div class="chips">'+
      R.b2.choices.map((c,k)=>'<button class="chip'+(pick2===k?' on':'')+'" data-g="2" data-k="'+k+'">'+c+'</button>').join('')+'</div></div>'+
    (msg?'<div class="hint">'+msg+'</div>':'')+
    '<button class="btn btn-go" id="check" '+(pick1===null||pick2===null?'disabled':'')+'>これだ！</button>');
    on('.chip',(e)=>{
      const g=e.currentTarget.dataset.g, k=+e.currentTarget.dataset.k;
      if(g==='1')pick1=k; else pick2=k;
      draw(msg);
    });
    on('#check',()=>{
      if(pick1===R.b1.ok&&pick2===R.b2.ok){
        S.lateShown=true;
        render(
        '<div class="stage"><span class="e1">💡</span><div class="cap">せいかい！</div></div>'+
        '<div class="rsent">'+R.pre+'<span class="blank">'+R.b1.choices[R.b1.ok]+'</span>'+R.mid+
        '<span class="blank">'+R.b2.choices[R.b2.ok]+'</span>'+R.post+'</div>'+
        ainaBub(R.after||L.afterReason)+
        '<button class="btn btn-go" id="again">もういちど おねがいしてみる！</button>');
        on('#again',()=>{S.sel=[];showCompose(i,'こんどこそ！ タイルを えらんでね！');});
      }else{
        tries++; S.reasonFirstTry=false;
        if(tries>=2){
          pick1=R.b1.ok; pick2=R.b2.ok;
          draw('こたえは これ！ 「'+R.b1.choices[R.b1.ok]+'」…「'+R.b2.choices[R.b2.ok]+'」。もういちど「これだ！」を おしてね');
        }else{
          draw('うーん、おしい！ もういちど かんがえてみよう');
        }
      }
    });
  }
  draw(null);
}

/* ---- 成功 → ずかん ---- */
function showSuccess(i,preHtml){
  const L=LEVELS[i];
  S.phase='success';
  const isNew=!S.zukan.includes(L.quirk);
  if(isNew)S.zukan.push(L.quirk);
  let stars=1;
  if(!S.reasonUsed||S.reasonFirstTry)stars++;
  if(S.asks<=2)stars++;
  S.stars[i]=Math.max(S.stars[i]||0,stars);
  S.lv=i+1; save(); updHeader();
  render(preHtml+
  '<div class="resh win">だいせいこう！！</div>'+
  '<div class="stars">'+'⭐'.repeat(stars)+'<span style="opacity:.25">'+'⭐'.repeat(3-stars)+'</span></div>'+
  (S.asks===1?'<div class="calib">✨ <b>いちどで つたわった！</b> おねがい名人の そしつ あり！</div>':'')+
  quirkCard(L.quirk,isNew)+
  '<button class="btn btn-go" id="next">'+(i===LEVELS.length-1?'けっかを みる！':'マップに もどる！')+'</button>');
  on('#next',()=> i===LEVELS.length-1?showEnding():showMap());
}

/* ============================================================
   エンディング
============================================================ */
function showEnding(){
  S.phase='end';
  const total=starTotal();
  const msg= total>=13 ? 'きみは もう「おねがいの めいじん」！ アイナが ほこらしげです。'
    : total>=9 ? 'すごい！ AIの くせ、だいぶ つかめて きたね！'
    : 'クリア おめでとう！ もういちど あそぶと、もっと ★が あつまるよ！';
  render(
  '<div class="herobot">🤖🎉</div>'+
  '<h1 class="bigtitle">1しょう クリア！</h1>'+
  '<div class="stars" style="font-size:22px">⭐×'+total+'（さいだい 15）</div>'+
  '<div class="card"><p class="lead">'+msg+'</p>'+
  ainaBub('きみの おねがいが じょうずに なるたび、ぼくは もっと やくに たてる。<b>ぼくは すごい。でも、きめるのは いつも きみ</b>。それが めいコンビって やつだね！')+'</div>'+
  '<div class="card"><b style="font-size:14px">🗂️ あつめた AIの くせ</b>'+
  S.zukan.map(n=>quirkCard(n,false)).join('')+'</div>'+
  '<div class="card"><b style="font-size:14px">🔒 つぎの ぼうけん（じゅんびちゅう）</b>'+
  LOCKED_CH.filter((c,ix)=>!(ix===0&&typeof LEVELS2!=='undefined'))
    .map(c=>'<div class="zk-item locked"><div class="nm">'+c.name+'</div><div class="tx">'+c.tx+'</div></div>').join('')+
  (typeof LEVELS2!=='undefined'?'<div class="zk-item"><div class="nm">✨ 2しょう じしんまんまん — マップから あそべるよ！</div></div>':'')+'</div>'+
  '<details class="parents"><summary>おうちの かたへ</summary>'+
  '<p>このゲームは、生成AIを年齢制限（多くのサービスで13歳）により まだ使えないお子さんが、実物に触れる前に「AIとの付き合い方」を練習するための教材です。模擬AIのみで動作し、通信・データ収集は一切ありません。</p>'+
  '<p>設計の核は3つ：<b>①失敗を安全に体験する</b>（意図的に「言った通りに実行されて困る」状況を作る）、<b>②失敗の因果を自分の言葉で説明する</b>（「なんでフェーズ」。理由を言語化する力は、AIへの指示力そのものです）、<b>③それでもAIを嫌いにならない</b>（アイナは優秀な相棒であり、責めるべき相手ではなく、付き合い方を学ぶ相手です）。</p>'+
  '<p>遊んだ後に「アイナ、なんで まちがえたんだと おもう？」と聞いてみてください。お子さんが自分の言葉で説明できたら、それがこのゲームの最終ゴールです。</p></details>'+
  '<button class="btn btn-go" id="tomap">マップに もどる</button>'+
  '<button class="btn btn-sub" id="replay">さいしょから もういちど（データを けす）</button>');
  on('#tomap',showMap);
  on('#replay',()=>{wipeAll();updHeader();showTitle();});
}

/* ============================================================
   ずかんモーダル
============================================================ */
document.getElementById('homebtn').addEventListener('click',()=>showMap());
document.getElementById('zkbtn').addEventListener('click',()=>{
  const list=document.getElementById('zklist');
  const ns=typeof LEVELS2!=='undefined'?[1,2,3,4,5,6,7,8,9,10]:[1,2,3,4,5];
  list.innerHTML=ns.map(n=>{
    const got=S.zukan.includes(n)||(typeof T!=='undefined'&&T.zukan2.includes(n));
    if(got){
      const q=QUIRKS[n];
      return '<div class="zk-item"><span class="no">'+q.no+'</span> <span class="nm">'+q.name+'</span><div class="tx">'+q.tx+'</div></div>';
    }
    return '<div class="zk-item locked"><span class="no">No.'+(n<10?'0'+n:n)+'</span> <span class="nm">？？？</span><div class="tx">まだ みつけてない くせ</div></div>';
  }).join('');
  document.getElementById('zkmodal').classList.add('open');
});
document.getElementById('zkclose').addEventListener('click',()=>
  document.getElementById('zkmodal').classList.remove('open'));
document.getElementById('zkmodal').addEventListener('click',(e)=>{
  if(e.target.id==='zkmodal')e.target.classList.remove('open');
});

window.__S=S; window.__LEVELS=LEVELS; // テスト・監査用フック
showTitle();
