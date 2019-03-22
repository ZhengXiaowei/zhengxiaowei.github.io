---
title: 过滤Object
---

# 过滤 Object 对象

```js
var a = [{ a: 2, b: 3, c: 4 }, { a: 3, b: 4, c: 5 }, { a: 4, b: 5, c: 6 }];

var c = ["a", "c"];

function filterObject(data, filterArr) {
  if (typeof data !== "object" || !Array.isArray(filterArr))
    throw new Error("参数格式不正确");
  const result = {};
  Object.keys(data)
    .filter(key => filterArr.includes(key))
    .forEach(key => {
      result[key] = data[key];
    });
  return result;
}

var b = a.map(function(value) {
  return filterObject(value, c);
});
```
