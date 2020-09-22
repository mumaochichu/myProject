<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="editGroup.aspx.cs" Inherits="Smart.Water.Web.WaterUser.yysManage.yysGroup.editGroup" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>营业所组编辑</title>
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
            window.location.href = "./yysGroupList.html";
        }
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./yysGroupList.html";
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
                    <a href="#" class="current" style="font-size: 12px">营业所组添加</a>
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
                                <td style="width: 15%">营业所编号:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_YYSBH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td style="width: 15%">营业所名称:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_YYSMC" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">组号:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_YYSZH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td style="width: 15%">组名:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_YYSZM" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%">负责人:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_FZR" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td style="width: 15%">负责人电话:</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txt_PHONE" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>地址:</td>
                                <td>
                                    <textarea rows="3" class="form-control" runat="server" readonly="readonly" id="txt_YYSDZ"></textarea>
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
