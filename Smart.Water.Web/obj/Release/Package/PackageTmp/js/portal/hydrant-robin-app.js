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

/* 装载系统启动所用脚本 */
RequireJS([
    "Framework/robin",
    "Framework/robin-utils",
 "portal/hydrant-robin-setting",
     "portal/hydrant-extend-map",
    "portal/hydrant-robin-portal"],//ArcGis javascript API
    function () {
        /*判断用户是否登录*/
        IsLoginOrNot();
        Application_Start();  // 先载入noty,避免崩溃现象 


    }
);

/* 判断用户是否登录，没有登录跳转到登录页面*/
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

/* 应用程序启动 首先进行布局初始化 ,然后初始化事件*/
function Application_Start() {
    Robin.Map.init();
    //初始化一次监测点数据
    //Robin.Data.init(function () {
    //    /* 加载工具条*/

    //});
    /*先请求平台，获取当前用户的usekey,赋予robin-setting中Robin.Setting.GlobalProperty.Query.userKey.*/
    $.getScript(Robin.Setting.GlobalSetting.SystemService + "/Handler/UserKey.ashx?m=GetCurrentUserKey&f=json&cb=GetUserkeyCallback");

    /*计算页面高度宽度,自动改变布局*/
    $(window).resize(function () {
        //$("#Main_Map_DIV").height($(window).height() - $(".b_header").height() - 50);
        $("#Main_Map_DIV").height($(window).height());
    });

    //$("#Main_Map_DIV").height($(window).height() - $(".b_header").height() - 2);
    $("#Main_Map_DIV").height($(window).height());



    $("#Div_Warning").hide();

    /*绑定按钮点击事件.*/
    bindButtonEvent();

    /*数据初始化后，加载模块插件*/
    Robin.Portal.Initial(function () {

        /*加载数据展示地图标注.*/
        $("#DataDisplay").addClass("selected");
        $("#ermenu").show();
        var NormalList = Robin.Portal.SystemData.NormalList;
        //LabelList(NormalList);
    });
    $(document).on("jspanelclosed", function (event, id) {

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
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, Robin.Setting.MapAnalyse.hydrant.grphicLayerName);
        }
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
            containerid: 'ToolBar_DIV',
            path: '../js/plugin/'
        });
        Robin.Portal.addModule({
            name: 'MapLayerControlPlugin',
            containerid: 'LayerControl_DIV',
            path: 'plugin/'
        });

        $("#dataListDiv").slimscroll({height:300});//左侧列表滚动条
    });
   
};

var isConstruction = 0;
var isNormal = 0;
var isDiscard = 0;

