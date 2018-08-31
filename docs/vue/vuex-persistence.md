---
title: Vuex 持久化方案一
---

# Vuex 持久化方案一

## 前言

我们都知道`Vuex`是一个状态管理器，而他的缺点也很明确，在页面刷新之后，`Vuex`中的状态都会被重置，这对于一些不想被重置的状态数据而言，
是一个不好的表现。如果是完全用`Vue`构建的 app 项目的话，则不需要考虑这些，因为在 app 中，不存在刷新浏览器的操作。

当然，如果是混合开发的，那还是有一些可能的，比如 app 端重新加载 `webview` 的话，那也是等同于刷新浏览器的操作了，这个时候 `Vuex` 也会被重置。

而今天要讨论的就是让`Vuex`的状态持久化，当然，这只是其中一个方案，这里我们需要配合本地存储来达到我们的目标。

## 问题

- 并不是所有状态都需要存入本地缓存
- 重置默认值，并不是所有的状态默认值都是`''`

## 实现

### Vuex Demo

首先我们初始化一个`vue`项目：

```bash
vue init webpack vuexDemo
```

初始化成功后，我们通过`yarn`安装`vuex`：

```bash
yarn add vuex
```

安装成功后，我们在项目根目录`src`建立一个`store`文件夹，该文件夹用于存放`vuex`的内容，结构入下：

```
store
├── state.js            # vuex状态集合
├── getter.js           # state的派生状态 可对state做些过滤或者其他操作
├── action.js           # 异步mutation操作
├── mutation.js         # 修改state状态
├── mutation-type.js    # mutation的类型
├── index.js            # vuex主文件
```

我们对各个文件加入点简单的内容：

```js
// state.js
const state = {
  count: 0
}

export default state

// mutation-type.js
export const SET_COUNT = 'SET_COUNT'

// mutation.js
import * as type from './mutation-type'

const mutation = {
  [type.SET_COUNT](state, data) {
    state.count = data
  }
}

export default mutation

// index.js
import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './action'
// import * as getters from './getter'
import state from './state'
import mutations from './mutation'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
```

这里之所以没有引入`getter`和`action`，一个是因为我们取`state`中的`count`是直接取，并没有对其做什么特别的操作，所以`getter`中就省略了。

而`action`它提交的是一个`mutation`，而且它和`mutation`的区别在于:

- `mutation`是同步的，`action`可以包含异步操作
- `mutation`直接修改`state`，而`action`提交的是`mutation`，然后再让`mutation`去修改`state`
- `action`可以一次提交多个`mutation`

我们现在就是个简单的修改`state`，所以就先不管`action`

然后在`vue`模板中:

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>{{ count }}</h3>
    <button @click="addStore">添加</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapState(['count'])
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    addStore() {
      this.SET_COUNT(2)
    },
    ...mapMutations(['SET_COUNT'])
  }
}
</script>
```

这样就完成了一个简单的`vuex`例子了，当点击`添加`按钮的时候，界面上的`0`就会变成`2`，并且如果装有`vue-devtools`的话，
也能在`vuex`那一栏看到`count`的数值也变成了`2`，这里就不放动图演示了。

### 持久化

接下来就是我们的关键内容了，想要让`vuex`持久化，自然离不开本地存储`localStorage`，我们往`state`里加些内容：

```js
// state.js
const str = window.localStorage

const state = {
  count: 0,
  account: str.getItem('account') ? str.getItem('account') : ''
}
```

我们加入了一个`account`属性，这里表示如果缓存中有`account`的话就从缓存中取，没有则为空。

然后我们也同样设置下`mutation`和`mutation-type`：

```js
// mutation-type.js
export const SET_COUNT = 'SET_COUNT'

export const SET_ACCOUNT_0 = 'SET_ACCOUNT_0'

// mutation.js
import * as type from './mutation-type'

const mutation = {
  [type.SET_COUNT](state, data) {
    state.count = data
  },
  [type.SET_ACCOUNT_0](state, account) {
    state.account = account
  }
}

export default mutation
```

我们在定义`mutation-type`的时候，在尾部多加了个`_0`用来表示，该字段是存入缓存中的。

但是我们不会选择在`mutation`中去做缓存操作，毕竟我个人认为不适合在`mutation`中做过多的逻辑操作，我们选择将这部分逻辑操作放在`action`中：

```js
// action.js
import * as type from './mutation-type'
const str = window.localStorage

/**
 * 缓存操作
 */
export const withCache = ({ commit }, { mutationType, data }) => {
  commit(mutationType, data)
  // 是不是以_0结尾 是的话表示需要缓存
  if (~mutationType.indexOf('_0')) {
    setToStorage(mutationType, data)
  }
}

