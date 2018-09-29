(function createAsyncClass(window, factory) {
  window.AsyncList = factory(window);
})(window, function(window) {
  // 使用Symbol来创建类内部的私有变量
  let list = Symbol("list"),
    options = Symbol("options"),
    doing = Symbol("doing"),
    errorCount = Symbol("errorCount"),
    doTasks = Symbol("doTasks");
  class AsyncList {
    constructor(_options) {
      // 创建AsyncList实例时候混合参数
      this[options] = Object.assign(
        {
          complete: false
        },
        _options
      );
      this[list] = [];
      this[doing] = false;
      this[errorCount] = 0;
    }

    add(fnOrPromise) {
      if (
        (!this[doing] && typeof fnOrPromise === "function") ||
        fnOrPromise instanceof Promise
      ) {
        this[list].push(fnOrPromise);
      }
      return this;
    }
    async [doTasks]() {
      if (this[doing]) return;
      this[doing] = true;
      let result = [];
      let task = null;
      while ((task = this[list].shift())) {
        if (typeof task === "function") {
          task = new Promise((resolve, reject) => {
            try {
              task(resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        }
        try {
          result.push(await task);
        } catch (e) {
          this[errorCount]++;
          if (this[options].complete) {
            result.push(e);
          } else {
            throw e;
          }
        }
      }
      return result;
    }
    hasError() {
      return this[errorCount] > 0;
    }

    start(callback) {
      let promise = this[doTasks]();
      if (typeof callback !== "function") return;
      promise.then(
        data => {
          callback({ data });
        },
        error => {
          callback({ error });
        }
      );
    }
  }
  return AsyncList;
});

/* function asyncFunction(name) {
  return (resolve, reject) => {
    setTimeout(() => {
      reject("hello" + name);
    }, 1000);
  };
}
let todoList = new AsyncList({ complete: false });
console.log(todoList);
console.time("start");
todoList
  .add(asyncFunction("xwt"))
  .add(asyncFunction("cm"))
  .add(asyncFunction("ygc"))
  .start(({ data, error }) => {
    console.log(data, error);
    console.timeEnd("start");
  });
 */
