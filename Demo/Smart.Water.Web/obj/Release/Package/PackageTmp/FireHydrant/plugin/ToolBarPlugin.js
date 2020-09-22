/**
 * ToolBarPlugin插件
 * 主要实现系统工具条插件
 * @author Codingman.
 * @description        
 * @version 1.0
 * @license Copyright (c) 2007-2014 robin studio
 */

//初始化顶层命名空间
if (!this["Robin"]) { Robin = {}; }
//初始化Utils命名空间
if (!this["Robin.ToolBar"]) { Robin.ToolBar = {}; }


Robin.ToolBar.QueryResult = [

];

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
    var url = "../FireHydrant/plugin/queryResult.html";
    Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%" id="frmQueryResult" frameborder="0" scrolling="no" ></iframe>',
        { id: 'pnlQueryResult', contentSize: { width: 900, height: 490 }, theme: "#EF681E", headerControls: { minimize: "remove", maximize: "remove" }, });

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
            $.ajaxSetup({
                error: function (x, e) {
                    noty({ text: "暂无可查询图层", type: "warning", layout: "center", timeout: 2000 });
                    /*关闭Loading*/
                    NProgress.done();
                    return false;
                }
            });
            debugger;
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
                                var data = [];
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
            if (item == "ClusterGraphicsLayer" || item == "xfsAllShowLayer") {
                Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item).hide();
                //为了控制主页眼睛关闭，取消选中状态等
                clusterLayervisible = false;
                if (eyebool == false) {
                    fireHydrantMonitorClick();
                }
                eyebool = true;
                $("#eye").css({ "color": '#efecec' });
                $("#eye").attr("title", "全部标注");
                $("#fireHydrantMark").css({ "background-color": 'transparent' });
            }
            else {
                Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item).clear();
            }
        });
        top.Robin.Map.MapWindow.CloseAll();
    });
    //全图
    $("#bar_map").click(function () {
        Hydrant.Map.MapTool.setExtent();
    });
    //漫游
    $("#bar_Roam").click(function () {
        //去掉工具框选功能
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
        navToolbar.activate(esri.toolbars.Navigation.PAN);
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
        $("#toolBar_show").hide();
    });
}