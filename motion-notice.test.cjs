const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=readFileSync(__dirname+'/motion-notice.js','utf8');
function setup(mobile,reduced,stored=false,blocked=false){
  const queries=[{matches:mobile},{matches:reduced}];
  queries.forEach(q=>q.addEventListener=(_,fn)=>q.change=fn);
  const nodes=[];
  const storage={value:stored?'1':null,getItem(){if(blocked)throw Error();return this.value},setItem(_,v){if(blocked)throw Error();this.value=v}};
  const document={body:{append(node){nodes.push(node)}},createElement(){return {controls:{},handlers:{},setAttribute(){},querySelector(selector){return this.controls[selector]??={addEventListener:(_,fn)=>this.controls[selector].click=fn}},addEventListener(name,fn){this.handlers[name]=fn},remove(){this.removed=true}}}};
  vm.runInNewContext(source,{matchMedia:q=>queries[q.includes('reduced')?1:0],sessionStorage:storage,document});
  return {queries,nodes,storage};
}
for(const mobile of [false,true])for(const reduced of [false,true])assert.equal(setup(mobile,reduced).nodes.length,Number(mobile&&reduced));
assert.equal(setup(true,true,true).nodes.length,0);
for(const button of ['.motion-note-close','.motion-note-done']){
  const t=setup(true,true);t.nodes[0].controls[button].click();assert.equal(t.nodes[0].removed,true);t.queries[0].change();assert.equal(t.nodes.length,1);
}
const dynamic=setup(true,false);dynamic.queries[1].matches=true;dynamic.queries[1].change();assert.equal(dynamic.nodes.length,1);dynamic.queries[0].matches=false;dynamic.queries[0].change();assert.equal(dynamic.nodes[0].removed,true);
const escape=setup(true,true);escape.nodes[0].handlers.keydown({key:'Escape'});assert.equal(escape.nodes[0].removed,true);
const denied=setup(true,true,false,true);denied.nodes[0].controls['.motion-note-done'].click();denied.queries[0].change();assert.equal(denied.nodes.length,1);
console.log('PASS: 4 visibility combinations, session suppression, both dismiss buttons, Escape, preference changes, storage failure.');
