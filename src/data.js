/* ============================================================
   ずかんデータ
============================================================ */
const QUIRKS = {
  1:{no:'No.01', name:'いってない ことは つたわらない',
     tx:'AIは エスパーじゃない。あたまの なかの「ふつう」は、ことばに しないと とどかない。'},
  2:{no:'No.02', name:'ふわっと たのむと、かってに あなうめ される',
     tx:'AIは わからない ところを そうぞうで うめる。しかも、じしんまんまんで。'},
  3:{no:'No.03', name:'きみの あたまの なかは 見えない',
     tx:'「ぼくの」「あれ」「いつもの」は AIには 見えない。しかも AIは、わからなくても きいて こない ことが ある。'},
  4:{no:'No.04', name:'いってない ばあいは だいこんらん',
     tx:'AIは かいて ある とおりに うごく。かいてない ことが おきると、とんでもない うごきに なる ことも。「もし〜だったら」も つたえよう。'},
  5:{no:'No.05', name:'「やる まえに みせて」は まほうの ことば',
     tx:'AIの しごとは、おわる まえに たしかめられる。かくにんは かっこわるくない。めいじんの わざ。'},
};
const LOCKED_CH = [
  {name:'2しょう じしんまんまんの くに', tx:'まちがって いても どうどうと している AIと、たしかめかたの おはなし'},
  {name:'3しょう なんでも いうこと きくの くに', tx:'なんでも「そうだね！」って いう AIと、ひみつの まもりかたの おはなし'},
  {name:'4しょう さいごは きみの くに', tx:'AIと ちからを あわせて、でも さいごは きみが きめる おはなし'},
];

