---
title: Python元类再谈
date: '2016-04-22 14:45'
---

在Python中一切都是对象，类型也是对象；类比类型和实例的概念，类型也必然有自己的类型，十分合理。事实上，类型的类型其实就是术语元类型的意思，python里面所有类型的元类型都是`type`。默认情况下我们新建一个类，在不手动指定元类型的前提下，type会被指定为元类型 ，元类型能够控制类型的创建和初始化。

一般情况下我们能够通过关键字`class`来定义一个新的自定义类型，但也能够通过type动态的生成一个新的类型，下面的两种实现方式等价：
```python
 type('SomeKlass', (object,), {'foo':2, 'bar': 4})
 class SomeKlass(object):
     foo = 2
     bar = 4
```
借助这个例子，我们还能顺便看一下一些关于默认元类`type`的信息：
```python
>>> someobject = SomeKlass()
>>> someobject.__class__
<class __main__.SomeKlass>
>>> SomeKlass.__class__
<type 'type'>
```
新定义一个类型，当类型被解析的时候（比如当作模块引入），元类会负责创建和初始化这个新的类型，背后的逻辑基本上包括：
- 执行类的定义代码收集所有的属性和方法
- 查找类的元类
- 执行 `Metaclass（name, bases, property_dict)`，参数分别新建的类的名称，类的父类tuple，收集的属性字典
- 类型创建完成
- 执行初始化

在上面描述的过程中，自定义指定元类，然后重写元类的`__new__` 和 `__init__`方法，因为在指定元类的情况下，除去收集信息的过程，类型的创建和初始化两个步骤：
```python
MyKlass = MyMeta.__new__(MyMeta, name, bases, dct)
MyMeta.__init__(MyKlass, name, bases, dct)
```
注意这里的表示方式是调用内部方法来表示的，其实和使用super关键字动态绑定，或者通过`__dict__`属性字典访问是一样的：
```python
super(MyMeta, meta).__new__(meta, name, bases, dct)
type.__new__(meta, name, bases, dct)
```
对于`__init__`这样的method来说还可以这样调用：
```python
type.__dict__['__init__'].__get__(cls)(name, bases, dct)
```
插个题外话，这三种方式的使用其实涉及到python的描述符，使用super和__get__的时候会进行类型或者实例的绑定，相比直接调用内部方法`__new__`和`__init__`，由于绑定了self/cls上下文，在传递参数的时候就只用指定除上下文之后的参数了。

从网上搜罗了一个例子，将元类创建和初始化新的类型的过程完整展示出来了：
```python
class MyMeta(type):
    def __new__(meta, name, bases, dct):
        """
        this is new doco
        """
        print '-----------------------------------'
        print "Allocating memory for class", name
        print meta
        print name
        print bases
        print dct
        return super(MyMeta, meta).__new__(meta, name, bases, dct)
        # return type.__new__(meta, name, bases, dct)

    def __init__(cls, name, bases, dct):
        print '-----------------------------------'
        print "Initializing class", name
        print cls
        print name
        print bases
        print dct
        super(MyMeta, cls).__init__(name, bases, dct)
        # type.__init__(cls, name, bases, dict)
        # type.__dict__['__init__'].__get__(cls)(name, bases, dct)


class MyKlass(object):
    __metaclass__ = MyMeta

    def foo(self, param):
        pass

    barattr = 2

mk = MyKlass()
```
创建和初始化的过程只会发生一此，也就是会是说 `__new__`, `__init__`只会被执行一次，并且在执行完之前，类型MyKlass其实并没有生成，直接通过名称访问会报错：
```python
Allocating memory for class MyKlass
<class '__main__.MyMeta'>
MyKlass
(<type 'object'>,)
{'barattr': 2, '__module__': '__main__', 'foo': <function foo at 0x0000000002497668>, '__metaclass__': <class '__main__.MyMeta'>}
-----------------------------------
Initializing class MyKlass
<class '__main__.MyKlass'>
MyKlass
(<type 'object'>,)
{'barattr': 2, '__module__': '__main__', 'foo': <function foo at 0x0000000002497668>, '__metaclass__': <class '__main__.MyMeta'>}
```
在使用元类的过程中，有时候我们会重写他的`__call__`方法，这个方法的作用其实和`__new__`有点相似，只不过这次是控制类型实例对象的生成，因为这个方法恰好和生成类型实例时调用的构造方法吻合。关于重写这个call方法的使用场景，一个比较常用的就是实现单例模式：
```python
class MetaSingleton(type):
    instance = None

    def __call__(cls, *args, **kw):
        """
        this is comment
        """
        print 'in call method'
        if cls.instance is None:
            # cls.instance = super(MetaSingleton, cls).__call__(*args, **kw)
            # cls.instance = type.__dict__['__call__'].__get__(cls)(*args, **kw)
            cls.instance = type.__call__(cls, *args, **kw)

        print cls.instance
        return cls.instance


class Foo(object):
    __metaclass__ = MetaSingleton

    def __init__(self, a, b):
        self.a = a
        self.b = b

a = Foo(1, 2)
b = Foo(3, 4)
assert a is b
print a.a, a.b, b.a, b.b
print type(Foo)
print Foo.__call__
```
例子很直接，`__call__`方法里面通过判断是否已经有初始化过的实例，没有就仿照正常未指定元类的情况下调用type的`__call__`方法（当然这里要么通过super binding要么手动指定cls上下文），生成一个Foo的实例存储和返回出来。但是有一个注意点是，__call__方法每次初始化实例对象的时候都会被调用，这也和先前说的控制实例的生成一致：
```python
(<class '__main__.B'>, <class '__main__.A'>, <type 'object'>)
in call method
<__main__.Foo object at 0x00000000024BFA90>
in call method
<__main__.Foo object at 0x00000000024BFA90>
1 2 1 2
<class '__main__.MetaSingleton'>
<bound method MetaSingleton.__call__ of <class '__main__.Foo'>>
```
还有一个需要在意的地方是最后的两行打印日志，Foo类型的元类是`Metasingleton`（调用__new__生成类型的时候默认指定元类是第一个参数）；Foo的`__call__`方法是绑定了Foo(MetaSingleton的实例）实例的MetaSingleton的方法，也就是从另外的方面证实每次初始化Foo类型市里的时候，其实是在调用元类中重写的`__call__`方法。

元类这个特性大多数情况下确实使用的不多并且需要稍微花点时间来理解，但是需要使用的时候会非常好用，往往能够实现很多优雅的功能，最典型的就是ORM的实现了，只不过会更加的复杂，且pythoning且学习吧， PEACE！

参考资料中的链接里面有有几个实际的例子，本文也是学习其中的内容后配合一些其它一些使用经验以及碰到的问题理而成，希望对大家有用。


参考资料：

>[Python metaclasses by example](http://eli.thegreenplace.net/2011/08/14/python-metaclasses-by-example)

>[Descriptor HowTo Guide](https://docs.python.org/2/howto/descriptor.html)
