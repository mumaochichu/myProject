if (!this["Robin"]) { Robin = {}; }
if (!this["Robin.Application"]) { Robin.Application = {}; }
if (!this["Robin.Logger"]) { Robin.Logger = {}; }
if (!this["Robin.Portal"]) { Robin.Portal = {}; }

RequireJS.config({
    baseUrl: "../js",
    paths: {
        "Framework": "Framework",
        "RequireDomReady": "RequireJS/domReady",
        "RequireText": "RequireJS/text"
    },
    waitSeconds: 1
});

//监测点监测标注
function fireHydrantMonitorClick() {
    if (Robin.Map.Map2DControl != null) {
        var xfsLayer = Robin.Map.Map2DControl.getLayer("xfsLayer");
        if (xfsLayer) {
            if (xfsLayer.visible) {
                parent.Robin.Portal.Page.XFS.clearlayer();
                return;
            }
        }
    }
    var point;
    var isWarn = false;
    var graphicsLayer = Robin.Map.addLayer({
        id: "xfsLayer"
    });
    var _default = {
        font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
        color: 'black',
    };
    $.each(Robin.Data.monitor, function (i, v) {
        if (v.BMID.substr(6, 6) == Robin.Setting.GlobalSetting.HyrantCode) {
            var pd = Robin.Map.MapWindow.IsOpenByID(v.BMID);
            if (pd == false) {
                $.ajaxSettings.async = false;//设置为同步请求
                $.get("../FireHydrant/templates/xfsInfo.html", null, function (html, textStatus) {
                    point = Robin.Map.GetPoint(v.BMX, v.BMY);
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
                    FactoryWindowID = "#mapWindow_" + v.BMID;
                }, "html");
                //全图显示
                //setExtent();
            }
        }
    });
    parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
        //parent.Robin.Map.MapWindow.CloseAll();
        Robin.Map.MapWindow.CloseByID(FactoryWindowID);
        parent.Robin.Portal.Page.XFS.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
    });
};

/* 装载系统启动所用脚本 */
RequireJS([
    "Framework/robin",
    "Framework/robin-utils",
    "portal/hydrant-robin-setting-suzhou",
    "Framework/robin-mvvm",
    "portal/hydrant-robin-portal-suzhou",
    "portal/hydrant-extend-map-suzhou",
],//ArcGis javascript API
    function () {
        /*判断用户是否登录*/
        IsLoginOrNot();
        Application_Start();  // 先载入noty,避免崩溃现象 
    }
);
var tmodel = null;
var isConstruction = 0;
var isNormal = 0;
var isDiscard = 0;
var level = 1;//缩放级别
var eyebool = true;//默认打开全部标注功能
var clusterLayer;//聚合对象
var clusterLayervisible = false;//聚合可见性、图层标注的可见性
var windowInfoClusterID = "";//用于保存打开的windowInfoCluster的ID，用于关闭事件
var FactoryWindowID = "";//用于保存打开的Factory.html的ID，用于关闭事件
var DataDisplaySelected = false;//DataDisplay选中状态

