$(function () {
  $.getJSON("json/menu.json", function (data) {
    //1.getJSON方法获取json文件数据，data为json存储的数据对象组
    for (var i = 0; i < data.length; i++) {
      //2.循环访问data数组中的每个对象，长度为data.length
      $.each(data[i], function (key, val) {
        //console.log(data[i][key]);
        //3.遍历每个data对象的键值对，遍历次数为5，原因json文件有5个键值对
        //key代表属性名，val代表对应的属性值
        if (data[i][key] == 0) {
          //4.判断该data对象是否存在菜单的父级菜单id为0
          //为0 则为一级菜单，生成li标签，显示菜单项名称data[i]["navTitle"]
          //同时添加li的class为data[i]["navId"]
          //console.log(data[i]);
          $("#nav-mainbox").append("<li class='" + data[i]["navId"] + "'id='" + data[i]["id"] + "'><span class='shead'><img src='img/icon/" + data[i]["navId"] + ".png'/></span><a>" + data[i]["navTitle"] + "</a><ul></ul></li>");

          //7.页面首次加载时，只有第一项一级菜单的子菜单显示
          //其他子菜单项隐藏
          //$("li.1").children("ul").slideDown();
          $("li").siblings().children("ul").slideUp();

          //6.为一级菜单绑定点击事件
          //一级菜单项可以滑动显示或隐藏子菜单项
          //同时，当前菜单显示，则其他都隐藏
          $("." + data[i]["navId"]).on("click", function () {

            $(this).children("ul").slideToggle();
            //$(this).siblings().children("ul").slideUp();

          })

        }

        if (data[i][key] == i + 1) {

          //5.判断非一级菜单项
          //根据该对象的父级菜单id找li标签，成为其子菜单项
          //jQuery的apppend()方法动态加载html代码
          $("." + data[i]["navParentId"]).find("ul").append("<li class='" + data[i]["navId"] + "'id='" + data[i]["id"] + "'><a>" + data[i]["navTitle"] + "</a></li>"); //向下图标<span class='sfoot'><img src='img/icon/down.png'/></span>
        }
      });

    }
    // require([""])
  })
});