$(function () {
  //添加信息窗口
  //jquery不能动态获取网页里面的标签(即“$("#jspanel").click(function(){})”是不行的)，需要先获取网页固定的标签，然后再获取里面其他的标签(这里document指获取所有html元素)
  $(document).on('click', '#jspanel', function () {
    $.jsPanel({
      position: { my: "center-top", at: "center-top", offsetY: 150 },//位置选项。my:jsPanel的相对于其他元素的位置；at；jsPanel将针对的元素点；offsetX：水平偏移;offsetY:上下偏移；
      theme: "primary", //颜色，这里使用了原色
      contentSize: { width: 700, height: 350 }, //面板内容div的宽度和高度
      //headerTitle: "标题", //标题文本
      //content: "<p>一些文本内容</p>",
      callback: [
        function () {
          this.content.css("padding", "15px");

        },
        function () {
          this.headerTitle('添加信息')
          this.content.load('plugins/add.html');
        },
      ]
    });
  });
  //viewer.js图片查看插件
  $(document).on('click', '#viewer', function () {
    $.jsPanel({
      position: { my: "center-top", at: "center-top", offsetY: 50 },//位置选项。my:jsPanel的相对于其他元素的位置；at；jsPanel将针对的元素点；offsetX：水平偏移;offsetY:上下偏移；
      theme: "primary", //颜色，这里使用了原色
      contentSize: { width: 1000, height: 600 }, //面板内容div的宽度和高度
      //headerTitle: "标题", //标题文本
      //content: "<p>一些文本内容</p>",
      callback: [
        function () {
          this.content.css("padding", "15px");

        },
        function () {
          this.headerTitle('图片查看')
          this.content.load('plugins/viewer.html');
        },
      ]
    });
  });
  //zTree树
  $(document).on('click', '#zTree', function () {
    $.jsPanel({
      position: { my: "center-top", at: "center-top", offsetY: 90 },//位置选项。my:jsPanel的相对于其他元素的位置；at；jsPanel将针对的元素点；offsetX：水平偏移;offsetY:上下偏移；
      theme: "primary", //颜色，这里使用了原色
      contentSize: { width: 400, height: 400 }, //面板内容div的宽度和高度
      //headerTitle: "标题", //标题文本
      //content: "<p>一些文本内容</p>",
      callback: [
        function () {
          this.content.css("padding", "15px");

        },
        function () {
          this.headerTitle('zTree树')
          this.content.load('plugins/zTree.html');
        },
      ]
    });
  });
  //综合模块-数据管理
  $(document).on('click', '#dataManagement', function () {
    top.datapanel=$.jsPanel({
      position: { my: "center-top", at: "center-top", offsetY: 90 },//位置选项。my:jsPanel的相对于其他元素的位置；at；jsPanel将针对的元素点；offsetX：水平偏移;offsetY:上下偏移；
      theme: "primary", //颜色，这里使用了原色
      contentSize: { width: 650, height: 400 }, //面板内容div的宽度和高度
      //headerTitle: "标题", //标题文本
      //content: "<p>一些文本内容</p>",
      callback: [
        function () {
          this.content.css("padding", "15px");

        },
        function () {
          this.headerTitle('数据管理')
          this.content.load('IntegratedModules/index.html');
        },
      ]
    });
  });
  //说明
  $(document).on('click', '#instruction', function () {
    $.jsPanel({
      position: { my: "center-top", at: "center-top", offsetY: 50 },//位置选项。my:jsPanel的相对于其他元素的位置；at；jsPanel将针对的元素点；offsetX：水平偏移;offsetY:上下偏移；
      theme: "primary", //颜色，这里使用了原色
      contentSize: { width: 550, height: 550 }, //面板内容div的宽度和高度
      //headerTitle: "标题", //标题文本
      //content: "<p>一些文本内容</p>",
      callback: [
        function () {
          this.content.css("padding", "15px");

        },
        function () {
          this.headerTitle('说明')
          this.content.load('instruction/instruction.html');
        },
      ]
    });
  });
})