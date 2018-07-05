# VSCode ESLint配置
现在很多程序员写代码的时候都喜欢开着eslint进行代码格式校验，写习惯了还好，但是一般刚开始熟悉`eslint`的同学估计会被`eslint`的代码格式检查给逼疯的，哈哈哈。。。

今天就讲讲如何在vscode中配置eslint代码格式化
这里的前提是vscode中需要安装[eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)和[prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)两个工具

打开vscode后点击右上角`文件->首选项->设置`进入用户配置面板
![image.png](http://upload-images.jianshu.io/upload_images/2262344-a8bc3f95865d3296.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后我们开始做些用户配置，具体配置如下
```json
{
  "editor.tabSize":2,  #代码缩进修改成2个空格
  "editor.formatOnSave": true,  #每次保存的时候自动格式化
  "eslint.autoFixOnSave": false,  #每次保存的时候将代码按eslint格式进行修复
  "prettier.eslintIntegration": true,  #让prettier使用eslint的代码格式进行校验
  "prettier.semi": false,  #去掉代码结尾的分号
  "prettier.singleQuote": true,  #使用带引号替代双引号
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true  #让函数(名)和后面的括号之间加个空格
}
```
是的，就是这么的简单。这样每次写完代码进行格式化 或者保存的时候会将代码自动转成符合eslint风格的代码了。

## 附：在vue中使用eslint插件
除了以上配置以外，在vue中要做几点额外配置，具体如下
```json
{
  "vetur.format.defaultFormatter.html": "js-beautify-html",  #这个按用户自身习惯选择
  "vetur.format.defaultFormatter.js": "vscode-typescript",  #让vue中的js按编辑器自带的ts格式进行格式化
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force-aligned"  #vue组件中html代码格式化样式
    }
  }
}
```
点此可查看具体的[js-beautify-html](https://github.com/vuejs/vetur/blob/master/server/src/modes/template/services/htmlFormat.ts)配置

如果你使用的css预处理器是`stylus`(因为我自己是用这个，所以没说其他的，哈哈哈)，那么还需要加入以下配置
```json
{
  "stylusSupremacy.insertSemicolons": false,  #去掉分号
  "stylusSupremacy.insertBraces": false,  #去掉大括号
  "stylusSupremacy.insertColons": false  #去掉冒号
}
```
OK 就是这样的 这样写vue的话 就非常方便了~