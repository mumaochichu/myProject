<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SCdetial.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.sc.SCdetial" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>水厂信息查看</title>
  
    <link href="../../../js/Bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../js/Bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script type="text/javascript">
        $(function () {
            var options = $("#SELID").val();
            var result = parent.Robin.Portal.Page.SC.query();
            $.each(result, function (i, item) {
                if (item.BMID == options) {
                    $("#sel_GLJCB").text(item.BMMC);
                }
            });
        })
    </script>
</head>
<body>
   <form id="ProForm" runat="server" class="form-horizontal row-border">
       <ul id="mytab"  class="nav nav-tabs m-b-10" role="tablist">
            <li class="nav-item ">
                <a class="nav-link active" href="#home" id="home-tab" data-toggle="tab" role="tab"  aria-controls="home"  aria-expanded="true">基本信息</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#profile" id="profile-tab" data-toggle="tab" role="tab"  aria-controls="profile" aria-expanded="false">单位信息 </a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown" href="#dropdown" id="dropdown-tab" data-toggle="tab" role="tab"  aria-controls="dropdown"  aria-expanded="false">项目概述</a>
            </li>
        </ul>
     <div class="tab-content">
        <div role="tabpanel" class=" tab-pane fade in active" id="home" aria-labelledby="home-tab">
            <table class="table table-bordered">
            <tr>
                <td style="width:15%">水厂编号:</td>
                <td style="width:35%">
                    <asp:Label ID="txt_SCBH"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td style="width:15%">水厂名称:</td>
                <td style="width:35%">
                    <asp:Label ID="txt_SCNAME"   CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="display:none">区划编号:</td>
                <td style="display:none">
                    <asp:Label ID="txt_CITYCODE"  CssClass="form-control  "  runat="server"></asp:Label>
                </td>
                <td>区划名称:</td>
                <td>
                    <asp:Label ID="txt_CITYNAME"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td>关联监测点:</td>
                 <td colspan="3">
                    <asp:Label ID="sel_GLJCB"  CssClass="form-control  " runat="server"></asp:Label>
                      <input id="SELID" type="hidden" runat="server" /> 
                 </td>   
            </tr>
            <tr>
                <td>负责人:</td>
                <td>
                    <asp:Label ID="txt_SCFZR"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td>负责人电话:</td>
                <td>
                    <asp:Label ID="txt_SCFZRDH"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td>供水区域:</td>
                <td>
                    <asp:Label ID="txt_GSQY"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td>年供水总量(m³):</td>
                <td>
                    <asp:Label ID="txt_NGSZL"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>
            <tr>
                <td>设计生产能力(m³/d):</td>
                <td>
                    <asp:Label ID="txt_SJSCNL"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
                <td>实际供水能力(m³/d):</td>
                <td>
                    <asp:Label ID="txt_SJGSNL"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>
             <tr>
                    <td>建筑面积(㎡):</td>
                    <td>
                        <asp:Label ID="txt_JZMJ"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>平均日生产水量(m³/d):</td>
                    <td>
                        <asp:Label ID="txt_PJRSCSL"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
            <tr>
                <td>水厂位置:</td>
                <td colspan="3">
                     <asp:Label ID="txt_SCLOCATION"  CssClass="form-control  " runat="server"></asp:Label>
                </td>
            </tr>
        </table>
        </div> 
         <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <table class="table table-bordered">
                <tr>
                    <td style="width:15%">权属单位编号:</td>
                    <td style="width:35%">
                        <asp:Label ID="txt_QSDWBH"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td style="width:15%">权属单位名称:</td>
                    <td style="width:35%">
                        <asp:Label ID="txt_QSDWMC"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>产权结构编号:</td>
                    <td>
                        <asp:Label ID="txt_CQJGBH"  CssClass="form-control  " runat="server"> </asp:Label>
                    </td>
                    <td>产权结构名称:</td>
                    <td>
                        <asp:Label ID="txt_CQJGMC"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>联系人:</td>
                    <td>
                        <asp:Label ID="txt_SCLXR"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>联系人电话:</td>
                    <td>
                        <asp:Label ID="txt_SCPHONE"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                
                <tr>
                    <td>出厂水压编号:</td>
                    <td>
                        <asp:Label ID="txt_CCSYBH"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>出厂水压名称:</td>
                    <td>
                        <asp:Label ID="txt_CCSYMC"  CssClass="form-control  "  runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>水厂设计压力(MPa):</td>
                    <td>
                        <asp:Label ID="txt_SCSJYL"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>加压泵组数量:</td>
                    <td>
                        <asp:Label ID="txt_JYBZSL"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
              </table>
         </div>
          <div class="tab-pane fade" id="dropdown" role="tabpanel" aria-labelledby="dropdown-tab">
              <table class="table table-bordered">
                <tr>
                    <td style="width:15%">运营公司编号:</td>
                    <td style="width:35%">
                        <asp:Label ID="txt_YYGSBH"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td style="width:15%">运营公司名称:</td>
                    <td style="width:35%">
                        <asp:Label ID="txt_YYGSMC"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>应急水源:</td>
                    <td>
                        <asp:Label ID="txt_HASYJSY"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>应急水源名称:</td>
                    <td>
                        <asp:Label ID="txt_YJSYMC"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>应急净水措施:</td>
                    <td>
                        <asp:Label ID="txt_YJJSCS"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>水厂净水工艺类型:</td>
                    <td>
                        <asp:Label ID="txt_SCJSGYLX"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>

                <tr>
                    <td>排序号:</td>
                    <td>
                        <asp:Label ID="txt_DISPLAYORDER"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                    <td>建厂时间:</td>
                    <td>
                        <asp:Label ID="txt_JCTIME"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>备注:</td>
                    <td colspan="3">
                        <asp:Label ID="txt_BZ"  CssClass="form-control  " runat="server"></asp:Label>
                    </td>
                </tr>
             <tr>
            </tr>
    </table>
       </div>             
    </div>
</form>
</body>
</html>
