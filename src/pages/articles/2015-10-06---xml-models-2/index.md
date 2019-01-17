---
title: Python xml解析库xml_models2
date: '2015-10-06'
layout: post
draft: false
path: "/posts/xml-models2"
category: "Tech"
tags:
  - "Python"
  - "Coding skills"
---

今天给大家介绍一个用于处理xml的开源库[xml_models2](https://github.com/alephnullplex/xml_models2)，它主要能用来对xml文件进行解析。这个库建立在`lxml`之上，相比python自带的`xmlElementTree`、`lxml`等`比较底层`的xml处理方式(lxml其实还行)，它充分利用了[python元类](http://www.jianshu.com/p/d643d6f0ec82)的自省（元编程）特性，允许用户根据相应xml的结构定义自己的model，在model的每个字段中指定对应的xpath，利用lxml的xml处理功能将xml中对应路径的节点和内容提取出来。与其说这是一个xml处理库，更不如说它是一个轻量级的处理xml数据的ORM，只不过并没有与数据库打交道而已。

如引言里面描述的那样，xml_models2能够通过自定义model来`序列化`xml，获取自己感兴趣的节点的内容。假如我们有如下一个xml：

```python
<Person id="112">
  <firstName>Chris</firstName>
  <lastName>Tarttelin</lastName>
  <occupation>Code Geek</occupation>
  <website>http://www.pyruby.com</website>
  <contact-info>
    <contact type="telephone">
      <info>(555) 555-5555</info>
      <description>Cell phone, but no calls during work hours</description>
    </contact>
    <contact type="email">
      <info>me@here.net</info>
      <description>Where possible, contact me by email</description>
    </contact>
    <contact type="telephone">
      <info>1-800-555-5555</info>
      <description>Toll free work number for during office hours.</description>
    </contact>
  </contact-info>
</Person>
```
为了获取相应的数据，我们就可以定义如下的model：

```python
class Person(Model):
    id = IntField(xpath="/Person/@id")
    firstName = CharField(xpath="/Person/firstName")
    lastName = CharField(xpath="/Person/lastName")
    contacts = CollectionField(ContactInfo, order_by="contact_type", xpath="Person/contact-info/contact")

class ContactInfo(Model):
    contact_type = CharField(xpath="/contact/@type")
    info = CharField(xpath="/contact/info")
    description = CharField(xpath="/contact/description", default="No description supplied")
```
Person和ContactInfo model继承自积累xml\_models.Model，IntField，CharField，CollectionField等字段类型都是xml_models提供的字段类型，相信用过像比如SQLAlchemy或者Django ORM的童鞋应该不会陌生，只不过这里在使用这些字段的时候指定的值是一些xpath的值用来指定xml文件中相应节点的路径。定义好model之后，只要简单调用就能取到我们想要的数据：

```python
>>> person = Person(xml_str)
>>> person.contacts[0].info
me@here.com
```
在解析xml的时候，嵌套重复有规则的xml数据可能会经常会用到`CollectionField`，除了像上面定义model的方式指定集合，也能够直接在model里面指定`collection_node`:

```python
class SomeModel(Model):
  fieldA = CharField(xpath="/some/node")

  collection_node = 'collection'
```
在这个库里面还封装了[requests](http://www.python-requests.org/en/latest/)的一些基本功能，这样允许我们直接通过自定义的model里面发起http请求从提供的api获取数据：

```python
data = SomeModel.objects.filter_custom(url_address_xxx).get()
```
获取直接能够通过rest api查询查询一些数据：

```python
class Person(xml_models.Model:
    ...
    finders = { (firstName, lastName): "http://person/firstName/%s/lastName/%s",
                (id,): "http:xxxx//person/%s"}
>>> people = Person.objects.filter(firstName='Chris', lastName='Tarttelin')
>>> people.count()
1
>>> person = Person.objects.get(id=123)
>>> person.firstName
Chris
```

除了如上所示提到的这些，xml_models2还有一些比较好玩的功能：
`to_xml()`: 将xml序列化之后，我们可能会做一些更改，更改之后调用这个api能够生成包含更改内容的xml；甚至能够先定义model，实例化自己的model实力然后生成xml。
`validate_on_load()`： 在model中这个方法一个很好的“钩子”，方便我们在序列化的时候进行一些自定义的验证。
blablablanla...

这个库并没有出来多久，是在另外一个开源库[xml_models](http://djangorestmodel.sourceforge.net/index.html)上面fork而来，对大部分的代码进行了重构，特别是元类`Model/ModelBase`那块。另外项目的文档，代码注释，单元测试都很完整，非常鼓励有兴趣的童鞋可以关注一下。

差不多就给大家介绍到这里，更多的内容大家可以查看[库的文档](http://xml-models2.readthedocs.org/en/latest/index.html)和[github主页](https://github.com/alephnullplex/xml_models2)。感兴趣的同学可以试用一下，有什么问题可以去主页上提issue或者pr。

这篇文章大部分部分的内容都是从文档搬来的，稍稍加了些自己的一些理解加以润色和丰富，方便大家开始使用。接下来可能还会写两篇源码解读的文章，对于里面不好的地方也会顺便吐吐槽，敬请期待...