/* 应用程序启动 首先进行布局初始化 ,然后初始化事件*/
function Application_Start() {
    Robin.Map.init();
    /*先请求平台，获取当前用户的usekey,赋予robin-setting中Robin.Setting.GlobalProperty.Query.userKey.*/
    $.getScript(Robin.Setting.GlobalSetting.SystemService + "/Handler/UserKey.ashx?m=GetCurrentUserKey&f=json&cb=GetUserkeyCallback");
    /*计算页面高度宽度,自动改变布局*/
    $(window).resize(function () {
        $("#Main_Map_DIV").height($(window).height());
    });
    $("#Main_Map_DIV").height($(window).height());
    $("#Div_Warning").hide();
    /*绑定按钮点击事件.*/
    bindButtonEvent();
    /*数据初始化后，加载模块插件*/
    Robin.Portal.Initial(function () {
        /*加载数据展示地图标注.*/
        $("#DataDisplay").addClass("selected");
        $("#ermenu").show();
    });

    //jsPanel关闭事件
    $(document).on("jspanelclosed", function (event, id) {
        //维保单位清除标注
        if (id == "MaintenanceUnitPanel") {
            var graphicsLayer = Robin.Map.Map2DControl.getLayer("wbdwLayer")
            if (graphicsLayer != null) {
                graphicsLayer.clear();
            }
        } else if (id == "datadisplay") {//关闭抢险分析火焰标注,
            var windowDivId = Robin.Setting.MapAnalyse.hydrant.fireMark.windowDivId
            Robin.Map.MapWindow.CloseByID(windowDivId);
            var graphicsLayer = parent.Robin.Map.Map2DControl.getLayer("HydrantCenterLayer");
            if (graphicsLayer != null) {
                graphicsLayer.clear();
            }
            $("#DataDisplay").css({ "background-color": 'transparent' });
        }

        if (Robin.Window._closeAll) {
            return;
        }
        $.each(Robin.Window.instances,
            function (i, item) {
                if (item && item.id == id) {
                    $(item.obj[0]).html('');
                    Robin.Window.instances.splice(i);
                }
            });
        if (id == "datadisplay") {
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);//关闭普通消防栓图层
            var HydrantLayer = Robin.Map.GetGraphicLayer(top.Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName);
            if (HydrantLayer != null) {
                HydrantLayer.clear();
            }
            var routeGraphicLayer = Robin.Map.GetGraphicLayer(top.Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.route.routeLayerName);
            if (routeGraphicLayer != null) {
                routeGraphicLayer.clear();
            }
            Robin.Portal.ClusterTool.close();//关闭聚合点
        }
        if (id == "pnlQueryResult") {
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
            debugger;
            //$.each(Robin.Map.Map2DControl.graphicsLayerIds, function (i, item) {
            //    Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item).clear();
            //});

            Robin.Map.MapWindow.CloseAll();
        }
    });

    //初始化一次监测点数据,初始化报警和监测列表
    Robin.Data.init(function () {
        tmodel = new Robin.MVVM.ViewModel();
        //监测项过滤后添加
        $.each(Robin.Data.config, function (i, item) {
            $.each(Robin.Data.monitor, function (j, v) {
                if (item.STATION_KEY == v.BMID && v.BMID.substr(6, 6) == Robin.Setting.GlobalSetting.HyrantCode) {
                    item.JCDNAME = v.BMMC;
                    return true;
                }
            });
            tmodel.monitorData.push(Robin.MVVM.CreateRuntimeModel(item));
        });
        //处置报警信息
        $.each(Robin.Data.alert, function (i, item) {
            var stationName = '';
            var tagDesc = '';
            var unit = '';
            $.each(Robin.Data.monitor, function (j, v) {
                if (item.STATION_KEY == v.BMID) {
                    stationName = v.BMMC;
                    return true;
                }
            });
            $.each(Robin.Data.config, function (j, v) {
                if (item.TAG_KEY == v.TAG_CODE) {
                    tagDesc = v.TAG_DESC;
                    unit = v.UNITS;
                    return true;
                }
            });
            if (stationName != '' && tagDesc != "") {
                item.SAVE_DATE = moment(item.SAVE_DATE).format('YYYY-MM-DD HH:mm');
                tmodel.alertData.push(Robin.MVVM.CreateAlertModel(item, stationName, tagDesc, unit));
            }
        });

        ko.applyBindings(tmodel, top.document.getElementById("WarningList"));
        ko.applyBindings(tmodel, document.getElementById("warningNum"));


        //绑定所有消火栓数据列表--开始
        var tempModelxfsAllList = new Robin.Portal.RuntimeModel();
        $.each(Robin.Portal.Page.XFS.query(), function (i, vv) {
            tempModelxfsAllList.MonitorDatas.push(vv);
        });
        ko.applyBindings(tempModelxfsAllList, top.document.getElementById("MonitorList"));
        $("#MonitorList").slimScroll({
            height: '320px'
        });

        $("#WarningList").slimScroll({
            height: '320px'
        });
        //初始化先打开消火栓聚合效果，只不过先隐藏，不显示
        fireHydrantMarking();
        //初始化打开监测点全部标注     
        if (eyebool) {
            fireHydrantMonitorClick();
            $.each(Robin.Map.Map2DControl.graphicsLayerIds, function (i, item) {
                if (item == "xfsLayer") {
                    var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item);
                    if (graphicLayer.graphics.length > 0) {
                        parent.Robin.Portal.Page.XFS.locate(graphicLayer.graphics[0].attributes.BMID);
                    }
                }
            });
            eyebool = false;
        };
        //WebSocket
        RobinSocketInit();

    });

}

