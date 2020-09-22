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
        {
            ID: '1',
            //ServiceTopic: 'A02_SUZHOUDX',
            ServiceTopic: 'A02_FUYANGDX8',
            Name: '阜阳地形图瓦片',
            MapLayerType: 'ArcGISTiledMapServiceLayer',
            //Url: '/Tile/ArcGISREST/SUZHOUDX.gis',
            Url: '/Tile/ArcGISREST/FUYANGDX8.gis',
            Icon: '../images/Map/jnyx.png',
            Visible: 'true',
            Order: '1'
        },
         //{
         //    ID: '2',
         //    ServiceTopic: 'G01',
         //    Name: '地形数据',
         //    MapLayerType: 'ArcGISDynamicMapServiceLayer',
         //    Url: '',
         //    Icon: '../images/Map/jnyx.png',
         //    Visible: 'true',
         //    Order: '2'
         //},
          {
              ID: '2',
              ServiceTopic: 'H03',
              Name: '供水专题数据',
              Type: 'LiquidGIS',
              MapLayerType: 'ArcGISDynamicMapServiceLayer',
              Url: '',
              Icon: '../images/Map/jnyx.png',
              Visible: 'true',
              Order: '3'
          }
];

//ArcGIS服务地址,为了后期脱离平台准备
Robin.Setting.ArcGISMapServices = [

   {
       id: 'wsgx', name: '供水管线', url: 'http://172.30.16.248/ArcGIS/rest/services/FuYang/FYGX/MapServer',
       item: [
            {
                name: "JSPOINT", aliasName: "供水管点",
                Files: [
                    { name: "EXP_NO", alias: "管点点号" },
                    { name: "X", alias: "X坐标" },
                    { name: "Y", alias: "Y坐标" },
                    { name: "FEATURE", alias: "特征" },
                    { name: "SUBSID", alias: "附属物" },
                    { name: "PSTYPE", alias: "形状" },
                    { name: "PMA", alias: "材质" },
                    { name: "DEEP", alias: "埋深" }
                ]
            },
            {
                name: "ZSPOINT", aliasName: "中水管点",
                Files: [
                    { name: "EXP_NO", alias: "管点点号" },
                    { name: "X", alias: "X坐标" },
                    { name: "Y", alias: "Y坐标" },
                    { name: "FEATURE", alias: "特征" },
                    { name: "SUBSID", alias: "附属物" },
                    { name: "PSTYPE", alias: "形状" },
                    { name: "PMA", alias: "材质" },
                    { name: "DEEP", alias: "埋深" }
                ]
            },
            {
                name: "JSLINE", aliasName: "供水管线",
                Files: [
                    { name: "S_POINT", alias: "起点点号" },
                    { name: "S_DEEP", alias: "起点埋深" },
                    { name: "E_POINT", alias: "终点点号" },
                    { name: "E_DEEP", alias: "终点埋深" },
                    { name: "MATERIAL", alias: "材质" },
                    { name: "D_S", alias: "管径" },
                    { name: "USEDSTATE", alias: "使用状态" }
                ]
            },
            {
                name: "ZSLINE", aliasName: "中水管线",
                Files: [
                    { name: "S_POINT", alias: "起点点号" },
                    { name: "S_DEEP", alias: "起点埋深" },
                    { name: "E_POINT", alias: "终点点号" },
                    { name: "E_DEEP", alias: "终点埋深" },
                    { name: "MATERIAL", alias: "材质" },
                    { name: "D_S", alias: "管径" },
                    { name: "USEDSTATE", alias: "使用状态" }
                ]
            },
       ]
   }
  

];

/** 
 * 定义管网图层信息. 
 */