// 正则太烂。。。就先这么写着了
const reg = /(SET_)(\w+)(_0)/
function setToStorage(type, data) {
  let key = type.match(reg)[2].toLowerCase()
  if (typeof data === 'string') str.setItem(key, data)
  else {
    let formatData = JSON.stringify(data)
    str.setItem(key, formatData)
  }
}
```

上面这段代码解决几个问题：

- 因为在`action`中我不知道存储的目标属于哪个`type`，所以将其当做参数传入
- 存入缓存的`key`我们取的是`SET_xxx`中的`xxx`(小写)，尽量保持和`state`的字段名称一致。比如`SET_A`->`a`，`SET_B_0`->`b`
- 本地缓存存`Object`类型会变成`[Object object]`，所以针对`Object`类型的数据，我们需要将其转成字符串再存入

::: tip 提示
记得将`action`在`index.js`引入
:::

然后我们在`vue`模板中，先引入`mapActions`，然后进行使用：

```vue
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapState(['count'])
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    addStore() {
      let account = { user: 'Randy', age: 22 }
      this.withCache({ mutationType: 'SET_COUNT', data: 2 })
      this.withCache({ mutationType: 'SET_ACCOUNT_0', data: account })
    },
    ...mapMutations(['SET_COUNT']),
    ...mapActions(['withCache'])
  }
}
</script>
```

直接调用`withCache`，传入`mutationType`和`data`，`withCache`会根据`mutationType`判断哪些是需要存入缓存的，哪些是不需要的。

当然，不需要存入缓存的，也可以直接调用`mapMutations`中的方法直接操作。

现在有个问题，就是我缓存存入`Object`类型的是字符串类型，所以我`state`中的对应数据也是字符串类型的，在模板中不利于使用，怎么办？这时候就可以使用`getter`了，我们在`getter`中将其转成`Object`类型即可：

```js
// getter.js
export const getAccount = state => {
  let account = state.account
  if (typeof account === 'string' && !!account) return JSON.parse(account)
  else return account
}
```

::: tip 提示
上面的判断还不够完整，应该还要判断是否是 JSON 字符串类型，是的话再进行`JSON.parse`操作，不然普通的字符串类型会报错，这个自行改善。
:::

::: tip 提示
记得将`getter`在`index.js`引入
:::

然后在模板中使用`mapGetters`引入：

```vue
<template>
  <div>
    ...
    {{getAccount.user}}
    ...
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapState(['count']),
    ...mapGetters(['getAccount'])
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    addStore() {
      let account = { user: 'Randy', age: 22 }
      this.withCache({ mutationType: 'SET_COUNT', data: 2 })
      this.withCache({ mutationType: 'SET_ACCOUNT_0', data: account })
    },
    ...mapMutations(['SET_COUNT']),
    ...mapActions(['withCache'])
  }
}
</script>
```

到这基本就结束了，现在刷新浏览器，那些需要持久化的属性就不会被重置了。

可是真的就结束了吗？那么如果我要将缓存的数据给清空或者重置呢？因为`state`中每个属性的默认值都是不一样的，可能为`''`、`0`、`false`等各种类型的，那该怎么办？某问题啦~

### 状态重置

可以复制出一份`state`作为它的初始默认值，比如在`store`新建一个`default_state.js`：

```js
// default_state.js
const default_state = {
  count: 0,
  account: ''
}

export default default_state
```

然后我们定义一个类型为`RESET_ALL_STATE`的`mutation`：

```js
// mutation-type.js
export const RESET_ALL_STATE = 'RESET_ALL_STATE'

// mutation.js
import * as type from './mutation-type'

const mutation = {
  [type.SET_COUNT](state, data) {
    state.count = data
  },
  [type.SET_ACCOUNT_0](state, account) {
    state.account = account
  },
  [type.RESET_ALL_STATE](state, data) {
    state[`${data.state}`] = data.value
  }
}

export default mutation
```

最后我们在`action`中定义一个重置的操作`resetAllState`：

```js
// action.js
import * as type from './mutation-type'
import default_state from './default_state'
const str = window.localStorage

/**
 * 重置所有状态
 */
export const resetAllState = ({ commit }) => {
  // 循环默认state 设置初始值
  Object.keys(default_state).forEach(state => {
    commit(type.RESET_ALL_STATE, { state, value: default_state[state] })
  })
  // 将有缓存的数据清空
  Object.keys(type).forEach(typeItem => {
    if (~typeItem.indexOf('_0')) clearStorage(type[typeItem])
  })
}

const reg = /(SET_)(\w+)(_0)/
function clearStorage(type) {
  let key = type.match(reg)[2].toLowerCase()
  str.removeItem(key)
}
```

完整`action.js`：

```js
import * as type from './mutation-type'
import default_state from './default_state'
const str = window.localStorage

/**
 * 缓存操作
 */
export const withCache = ({ commit }, { mutationType, data }) => {
  commit(mutationType, data)
  if (~mutationType.indexOf('_0')) {
    // 需要缓存
    setToStorage(mutationType, data)
  }
}

/**
 * 重置所有状态
 */
export const resetAllState = ({ commit }) => {
  // 循环默认state 设置初始值
  Object.keys(default_state).forEach(state => {
    commit(type.RESET_ALL_STATE, { state, value: default_state[state] })
  })
  // 将有缓存的数据清空
  Object.keys(type).forEach(typeItem => {
    if (~typeItem.indexOf('_0')) clearStorage(type[typeItem])
  })
}

const reg = /(SET_)(\w+)(_0)/
function setToStorage(type, data) {
  let key = type.match(reg)[2].toLowerCase()
  if (typeof data === 'string') str.setItem(key, data)
  else {
    let formatData = JSON.stringify(data)
    str.setItem(key, formatData)
  }
}

function clearStorage(type) {
  let key = type.match(reg)[2].toLowerCase()
  str.removeItem(key)
}
```

`vue`模板中的完整使用：

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>{{ count }}</h3>
    <h4>{{ getAccount.user }}</h4>
    <button @click="addStore">添加</button>
    <button @click="clearStore">清空</button>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapState(['count']),
    ...mapGetters(['getAccount'])
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    addStore() {
      let account = { user: 'Randy', age: 22 }
      this.withCache({ mutationType: 'SET_COUNT', data: this.msg })
      this.withCache({ mutationType: 'SET_ACCOUNT_0', data: account })
    },
    clearStore() {
      this.resetAllState()
    },
    ...mapMutations(['SET_COUNT']),
    ...mapActions(['withCache', 'resetAllState'])
  }
}
</script>
```

好了，现在是真的结束了。

::: tip 总结
可能代码有些乱，但是大致的思路我想应该还是都能理解的。

如果还有有其他`vuex`的持久化方式，还会继续更新的。

也欢迎大家一同思考。
:::
