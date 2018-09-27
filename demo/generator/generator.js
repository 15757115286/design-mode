function foo(a,b){
    console.log(a,b);
}
function * genFoo(x){
    foo(yield x,(yield 'b') ? 'cm' : 'xwt')
}
var g = genFoo('dsw');
for(let x of g){
    console.log(x);
}

// 第一个next只会让函数开始运行,并且返回第一个yield或者return的值
console.log(g.next())
// 第二个next会让函数从刚才停止的地方开始执行，并把传入的值1cc赋值给刚才的yield表达式yield x
console.log(g.next('1cc'))
console.log(g.next('2'))
var array = [[1,2],[3,4],[5,6]]
var index = 1;
for(let [a,b] of array){
    console.log(`time:${index ++},a:${a},b:${b}`)
}