---
title: 粗谈Python内置库itertools
date: '2015-08-23'
---

官方对[itertools](https://docs.python.org/2/library/itertools.html#itertools.izip_longest)的定义是`Functions creating iterators for efficient looping`，定义了一系列的方法，能帮助我们创建能够进行高效遍历迭代的迭代器，里面包含不少有意思并且有用的方法，比如像`chain`, `izip/izip_longest`, `combinations`, `ifilter`等等。

在这里简单拿几个方法为例，简单分析一下文档里面给出的等效的实现的方式还有平时我们能够使用的场景。

## chain

如同`chain`的名称还有签名`itertools.chain(*iterables)`所示，我们能用它将一系列的可迭代对象串联起来，这样就能连续的对多个迭代对象的内容进行迭代：

```python
>>> itertools.chain('ABC', 'DEF')
<itertools.chain object at 0x718910>
>>> for item in itertools.chain('ABC', 'DEF'):
...     print item,
...
A B C D E F
```

从上面的打印日志里面能够看到，调用`itertools.chain`生成了一个迭代器对象，在python的`itertools`内置库里面,`chain`被实现成一个继承自`object`的一个对象，实现了[`next, __iter__`](http://www.jianshu.com/p/d3fb22de98ee)方法(将自己实现成一个可迭代对象，迭代器），调用时其实是调用它的`__init__(self, *iterables)`方法初始化了一个对象，然后接下来进行迭代。简化的等效的实现方式类似：

```python
def chain(*iterables):
    for it in iterables:
        for element in it:
            yield element
```
传递给`chain`的多个可迭代对象呗保存在元组类型的变量`iterables`里面，遍历每一个可迭代对象里面的每一个对象，上面等效实现的方式里面是用`yield`的实现的，当对串联的结果比如说用`for`进行遍历的时候，`yield`能够每次返回一条数据，中断，外面我们自己的代码执行（或输出或其它的操作）如此循环反复知道遍历结束（StopIteration error throwed）。

## combinations

这个方法能够帮助我们生成一个列表中,按照顺序能够有的所有组合，当然生成依然是迭代器对象。

```python
>>> itertools.combinations('ABCDA', 2)
<itertools.combinations object at 0x714720>
>>> for item in itertools.combinations('ABCDA', 2):
...     print item
...
('A', 'B')
('A', 'C')
('A', 'D')
('A', 'A')
('B', 'C')
('B', 'D')
('B', 'A')
('C', 'D')
('C', 'A')
('D', 'A')
```
和`chain`的实现方式差不多是一样的，实现了[`next, __iter__`](http://www.jianshu.com/p/d3fb22de98ee)方法(将自己实现成一个可迭代对象，迭代器），调用时其实是调用它的`__init__(self, iterable, r)`方法初始化了一个`combinations`对象，然后能够对它进行迭代。等效的实现方式差不多像这样：

```python
def combinations(iterable, r):
    # combinations('ABCD', 2) --> AB AC AD BC BD CD
    # combinations(range(4), 3) --> 012 013 023 123
    pool = tuple(iterable)
    n = len(pool)
    if r > n:
        return
    indices = range(r)
    yield tuple(pool[i] for i in indices)
    while True:
        for i in reversed(range(r)):
            if indices[i] != i + n - r:
                break
        else:
            return
        indices[i] += 1
        for j in range(i+1, r):
            indices[j] = indices[j-1] + 1
        yield tuple(pool[i] for i in indices)
```

其实这个等效的实现的方式也很有意思，里面充分你的利用了`yield`的特性，中断返回值后能够将现场的环境保持下来，比如例子中，变量`indices`的值在每次返回值之后都能继续保存，这样里面记录的索引值才能正确递进，直到迭代结束。

`itertools`这个内置库里面的提供的一些服用方法能够很大简化平时需要做的一些工作，而且高效。也能方便结合`operator`里面的一些计算的方法一起使用，代码能精简很多。官方的文档里面详细的介绍了各个方法的实现和使用，希望这篇流水账能够起个引言的作用。

> 参考资料：[itertools — Functions creating iterators for efficient looping](https://docs.python.org/2/library/itertools.html#itertools.izip_longest)
