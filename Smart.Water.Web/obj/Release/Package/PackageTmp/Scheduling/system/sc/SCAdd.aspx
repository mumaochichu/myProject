<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SCAdd.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.sc.SCAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
     <title>水厂信息新增</title>     
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
             var options = $("#sel_GLJCB").val();
             $("#SELID").val(options);
             $('input:text:first').focus();
             var result = parent.Robin.Portal.Page.SC.query();
             var showContent = ""            
             $.each(result, function (i, item) {
                 showContent += "<option value='" + item.BMID + "'>" + item.BMMC + "</option>";
             });
             $("#sel_GLJCB").append(showContent);
            $("#btnSave").click(function () {
                if ($("#ProForm").valid()) {
                    return true;
                }
                else {
                    return false;
                }
            });
            $("#sel_GLJCB").change(function () {
                var options = $("#sel_GLJCB").val();
              
                $("#SELID").val(options);
            })


             //区划选择
            $('#txt_CITYNAME').focus(function () {
                var Title = "区划选择";
                var url = '../../../Common/CitySelect.html';
                $.jsPanel(
                           {
                               headerTitle: Title,
                               autoclose: false,
                               content: '<iframe src="' + url + '" id="citySelectFrame" style="width:300px;height:420px"  frameborder="0" scrolling="no"></iframe>',
                               id: 'citySelectPanel',
                               theme: '#2b3d51',
                               contentSize: { width: 300, height: 420 },
                               paneltype: 'hint',
                               minimizeOthers: false,
                               position: 'center'
                           });
            });

         });

         //CitySelect.html调用给父窗口赋值
         function setCodeName(code, name) {
             $("#txt_CITYCODE").val(code);
             $("#txt_CITYNAME").val(name);
         }

        /*添加成功失败，返回弹窗提示*/
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {

                    var listpanel = parent.Robin.Window.GetInfoPanelByID("scList");
                    listpanel.normalize();
                    parent.document.getElementById('SCLIST').contentWindow.refresh();
                    window.setTimeout(function () {
                        parent.Robin.CloseOneInfoPanel("SCAdd");                
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
                        <td width="15%">水厂编号:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_SCBH" CssClass="form-control required" runat="server"></asp:TextBox>
                        </td>
                        <td width="15%">水厂名称:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_SCNAME" CssClass="form-control required" runat="server"></asp:TextBox>
                        </td>       
                    </tr>
                  <tr>
                         <td style="display:none" >区划编号:</td>
                        <td style="display:none">
                            <asp:TextBox ID="txt_CITYCODE" CssClass="form-control required" runat="server" ></asp:TextBox>
                        </td>
                        <td>区划名称:</td>
                        <td>
                            <asp:TextBox ID="txt_CITYNAME" CssClass="form-control required" runat="server" ></asp:TextBox>
                        </td>                                
                       <td>关联监测点:</td>
                       <td>
                        <select class="form-control" id="sel_GLJCB" runat="server">
                            <option value="0">请选择</option>
                        </select>
                           <input id="SELID" type="hidden" runat="server" /> 
                       </td>
                    </tr>
                      <tr>
                        <td>负责人:</td>
                        <td>
                            <asp:TextBox ID="txt_SCFZR" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td>负责人电话:</td>
                        <td>
                            <asp:TextBox ID="txt_SCFZRDH" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                 </tr>
                   <tr>
                       <td>供水区域:</td>
                       <td>
                            <asp:TextBox ID="txt_GSQY" CssClass="form-control" runat="server"></asp:TextBox>
                        </td> 
                       <td>年供水总量(m³):</td>
                       <td>
                            <asp:TextBox ID="txt_NGSZL" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>                      
                   </tr> 
                    <tr>
                        <td>设计生产能力(m³/d):</td>
                        <td>
                            <asp:TextBox ID="txt_SJSCNL" CssClass="form-control" runat="server"></asp:TextBox>
                        </td> 
                        <td>实际供水能力(m³/d):</td>
                        <td>
                            <asp:TextBox ID="txt_SJGSNL" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr> 
                    <tr>
                        <td>建筑面积(㎡):</td>
                        <td>
                            <asp:TextBox ID="txt_JZMJ" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td>平均日生产水量(m³/d):</td>
                        <td>
                            <asp:TextBox ID="txt_PJRSCSL" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr> 
                    <tr>
                        <td>水厂位置:</td>
                        <td colspan="3">
                            <input class="form-control" type="text" id="txt_SCLOCATION" runat="server" />
                        </td>
                    </tr>
                  </table>
            </div> 
         <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <table class="table table-bordered">
                  <tr>
                        <td width="15%">权属单位编号:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_QSDWBH" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td width="15%">权属单位名称:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_QSDWMC" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>产权结构编号:</td>
                        <td>
                            <asp:TextBox ID="txt_CQJGBH" CssClass="form-control" runat="server"> </asp:TextBox>
                        </td>
                        <td>产权结构名称:</td>
                        <td>
                            <asp:TextBox ID="txt_CQJGMC" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>联系人:</td>
                        <td>
                            <asp:TextBox ID="txt_SCLXR" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td>联系人电话:</td>
                        <td>
                            <asp:TextBox ID="txt_SCPHONE" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>                                  
                    <tr>
                        <td>出厂水压编号:</td>
                        <td>
                            <asp:TextBox ID="txt_CCSYBH" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td>出厂水压名称:</td>
                        <td>
                            <asp:TextBox ID="txt_CCSYMC" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>水厂设计压力(MPa):</td>
                        <td>
                            <asp:TextBox ID="txt_SCSJYL" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td>加压泵组数量:</td>
                        <td>
                            <asp:TextBox ID="txt_JYBZSL" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr> 
                </table>
         </div>
          <div class="tab-pane fade" id="dropdown" role="tabpanel" aria-labelledby="dropdown-tab">
              <table class="table table-bordered">
                  <tr>
                        <td width="15%">运营公司编号:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_YYGSBH" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td width="15%">运营公司名称:</td>
                        <td width="35%">
                            <asp:TextBox ID="txt_YYGSMC" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>应急水源:</td>
                        <td>
                            <asp:DropDownList ID="ddl_HASYJSY" CssClass="form-control required" runat="server">
                                <asp:ListItem Value="0">无</asp:ListItem>
                                <asp:ListItem Value="1">有</asp:ListItem>
                        </asp:DropDownList>
                        </td>
                        <td>应急水源名称:</td>
                        <td>
                            <input class="form-control" type="text" id="txt_YJSYMC" runat="server" />
                        </td>
                    </tr>                   
                    <tr>
                       <td>应急净水措施:</td>
                        <td>
                         <asp:DropDownList ID="ddl_YJJSCS" CssClass="form-control required" runat="server">
                                <asp:ListItem Value="0">无</asp:ListItem>
                                <asp:ListItem Value="1">有</asp:ListItem>
                        </asp:DropDownList>
                        </td>
                        <td>水厂净水工艺类型:</td>
                        <td>
                         <asp:DropDownList ID="ddl_SCJSGYLX" CssClass="form-control required" runat="server">
                                <asp:ListItem Value="0">地表水厂</asp:ListItem>
                                <asp:ListItem Value="1">地下水厂</asp:ListItem>
                        </asp:DropDownList>
                        </td>
                    </tr> 

                    <tr>
                        <td>排序号:</td>
                        <td>
                            <asp:TextBox ID="txt_DISPLAYORDER" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                        <td>建厂时间:</td>
                        <td>
                            <input class="form-control" type="text" id="txt_JCTIME" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
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
              
    </div>
     <div style="position: center">
            <asp:Button ID="btnSave" CssClass="btn btn-info center-block" runat="server" Text="保存" OnClick="btnSave_Click"></asp:Button>
     </div>
    </form>
</body>
</html>
