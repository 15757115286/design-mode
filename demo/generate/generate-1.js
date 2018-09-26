// 完成最基本版本，只能含有promise的异步
function loadName(name) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`hello,${name}`);
        }, 1000)
    })
}

function loadInfo(greet, age) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`${greet},your age is ${age} !`);
        }, 1000)
    })
}

function* generate(name, age) {
    let greet = yield loadName(name);
    console.log(greet);
    let info = yield loadInfo(greet, age);
    console.log(info);
    return info;
}

function bind(...args) {
    let self = this;
    return function () {
        let fn = args[0];
        return fn.apply(self, args.slice(1));
    }
}

let gene = bind(generate, 'xwt', 18);

function sync(fn) {
    return new Promise(resolve => {
        let gen = fn();
        function next(data) {
            let result = gen.next(data);
            if (result.done) return resolve(result.value);
            result.value.then(res => {
                next(res);
            })
        }
        next();
    })
}

let resu = sync(gene).then(res=>{console.log(res)});