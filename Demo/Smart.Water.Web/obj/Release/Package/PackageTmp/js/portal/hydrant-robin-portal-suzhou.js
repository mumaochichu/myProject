/**
 * 默认portal门户功能js.
 * @author Created by RobinChang on 2015-03-05.
 * @version 1.0
 * @license Copyright (c) 2007-2014 robin studio
 */

/*初始化Page命名空间*/
if (!this["Robin.Portal"]) { Robin.Portal = {}; }
if (!this["Robin.Portal.Page"]) { Robin.Portal.Page = {}; }

//消火栓监测相关
Robin.Portal.Page.XFS = {
    data:null,
    //查询消火栓 
    query: function () {
        var result = [];
        //所有监测点信息
        $.each(Robin.Data.monitor, function (i, v) {
            if (v.BMID.substring(6, 12) == Robin.Setting.GlobalSetting.HyrantCode) {
                result.push(v);
            }
        });
        return result;
    },
    //点击显示详细信息
    show: function (id, x, y, name) {
        if (parent.Robin.Window.GetInfoPanelByID("scClickInfo") != null) {
            parent.Robin.Window.GetInfoPanelByID("scClickInfo").close();//大窗口关闭
        }
        if (!id) { return; }
        Robin.Portal.Page.XFS.data = null;
        var title = name + "监测点";
        name = encodeURI(encodeURI(name));
        var url = 'panelInfo/Factory.html?StationKey=' + id + '&Name=' + name;
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%"frameborder="0" z-index="9999" scrolling="no"></iframe>',
        {
            id: 'scClickInfo',
            theme: '#FA6525',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            headerControls: {
                maximize: 'remove',
                minimize: 'remove',
            }
        }); Robin.Map.addLayer
    },
    locate: function (stationKey) {
        var pdall = true;
        var pd = Robin.Map.MapWindow.IsOpenByID(stationKey);
        if (pd == false) {
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "xfsLayer" + stationKey
            },100);
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };

            Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {             
                Robin.Map.MapWindow.CloseByID(FactoryWindowID);
                Robin.Portal.Page.XFS.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
            });

            
            var picurl = "../images/hydrant/index/logonew.png";
            var symbolConfig = {
                font:
                    { 'size': "12", 'style': 'normal' },              
                color: 'black',
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
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID == stationKey) {
                    $.get("../FireHydrant/templates/xfsInfo.html", null, function (html, textStatus) {
                        point = Robin.Map.GetPoint(v.BMX, v.BMY);
                        Robin.Map.ShowGraphic(graphicsLayer, v.BMMC, v.BMX, v.BMY, picurl, v, symbolConfig);
                        Robin.Map.MapWindow.Show(v.BMID, Robin.Map.Map2DControl, point, html, isWarn);
                        var tempModel = new Robin.Portal.RuntimeModel();
                        tempModel.StationName(v.BMMC);
                        tempModel.StationKey(v.BMID);
                        $.each(tmodel.monitorData(), function (i, vv) {
                            if (vv.StationKey() == v.BMID) {
                                tempModel.MonitorDatas.push(vv);
                            }
                        });
                        ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));
                        $.each(Robin.Portal.Page.XFS.query(), function (i, item) {
                            var ht = Robin.Map.MapWindow.IsOpenByID(item.BMID);
                            if (ht == false) {
                                pdall = false;
                            }
                        });
                     
                    }, "html");
                }
            });
        }
        $.each(Robin.Data.monitor, function (j, v) {
            if (stationKey == v.BMID) {
                var p = Robin.Map.GetPoint(v.BMX, v.BMY);
                //Robin.Map.Fly2Geometry(top.Robin.Map.Map2DControl, p);
                Robin.Map.Map2DControl.centerAndZoom(p, 5);
                return false;
            }
        });

    },
    clearlayer: function () {
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, "xfsLayer");
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == Robin.Setting.GlobalSetting.HyrantCode) {
                var id = "xfsLayer" + v.BMID;
                Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);
            }
        });
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == Robin.Setting.GlobalSetting.HyrantCode) {
                Robin.Map.MapWindow.CloseByID(v.BMID);
            }
        });
    },
}

//jsPanel关闭事件--监测点列表关闭
$("#btnHydrantInfoClose").click(function () {
    $("#HydrantList").css("display", "none");
    $("#Monitoring_expansion").show();
})