function GetUserkeyCallback(result) {
    var userKey = Robin.Setting.GlobalProperty.Query.userKey;
    Robin.Setting.GlobalProperty.Query.userKey = "?USERKEY=" + (userKey ? userKey : (result ? "" : result.toString())) + "&";
    Main_Map_ShowMap();
};

function Main_Map_ShowMap() {
    Robin.Map.InitMap(function () {
        $(".esriControlsBR").hide();//去掉地图logo
        /* 加载工具条*/
        Robin.Portal.addModule({
            name: 'ToolBarPlugin',
            containerid: 'ToolBarDIV',
            path: '../FireHydrant/plugin/'
        });

        Robin.Portal.addModule({
            name: 'MapLayerControlPlugin',
            containerid: 'LayerControl_DIV',
            path: '../FireHydrant/plugin/'
        });

        Robin.Map.Map2DControl.on("zoom-end", function (zoom) {
            level = zoom.level;
            clustersOrfireHydrantAllShow(level);
        })
    });
};

//监测列表
$("#option1").on("click", function () {
    $("#option1>a").addClass("active");
    $("#option2>a").removeClass("active");
    $("#MonitorListDIV").show();
    $("#WarningListDIV").hide();
})

//报警列表
$("#option2").on("click", function () {
    $("#option2>a").addClass("active");
    $("#option1>a").removeClass("active");
    $("#MonitorListDIV").hide();
    $("#WarningListDIV").show();
})

//监测列表单击监测点信息定位/报警窗体监测点信息定位
$(document).on("click", ".list-group>li>div", function () {
    var stationKey = $(this).attr("id");
    parent.Robin.Portal.Page.XFS.locate(stationKey);
});

//初始状态标注全部消火栓
function fireHydrantMarking() {
    var AllList = Robin.Portal.SystemData.AllList;
    var points = [];
    $.each(AllList, function (i, v) {
        points.push({
            x: v.X, y: v.Y, attr: {
                bmid: v.CODE,
                bmmc: v.CODE,
                type: v.STATUS,
                bmkj: v.CALIBER,
                bmtm: v.BURYMODE,
                bmyhsj: v.LASTMAINTENTIME,
                bmdz: v.ADDRESS,
            }
        });
    });
    require(["../js/plugin/ClusterHeatmap/ClusterLayer.js", ], function (ClusterLayer) {
        clusterLayer = new ClusterLayer({
            "data": points,
            "distance": 60,
            "id": "clusters",
            "labelColor": "#fff",
            "labelOffset": 10,
            "resolution": Robin.Map.Map2DControl.extent.getWidth() / Robin.Map.Map2DControl.width,
            "singleColor": "#888",
        });
        var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(40);
        var renderer = new esri.renderer.ClassBreaksRenderer(defaultSym, "clusterCount");
        var picBaseUrl = "../images/hydrant/polymerize/";
        var blue = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "cluster-lower.png", 36, 36).setOffset(0, 15);
        var green = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "cluster-middle.png", 48, 48).setOffset(0, 15);
        var red = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "cluster-high.png", 60, 60).setOffset(0, 15);
        renderer.addBreak(0, 5, blue);
        renderer.addBreak(5, 50, green);
        renderer.addBreak(50, 1001, red);
        clusterLayer.setRenderer(renderer);
        Robin.Map.Map2DControl.addLayer(clusterLayer);

        //初始化标注xfsAllShowLayer图层
        fireHydrantAllShow();
        //隐藏clusters图层和xfsAllShowLayer图层，以及mapWindowCluster弹窗
        Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "clusters").hide();
        Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "xfsAllShowLayer").hide();
        $(".mapWindowCluster").hide();
        // close the info window when esc is pressed
        Robin.Map.Map2DControl.on("key-down", function (e) {
            if (e.keyCode === 27) {
                cleanUp();
            }
        });
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
    })
}

