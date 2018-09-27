// yield
// 如果在next()函数中出现异常（generator函数中代码运行过程中）,可以对该次的next进行try catch包围
// 异常会使得整个gen函数执行完毕。后续的所有next都只会返回done：true
function test1(){
    function foo(a,b){
        console.log(a,b);
    }
    function * genFoo(x){
        a;
        console.log('after error')
        yield fsdf;
        yield ss;
        foo(yield x,(yield 'b') ? fsdf : 'xwt')
    }
    var g = genFoo('dsw');
    try{
        console.log(g.next())
        console.log(g.next('cc'))
        console.log(g.next('cc'))
    }catch(e){
        console.log(e)
    }
    
    console.log(g.next('cc'))
    console.log(g.next('cc'))
}

function test2(){
    function * gen(){
        yield 1;
        yield 2;
        try{
            yield 3;
        }catch(e){
            console.log(e);
        }
        yield 4;
        yield 5;
    }
    let g = gen();
   console.log(g.next())
   console.log(g.next())
   console.log(g.next())
   // throw也相当于自动执行了一次next
   console.log(g.throw(new Error('aa')))
   console.log(g.next())
   console.log(g.next())
}
function test3(){
    let p = new Promise(res=>{
        setTimeout(()=>{
            res(123);
        },1000)
    }).then(res=>{
        g.next(res);
    })
    function * gen(){
        console.log(1);
        let c = yield p;
        console.log(c);
    }
    let g = gen();
    g.next()
}
test3();
