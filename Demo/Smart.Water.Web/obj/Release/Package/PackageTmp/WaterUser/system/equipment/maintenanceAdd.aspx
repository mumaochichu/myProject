<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="maintenanceAdd.aspx.cs" Inherits="Smart.Water.Web.WaterUser.system.equipment.maintenanceAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>设备报修信息添加</title>
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/style.css" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />

    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script>       
        $(function () {
            $('input:text:first').focus();         
            //初始化关联的监测点         
            $.each(parent.Robin.Data.monitor, function (i, item) {
                if (item.BMID == $("#hid_GLJCD").val()) {
                    $("#txt_GLJCD").val(item.BMMC);
                } 

            });         
            $("#btnSave").click(function () {
                //这样方式验证，防止出现选项卡切换引起的验证BUG
                $("#waterInfo").addClass("active");
                $("#userInfo").removeClass("active");
                $("#tab2").addClass("active");
                $("#tab1").removeClass("active");

                if ($("#ProForm").valid()) {
                    $("#userInfo").addClass("active");
                    $("#waterInfo").removeClass("active");
                    $("#tab1").addClass("active");
                    $("#tab2").removeClass("active");
                    if ($("#ProForm").valid()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            });
        });

        function Close() {
            window.location.href = "./maintenance.html";
        }
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./maintenance.html";
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
                    <a href="#" class="current" style="font-size: 12px">设备故障报修</a>
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
                                    <textarea rows="3" class="form-control" readonly="readonly"  runat="server" id="txt_DZXX" ></textarea>
                                </td>              
                            </tr>
                        </table>
                    </div>
                    <div id="tab2" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">申报时间:</td>
                                <td width="35%">
                                    <input class="form-control required" type="text" id="txt_SBSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                                <td width="15%">受理时间:</td>
                                <td width="35%">
                                    <input class="form-control" type="text" id="txt_SLSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                            </tr>
                            <tr>
                                <td>申报人:</td>
                                <td>
                                    <asp:TextBox ID="txt_SBR" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td>受理责任人:</td>
                                <td>
                                    <asp:TextBox ID="txt_SLZRR" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>联系电话:</td>
                                <td>
                                    <asp:TextBox ID="txt_LXDH" CssClass="form-control number" runat="server"></asp:TextBox>
                                </td>
                                <td>故障类别:</td>
                                <td>
                                    <asp:DropDownList ID="txt_GZLB" runat="server" CssClass="form-control  required">
                                        <asp:ListItem Text="-请选择-" Value="" Selected="True"></asp:ListItem>
                                        <asp:ListItem Text="设备故障" Value="设备故障"> </asp:ListItem>
                                        <asp:ListItem Text="通讯故障" Value="通讯故障"></asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                            </tr>
                            <tr>
                                <td>故障描述:</td>
                                <td>                                   
                                    <textarea rows="3" class="form-control" runat="server" id="txt_GZMS"></textarea>
                                </td>
                                <td>是否维修:</td>
                                <td>
                                    <asp:DropDownList ID="txt_SFWX" runat="server" CssClass="form-control  required">
                                        <asp:ListItem Text="-请选择-" Value="" Selected="True"></asp:ListItem>
                                        <asp:ListItem Text="是" Value="是"> </asp:ListItem>
                                        <asp:ListItem Text="否" Value="否"></asp:ListItem>
                                    </asp:DropDownList>
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
