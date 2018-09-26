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
        }, 2000)
    })
}

function sleepLoad(address, callback) {
    setTimeout(() => {
        callback('haha!' + address);
    }, 1000)
}

function thunkify(fn) {
    let ctx = this;
    return function (...args) {
        return function (callback) {
            let called = false;
            fn.apply(ctx, args.concat(function (...cbArgs) {
                if (called) return;
                called = true;
                callback.apply(this, cbArgs);
            }));
        }
    }
}

sleepLoad = thunkify(sleepLoad);

let surprise = 'god!';
function* generate(name, age) {
    let start = Date.now();
    let greet = yield loadName(name);
    console.log(greet,Date.now() - start);
    let info = yield loadInfo(greet, age);
    console.log(info,Date.now() - start);
    let address = yield sleepLoad('tongxiang');
    console.log(address,Date.now() - start);
    return (yield 'oh,' + surprise + address) + info;
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
            let value = result.value,
                done = result.done;
            if (done) return void resolve(value);
            if (typeof value === 'function') {
                let copyOfFn = value;
                value = new Promise(res => {
                    copyOfFn(function cb(...resData){
                        if(resData.length == 1){
                            res(resData[0])
                        }else{
                            res(resData);
                        }
                    })
                })
            }
            if (!isPromise(value)) {
                value = Promise.resolve(value);
            }
            value.then(res => {
                next(res);
            })
        }
        next();
    })
}

// 鸭子类型来判断是否为Promise
function isPromise(value) {
    return value instanceof Promise && typeof value.then === 'function';
}

let resu = sync(gene).then(res => {
    console.log(res)
});