var centerPoint;//地图选择中心点
var HydrantCenterPoint;//消防中心
var table;
var bol1 = false;
var bol2 = false;
$(function () {
    $("#txtR").val(200);
    //选择地图点
    $("#btnSelect").click(function () {
        $("#ResultTable tbody").html("");
        var listPanel = parent.Robin.Window.GetInfoPanelByID("datadisplay");
        if (listPanel != null) {
            listPanel.smallify();
        }
        parent.Hydrant.Map.MapTool.getMapPoint(function (point) {
            if (point) {
                listPanel.normalize();
                //标注火焰
                parent.Hydrant.Analyse.hydrantAnalyse.fireMark(point);
                var x = point.x.toFixed(2);
                var y = point.y.toFixed(2);               
                var xy = x + ',' + y;
                $("#txtXY").val(xy);
                centerPoint = point;
                bol1 = true;
                if (bol1 && bol2) {
                    $("#btnNavigation").removeAttr("disabled");
                }
            }                       
        });
    });

    //选择消防中心
    $("#btnSelectHydrantCenter").click(function () {
        var listPanel = parent.Robin.Window.GetInfoPanelByID("datadisplay");
        if (listPanel != null) {
            listPanel.smallify();
        }
        parent.Hydrant.Map.MapTool.getMapPoint(function (point) {
            if (point) {
                var x = point.x.toFixed(2);
                var y = point.y.toFixed(2);
                point.x = point.x.toFixed(2);
                point.y = point.y.toFixed(2);
                HydrantCenterPoint = point;
                var xy = x + ',' + y;
                $("#txtHydrantCenterXY").val(xy);
                //parent.Robin.Map.ClearLayer(parent.Robin.Map.Map2DControl, parent.Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                listPanel.normalize();
                var config = {
                    pic: {
                        src: "../images/hydrant/HydrantCenter.png",
                        width: 35,
                        height: 35
                    }
                };

                if (parent.Robin.Map.Map2DControl != null) {
                    var HydrantCenterLayer = parent.Robin.Map.Map2DControl.getLayer("HydrantCenterLayer");
                    if (HydrantCenterLayer) {
                        parent.Robin.Map.ClearLayer(parent.Robin.Map.Map2DControl, "HydrantCenterLayer");
                        var HydrantCenterLayer = parent.Robin.Map.addLayer({
                            id: "HydrantCenterLayer"
                        });
                        parent.Robin.Map.ShowGraphic(HydrantCenterLayer, '', x, y, config.pic.src, null, config);
                    }
                    else {
                        var graphicsLayer = parent.Robin.Map.addLayer({
                            id: "HydrantCenterLayer"
                        });
                        parent.Robin.Map.ShowGraphic(graphicsLayer, '', x, y, config.pic.src, null, config);
                    }
                    bol2 = true;
                    if (bol1&&bol2) {
                        $("#btnNavigation").removeAttr("disabled");
                    }
                }
            }
        });
    });

    //根据给出半径进行查询
    $("#btnQuery").click(function () {
        $("#ResultTable tbody").html("");
        //当前点坐标和半径值
        var point = $("#txtXY").val();
        var r = $("#txtR").val();
        if (point == "") {
            noty({ text: "地图位置不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        var x = point.substring(0, point.indexOf(','));
        var y = point.substring(point.indexOf(',') + 1, point.length);
        if (isNaN(r)) {
            noty({ text: "查询半径只能是数字！", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        parent.Robin.Map.ClearLayer(parent.Robin.Map.Map2DControl, parent.Robin.Setting.MapAnalyse.hydrant.grphicLayerName);//清除图层
        parent.Robin.Map.ClearLayer(parent.Robin.Map.Map2DControl, parent.Robin.Setting.MapAnalyse.hydrant.hydrantLayerName);//清除图层
        parent.Hydrant.Analyse.hydrantAnalyse.monitorLocate(x, y, r);
    });
    
    $("#btnNavigation").click(function () {       
        RouteLocation(centerPoint, HydrantCenterPoint);
    });

    $("#scroll").slimScroll({
        height: '300px',
        alwaysVisible: true,
    });
    
} );

function PointLocation(x, y) {    
    var pt = parent.Robin.Map.GetPoint(x, y);   
    top.Robin.Map.Map2DControl.centerAndZoom(pt,6);
}

function RouteLocation(centerPoint, HydrantCenterPoint) {
    //路径规划
    if (HydrantCenterPoint) {
        top.Robin.Portal.Route.routePlan(centerPoint.x, centerPoint.y, HydrantCenterPoint.x, HydrantCenterPoint.y, function (result) {
            var listPanel = parent.Robin.Window.GetInfoPanelByID("datadisplay");
            if (listPanel != null) {
                listPanel.smallify();
            }           
            top.Robin.Portal.Route.ZoomToTwoPoint(top.Robin.Map.Map2DControl, parseFloat(centerPoint.x), parseFloat(centerPoint.y), parseFloat(HydrantCenterPoint.x),parseFloat( HydrantCenterPoint.y));
        })
    }
}

