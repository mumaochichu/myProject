<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="detail.aspx.cs" Inherits="Smart.Water.Web.WaterUser.batteryChange.changeHistory.detail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/style.css" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/nprogress/nprogress.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/jquery-ui.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
    <script>
        $(function () {
            //停止进度条，初始化点击空白处，收缩二级菜单事件
            $(".ui-layout-container").click(function () {
                if (top.$("#user-nav > ul >li").hasClass("open")) {
                    top.$("#user-nav > ul >li").removeClass("open");
                }
            });
            top.NProgress.done();
        })
        var loc = window.location.href;
        var yshId = loc.substring(loc.indexOf('&') + 7);
        function Close() {
            window.location.href = "./changeHistory.html?id=" + yshId;
        }
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">电池更换记录信息查看</a>
                    <div style="float: right; padding-right: 20px; padding-top: 2px;">
                        <button type="button" class="btn btn-outline btn-primary" onclick="Close();">返回</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="widget-box">
                <div class="widget-title">
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#tab1">电池更换记录</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">户名:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_YSHHM" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td width="15%">户号:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_YSHHH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>册本号:</td>
                                <td>
                                    <asp:Label ID="txt_CBH" CssClass="form-control" runat="server"></asp:Label>

                                </td>
                                <td>营业所名称:</td>
                                <td>
                                    <asp:Label ID="txt_YYS" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>营业所名组:</td>
                                <td>
                                    <asp:Label ID="txt_YYSZ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>更换人:</td>
                                <td>
                                    <asp:Label ID="txt_GHR" CssClass="form-control" runat="server"></asp:Label>
                                </td>

                            </tr>
                            <tr>
                                <td>电池更换时间:</td>
                                <td>
                                    <asp:Label ID="txt_DCGHSJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>电池有效期(年):</td>
                                <td>
                                    <asp:Label ID="txt_DCYXQ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>下次更换时间:</td>
                                <td>
                                    <asp:Label ID="txt_XCGHSJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>备注:</td>
                                <td colspan="3">
                                    <asp:Label ID="txt_BZ" CssClass="form-control" runat="server"></asp:Label>
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