//标注聚合或者标注全部消火栓点
function clustersOrfireHydrantAllShow(level) {
    if (clusterLayervisible) {//打开消火栓标注功能
        if (level < 5) {
            $(".mapWindowCluster").hide();
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "xfsAllShowLayer").hide();
            var picFactor = 1;
            var textFactor = 1;
            if (level < 2) {
                picFactor = 0.4;
                textFactor = 0;
            }
            else if (level < 4) {
                picFactor = 0.6;
                textFactor = 0.6;
            }
            var graphicLayers = Robin.Map.Map2DControl.graphicsLayerIds;
            for (var i = 0; i < graphicLayers.length; i++) {
                if (graphicLayers[i] == "nolyLayer") {
                    var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, graphicLayers[i]);
                    //遍历修改标注
                    for (var j = 0; j < graphicLayer.graphics.length; j++) {
                        if (graphicLayer.graphics[j].symbol.url) {
                            graphicLayer.graphics[j].symbol.height = 30 * picFactor;
                            graphicLayer.graphics[j].symbol.width = 30 * picFactor;
                        } else {
                            graphicLayer.graphics[j].symbol.font.size = 13 * textFactor;
                            graphicLayer.graphics[j].symbol.yoffset = -30 * picFactor;
                        }
                    }
                    graphicLayer.redraw();
                }
                else if (graphicLayers[i] == "clusters") {
                    var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, graphicLayers[i]);
                    graphicLayer.show();
                }
            }
        }
        else if (level >= 5) {//当缩放到第六级时候，隐藏聚合图层，显示普通图层
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "clusters").hide();
            $(".mapWindowCluster").show();
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "xfsAllShowLayer").show();
            //fireHydrantAllShow();
        }
    }
    else {//关闭消火栓标注功能
        if (level < 5) {
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "clusters").hide();
        }
        else if (level >= 5) {
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, "xfsAllShowLayer").hide();
        }
    }
}

//标注所有消火栓--WHY
function fireHydrantAllShow() {
    var xfsAllShowLayer = Robin.Map.Map2DControl.getLayer("xfsAllShowLayer");
    if (xfsAllShowLayer != undefined && xfsAllShowLayer.graphics.length > 0) {//xfsAllShowLayer.graphics.length>0避免了其他模块因清空图层等操作导致干扰
        var graphicLayers = Robin.Map.Map2DControl.graphicsLayerIds;
        for (var i = 0; i < graphicLayers.length; i++) {
            if (graphicLayers[i] == "xfsAllShowLayer") {
                var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, graphicLayers[i]);
                graphicLayer.show();
                return;
            }
        }
    }
    else {
        var point;
        var isWarn = false;
        var graphicsLayer = Robin.Map.addLayer({
            id: "xfsAllShowLayer"
        });
        var _default = {
            font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
            color: 'black',
        };
        var AllList = Robin.Portal.SystemData.AllList;
        var symbolConfig = {
            font:
                { 'size': "12", 'style': 'normal' },
            color: [0, 89, 149],
            pic: {
                src: '',
                width: 24,
                height: 36
            },
            offset: {
                x: 0,
                y: -30
            }
        }
        $.each(AllList, function (i, v) {
            point = Robin.Map.GetPoint(v.X, v.Y);
            var tpname = "";
            symbolConfig.pic.src = "";
            //判断展示文件名
            if (v.STATUS == "正常") {
                tpname = "bz-normal";
            }
            else if (v.STATUS == "在建") {
                tpname = "bz-construction";
            }
            else if (v.STATUS == "作废") {
                tpname = "bz-discard";
            }
            top.Robin.Map.ShowGraphic(graphicsLayer, null, point.x, point.y, "../images/hydrant/" + tpname + ".png", v, symbolConfig);
        });
    }
    parent.Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
        var attr = evt.attributes;
        var paremeter = { "CODE": attr.CODE, "X": attr.X, "Y": attr.Y, "POINTNO": attr.CODE, "LASTYHTIME": attr.LASTMAINTENTIME, "STATUS": attr.STATUS, "SIZES": attr.CALIBER, "EMBED": attr.BURYMODE, "ADDRESS": attr.ADDRESS };
        top.Robin.Portal.MapTool.data = paremeter;//在此处传递数据

        if (windowInfoClusterID != "") {
            top.Robin.Map.MapWindow.CloseByID(windowInfoClusterID);
        }
        //点击图标显示弹窗
        var windowInfo = {
            POINTX: paremeter.X,
            POINTY: paremeter.Y,
            CODE: paremeter.CODE
        }
        top.Robin.Portal.ShowMapWindowCluster(windowInfo, "", "");
    });
};

