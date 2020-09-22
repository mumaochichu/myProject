var alertTable;
var queryData;
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var pd;
/*月报表对象*/
var ReportDay = {
    //数据
    data: [],
    CurrentDataSet: [],
    //目前列
    CurrentColumns: [],
    CurrentAlertDataSert: [],
    CurrentAlertColumns: {}
};

$(function () {  
    //静态select渲染
    $('select').select2();
    //获取数据：
    var data = top.Robin.Data.monitor;
    $("#JCDList").empty();    
    var date = new Date();
    $('#startYear').val(moment(date).format('YYYY-MM-DD') + ' 00');
    $('#endYear').val(moment(date).format('YYYY-MM-DD') + ' 23');
    var ii = 0;
    //绑定监测点列表
    $.each(parent.Robin.Setting.GlobalSetting.MonitorType, function (i, v) {
        if (ii == 0) {
            $('#select2-chosen-1').html(v.name);
            $("#allList").append('<option value="' + v.key + '">' + v.name + '</option>');
            ii++;
        } else {
            $("#allList").append('<option value="' + v.key + '">' + v.name + '</option>');
            ii++;
        }
    });          
    pd = isIE();
    changeJCD($("#allList").val());
    //如果是演示数据的话，就不实时更新
    //var dt = new Date();
    //$("#endYear").val(moment().format('YYYY-MM-DD HH'));
    //$("#startYear").val(moment().format('YYYY-MM-DD 01')); 
    $("#allList").change(function () {
        var cityCode = $("#allList").val();
        changeJCD(cityCode);
    });
    $("#JCDList").change(function () {
        var cityCode = $("#JCDList").val();
        changeJCX(cityCode);
    });

    $("#btnQuery").click(function () {
        var stationkey, tagkey;
              
        stationkey = $("#JCDList").val();
        tagkey = $("#JCXList").val();              
        var sTime = $("#startYear").val();
        var eTime = $("#endYear").val();

        if (!sTime || !eTime) {
            noty({ text: "起止时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        sTime = moment(sTime).format('YYYY-MM-DD HH:MM:SS');
        eTime = moment(eTime).format('YYYY-MM-DD HH:MM:SS');
        var url = restUrl + "/iot/alerts/v1?station_key=" + stationkey + "&tag_key=" + tagkey + "&starttime=" + sTime + "&endtime=" + eTime;
        NProgress.start();
        $.ajax({
            dataType: "JSONP",
            url: url,
            cache: false,
            success: function (result) {
                NProgress.done();
                if (result.status == 500) {
                    noty({ text: result.data, type: "error", layout: "topCenter", timeout: 2000 });
                    //alert(result.data);
                    return;
                }
                var data = result.data;
                CreateAlertTable(data);
                $("#btnExport").removeAttr('disabled').removeAttr('title');
            },
            error: function (msg) {
                NProgress.done();
            }
        });
    });
    /*导出数据到execl*/
    $("#btnExport").click(function (i, v) {
        if (ReportDay.CurrentAlertDataSet.length == 0) {
            noty({ text: "没有数据，请先查询", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        $("#hidData").val(JSON.stringify(ReportDay.CurrentDataSet));

        $("#hidColumn").val(JSON.stringify(ReportDay.CurrentColumns));

        $("#hidAlertData").val(JSON.stringify(ReportDay.CurrentAlertDataSet));

        $("#hidAlertColumn").val(JSON.stringify(ReportDay.CurrentAlertColumns));
        var eTime = moment($("#endYear").val()).format("YYYY-MM-DD");
        var sTime = moment($("#startYear").val()).format("YYYY-MM-DD");
        $("#form1").attr("action", "Handler.ashx?Action=alarmReport&stime=" + sTime + "&etime=" + eTime + "&name=" + encodeURI($("#JCDList :selected").text()) + "&pd=" + pd);
        $("#form1").submit();
    });
    //停止进度条，初始化点击空白处，收缩二级菜单事件
    $(".ui-layout-container").click(function () {
        if (top.$("#user-nav > ul >li").hasClass("open")) {
            top.$("#user-nav > ul >li").removeClass("open");
        }
    });
    start();
});

//页面加载自动查询
function start() {
    var stationkey, tagkey;

    stationkey = $("#JCDList").val();
    tagkey = $("#JCXList").val();
    var sTime = $("#startYear").val();
    var eTime = $("#endYear").val();

    if (!sTime || !eTime) {
        noty({ text: "起止时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    sTime = moment(sTime).format('YYYY-MM-DD HH:MM:SS');
    eTime = moment(eTime).format('YYYY-MM-DD HH:MM:SS');
    var url = restUrl + "/iot/alerts/v1?station_key=" + stationkey + "&tag_key=" + tagkey + "&starttime=" + sTime + "&endtime=" + eTime;
    NProgress.start();
    $.ajax({
        dataType: "JSONP",
        url: url,
        cache: false,
        success: function (result) {
            NProgress.done();
            if (result.status == 500) {
                noty({ text: result.data, type: "error", layout: "topCenter", timeout: 2000 });
                //alert(result.data);
                return;
            }
            var data = result.data;
            CreateAlertTable(data);
            $("#btnExport").removeAttr('disabled').removeAttr('title');
        },
        error: function (msg) {
            NProgress.done();
        }
    });
}
function changeJCD(cityCode) {
    $("#JCDList").empty();
    var ii = 0;
    $.each(top.Robin.Data.monitor, function (i, v) {
        if (v.BMID.substring(6, 12) == cityCode) {
            if (ii == 0) {
                $('#select2-chosen-2').html(v.BMMC);
                $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
                changeJCX(v.BMID);
                ii++;
            } else {
                $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
                ii++;
            }
        }
    });
};
/**
 * @constructor 名称：changeJCX
 * @description 作用：获取检测项
 * @param {string} cityCode 水源站编码
 * @author 作者
 */
function changeJCX(cityCode) {
    $("#JCXList").empty();
    if (cityCode != "null") {
        var url = restUrl + "/iot/configs/v1?stationkey=" + cityCode;        
        $.ajax({
            dataType: "JSONP",
            url: url,
            cache: false,
            success: function (result) {
                if (result.status == 500) {
                    noty({ text: result.data, type: "error", layout: "topCenter", timeout: 2000 });
                    //alert(result.data);
                    return;
                }
                var data = result.data;
                $("#JCXList").append('<option value="' + '' + '">' + '全部' + '</option>');
                $('#select2-chosen-3').html('全部');
                $.each(data, function (i, v) {
                    if (i == 0) {
                        //赋值，默认第一项
                        $.each(top.Robin.Data.config, function (index, value) {
                            if (v.TAG_CODE == value.TAG_CODE) {
                                tagName = value.TAG_NAME;
                                HistorytagKey = value.TAG_KEY;
                                units = value.UNITS;
                                return false;
                            }
                        });
                        $("#JCXList").append('<option value="' + v.TAG_CODE + '">' + v.TAG_DESC + '</option>');
                    } else {
                        $("#JCXList").append('<option value="' + v.TAG_CODE + '">' + v.TAG_DESC + '</option>');//TAG_DESC
                    }
                });
            },
            error: function (msg) {
                noty({ text: "获取监测项列表失败！", type: "error", layout: "topCenter", timeout: 2000 });               
            }
        });
    } else {
        //$("#JCXList").attr("disabled", true);
    }
};

/*创建预警列表*/
function CreateAlertTable(dataset) {
    ReportDay.CurrentAlertColumns = [];
    ReportDay.CurrentAlertDataSet = [];
    var columns = [];
    var lineitem = [];
    var datasource = [];

    columns.push({ "sTitle": "监测项", "sWidth": "40" });
    columns.push({
        "sTitle": "报警时间", "sWidth": "50", "mRender": function (data, type, full) {
            if (data) {
                var dtStart = data;
                var dtStartWrapper = moment(dtStart);
                return dtStartWrapper.format('YYYY-MM-DD HH:mm:ss');

            }
            else {
                return "";
            }
        }
    });
    columns.push({ "sTitle": "报警值", "sWidth": "40" });
    columns.push({ "sTitle": "是否处理", "sWidth": "50" });
    columns.push({ "sTitle": "处理人", "sWidth": "50" });
    columns.push({
        "sTitle": "处理时间", "sWidth": "50", "mRender": function (data, type, full) {
            if (data) {
                var dtStart = data;
                var dtStartWrapper = moment(dtStart);
                return dtStartWrapper.format('YYYY-MM-DD HH:mm:ss');
            }else {
                return "";
            }
        }
    });
    $.each(columns, function (i, v) {
        ReportDay.CurrentAlertColumns.push(v.sTitle);
    });

    var counttag = 0;//监测项名称获取次数
    if (dataset.length > 0) {
        $.each(dataset, function (i, v) {
            lineitem = [];
            lineitem.push(v.ConfigModel.TAG_DESC);
            var dtStart = new Date(parseInt(v.AlertModel.SAVE_DATE.substr(6)));
            dtStart = dtStart.getFullYear() + '-' + PanDuan((dtStart.getMonth() + 1)) + '-' + PanDuan(dtStart.getDate()) + ' ' + PanDuan(dtStart.getHours()) + ':' + PanDuan(dtStart.getMinutes()) + ":" + PanDuan(dtStart.getSeconds());

            lineitem.push(dtStart);

            var tagValue="";
            if (v.AlertModel.STATION_KEY.substring(6, 12) == top.Robin.Setting.GlobalSetting.ManholeCode) {
                if (v.AlertModel.TAG_VALUE == "1") {
                    tagValue = "开启";
                } else if (v.AlertModel.TAG_VALUE == "0") {
                    tagValue = "关闭";
                }
            } else {
                tagValue = v.AlertModel.TAG_VALUE;
            }

            lineitem.push(tagValue);
            if (v.AlertModel.ISOPER == "0")
            {
                lineitem.push("未处理");
            }else{
                lineitem.push("已处理");
            }

            lineitem.push(v.AlertModel.OPERNAME);

            if (!v.AlertModel.OPERTIME) {
                lineitem.push("");
            }else {
                var opertime = new Date(parseInt(v.AlertModel.OPERTIME.substr(6)));
                opertime = opertime.getFullYear() + '-' + PanDuan((opertime.getMonth() + 1)) + '-' + PanDuan(opertime.getDate()) + ' ' + PanDuan(opertime.getHours()) + ':' + PanDuan(opertime.getMinutes()) + ":" + PanDuan(opertime.getSeconds());
                lineitem.push(opertime);
            }
            datasource.push(lineitem);
        });

    }
    else {
    }
    ReportDay.CurrentAlertDataSet = datasource;

    if (alertTable != undefined && alertTable != null) {
        alertTable.fnDestroy();
        $('#alertTable').empty();
    }
    alertTable = $('#alertTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },

        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,                         //是否支持排序功能    
        'bLengthChange': false,                  //是否允许用户自定义每页显示条数。
        "iDisplayLength": 9,  //每页显示的行数
        'sPaginationType': 'full_numbers',      //分页样式            
        "aaData": datasource,
        "aoColumns": columns

        //"scrollX": true,
        //"scrollY": "800px",
        //"scrollCollapse": true,   
    });
}

/*判断是一位拼成两位*/
function PanDuan(a) {
    var b;
    if (a.toString().length == 1)
        b = '0' + a
    else
        b = a
    return b;
};

/*选择监测点类型*/
function selectType(type) {
    var flag = false;
    var currentSatationList;
    $("#JCDList").empty();

    $.each(ReportDay.data, function (i, v) {
        if (v.id == type) {
            flag = true;
            //绑定站点列表

            $.each(v.stationData, function (i, v) {

                if (i == 0) {
                    //赋值，默认第一项
                    $('#select2-chosen-1').html(v.BMMC);
                    $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
                } else {
                    $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
                }
            });
            return false;
        }
    });

    if (!flag) {
        var j = 0;
        $.each(top.Robin.Data.monitor, function (i, v) {

            if (j == 0) {
                //赋值，默认第一项

                $('#select2-chosen-1').html(v.BMMC);
                $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
            } else {
                $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
            }
            j++;
        });
        ReportDay.data.push({ id: type, stationData: top.Robin.Data.monitor });
    }
}
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};
