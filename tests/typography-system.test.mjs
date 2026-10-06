import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';

const css=postcss.parse(await readFile(new URL('../app/globals.css',import.meta.url),'utf8'));
const tokens={};css.walkDecls(/^--/,d=>tokens[d.prop]=d.value);
const widths=[320,375,390,768,820,1024,1180,1366,1440];
function size(value,width,base=16){
 value=value.replace(/var\((--[\w-]+)\)/g,(_,name)=>tokens[name]);
 const unit=value.match(/^([\d.]+)(rem|px|vw)$/);
 if(unit)return +unit[1]*(unit[2]==='rem'?base:unit[2]==='vw'?width/100:1);
 const clamp=value.match(/^clamp\(([^,]+),([^,]+),([^,]+)\)$/);
 if(clamp)return Math.max(size(clamp[1],width,base),Math.min(size(clamp[3],width,base),size(clamp[2],width,base)));
 if(value==='100%'||value==='inherit')return base;
 throw new Error(`Unhandled text size: ${value}`);
}
test('all HTML font declarations retain the 13px floor at the requested widths and larger browser text',()=>{
 css.walkDecls('font-size',d=>{
  for(const width of widths)for(const base of [16,32])assert.ok(size(d.value,width,base)>=13,`${d.parent.selector}: ${d.value} at ${width}`);
  assert.ok(!/px/.test(d.value),`${d.parent.selector} must use relative font sizes`);
 });
});
test('the page, section and card heading roles remain separate across responsive widths',()=>{
 for(const w of widths){
  assert.ok(size(tokens['--text-heading-page'],w)>=32&&size(tokens['--text-heading-page'],w)<=48);
  assert.ok(size(tokens['--text-heading-section'],w)>=24&&size(tokens['--text-heading-section'],w)<=30);
  assert.ok(size(tokens['--text-heading-card'],w)>=20&&size(tokens['--text-heading-card'],w)<=22);
 }
});
test('fonts use only the two supplied cuts and no accidental serif family',()=>{
 const faces=[];css.walkAtRules('font-face',r=>{const f={};r.walkDecls(d=>f[d.prop]=d.value);faces.push(f);});
 assert.deepEqual(faces.map(f=>f['font-weight']),['400','700']);
 css.walkDecls('font-family',d=>assert.match(d.value,/Atkinson Hyperlegible|var\(--font-(sans|display)\)|^inherit$/));
 css.walkDecls('font-weight',d=>assert.ok(['400','700','inherit'].includes(d.value),d.value));
});
test('rounding, units, patient tags and medication information cannot regress to decorative text',()=>{
 for(const selector of ['.answer-grid small','.answer-grid label>div span','.case-tags span','.case-text','.medication-effect-card p']){
  const sizes=[];css.walkRules(r=>{if(r.selectors.includes(selector))r.walkDecls('font-size',d=>sizes.push(d.value));});
  assert.ok(sizes.length,selector);
  for(const value of sizes)for(const width of widths)assert.ok(size(value,width)>=16,`${selector}: ${value}`);
 }
 assert.equal(size(tokens['--text-learning'],320),17);
});
test('text colours meet contrast on the shared light surfaces',()=>{
 function luminance(hex){const rgb=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
 for(const fg of [tokens['--muted'],tokens['--accent-text'],'#526168'])for(const bg of ['#ffffff','#fff0e9','#f5f3ed','#edf7f2']){
  const a=luminance(fg),b=luminance(bg);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${fg} on ${bg}`);
 }
});
