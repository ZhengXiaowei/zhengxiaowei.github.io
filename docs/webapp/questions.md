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
let dpr = 1
let ratio = window.devicePixelRatio
let doc = document
let head = doc.querySelector('head')
if (ratio === 2) {
  dpr = 2
} else if (ratio === 3) {
  dpr = 3
}
let scale = 1 / dpr
let meta = doc.createElement('meta')
meta.setAttribute('name', 'viewport')
meta.setAttribute(
  'content',
  `initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`
)
head.appendChild(meta)
```

待续。。。