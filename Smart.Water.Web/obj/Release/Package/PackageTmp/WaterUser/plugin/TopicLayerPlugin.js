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
        var Title = "用水户管理";
        var url = 'system/YSH.html';
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
    //水厂标注
    $("#bar_WaterFactoryLoc").click(function () {
        var cs = $(this).find('span').find('i').attr('class');
        var map = Robin.Map.Map2DControl;
        map.setZoom(4);
        if (cs == "fa-tint fa") {
            $("#bar_WaterFactoryLoc").attr("title", "用水户清除");
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "yshLayer"
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID.substr(6, 6) == "030401") {
                    var pd = Robin.Map.MapWindow.IsOpenByID(v.BMID);
                    if (pd == false) {
                        $.get("templates/yshInfo.htm", null, function (html, textStatus) {
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
            //parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {               
            //    parent.Robin.Portal.Page.YSH.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC, evt.attributes.WebUrl);
            //});
        }
        else {
            $("#bar_WaterFactoryLoc").attr("title", "水厂标注");
            parent.Robin.Portal.Page.YSH.clearlayer();
        }
        $(this).find('span').find('i').toggleClass('fa fa-trash');
    });
    $("#bar_alert").click(function () {
        $("#alertWindow").show();
    });

}


