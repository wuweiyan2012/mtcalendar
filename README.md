# mtcalendar
一个基于jquery开发的超级简单的日历插件

## 支持以下功能：

- 支持设置默认日期，手动选择日期。
- 支持月份切换。
- 支持多种事件（创建，切换月份，选择日期）。。
- 提供插件外设置日期、获取当前选择日期的API
- 兼容chrome、Firefox、IE10+，支持手机端，PC端....


## 初始化方法：
```
<!-- 引用代码包 -->
<link rel="stylesheet" href="jquery.mtcalendar.css"/>
<script src="jquery.min.js"></script>
<script src="jquery.mtcalendar.js"></script>


<!-- HTML结构 -->
<div id="CLD"></div>
<div id="msg"></div>

<!-- js代码 -->
$(function(){
    $("#CLD").mtcalendar({
        date:"2017-07-12",
        onCreated: function(){ $("#msg").append("<p>日历已创建</p>");},
        onDaySelected: function(year,month,day){ $("#msg").append("<p>选择日期：" + year + " " + month + " " + day + "</p>");},
        onMonthChanged: function(year,month){ $("#msg").append("<p>选择月份：" + year + " " + month + "</p>");},
    });
});



```

