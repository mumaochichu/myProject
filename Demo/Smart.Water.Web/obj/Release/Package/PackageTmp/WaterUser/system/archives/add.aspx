<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="add.aspx.cs" Inherits="Smart.Water.Web.WaterUser.system.archives.add" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>用水户开户</title>
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../../theme/wateruser/style.css" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/nprogress/nprogress.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/select2/select2.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/select2/select2.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../../js/jQuery/Plugins/nprogress/nprogress.js"></script>

    <script>
        $(function () {
            var data;
            //监测点关联初始化
            var html = "";
            $.each(parent.Robin.Data.monitor, function (i, item) {
                html += "<option value='" + item.BMID + "'>" + item.BMMC + "</option>";
            });
            $("#sel_GLJCB").append(html);
            $("#sel_GLJCB").select2();
            $('input:text:first').focus();
            $("#btnSave").click(function () {
                var select = $("#sel_GLJCB").val();
                $("#SELID").val(select);
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

            ////停止进度条，初始化点击空白处，收缩二级菜单事件
            $(".ui-layout-container").click(function () {
                if (top.$("#user-nav > ul >li").hasClass("open")) {
                    top.$("#user-nav > ul >li").removeClass("open");
                }
            });
            top.NProgress.done();
        });

        function Close() {
            window.location.href = "./list.html";
        }

        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./list.html";
                    }, 1000);
                }
            } catch (e) {
            }
        };
    </script>
</head>
<body>
    <form id="ProForm" runat="server" method="get" class="form-horizontal">
        <div id="content">
            <div id="content-header" style="margin-top: 10px">
                <div id="breadcrumb">
                    <a href="#" class="current" style="font-size: 12px">用水户开户</a>
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
                        <li class="active" id="userInfo"><a data-toggle="tab" href="#tab1">用户基本信息</a></li>
                        <li id="waterInfo"><a data-toggle="tab" href="#tab2">水表信息及监测参数</a></li>
                    </ul>
                </div>
                <div class="widget-content tab-content">
                    <div id="tab1" class="tab-pane active">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">户号:</td>
                                <td width="35%">
                                    <asp:TextBox ID="txt_YSHHH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td width="15%">户名:</td>
                                <td width="35%">
                                    <asp:TextBox ID="txt_YSHHM" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>册本号:</td>
                                <td>
                                    <asp:TextBox ID="txt_CBH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td>营业所:</td>
                                <td>
                                    <asp:TextBox ID="txt_YYS" CssClass="form-control" runat="server" ReadOnly="true"></asp:TextBox>
                                    <asp:TextBox ID="txt_YYSID" type="hidden" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>开户时间:</td>
                                <td>
                                    <input class="form-control" type="text" id="txt_KHSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                                <td>管理类型:</td>
                                <td>
                                    <asp:TextBox ID="txt_GLLX" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td style="display: none">区划编号:</td>
                                <td style="display: none">
                                    <asp:TextBox ID="txt_CITYCODE" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>区划名称:</td>
                                <td>
                                    <asp:TextBox ID="txt_CITYNAME" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>关联监测点:</td>
                                <td>
                                    <select class="form-control required" id="sel_GLJCB" runat="server" style="width: 220px">
                                    </select>
                                    <input id="SELID" type="hidden" runat="server" />
                                </td>
                            </tr>
                            <tr>
                                <td>联系人:</td>
                                <td>
                                    <asp:TextBox ID="txt_LXR" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>联系人电话:</td>
                                <td>
                                    <asp:TextBox ID="txt_PHONE" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>小区户数:</td>
                                <td>
                                    <asp:TextBox ID="txt_XQHS" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>营业所组:</td>
                                <td>
                                    <asp:TextBox ID="txt_YYSZ" CssClass="form-control" runat="server" ReadOnly="true"></asp:TextBox>
                                    <asp:TextBox ID="txt_YYSZID" type="hidden" runat="server"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>管道口径(mm):</td>
                                <td>
                                    <asp:TextBox ID="txt_GDKJ" CssClass="form-control digits" runat="server"></asp:TextBox>
                                </td>
                                <td>地址:</td>
                                <td>
                                    <textarea rows="3" class="form-control" runat="server" id="txt_DZ"></textarea>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="tab2" class="tab-pane">
                        <table class="table table-bordered">
                            <tr>
                                <td width="15%">表具型号:</td>
                                <td width="35%">
                                    <asp:TextBox ID="txt_BJXH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td width="15%">表体编号:</td>
                                <td width="35%">
                                    <asp:TextBox ID="txt_BTBH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>水表设备状态:</td>
                                <td>
                                    <asp:TextBox ID="txt_SBZT" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                                <td>装表时间:</td>
                                <td>
                                    <input class="form-control required " onfocus="ProForm.txt_DCGHSJ.value=this.value" type="text" id="txt_ZBSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                            </tr>
                            <tr>
                                <td>设备编号:</td>
                                <td>
                                    <asp:TextBox ID="txt_SBBH" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                                <td>SIM卡卡号:</td>
                                <td>
                                    <asp:TextBox ID="txt_SIMKH" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr style="display: none">
                                <td>通讯卡缴费时间:</td>
                                <td>
                                    <input class="form-control" type="text" id="txt_JFSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                                </td>
                                <td>缴费周期(月):</td>
                                <td>
                                    <asp:TextBox ID="txt_JFZQ" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>电池更换时间:</td>
                                <td>
                                    <input class="form-control" type="text" name="txt_DCGHSJ" id="txt_DCGHSJ" runat="server" readonly="readonly" />
                                </td>
                                <td>电池更换周期(年):</td>
                                <td>
                                    <asp:TextBox ID="txt_DCGHZQ" CssClass="form-control required" runat="server"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>备注:</td>
                                <td>
                                    <textarea cols="3" class="form-control" runat="server" id="txt_BZ"></textarea>
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

