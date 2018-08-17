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
        <!-- 省略n个 -->
        <p>1</p>
      </div>
    </div>
    <div id="list2" data-index="B">
      <div class="title">B</div>
      <div class="list">
        <p>2</p>
        <!-- 省略n个 -->
        <p>2</p>
      </div>
    </div>
    <div id="list3" data-index="C">
      <div class="title">C</div>
      <div class="list">
        <p>3</p>
        <!-- 省略n个 -->
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

::: tip 提示
这里的`vue`项目是通过`vue-cli`脚手架建立的。
:::

我们将`ListView.vue`封装成一个`vue`组件，接收一个`list`参数，然后建立一个`index.vue`，在其引入：

```vue
<template>
  <div class="home">
    <list-view :data="list"
               @loading="loadMore" />
  </div>
</template>

<script>
// @ is an alias to /src
// 数据源
import datas from '@/data.js'
import ListView from '@/components/ListView.vue'

export default {
  name: 'home',
  components: {
    ListView
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    loadMore () {
      // 滚动加载数据
      let isPut = this.list.some(tag => {
        return tag.tag.includes('D')
      })
      let D = { tag: "D", list: ["迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼","迪士尼", "迪士尼","迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼", "迪士尼"] }
      if (!isPut) this.list.push(D)
      else console.log('没有更多了')
    }
  },
  mounted() {
    this.list = datas
  }
}
</script>
```

然后模拟一些数据放在`data.js`中：

```js
const data = [
  {
    tag: 'A',
    list: [
      '阿里',
      // 省略n个
      '阿里'
    ]
  },
  {
    tag: 'B',
    list: [
      '不理',
      // 省略n个
      '不理'
    ]
  },
  {
    tag: 'C',
    list: [
      '磁力',
      // 省略n个
      '磁力'
    ]
  }
]

export default data
```

然后我们在`ListView.vue`组件中书写结构：

```vue
<template>
  <div>
    <!-- 右侧tag部分 -->
    <ul class="short-menu">
      <li class="menu-tag"
          :class="[index===current?'cur': '']"
          v-for="(tag, index) in tagList"
          :key="index"
          :data-tag-index="index"
          @touchstart="getTagStartPosition"
          @touchmove.stop.prevent="moveTagPosition">{{tag}}</li>
    </ul>
    <!-- 顶部的固定头 -->
    <div class="fixed-title"
         v-show="fixedText"
         ref="fixedTitle">{{fixedText}}</div>
    <!-- 滚动内容部分 -->
    <div class="wrapper"
         ref="wrapper">
      <div v-for="(block,index) in data"
           :key="index"
           ref="list">
        <div class="title">{{block.tag}}</div>
        <div class="list"
             v-for="(item,key) in block.list"
             :key="key">
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 右侧Tag标签的高度
const Tag_Height = 18
// 固定头的高度
const Item_Tag_Height = 38

export default {
  name: 'ListView',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      current: 0, // 当前tag的索引
      scrollY: 0, // 滚动距离
      fixedDiff: 0 // 固定头过渡距离
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.wrapper
  position absolute
  top 0
  right 0
  left 0
  bottom 0
  overflow-y scroll
  -webkit-overflow-scrolling touch

  .title
    background #0094ff
    color #fff
    height 38px
    line-height 38px
    text-align left
    padding 0 10px

  .list p
    height 30px
    line-height 30px
    padding 0 10px
    text-align left

.short-menu
  position fixed
  right 0
  top 50%
  transform translateY(-50%)
  width 20px
  z-index 999

  .cur
    color #0094ff

.fixed-title
  position fixed
  top 0
  width 100%
  background #0094ff
  color #fff
  height 38px
  line-height 38px
  z-index 999
  text-align left
  padding 0 10px
</style>
```

大部分的逻辑和之前纯 Javascript 实现的差不多，这里主要是右侧点击滑动到对应区块的逻辑稍作调整，以及增加了右侧`tag`滑动，实施显示对应区块的功能以及滚动到底部加载数据的功能。

> 右侧滑动显示对应区块

这里使用的是`touchstart`和`touchmove`两个事件:

```vue
<script>
export default {
  methods: {
    getTagStartPosition(e) {
      let { tagIndex } = e.target.dataset
      // 记录起始y坐标
      this.y1 = e.touches[0].pageY
      // 记录起始点击的tag
      this.current = this.touchTagIndex = parseInt(tagIndex)
      this.scrollToElement(this.current)
    },
    moveTagPosition (e) {
      // 获取移动到的y坐标
      this.y2 = e.touches[0].pageY
      // 如果移动的距离超过本身tag的高度 那么计算移动了多少个tag 向下取整
      let moveTagNum = Math.floor((this.y2 - this.y1) / Tag_Height)
      this.current = this.touchTagIndex + moveTagNum
      // 边界值判断
      if (this.current < 0) this.current = 0
      if (this.current > this.data.length - 1) this.current = this.data.length - 1
      this.scrollToElement(this.current)
    },
    scrollToElement (index) {
      // 滚动到对应的区块，因为滑动到每个区块的距离我们都存到了数组中，所以只要取到对应区块的距离即可
      let scrollTop = this.heightArr[index]
      this.$refs.wrapper.scrollTop = scrollTop
    }
  }
}
</script>
```

