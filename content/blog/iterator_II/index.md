---
title: Python迭代器 II
date:  '2015-09-03'
---

在上一篇python迭代器博客中，我们简单接触了如何让自定义的数据类型实现能够支持迭代，也就是需要实现方法：`__iter__`、`next`（next在py 3.x中签名也变成了`__next__`，更加的统一和谐）；区分了`可迭代对象`和`迭代器`的区别，用`for`遍历迭代数据时背后的语法糖等一些内容。

在这篇文章中，做个总结和阐述一些稍稍全局点的理解，包括实现迭代器的多种方式，Generator expression，yield，内置的一些迭代器相关的功能库/函数。

### yield实现迭代器

如引言中的描述，实现一个可迭代的功能要是每次都手动实现iter,next稍稍有点麻烦，所需的代码也是比较客观。在python中也能通过借助`yield`的方式来实现一个迭代器。`yield`有一个关键的作能，它能够中断当前的执行逻辑，保持住现场（各种值的状态，执行的位置等等），返回相应的值，下一次执行的时候能够无缝的接着上次的地方继续执行，如此循环反复知道满足事先设置的退出条件或者发生错误强制被中断。光听描述就觉得和迭代器的工作方式很一致是吧，的确，yield能把它所在的函索变成一个迭代器,拿最经典的菲波那切数列的例子聊简述一下工作的方式：

```python
def fab(max):
    n, a, b = 0, 0, 1
    while n < max:
    	print b, "is generated"
        yield b
        a, b = b, a + b
        n = n + 1

>>> for item in fab(5):
...     print item
...
1 is generated
1
1 is generated
1
2 is generated
2
3 is generated
3
5 is generated
5
```
在上一篇[python迭代器](http://www.jianshu.com/p/d3fb22de98ee)中我们有简单提到过`for`关键字的语法糖，在这里遍历5以内的菲波那切数列值的时候，很显然`fab(5)`生成了一个可迭代的对象，遍历开始的时候它的`iter`方法被调用返回一个实际工作的迭代器对象，然后每一次调用它的`next`方法返回一个菲波那切数列值然后打印出来。
我们可以将调用生成器函数返回的对象的属性打印出来，看一下到底发生了什么：

```python
>>> temp_gen = fab(5)
>>> dir(temp_gen)
['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__iter__', '__name__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'close', 'gi_code', 'gi_frame', 'gi_running', 'next', 'send', 'throw']
```
正如上面的描述，单纯调用`fab`并不会让函数立刻开始返回任何值，并且从打印出的`fab(5)`的属性列表能够看到，生成器函数返回的对象包含有`__iter__`，`next`的实现。与我们手动实现相比，使用yield很方便的就能够实现我们想要的功能，代码量缩减不少。

### Generator Expression

python中另一种能更优雅生成迭代器对象的方式就是使用生成器表达式`Generator expression`，它和列表解析表达式有着非常相似的写法，仅仅是把中括号`[]`变成`()`而已，不过小小改变产生的实际效果确实大大的不一样：

```python
>>> temp_gen = (x for x in range(5))
>>> temp_gen
<generator object <genexpr> at 0x7192d8>
>>> for item in temp_gen:
...     print item
...
0
1
2
3
4
>>> dir(temp_gen)
['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__iter__', '__name__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'close', 'gi_code', 'gi_frame', 'gi_running', 'next', 'send', 'throw']
```
看过上面对`yield`的描述，这个例子以及对应的输出日志还是相当直接明了的，无论是`temp_gen`的打印日志描述，`for`语句遍历的输出结果还是调用`dir`输出的属性列表，都赤裸裸的表明生成器表达式确实生成了能够支持迭代的对象。另外表达式里面也能够调用函数，增加适量的过滤条件。

### 内置库itertools 和 iter

python内置的库`itertools`提供了大量的工具方法，这些方法能够帮助我们创建能进行高效遍历和迭代的对象，里面包含不少有意思并且有用的方法，比如像`chain`, `izip/izip_longest`, `combinations`, `ifilter`等等。我在[粗谈Python内置库itertools](http://www.jianshu.com/p/db56bb477e1a)有进行一些简单的介绍。建议大家直接去官方的文档[itertools — Functions creating iterators for efficient looping](https://docs.python.org/2/library/itertools.html#itertools.izip_longest)去瞅瞅，绝对能帮你在每天的激情coding中解锁更多姿势。

在python中还有一个内置的`iter`函数非常有用，能够返回一个迭代器对象，之后也就能够进行可以查看对应的帮助文档简单看一下：

```python
>>> iter('abc')
<iterator object at 0x718590>
>>> str_iterator = iter('abc')
>>> next(str_iterator)
'a'
>>> next(str_iterator)
'b'
>>> lst_gen = iter([1,2,3,4])
>>> lst_gen
<listiterator object at 0x728e30>
>>> dir(lst_gen)
['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__iter__', '__length_hint__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'next']

>>> help(iter)
Help on built-in function iter in module builtins:

iter(...)
    iter(iterable) -> iterator
    iter(callable, sentinel) -> iterator

    Get an iterator from an object.  In the first form, the argument must
    supply its own iterator, or be a sequence.
    In the second form, the callable is called until it returns the sentinel.
```
