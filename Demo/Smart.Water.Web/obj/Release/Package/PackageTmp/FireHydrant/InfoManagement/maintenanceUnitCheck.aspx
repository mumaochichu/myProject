<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="maintenanceUnitCheck.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.InfoManagement.WebForm2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维保单位查看</title>
        <link href="../../js/Bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../js/Bootstrap/bootstrap.min.js"></script>
    <style type="text/css">
        .td_justify {
            text-align: justify;
            text-justify:distribute-all-lines;
            text-align-last:justify;
        }
                                
            .td_justify span {
                margin-left:13px;
                margin-right:13px;
            }
    </style>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <table class="table table-bordered">
            <tr>
                <td style="width: 15%;" class="td_justify"><span>单位名称</span></td>
                <td style="width: 35%">
                    <asp:Label ID="txt_UNITNAME" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td style="width: 15%;" class="td_justify"><span>机构代码</span></td>
                <td style="width: 35%">
                    <asp:Label ID="txt_UNITCODE" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
              <tr>
                <td style="vertical-align:middle;text-align:center;"><span>公司规模(人)</span></td>
                <td>
                    <asp:Label ID="txt_UNITSICE" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>成立时间</span></td>
                <td>
                    <asp:Label ID="txt_ACTIVATETIME" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
                 <tr>
                <td class="td_justify"><span>法人代表</span></td>
                <td>
                    <asp:Label ID="txt_LEGALPERSON" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>负责人</span></td>
                <td>
                    <asp:Label ID="txt_CHARGE" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
                 <tr>
                <td style="text-align:center;"><span>负责人手机</span></td>
                <td>
                    <asp:Label ID="txt_PHONENUMBER" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>邮政编码</span></td>
                <td>
                    <asp:Label ID="txt_POSTALCODE" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
             <tr>
                <td class="td_justify"><span>传真</span></td>
                <td>
                    <asp:Label ID="txt_FAX" CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td class="td_justify"><span>电子邮箱</span></td>
                <td>
                    <asp:Label ID="txt_EMAIL" CssClass="form-control " runat="server"></asp:Label>
                </td>
            </tr>
               <tr>
                <td class="td_justify"><span>X坐标</span></td>
                <td>
                    <asp:Label ID="txt_X" CssClass="form-control " runat="server"></asp:Label>                    
                </td>
                <td class="td_justify"><span>Y坐标</span></td>
                <td>
                    <asp:Label ID="txt_Y" CssClass="form-control " runat="server"></asp:Label>   
                </td>
            </tr>
             <tr>
                <td class="td_justify"><span>单位地址</span></td>
                <td colspan="3">
                   <asp:Label ID="txt_ADDRESS" CssClass="form-control " runat="server"></asp:Label>  
                </td>
            </tr>   
             <tr>
                <td class="td_justify" style="vertical-align:middle;"><span>备注</span></td>
                <td colspan="3">
                    <textarea id="txt_REMARK" rows="3" class="form-control" runat="server" readonly="readonly" style="width:98%;resize:none;background-color:#FFF!important"></textarea>
                </td>
            </tr>   
        </table>

    </form>
</body>
</html>
