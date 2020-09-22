<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="waterMeterAdd.aspx.cs" Inherits="Smart.Water.Web.WaterUser.waterMeter.waterMeterAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>水表设备信息添加</title>
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
    <script src="../../js/jQuery/Plugins/validation/jquery.validate.min.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
</head>
<script>
    $(function () {
        $('input:text:first').focus();
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
        window.location.href = "./waterMeter.html";
    }
    function alertInfo(content, typeInfo) {
        noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
        try {
            if (typeInfo == 'success') {
                window.setTimeout(function () {
                    window.location.href = "./waterMeter.html";
                }, 1000);
            }
        } catch (e) {
        }
    };
</script>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">水表设备添加</a>
                    <div style="float: right; padding-right: 20px; padding-top: 2px;">
                        <button type="button" class="btn btn-outline btn-primary" onclick="Close();">返回</button>
                        <asp:Button ID="btnSave" CssClass="btn btn-info center-block" runat="server" OnClick="btnSave_Click" Text="确定"></asp:Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="widget-box">
                <div class="widget-content tab-content">
                    <div class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td style="width: 15%">设备型号:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_SBXH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td style="width: 15%">公称口径(mm):</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_GCKJ" CssClass="form-control required number" runat="server" ></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">计量等级:</td>
                                <td style="width: 35%">
                                    <asp:DropDownList ID="txt_JLDJ" CssClass="form-comtrol required" runat="server">
                                        <asp:ListItem Text="--请选择--" Value="" Selected="True"></asp:ListItem>
                                        <asp:ListItem Text="A" Value="A"></asp:ListItem>
                                        <asp:ListItem Text="B" Value="B"></asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                                <td style="width: 15%">最大流量(m³/h):</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_ZDLL" CssClass="form-control required number" runat="server" ></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">常用流量(m³/h):</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_CYLL" CssClass="form-control required number" runat="server" ></asp:TextBox>
                                </td>
                                <td style="width: 15%">分界流量(m³/h):</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_FJLL" CssClass="form-control required number" runat="server" ></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">最小流量(m³/h):</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_ZXLL" CssClass="form-control required number" runat="server" ></asp:TextBox>
                                </td>
                                <td style="width: 15%">安装口径（mm）:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_AZKJ" CssClass="form-control number" runat="server" ></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">长（mm）:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_LENTH" CssClass="form-control requied number" runat="server" ></asp:TextBox>
                                </td>
                                <td style="width: 15%">高（mm）:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_HEIGHT" CssClass="form-control number" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">法兰外径（mm）:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_FLWJ" CssClass="form-control requied number" runat="server" ></asp:TextBox>
                                </td>
                                <td style="width: 15%">螺孔中心直径（mm）:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_LKZXZJ" CssClass="form-control number" runat="server" ></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">连接螺纹:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_LJLW" CssClass="form-control requied" runat="server"></asp:TextBox>
                                </td>
                                <td>备注:</td>
                                <td>
                                    <textarea rows="3" class="form-control" runat="server" id="txt_BZ"></textarea>
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