//socket连接
RobinSocketInit = function () {
    var wsImpl = window.WebSocket || window.MozWebSocket;
    var server = Robin.Setting.GlobalSetting.gprsSocketServer;
    window.ws = new wsImpl(server);
    ws.onmessage = function (evt) {
        debugger;
        var result = $.parseJSON(evt.data);
        switch (result.prefix.toLowerCase()) {
            case "realdata":
                var realData = result.data;
                Robin.MVVM.UpdateRuntimeModel(realData, tmodel.monitorData());
                //报警
                var alertid = realData.AlertId;
                var tagKey = realData.TagKey;
                for (var j = 0; j < tmodel.alertData().length; j++) {
                    if (tmodel.alertData()[j].TagKey() == tagKey) {
                        tmodel.alertData.splice(j, 1)
                    }
                }
                if (alertid != '') {
                    var amodel = new Robin.MVVM.AlertModel();
                    amodel.AlertId(alertid);
                    amodel.StationKey(realData.StationKey);
                    amodel.StationName(realData.StationName);
                    amodel.TagKey(realData.TagKey);
                    amodel.TagName(realData.TagName);
                    amodel.TagValue(realData.TagValue);
                    amodel.Message(realData.Message);
                    amodel.JDTime(realData.DBTime);
                    amodel.SaveTime(moment(realData.SaveTime).format('YYYY-MM-DD HH:mm'));
                    amodel.StationType(realData.StationKey.substring(6, 12));
                    amodel.Units(realData.Units);
                    tmodel.alertData.push(amodel);
                }
                break;
            case "operalertids":
                var ids = result.data;
                var idArray = ids.toString().split(',');
                for (var i = 0; i < idArray.length; i++) {
                    if (idArray[i] == '')
                        return true;
                    var isOper = false;
                    for (var j = 0; j < tmodel.alertData().length; j++) {
                        if (tmodel.alertData()[j].AlertId() == idArray[i]) {
                            isOper = true;
                            break;
                        }
                    }
                    //已处置
                    if (isOper) {
                        tmodel.alertData.splice(i, 1)
                    }
                }
                break;
                //督办
            case "alertdb":
                var alertInfo = result.data;
                //更新督办新
                $.each(tmodel.alertData(), function (i, v) {
                    if (v.AlertId() == alertInfo.AlertId) {
                        v.Message(alertInfo.dbmessage);
                        v.JDTime(alertInfo.dbtime);
                        return false;
                    }
                });
                break;
            default: break;
        }
    };
    ws.onopen = function () {
        debugger
        var monitorType = Robin.Setting.GlobalSetting.MonitorType;
        var channel = "";
        $.each(monitorType, function (i, v) {
            channel += v.key + ",";
        });
        if (channel != '') {
            channel = channel.substring(0, channel.length - 1);
        }
        ws.send("subscribe&" + channel);
    };
    ws.onclose = function () {

    }
    ws.onerror = function () {
        noty({
            text: 'socket连接消息中心失败</br>需要重新连接吗?',
            buttons: [
              {
                  addClass: 'btn btn-primary', text: '确定', onClick: function ($noty) {
                      $noty.close();
                      setTimeout(RobinSocketInit(), 10000);
                  }
              },
              {
                  addClass: 'btn btn-danger', text: '取消', onClick: function ($noty) {
                      $noty.close();
                  }
              }
            ],
            layout: "center"
        });
    }
}


