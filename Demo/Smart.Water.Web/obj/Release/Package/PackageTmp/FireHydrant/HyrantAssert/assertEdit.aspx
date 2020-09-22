<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="assertEdit.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.HyrantAssert.assertEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维护信息编辑</title>
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
                margin-left:10px;
                margin-right:10px;
            }

          table tr td {
            padding:5px!important;
        }
        textarea {
            margin-bottom: 0px;
        }
    </style>
    <script>
        //维保单位列表对象
        var wbdwList = {
            tem: [],
            oSelect: null,
        };
        //维保人员列表对象
        var wbryList = {
            tem: [],
            oSelect: null,
        };
        //消防栓列表对象
        var xfsList = {
            tem: [],
            oSelect: null,
        };
        //维保内容对象
        var xfswbnr = {
            type: "",
            list: [],
        }
        $(function () {
            //初始化保养内容         
            xfswbnr = JSON.parse($("#BYNR").val());
            $.ajax({
                type: 'get',
                url: 'assertHandler.ashx?Action=WbnrList',
                success: function (data) {
                    var data = $.parseJSON(data);
                    var dshtml = '';
                    var dxhtml = ''
                    $.each(data, function (i, v) {
                        if (v.HYDRANTTYPE == "地上") {                          
                            var ishave = false;
                            for (var i = 0; i < xfswbnr.list.length; i++) {
                                var value = xfswbnr.list[i];
                                if (value == v.ID) {
                                    ishave = true;
                                    dshtml += '<input type="checkbox" name="dsbyBox" checked="checked" value=' + v.ID + ' style="margin: 0 2px 2px" /><span>' + v.ACONTENT + '</span><br />';
                                }

                            }
                            if (!ishave) {
                                dshtml += '<input type="checkbox" name="dsbyBox"  value=' + v.ID + ' style="margin: 0 2px 2px" /><span>' + v.ACONTENT + '</span><br />';
                            }
                            
                           
                        } else {
                            var ishave = false;
                            for (var i = 0; i < xfswbnr.list.length; i++) {
                                var value = xfswbnr.list[i];
                                if (value == v.ID) {
                                    ishave = true;
                                    dxhtml += '<input type="checkbox" name="dsbyBox" checked="checked" value=' + v.ID + ' style="margin: 0 2px 2px" /><span>' + v.ACONTENT + '</span><br />';
                                }

                            }
                            if (!ishave) {
                                dxhtml += '<input type="checkbox" name="dsbyBox"  value=' + v.ID + ' style="margin: 0 2px 2px" /><span>' + v.ACONTENT + '</span><br />';
                            }
                        }
                    })
                    $("#DSBY").append(dshtml);
                    $("#DXBY").append(dxhtml);
                    debugger;
                }
            });

            if (xfswbnr.type == "地上") {
                $("#DSBY").css("display", "block");
                $("#DXBY").css("display", "none");
            } else {
                $("#DXBY").css("display", "block");
                $("#DSBY").css("display", "none");
            }




            //表单验证
            $("#btnAdd").click(function () {
                if (setValue() && $("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });
            //获取消火栓编号
            $.ajax({
                type: 'get',
                url: '../InfoManagement/Handler.ashx?Action=POINTNO',
                success: function (data) {
                    data = JSON.parse(data);
                    $.each(data, function (i, v) {
                        xfsList.tem.push({ 'id': v.ID, 'text': v.CODE, 'type': v.BURYMODE });
                    });
                    xfsList.oSelect = $("#sel_xfsbh").select2({
                        data: xfsList.tem,
                        placeholder: '-请选择-',
                    });
                }
            });

            //获取维保单位编号
            $.ajax({
                type: 'get',
                url: '../InfoManagement/Handler.ashx?Action=maintenaceGroup',
                datatype: JSON,
                success: function (result) {
                    var result = eval(result);
                    $.each(result, function (i, item) {
                        if (i != 0) {
                            wbdwList.tem.push({ 'id': item.id, 'text': item.name });
                        }
                    });
                    wbdwList.oSelect = $("#txt_WBDW").select2({
                        data: wbdwList.tem,
                        placeholder: '-请选择-',
                    });
                }
            });

            //获取维保人员
            $.ajax({
                type: 'get',
                url: 'assertHandler.ashx?Action=UnitPersoneList',
                datatype: JSON,
                success: function (result) {
                    var result = eval(result);
                    $.each(result, function (i, item) {
                        wbryList.tem.push({ 'id': item.ID, 'text': item.NAME, "dwid": item.UNITID });
                    });
                    wbryList.oSelect = $("#txt_WBRY").select2({
                        data: wbryList.tem,
                        placeholder: '-请选择-',
                    });
                }
            });

            //设置关联的监测点名称和维保单位名称
            function setValue() {
                //消防栓
                var XFSID = xfsList.oSelect.val();
                if (XFSID == "") {
                    noty({ text: "消防栓编号不能为空", type: "warning", layout: "topCenter", timeout: 2000 });
                    return false;
                } else {
                    var XFSBH = xfsList.oSelect[0].previousSibling.innerText.replace("\n", "").replace("\r", "").trim();
                    $("#XFSBH").val(XFSBH);
                    $("#XFSID").val(XFSID);
                }
                //维保单位
                var WBDWID = wbdwList.oSelect.val();
                if (WBDWID == "") {
                    noty({ text: "维保单位不能为空", type: "warning", layout: "topCenter", timeout: 2000 });
                    return false;
                } else {
                    var WBDWNAME = wbdwList.oSelect[0].previousSibling.innerText.replace("\n", "").replace("\r", "").trim();
                    $("#ddl_WBDWNAME").val(WBDWNAME);
                    $("#ddl_WBDWID").val(WBDWID);
                };
                //维保人员
                var WBRYID = wbryList.oSelect.val();
                var WBRYNAME = wbryList.oSelect[0].previousSibling.innerText.replace("\n", "").replace("\r", "").trim()
                if (WBRYID == "" || WBRYNAME=="") {
                    noty({ text: "维保人员不能为空", type: "warning", layout: "topCenter", timeout: 2000 });
                    return false;
                } else {
                   
                    $("#dll_WBRYNAME").val(WBRYNAME);
                    $("#dll_WBRYID").val(WBRYID);
                }
                //维保内容
               
                if (xfswbnr.type == "地上") {
                    xfswbnr.list = [];
                    $('input[name="dsbyBox"]:checked').each(function (i, v) {                      
                        xfswbnr.list.push(v.value);
                    });
                } else if (xfswbnr.type == "地下") {
                    xfswbnr.list = [];
                    $('input[name="dXbyBox"]:checked').each(function (i, v) {                     
                        xfswbnr.list.push(v.value);
                    });
                }
                if (xfswbnr.list.length == 0) {
                    noty({ text: "维保内容不能为空", type: "warning", layout: "topCenter", timeout: 2000 });
                    return false;
                }
                $("#BYNR").val(JSON.stringify(xfswbnr));
                return true;
            };

            //维修单位发生改变
            $("#txt_WBDW").change(function () {
                var value = $("#txt_WBDW").val();
                var stem = [];
                debugger;
                $.each(wbryList.tem, function (i, v) {
                    if (value == v.dwid) {
                        stem.push({ 'id': v.id, 'text': v.text, "dwid": v.dwid })
                    }
                });
                wbryList.oSelect = $("#txt_WBRY").select2({
                    data: stem,
                    placeholder: '-请选择-',
                });
            });

            //消火栓编号发生改变
            $("#sel_xfsbh").change(function () {
                var value = $("#sel_xfsbh").val();
                $.each(xfsList.tem, function (i, v) {
                    if (value == v.id) {
                        xfswbnr.type = v.type
                        $("#txt_XHSLX").val(v.type);
                        if (v.type == "地上") {
                            $("#DSBY").css("display", "block");
                            $("#DXBY").css("display", "none");
                        } else {
                            $("#DXBY").css("display", "block");
                            $("#DSBY").css("display", "none");
                        }

                    }
                });
            });

        });
        
    </script>
</head>
<body style="overflow:hidden">
    <form id="ProForm" runat="server" role="form">
        <div>
            <div class=" form-group">
                <table class="table table-bordered">
                    <tr>
                        <td style="vertical-align:middle;text-align:center;"><span>消火栓编号</span></td>
                        <td style="width: 38%;vertical-align:middle;">
                            <input class="form-control" id="sel_xfsbh" runat="server" style="padding: 0px; border: 0px; width: 280px" /><span style="color: red">*</span>
                            <asp:HiddenField ID="XFSBH" runat="server" />
                            <asp:HiddenField ID="XFSID" runat="server" />
                        </td>
                        <td style="vertical-align:middle;text-align:center;"><span>消火栓类型</span></td>
                        <td style="width: 38%;vertical-align:middle;">
                          <input type="text" runat="server" readonly="true" id="txt_XHSLX" style="width: 266px;background-color:transparent;margin-bottom: 0px;"/>
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>维保单位</span></td>
                        <td style="vertical-align:middle;">
                             <input class="form-control" id="txt_WBDW" runat="server" style="padding: 0px; border: 0px; width: 280px;" /><span style="color: red">*</span>
                            <input type="hidden" id="ddl_WBDWNAME" runat="server" />
                            <input type="hidden" id="ddl_WBDWID" runat="server" />
                        </td>
                        <td class="td_justify" style="vertical-align:middle;"><span>维保人员</span></td>
                        <td style="vertical-align:middle;">
                            <input class="form-control" id="txt_WBRY" runat="server" style="padding: 0px; border: 0px; width: 280px" /><span style="color: red">*</span>
                            <input type="hidden" id="dll_WBRYID" runat="server" />
                            <input type="hidden" id="dll_WBRYNAME" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>维保时间</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                            <input type="text" class="form-control required" runat="server" style="margin-bottom: 2px;width: 266px" id="WHSJ" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd', maxDate: '%y-%M-%d' })" /><span style="color: red">*</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>保养内容</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                            <input type="hidden" id="BYNR" runat="server" />
                            <div id="DSBY" style="display: block">                                
                            </div>
                            <div id="DXBY" style="display: none">                                
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>保养结果</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                            <textarea class="form-control" rows="2" runat="server" id="byResult" style="width: 96%; resize: none">
                            </textarea>
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>备注</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                            <textarea class="form-control" rows="2" runat="server" id="BZ" style="width: 96%; resize: none">
                            </textarea>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: center; vertical-align: middle;" class="text-center">
                            <asp:Button ID="btnAdd" CssClass="btn btn-success btn-sm" runat="server" Text="保存" OnClick="btnSave_Click"></asp:Button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>       
    </form>
</body>
</html>