//监测项小窗口关闭事件
$(document).on('click', ".closeMapWindow", function () {
    var bmid = $(this).attr("id");
    Robin.Map.MapWindow.CloseByID(bmid);
    if (Robin.Window.GetInfoPanelByID("scClickInfo")!=null) {
        Robin.Window.GetInfoPanelByID("scClickInfo").close();//大窗口关闭
    }
    //同时关闭大窗口和定位图标
    //判断是否是点聚合图层不是则清空--WHY修改
    $.each(Robin.Map.Map2DControl.graphicsLayerIds, function (i, item) {
        //聚合图层和聚合的标注图层不要清除--WHY
        if (item != "xfsAllShowLayer" && item != "clusters") {
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item);
            for (var ii = 0; ii < graphicLayer.graphics.length; ii++) {
                if (graphicLayer.graphics[ii].attributes == null) {//存在attributes==null的情况，会阻塞进程
                    continue;
                }
                else {
                    if (graphicLayer.graphics[ii].attributes.BMID == bmid) {
                        graphicLayer.remove(graphicLayer.graphics[ii]);
                        ii--;
                        //return;//不能return,因为有两个，一个是标注，一个是图标
                    }   
                }
            }
        }
    });
})


//windowInfoCluster小窗口关闭事件
$(document).on('click', ".WindowInfoClusterClose", function () {
    var bmid = $(this).attr("id");
    Robin.Map.MapWindow.CloseByID(bmid);
})

/*系统数据*/
Robin.Portal.SystemData = {
    DiscardList: [],
    ConstructionList: [],
    NormalList: [],
    AllList: [] 
};
/**
 * @constructor 名称：customerToolBarClear
 * @description 作用：自定义工具栏的清除方法
 * @author 作者
 */
Robin.Portal.customerToolBarClear = function () {

    //清除各个系统的图层
    Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-normal");
    Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-construction");
    Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-discard");
    $("#discard:checkbox").prop("checked", false);
    $("#construction:checkbox").prop("checked", false);
    $("#normal:checkbox").prop("checked", false);

    $("#w_eye,#localShow").removeClass('selected');

};

/**
 * 系统页面初始化
 *
 */
Robin.Portal.Initial = function (completed) {
    //全局变量初始化
    $.ajax({
        cache: false,
        url: "MaintenanceReminder/Handler.ashx?Action=LabelList",
        dataType: "json",
        type: "get",
        async: false,
        success: function (data) {
            var zjCount = 0, zcCount = 0, zfCount = 0;
            for (var j = 0; j < data.length; j++) {
                Robin.Portal.SystemData.AllList.push(data[j]);
                if (data[j].STATUS == "正常") {
                    Robin.Portal.SystemData.NormalList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'><a href='#' title=" + data[j].POINTNO + "><span class='list-point'>" + data[j].POINTNO + "</span><span class='list-status list-status-ok'>正常</span></a></li>"
                        
                        zcCount++;
                    } else {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'><a href='#' title=" + data[j].JCDNAME + "><span class='list-point'>" + data[j].JCDNAME + "</span><span class='list-status list-status-ok'>正常</span></a></li>"
                       
                        zcCount++;
                    }
                    $("#dataList").append(html);
                }
                if (data[j].STATUS == "在建") {
                    Robin.Portal.SystemData.ConstructionList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'><a href='#' title=" + data[j].POINTNO + "><span class='list-point'>" + data[j].POINTNO + "</span><span class='list-status list-status-building'>在建</span></a></li>"
                      
                        zjCount++;
                    } else {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'><a href='#' title=" + data[j].JCDNAME + "><span class='list-point'>" + data[j].JCDNAME + "</span><span class='list-status list-status-building'>在建</span></a></li>"
                        
                        zjCount++;
                    }
                    $("#dataList").append(html);
                }
                if (data[j].STATUS == "作废") {
                    Robin.Portal.SystemData.DiscardList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'><a href='#' title=" + data[j].POINTNO + "><span class='list-point'>" + data[j].POINTNO + "</span><span class='list-status list-status-cancel'>作废</span></a></li>"
                        
                        zfCount++;
                    } else {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'><a href='#' title=" + data[j].JCDNAME + "><span class='list-point'>" + data[j].JCDNAME + "</span><span class='list-status list-status-cancel'>作废</span></a></li>"
                        
                        zfCount++;
                    }
                    $("#dataList").append(html);
                }
            }
            Robin.Portal.MapTool.PointTyleNo.ZJNO = zjCount;
            Robin.Portal.MapTool.PointTyleNo.ZCNO = zcCount;
            Robin.Portal.MapTool.PointTyleNo.ZFNO = zfCount;
            if (completed != null && $.isFunction(completed)) {
                completed();
            }
        },
        error: function (result, status) {
            // alert(status);
        }
    });
}



