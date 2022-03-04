/**
 * Created by zane on 2022/3/3 19:00
 * @description .
 */

const compose = function () {
  let fns = arguments
  return (val) => Array.from(fns).reduceRight((result, fn) => fn(result), val)
}

const add = x => x + 10
const multiply = x => x * 10

console.log(compose(multiply, add)(10))
