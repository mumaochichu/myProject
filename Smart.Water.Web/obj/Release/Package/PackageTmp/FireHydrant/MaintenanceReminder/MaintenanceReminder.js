var oTable;
var CuringCycle = top.Robin.Setting.GlobalSetting.CuringCycle;
$(function () {
    oTable = $('#paTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },
        "bServerSide": true,
        "sAjaxSource": "Handler.ashx?Action=List&CuringCycle=" + CuringCycle,      //mvc后台ajax调用接口       
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,
        "iDisplayLength": 10,  //每页显示的行数 
        "bLengthChange": false,//允许用户从一个选择菜单中格式化页面大小(改变页面显示的数据数量)
        'sPaginationType': 'full_numbers',      //分页样式            
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "name", "value": $("#txtName").val() });
        },
        "aoColumns": [
            { "mData": "ID", "sTitle": "主键", "bVisible": false, "bSearchable": false, "bSortable": false },
            {
                "mData": "POINTNO", "sTitle": "管点编号", "sWidth": "10%"
            },
            {
                "mData": "SIZES", "sTitle": "口径", "sWidth": "10%"
            },
            {
                "mData": "ADDRESS", "sTitle": "地址", "sWidth": "20%",
                "mRender": function (data, type, full) {
                    if (data && data.length > 15) {
                        return "<span title='" + data + "'>" + data.substr(0, 15) + ".." + "</span>";
                    }
                    return data;
                }
            },
            { "mData": "STATUS", "sTitle": "使用状态", "sWidth": "10%" },
            {
                "mData": "LASTYHTIME",
                "sTitle": "最后养护时间",
                "sWidth": "15%",
                "mRender": function (data, type, full) {
                    if (data) {
                        var mydate = new Date();
                        var dtStart = full.LASTYHTIME;
                        var dtStartWrapper = moment(dtStart);
                        return dtStartWrapper.format('YYYY-MM-DD');
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                "mData": "JCDNAME", "sTitle": "监测点名称", "sWidth": "18%",
                "mRender": function (data, type, full) {
                    if (data && data.length > 13) {
                        return "<span title='" + data + "'>" + data.substr(0, 13) + ".." + "</span>";
                    }
                    return data;
                }
            },
            {
                "mData": "LASTYHTIME",
                "sTitle": "超期天数",
                "sWidth": "10%",
                "mRender": function (data, type, full) {
                    debugger;
                    if (data) {
                        var dtStart = full.LASTYHTIME;
                        var dtStartWrapper = moment(dtStart);
                        var d = dtStartWrapper.format('YYYY-MM-DD');
                        var lastyhdate = new Date(Date.parse(d.replace(/-/g, "/")));
                        lastyhdate.setDate(lastyhdate.getDate() + CuringCycle);
                        var nowdate = new Date();
                        var TotalMilliseconds = nowdate - lastyhdate;//相差的毫秒
                        var totalday = parseInt(TotalMilliseconds / (1000 * 60 * 60 * 24));
                        if (totalday > 0)
                            return "<font style='font-weight:bold;color:red;'>" + totalday + "</font>";
                        else
                            return ""
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                "sTitle": "操作",
                "sWidth": "7%",
                "mRender": function (data, type, full) {
                    var html = ' <a href="#" id="' + full.Id + '" onclick="loc(\'' + full.X + '\',\'' + full.Y + '\',\'' + full.JCDNAME + '\',\'' + full.ID + '\',\''+ full.STATUS + '\');"><i class="fa fa-map-marker fa-lg" title="定位"></i></a>';
                    return html;
                }
            }
        ]
    });
    $("#btnQuery").click(function () {

        if (isNaN($('#txtName').val())) {
            top.noty({ text: "请输入数字！", type: "error", layout: "topCenter", timeout: 1000 });
            return;
        }

        if (oTable != undefined && oTable != null) {
            oTable.fnClearTable(0);
            oTable.fnDraw();
        }
    });
    //$('input:text:first').focus();
});

function loc(x, y, jcdname, id,status) {

    parent.Robin.Window.GetInfoPanelByID("alertdataid").smallify();

    var symbolConfig = {
        font:
            { 'size': "13", 'style': 'normal' },
        color: [0, 89, 149],
        pic: {
            width: 30,
            height: 30
        },
        offset: {
            x: 0,
            y: -30
        }
    };
    var tpname = "";
    //判断展示文件名
    if (status == "正常") {
        tpname = "bz-normal";
    }
    if (status == "在建") {
        tpname = "bz-construction";
    }
    if (status == "作废") {
        tpname = "bz-discard";
    }
    var StationListLayer = top.Robin.Map.GetGraphicLayer(top.Robin.Map.Map2DControl, tpname);
    //地图渲染图标
    top.Robin.Map.ShowGraphic(StationListLayer, jcdname, Number(x), Number(y), "../images/hydrant/" + tpname + ".png", null, symbolConfig);

    top.Robin.Map.MapWindow.CloseAll();
    var p = top.Robin.Map.GetPoint(Number(x), Number(y));
            $("#btnQuery").click(function () {
                if (oTable != undefined && oTable != null) {
                    oTable.fnClearTable(0);
                    oTable.fnDraw();
                }
            });
    if (!top.Robin.Map.MapWindow.IsOpenByID(id)) {
        top.Robin.Map.Fly2Geometry(top.Robin.Map.Map2DControl, p, function () {
            //parent.Robin.Map.MapWindow.Show(id, top.Robin.Map.Map2DControl, p, null, true);
        });
    } else {
        top.Robin.Map.Fly2Geometry(Robin.Map.Map2DControl, p);
    }

}

/*获取URL中的参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));
    return null;
}

/**
* confirm提示.需要提前加载noty.这个方法放在utils里会报错
* 需要引用js/Bootstrap/Version3/css/bootstrap-button.css，js/Noty/packaged/jquery.noty.packaged.min.js
* @param message 提示的内容
* @param type 类型information,alert,error,success,warning
* @param okCallback yes执行的方法
* @param cancelCallback no执行的方法
* @param lblok yes显示的内容
* @param lblcancel no显示的内容
* @constructor
*/
function confirm(message, type, okCallback, cancelCallback, lblok, lblcancel) {

    if (!noty) {

        alert("请检查插件是否加载成功！");
        return;
    }

    var _default =
    {
        text: message || "您确定要删除所选对象吗?",
        type: type || "alert",
        dismissQueue: true,
        modal: true,
        layout: "center",
        buttons: [
            {
                addClass: 'btn btn-primary',
                text: lblok || "确定",
                onClick: function ($noty) {
                    $noty.close();
                    if (okCallback && $.isFunction(okCallback)) {

                        okCallback();
                    }
                }
            },
            {
                addClass: 'btn btn-warning',
                text: lblcancel || "取消",
                onClick: function ($noty) {
                    $noty.close();
                    if (cancelCallback && $.isFunction(cancelCallback)) {

                        cancelCallback();
                    }
                }
            }
        ]
    };

    noty(_default);
};
