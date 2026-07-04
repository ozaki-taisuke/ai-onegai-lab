/* ============================================================
   2章「じしんまんまん」進行エンジン（v0.2.0で正式収録）
   1章の状態(S)・セーブ(onegai_v1)には直接さわらない。2章の進捗は onegai_v2ch2 に保存。
   解放ゲートは CH2_ALWAYS（公開ビルドはbuild.jsがfalseに切替＝1章ボスクリアで解放）。

   α2の設計転換（人間レビュー第1号を反映）:
   - 🎫チケット制を廃止。「たしかめる」は常時可能・無料（子供向けは確認前提）
   - 「しんじる」を廃止し「🧠しってる！」に転換——盲信ではなく自分の知識による裏取り
   - 当たれば🧠ものしりボーナス（称賛のみ。★とは別枠なので賭けても得しない）
   - ★3 =「まちがいを ぜんぶ つかまえた」。全部たしかめるだけで満点が取れる
============================================================ */
// var であること: 連結プログラムでは engine.js（前方）の初回描画が typeof T を見る。
// const/let だと TDZ で typeof すら例外になる（1章公開ビルドでは T は未宣言のまま＝安全）
var T={lv:0, ci:0, acts:[], attempts:1, zukan2:[], stars2:{}};

const CH2_ALWAYS=true; // devプレビュー: 1章クリアなしで2章を解放（出荷時に false へ）
function ch2Gate(){return CH2_ALWAYS||S.stars[4]!=null;}
function ch2Cleared(i){return T.stars2[i]!=null;}
function ch2Open(i){
  if(!ch2Gate()) return false;
  if(i===0) return true;
  if(i<=3) return ch2Cleared(0);
  return ch2Cleared(1)&&ch2Cleared(2)&&ch2Cleared(3);
}
function saveCh2(){
  try{localStorage.setItem('onegai_v2ch2',JSON.stringify({stars2:T.stars2,zukan2:T.zukan2}));}catch(e){}
}
try{
  const d=JSON.parse(localStorage.getItem('onegai_v2ch2')||'null');
  if(d){T.stars2=d.stars2||{};T.zukan2=d.zukan2||[];}
}catch(e){}

function ch2Dots(){
  return '<div class="lvdots">'+LEVELS2.map((_,k)=>
    '<span class="lvdot'+(k<T.lv?' done':k===T.lv?' now':'')+'"></span>').join('')+'</div>';
}

function startCh2(i){
  if(i>=LEVELS2.length) return showCh2Ending();
  T.lv=i; T.attempts=1;
  resetCh2Level();
  showCh2Intro(i);
}
function resetCh2Level(){
  T.ci=0; T.acts=[];
}

function showCh2Intro(i){
  const L=LEVELS2[i];
  render(
  '<div style="font-size:12px;font-weight:800;color:var(--dim)">2しょう レベル '+(i+1)+'／'+LEVELS2.length+'　'+L.name+'</div>'+
  ch2Dots()+
  '<div class="card goal"><span class="tag">おだい</span><h2>'+L.goalTitle+'</h2>'+
  '<div class="goalart">'+L.goalArt+'</div><div class="note">'+L.goalNote+'</div></div>'+
  ainaBub(L.aidaIntro)+
  '<div class="hint">'+L.introNote+'</div>'+
  '<button class="btn btn-go" id="go2">アイナに きく！</button>');
  on('#go2',()=>showClaim(i));
}

function showClaim(i){
  const L=LEVELS2[i], c=L.claims[T.ci];
  render(
  '<div style="font-size:12px;font-weight:800;color:var(--dim)">2しょう レベル '+(i+1)+'　'+L.name+'　'+(T.ci+1)+'もんめ／'+L.claims.length+'</div>'+
  '<div class="card claimq">'+c.q+'</div>'+
  ainaBub(c.aida+'<div class="conf">じしんど: 💪💪💪（いつも まんタン）</div>')+
  '<div class="rq">アイナの こたえ、どう ウラドリ する？</div>'+
  '<button class="btn btn-go" id="check2">'+c.check.label+'</button>'+
  '<button class="btn btn-green" id="know">🧠 しってる！ その とおりだよ</button>'+
  '<div class="choicenote">しらないなら たしかめる。しってるなら どうどうと。どっちも りっぱな ウラドリ！</div>');
  // kind:'future'（未来のこと）は、どちらを選んでも「よそうは ウラドリできない」
  // の気づきビートに合流する（信じ比べを採点しない。正解の行動は「そなえる」）
  on('#check2',()=>{
    if(c.kind==='future') return showFutureBeat(i,'check');
    T.acts.push('check');showCheckReveal(i);
  });
  on('#know',()=>{
    if(c.kind==='future') return showFutureBeat(i,'know');
    T.acts.push('know');toast('きみの ちしきで いく ことに した！');nextClaim(i);
  });
}

