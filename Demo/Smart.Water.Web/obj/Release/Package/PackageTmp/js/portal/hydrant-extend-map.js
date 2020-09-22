if (!this["Hydrant"]) { Hydrant = {}; }
if (!this["Hydrant.Map"]) { Hydrant.Map = {}; }
var table;
//地图交互事件
//$("#datadisplayFrame").contents().find("#ResultTable")append("<tr><td>第二行</td></tr>")
Hydrant.Map.MapTool = {
    //地图拾取点坐标
    getMapPoint: function (callBack) {       
        top.Robin.Map.Map2DControl.setMapCursor("crosshair");
        var mapHandler = dojo.connect(Robin.Map.Map2DControl, "onClick", function (event) {
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "PointLayer");
            try {
                top.Robin.Map.Map2DControl.setMapCursor("default");
                callBack(event.mapPoint);
                dojo.disconnect(mapHandler);//事件值执行一次
            } catch (err) { }
        });
    },
    //消火栓相关分析
    hydrantAnalyse: {
        data: null,
        columns:null,
        monitorLocate: function (x, y, R) {
            var map = Robin.Map.Map2DControl;
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
            //重绘中心图标
            var config = {
                pic: {
                    src: "../images/hydrant/locEnd.png",
                    width: 14,
                    height: 23
                }
            };
            Robin.Map.ShowGraphic(graphicLayer, '', x, y, config.pic.src, null, config);
            //定位
            if (x != 0 && y != 0) {
                var extent = new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid });
                map.setExtent(extent);
            }
            var symbol = new top.esri.symbol.SimpleFillSymbol(top.esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new top.esri.symbol.SimpleLineSymbol(top.esri.symbol.SimpleLineSymbol.STYLE_LONGDASHDOT,
            new top.dojo.Color([0, 0, 255, 0.5]), 1),
            new top.dojo.Color([0, 0, 255, 0.5]));
            //画圆
            Hydrant.Map.MapTool.drawCircle(x, y, R, symbol, graphicLayer, true, function (circleGeometry) {
                Hydrant.Map.MapTool.hydrantAnalyse.queryData(circleGeometry);//执行查询   
                //让圆飞
                Hydrant.Map.MapTool.flayCirle(Robin.Map.Map2DControl, circleGeometry);
            });
        },
        //要素查询
        queryData: function (circleGeometry) {
            try{
                require(["esri/tasks/query", "esri/tasks/QueryTask"], function (Query, QueryTask) {
                    var outFields = [];
                    //获取setting中的参数  Robin.Setting.MapAnalyse.hydrant,并对其进行处理           
                    var outfield = Robin.Setting.MapAnalyse.hydrant;
                    $.each(outfield.showFields, function (i, v) {                   
                        outFields.push(v.name);
                    });
                    var whereStr = outfield.fieldName;//where条件中的参数
                    var queryTask = new QueryTask(Robin.Setting.MapAnalyse.hydrant.url);
                    var query = new Query();
                           
                    var nameList = [];
                    var wherelist = "";
                    $.each(outfield.fieldValue, function (i, v) {
                        nameList.push(v);
                    });
                    for (var i = 0; i < nameList.length; i++) {
                        wherelist += "" + whereStr + " ='" + nameList[i] + "'or" + " " + "";
                    }
                    wherelist = wherelist.substring(wherelist.indexOf(0), wherelist.lastIndexOf('or'));
                    query.where = wherelist;//动态where条件           
                    query.geometry = circleGeometry;
                    query.SpatialRelationship = Query.SPATIAL_REL_CONTAINS;//指定包含范围
                    query.outFields = outFields;//有待传入字符参数             
                    query.returnGeometry = true;
                    queryTask.execute(query, function (result) {
                        Hydrant.Map.MapTool.hydrantAnalyse.bindDate(result.features);                     
                    });                   
                });
            } catch (e) {
                throw (e);
            }
           
        },
        bindDate: function (data) {//数据绑定
            console.log(data);
            var confignormal = {
                pic: {
                    src: "../images/hydrant/bz-normal.png",
                    width: 25,
                    height: 25
                }
            };
            var configconstruction = {
                pic: {
                    src: "../images/hydrant/bz-construction.png",
                    width: 25,
                    height: 25
                }
            };
            var configdiscard = {
                pic: {
                    src: "../images/hydrant/bz-discard.png",
                    width: 25,
                    height: 25
                }
            };
            var result = Robin.Portal.SystemData.AllList;           
            var showContent = "";
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
            $.each(data, function (i, v) {
                var attributes = v.attributes;
                var x, y, id;
                var pd = "true";
                $.each(result, function (i, item) {                  
                    if (attributes.EXP_NO == item.POINTNO) {
                        x = v.geometry.x;
                        x = x.toFixed(2);
                        y = v.geometry.y;
                        y = y.toFixed(2);
                        id = x + "," + y;
                        showContent += "<tr id=" + id + ">";
                        showContent += "<td>" + attributes.EXP_NO + "</td>";
                        showContent += "<td>" + attributes.PMA + "</td>";
                        showContent += "<td>" + attributes.H + "</td>";
                        showContent += "<td>" + attributes.DEEP + "</td>";
                        showContent += "<td>" + item.STATUS + "</td>";
                        showContent += "</tr>";
                        pd = "false"
                        if (item.STATUS == "正常") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic(graphicLayer, '', x, y, confignormal.pic.src, null, confignormal);
                        }
                        if (item.STATUS == "在建") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic(graphicLayer, '', x, y, configconstruction.pic.src, null, configconstruction);
                        }
                        if (item.STATUS == "作废") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic(graphicLayer, '', x, y, configdiscard.pic.src, null, configdiscard);
                        }                                                                      
                    }                     
                });
                if (pd == "true") {
                    x = v.geometry.x;
                    x = x.toFixed(2);
                    y = v.geometry.y;
                    y = y.toFixed(2);
                    id = x + "," + y;
                    showContent += "<tr id=" + id + ">";
                   // showContent += "<td></td>";
                    showContent += "<td>" + attributes.EXP_NO + "</td>";
                    showContent += "<td>" + attributes.PMA + "</td>";
                    showContent += "<td>" + attributes.H + "</td>";
                    showContent += "<td>" + attributes.DEEP + "</td>";
                    showContent += "<td></td>";
                    showContent += "</tr>";
                    //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                    Robin.Map.ShowGraphic(graphicLayer, '', x, y, confignormal.pic.src, null, confignormal);           
                }                        
            });
            $("#datadisplayFrame").contents().find("#ResultTable").append(showContent);
            ////绑定点击事件
            //Robin.Map.Event.bindClickEvent(graphicLayer, function (evt) {
            //    console.log(evt);
            //    Robin.Portal.MapTool.data = this.attributes;//在此处传递数据
            //    Robin.Map.MapWindow.CloseAll();
            //    //点击图标显示弹窗
            //    var windowInfo = {
            //        POINTX: evt.graphic.geometry.x,
            //        POINTY: evt.graphic.geometry.y
            //    }
            //    Robin.Portal.ShowMapWindow(windowInfo, "", "");
            //});
        }
    },
    //画圆的方法
    drawCircle: function (x, y, R, symbol, graphicLayer, isFly, callBack) {
        var ptStart = Robin.Map.Geometry.drawPoint(parseFloat(x), parseFloat(y), { wkid: Robin.Setting.GlobalSetting.wkid });
        var circleGeometry = new esri.geometry.Circle(ptStart, {
            "radius": R,
        });
        if (isFly) {
            Robin.Map.Fly2Geometry(Robin.Map.Map2DControl, circleGeometry);
        }
        var graphic = new esri.Graphic(circleGeometry, symbol);
        if (callBack != null) {
            callBack(circleGeometry);
        }
        graphicLayer.add(graphic);
    },
    //让图标飞
    flayCirle: function (map, geometry) {
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
    }
}
