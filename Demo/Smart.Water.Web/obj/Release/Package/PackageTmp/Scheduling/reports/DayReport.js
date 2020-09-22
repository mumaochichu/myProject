/*日报表的相关操作*/
var oTabel;
var alertTable;
var queryData;
var url = parent.Robin.Setting.GlobalSetting.RestAPIService;
var monitorData = top.Robin.Data.monitor;
var pd;
/*创建日报对象*/
var ReportDay = {
    //数据
    data: [],
    //目前的监测项
    CurrentTags: [],
    CurrentDataSet: [],
    //目前的列
    CurrentColumns: [],
    //预警数据,预警数据的列
    CurrentAlertDataSet: [],
    CurrentAlertColumns: []
}
/*打开默认当前的时间*/
function date() {
    $("#txtTime").val(moment().format('YYYY-MM-DD'));
}

/*程序的入口*/
$(function () {
    //滚动条   
    //$("#slimScroll").slimscroll({
    //    height: '400px',
    //});
    date();
    $("#TypeList").change(function () {
        SelectType($(this).val());
    });

    $("#StationList").change(function () {
        SelectStation($(this).val());
    });
    SelectType($("#TypeList").eq(0).val());
    //查询
    $("#btnQuery").click(function () {
        query();
    });
    //导出
    $("#btnExport").click(function (i, v) {
        Export();
    });
    ReportDay.CurrentTags = [];
    var StationKey = $("#StationList").val();
    $.each(top.tmodel.monitorData(), function (i, v) {
        if (v.StationKey() == StationKey) {
            switch (StationKey.substring(6, 12)) {
                case "030199":
                    if (v.TagKey() != "030199_006" && v.TagKey() != "030199_002" && v.TagKey() != "030199_003") {
                        ReportDay.CurrentTags.push(v);
                    }
                    break;
                case "030202":
                    if (v.TagKey() != "030202_001" && v.TagKey() != "030202_002" && v.TagKey() != "030202_006" && v.TagKey() != "030202_007") {
                        ReportDay.CurrentTags.push(v);
                    }
                    break;
                case "030201":
                    if (v.TagKey() != "030201_001" && v.TagKey() != "030201_002") {
                        ReportDay.CurrentTags.push(v);
                    }
                    break;
                case "030304":
                    ReportDay.CurrentTags.push(v);
                    break;
            }
            //ReportDay.CurrentTags.push(v);
        }
    });
    pd = isIE();
});
/*选择检测类型 显示监测项*/
function SelectType(type) {
    ReportDay.CurrentTags = [];
    $("#StationList").empty();
    $.each(monitorData, function (i, v) {
        if (v.BMID.substring(6, 12) == type) {
            $("#StationList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option');
        }
    });
    var StationKey = $("#StationList").val();
    $.each(top.tmodel.monitorData(), function (ii, vv) {
        if (vv.StationKey() == StationKey) {
            switch (type) {
                case "030199":
                    if (vv.TagKey() != "030199_006" && vv.TagKey() != "030199_002" && vv.TagKey() != "030199_003") {
                        ReportDay.CurrentTags.push(vv);
                    }
                    break;
                case "030202":
                    if (vv.TagKey() != "030202_001" && vv.TagKey() != "030202_002" && vv.TagKey() != "030202_006" && vv.TagKey() != "030202_007") {
                        ReportDay.CurrentTags.push(vv);
                    }
                    break;
                case "030201":
                    if (vv.TagKey() != "030201_001" && vv.TagKey() != "030201_002") {
                        ReportDay.CurrentTags.push(vv);
                    }
                    break;
                case "030304":
                    ReportDay.CurrentTags.push(vv);
                    break;
            }
            // ReportDay.CurrentTags.push(vv);
        }
    });
}
/*选择站点*/
function SelectStation(StationKey) {
    ReportDay.CurrentTags = [];
    $.each(top.tmodel.monitorData(), function (i, v) {
        if (v.StationKey() == StationKey) {
            switch (StationKey.substring(6, 12)) {
                case "030199":
                    if (v.TagKey() != "030199_006" && v.TagKey() != "030199_002" && v.TagKey() != "030199_003") {
                        ReportDay.CurrentTags.push(v);
                    }
                    break;
                case "030202":
                    if (v.TagKey() != "030202_001" && v.TagKey() != "030202_002" && v.TagKey() != "030202_006" && v.TagKey() != "030202_007") {
                        ReportDay.CurrentTags.push(v);
                    }
                    break;
                case "030201":
                    if (v.TagKey() != "030201_001" && v.TagKey() != "030201_002") {
                        ReportDay.CurrentTags.push(v);
                    }
                    break;
                case "030304":
                    ReportDay.CurrentTags.push(v);
                    break;
            }
        }
    });
}
/*创建基本信息列表*/
function CreatTable(dataSet) {
    var datasource = [];
    var columns = [];
    var lineitem = [];
    var itemHtml = "";
    var colNameHtml = "";
    ReportDay.CurrentColumns = [];
    itemHtml += "<div class='table_title'><ul class='itemUl'><li>&nbsp</li>";
    colNameHtml += "<div class='table_title'><ul  class='columnUl'><li>时间</li>";
    ReportDay.CurrentColumns.push("时间");
    $.each(ReportDay.CurrentTags, function (i, v) {
        itemHtml += "<li class='itemList'>" + v.TagName() + "</li>";
        colNameHtml += "<li class='left-border'>最大值(" + v.Units() + ")</li><li>时间</li><li>最小值(" + v.Units() + ")</li><li>时间</li><li>平均值(" + v.Units() + ")</li>";
        ReportDay.CurrentColumns.push(v.TagName() + "最大值");
        ReportDay.CurrentColumns.push(v.TagName() + "最大值时间");
        ReportDay.CurrentColumns.push(v.TagName() + "最小值");
        ReportDay.CurrentColumns.push(v.TagName() + "最小值时间");
        ReportDay.CurrentColumns.push(v.TagName() + "平均值");
    });
    itemHtml += "</ul></div>";
    colNameHtml += "</ul></div>";
    /*构造table*/
    for (var i = 1; i <= 24; i++) {
        //某一点的所有检测项数据
        var databytime = [];
        lineitem = [];
        //时间
        var time = '';
        if (i.toString().length == 1) {
            time = "0" + i + ":00";
        }
        else {
            time = i + ":00";
        }
        lineitem.push(time);
        //获取这个点的所有检测数据
        $.each(dataSet, function (i, v) {
            if (v.PERIOD == time) {
                databytime.push(v);
            }
        });
        if (databytime.length == 0) {
            for (var j = 0; j < ReportDay.CurrentTags.length; j++) {
                lineitem.push("");//最大值
                lineitem.push("");//最大值时间
                lineitem.push("");//最小值
                lineitem.push("");//最小值时间
                lineitem.push("");//平均值
            }
        }
        else {
            var isflag = false;
            var currentLineData = [];
            //检测项目类别
            $.each(ReportDay.CurrentTags, function (i, v) {
                $.each(databytime, function (ii, vv) {
                    if (v.TagCode() == vv.TAGKEY) {
                        isflag = true;
                        currentLineData = vv;
                        return false;
                    }
                });
                //如果存在数据
                if (isflag) {
                    //最大值
                    lineitem.push(parseFloat(currentLineData.MAXTAGVALUE).toFixed(2));
                    //最大值时间
                    lineitem.push(currentLineData.MAXTAGVALUETIME);
                    //最小值
                    lineitem.push(parseFloat(currentLineData.MINTAGVALUE).toFixed(2));
                    //最小值时间
                    lineitem.push(currentLineData.MINTAGVALUETIME);
                    //平均值
                    lineitem.push(parseFloat(currentLineData.AVETAGVALUE).toFixed(2));
                }
                else {
                    lineitem.push("");//最大值
                    lineitem.push("");//最大值时间
                    lineitem.push("");//最小值
                    lineitem.push("");//最小值时间
                    lineitem.push("");//平均值
                }
                isflag = false;
            });
        }
        datasource.push(lineitem);
    }
    ReportDay.CurrentDataSet = datasource;
    var dataHtml = "";
    for (var i = 0; i < 24; i++) {
        dataHtml += "<ul class='dataUl'>";
        for (var j = 0; j < datasource[i].length; j++) {
            if (datasource[i][j] != "") {
                if (i % 2 == 0) {
                    dataHtml += "<li class='backcolor-even'>" + datasource[i][j] + "</li>";
                }
                else {
                    dataHtml += "<li class='backcolor-odd'>" + datasource[i][j] + "</li>";
                }

            }
            else {
                if (i % 2 == 0) {
                    dataHtml += "<li class='backcolor-even'>&nbsp</li>";
                }
                else {
                    dataHtml += "<li class='backcolor-odd'>&nbsp</li>";
                }
            }

        }
        dataHtml += "</ul>";
    }
    var tableWidth = ReportDay.CurrentTags.length * 450 + 90;
    var dataHtml = "<div id='table_content' class='table_content' style='width:" + tableWidth + "px;height:450px;overflow-x:hidden;'>" + dataHtml + "</div>";
    $("#resultData").html(itemHtml + colNameHtml + dataHtml);

    $(".itemUl").css("width", tableWidth + "px");
    $(".columnUl").css("width", tableWidth + "px");
    $(".dataUl").css("width", tableWidth + "px");
    $(".table_title").css("width", tableWidth + "px");
    $("#table_content").slimScroll({
        width: tableWidth,
        height: 330
    });
}
/*创建预警信息*/
function AlertTable(dataSet) {
    var columns = [];
    var lineitem = [];
    var datasource = [];
    queryData = [];
    ReportDay.CurrentAlertColumns = [];
    columns.push({ "title": "监测项", "width": "40" });
    columns.push({ "title": "报警时间", "width": "40" });
    columns.push({ "title": "报警值", "width": "40" });
    columns.push({ "title": "是否处理", "width": "40" });
    columns.push({ "title": "处理人", "width": "40" });
    columns.push({ "title": "处理时间", "width": "40" });
    $.each(columns, function (i, v) {
        ReportDay.CurrentAlertColumns.push(v.title);
    });
    if (dataSet.length > 0) {
        var jcx = "", dt = "", value = "", isdeal = "", dealname = "", opertime = "";
        $.each(dataSet, function (i, v) {
            var isflag = false;
            $.each(parent.Robin.Data.config, function (ii, vv) {
                if (v.TAG_KEY == vv.TAG_CODE) {
                    jcx = vv.TAG_NAME;
                    isflag = true;
                    return false;
                }
            });
            if (!isflag) {
                jcx = "未知的名称";
            }
            dt = new Date(parseInt(v.SAVE_DATE.substr(6)));
            dt = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
            value = v.TAG_VALUE;
            if (v.ISOPER == "0") {
                isdeal = "未处理";
            }
            else {
                isdeal = "已处理";
            }
            dealname = v.OPERNAME;
            if (!v.OPERTIME) {
                opertime = "";
            }
            else {
                opertime = new Date(parseInt(v.OPERTIME.substr(6)));
                opertime = opertime.getFullYear() + '-' + (opertime.getMonth() + 1) + '-' + opertime.getDate() + ' ' + opertime.getHours() + ':' + opertime.getMinutes() + ':' + opertime.getSeconds();
            }
            //datasource.push(lineitem);
            queryData.push({
                JCX: jcx,
                DT: dt,
                VALUE: value,
                ISDEAL: isdeal,
                DEALNAME: dealname,
                OPERTIME: opertime
            });
        });
    }
    //ReportDay.CurrentAlertDataSet = queryData;    
    if (alertTable != null) {
        alertTable.fnDestroy();
        alertTable = null;
    };
    //初始化表格
    alertTable = $('#alertTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },

        'aaData': queryData,
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,                         //是否支持排序功能    
        'bLengthChange': false,                  //是否允许用户自定义每页显示条数。
        "iDisplayLength": 8,  //每页显示的行数
        'sPaginationType': 'full_numbers',      //分页样式            
        "aoColumns": [
                { "mData": "JCX", "sTitle": "监测项", "sWidth": "15%" },

                { "mData": "DT", "sTitle": "报警时间", "sWidth": "20%" },

                { "mData": "VALUE", "sTitle": "报警值", "sWidth": "15%" },

                { "mData": "ISDEAL", "sTitle": "是否处理", "sWidth": "15%", },

                { "mData": "DEALNAME", "sTitle": "处理人", "sWidth": "15%" },

                { "mData": "OPERTIME", "sTitle": "处理时间", "sWidth": "200%" }
        ]
    });
}
/*查询方法定义*/
function query() {
    var stationKey = $("#StationList").val();
    var time = $("#txtTime").val();
    if (time == '') {
        noty({ text: "时间不能为空！", type: "warning", layout: "topCenter", timeout: 500 });
        return;
    }
    NProgress.start();
    $.getJSON(url + "/iot/dayreport/" + stationKey + "/" + time + "?callback=?", function (data) {
        NProgress.done();
        if (data.status == 500) {
            noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
            return;
        }
        data = data.data;
        CreatTable(data);
        $("#btnExport").removeAttr('disabled').removeAttr('title');
    });
    $.getJSON(url + "/iot/reportalert/general/day/" + stationKey + "/" + time + "?callback=?", function (data) {
        if (data.status == 500) {
            noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 500 });
            return;
        }
        data = data.data;
        AlertTable(data);
    });
}
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};
/*导出*/
function Export() {
    if ($("#resultData").html() == "") {
        alert("没有数据，请先查询");
        return;
    }
    $("#hidData").val(JSON.stringify(ReportDay.CurrentDataSet));
    $("#hidColumn").val(JSON.stringify(ReportDay.CurrentColumns));
    $("#hidAlertData").val(JSON.stringify(queryData));
    $("#hidAlertColumn").val(JSON.stringify(ReportDay.CurrentAlertColumns));
    $("#form1").attr("action", "GeneralReport.ashx?Action=GeneralDayReport&time=" + $("#txtTime").val() + "&name=" + encodeURI($("#StationList :selected").text()) + "&pd=" + pd);
    $("#form1").submit();
}
