<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="reminderDetail.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.HydrantReminder.reminderDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维保提醒详情</title>
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
                margin-left:14px;
                margin-right:14px;
            }
    </style>
</head>
<body>
    <form id="form1" runat="server">
<div>
            <div class=" form-group">
                <table class="table table-bordered">
                    <tr>
                        <td style="width: 15%" class="td_justify"><span>管点编号</span></td>
                        <td  style="width: 35%">
                            <asp:Label ID="CODE" CssClass="form-control" runat="server"></asp:Label>
                        </td>
                        <td  style="width: 15%" class="td_justify"><span>口径/mm</span></td>
                        <td  style="width: 35%">
                            <asp:Label ID="CALIBER" CssClass="form-control" runat="server"></asp:Label>                           
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify"><span>生产厂家</span></td>
                        <td>
                            <asp:Label ID="MANUFACTURER" CssClass="form-control" runat="server"></asp:Label>                                       
                        </td>
                        <td class="td_justify"><span>建成年月</span></td>
                        <td>
                            <asp:Label ID="ACTIVATETIME" CssClass="form-control" runat="server"></asp:Label>                                      
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify"><span>埋设方式</span></td>
                        <td>
                            <asp:Label ID="BURYMODE" CssClass="form-control" runat="server"></asp:Label>               
                        </td>                    
                        <td class="td_justify"><span>使用状态</span></td>
                        <td >
                            <asp:Label ID="STATUES" CssClass="form-control" runat="server"></asp:Label>               
                        </td>
                    </tr>
                       <tr>                      
                        <td style="text-align:center;"><span>最后维保时间</span></td>
                        <td>
                            <asp:Label ID="LASTMAINTENTIME1" CssClass="form-control" runat="server"></asp:Label>               
                        </td>
                        <td class="td_justify"><span>负责人</span></td>
                        <td>
                            <asp:Label ID="CHARGE1" CssClass="form-control" runat="server"></asp:Label>               
                        </td>
                    </tr>
                     <tr>
                        <td style="text-align:center;"><span>负责人电话</span></td>
                        <td>
                            <asp:Label ID="PHONENUMBER1" CssClass="form-control" runat="server"></asp:Label>               
                        </td>
                        <td class="td_justify"><span>井深/m</span></td>
                        <td>
                            <asp:Label ID="WELLDEPTH1" CssClass="form-control" runat="server"></asp:Label>               
                        </td>
                    </tr>
                     <tr>
                        <td style="text-align:center;"><span>维保周期/月</span></td>
                        <td>
                            <asp:Label ID="MAINTENCYCLE1" CssClass="form-control" runat="server"></asp:Label>              
                        </td>
                        <td class="td_justify"><span>维保单位</span></td>
                        <td>
                            <asp:Label ID="MAINTENUNITNAME1" CssClass="form-control" runat="server"></asp:Label>   
                        </td>
                    </tr>
                     <tr>
                        <%--<td>内容展示：</td>
                        <td>
                           <asp:Label ID="CONTENT1" CssClass="form-control  " runat="server"></asp:Label>                           
                        </td>--%>
                        <td class="td_justify"><span>地址</span></td>
                        <td colspan="3">
                            <asp:Label ID="ADDRESS1" CssClass="form-control" runat="server"></asp:Label> 
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify"><span>备注</span></td>
                        <td colspan="3">
                            <asp:Label ID="REMARK1" CssClass="form-control" runat="server"></asp:Label>                            
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </form>
</body>
</html>
