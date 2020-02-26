---
title: 搭建vue-tsx风格的开发模板
meta:
  - name: description
  - content: 搭建基于vue的tsx风格的开发模板
  - name: keywords
  - content: vue vue-cli tsx typescript
---

# 搭建vue-tsx风格的开发模板

## 项目创建

使用`vue-cli3+`创建一个基于`ts`的模板：

```bash
vue create vue-tsx-template

# 或者使用vue ui进入GUI模式创建
vue ui
```

创建的时候记得勾选`typescript`，`css`预处理器看各自喜好选择，操作步骤如下：
<img src="http://normal-image.xiaovv-web.com/normal/2020-02-26-CleanShot%202020-02-26%20at%2015.07.38.gif">

等待`npm/yarn`安装结束后就是一个基于`ts`的`vue`模板了。

## vue-tsx-support

上一步中已经创建完了基于`ts`的`vue`模板，但是开发方式还是如同之前的`template`一样，只是将`script`中的`js`部分改成了`ts`来书写。接下来就将**模板(template)**方式改成**tsx**的方式，这里需要借助一个库 -- [vue-tsx-support](https://github.com/wonderful-panda/vue-tsx-support)

首先安装`vue-tsx-support`：

```bash
npm install vue-tsx-support --save
# or
yarn add vue-tsx-support
```

安装结束后，我们需要对我们的文件做点小改动，首先我们在主入口文件`main.ts`中引入：

```typescript
// main.ts
import "vue-tsx-support/enable-check";

// 省略。。
```
然后删掉`src/shims-tsx.d.ts`文件，避免和`vue-tsx-support/enable-check`冲突。

最后在我们的`vue.config.js`文件里的`configureWebpack`属性下增加一项`resolve`：

```js
// vue.config.js

module.exports = {
  // ...
  configureWebpack: {
    resolve: {
      extensions: [".js", ".vue", ".json", ".ts", ".tsx"] // 加入ts 和 tsx
    }
  }
}
```

这样就可以了，接下来就可以开始开发了。

我们在`/components`下新建一个`button`文件夹，并创建一个文件`button.tsx`。然后开始书写我们`tsx`风格的`vue`代码：

```typescript
// components/button/button.tsx
import { Component, Prop } from "vue-property-decorator";
import * as tsc from "vue-tsx-support";

interface ButtonClick {
  (value: string): void
}

interface ButtonProps {
  text: string;
  btnClick: ButtonClick
}

@Component
export default class ZButton extends tsc.Component<ButtonProps> {
  @Prop() text!: string;

  public btnClick(value: string): void {
    console.log("value is: ", value);
  }

  protected render() {
    return (
      <div>
        <button onClick={() =>  this.btnClick("click")}>{this.text}</button>
      </div>
    )
  }
}
```

这样我们就完成了一个简单的`tsx组件了`。

接下来我们需要去`views/Home.tsx`中使用这个组件，删掉原来的`Home.vue`，并创建一个`Home.tsx`：

```typescript
// views/Home.tsx
import { Component, Vue } from "vue-property-decorator";
import { Component as tsc } from "vue-tsx-support";
import ZButton from "@/components/button/button.tsx";

@Component({
  components: {
    [ZButton.name]: ZButton
  }
})
export default class HomeContainer extends tsc<Vue> {
  protected render() {
    return <z-button text="点我！"></z-button>;
  }
}
```

最后将`App.vue`改成`App.tsx`：

```typescript
// App.tsx
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  protected render() {
    return (
      <div id="app">
        <router-view></router-view>
      </div>
    );
  }
}

```

然后运行，能看到以下效果：
<img src="http://normal-image.xiaovv-web.com/normal/2020-02-26-CleanShot%202020-02-26%20at%2015.57.45.gif">

就这样完成了一个简单的`tsx`风格的`vue`项目了。

## mixins

新建`mixins/index.ts`，在`index.ts`中写一个`vue mixin`：

```typescript
// mixins/index.ts
import { Vue, Component } from "vue-property-decorator";

// 这里一定要做个声明 不然在组件里使用的时候会报不存在的错误
// 要对应mixin中的属性和方法
declare module "vue/types/vue" {
  interface Vue {
    mixinText: string;
    showMixinText(): void;
  }
}

@Component
export default class MixinTest extends Vue {
  public mixinText: string = "我是一个mixin";

  public showMixinText() {
    console.log(this.mixinText);
  }
}
```

然后在`component/button/button.tsx`中使用：

```typescript
// component/button/button.tsx
import { Component, Prop } from "vue-property-decorator";
import * as tsc from "vue-tsx-support";

import MixinTest from "@/mixins";

interface ButtonClick {
  (value: string): void;
}

interface ButtonProps {
  text: string;
  btnClick: ButtonClick;
}

// 在Component装饰器上注入mixin
@Component({
  mixins: [MixinTest]
})
export default class ZButton extends tsc.Component<ButtonProps> {
  @Prop() text!: string;

  public btnClick(value: string): void {
    console.log("value is: ", value);
  }

  // 点击事件中调用mixin的方法
  protected render() {
    return (
      <div>
        <button onClick={() => this.showMixinText()}>{this.text}</button>
      </div>
    );
  }
}

```

## vuex

## api