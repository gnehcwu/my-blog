---
title: 更好用的Python namedtuple
date: '2016-03-10'
layout: post
draft: false
path: "/posts/python-namedtuple"
category: "Tech"
tags:
  - "Python"
  - "Coding skills"
---


Python通过Collections模块提供了不少好用的数据容器类型，其中一个精品当属`namedtuple`。

`namedtuple`能够用来创建类似于元组的数据类型，除了能够用索引来访问数据，能够迭代，更能够方便的通过属性名来访问数据：

```python
>>> from collections import namedtuple
>>> Animal = namedtuple('Animal', 'name age type')
>>> big_yellow = Animal(name="big_yellow", age=3, type="dog")
>>> big_yellow
Animal(name='big_yellow', age=3, type='dog')
>>> big_yellow.name
'big_yellow'
```

从上面的列子可以看到，有了`namedtuple`，通过属性访问数据能够让我们的代码更加的直观更好维护（相比索引访问的话），使用pycharm这样的IDE，编码的
时候也会有相应的智能提示，进一步确保不犯低级错误。

类似于`tuple`，它的属性也是不可变的：

```python
>>> big_yellow.age += 1
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: can't set attribute
```
能够方便的转换成`OrderedDict`:

```python
>>> big_yellow._asdict()
OrderedDict([('name', 'big_yellow'), ('age', 3), ('type', 'dog')])
```

方法返回多个值得时候，其实更好的是返回namedtuple的结果,这样程序的逻辑会更加的清晰和好维护：

```python
>>> from collections import namedtuple
>>> def get_name():
...     name = namedtuple("name", ["first", "middle", "last"])
...     return name("Richard", "Xavier", "Jones")
...
>>> name = get_name()
>>> print name.first, name.middle, name.last
Richard Xavier Jones
```

相比`tuple`，`dictionary`，`namedtuple`略微有点综合体的意味：直观、使用方便，墙裂建议大家在合适的时候多用用namedtuple。
更多相关的介绍可以查看官方文档。


参考资料：

> https://docs.python.org/2/library/collections.html#collections.namedtuple
