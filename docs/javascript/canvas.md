---
title: canvas踩坑记
---

# canvas 踩坑记

## 前言

原来以为还不想这么快接触`canvas`的，可是最近因为业务需要，不得不提前开始接触`canvas`了。

需求是根据后台传回来的图片和文字进行合成图片，然后保存到本地

虽然可以根据现有的插件`html2canvas`，但是毕竟第一次接触，也想了解下`canvas`的 api，所以还是自己动手写写咯

要实现的最后的样子如下，就大概画了个草图：

<img :src="$withBase('/assets/canvas.png')">

实现这样的内容，其实也还算简单，使用到的 api 也不多，主要就两个，一个是绘制文本的`fillText`，一个是绘制图片的`drawImage`。

## 踩坑过程

### 图片位置计算

因为需要依次获取图片，好计算下一张图片的显示位置，所以这里简单使用`promise`去加载图片，并且将当前的图片对象返回，之后好记录些数据：

```js
function loadImageSync(src) {
  return new Promise(resolve => {
    let img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.src = src
  })
}
```

然后就可以这样使用了：

```js
// 假设img_src1和img_src2是后台获取到的
let { img_src1, img_src2 } = this.data
let img1 = null
loadImageSync(img_src1)
  .then(img => {
    img1 = img
    ctx.drawImage(img1, 0, 0)
    return loadImageSync(img_src2)
  })
  .then(img => {
    ctx.drawImage(img, 0, img1.height)
  })
```

这样每张图片的绘制高度就容易计算了。

### 文本换行

因为`bgImage`部分还要显示一段文本内容，而文本内容也是从后台获取后来的，具体有多少字都是不清楚的，然后也不能全部放在一行，毕竟`canvas`没有提供文字换行的 api。。不过好在有`measureText`这个方法，这个方法可以返回文字的宽度，可以利用这点做个计算：

```js
function textAutoLine(text, canvas, initX, initY, lineHeight) {
  let ctx = canvas.getContext('2d')
  // 等同于css的font
  ctx.font = 'bold 18px Microsoft Yahei'
  // 初始化一行字体的宽度为0
  let lineWidth = 0
  let canvasWidth = canvas.width
  // 初始化截取位置为0
  let lastSubStrIndex = 0
  for (let i = 0; i < text.length; i++) {
    // 循环计算每个字的宽度 并累加到行宽上
    lineWidth += ctx.measureText(text[i]).width
    // 判断行宽是否到达一个临界值 也就是： 容器宽 - 文字第一个字的位置 - 临界值（可自定义调整）
    if (lineWidth > canvasWidth - (initX + 40)) {
      // 一行达到临界，开始绘制，并且重置行宽，另起一行，开始绘制下一行
      ctx.fillText(text.substring(lastSubStrIndex, i), initX, initY)
      initY += lineHeight
      lineWidth = 0
      lastSubStrIndex = i
    }
    if (i === text.length - 1) {
      // 第二行字 再做偏移
      ctx.fillText(text.substring(lastSubStrIndex, i + 1), initX + 40, initY)
    }
  }
}
```

### 绘制 dom

底部内容是后台返回的一段`html`代码，因为是个`dom`片段，所以使用`canvas`绘制起来就相当麻烦了，经资料查找后发现可以通过特殊的方式，将`dom`绘制成图片：

```js
function drawDomToImg(dom) {
  let domData = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200">
                      <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml">${dom}</div>
                      </foreignObject></svg>`
  let DOMURL = window.URL || window.webkitURL || window
  let svg = new Blob([domData], { type: 'image/svg+xml;charset=utf-8' })
  let src = DOMURL.createObjectURL(svg)
  return loadImageSync(src)
}
```

这样就能将一段`dom`也绘制成图片了，最后我们将绘制后的路径传到`loadImageSync`中，也能得到这个图片的信息了，比如宽和高。

### 图片跨域

整个内容都绘制完成之后，要将其生成图片，使用`canvas`的`toDataURL`就可以完成，不过这个操作出现了个问题，就是出现了图片跨域的问题。

经查找资料后发现，在使用`canvas`绘制的时候，图片的资源是**本地或者外链**都是可以的，但是生成图片的时候，使用**外链**的图片无法绘制进`canvas`中，可能是因为`canvas`的同源策略的保护机制吧。

解决方式需要两点，一个是改造我们之前的`loadImageSync`的方法，加入一句代码：

```js
function loadImageSync(src) {
  return new Promise(resolve => {
    let img = new Image()
    // 加入这句
    img.setAttribute('crossOrigin', 'Anonymous')
    img.onload = () => {
      resolve(img)
    }
    img.src = src
  })
}
```

还有一个就是需要后台设置`CORS`了，就是设置`Access-Control-Allow-Origin: *`，允许跨域。这样就可以使用`canvas`生成图片了。