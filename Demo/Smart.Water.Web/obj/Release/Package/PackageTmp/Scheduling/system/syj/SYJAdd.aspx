<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SYJAdd.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.syj.SYJAdd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>水源井信息添加</title>
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
            var result = parent.Robin.Portal.Page.SYJ.query();
            var showContent = ""
            $.each(result, function (i, item) {
                showContent += "<option value='" + item.BMID + "'>" + item.BMMC + "</option>";
            });
            $("#GLJCD").append(showContent);
            /*表单验证*/
            $("#btnSave").click(function () {
                if ($("#ProForm").valid()) { return true; }
                else { return false; }
            });
            /*关联监测点隐藏域绑定*/
            $("#GLJCD").change(function () {
                var gljcd = $("option:selected").val();
                $("#sel_GLJCD").val(gljcd);
            });
        
            //区划选择
            $('#txt_XZQ').focus(function () {
                var Title = "区划选择";
                var url = '../../../Common/CitySelect.html';
                $.jsPanel(
                           {
                               headerTitle: Title,
                               autoclose: false,
                               content: '<iframe src="' + url + '"id="citySelectFrame" style="width:300px;height:420px"  frameborder="0" scrolling="no"></iframe>',
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

            $("#txt_XZQ").val(name);
        }

        /*添加成功或者失败的弹窗提示，刷新数据列表*/
        function alertInfo(content, typeInfo) {
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
            try {
                if (typeInfo == 'success') {
                    
                    var list = parent.Robin.Window.GetInfoPanelByID("SYJList");
                    list.normalize();
                    parent.document.getElementById('syjFrame').contentWindow.refresh();
                    window.setTimeout(function () {
                        parent.Robin.CloseOneInfoPanel("SYJAdd");
                    }, 1000);
                }
            }
            catch (e) {
            }

        };
    </script>
</head>
<body>
    <form id="ProForm" runat="server" class="form-horizontal row-border">
        <ul id="myTab" class="nav nav-tabs m-b-10" role="tablist">
            <li class="nav-item">
                <a href="#home" class="nav-link active" data-toggle="tab">水源井基础信息</a>
            </li>
            <li class="nav-item">
                <a href="#jbf" class="nav-link" data-toggle="tab">进泵房信息 </a>
            </li>
            <li class="nav-item">
                <a href="#cbf" class="nav-link" data-toggle="tab">出泵房信息 </a>
            </li>
        </ul>
        <div class="tab-content">
            <%-- 水源井基本信息 --%>
            <div class="tab-pane fade active in" id="home">
                <table class="table table-bordered">
                    <tr>
                        <td>水源井名称</td>
                        <td>
                            <asp:TextBox ID="txt_BFMC" CssClass="form-control required " runat="server"></asp:TextBox>
                        </td>
                        <td>水源井地址</td>
                        <td>
                            <asp:TextBox ID="txt_BFDZ" CssClass="form-control required" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>联系人</td>
                        <td>
                            <asp:TextBox ID="txt_LXR" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>联系电话</td>
                        <td>
                            <asp:TextBox ID="txt_LXDH" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>施工单位</td>
                        <td>
                            <asp:TextBox ID="txt_SGDW" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>权属单位</td>
                        <td>
                            <asp:TextBox ID="txt_QSDW" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>行政区</td>
                        <td>
                            <asp:TextBox ID="txt_XZQ" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>供水层次</td>
                        <td>
                            <asp:TextBox ID="txt_GSCC" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>供水人口(户)</td>
                        <td>
                            <asp:TextBox ID="txt_GSRK" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                        <td>竣工时间</td>
                        <td>
                            <input class="form-control" type="text" id="txt_JGSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                        </td>
                    </tr>
                    <tr>
                        <td>静水位(m)</td>
                        <td>
                            <asp:TextBox ID="txt_JSW" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                        <td>井深(m)</td>
                        <td>
                            <asp:TextBox ID="txt_JS" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>成井时间</td>
                        <td>
                            <input class="form-control" type="text" id="txt_CJSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                        </td>
                        <td>井径(mm)</td>
                        <td>
                            <asp:TextBox ID="txt_JJ" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                         <td>填表时间</td>
                        <td>
                            <input class="form-control" type="text" id="txt_TBSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                        </td>
                        <td>水池阀门</td>
                        <td>
                            <asp:TextBox ID="txt_SCFM" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                    <td>泵型</td>
                        <td>
                            <asp:TextBox ID="txt_BX" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>扬程(m)</td>
                        <td>
                            <asp:TextBox ID="txt_YC" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                         <td>额定流量(m³/s)</td>
                        <td>
                            <asp:TextBox ID="txt_EDLL" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>实际流量(m³/s)</td>
                        <td>
                            <asp:TextBox ID="txt_SJLL" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>关联监测点</td>
                        <td colspan="3">
                            <asp:HiddenField ID="sel_GLJCD" runat="server" />
                            <select class="form-control" id="GLJCD" runat="server">
                                <option value="0">请选择</option>
                            </select>
                        </td>                     
                    </tr>
                    <tr>
                        <td>备注信息</td>
                        <td colspan="3">
                            <asp:TextBox ID="txt_BZ" CssClass="form-control" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                </table>
            </div>
            <%-- 进泵房信息 --%>
            <div class="tab-pane fade" id="jbf">
                <table class="table table-bordered">
                    <tr>
                        <td>进泵房</td>
                        <td>
                            <asp:TextBox ID="txt_JBF" CssClass="form-control required " runat="server"></asp:TextBox>
                        </td>
                        <td>进泵管径(mm)</td>
                        <td>
                            <asp:TextBox ID="txt_JBGJ" CssClass="form-control number " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵房阀门品牌</td>
                        <td>
                            <asp:TextBox ID="txt_JBFFMPP" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                        <td>进泵房阀门规格</td>
                        <td>
                            <asp:TextBox ID="txt_JBFFMGG" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵房阀门连接</td>
                        <td>
                            <asp:TextBox ID="txt_JBFFMLJ" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                        <td>进泵口阀门连接</td>
                        <td>
                            <asp:TextBox ID="txt_JBKFMLJ" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵口阀门品牌</td>
                        <td>
                            <asp:TextBox ID="txt_JBKFMPP" CssClass="form-control required " runat="server"></asp:TextBox>
                        </td>
                        <td>进泵口阀门规格</td>
                        <td>
                            <asp:TextBox ID="txt_JBKFMGG" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>水池吨位(t)</td>
                        <td>
                            <asp:TextBox ID="txt_SCDW" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                        <td>水池阀门数量(个)</td>
                        <td>
                            <asp:TextBox ID="txt_SCFMSL" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>地区水压(MPa)</td>
                        <td>
                            <asp:TextBox ID="txt_DQSY" CssClass="form-control number" runat="server"></asp:TextBox>
                        </td>
                        <td>噪声等级</td>
                        <td>
                            <asp:TextBox ID="txt_ZSDJ" CssClass="form-control  number" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>变压器</td>
                        <td>
                            <asp:TextBox ID="TXT_BYQ" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>变压器安装时间</td>
                        <td>
                            <input class="form-control" type="text" id="txt_BYQAZSJ" runat="server" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd' })" />
                        </td>
                    </tr>
                    <tr>
                        <td>变压器编号</td>
                        <td>
                            <asp:TextBox ID="txt_BYQBH" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>变压器台数(台)</td>
                        <td>
                            <asp:TextBox ID="txt_BYQTS" CssClass="form-control number " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                </table>
            </div>
            <%-- 出泵房信息 --%>
            <div class="tab-pane fade" id="cbf">
                <table class="table table-bordered">
                    <tr>

                        <td>出泵房</td>
                        <td>
                            <asp:TextBox ID="txt_CBF" CssClass="form-control required" runat="server"></asp:TextBox>
                        </td>
                        <td>出泵管径(mm)</td>
                        <td>
                            <asp:TextBox ID="txt_CBGJ" CssClass="form-control number " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵房阀门品牌</td>
                        <td>
                            <asp:TextBox ID="txt_CBFFMPP" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>出泵房阀门规格</td>
                        <td>
                            <asp:TextBox ID="txt_CBFFMGG" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵房阀门连接</td>
                        <td>
                            <asp:TextBox ID="txt_CBFFMLJ" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>出泵口阀门连接</td>
                        <td>
                            <asp:TextBox ID="txt_CBKFMLJ" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵口阀门品牌</td>
                        <td>
                            <asp:TextBox ID="txt_CBKFMPP" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                        <td>出泵口阀门规格</td>
                        <td>
                            <asp:TextBox ID="txt_CBKFMGG" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>泵口止回阀</td>
                        <td>
                            <asp:TextBox ID="txt_BKZHF" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                        <td>总止回阀型号</td>
                        <td>
                            <asp:TextBox ID="txt_ZZHFXH" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>电器控制厂家</td>
                        <td>
                            <asp:TextBox ID="txt_DQKZCJ" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                        <td>启动方式</td>
                        <td>
                            <asp:TextBox ID="txt_QDFS" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>软启动器型号</td>
                        <td>
                            <asp:TextBox ID="txt_RQDQXH" CssClass="form-control  " runat="server"></asp:TextBox>
                        </td>
                        <td>软启动器厂家</td>
                        <td>
                            <asp:TextBox ID="txt_RQDQCJ" CssClass="form-control " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>电器控制功率(kW)</td>
                        <td>
                            <asp:TextBox ID="txt_DQKZGL" CssClass="form-control  number " runat="server"></asp:TextBox>
                        </td>
                        <td>电器控制额定电流(A)</td>
                        <td>
                            <asp:TextBox ID="txt_DQKZEDDL" CssClass="form-control number " runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>电器控制编号</td>
                        <td>
                            <asp:TextBox ID="txt_DQKZBH" CssClass="form-control  " runat="server"></asp:TextBox>
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