//菜单点击事件
function bindButtonEvent() {
    /*消火栓标注聚合*/
    $("#fireHydrantMark").click(function () {
        //最新消火栓标注聚合方式
        if (clusterLayer != null) {
            var isshow = clusterLayervisible;
            if (!isshow) {//显示
                $("#fireHydrantMark").css({ "background-color": 'rgb(223, 82, 5)' })
                clusterLayervisible = true;
                clustersOrfireHydrantAllShow(level);
            } else {//隐藏
                $("#fireHydrantMark").css({ "background-color": 'transparent' })
                clusterLayervisible = false;
                clustersOrfireHydrantAllShow(level);
            }
            return;
        }
        else {
            return;
        }

        function cleanUp() {
            Robin.Map.Map2DControl.infoWindow.hide();
            clusterLayer.clearSingles();
        }
    });

    //消火栓全部标注功能
    $("#eye").click(function () {
        if (eyebool) {//打开监测点全部标注
            eyebool = false;
            fireHydrantMonitorClick();
            $("#eye").css({ "color": '#F7E47D' });
            noty({ text: "标注所有消火栓监测点", type: "success", layout: "topCenter", timeout: 1000 });
            $("#eye").attr("title", "关闭标注");
        }
        else {//关闭监测点全部标注
            eyebool = true;
            fireHydrantMonitorClick();
            $("#eye").css({ "color": '#efecec' });
            noty({ text: "关闭标注消火栓监测点", type: "success", layout: "topCenter", timeout: 1000 });
            $("#eye").attr("title", "全部标注");
        }
    })

    //监测点列表显示
    $("#Monitoring_expansion").click(function () {
        fireHydrantListClick();
    });

    function fireHydrantListClick() {
        if ($("#HydrantList").css("display") == "block") {
            $("#HydrantList").css("display", "none");
            $("#Monitoring_expansion").show();
        } else {
            $("#Monitoring_expansion").hide();
            $("#HydrantList").css("display", "block");
        }
    }

    //消火栓信息列表
    $("#infoManagement").click(function () {
        var Title = "消火栓信息列表";
        var url = '../FireHydrant/InfoManagement/InfoManagement.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="InfoManagementFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'InfoManagement',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },
        });
    });

    //维保单位
    $("#maintenanceUnit").click(function () {
        var Title = "维保单位信息";
        var url = '../FireHydrant/InfoManagement/maintenanceUnit.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="MaintenanceUnitFrame"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'MaintenanceUnitPanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },
        });
    });

    //维保人员
    $("#maintenancePerson").click(function () {
        var Title = "维保人员信息";
        var url = '../FireHydrant/InfoManagement/maintenancePerson.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="MaintenancePersonFrame"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'MaintenancePersonPanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },
        });
    });

    //表格导入
    $("#tableInput").click(function () {
        var Title = "数据导入";
        var url = '../FireHydrant/tableInput/tableInput.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="TableInputFrame"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'TableInputPanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },
        });
    });

    /*消火栓维护保养*/
    $("#maintenanceRecord").click(function () {
        var Title = "维护保养信息列表";
        var url = '../FireHydrant/HyrantAssert/assertList.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="assertFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'assertPanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },

        });
    });
    //养护提醒
    $("#maintenanceRemind").click(function () {
        var Title = "养护提醒列表";
        var url = '../FireHydrant/HydrantReminder/reminderIndex.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="assertFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'reminderIndexPanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },
        });
    })

    //抢险分析
    $("#DataDisplay").click(function () {
        if (!DataDisplaySelected) {
            $("#DataDisplay").css({ "background-color": 'rgb(223, 82, 5)' });
        }

        var Title = "抢险分析";
        var url = '../FireHydrant/DataDisplay/DataDisplay.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="datadisplayFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'datadisplay',
            theme: '#EF681E',
            contentSize: { width: 400, height: 450 },
            position: { my: 'right-top', at: 'right-top', offsetX: -30, offsetY: 150 },
            headerControls: { minimize: "remove", maximize: "remove" }
        });
    });

    /*数据统计*/
    $("#fireHydrantSta").click(function () {
        var Title = "基础信息统计";
        var url = '../FireHydrant/DataDisplay/Statistics.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'StatisticsPanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" },
        });
    });

    //维保统计
    $("#maintenanceSta").click(function () {
        var Title = "维保统计";
        var url = '../FireHydrant/DataDisplay/maintenanceSta.htm';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'maintenancePanel',
            theme: '#EF681E',
            contentSize: { width: 900, height: 490 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" }
        });
    })

    $("#normal").click(function () {
        if (isNormal == 0) {
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-normal");
            var NormalList = Robin.Portal.SystemData.NormalList;
            LabelList(NormalList, "bz-normal");
            $("#normal").css("background", "#05bee5");
            isNormal = 1;
        }
        else {
            /*清除标注*/
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-normal");
            isNormal = 0;
            $("#normal").css("background", "#5cb85c");
            Robin.Map.MapWindow.CloseAll();
        }
    })

    $("#construction").click(function () {
        if (isConstruction == 0) {
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-construction");
            var ConstructionList = Robin.Portal.SystemData.ConstructionList;
            LabelList(ConstructionList, "bz-construction");
            $("#construction").css("background", "#05bee5");
            isConstruction = 1;
        }
        else {
            /*清除标注*/
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-construction");
            isConstruction = 0;
            $("#construction").css("background", "rgb(210,102,19)");
            Robin.Map.MapWindow.CloseAll();
        }
    })

    $("#discard").click(function () {
        if (isDiscard == 0) {
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-discard");
            var DiscardList = Robin.Portal.SystemData.DiscardList;
            LabelList(DiscardList, "bz-discard");
            $("#discard").css("background", "#05bee5");
            isDiscard = 1;
        }
        else {

            /*清除标注*/
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-discard");
            isDiscard = 0;
            $("#discard").css("background", "#d9534f");
            Robin.Map.MapWindow.CloseAll();
        }
    })

    //获取用户数据
    $("#userInfo").click(function () {
        $('.admin-panel').css('display', 'block').removeClass('bounceOutDown').addClass('animated bounceInDown');
        $.ajax({
            url: "../Handler/LoginAuthorize.ashx?Action=UserInfo",
            dataType: "json",
            //async: false,
            error: function () { alert("get_error") },
            success: function (result) {
                console.log(result);
                var userinfo;
                if (result != null) {
                    $("#UserName").text(result.USERNAME == null ? "" : result.USERNAME);
                    $("#AliasName").text(result.ALIASNAME == null ? "" : result.ALIASNAME);
                    $("#Phone").text(result.PHONE == null ? "" : result.PHONE);
                    $("#Email").text(result.EMAIL == null ? "" : result.EMAIL);
                    $("#Address").text(result.ADDRESS == null ? "" : result.ADDRESS);
                }
            }
        });
    })
    //历史数据查询
    $("#searchHistoryData").click(function () {
        var Title = "历史数据查询";
        var url = '../FireHydrant/history/historyQuery.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="InfoManagementFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'historyQueryPanel',
            theme: '#EF681E',
            contentSize: { width: 940, height: 500 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" }
        });
    })
    //报警数据查询
    $("#searchAlarmData").click(function () {
        var Title = "报警数据查询";
        var url = '../FireHydrant/history/alarmReport.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="InfoManagementFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'alarmReportPanel',
            theme: '#EF681E',
            contentSize: { width: 940, height: 500 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove", maximize: "remove" }
        });
    })
}