function bindButtonEvent() {
    $("#maintenanceReminder").click(function () {
        jsPanel.closeChildpanels("body");
        var Title = "养护提醒";
        var url = '../FireHydrant/MaintenanceReminder/MaintenanceReminder.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>',
        {
            paneltype: 'hint',
            theme: '#c26613',
            id: 'MaintenanceReminder',
            contentSize: { width: 1250, height: 450 },
            position: { my: "left", at: "left", offsetX: 100, offsetY: 100 }
        });
    });
    $("#infoManagement").click(function () {

        var Title = "消火栓信息列表";
        var url = '../FireHydrant/InfoManagement/InfoManagement.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="InfoManagementFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'InfoManagement',
            theme: '#c26613',
            contentSize: { width: 1250, height: 600 },
            position: 'center',
            controls: 'all',
            headerControls: { minimize: "remove" },
            ////headerControls: {'all'
            ////},
            //paneltype: 'tooltip'
        });
    });
    //窗口关闭事件
    $(document).on("click", ".jsglyph-close", function () {
        $.each(Robin.Map.Map2DControl.graphicsLayerIds, function (i, item) {
            Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, item).clear();
        });
    });
    $("#DataDisplay").click(function () {

        var Title = "抢险分析";
        var url = '../FireHydrant/DataDisplay/DataDisplay.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="datadisplayFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'datadisplay',
            theme: '#c26613',
            contentSize: { width: 550, height: 450 },
            position: { my: 'right-top', at: 'right-top', offsetX: -50, offsetY: 200 },
            headerControls: { minimize: "remove" }
        });
    });
    /*Excel批量导入*/
    $("#LotImport").click(function () {
        var Title = "批量导入";
        var url = '../FireHydrant/Import/LotImport.aspx';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="lotImportFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'lotImport',
            theme: '#c26613',
            contentSize: { width: 300, height: 110 },
            position: 'center',
            headerControls: { minimize: "remove" },
            paneltype: 'hint'
        });
       
    });
    /*消火栓维护保养*/
    $("#hyrantAssert").click(function () {
        jsPanel.closeChildpanels("body");
        var Title = "维护保养信息列表";
        var url = '../FireHydrant/HyrantAssert/assertList.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" id="assertFrame" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'assert',
            theme: '#c26613',
            contentSize: { width: 1190, height: 600 },
            position: 'center',
            headerControls: { minimize: "remove" },
            paneltype: 'hint'
        });
    });
    /*数据统计*/
    $("#Statistics").click(function () {
        var Title = "数据统计";
        var url = '../FireHydrant/DataDisplay/Statistics.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
        {
            id: 'assert',
            theme: '#c26613',
            contentSize: { width: 460, height: 267 },
            position: 'center',
            headerControls: { minimize: "remove" },
            paneltype: 'hint'
        });
    });
    /*空间分布*/
    $("#spaceSpread").click(function () {
        if (isNormal == 0) {
            var point = new esri.geometry.Point([388432.1694002728, 3641498.9111004397], new esri.SpatialReference({
            wkid: Robin.Setting.GlobalSetting.wkid }));
            Robin.Map.Map2DControl.centerAndZoom(point, 6);
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "nolyLayer");
            var NormalList = Robin.Portal.SystemData.NormalList;
            var ConstructionList = Robin.Portal.SystemData.ConstructionList;
            var DiscardList = Robin.Portal.SystemData.DiscardList;
            LabelData(DiscardList);
            LabelData(ConstructionList);
            LabelData(NormalList);
            isNormal = 1;
        }
        else {
            /*清除标注*/
            Robin.Map.ClearLayer(Robin.Map.Map2DControl, "nolyLayer");
            isNormal = 0;
            Robin.Map.MapWindow.CloseAll();
        }
    });
    $("#normal").click(function () {
        //$("#normal1").attr("checked");
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
}


function LeftliClick(id) {
    for (var i = 0; i < Robin.Portal.SystemData.NormalList.length; i++) {
        if (Robin.Portal.SystemData.NormalList[i].ID == id) {
            //Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-normal");
            ShowPoint(Robin.Portal.SystemData.NormalList[i]);
            return;
        }
    }
    for (var i = 0; i < Robin.Portal.SystemData.ConstructionList.length; i++) {
        if (Robin.Portal.SystemData.ConstructionList[i].ID == id) {
            //Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-construction");
            ShowPoint(Robin.Portal.SystemData.ConstructionList[i]);
        }
        return;

    }
    for (var i = 0; i < Robin.Portal.SystemData.DiscardList.length; i++) {
        if (Robin.Portal.SystemData.DiscardList[i].ID == id) {

            //Robin.Map.ClearLayer(Robin.Map.Map2DControl, "bz-discard");
            ShowPoint(Robin.Portal.SystemData.DiscardList[i]);
        }
        return; 

    }
}

function ShowPoint(data) {
    Robin.Portal.MapTool.data = data;
    var symbolConfig = {
        font:
            { 'size': "13", 'style': 'normal' },
        color: [0, 89, 149],
        pic: {
            src: '../images/manhole/gstation.png',
            width: 30,
            height: 30
        },
        offset: {
            x: 0,
            y: -30
        }
    }
    var tpname = "";
    symbolConfig.pic.src = "";
    //判断展示文件名
    if (data.STATUS == "正常") {
        tpname = "bz-normal";
    }
    if (data.STATUS == "在建") {
        tpname = "bz-construction";
    }
    if (data.STATUS == "作废") {
        tpname = "bz-discard";
    }
    Robin.Map.MapWindow.CloseAll();
    var StationListLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, tpname);
    //地图渲染图标
    if (data.JCDNAME == null) {
        Robin.Map.ShowGraphic(StationListLayer, data.POINTNO, data.X, data.Y, "../images/hydrant/" + tpname + ".png", data, symbolConfig);
    } else {
        Robin.Map.ShowGraphic(StationListLayer, data.JCDNAME, data.X, data.Y, "../images/hydrant/" + tpname + ".png", data, symbolConfig);
    }


    //让图标飞起来
    var point = Robin.Map.GetPoint(data.X, data.Y);
    Robin.Portal.MapTool.flyMap(Robin.Map.Map2DControl, point);
    //飞完后弹出窗口
    var windowInfo = {
        POINTX: data.X,
        POINTY: data.Y
    }
    Robin.Portal.ShowMapWindow(windowInfo, "", "");
    //点击图标显示弹窗
    Robin.Map.Event.bindClickEvent(StationListLayer, function (evt) {
        Robin.Portal.ShowMapWindow(windowInfo, "", "");
    });
}