Robin.Setting.PipeLayerInfos = [
    /**
    @LayerName 数组的主键，自定义
    @LayerType 图层类型编码 0101
    @LayerType 图层英文名称
    @AliasName 别名

    @TemplatePath 模板地址
    @ScriptPath 脚本地址
    @CssPath 样式文件地址
    */
    //{
    //    LayerName: "PS_PUMPSTATION",
    //    LayerType: "010301",
    //    LayerCode: "PS_PUMPSTATION",
    //    AliasName: "排水泵站",
    //    MapService: "",
    //    Icon: "",
    //    TemplatePath: "../js/Templates/PS_PUMPSTATION.htm",
    //    ScriptPath: "../js/Templates/PS_PUMPSTATION.js",
    //    CssPath: "../js/Templates/PS_PUMPSTATION.css",
    //    PanelConfig: '{"size":{ "width": 590, "height": 310 }}'
    //},
    //{
    //    LayerName: "PS_MANHOLE",
    //    LayerType: "010201",
    //    LayerCode: "PS_MANHOLE",
    //    AliasName: "检查井",
    //    MapService: "",
    //    Icon: "",
    //    TemplatePath: "../js/Templates/PS_MANHOLE.html",
    //    ScriptPath: "../js/Templates/PS_MANHOLE.js",
    //    CssPath: "../js/Templates/PS_MANHOLE.css",
    //    PanelConfig: '{"size":{ "width": 570, "height": 320 }}'
    //},
    //{
    //    LayerName: "PS_WATERPOINT",
    //    LayerType: "011196",
    //    LayerCode: "PS_WATERPOINT",
    //    AliasName: "地上积水点",
    //    MapService: "",
    //    Icon: "",
    //    TemplatePath: "Templates/PS_WATERPOINT.htm",
    //    ScriptPath: "Templates/PS_WATERPOINT.js",
    //    CssPath: "Templates/PS_WATERPOINT.css",
    //    PanelConfig: '{"size":{ "width": 550, "height": 304 }}'
    //},
    //{
    //    LayerName: "PS_RAINFALL",
    //    LayerType: "011197",
    //    LayerCode: "PS_RAINFALL",
    //    AliasName: "雨量站",
    //    MapService: "",
    //    Icon: "",
    //    TemplatePath: "../js/Templates/PS_RAINFALL.htm",
    //    ScriptPath: "../js/Templates/PS_RAINFALL.js",
    //    CssPath: "../js/Templates/PS_RAINFALL.css",
    //    PanelConfig: '{"size":{ "width": 550, "height": 304 }}'
    //},
    //{
    //    LayerName: "WS_PRESSURETAP",
    //    LayerType: "030302",
    //    LayerCode: "WS_PRESSURETAP",
    //    AliasName: "压力监测点",
    //    MapService: "",
    //    Icon: "",
    //    TemplatePath: "Templates/PS_GeneralStation.htm",
    //    ScriptPath: "Templates/PS_GeneralStation.js",
    //    CssPath: "Templates/PS_GeneralStation.css",
    //    PanelConfig: '{"size":{ "width": 550, "height": 304 }}'
    //},
    //  {
    //      LayerName: "WS_WATERPARTICLE",
    //      LayerType: "030301",
    //      LayerCode: "WS_WATERPARTICLE",
    //      AliasName: "水质监测点",
    //      MapService: "",
    //      Icon: "",
    //      TemplatePath: "Templates/PS_WaterQuality.htm",
    //      ScriptPath: "Templates/PS_WaterQuality.js",
    //      CssPath: "Templates/PS_WaterQuality.css",
    //      PanelConfig: '{"size":{ "width": 550, "height": 304 }}'
    //  },
      {
          // 一般类型
          LayerName: "General",
          LayerType: "",
          LayerCode: "General",
          AliasName: "监测点信息",
          MapService: "",
          Icon: "",
          TemplatePath: "../js/Templates/General.htm",
          ScriptPath: "../js/Templates/General.js",
          CssPath: "../js/Templates/General.css",
          PanelConfig: '{"size":{ "width": 550, "height": 304 }}'
      },
      {
          // 多监测项监测点
          LayerName: "MultiGeneral",
          LayerType: "",
          LayerCode: "MultiGeneral",
          AliasName: "监测点信息",
          MapService: "",
          Icon: "",
          TemplatePath: "../js/Templates/MultiGeneral.htm",
          ScriptPath: "../js/Templates/MultiGeneral.js",
          CssPath: "../js/Templates/MultiGeneral.css",
          PanelConfig: '{"size":{ "width": 550, "height": 304 }}'
      }
];


