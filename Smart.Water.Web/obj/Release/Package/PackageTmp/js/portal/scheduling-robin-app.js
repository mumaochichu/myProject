/// <reference path="E:\VS2015XM\Smart.Water\trunk\Smart.Water.Web\Scheduling/system/sc/List.html" />
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
    "portal/scheduling-robin-setting",
    "Framework/robin-mvvm",
    "portal/scheduling-robin-portal"],//ArcGis javascript API
    function () {
        Application_Start();  // 先载入noty,避免崩溃现象 
    }
);

var tmodel = null;
/* 应用程序启动 首先进行布局初始化 ,然后初始化事件*/
function Application_Start() {
    var name = $.cookie("loginUserName");
    var pwd = $.cookie("loginUserPassword");
    if (name && pwd) {
        LoginSend(name, pwd);
    }
    if (!$.cookie("userName")) {
        //如果没有登录，做相应处理
        location.href = "../Login.html";
    }
    else {
        $("#loginUserName").html($.cookie("userName"));
    }
    Robin.Map.init();

    //先请求平台，获取当前用户的usekey,赋予robin-setting中Robin.Setting.GlobalProperty.Query.userKey.
    $.getScript(Robin.Setting.GlobalSetting.SystemService + "/Handler/UserKey.ashx?m=GetCurrentUserKey&f=json&cb=GetUserkeyCallback");

    //计算页面高度宽度,自动改变布局
    $(window).resize(function () {
        $("#Main_Map_DIV").height($(window).height() - 20);

    });

    $("#Main_Map_DIV").height($(window).height() - 20);





    $(document).on("jspanelclosed", function (event, id) {
        if (Robin.Window._closeAll) {
            return;
        }
        var layer = Robin.graphicsLayer;
        var map = Robin.Map.Map2DControl;
        if (layer) {
            layer.clear();
            map.removeLayer(layer);
        }
        $.each(Robin.Window.instances,
            function (i, item) {
                if (item && item.id == id) {
                    $(item.obj[0]).html('');
                    Robin.Window.instances.splice(i);
                }
            });
    });


    //初始化一次监测点数据
    Robin.Data.init(function () {

        tmodel = new Robin.MVVM.ViewModel();

        //监测项过滤后添加
        $.each(Robin.Data.config, function (i, item) {

            $.each(Robin.Data.monitor, function (j, v) {
                if (item.STATION_KEY == v.BMID) {
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

        ko.applyBindings(tmodel, document.getElementById("alertWindow"));

        var wsImpl = window.WebSocket || window.MozWebSocket;
        var server = Robin.Setting.GlobalSetting.gprsSocketServer;

        window.ws = new wsImpl(server);

        ws.onmessage = function (evt) {
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
            //alert("通信失败，请刷新页面");
        }



    });

    //报警窗口关闭
    $("#btnAlertClose").click(function () {
        $("#alertWindow").hide();
    });
    $("#btnAlertLI").click(function () {
        $("#alertWindow").show();
    });

    $("#alertScroll").slimScroll({
        height: '310px'
    });

    /*监测点信息定位*/
    $(document).on("click", "#alertScroll>a", function () {
        var stationKey = $(this).attr('stationKey');
        var key = stationKey.substring(6, 12);
        if (key == '030304') {
            parent.Robin.Portal.Page.WGJCD.locate(stationKey);
        }
        if (key == '030202') {
            parent.Robin.Portal.Page.JYZ.locate(stationKey);
        }
        if (key == '030201') {
            parent.Robin.Portal.Page.SC.locate(stationKey);
        }
        if (key == '030199') {
            parent.Robin.Portal.Page.SYJ.locate(stationKey);
        }
    });

    /*处置窗口*/
    $(document).on("click", "#alertScroll>a>div>button", function () {
        var StationKey = $(this).parent().parent().attr('stationKey');
        var StationName = $(this).parent().parent().attr('stationName');
        var TagName = $(this).parent().parent().attr('tagName');
        var TagValue = $(this).parent().parent().attr('tagValue');
        var Units = $(this).parent().parent().attr('units');
        var SaveTime = $(this).parent().parent().attr('saveTime');
        var Info;
        if (SaveTime == null) {
            Info = TagName + TagValue + Units;
        }
        else {
            Info = "在" + SaveTime + "的" + TagName + "是" + TagValue + Units;
        }
        Robin.Portal.Alert.stationName = StationName;
        Robin.Portal.Alert.stationKey = StationKey;
        Robin.Portal.Alert.info = Info;
        Robin.Portal.Alert.alertId = $(this).parent().parent().attr('alertId');
        Robin.Window.InfoPanel("报警处置", '<iframe src="HandleAlert.html" width="100%" height="100%" style="border:0px" frameborder="0" ></iframe>',
      {
          id: 'HandleAlert',
          headerControls: { controls: "closeonly" },
          minimizeOthers: false,
          contentSize: { width: 300, height: 300 },
          theme: '#2b3d51'
      });
    });


    ////加压站信息管理(张保东添加)
    $("#jyz").click(function () {
        Robin.Window.InfoPanel("加压站管理", '<iframe id="listFrame"  src="system/jyz/List.html" width="100%" height="100%" frameborder="0"></iframe>',
      {

          id: 'List',
          theme: '#2b3d51',
          contentSize: { width: 1100, height: 600 },
          position: 'center',
          headerControls: { minimize: "remove" },
          paneltype: 'hint'
      });
    });
    ///水源井信息管理（张保东）
    $("#syj").click(function () {
        Robin.Window.InfoPanel("水源井管理", '<iframe id="syjFrame"  src="system/syj/SYJList.html" width="100%" height="100%" frameborder="0" scrolling="no" ></iframe>',
      {

          id: 'SYJList',
          theme: '#2b3d51',
          contentSize: { width: 1100, height: 600 },
          position: 'center',
          headerControls: { minimize: "remove" },
          paneltype: 'hint'
      });
    });



    ////水厂信息管理
    $("#sc").click(function () {
        var Title = "水厂管理";
        var url = 'system/sc/SCList.html';
        Robin.Window.InfoPanel(Title, '<iframe id="SCLIST" src=" ' + url + '"  width="100%" height="100%" frameborder="0"></iframe>',
           {
               id: 'scList',
               theme: '#2b3d51',
               contentSize: { width: 1100, height: 600 },
               position: 'center',
               headerControls: { minimize: "remove" },
               paneltype: 'hint'
           });
    });
    $("#gwjcd").click(function () {
        var Title = "管网监测点管理";
        var url = 'system/jcd/GWJCDList.html';
        Robin.Window.InfoPanel(Title, '<iframe id="GWJCDLIST" src=" ' + url + '"  width="100%" height="100%" frameborder="0"></iframe>',
           {
               id: 'gwjcdList',
               theme: '#2b3d51',
               contentSize: { width: 1100, height: 600 },
               position: 'center',
               headerControls: { minimize: "remove" },
               paneltype: 'hint'
           });
    });
    //区划信息（刘慧慧）
    $("#cityInfo").click(function () {
        var Title = "区划信息";
        var url = '../Common/CityInfo.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" width="100%" height="100%" id="cityInfoFrame" frameborder="0" scrolling="no" ></iframe>',
                   { id: 'cityInfoPanel', theme: '#2b3d51', paneltype: 'hint', contentSize: { width: 300, height: 420 }, position: 'center' });
    });

    //历史数据统计(姜佳岐添加)
    $("#lssjtj").click(function () {
        var Title = "历史数据统计";
        var url = 'history/historycs.html';
        Robin.Window.InfoPanel(Title, '<iframe src=" ' + url + '" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
           {
               id: 'LSSJList',
               contentSize: { width: 1300, height: 600 },
               theme: '#2b3d51'

           });
    });
  
    //报警数据统计(姜佳岐添加)
    $("#bjsjtj").click(function () {
        var Title = "报警数据统计";
        var url = 'history/AlarmReport.htm';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" width="100%" height="100%"  frameborder="0" scrolling="no" ></iframe>',
            {
                id: 'BJSJList',
                theme: '#2b3d51',
                contentSize: { width: 1300, height: 600 },
            });
    });
    $("#alllssjtj").click(function () {
        var Title = "历史数据导出";
        var url = 'history/newhistory.html';
        Robin.Window.InfoPanel(Title, '<iframe src=" ' + url + '" width="100%" height="100%" frameborder="0"></iframe>',
           {
               id: 'allLSSJList',
               contentSize: { width: 1150, height: 280 },
               theme: '#2b3d51',
               headerControls: {
                  controls: 'closeonly'
               }

           });
    });
    $("#allbjsjtj").click(function () {
        var Title = "报警数据导出";
        var url = 'history/allAlarmReport.html';
        Robin.Window.InfoPanel(Title, '<iframe src="' + url + '" width="100%" height="100%"  frameborder="0" ></iframe>',
            {
                id: 'allBJSJList',
                theme: '#2b3d51',
                contentSize: { width: 1300, height: 280 },
                headerControls: {
                    controls: 'closeonly'
                }
            });
    });
    //用户信息
    $("#userInfo").click(function () {
        var title = "用户信息";
        var url = 'system/user/userInfo.htm';
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%" id="frmUserInfoFrame" frameborder="0" scrolling="no" ></iframe>',
                    { id: 'userInfoPanel', theme: '#2b3d51', contentSize: { width: 550, height: 300 }, position: 'center', headerControls: { controls: "closeonly" } });
    });

    //密码修改
    $("#pwdEdit").click(function () {
        var title = "密码修改";
        var url = 'system/user/changePassword.htm';
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%" id="frmPwdEditFrame" frameborder="0" scrolling="no" ></iframe>',
                    { id: 'pwdEditPanel', theme: '#2b3d51', contentSize: { width: 300, height: 210 }, position: 'center', headerControls: { controls: "closeonly" } });
    });
    $("#btnFacilitiesNum").click(function () {
        var title = "设施统计";
        var url = 'system/FacilitiesNum.html';
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%"  frameborder="0" ></iframe>',
            {
                id: 'SSTJList',
                theme: '#2b3d51',
                contentSize: { width: 850, height: 320 },
                headerControls: {
                    controls: 'closeonly'
                }
            });
    });

    //用户退出
    $("#userLogout").click(function () {
        confirm("<div class='notyContent'>确定要退出系统吗？</div>",
              "information", function () {
                  $.ajax({
                      url: '../Handler/LoginAuthorize.ashx?Action=Logout',
                      success: function () {
                          var url = Robin.Setting.GlobalSetting.SystemService;
                          url = url + "/Handler/Logout.ashx";
                          $.getScript(url, function (data) {
                              location.href = "../Login.html";
                          });
                      }
                  });
              }, null,
          '确定', '取消');
    });
    var params = Robin.Utils.GetQueryObject();
    //用户信息
    $("#lblUserName").html(decodeURI(decodeURI(params.name)));


    /*日报表*/
    $("#DayReport").click(function () {
        var title = "日报";
        var url = "reports/DayReport.html";
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '"frameborder="0" width="100%" height="100%" scrolling="no"></iframe>',
            {
                id: 'dayReport',
                theme: '#2b3d51',
                contentSize: { width: 1000, height: 500 },
                controls: { iconfont: 'font-awesome' },
                minimizeOthers: false
            });
    });
    /*月报表*/
    $("#MonthReport").click(function () {
        var title = "月报";
        var url = "reports/MonthReport.html";
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '"frameborder="0" width="100%" height="100%" scrolling="no"></iframe>',
            {
                id: 'monthReport',
                theme: '#2b3d51',
                contentSize: { width: 1000, height: 500 },
                controls: { iconfont: 'font-awesome' },
                minimizeOthers: false
            });
    });
    /*年报表*/
    $("#YearReport").click(function () {
        var title = "年报";
        var url = "reports/YeayReport.html";
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '"frameborder="0" width="100%" height="100%" scrolling="no"></iframe>',
            {
                id: 'yearReport',
                theme: '#2b3d51',
                contentSize: { width: 1000, height: 500 },
                controls: { iconfont: 'font-awesome' },
                minimizeOthers: false
            });
    });
    $("#allReport").click(function () {
        var title = "日报总览";
        var url = "reports/allreport.html";
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '"frameborder="0" width="100%" height="100%" scrolling="no"></iframe>',
            {
                id: 'allreport',
                theme: '#2b3d51',
                contentSize: { width: 1000, height: 500 },
                controls: { iconfont: 'font-awesome' },
                minimizeOthers: false
            });
    });
}

