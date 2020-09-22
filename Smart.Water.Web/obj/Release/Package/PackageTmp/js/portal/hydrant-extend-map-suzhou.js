if (!this["Hydrant"]) { Hydrant = {}; }
if (!this["Hydrant.Map"]) { Hydrant.Map = {}; }
var table;


Hydrant.Map.MapTool = {
    //地图拾取点坐标
    getMapPoint: function (callBack) {       
        Robin.Map.Map2DControl.setMapCursor("crosshair");
        var mapHandler = dojo.connect(Robin.Map.Map2DControl, "onClick", function (event) {
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "PointLayer");
            try {
               Robin.Map.Map2DControl.setMapCursor("default");
                callBack(event.mapPoint);
                dojo.disconnect(mapHandler);//事件值执行一次
            } catch (err) { }
        });
    },
    //消火栓相关分析
    hydrantAnalyse: {      
        data: null,
        columns: null,
        //消火栓中心点
        centerPoint:null,
        monitorLocate: function (x, y, R) {
            var map = Robin.Map.Map2DControl;
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
          
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
                Hydrant.Analyse.hydrantAnalyse.queryData(circleGeometry);//执行查询   
                //让圆飞
                Hydrant.Map.MapTool.flayCirle(Robin.Map.Map2DControl, circleGeometry);                
            });
        },
        //要素查询
        queryData: function ( circleGeometry ) {
            NProgress.start();
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
                    queryTask.execute( query, function ( result ) {
                        Hydrant.Analyse.hydrantAnalyse.bindDate(result.features, circleGeometry.center);
                    });                   
                });
                NProgress.done();
            } catch (e) {
                NProgress.done();
                throw (e);
            }
           
        },
        bindDate: function ( data, center ) {//数据绑定
            Robin.Portal.ClusterTool.Point = [];//清空结果
            console.log(data);
            var confignormal = {
                pic: {
                    src: "../images/hydrant/bz-normal.png",
                    width: 24,
                    height: 36
                }
            };
            var configconstruction = {
                pic: {
                    src: "../images/hydrant/bz-construction.png",
                    width: 24,
                    height: 36
                }
            };
            var configdiscard = {
                pic: {
                    src: "../images/hydrant/bz-discard.png",
                    width: 24,
                    height: 36
                }
            };
            var result = Robin.Portal.SystemData.AllList;           
            var showContent = "";
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
            //var hydrantLayer = Robin.Map.GetGraphicLayer( Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName );
            var hydrantLayer = Robin.Map.GetGraphicLayerSetLevel(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName, 2);
            $.each(data, function (i, v) {
                var attributes = v.attributes;
                var x, y, id;
                var pd = "true";
                $.each( result, function ( i, item ) {
                    if (attributes["物探点号"] == item.CODE) {
                        //if (attributes["物探点号"] == item.POINTNO) {宿州使用
                        x = v.geometry.x;
                        x = x.toFixed(2);
                        y = v.geometry.y;
                        y = y.toFixed(2);                       
                        id = x + "," + y;
                        //计算距离
                        var length = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)).toFixed(2);
                        showContent += "<tr id=" + id + ">";
                        showContent += "<td>" + attributes["物探点号"] + "</td>";
                        //showContent += "<td>" + function () { if (attributes["特征"] == null) { return "金属" } else { return attributes["特征"] }}() + "</td>";
                        //showContent += "<td>" + parseFloat(attributes["地面高程"]).toFixed(2) + "</td>";
                        showContent += "<td>" + parseFloat(attributes["井底深"]).toFixed(2) + "</td>";
                        showContent += "<td>" + item.STATUS + "</td>";
                        showContent += "<td>" + length + "</td>";
                        //showContent += "<td style='text-align:center'>" + '<a href="#" onclick="RouteLocation(' + id + ')"><i class="fa fa-level-up fa-lg" title="导航"></i></a>&nbsp&nbsp&nbsp'
                        //    + '<a href="#" onclick="PointLocation(' + id + ')"><i class="fa fa-map-marker fa-lg" title="定位"></i></a></td>';
                        showContent += "<td style='text-align:center'>" +'<a href="#" onclick="PointLocation(' + id + ')"><i class="fa fa-map-marker fa-lg" title="定位"></i></a></td>';
                        showContent += "</tr>";
                        pd = "false"
                        if (item.STATUS == "正常") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);

                            Robin.Map.ShowGraphic( hydrantLayer, '', x, y, confignormal.pic.src, null, confignormal );//普通图层
                            Robin.Portal.ClusterTool.Point.push( { x: parseFloat(x), y: parseFloat(y), attr: {} } );//聚合点图层
                        }
                        if (item.STATUS == "在建") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic( hydrantLayer, '', x, y, configconstruction.pic.src, null, configconstruction );
                            Robin.Portal.ClusterTool.Point.push( { x: parseFloat( x ), y: parseFloat( y ), attr: {} } );
                        }
                        if (item.STATUS == "作废") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic( hydrantLayer, '', x, y, configdiscard.pic.src, null, configdiscard );
                            Robin.Portal.ClusterTool.Point.push( { x: parseFloat( x ), y: parseFloat( y ), attr: {} } );
                        }                                                                      
                    }                     
                });              
                if (pd == "true") {
                    x = v.geometry.x;
                    x = x.toFixed(2);
                    y = v.geometry.y;
                    y = y.toFixed(2);
                    id = x + "," + y;
                  
                    var hei = parseFloat(attributes.地面高程).toFixed(2);

                    showContent += "<tr id=" + id + ">";
                   // showContent += "<td></td>";
                    showContent += "<td>" + attributes.物探点号 + "</td>";
                    showContent += "<td>金属</td>";
                    showContent += "<td>" + hei + "</td>";
                    showContent += "<td>" + attributes.井底深 + "</td>";
                    showContent += "<td></td>";
                    showContent += "<td></td>";
                    showContent += "</tr>";
                    //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                    //显示范围内的点
                    Robin.Map.ShowGraphic( graphicLayer, '', x, y, confignormal.pic.src, null, confignormal );
                    
                }                        
            } );
            this.centerPoint = center;
            Robin.Portal.ClusterTool.Creat("HydrantCluster")
            $("#datadisplayFrame").contents().find("#ResultTable").append(showContent);
        
        },
        //火焰标注
        fireMark: function (point) {
            var canvesId = Robin.Setting.MapAnalyse.hydrant.fireMark.canvesId;
            var windowDivId = Robin.Setting.MapAnalyse.hydrant.fireMark.windowDivId
            //绘制火焰  
            Robin.Map.MapWindow.CloseByID(windowDivId);//关闭上一次的绘制      
            var alarmCanvas = document.createElement('canvas');
            alarmCanvas.style.position = "absolute";
            alarmCanvas.setAttribute("width", "200px");
            alarmCanvas.setAttribute("height", "200px");
            alarmCanvas.style.left = "-40px";
            alarmCanvas.style.top = "-50px";
            alarmCanvas.style.zIndex = 1;
            alarmCanvas.setAttribute("id", canvesId);
            Robin.Map.MapWindow.Show(windowDivId, Robin.Map.Map2DControl, point, alarmCanvas, false);
            $("#" + canvesId + "").drawFlame({ width: 60, height: 100 });
        }
    },
    //画圆
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
    //图标定位延迟效果
    flayCirle: function (map, geometry) {
        var extent = geometry.getExtent();
        if (geometry.type == "point") {
            extent = new esri.geometry.Extent(geometry.x - 0.0000001, geometry.y - 0.0000001, geometry.x - 0 + 0.0000001, geometry.y - 0 + 0.0000001, map.spatialReference);
            extent = extent.expand(3);
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
                    extent = extent.expand(3);
                    map.setExtent(extent);
                }, 1400);
            }
        }
    },
    //地图全图方法
    setExtent:function(){
    var initExtent,
         mapSetting = Robin.Setting.MapSetting,
         config = {
             width: "100%",
             logo: false,
             infoWindow: Robin.Map.Map2DPopup,
             zoom: 2,
             slider: false,          
             fadeOnZoom: true            
         };
    if (mapSetting && mapSetting.initExtent
        && mapSetting.initExtent.xmin
        && mapSetting.initExtent.ymin
        && mapSetting.initExtent.xmax
        && mapSetting.initExtent.ymax) {

        initExtent = new esri.geometry.Extent(parseFloat(mapSetting.initExtent.xmin), parseFloat(mapSetting.initExtent.ymin), parseFloat(mapSetting.initExtent.xmax), parseFloat(mapSetting.initExtent.ymax), new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
    }
    Robin.Map.Map2DControl.setExtent(initExtent);
    },

}