> 滚动加载

```vue
<script>
export default {
  methods: {
    listViewScroll () {
      // 获取滚动容器的高度
      let wrapper = this.$refs.wrapper
      let wrapperHeight = wrapper.clientHeight
      wrapper.addEventListener('scroll', (e) => {
        this.scrollY = e.target.scrollTop
        // 判断滚动条是否滚动到底部（距离底部100px），滚动到底部后触发加载事件
        // 滚动高度 - 容器高度 - 滚动距离 = 滚动条距离底部的距离
        if (this.heightArr[this.heightArr.length - 1] - wrapperHeight - this.scrollY < 100) {
          this.$emit('loading')
        }
      })
    }
  }
}
</script>
```

完整的代码：

```vue
<script>
const Tag_Height = 18
const Item_Tag_Height = 38

export default {
  name: "HelloWorld",
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      current: 0,
      scrollY: 0,
      fixedDiff: 0
    }
  },
  computed: {
    fixedText () {
      if (this.scrollY <= 0) return ''
      return this.data[this.current] ? this.data[this.current].tag : ''
    },
    tagList () {
      return this.data.map(tag => {
        return tag.tag
      })
    }
  },
  methods: {
    getTagStartPosition (e) {
      let { tagIndex } = e.target.dataset
      // 记录起始y坐标
      this.y1 = e.touches[0].pageY
      // 记录起始点击的tag
      this.current = this.touchTagIndex = parseInt(tagIndex)
      this.scrollToElement(this.current)
    },
    moveTagPosition (e) {
      // 获取移动到的y坐标
      this.y2 = e.touches[0].pageY
      // 如果移动的距离超过本身tag的高度 那么计算移动了多少个tag 向下取整
      let moveTagNum = (this.y2 - this.y1) / Tag_Height | 0
      this.current = this.touchTagIndex + moveTagNum
      // 边界值判断
      if (this.current < 0) this.current = 0
      if (this.current > this.data.length - 1) this.current = this.data.length - 1
      this.scrollToElement(this.current)
    },
    scrollToElement (index) {
      // 滚动到对应的区块
      let scrollTop = this.heightArr[index]
      this.$refs.wrapper.scrollTop = scrollTop
    },
    getDataListHeights () {
      // 收集滑动高各个区块所需要的记录
      let list = this.$refs.list
      let height = 0
      this.heightArr = []
      this.heightArr.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.heightArr.push(height)
      }
    },
    listViewScroll () {
      let wrapper = this.$refs.wrapper
      let wrapperHeight = wrapper.clientHeight
      wrapper.addEventListener('scroll', (e) => {
        this.scrollY = e.target.scrollTop
        // 判断滚动条是否滚动到底部（距离底部100px），滚动到底部后触发加载事件
        if (this.heightArr[this.heightArr.length - 1] - wrapperHeight - this.scrollY < 100) {
          this.$emit('loading')
        }
      })
    }
  },
  watch: {
    scrollY (y) {
      let heightArr = this.heightArr
      // 最上方
      if (y <= 0) { this.current = 0; return }
      // 在两个区块之间滚动
      for (let i = 0; i < heightArr.length - 1; i++) {
        let h1 = heightArr[i]
        let h2 = heightArr[i + 1]
        if (y >= h1 && y < h2) {
          this.current = i
          this.fixedDiff = h2 - y
          break
        }
      }
    },
    fixedDiff (diff) {
      // 监听固定头的过渡距离
      let dis = 0
      if (diff > 0 && diff < Item_Tag_Height) {
        dis = diff - Item_Tag_Height
      } else {
        dis = 0
      }
      if (this.fixedDiff === dis) return
      this.$refs.fixedTitle.style.transform = `translate3d(0,${dis}px,0)`
    },
    data () {
      // 当数据变化时 重新计算高度集合
      setTimeout(() => {
        this.getDataListHeights()
      }, 20)
    }
  },
  mounted () {
    setTimeout(() => {
      this.getDataListHeights()
      this.listViewScroll()
    }, 20)
  }
};
</script>
```

最后的效果如下：

<img :src="$withBase('/assets/vue-list-view.gif')">

## 小程序实现

待续~