/*实现地图工具*/
Robin.Portal.MapTool = {
    //定位
    data: null,
    flyMap: function (map, geometry) {
        var extent = geometry.getExtent();
        if (geometry.type == "point") {
            extent = new esri.geometry.Extent(geometry.x - 0.0000001, geometry.y - 0.0000001, geometry.x - 0 + 0.0000001, geometry.y - 0 + 0.0000001, map.spatialReference);
            extent = extent.expand(1.5);
        }
        if (extent != null) {
            var point = new esri.geometry.Point(extent.xmin + (extent.xmax - extent.xmin) / 2, extent.ymin + (extent.ymax - extent.ymin) / 2, map.spatialReference);
            var newExtent = new esri.geometry.Extent(point.x, point.y, point.x, point.y, point.spatialReference);
            //如果当前视图包含要缩放视图
            if (Robin.Map.Extent1ContainExtent2(map.extent, extent)) {
                // extent = extent.expand(2);
                map.setExtent(extent);
            } else {
                var firstEx = Robin.Map.Union2Extent(newExtent, map.extent);
                map.setExtent(firstEx, true);
                setTimeout(function () {
                    map.centerAt(point)
                }, 700);
                setTimeout(function () {
                    extent = extent.expand(1.5);
                    map.setExtent(extent);
                }, 1400);
            }
        }

    },
    //设置变量，用于计数
    PointTyleNo: {
        ZJNO: '',
        ZCNO: '',
        ZFNO: ''
    },
    MaintenanceCompanyAndNum: [],
}
/*弹窗*/
Robin.Portal.ShowMapWindow = function (windowInfo, layerName, templateUrl) {
    var pt = new esri.geometry.Point(windowInfo.POINTX, windowInfo.POINTY, Robin.Map.Map2DControl.spatialReference);
    var newhtml = "";
    $.ajax({
        async: false,
        url: Robin.Host.DirectPath() + "FireHydrant/DataDisplay/windowInfo.html",
        success: function (result) {
            newhtml = result;
        },
        error: function (error) {
            // alert(error);
        }
    });
    Robin.Map.MapWindow.Show(windowInfo.CODE, Robin.Map.Map2DControl, pt, newhtml, false);
};

/*弹窗--聚合页面单击专用*/
Robin.Portal.ShowMapWindowCluster = function (windowInfo, layerName, templateUrl) {
    var pt = new esri.geometry.Point(windowInfo.POINTX, windowInfo.POINTY, Robin.Map.Map2DControl.spatialReference);
    var newhtml = "";
    $.ajax({
        async: false,
        url: Robin.Host.DirectPath() + "FireHydrant/DataDisplay/windowInfoCluster.html",
        success: function (result) {
            newhtml = result;
        },
        error: function (error) {
            // alert(error);
        }
    });
    Robin.Map.MapWindow.Show(windowInfo.CODE, Robin.Map.Map2DControl, pt, newhtml, false);
    //绑定用于关闭windowInfoCluster
    var tempModel = new Robin.Portal.RuntimeModel();
    tempModel.StationKey(windowInfo.CODE);
    ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + windowInfo.CODE));
    windowInfoClusterID = windowInfo.CODE;
};

/**
 * @constructor 名称：addModule
 * @description 作用：加载模块
 * @param name  模块名称
 * @param containerid 容器id
 * @param css  依赖的css
 * @param callback  回调函数
 * @return {Array} 处理后的数组
 * @author 作者 
 */
Robin.Portal.addModule = function (name, containerid, css, callback, flag) {

    var path = '';

    if (name && (typeof name === 'object')) {

        flag = name.flag;
        callback = name.callback;
        css = name.css;
        containerid = name.containerid;
        path = name.path;
        name = name.name;
    }

    if (css != undefined && css != '') {
        if (css.indexOf(',') > -1) {
            $.each(css.indexOf(','), function (i, v) {
                Robin.Application.LoadCSS(v);
            });
        } else {
            Robin.Application.LoadCSS(css);
        }
    }
    if (callback == undefined) {
        callback = function () { };
    }
    Robin.Application.LoadModule(new Robin.Application.Module(name, name + ".htm",
       callback,
       $("#" + containerid), flag || true, path));
};

Robin.CloseOneInfoPanel = function (a) {
    $.each(Robin.Window.instances,
    function (c, d) {
        if (d && d.id == a) {
            var b = d.obj;
            b.close();
            return
        }
    })
};

