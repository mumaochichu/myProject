<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="maintenancePersonCheck.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.InfoManagement.WebForm5" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维保人员查看</title>
    <link href="../../js/Bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../js/Bootstrap/bootstrap.min.js"></script>
        <style>
        .td_justify {
            text-align: justify;
            text-justify:distribute-all-lines;
            text-align-last:justify;
        }
                                
            .td_justify span {
                margin-left:18px;
                margin-right:18px;
            }
    </style>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <table class="table table-bordered">
            <tr>
                <td style="width:16%;" class="td_justify"><span>所属单位</span></td>
                <td style="width: 34%">
                    <asp:Label ID="txt_UNITNAME" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td style="width:16%;" class="td_justify"><span>职工号</span></td>
                <td style="width: 34%">
                    <asp:Label ID="txt_CODE" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td class="td_justify"><span>姓名</span></td>
                <td>
                    <asp:Label ID="txt_NAME" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>性别</span></td>
                <td>
                    <asp:Label ID="txt_SEX" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td class="td_justify"><span>民族</span></td>
                <td>
                    <asp:Label ID="txt_NATION" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>出生日期</span></td>
                <td>
                    <asp:Label ID="txt_BORN" CssClass="form-control  " runat="server"></asp:Label>
                </td>
<%--                <td class="td_justify"><span>年龄</span></td>
                <td>
                    <asp:Label ID="txt_AGE" CssClass="form-control " runat="server"></asp:Label>
                </td>--%>
            </tr>
<%--            <tr>
                <td class="td_justify"><span>民族</span></td>
                <td>
                    <asp:Label ID="txt_NATION" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>身份证号</span></td>
                <td>
                    <asp:Label ID="txt_IDCARD" CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>--%>
            <tr>
                <td class="td_justify"><span>入职时间</span></td>
                <td>
                    <asp:Label ID="txt_ENTRYTIME" CssClass="form-control  " runat="server"></asp:Label>                    
                </td>   
                <td class="td_justify"><span>联系电话</span></td>
                <td>
                    <asp:Label ID="txt_PHONENUMBER" CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td class="td_justify" style="vertical-align:middle;"><span>备注</span></td>
                <td colspan="3">
                    <textarea id="txt_REMARK" rows="3" class="form-control" runat="server" readonly="readonly" style="width: 98%;resize:none;background-color:#FFF!important"></textarea>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
