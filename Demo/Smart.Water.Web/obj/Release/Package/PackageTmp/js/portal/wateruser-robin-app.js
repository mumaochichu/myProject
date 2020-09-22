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
    "portal/wateruser-robin-setting",
    "Framework/robin-mvvm",
    "portal/wateruser-robin-portal"],//ArcGis javascript API
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
        location.href = "../wtlogin.html";
    }
    else {
        $("#loginUserName").html($.cookie("userName"));
    }
    Robin.Map.init();

    //先请求平台，获取当前用户的usekey,赋予robin-setting中Robin.Setting.GlobalProperty.Query.userKey.
    $.getScript(Robin.Setting.GlobalSetting.SystemService + "/Handler/UserKey.ashx?m=GetCurrentUserKey&f=json&cb=GetUserkeyCallback");

    //计算页面高度宽度,自动改变布局
    $(window).resize(function () {
        $("#exampleTabsOne,#exampleTabsTwo").height($(window).height() - $("#header").height() - $("#sidebar").height() - $("#Rowfluid").height() - 5);
        $("#Main_Map_DIV").height($("#exampleTabsOne").height());
        if ($(window).width() < 1200) {
            $("#tool").css("margin-right", "0px");
        } else {
            $("#tool").css("margin-right", "300px");
        }
    });
    $("#exampleTabsOne,#exampleTabsTwo").height($(window).height() - $("#header").height() - $("#sidebar").height() - $("#Rowfluid").height() - 5);
    $("#Main_Map_DIV").height($("#exampleTabsOne").height());

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
        var params = Robin.Utils.GetQueryObject();
        //<!------------------------------菜单点击事件Start------------------------------------------>
        //点击菜单事件，跳转非在线监测活动窗口，隐藏用水户列表，和报警窗口
        $(".tabbMenu").click(function () {
            $("#alertWindow").hide();
            $("#WaterList").hide();
        });
        //点击打开在线监测窗口显示用水户列表和报警窗口
        $("#RealtimeMonitor").click(function () {
            $("#alertWindow").show();
            var panel = $("#WaterList").css("display");
            if (panel != "block") {
                MarkwaterPlant();
            }

        })

        //历史查询-历史数据查询点击事件
        $("#historyQuery").click(function () {
            NProgress.start();
            $("#myFrame").attr("src", "history/historyQuery.html");
        });
        //历史查询-报警数据查询点击事件
        $("#alarmQuery").click(function () {
            $("#myFrame").attr("src", "history/alarmReport.html");
        });


        //设备维护-设备报修点击事件
        $("#equipmentMaintenance").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "system/equipment/maintenance.html");

        });
        //设备维护-电池更换点击事件
        $("#batteryReplacement").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "batteryChange/changeList.html");

        });
        //设备维护-通讯卡管理点击事件
        $("#SIMMANAGER").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "simChange/simChangeList.html");
        });
        //基础信息-营业所信息点击事件
        $("#yysInfo").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "yysManage/yysList.html");
        });
        //基础信息-换表信息点击事件
        $("#changeMeter").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "changemeter/changemeter.html");
        });
        //基础信息-水表设备信息点击事件
        $("#waterMeter").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "waterMeter/waterMeter.html");
        });
        //基础信息一用水户管理菜单点击事件
        $("#Archives").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "system/archives/list.html");
        });
        //基础信息一营业所组管理菜单点击事件
        $("#yysGroup").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "yysManage/yysGroup/yysGroupList.html");
        });


        //获取登陆用户名称
        $("#lblUserName").html(decodeURI(decodeURI(params.name)));
        //用户信息
        $("#userInfo").click(function () {

            var title = "用户信息";
            var url = 'system/user/userInfo.htm';
            Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%" id="frmUserInfoFrame" frameborder="0" scrolling="no" ></iframe>',
                        { id: 'userInfoPanel', theme: '#2e363f', contentSize: { width: 550, height: 300 }, position: 'center', headerControls: { controls: "closeonly" } });
        });

        //统计分析-用水统计点击事件
        $("#Report").click(function (event) {
            $("#myFrame").attr("src", "Statistics/report/report.html");
        });
        //统计分析-节水监测点击事件
        $("#monotoring").click(function (event) {
            NProgress.start();
            $("#myFrame").attr("src", "Statistics/monitoring.html");
        });
        //统计分析-智能配表
        $("#matchAnalysis").click(function (event) {
            $("#myFrame").attr("src", "Statistics/matchAnalysis.html");
        });
        //统计分析-漏水分析
        $("#leakageAnalysis").click(function (event) {
            $("#myFrame").attr("src", "Statistics/leakageAnalysis.html");
        });
        //统计分析-单点分析
        $("#oneAnalysis").click(function (event) {
            $("#myFrame").attr("src", "Statistics/oneAnalysis/oneAnalysis.html");
        });
        //统计分析-同比分析(与上年同时期)
        $("#onYearAnalysis").click(function (event) {
            $("#myFrame").attr("src", "Statistics/compare/onYearAnalysis.html");
        });
        //统计分析-环比分析(与相邻阶段)
        $("#onMonthAlysis").click(function (event) {
            $("#myFrame").attr("src", "Statistics/compare/onMonthAnalysis.html");
        });
        //密码修改
        $("#pwdEdit").click(function () {
            var title = "密码修改";
            var url = 'system/user/changePassword.htm';
            Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%" id="frmPwdEditFrame" frameborder="0" scrolling="no" ></iframe>',
                        { id: 'pwdEditPanel', theme: '#2e363f', contentSize: { width: 300, height: 210 }, position: 'center', headerControls: { controls: "closeonly" } });
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
                                  location.href = "../wtlogin.html";
                              });
                          }
                      });
                  }, null,
              '确定', '取消');
        });

        //<!------------------------------菜单点击事件END------------------------------------------>


        //<!------------------------------报警相关START------------------------------------------>
        //报警信息关闭
        $("#btnAlertClose").click(function () {
            $("#alertWindow").hide();
        });

        /*监测点信息定位*/
        $(document).on("click", "#alertScroll>a", function () {
            var stationKey = $(this).attr('stationKey');
            parent.Robin.Portal.Page.YSH.locate(stationKey);
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

        //<!------------------------------报警相关END------------------------------------------>


        //<!------------------------------实时监测界面初始化Start------------------------------------------>

        //加载页面时候加载用水户列表标注
        MarkwaterPlant();
        //加载页面时候加载报警信息
        $("#alertWindow").show();
        $("#alertWindow").draggable({ containment: "#exampleTabsOne", scroll: false });
        //<!------------------------------实时监测界面初始化END------------------------------------------>

    });
}


