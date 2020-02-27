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
然后删掉`src/shims-tsx.d.ts`文件，避免和`vue-tsx-support/enable-check`声明重复冲突。

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
  btnClick?: ButtonClick
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

@Component
export default class HomeContainer extends tsc<Vue> {
  protected render() {
    return <Zbutton text="点我！"></Zbutton>;
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
  btnClick?: ButtonClick;
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
`vuex`的`ts`改造主要有两种方案，一种是基于[vuex-class](https://github.com/ktsn/vuex-class)的方式，一种是基于[vue-module-decorators](https://github.com/championswimmer/vuex-module-decorators)的方式。

因为编码习惯的原因，喜欢在书写`vuex`的时候，一个`module store`的各个小模块都单独写成一个文件，而`vue-module-decorators`则是一个`module store`对应一个文件。所以在选择上，我选择了`vuex-class`，有需要的朋友也可以了解下`vuex-module-decorators`。

安装`vuex-class`：

```bash
npm install vue-class --save
#or
yarn add vuex-class
```

新建一个`system`的`module`，针对`system`的`store`建立各自文件
* `state.ts`
* `getter.ts`
* `mutation.ts`
* `mutation-type.ts`
* `actions.ts`

编写一个简单的例子，在`vuex`中存储`user`信息。

先来编写`state`中的内容：

```typescript
// store/modules/system/state.ts

interface SystemState {
  user: Object
}

const state: SystemState = {
  user: {}
}

export default state;
```

`mutation-type.ts`：

```typescript
// store/modules/system/mutation-type.ts
interface SystemMutationType {
  SET_USER_INFO: String;
}

const Mutation_Type: SystemMutationType = {
  SET_USER_INFO: "SET_USER_INFO"
}

export default Mutation_Type;
```

`mutation.ts`：

```typescript
// store/modules/system/mutation.ts
import type from "./mutation-type";

const mutation: any = {
  [type.SET_USER_INFO as string](state: SystemState, user: Object) {
    state.user = user;
  }
}

export default mutation;
```

`action.ts`：

```typescript
import type from "./mutation-type";
import { Commit } from "vuex";

export const cacheUser = (context: { commit: Commit }, user: Object) => {
  context.commit(type.SET_USER_INFO as string, user);
}
```

然后建立一个`index.ts`将这些外抛出去：

```typescript
// store/modules/system/index.ts
import state from "./state";
import mutations from "./mutation";
import * as actions from "./action";
import * as getters from "./getter";

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
```

最后在`store`的入口文件处引用该`module`：

```typescript
// store/index.ts
import Vue from "vue";
import Vuex from "vuex";
import system from "./modules/system";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    system
  }
});
```

接着我们去组件`button.tsx`中使用：

```typescript
// components/button/button.tsx
import { Component, Prop } from "vue-property-decorator";
import * as tsc from "vue-tsx-support";
// 引入store命名空间 方便使用某个模块
import { namespace } from "vuex-class";

// 通过namespace(module name)的方式使用某个模块的store
const systemStore = namespace("system");

@Component
export default class ZButton extends tsc.Component<ButtonProps> {
  @Prop() text!: string;
  // store使用state和action 其他getter和mutation类型
  @systemStore.State("user") user!: Object;
  @systemStore.Action("cacheUser") cacheUser: any;

  public btnClick(value: string): void {
    console.log("value is: ", value);
    // 点击调用store的action方式存储user信息
    // 而state中的user信息会同步 可通过vue-tools查看
    this.cacheUser({ name: "张三", phone: "13333333333" });
  }

  // 点击事件中调用mixin的方法
  protected render() {
    return (
      <div>
        <button onClick={() => this.btnClick()}>{this.text}</button>
      </div>
    );
  }
}
```

## 三方组件库

目前主流的三方组件库都是支持`ts`的，且官方文档上都会提供`ts`下的`demo`以及配置。这里以有赞的[vant](https://github.com/youzan/vant)作为例子。

安装：

```bash
npm install vant --save
#or
yarn add vant
```

在`ts`下如果想要按需加载`vant`的话，就不能使用`babel-plugin-import`了，而是要使用`ts-import-plugin`。

安装`ts-import-plugin`：

```bash
npm install ts-import-plugin --save-dev
#or
yarn add ts-import-plugin -D
```

安装结束后，需要在`vue.config.js`中注入到`webpack`中使用：

```js
// vue.config.js
const merge = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");

// 将ts-import-plugin合并到webpack配置中
const webpackMergeConfig = config => {
  config.module
    .rule("ts")
    .use("ts-loader")
    .tap(options => {
      options = merge(options, {
        transpileOnly: true,
        getCustomTransformers: () => ({
          before: [
            tsImportPluginFactory({
              libraryName: "vant",
              libraryDirectory: "es",
              style: true
            })
          ]
        }),
        compilerOptions: {
          module: "es2015"
        }
      });
      return options;
    });
}

module.exports = {
  chainWebpack: config => {
    webpackMergeConfig(config);
    // ...省略
  }
}
```

然后就可以在组件文件中使用`vant`三方组件库了：

```typescript
// components/index.ts
import Vue from "vue";
import { Button } from "vant";

Vue.use(Button);
```

`button.tsx`：

```typescript
// components/button/button.tsx
import { Component, Prop } from "vue-property-decorator";
import * as tsc from "vue-tsx-support";

@Component
export default class ZButton extends tsc.Component<ButtonProps> {
  @Prop() text!: string;

  public btnClick(value: string): void {
    console.log("value is: ", value);
  }

  // 点击事件中调用mixin的方法
  protected render() {
    return (
      <div>
        // 使用van-button
        <van-button type="primary">我是vant button</van-button>
      </div>
    );
  }
}
```