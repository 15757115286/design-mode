// promise中为被捕获的异常无法被普通函数的中try/catch块捕获
try {
  let p1 = new Promise((res, rej) => {
    var array = [];
    array.getMine(); // 运行到该处抛出异常 TypeError: array.getMine is not a function。在此处加上try/catch可以捕获该异常
    res(array);
  });
} catch (e) {
  console.log("i capture the error in promise"); // 该日志不会被打印
}

try {
  let p2 = Promise.reject("reject info"); //在控制台打印出错误信息：Uncaught (in promise) reject info
} catch (e) {
  console.log("i capture the error in promise"); //该日志也不会被打印
}

// catch(error)可以看成是then(null,error)的语法糖
let p3 = Promise.reject("reject info")
  .then(res => {
    console.log(res); // 不会执行
  })
  .then(null, error => {
    console.log(error); // 会捕获异常，输出reject info
  })
  .catch(error => {
    console.log("error in catch"); // 因为异常已经被捕获，且后续的promise中没有出现异常，所有没有内容捕获
  });
