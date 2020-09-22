<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SBEdit.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.jyz.SBEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>水泵信息编辑</title>

    <link href="../../../js/Bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />


    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../js/Bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>

    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>

    <script>
        /*添加成功失败，返回弹窗提示*/
        function alertInfo(content, typeInfo) {
            noty({
                text: content,
                type: typeInfo,
                layout: "topCenter",
                timeout: 2000
            });
            try {
                if (typeInfo == 'success') {

                    var Sblist = parent.Robin.Window.GetInfoPanelByID("SBList");
                    Sblist.normalize();
                    parent.document.getElementById('sbFrame').contentWindow.refresh();
                    window.setTimeout(function () {
                        top.Robin.CloseOneInfoPanel("SBEdit");
                    }, 1000);
                }
            }
            catch (e) {

            }

        };
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <div>
            <table class="table table-bordered">
                <tr>
                    <td>水泵编号</td>
                    <td>
                        <asp:TextBox ID="txt_SBBH" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                    <td>水泵品牌</td>
                    <td>
                        <asp:TextBox ID="txt_SBPP" CssClass="form-control " runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>水泵型号</td>
                    <td>
                        <asp:TextBox ID="txt_SBXH" CssClass="form-control  " runat="server"></asp:TextBox>
                    </td>
                    <td>水泵流量(m³/s)</td>
                    <td>
                        <asp:TextBox ID="TXT_SBLL" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>电机编号</td>
                    <td>
                        <asp:TextBox ID="txt_DJBH" CssClass="form-control  " runat="server"></asp:TextBox>
                    </td>
                    <td>电机型号</td>
                    <td>
                        <asp:TextBox ID="txt_DJXH" CssClass="form-control " runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>电机功率(kW)</td>
                    <td>
                        <asp:TextBox ID="txt_DJGL" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                    <td>电机额定电流(A)</td>
                    <td>
                        <asp:TextBox ID="txt_DJEDGL" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>电机转速(r/min)</td>
                    <td>
                        <asp:TextBox ID="txt_DJZS" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                    <td>电机台数(台)</td>
                    <td>
                        <asp:TextBox ID="txt_DJTS" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>水泵扬程(m)</td>
                    <td>
                        <asp:TextBox ID="txt_SBYC" CssClass="form-control required " runat="server"></asp:TextBox>
                    </td>
                    <td>安装时间</td>
                    <td>
                        <input class="form-control" type="text" id="txt_AZSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                    </td>
                </tr>
                <tr>
                    <td>备注信息</td>
                    <td colspan="3">
                        <asp:TextBox ID="txt_SBBZ" CssClass="form-control  " runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <asp:Button ID="btnSave" runat="server" Text="保存" CssClass="btn btn-info center-block" OnClick="btnAdd_Click" />
                    </td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>
