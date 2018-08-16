---
title: List-view 实现
---

# List-view

## 需求

`List-view`所需要的场景也是蛮多的，比如支付宝的通讯录以及定位手动选择都涉及到了`List-view`，因为自己将要做的项目中也会使用到，所以今天就简单的手动实现下`List-view`的功能。

## 纯 Javascript 实现

这里先实现一个简单的效果，如下图所示：

<img :src="$withBase('/assets/list-view.gif')">

我们先简单的将页面布局实现下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>列表</title>
  <style>
    html,
    body,
    p {
      margin: 0;
      padding: 0;
    }

    .wrapper {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch
    }

    .menu {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      z-index: 999;
    }

    .menu a {
      text-decoration: none;
    }

    .title,
    .fixed-title {
      background: #0094ff;
      color: #fff;
      height: 38px;
      line-height: 38px;
    }

    .fixed-title {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 99;
    }

    .list p {
      height: 30px;
      line-height: 30px;
    }
  </style>
</head>

<body>
  <div class="menu">
    <a href="#list1">a</a>
    <a href="#list2">b</a>
    <a href="#list3">c</a>
  </div>
  <div class="fixed-title" style="display:none">A</div>
  <div class="wrapper">
    <div id="list1" data-index="A">
      <div class="title">A</div>
      <div class="list">
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
        <p>1</p>
      </div>
    </div>
    <div id="list2" data-index="B">
      <div class="title">B</div>
      <div class="list">
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
        <p>2</p>
      </div>
    </div>
    <div id="list3" data-index="C">
      <div class="title">C</div>
      <div class="list">
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
        <p>3</p>
      </div>
    </div>
  </div>
</body>

</html>
```

右侧的短菜单的点击，联动左侧的内容显示，这里使用的是最简单的方式，`a`链接锚点跳转。锚点跳转的方式有以下几种：

- href -> name # a 的 href 属性对应 a 的 name 属性
- href -> id # a 的 href 属性对标签的 ID 属性
- 使用 scrollIntoView(true) # 通过 js 实现

这里我们使用的是第二种 `href -> id`的方式来实现。

> 固定头部对应滚动区块的实现思路

- 最上方的是`A`区块，固定头在`A`区块的范围内，都是显示`A`区块的名称
- 当滚动到`B`区块时，滚动条滚动的距离是`A`区块的高度，超过`A`区块的高度，就是`B`区块，则可以将固定头的名称修改成`B`区块的名称
- 当滚动到`C`区块时，滚动条滚动的距离是`A`区块和`B`区块的和，超过这个和，就是`C`区块，则可以将固定头的名称修改成`C`区块的名称

依次类推，滚动到`N`区块时，只要超过`N`区块之前所有区块的高度和即可。因此我们需要将每个区块所需要滚动的距离存入一个数组中，方便之后使用：

```js
// 获取区块滚动距离的数组
function getHeighList() {
  var arr = []
  arr.push(0)
  var aHeight = document.querySelector('#list1').clientHeight
  var bHeight = document.querySelector('#list2').clientHeight
  var cHeight = document.querySelector('#list3').clientHeight
  arr.push(aHeight)
  arr.push(aHeight + bHeight)
  arr.push(aHeight + bHeight + cHeight)
  return arr
}
```

> 区块过渡效果实现

- `A`->`B`之间，也就是`0-A_height`的距离，当距离`A_height`还有固定头的高度时，开始进行过渡
- `B`->`C`之间，也就是`A_height-(A_height+B_height)`的距离，`A_height+B_height`是到`B`所需要的滚动距离

所以这里就会用到刚刚说到的滚动距离数组了。
过渡效果也就是当前区块与下一个区块之间，当快达到固定头的那个临界值时，开始一个过渡效果。

```js
// 核心代码
function listViewScroll() {
  // 容器
  var wrapper = document.querySelector('.wrapper')
  // 固定头
  var fixedTitle = document.querySelector('.fixed-title')
  // 固定头的高度
  var titleHeight = 38
  // 获取高度集合
  var heightArr = getHeighList()
  // 监听容器的滚动事件
  wrapper.addEventListener('scroll', function(e) {
    var scrollY = e.target.scrollTop
    // 当滚动在最上方时，隐藏固定头，只有开始滚动的时候显示
    if (scrollY <= 0) {
      fixedTitle.style.display = 'none'
      fixedTitle.innerText = ''
    } else {
      fixedTitle.style.display = 'block'
    }
    for (var i = 0; i < heightArr.length; i++) {
      ;(function(index) {
        var h1 = heightArr[i]
        var h2 = heightArr[i + 1]
        // 在当前区块和下一个区块之间滚动
        if (scrollY > h1 && scrollY < h2) {
          // 计算滚动到下一个区块的差值
          var diff = h2 - scrollY
          // 当差值小于固定头高度的时候开始过渡
          if (diff > 0 && diff < titleHeight) {
            var dis = diff - titleHeight
            fixedTitle.style.transform = `translate3d(0,${dis}px,0)`
          } else {
            // 过渡结束后重置固定头的距离
            fixedTitle.style.transform = `translate3d(0,0,0)`
          }
          // 修改固定头的文案
          fixedTitle.innerText = document
            .querySelector('#list' + (i + 1))
            .getAttribute('data-index')
        }
      })(i)
    }
  })
}
```

## Vue 实现

待续~
