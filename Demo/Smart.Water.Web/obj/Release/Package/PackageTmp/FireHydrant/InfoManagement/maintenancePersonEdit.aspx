<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="maintenancePersonEdit.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.InfoManagement.WebForm4" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   <title>维保人员编辑</title>
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
        jQuery.validator.addMethod("idcard", function (value, element) {           
            var mobile =/^\d{15}(\d{2}[A-Za-z0-9])?$/i;
            return this.optional(element) || mobile.test(value);
        }, "身份证号码格式不正确");

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
        });
    
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <table class="table table-bordered">
            <tr>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>所属单位</span></td>
                <td>
                    <input type="text" class="form-control" readonly="readonly" runat="server" id="txt_UNITNAME" style="background-color: transparent;" />
                </td>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>职工号</span></td>
                <td class="respan">
                    <input type="text" class="form-control required" runat="server" id="txt_CODE" /><span>*</span>
                </td>
            </tr>
            <tr>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>姓名</span></td>
                <td class="respan">
                    <input type="text" class="form-control  required  " runat="server" id="txt_NAME" /><span>*</span>
                </td>             
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>性别</span></td>
                <td>     
                    <asp:DropDownList runat="server" id="txt_SEX" style="width:96%">
                          <asp:ListItem Value="男" Selected="True">男</asp:ListItem>
                          <asp:ListItem Value="女">女</asp:ListItem>
                    </asp:DropDownList>       
                </td>
            </tr>
            <tr>
                <td style="width: 16%; vertical-align: middle;" class="td_justify"><span>民族</span></td>
                <td>
                    <input type="text" class="form-control" runat="server" id="txt_NATION" />
                </td>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>出生日期</span></td>
                <td>
                    <input type="text" class="form-control" runat="server" id="txt_BORN" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd', maxDate: '%y-%M-%d' })" />

                </td>
<%--             <td style="width:16%;vertical-align:middle;" class="td_justify"><span>年龄</span></td>
                <td class="respan">
                    <input type="text" class="form-control age" runat="server" id="txt_AGE" />
                </td>--%>
            </tr>

<%--            <tr>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>民族</span></td>
                <td>
                    <input type="text" class="form-control" runat="server" id="txt_NATION" />
                </td>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>身份证号</span></td>
                <td>
                    <input type="text" class="form-control idcard" runat="server" id="txt_IDCARD" />
                </td>
            </tr>--%>
            <tr>  
                 <td style="width:16%;vertical-align:middle;" class="td_justify"><span>入职时间</span></td>
                <td>
                    <input type="text" class="form-control" runat="server" id="txt_ENTRYTIME" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd', maxDate: '%y-%M-%d' })" />
                </td>            
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>联系电话</span></td>
                <td>
                    <input type="text" class="form-control isMobile" runat="server" id="txt_PHONENUMBER" />
                </td>
            </tr>        
            <tr>
                <td style="width:16%;vertical-align:middle;" class="td_justify"><span>备注</span></td>
                <td colspan="3">
                    <textarea id="txt_REMARK" rows="3" class="form-control" runat="server" style="width: 96%"></textarea>
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