/* 判断用户是否登录，没有登录跳转到登录页面*/
var name, passW;
function IsLoginOrNot() {
    var name = $.cookie("loginUserName");
    var pwd = $.cookie("loginUserPassword");
    if (name && pwd) {
        LoginSend(name, pwd);
    }
    try {
        if ($.cookie("userName") == undefined || $.cookie("userName") == "") {
            //js获取网站根路径(站点及虚拟目录)，获得网站的根目录或虚拟目录的根地址 
            var pathName = window.location.pathname.substring(1);
            //获取虚拟目录
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
            var path = window.location.protocol + '//' + window.location.host + '/' + webName + '/';
            //跳转到登录页面
            location.href = path + "hylogin.htm";
        }
    } catch (e) {
        //   location.reload();
    }
};

/* 登录 */
var LoginSend = function (n, p) {
    debugger;
    name = $.trim($("#txtUserName").val() || n);
    passW = $.trim($("#txtPassword").val() || p);
    if (!name) {
        alert('请输入用户名');
        return false;
    } else if (!passW) {
        alert('请输入密码');
        return false;
    }
    if ($("#chkRemember").is(':checked')) {
        $.cookie("loginUserName", name, { expires: 7 });
        $.cookie("loginUserPassword", passW, { expires: 7 });
    }
    else {
        $.removeCookie('loginUserName');
        $.removeCookie('loginUserPassword');
    }
    $.getScript(Robin.Setting.GlobalSetting.SystemService + "/Handler/Login.ashx?un=" + name + "&pw=" + passW + "&f=json&cb=LoginCallback");
};

