var oTable;
var zNodes = [];
var type = "";
var name = "";
var treeObj;
var url = parent.Robin.Setting.GlobalSetting.RestAPIService;
var pd;
/*创建日报对象*/
var Report = {
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

$(function () {
    $('#ReportType').val('day');
    //layout布局确定
    $('body').layout({
        applyDemoStyles: true,
        north__closable: false,
        togglerTip_open: "关闭",//pane打开时，当鼠标移动到边框上按钮上，显示的提示语
        togglerTip_closed: "打开",//pane关闭时，当鼠标移动到边框上按钮上，显示的提示语
        togglerLength_open: 35,//pane打开时，边框按钮的长度
        togglerLength_closed: 35,//pane关闭时，边框按钮的长度
        togglerContent_open: " <div style='background:rgb(221, 221, 221)'><img src='../../../images/wateruser/plugin/mini-left.gif' /></div>",//pane打开时，边框按钮中需要显示的内容
        togglerContent_closed: "<div style='background:rgb(221, 221, 221)'><img src='../../../images/wateruser/plugin/mini-right.gif' /></div>",//pane关闭时，边框按钮中需要显示的内容
    });
    $.each(top.tmodel.monitorData(), function (ii, vv) {               
        Report.CurrentTags.push(vv);
    });
    //查询按钮点击事件
    $("#btnQuery").click(function () {
        var result = [];
        var value = $("#ReportType").val();
        switch (value) {
            case "day":
                var time = $("#txtDayTime").val();
                var num = 0;
                if (time == "") {
                    noty({ text: "时间不能为空", type: "warning", layout: "topCenter", timeout: 5000 });
                    return;
                }
                NProgress.start();
                $.each(parent.Robin.Data.monitor, function (i, v) {
                    $.getJSON(url + "/iot/dayreport/" + v.BMID + "/" + time + "?callback=?", function (data) {
                        if (data.status == 500) {
                            noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                            NProgress.done();
                            return;
                        }                       
                        result = result.concat(data.data);
                        if (num == (parent.Robin.Data.monitor.length - 1)) {
                            CreatDayTable(result);
                        }
                        num++;
                        $("#btnExport").removeAttr('disabled').removeAttr('title');
                    });
                });
                break;                       
            case "month":
                var time = $("#txtMonthTime").val();
                var num = 0;
                if (time == "") {
                    noty({ text: "时间不能为空", type: "warning", layout: "topCenter", timeout: 5000 });                   
                    return;
                }
                NProgress.start();
                $.each(parent.Robin.Data.monitor, function (i, v) {
                    $.getJSON(url + "/iot/report/general/month/" + v.BMID + "/" + time + "?callback=?", function (data) {
                        if (data.status == 500) {
                            noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                            NProgress.done();
                            return;
                        }
                        result = result.concat(data.data);
                        if (num == (parent.Robin.Data.monitor.length - 1)) {
                            CreatMonthTable(result);
                        }
                        num++;
                        $("#btnExport").removeAttr('disabled').removeAttr('title');
                    });
                });
                break;
            case "year":
                var time = $("#txtYearTime").val();
                var num = 0;
                if (time == "") {
                    noty({ text: "时间不能为空", type: "warning", layout: "topCenter", timeout: 5000 });
                    return;
                }
                time = time + "-01";
                NProgress.start();
                $.each(parent.Robin.Data.monitor, function (i, v) {
                    var test = url + "/iot/report/general/year/" + v.BMID + "/" + time + "?callback=?";
                    $.getJSON(url + "/iot/report/general/year/" + v.BMID + "/" + time + "?callback=?", function (data) {
                        if (data.status == 500) {
                            noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                            NProgress.done();
                            return;
                        }
                        result = result.concat(data.data);
                        if (num == (parent.Robin.Data.monitor.length - 1)) {
                            CreatYearTable(result);
                        }
                        num++;
                        $("#btnExport").removeAttr('disabled').removeAttr('title');
                    });
                });
                break;
        }
    });

    //类型修改事件
    $("#ReportType").change(function () {
        var value = $("#ReportType").val();
        switch (value) {
            case "day":
                $("#txtDayTime").show();
                $("#txtMonthTime").hide();
                $("#txtYearTime").hide();
                break;
            case "month":
                $("#txtDayTime").hide();
                $("#txtMonthTime").show();
                $("#txtYearTime").hide();
                break;
            case "year":
                $("#txtDayTime").hide();
                $("#txtMonthTime").hide();
                $("#txtYearTime").show();
                break;
        }
    });

    //导出
    $("#btnExport").click(function (i, v) {
        Export();
    });
    pd = isIE();
});
//树的点击事件
//function zTreeOnClick(event, treeId, treeNode) {
//    ////alert(treeNode.level);
//    if (treeNode.level == 0) {
//        $("#txtName").val("");
//        name = "";
//        type = "";
//        if (oTable != undefined && oTable != null) {
//            refresh();
//        }
//    }
//    if (treeNode.level == 1) {
//        $("#txtName").val("");
//        name = treeNode.id;
//        type = "YYS";
//        if (oTable != undefined && oTable != null) {
//            refresh();
//        }
//    }
//    if (treeNode.level == 2) {
//        $("#txtName").val("");
//        name = treeNode.id;
//        type = "YSH";
//        if (oTable != undefined && oTable != null) {
//            refresh();
//        }
//    }
//}
//创建日报表
function CreatDayTable(dataSet) {
    var datasource = [];
    var columns = [];
    var lineitem = [];
    Report.CurrentColumns = [];
    var itemHtml = "";
    var colNameHtml = "";
    itemHtml += "<ul class='itemUl'><li>&nbsp</li>";
    colNameHtml += "<ul  class='columnUl'><li>时间</li>";
    Report.CurrentColumns.push("时间");
    $.each(Report.CurrentTags, function (i, v) {
        itemHtml += "<li class='itemList'>" + v.StationName() + v.TagName() + "</li>";
        colNameHtml += "<li class='left-border'>最大值(" + v.Units() + ")</li><li>时间</li><li>最小值(" + v.Units() + ")</li><li>时间</li><li>平均值(" + v.Units() + ")</li><li>总值(" + v.Units() + ")</li>";
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "最大值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "时间");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "最小值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "时间");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "平均值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "总值");
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
            for (var j = 0; j < Report.CurrentTags.length; j++) {
                lineitem.push("");//最大值
                lineitem.push("");//最大值时间
                lineitem.push("");//最小值
                lineitem.push("");//最小值时间
                lineitem.push("");//平均值
                lineitem.push("");//总值
            }
        }
        else {
            var isflag = false;
            var currentLineData = [];
            //检测项目类别
            $.each(Report.CurrentTags, function (i, v) {
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
                    //总值
                    lineitem.push(parseFloat(currentLineData.SUMVALUE).toFixed(2));
                }
                else {
                    lineitem.push("");//最大值
                    lineitem.push("");//最大值时间
                    lineitem.push("");//最小值
                    lineitem.push("");//最小值时间
                    lineitem.push("");//平均值
                    lineitem.push("");//总值
                }
                isflag = false;
            });
        }
        datasource.push(lineitem);
    }
    Report.CurrentDataSet = datasource;
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
    var tableWidth = Report.CurrentTags.length * 552 + 92;
    var dataHtml = "<div id='table_content' class='table_content' style='width:" + tableWidth + "px;height:450px;overflow-x:hidden;'>" + dataHtml + "</div>";
    $("#resultData").html(itemHtml + colNameHtml + dataHtml);

    $(".itemUl").css("width", tableWidth + "px");
    $(".columnUl").css("width", tableWidth + "px");
    $(".dataUl").css("width", tableWidth + "px");
    $(".table_title").css("width", tableWidth + "px");
    $("#table_content").slimScroll({
        width: tableWidth,
        height: $("#uleft").height() - $("#form1").height() - 85
    });
    NProgress.done();
}
//创建月报表
function CreatMonthTable(dataSet) {
    var time = $("#txtMonthTime").val();
    var dayCount = new Date(time.split("-")[0], time.split("-")[1], 0).getDate();
    var datasource = [];
    var columns = [];
    var lineitem = [];
    Report.CurrentColumns = [];
    var itemHtml = "";
    var colNameHtml = "";
    itemHtml += "<ul class='itemUl'><li>&nbsp</li>";
    colNameHtml += "<ul  class='columnUl'><li>时间</li>";
    Report.CurrentColumns.push("时间");
    $.each(Report.CurrentTags, function (i, v) {
        itemHtml += "<li class='itemList'>" + v.StationName() + v.TagName() + "</li>";
        colNameHtml += "<li class='left-border'>最大值(" + v.Units() + ")</li><li>时间</li><li>最小值(" + v.Units() + ")</li><li>时间</li><li>平均值(" + v.Units() + ")</li><li>总值(" + v.Units() + ")</li>";
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "最大值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "时间");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "最小值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "时间");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "平均值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "总值");
    });
    itemHtml += "</ul></div>";
    colNameHtml += "</ul></div>";
    /*构造table*/
    for (var i = 1; i <= dayCount; i++) {
        //某一点的所有检测项数据
        var databytime = [];
        lineitem = [];
        if (i < 10) {
            var time = "0" + i.toString();
        }
        else {
            var time = i;
        }
        lineitem.push(time);
        //获取这个点的所有检测项数据
        $.each(dataSet, function (ii, vv) {
            if (vv.Time == time + "号") {
                databytime.push(vv);
            }
        });
        if (databytime.length == 0) {
            for (var j = 0; j < Report.CurrentTags.length; j++) {
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
            }
        }
        else {
            var isflag = false;
            var currentLineData;
            //检测项目类别
            $.each(Report.CurrentTags, function (i, v) {
                $.each(databytime, function (ii, vv) {
                    if (v.TagCode() == vv.TagKey) {
                        isflag = true;
                        currentLineData = vv;
                        return false;
                    }
                });
                if (isflag) {
                    lineitem.push(currentLineData.MaxValue);
                    lineitem.push(currentLineData.MaxTime);
                    lineitem.push(currentLineData.MinValue);
                    lineitem.push(currentLineData.MinTime);
                    lineitem.push(currentLineData.AverageValue);
                    lineitem.push(currentLineData.SumValue);
                }
                else {
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                }
                isflag = false;
            });
        }
        datasource.push(lineitem);
    }
    Report.CurrentDataSet = datasource;
    var dataHtml = "";
    for (var i = 0; i < dayCount; i++) {
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
    var tableWidth = Report.CurrentTags.length * 552 + 92;
    var dataHtml = "<div id='table_content' class='table_content' style='width:" + tableWidth + "px;height:450px;overflow-x:hidden;'>" + dataHtml + "</div>";
    $("#resultData").html(itemHtml + colNameHtml + dataHtml);

    $(".itemUl").css("width", tableWidth + "px");
    $(".columnUl").css("width", tableWidth + "px");
    $(".dataUl").css("width", tableWidth + "px");
    $(".table_title").css("width", tableWidth + "px");
    $("#table_content").slimScroll({
        width: tableWidth,
        height: $("#uleft").height() - $("#form1").height() - 85
    });
    NProgress.done();
}
//创建年报表
function CreatYearTable(dataSet) {
    var time = $("#txtMonthTime").val();
    var dayCount = new Date(time.split("-")[0], time.split("-")[1], 0).getDate();
    var datasource = [];
    var columns = [];
    var lineitem = [];
    Report.CurrentColumns = [];
    var itemHtml = "";
    var colNameHtml = "";
    itemHtml += "<ul class='itemUl'><li>&nbsp</li>";
    colNameHtml += "<ul  class='columnUl'><li>时间</li>";
    Report.CurrentColumns.push("时间");
    $.each(Report.CurrentTags, function (i, v) {
        itemHtml += "<li class='itemList'>" + v.StationName() + v.TagName() + "</li>";
        colNameHtml += "<li class='left-border'>最大值(" + v.Units() + ")</li><li>时间</li><li>最小值(" + v.Units() + ")</li><li>时间</li><li>平均值(" + v.Units() + ")</li><li>总值(" + v.Units() + ")</li>";
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "最大值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "时间");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "最小值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "时间");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "平均值");
        Report.CurrentColumns.push(v.StationName() + v.TagName() + "总值");
    });
    itemHtml += "</ul></div>";
    colNameHtml += "</ul></div>";
    /*构造table*/
    for (var i = 1; i <= 12; i++) {
        //某一点的所有检测项数据
        lineitem = [];
        var monthbytime = [];
        if (i < 10) {
            var time = "0" + i.toString();
        }
        else {
            var time = i;
        }
        lineitem.push(time);
        //获取这个点的所有检测项数据
        $.each(dataSet, function (ii, vv) {
            if (vv.Time == time) {
                monthbytime.push(vv);
            }
        });
        if (monthbytime.length == 0) {
            for (var j = 0; j < Report.CurrentTags.length; j++) {
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
                lineitem.push("");
            }
        }
        else {
            var isflag = false;
            var currentLineData;
            //检测项目类别
            $.each(Report.CurrentTags, function (i, v) {
                $.each(monthbytime, function (ii, vv) {
                    if (v.TagCode() == vv.TagKey) {
                        isflag = true;
                        currentLineData = vv;
                        return false;
                    }
                });
                if (isflag) {
                    lineitem.push(currentLineData.MaxValue);
                    lineitem.push(currentLineData.MaxTime);
                    lineitem.push(currentLineData.MinValue);
                    lineitem.push(currentLineData.MinTime);
                    lineitem.push(currentLineData.AverageValue);
                    lineitem.push(currentLineData.SumValue);
                }
                else {
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                    lineitem.push("");
                }
                isflag = false;
            });
        }
        datasource.push(lineitem);
    }
    Report.CurrentDataSet = datasource;
    var dataHtml = "";
    for (var i = 0; i < 12; i++) {
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
    var tableWidth = Report.CurrentTags.length * 552 + 92;
    var dataHtml = "<div id='table_content' class='table_content' style='width:" + tableWidth + "px;height:450px;overflow-x:hidden;'>" + dataHtml + "</div>";
    $("#resultData").html(itemHtml + colNameHtml + dataHtml);

    $(".itemUl").css("width", tableWidth + "px");
    $(".columnUl").css("width", tableWidth + "px");
    $(".dataUl").css("width", tableWidth + "px");
    $(".table_title").css("width", tableWidth + "px");
    $("#table_content").slimScroll({
        width: tableWidth,
        height: $("#uleft").height() - $("#form1").height() - 85
    });
    NProgress.done();
}

function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};
/*导出*/
function Export() {
    var type = $("#ReportType").val();
    var time = "";
    switch (type) {
        case "day":
            time = $("#txtDayTime").val();
            break;
        case "month":
            time = $("#txtMonthTime").val();
            break;
        case "year":
            time = $("#txtYearTime").val();
            break;
    }
    if ($("#resultData").html() == "") {
        alert("没有数据，请先查询");
        return;
    }
    $("#hidData").val(JSON.stringify(Report.CurrentDataSet));
    $("#hidColumn").val(JSON.stringify(Report.CurrentColumns));
    $("#form1").attr("action", "GeneralReport.ashx?Action=GeneralallReport&time=" + time + "&name=" + encodeURI($("#ReportType :selected").text()) + "&pd=" + pd + "&type=" + type);
    $("#form1").submit();
}