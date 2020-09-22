//初始化顶层命名空间
if (!this["Robin"]) { Robin = {}; }
//初始化Utils命名空间
if (!this["Robin.ToolBar"]) { Robin.ToolBar = {}; }

Robin.ToolBar.QueryResult = [];

//查询到的图层名称
Robin.ToolBar.LayerNames = [];
Robin.ToolBar.NavBar = null;
//打开查询窗口
Robin.ToolBar.OpenQueryWin = function () {
    //判断查询窗体是否已经存在
    var listPanel = Robin.Window.GetInfoPanelByID("pnlQueryResult");
    if (listPanel != null) {
        listPanel.contentReload();
        //判断窗体是否为收缩状态
        var Pl = document.getElementById("pnlQueryResult");
        if (Pl.style.overflow == "hidden") {
            listPanel.smallify();
        }
        return;
    }

    var title = "图层查询";
    var url = '../WaterUser/plugin/queryResult.html';
    Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%" id="frmQueryResult" frameborder="0"  scrolling="no"></iframe>',
        { id: 'pnlQueryResult', contentSize: { width: 1050, height: 550 }, theme: "#2b3d51" });
    //关闭按钮清除所有图层
    $(document).on("click", ".jsglyph-close", function () {
        //去掉工具框选功能
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
        if (Robin.Portal.customerToolBarClear) {
            Robin.Portal.customerToolBarClear();
        }
        Robin.Map.Map2DControl.infoWindow.hide();
        //清除图层
        Robin.Map.Map2DControl.graphics.clear();

        $.each(Robin.Map.Map2DControl.graphicsLayerIds, function (i, item) {
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item).clear();
        });

        Robin.Map.MapWindow.CloseAll();
    });

    //绑定infoWindow关闭事件清除高亮
    Robin.Map.Map2DControl.infoWindow.on('hide', function () {
        Robin.Map.Map2DControl.graphics.clear();
        //判断窗体是否为收缩状态
        var Pl = document.getElementById("pnlQueryResult");
        if (Pl.style.overflow == "hidden") {
            var listPanel = Robin.Window.GetInfoPanelByID("pnlQueryResult");
            listPanel.smallify();
        }
    });

};