/* 取消登录 */
var LoginCancle = function () {
    $("#password").val("");
    $("#username").val("");
};

//登录回调函数
function LoginCallback(reply) {
    if (reply == "yes") {
        $.getScript(Robin.Setting.GlobalSetting.SystemService + "/Handler/LoginWithBack.ashx?f=json&cb=GetUserInfoCallback");
    }
    else {
        alert("对不起,无法进行系统登陆,请检查用户名或密码输入是否正确,如果确认无误,请联系管理员启用账户!");
    }
}

//UserInfo回调函数
function GetUserInfoCallback(reply) {
    var obj = reply;
    var lastTime = obj.UserModelBack.UserModel.LastLogTime;
    var Times = "";
    if (lastTime == null) {
        Times = "";
    }
    else {
        Times = lastTime.toString().substring(0, 4) + "-";
        Times += lastTime.toString().substring(4, 6) + "-";
        Times += lastTime.toString().substring(6, 8) + " ";
        Times += lastTime.toString().substring(8, 10) + ":";
        Times += lastTime.toString().substring(10, 12) + ":";
        Times += lastTime.toString().substring(12, 14);
    }
    $.cookie("userName", obj.UserModelBack.UserModel.UserName);
    $.cookie("pwd", passW);
    $.cookie("goodName", obj.UserModelBack.UserModel.AliasName);
    var adress = obj.UserModelBack.UserModel.Address;
    if (adress == null) {
        adress = "";
    }
    $.cookie("address", adress);
    var phone = obj.UserModelBack.UserModel.Phone;
    if (phone == null) {
        phone = "";
    }
    $.cookie("phone", phone);
    var mail = obj.UserModelBack.UserModel.Email;
    if (mail == null) {
        mail = "";
    }
    $.cookie("mail", mail);
    $.cookie("lastTime", Times);
    $.ajax({
        type: 'POST',
        url: '../Handler/LoginAuthorize.ashx?Action=Login',
        data: {
            UserId: obj.UserModelBack.UserModel.UserID,
            UserName: obj.UserModelBack.UserModel.UserName,
            AliasName: obj.UserModelBack.UserModel.AliasName,
            Adress: obj.UserModelBack.UserModel.Address,
            Phone: obj.UserModelBack.UserModel.Phone,
            Email: obj.UserModelBack.UserModel.Email,
            Times: Times
        },
        success: function () {

        }, error: function (er) {
            location.href = "../hylogin.htm";
        }
    });
}

//系统退出函数
function backLogin() {
    $.ajax({
        url: '../Handler/LoginAuthorize.ashx?Action=Logout',
        success: function () {
            var url = Robin.Setting.GlobalSetting.SystemService;
            url = url + "/Handler/Logout.ashx";
            $.getScript(url, function (data) {
                location.href = "../hylogin.htm";
            });
        }
    });
}