Hydrant.Analyse = {
    //消火栓相关分析
    hydrantAnalyse: {
        data: null,
        columns: null,
        //消火栓中心点
        centerPoint: null,
        monitorLocate: function (x, y, R) {
            var map = Robin.Map.Map2DControl;
            var graphicLayer = Robin.Map.GetGraphicLayerSetLevel(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName,1);

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
                Hydrant.Analyse.hydrantAnalyse.queryData(circleGeometry);//执行查询   
                //让圆飞
                Hydrant.Map.MapTool.flayCirle(Robin.Map.Map2DControl, circleGeometry);
            });
        },
        //要素查询
        queryData: function (circleGeometry) {
            NProgress.start();
            try {
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
                        Hydrant.Analyse.hydrantAnalyse.bindDate(result.features, circleGeometry.center);
                    });
                });
                NProgress.done();
            } catch (e) {
                NProgress.done();
                throw (e);
            }

        },
        bindDate: function (data, center) {//数据绑定
            Robin.Portal.ClusterTool.Point = [];//清空结果
            console.log(data);
            var confignormal = {
                pic: {
                    src: "../images/hydrant/bz-normal.png",
                    width: 24,
                    height: 36
                }
            };
            var configconstruction = {
                pic: {
                    src: "../images/hydrant/bz-construction.png",
                    width: 24,
                    height: 36
                }
            };
            var configdiscard = {
                pic: {
                    src: "../images/hydrant/bz-discard.png",
                    width: 24,
                    height: 36
                }
            };
            var result = Robin.Portal.SystemData.AllList;
            var showContent = "";
            var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
            //var hydrantLayer = Robin.Map.GetGraphicLayer( Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName );
            var hydrantLayer = Robin.Map.GetGraphicLayerSetLevel(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName, 2);
            $.each(data, function (i, v) {
                var attributes = v.attributes;
                var x, y, id;
                var pd = "true";
                $.each(result, function (i, item) {
                    if (attributes["物探点号"] == item.CODE) {
                        x = v.geometry.x;
                        x = x.toFixed(2);
                        y = v.geometry.y;
                        y = y.toFixed(2);
                        id = x + "," + y;
                        //计算距离
                        var length = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)).toFixed(2);
                        showContent += "<tr id=" + id + ">";
                        showContent += "<td>" + attributes["物探点号"] + "</td>";
                        //showContent += "<td>" + function () { if (attributes["特征"] == null) { return "金属" } else { return attributes["特征"] }}() + "</td>";
                        //showContent += "<td>" + parseFloat(attributes["地面高程"]).toFixed(2) + "</td>";
                        showContent += "<td>" + parseFloat(attributes["井底深"]).toFixed(2) + "</td>";
                        showContent += "<td>" + item.STATUS + "</td>";
                        showContent += "<td>" + length + "</td>";
                        //showContent += "<td style='text-align:center'>" + '<a href="#" onclick="RouteLocation(' + id + ')"><i class="fa fa-level-up fa-lg" title="导航"></i></a>&nbsp&nbsp&nbsp'
                        //    + '<a href="#" onclick="PointLocation(' + id + ')"><i class="fa fa-map-marker fa-lg" title="定位"></i></a></td>';
                        showContent += "<td style='text-align:center'>" + '<a href="#" onclick="PointLocation(' + id + ')"><i class="fa fa-map-marker fa-lg" title="定位"></i></a></td>';
                        showContent += "</tr>";
                        pd = "false"
                        if (item.STATUS == "正常") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);

                            Robin.Map.ShowGraphic(hydrantLayer, '', x, y, confignormal.pic.src, item, confignormal);//普通图层
                            Robin.Portal.ClusterTool.Point.push({ x: parseFloat(x), y: parseFloat(y), attr: {} });//聚合点图层
                        }
                        if (item.STATUS == "在建") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic(hydrantLayer, '', x, y, configconstruction.pic.src, item, configconstruction);
                            Robin.Portal.ClusterTool.Point.push({ x: parseFloat(x), y: parseFloat(y), attr: {} });
                        }
                        if (item.STATUS == "作废") {
                            //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                            Robin.Map.ShowGraphic(hydrantLayer, '', x, y, configdiscard.pic.src, item, configdiscard);
                            Robin.Portal.ClusterTool.Point.push({ x: parseFloat(x), y: parseFloat(y), attr: {} });
                        }
                    }
                });
                if (pd == "true") {
                    x = v.geometry.x;
                    x = x.toFixed(2);
                    y = v.geometry.y;
                    y = y.toFixed(2);
                    id = x + "," + y;

                    var hei = parseFloat(attributes.地面高程).toFixed(2);

                    showContent += "<tr id=" + id + ">";
                    // showContent += "<td></td>";
                    showContent += "<td>" + attributes.物探点号 + "</td>";
                    showContent += "<td>金属</td>";
                    showContent += "<td>" + hei + "</td>";
                    showContent += "<td>" + attributes.井底深 + "</td>";
                    showContent += "<td></td>";
                    showContent += "<td></td>";
                    showContent += "</tr>";
                    //var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
                    //显示范围内的点
                    Robin.Map.ShowGraphic(graphicLayer, '', x, y, confignormal.pic.src, null, confignormal);

                }
            });

            //点击消火栓弹窗
            Robin.Map.Event.bindClickEvent(hydrantLayer, function (evt) {
                var hydrantLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.hydrantLayerName);
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

            this.centerPoint = center;
            Robin.Portal.ClusterTool.Creat("HydrantCluster")
            $("#datadisplayFrame").contents().find("#ResultTable").append(showContent);
        },
        //火焰标注
        fireMark: function (point) {
            var canvesId = Robin.Setting.MapAnalyse.hydrant.fireMark.canvesId;
            var windowDivId = Robin.Setting.MapAnalyse.hydrant.fireMark.windowDivId
            //绘制火焰  
            Robin.Map.MapWindow.CloseByID(windowDivId);//关闭上一次的绘制      
            var alarmCanvas = document.createElement('canvas');
            alarmCanvas.style.position = "absolute";
            alarmCanvas.setAttribute("width", "200px");
            alarmCanvas.setAttribute("height", "200px");
            alarmCanvas.style.left = "-40px";
            alarmCanvas.style.top = "-50px";
            alarmCanvas.style.zIndex = 1;
            alarmCanvas.setAttribute("id", canvesId);
            Robin.Map.MapWindow.Show(windowDivId, Robin.Map.Map2DControl, point, alarmCanvas, false);
            $("#" + canvesId + "").drawFlame({ width: 60, height: 100 });
        }
    },
}




