/**
 * 默认portal门户功能js.
 * @author Created by RobinChang on 2015-03-05.
 * @version 1.0
 * @license Copyright (c) 2007-2014 robin studio
 */

/*初始化Page命名空间*/
if (!this["Robin.Portal"]) { Robin.Portal = {}; }
if (!this["Robin.Portal.Page"]) { Robin.Portal.Page = {}; }

/*系统数据*/
Robin.Portal.SystemData = {
    DiscardList: [],
    ConstructionList: [],
    NormalList: [],
    AllList: []
    //allDataList: null,
    //ConfigList: null,
    //MonitorList: null,
    //AlertList: [],
    //MonitorFilterList: [],
    //category: "030104",
    //categorys: "030104"
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
        success: function (data) {
            var zjCount = 0, zcCount = 0, zfCount = 0;

            for (var j = 0; j < data.length; j++) {
                Robin.Portal.SystemData.AllList.push(data[j]);
                if (data[j].STATUS == "正常") {
                    Robin.Portal.SystemData.NormalList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].POINTNO + "<span class='zaijian' style='color:#5CB85C'>正常</span></li>";
                        zcCount++;
                    } else {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].JCDNAME + "<span class='zaijian' style='color:#5CB85C'>正常</span></li>";
                        zcCount++;
                    }
                    $("#dataList").append(html);
                }
                if (data[j].STATUS == "在建") {
                    Robin.Portal.SystemData.ConstructionList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].POINTNO + "<span class='zaijian' >在建</span></li>";
                        zjCount++;
                    } else {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].JCDNAME + "<span class='zaijian'>在建</span></li>";
                        zjCount++;
                    }
                    $("#dataList").append(html);
                }
                if (data[j].STATUS == "作废") {
                    Robin.Portal.SystemData.DiscardList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].POINTNO + "<span class='zaijian' style='color:#D9534F'>作废</span></li>";
                        zfCount++;
                    } else {
                        var html = "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].JCDNAME + "<span class='zaijian' style='color:#D9534F'>作废</span></li>";
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
            alert(status);
        }
    });
}

//Robin.Portal.InitialData = function (completed) {
//    var basicUrl = Robin.Setting.GlobalSetting.RestAPIService;
//    //全局变量初始化
//    Robin.Portal.SystemData.AlertList.length = 0;//各类监测点报警数据   
//    $.ajax({
//        cache: false,       
//        url: basicUrl + "/HWService/InitData",
//        dataType: "json",
//        type: "get",
//        success: function (data) {
//            if (data) {
//                Robin.Portal.SystemData.allDataList = data;
//                Robin.Portal.SystemData.ConfigList = data.ConfigList;
//                Robin.Portal.SystemData.MonitorList = data.MonitorList;

//                //根据编码过滤监测点列表
//                $.each(data.MonitorList, function (i, v) {
//                    var bmid = v.BMID.substring(6, 12);
//                    if (bmid == Robin.Portal.SystemData.category) {
//                        Robin.Portal.SystemData.MonitorFilterList.push(v);
//                    }
//                })

//                //循环监测点，查看报警信息
//                $.each(Robin.Portal.SystemData.MonitorList, function (i, monitor) {

//                    //查找对应的配置项
//                    $.each(data.ConfigList, function (ii, config) {

//                        //找到配置项                       
//                        if (monitor.BMID == config.STATION_KEY && monitor.BMID.substring(6, 12) == Robin.Portal.SystemData.category) {
//                        //if (monitor.BMID == config.STATION_KEY && monitor.BMID.substring(6, 8) == "02") {
//                            //查找该配置项的报警项
//                            $.each(data.AlertList, function (iii, alert) {

//                                //找到报警项
//                                if (alert.TAG_KEY == config.TAG_CODE && alert.STATION_KEY == config.STATION_KEY) {
//                                    var alertInfo = {};
//                                    var alertInfoEnterprises = {};

//                                    alertInfo.SAVE_DATE = Robin.Utils.ToDate(alert.SAVE_DATE);//预警时间
//                                    alertInfo.TAG_KEY = alert.TAG_KEY;//监测项key
//                                    alertInfo.TAG_VALUE = alert.TAG_VALUE;//监测值
//                                    alertInfo.TAG_NAME = config.TAG_NAME;//监测项
//                                    alertInfo.L1_END = config.L1_END;//一级预警界限
//                                    alertInfo.L2_END = config.L2_END;//二级预警界限
//                                    alertInfo.L3_END = config.L3_END;//三级预警界限
//                                    alertInfo.monitor = monitor;//监测点信息
//                                    alertInfo.level = "一级预警";
//                                    if (alertInfo.TAG_VALUE >= config.L1_END && alertInfo.TAG_VALUE < config.L2_END) {
//                                        alertInfo.level = "一级预警";
//                                    }
//                                    if (alertInfo.TAG_VALUE >= config.L2_END && alertInfo.TAG_VALUE < config.L3_END) {
//                                        alertInfo.level = "二级预警";
//                                    }
//                                    if (alertInfo.TAG_VALUE >= config.L3_END) {
//                                        alertInfo.level = "三级预警";
//                                    }
//                                    Robin.Portal.SystemData.AlertList.push(alertInfo);

//                                }
//                            });

//                        }

//                    });

//                });
//                if (completed != null && $.isFunction(completed)) {
//                    completed();
//                }
//            }
//        },
//        error: function (XMLHttpRequest, txtStatus, errorThrown) {

//        }
//    });
//}
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
    }
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
    Robin.Map.MapWindow.Show("", Robin.Map.Map2DControl, pt, newhtml, false);
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
