<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SBDetail.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.jyz.SBDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>水泵信息详情</title>
    <link href="../../../js/Bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../js/Bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <div>
            <table class="table table-bordered">
                <tr>
                    <td style="width:15%">水泵编号</td>
                    <td style="width:35%">
                        <asp:Label ID="txt_SBBH" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                    <td style="width:15%">水泵品牌</td>
                    <td style="width:35%">
                        <asp:Label ID="txt_SBPP" CssClass="form-control " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>水泵型号</td>
                    <td>
                        <asp:Label ID="txt_SBXH" CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>水泵流量(m³/s)</td>
                    <td>
                        <asp:Label ID="TXT_SBLL" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>电机编号</td>
                    <td>
                        <asp:Label ID="txt_DJBH" CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>电机型号</td>
                    <td>
                        <asp:Label ID="txt_DJXH" CssClass="form-control " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>电机功率(kW)</td>
                    <td>
                        <asp:Label ID="txt_DJGL" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                    <td>电机额定电流(A)</td>
                    <td>
                        <asp:Label ID="txt_DJEDGL" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>电机转速(r/min)</td>
                    <td>
                        <asp:Label ID="txt_DJZS" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                    <td>电机台数(台)</td>
                    <td>
                        <asp:Label ID="txt_DJTS" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>水泵扬程(m)</td>
                    <td>
                        <asp:Label ID="txt_SBYC" CssClass="form-control required " runat="server"></asp:Label>
                    </td>
                    <td>安装时间</td>
                    <td>
                        <asp:Label ID="txt_AZSJ" CssClass="form-control required " runat="server"></asp:Label>
                       
                    </td>
                </tr>
                <tr>
                    <td>备注信息</td>
                    <td colspan="3">
                        <asp:Label ID="txt_SBBZ" CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                
            </table>
        </div>
    </form>
</body>
</html>
