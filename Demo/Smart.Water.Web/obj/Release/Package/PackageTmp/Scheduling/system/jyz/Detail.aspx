    <%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Detail.aspx.cs" Inherits="Smart.Water.Web.Scheduling.system.jyz.Detail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>加压站详情</title>

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
            var result = parent.Robin.Portal.Page.JYZ.query();
            var  showContent = ""
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
        <ul id="myTab" class="nav nav-tabs m-b-10" role="tablist">
            <li class="nav-item">
                <a href="#home" class="nav-link active" data-toggle="tab">泵站基础信息</a>
            </li>
            <li class="nav-item">
                <a href="#jbf" class="nav-link" data-toggle="tab">进泵房信息 </a>
            </li>
            <li class="nav-item">
                <a href="#cbf" class="nav-link" data-toggle="tab">出泵房信息 </a>
            </li>

        </ul>
        <div class="tab-content">
            <%-- 基本信息 --%>
            <div class="tab-pane fade active in" id="home">
                <table class="table table-bordered">
                    <tr>
                        <td style="width:20%">泵房名称</td>
                        <td style="width:30%">
                            <asp:Label ID="txt_BFMC" runat="server"></asp:Label>
                        </td>
                        <td style="width:20%">泵房地址</td>
                        <td style="width:30%">
                            <asp:Label ID="txt_Address" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>联系人</td>
                        <td>
                            <asp:Label ID="txt_LXR" runat="server"></asp:Label>
                        </td>
                        <td>联系电话</td>
                        <td>
                            <asp:Label ID="txt_LXDH" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>施工单位</td>
                        <td>
                            <asp:Label ID="txt_Unit" runat="server"></asp:Label>
                        </td>
                        <td>权属单位</td>
                        <td>
                            <asp:Label ID="txt_Tbdw" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>行政区</td>
                        <td>
                            <asp:Label ID="txt_XZQ" runat="server"></asp:Label>
                        </td>

                        <td>供水层次</td>
                        <td>
                            <asp:Label ID="txt_GSCC" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>供水人口(户)</td>
                        <td>
                            <asp:Label ID="txt_GSRK" runat="server"></asp:Label>
                        </td>
                        <td>竣工时间</td>
                        <td>
                            <asp:Label ID="jgsj" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>供水范围(层)</td>
                        <td>
                            <asp:Label ID="txt_GSFW" runat="server"></asp:Label>
                        </td>
                        <td>填表时间</td>
                        <td>
                            <asp:Label ID="txt_TBSJ" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>关联监测点</td>
                        <td>
                            <asp:HiddenField ID="sel_GLJCD" runat="server" />
                            <asp:Label ID="GLJCD" runat="server"></asp:Label>
                        </td>
                        <td>出水压力(MPa)</td>
                        <td>
                            <asp:Label ID="CSYL" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>清水池容量(m³)</td>
                        <td>
                            <asp:Label ID="QSCRL" runat="server"></asp:Label>
                        </td>
                        <td>无压深井数量(个)</td>
                        <td>
                            <asp:Label ID="WYSJSL" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>时供水量(m³)</td>
                        <td>
                            <asp:Label ID="SGSL" runat="server"></asp:Label>
                        </td>
                        <td>最大日供水量(m³)</td>
                        <td>
                            <asp:Label ID="ZDRGSL" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>实际供水量(m³)</td>
                        <td>
                            <asp:Label ID="SJGSL" runat="server"></asp:Label>
                        </td>
                        <td>出水高程(m)</td>
                        <td>
                            <asp:Label ID="CSGC" runat="server"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>
            <%-- 进泵房 --%>
            <div class="tab-pane fade" id="jbf">
                <table class="table table-bordered">
                    <tr>
                        <td style="width:20%">进泵房</td>
                        <td style="width:30%">
                            <asp:Label ID="txt_JBF" runat="server"></asp:Label>
                        </td>
                        <td style="width:20%">进泵管径(mm)</td>
                        <td style="width:30%">
                            <asp:Label ID="txt_JBGJ" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>进泵口阀门</td>
                        <td>
                            <asp:Label ID="txt_JBKFM" runat="server"></asp:Label>
                        </td>
                        <td>进泵房阀门品牌</td>
                        <td>
                            <asp:Label ID="txt_JBFFMPP" runat="server"></asp:Label>
                        </td>

                    </tr>
                    <tr>
                        <td>进泵房阀门规格</td>
                        <td>
                            <asp:Label ID="txt_JBFFMGG" runat="server"></asp:Label>
                        </td>
                        <td>进泵房阀门连接</td>
                        <td>
                            <asp:Label ID="txt_JBFFMLJ" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>水池吨位(t)</td>
                        <td>
                            <asp:Label ID="txt_SCDW" runat="server"></asp:Label>
                        </td>
                        <td>地区水压(MPa)</td>
                        <td>
                            <asp:Label ID="txt_DQSY" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>变压器</td>
                        <td>
                            <asp:Label ID="TXT_BYQ" runat="server"></asp:Label>
                        </td>
                        <td>变压器安装时间</td>
                        <td>
                            <asp:Label ID="txt_BYQAZSJ" runat="server"></asp:Label>

                        </td>
                    </tr>
                </table>
            </div>
            <%-- 出泵房 --%>
            <div class="tab-pane fade" id="cbf">
                <table class="table table-bordered">
                    <tr>
                        <td style="width:20%">出泵房</td>
                        <td style="width:30%">
                            <asp:Label ID="txt_CBF" runat="server"></asp:Label>
                        </td>
                        <td style="width:20%">出泵管径(mm)</td>
                        <td style="width:30%">
                            <asp:Label ID="txt_CBGJ" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>出泵口阀门</td>
                        <td>
                            <asp:Label ID="txt_CBKFM" runat="server"></asp:Label>
                        </td>
                        <td>出泵阀门品牌</td>
                        <td>
                            <asp:Label ID="txt_CBFFMPP" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>

                        <td>出泵阀门规格</td>
                        <td>
                            <asp:Label ID="txt_CBFFMGG" runat="server"></asp:Label>
                        </td>
                        <td>出泵阀门连接</td>
                        <td>
                            <asp:Label ID="txt_CBFFMLJ" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>泵口止回阀</td>
                        <td>
                            <asp:Label ID="txt_BKZHF" runat="server"></asp:Label>
                        </td>
                        <td>总止回阀型号</td>
                        <td>
                            <asp:Label ID="txt_ZZHFXH" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>水池阀门</td>
                        <td>
                            <asp:Label ID="txt_SCFM" runat="server"></asp:Label>
                        </td>
                        <td>水池阀门数量(个)</td>
                        <td>
                            <asp:Label ID="txt_SCFMSL" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>噪声等级</td>
                        <td>
                            <asp:Label ID="txt_ZSDJ" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>备注信息</td>
                        <td colspan="7">
                            <asp:Label ID="txt_BZ" runat="server"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>

        </div>



    </form>
</body>
</html>
