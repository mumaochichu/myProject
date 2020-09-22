<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="paySIM.aspx.cs" Inherits="Smart.Water.Web.WaterUser.simChange.paySIM" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>通讯卡缴费</title>
    <link rel="stylesheet" href="../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../theme/wateruser/style.css" />
    <link href="../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />

    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery.validate.min.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script>
        $(function () {
            $('#txt_GHR').focus();
            $("#btnSave").click(function () {
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });
        });

        function Close() {
            window.location.href = "./simChangeList.html";
        }
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./simChangeList.html";
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
                    <a href="#" class="current" style="font-size: 12px">通讯卡更换</a>
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
                        <li class="active"><a data-toggle="tab" href="#tab1">通讯卡更换信息</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">户名:</td>
                                <td width="35%">                                 
                                    <input type="text" class="form-control" runat="server" id="txt_YSHHM" disabled="disabled" />
                                </td>
                                <td width="15%">户号:</td>
                                <td width="35%">
                                    <input type="text" class="form-control" runat="server" id="txt_YSHHH" disabled="disabled" />                                  
                                </td>
                            </tr>
                            <tr>
                                <td>册本号:</td>
                                <td>
                                    <input type="text" class="form-control" runat="server" id="txt_CBH" disabled="disabled" />
                                </td>
                                <td>营业所名称:</td>
                                <td>
                                    <input type="text" class="form-control" runat="server" id="txt_YYSMC" disabled="disabled" />
                                </td>
                            </tr>                            
                            <tr>
                                <td>缴费人:</td>
                                <td>
                                    <asp:TextBox ID="txt_JFR" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>缴费金额:</td>
                                <td>
                                   <asp:TextBox ID="txt_JFJE" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>                                
                            </tr>
                            <tr>
                                <td>周期(月):</td>
                                <td>
                                   
                                    <asp:TextBox ID="txt_ZQ" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>缴费时间:</td>
                                <td>
                                    <input class="form-control required" type="text" id="txt_BCJFSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                            </tr>
                            <tr>
                                <td>备注:</td>
                                <td colspan="3">
                                    <input class="form-control" type="text" id="txt_BZ" runat="server" style="width: 99%" />
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
