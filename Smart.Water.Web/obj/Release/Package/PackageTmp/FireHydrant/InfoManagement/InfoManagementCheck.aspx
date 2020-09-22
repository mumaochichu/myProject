<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="InfoManagementCheck.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.InfoManagement.InfoManagementCheck" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>消火栓信息查看</title>
    <link href="../../js/Bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../js/Bootstrap/bootstrap.min.js"></script>
    <script src="../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <style type="text/css">
        .td_justify {
            text-align: justify;
            text-justify: distribute-all-lines;
            text-align-last: justify;
        }

            .td_justify span {
                margin-left: 10px;
                margin-right: 10px;
            }

        table tr td input {
            width: 90%;
        }
    </style>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <table class="table table-bordered">
            <tr>
                <td style="width: 15%;vertical-align:middle;" class="td_justify"><span>管点编号</span></td>
                <td style="width: 35%;vertical-align:middle;">
                    <asp:Label ID="txt_POINTNO" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td style="width: 15%;vertical-align:middle;" class="td_justify"><span>口径(mm)</span></td>
                <td style="width: 35%;vertical-align:middle;">
                    <asp:Label ID="txt_SIZES" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>维保单位</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_WBDW" CssClass="form-control " runat="server"></asp:Label>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>生产厂家</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_MANUFACTURER" CssClass="form-control" runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>建成年月</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label CssClass="form-control " type="text" ID="txt_JCNY" runat="server" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>埋设方式</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="ddl_EMBED" runat="server" CssClass="form-control "> </asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>使用状态</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="ddl_STATUS" runat="server" CssClass="form-control"></asp:Label>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>监测点</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="ddl_JCDNAME" CssClass="form-control" runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>X坐标</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_X" CssClass="form-control" runat="server"></asp:Label>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>Y坐标</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_Y" CssClass="form-control" runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>联系人</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_LXR" CssClass="form-control" runat="server"></asp:Label>
                </td>
                <td style="vertical-align:middle;text-align:center;"><span>联系人电话</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_LXRDH" CssClass="form-control" runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;text-align:center;"><span>维保周期(月)</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_WBZQ" CssClass="form-control" runat="server"></asp:Label>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>井深(m)</span></td>
                <td style="vertical-align:middle;">
                    <asp:Label ID="txt_JS" CssClass="form-control" runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>地址</span></td>
                <td colspan="3" style="vertical-align:middle;">
                    <asp:Label ID="txt_ADDRESS" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>备注</td>
                <td colspan="3" style="vertical-align:middle;">
                    <textarea id="txt_BZ" rows="3" class="form-control" runat="server" readonly="readonly" style="resize:none;width: 98%;background-color:#FFF!important"></textarea>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
