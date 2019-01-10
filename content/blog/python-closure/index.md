---
title: Python 闭包使用中需要注意的地方
date: '2016-03-15'
---

昨天正当我用十成一阳指功力戳键盘、昏天暗地coding的时候，被人问了一个问题，差点没收功好，洪荒之力侧漏而出震伤桌边的人，废话不多说，先上栗子（精简版，只为说明问题）：

```python
from functools import wraps
from time import sleep

def retry(attempts=3, wait=2):
    if attempts < 0 or attempts > 5:
        retry_times = 3
    else:
        retry_times = attempts
    if wait < 0 or wait > 5:
        retry_wait = 2
    else:
        retry_wait = after
    def retry_decorator(func):
        @wraps(func)
        def wrapped_function(*args, **kwargs):
            while retry_times > 0:
                try:
                    return func(*args, **kwargs)
                except :
                    sleep(retry_wait)
                    retry_times -= 1
        return wrapped_function
    return retry_decorator
```

简易版的`retry`装饰器，需要的变量被闭包完美捕捉，逻辑也挺简单明了。问的人说逻辑看着挺正常的，但就是一直报变量`retry_times`找不到（`unresolved reference`)的错误提示。这是为什么呢，相信看过撸主上篇文章[正确使用Python可选参数](http://www.jianshu.com/p/2b4f71a9f978)(标题写的有点打有点扯，见谅）的童鞋应该很快能反应过来。没错仔细捋一下，这是一道送分题呢：闭包捕获的变量（`retry_times，retry_wait`）相当时引用的`retry`函数的局部变量，当在`wrapped_function`的局部作用于里面操作不可变类型的数据时，会生成新的局部变量，但是新生成的局部变量`retry_times`在使用时还没来得及初始化，因此会提示找不到变量；`retry_wait`相反能被好好的使用到。

python是duck-typing的编程语言，就算有warning照样跑，写个简单到极限的的函数，用一下装饰器，在`wrapped_function`逻辑里打个断点看一下各个变量的值也是很快能找到问题的（直接跑也能看到错误:`UnboundLocalError: local variable 'retry_attempts' referenced before assignment`, 至少比warning msg有用）：

```python
@retry(7, 8)
def test():
    print 23333
    raise Exception('Call me exception 2333.')

if __name__ == '__main__':
    test()

output: UnboundLocalError: local variable 'retry_times' referenced before assignment
```

要解决这种问题也好办，用一个可变的容器把要用的不可变类型的数据包装一下就行了(说个好久没写C#代码记不太清楚完全不负责任的题外话，就像在C#.net里面，碰到闭包的时候，会自动生成一个混淆过名字的类然后把要被捕捉的值当作类的属性存着，这样在使用的时候就能轻松get，著名的老赵好像有一篇文章讲Lazy Evaluation的好像涉及到这个话题）：

```python
def retry(attempts=3, wait=2):
    temp_dict = {
        'retry_times': 3 if attempts < 0 or attempts > 5 else attempts,
        'retry_wait': 2 if wait < 0 or wait > 5 else wait
    }

    def retry_decorate(fn):
        @wraps(fn)
        def wrapped_function(*args, **kwargs):
            print id(temp_dict), temp_dict
            while temp_dict.get('retry_times') > 0:
                try:
                    return fn(*args, **kwargs)
                except :
                    sleep(temp_dict.get('retry_wait'))
                    temp_dict['retry_times'] = temp_dict.get('retry_times') - 1
                print id(temp_dict), temp_dict

        print id(temp_dict), temp_dict

        return wrapped_function

    return retry_decorate

@retry(7, 8)
def test():
    print 23333
    raise Exception('Call me exception 2333.')

if __name__ == '__main__':
    test()

#output：
4405472064 {'retry_wait': 2, 'retry_times': 3}
4405472064 {'retry_wait': 2, 'retry_times': 3}
23333
4405472064 {'retry_wait': 2, 'retry_times': 2}
23333
4405472064 {'retry_wait': 2, 'retry_times': 1}
23333
4405472064 {'retry_wait': 2, 'retry_times': 0}
```

从output中可以看到，用dict包装后，程序能够正常的工作，和预期的一致，其实我们也可以从函数的闭包的值再次确认：

```python
>>> test.func_closure[1].cell_contents
{'retry_wait': 2, 'retry_times': 2}
```

我是结尾，PEACE!


> 参考资料：

> http://stackoverflow.com/questions/986006/how-do-i-pass-a-variable-by-reference

> https://docs.python.org/3/faq/programming.html#how-do-i-write-a-function-with-output-parameters-call-by-reference
