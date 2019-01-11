---
title: Python getattribute vs getattr
date: '2015-12-09'
---

相信大家看到这个标题的时候也会立马在脑海里面过一遍，觉得大多数时候我们并不太需要关注`getattribute`和`getattr`的一些细节（至少我自己吧:))，
一般情况下消费我们自定义的类的时候，我们类的结构都了解，不会刻意偏离，造成一些属性访问的错误。

不过作为一个有好奇心有追求有气质的python宝宝，怎么可能不稍稍研究一下呢。好吧，其实是在github上读到一个开源项目
[sinaweibopy](https://github.com/michaelliao/sinaweibopy/blob/master/weibo.py#L307)的源码才看的，代码挺有意思，正好当作一个实用的例子，
来看看如何自定义实现`gettattr`让代码更加的动态优雅：

```python
# 例子在原来的基础上简化了一下，排除依赖和干扰，详细参见原项目
class UrlGenerator(object):
    def __init__(self, root_url):
        self.url = root_url

    def __getattr__(self, item):
        if item == 'get' or item == 'post':
            print self.url
        return UrlGenerator('{}/{}'.format(self.url, item))


url_gen = UrlGenerator('http://xxxx')
url_gen.users.show.get

>>> http://xxxx/users/show
```
充分利用`getattr`会在没有查找到相应实例属性时被调用的特点，方便的通过链式调用生成对应的url，源代码中在碰到http method的时候返回一个
可调用的对象更加的优雅，链式的操作不仅优雅而且还能很好的说明调用的接口的意义（restful的接口啦）。

既然能通过定制类的`getattr`自定义方法来实现一些优雅的功能，自然我们也要对它有一些了解，包括和它相似的自定义方法`getattribute`

#### 1. 用作实例属性的获取和拦截

当访问某个实例属性时， getattribute会被无条件调用，如未实现自己的getattr方法，会抛出`AttributeError`提示找不到这个属性，如果自定义了
自己getattr方法的话，方法会在这种找不到属性的情况下被调用，比如上面的例子中的情况。所以在找不到属性的情况下通过实现自定义的getattr方
法来实现一些功能是一个不错的方式，因为它不会像getattribute方法每次都会调用可能会影响一些正常情况下的属性访问：

```python
class Test(object):
    def __init__(self, p):
        self.p = p

    def __getattr__(self, item):
        return 'default'

t = Test('p1')
print t.p
print t.p2

>>> p1
>>> default
```

#### 2. 自定义getattribute的时候防止无限递归
因为getattribute在访问属性的时候一直会被调用，自定义的getattribute方法里面同时需要返回相应的属性，通过`self.__dict__`取值会继续向下
调用getattribute，造成循环调用：

```python
class AboutAttr(object):
    def __init__(self, name):
        self.name = name

    def __getattribute__(self, item):
        try:
            return super(AboutAttr, self).__getattribute__(item)
        except KeyError:
            return 'default'
```
这里通过调用绑定的super对象来获取队形的属性，对新式类来说其实和`object.__getattribute__(self, item)`一样的道理:
* 默认情况下自定义的类会从object继承`getattribute`方法，对于属性的查找输完全能用的
* getattribute的实现感觉还是挺抽象化的，只需要绑定相应的实例对象和要查找的属性名称就行

#### 3.同时覆盖掉getattribute和getattr的时候，在getattribute中需要模仿原本的行为抛出AttributeError或者手动调用getattr

```python
class AboutAttr(object):
    def __init__(self, name):
        self.name = name

    def __getattribute__(self, item):
        try:
            return super(AboutAttr, self).__getattribute__(item)
        except KeyError:
            return 'default'
        except AttributeError as ex:
            print ex

    def __getattr__(self, item):
        return 'default'

at = AboutAttr('test')
print at.name
print at.not_exised

>>>test
>>>'AboutAttr' object has no attribute 'not_exised'
>>>None
```
上面例子里面的getattr方法根本不会被调用，因为原本的AttributeError被我们自行处理并未抛出，也没有手动调用getattr，所以访问`not_existed`的
结果是None而不是default.

关于getattribute和getattr的特性与区别就扯到这，要更深入的了解可以自行google，
[编写高质量代码:改善Python程序的91个建议](http://book.douban.com/subject/25910544/)这本书里面也有一些详细的介绍。


**参考资料：**

> python doc: https://docs.python.org/2/reference/datamodel.html#object.__getattr__

> 编写高质量代码:改善Python程序的91个建议: http://book.douban.com/subject/25910544/
