/**
 * Robin UI Framework
 * 核心基础配置模块.
 * @author Created by RobinChang on 2014-9-23.
 * @version 1.0
 * @license Copyright (c) 2007-2014 robin studio
 */

//初始化顶层命名空间
if (!this["Robin"]) { Robin = {}; }
//初始化Setting命名空间
if (!this["Robin.Setting"]) { Robin.Setting = {}; }

//共享平台服务配置
Robin.Setting.LiquidGISMapServices = [
    /**
    @ID 图层服务唯一编号 用数字表示
    @ServiceTopic 资源目录编号 瓦片：资源目录编号+"_"+资源标识
    @MapLayerType 服务类型 矢量、瓦片
    @Url 瓦片路径，资源目录时为空
    @Icon 图片url
    @Visible 加载时是否加载
    @Order 排序号
    */


        //宿州使用
          {
              ID: '1',
              ServiceTopic: 'A02_SUZHOUDX',
              Name: '宿州地形图瓦片',
              MapLayerType: 'ArcGISTiledMapServiceLayer',
              Url: '/Tile/ArcGISREST/suzhoudx.gis',
              Icon: '../images/Map/jnyx.png',
              Visible: 'true',
              Order: '1'
          },
        {
            ID: '2',
            ServiceTopic: 'G03B',
            Name: '供水专题数据',
            Type: 'LiquidGIS',
            MapLayerType: 'ArcGISDynamicMapServiceLayer',
            Url: '',
            Icon: '../images/Map/jnyx.png',
            Visible: 'true',
            Order: '3'
        },

        //公司开发
         //{
         //    ID: '1',
         //    ServiceTopic: 'A02_SUZHOUDXNEW',
         //    Name: '宿州地形图瓦片',
         //    MapLayerType: 'ArcGISTiledMapServiceLayer',
         //    Url: '/Tile/ArcGISREST/SUZHOUDXNEW.gis',
         //    Icon: '../images/Map/jnyx.png',
         //    Visible: 'true',
         //    Order: '1'
         //},
         //{
         //    ID: '2',
         //    ServiceTopic: 'S03',
         //    Name: '供水专题数据',
         //    Type: 'LiquidGIS',
         //    MapLayerType: 'ArcGISDynamicMapServiceLayer',
         //    Url: '',
         //    Icon: '../images/Map/jnyx.png',
         //    Visible: 'true',
         //    Order: '3'
         //}
];


/** 
 * 地图分析
 */
Robin.Setting.MapAnalyse = {
    //消火栓查询
    hydrant: {
        grphicLayerName: "hydrantGraphic",
        hydrantLayerName: "hydrantLayer",
        url: 'http://172.30.16.248/ArcGIS/rest/services/SZ/GX/MapServer/37',//公司
        //url: "http://192.168.70.6/ArcGIS/rest/services/GX/GX/MapServer/9",//宿州
        defaultRadius: 200,
        fieldName: '附属物',
        fieldValue: ['消防栓'],
        showFields: [{ name: '图上点号', showName: '编号' },
            { name: '物探点号', showName: '管点点号' },
            { name: '特征', showName: '材质' },
            { name: '地面高程', showName: '地面高' },
            { name: '井底深', showName: '井深' },
            { name: 'X坐标', showName: 'X' },
            { name: 'Y坐标', showName: 'Y' }
        ],
        //火焰标注相关设置
        fireMark: {
            canvesId: "surfaceCanvas",
            windowDivId: "surfaceCanvasMapWindow"
        }
    },
    //路径规划
    route: {
        grphicLayerName: "routeGraphic",
        //公司
        url: 'http://172.30.16.248/ArcGIS/rest/services/SZ/route/NAServer/Route',
        //宿州
        //url: 'http://192.168.70.6/ArcGIS/rest/services/other/Route/NAServer/Route',
        roadFieldName: '',
        routeLayerName: "routeGraphicLayer",
    }

}

