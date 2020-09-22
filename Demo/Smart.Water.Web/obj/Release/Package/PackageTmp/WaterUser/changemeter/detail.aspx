<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="detail.aspx.cs" Inherits="Smart.Water.Web.WaterUser.changemeter.detail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>换表信息查看</title>
    <link rel="stylesheet" href="../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../theme/wateruser/style.css" />
    <link href="../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <link href="../../js/jQuery/Plugins/nprogress/nprogress.css" rel="stylesheet" />

    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../js/jQuery/Plugins/jquery-ui.min.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
    <script>
        $(function () {
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
                        } if (v.JDID == $("#txt_YYSZ").val()) {
                            $("#sel_YYSZ").text(v.NAME);
                        }
                    });
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
            window.location.href = "./changemeter.html";
        }
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">换表信息</a>
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
                        <li class="active"><a data-toggle="tab" href="#tab1">换表信息</a></li>
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
                                    <asp:Label ID="sel_YYS" CssClass="form-control" runat="server"></asp:Label>
                                    <input id="txt_YYS" type="hidden" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>营业所组:</td>
                                <td>
                                    <asp:Label ID="sel_YYSZ" CssClass="form-control" runat="server"></asp:Label>
                                    <input id="txt_YYSZ" type="hidden" runat="server" />
                                </td>
                                <td>表具型号:</td>
                                <td>
                                    <asp:Label ID="txt_BJXH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>表体编号:</td>
                                <td>
                                    <asp:Label ID="txt_BTBH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>新水表运行状态:</td>
                                <td>
                                    <asp:Label ID="txt_XSBYXZT" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>旧表净累计指数:</td>
                                <td>
                                    <asp:Label ID="txt_JBJLJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>旧表正累计指数:</td>
                                <td>
                                    <asp:Label ID="txt_JBZLJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>旧表负累计指数:</td>
                                <td>
                                    <asp:Label ID="txt_JBFLJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>换表人员:</td>
                                <td>
                                    <asp:Label ID="txt_HBRY" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>换表时间:</td>
                                <td>
                                    <asp:Label ID="txt_HBSJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>换表原因:</td>
                                <td rowspan="3">
                                    <asp:Label ID="txt_HBYY" CssClass="form-control" runat="server"></asp:Label>
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