Robin.Portal.RuntimeModel = function () {
    var self = this;
    self.StationName = ko.observable();
    self.StationKey = ko.observable();
    self.MonitorDatas = ko.observableArray([]);
};


/**
 * @constructor 名称：Route
 * @description 作用：路径规划及网络分析
 * @author 张健 
 * @date 2018/2/8
 */
Robin.Portal.Route = {
    routePlan: function (x1, y1, x2, y2, callBack) {
        require([
                   "esri/symbols/SimpleLineSymbol", "esri/Color",
                   "esri/tasks/RouteTask",
                    "esri/tasks/FeatureSet",
                   "esri/tasks/RouteParameters"
        ], function () {
            var routeServiceUrl = Robin.Setting.MapAnalyse.route.url;
            var routeGraphicLayer = Robin.Map.GetGraphicLayer(top.Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.route.routeLayerName);
            if (routeGraphicLayer != null) {
                routeGraphicLayer.clear();
            }
            var map = top.Robin.Map.Map2DControl;
            var wkid = Robin.Setting.GlobalSetting.wkid;
            //起点、终点
            var ptStart = new esri.geometry.Point(parseFloat(x1), parseFloat(y1), new esri.SpatialReference({ wkid: wkid }));
            var ptEnd = new esri.geometry.Point(parseFloat(x2), parseFloat(y2), new esri.SpatialReference({ wkid: wkid }));
            var startPtGra = new esri.Graphic(ptStart);
            var endPtGra = new esri.Graphic(ptEnd);

            //设置路径样式
            var routeSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([82, 152, 255, 1]), 5);
            //起点、终点尾部线
            var routeSymbolDef = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([77, 220, 38, 1]), 5);

            var routeTask = new esri.tasks.RouteTask(routeServiceUrl);
            var routeParams = new esri.tasks.RouteParameters();
            //设置参数
            routeParams.outSpatialReference = { wkid: wkid };
            routeParams.returnRoutes = true;
            routeParams.returnDirections = true;
            routeParams.directionsLengthUnits = esri.Units.METERS;
            routeParams.stops = new esri.tasks.FeatureSet();
            routeParams.stops.features.push(startPtGra);
            routeParams.stops.features.push(endPtGra);
            if (routeParams.stops.features.length == 0) {
                noty({ text: "路径规划输入参数不全，无法分析", type: "warning", layout: "topCenter", timeout: 2000 });
                return;
            }

            routeTask.solve(routeParams, function (solveResult) {
                if (callBack) {
                    callBack(solveResult);
                }

                var routeResults = solveResult.routeResults;
                var res = routeResults.length;
                if (res > 0) {
                    for (var i = 0; i < res; i++) {
                        var graphicroute = routeResults[i];
                        var graphic = graphicroute.route;
                        graphic.setSymbol(routeSymbol);
                        routeGraphicLayer.add(graphic);

                        //连接路线起点、终点与对应定位起点、终点
                        var paths = graphic.geometry.paths[0];
                        var routeStr = paths[0];
                        var routeEnd = paths[paths.length - 1];

                        var routeStrline = new esri.geometry.Polyline(new esri.SpatialReference({ wkid: wkid }));
                        routeStrline.addPath([[x1, y1], routeStr]);
                        var routeEndline = new esri.geometry.Polyline(new esri.SpatialReference({ wkid: wkid }));
                        routeEndline.addPath([[x2, y2], routeEnd]);
                        var strlinegraphic = new esri.Graphic(routeStrline, routeSymbolDef);
                        var endlinegraphic = new esri.Graphic(routeEndline, routeSymbolDef);

                        routeGraphicLayer.add(strlinegraphic);
                        routeGraphicLayer.add(endlinegraphic);
                    }
                    noty({ text: "路径规划已完成,大约" + routeResults[0].route.attributes.Shape_Length.toFixed(0) + "米！", type: "success", layout: "topCenter", timeout: 2500 });
                }
                else {
                    noty({ text: "没有找到合适的路线", type: "warning", layout: "topCenter", timeout: 2000 });
                }
            }, function (error) {
                noty({ text: "没有找到合适的路线", type: "warning", layout: "topCenter", timeout: 2000 });
            });
        });
    },
    //根据起点和终点进行缩放
    ZoomToTwoPoint: function (map, x1, y1, x2, y2) {
        debugger;
        var extent;
        if (x1 < x2) {
            var t;
            t = x1;
            x1 = x2;
            x2 = t;
        }
        if (y1 < y2) {
            var t;
            t = y1;
            y1 = y2;
            y2 = t;
        }
        extent = new esri.geometry.Extent(x2, y2, x1, y1, map.spatialReference)
        if (extent != null) {
            var point = new esri.geometry.Point(extent.xmin + (extent.xmax - extent.xmin) / 2, extent.ymin + (extent.ymax - extent.ymin) / 2, map.spatialReference);
            var newExtent = new esri.geometry.Extent(point.x, point.y, point.x, point.y, point.spatialReference);
            //如果当前视图包含要缩放视图
            if (Robin.Map.Extent1ContainExtent2(map.extent, extent)) {
                extent = extent.expand(2);
                map.setExtent(extent);
            } else {
                var firstEx = Robin.Map.Union2Extent(newExtent, map.extent);
                map.setExtent(firstEx, true);
                setTimeout(function () {
                    map.centerAt(point)
                }, 700);
                setTimeout(function () {
                    extent = extent.expand(1.5);
                    map.setExtent(extent);
                }, 1400);
            }
        }
    }
}
/**
 * @constructor 名称：ClusterTool
 * @description 作用：用来创建聚合点图层
 * @author 张健 
 * @date 2018/2/9
 */
