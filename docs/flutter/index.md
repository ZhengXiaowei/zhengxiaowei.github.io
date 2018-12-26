# 环境搭建

## `Flutter`是什么

`Flutter`是谷歌新开发的一款移动UI框架，可以快速构建高质量的`Android`和`IOS`应用。 `Flutter`可以与现有的代码一起工作，并且`Flutter`是完全免费、开源的。

## `Flutter`的优点

`Flutter`采用的是`Dart`语言进行开发的。`Dart`语言是谷歌开发的编程语言，它能够用于Web、服务端、移动应用等领域，它是一种**强语言**。

`Dart`能够编译**成快速、可预测**的本地代码。这也使`Flutter`变得**更快、更流畅**。

`Dart`拥有**更小的代码体积**，这使得`Flutter`变得**更小**。

`Dart`可以实现各种`wedget`，让`Flutter`拥有更贴近原生的性能。同时也能完全自定义自己想要的UI层，让其更具定制化。

## 环境搭建

这里主要是针对`Mac`的环境搭建。

先去官网下载`Flutter`的[安装包](https://flutter.io/docs/development/tools/sdk/archive?tab=macos#macos)

然后将其解压的到电脑中的某个位置，比如：

```bash
cd ~/Documents/lib # 要解压到的目录
unzip ~/Downloads/flutter_macos_v1.0.0-beta.zip # 下载到本地的flutter地址
```

解压完之后，我们设置下环境变量：

```bash
vim ~/.bash_profile

# 新增一个Path
FLUTTER_HOME = /Users/user/Documents/lib/flutter/bin

PATH=$FLUTTER_HOME:$PATH

```

编辑完之后通过`source ~/.bash_profile`重启配置。

然后在命令行中输入`flutter --version`，如果出现以下内容，则表示配置成功：

<img :src="$withBase('/assets/flutter/flutter_version.png')">

`Flutter`还需要安卓环境和`IOS`环境的支持，想知道自己配置的环境还差什么，可以通过`flutter doctor`来检测：

<img :src="$withBase('/assets/flutter/flutter_env.png')">

比较人性化的是，如果你哪个环境没有配置的话，当前项底下会告诉你怎么去配置这个环境，所以这里就不一一说每个都需要怎么去配了。

然后在`VSCode`中安装`Dart`的插件，插件栏里输入`Dart`安装重启即可。

## 开启第一个Flutter项目

环境什么都搭建完了以后，我们可以通过命令

```bash
flutter create appname
```
来生成一个`Flutter`项目。

生成后，主要有两个目录需要重点用到，一个是`lib`目录，项目的代码基本都在该文件夹下，其次就是`pubspec.yaml`文件，我们使用第三方库的时候，需要在该文件中先增加三方包名，然后编辑器会自动去安装对应的三方包。

找到`lib/main.dart`，我们写个`Hello world`：

```dart
import 'package:flutter/material.dart'; // 引入主题包 flutter自带的Material

class FirstFlutterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'First Flutter App',
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('First Flutter App'),
        ),
        body: new Center(
          child: new Text('Hello Word!'),
        ),
      ),
    );
  }
}

void main() => runApp(new FirstFlutterApp());
```

然后保存之后，在命令行里输入
```bash
flutter run
```
就能看到效果：

<img :src="$withBase('/assets/flutter/first_app.png')">