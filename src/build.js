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
const html = src('shell.html')
  .replace('{{STYLE}}', () => src('style.css'))
  .replace('{{DATA}}', () => src('data.js'))
  .replace('{{ENGINE}}', () => src('engine.js'));
fs.writeFileSync(path.join(__dirname, 'index.html'), html + '\n');
console.log('built: index.html (' + html.length + ' chars)');
