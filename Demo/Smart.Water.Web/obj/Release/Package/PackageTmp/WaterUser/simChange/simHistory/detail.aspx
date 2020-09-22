<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="detail.aspx.cs" Inherits="Smart.Water.Web.WaterUser.simChange.simHistory.detail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/style.css" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />

    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/jquery-ui.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script>
        var loc = window.location.href;
        var yshId = loc.substring(loc.indexOf('&') + 7);
        function Close() {
            window.location.href = "./simHistory.html?id=" + yshId;
        }
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">通讯卡更换</a>
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
                        <li class="active"><a data-toggle="tab" href="#tab1">通讯卡更换信息</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane active">
                        <table class="table table-bordered">
                             <tr>
                                <td width="15%">户名:</td>
                                <td width="35%">  
                                    <asp:Label ID="txt_YSHHM" CssClass="form-control" runat="server"></asp:Label>                               
                                </td>
                                <td width="15%">户号:</td>
                                <td width="35%">
                                    <asp:Label ID="txt_YSHHH" CssClass="form-control" runat="server"></asp:Label>                                   
                                </td>
                            </tr>
                            <tr>
                                <td>册本号:</td>
                                <td>
                                    <asp:Label ID="txt_CBH" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>营业所名称:</td>
                                <td>
                                    <asp:Label ID="txt_YYS" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                 <td>营业所组:</td>
                                <td>
                                   <asp:Label ID="txt_YYSZ" CssClass="form-control" runat="server"></asp:Label>
                                </td>  
                                <td>更换人:</td>
                                <td>
                                    <asp:Label ID="txt_GHR" CssClass="form-control" runat="server"></asp:Label>
                                </td>                                                            
                            </tr>
                            <tr style="display:none">
                                <td>缴费人:</td>
                                <td>
                                    <asp:Label ID="txt_JFR" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>缴费金额:</td>
                                <td>
                                   <asp:Label ID="txt_JFJE" CssClass="form-control" runat="server"></asp:Label>
                                </td>                                
                            </tr>
                            <tr style="display:none">
                                <td>周期(月):</td>
                                <td>
                                    <asp:Label ID="txt_ZQ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                                <td>缴费时间:</td>
                                <td>
                                    <asp:Label ID="txt_BCJFSJ" CssClass="form-control" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>通讯卡号:</td>
                                <td>
                                   <asp:Label ID="txt_TXKH" CssClass="form-control" runat="server"></asp:Label>                                   
                                </td>  
                                <td>备注:</td>
                                <td>
                                    <asp:Label ID="txt_BZ" CssClass="form-control" runat="server"></asp:Label>                                                                     
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