function ToolBar_Start() {
    if (Robin.Setting.GlobalSetting.ToolBarType) {
        switch (Robin.Setting.GlobalSetting.ToolBarType) {
            case "simple":
                break;
            case "full":
                break;
            default: break;
        }
    }
    var navToolbar = new esri.toolbars.Navigation(Robin.Map.Map2DControl);
    Robin.ToolBar.NavBar = navToolbar;
    //查询
    $("#bar_Query").click(function () {
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
        Robin.ToolBar.QueryResult = [];
        Robin.ToolBar.isDraw = true;
        Robin.ToolBar.toolbar = new esri.toolbars.Draw(Robin.Map.Map2DControl);
        Robin.ToolBar.toolbar.activate(esri.toolbars.Draw.EXTENT);//esri.toolbars.Draw.EXTENT);
        Robin.ToolBar.toolbar.on("draw-end", function (evt) {
            Robin.ToolBar.isDraw = false;
            Robin.ToolBar.toolbar.deactivate();
            //框选查询结果
            Robin.ToolBar.QueryGeometry = evt.geometry;
            //查询此区域下的图层
            var count = 0;
            var layerNames = [];
            var identify, identifyParams;
            NProgress.start();
            var array = [];
            $.getJSON(top.Robin.Setting.GlobalSetting.RestAPIService + top.Robin.Setting.GlobalSetting.ArcGISMapServices + "?callback=?", function (data) {

                $.each(data.data, function (i, item) {
                    var list = {};
                    list.name = item.LAYERNAME;
                    list.aliasname = item.ALIASNAME;
                    list.url = item.URL;
                    list.item = [];
                    $.each(item.FiledModel, function (j, feature) {
                        var tem = {};
                        if (feature.SHOWHIDDEN == 1) {
                            tem.name = feature.FIELDNAME;
                            tem.aliasname = feature.ALIASNAME;
                            list.item.push(tem);
                        }
                    })
                    array.push(list);
                })
                var queryUrl = [];
                $.each(array, function (i, arr) {
                    var num = arr.url.lastIndexOf("/");
                    var url = arr.url.slice(0, num);
                    if (!queryUrl.Contains(url)) {
                        queryUrl.push(url);
                    }
                })
                for (var i = 0; i < queryUrl.length; i++) {
                    if (queryUrl[i] == "") {
                        count++;
                        return true;
                    }
                    console.log(Robin.ToolBar.QueryGeometry)
                    identify = new esri.tasks.IdentifyTask(queryUrl[i]);
                    identifyParams = new esri.tasks.IdentifyParameters();
                    identifyParams.geometry = Robin.ToolBar.QueryGeometry;
                    identifyParams.mapExtent = Robin.Map.Map2DControl.extent;
                    identifyParams.width = Robin.Map.Map2DControl.width;
                    identifyParams.height = Robin.Map.Map2DControl.height;
                    identifyParams.returnGeometry = true;
                    identifyParams.tolerance = 3;
                    identifyParams.spatialReference = new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid });
                    identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                    identify.execute(identifyParams, function (result) {
                        count++;
                        $.each(result, function (ii, vv) {
                            Robin.ToolBar.QueryResult.push({ "layerName": vv.layerName, "attributes": vv.feature.attributes, "geometry": vv.feature.geometry });
                            //已经存在
                            if (!layerNames.Contains(vv.layerName)) {
                                layerNames.push(vv.layerName);
                            }
                        });
                        Robin.ToolBar.LayerNames = layerNames;
                        if (count == queryUrl.length && Robin.ToolBar.QueryResult.length > 0) {
                            var pa = parent.Robin.Window.GetInfoPanelByID("pnlQueryResult");
                            if (pa != undefined) {//有pnlQueryResult 重新加载iframe
                                pa.normalize();
                                document.getElementById('frmQueryResult').contentWindow.location.reload(true);
                            } else {//没有pnlQueryResult 打开Panel                               
                                var data = []
                                $.each(Robin.ToolBar.LayerNames, function (i, v) {
                                    $.each(array, function (ii, vv) {
                                        if (v.replace("-", "") == vv.aliasname)
                                        //if (v == vv.aliasname)
                                            data[0] = v;
                                        return;
                                    });
                                });
                                if (data[0] != null) {
                                    Robin.ToolBar.OpenQueryWin();
                                } else {
                                    noty({ text: "查询完毕,该查询没有图层数据", type: "warning", layout: "center", timeout: 2000 });
                                }
                            }
                        }
                        /*关闭Loading*/
                        NProgress.done();
                    }, function (err) {
                        alert(err);
                        /*关闭Loading*/
                        NProgress.done();
                    })
                }
            })
        });
    });




    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
        alert(msg);
    };
    //清空
    $("#bar_Empty").click(function () {
        //去掉工具框选功能
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
        if (Robin.Portal.customerToolBarClear) {
            Robin.Portal.customerToolBarClear();
        }
        Robin.Map.Map2DControl.infoWindow.hide();
        //清除图层
        Robin.Map.Map2DControl.graphics.clear();

        $.each(Robin.Map.Map2DControl.graphicsLayerIds, function (i, item) {
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item).clear();
        });

        Robin.Map.MapWindow.CloseAll();
        var cs1 = $("#bar_WaterFactoryLoc", window.parent.document).find('span').find('i').attr('class');
        if (cs1 == "fa-tint fa-trash") {
            $("#bar_WaterFactoryLoc", window.parent.document).find('span').find('i').attr("class", "fa-tint fa");
        }
        var cs2 = $("#bar_PressureStationLoc", window.parent.document).find('span').find('i').attr('class');
        if (cs2 == "fa-plus-square fa-trash") {
            $("#bar_PressureStationLoc", window.parent.document).find('span').find('i').attr("class", "fa-plus-square fa");
        }
        var cs3 = $("#bar_WaterWellLoc", window.parent.document).find('span').find('i').attr('class');
        if (cs3 == "fa-database fa-trash") {
            $("#bar_WaterWellLoc", window.parent.document).find('span').find('i').attr("class", "fa-database fa");
        }
        var cs4 = $("#bar_PipeMonitorLoc", window.parent.document).find('span').find('i').attr('class');
        if (cs4 == "fa-instagram fa-trash") {
            $("#bar_PipeMonitorLoc", window.parent.document).find('span').find('i').attr("class", "fa-instagram fa");
        }
    });
    //全图
    $("#bar_map").click(function () {
        //去掉工具框选功能
        //if (Robin.ToolBar.toolbar != undefined) {
        //    Robin.ToolBar.toolbar.deactivate();
        //}
        //navToolbar.zoomToFullExtent();
        setExtent();
    });
    //漫游
    $("#bar_Roam").click(function () {
        //去掉工具框选功能
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
    });
    //图层控制
    $("#btn_LayerControl").click(function () {
        if ($("#tabs-LayerControl_tree").html() == "") {
            Robin.Map.MapService.AddResourceMaps();
        }
        $("#LayerControl_DIV").show();
    });

    //显示工具栏
    $("#toolBar_show").click(function () {
        $("#ToolBar_DIV").show();
    });
    ///-----------------------------------水厂相关STRAT-----------------------------
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
        var panel = $("#WaterList").css("display");
        if (panel != "block") {
            jsPanel.closeChildpanels("body");
            var result = parent.Robin.Portal.Page.YSH.query();
            var Title = "用水户列表";
            var url = 'system/YSH.html';
            $.jsPanel(
              {
                  headerTitle: Title + ":" + result.length + "户",
                  autoclose: false,
                  content: '<iframe src=" ' + url + ' " width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
                  paneltype: 'hint',
                  theme: '#2b3d51',
                  id: 'WaterList',
                  minimizeOthers: false,
                  contentSize: { width: 320, height: 450 },
                  position: { my: "left", at: "left", offsetX: 30, offsetY: 100 },
              });
        } else {
            noty({ text: "用水户列表已经被打开。", type: "warning", layout: "center", timeout: 1000 });
        }

    });
    //用水户标注
    $("#bar_WaterFactoryLoc").click(function () {
        var cs = $(this).find('span').find('i').attr('class');
        var map = Robin.Map.Map2DControl;
        //map.setZoom(2);
        if (cs == "fa-map-marker fa") {
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
                                $(".mapWindow_monitor").hide();
                            });
                            ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));


                        }, "html");
                        //全图显示
                        setExtent();
                    }
                }
            });
            parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                parent.Robin.Portal.Page.YSH.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
            });
        }
        else {
            $("#bar_WaterFactoryLoc").attr("title", "用水户标注");
            parent.Robin.Portal.Page.YSH.clearlayer();
            //全图显示
            setExtent();
        }
        $(this).find('span').find('i').toggleClass('fa fa-trash');



    });
    $("#bar_alert").click(function () {
      
      
        if ($("#alertWindow").css("display") == "block") {
            noty({ text: "报警信息窗体已经被打开。", type: "warning", layout: "center", timeout: 1000 });
        } else {
            $("#alertWindow").show();
        }        
    });


    //用水户片区显示
    $("#bar_yyspq").click(function () {    
        var map = top.Robin.Map.Map2DControl;
        var featureLayer = new esri.layers.FeatureLayer("http://192.168.70.6/ArcGIS/rest/services/other/DYSHPQ/MapServer/0");
        featureLayer.id = "graphicsLayerYYSPQ";
       
        //判断是否已经加载
        var title = $("#bar_yyspq").attr("title");
        if (title == "片区显示") {
            setExtent();
            map.addLayer(featureLayer);
            $("#bar_yyspq").attr("title", "片区隐藏");
            $("#bar_yyspq").attr("class", "btn btn-success");
            $("#legend").css("display", "block");
        } else {
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, featureLayer.id);
            map.removeLayer(graphicLayer);
            $("#bar_yyspq").attr("title", "片区显示");
            $("#bar_yyspq").attr("class", "btn btn-info");
            $("#legend").css("display", "none");
        }        

    })

    ///------------------------------------水厂相关END----------------------------
  
}


//全图方法
function setExtent() {
    var initExtent,
         mapSetting = Robin.Setting.MapSetting,
         config = {
             width: "100%",
             logo: false,
             infoWindow: Robin.Map.Map2DPopup,
             zoom: 2,
             slider: false,
             //extent: initExtent,
             fadeOnZoom: true
             //force3DTransforms: true
         };
    if (mapSetting && mapSetting.initExtent
        && mapSetting.initExtent.xmin
        && mapSetting.initExtent.ymin
        && mapSetting.initExtent.xmax
        && mapSetting.initExtent.ymax) {

        initExtent = new esri.geometry.Extent(parseFloat(mapSetting.initExtent.xmin), parseFloat(mapSetting.initExtent.ymin), parseFloat(mapSetting.initExtent.xmax), parseFloat(mapSetting.initExtent.ymax), new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
    }

    Robin.Map.Map2DControl.setExtent(initExtent);
}