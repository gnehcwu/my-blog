---
title: "Swift 2.2学习笔记 - 函数和闭包"
date: '2016-03-28'
---
函数和闭包联系非常紧密，放在一起讲述效果会好很多。Swift的函数也是一等公民，能够当作参数使用，能够当作值返回。现如今多范式的语言基本都支持，对抽象复用非常有帮助（比如定义模板方法，由调用方指定具体的计算逻辑）。闭包呢等同于其它语言里面的lambda表达式（结合swift里或者其他语言里面的一些像是函数的类型，委托，函数签名的这些概念理解起来可能更加的方便），结合类型推断能够把一些功能实现的非常精简。

### 1. 函数基本
Swift里面函数的声明使用的关键字是`func`，挺简明清晰的，后面紧跟着用小括号包含的函数的参数以及用`->`分割的返回类型（如果有的话）：
```swift
func someFunction(externalParameterName localParameterName: parameterType) -> returnValueType {
    // function body goes here, and can use localParameterName
    // to refer to the argument value for that parameter
}
```
需要注意的几点有：

- 函数的参数可以没有（小括号得保留），返回值可以没有（没有返回值的话省略返回值的类型以及`->`)，可以使用元组（命名元组最佳，因为这样调用的人得到返回值后可以方便的获取返回值得到内容），集合类型等返回多值，可空值等等：
```swift
	func minMax(array: [Int]) -> (min: Int, max: Int) {
	    // find min and max value
	    return (currentMin, currentMax)
	}

	func minMax(array: [Int]) -> (min: Int, max: Int)? {
	    // find min max value which may exist.
	    return (currentMin, currentMax)
	}
	// call the function
	if let bounds = minMax([8, -6, 2, 109, 3, 71]) {
	    print("min is \(bounds.min) and max is \(bounds.max)")
	}
```
- 函数的参数名称分为外部参数名和局部参数名，默认情况下不显示指定的话，第一个参数会省略外部参数名，之后的每个参数使用相同的局部和外部参数名称。外部参数名和局部参数名分别对应调用者和实现者，可根据具体情况合理命名，让代码更加合符规范和习惯。
- 没有返回值的时候其实背后还是返回了一个Void的类型
- 带默认值的参数，需要放在函数参数列表的最后。（Swift提供的命名参数和默认值参数并没有其它语言使用的那么自由，顺序必须得固定）
- 可变数量参数,在函数内访问的时候是被封装成同类型的数组了，个人认为并没有多少的使用场景，也没有python的`*args和**kwargs`那么强大，看看就好了：
```swift
func arithmeticMean(numbers: Double...) -> Double {
    var total: Double = 0
    for number in numbers {
        total += number
    }
    return total / Double(numbers.count)
}
arithmeticMean(1, 2, 3, 4, 5)
```
- 输入输出参数inout参数，有点像其他语言里面的强制按引用传递，是另一种改变函数外部值的方式，swift的[组合运算符](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/AdvancedOperators.html#//apple_ref/doc/uid/TP40014097-CH27-ID42)就是利用了inout参数改变变来那个的值：
```swift
func += (inout left: Vector2D, right: Vector2D) {
    left = left + right
}
// x += y
```
如果想改变常量或者字面量的值在调用的时候需要使用`&`：`swapTwoInts(&someInt, &anotherInt)`

### 2. 函数类型
函数的类型由函数的参数以及返回值类型表示，在把函数当作参数或者返回值的时候，指定的类型就里会用用到，非常类似c#里面的接口或者`Action/Func`类型，常见格式可能就是：` ([type...]) -> Type/Void`:
```swift
func printMathResult(mathFunction: (Int, Int) -> Int, _ a: Int, _ b: Int) {
    print("Result: \(mathFunction(a, b))")
}
printMathResult(addTwoInts, 3, 5)
```

### 3. 闭包基本概念
闭包其实可以理解成一种特殊的函数，没有函数名称，现写现用：
```swift
{ (parameters) -> return type in
    statements
}
```
按照官方文档的说法其实闭包有三种形式：

1. 全局作用域中的函数，未捕捉任何值
2. 嵌套函数，可以捕捉外部父函数中定义的值和函数参数。
3. 闭包表达式，村正血统，可以捕捉它所在作用域里面的值

Swift的闭包可以自动推导参数类型，支持尾部闭包语法,单行自动返回表达式的值等等，能够以非常简短的方式写出来，以文档中的一个排序的例子看看简化的过程：
```swift
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]

func backwards(s1: String, _ s2: String) -> Bool {
    return s1 > s2
}
var reversed = names.sort(backwards)

reversed = names.sort({ (s1: String, s2: String) -> Bool in
    return s1 > s2
})

reversed = names.sort( { (s1: String, s2: String) -> Bool in return s1 > s2 } )

reversed = names.sort( { s1, s2 in return s1 > s2 } )

reversed = names.sort( { s1, s2 in s1 > s2 } )

reversed = names.sort( { $0 > $1 } )

reversed = names.sort(>)
```
具体的程度需要个人权衡，既保证可读性有保证简化。其中最后一个实现是因为String类型[个性化实现的操作符](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/AdvancedOperators.html#//apple_ref/doc/uid/TP40014097-CH27-ID42)和sort函数需要的类型一样。

当把闭包传递给函数的最后一个参数的时候，可以使用尾部闭包:`reversed = names.sort() { $0 > $1 }`, 如果恰好只有这一个参数的话，调用函数是的小括号也可以省略：`reversed = names.sort { $0 > $1 }`。尾部闭包在闭包的逻辑比较复杂的时候用处会明显一点，不过这种情况下也可以将需要的逻辑封装在一个单独的函数中，然后传递函数，两种方式任选把（写过python的人应该会选择后者吧，被刻意弱化的lambda表达式强行养成习惯了吧）


### 4. 闭包捕捉
闭包因为能够捕捉值才这么功能强大，但如果不仔细也很容易踩坑而不察觉，每个语言提供的捕捉机制也有点区别。在swift闭包捕捉值需要注意一下几点：

- 函数和闭包的参数都是常量
- 闭包捕捉常量或者变量的引用，捕捉的常量也是不能更改的。
- Swift会此进行优化，那些不需要更改的捕捉值可能只会给一个值的copy，提高效率
- 闭包是引用类型，赋值给常量后，闭包原本的行为并不会受到影响，只不过，这个常量也就只能是这个闭包了（引用关系改不了，因为是常量）

### 5. @noescape 和 @autoclosure
@noescape可以强制闭包只能在接收它的函数里面使用，否则会报错:
```swift
func someFunctionWithNonescapingClosure(@noescape closure: () -> Void) {
    closure()
}
```

@autoclosure能够将表达式自动打包成闭包，简化使用：
```swift
var customersInLine = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
func serveCustomer(customerProvider: () -> String) {
    print("Now serving \(customerProvider())!")
}
serveCustomer( { customersInLine.removeAtIndex(0) } )

func serveCustomer(@autoclosure customerProvider: () -> String) {
    print("Now serving \(customerProvider())!")
}
serveCustomer(customersInLine.removeAtIndex(0))
// Prints "Now serving Ewa!"
```
因为@autoclosure默认具有 @noescape的约束，所以当要在外部使用闭包的时候，需要使用：`@autoclosure(escaping)`修饰。
```swift
var customerProviders: [() -> String] = []
func collectCustomerProviders(@autoclosure(escaping) customerProvider: () -> String) {
    customerProviders.append(customerProvider)
}
```

### 6. 延迟计算
闭包能够带来一个热别有用的特性：延迟计算，当碰到一些计算废昂贵，暂时不需要的计算时可以使用利用这个特性，让设计实现的更加优雅（当然，闭包实现的东西，通过函数也能达成）：
```swift
var customersInLine = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
print(customersInLine.count)
// Prints "5"

let customerProvider = { customersInLine.removeAtIndex(0) }
print(customersInLine.count)
// Prints "5"

print("Now serving \(customerProvider())!")
// Prints "Now serving Chris!"
print(customersInLine.count)
// Prints "4"
```
