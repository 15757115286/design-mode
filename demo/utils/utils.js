var utils = null;
(function(window,factory){
    utils = factory(window);
})(window,function(window){
    var utils = Object.create(null);
    
    // 源生函数别名
    var toString = Object.prototype.toString;
    var fnProto = Function.prototype;

    // 需要定义的类型数组，ES6可以用Symbol.toStringTag来定义自己的类型
    const types = ['Number','String','Boolean','Ojbect','RegExp','Undefined','Null','Array','Symbol','Function'];
    // 创建isType闭包函数
    function defineTypeFn(type){
        return function(obj){
            return toString.call(obj) === '[object ' + type + ']';
        }
    }
    // 类型判断函数集合
    const Type = Object.create(null);
    types.forEach(type=>{
        Type['is' + type] = defineTypeFn(type);
    });
    utils.Type = Type;

    // 创建单例模式
    function createSingleFn(fn){
        var cache = null;
        if(!Type.isFunction(fn)) return fn;
        return function(){
            return cache || (cache = fn.apply(this,arguments));
        }
    }
    utils.createSingleFn = createSingleFn;

    // 高阶函数实现AOP

    // before函数定义，直接修改Function.prototype
    if(Type.isUndefined(fnProto.before)){
        fnProto.before = function before(beforeFn){
            // 因为是函数的prototype，所以before调用的时候是function通过原型链获得的
            var fn = this;
            return function(){
                if(Type.isFunction(beforeFn)){
                    beforeFn.apply(this,arguments);
                }
                return fn.apply(this,arguments);
            }
        }
    }

    // after函数定义，亦直接修改Function.prototype
    if(Type.isUndefined(fnProto.after)){
        fnProto.after = function after(afterFn){
            var fn = this;
            return function(){
                let result = fn.apply(this,arguments);
                if(Type.isFunction(afterFn)){
                    afterFn.apply(this,arguments);
                }
            }
        }
    }

    // 由于上面的写法对函数原型链有入侵行为，并且在函数原型本身有after或者before的时候是无法注入after和before
    // 故在这里提供库中自己的aop写法

    function createAop(fn,beforeFn,afterFn){
        return function(){
            var result;
            if(Type.isFunction(beforeFn)){
                beforeFn.apply(this,arguments);
            }
            if(Type.isFunction(fn)){
                result = fn.apply(this,arguments);
            }
            if(Type.isFunction(afterFn)){
                afterFn.apply(this,arguments);
            }
            return result;
        }
    }

    utils.createAop = createAop;

    return utils;
})