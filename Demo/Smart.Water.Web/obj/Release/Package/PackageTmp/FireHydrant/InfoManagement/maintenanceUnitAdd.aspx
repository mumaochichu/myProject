<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="maintenanceUnitAdd.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.InfoManagement.maintenanceUnitAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维保单位添加</title>
    <link href="../../js/Bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link href="../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <link href="../../js/jQuery/Plugins/select2/select2.css" rel="stylesheet" />
    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../js/Bootstrap/bootstrap.min.js"></script>
    <script src="../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script src="../../js/jQuery/Plugins/global/vendor/validate/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="../../js/jQuery/Plugins/select2/select2.min.js"></script>
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

        label {
            color: red;
        }

        table tr td input {
            width: 90%;
        }
         table tr td {
            padding:5px!important;
        }
        .respan span {
            color: red;
        }
    </style>
    <script>
        //验证  
        jQuery.validator.addMethod("isMobile", function (value, element) {
            var length = value.length;
            var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
            return this.optional(element) || (length == 11 && mobile.test(value));
        }, "请正确填写您的手机号码");
        jQuery.validator.addMethod("faxno", function (value, element) {
            var mobile = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i;
            return this.optional(element) || mobile.test(value);
        }, "请正确填写传真号码");
        jQuery.validator.addMethod("zip", function (value, element) {
            var mobile = /^[1-9]\d{5}$/i;
            return this.optional(element) || mobile.test(value);
        }, "请正确填写邮政编码");

        $(function () {
            $("#btnSave").click(function () {
                /*页面验证*/
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });


            //坐标拾取
            $("#btnSelect").click(function () {
                //收缩窗体
                var listPanel = top.Robin.Window.GetInfoPanelByID("MaintenanceUnitPanel");
                debugger;
                if (listPanel != null) {
                    listPanel.smallify();
                }
                top.Hydrant.Map.MapTool.getMapPoint(function (point) {
                    if (point) {
                        var x = point.x.toFixed(2);
                        var y = point.y.toFixed(2);
                        $("#txt_X").val(x);
                        $("#txt_Y").val(y);
                        listPanel.normalize();
                    }

                });
            });

        });


    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <table class="table table-bordered">
            <tr>
                <td style="width: 15%;vertical-align:middle;" class="td_justify"><span>单位名称</span></td>
                <td class="respan" style="width: 35%">
                    <input type="text" class="form-control  required  " runat="server" id="txt_UNITNAME" /><span>*</span>
                </td>
                <td style="width: 15%;vertical-align:middle;" class="td_justify"><span>机构代码</span></td>
                <td class="respan" style="width: 35%">
                    <input type="text" class="form-control" runat="server" id="txt_UNITCODE" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;text-align:center;"><span>公司规模(人)</span></td>
                <td>
                    <input type="text" class="form-control digits" runat="server" id="txt_UNITSICE" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>成立时间</span></td>
                <td>
                    <input type="text" class="form-control" runat="server" id="txt_ACTIVATETIME" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd', maxDate: '%y-%M-%d' })" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>法人代表</span></td>
                <td>
                    <input type="text" class="form-control" runat="server" id="txt_LEGALPERSON" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>负责人</span></td>
                <td>
                    <input type="text" class="form-control " runat="server" id="txt_CHARGE" />
                </td>
            </tr>

            <tr>
                <td style="vertical-align:middle;text-align:center;"><span>负责人手机</span></td>
                <td>
                    <input type="text" class="form-control  isMobile" runat="server" id="txt_PHONENUMBER" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>邮政编码</span></td>
                <td>
                    <input type="text" class="form-control  number" runat="server" id="txt_POSTALCODE" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>传真</span></td>
                <td class="respan">
                    <input type="text" class="form-control faxno" runat="server" id="txt_FAX" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>电子邮箱</span></td>
                <td>
                    <input type="text" class="form-control email" runat="server" id="txt_EMAIL" />
                </td>
            </tr>
            <%--  <tr>
                <td> <input type="button" class="btn btn-sm btn-success" value="坐标拾取" id="btnSelect" /></td>
                <td colspan="3">
                    X坐标: &nbsp;&nbsp;<input type="text" class="form-control" style="width:210px;" readonly="true"  runat="server" id="txt_X" />&nbsp;&nbsp;&nbsp;&nbsp;
                    Y坐标:&nbsp;&nbsp;<input type="text" class="form-control"  style="width:210px;" readonly="true" runat="server" id="txt_Y" />
                </td>                
            </tr>--%>
            <tr>
                <td style="vertical-align:middle;text-align:center;"><input type="button" class="btn btn-sm btn-success" value="拾取" style="padding:4px" id="btnSelect" /><span>X坐标</span></td>
                <td>
                    <input type="text" class="form-control number"  runat="server" id="txt_X" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>Y坐标</span>
                </td>
                <td>
                    <input type="text" class="form-control number"  runat="server" id="txt_Y" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>单位地址</span></td>
                <td colspan="3" class="respan">
                    <input type="text" id="txt_ADDRESS" class="form-control required " runat="server" style="width: 96%" /><span>*</span>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>备注</span></td>
                <td colspan="3">
                    <textarea id="txt_REMARK" rows="3" class="form-control" runat="server" style="width: 96%; resize: none"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: center; vertical-align: middle;" class="text-center">
                    <asp:Button ID="btnSave" CssClass="btn btn-success btn-sm" runat="server" Text="保存" OnClick="btnSave_Click"></asp:Button>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
