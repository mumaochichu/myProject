<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="registrationAdd.aspx.cs" Inherits="Smart.Water.Web.WaterUser.system.equipment.registrationAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维修登记信息添加</title>
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
        //解析url设备报修的ID
        var maintenanceID = getUrlParam("maintenanceID");
        $(function () {
            $('input:text:first').focus();
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
            window.location.href = "./registration.html?id=" + maintenanceID;
        }
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./registration.html?id=" + maintenanceID;
                    }, 1000);
                }
            } catch (e) {
            }
        };
        /*获取URL中的参数*/
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location.search.substr(1).match(reg);
            if (r != null) return unescape(decodeURI(r[2]));
            return null;
        }
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">维修登记</a>
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
                        <li><a data-toggle="tab" href="#tab1">设备报修信息</a></li>
                        <li class="active"><a data-toggle="tab" href="#tab2">维修登记信息</a></li>
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
                                <td>营业所组:</td>
                                <td>
                                    <asp:TextBox ID="txt_YYSZ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td>申报人:</td>
                                <td>
                                    <asp:TextBox ID="txt_SBR" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>申报时间:</td>
                                <td>
                                    <asp:TextBox ID="txt_SBSJ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td>受理时间:</td>
                                <td>
                                    <asp:TextBox ID="txt_SLSJ" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>受理责任人:</td>
                                <td>
                                    <asp:TextBox ID="txt_SLZRR" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td>联系电话:</td>
                                <td>
                                    <asp:TextBox ID="txt_LXDH" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>故障类别:</td>
                                <td>
                                    <asp:TextBox ID="txt_GZLB" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>
                                <td>是否维修:</td>
                                <td>
                                    <asp:TextBox ID="txt_SFWX" CssClass="form-control" ReadOnly="true" runat="server"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>故障描述:</td>
                                <td colspan="3">
                                    <input class="form-control" type="text" id="txt_GZMS" readonly="true" runat="server" style="width: 99%" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="tab2" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">维修单位:</td>
                                <td width="35%">
                                    <asp:TextBox ID="txt_WXDW" CssClass="form-control required " runat="server"></asp:TextBox>
                                </td>
                                <td width="15%">维修人员:</td>
                                <td width="35%">
                                    <asp:TextBox ID="txt_WXRY" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>维修时间</td>
                                <td>
                                    <input class="form-control required" type="text" id="txt_WXSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                                <td>维修结果:</td>
                                <td>
                                    <asp:DropDownList ID="txt_WXJG" runat="server" CssClass="form-control  required">
                                        <asp:ListItem Text="-请选择-" Value="" Selected="True"></asp:ListItem>
                                        <asp:ListItem Text="故障" Value="故障"> </asp:ListItem>
                                        <asp:ListItem Text="正常" Value="正常"></asp:ListItem>
                                    </asp:DropDownList>
                                </td>
                            </tr>
                            <tr>
                                <td>维修内容:</td>
                                <td>
                                    <textarea rows="3" class="form-control required" runat="server" id="txt_WXNR"></textarea>
                                </td>
                                <td>备注:</td>
                                <td>
                                    <textarea rows="3" class="form-control" runat="server" id="txt_BZ"></textarea>
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
