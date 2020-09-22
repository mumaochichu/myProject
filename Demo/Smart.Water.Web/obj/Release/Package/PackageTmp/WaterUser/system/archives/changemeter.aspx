<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="changemeter.aspx.cs" Inherits="Smart.Water.Web.WaterUser.system.archives.changemeter" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>用水户换表添加</title>
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
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
    <script>
        $(function () {
            $('#txt_CBH').focus();
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
                            $("#sel_YYS").val(v.NAME);
                        }
                        if (v.JDID == $("#txt_YYSZ").val()) {
                            $("#sel_YYSZ").val(v.NAME);
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
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./list.html";
                    }, 1000);
                }
            } catch (e) {
            }
        };
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">用水户换表</a>
                    <div style="float: right; padding-right: 20px; padding-top: 2px;">
                        <button type="button" class="btn btn-outline btn-primary" onclick="Close();">返回</button>
                        <asp:Button ID="btnSave" CssClass="btn btn-info center-block" runat="server" Text="确定" OnClick="btnSave_Click"></asp:Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="widget-box">
                <div class="widget-title">
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#tab1">水表基本信息</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">户号:</td>
                                <td width="35%">
                                    <input type="text" class="form-control" runat="server" id="txt_YSHHH" disabled="disabled" />
                                </td>
                                <td width="15%">户名:</td>
                                <td width="35%">
                                    <input type="text" class="form-control" runat="server" id="txt_YSHHM" disabled="disabled" />
                                </td>
                            </tr>
                            <tr>
                                <td>册本号:</td>
                                <td>
                                    <input type="text" class="form-control" runat="server" id="txt_CBH" disabled="disabled" />
                                </td>
                                <td>营业所:</td>
                                <td>
                                    <input type="text" class="form-control" runat="server" id="sel_YYS" disabled="disabled" />
                                    <input id="txt_YYS" type="hidden" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>营业所组:</td>
                                <td>
                                    <input type="text" class="form-control" runat="server" id="sel_YYSZ" disabled="disabled" />
                                    <input id="txt_YYSZ" type="hidden" runat="server" />
                                </td>
                                <td>表具型号:</td>
                                <td>
                                    <asp:TextBox ID="txt_BJXH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>表体编号:</td>
                                <td>
                                    <asp:TextBox ID="txt_BTBH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td>新水表运行状态:</td>
                                <td>
                                    <asp:TextBox ID="txt_XSBYXZT" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>旧表净累计指数:</td>
                                <td>

                                    <asp:TextBox ID="txt_JBJLJ" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>旧表正累计指数:</td>
                                <td>
                                    <asp:TextBox ID="txt_JBZLJ" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>旧表负累计指数:</td>
                                <td>
                                    <asp:TextBox ID="txt_JBFLJ" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>换表人员:</td>
                                <td>
                                    <asp:TextBox ID="txt_HBRY" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>换表时间:</td>
                                <td>
                                    <input class="form-control required" type="text" id="txt_HBSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                                <td>换表原因:</td>
                                <td>
                                    <textarea rows="3" class="form-control" runat="server" id="txt_HBYY"></textarea>
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
