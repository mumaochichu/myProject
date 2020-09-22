<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="InfoManagementEdit.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.InfoManagement.InfoManagementEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>消火栓信息编辑</title>
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
    <style type="text/css">
        .td_justify {
            text-align: justify;
            text-justify:distribute-all-lines;
            text-align-last:justify;
        }

            .td_justify span {
                margin-left: 10px;
                margin-right: 10px;
            }
    </style>
    <script type="text/javascript">
        // 手机号码验证  
        jQuery.validator.addMethod("isMobile", function (value, element) {
            var length = value.length;
            var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
            return this.optional(element) || (length == 11 && mobile.test(value));
        }, "请正确填写您的手机号码");

        jQuery.validator.addMethod("isMonthnu", function (value, element) {
            var mobile = /^(?:[1-9][0-9]?|1[01][0-9]|2400)$/i;
            return this.optional(element) || mobile.test(value);
        }, "请输入大于0的整数");

        $(function () {
            $("#btnSave").click(function () {
                setValue();
                /*页面验证*/
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });
            //绑定监测点列表
            bindMonitorList();
            bindMaintenceList();
            //坐标拾取
            $("#btnSelect").click(function () {
                //收缩窗体
                var listPanel = top.Robin.Window.GetInfoPanelByID("InfoManagement");
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

        //绑定监测点列表
        function bindMonitorList() {
            var html = "";
            $.each(top.Robin.Data.monitor, function (i, item) {        
                if ($("#ddl_JCDID").val() == item.BMID) {
                    html += "<option  selected='selected' value='" + item.BMID + "'>" + item.BMMC + "</option>";
                } else {
                    html += "<option value='" + item.BMID + "'>" + item.BMMC + "</option>";
                }
            });
            $("#txtBMMC").append(html);
            $("#txtBMMC").select2();
        }

        //设置关联的监测点名称和维保单位名称
        function setValue() {
            var selobj1 = document.getElementById("txtBMMC");
            var selobj2 = document.getElementById("txt_WBDW");

            if (selobj1.options[selobj1.selectedIndex].value != 0) {
                $("#ddl_JCDNAME").val(selobj1.options[selobj1.selectedIndex].text);
                $("#ddl_JCDID").val(selobj1.options[selobj1.selectedIndex].value);
            }
            if (selobj2.options[selobj2.selectedIndex].value != 0) {
                $("#ddl_WBDWNAME").val(selobj2.options[selobj2.selectedIndex].text);
                $("#ddl_WBDWID").val(selobj2.options[selobj2.selectedIndex].value);
            }
        }
        //绑定维保单位列表
        function bindMaintenceList() {
            $.ajax({
                url: "Handler.ashx?Action=maintenaceGroup",
                datatype: JSON,
                success: function (result) {
                    var result = eval(result);
                    var html = "";
                    $.each(result, function (i, item) {
                        if (i != 0) {
                            if ($("#ddl_WBDWID").val() == item.id) {
                                html += "<option selected='selected' value='" + item.id + "'>" + item.name + "</option>";
                            } else {
                                html += "<option value='" + item.id + "'>" + item.name + "</option>";
                            }
                          
                        }
                    });
                    $("#txt_WBDW").append(html);
                    $("#txt_WBDW").select2();
                }
            })

        }
   
    </script>
    <style>
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
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <table class="table table-bordered">
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>管点编号</span></td>
                <td class="respan">
                    <input type="text" class="form-control  required  " runat="server" id="txt_POINTNO" /><span>*</span>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>口径(mm)</span></td>
                <td class="respan">
                    <input type="text" class="form-control" runat="server" id="txt_SIZES" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>维保单位</span></td>
                <td>
                    <select class="form-control" id="txt_WBDW" runat="server" style="width: 283px">
                        <option value='0'>-请选择-</option>
                    </select>
                    <input type="hidden" id="ddl_WBDWNAME" runat="server" />
                    <input type="hidden" id="ddl_WBDWID" runat="server" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>生产厂家</span></td>
                <td>
                    <input type="text" class="form-control " runat="server" id="txt_MANUFACTURER" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>建成年月</span></td>
                <td>
                    <input class="form-control" type="text" id="txt_JCNY" runat="server"
                        onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd', maxDate: '%y-%M-%d' })" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>埋设方式</span></td>
                <td class="respan">
                    <asp:DropDownList ID="ddl_EMBED" runat="server" CssClass="form-control  required " Style="width: 285px">
                        <asp:ListItem Text="-请选择-" Value="" Selected="True"></asp:ListItem>
                        <asp:ListItem Text="地上" Value="地上"> </asp:ListItem>
                        <asp:ListItem Text="地下" Value="地下"></asp:ListItem>
                    </asp:DropDownList><span>*</span>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>使用状态</span></td>
                <td class="respan">
                    <asp:DropDownList ID="ddl_STATUS" runat="server" CssClass="form-control  required" Style="width: 283px">
                        <asp:ListItem Text="-请选择-" Value="" Selected="True"></asp:ListItem>
                        <asp:ListItem Text="正常" Value="正常"> </asp:ListItem>
                        <asp:ListItem Text="在建" Value="在建"></asp:ListItem>
                        <asp:ListItem Text="作废" Value="作废"></asp:ListItem>
                    </asp:DropDownList><span>*</span>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>监测点</span></td>
                <td>
                    <select class="form-control" id="txtBMMC" runat="server" style="width: 285px">
                        <option value='0'>-请选择-</option>
                    </select>
                    <input type="hidden" id="ddl_JCDNAME" runat="server" />
                    <input type="hidden" id="ddl_JCDID" runat="server" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;text-align:center;"><input type="button" class="btn btn-sm btn-success" value="拾取" style="padding:4px" id="btnSelect" /><span>X坐标</span></td>
                <td>
                    <input type="text" class="form-control  number" runat="server" id="txt_X" />
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>Y坐标</span></td>
                <td>
                    <input type="text" class="form-control  number" runat="server" id="txt_Y" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>联系人</span></td>
                <td class="respan">
                    <input type="text" class="form-control" runat="server" id="txt_LXR" />
                </td>
                <td style="vertical-align:middle;text-align:center;"><span>联系人电话</span></td>
                <td>
                    <input type="text" class="form-control  isMobile" runat="server" id="txt_LXRDH" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;text-align:center;"><span>维保周期(月)</span></td>
                <td class="respan">
                    <input type="text" class="form-control  isMonthnu required" runat="server" id="txt_WBZQ" /><span>*</span>
                </td>
                <td style="vertical-align:middle;" class="td_justify"><span>井深(m)</span></td>
                <td>
                    <input type="text" class="form-control   number" runat="server" id="txt_JS" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>地址</span></td>
                <td colspan="3">
                    <input type="text" class="form-control " runat="server" id="txt_ADDRESS" style="width: 95.7%" />
                </td>
            </tr>
            <tr>
                <td style="vertical-align:middle;" class="td_justify"><span>备注</span></td>
                <td colspan="3">
                    <textarea id="txt_BZ" class="form-control" runat="server" style="width: 95.7%;resize:none"></textarea>
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
