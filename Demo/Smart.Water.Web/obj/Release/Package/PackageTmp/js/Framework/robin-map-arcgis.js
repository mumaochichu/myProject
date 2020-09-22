/**
 * Created by Cellence on 2015/8/19.
 */
//初始化Map命名空间
if (!this["Robin.MapInstance"]) { Robin.MapInstance = {}; }

Robin.MapInstance = {
    mapType: '',
    init: {

    },
    /**
     * @constructor 名称：InitMap
     * @description 作用：初始化地图
     *
     */
    InitMap: function (callback) {
        require([
        "esri/map",
        "esri/geometry/Point",
        "esri/toolbars/navigation",
        "esri/geometry/Circle",
        "esri/geometry/Polygon",
        "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "esri/geometry/jsonUtils",
        "esri/Color",
        "dojo/parser",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/tasks/BufferParameters",
        "dijit/form/Button",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/domReady!"
        ],
            function () {
                // popup dijit configuration
                Robin.Map.Map2DPopup = new esri.dijit.Popup(
                {}, dojo.create("div"));

                // popup theme
                dojo.addClass(Robin.Map.Map2DPopup.domNode, "modernGrey");

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
                    config.extent = initExtent;
                }


                var Main_Map = new esri.Map("Main_Map_DIV", config);
                Robin.Map.Map2DControl = Main_Map;

                if (initExtent) {
                    Robin.Map.Map2DControl.setExtent(initExtent);
                    Robin.Setting.MapSetting.initExtent = Robin.Map.Map2DControl.extent;
                }

                Robin.Setting.MapSetting.zoom = Robin.Map.Map2DControl.getZoom();
                //todo  此处可以加一个loading图标
                //window.setTimeout(function () {
                //    Robin.Map.MapService.AddLayer(Main_Map);
                //    Robin.Map.MapService.GetTopicData();
                //}, 2);


                Robin.Map.MapService.AddLayer(Main_Map);
                Robin.Map.MapService.GetTopicData();

                // 默认设置
                esri.config.defaults.io.proxyUrl = Robin.Setting.GlobalSetting.proxyUrl;
                esri.config.defaults.io.alwaysUseProxy = false;
                esri.config.defaults.io.timeout = Robin.Setting.GlobalSetting.timeout;

                //   updateScale();

                ////加载图层控制
                Robin.Application.LoadCSS("../js/jQuery/Plugins/zTree/css/bootstrap/metro.css");




                //if (callback != undefined && $.isFunction(callback)) {
                //    callback();
                //}

                if (Robin.Setting.MapSetting.custom) {

                    var error = RequireJS.onError;

                    RequireJS.onError = function () {

                        RequireJS.onError = error;
                    }

                    RequireJS([Robin.Setting.MapSetting.custom], function () {
                        if (Robin.Map.customInit && $.isFunction(Robin.Map.customInit)) {
                            Robin.Map.customInit(Main_Map);

                            if (callback != undefined && $.isFunction(callback)) {
                                callback();
                            }
                        }
                    });

                } else {
                    if (callback != undefined && $.isFunction(callback)) {
                        callback();
                    }
                }
            }
        );
    },


    /**
     * 地图操作工具类
     */
    Tool: {

        /**
         * 返回屏幕坐标
         * @param {Object} mapPoint 地图点对象
         */
        toScreen: function (mapPoint) {
            return Robin.Map.Map2DControl.toScreen(mapPoint);
        },

        /**
         * 名称：GetLightMap
         * 作用：获取一个简单的地图控件
         * 作者：刘壮（20151014）
         */
        GetLightMap: function (container, id, url, layerType) {
            var map = new esri.Map(
                container,
                {
                    width: "100%",
                    logo: false,
                    zoom: 1,
                    slider: false,
                    fadeOnZoom: true
                });
            map.addLayer(this.GetLayer(id, url, layerType));
            return map;
        },

        /**
         * @constructor 名称：LightMap
         */
        LightMap: {
            mapControl: null,
            clickEvent: null,
            _tempLayer: "临时图层",

            /**
             * @constructor 名称：init
             * @description 作用：初始化地图
             */
            init: function (container, id, url, layerType) {
                var LightMap = Robin.Map.Tool.LightMap;

                LightMap.mapControl = new esri.Map(
                container,
                {
                    width: "100%",
                    logo: false,
                    zoom: 1,
                    slider: false,
                    fadeOnZoom: true
                });
                LightMap.mapControl.addLayer(Robin.Map.Tool.GetLayer(id, url, layerType));
            },

            /**
             * @constructor 名称：clearTempLayer
             * @description 作用：清空临时图层
             */
            clearTempLayer: function () {
                var LightMap = Robin.Map.Tool.LightMap;

                Robin.Map.Tool.ClearLayer(LightMap.mapControl, LightMap._tempLayer);
            },
            /**
             * @constructor 名称：bindClick
             * @description 作用：绑定地图事件
             */
            bindClick: function (fn) {
                var LightMap = Robin.Map.Tool.LightMap;

                dojo.disconnect(LightMap.clickEvent);
                if (LightMap.mapControl) {
                    LightMap.clickEvent = dojo.connect(LightMap.mapControl, "onClick", function (evn) {
                        var mapPoint = evn.mapPoint;
                        var graphicPoint = Robin.Map.Tool.GetGraphicByGeometry(mapPoint);
                        var tempLayer = Robin.Map.Tool.GetGraphicLayer(LightMap.mapControl, LightMap._tempLayer);
                        tempLayer.clear();
                        tempLayer.add(graphicPoint);
                        if ($.isFunction(fn)) {
                            fn(mapPoint.x, mapPoint.y);
                        }
                    });
                }
            },

            /**
             * @constructor 名称：unBindClick
             * @description 作用：解除绑定
             */
            unBindClick: function () {
                var LightMap = Robin.Map.Tool.LightMap;

                dojo.disconnect(LightMap.clickEvent);
            },

            /**
             * @constructor 名称：markClick
             * @description 作用：标注
             */
            markClick: function (fn) {
                var LightMap = Robin.Map.Tool.LightMap;

                dojo.disconnect(LightMap.clickEvent);
                if (LightMap.mapControl) {
                    LightMap.clickEvent = dojo.connect(LightMap.mapControl, "onClick", function (evn) {
                        var mapPoint = evn.mapPoint;
                        var graphicPoint = Robin.Map.Tool.GetGraphicByGeometry(mapPoint);
                        var tempLayer = Robin.Map.Tool.GetGraphicLayer(LightMap.mapControl, LightMap._tempLayer);
                        tempLayer.add(graphicPoint);
                        if ($.isFunction(fn)) {
                            fn(mapPoint.x, mapPoint.y);
                        }
                    });
                }
            },


            /**
            * @constructor 名称：confirm
            * @description 作用：confirm提示.需要提前加载noty.这个方法放在utils里会报错
            * 需要引用js/Bootstrap/Version3/css/bootstrap-button.css，js/Noty/packaged/jquery.noty.packaged.min.js
            * @param message 提示的内容
            * @param type 类型information,alert,error,success,warning
            * @param okCallback yes执行的方法
            * @param cancelCallback no执行的方法
            * @param lblok yes显示的内容
            * @param lblcancel no显示的内容
            * @constructor
            */
            confirm: function (message, type, okCallback, cancelCallback, lblok, lblcancel) {

                if (!noty) {

                    alert("请检查插件是否加载成功！");
                    return;
                }

                var _default =
                {
                    text: message || "您确定要删除所选对象吗?",
                    type: type || "alert",
                    dismissQueue: true,
                    modal: true,
                    layout: "center",
                    buttons: [
                        {
                            addClass: 'btn btn-primary',
                            text: lblok || "确定",
                            onClick: function ($noty) {
                                $noty.close();
                                if (okCallback && $.isFunction(okCallback)) {

                                    okCallback();
                                }
                            }
                        },
                        {
                            addClass: 'btn btn-warning',
                            text: lblcancel || "取消",
                            onClick: function ($noty) {
                                $noty.close();
                                if (cancelCallback && $.isFunction(cancelCallback)) {

                                    cancelCallback();
                                }
                            }
                        }
                    ]
                };

                noty(_default);
            },

            /**
            * @constructor 名称：locate
            * @description 作用：定位
            */
            locate: function (x, y, zoom) {
                if (!x || !$.isNumeric(x) || !y || !$.isNumeric(y)) {
                    return;
                }
                var map = Robin.Map.Tool.LightMap.mapControl;
                if (!map) {

                    return;
                }
                var point = new esri.geometry.Point([parseFloat(x), parseFloat(y)], new esri.SpatialReference({ wkid: top.Robin.Setting.GlobalSetting.wkid }));
                var graphic = Robin.Map.Tool.GetGraphicByGeometry(point);
                var layer = Robin.Map.Tool.GetGraphicLayer(LightMap.mapControl, LightMap._tempLayer);
                if (layer) {
                    layer.clear();
                    //map.removeLayer(layer);
                }

                //layer = new esri.layers.GraphicsLayer();
                //map.addLayer(layer);
                layer.add(graphic);
                if (zoom) {
                    zoom = 1;
                }
                map.centerAndZoom(point, zoom); //todo map.getMaxZoom()会返回-1

            }


        },


        /**
         * 名称：BindClick
         * 作用：绑定地图点击事件
         * 作者：刘壮（20151019）
         */
        BindMapClick: function (map, fn) {
            var click;
            if (map && fn && $.isFunction(fn)) {

                click = dojo.connect(map, "onClick", function (evt) {
                    fn(evt);
                });
            }
            return click;
        },


        /**
         * 名称：UnBindMapClick
         * 作用：解除绑定地图点击事件
         * 作者：刘壮（20151019）
         */
        UnBindMapClick: function (ev) {
            if (ev) {
                dojo.disconnect(ev);
            }
        },


        /**
         * 返回屏幕坐标
         * @param {Object} mapPoint 地图点对象
         */
        GetSreenPoint: function (map, mapPoint) {
            return map.toScreen(mapPoint);
        },

        /**
         * 名称: Fly2Geometry
         * 作用: 缩放到某个图形范围
         * 作者：刘壮（20150105）
         */
        Fly2Geometry: function (map, geometry, completed) {
            if (map != null && map.extent != null && geometry != null) {
                var extent = geometry.getExtent();
                if (geometry.type == "point") {
                    extent = new esri.geometry.Extent(geometry.x - 0.0000001, geometry.y - 0.0000001, geometry.x + 0.0000001, geometry.y + 0.0000001, map.spatialReference);
                    extent = extent.expand(1.5);
                }
                if (extent != null) {
                    var point = new esri.geometry.Point(extent.xmin + (extent.xmax - extent.xmin) / 2, extent.ymin + (extent.ymax - extent.ymin) / 2, map.spatialReference);
                    var newExtent = new esri.geometry.Extent(point.x, point.y, point.x, point.y, point.spatialReference);
                    //如果当前视图包含要缩放视图
                    if (Robin.Map.Extent1ContainExtent2(map.extent, extent)) {
                        map.setExtent(extent);
                        if (completed != null && $.isFunction(completed)) {
                            completed();
                        }
                    } else {
                        var firstEx = Robin.Map.Union2Extent(newExtent, map.extent);
                        map.setExtent(firstEx, true);
                        setTimeout(function () {
                            map.centerAt(point)
                        }, 700);
                        setTimeout(function () {
                            map.setExtent(extent);
                            if (completed != null && $.isFunction(completed)) {
                                completed();
                            }
                        }, 1400);
                    }
                }
            }
        },

        /**
         * 名称: IsExtent1ContainExtent2
         * 作用: 判断第一个图形是否包含第二个图形
         * 作者：刘壮（20150105）
         */
        IsExtent1ContainExtent2: function (extent1, extent2) {
            var isContain = false;
            if (extent1.xmin < extent2.xmin
                && extent1.ymin < extent2.ymin
                && extent1.xmax > extent2.xmax
                && extent1.ymax > extent2.ymax) {
                isContain = true;
            }
            return isContain;

        },

        /**
         * 名称: Union2Extent
         * 作用: 合并两个矩形范围为一个包含两个的矩形范围
         * 作者：刘壮（20150105）
         */
        Union2Extent: function (extent1, extent2) {
            var newExtent = new esri.geometry.Extent(extent1.xmin, extent1.ymin, extent1.xmax, extent1.ymax, extent1.spatialReference);
            if (extent1 != null && extent2 != null) {
                newExtent.xmax = (extent1.xmax > extent2.xmax ? extent1.xmax : extent2.xmax);
                newExtent.xmin = (extent1.xmin < extent2.xmin ? extent1.xmin : extent2.xmin);
                newExtent.ymax = (extent1.ymax > extent2.ymax ? extent1.ymax : extent2.ymax);
                newExtent.ymin = (extent1.ymin < extent2.ymin ? extent1.ymin : extent2.ymin);
            }
            return newExtent;
        },

        /**
         * 名称: GetFullExtentFromPoints
         * 作用: 根据一系列点计算得出这些点的最大范围
         * 作者：刘壮（20150105）
         * @param {Array} points 点的数组,形如[[x1,y1],[x2,y2],[x3,y3]...]
         */
        GetFullExtentFromPoints: function (map, points) {
            var xmax = 0, ymax = 0, xmin = 0, ymin = 0;
            if (points && points.length > 0) {
                xmax = points[0].x; xmin = points[0].x; ymax = points[0].y; ymin = points[0].y;
                for (var i = 0; i < points.length; i++) {
                    xmax = xmax > points[i].x ? xmax : points[i].x;
                    ymax = ymax > points[i].y ? ymax : points[i].y;
                    xmin = xmin > points[i].x ? points[i].x : xmin;
                    ymin = ymin > points[i].y ? points[i].y : ymin;
                }
            }
            var extent = new esri.geometry.Extent(parseFloat(xmin - 1000), parseFloat(ymin - 1000), parseFloat(xmax + 1000), parseFloat(ymax + 1000), map.spatialReference);
            return extent;
        },

        /**
         * 名称: GetLayer
         * 作用: 根据图层类型 和图层地址创建一个地图图层
         * 作者：刘壮（20150105）
         */
        GetLayer: function (id, url, layerType) {
            var layer;
            switch (layerType) {
                case "ArcGISDynamicMapServiceLayer":
                    layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, id);
                    break;
                case "ArcGISImageServiceLayer":
                    layer = new esri.layers.ArcGISImageServiceLayer(url, id);
                    break;
                case "ArcGISTiledMapServiceLayer":
                    layer = new esri.layers.ArcGISTiledMapServiceLayer(url, id);
                    break;
                default: break;
            }
            return layer;
        },

        /**
         * 名称: ClearLayer
         * 作用: 根据id清空临时图层，并将该临时图层删除
         * 作者：刘壮（20141231）
         */
        ClearLayer: function (map, id) {
            if (map != null) {
                var tempLayer = map.getLayer(id);
                if (tempLayer != null) {
                    tempLayer.clear();
                    map.removeLayer(tempLayer);
                }
            }
        },

        /**
         * 名称: GetGraphic
         * 作用: 获取一个图形（备注：可能和上面的Geometry重复）
         * 作者：刘壮（20150831）
         */
        GetGraphic: function (geometry, symbol, attribute) {
            var graphic = new esri.Graphic(geometry, symbol, attribute);
            return graphic;
        },

        /**
         * 名称: GetGraphicLayer
         * 作用: 根据id获取一个临时图层，如果没有则创建一个
         * 作者：刘壮（20141231）
         */
        GetGraphicLayer: function (map, id) {
            var myGraphicLayer = map.getLayer(id);
            if (myGraphicLayer == null) {
                myGraphicLayer = new esri.layers.GraphicsLayer({ id: id });
                map.addLayer(myGraphicLayer);
            }
            return myGraphicLayer;
        },

        /**
         * 名称: GetGraphicByGeometry
         * 作用: 根据传入的图形类型自动符号化
         * 作者：刘壮（20141231）
         */
        GetGraphicByGeometry: function (geometry) {
            var graphic = null;
            //point | multipoint | polyline | polygon | extent
            switch (geometry.type) {
                case "point": case "multipoint":
                    graphic = new esri.Graphic(geometry, Robin.Map.Symbol.markSymbol());
                    break;
                case "polyline":
                    graphic = new esri.Graphic(geometry, Robin.Map.Symbol.lineSymbol());
                    break;
                case "polygon": case "extent":
                    graphic = new esri.Graphic(geometry, Robin.Map.Symbol.fillSymbol());
                    break;
                default: break;
            }
            return graphic;
        },

        /**
         * 计算一组点的距离（仅适用于投影坐标系）
         * Robin.Map中也有此方法,需同步修改 
         * @param {Array} points 点的数组，形如[[x1,y1],[x2,y2],[x3,y3]...]
         * @param {Number} precision  计算结果的小数位数
         */
        Distance: function (points, precision) {

            // 如果参数不是数组或未包含点返回-1
            if (!$.isArray(points) || !points.length) {

                return -1;
            }

            var array = points, length = array.length, distance = 0, start, end, x, y, i, times;

            // 如果参数只包含一个元素，把[0,0]插入作为第一个元素
            if (length == 1) {

                array = array.unshift([0, 0]);
            } else {

                // 判断第一个元素是否符合要求
                start = array[0];
                if (start.length != 2 || !$.isNumeric(start[0]) || !$.isNumeric(start[1])) {

                    return -1;
                }
            }

            // 循环计算出距离
            for (i = 1; i < length; i++) {

                start = array[i - 1];
                end = array[i];

                // 判断终点元素是否符合要求
                if (end.length != 2 || !$.isNumeric(end[0]) || !$.isNumeric(end[1])) {

                    return -1;
                }

                x = end[0] - start[0];
                y = end[1] - start[1];

                distance += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            }

            // 小数处理
            if (!precision || parseInt(precision) != precision) {

                precision = 2;
            }

            times = Math.pow(10, precision);

            distance = Math.round(distance * times) / times;
            return distance;
        }

    },

    Query: function (url, fieldName, fieldValue, callback) {
        //查询arcGis数据
        var queryTask = new esri.tasks.QueryTask(url);
        // 创建查询Task
        var query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = fieldName + " = '" + fieldValue + "'";

        queryTask.execute(
            query,
             // 查询成功
            function (datas) {

                callback(datas);

            },
            // 查询错误
            function (err) {

            });

    },
    Search: {

    },
    Printing: {

    },
    Analysis: {

    },
    Geometry: {

        /*
        * @constructor 名称：绘制点
        * @description 作用：绘制点符号  
        * @augments param x 
        * @augments param y 
        * @augments param option 选项，包括icon等属性
        */
        drawPoint: function (x, y, option) {

            var point = new esri.geometry.Point(parseFloat(x), parseFloat(y), new esri.SpatialReference({ wkid: option.wkid }));

            return point;
        },

        /**
         * @constructor 名称：drawPolygon
         * @description 作用：绘制多边形，并返回多边形的点集合
         * 
         */
        drawPolygon: function (option) {

            return new esri.geometry.Polygon(new esri.SpatialReference({ wkid: option.wkid }));

        },
        /**
        * @constructor 名称：drawPolyline
        * @description 作用：绘制线
        * 
        */
        drawPolyline: function (option) {

            return esri.geometry.Polyline(new esri.SpatialReference({ wkid: option.wkid }));
        },
        /**
        * @constructor 名称：drawGraphic
        * @description 作用：绘制图形 
        * 
        */
        drawGraphic: function (geometry, symbol, attributes, infoTemplate) {

            return new esri.Graphic(geometry, symbol, attributes, infoTemplate);
        }

    },
    /**
     * @constructor 名称：Event
     * @description 作用：地图事件
     */
    Event: {


        /**
          * @constructor 名称：绑定图层事件
          * @description 作用：点击图层事件 
          * @augments param layer 图层
          * @augments param eventName 事件名称
          * @augments param callback 回调函数 返回数据为事件属性
          */
        bindClickEvent: function (layer, callback) {
            /*绑定点击事件*/
            dojo.connect(layer, "onClick", function (evt) {

                var evtAttributes = {
                    x: evt.x || evt.clientX,
                    y: evt.y || evt.clientY,
                    // id: evt.graphic.attributes.BMID,
                    graphic: evt.graphic,
                    attributes: evt.graphic.attributes

                };
                if (callback != undefined && $.isFunction(callback)) {
                    callback(evtAttributes);
                }
            });
        }
    },
    /**

   * 地图服务,用于图层控制及显示
   */
    MapService: {
        //专题图层容器id
        themeLayerContainerId: 'tabs-MapServer',
        //图层控制容器id
        layerControlContainerId: 'tabs-LayerControl',
        //地图
        map: null,
        //资源目录数据
        GlobalTopics: [],
        //资源目录矢量数据
        GlobalDynamicTopics: [],
        //标记
        tag: true,
        //加载linquidgis还是arcgis
        LoadType: 1,
        //获取资源目录地址
        TopicUrl: "/LiquidGIS/Catalog.gis?REQUEST=GetTopicUserResource&format=json&cb=mapRequestCallback",
        //全局地图服务
        GlobalMapService: [],
        /**
         * @constructor 名称：init
         * @description 作用：初始化
         */
        init: function (map) {
            Robin.Map.MapService.map = map;
            Robin.Map.MapService.TopicUrl = Robin.Setting.GlobalSetting.SystemService + Robin.Map.MapService.TopicUrl;
            if (Robin.Setting.LiquidGISMapServices.length > 0) {
                Robin.Map.MapService.LoadType = 1;
            }
            else {
                Robin.Map.MapService.LoadType = 2;
            }
            switch (Robin.Map.MapService.LoadType) {
                case 1:
                    Robin.Map.MapService.AddLayer(Robin.Setting.LiquidGISMapServices);
                    Robin.Map.MapService.AddViewMaps(Robin.Setting.LiquidGISMapServices);
                    Robin.Map.MapService.GetTopicData();
                    break;
            }

        },
        /**
         * @constructor 名称：map
         * @description 作用：图层控制
         */
        AddViewMaps: function (map) {
            //加载共享服务平台
            Robin.Map.MapService.map = map;
            var mapServices = Robin.Setting.LiquidGISMapServices;
            var divobj = $("#" + Robin.Map.MapService.themeLayerContainerId);
            $.each(mapServices, function (i, v) {
                var $div = $(' <div class="mapone"></div>');
                var $a = $(' <a href="javascript:void(0);"></a>');
                var $img = $('<img ></img>');
                var txt = '移除服务';
                if (v.Visible == "false") {
                    txt = '添加服务';
                }
                //var $sliderdiv = $('<div class="sid_box" ><button class="btn-mini" type="button" id="btn_' + v.ID + '" onclick=\'Robin.Map.MapService.RemoveAddService(\"' + v.ID + '\");\'>' + txt + '</button><div class="slider"></div></div>');
                var $sliderdiv = $('<div class="sid_box" ><div class="slider"></div></div>');
                var $childDiv = $('<div class="maptwo" ></div>');
                var $span = $("<span class='mapthree'></span>");
                $span.text(v.Name);
                $childDiv.append($span[0].outerHTML);
                $img.attr("src", v.Icon);
                $a.append($img[0].outerHTML);
                $div.append($a[0].outerHTML);
                $($sliderdiv.find(".slider")[0]).attr("va", v.ID.toLowerCase());
                $div.append($sliderdiv[0].outerHTML);
                $div.append($childDiv[0].outerHTML);
                $(divobj).append($div[0].outerHTML);
            });
            $(".slider").slider({
                range: "min",
                min: 0,
                max: 100,
                value: 100,
                change: function (event, ui) {
                    if (!Robin.Map.MapService.tag) {
                        Robin.Map.MapService.ChangeOpacity($(this).attr("va"), ui.value, $(this));
                    }

                }
            });

            //设置图层是否显示
            $.each(mapServices, function (i, v) {
                if (v.Visible == "false") {
                    Robin.Map.MapService.ChangeSlider(v.ID, 0);

                }
            });
            this.tag = false;



        },

        /**
         * @constructor 名称：ChangeSlider
         * @description 作用：改变进度条
         */
        ChangeSlider: function (id, value) {
            var sliderObj = $("div[va=" + id.toLowerCase() + "]")[0];
            $(sliderObj).slider("value", value);
        },

        /**
         * @constructor 名称：AddResourceMaps
         * @description 作用：添加图层控制树
         * 
         * @param nodes
         */
        AddResourceMaps: function (nodes) {

            var setting = {
                check:
                {
                    enable: true
                },
                data:
                {
                    simpleData:
                    {
                        enable: true
                    }
                },
                callback: {
                    onNodeCreated: Robin.Map.MapService.ZTreeOnNodeCreated,
                    onCheck: Robin.Map.MapService.ZTreeOnCheck
                }

            };


            $.fn.zTree.init($("#" + Robin.Map.MapService.layerControlContainerId + "_tree"), setting, Robin.Map.MapService.GlobalTopics);

        },
        /**
         * @constructor 名称：AddLayer
         * @description 作用：添加图层服务
         * 
         * @param map
         */
        AddLayer: function (map) {

            Robin.Map.MapService.map = map;
            var mapServices = Robin.Setting.LiquidGISMapServices;
            var layerdymac, url;
            var userkey = Robin.Setting.GlobalProperty.Query.userKey;
            userkey = userkey ? userkey.substr(1) : '';
            var enableUserKey = Robin.Setting.MapSetting.enableUserKey;

            $.each(mapServices, function (i, v) {
                switch (v.MapLayerType) {
                    //矢量
                    case "ArcGISDynamicMapServiceLayer":

                        Robin.Map.MapService.AddDynamicLayerUrl(v);
                        break;

                        //图片
                    case "ArcGISImageServiceLayer"://这里拼接userkey可能有误，待使用时需要检查
                        url = path + v.Url + (enableUserKey ? '&' + userkey : '');
                        layerdymac = new esri.layers.ArcGISImageServiceLayer(url, { id: v.ID });

                        if (v.Visible == "false") {
                            layerdymac.setVisibility(false);
                        }
                        Robin.Map.MapService.map.addLayer(layerdymac, v.ID);
                        Robin.Map.MapService.GlobalMapService.push({ id: v.ID, TopicCode: v.ServiceTopic, layer: layerdymac, name: v.Name, type: 'image', index: v.ID });
                        break;

                        //瓦片
                    default:
                        url = Robin.Setting.GlobalSetting.SystemService + v.Url + (enableUserKey ? '?' + userkey : '');

                        layerdymac = new esri.layers.ArcGISTiledMapServiceLayer(url, { id: v.ID });

                        if (v.Visible == "false") {
                            layerdymac.setVisibility(false);
                        }
                        Robin.Map.MapService.map.addLayer(layerdymac, v.ID);
                        Robin.Map.MapService.GlobalMapService.push({ id: v.ID, TopicCode: v.ServiceTopic, layer: layerdymac, name: v.Name, type: 'tiled', index: v.ID });
                        break;
                }
            });


        },

        /**
         * @constructor 名称：AddDynamicLayerUrl
         * @description 作用：创建动态图层服务地址
         * 
         * @param v
         */
        AddDynamicLayerUrl: function (v) {

            var topicId = v.ServiceTopic, serviceID = v.ID;

            // 请求地址 todo 这里直接放在浏览器是可以得到结果的，但是在登陆过的页面就会返回没有权限
            var topicRequestUrl =
                Robin.Setting.GlobalSetting.SystemService +

                "/LiquidGIS/Catalog.gis?REQUEST=GetUserResourcesByTopicCode&PARAMETERS=" + topicId + "&format=json&cb=getTopicResourceByCodeCallBack";

            // 发送请求
            $.getScript(topicRequestUrl);
            // 根据资源目录获取下面所有的资源回调函数
            getTopicResourceByCodeCallBack = function (data) {
                var currentMapService = 0;
                if (!data) {
                    return;
                }
                $.each(Robin.Setting.LiquidGISMapServices, function (i, v) {
                    if (data.length && v.ServiceTopic == data[0].TopicCode) {
                        currentMapService = v;
                        return false;
                    }

                });

                var flag;
                var names = '';
                $.each(data, function (i, v) {
                    names += v.ResourceTarget + ',';

                });
                if (names.length > 0) {
                    names = names.substring(0, names.length - 1);
                    names += '.gis';
                }
                var userkey = Robin.Setting.GlobalProperty.Query.userKey;
                userkey = (Robin.Setting.MapSetting.enableUserKey ? '?' + userkey.substr(1, userkey.length - 2) : '');

                var url = Robin.Setting.GlobalSetting.SystemService + "/ArcGIS/MapService/Catalog/" + names + userkey;
                var layerdymac = new esri.layers.ArcGISDynamicMapServiceLayer(url, { id: currentMapService.ID });
                if (currentMapService.Visible == "false") {
                    layerdymac.setVisibility(false);
                }
                Robin.Map.MapService.map.addLayer(layerdymac, currentMapService.ID);
                Robin.Map.MapService.GlobalMapService.push({ id: currentMapService.ID, TopicCode: currentMapService.ServiceTopic, layer: layerdymac, name: currentMapService.Name, type: 'dynamic', index: currentMapService.ID });

            };
        },
        /**
         * @constructor 名称：GetTopicData
         * @description 作用：获得资源目录数据并过滤
         */
        GetTopicData: function () {
            var zNodes = [];
            var node = null;
            var userkey = Robin.Setting.GlobalProperty.Query.userKey;
            userkey = (Robin.Setting.MapSetting.enableUserKey ? '&' + userkey.substr(1, userkey.length - 2) : '');
            var url = Robin.Setting.GlobalSetting.SystemService + this.TopicUrl + userkey;
            // 发送请求
            $.getScript(url);

            // 回调函数
            mapRequestCallback = function (data) {
                var maps = data;
                $.each(maps.TopicItems, function (i, v) {
                    node = new Object();
                    node.id = v.TopicCode;
                    node.pId = "0";
                    node.name = v.TopicName;
                    node.obj = v;
                    zNodes.push(node);
                    Robin.Map.MapService.AddChildResource(node.id, v, zNodes);
                });
                //筛选zNodes
                var topics = new Array();

                $.each(zNodes, function (ii, item) {
                    $.each(Robin.Setting.LiquidGISMapServices, function (i, v) {
                        //过滤存在的topic
                        if (v.ServiceTopic == item.id) {
                            //获得父节点
                            $.each(Robin.Map.MapService.GetParentNode(item, zNodes, new Array()), function (pi, pv) {
                                //不存在
                                if ($.inArray(pv, topics) <= -1) {
                                    topics.push(pv);
                                    if (v.Url == '') {
                                        Robin.Map.MapService.GlobalDynamicTopics.push(pv);
                                    }
                                }
                            });
                            topics.push(item);
                            if (v.Url == '') {
                                Robin.Map.MapService.GlobalDynamicTopics.push(item);
                                //获得子节点
                                $.each(Robin.Map.MapService.GetChildNode(item, zNodes), function (ci, cv) {
                                    Robin.Map.MapService.GlobalDynamicTopics.push(cv);

                                });
                            }
                            //获得子节点
                            $.each(Robin.Map.MapService.GetChildNode(item, zNodes), function (ci, cv) {
                                topics.push(cv);
                            });
                            return false;
                        }
                        //过滤存在的瓦片
                        if (v.Url != '') {
                            var url = v.Url.toLowerCase().replace('/tile/arcgisrest/', '');
                            url = $.trim(url.replace('.gis', ''));
                            if (url == item.id.toLowerCase()) {
                                //获得父节点
                                $.each(Robin.Map.MapService.GetParentNode(item, zNodes, new Array()), function (pi, pv) {
                                    //不存在
                                    if ($.inArray(pv, topics) <= -1) {
                                        topics.push(pv);
                                    }
                                });
                                topics.push(item);
                            }
                        }
                    });
                });

                Robin.Map.MapService.GlobalTopics = topics;
                //   Robin.Map.MapService.AddResourceMaps(topics);


            };
        },
        /**
         * @constructor 名称：AddChildResource
         * @description 作用：添加资源目录下的资源信息
         * 
         * @param parentId, topic, zNodes
         */
        AddChildResource: function (parentId, topic, zNodes) {
            var node = null;
            var items = topic.TopicItems;
            var resources = topic.ResourceItems;
            if (items && items.length > 0) {
                $.each(items, function (i, v) {

                    node = new Object();
                    node.id = v.TopicCode;
                    node.pId = parentId;
                    node.name = v.TopicName;
                    node.obj = v;
                    zNodes.push(node);
                    Robin.Map.MapService.AddChildResource(node.id, v, zNodes);

                });
            } else {
                //添加resources
                if (resources && resources.length > 0) {

                    $.each(resources, function (i, v) {
                        node = new Object();
                        //瓦片
                        if (v.LayerType == "Tile") {
                            node.id = parentId + "_" + v.ResourceTarget;
                        }
                        else {
                            node.id = parentId + "_" + v.LayerID;
                        }

                        node.pId = parentId;
                        node.name = v.ResourceTitle;
                        node.obj = v;
                        zNodes.push(node);
                    });



                }
            }
        },

        /**
         * @constructor 名称：RemoveAddService
         * @description 作用：移除服务
         * 
         * @param id
         */
        RemoveAddService: function (id) {
            var topicCode;
            var layer = Robin.Map.MapService.map.getLayer(id);


            //添加服务
            if (!layer.visible) {
                layer.setVisibility(true);
                $.each(Robin.Map.MapService.GlobalMapService, function (i, v) {
                    if (v.id == id) {
                        topicCode = v.TopicCode;
                        $("#btn_" + id).text("移除服务");


                        //将图层所有layerinfo可见
                        var ids = [];
                        if (v.type == "dynamic") {
                            $.each(v.layer.layerInfos, function (ii, vv) {
                                ids.push(vv.id);
                            });
                            layer.setVisibleLayers(ids);
                        }
                        Robin.Map.MapService.ChangeSlider(v.id, 100);

                        return false;
                    }
                });
                //树节点选中
                $.each($.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").getCheckedNodes(false), function (fi, fitem) {
                    if (topicCode.toLowerCase() == fitem.id.toLowerCase()) {
                        $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").checkNode(fitem, true, true);
                    }
                });

            }
            else {
                $("#btn_" + id).text("添加服务");
                Robin.Map.MapService.ChangeSlider(id, 0);
                layer.setVisibility(false);

                $.each(Robin.Map.MapService.GlobalMapService, function (i, v) {
                    if (v.id == id) {
                        topicCode = v.TopicCode;
                        return false;
                    }
                });


                //树节点不选中
                $.each($.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").getCheckedNodes(true), function (fi, fitem) {
                    if (topicCode.toLowerCase() == fitem.id.toLowerCase()) {
                        $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").checkNode(fitem, false, true);
                    }
                });

            }

        },

        /**
         * @constructor 名称：ChangeOpacity
         * @description 作用：改变透明度
         * 
         * @param layerId, value, slidobj
         */
        ChangeOpacity: function (layerId, value, slidobj) {


            var layer = this.map.getLayer(layerId);
            //var topicCode='';

            //如果不可见
            if (!layer.visible) {
                layer.setVisibility(true);
                //$.each(Robin.Map.MapService.GlobalMapService, function (i, v) {
                //    if (v.id == id) {
                //        topicCode = v.TopicCode;


                //        return false;
                //    }
                //});
                ////树节点选中
                //$.each($.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").getCheckedNodes(false), function (fi, fitem) {
                //    if (topicCode.toLowerCase() == fitem.id.toLowerCase()) {
                //        $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").checkNode(fitem, true, true);
                //    }
                //});
            }

            layer.setOpacity(value / 100);
        },

        /**
         * @constructor 名称：ChangeLayerVisible
         * @description 作用：改变图层是否可见
         * 
         * @param layerId, isVisible
         */
        ChangeLayerVisible: function (layerId, isVisible) {
            var layerIds = Robin.Map.MapService.map.layerIds;
            var layer;

            //layerId 形式 动态图层一般是 专题+layerid 如E01_401
            var flag = false;

            //首先判读地图中是否存在图层服务
            $.each(layerIds, function (i, v) {
                if (v == layerId) {
                    //存在
                    flag = true;

                }
            });
            //如果存在
            if (flag) {
                //
                layer = Robin.Map.MapService.map.getLayer(layerId);
                //设置是否可见
                layer.setVisibility(isVisible);
            }
            if (isVisible) {
                Robin.Map.MapService.ChangeSlider(layerId, 100);

            }
            else {
                Robin.Map.MapService.ChangeSlider(layerId, 0);
            }
        },

        /**
         * @constructor 名称：GetChildNode
         * @description 作用：获得子节点
         * 
         * @param node, zNodes
         */
        GetChildNode: function (node, zNodes) {
            var childNodes = new Array();
            $.each(zNodes, function (i, v) {
                if (v.pId == node.id) {
                    childNodes.push(v);
                }
            });
            return childNodes;
        },

        /**
         * @constructor 名称：GetParentNode
         * @description 作用：获得父节点
         * 
         * @param node, zNodes, parentNodes
         */
        GetParentNode: function (node, zNodes, parentNodes) {

            $.each(zNodes, function (i, v) {
                if (v.id == node.pId) {
                    parentNodes.push(v);
                    Robin.Map.MapService.GetParentNode(v, zNodes, parentNodes);

                }
            });
            return parentNodes;
        },

        /**
         * @constructor 名称：ZTreeOnNodeCreated
         * @description 作用：节点创建时
         * 
         * @param event, treeId, treeNode
         */
        ZTreeOnNodeCreated: function (event, treeId, treeNode) {
            //选中配置文件可见的图层
            $.each(Robin.Setting.LiquidGISMapServices, function (i, v) {
                if (v.Visible == "true") {
                    //主题
                    if (v.ServiceTopic != '') {
                        if (v.ServiceTopic == treeNode.id) {
                            $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").checkNode(treeNode, true, true);
                        }
                    }
                    else {
                        //资源
                        var url = v.Url.toLowerCase().replace('/tile/arcgisrest/', '');
                        url = $.trim(url.replace('.gis', ''));
                        if (url == treeNode.id.toLowerCase()) {
                            $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").checkNode(treeNode, true, true);
                        }
                    }
                }
            });
            $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree").expandNode(treeNode);
            return treeNode;
        },


        /**
        * @constructor 名称：SelectedFirstNode
        * @description 作用：选中第一个节点
        * 
        * @param treeNode, layerIds
        */
        SelectedFirstNode: function (treeNode) {

          
            var currentNode = treeNode.children;
            while (currentNode != undefined) {
                $.each(currentNode, function (ii, vv) {
                    if (vv.id.indexOf('_') > -1) {
                        pr = true;
                        Robin.Map.MapService.ZTreeOnCheck(null, "", vv);
                        currentNode = undefined;
                        return false;
                    }
                    else {
                        //Robin.Map.MapService.SelectedFirstNode(vv);
                        currentNode = vv.children;
                    }
                });
            }
        },

        /**
         * @constructor 名称：ExistHasChildNode
         * @description 作用：判断选中节点是否有孩子节点
         * 
         * @param treeNode, layerIds
         */
        ExistHasChildNode: function (treeNode, layerIds) {

            if (treeNode.children == undefined) {
                //表示treeNode是子节点
                layerIds.push(treeNode.id.toLowerCase());
            }
            else {
                $.each(treeNode.children, function (i, v) {

                    Robin.Map.MapService.ExistHasChildNode(v, layerIds);
                });
            }
            return layerIds;
        },

        /**
         * @constructor 名称：ZTreeOnCheck
         * @description 作用：复选框选中事件
         * 
         * @param event, treeId, treeNode
         */
        ZTreeOnCheck: function (event, treeId, treeNode) {
            //是否可见
            var flag = false;
            var opacity = 0;
            var topicCode = '', layerId, layer;
            var visiblelayerIds = new Array();
            //可见
            if (treeNode.checked) {
                flag = true;
                opacity = 100;
            }

            //是资源
            if (treeNode.id.indexOf('_') > -1) {
                topicCode = treeNode.id.substring(0, treeNode.id.indexOf('_'));
                layerId = treeNode.id.substring(treeNode.id.indexOf('_') + 1);

                $.each(Robin.Map.MapService.GlobalMapService, function (i, v) {
                    if (v.TopicCode == topicCode) {

                        //下一节点
                        var nextNode = treeNode.getNextNode();
                        while (nextNode != null) {
                            if (nextNode.checked) {
                                visiblelayerIds.push(nextNode.id.substring(nextNode.id.indexOf('_') + 1));
                            }
                            nextNode = nextNode.getNextNode();
                        }
                        //上一个节点
                        var preNode = treeNode.getPreNode();
                        while (preNode != null) {
                            if (preNode.checked) {
                                visiblelayerIds.push(preNode.id.substring(preNode.id.indexOf('_') + 1));
                            }
                            preNode = preNode.getPreNode();
                        }
                        layer = Robin.Map.MapService.map.getLayer(v.id);
                        if (flag) {
                            visiblelayerIds.push(layerId);
                            layer.setVisibility(true);
                        }

                        layer.setVisibleLayers(visiblelayerIds);

                        //  Robin.Map.MapService.ChangeLayerVisible(v.id, flag);

                    }
                    //瓦片
                    if (v.TopicCode == treeNode.id) {
                        Robin.Map.MapService.ChangeLayerVisible(v.id, flag);
                    }
                });

            }
            else {

                var treeObj = $.fn.zTree.getZTreeObj(Robin.Map.MapService.layerControlContainerId + "_tree");

                //目录节点
                $.each(Robin.Map.MapService.GlobalMapService, function (i, v) {
                    if (v.TopicCode.indexOf(treeNode.id) > -1) {
                     
                        Robin.Map.MapService.SelectedFirstNode(treeNode);
                        Robin.Map.MapService.ChangeLayerVisible(v.id, flag);
                    }
                });
            }
        }
    },
    /**
    * 地图窗体控件
    */
    MapWindow: {

        //窗体控件缓存
        _mapWindowCatch: {},

        //根据ID关闭窗体控件
        CloseByID: function (id) {

            if (this._mapWindowCatch[id]) {
                this._mapWindowCatch[id].Close();
                delete this._mapWindowCatch[id];
            }
        },

        //判断窗体是否已经存在
        IsOpenByID: function (id) {

            var isOpened = false;
            if (this._mapWindowCatch[id]) {
                isOpened = true;
            }
            return isOpened;
        },

        //关闭所有窗体控件
        CloseAll: function () {

            var id;
            for (id in this._mapWindowCatch) {
                this._mapWindowCatch[id].Close();
                delete this._mapWindowCatch[id];
            }
        },

        //显示窗体控件
        Show: function (id, map, point, html, isAlarm) {

            if (!this._mapWindowCatch[id]) {
                var mapWindow = new this.MapWindow(id, map, point, html, isAlarm);
                this._mapWindowCatch[id] = mapWindow;
                mapWindow.Show();
            }
        },

        //只显示一个窗体控件
        ShowOnlyOne: function (id, map, point, html, isAlarm) {

            this.CloseAll();

            if (!this._mapWindowCatch[id]) {
                var mapWindow = new this.MapWindow(id, map, point, html, isAlarm);
                this._mapWindowCatch[id] = mapWindow;
                mapWindow.Show();
            }
        },

        //窗体控件对象
        MapWindow: function (id, map, point, html, isAlarm) {
            var mapWindow = $("#mapWindow_" + id);
            if (mapWindow.length == 0) {
                mapWindow = $("<div id='#mapWindow_" + id + "'></div>");
                mapWindow.css("position", "absolute");
                mapWindow.css("height", "0px;");
                mapWindow.css("width", "0px;");
                mapWindow.css("display", "none");
                $(map.__container).prepend(mapWindow);
            }
            mapWindow.html(html);

            //mapWindow.onmousedown = function () { return false; };

            //关闭临时图层
            this.Close = function () {
                //解除事件绑定
                dojo.disconnect(onZoomStart);
                dojo.disconnect(onExtentChange);
                dojo.disconnect(onMouseDown);
                dojo.disconnect(onMouseDrag);
                //移除临时图层
                $(mapWindow).hide("slow", function () {
                    $(mapWindow).remove();
                });
            };

            this.Show = function () {
                showMapWindow();
                //如果报警，则绘制报警动画
                if (isAlarm) {
                    showAlarm();
                }
            };

            //私有方法：绘制临时图层
            var showMapWindow = function () {
                var location = map.toScreen(point);
                mapWindow.css("top", location.y);
                mapWindow.css("left", location.x);
                mapWindow.fadeIn();
            };

            //私有方法：绘制报警动画
            var showAlarm = function () {
                var alarmCanvas = document.createElement('canvas');
                alarmCanvas.style.position = "absolute";
                alarmCanvas.setAttribute("width", "200px");
                alarmCanvas.setAttribute("height", "200px");
                alarmCanvas.style.left = "-100px";
                alarmCanvas.style.top = "-100px";
                alarmCanvas.style.zIndex = 1;
                mapWindow.append(alarmCanvas);
                //alarmCanvas.onmousedown = function () { return false; };

                var ctx = alarmCanvas.getContext("2d");

                var radius = 0;

                var ap = 1.0;
                var d = 1 / (60.0 / 5);
                var i = 0;
                var drawEllipse = setInterval(function () {
                    ctx.clearRect(0, 0, 700, 550);
                    //radius = 100;
                    var grd = ctx.createRadialGradient(100, 100, 0, 100, 100, radius);

                    grd.addColorStop(0, "rgba(230, 0, 0, 0)");
                    grd.addColorStop(0.25, "rgba(230, 0, 0, " + ap + ")");
                    grd.addColorStop(0.5, "rgba(230, 0, 0, 0)");
                    grd.addColorStop(0.75, "rgba(230, 0, 0, " + ap + ")");
                    grd.addColorStop(1, "rgba(230, 0, 0, 0)");

                    ctx.beginPath();
                    ctx.arc(100, 100, radius, 0, 2 * Math.PI, true);
                    ctx.fillStyle = grd;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(100, 100, 5, 0, 2 * Math.PI, true);
                    ctx.fillStyle = "rgba(230, 0, 0,1)";
                    ctx.fill();

                    if (radius >= 60 && ap <= 1 && ap >= 0) {
                        radius = 1; ap = 1.0;
                        //clearInterval(drawEllipse);
                        //alert(i);
                    }
                    i += 1;
                    radius += 5;
                    ap = ap / 1.16;

                }, 100);
            };

            //私有方法：绑定地图缩放开始事件
            var onZoomStart = dojo.connect(map, "onZoomStart", function () {
                $(mapWindow).hide();
            });

            //私有方法：绑定地图缩放事件
            var onExtentChange = dojo.connect(map, "onExtentChange", function () {
                showMapWindow();
            });

            var oldX, oldY, lastX, lastY;
            //私有方法：绑定地图点击事件
            var onMouseDown = dojo.connect(map, "onMouseDown", function (event) {
                oldX = event.screenX;
                oldY = event.screenY;
                lastX = mapWindow.position().left;
                lastY = mapWindow.position().top;
            });
            //私有方法：绑定地图拖拽事件
            var onMouseDrag = dojo.connect(map, "onMouseDrag", function (event) {
                //var newX = lastX + event.screenX - oldX;
                //var newY = lastY + event.screenY - oldY;
                //mapWindow.css("left", newX);
                //mapWindow.css("top", newY);
            });
        }
    },
    /**
     * @constructor 名称：addLayer
     * @description 作用：在地图上添加新图层
     *
     * @param option 参数对象
     */
    addLayer: function (option) {

        var graphicsLayer = Robin.Map.Map2DControl.getLayer(option.id);
        if (graphicsLayer != null) {
            graphicsLayer.clear();
            Robin.Map.Map2DControl.removeLayer(graphicsLayer);
        }

        graphicsLayer = new esri.layers.GraphicsLayer({ id: option.id });
        Robin.Map.Map2DControl.addLayer(graphicsLayer);

        return graphicsLayer;
    },

    /**
      * @constructor 名称：GetPoint
      * @description 作用： 获取一个点（备注：可能和上面的Geometry重复）
      * @author 作者：刘壮（20150831）
      */
    GetPoint: function (x, y) {
        return new esri.geometry.Point(x, y, Robin.Map.Map2DControl.spatialReference);
    },

    /**
      * @constructor 名称：GetPolygon
      * @description 作用：获取一个多边形（备注：可能和上面的Geometry重复）
      * @author 作者：刘壮（20150831）
      */
    GetPolygon: function () {
        return new esri.geometry.Polygon(Robin.Map.Map2DControl.spatialReference);
    },

    /**
      * @constructor 名称：GetPolyline
      * @description 作用：获取一个线段（备注：可能和上面的Geometry重复）
      * @author 作者：刘壮（20150831）
      */
    GetPolyline: function () {
        return new esri.geometry.Polyline(Robin.Map.Map2DControl.spatialReference);
    },


    /**
      * @constructor 名称：GetGraphic
      * @description 作用：获取一个图形（备注：可能和上面的Geometry重复）
      * @author 作者：刘壮（20150831）
      */
    GetGraphic: function (geometry, symbol, attribute) {
        var graphic = new esri.Graphic(geometry, symbol, attribute);
        return graphic;
    },


    /**
      * @constructor 名称：GetGraphicLayer
      * @description 作用：根据id获取一个临时图层，如果没有则创建一个
      * @author 作者：刘壮（20141231）
      */
    GetGraphicLayer: function (map, id) {
        var myGraphicLayer = map.getLayer(id);
        if (myGraphicLayer == null) {
            myGraphicLayer = new esri.layers.GraphicsLayer({ id: id });
            map.addLayer(myGraphicLayer);
        }
        return myGraphicLayer;
    },

    /**
      * @constructor 名称：GetGraphicLayer
      * @description 作用：根据id获取一个临时图层，如果没有则创建一个,并设置图层层级
      * @author 作者：王海洋
      */
    GetGraphicLayerSetLevel: function (map, id, level) {
        var myGraphicLayer = map.getLayer(id);
        if (myGraphicLayer == null) {
            myGraphicLayer = new esri.layers.GraphicsLayer({ id: id });
            map.addLayer(myGraphicLayer, level);
        }
        return myGraphicLayer;
    },

    /**
    * @constructor 名称：GetLayer
    * @description 作用：根据图层类型 和图层地址创建一个地图图层
    * @author 作者：刘壮（20150105）
    */
    GetLayer: function (id, url, layerType) {
        var layer;
        switch (layerType) {
            case "ArcGISDynamicMapServiceLayer":
                layer = new esri.ArcGISDynamicMapServiceLayer(url, id);
                break;
            case "ArcGISImageServiceLayer":
                layer = new esri.ArcGISImageServiceLayer(url, id);
                break;
            case "ArcGISTiledMapServiceLayer":
                layer = new esri.ArcGISTiledMapServiceLayer(url, id);
                break;
            default: break;
        }
        return layer;
    },

    /**
     * @constructor 名称：ShowGraphic
     * @description 作用：添加图形
     * 
     * @param {String} layer 要添加到的图层
   
     * @param {Float} x x坐标
     * @param {Float} y y坐标
     * @param {String} pic 图片
     * @param {Object} attributes 属性
     * @param {Object} config 配置
     * 
     */
    ShowGraphicNoText: function (layer, x, y, attributes, config) {

        var _default = {

            pic: {
                src: '',
                width: 40,
                height: 40
            },
            offset: {
                x: 0,
                y: -36
            }
        };

        if (config) {
            _default = $.extend(true, _default, config);
        }



        var point = new esri.geometry.Point([parseFloat(x), parseFloat(y)], new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
        var fillSymbol = new esri.symbol.PictureMarkerSymbol(_default.pic.src, _default.pic.width, _default.pic.height);
        var graphic = new esri.Graphic(point, fillSymbol, attributes, null);
        layer.add(graphic);

    },
    /**
     * @constructor 名称：ShowGraphic
     * @description 作用：添加图形
     * 
     * @param {String} layer 要添加到的图层
     * @param {String} name 名称
     * @param {Float} x x坐标
     * @param {Float} y y坐标
     * @param {String} pic 图片
     * @param {Object} attributes 属性
     * @param {Object} config 配置
     * 
     */
    ShowGraphic: function (layer, name, x, y, pic, attributes, config) {

        var _default = {
            font:
                { 'size': "14", 'style': 'normal', 'family': "微软雅黑" },
            color: [0, 0, 0],
            pic: {
                src: '',
                width: 40,
                height: 40
            },
            offset: {
                x: 0,
                y: -36
            }
        };

        if (config) {
            _default = $.extend(true, _default, config);
        }

        var textSymbol = new esri.symbol.TextSymbol(
                                name,
                                  _default.font,
                                 _default.color).setOffset(_default.offset.x, _default.offset.y);

        var point = new esri.geometry.Point([parseFloat(x), parseFloat(y)], new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
        var fillSymbol = new esri.symbol.PictureMarkerSymbol(pic, _default.pic.width, _default.pic.height);
        var graphic = new esri.Graphic(point, fillSymbol, attributes, null);
        layer.add(graphic);
        graphic = new esri.Graphic(point, textSymbol, attributes, null);
        layer.add(graphic);
    },

    /**
    * @constructor 名称：ClearLayer
    * @description 作用：根据id清空临时图层，并将该临时图层删除
    * @author 作者：刘壮（20141231）
    */
    ClearLayer: function (map, id) {
        if (map != null) {
            var tempLayer = map.getLayer(id);
            if (tempLayer != null) {
                tempLayer.clear();
                map.removeLayer(tempLayer);
            }
        }
    },

    /**
     * @constructor 名称：GetGraphicByGeometry
     * @description 作用：根据传入的图形类型自动符号化
     * @author 作者：刘壮（20141231）
     */
    GetGraphicByGeometry: function (geometry) {
        var graphic = null;
        //point | multipoint | polyline | polygon | extent
        switch (geometry.type) {
            case "point": case "multipoint":
                graphic = new esri.Graphic(geometry, Robin.Map.Symbol.markSymbol());
                break;
            case "polyline":
                graphic = new esri.Graphic(geometry, Robin.Map.Symbol.lineSymbol());
                break;
            case "polygon": case "extent":
                graphic = new esri.Graphic(geometry, Robin.Map.Symbol.fillSymbol());
                break;
            default: break;
        }
        return graphic;
    },

    /**
    * @constructor 名称：Fly2Geometry
    * @description 作用：缩放到某个图形范围
    * @author 作者：刘壮（20150105）
    */
    Fly2Geometry: function (map, geometry, completed) {
        if (map != null && map.extent != null && geometry != null) {
            var extent = geometry.getExtent();
            if (geometry.type == "point") {
                extent = new esri.geometry.Extent(geometry.x - 0.0000001, geometry.y - 0.0000001, geometry.x + 0.0000001, geometry.y + 0.0000001, map.spatialReference);
                extent = extent.expand(1.5);
            }
            if (extent != null) {
                var point = new esri.geometry.Point(extent.xmin + (extent.xmax - extent.xmin) / 2, extent.ymin + (extent.ymax - extent.ymin) / 2, map.spatialReference);
                var newExtent = new esri.geometry.Extent(point.x, point.y, point.x, point.y, point.spatialReference);
                //如果当前视图包含要缩放视图
                if (Robin.Map.Extent1ContainExtent2(map.extent, extent)) {
                    map.setExtent(extent);
                    if (completed != null && $.isFunction(completed)) {
                        completed();
                    }
                } else {
                    var firstEx = Robin.Map.Union2Extent(newExtent, map.extent);
                    map.setExtent(firstEx, true);
                    setTimeout(function () {
                        map.centerAt(point)
                    }, 700);
                    setTimeout(function () {
                        map.setExtent(extent);
                        if (completed != null && $.isFunction(completed)) {
                            completed();
                        }
                    }, 1400);
                }
            }
        }
    },

    /**
    * @constructor 名称：Check2Extent
    * @description 作用：判断
    * @author 作者：刘壮（20150105）
    */
    Extent1ContainExtent2: function (extent1, extent2) {
        var isContain = false;
        if (extent1.xmin < extent2.xmin
            && extent1.ymin < extent2.ymin
            && extent1.xmax > extent2.xmax
            && extent1.ymax > extent2.ymax) {
            isContain = true;
        }
        return isContain;

    },

    /**
    * @constructor 名称：Union2Extent
    * @description 作用：合并两个矩形范围为一个包含两个的矩形范围
    * @author 作者：刘壮（20150105）
    */
    Union2Extent: function (extent1, extent2) {
        var newExtent = new esri.geometry.Extent(extent1.xmin, extent1.ymin, extent1.xmax, extent1.ymax, extent1.spatialReference);
        if (extent1 != null && extent2 != null) {
            newExtent.xmax = (extent1.xmax > extent2.xmax ? extent1.xmax : extent2.xmax);
            newExtent.xmin = (extent1.xmin < extent2.xmin ? extent1.xmin : extent2.xmin);
            newExtent.ymax = (extent1.ymax > extent2.ymax ? extent1.ymax : extent2.ymax);
            newExtent.ymin = (extent1.ymin < extent2.ymin ? extent1.ymin : extent2.ymin);
        }
        return newExtent;
    },

    /**
    * @constructor 名称： GetFullExtentFromPoints
    * @description 作用：根据一系列点计算得出这些点的最大范围
    * @author 作者：刘壮（20150105）
    * @param {id} map 
    * @param {Array} points 点的数组,形如[[x1,y1],[x2,y2],[x3,y3]...]
    */
    GetFullExtentFromPoints: function (map, points) {
        var xmax = 0, ymax = 0, xmin = 0, ymin = 0;
        if (points && points.length > 0) {
            xmax = points[0].x; xmin = points[0].x; ymax = points[0].y; ymin = points[0].y;
            for (var i = 0; i < points.length; i++) {
                xmax = xmax > points[i].x ? xmax : points[i].x;
                ymax = ymax > points[i].y ? ymax : points[i].y;
                xmin = xmin > points[i].x ? points[i].x : xmin;
                ymin = ymin > points[i].y ? points[i].y : ymin;
            }
        }
        var extent = new esri.geometry.Extent(parseFloat(xmin - 1000), parseFloat(ymin - 1000), parseFloat(xmax + 1000), parseFloat(ymax + 1000), map.spatialReference);
        return extent;
    },

    /**
         * @constructor 名称：Symbol
         * @description 作用：符号化 symbol
         * 
         */
    Symbol: {
        /**
         * @constructor 名称：markSymbol
         * @description 作用：系统点样式
         * 
         */
        markSymbol: function () {
            var markSymbol = new esri.symbol.SimpleMarkerSymbol();
            markSymbol.color = new dojo.Color("red");
            markSymbol.size = 12;
            return markSymbol;
        },
        /**
         * @constructor 名称：fillSymbol
         * @description 作用：系统填充样式
         * 
         */
        fillSymbol: function () {
            var simpleFillSymbol = new esri.symbol.SimpleFillSymbol();
            simpleFillSymbol.color = new dojo.Color("#6600FF00");
            simpleFillSymbol.outline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("red"), 2);
            return simpleFillSymbol;
        },
        /**
         * @constructor 名称：lineSymbol
         * @description 作用：系统线样式
         * 
         */
        lineSymbol: function () {
            var sls = new esri.symbol.SimpleLineSymbol();
            sls.color = new dojo.Color("red");
            sls.width = 4;
            return sls;
        },
        /**
         * @constructor 名称：txtSymbol
         * @description 作用：系统文字样式
         * @param {object} txt 
         * @param {object} offsetX 
         * @param {object} offsetY 
         * @param {object} color 
         */
        txtSymbol: function (txt, offsetX, offsetY, color) {
            var txtSym = new esri.symbol.TextSymbol();
            txtSym.color = color;
            txtSym.text = txt;
            txtSym.xoffset = offsetX;
            txtSym.yoffset = offsetY;
            return txtSym;
        },
        /**
         * @constructor 名称：customMarkSymbol
         * @description 作用：自定义点样式
         * @param {object} size 
         * @param {object} color 
         */
        customMarkSymbol: function (size, color) {
            var markSymbol = new esri.symbol.SimpleMarkerSymbol();
            markSymbol.color = color;
            markSymbol.size = size;
            return markSymbol;
        },
        /**
         * @constructor 名称：customFillSymbol
         * @description 作用：自定义填充样式
         * @param {object} color 
         */
        customFillSymbol: function (color) {
            var simpleFillSymbol = new esri.symbol.SimpleFillSymbol();
            simpleFillSymbol.color = color;
            simpleFillSymbol.outline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("red"), 1);
            return simpleFillSymbol;
        },
        /**
         * @constructor 名称：customPicFillSymbol
         * @description 作用：自定义图片填充样式
         * @param {string} url 
         * @param {object} width 
         * @param {object} height 
         */
        customPicFillSymbol: function (url, width, height) {
            var outline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("red"), 1);
            var picFillSymbol = esri.symbol.PictureFillSymbol(url, outline, width, height);
            return picFillSymbol;
        },
        /**
         * @constructor 名称：customLineSymbol
         * @description 作用：自定义线条样式
         * @param {object} width 
         * @param {object} height 
         */
        customLineSymbol: function (color, width) {
            var sls = new esri.symbol.SimpleLineSymbol();
            sls.color = color;
            sls.width = width;
            return sls;
        },
        /**
         * @constructor 名称：pictureMarkerSymbol
         * @description 作用：自定义图片标注样式
         * @param {object} url 
         * @param {object} width 
         * @param {object} height 
         * @param {object} offsetX 
         * @param {object} offsetY 
         */
        pictureMarkerSymbol: function (url, width, height, offsetX, offsetY) {
            var picMS = new esri.symbol.PictureMarkerSymbol(url, width, height);
            picMS.xoffset = offsetX;
            picMS.yoffset = offsetY;
            return picMS;
        }
    }
};




