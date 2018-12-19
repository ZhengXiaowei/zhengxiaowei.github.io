---
title: 移动端问题锦集
---

# 移动端问题锦集

## 移动端 1px 问题

> 产生原因

简单点说就是因为 Retine 屏的分辨率始终是普通屏幕的 2 倍，1px 的边框在`devicePixelRatio=2`的 retina 屏下会显示成 2px，所以在高清屏下 1px 就显得和 2px 差不多，具体细节可以参考[这篇文章](http://www.w3cplus.com/css/towards-retina-web.html)

> 解决方案

- 使用媒体查询

```css
.border_1px {
  border: 1px solid #f1f1f1;
}

@media (-webkit-min-device-pixel-ratio: 2) {
  .border_1px {
    border: 0.5px solid #f1f1f1;
  }
}
```

::: warning 缺点
兼容性差，有的 retina 屏会将 0.5 识别成 0px
:::

- 伪类配合 transform

```stylus
border-1px($color = #ccc, $radius = 2px, $style = solid)
  position relative

  &:after
    content ''
    pointer-events none // 解决iphone上的点击无效Bug
    display block
    position absolute
    left 0
    top 0
    transform-origin 0 0
    border 1px $style $color
    border-radius $radius
    box-sizing border-box
    width 100%
    height 100%

    @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
      width 200%
      height 200%
      border-radius $radius * 2
      transform scale(0.5) translateZ(0)

    @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
      width 300%
      height 300%
      border-radius $radius * 3
      transform scale(0.33) translateZ(0)
```

::: warning 缺点
如果碰上其他伪类并存，则需要多层嵌套
:::

- 使用 box-shadow 模拟

```css
.border_1px {
  box-shadow: inset 0px -1px 1px -1px #f1f1f1;
}
```

::: warning 缺点
边框有阴影，颜色略浅
:::

- 使用 view-port

对于`devicePixelRatio=2`的：

```html
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```

对于`devicePixelRatio=3`的：

```html
<meta name="viewport" content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
```

可以使用`js`判断后动态插入：

```js
let dpr = 1;
let ratio = window.devicePixelRatio;
let doc = document;
let head = doc.querySelector("head");
if (ratio === 2) {
  dpr = 2;
} else if (ratio === 3) {
  dpr = 3;
}
let scale = 1 / dpr;
let meta = doc.createElement("meta");
meta.setAttribute("name", "viewport");
meta.setAttribute(
  "content",
  `initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`
);
head.appendChild(meta);
```

## `rem` 和 `px` 的取舍

如果项目只适配手机端，`px`和`rem`可以根据个人习惯自主选择。

如果项目适配多种设备，比如手机和 pad 设备，分辨率差的比较大的情况下，使用`rem`最优

## 移动端点击背景图/链接有底色

```css
/* 点击的时候底色透明即可 */
-webkit-tap-highlight-color: transparent;
```

## 禁止选择文字/图片

```css
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
```

## 禁止复制/保存图片

```css
img {
  -webkit-touch-callout: none;
}
```

## 页面动画容易出现闪烁白屏

> 使用`translate3d`优化

```css
-webkit-transform: translate3d(0, 0, 0);
-moz-transform: translate3d(0, 0, 0);
-ms-transform: translate3d(0, 0, 0);
transform: translate3d(0, 0, 0);
```

## 使用`float`排列布局容易出现断层

> 出现原因

在使用`float`布局列表的时候，容易出现某一行只出现第一个位置或者最后一个位置的内容，出现这个的原因是，上一行有某个内容的高度和其他高度不同的原因，导致将底下那一行的内容给挤了下去。

> 解决

给每个`item`设置一个**最小高度/固定高度**即可：

```css
.item {
  min-height: 200px;
}
```

## 斜边布局

```css
/* 斜边部分 原理和小三角一样 */
position: absolute;
width: 0;
height: 0;
border-width: 100px 0 0 414px; /* 底边的宽度要等于设备宽度 */
border-style: solid;
border-color: transparent transparent gray gray;
bottom: 0;
z-index: 99;
```

实现效果：

<img :src="$withBase('/assets/css_xie.png')">

## transform 和 fixed

在父元素使用`transform`下使用`fixed`，将会使`fixed`失效。

解决方案是：

- 在使用了`transform`的容器中不使用`fixed`，换`absolute`，并需要通过 js 计算固定位置
- 依然使用`fixed`，不过使用`fixed`的容器放在使用`transform`的容器之外。

## 遮罩层滚动点透问题

在出现遮罩层的时候，我们可以使用`@touchmove.prevent`来防止点透的问题出现，也就是遮罩层背后的内容还能滚动的问题。但是如果这样的话，如果遮罩层内有需要滚动的容器，那将使容器的滚动也失效。

通过自身的了解和网上的收集，主要解决方案有以下几种：

- 给`body`设置 css`{overflow:hidden}`

  ::: warning 问题
  IOS 上无效
  :::

- 给`body,html`都设置 css`{overflow:hidden}`

  ::: warning 问题

  a - 滚动位置会丢失，需要通过 js 设置 scrollTop

  b - 没效果
  :::

- 目前比较完美的解决方案
  ```js
  (function() {
    var scrollTop = 0;

    // 显示弹出层
    open.onclick = function() {
      // 在弹出层显示之前，记录当前的滚动位置
      scrollTop = getScrollTop();

      // 使body脱离文档流
      document.body.classList.add("dialog-open");

      // 把脱离文档流的body拉上去！否则页面会回到顶部！
      document.body.style.top = -scrollTop + "px";

      mask.style.display = "block";
    };

    // 隐藏弹出层
    close.onclick = function() {
      mask.style.display = "none";

      // body又回到了文档流中（我胡汉三又回来啦！）
      document.body.classList.remove("dialog-open");

      // 滚回到老地方
      to(scrollTop);
    };

    function to(scrollTop) {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }
    function getScrollTop() {
      return document.body.scrollTop || document.documentElement.scrollTop;
    }
  })();

  function fixedBody(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    document.body.style.cssText += 'position:fixed;top:-'+scrollTop+'px;';
  }

  function looseBody() {
    var body = document.body;
    body.style.position = '';
    var top = body.style.top;
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
    body.style.top = '';
  }
  ```

不过这样依旧会有点问题，就是如果在遮罩层中滚动的时候，做点击操作，会容易出现卡死的现象，就是滚动后需要进行两次点击，再能进行对应的点击操作。对此的解决方案是，改`click`事件为`touchstart`事件。


## 使用`webkit-overflow-scrolling:touch`的坑

今天遇到的了一个问题就是内容滚动有时候会出现卡住的情况，尤其是当滚动条位于最顶端或者最底下的时候，继续下拉或者上拉会导致页面卡住，这样的情况颇为频繁，找了很久都没发现问题所在，所以在尝试的情况下注释掉了`webkit-overflow-scrolling`后，发现居然好了！！！居然好了！！！

然后就针对这个问题谷歌上找了下，发现其实也很很多：

- 取消`webkit-overflow-scrolling:touch`，但是这样会导致滚动时手指离开就马上停住滚动，没有了惯性滚动

- 让子内容的高度`+1px`，比如父容器使用了`webkit-overflow-scrolling:touch`，那么子内容的容器设置高度`height:calc(100% + 1px)`既可以解决。

## SPA路由使用`history`模式下的微信分享bug

会出现的一个情况是，我已进入页面是可以分享的，当时如果这时候路由变化，比如`replace`或者`push`操作之后，那么分享就会出现问题，并不会如同配置那样分享出来。因为报了`invaild signature`的错误。

这主要还区分安卓和苹果，两者的情况不同。

出现这个的原因是：

在`history`模式下，`vue-router`操作的是浏览器的历史记录，从而改变`URL`的变化。

而官方[JSSDK文档](https://)中也有提到：

> 同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用,目前Android微信客户端不支持pushState的H5新特性，所以使用pushState来实现web app的页面会导致签名失败，此问题会在Android6.2中修复

但是坑爹的是，`android`中出现的问题不多，因为每次`URL`变化后，微信记录的都是当前那个`URL`，而`IOS`则不然，`IOS`是微信只记录页面第一次加载进来的`URL`地址。

举个栗子：

一进入系统的地址是`https://a.com`，然后先后进入`a`、`b`，也就是`https://a.com/a`和`https://a.com/b`，然后停在`b`页面，在`android`中，微信记录的是`https://a.com/b`这个地址，而`IOS`中记录的却是`https://a.com`，也就是第一次进来的路由地址。

这个时候我们刷新页面，那么`https://a.com/b`就是`IOS`第一次进来的地址了，所以`IOS`微信中记录的地址也就变成了`https://a.com/b`了。

解决方式：

注册一个全局变量，比如可以在`window`下挂在一个`wxSignURL`的变量，当一进入页面的时候保存第一次记录的地址：`window.wxSignURL = location.href`。

这段代码可以写在`main.js`里，也可以写在`router.js`的钩子函数中，不过要区别对待，如果是`android`，则使用每次跳转后的路由，如果是`IOS`则使用记录的`wxSignURL`。

然后获取`微信签名`的时候，把这个`URL`传过去即可。

`IOS`和`android`的判断使用浏览器的`ua`判断即可。根据资料，微信会在`window`下挂载一个`__wxjs_is_wkwebview`属性，如果是在`IOS`中，该值为`true`，也可以通过这个属性去判断。