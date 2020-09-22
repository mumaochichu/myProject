<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GWJCDedit.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.jcd.GWJCDedit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>>管网监测点信息修改</title>
    <link href="../../../js/jQuery/Plugins/jsPanel/jquery.jspanel.min.css" rel="stylesheet" />
    <link href="../../../js/Bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../js/Bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/jsPanel/jquery.jspanel.min.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script src="../../../js/Noty/packaged/jquery.noty.packaged.min.js"></script>
    <script type="text/javascript">
        $(function () {
            $('input:text:first').focus();
            var result = parent.Robin.Portal.Page.WGJCD.query();
            var showContent = ""
            showContent += "<option value='0'>请选择</option>"
            $.each(result, function (i, item) {
                showContent += "<option value='" + item.BMID + "'>" + item.BMMC + "</option>";
            });
            $("#GLJCD").append(showContent);
            /*添加option改变事件*/
            $("#GLJCD").change(function () {
                var gljcd = $("option:selected").val();//获取选中值
                $("#sel_GLJCD").val(gljcd);
            });
            /*绑定显示数据*/
            $("#GLJCD").val($("#sel_GLJCD").val());

            $("#btnSave").click(function () {
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });
           
        });
        /*添加成功失败，返回弹窗提示*/
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {

                    var listpanel = parent.Robin.Window.GetInfoPanelByID("gwjcdList");
                    listpanel.normalize();
                    parent.document.getElementById('GWJCDLIST').contentWindow.refresh();
                    window.setTimeout(function () {
                        parent.Robin.CloseOneInfoPanel("GWJCDedit");
                    }, 1000);
                }
            } catch (e) {
            }
        };  
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">       
        <ul id="mytab"  class="nav nav-tabs m-b-10" role="tablist">
            <li class="nav-item ">
                <a class="nav-link active" href="#home" id="home-tab" data-toggle="tab" role="tab"  aria-controls="home"  aria-expanded="true">基本信息</a>
            </li>
           <%-- <li class="nav-item">
                <a class="nav-link" href="#profile" id="profile-tab" data-toggle="tab" role="tab"  aria-controls="profile" aria-expanded="false">单位信息 </a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown" href="#dropdown" id="dropdown-tab" data-toggle="tab" role="tab"  aria-controls="dropdown"  aria-expanded="false">项目概述</a>
            </li>--%>
        </ul>
        <div class="tab-content">
            <div role="tabpanel" class=" tab-pane fade in active" id="home" aria-labelledby="home-tab">
                  <table class="table table-bordered">
                    <tr>                       
                        <td width="15%">名称:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_WGJCDMC" CssClass="form-control required" runat="server"></asp:TextBox>
                        </td>
                         <td width="15%">关联监测点:</td>
                       <td width="35%">
                        <asp:HiddenField ID="sel_GLJCD" runat="server" />
                        <select class="form-control" id="GLJCD" runat="server">
                            <option value="0">请选择</option>
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
                            <asp:TextBox ID="txt_LXDH" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>                        
                    <tr>
                        <td>地址:</td>
                        <td colspan="3">
                            <input class="form-control" type="text" id="txt_GWJCDDZ" runat="server" />
                        </td>
                    </tr>
                       <tr>
                        <td>备注:</td>
                        <td colspan="3">
                            <input class="form-control" type="text" id="txt_BZ" runat="server" />
                        </td>
                    </tr>
                  </table>
            </div> 
         <%--<div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <table class="table table-bordered">
                  
                   
                </table>
         </div>
          <div class="tab-pane fade" id="dropdown" role="tabpanel" aria-labelledby="dropdown-tab">
              <table class="table table-bordered">
                 
                </table>
          </div>--%>
              
    </div>
     <div style="position: center">
            <asp:Button ID="btnSave" CssClass="btn btn-info center-block" runat="server" Text="保存" OnClick="btnSave_Click"></asp:Button>
     </div>
    </form>
</body>
</html>