Robin.Portal.ClusterTool = {
    Point: [],
    id: "",
    Creat: function (id) {
        //id=id+(new Date().getSeconds().toString())
        this.id = id;
        require(["../js/plugin/ClusterHeatmap/ClusterLayer.js", ], function (ClusterLayer) {
            //先清除聚合图层
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);//清除图层
            clusterLayer = new ClusterLayer({
                "data": Robin.Portal.ClusterTool.Point,
                "distance": 60,
                "id": id,
                "labelColor": "#fff",
                "labelOffset": 10,
                "resolution": Robin.Map.Map2DControl.extent.getWidth() / Robin.Map.Map2DControl.width,
                "singleColor": "#888",
            });
            var defaultSym = new esri.symbol.PictureMarkerSymbol("../images/hydrant/bz-normal.png", 24, 36).setOffset(0, 15);
            var renderer = new esri.renderer.ClassBreaksRenderer(defaultSym, "clusterCount");
            var picBaseUrl = "../images/hydrant/polymerize/";
            var less = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "cluster-lower.png", 36, 36).setOffset(0, 15);
            var normal = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "cluster-middle.png", 48, 48).setOffset(0, 15);
            var more = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "cluster-high.png", 60, 60).setOffset(0, 15);
            renderer.addBreak(1, 5, less);
            renderer.addBreak(5, 50, normal);
            renderer.addBreak(50, 1001, more);
            clusterLayer.setRenderer(renderer);
            Robin.Map.Map2DControl.addLayer(clusterLayer, 2);

            //第一次默认加载聚合图层完成后先隐藏
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName);
            if (graphicLayer)
                graphicLayer.hide();

            dojo.connect(clusterLayer, 'onClick', function (evt) {
                var level;
                //如果有聚合,放大一级
                if (evt.graphic.attributes.clusterCount > 1) {
                    level = Robin.Map.Map2DControl.getZoom() + 1;
                }
                else {
                    level = Robin.Setting.GlobalSetting.maxZoomLevel;
                }
                Robin.Map.Map2DControl.setZoom(level);
                Robin.Map.Map2DControl.centerAt(Robin.Map.GetPoint(evt.graphic.geometry.x, evt.graphic.geometry.y));
            })
        });
        Robin.Portal.ClusterTool.open();
    },
    open: function () {
        Robin.Map.Map2DControl.on("zoom-end", function (zoom) {
            level = zoom.level;
            Robin.Portal.ClusterTool.ZoomEndEvent(level);
        })
    },
    close: function () {
        Robin.Map.Map2DControl.on("zoom-end", function (zoom) {
        });
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, this.id);
    },
    ZoomEndEvent: function (level) {
        if (level < 5) {
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, this.id);
            if (graphicLayer)
                graphicLayer.show();
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName);
            if (graphicLayer)
                graphicLayer.hide();
        }
        else if (level >= 5) {//当缩放到第六级时候，隐藏聚合图层，显示普通图层
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, this.id);
            if (graphicLayer)
                graphicLayer.hide();
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName);
            if (graphicLayer)
                graphicLayer.show();
        }
    }
}



///获取本地的虚拟地址
Robin.Host = {
    DirectPath: function () {
        var tmp = location.pathname;
        tmp = tmp.substring(0, tmp.indexOf("/", 1));
        if (tmp.substring(0, 1) != "/") tmp = "/" + tmp;
        return location.protocol + "//" + location.host + tmp + "/";
    }
}