(function (global, factory) {
    let utils = factory(global);
    if (global.module) {
        // nodejs
        global.module.exports = utils;
    } else if (global) {
        // web
        global.utils = utils;
    }
})(window || global, function (global) {
    var utils = Object.create(null);

    var fnProto = Function.prototype;
    var arrayProto = Array.prototype;
    var objProto = Object.prototype;
    var toString = createUncurryFn(objProto.toString);
    var slice = createUncurryFn(arrayProto.slice);

    // 需要定义的类型数组，ES6可以用Symbol.toStringTag来定义自己的类型
    const types = ['Number', 'String', 'Boolean', 'Ojbect', 'RegExp', 'Undefined', 'Null', 'Array', 'Symbol', 'Function'];
    // 创建isType闭包函数
    function defineTypeFn(type) {
        return function (obj) {
            return toString(obj) === '[object ' + type + ']';
        }
    }
    // 类型判断函数集合
    const Type = Object.create(null);
    types.forEach(type => {
        Type['is' + type] = defineTypeFn(type);
    });
    utils.Type = Type;

    // 创建单例模式
    function createSingleFn(fn) {
        var cache = null;
        if (!Type.isFunction(fn)) return fn;
        return function () {
            return cache || (cache = fn.apply(this, arguments));
        }
    }
    utils.createSingleFn = createSingleFn;

    // 高阶函数实现AOP

    // before函数定义，直接修改Function.prototype
    if (Type.isUndefined(fnProto.before)) {
        fnProto.before = function before(beforeFn) {
            // 因为是函数的prototype，所以before调用的时候是function通过原型链获得的
            var fn = this;
            return function () {
                if (Type.isFunction(beforeFn)) {
                    beforeFn.apply(this, arguments);
                }
                return fn.apply(this, arguments);
            }
        }
    }

    // after函数定义，亦直接修改Function.prototype
    if (Type.isUndefined(fnProto.after)) {
        fnProto.after = function after(afterFn) {
            var fn = this;
            return function () {
                let result = fn.apply(this, arguments);
                if (Type.isFunction(afterFn)) {
                    afterFn.apply(this, arguments);
                }
            }
        }
    }

    // 由于上面的写法对函数原型链有入侵行为，并且在函数原型本身有after或者before的时候是无法注入after和before
    // 故在这里提供库中自己的aop写法

    function createAopFn(fn, beforeFn, afterFn) {
        return function () {
            var result;
            if (Type.isFunction(beforeFn)) {
                beforeFn.apply(this, arguments);
            }
            if (Type.isFunction(fn)) {
                result = fn.apply(this, arguments);
            }
            if (Type.isFunction(afterFn)) {
                afterFn.apply(this, arguments);
            }
            return result;
        }
    }

    utils.createAopFn = createAopFn;

    // 创建curry函数
    function createCurryFn(fn) {
        var args = [];
        return function curry() {
            if (arguments.length === 0) {
                if (Type.isFunction(fn)) {
                    return fn.apply(this, args);
                }
            } else {
                // 把传进来的每一个参数存入args中，相同于es6中的args.push(...arguments)
                args.push.apply(args, arguments);
                return curry;
            }
        }
    }

    utils.createCurryFn = createCurryFn;

    // 创建泛化函数，可以使得如Array.prototype上的函数可以接受任何对象
    function createUncurryFn(fn) {
        return function (self) {
            if (typeof fn !== 'function') return fn;
            var args = arrayProto.slice.call(arguments, 1);
            return fn.apply(self, args);
        }
    }

    utils.createUncurryFn = createUncurryFn;

    // 创建节流函数，这里无需返回函数运行后的值，没有意义（因为大多情况下回返回undefined）
    function throttle(fn, interval, immediate) {
        if (!Type.isFunction(fn)) return;
        if (Type.isUndefined(immediate)) immediate = true;
        var timer = null,
            defaultInterval = 1000;
        return function () {
            var self = this,
                args = slice(arguments);
            if (immediate === true) {
                fn.apply(this, arguments);
                return immediate = false;
            }
            if (timer) return;
            timer = setTimeout(function () {
                fn.apply(self, args);
                timer = null;
            }, interval || defaultInterval);
        }
    }

    utils.throttle = throttle;

    // 因为系统的setInterval会在规定的时间内把任务推入任务队列，所以当执行的任务较长的时候
    // 两个任务之间的间隔会小于规定的时间。如果在任务队列中还有对应的任务，则会跳过这一次的任务推入
    // 所以这里自己定义一个setInterval，用setTimeout来hack，可以避免上面的问题
    function setInterval(fn, interval) {
        var args = slice(arguments, 2);
        var timer = null;
        timer = setTimeout(function loop() {
            timer = setTimeout(loop, interval);
            // 这个一定要放在timer后面执行，不然的话在fn函数里面使用clearInter闭包清除定时器以后还会在创建定时器（被这个坑了挺多时间）
            fn.apply(null, args);
        }, interval)

        return function clearInterval() {
            clearTimeout(timer);
            timer = null;
        }
    }

    utils.setInterval = setInterval

    // 分时函数，可以用于留有空隙给游览器进行渲染，防止游览器大面积渲染而导致页面假死
    // 但是这里需要注意的是由于这里是异步的执行，所以第二次函数的执行是在同步代码之后的
    function timeChunk(array,fn,count,interval){
        if(!Type.isFunction(fn)) return;
        if(!Type.isArray(array)) array = [array];
        if(!Type.isNumber(count) || count <= 0) count = 1;
        interval = interval || 1000;
        var i ,copyOfArray = array.slice(),clearInterval;
        var start = function start(){
            for(i=0,len=Math.min(copyOfArray.length,count);i<len;i++){
                fn(copyOfArray.shift());
            }
            if(copyOfArray.length == 0) clearInterval();
        }
        clearInterval = setInterval(start,interval);
        start();
        // 如果后续的函数不需要再执行，可以调用此返回的函数
        return clearInterval;
    }

    utils.timeChunk = timeChunk;

    return utils;
})