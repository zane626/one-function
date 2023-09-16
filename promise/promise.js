/**
 * Created by zane on 2022/3/3 19:08
 * @description .
 */
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  onfulfilledList = []
  onrejectedList = []

  constructor (executor) {
    this.state = MyPromise.PENDING
    this.promiseResult = null
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
      this.reject(e)
    }
  }

  isPending () {
    return this.state === MyPromise.PENDING
  }

  resolve (value) {
    if (!this.isPending()) return
    this.state = MyPromise.FULFILLED
    this.promiseResult = value
    this.onfulfilledList.forEach((func) => {
      func()
    })
  }

  reject (error) {
    if (!this.isPending()) return
    this.state = MyPromise.REJECTED
    this.promiseResult = error
    this.onrejectedList.forEach((func) => {
      func()
    })
  }

  then (onfulfilled, onrejected) {
    let newPromise = new MyPromise((resolve, reject) => {
      const pushFunc = (func, isResolve = true) => {
        return () => {
          if (typeof func === 'function') {
            this.resolvePromise(newPromise, func(this.promiseResult), resolve, reject)
          } else {
            isResolve ? resolve(this.promiseResult) : reject(this.promiseResult)
          }
        }
      }
      switch (this.state) {
        case MyPromise.PENDING: {
          this.onfulfilledList.push(pushFunc(onfulfilled))
          this.onrejectedList.push(pushFunc(onrejected, false))
          break
        }
        case MyPromise.FULFILLED: {
          this.onfulfilledList.push(pushFunc(onfulfilled))
          break
        }
        case MyPromise.REJECTED: {
          this.onrejectedList.push(pushFunc(onrejected, false))
          break
        }
      }
    })
  }

  resolvePromise (newPromise, x, resolve, reject) {
    if (x === newPromise) throw new TypeError('禁止循环调用')
    if (x instanceof MyPromise) {
      x.then((res) => {
        this.resolvePromise(newPromise, res, resolve, reject)
      }, err => reject(err))
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let then = null
      try {
        then = x.then
      } catch (e) {
        return reject(e)
      }
      if (typeof then === 'function') {
        let called = false
        try {
          then.call(
            x,
            (res) => {
              if (called) return
              called = true
              this.resolvePromise(newPromise, res, resolve, reject)
            },
            (err) => {
              if (called) return
              called = true
              reject(err)
            }
          )
        } catch (e) {
          console.log(e)
        }
      }
    } else {
      resolve(x)
    }
  }
}

console.log(0)
let pro = new MyPromise((resolve, reject) => {
  console.log(2)
  setTimeout(() => {
    resolve(1)
  })
  console.log(3)
})
let pro1 = new Promise((resolve, reject) => {
  console.log(20)
  setTimeout(() => {
    resolve(10)
  })
  console.log(30)
})
console.log(4)
pro.then((res) => {
  console.log(res)
})
pro1.then((res) => {
  console.log(res)
})
setTimeout(() => {
  console.log(6)
})
console.log(5)
