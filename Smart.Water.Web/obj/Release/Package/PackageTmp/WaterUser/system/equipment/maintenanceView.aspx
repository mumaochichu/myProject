<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="maintenanceView.aspx.cs" Inherits="Smart.Water.Web.WaterUser.system.equipment.view" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>设备报修信息详情</title>
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
        $(function () {
            //初始化关联的监测点         
            $.each(parent.Robin.Data.monitor, function (i, item) {
                if (item.BMID == $("#hid_GLJCD").val()) {
                    $("#txt_GLJCD").val(item.BMMC);
                }

            });
        })
        function Close() {
            window.location.href = "./maintenance.html";
        }
       
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">设备故障报修详情</a>
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
                        <li><a data-toggle="tab" href="#tab1">用户基本信息</a></li>
                        <li class="active"><a data-toggle="tab" href="#tab2">报修信息</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane">
                            <table class="table table-bordered">
                                <tr>
                                    <td width="15%">户号:</td>
                                    <td width="35%">
                                        <asp:TextBox ID="txt_HH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td width="15%">户名:</td>
                                    <td width="35%">
                                        <asp:TextBox ID="txt_HM" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>册本号:</td>
                                    <td>
                                        <asp:TextBox ID="txt_CBH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>营业所:</td>
                                    <td>
                                        <asp:TextBox ID="txt_YYS" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>开户时间:</td>
                                    <td>
                                        <asp:TextBox ID="txt_KHT" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>管理类型:</td>
                                    <td>
                                        <asp:TextBox ID="txt_GLLX" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="display: none">区划编号:</td>
                                    <td style="display: none">
                                        <asp:TextBox ID="txt_QHBH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>区划名称:</td>
                                    <td>
                                        <asp:TextBox ID="txt_QHMC" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>关联监测点:</td>
                                    <td>
                                        <asp:TextBox ID="txt_GLJCD" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                        <asp:TextBox ID="hid_GLJCD" type="hidden" runat="server"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>营业所组:</td>
                                    <td>
                                        <asp:TextBox ID="txt_YYSZ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>联系人:</td>
                                    <td>
                                        <asp:TextBox ID="txt_LXRXM" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>

                                </tr>
                                <tr>
                                    <td>联系人电话:</td>
                                    <td>
                                        <asp:TextBox ID="txt_LXRDH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>管道口径(mm):</td>
                                    <td>
                                        <asp:TextBox ID="txt_GDKJ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>小区户数:</td>
                                    <td>
                                        <asp:TextBox ID="txt_XQHS" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                    </td>
                                    <td>地址:</td>
                                    <td>
                                        <textarea rows="3" class="form-control" runat="server" readonly="readonly" id="txt_DZXX"></textarea>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    <div id="tab2" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">申报时间:</td>
                                <td width="35%">                                    
                                     <asp:TextBox ID="txt_SBSJ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td width="15%">受理时间:</td>
                                <td width="35%">                                   
                                     <asp:TextBox ID="txt_SLSJ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>申报人:</td>
                                <td>
                                    <asp:TextBox ID="txt_SBR" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td>受理责任人:</td>
                                <td>
                                    <asp:TextBox ID="txt_SLZRR" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>联系电话:</td>
                                <td>
                                    <asp:TextBox ID="txt_LXDH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td>故障类别:</td>
                                <td>
                                     <asp:TextBox ID="txt_GZLB" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>                                   
                                </td>
                            </tr>
                            <tr>
                                <td>故障描述:</td>
                                <td>                                   
                                     <textarea rows="3" class="form-control" runat="server" id="txt_GZMS" readonly="readonly"></textarea>
                                </td>

                                <td>是否维修:</td>
                                <td>
                                     <asp:TextBox ID="txt_SFWX" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox> 
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
