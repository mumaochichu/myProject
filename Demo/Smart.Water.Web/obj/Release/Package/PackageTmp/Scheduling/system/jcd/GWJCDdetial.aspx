<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GWJCDdetial.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.jcd.GWJCDdetial" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>>管网监测点信息查看</title>
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
            /*关联监测点*/
            $('input:text:first').focus();
            var result = parent.Robin.Portal.Page.WGJCD.query();
            $.each(result, function (i, item) {
                if (item.BMID == $("#sel_GLJCD").val()) {
                    $("#GLJCD").text(item.BMMC);
                }
            });
        });
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
                            <asp:Label ID="txt_WGJCDMC"  runat="server"></asp:Label>
                        </td>
                         <td width="15%">关联监测点:</td>
                       <td width="35%">
                        <asp:HiddenField ID="sel_GLJCD" runat="server" />
                            <asp:Label ID="GLJCD" runat="server"></asp:Label>
                       </td>             
                    </tr>
                      <tr>
                        <td>联系人:</td>
                        <td>
                            <asp:Label ID="txt_LXR" runat="server"></asp:Label>
                        </td>
                        <td>联系人电话:</td>
                        <td>
                            <asp:Label ID="txt_LXDH"  runat="server"></asp:Label>
                        </td>
                    </tr>                        
                    <tr>
                        <td>地址:</td>
                        <td colspan="3">
                            <asp:Label ID="txt_GWJCDDZ" runat="server"></asp:Label>
                        </td>
                    </tr>
                       <tr>
                        <td>备注:</td>
                        <td colspan="3">
                            <asp:Label ID="txt_BZ" runat="server"></asp:Label>
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
    </form>
</body>
</html>
