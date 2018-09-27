// 1 async函数执行以后总是立即返回一个Promise实例（可能是pending/resolved/rejected）
function asyncFn(param){
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
console.log('after test1')

// 上面代码的执行顺序为 before test1 -> in test1 before asyncFn -> true(返回的是promise) -> after test1 -> sync result -> in test1 after asyncFn(1000ms之后)
// 该返回的Promise实例的promiseStatus为pending，当1000ms以后（test1执行完毕的时候）,状态变为resolved
// 从上面代码的顺讯也可以看出 await是一个promise.then的语法糖，碰到await相当于后面的代码是被promise.then()包裹的
// 哪怕是已经解析完成的promise，then方法都会比同步代码执行的晚，可以参照 sync result的打印是在 after test1之后可以发现

// 2 await后面如果不是Promise实例，会转成一个resolved状态的Promise实例。

// 3 如果await后面的promise中出现同步错误或者是被reject了，并且在自身（该promise中）没有catch，该await也没有出现在try/catch块中，那么
// 整个async函数会直接结束，并且执行返回的promise.catch（注意：异步函数中出现的错误无法捕获，需要把异步代码块放入try/catch块中）

// 4 await只能出现在async函数里（通常）

// 5 async函数一旦被执行肯定会返回一个promise实例。且多个async函数直接的执行是异步的，只有一个async函数里面被await的函数是同步执行的（举例证明/2个）

// 6 async函数中最终返回的值会在promise.then中接收到