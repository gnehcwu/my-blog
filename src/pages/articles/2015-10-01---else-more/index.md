---
title: 善用python的else子句
date: '2015-10-01'
layout: post
draft: false
path: "/posts/python-else"
category: "Tech"
tags:
  - "Python"
  - "Coding skills"
---

在日常coding中，分支语句的使用非常普遍，经常会根据是否满足一定的条件对代码执行的逻辑进行一些控制，所以大家对`if[elif[else]]`一定不会陌生。分支语句中的`else子句`在其它的条件不满足的时候会被执行到，适当的使用分支语句能够让我们的代码逻辑更加的丰富。
在分支语句中使用else子句在一些常见的编程语言中的用法基本相同，类似于提供了一条默认的执行路径，配合`if`等条件判断语句使用，相比其它的编程语言(c\#, java, js等)在python中，else有一些特殊的用法，配合`for`, `while`等循环语句使用，甚至还能配合异常处理`try except`语句进行使用，能够让我们的代码更加的简洁。

### 配合for/while循环语句使用
在`for`循环语句的后面紧接着`else`子句，在循环正常结束的时候（非return或者break等提前退出的情况下），`else`子句的逻辑就会被执行到。先来看一个例子：

```python
def print_prime(n):
    for i in xrange(2, n):
        # found = True
        for j in xrange(2, i):
            if i % j == 0:
            	 # found = False
                break
        else:
            print "{} it's a prime number".format(i)
        # if found:
        	      # print "{} it's a prime number".format(i)


print_prime(7)

2 it's a prime number
3 it's a prime number
5 it's a prime number
```
一个简单打印素数的例子，判断某个数字是否是素数的时候需要遍历比它自己小的整数，任何一个满足整除的情况则判断结束，否则打印这是一个素数的info，有了else的加持，整个例子的逻辑相当的“self-expressive”，如同伪代码一般的好理解而且相比在判断整除的时候设置`标志值`然后在函数的结尾处判断标志值决定是否打印数字时素数的消息，代码更简洁没有那么多要描述如何做的“过程式”准备工作。
*ps: 大家可以把例子中的被注释代码运行对比下效果。*


### 配合 try except错误控制使用
在异常处理语句中，else有相似的用法，当try代码块没有抛出任何的异常时，else语句块会被执行到。

```python
def my_to_int(str_param):
    try:
        print int(str_param)
    except ValueError:
        print 'cannot convert {} to a integer'.format(str_param)
    else:
        print 'convert {} to integer successfully'.format(str_param)

my_to_int("123")
my_to_int("me123")

123
convert 123 to integer successfully
cannot convert me123 to a integer

```
如打印日志所示，在转换成功未发生错的的时候，else语句里的逻辑会被执行，当然这个例子可能并没有什么太多的实际的用处，但大致说明了else在错误处理中的用处：简化逻辑，避免使用一些标志值就能够准确把握是否发生错误的情况来做一些实际的操作（比如在保存数据的时候如果发生错误，在else语句块中进行rollback的操作，然后紧接着还能加上finally语句完成一些清理操作。

善用`else`语句块能够让我们编写出更加简明，更加接近自然语言的语义的代码，当然也会更加的pythonic，细微之处大家可以慢慢体会。