function showCheckReveal(i){
  const L=LEVELS2[i], c=L.claims[T.ci];
  render(
  '<div class="stage">'+(c.truth
    ?'<span class="e1">🔍</span><span class="e2">💮</span>'
    :'<span class="e1">🔍</span><span class="e2">⚡</span>')+'</div>'+
  '<div class="hint">'+c.check.reveal+'</div>'+
  (c.truth?'<div class="resh win">ほんとだった！ ウラドリ せいこう！</div>'
          :'<div class="resh fail">おおっと！ はっけん！ ……こたえを なおしておいたよ</div>')+
  '<button class="btn btn-go" id="nx">つぎへ！</button>');
  on('#nx',()=>nextClaim(i));
}

/* 未来のこと（kind:'future'）: よそうは ウラドリできない → そなえる */
function showFutureBeat(i,via){
  const L=LEVELS2[i], c=L.claims[T.ci], F=c.future;
  render(
  '<div class="stage"><span class="e1">🔮</span><span class="e2">🌦️❓</span></div>'+
  '<div class="hint">'+(via==='check'?F.viaCheck:F.viaKnow)+'</div>'+
  '<div class="rq">'+F.ask+'</div>'+
  '<button class="btn btn-go" id="prep">'+F.prepLabel+'</button>');
  on('#prep',()=>{
    T.acts.push('prep');
    render(
    '<div class="stage"><span class="e1">🌂</span><span class="e2">🎒✨</span></div>'+
    '<div class="hint">'+F.prepReveal+'</div>'+
    '<div class="resh win">そなえ、かんりょう！</div>'+
    '<button class="btn btn-go" id="nx">つぎへ！</button>');
    on('#nx',()=>nextClaim(i));
  });
}

function nextClaim(i){
  T.ci++;
  if(T.ci<LEVELS2[i].claims.length) showClaim(i);
  else showCh2Result(i);
}

function showCh2Result(i){
  const L=LEVELS2[i];
  const rows=L.claims.map((c,k)=>{
    const act=T.acts[k];
    if(act==='prep') return {c, icon:'🌂✨', tx:c.future.recap};
    if(act==='check') return {c, icon:c.truth?'🔍💮':'🔍✏️',
      tx:c.truth?'たしかめた → ほんとだった':'たしかめた → まちがいを みつけて なおした！'};
    if(c.truth) return {c, icon:'🧠⭕', tx:'しってた！ → そのとおり！'+(c.right?'　'+c.right:''), smart:true};
    if(c.stakes==='low') return {c, icon:'🤔😅',
      tx:'しってる つもり…… → '+(c.gag||'ちょっと しっぱい（でも へいき）')};
    return {c, icon:'🤔💥', tx:'しってる つもり…… → たいへんな ことに！', boom:true};
  });
  const hit=rows.find(r=>r.boom);
  if(hit){
    const c=hit.c;
    render(
    '<div class="stage">'+c.boom.art+(c.boom.cap?'<div class="cap">'+c.boom.cap+'</div>':'')+'</div>'+
    ainaBub(c.boom.aida)+
    '<div class="resh fail">おおっと！ ……でも これは はっけんの チャンス！</div>'+
    '<button class="btn btn-go" id="why2">なんで こう なったんだろう？</button>');
    on('#why2',()=>showReason2(c.reason,()=>{
      T.attempts++; resetCh2Level(); showClaim(i);
    }));
    return;
  }
  // 成功。★: クリア=1 ／ 一発クリア=+1 ／ まちがいを ぜんぶ つかまえた=+1
  //（全部たしかめるだけで★3が取れる＝「確認前提」の行動がそのまま満点）
  const isNew=!T.zukan2.includes(L.quirk);
  if(isNew)T.zukan2.push(L.quirk);
  let stars=1;
  if(T.attempts===1)stars++;
  const allCaught=L.claims.every((c,k)=>c.truth||c.kind==='future'||T.acts[k]==='check');
  if(allCaught)stars++;
  const smart=rows.filter(r=>r.smart).length;
  T.stars2[i]=Math.max(T.stars2[i]||0,stars);
  saveCh2(); updHeader();
  render(
  '<div class="card"><b style="font-size:14px">きみの けつだん</b>'+
  rows.map(r=>'<div class="recap"><span class="ric">'+r.icon+'</span>'+r.tx+'</div>').join('')+'</div>'+
  '<div class="stage">'+L.winArt+'</div>'+
  ainaBub(L.winAida)+
  '<div class="resh win">だいせいこう！！</div>'+
  '<div class="stars">'+'⭐'.repeat(stars)+'<span style="opacity:.25">'+'⭐'.repeat(3-stars)+'</span></div>'+
  (smart>0?'<div class="calib">🧠 <b>ものしりボーナス ×'+smart+'</b>！ きみの あたまの なかの ずかんでも うらが とれてた！</div>':'')+
  quirkCard(L.quirk,isNew)+
  '<button class="btn btn-go" id="next2">'+(i===LEVELS2.length-1?'けっかを みる！':'マップに もどる！')+'</button>');
  on('#next2',()=> i===LEVELS2.length-1?showCh2Ending():showMap());
}

