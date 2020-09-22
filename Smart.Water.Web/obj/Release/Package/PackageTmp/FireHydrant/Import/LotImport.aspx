<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LotImport.aspx.cs" Inherits="Smart.Water.Web.FireHydrant.Import.LotImport" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>excel的批量导入</title>

    <link href="../../fonts/font-awesome/font-awesome.min.css" rel="stylesheet" />
    <link href="../../js/Bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../js/jQuery/Plugins/nprogress/nprogress.css" rel="stylesheet" />
    <script src="../../js/jQuery/jquery.min.js"></script>
    <script src="../../js/jQuery/Plugins/tether/tether.min.js"></script>
    <script src="../../js/Bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
    <script src="../../js/Noty/packaged/jquery.noty.packaged.js"></script>
    <script src="../../js/jQuery/Plugins/nprogress/nprogress.js"></script>
    <script>
        /*添加成功失败，返回弹窗提示,刷新列表*/
        function alertInfo(content, typeInfo) {
            NProgress.done();
            noty({ text: content, type: typeInfo, layout: "topCenter", timeout: 2000 });
        };
        $(function () {
            $("#btnImport").click(function () {               
                NProgress.start();
            });
        })
    </script>
    <style>
        .formfile {
            padding: .3rem 0.65rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #55595c;
            background-color: #fff;
            background-image: none;
            border: 1px solid #ccc;
            width:100%;
        }
           .btn {
            display: inline-block;
            padding: .3rem 0.65rem;
            font-size: 0.8rem;
            font-weight: normal;
            line-height: 1.5;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            border-radius: .25rem;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server" method="post">

        <div class="input-group" style="margin: 10px">
            <input id="ExcelFile" class="formfile" type="file" runat="server" />
        </div>
        <div>
            <asp:Button ID="btnImport" runat="server" Text="导入" CssClass="btn btn-info btn-sm center-block " OnClick="btnImport_Click" />
        </div>
    </form>
</body>
</html>
