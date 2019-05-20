---
title: Flutter试玩小结
date: '2019-05-20'
---

### TL;DR
前段时间Google I/O 2019大会上flutter再次狠狠的刷了一波存在感，随便看看不管是微博，推上还是medium或者一些其它的技术社区上也是铺天盖地的讨论，优缺点搬运过来差不多是：

#### 优点：
- 贯彻始终的widget的设计思想和开发方式对各种背景还是很亲切的
- 跨全平台的愿景很吸引人
- 写界面和相关的逻辑快速简单
- 文档还有编辑器，IDE的支持很完善和贴心
- 社区很活跃教程也很多(包括官方的youtube channel)
- 保持状态的hot reload，效率高到飞起

#### 缺点：
- Desktop, Web平台的支持还处在preview或试验阶段
- 包的数量很少，质量也一般
- 各平台要想实现复杂效果的支持度不行，需要花费大量时间
- 目前采用flutter开发的上架App其实还是很少

总结来说就是目前还在初级阶段，简单业务为主的项目可能比较合适，追求体验的App可能会碰到很多坑，实现复杂体验所发的时间基本会抵消掉跨平台复用所带来的成本优势，但是需要合适的场景和项目才有机会体会到这些全部的优缺点。

### Cat Catalog
不过还是本着尝鲜还有无聊打发时间的想法，花了点时间学习和把以前做的一个iOS[捷径](https://sharecuts.cn/shortcut/1264)写了一个Cat Catalog的简单App，支持：
- view cats of different breeds by tags
- search by simple keyword
- like your favorite cat(s)
- read further information on wikipedia page

项目功能和逻辑都很简单，用到的API/widgets很少：
- JSON -serializing
- Animation
- 基础的布局控件
- 使用外部包和字体

![Screenshot](./cat-catalog.gif)

代码丢到Github： https://github.com/gnehcc/cat-book 上了，有兴趣的同学可以看看。

最后就用到的功能谈几点简单感受：
- Dart学习起来非常简单，只要有任何其他语言的使用经验，花点时间看看language tour基本就可以开始了
- 动画抽象程度高，用起来很简单，异步语法简洁，
- 用的VS Code + Dart插件 + Flutter插件，代码写起来流畅到飞起
- HOT RELOAD 开发起来特别顺手，大部分时间只需要保存代码之后Simulator就直接更新了，实在不行hot restart也挺快的
- Widget的嵌套用法让代码有点杂乱，如果Code Extraction做的勤快点的话勉强好点
- 第三方库的数量还有功能丰富度目前确实还比较原始
- 一个Code Base 基本无缝的跑在iOS和Andoid平台，但Flutter的控件其实有两套（Material 和 Cupertino），抛开平台特定功能，也需要至少需要特别处理。

个人觉得如果有时间完全可以一遍学一边写写玩玩（主要是也花不了多少时间，写着写着发现动漫也追完了...），如果满意的话上传到App商店也是件不错的事情。

EOF

### References:
捷径个人主页： https://sharecuts.cn/user/eOzkQQElyd

Flutter Dev: https://flutter.dev/docs

Flutter boring show

A tour of the Dart language: https://dart.dev/guides/language/language-tour
