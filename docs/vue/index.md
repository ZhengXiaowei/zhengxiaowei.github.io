# vuex学习笔记

## 前言
 用过vue的同学应该都知道在vue里有个状态管理器，其实一开始我对vuex还不是很理解，甚至还不知道怎么用，今天就来聊聊vuex这东西，也帮助下新手了解下vuex，如果文中出现了理解有误的地方，还希望能够指出，一同进步，谢谢~

## 什么是vuex
以下是[vuex官网](https://vuex.vuejs.org/zh-cn/)给出的解释
>`Vuex` 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 [devtools extension](https://github.com/vuejs/vue-devtools)，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

我的理解简言之就是
> `vuex`是一个状态**共享**管理器，多用于多组件之间的状态共享以及数据共享(并非唯一的选择)，再简单点就是一个**实时响应的缓存**

## vuex和localStorage的区别
上文也提到了`vuex`可以相当于一个缓存，也许有的同学在使用`vuex`的时候也会觉得，为什么不使用`localstorage`来的方便（我自己当初也这么觉得的，哈哈哈）？

不过确实，如果只是单单进行一个多组件之间的数据共享的话，那么绝大多数情况下，`localStorage`确实能够满足使用，但是别忘了，`vuex`可不只是能够进行数据共享，还能做些`localStorage`无法做到的事儿

比如有这么一个业务场景，比如在根组件`app.vue`下（或者其他组件也行）有个我们已经写好的分享组件`shareComponents.vue`，然后我在子组件`a.vue`和`b.vue`中各有一个按钮，当我点击这个按钮的时候分享组件`shareComponents.vue`就会弹出显示。

然后我将分享组件`shareComponents.vue`的显示和隐藏状态存到`vuex`的`state`中去，那么我在`a.vue`和`b.vue`组件中只要操作`vuex`的这个`state`就行了，因为`vuex`的实时状态响应机制，只要`vuex`中的`state`一改变，那么只要其他组件里有这个共享的值时，都会实时改变。

如果我们使用`localStorage`的话，我们先将控制`shareComponents.vue`显示隐藏状态的值存入`localStorage`，然后在子组件`a.vue`和`b.vue`中的点击事件去修改缓存中的值，那么结果会是什么？

缓存中的值是改变了，但是你会发现分享组件`shareComponents.vue`并没有弹出，这是为什么？原因其实很简单，我在这里修改了缓存中的值，但是在我要使用的地方需要重新`getItem`(localStorage API)后才能得到修改后的值，也就是`localStorage`并不具有实时性

这是`vuex`和`localStorage`不同区别的一点
还有一点就是`localStorage`具有永久性，我们都知道，使用`localStorage`进行本地存储的时候，除非用户手动进行清理，否则缓存会一直存在本地当中

而反观`vuex`，每当页面重新刷新的时候，`vuex`就会重置所有的`state`状态为初始状态，这应该算是`vuex`的一个**小缺点**

## 如何解决vuex页面刷新重置所有状态的问题
* 配合`localStorage`
  在我们操作`vuex`中`state`的同时，将对应的状态也缓存到`localStorage`中，然后在state中优先获取缓存，这样可以避免页面刷新，状态重置的问题，具体实现如下：
  ```javascript
  // 我们先在state.js中定义状态值 以token为例
  import str from 'good-storage' #一个操作localStorage的库 具体可看    https://github.com/ustbhuangyi/storage
  const state = {
    ...
    token: str.get('token') ? str.get('token') : ''
  }
  export default state
  ```
  然后我以登录为示例，登录成功，获取`token`值
  ```vue
  <template>
  ...
  // 省略html片段结构
  </template>
  <script>
  import str from 'good-storage'
  export default {
    methods: {
      login () {
        ...
        // 省略一些代码逻辑
        login(this.userInfo).then(res => {
           console.log('登录成功')
           str.set('token', res.data.token)  // 将token存入缓存
           this.SET_TOKEN(res.data.token)  // 这里就是将token存入state中 涉及到了mutation操作state 之后会说
        }, err => {
              ...
        })
      }
    }
  }
  </script>
  ```
  虽然有些麻烦，每次操作state的同时还得缓存一次，不过这也是一种解决方式了
* 使用其他已经结合`vuex`和`localStorage`的工具
  因为第一种方法还得做一次缓存的操作，有时候确实会觉得很麻烦，尤其是`state`比较多的时候
  
  不过[github](https://github.com/)上已经有不少人将两者结合变成一个插件的做法，这里推荐一个[vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)

  这个插件会在你每次操作`state`的时候 都将整个`state`都存入缓存中去 从而避免我们进一次的缓存操作 也算是比较便捷

  唯一觉得有缺点的是 如果要重置`state`状态的话 会比较麻烦
