<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="delete.aspx.cs" Inherits="Smart.Water.Web.WaterUser.system.archives.delete" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/style.css" />
    <link href="../../../js/jQuery/Plugins/nprogress/nprogress.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/jsPanel/jquery.jspanel.min.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/jquery-ui.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script src="../../../js/jQuery/Plugins/jsPanel/jquery.jspanel.min.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
    <script>
        var loc = window.location.href;
        var Id = loc.substring(loc.indexOf('?') + 4);
        var name = decodeURI(loc.substring(loc.indexOf('&') + 6));
        $(function () {
            $('input:text:first').focus();
            var options = $("#txt_YYS").val();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                async: false,
                url: 'Handler.ashx?Action=Tree',
                success: function (result) {
                    var showContent = ""
                    $.each(result, function (i, v) {
                        if (v.JDID == options) {
                            $("#sel_YYS").text(v.NAME);
                        }
                        if (v.JDID == $("#txt_YYSZ").val()) {
                            $("#sel_YYSZ").text(v.NAME);
                        }
                    });
                }
            });
            $("#btnSave").click(function () {
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });
            //停止进度条，初始化点击空白处，收缩二级菜单事件
            $(".ui-layout-container").click(function () {
                if (top.$("#user-nav > ul >li").hasClass("open")) {
                    top.$("#user-nav > ul >li").removeClass("open");
                }
            });
            top.NProgress.done();
        });
        function Close() {
            window.location.href = "./list.html";
        }
        function alertInfo() {
            confirm("<div class='notyContent'>确定要对用户【" + name + "】进行销户操作吗？</div>",
                "information", function () {
                    $.ajax({
                        url: "Handler.ashx?Action=Delete&Id=" + Id,
                        success: function (result) {
                            if (result == "true") {
                                noty({ text: "销户成功！", type: "success", layout: "topCenter", timeout: 1000 });
                                window.setTimeout(function () {
                                    window.location.href = "./list.html";
                                }, 1000);
                            } else {
                                noty({ text: "销户失败！", type: "error", layout: "topCenter", timeout: 2000 });
                            }
                        }
                    });
                }, null,
            '确定', '取消');
        };
        /*
         * 装载模块到主页面中。
         * @author Robin
         * @param {String} id 主键ID。
         * @param {String} category 文件大类是必须和ftppathxml.xml中的pathtype对应的，且必须要对应Upload下的文件夹名称，三者一致
         * @param {String} SMALLNAME 子文件类别。
         */
        /**
        * confirm提示.需要提前加载noty.这个方法放在utils里会报错
        * 需要引用js/Bootstrap/Version3/css/bootstrap-button.css，js/Noty/packaged/jquery.noty.packaged.min.js
        * @param message 提示的内容
        * @param type 类型information,alert,error,success,warning
        * @param okCallback yes执行的方法
        * @param cancelCallback no执行的方法
        * @param lblok yes显示的内容
        * @param lblcancel no显示的内容
        * @constructor
        */
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
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">用水户销户</a>
                    <div style="float: right; padding-right: 20px; padding-top: 2px;">
                        <button type="button" class="btn btn-outline btn-primary" onclick="Close();">返回</button>
                        <button type="button" class="btn btn-outline btn-primary" onclick="alertInfo()">销户</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="widget-box">
                <div class="widget-title">
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#tab1">用户基本信息</a></li>
                        <li><a data-toggle="tab" href="#tab2">水表信息及监测参数</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">户号:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_YSHHH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td width="15%">户名:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_YSHHM" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>册本号:</td>
                                <td>
                                    <asp:Label ID="txt_CBH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>营业所:</td>
                                <td>
                                    <asp:Label ID="sel_YYS" CssClass="form-control  " runat="server"></asp:Label>
                                    <input id="txt_YYS" type="hidden" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>开户时间:</td>
                                <td>
                                    <asp:Label ID="txt_KHSJ" CssClass="form-control  " runat="server"></asp:Label>
                                </td>
                                <td>管理类型:</td>
                                <td>
                                    <asp:Label ID="txt_GLLX" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="display: none">区划编号:</td>
                                <td style="display: none">
                                    <asp:Label ID="txt_CITYCODE" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>区划名称:</td>
                                <td>
                                    <asp:Label ID="txt_CITYNAME" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>关联监测点:</td>
                                <td>
                                    <asp:Label ID="sel_GLJCB" CssClass="form-control" runat="server"></asp:Label>
                                    <input id="SELID" type="hidden" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>联系人:</td>
                                <td>
                                    <asp:Label ID="txt_LXR" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>联系人电话:</td>
                                <td>
                                    <asp:Label ID="txt_PHONE" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>小区户数:</td>
                                <td>
                                    <asp:Label ID="txt_XQHS" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>营业所组:</td>
                                <td>
                                    <asp:Label ID="sel_YYSZ" CssClass="form-control" runat="server"></asp:Label>
                                    <input id="txt_YYSZ" type="hidden" runat="server" />
                                </td>

                            </tr>
                            <tr>
                                <td>管道口径(mm):</td>
                                <td>
                                    <asp:Label ID="txt_GDKJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>地址:</td>
                                <td colspan="3">
                                    <asp:Label class="form-control" type="text" ID="txt_DZ" runat="server" Style="width: 100%" /></asp:Label>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="tab2" class="tab-pane">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">表具型号:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_BJXH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td width="15%">表体编号:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_BTBH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>水表设备状态:</td>
                                <td>
                                    <asp:Label ID="txt_SBZT" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>装表时间:</td>
                                <td>
                                    <asp:Label ID="txt_ZBSJ" CssClass="form-control  " runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>设备编号:</td>
                                <td>
                                    <asp:Label ID="txt_SBBH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>SIM卡卡号:</td>
                                <td>
                                    <asp:Label ID="txt_SIMKH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr style="display: none">
                                <td>通讯卡缴费时间:</td>
                                <td>
                                    <asp:Label ID="txt_JFSJ" CssClass="form-control  " runat="server"></asp:Label>
                                </td>
                                <td>缴费周期(月):</td>
                                <td>
                                    <asp:Label ID="txt_JFZQ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>电池更换时间:</td>
                                <td>
                                    <asp:Label ID="txt_DCGHSJ" CssClass="form-control  " runat="server"></asp:Label>
                                </td>
                                <td>电池更换周期(年):</td>
                                <td>
                                    <asp:Label ID="txt_DCGHZQ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>备注:</td>
                                <td colspan="3">
                                    <asp:Label class="form-control" ID="txt_BZ" runat="server" Style="width: 100%" /></asp:Label>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