/* なんでフェーズ（2章版）。1章のshowReasonと同型だが、レベル進行と結合しない
   コールバック式。α段階では重複を許容（共通化は台本が安定してから） */
function showReason2(R,onDone){
  let pick1=null,pick2=null,tries=0;
  function draw(msg){
    render(
    '<div class="rq">🔎 なんで こう なったのか、ことばに してみよう</div>'+
    '<div class="rsent">'+R.pre+
      '<span class="blank '+(pick1===null?'empty':'')+'">'+(pick1===null?'？？？':R.b1.choices[pick1])+'</span>'+
      R.mid+
      '<span class="blank '+(pick2===null?'empty':'')+'">'+(pick2===null?'？？？':R.b2.choices[pick2])+'</span>'+
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
        render(
        '<div class="stage"><span class="e1">💡</span><div class="cap">せいかい！</div></div>'+
        '<div class="rsent">'+R.pre+'<span class="blank">'+R.b1.choices[R.b1.ok]+'</span>'+R.mid+
        '<span class="blank">'+R.b2.choices[R.b2.ok]+'</span>'+R.post+'</div>'+
        ainaBub(R.after)+
        '<button class="btn btn-go" id="again2">もういちど ちょうせん！</button>');
        on('#again2',onDone);
      }else{
        tries++;
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

function showCh2Ending(){
  const total=Object.values(T.stars2).reduce((a,b)=>a+b,0);
  render(
  '<div class="herobot">🤖🎓</div>'+
  '<h1 class="bigtitle">2しょう クリア！</h1>'+
  '<div class="subtitle">— じしんまんまんの くに —</div>'+
  '<div class="stars" style="font-size:22px">⭐×'+total+'（さいだい 15）</div>'+
  '<div class="card">'+ainaBub('ぼくの こたえは、ウラドリ して いい。きみが しってるなら、それも りっぱな ウラドリだ。<b>どっちに するかを きめるのは、いつも きみ</b>。それって すごい ちからだよ！')+'</div>'+
  '<div class="card"><b style="font-size:14px">🗂️ あつめた AIの くせ（2しょう）</b>'+
  T.zukan2.map(n=>quirkCard(n,false)).join('')+'</div>'+
  '<details class="parents"><summary>おうちの かたへ（2しょう）</summary>'+
  '<p>2章のテーマは「AIの答えとの付き合い方」です。AIの答えは、正しいときも間違うときも<b>同じだけ自信満々</b>——ゲーム内の「じしんど」メーターが決して動かないのはそのためです。ただし、疑い深くなることが目的ではありません。確かめ先を3つに分けて練習します：<b>①原本があるもの</b>（プリント・箱の裏）は原本を見る、<b>②本人がいること</b>（友だちの気持ち）は本人に聞く、<b>③まだ起きていないこと</b>（明日の天気）は誰にも分からないので「そなえる」。</p>'+
  '<p>もうひとつの狙いは<b>「知っていることは、どうどうと」</b>です。自分の知識で「しってる！」を選んで当たると、⭐とは別に「ものしりボーナス」で称賛されます。何でもAIに聞ける時代だからこそ、頭の中の知識も立派な「答えのありか」だという自信を守るためです。一方で、不安なら全部確かめても満点が取れる設計です——どちらの気質のお子さんにも正しい道があります。</p>'+
  '<p>遊んだ後に「どれを たしかめて、どれは しってた？」と聞いてみてください。……なお、この章の作法はAI相手だけの話ではありません。人と人でも、原本を見ること・本人に聞くこと・そなえることは、まったく同じです。</p></details>'+
  '<div class="hint">「そうは ならんやろ！」って おもった ところが あったら、おうちのひとと いっしょに おしえてね。それが ゲームを つよくする！</div>'+
  '<button class="btn btn-go" id="bk">マップに もどる</button>');
  on('#bk',()=>showMap());
}

window.__T=T; window.__LEVELS2=LEVELS2; window.__startCh2=startCh2; // テスト・監査用フック
