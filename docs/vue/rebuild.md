---
title: 重构Vue阅读器
---

# 重构Vue阅读器

早期项目因为赶进度之类的，一些代码和模块都是挤在一起，显得很冗余，也很不方便之后的维护，所以打算将公司的项目进行一次重构，本次重构使用`vue-cli3.0`为模板进行升级重构。

## 安装

直接使用命令安装新版本的`vue-cli`：

```bash
npm install -g @vue/cli
# 或者
yarn global add @vue/cli
```

安装成功后，直接通过`vue create project`来创建项目即可。

::: tip 提示
有趣的是，`vue-cli3.0`提供了一个**可视化**的操作面板，可以通过这个面板创建、打包、分析以及管理项目，也可以进行包的管理。感兴趣的朋友可以直接通过命令`vue ui`玩耍玩耍~
:::

## 配置

不同于`vue-cli`之前版本的是，`vue-cli3.0`缩小的大幅度的配置，因为内部已经配置了大多数常用的`webpack`配置了，而我们只需要在根目录配置一个`vue.config.js`文件就可以管理以及配置我们的项目。

这里我们也不细说怎么去配置`vue.config.js`，[官网](https://cli.vuejs.org/zh/config/)其实说的也很清楚了，这里就直接上一些简单的配置：

```js
// vue.config.js 配置
module.exports = {
  baseUrl: "./",
  lintOnSave: false,
  indexPath: "index.html",
  chainWebpack: config => {
    // 修改webpack内部配置
    if (process.env.NODE_ENV === "production") {
      // 修改打包模板
      config.plugin("html").tap(args => {
        args[0].template = "public/index.prod.html";
        // 加上属性引号
        args[0].minify.removeAttributeQuotes = false;
        return args;
      });
      // 忽略文件设置
      config.plugin("copy").tap(args => {
        args[0][0].ignore = [...args[0][0].ignore, "index.prod.html"];
        return args;
      });
    }
  },
  configureWebpack: config => {
    // 增加webpack配置
    // 打包忽略项
    if (process.env.NODE_ENV === "production") {
      config.externals = {
        vue: "Vue",
        "vue-router": "VueRouter"
      };
    }
  }
};
```

## 重构 -- 阅读器

整个项目逻辑最复杂的就是阅读器这块，而阅读器这块，这里打算使用[黄轶老师](https://github.com/ustbhuangyi)出品的[`better-scroll`](https://github.com/ustbhuangyi/better-scroll)进行封装重构。

之所以使用`better-scroll`我也想了挺久的，`better-scroll`在滚动上体验上确实没得说，相当的好，唯一让我犹豫的就是它太大了，打包进`vendor`的话无疑会大大加大包的体积，但是后来又灵光一闪，诶，我打包的时候抽离出来用cdn的方式引入不就好了？毕竟`gzip`只有`9kb`，就小多了。于是就美滋滋的决定了~。

扯多了，开始吧~

阅读器的核心功能，也就是比较难的一个就是**阅读模式**的切换，分**竖屏阅读**和**横屏滚动**阅读。

**竖屏阅读**倒是简单，通过封装`better-scroll`，默认竖屏滚动即可。

先简单封装下阅读器的滚动组件`reader-wrapper.vue`：

```vue
<template>
  <div class="reader-wrapper"
       ref="wrapper">
    <div :class="[
      'wrapper-content',
      direction === 'horizontal' ? 'horizontal' : 'vertical']"
         ref="readerWrapper">
      <div class="scroll-content"
           ref="content">
        <div class="content"
             ref="chapter">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

// * 滚动方向
const DIRECTION_V = "vertical";
const DIRECTION_H = "horizontal";

export default {
  name: "x-reader-wrapper",
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    startY: {
      type: Number,
      default: 0
    },
    bounce: {
      default: true
    }
  },
  mounted() {
    setTimeout(() => {
      // * 初始化bs
      this.init();
    }, 20);
  },
  destroyed() {
    this.$refs.wrapper && this.$refs.wrapper.destroy();
  },
  methods: {
    init() {
      if (!this.$refs.wrapper) {
        return;
      }
      // * bs 配置
      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.direction === DIRECTION_V,
        scrollX: this.direction === DIRECTION_H,
        startY: this.startY,
        bounce: this.bounce,
        momentum: this.direction === DIRECTION_V
      };

      this.scroll = new BScroll(this.$refs.wrapper, options);

      if (this.listenScroll) {
        // * 监听滚动
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    destroy() {
      this.scroll.destroy();
    }
  }
};
</script>
```

然后新建一个`reader.vue`用来引用`reader-wrapper.vue`：

```vue
<template>
  <div class="reader">
    <reader-wrapper ref="reader"
                    :direction="direction">
      <p class="x-reader-text-name"
         style="font-size: 24px;">第1章 初相见</p>
      <p class="x-reader-text-paragraph">哈哈十二年的冬月初1，是顾轻舟的生日，她今天十六岁整了。</p>
      <p class="x-reader-text-paragraph"> 她乘坐火车，从小县城出发去岳城。</p>
      <p class="x-reader-text-paragraph"> 岳城是省会，她父亲在岳城做官，任海关总署衙门的次长。</p>
      <p class="x-reader-text-paragraph"> 她两岁的时候，母亲去世，父亲另娶，她在家中成了多余。</p>
      <p class="x-reader-text-paragraph"> 母亲忠心耿耿的仆人，将顾轻舟带回了乡下老家，一住就是十四年。</p>
      <p class="x-reader-text-paragraph"> 这十四年里，她父亲从未过问，现在却要在寒冬腊月接她到岳城，只有一个原因。</p>
      <p class="x-reader-text-paragraph"> 司家要她退亲！</p>
      <p class="x-reader-text-paragraph"> 岳城督军姓司，权势显赫。</p>
      <p class="x-reader-text-paragraph"> “是这样的，轻舟小姐，当初太太和司督军的夫人是闺中密友，您从小和督军府的二少帅定下娃娃亲。”来接顾轻舟的管事王振华，将此事原委告诉了她。</p>
      <p class="x-reader-text-paragraph"> 王管事一点也不怕顾轻舟接受不了，直言不讳。</p>
      <p class="x-reader-text-paragraph"> “.......少帅今年二十了，要成家立业。您在乡下多年，别说老爷，就是您自己，也不好意思嫁到显赫的督军府去吧？”王管事又说。</p>
      <p class="x-reader-text-paragraph"> 处处替她考虑。</p>
      <p class="x-reader-text-paragraph"> “可督军夫人重信守诺，当年和太太交换过信物，就是您贴身带着的玉佩。督军夫人希望您亲自送还玉佩，退了这门亲事。”王管事再说。</p>
      <p class="x-reader-text-paragraph"> 所谓的钱权交易，说得极其漂亮，办得也要敞亮，掩耳盗铃。</p>
      <p class="x-reader-text-paragraph"> 顾轻舟唇角微挑。</p>
      <p class="x-reader-text-paragraph"> 她又不傻，督军夫人真的那么守诺，就应该接她回去成亲，而不是接她回去退亲。</p>
      <p class="x-reader-text-paragraph"> 当然，顾轻舟并不介意退亲。</p>
      <p class="x-reader-text-paragraph"> 她未见过司少帅。</p>
      <p class="x-reader-text-paragraph"> 和督军夫人的轻视相比，顾轻舟更不愿意把自己的爱情填入长辈们娃娃亲的坑里。</p>
      <p class="x-reader-text-paragraph"> “既然这门亲事让顾家和我阿爸为难，那我去退了就是了。”顾轻舟顺从道。</p>
      <p class="x-reader-text-paragraph"> 就这样，顾轻舟跟着王管事，乘坐火车去岳城。</p>
      <p class="x-reader-text-paragraph"> 看着王管事满意的模样，顾轻舟唇角不经意掠过一抹冷笑。</p>
      <p class="x-reader-text-paragraph"> “真是歪打正着！我原本打算过了年进城的，还在想用什么借口，没想到督军夫人给了我一个现成的，真是雪中送炭了。”顾轻舟心道。</p>
      <p class="x-reader-text-paragraph"> 去退亲，给了她一个进城的契机，她还真应该感谢司家。</p>
      <p class="x-reader-text-paragraph"> 顾轻舟长大了，不能一直躲在乡下，她母亲留给她的东西都在城里，她要进城拿回来！</p>
      <p class="x-reader-text-paragraph"> 她和顾家的恩怨，也该有个了断了！</p>
      <p class="x-reader-text-paragraph"> 退亲是小事，回城里的顾家，才是顾轻舟的目的。</p>
      <p class="x-reader-text-paragraph"> 顾轻舟脖子上有条暗红色的绳子，挂着半块青螭玉佩，是当年定娃娃亲时，司夫人找匠人裁割的。</p>
      <p class="x-reader-text-paragraph"> 裂口处，已经细细打磨过，圆润清晰，可以贴身佩戴。</p>
      <p class="x-reader-text-paragraph"> “玉器最有灵气了，将其一分为二，注定这桩婚事难以圆满，我先母也无知了些。”顾轻舟轻笑。</p>
      <p class="x-reader-text-paragraph"> 她复又将半块玉佩放入怀中。</p>
      <p class="x-reader-text-paragraph"> 她的火车包厢，只有她自己，管事王振华在外头睡通铺。</p>
      <p class="x-reader-text-paragraph"> 关好门之后，顾轻舟在车厢的摇晃中，慢慢添了睡意。</p>
      <p class="x-reader-text-paragraph"> 她迷迷糊糊睡着了。</p>
      <p class="x-reader-text-paragraph"> 倏然，轻微的寒风涌入，顾轻舟猛然睁开眼。</p>
      <p class="x-reader-text-paragraph"> 她闻到了血的味道。</p>
      <p class="x-reader-text-paragraph"> 下一瞬，带着寒意和血腥气息的人，迅速进入了她的车厢，关上了门。</p>
      <p class="x-reader-text-paragraph"> “躲一躲！”他声音清冽，带着威严，不容顾轻舟置喙。</p>
      <p class="x-reader-text-paragraph"> 没等顾轻舟答应，他迅速脱下了自己的上衣，穿着冰凉湿濡的裤子，钻入了她的被窝里。</p>
      <p class="x-reader-text-paragraph"> 火车上的床铺很窄小，挤不下两个人，他就压倒在她身上。</p>
      <p class="x-reader-text-paragraph"> “你.......”顾轻舟还没有反应过来是怎么回事，男人压住了她。</p>
      <p class="x-reader-text-paragraph"> 速度很快。</p>
      <p class="x-reader-text-paragraph"> 男人浑身带着煞气，血腥味经久不散，回荡在车厢里。</p>
      <p class="x-reader-text-paragraph"> 他的手，迅速撕开了她的上衫，露出她雪白的肌肤。</p>
      <p class="x-reader-text-paragraph"> “叫！”他命令道，声音嘶哑。</p>
    </reader-wrapper>
  </div>
</template>

<script>
import ReaderWrapper from "./reader-wrapper";

export default {
  components: {
    ReaderWrapper
  },
  data() {
    return {
      direction: "horizontal"
    };
  }
};
</script>
```

这样竖屏滚动就好了。

### 横屏滚动

横屏滚动要考虑的东西就有些多了：

- 页面的布局 类似轮播一样排版，但是又不是轮播
- 滚动方向
- 滚动边界的判断 下一页还是下一章 上一页还是上一章

第一点，因为小说内容谁也不知道一页里能放下多少段话，所以对于横屏的分页来说有点小麻烦，不过好在有个`css`属性能帮助我们解决这个--`columm`布局。

我们通过`column-width`和`column-gap`两个属性即可，因为`column-count`我们并不知道可以分成几列。

- `column-width` - 列宽
- `column-gap` - 每列的间隔

具体可以参照菜鸟教程或者 w3school 去了解。这里都没有书写`css`的内容~。

我们改装下之前封装的`reader-wrapper.vue`，首先我们需要监听`direction`，如果方向改变了，则需要去计算滚动宽度：

```vue
<script>
export default {
  watch: {
    direction(dir) {
      this.initDir(dir);
    }
  },
  methods: {
    initDir(dir) {
      // * 初始化滚动方向
      let refs = this.$refs;
      if (dir === "horizontal") {
        // * 横向需要一个总内容宽度
        this.$nextTick(() => {
          // * 在 column 布局下，可以直接获取元素的scrollWidth
          refs.content.style.width = refs.chapter.scrollWidth + "px";
        });
      } else {
        // * 竖向清除内容宽度 默认为设备宽度
        refs.content.style.width = "";
      }
      // * 重置滚动位置
      this.scrollTo(0, 0);
    }
  }
};
</script>
```

总宽度知道的话，我们就能知道一章小说能够被分为多少页，因为设备宽度我们也能获取，可以通过`滚动宽度 / 设备宽度 = 页数`

```vue
<script>
export default {
  methods: {
    countPage(total) {
      // * 计算总页码数
      this.width = Math.min(
        window.innerWidth,
        window.screen.width,
        document.body.offsetWidth
      );
      // * 设置可视距离宽度
      this.$refs.chapter.style.width = this.width + "px";
      // * 页码结果向上取整
      let pageCount = Math.ceil(total / this.width);
      this.$emit("count-page", {
        pageCount,
        disArr: this.perSwiperDis(pageCount), // 每页需要的滚动距离
        dWidth: this.width
      });
    },
    perSwiperDis(totalPage) {
      // * 计算每页的滚动距离
      let sum = 0;
      let arr = [];
      arr.push(sum);
      for (let i = 1; i < totalPage; i++) {
        sum += -this.width;
        arr.push(sum);
      }
      return arr;
    }
  }
};
</script>
```

然后在`initDir`方法中调用下即可：

```js
// ...
refs.content.style.width = refs.chapter.scrollWidth + "px";
// * 计算页码
this.countPage(refs.chapter.scrollWidth);
// ...
```

然后就是滚动滑页和方向的判断，一开始我是使用监听滚动事件，然后每次滚动的坐标`x`去和页面滚动距离数组中循环对比，然后去计算判断方向，后来发现这样太傻逼了，也相当耗性能，每次都得去循环判断，累都得累死。

后来发现`bs`有提供一个`movingDirectionX`的属性，可以知道用户在滑动的过程中是从哪个方向进行滑动的，然后就有一个简便点的方式，一个是，我不需要滚动的实时坐标，我只要用户离开屏幕后的坐标即可，而且我也不需要循环滚动距离数组去做对比，我只要知道我在哪一页就行了，因为`页码-1`后就对应滚动距离数组中的值。

可能看着理解起来有些乱，那我们直接就用代码说话吧，找到`reader-wrapper.vue`：

```vue
<script>
export default {
  methods: {
    init() {
      // 省略若干代码...
      // * 监听手指离开屏幕的事件 并返回最后的x，y坐标和移动方向
      // * 我们只需要横屏滚动的时候监听
      if (this.direction === DIRECTION_H) {
        this.scroll.on("touchEnd", pos => {
          this.$emit("touch", {
            pos,
            dir: {
              x: this.scroll.movingDirectionX,
              y: this.scroll.movingDirectionY
            }
          });
        });
      }
      // 省略若干代码...
    }
  }
};
</script>
```

然后进入`reader.vue`页面：

```vue
<template>
  <div class="reader">
    <!-- 绑定上组件返回的事件 -->
    <reader-wrapper ref="reader"
                    :direction="direction"
                    @touch="touch"
                    @count-page="countPage">
      <!-- 省略内部结构 -->
    </reader-wrapper>
  </div>
</template>

<script>
import ReaderWrapper from "./reader-wrapper";

// * 滚动阈值
const THRESHOLD_NEXT = -50;
const THRESHOLD_PREV = 50;

export default {
  components: {
    ReaderWrapper
  },
  data() {
    return {
      direction: "horizontal",
      pageCount: 1,
      curPage: 1,
      distance: 0
    };
  },
  methods: {
    touch({ pos, dir }) {
      // * 只对横向滚动 边界判断
      if (this.direction === "vertical") return;
      this.distance = pos.x;
      let arr = this.disArr;
      let pageDir = arr[this.curPage - 1];
      let diff = this.distance - pageDir;
      // * 从右向左滑
      if (dir.x === 1) {
        if (diff < THRESHOLD_NEXT) this.nextPage();
        else this.lockPage();
      }
      // * 从左向右滑
      if (dir.x === -1) {
        if (diff > THRESHOLD_PREV) this.prevPage();
        else this.lockPage();
      }
    },
    countPage({ pageCount, disArr, dWidth }) {
      // * pageCount - 总页数
      // * disArr - 每页需要的滚动距离
      // * dWidth - 设备宽度
      this.pageCount = pageCount;
      this.disArr = disArr;
      this.width = dWidth;
    },
    nextPage() {
      // * 翻页逻辑 -- 下一页
      let reader = this.$refs.reader;
      if (this.curPage === this.pageCount) {
        // * 最后一页再往后翻 就获取下一章内容
        console.log("最后一页了");
      } else {
        this.curPage++;
        this.lockPage();
      }
    },
    prevPage() {
      // * 翻页逻辑 -- 上一页
      let reader = this.$refs.reader;
      if (this.curPage === 1) {
        // * 第一页再往前翻 就获取上一章内容
        console.log("第一页了");
      } else {
        this.curPage--;
        this.lockPage();
      }
    },
    lockPage() {
      // * 锁定停留的页面
      let reader = this.$refs.reader;
      let pageDir = this.disArr[this.curPage - 1];
      reader.scrollTo(pageDir, 0, 300);
      this.distance = pageDir;
    }
  }
};
</script>
```

这样一个阅读器大致的功能就出来了。不过后来测试也发现了一些问题：

- 切换横竖屏的时候，横屏滚动会出现不流畅的情况
- 使用`padding`等让盒子宽度变化的属性时，会加入到滚动距离中，导致滚动到最后一页时，出现偏差

第一个问题，解决方案是，在切换横竖屏后，销毁`bs`实例，然后重新初始化一个新的实例。

第二个问题就是避免在容器上加例如`padding`的属性，从内部段落上加入`padding`等属性即可。

最后实现的效果如下：

<img :src="$withBase('/assets/reader/reader.gif')">

---

### 显示阅读器的菜单

阅读器的核心部分完成之后，接下来就是显示阅读的操作菜单了。

我们先在`reader-wrapper.vue`中布置出菜单部分：

```vue
<template>
  <div class="reader-wrapper"
       ref="wrapper"
       :style="{fontSize:fz}">
    <!-- 阅读器部分 -->
    <div :class="[
      'wrapper-content',
      direction === 'horizontal' ? 'horizontal' : 'vertical']"
         ref="readerWrapper">
      <div class="scroll-content"
           ref="content">
        <div class="content"
             ref="chapter">
          <slot></slot>
        </div>
      </div>
    </div>
    <!-- 头部菜单和底部菜单 -->
    <transition name="down">
      <div class="wrapper-header" v-show="menu">
        <slot name="header">
          <reader-header></reader-header>
        </slot>
      </div>
    </transition>
    <transition name="up">
      <div class="wrapper-menu" v-show="menu">
        <slot name="menu">
          <reader-menu></reader-menu>
        </slot>
      </div>
    </transition>
  </div>
</template>
```

之所以菜单部分还是用插槽是因为，之后是有打算将阅读器部分完全抽离出来，封装成独立的组件，方便之后的项目使用，不同的项目，可能菜单部分多少有些不一样，所以使用插槽，让其更具灵活一些。

这里还加入了显示菜单的动画，用过阅读app的朋友都能看到这么个效果，呼出操作菜单的时候，顶部是下滑而出，底部是上滑而出，所以我们要做的也是这个效果，直接使用`transition`即可，动画效果也比较简单：

```stylus
// 下滑
.down-enter, .down-leave-to {
  opacity 0
  transform translateY(-100%)
}

// 上滑
.up-enter, .up-leave-to {
  opacity 0
  transform translateY(100%)
}

.down-enter-active, .down-leave-active,
.up-enter-active, .up-leave-active {
  transition all 0.3s
}
```

然后我们建立一个`reader-header.vue`和`reader-menu.vue`用于放置头部菜单和底部菜单，`reader-header`部分比较简单：

```vue
<!-- reader-header.vue -->
<template>
  <div class="reader-header">
    header
  </div>
</template>
```

然后就是`reader-menu`部分：

```vue
<template>
  <div class="reader-menu">
    <div class="reader-menu__box">
      <div class="menu-box__text">字号</div>
      <div class="menu-box__item">
        <div class="item-font__operator item-font__subtract">A-</div>
        <div class="item-font__text">19</div>
        <div class="item-font__operator item-font__add">A+</div>
        <div class="item-font__reset">默认</div>
      </div>
    </div>
    <div class="reader-menu__box">
      <div class="menu-box__text">背景</div>
      <div class="menu-box__item">
        <div class="item-bg"></div>
        <div class="item-bg"></div>
        <div class="item-bg"></div>
        <div class="item-bg"></div>
        <div class="item-bg"></div>
      </div>
    </div>
    <div class="reader-menu__box">
      <div class="menu-box__item">
        <div class="item-operator">上一章</div>
        <div class="item-operator">目录</div>
        <div class="item-operator">翻页方式</div>
        <div class="item-operator">夜间</div>
        <div class="item-operator">下一章</div>
      </div>
    </div>
  </div>
</template>
```

这样，头部和底部的菜单就完成了。

哈哈哈 都是简单的书写哈~

最后完成的效果如下：

<img :src="$withBase('/assets/reader/reader-menu.gif')">

---

### 字体大小切换

唔，昨天我们把底部菜单的布局给实现了，今天实现下一些具体功能 -- **字体大小切换**

阅读器上肯定会存在一些默认属性，比如默认的字体大小，默认的背景色，默认的阅读方式(竖屏还是横屏)之类的，我们可以将这些默认配置写入到一个配置文件里，这里有两种方式做默认配置：

- 一个通过`vuex`来控制这些默认数据
- 一个是通过一个`js`文件存储，然后通过`bus`来操作

两者不管使用哪一种，都得需要借助`localStorage`来保存用户的操作，避免刷新浏览器后重置了用户的设置。

我个人喜欢将用户容易操作到的变量存入`vuex`中，然后一些固有数据放在`js`配置文件中做使用，这里就不做`vuex`的配置和说明了，看[官方文档](https://vuex.vuejs.org/zh/guide/)或者我之前写过的一篇粗略的[Vuex学习笔记](./index.html)也可。

我这里将用户的常用操作变量放在`vuex中`：

```js
// state.js
const str = window.localStorage;

const state = {
  fontSize: str.getItem("fontSize") || 14,            // 默认字体
  bgIndex: str.getItem("bgIndex") || 1,               // 背景索引
  direction: str.getItem("direction") || "vertical",  // 阅读方式
  night: str.getItem("night") || false                // 是否夜间模式
};

export default state;
```

都是优先从缓存中取，如果有就用缓存数据，没有则使用默认数据。

`commit`部分就不写了，这里就写下`action`部分，用户操作`commit`后顺便将这些数据存入缓存中：

```js
// action.js
import * as type from "./mutation-type";
const str = window.localStorage;

// 修改阅读器的设置
export const setReaderOptions = ({ commit, getters }, { name, value }) => {
  switch (name) {
    case "font":
      commit(type.SET_FONTSIZE, value);
      str.setItem("fontSize", value);
      break;
    case "bg":
      commit(type.SET_BG_INDEX, value);
      str.setItem("bgIndex", value);
      break;
    case "direction":
      commit(type.SET_READER_DIRECTION, value);
      str.setItem("direction", value);
      break;
    case "night":
      commit(type.TOGGLE_READER_NIGHT);
      str.setItem("night", getters.night);
      break;
    default:
      return;
  }
};
```

然后我们再定义一个`readerOptions.js`来放置固定的配置数据：

```js
// readerOptions.js
const readerOptions = {
  defaultFontSize: 19,  // 默认字体大小
  maxFontSize: 36,      // 最大字体大小
  minFontSize: 12,      // 最小字体大小
  bgColorList: []       // 背景列表，含背景色，对应背景色的字体色，暂时没找对应数据
};

export default readerOptions;
```

最后我们就在`reader-menu.vue`中引入使用就行：

```vue
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import ReaderOptions from "./readerOptions.js";

export default {
  computed: {
    ...mapState("reader", ["direction"]),
    ...mapGetters("reader", ["fontSize", "night"])
  },
  data() {
    return {
      min: ReaderOptions.minFontSize,
      max: ReaderOptions.maxFontSize,
      default: ReaderOptions.defaultFontSize,
      bgList: ReaderOptions.bgColorList
    };
  },
  methods: {
    subtract() {
      this.font = this.fontSize;
      // * 边界判断
      if (this.font - 1 < this.min) return;
      this.setReaderOptions({ name: "font", value: this.font - 1 });
      this.$emit("font", this.font - 1);
    },
    add() {
      this.font = this.fontSize;
      // * 边界判断
      if (this.font + 1 > this.max) return;
      this.setReaderOptions({ name: "font", value: this.font + 1 });
      this.$emit("font", this.font + 1);
    },
    resetFont() {
      this.setReaderOptions({ name: "font", value: this.default });
      this.$emit("font", this.default);
    },
    toggleNight() {
      this.setReaderOptions({ name: "night" });
    },
    changeDir() {
      let dir = this.direction === "vertical" ? "horizontal" : "vertical";
      this.setReaderOptions({
        name: "direction",
        value: dir
      });
      this.$emit("direction", dir);
    },
    ...mapActions("reader", ["setReaderOptions"])
  }
}
</script>
```

是不是不难？以为就这样结束了？哎，坑还有着呢~

- 修改字体大小后，需要重新刷新`bs`的容器高度或者宽度，不然会出现滚动不到底的情况
- 横屏下，因为字体变化，所以生成的页码数量也会跟着变动，所以需要重新计算页码
- 横屏下，如果滑动到第3页，再修改字体，页面会默认滚动到最开始的地方，也就是`x=0`，再次滑动会直接跳过第2页，直接到第3页，体验不好
- 横屏下，重新计算宽度后，滚动不到最后

想必你们也想到了怎么解决了，对，就是利用`bs`的`refresh`方法：

```vue
<script>
export default {
  watch: {
    font() {
      // * 字体变化后需要重新计算宽度
      this.$nextTick(() => {
        if (this.direction === "horizontal") {
          // * 因为重新计算位置后，dom也发生了变化，所以refresh要放在initDir之后
          // * 可以使用setTimeout也可以再使用一次this.$nextTick()方法
          this.initDir(this.direction);
          setTimeout(() => {
            this.refresh();
            // * 重新锁定滚动位置，原来在第几页就还是第几页
            // * false 表示不需要滚动动画，不然修改字体总会从第1页动画滑动到当前页，看起来也不好
            this._lockPage(false);
          }, 20);
        } else this.refresh()
      });
    }
  },
}
</script>
```

老规矩 最后的实现效果如下：

<img :src="$withBase('/assets/reader/reader-change-font.gif')">

## todos

- 背景切换