#!/usr/bin/env node
/*
 * おねがいラボ ビルド（依存ゼロ）
 * src/ の4ファイルを単一の index.html に合成する。
 *   src/shell.html  … HTML骨格（プレースホルダ入り）
 *   src/style.css   … 見た目
 *   src/data.js     … 台本（レベル・くせずかん）— コンテンツはここだけ触れば増やせる
 *   src/engine.js   … 進行エンジン（状態機械・描画）
 * 配布物が単一HTMLなのは意図（学校端末でファイル1個・通信ゼロで動く）。
 * index.html は生成物なので直接編集しない。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const src = (p) => fs.readFileSync(path.join(__dirname, 'src', p), 'utf8').trimEnd();

// 2系統ビルド（v0.2.0で2章は公開ビルドに正式収録。差はゲートだけ）:
//   index.html     … 公開用。2章は「1章ボスクリアで解放」(CH2_ALWAYS=false)
//   index_dev.html … 開発プレビュー。2章が最初から解放 (CH2_ALWAYS=true)
const hasCh2 = fs.existsSync(path.join(__dirname, 'src', 'data2.js'));
const compose = (dev) => src('shell.html')
  .replace('{{STYLE}}', () => src('style.css'))
  .replace('{{DATA}}', () => hasCh2 ? src('data.js') + '\n' + src('data2.js') : src('data.js'))
  .replace('{{ENGINE}}', () => {
    let e = src('engine.js');
    if (hasCh2) {
      let e2 = src('engine2.js');
      if (!dev) e2 = e2.replace('const CH2_ALWAYS=true', 'const CH2_ALWAYS=false');
      e += '\n' + e2;
    }
    return e;
  });

const html = compose(false);
if (hasCh2 && !html.includes('CH2_ALWAYS=false')) {
  throw new Error('公開ビルドのゲート切替(CH2_ALWAYS=false)に失敗。engine2.jsの宣言を確認');
}
fs.writeFileSync(path.join(__dirname, 'index.html'), html + '\n');
console.log('built: index.html (' + html.length + ' chars' + (hasCh2 ? ', 2章ゲート=1章クリア' : '') + ')');

if (hasCh2) {
  const htmlDev = compose(true);
  fs.writeFileSync(path.join(__dirname, 'index_dev.html'), htmlDev + '\n');
  console.log('built: index_dev.html (' + htmlDev.length + ' chars, 2章ゲート=常時解放)');
}