function LabelList(data, layerName) {
    var symbolConfig = {
        font:
            { 'size': "13", 'style': 'normal' },
        color: [0, 89, 149],
        pic: {
            src: '../images/manhole/gstation.png',
            width: 30,
            height: 30
        },
        offset: {
            x: 0,
            y: -30
        }
    }
    var tpname = layerName;
    var StationListLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, tpname);
    $.each(data, function (i, item) {
        symbolConfig.pic.src = "";
        if (item.JCDNAME == null) {
            Robin.Map.ShowGraphic(StationListLayer, item.POINTNO, item.X, item.Y, "../images/hydrant/" + tpname + ".png", item, symbolConfig);
        }
        else {
            Robin.Map.ShowGraphic(StationListLayer, item.JCDNAME, item.X, item.Y, "../images/hydrant/" + tpname + ".png", item, symbolConfig);
        }
    });
    Robin.Map.Event.bindClickEvent(StationListLayer, function (evt) {
        Robin.Portal.MapTool.data = evt.attributes;//在此处传递数据
        Robin.Map.MapWindow.CloseAll();
        //点击图标显示弹窗
        var windowInfo = {
            POINTX: evt.attributes.X,
            POINTY: evt.attributes.Y
        }
        Robin.Portal.ShowMapWindow(windowInfo, "", "");
    });
}

/*在一个图层上显示*/
function LabelData(data) {
    var symbolConfig = {
        font:
            { 'size': "13", 'style': 'normal' },
        color: [0, 89, 149],
        pic: {
            src: '../images/manhole/gstation.png',
            width: 30,
            height: 30
        },
        offset: {
            x: 0,
            y: -30
        }
    }
    var tpname = "";
    var tpname2 = "nolyLayer";
    var StationListLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, tpname2);
    $.each(data, function (i, item) {
        symbolConfig.pic.src = "";
        //判断展示文件名
        if (item.STATUS == "正常") {
            tpname = "bz-normal";
        }
        if (item.STATUS == "在建") {
            tpname = "bz-construction";
        }
        if (item.STATUS == "作废") {
            tpname = "bz-discard";
        }
        //地图渲染图标
        if (item.JCDNAME == null) {
            Robin.Map.ShowGraphic(StationListLayer, item.POINTNO, item.X, item.Y, "../images/hydrant/" + tpname + ".png", item, symbolConfig);
        }
        else {
            Robin.Map.ShowGraphic(StationListLayer, item.JCDNAME, item.X, item.Y, "../images/hydrant/" + tpname + ".png", item, symbolConfig);
        }
    });
    Robin.Map.Event.bindClickEvent(StationListLayer, function (evt) {
        Robin.Portal.MapTool.data = evt.attributes;//在此处传递数据
        Robin.Map.MapWindow.CloseAll();
        //点击图标显示弹窗
        var windowInfo = {
            POINTX: evt.attributes.X,
            POINTY: evt.attributes.Y
        }
        Robin.Portal.ShowMapWindow(windowInfo, "", "");
    });

}
//消火栓列表搜索
$("#search").click(function () {
    var keyword = $("#sstext").val().trim();
    var html = "";
    $.ajax({
        cache: false,
        url: "MaintenanceReminder/Handler.ashx?Action=LabelList",
        dataType: "json",
        type: "get",
        success: function (data) {
            var zjCount = 0, zcCount = 0, zfCount = 0;
            
            for (var j = 0; j < data.length; j++) {
                Robin.Portal.SystemData.AllList.push(data[j]);
                var qq = data[j].POINTNO;
                if (qq.indexOf(keyword) >= 0) {
                    Robin.Portal.SystemData.NormalList.push(data[j]);
                    if (data[j].JCDNAME == null) {
                        html += "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].POINTNO + "<span class='zaijian' style='color:#5CB85C'>" + data[j].STATUS + "</span></li>";
                        zcCount++;
                    } else {
                        html += "<li id='" + data[j].ID + "' onclick='LeftliClick(\"" + data[j].ID + "\")'>" + data[j].JCDNAME + "<span class='zaijian' style='color:#5CB85C'>" + data[j].STATUS + "</span></li>";
                        zcCount++;
                    }
                    //$("#dataList").html(html);
                }
            }
            $("#dataList").html(html);
            Robin.Portal.MapTool.PointTyleNo.ZJNO = zjCount;
            Robin.Portal.MapTool.PointTyleNo.ZCNO = zcCount;
            Robin.Portal.MapTool.PointTyleNo.ZFNO = zfCount;
            //if (completed != null && $.isFunction(completed)) {
            //    completed();
            //}
        },
        error: function (result, status) {
            alert(status);
        }
    })
})
var name, passW;

/* 登录 */
var LoginSend = function (n, p) {
    //var isSilverlightInstalled = false;
    //try {
    //    try {
    //        var slControl = new ActiveXObject('AgControl.AgControl'); //检查IE   
    //        isSilverlightInstalled = true;
    //    }
    //    catch (e) {
    //        if (navigator.plugins["Silverlight Plug-In"]) //检查非IE   
    //        {
    //            isSilverlightInstalled = true;
    //        }
    //    }
    //}
    //catch (e) { }
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

