/**
 * Created by zane on 2022/3/3 19:07
 * @description .
 */
const pipe = function () {
  let fns = arguments
  return (val) => Array.from(fns).reduce((result, fn) => fn(result), val)
}

const add = x => x + 10
const multiply = x => x * 10

console.log(pipe(multiply, add)(10))
