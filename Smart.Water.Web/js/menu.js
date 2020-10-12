$(function () {
  //1.getJSON方法获取json文件数据，data为json存储的数据对象组
  $.getJSON("json/menu.json", function (data) {

     //2.循环访问data数组中的每个对象，长度为data.length
     for (var i = 0; i < data.length; i++) {
      //3.遍历每个data对象的键值对，遍历次数为5，原因json文件中的对象都有5个键值对
      //key代表属性名，val代表对应的属性值
      $.each(data[i], function (key, val) {
        //4.判断该data对象是否存在菜单的父级菜单id为0
        if (data[i][key] == 0) {
          //为0 则为一级菜单，生成li标签，显示菜单项名称data[i]["navTitle"]
          //同时添加li的class为data[i]["navId"]
          //append() 方法在被选元素的结尾（仍然在内部）插入指定内容
          $("#nav-mainbox").append("<li class='" + data[i]["navId"] + "'id='" + data[i]["id"] + "'><span class='shead'><img src='img/icon/" + data[i]["navId"] + ".png'/></span><a>" + data[i]["navTitle"] + "</a><ul></ul></li>"); //这里的<ul></ul>用来放置此一级菜单的子菜单

          //7.页面首次加载时，只有第一项一级菜单的子菜单显示，其他子菜单项隐藏
          //$("li.1").children("ul").slideDown();
          //siblings() 方法返回被选元素的所有同级元素(这里是所有子菜单项)；slideUp()方法通过使用滑动效果，隐藏被选元素，如果元素已显示出来的话
          $("li").siblings().children("ul").slideUp();

          //6.为一级菜单绑定点击事件
          //一级菜单项可以滑动显示或隐藏子菜单项
          $("." + data[i]["navId"]).on("click", function () {
              //$(this).children("ul")获取被选元素的所有直接子元素，即这里的子菜单项；slideToggle(speed，callback) 方法通过使用滑动效果（高度变化）来切换元素的可见状态
              $(this).children("ul").slideToggle();
              //当前菜单显示，则其他都隐藏
              $(this).siblings().children("ul").slideUp(); 
          })

        }

        //5.判断非一级菜单项
        if (data[i][key] == i + 1) {
          //根据该对象的父级菜单id找li标签，成为其子菜单项，find() 方法获得当前元素集合中每个元素的后代，通过选择器、jQuery 对象或元素来筛选
          //jQuery的apppend()方法动态加载html代码
          $("." + data[i]["navParentId"]).find("ul").append("<li class='" + data[i]["navId"] + "'id='" + data[i]["id"] + "'><a>" + data[i]["navTitle"] + "</a></li>"); //向下图标<span class='sfoot'><img src='img/icon/down.png'/></span>
        }
      });

    }
    // require([""])
  })
});