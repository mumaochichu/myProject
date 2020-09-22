<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="assertDetail.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.HyrantAssert.assertDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>维护信息详情</title>
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

        table tr td input {
            width: 90%;
            margin-bottom: 0px;
        }
       
        textarea{
            margin-bottom:0px;
        }
      
          table tr td {
            padding:5px!important;
        }
    </style>
    <script>
   
        $(function () {
            //初始化保养内容         
            var xfswbnr = JSON.parse($("#BYNR").val());
            $.ajax({
                type: 'get',
                url: 'assertHandler.ashx?Action=WbnrList',
                success: function (data) {
                    var data = $.parseJSON(data);
                    var html = '';
                    $.each(data, function (i, v) {
                        for (var i = 0; i < xfswbnr.list.length; i++) {
                            var value = xfswbnr.list[i];
                            if (value == v.ID) {                               
                                html += '<lable  style="margin: 0 2px 2px" ><span>' + v.ACONTENT + '</span></lable><br />';
                            }

                        }
                    })
                    $("#BYNRDIV").append(html);
                }
            });


            var wbnr=""
            if (xfswbnr.type == "地上") {
                for (var i = 0; i < xfswbnr.list.length; i++) {
                    var num = parseFloat(xfswbnr.list[i]);
                    wbnr += dsbyBox[num] + ";";
                }
                
            } else {
                for (var i = 0; i < xfswbnr.list.length; i++) {
                    var num = parseFloat(xfswbnr.list[i]);
                    wbnr += dxbyBox[num]+";";
                }
            }
            $("#BYNR").val(wbnr);

        })
    </script>
</head>
<body style="overflow:hidden">
    <form id="ProForm" runat="server" role="form">
        <div>
            <div class=" form-group">
                <table class="table table-bordered">
                    <tr>
                        <td style="vertical-align:middle;text-align:center;"><span>消火栓编号</span></td>
                        <td style="vertical-align:middle;width: 38%;">
                            <input class="form-control" id="txt_XFSBH" readonly="readonly" runat="server" style=" width: 266px;background-color:transparent;margin-bottom: 0px;" />
                        </td>
                        <td style="vertical-align:middle;text-align:center;"><span>消防栓类型</span></td>
                        <td style="vertical-align:middle;width: 38%;">
                            <input class="form-control" id="wbType" runat="server" style="width: 266px;background-color:transparent;margin-bottom: 0px;" readonly="readonly"   />  
                        </td>
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>维保单位</span></td>
                        <td style="vertical-align:middle;">
                            <input class="form-control" id="txt_WBDW" readonly="readonly"  runat="server" style="width: 266px;background-color:transparent;margin-bottom: 0px;" /> 
                        </td>
                       <td class="td_justify" style="vertical-align:middle;"><span>维保人员</span></td>
                        <td style="vertical-align:middle;">
                            <input class="form-control" id="txt_WBRY" runat="server" style="width: 266px;background-color:transparent;margin-bottom: 0px;" readonly="readonly"  />
                        </td>                     
                    </tr>
                     <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>维保时间</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                            <input type="text" class="form-control" runat="server" id="WHSJ" style="width: 266px;background-color:transparent;margin-bottom: 0px;" readonly="readonly"  />
                        </td>                        
                    </tr>
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>保养内容</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                             <input type="hidden" id="BYNR" runat="server" />
                             <div id="BYNRDIV">                                
                            </div>
                           <%-- <textarea class="form-control" rows="3" readonly="readonly"  runat="server" id="BYNR" style="width: 96%;resize:none;background-color:transparent;"></textarea>--%>
                        </td>
                    </tr> 
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>保养结果</span></td>
                        <td colspan="3" style="vertical-align:middle;">   
                            <textarea class="form-control" rows="3" readonly="readonly"  runat="server" id="byResult" style="width: 96%;resize:none;background-color:transparent;"></textarea>  
                        </td>
                    </tr>               
                    <tr>
                        <td class="td_justify" style="vertical-align:middle;"><span>备注</span></td>
                        <td colspan="3" style="vertical-align:middle;">
                            <textarea class="form-control" rows="3" readonly="readonly"  runat="server" id="BZ" style="width: 96%;resize:none;background-color:transparent;">
                            </textarea>
                        </td>
                    </tr>                   
                </table>
            </div>
        </div>       
    </form>
</body>
</html>