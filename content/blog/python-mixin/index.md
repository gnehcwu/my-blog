---
title: Python mixin模式
date: '2015-10-24'
---
# Python mixin模式

Mixin模式是一种在python里经常使用的模式，适当合理的应用能够达到复用代码，合理组织代码结构的目的。

Python的Mixin模式可以通过`多继承`的方式来实现, 举例来说，我们自定义一个简单的具有嵌套结构的数据容器：

```
class SimpleItemContainer(object):
    def __init__(self, id, item_containers):
        self.id = id
        self.data = {}
        for item in item_containers:
            self.data[item.id] = item
```

`SimpleItemContainer`通过python内置类型`Dict`来存放数据，不过到目前为止想要访问对应的数据还是得直接调用里面的字典，没法像原生的字典一样方便的通过暴露出来的api访问数据。当然也可以从头开始把完整的`Dictionary Interface`完全实现个遍，不过在每个自定义的类似的容器中都来一套肯定不行，这时候利用python内置的[UserDict.DictMixin](https://docs.python.org/2/library/userdict.html#UserDict.DictMixin)就是一个不错的方式：

```
from UserDict import DictMixin

class BetterSimpleItemContainer(object, DictMixin):
    def __getitem__(self, id):
        return self.data[id]

    def __setitem__(self, id, value):
      self.data[id] = value

    def __delitem__(self, id):
      del self.data[id]

    def keys(self):
            return self.data.keys()
```
通过实现最小的`Dictionary Interface`，还有继承`DictMixin`实现Mixin模式，我们就轻松获得了完整的原生字典的行为：下表语法，`get`, `has_keys`, `iteritems`, `itervalues`甚至还有[iterable protocol implementation](http://www.jianshu.com/p/d3fb22de98ee)等一系列的方法和实现。

很多框架比如[Django](http://www.django-rest-framework.org/api-guide/generic-views/#mixins)， [Django rest framework](https://docs.djangoproject.com/en/1.8/topics/class-based-views/mixins/)里面就普遍用到了Mixin这种模式，定义api或者viewset的时候就能够通过多重继承的方式服用一些功能

当然，Mixin模式也不能滥用，至少他会污染你新定义的类，有时候还会带来MRO的问题；不过把一些基础和单一的功能比如一般希望通过`interface/protocol`实现的功能放进Mixin模块里面还是不错的选择：

```
class CommonEqualityMixin(object):

    def __eq__(self, other):
        return (isinstance(other, self.__class__)
            and self.__dict__ == other.__dict__)

    def __ne__(self, other):
        return not self.__eq__(other)

class Foo(CommonEqualityMixin):

    def __init__(self, item):
        self.item = item
```

其实整个理解下来无非就是通过组合的方式获得更多的功能,有点像C\#， java里面的interface，强调“it can”的意思，但相比起来简单多了，不需要显示的约束，而且mixin模块自带实现。在使用的时候一般把mixin的类放在父类的右边似乎也是为了强调这`并不是典型的多继承，是一种特殊的多继承`，而是在继承了一个基类的基础上，顺带利用多重继承的功能给这个子类添点料，增加一些其他的功能。保证Mixin的类功能单一具体，混入之后，新的类的MRO树其实也会相对很简单，并不会引起混乱。


