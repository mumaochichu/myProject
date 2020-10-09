require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/Basemap",
    "esri/widgets/Search",
    "esri/layers/TileLayer",
    "esri/layers/WebTileLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",

    "esri/layers/support/TileInfo",
    "esri/layers/GraphicsLayer",
    "esri/geometry/SpatialReference",
    "esri/widgets/BasemapToggle",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/widgets/Sketch",
    "esri/widgets/Legend",
    "esri/geometry/Extent",
    "esri/widgets/Measurement",
    "esri/widgets/DistanceMeasurement2D",
    "esri/widgets/AreaMeasurement2D",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Feature",
    "esri/symbols/PictureMarkerSymbol"

],
    function (Map, MapView, SceneView, Basemap, Search, TileLayer, WebTileLayer, FeatureLayer, LayerList, TileInfo, GraphicsLayer, SpatialReference
        , BasemapToggle, Graphic, Point, Polyline, Sketch, Legend, Extent, Measurement, DistanceMeasurement2D, AreaMeasurement2D,
        BasemapGallery, Feature, PictureMarkerSymbol) {


        /****************************
        *1,引用服务地址的底图
        ****************************/
        //新建切片图层
        //var tileLayer = new TileLayer({
        //  url: "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",//中文地图
        //  //url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",//通过url调用数据

        //});
        //新建基础图层
        //var baseLayers = [tileLayer]; //引用切片图层


        /****************************
         * 2，引用天地图-矢量底图经纬度投影(esri切片从第0级开始，天地图切片从第1级开始，这里第0级就成了请求天地图第1级)
         ****************************/
        //空间参考
        var spatialReference = new SpatialReference({
            wkid: 4326
        });
        var tileInfo = new TileInfo({
            dpi: 90.71428571427429,
            lods: [
                {
                    level: 0,
                    levelValue: "1",
                    scale: 295828763.79585470937713011037,
                    resolution: 0.703125
                },
                {
                    level: 1,
                    levelValue: "2",
                    scale: 147914381.89792735468856505518,
                    resolution: 0.3515625
                },
                {
                    level: 2,
                    levelValue: "3",
                    scale: 73957190.948963677344282527592,
                    resolution: 0.17578125
                },
                {
                    level: 3,
                    levelValue: "4",
                    scale: 36978595.474481838672141263796,
                    resolution: 0.087890625
                },
                {
                    level: 4,
                    levelValue: "5",
                    scale: 18489297.737240919336070631898,
                    resolution: 0.0439453125
                },
                {
                    level: 5,
                    levelValue: "6",
                    scale: 9244648.868620459668035315949,
                    resolution: 0.02197265625
                },
                {
                    level: 6,
                    levelValue: "7",
                    scale: 4622324.4343102298340176579745,
                    resolution: 0.010986328125
                },
                {
                    level: 7,
                    levelValue: "8",
                    scale: 2311162.2171551149170088289872,
                    resolution: 0.0054931640625
                },
                {
                    level: 8,
                    levelValue: "9",
                    scale: 1155581.1085775574585044144937,
                    resolution: 0.00274658203125
                },
                {
                    level: 9,
                    levelValue: "10",
                    scale: 577790.55428877872925220724681,
                    resolution: 0.001373291015625
                },
                {
                    level: 10,
                    levelValue: "11",
                    scale: 288895.2771443893646261036234,
                    resolution: 0.0006866455078125
                },
                {
                    level: 11,
                    levelValue: "12",
                    scale: 144447.63857219468231305181171,
                    resolution: 0.00034332275390625
                },
                {
                    level: 12,
                    levelValue: "13",
                    scale: 72223.819286097341156525905853,
                    resolution: 0.000171661376953125
                },
                {
                    level: 13,
                    levelValue: "14",
                    scale: 36111.909643048670578262952926,
                    resolution: 0.0000858306884765625
                },
                {
                    level: 14,
                    levelValue: "15",
                    scale: 18055.954821524335289131476463,
                    resolution: 0.00004291534423828125
                },
                {
                    level: 15,
                    levelValue: "16",
                    scale: 9027.977410762167644565738231,
                    resolution: 0.000021457672119140625
                },
                {
                    level: 16,
                    levelValue: "17",
                    scale: 4513.9887053810838222828691158,
                    resolution: 0.0000107288360595703125
                },
                {
                    level: 17,
                    levelValue: "18",
                    scale: 2256.9943526905419111414345579,
                    resolution: 0.00000536441802978515625
                },
                {
                    level: 18,
                    levelValue: "19",
                    scale: 1128.4971763452709555707172788,
                    resolution: 0.000002682209014892578125
                }
            ],
            size: [256, 256],
            origin: {
                x: -180,
                y: 90
            },
            spatialReference: spatialReference //坐标参考
        });
        //天地图地图
        var webTileLayer = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=35f5a8d92de539752d6a5c885d978380",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tileInfo: tileInfo,
            spatialReference: spatialReference
        });
        //天地图标记(就是地图上的道路名，城市名什么的，上面的天地图只是光溜溜的地图，没有这些东西，要两个加起来才像样)
        var markerLayer = new WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=35f5a8d92de539752d6a5c885d978380",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tileInfo: tileInfo,
            spatialReference: spatialReference
        });


        //创建一个底图对象
        var basemap2 = new Basemap({
            baseLayers: webTileLayer//引用天地图做底图
            //baseLayers: baseLayers//引用服务地址的地图做底图
        });
        //建立新地图
        //创建一个地图实例对象
        var map = new Map({//应在视图之前创建Map对象，以便可以传递到视图属性中
            //basemap: "streets" //指定api定义好的底图
            basemap: basemap2,//使用自定义的底图
        });
        var map_3D = new Map({
            basemap: basemap2,
            ground: "world-elevation"
        });
        //创建视图对象，使地图显示出来(图层组成地图对象，通过视图对象显示在DOM元素中)
        var view = new MapView({//MapView显示Map实例的2D视图。必须创建MapView实例才能以2D渲染地图(以及其操作层和基础层)
          //为了使地图在DOM中可见，必须创建MapView并至少引用两个对象(Map实例和DOM元素)
          map: map,//Map实例
          container: "viewDiv",//DOM元素
          center: [-117.907, 34.049],//地图中心
          zoom: 9, //默认地图级别
        });
        //三维地图
        //var view = new SceneView({
        //    container: "viewDiv",
        //    map: map,
        //    scale: 500000000,
        //    //center: [120.36, 35.9],
        //    //camera: {    //设置镜头参数
        //    //    position: {
        //    //        x: 120.36,
        //    //        y: 35.9,
        //    //        z: 15000
        //    //    },
        //    //    tilt: 50
        //    //},
        //    //environment: {
        //    //    background: {
        //    //        type: "color",
        //    //        color: [255, 252, 244, 1]
        //    //    },
        //    //    starsEnabled: true,   //不启用星星可视化
        //    //    atmosphereEnabled: false  //不启用大气可视化
        //    //},
        //    //zoom: 9
        //});
        // view.extent = new Extent({//地图初始显示范围
        //     xmin: -119,
        //     ymin: -50,
        //     xmax: 120,
        //     ymax: 50,
        //     spatialReference: {//空间参考(默认值 WGS84（wkid：4326）)
        //       wkid: 4326
        //     }
        //   });
        //将天地图的标记图层添加到地图上
        //map_3D.layers.add(markerLayer);
        map.layers.add(markerLayer);
        //视图上的点击事件
        view.on("click", function (event) {
            top.lat = event.mapPoint.x;
            top.lon = event.mapPoint.y;

        });




        /****************************
         *3,basemapToggle底图切换(连个底图之间切换)，如果用天地图就无法直接用这个小部件切换了
         ****************************/
        var basemapToggle = new BasemapToggle({
            view: view,
            nextBasemap: "hybrid",
        });
        //将地图切换部件添加到地图上
        var tog = 0;
        //点击添加，再点击移除
        $("#basemapToggle").click(function () {
            switch (tog) {
                case 0:
                    view.ui.add(basemapToggle, "top-right");//添加部件
                    tog = 1;
                    break;
                case 1:
                    view.ui.remove(basemapToggle, "top-right");//移除部件
                    tog = 0;
                    break;
            }
        });




        /****************************
         * 4,创建图形
         ****************************/
        //(1)分类点标注
        //点数据数组
        var points = [
            ["-49.97", "41.73", "警察", "001", "正常", "青山路186号路灯东南1.2米"],
            ["-49.97", "42.73", "警察", "002", "正常", "青山路186号路灯东南1.2米"],
            ["-49.97", "43.73", "供电", "003", "正常", "青山路186号路灯东南1.2米"],
            ["-49.97", "44.73", "供电", "004", "正常", "青山路186号路灯东南1.2米"],
            ["-49.97", "45.73", "弱电", "005", "正常", "青山路186号路灯东南1.2米"],
        ];
        //创建一个空数组来存储点几何的信息，为下面的隐藏/显示标注使用
        var pointGraphic = new Array;

        for (var i = 0; i < points.length; i++) {
            //创建一个点几何,包含位置信息
            var point2 = new Point({
                longitude: points[i][0],
                latitude: points[i][1]
            });
            //分类
            if (points[i][2] == "警察") {
                //点标注类型用图片来标注
                var markerSymbol = new PictureMarkerSymbol('img/公安.png', 30, 30);
                // 创建一个对象，用于存储与该点相关的属性
                // var pointAtt = {
                //     设备编号: points[i][3],
                //     井盖类型: points[i][2],
                //     设备状态: points[i][4],
                //     道路名称:points[i][5],
                // };
                var pointAtt = {
                    "ID": points[i][3],
                    "TYPE": points[i][2],
                    "STATUS": points[i][4],
                    "ROAD": points[i][5],
                };
            }
            if (points[i][2] == "供电") {
                var markerSymbol = new PictureMarkerSymbol('img/供电.png', 30, 30);
                var pointAtt = {
                    "ID": points[i][3],
                    "TYPE": points[i][2],
                    "STATUS": points[i][4],
                    "ROAD": points[i][5],
                };
            }
            if (points[i][2] == "弱电") {
                var markerSymbol = new PictureMarkerSymbol('img/弱电.png', 30, 30);
                var pointAtt = {
                    "ID": points[i][3],
                    "TYPE": points[i][2],
                    "STATUS": points[i][4],
                    "ROAD": points[i][5],
                };
            }
            //弹出内容

            //创建点要素
            pointGraphic[i] = new Graphic({
                geometry: point2,
                symbol: markerSymbol,
                attributes: pointAtt,
                popupTemplate: {
                    title: "详细信息",
                    content: "<div style='margin-top:5px;'><label>设备编号:</label><input style='width:100px;height:30px;'>{ID}</div>"
                        + "<div style='margin-top:5px;'><label>井盖类型:</label><textarea style='width:100px;height:30px;'>{TYPE}</textarea>"
                        + "</div><div style='margin-top:5px;'><label>设备状态:</label><textarea style='width:100px;height:30px'>{STATUS}</textarea>"
                        + "</div><div style='margin-top:5px;'><label>道路的名称:</label><textarea style='width:200px;height:60px'>{ROAD}</textarea></div>"
                        + "<div id='png'style='float:right;margin-top:-165px;'><img data-original='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596716198178&di=6cdadd4a454c68a3eea34acddfab77dc&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596716198178&di=6cdadd4a454c68a3eea34acddfab77dc&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'alt='图片'width='90px'height='100px'></img></div>"
                },
            });
            //将点添加到视图上
            view.graphics.add(pointGraphic[i]);
        }

        //复选框被点击时触发事件
        //全部显示/隐藏
        $("#marker0").on("click", function () {
            //点击之后如果变成打钩时触发
            if ($(this).prop('checked')) {
                for (var i = 0; i < pointGraphic.length; i++) {
                    view.graphics.add(pointGraphic[i]);
                }
            }
            //取消选中时触发
            else {

                for (var i = 0; i < pointGraphic.length; i++) {
                    view.graphics.remove(pointGraphic[i]);
                }
            }
        });
        //警察标注显示/隐藏
        $("#marker1").on("click", function () {

            //点击之后如果变成打钩时触发
            if ($(this).prop('checked')) {
                for (var i = 0; i < pointGraphic.length; i++) {
                    if (pointGraphic[i].attributes.井盖类型 == "警察") {

                        view.graphics.add(pointGraphic[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < pointGraphic.length; i++) {
                    if (pointGraphic[i].attributes.井盖类型 == "警察") {
                        view.graphics.remove(pointGraphic[i]);
                    }
                }
            }
        });
        //供电标注显示/隐藏
        $("#marker2").on("click", function () {

            //点击之后如果变成打钩时触发
            if ($(this).prop('checked')) {


                for (var i = 0; i < pointGraphic.length; i++) {

                    if (pointGraphic[i].attributes.井盖类型 == "供电") {

                        view.graphics.add(pointGraphic[i]);
                    }
                }
            }
            else {

                for (var i = 0; i < pointGraphic.length; i++) {
                    if (pointGraphic[i].attributes.井盖类型 == "供电") {
                        view.graphics.remove(pointGraphic[i]);
                    }
                }
            }
        });
        //弱电标注显示/隐藏
        $("#marker3").on("click", function () {
            //点击之后如果变成打钩时触发
            if ($(this).prop('checked')) {
                for (var i = 0; i < pointGraphic.length; i++) {

                    if (pointGraphic[i].attributes.井盖类型 == "弱电") {

                        view.graphics.add(pointGraphic[i]);
                    }
                }
            }
            else {

                for (var i = 0; i < pointGraphic.length; i++) {
                    if (pointGraphic[i].attributes.井盖类型 == "弱电") {
                        view.graphics.remove(pointGraphic[i]);
                    }
                }
            }
        });


        //(2)简单的几何图形添加
        //首先创建一个点几何
        var point3 = new Point({
            longitude: -118.251,
            latitude: 35.004,
        });
        var pointAtt3 = {
            设备编号: "0001",
            井盖类型: "供水",
            设备状态: "正常",
            道路名称: "洛杉矶",
        };
        // 创建一个符号绘制点
        var markerSymbol3 = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
                //自动转换为新的SimpleMarkerSymbol()
                color: [255, 255, 255],
                width: 2,
            },
        };
        //创建几何对象
        var pointGraphic3 = new Graphic({
            geometry: point3,
            symbol: markerSymbol3,
            attributes: pointAtt3,
            popupTemplate: {
                // autocasts as new PopupTemplate()
                title: "详细信息",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "设备编号",
                            },
                            {
                                fieldName: "井盖类型",
                            },
                            {
                                fieldName: "设备状态",
                            },
                            {
                                fieldName: "道路名称",
                            },
                        ],
                    },
                ],
            },
        });
        //将图形添几何图层上
        //graphicsLayer(地理数据临时存储在内存中)通过将图形数组传递到graphics属性来创建新的属性。
        var graphicsLayer_point3 = new GraphicsLayer({
            graphics: [pointGraphic3],
            title: "点图形的几何图层"
        });
        //view.graphics.addMany([pointGraphic]);
        map.layers.add(graphicsLayer_point3);



        // 首先创建一个线几何
        var polyline = new Polyline({
            paths: [
                [
                    [-111.3, 52.68],
                    [-98, 49.5],
                    [-93.94, 29.89],
                ],
            ],
        });
        //创建一个符号绘制线
        var lineSymbol = {
            type: "simple-line",
            color: [226, 119, 40],
            width: 4,
        };
        //创建线要素
        // 图形通常用于向地图添加具有不同几何形状的文本，形状和图像。
        // 创建图形层的最简单方法是将Graphic对象创建为数组，然后将此数组传递graphics给新GraphicsLayer对象的属性。
        var polylineGraphic = new Graphic({
            attributes: {
                name: "LA City Hall",
                address: "200 N Spring St, Los Angeles, CA 90012"
            },
            geometry: polyline,
            symbol: lineSymbol,
            popupTemplate: {
                title: "Places in Los Angeles",
                content: [{
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "name",
                            label: "Name",
                            visible: true
                        },
                        {
                            fieldName: "address",
                            label: "Address",
                            visible: true
                        }
                    ]
                }]
            },
        });
        var graphicsLayer_line = new GraphicsLayer({
            graphics: [polylineGraphic],
            title: "线图形的几何图层"
        });
        map.layers.add(graphicsLayer_line);
        //将图形添加到地图上，与上面功能相同
        //view.graphics.addMany([pointGraphic,polylineGraphic]);


        /*******************************************
        *5,添加要素图层
         ******************************************/
        //为点图层定义弹出窗口
        var popupTrailheads = {
            title: "{TRL_NAME}",
            content: "<img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596716198178&di=6cdadd4a454c68a3eea34acddfab77dc&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'width='100px'heigth='100px'></img>"
                + "<b>所在城市:</b> {CITY_JUR}<br><b>交叉路口:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
        };
        //添加Trailheads(点)要素图层
        var trailheadsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
            //outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
            popupTemplate: popupTrailheads,
            title: "点要素图层"
        });
        map.add(trailheadsLayer, 2); //后面的2为索引，值越大图层越在上面
        //添加线要素图层
        var trailsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
            popupTemplate: {
                // Enable a popup
                title: "线名称是：{TRL_NAME}",
                content: "TRL_ID是：{TRL_ID} " // Display in pop-up
            },
            title: "线要素图层",
        });
        map.add(trailsLayer, 1);
        ;
        var myLayer2 = new FeatureLayer({
            url: "http://localhost:6080/arcgis/rest/services/MyMapService/MapServer",//本地发布全国行政区划矢量数据
            popupTemplate: {
                // Enable a popup
                title: "省份",
                content: "{NAME} " // Display in pop-up
            },
            title: "省界面要素图层"
        });
        map.add(myLayer2, 5);//后面这个5表示这个myLayer2图层在表面还是底下，数值越大越在表面
        var myPoint = new FeatureLayer({
            url: "http://localhost:6080/arcgis/rest/services/point/MapServer",
            popupTemplate: {
                // Enable a popup
                title: "井盖",
                content: "{ID} " // Display in pop-up
            },
            title: "自定义点图层"
        });
        map.add(myPoint, 999);






        /*******************************************
        *7，拾取地图坐标
         ******************************************/
        //创建一个div元素添加到右下角。并分配给它一些样式
        //var coordsWidget = document.createElement("div");
        //coordsWidget.id = "coordsWidget";
        //coordsWidget.className = "esri-widget esri-component";
        //coordsWidget.style.padding = "7px 15px 5px";
        //view.ui.add(coordsWidget, "bottom-right");
        ////创建一个新功能来更新innerHTML小部件的，并显示地图的当前纬度，经度，比例和缩放级别。
        ////该函数将获取任何给定的点，并将坐标舍入到一组固定的小数位。
        //function showCoordinates (pt) {
        //  var coords = "经度/纬度 " +
        //    pt.longitude.toFixed(3) +
        //    " " +
        //    pt.latitude.toFixed(3) +
        //    " | 比例尺 1:" +
        //    Math.round(view.scale * 1) / 1 +
        //    " | 地图级别" +
        //    view.zoom;
        //  coordsWidget.innerHTML = coords;
        //}
        ////showCoordinates当视图静止且指针移动时，添加事件和监视处理程序以调用该函数。
        ////当视图静止时，它将显示中心位置。当指针移动时，它将显示当前指针位置。使用toMap转换屏幕坐标到地图坐标。
        //view.watch("stationary", function (isStationary) {
        //  showCoordinates(view.center);
        //});
        //view.on("pointer-move", function (evt) {
        //  showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
        //});


        /*******************************************
        *8，绘图
         ******************************************/
        //第一个十字形状的工具就是删除工具
        var graphicsLayer = new GraphicsLayer({
            title: "绘画图层"
        });
        map.add(graphicsLayer);
        var sketch = new Sketch({
            view: view,
            layer: graphicsLayer
        });
        var sk = 0;
        $("#Sketch").click(function () {
            switch (sk) {
                case 0:
                    view.ui.add(sketch, "top-right");
                    sk = 1;
                    break;
                case 1:
                    graphicsLayer.removeAll();
                    view.ui.remove(sketch, "top-right");
                    sk = 0;
                    break;
            }
        });



        /*******************************************
        *9，搜索层数据
         ******************************************/
        //搜索地址和地点小部件
        // var search = new Search({
        //   view: view
        // });
        // search.sources.push({
        //   layer: parksLayer,//搜索层用的图层是parksLayer
        //   searchFields: ["PARK_NAME"],
        //   displayField: "PARK_NAME",
        //   exactMatch: false,
        //   outFields: ["PARK_NAME"],
        //   resultGraphicEnabled: true,
        //   name: "搜索的图层",
        //   placeholder: "Example: Medea Creek Trail",
        // });
        // var sea = 0;
        // $("#Search").click(function () {
        //   switch (sea) {
        //     case 0:
        //       view.ui.add(search, "top-right");
        //       sea = 1;
        //       break;
        //     case 1:
        //       view.ui.remove(search, "top-right");
        //       sea = 0;
        //       break;
        //   }
        // });



        /*******************************************
        *10，图层列表
         ******************************************/
        var layerList = new LayerList({
            view: view
        });
        var lay = 0;
        $("#LayerList").click(function () {
            switch (lay) {
                case 0:
                    view.ui.add(layerList, "top-right");
                    lay = 1;
                    break;
                case 1:
                    view.ui.remove(layerList, "top-right");
                    lay = 0;
                    break;
            }
        });





        /*******************************************
        *11，测量
         ******************************************/
        //测量方法1
        var activeWidget = null;
        document
            .getElementById("distance")
            .addEventListener("click", function () {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("distance");
                } else {
                    setActiveButton(null);
                }
            });

        document
            .getElementById("area")
            .addEventListener("click", function () {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("area");
                } else {
                    setActiveButton(null);
                }
            });

        function setActiveWidget(type) {
            switch (type) {
                case "distance":
                    activeWidget = new DistanceMeasurement2D({
                        view: view,
                    });

                    // 跳过初始的“新测量”按钮
                    activeWidget.viewModel.newMeasurement();

                    view.ui.add(activeWidget, "top-right");
                    setActiveButton(document.getElementById("distance"));
                    break;
                case "area":
                    activeWidget = new AreaMeasurement2D({
                        view: view
                    });

                    // 跳过初始的“新测量”按钮
                    activeWidget.viewModel.newMeasurement();

                    view.ui.add(activeWidget, "top-right");
                    setActiveButton(document.getElementById("area"));
                    break;
                case null:
                    if (activeWidget) {
                        view.ui.remove(activeWidget);
                        activeWidget.destroy();
                        activeWidget = null;
                    }
                    break;
            }
        }

        function setActiveButton(selectedButton) {
            // 聚焦视图以激活用于素描的键盘快捷键
            view.focus();
            var elements = document.getElementsByClassName("active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            if (selectedButton) {
                selectedButton.classList.add("active");
            }
        }
        //测量方法2
        if (1 < 0) {
            //距离测量
            const measurement1 = new Measurement({
                view: view,
                activeTool: "distance"
            });
            var dis = 0;
            $("#distance").click(function () {


                switch (dis) {
                    case 0:
                        view.ui.add(measurement1, "top-right");
                        dis = 1;
                        break;
                    case 1:

                        view.ui.remove(measurement1, "top-right");

                        //measurement1.clear(); 
                        dis = 0;
                        break;
                }
            });
            //面积测量
            const measurement2 = new Measurement({
                view: view,
                activeTool: "area",

            });
            var are = 0;
            $("#area").click(function () {

                switch (are) {
                    case 0:
                        view.ui.add(measurement2, "top-right");
                        are = 1;
                        break;
                    case 1:
                        view.ui.remove(measurement2, "top-right");
                        //measurement2.clear(); 
                        are = 0;
                        break;
                }
            });
        }


        /*******************************************
        *12，底图库
         ******************************************/
        var basemapGallery = new BasemapGallery({
            view: view
        });
        var base = 0;
        $("#basemapGallery").click(function () {
            switch (base) {
                case 0:
                    view.ui.add(basemapGallery, {
                        position: "top-right"
                    });
                    base = 1;
                    break;
                case 1:
                    view.ui.remove(basemapGallery, {
                        position: "top-right"
                    });
                    base = 0;
                    break;
            }
        });
        //去掉下方LOGO
        view.ui.remove("attribution");








    });