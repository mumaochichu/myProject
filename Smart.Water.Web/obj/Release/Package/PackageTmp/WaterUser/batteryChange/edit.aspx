<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="edit.aspx.cs" Inherits="Smart.Water.Web.WaterUser.batteryChange.edit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>电池更换信息修改</title>
    <link rel="stylesheet" href="../../theme/wateruser/bootstrap.min.css" />
    <link rel="stylesheet" href="../../theme/wateruser/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="../../theme/wateruser/fullcalendar.css" />
    <link rel="stylesheet" href="../../theme/wateruser/style.css" />
    <link href="../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <link href="../../js/jQuery/Plugins/nprogress/nprogress.css" rel="stylesheet" />
    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../theme/wateruser/bootstrap.min.js"></script>
    <script src="../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery.validate.min.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
    <script>
        $(function () {
            $('#txt_GHR').focus();
            //当电池更换有效期改变事件
            $("#txt_DCYXQ").keyup(function () {
                var chageTime = $("#txt_DCGHSJ").val();
                var maintainTime = $("#txt_DCYXQ").val();
                if (chageTime != "" && maintainTime != "") {
                    var y = parseInt(chageTime.substring(0, 4));
                    var nextChangeTime = chageTime.replace(y, y + parseInt(maintainTime));
                    $("#txt_XCGHSJ").val(nextChangeTime);
                } else {
                    $("#txt_XCGHSJ").val("");
                }
            });
        
            $("#btnSave").click(function () {
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });


            //停止进度条，初始化点击空白处，收缩二级菜单事件
            $(".ui-layout-container").click(function () {
                if (top.$("#user-nav > ul >li").hasClass("open")) {
                    top.$("#user-nav > ul >li").removeClass("open");
                }
            });
            top.NProgress.done();
        });
        //电池更换时间改变事件(由于加载时间插件，change事件无效，利用blur和定时器模拟效果)
        function channge(value) {          
            var maintainTime = $("#txt_DCYXQ").val();
            if (maintainTime != "") {
                var y = parseInt(value.substring(0, 4));
                var nextChangeTime = value.replace(y, y + parseInt($("#txt_DCYXQ").val()));
                $("#txt_XCGHSJ").val(nextChangeTime);
            }
        }
        function Close() {
            window.location.href = "./changeList.html";
        }
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    window.setTimeout(function () {
                        window.location.href = "./changeList.html";
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
                    <a href="#" class="current" style="font-size: 12px">电池更换信息修改</a>
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
                        <li class="active"><a data-toggle="tab" href="#tab1">电池更换信息</a></li>
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
                                    <input type="text" class="form-control" runat="server" id="txt_YYS" disabled="disabled" />
                                </td>
                            </tr>
                            <tr>
                                <td>营业所组:</td>
                                <td>
                                    <input type="text" class="form-control" runat="server" id="txt_YYSZ" disabled="disabled" />
                                </td>
                                <td>更换人:</td>
                                <td>
                                    <asp:TextBox ID="txt_GHR" CssClass="form-control" runat="server"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>电池更换时间:</td>
                                <td>                                
                                  <input class="form-control required" type="text" id="txt_DCGHSJ" runat="server" onfocus="channge(this.value)" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />                                                                 
                                </td>
                                <td>电池有效期(年):</td>
                                <!--只能输入大于0的正整数-->
                                <td>
                                    <asp:TextBox ID="txt_DCYXQ" CssClass="form-control required" runat="server" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></asp:TextBox>
                                </td>

                            </tr>
                            <tr>
                                <td>下次更换时间:</td>
                                <td>
                                    <input class="form-control" readonly="true" type="text" id="txt_XCGHSJ" runat="server" />
                                </td>
                                <td>备注:</td>
                                <td>
                                    <textarea runat="server" id="txt_BZ" class="form-control" rows="3"></textarea>
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