/*获取userkey返回函数*/
function GetUserkeyCallback(result) {
    var userKey = Robin.Setting.GlobalProperty.Query.userKey;
    Robin.Setting.GlobalProperty.Query.userKey = "?USERKEY=" + (userKey ? userKey : (result ? "" : result.toString())) + "&";


    Robin.Map.InitMap(function () {
        $(".esriControlsBR").hide();
        Robin.Portal.navToolbar = new esri.toolbars.Navigation(Robin.Map.Map2DControl);

        /* 加载专题图层*/
        Robin.Portal.addModule({
            name: 'TopicLayerPlugin',
            containerid: 'ZT_DIV',
            path: 'plugin/'
        });

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

        ////地图加载完成后，监听鼠标移动事件，显示坐标信息
        //dojo.connect(Robin.Map.Map2DControl, "onLoad", function () {

        //    dojo.connect(Robin.Map.Map2DControl, "onMouseMove", function (event) {
        //        var x = event.mapPoint.x.toFixed(2);
        //        var y = event.mapPoint.y.toFixed(2);
        //        var screenX = event.pageX;
        //        var screenY = event.pageY;
        //        $("#pointInfoContent").html("X坐标:" + x + "米|　Y坐标:" + y + "米");
        //    });
        //});
        Robin.Map.Map2DControl.on("zoom-end", function (zoom) {
            var level = zoom.level;
            var picFactor = 1;
            var textFactor = 1;
            if (level < 4) {
                $(".mapWindow_monitor").hide();
                $(".mapWindow").hide()
                $(".mapWindow_corner").hide();
                picFactor = 0.8;
                textFactor = 0.8;
            } else {
                $(".mapWindow_monitor").show();
                $(".mapWindow").show();
                $(".mapWindow_corner").show();
            }
            var graphicLayers = Robin.Map.Map2DControl.graphicsLayerIds;
            for (var i = 0; i < graphicLayers.length; i++) {
                var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, graphicLayers[i]);
                //遍历修改标注
                for (var j = 0; j < graphicLayer.graphics.length; j++) {
                    if (graphicLayer.graphics[j].symbol.url) {
                        graphicLayer.graphics[j].symbol.height = 30 * picFactor;
                        graphicLayer.graphics[j].symbol.width = 30 * picFactor;
                    } else {
                        graphicLayer.graphics[j].symbol.font.size = 15 * textFactor;
                        graphicLayer.graphics[j].symbol.yoffset = -30 * picFactor;
                    }
                }
                graphicLayer.redraw();
            }
        })
    });



}

/*noty信息提示*/
function confirm(message, type, okCallback, cancelCallback, lblok, lblcancel) {
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
}

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
            location.href = "../login.html";
        }
    });
}


