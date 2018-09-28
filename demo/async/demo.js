// 1 async函数执行以后总是立即返回一个Promise实例（可能是pending/resolved/rejected）
/* function asyncFn(param){
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res(param)
        },1000);
    })
}

async function test1(){
    console.log('in test 1 before asyncFn');
    let re = await 123;
    console.log('sync result')
    let res = await asyncFn('xwt');
    console.log('in test 1 after asyncFn');
    return res;
}
console.log('before test1')
let result = test1();
console.log(result instanceof Promise,result);
console.log('after test1') */

// 上面代码的执行顺序为 before test1 -> in test1 before asyncFn -> true(返回的是promise) -> after test1 -> sync result -> in test1 after asyncFn(1000ms之后)
// 该返回的Promise实例的promiseStatus为pending，当1000ms以后（test1执行完毕的时候）,状态变为resolved
// 从上面代码的顺讯也可以看出 await是一个promise.then的语法糖，碰到await相当于后面的代码是被promise.then()包裹的
// 哪怕是已经解析完成的promise，then方法都会比同步代码执行的晚，可以参照 sync result的打印是在 after test1之后可以发现

// 2 await后面如果不是Promise实例，会转成一个resolved状态的Promise实例。

// 3 如果await后面的promise中出现同步错误或者是被reject了，并且在自身（该promise中）没有catch，该await也没有出现在try/catch块中，那么
// 整个async函数会直接结束，并且执行返回的promise.catch（注意：异步函数中出现的错误无法捕获，需要把异步代码块放入try/catch块中）

// 4 await只能出现在async函数里（通常）

// 5 async函数一旦被执行肯定会返回一个promise实例。且多个async函数直接的执行是异步的，只有一个async函数里面被await的函数是同步执行的（举例证明/2个）

// 6 async函数中最终返回的值会在promise.then中接收到。返回的promise实例的状态只有在所有的await语句后面的promise执行完，才会发生变化。
// 也就是说只有当async函数后面所有的异步操作执行完毕，才会执行返回的promise中的then。除非async中碰到return或者异常（被reject也算）

// 验证async函数中的await 123是否比setTimeout 0 先执行
/* setTimeout(()=>{
    console.log('i am in the setTimout')
},0)
async function fn(){
    let res = await 1;
    console.log('i am in the async function')
    return res;
}
fn().then(res=>{console.log('i am in the rerutn promise')}) */
// Promise捕获异常的2中形式
/* new Promise((resolve,reject)=>{
    undefineVariable;
}).then(null,error=>{
    console.log('in then reject callback');
})

new Promise((resolve,reject)=>{
    reject('reject');
}).catch(error=>{
    console.log('in catch reject callback');
}) */
// Promise无法捕获异步的异常
/* new Promise((resolve,reject)=>{
    setTimeout(()=>{
        undefineVariable;
        reject('success');
    },0)
}).then(null,reject=>{
    console.log(reject);
}).catch(error=>{
    console.log(error)
}) */
// async函数2中异常的处理方法
/* function getPromise(){
    return new Promise((resolve,reject)=>{
        undefineVariable;
        resolve('success');
    })
}
async function demo(){
    try{
        undefineVariable;
    }catch(e){
        console.log(e);
    }
    let result = 'xwt';
    try{
       result = await getPromise();
    }catch(e){
        console.log(result)
        console.log(e);
    }
}
demo(); */
// 不同的async函数之间是异步执行的
/* function loadUrl(url){
    let delay = 1000 * Math.random();
    console.log(`并发请求：正在请求的url:${url}，加载时间${delay}`);
    return new Promise(res=>{
        setTimeout(()=>{
            res(`${url}请求完毕`);
        },delay)
    })
}
async function demo(){
    let urls = ['www.baidu.com','www.cm3zz.cn','www.taobao.com'];
    urls = urls.map(async (url)=>{
        return await loadUrl(url);
    })
    console.log(urls);
    for(let i=0,len=urls.length;i<len;i++){
        urls[i] = await urls[i];
        console.log(urls[i]);
    }
    return urls;
}
demo().then(res=>{
    console.log(res);
}) */
// await不能对应于外层作用域中的async
function asyncFn(index, value) {
  return new Promise(res => {
    console.log(`正在执行第${index}个异步函数，值为${value}`);
    setTimeout(() => {
      res(`异步函数执行完毕，值为${value}`);
    }, 500);
  });
}

// 往forEach中传入异步async函数回调
async function demo() {
  let array = ["xwt", "cm", "ygc"];
  array.forEach(async (value, index) => {
    let result = await asyncFn(index, value);
    console.log(result);
  });
}
// 语法错误的await使用
/* async function demo(){
    let array = ['xwt','cm','ygc'];
    try{
        array.forEach((value,index)=>{
            let v = await asyncFn(index,value);
            console.log(v);
        })
    }catch(e){
        console.error(e);
    }
} */
demo();
