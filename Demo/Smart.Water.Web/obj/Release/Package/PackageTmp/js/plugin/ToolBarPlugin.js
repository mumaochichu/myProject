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
    var url = '../js/plugin/queryResult.html';
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




function ToolBarPlugin_Start() {
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
        //先判断绘图工具是否已经清除
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
        Robin.ToolBar.toolbar = new esri.toolbars.Draw(Robin.Map.Map2DControl);
        Robin.ToolBar.toolbar.activate(esri.toolbars.Draw.EXTENT);//esri.toolbars.Draw.EXTENT);
        Robin.ToolBar.toolbar.on("draw-end", function (evt) {
            Robin.ToolBar.toolbar.deactivate();

            //框选查询结果
            Robin.ToolBar.QueryGeometry = evt.geometry;

            //查询此区域下的图层
            var count = 0;
            var layerNames = [];
            var identify, identifyParams;

            NProgress.start();
            $.each(Robin.Setting.ArcGISMapServices, function (i, v) {
                if (v.url == '') {
                    count++;
                    return true;
                }
                identify = new esri.tasks.IdentifyTask(v.url);
                identifyParams = new esri.tasks.IdentifyParameters();
                identifyParams.geometry = Robin.ToolBar.QueryGeometry;
                identifyParams.mapExtent = Robin.Map.Map2DControl.extent;
                identifyParams.width = Robin.Map.Map2DControl.width;
                identifyParams.height = Robin.Map.Map2DControl.height;
                identifyParams.returnGeometry = true;
                //   identifyParams.layerIds = [1, 2];
                identifyParams.tolerance = 3;
                identifyParams.spatialReference = new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid });
                identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                Robin.ToolBar.QueryResult = [];
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
                    if (count == Robin.Setting.ArcGISMapServices.length) {
                        var pa = parent.Robin.Window.GetInfoPanelByID("pnlQueryResult");
                        if (pa != undefined) {//有pnlQueryResult 重新加载
                            pa.normalize();
                            document.getElementById('frmQueryResult').contentWindow.location.reload(true);
                        } else {//没有pnlQueryResult 打开Panel
                            var list = [];
                            $.each(Robin.Setting.ArcGISMapServices[0].item, function (i, v) {
                                list.push(v);
                            });
                            var data=[]
                            $.each(Robin.ToolBar.LayerNames, function (i, v) {
                                $.each(list, function (ii, vv) {
                                    if (v == vv.name)
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
                });
            });
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
    ////关闭
    //$("#btn_toolBarClose").click(function () {
    //    $("#ToolBar_DIV").hide();
    //    // $("#toolBar_show").show();
    //});

    //显示工具栏
    $("#toolBar_show").click(function () {
        $("#ToolBar_DIV").show();
        // $("#toolBar_show").hide();
    });
}


