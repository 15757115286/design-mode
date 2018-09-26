function * generator(startNumber){
    let add1 = yield startNumber;
    let add2 = yield add1;
    return add2; 
}
function add(num){
    return num + 1;
}
// 初始化赋值并生成（返回）指向内部状态的指针对象，此时并不会执行函数
let gen = generator(1);
// 函数执行，并且会在遇到第一个yield的时候停下，并且返回yield后面表达式的值，这里返回startNumber的值1，所以result1.value = 1
let result1 = gen.next();
// 函数通过next函数继续执行，next(param) 中的参数param的值会传递给yield表达式。上面例子中可以看成yield startNumber = add(result1.value)
// 所以add1的值就是2，所以这里yield add1返回的值就是2，可以清晰的得到result2.value = 2
let result2 = gen.next(add(result1.value));
// 同理这里next里传递到里面的参数为 2 + 1 = 3，所以add2的值为3，这里result3.value = 3。result3.done = true，证明整个generator执行完毕
let result3 = gen.next(add(result2.value));
// 如果当函数执行完毕以后（可能被异常打断），那么后续再执行next函数不会报错，但是返回的值一直是{ value:undefined,done:true }
console.log(result1,result2,result3);