/* ============================================================
   レベルデータ
============================================================ */
const LEVELS = [
{ // LV1 ケーキ（チュートリアル）
  name:'たんじょうびケーキ',
  goalTitle:'おかあさんの たんじょうび！ ケーキを よういしたい',
  goalArt:'👩🎂🕯️',
  goalNote:'<b>テーブルに のる ふつうの おおきさ</b>の ケーキが ほしいな',
  aidaIntro:'はじめまして！ ぼく、おてつだいAIの <b>アイナ</b>！ うえの <b>おだいカード</b>を よく みて、したの「ことばタイル」で ぼくに おねがいしてね！',
  slots:4,
  tiles:[
    {id:'cake', t:'ケーキを'},
    {id:'sugoi', t:'とびきり すごいのを'},
    {id:'make', t:'つくって'},
    {id:'size', t:'テーブルに のる おおきさで'},
  ],
  eval(s){
    if(!s.has('make')) return 'noverb';
    if(!s.has('cake')) return 'nowhat';
    if(s.has('size')) return 'success';
    return s.has('sugoi') ? 'giant' : 'tiny';
  },
  outcomes:{
    noverb:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">❓</span>',
      aida:'ケーキを……どう するの？ たべる？ ながめる？',
      hint:'「<b>つくって</b>」みたいな、<b>どうさの ことば</b>も いるみたい！'},
    nowhat:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">💭</span>',
      aida:'なにを つくれば いいん だろう……？',
      hint:'<b>なにを</b>、が ぬけてる みたい！'},
    giant:{kind:'fail', art:'<span class="e1">🎂</span><span class="e3">🏠</span><span class="e2">🤖💦</span>',
      aida:'とびきり すごいの、できました！ たかさ 8メートル！ ……げんかんから 入りません！',
      cap:'いえより おおきい ケーキが きた'},
    tiny:{kind:'fail', art:'<span class="e2">🔍</span><span class="e3">🎂</span><span class="e2">🐜</span>',
      aida:'できました！ ……おおきさを きいて なかったので、アリさんサイズに して みました！',
      cap:'ちいさすぎる ケーキが きた'},
    success:{kind:'success', art:'<span class="e1">🎂</span><span class="e2">🕯️👩💕</span>',
      aida:'テーブルに ぴったり！ おたんじょうび おめでとうございます！ ……ちなみに <b>ろうそくの かずは きいてなかった</b>から、100ぽん さしといたよ！ たりる？',
      cap:'だいせいこう！（ろうそくは……まあ、ごあいきょう）'},
  },
  reason:{pre:'', b1:{lb:'なにを つたえて なかった？',
      choices:['おおきさ','いろ','おかねの こと'], ok:0},
    mid:'を つたえて なかったから、',
    b2:{lb:'どう なっちゃった？',
      choices:['へんな おおきさの ケーキが きた','ケーキが こなかった','アイナが ないちゃった'], ok:0},
    post:'。'},
  afterReason:'そうそう！ 「おおきさ」みたいな <b>どのくらい</b>の ことばが あると、アイナは まちがえようが ないんだ。もういちど おねがい してみよう！',
  quirk:1,
},
{ // LV2 かいもの
  name:'カレーの かいもの',
  goalTitle:'こんやは カレー！ たりない ざいりょうを かってきて もらおう',
  goalArt:'🍛🥕🥔',
  goalNote:'ひつような もの：<b>にんじん 3ぼん・じゃがいも 2こ・カレールー 1はこ</b>',
  aidaIntro:'おかいもの、まかせて！ さいふと エコバッグ、もったよ！',
  slots:5,
  tiles:[
    {id:'vague', t:'カレーに つかうものを'},
    {id:'zenbu', t:'ぜんぶ'},
    {id:'buy', t:'かってきて'},
    {id:'carrot', t:'にんじんを 3ぼん'},
    {id:'potato', t:'じゃがいもを 2こ'},
    {id:'roux', t:'カレールーを 1はこ'},
  ],
  eval(s){
    if(!s.has('buy')) return 'noverb';
    const specs=['carrot','potato','roux'].filter(x=>s.has(x)).length;
    if(specs===3) return s.has('vague')?'success2':'success';
    if(s.has('vague')&&specs>0) return 'frame';
    if(s.has('vague')) return 'bakugai';
    if(specs>0) return 'partial';
    return 'noitem';
  },
  outcomes:{
    noverb:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🛒❓</span>',
      aida:'おみせに ついたよ！ ……で、どう するん だっけ？',
      hint:'「<b>かってきて</b>」を わすれてる みたい！'},
    noitem:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🛒💭</span>',
      aida:'なにを かえば いいの かな……',
      hint:'<b>なにを かうか</b>も おしえて あげよう！'},
    frame:{kind:'soft',
      art:'<span class="e2">🥕🥔✨</span><span class="e1">🍚</span><span class="e2">😢</span>',
      aida:'「カレーに つかう」って きいてたから、<b>カレーむきの あまい にんじん</b>を えらんで きたよ！ ……でも よる、カレーを つくろうと したら……<b>たりない ものが</b>！',
      hint:'めあて＋なまえ＋かず。<b>つたえかたは はなまる</b>！ のこりは <b>リストの ぬけ</b>だけ。おだいカードと くらべて、たりない ものを さがそう！'},
    bakugai:{kind:'fail',
      art:'<span class="e1">🛒</span><br><span class="e3">🥕🥔🍎🍯🍫🧀🍌🍍🥦🍇🌽🍤</span>',
      aida:'カレーに いれられそうな もの、<b>64こ</b> かってきました！ はちみつも りんごも チョコも、いれると おいしいって きいたので！ ぞうさんの ぶんも あります！',
      cap:'おこづかいが たいへんな ことに'},
    partial:{kind:'soft', art:'<span class="e2">🥕🥔</span><span class="e1">🍚</span><span class="e2">😢</span>',
      aida:(s)=>{
        const missing=[['carrot','にんじん'],['potato','じゃがいも'],['roux','カレールー']]
          .filter(([id])=>!s.has(id)).map(([,n])=>n).join('と');
        return 'かってきたよ！ ……あれ？ <b>'+missing+'</b>が ない……これじゃ カレーに ならない……！';
      },
      hint:'ひつような ものが <b>ぜんぶ そろってるか</b>、おだいカードを みて チェック！'},
    success:{kind:'success', art:'<span class="e1">🍛</span><span class="e2">✨🥕🥔</span>',
      aida:'ミッション コンプリート！ にんじん3、じゃがいも2、ルー1はこ！ こんやは カレーだ！（<b>なにに つかうか</b>も おしえて もらえると、もっと ぴったりのを えらべるよ！）',
      cap:'かんぺきな おかいもの！'},
    success2:{kind:'success', art:'<span class="e1">🍛</span><span class="e2">💮🥕🥔✨</span>',
      aida:'めあても なまえも かずも そろった、<b>はなまるの おねがい</b>！ カレーむきの あまい にんじんと、ホクホクの じゃがいも、えらんで きたよ！ こんやは さいこうの カレーだ！',
      cap:'💮 はなまる！ めあて＋なまえ＋かず＝さいきょう'},
  },
  reason:{pre:'', b1:{lb:'なにを つたえて なかった？',
      choices:['なにを いくつ かうか','どこの おみせに いくか','なんじに かえるか'], ok:0},
    mid:'を つたえて なかったから、',
    b2:{lb:'アイナは どうした？',
      choices:['おもいついた ものを ぜんぶ かった','なにも かわなかった','おみせで ねちゃった'], ok:0},
    post:'。'},
  afterReason:'そうそう！ ふわっと たのむと、AIは そうぞうで あなうめ しちゃうんだ。こんどは <b>なにを いくつ</b>まで つたえて みよう！',
  quirk:2,
},
{ // LV3 ふでばこ
  name:'わすれた ふでばこ',
  goalTitle:'がっこうに ふでばこを わすれた！ とってきて もらおう',
  goalArt:'🏫✏️',
  goalNote:'ぼくの つくえは <b>まどぎわの いちばん うしろ</b><br><span style="letter-spacing:.2em">🪟🪑🪑🪑<br>▫️🪑🪑🪑<br>▫️🪑🪑⭐</span>',
  aidaIntro:'とってくる けい、とくいだよ！ きょうしつまで ひとっとび！',
  slots:4,
  tiles:[
    {id:'go', t:'きょうしつに いって'},
    {id:'mydesk', t:'ぼくの つくえから'},
    {id:'pencase', t:'ふでばこを'},
    {id:'fetch', t:'とってきて'},
    {id:'loc', t:'まどぎわの いちばん うしろの つくえから'},
  ],
  eval(s){
    if(!s.has('fetch')) return 'noverb';
    if(!s.has('pencase')) return 'nowhat';
    if(s.has('loc')) return 'success';
    if(s.has('mydesk')) return 'wrongdesk';
    return 'where';
  },
  outcomes:{
    noverb:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🏫❓</span>',
      aida:'きょうしつに きたよ！ ……なにを すれば いいんだっけ？',
      hint:'<b>どうさの ことば</b>を わすれずに！'},
    nowhat:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">❓</span>',
      aida:'なにを とって くるの？',
      hint:'<b>なにを</b>、を つたえよう！'},
    where:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🌀</span>',
      aida:'ふでばこ……！ せかいには ふでばこが 8おくこ あるんだ。どこの ふでばこ？',
      hint:'<b>どこにある</b> ふでばこか、つたえて あげよう！'},
    wrongdesk:{kind:'fail', art:'<span class="e1">🤖</span><span class="e2">👝✨🖊️</span>',
      aida:'「ぼくの つくえ」だね！ たぶん いちばん まえの つくえ！ もってきました！ じしん あります！',
      cap:'……なかみが キラキラペン。それ、クラスメイトのだ！'},
    success:{kind:'success', art:'<span class="e1">👝</span><span class="e2">✏️✨</span>',
      aida:'まどぎわの いちばん うしろ、たしかに かいしゅう！ はい、きみの ふでばこ！',
      cap:'ばしょが わかれば かんぺき！'},
  },
  reason:{pre:'アイナは ', b1:{lb:'アイナが しらなかった ことは？',
      choices:['どれが ぼくの つくえか','ふでばこの つかいかた','きょうしつの ばしょ'], ok:0},
    mid:'を しらないのに、',
    b2:{lb:'アイナは どうした？',
      choices:['きかずに かってに きめちゃった','ちゃんと きいて くれた','とちゅうで かえってきた'], ok:0},
    post:'。'},
  afterReason:'「ぼくの」は、きみの あたまの なかに しか ないんだ。<b>ばしょや めじるし</b>に ほんやく して あげよう！',
  quirk:3,
},
{ // LV4 るすばん
  name:'はじめての るすばん',
  goalTitle:'たいせつな にもつが とどく 日。アイナに るすばんを まかせよう',
  goalArt:'🏠🚚📦',
  goalNote:'<b>たくはいびんの にもつは うけとる</b>。<b>しらない ひとには でない</b>',
  aidaIntro:'るすばん、まかせて！ げんかんの まえで スタンバイ かんりょう！',
  slots:5,
  tiles:[
    {id:'anyone', t:'だれか きたら'},
    {id:'sayrusu', t:'るすですと いって'},
    {id:'courier', t:'たくはいびんの ひとからは'},
    {id:'receive', t:'にもつを うけとって'},
    {id:'stranger', t:'しらない ひとには'},
    {id:'dontopen', t:'でないで'},
  ],
  eval(s){
    // 節の成立を先に判定する: つくり手の想定ではなく、文として読める結合をすべて拾う
    const courierDone=s.has('courier')&&s.has('receive');
    const strangerDone=s.has('stranger')&&(s.has('dontopen')||s.has('sayrusu'));
    const strangerOpen=s.has('stranger')&&!s.has('dontopen')&&!s.has('sayrusu');
    const defaultRusu=s.has('anyone')&&s.has('sayrusu')&&!s.has('stranger');
    if(courierDone&&strangerDone) return s.has('anyone')?'success2':(s.has('sayrusu')?'successRusu':'success');
    if(courierDone&&defaultRusu) return 'success3';
    if(s.has('courier')&&!s.has('receive')){
      // 「でないで」はcourierにも結合できる（strangerが取っていなければ）
      if(s.has('dontopen')&&!s.has('stranger')) return 'courierrefuse';
      return 'courierhalf';
    }
    if(strangerDone&&!s.has('receive')) return 'strangeronly';
    if(s.has('anyone')&&(s.has('sayrusu')||s.has('dontopen'))&&!s.has('receive')&&!s.has('stranger')) return 'allrusu';
    if(s.has('sayrusu')&&s.has('receive')) return 'mixed';
    if(strangerOpen&&s.has('receive')) return 'strangerhalf';
    if(courierDone) return 'freeze';
    if(s.has('receive')) return 'whofrom';
    return 'unclear';
  },
  outcomes:{
    unclear:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🚪❓</span>',
      aida:'げんかんに いるよ！ ……えっと、なにを すれば？',
      hint:'<b>にもつを うけとる</b> おねがいを くみたてよう！'},
    whofrom:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">📦❓</span>',
      aida:'にもつを うけとる！ ……だれから でも いいの かな？',
      hint:'<b>だれからは うけとる／だれには でない</b>、まで きめて あげよう！'},
    mixed:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🌀</span>',
      aida:'うけとるの？ るすなの？ アイナ、あたまが ぐるぐる してきた……',
      hint:'はんたいの めいれいが まざってる みたい。<b>だれには どうする</b>か、わけて つたえよう！'},
    allrusu:{kind:'fail', art:'<span class="e1">🚚</span><span class="e2">💨📦</span>',
      aida:(s)=>s.has('sayrusu')
        ?'だれが きても「るすです！」って いいました！ たくはいびんの ひとにも いいました！ にもつは もちかえられました！ かんぺきな るすばん です！'
        :'だれが きても、いっさい でませんでした！ もちろん たくはいびんの ひとも むし！ にもつは もちかえられました！ かんぺきな るすばん です！',
      cap:'たいせつな にもつが……もちかえられた……'},
    courierrefuse:{kind:'soft', art:'<span class="e1">🚚</span><span class="e2">💨📦🤖✋</span>',
      aida:'たくはいびんの ひとには でない、りょうかい！ ……ピンポーン。……がまん。……にもつ、もちかえられちゃった けど、よかったんだよね？',
      hint:'あれ？ おだいでは、にもつは <b>うけとる</b>んだった！ だれには なにを するか、みなおして みよう！'},
    strangeronly:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🚪✋</span>',
      aida:'しらない ひとには たいおうしない、りょうかい！ ばっちり ガード するよ！ ……ところで、にもつは どう すれば いい？',
      hint:'しらない ひと対策は バッチリ！ あとは <b>たくはいびんの ひとへの おねがい</b>も わすれずに！'},
    freeze:{kind:'fail2', art:'<span class="e1">🤖</span><span class="e2">💭🕒</span>',
      aida:'……しらない ひとが きたんだけど、どうすれば いいか かいて なかったから、ドアの まえで <b>3じかん</b> かんがえてた……',
      cap:'いってない ばあいの アイナは フリーズ しちゃう'},
    strangerhalf:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🚪👀</span>',
      aida:'「しらない ひとには」……なに？ つづきが なかったから、しらない ひとと ドアごしに <b>3じかん みつめあっちゃった</b>……',
      hint:'「だれか きたら」で はじめて ばあいわけ する かんがえかた、<b>すごく いい</b>！ あとは「しらない ひとには <b>どうする</b>」まで いいきろう！'},
    success:{kind:'success', art:'<span class="e1">📦</span><span class="e2">🤖✨</span>',
      aida:'にもつ、うけとりました！ セールスの ひとは ていねいに スルー しました！ かんぺき！',
      cap:'じょうけんが そろった るすばん！'},
    success2:{kind:'success', art:'<span class="e1">📦</span><span class="e2">💮🤖✨</span>',
      aida:'「だれか きたら → たくはいびんの ひとなら うけとる ／ しらない ひとなら たいおうしない」。<b>ばあいわけ、かんぺき</b>！ まるで プログラムみたいな おねがいだ！ にもつ、うけとりました！',
      cap:'💮 はなまる！ きっかけ＋ばあいわけ＝プログラムの かんがえかた'},
    successRusu:{kind:'success', art:'<span class="e1">📦</span><span class="e2">🚪🤖✨</span>',
      aida:'にもつ、うけとりました！ しらない ひとには ドアごしに「るす です」って つたえました！ ドアは あけてないので セーフ です！',
      cap:'ばあいわけ 成立！ ドアは あけない、が まもられた'},
    success3:{kind:'success', art:'<span class="e1">📦</span><span class="e2">🤖😅</span>',
      aida:'にもつ、うけとりました！ それいがいの ひとには ぜんいん「るすです」って いって おきました！ ……おかあさんにも いっちゃいました。あとで おこられました。',
      cap:'にもつは ぶじ。でも「それいがい ぜんぶ」は はんいが ひろかった かも'},
    courierhalf:{kind:'soft', art:'<span class="e1">🚚</span><span class="e2">🤖❓</span>',
      aida:'たくはいびんの ひとが きた！ ……「たくはいびんの ひとからは」……なに？ つづきを かんがえてる うちに、トラックが いっちゃった……',
      hint:'「たくはいびんの ひとからは」の <b>つづき（どうする）</b>まで いいきろう！'},
  },
  reason:{pre:'', b1:{lb:'なにを わけて つたえて なかった？',
      choices:['たくはいびんの ひとの こと','げんかんの かぎの こと','おやつの こと'], ok:0},
    mid:'を わけて つたえて なかったから、',
    b2:{lb:'どう なっちゃった？',
      choices:['だいじな にもつまで もちかえられちゃった','にもつが 2こに ふえちゃった','ドアが こわれちゃった'], ok:0},
    post:'。'},
  reason2:{pre:'', b1:{lb:'なにを つたえて なかった？',
      choices:['しらない ひとが きたとき どうするか','たくはいびんの トラックの いろ','ばんごはんの メニュー'], ok:0},
    mid:'を つたえて なかったから、',
    b2:{lb:'どう なっちゃった？',
      choices:['アイナが こまって フリーズしちゃった','アイナが おこっちゃった','にもつが きえちゃった'], ok:0},
    post:'。'},
  afterReason:'AIは「もし〜だったら」が だいすき。<b>ばあいわけ</b>を そろえて あげると、るすばんめいじんに なるよ！',
  quirk:4,
},
{ // LV5 おかたづけ（ボス）
  name:'おかたづけ だいさくせん',
  goalTitle:'ともだちが あそびに くる！ へやを かたづけたい',
  goalArt:'🧸📄🧦🪀📚',
  goalNote:'でも <b>しゅくだいの プリント</b>と <b>くまさん</b>は、ぜったい たいせつ！',
  aidaIntro:'おかたづけモード、きどう！ ぼくの ほんきを みせるよ！',
  slots:4,
  tiles:[
    {id:'room', t:'へやを'},
    {id:'allclean', t:'ぜんぶ きれいに して'},
    {id:'floor', t:'ゆかの ものを'},
    {id:'shelf', t:'たなと はこに しまって'},
    {id:'keep', t:'しゅくだいと くまさんは'},
    {id:'desk', t:'つくえの うえに おいて'},
  ],
  eval(s){
    if(s.has('floor')&&s.has('shelf')&&s.has('keep')&&s.has('desk')) return 'success';
    if(s.has('allclean')&&s.has('keep')){
      if(s.has('desk')) return 'except';
      if(s.has('shelf')) return 'except2';   // 例外節の行き先が「たなとはこ」
      return 'keephalf';
    }
    if(s.has('allclean')){
      if(s.has('shelf')) return 'almostbin';   // 「きれいに＝しまう」と読める。捨てない
      if(s.has('desk')) return 'floordesk';    // ぜんぶ机の上へ（タワー）
      return 'confirm';
    }
    if(s.has('floor')&&s.has('shelf')&&s.has('keep')) return 'keephalf';
    if(s.has('floor')&&s.has('shelf')) return 'almostbin';
    if(s.has('keep')&&(s.has('desk')||s.has('shelf'))){
      if(s.has('floor')) return 'floorhalf';   // keepは閉じたが「ゆかのものを」が開いている
      return 'onlykeep';
    }
    if(s.has('floor')&&s.has('desk')) return 'floordesk';
    return 'unclear';
  },
  outcomes:{
    unclear:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🧹❓</span>',
      aida:'なにを どう すれば いいかな？',
      hint:'<b>なにを・どこに</b>、を くみたてて みよう！'},
    almostbin:{kind:'soft', art:'<span class="e2">📦</span><span class="e1">🤖</span><span class="e2">🧸💧</span>',
      aida:'ゆかの もの、ぜんぶ はこに しまったよ！ ……くまさんも はこの そこに。……なんか かなしそう？',
      hint:'<b>たいせつな もの</b>は、べつの おねがいに して あげよう！'},
    confirm:{kind:'confirm', art:'<span class="e1">🗑️</span><span class="e2">🛍️🛍️</span>',
      aida:'かしこまり！ <b>ぜんぶ すてれば ピカピカ</b> です！ ……ゴミぶくろが パンパンに なったよ。この まま すてちゃって いい？',
      btns:[{t:'いいよ！', to:'binned', cls:'btn-sub'},
            {t:'まって、なかみを みせて', to:'rescued', cls:'btn-green'}]},
    except:{kind:'confirm', art:'<span class="e2">🧸📄✨</span><span class="e1">🗑️</span><span class="e2">🛍️</span>',
      aida:'「しゅくだいと くまさんは つくえの うえ」だね、<b>ちゃんと まもるよ</b>！ ただし書き、わかりやすい！ ……のこりは <b>ぜんぶ すてて</b> ピカピカに するね！ ゴミぶくろが いっぱいに なったよ。すてて いい？',
      btns:[{t:'いいよ！', to:'binned2', cls:'btn-sub'},
            {t:'まって、なかみを みせて', to:'rescued2', cls:'btn-green'}]},
    except2:{kind:'confirm', art:'<span class="e2">🧸📄📦✨</span><span class="e1">🗑️</span><span class="e2">🛍️</span>',
      aida:'「しゅくだいと くまさんは たなと はこに」だね、<b>だいじに しまうよ</b>！ ただし書き、わかりやすい！ ……のこりは <b>ぜんぶ すてて</b> ピカピカに するね！ ゴミぶくろが いっぱいに なったよ。すてて いい？',
      btns:[{t:'いいよ！', to:'binned2', cls:'btn-sub'},
            {t:'まって、なかみを みせて', to:'rescued2', cls:'btn-green'}]},
    keephalf:{kind:'soft', art:'<span class="e1">🤖</span><span class="e2">🧸📄❓</span>',
      aida:'「しゅくだいと くまさんは」……？ つづきが なくて、りょうてに もったまま こまってる……',
      hint:'ただし書きの <b>つづき（どこに おく）</b>まで いいきろう！'},
    onlykeep:{kind:'soft', art:'<span class="e2">🧸📄✨</span><span class="e1">🤖</span><span class="e2">🧦🪀📚</span>',
      aida:'だいじな ものは かたづけたよ！ あんしん！ ……でも へやの ゆかは、まだ ぎっしり ちらかってる……ともだち、もうすぐ くるんだよね？',
      hint:'だいじな ものの おねがいは バッチリ！ あとは <b>のこりの ゆかの もの</b>を どうするかも たのもう！'},
    floorhalf:{kind:'soft', art:'<span class="e2">🧸📄✨</span><span class="e1">🤖</span><span class="e2">🧦❓</span>',
      aida:'しゅくだいと くまさんは かたづけたよ！ ……「ゆかの ものを」……どこに？ りょうてに くつしたを もったまま こまってる……',
      hint:'ゆかの ものの <b>いきさき</b>まで いいきろう！'},
    floordesk:{kind:'soft', art:'<span class="e2">🧦🪀📚</span><span class="e1">🗼</span><span class="e2">🤖💦</span>',
      aida:'ぜんぶ つくえの うえに つみあげたよ！ りっぱな タワーが できた！ ゆかは ピカピカ！ ……ところで、べんきょうは どこで するの？',
      hint:'つくえは べんきょうの ばしょ。<b>しまう ばしょ（たなと はこ）</b>も つかって みよう！'},
    binned2:{kind:'fail2', art:'<span class="e1">🚛</span><span class="e2">💨🧦🪀📚</span>',
      aida:'すてました！ しゅくだいと くまさんは ぶじです！ ……えっ、くつしたと けんだまと 本…… <b>ぜんぶは ゴミじゃ なかった</b>！？ とりかえして きます！！',
      cap:'「きれいに」＝「すてる」だと おもってた……'},
    rescued2:{kind:'soft', clearSel:true,
      art:'<span class="e2">🛍️</span><span class="e1">🧦</span><span class="e2">🪀📚✨</span>',
      aida:'なかみ、みせるね！ ……くつした、けんだま、本…… <b>ゴミじゃない もの</b>が いっぱいだ！ しゅくだいと くまさんは まもってたんだけど……',
      hint:'「ただし〜は のこして」の つかいかたは <b>はなまる</b>！ のこった もんだいは「<b>きれいに</b>」の ことば——すてる こと？ しまう こと？ <b>どうさが はっきりする ことば</b>で いいなおして みよう！'},
    binned:{kind:'fail', art:'<span class="e1">🚛</span><span class="e2">💨</span><span class="e2">🤖🏃💨</span>',
      aida:'すてました！ ……えっ、しゅくだいと くまさんも 入ってた！？ ま、まって トラックさーん！！ ……ぜんそくりょくで とりかえして きました……。つぎからは すてる まえに きくね……',
      cap:'あぶなかった……！'},
    rescued:{kind:'soft', clearSel:true,
      art:'<span class="e2">🛍️</span><span class="e1">🧸</span><span class="e2">📄✨</span>',
      aida:'なかみを みせるね！ ……あっ！ <b>しゅくだいと くまさん</b>が 入ってた！ きみが「みせて」って いって くれた おかげだ！',
      hint:'ナイス かくにん！ じゃあ、<b>たいせつな ものを のこす おねがい</b>に くみなおして みよう！'},
    success:{kind:'success', art:'<span class="e1">✨</span><span class="e2">🧸📄🧹</span>',
      aida:'ゆかは ピカピカ、しゅくだいと くまさんは つくえの うえ！ ……ゴミは この あきばこだけ。すてる まえに、いちおう みせるね！ オッケー？',
      cap:'たいせつな ものは まもられた！'},
  },
  reason:{pre:'', b1:{lb:'なにを しなかった？',
      choices:['なかみを たしかめる こと','おかねを はらう こと','てを あらう こと'], ok:0},
    mid:'を しないで「いいよ」って いっちゃったから、',
    b2:{lb:'どう なりかけた？',
      choices:['たいせつな ものまで すてられかけた','へやが せまく なった','ゴミが しゃべりだした'], ok:0},
    post:'。'},
  reason2:{pre:'', b1:{lb:'なにが きまって なかった？',
      choices:['「きれいに」が なにを する ことか','くまさんの なまえ','そうじの じゅんばん'], ok:0},
    mid:'が きまって なかったから、',
    b2:{lb:'どう なっちゃった？',
      choices:['すてなくて いい ものまで すてられちゃった','へやが もっと ちらかっちゃった','アイナが かえっちゃった'], ok:0},
    post:'。',
    after:'「きれいに して」は <b>きもち</b>、「たなに しまって」は <b>どうさ</b>。AIには どうさの ことばが つたわりやすいんだ！ ただし書きは バッチリだったから、そこは そのままで いこう！'},
  afterReason:'AIの しごとは、<b>おわる まえに たしかめられる</b>んだ。「やる まえに みせて」——これ、めいじんの ことば！',
  quirk:5,
},
];