//定义系统配置变量
//包含了全局配置信息. 
Robin.Setting.GlobalSetting = {
    /** 
    * 养护周期
    */
    CuringCycle: 30,
    //工具条类型
    //simple:一般  full：全
    ToolBarType: 'simple',

    //服务平台地址.<请同时更改登录页中配置>  
    //公司
    SystemService: "http://172.30.16.248:8000",
    //宿州
    //SystemService: "http://192.168.70.6:8000",
    
    //统一数据服务平台地址.  
    //公司
    RestAPIService: "http://172.30.16.248:801/gcloud",
    //宿州
    //RestAPIService: "http://192.168.70.6:801/gcloud",
    //监测点信息获取地址.  
    BasicMonitorService: "/iot/monitors/v1",
    //获取ArcGIS排水管网服务地址
    ArcGISMapServices: "/gis/layers/v1/SZ_GS",
    //历史数据查询起始年份时间.
    HistortyTreeStartTime: "2017",
    //泵站信息获取地址.  
    PumpStationService: "/iot/monitors/pumpstation/v1/",
    //雨量站列表获取地址.  
    RainFallInfoService: "/OTService/Rainfall/",
    //获取检测项信息地址.  
    ConfigService: "/iot/configs/v1",
    //获取预警项信息地址.  
    AlertService: "/iot/alertcharts/v1",
    //初始化配置和报警数据.  
    InitDataService: "/iot/initdatas/v1",
    //历史监测数据获取地址.  
    //HistoryService: "/HWService/History/",
    HistoryService: "/iot/historycharts/v1/",
    //获取区划信息.
    CityCode: "140000",
    //webSocket服务器.  
    gprsSocketServer: 'ws://192.168.70.6:8181/',

    //刷新时间间隔.  
    messageRefreshInterval: 60000,
    //弹窗数据刷新间隔.
    windowDataRefreshInterval: 10000,
    //实时总览数据刷新间隔.
    overViewRefreshInterval: 60000,
    //ConfigData刷新时间间隔.
    configDataRefreshInterval: 10000,

    //坐标系.  
    wkid: 3857,
    // 资源跨域共享启用服务器.  
    corsEnabledServers: ['192.168.0.200', '192.168.0.200:8000'],
    //超时.  
    timeout: 20000,
    //代理地址. 
    proxyUrl: "http://" + window.location.host + "/Smart.Water.Web/proxy/proxy.ashx",

    //监测点类型配置.  
    MonitorType: [
        { name: '消火栓', key: '030104' }
    ],
    //消火栓监测点
    HyrantCode: "030104"
};

Robin.Setting.GlobalSetting.Map = {
    current: 0,
    datas: [
        {
            name: 'arcgis',
            file: 'js/Framework/robin-map-arcgis.js',
            api: 'js/ArcGIS/init.js',
            css: ["js/ArcGIS/js/esri/css/esri.css", "js/ArcGIS/popup/css/modernGrey.css"],
            outer: 'false'
        },
        {
            name: 'googleMap',
            file: 'robin-map-googlemap',
            api: 'http://maps.google.com/maps/api/js?v=3.18&libraries=geometry,places,visualization&language=es',
            outer: 'true'
        }
    ]
};



//包含了全局属性变量. 
Robin.Setting.GlobalProperty = {
    //地图.  
    map: {},
    //比例尺.  
    scale: 1,
    //导航工具条.  
    navToolbar: {},
    //鹰眼.  
    overviewMap: {},
    //测量是否启用.  
    measureOn: false,
    //测量组件.  
    measurement: {},
    //用于标记的图形.  
    markerGraphic: {},
    //比例尺.  
    scalebar: {},
    //根据topic请求图层回调函数.  
    layerRequestCallback: {},
    //图层控制中资源控制回调函数.  
    mapRequestCallback: {},
    //全局服务存储集合.  
    globalMapService: [],
    //保存主题编号.  
    dlTopics: [],
    //保存服务编号.  
    dlServices: [],
    //资源是否可见.  
    dlFlag: [],
    //动态图层信息.  
    dynamicMapServiceLayers: [],
    //查询相关配置.  
    Query: {
        //userKey.  
        userKey: 'a67db68dbfb2752f9b913dff9ece867117c87e95',
        //查询结果.  
        result: null,
        //几何图形.  
        geometry: null,
        //是否使用代理.  
        useProxy: false
    }
};

//包含了地图默认配置信息. 
Robin.Setting.MapSetting = {
    //初始缩放级别
    zoom: 5,
    //关闭Logo标记.  
    logo: false,
    //在地图上显示一个滚动条.  
    slider: false,
    //地图初始化缩放
    initExtent: {
        xmin: 491392.94793933,//宿州
        xmax: 508732.68127267,
        ymin: 714481.21652433,
        ymax: 731820.94985767
    },
    // userKey.  
    enableUserKey: false,
    //加载个性化操作文件，该文件包涵方法Robin.Map.customInit(map) .  
    custom: '' //'portal/waterlogging-robin-extend'
};





