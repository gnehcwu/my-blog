---
title: 说说Python 2.x中的super关键字
date: '2015-12-09'
layout: post
draft: false
path: "/posts/python-2.x-super"
category: "Tech"
tags:
  - "Python"
  - "Coding skills"
---

官方文档中关于[super](https://docs.python.org/2/library/functions.html#super)的定义说的不是很多，大致意思是返回一个代理对象让你能够调用
一些继承过来的方法，查找的机制遵循mro规则，最常用的情况如下面这个例子所示：

```python
class C(B):
    def method(self, arg):
        super(C, self).method(arg)
```
子类C重写了父类B中同名方法method，在重写的实现中通过super实例化的代理对象调用父类的同名方法。

super类的初始方法签名如下：
```python
def __init__(self, type1, type2=None): # known special case of super.__init__
        """
        super(type, obj) -> bound super object; requires isinstance(obj, type)
        super(type) -> unbound super object
        super(type, type2) -> bound super object; requires issubclass(type2, type)
        Typical use to call a cooperative superclass method:
```
除去self外接受一个或者或者两个参数，如同注释声明的一样，接受两个参数时返回的是绑定的super实例，省略第二个参数的时候返回的是未绑定的
super对象。

一般情况下当调用继承的类方法或者静态方法时，并不需要绑定具体的实例，这个时候使用`super(type, type2).some_method`就能达到目的，当然
`super(type, obj)`在这种情况下也能够使用，super对象有自定义实现的getattribute方法也能够处理。不过，后者一般用来调用实例方法，这样
在查找方法的时候能够传入相应的实例，从而得到绑定的实例方法：

```python
class A(object):
    def __init__(self):
        pass

    @classmethod
    def klass_meth(cls):
        pass

    @staticmethod
    def static_meth():
        pass

    def test(self):
        pass

class B(A):
    pass

>>> b = B()
>>> super(B, b).test
<bound method B.test of <__main__.B object at 0x02DA3570>>
>>> super(B, b).klass_meth
<bound method type.klass_meth of <class '__main__.B'>>
>>> super(B, b).static_meth
<function static_meth at 0x02D9CC70>
>>> super(B, B).test
<unbound method B.test>
>>> super(B, B).klass_meth
<bound method type.klass_meth of <class '__main__.B'>>
>>> super(B,B).satic_meth
>>> super(B,B).static_meth
<function static_meth at 0x02D9CC70>
```
初始化super对象的时候，传递的第二个参数其实是绑定的对象，第一个参感觉数可以粗暴地理解为标记查找的起点，比如上面例子中的情况：
`super(B, b).test`就会在B.\__mro__里面列出的除B本身的类中查找方法test，因为方法都是非数据描述符，在super对象的自定义getattribute里面
实际上会转化成`A.__dict['test`].\__get__(b, B)`。

super在很多地方都会用到，除了让程序不必hardcode指定类型让代码更加动态，还有其他一些具体必用的地方比如
元类中使用super查找baseclass里面的\__new__生成自定义的类型模板；在自定义getattribute的时候用来防止无限循环等等。

关于super建议读者将它与python的描述符一起来理解，因为super就实现了描述符的协议，是一个非数据描述符，能够帮助大家更好的理解super的使用
和工作原理。


**参考资料：**
> python doc: https://docs.python.org/2/library/functions.html#super

> Descriptor HowTo Guide: https://docs.python.org/2/howto/descriptor.html
