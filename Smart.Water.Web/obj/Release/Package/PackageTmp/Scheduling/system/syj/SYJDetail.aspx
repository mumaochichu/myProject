<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SYJDetail.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.syj.SYJDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>水源井信息详情</title>
    <link href="../../../js/Bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../../js/jQuery/Plugins/validation/validation.css" rel="stylesheet" />
    <script src="../../../js/jQuery/jquery.min.js"></script>
    <script src="../../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../../js/Bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
    <script src="../../../js/jQuery/Plugins/DatePicker/WdatePicker.js"></script>
    <script src="../../../js/jQuery/Plugins/validation/jquery.validate.js"></script>
    <script type="text/javascript">
        $(function () {
            /*关联监测点*/
            $('input:text:first').focus();
            var result = parent.Robin.Portal.Page.SYJ.query();
            var showContent = ""
            $.each(result, function (i, item) {
                if(item.BMID==$("#sel_GLJCD").val())
                {
                    $("#GLJCD").text(item.BMMC);
                }
            });                         
        });
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
                        <td style="width:15%">水源井名称</td>
                        <td style="width:35%">
                            <asp:Label ID="txt_BFMC" CssClass="form-control required " runat="server"></asp:Label>
                        </td>
                        <td>水源井地址</td>
                        <td>
                            <asp:Label ID="txt_BFDZ" CssClass="form-control required" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>联系人</td>
                        <td>
                            <asp:Label ID="txt_LXR" CssClass="form-control required" runat="server"></asp:Label>
                        </td>
                        <td>联系电话</td>
                        <td>
                            <asp:Label ID="txt_LXDH" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>施工单位</td>
                        <td>
                            <asp:Label ID="txt_SGDW" CssClass="form-control required" runat="server"></asp:Label>
                        </td>
                        <td>权属单位</td>
                        <td>
                            <asp:Label ID="txt_QSDW" CssClass="form-control required" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>行政区</td>
                        <td>
                            <asp:Label ID="txt_XZQ" CssClass="form-control required" runat="server"></asp:Label>
                        </td>
                        <td>供水层次</td>
                        <td>
                            <asp:Label ID="txt_GSCC" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>供水人口(户)</td>
                        <td>
                            <asp:Label ID="txt_GSRK" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                        <td>竣工时间</td>                      
                         <td>
                            <asp:Label ID="txt_JGSJ" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>静水位(m)</td>
                        <td>
                            <asp:Label ID="txt_JSW" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                        <td>井深(m)</td>
                        <td>
                            <asp:Label ID="txt_JS" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>成井时间</td>                     
                        <td>
                            <asp:Label ID="txt_CJSJ" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                        <td>井径(mm)</td>
                        <td>
                            <asp:Label ID="txt_JJ" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>填表时间</td>                       
                        <td>
                            <asp:Label ID="txt_TBSJ" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                        <td>水池阀门</td>
                        <td>
                            <asp:Label ID="txt_SCFM" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                    <td>泵型</td>
                        <td>
                            <asp:Label ID="txt_BX" CssClass="form-control " runat="server"></asp:Label>   
                        </td>
                        <td>扬程(m)</td>
                        <td>
                            <asp:Label ID="txt_YC" CssClass="form-control " runat="server"></asp:Label>   
                        </td>
                    </tr>
                    <tr>
                         <td>额定流量(m³/s)</td>
                        <td>
                            <asp:Label ID="txt_EDLL" CssClass="form-control " runat="server"></asp:Label>   
                        </td>
                        <td>实际流量(m³/s)</td>
                        <td>
                            <asp:Label ID="txt_SJLL" CssClass="form-control " runat="server"></asp:Label>   
                        </td>
                    </tr>
                    <tr>
                        <td>关联监测点</td>
                        <td colspan="3">
                            <asp:HiddenField ID="sel_GLJCD" runat="server" />
                            <asp:Label ID="GLJCD" CssClass="form-control" runat="server"></asp:Label>                         
                        </td>
                    </tr>
                    <tr>
                        <td>备注信息</td>
                        <td colspan="3">
                            <asp:Label ID="txt_BZ" CssClass="form-control" runat="server"></asp:Label>
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
                            <asp:Label ID="txt_JBF" CssClass="form-control required " runat="server"></asp:Label>
                        </td>
                        <td>进泵管径(mm)</td>
                        <td>
                            <asp:Label ID="txt_JBGJ" CssClass="form-control number " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵房阀门品牌</td>
                        <td>
                            <asp:Label ID="txt_JBFFMPP" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                        <td>进泵房阀门规格</td>
                        <td>
                            <asp:Label ID="txt_JBFFMGG" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵房阀门连接</td>
                        <td>
                            <asp:Label ID="txt_JBFFMLJ" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                        <td>进泵口阀门连接</td>
                        <td>
                            <asp:Label ID="txt_JBKFMLJ" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵口阀门品牌</td>
                        <td>
                            <asp:Label ID="txt_JBKFMPP" CssClass="form-control required " runat="server"></asp:Label>
                        </td>
                        <td>进泵口阀门规格</td>
                        <td>
                            <asp:Label ID="txt_JBKFMGG" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>水池吨位(t)</td>
                        <td>
                            <asp:Label ID="txt_SCDW" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                        <td>水池阀门数量(个)</td>
                        <td>
                            <asp:Label ID="txt_SCFMSL" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>地区水压(MPa)</td>
                        <td>
                            <asp:Label ID="txt_DQSY" CssClass="form-control number" runat="server"></asp:Label>
                        </td>
                        <td>噪声等级</td>
                        <td>
                            <asp:Label ID="txt_ZSDJ" CssClass="form-control  number" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>变压器</td>
                        <td>
                            <asp:Label ID="TXT_BYQ" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                        <td>变压器安装时间</td>
                        <td>
                            <asp:Label ID="txt_BYQAZSJ" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>变压器编号</td>
                        <td>
                            <asp:Label ID="txt_BYQBH" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                        <td>变压器台数(台)</td>
                        <td>
                            <asp:Label ID="txt_BYQTS" CssClass="form-control number " runat="server"></asp:Label>
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
                            <asp:Label ID="txt_CBF" CssClass="form-control required" runat="server"></asp:Label>
                        </td>
                        <td>出泵管径(mm)</td>
                        <td>
                            <asp:Label ID="txt_CBGJ" CssClass="form-control number " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵房阀门品牌</td>
                        <td>
                            <asp:Label ID="txt_CBFFMPP" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                        <td>出泵房阀门规格</td>
                        <td>
                            <asp:Label ID="txt_CBFFMGG" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵房阀门连接</td>
                        <td>
                            <asp:Label ID="txt_CBFFMLJ" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                        <td>出泵口阀门连接</td>
                        <td>
                            <asp:Label ID="txt_CBKFMLJ" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵口阀门品牌</td>
                        <td>
                            <asp:Label ID="txt_CBKFMPP" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                        <td>出泵口阀门规格</td>
                        <td>
                            <asp:Label ID="txt_CBKFMGG" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>泵口止回阀</td>
                        <td>
                            <asp:Label ID="txt_BKZHF" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                        <td>总止回阀型号</td>
                        <td>
                            <asp:Label ID="txt_ZZHFXH" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>电器控制厂家</td>
                        <td>
                            <asp:Label ID="txt_DQKZCJ" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                        <td>启动方式</td>
                        <td>
                            <asp:Label ID="txt_QDFS" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>软启动器型号</td>
                        <td>
                            <asp:Label ID="txt_RQDQXH" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                        <td>软启动器厂家</td>
                        <td>
                            <asp:Label ID="txt_RQDQCJ" CssClass="form-control " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>电器控制功率(kW)</td>
                        <td>
                            <asp:Label ID="txt_DQKZGL" CssClass="form-control  number " runat="server"></asp:Label>
                        </td>
                        <td>电器控制额定电流(A)</td>
                        <td>
                            <asp:Label ID="txt_DQKZEDDL" CssClass="form-control number " runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>电器控制编号</td>
                        <td>
                            <asp:Label ID="txt_DQKZBH" CssClass="form-control  " runat="server"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>
        </div>      
    </form>
</body>
</html>