//定义系统配置变量
//包含了全局配置信息. 
Robin.Setting.GlobalSetting = {
    //工具条类型
    //simple:一般  full：全
    ToolBarType: 'simple',
    //服务平台地址.<请同时更改登录页中配置>  
    SystemService: "http://172.30.16.248:8000",
    //统一数据服务平台地址.  
    RestAPIService: "http://60.172.48.129:801/gcloud",
    //监测点信息获取地址.  
    BasicMonitorService: "/iot/monitors/v1",
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
    CityCode:"340000",
    //gprsSocketServer: 'ws://172.30.17.22:8181/',
    gprsSocketServer: 'ws://60.172.48.129:8181/',
    //webSocket服务器.  
    myscadaSocketServer: 'ws://172.30.17.22:8012/',
    //刷新时间间隔.  
    messageRefreshInterval: 60000,
    //弹窗数据刷新间隔.
    windowDataRefreshInterval: 10000,
    //实时总览数据刷新间隔.
    overViewRefreshInterval: 60000,
    //ConfigData刷新时间间隔.
    configDataRefreshInterval:10000,

    //基础服务.  
    BaseMapServices: {
        //用于各种几何分析使用的ArcGIS服务.  
        Geometry: {
            url: "http://172.30.17.212/ArcGIS/rest/services/Geometry/GeometryServer"
        },
        //打印服务.  
        Printing: {
            url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        },
        //地理编码服务.  
        Geocoding: {
            url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        },
        //供水管线
        WSGX: {
         
            url: "http://172.30.17.212/ArcGIS/rest/services/FuYang/FYGX/MapServer/28"
        },
      
        /** 
          * 兴趣点.  todo 暂未修改
          * @url 兴趣点服务地址
          * @category 类别
          */
        XQD: {
            url: "http://172.30.17.212/ArcGIS/rest/services/JINANNEW/DXJiNanNew/MapServer/0",
            //供水
            Supply: {
                Category: [
                 { name: '宾馆酒店', icon: '../images/Portal/symbol/宾馆酒店.png' },
                 { name: '小区', icon: '../images/Portal/symbol/商贸场所.png' },
                 { name: '学校', icon: '../images/Portal/symbol/教育.png' }
                ],
                //缓冲区半径
                Radius: 4
            },
            //燃气
            Gas: {
                Category: [
                    { name: '工厂', icon: '../images/Portal/symbol/宾馆酒店.png' },
                    { name: '小区', icon: '../images/Portal/symbol/商贸场所.png' }
                ],
                //缓冲区半径
                Radius: 4
            }
        },
        //定位服务.  
        Locations: {
            //图幅定位服务地址 
            msService: "http://172.30.17.212:8000/ArcGIS/MapService/Catalog/SDE.ZHUJI_MAP.gis",
            //地名定位服务地址
            AddresService: "http://172.30.17.212:8000/ArcGIS/MapService/Catalog/SDE.ZHUJI_UNITPT.gis",
            //道路中心线定位服务地址
            roadService: "http://172.30.17.212:8000/ArcGIS/MapService/Catalog/SDE.ZHUJI_TOWNROAD.gis"
        }
    },
  
    //坐标系.  
    //wkid: 3857,
    wkid: 2384,
    // 资源跨域共享启用服务器.  
    corsEnabledServers: ['192.168.0.200', '192.168.0.200:8000'],
    //超时.  
    timeout: 20000,
    //代理地址.  
    proxyUrl: Robin.Utils.Host.DirectPath() + "/proxy/proxy.ashx",
    //OPC相关设置.  
    OPC: {
        //myscada展示页面地址.  
        showViewUrl: 'http://demo.coderise.cn:98/'
    },
    //LED相关设置.  
    LED: {
        //服务地址.  
        service: '/DataService/BasicLinkLED/',//todo 待服务完成进行配置
        //LED默认格式.  
        format: '0145511#3^message^',
        //信息文本的占位符.  
        placeholder: '^message^'
    },
    //监测点类型配置.  
    MonitorType: [
        { name: '水源井', key: '030199' },
        { name: '加压站', key: '030202' },
        { name: '水厂', key: '030201' },
        { name: '管网监测点', key: '030304' }
    ]
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
        //xmin: 380828.91451299033,//阜阳
        //xmax: 398168.64784632361,
        //ymin: 3633561.5740837734,        
        //ymax: 3650901.3074171068
        xmin: 385842.48,//阜阳
        xmax: 392317.78,
        ymin: 3640199.81,
        ymax: 3643020.90
    },
    // userKey.  
    enableUserKey: false,
    //加载个性化操作文件，该文件包涵方法Robin.Map.customInit(map) .  
    custom: '' //'portal/waterlogging-robin-extend'
};
//包含了测试数据信息. 
Robin.Setting.Demo = {
    isShowDemo: "1",
    startTime: "2015-01-01",
    endTime: "2015-01-01",
}
