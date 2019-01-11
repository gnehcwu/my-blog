---
title: Pyhton迭代器
date: '2015-07-25'
---

毋庸置疑，迭代器有很多好处：
- “流式”数据处理方式减少内存消耗：
比如处理文件，一下猛地把全部数据全部取出来放到内存里面进行处理会导致程序消耗大量内存，有时甚至没法做到，一般我们会一部分一部分的对文件内容进行处理：
```python
for text_line in open("xx.txt"):
    print text_line
```
或者对xml文件进行处理的时候：
```python
tree = etree.iterparse(xml, ['start', 'end'])
for event, elem in tree:
	if event == "end"
		result = etree.tostring(elem)
		elem.clear()
		print result
```
内置函数`open`返回的`file`对象和` etree.iterparse`序列化的xml tree都是可迭代对象，能够让我们渐进式地对文件的内容进行处理。

- 支持方便用`for`语句对数据进行消费：
python内置的一些常见的像类型像`数组、列表甚至字符串`等都是可迭代类型，这样我们就能方便`for`语句这个语法糖方便对数据进行消费，不需要自己记录索引位置，人肉循环：
```python
for i in [1, 2, 3, 4]
    print i,
```

简单了解了一下迭代器的好处后，我们正正紧紧的聊聊python的迭代器模式
在这里我们引入两个比较绕口的名词：`可迭代对象`和`迭代器对象`，个人觉得从这两个概念下手会对迭代器有比较好的理解。在放例子前先对这两个概念给一个不入流的解释：
- `可迭代对象`：对象里面包含`__iter()__`方法的实现，对象的`iter`函数经调用之后会返回一个迭代器，里面包含具体数据获取的实现。
- `迭代器`：包含有`next`方法的实现，在正确范围内返回期待的数据以及超出范围后能够抛出`StopIteration`的错误停止迭代。

放个例子边看边说：
```python
class iterable_range:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        return my_range_iterator(self.n)

 class my_range_iterator:
    def __init__(self, n):
        self.i = 0
        self.n = n

    def next(self):
        if self.i < self.n:
            i = self.i
            self.i += 1
            print 'iterator get number:', i
            return i
        else:
            raise StopIteration()

```

例子中的`iterable_range`是一个可迭代对象，所以我们也能够对它用for语句来进行迭代

```python
temp = my_range(10)
for item in temp:
    print item,

 output:
    my iterator get number: 0
    0
    my iterator get number: 1
    1
    my iterator get number: 2
    2
    my iterator get number: 3
    3
    my iterator get number: 4
    4
    my iterator get number: 5
    5
    my iterator get number: 6
    6
    my iterator get number: 7
    7
    my iterator get number: 8
    8
    my iterator get number: 9
    9
```

大家可以仔细地看一下输出的日志：
    1.  数据确实是“流式”处理的
    2.  iterator是真正在背后做事的人
    3. `for`语句能够非常方便的迭代对象的数据。

可迭代对象其实更像是整个`迭代器模式`模式的上层，像一种约束一种契约一种规范，它能够保证自己能够返回一个在实际工作中干活的迭代器对象。`for`、`sum`等接受一个可迭代对象的方法都是遵循这样的规范：调用对象的`__iter__`函数，返回迭代器，对迭代器对象返回的每个值进行处理抑或需要一些汇总的操作。拿`for`举个例子：

```python
iterator_object = iterable_object.__iter__()
while True:
    try:
        value = iterator_object.next()
    except StopIteration:
        # StopIteration exception is raised after last element
        break

    # loop code
    print value
```

**`for`**这个语法糖背后的逻辑差不多就是上面例子中代码所示的那样：首先获取可迭代对象返回的迭代器对象，然后调用迭代器对象的`next`方法获取每个值，在获取值的过程中随时检测边界-也就是检查是否抛出了`StopIteration`这样的错误，如果迭代器对象抛出错误则迭代停止（note：从这个例子可以看出，对于那些接受可迭代对象的方法，如果我们传一个单纯的迭代器对象其实也是无法工作的，可能会报出类似于`TypeError: iteration over non-sequence`的错误）。
当然了，一般在应用过程中我们不会将他们特意的分开，我们能够稍微对迭代器对象进行修改一下，添加`__iter__`方法的实现，这样对象本身就既是可迭代对象也是一个迭代器对象了：

```python
class my_range_iterator:
      def __init__(self, n)：
        self.i = 0
        self.n = n

      def __iter__(self):
        return self

      def next(self):
        if self.i < self.n:
            i = self.i

            self.i += 1
            print 'my iterator get number:', i
            return i
        else:
            raise StopIteration()

 for item in my_range_iterator(10):
     print item

 output:
    my iterator get number: 0
    0
    my iterator get number: 1
    1
    my iterator get number: 2
    2
    my iterator get number: 3
    3
    my iterator get number: 4
    4
    my iterator get number: 5
    5
    my iterator get number: 6
    6
    my iterator get number: 7
    7
    my iterator get number: 8
    8
    my iterator get number: 9
    9
```