/*获取userkey返回函数*/
function GetUserkeyCallback(result) {
    var userKey = Robin.Setting.GlobalProperty.Query.userKey;
    Robin.Setting.GlobalProperty.Query.userKey = "?USERKEY=" + (userKey ? userKey : (result ? "" : result.toString())) + "&";



    Robin.Map.InitMap(function () {
        $(".esriControlsBR").hide();
        //Robin.Portal.navToolbar = new esri.toolbars.Navigation(Robin.Map.Map2DControl);

        /* 加载专题图层*/
        //Robin.Portal.addModule({
        //    name: 'TopicLayerPlugin',
        //    containerid: 'ZT_DIV',
        //    path: 'plugin/'
        //});

        /* 加载工具条*/
        Robin.Portal.addModule({
            name: 'ToolBar',
            containerid: 'ToolBar_DIV',
            path: 'plugin/'
        });

        Robin.Portal.addModule({
            name: 'MapLayerControlPlugin',
            containerid: 'LayerControl_DIV',
            path: 'plugin/'
        });
        //地图zoom-end事件
        Robin.Map.Map2DControl.on("zoom-end", function (zoom) {
            var level = zoom.level;
            var pic = 1;
            var piclength = 36;
            var fontsize = 15;
            if (level < 2) {
                pic = 0.6
            } else if (level < 3) {
                pic = 0.7
            } else if (level < 4) {
                pic = 0.8
            } else if (level < 5) {
                pic = 0.9
            }
            var graphicLayers = Robin.Map.Map2DControl.graphicsLayerIds;
            for (var i = 0; i < graphicLayers.length; i++) {
                if (graphicLayers[i] != "graphicsLayerYYSPQ") {
                    var graphicLayer = Robin.Map.GetGraphicLayer(Robin.Map.Map2DControl, graphicLayers[i]);
                    //遍历修改隐藏标注
                    for (var j = 0; j < graphicLayer.graphics.length; j++) {
                        if (graphicLayer.graphics[j].symbol.type == "textsymbol") {
                            graphicLayer.graphics[j].symbol.font.size = fontsize * pic;
                            if (level < 3) {
                                $(".mapWindow_monitor").hide();
                            } else {
                                $(".mapWindow_monitor").show();
                            }
                        } else {
                            graphicLayer.graphics[j].symbol.width = piclength * pic;
                            graphicLayer.graphics[j].symbol.height = piclength * pic;
                        }
                    }
                }
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
            location.href = "../wtlogin.html";
        }
    });
}
//显示大用水户列表悬浮窗体
function MarkwaterPlant() {
    jsPanel.closeChildpanels("body");
    var result = parent.Robin.Portal.Page.YSH.query();
    var Title = "用水户列表";
    var url = 'system/YSH.html';
    $.jsPanel(
      {
          headerTitle: Title + ":" + result.length + "户",
          autoclose: false,
          content: '<iframe src=" ' + url + ' " width="100%" height="100%" frameborder="0" scrolling="no"></iframe>',
          paneltype: 'hint',
          theme: '#2b3d51',
          id: 'WaterList',
          minimizeOthers: false,
          contentSize: { width: 320, height: 450 },
          position: { my: "left", at: "left", offsetX: 30, offsetY: 100 },
          draggable: {
              containment: "#exampleTabsOne"
          }
      });

}

