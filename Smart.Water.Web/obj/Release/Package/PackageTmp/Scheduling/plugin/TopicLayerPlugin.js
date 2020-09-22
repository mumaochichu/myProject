

function TopicLayerPlugin_Start() {

    //查询
    $(":checkbox").click(function () {


        var flag = $(this).attr("flag");
        switch (flag) {
            case "sc":
                Robin.Portal.Page.QueryTask.GX(function (data) {
                    if (data != null) {
                        var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "scLayer");
                        var sls = Robin.Map.Symbol.fillSymbol();


                        $.each(data.features, function (i, v) {

                            var graphic = new esri.Graphic(v.geometry, sls);

                            graphicLayer.add(graphic);
                        });
                    }
                });
                break;
            default: break;

        }
    });

    $("#bar_WaterFactory").click(function () {
        jsPanel.closeChildpanels("body");
        var Title = "水厂管理";
        var url = 'system/SC.html';
        $.jsPanel(
          {
              headerTitle: Title,
              autoclose: false,
              content: '<iframe src=" ' + url + ' " width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
              paneltype: 'hint',
              theme: '#2b3d51',
              id: 'WaterList',
              minimizeOthers: false,
              contentSize: { width: 320, height: 450 },
              position: { my: "left", at: "left", offsetX: 30, offsetY: 100 },
          });
    });
    $("#bar_WaterWell").click(function () {
        jsPanel.closeChildpanels("body");
        var Title = "水源井管理";
        var url = 'system/SYJ.html';
        $.jsPanel(
           {
               headerTitle: Title,
               autoclose: false,
               content: '<iframe src=" ' + url + ' " width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
               paneltype: 'hint',
               theme: '#2b3d51',
               id: 'SYCList',
               minimizeOthers: false,
               contentSize: { width: 320, height: 450 },
               position: { my: "left", at: "left", offsetX: 30, offsetY: 100 },
           });
    });


    $("#bar_PressureStation").click(function () {
        jsPanel.closeChildpanels("body");
        var Title = "加压站管理";
        var url = 'system/JYZ.html';
        $.jsPanel(
           {
               headerTitle: Title,
               autoclose: false,
               content: '<iframe src=" ' + url + ' " width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
               paneltype: 'hint',
               theme: '#2b3d51',
               id: 'JYZList',
               minimizeOthers: false,
               contentSize: { width: 320, height: 450 },
               position: { my: "left", at: "left", offsetX: 30, offsetY: 100 },
           });
    });

    $("#bar_PipeMonitor").click(function () {
        jsPanel.closeChildpanels("body");
        var Title = "管网监测点管理";
        var url = 'system/WGJCD.html';
        $.jsPanel(
           {
               headerTitle: Title,
               autoclose: false,
               content: '<iframe src=" ' + url + ' " width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
               paneltype: 'hint',
               theme: '#2b3d51',
               id: 'WGJCDList',
               minimizeOthers: false,
               contentSize: { width: 320, height: 450 },
               position: { my: "left", at: "left", offsetX: 30, offsetY: 100 },
           });
    });
    ///监测点标注
    $("#bar_PipeMonitorLoc").click(function () {
        var cs = $(this).find('span').find('i').attr('class');
        var map = Robin.Map.Map2DControl;
        map.setZoom(4);
        if (cs == "fa-instagram fa") {
            $("#bar_PipeMonitorLoc").attr("title", "监测点清除");
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "pipeLayer"
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID.substr(6, 6) == "030304") {
                    var pd = Robin.Map.MapWindow.IsOpenByID(v.BMID);
                    if (pd == false) {
                        $.get("templates/PipeInfo.htm", null, function (html, textStatus) {
                            point = Robin.Map.GetPoint(v.BMX, v.BMY);
                            var picurl = "../images/Scheduling/plugin/jcdicon.png";
                            var symbolConfig = {
                                font:
                                    { 'size': "13", 'style': 'normal' },
                                color: [0, 89, 149],
                                pic: {
                                    src: picurl,
                                    width: 30,
                                    height: 30
                                },
                                offset: {
                                    x: 0,
                                    y: -30
                                }
                            };
                            Robin.Map.ShowGraphic(graphicsLayer, v.BMMC, v.BMX, v.BMY, picurl, v, symbolConfig);
                            Robin.Map.MapWindow.Show(v.BMID, Robin.Map.Map2DControl, point, html, isWarn);

                            var tempModel = new Robin.Portal.RuntimeModel();
                            tempModel.StationName(v.BMMC);
                            $.each(tmodel.monitorData(), function (i, vv) {
                                if (vv.StationKey() == v.BMID) {
                                    tempModel.MonitorDatas.push(vv);
                                }
                            });
                            ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));                           
                        }, "html");
                    }
                }
            });
            parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                parent.Robin.Portal.Page.WGJCD.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
            });
        } else {;
            $("#bar_PipeMonitorLoc").attr("title", "监测点标注");
            parent.Robin.Portal.Page.WGJCD.clearlayer();
        }
        $(this).find('span').find('i').toggleClass('fa fa-trash');
    });

    //水源井标注
    $("#bar_WaterWellLoc").click(function () {
        var cs = $(this).find('span').find('i').attr('class');
        var map = Robin.Map.Map2DControl;
        map.setZoom(4);
        if (cs == "fa-database fa") {
            $("#bar_WaterWellLoc").attr("title", "水源井清除");
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "syjLayer"
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID.substr(6, 6) == "030199") {
                    var pd = Robin.Map.MapWindow.IsOpenByID(v.BMID);
                    if (pd == false) {
                        $.get("templates/syjInfo.htm", null, function (html, textStatus) {
                            point = Robin.Map.GetPoint(v.BMX, v.BMY);
                            var picurl = "../images/Scheduling/plugin/syjicon.png";
                            var symbolConfig = {
                                font:
                                    { 'size': "13", 'style': 'normal' },
                                color: [0, 89, 149],
                                pic: {
                                    src: picurl,
                                    width: 30,
                                    height: 30
                                },
                                offset: {
                                    x: 0,
                                    y: -30
                                }
                            };
                            Robin.Map.ShowGraphic(graphicsLayer, v.BMMC, v.BMX, v.BMY, picurl, v, symbolConfig);
                            Robin.Map.MapWindow.Show(v.BMID, Robin.Map.Map2DControl, point, html, isWarn);
                            var tempModel = new Robin.Portal.RuntimeModel();
                            tempModel.StationName(v.BMMC);
                            $.each(tmodel.monitorData(), function (i, vv) {
                                if (vv.StationKey() == v.BMID) {
                                    tempModel.MonitorDatas.push(vv);
                                }
                            });
                            ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));                        
                        }, "html");
                    }
                }
            });
            parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                parent.Robin.Portal.Page.SYJ.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC, evt.attributes.WebUrl);
            });
        }
        else {
            $("#bar_WaterWellLoc").attr("title", "水源井标注");
            parent.Robin.Portal.Page.SYJ.clearlayer();
        }
        $(this).find('span').find('i').toggleClass('fa fa-trash');
    });

    //加压站标注
    $("#bar_PressureStationLoc").click(function () {
        var cs = $(this).find('span').find('i').attr('class');
        //此处设置地图显示级别
        var map = Robin.Map.Map2DControl;
        map.setZoom(4);
        if (cs == "fa-plus-square fa") {
            $("#bar_PressureStationLoc").attr("title", "加压站清除");
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "jyzLayer"
            });          
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID.substr(6, 6) == "030202") {
                    var pd = Robin.Map.MapWindow.IsOpenByID(v.BMID);
                    if (pd == false) {
                        $.get("templates/jyzInfo.htm", null, function (html, textStatus) {
                            point = Robin.Map.GetPoint(v.BMX, v.BMY);
                            var picurl = "../images/Scheduling/plugin/jyzicon.png";
                            var symbolConfig = {
                                font:
                                    { 'size': "13", 'style': 'normal' },
                                color: [0, 89, 149],
                                pic: {
                                    src: picurl,
                                    width: 30,
                                    height: 30
                                },
                                offset: {
                                    x: 0,
                                    y: -30
                                }
                            };
                            Robin.Map.ShowGraphic(graphicsLayer, v.BMMC, v.BMX, v.BMY, picurl, v, symbolConfig);
                            Robin.Map.MapWindow.Show(v.BMID, Robin.Map.Map2DControl, point, html, isWarn);
                            var tempModel = new Robin.Portal.RuntimeModel();
                            tempModel.StationName(v.BMMC);
                            $.each(tmodel.monitorData(), function (i, vv) {
                                if (vv.StationKey() == v.BMID) {
                                    tempModel.MonitorDatas.push(vv);
                                }
                            });
                            ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));

                          
                        }, "html");
                    }
                }
            });
            parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                parent.Robin.Portal.Page.JYZ.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC, evt.attributes.WebUrl);
            });
        }
        else {
            $("#bar_PressureStationLoc").attr("title", "加压站标注");
            parent.Robin.Portal.Page.JYZ.clearlayer();
        }
        $(this).find('span').find('i').toggleClass('fa fa-trash');
    });

    //水厂标注
    $("#bar_WaterFactoryLoc").click(function () {
        var cs = $(this).find('span').find('i').attr('class');
        var map = Robin.Map.Map2DControl;
        map.setZoom(4);
        if (cs == "fa-tint fa") {
            $("#bar_WaterFactoryLoc").attr("title", "水厂清除");
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "scLayer"
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID.substr(6, 6) == "030201") {
                    var pd = Robin.Map.MapWindow.IsOpenByID(v.BMID);
                    if (pd == false) {
                        $.get("templates/scInfo.htm", null, function (html, textStatus) {
                            point = Robin.Map.GetPoint(v.BMX, v.BMY);
                            var picurl = "../images/Scheduling/plugin/scicon.png";
                            var symbolConfig = {
                                font:
                                    { 'size': "13", 'style': 'normal' },
                                color: [0, 89, 149],
                                pic: {
                                    src: picurl,
                                    width: 30,
                                    height: 30
                                },
                                offset: {
                                    x: 0,
                                    y: -30
                                }
                            };                         
                            Robin.Map.ShowGraphic(graphicsLayer, v.BMMC, v.BMX, v.BMY, picurl, v, symbolConfig);
                            Robin.Map.MapWindow.Show(v.BMID, Robin.Map.Map2DControl, point, html, isWarn);
                            var tempModel = new Robin.Portal.RuntimeModel();
                            tempModel.StationName(v.BMMC);
                            $.each(tmodel.monitorData(), function (i, vv) {
                                if (vv.StationKey() == v.BMID) {
                                    tempModel.MonitorDatas.push(vv);
                                }
                            });
                            ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));

                           
                        }, "html");
                    }
                }
            });
            parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                parent.Robin.Portal.Page.SC.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC, evt.attributes.WebUrl);
            });
        }
        else {
            $("#bar_WaterFactoryLoc").attr("title", "水厂标注");
            parent.Robin.Portal.Page.SC.clearlayer();
        }
        $(this).find('span').find('i').toggleClass('fa fa-trash');
    });
    
    //显示工具栏
    $("#toolBar_show").click(function () {
        $("#ToolBar_DIV").show();
        // $("#toolBar_show").hide();
    });
}


