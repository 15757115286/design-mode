function as(name){
   return new Promise((res,rej)=>{
       let randomTime = 1000 * Math.random() + 200;
       setTimeout(()=>{
        res('as|' + name + '|' + randomTime);
       }, randomTime)
   }).catch(e=>{
       console.log('promise ee')
   })
}
function syncFn(){
    return 'fsdf';
}
async function test(){
    let start = Date.now();
    let res1 = await syncFn();
    console.log(res1,Date.now() - start);
    let res2 = null;
    try{
        res2 = await as(12);
    }catch(e){
        console.log('as'+e)
    }
    console.log(res2,Date.now() - start);
    return 'xwt' + res1;
}
/* test().then(res=>{
    console.log(res);
}).catch(error=>{
    console.log('oh,you are error',error)
}) */
async function test1(){
    console.time('start');
    let names = ['cm1','xwt1','ygc1'];
    names = names.map(async name=>{
        let value = await as(name);
        return value;
    })
    for(let i = 0,len = names.length;i<len;i++){
        names[i] = await names[i];
    }
    console.timeEnd('start');
    return names;
}
test1().then(res=>{
    console.log(res)
})