var oTable, queryData, units;
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var pd;
$(function () {
    $("#btnExcel").attr("disabled", true);

    $('select').select2();

    var data = top.Robin.Data.monitor;
    $("#JCDList").empty();
    var ii = 0; 
    //绑定监测点列表
    $.each(parent.Robin.Setting.GlobalSetting.MonitorType, function (i, v) {
       $("#allList").append('<option value="' + v.key + '">' + v.name + '</option>');
    });
    changeJCD($("#allList").val());
    //调试  
    $("#allList").change(function () {
        var cityCode = $("#allList").val();
        changeJCD(cityCode);
    });
    $("#JCDList").change(function () {
        var cityCode = $("#JCDList").val();
        changeJCX(cityCode);
    });

    $("#JCXList").change(function () {
        var tagKey = $("#JCXList").val();
        $.each(top.Robin.Data.config, function (index, value) {
            if (tagKey == value.TAG_CODE) {
                tagName = value.TAG_NAME;
                units = value.UNITS;
                return false;
            }
        });
    });
    $("#btnQuery").click(function () {
        query();
    });
    pd = isIE();
    /**
    * 导出Excel
    */
    $("#btnExcel").click(function () {
        if (queryData != undefined && queryData.length > 0) {
            try {
                var stationKey = $("#JCDList").find('option:selected').text();//监测项
                var tagKey = $("#JCXList").find('option:selected').text();//监测点
                var sTime = $("#startYear").val();
                var eTime = $("#endYear").val();
                sTime = moment(sTime).format("YYYY-MM-DD");
                eTime = moment(eTime).format("YYYY-MM-DD");
                var temp = JSON.stringify(queryData);
                $("#hidData").val(temp);
                $("#tagKey").val(tagKey); $("#sTime").val(sTime); $("#eTime").val(eTime);
                //$("#form1").attr("action", "History.ashx?Action=ExportHistory&stationKey=" + stationKey + "&TagKey=" + tagKey + "&StartDate=" + sTime + "&EndDate=" + eTime);
                $("#form1").attr("action", "History.ashx?Action=ExportHistory&stationKey=" + stationKey + "&pd=" + pd);
                $("#form1").submit();
            }
            catch (e) {
                alert(e.message + "请重新选择查询条件")
            }
            
        } else {
            noty({ text: "请先查询数据", type: "warning", layout: "topCenter", timeout: 2000 });
        }
    });

});
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};
function changeJCD(cityCode) {
    $("#JCDList").empty();
    if (cityCode == 0) {
        $("#JCDList").append('<option value="0">全部</option>');
        $("#JCDList").val(0).select2();
        changeJCX(0);
    } else {
        $("#JCDList").append('<option value="0">全部</option>');
        $("#JCDList").val(0).select2();
        changeJCX(0);
        $.each(top.Robin.Data.monitor, function (i, v) {
            if (v.BMID.substring(6, 12) == cityCode) {
                $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
            }                         
        });
    }
};
/**
 * @constructor 名称：changeJCX
 * @description 作用：获取检测项
 * @param {string} cityCode 水源站编码
 * @author 作者
 */
function changeJCX(cityCode) {
    $("#JCXList").empty();
    if (cityCode == 0) {
        $("#JCXList").append('<option value="0">全部</option>');
        $("#JCXList").val(0).select2();
    } else {
        $("#JCXList").append('<option value="' + 0 + '">全部</option>');
        $("#JCXList").val(0).select2();
        var url = restUrl + "/iot/configs/v1?stationkey=" + cityCode;
        $.ajax({
            dataType: "JSONP",
            url: url,
            cache: false,
            success: function (result) {

                if (result.status == 500) {
                    alert(result.data);
                    return;
                }

                var data = result.data;
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
                alert("获取监测项列表失败!");
            }
        });
    }
};

/**
 * @constructor 名称：query
 * @description 作用：查询历史数据
 * @author 作者
 */
function query() {
    var type = $("#allList").val();
    var STATION_KEY = $("#JCDList").val();
    var TAG_KEY = $("#JCXList").val();

    var sTime = $("#startYear").val();
    var eTime = $("#endYear").val();
    if (!sTime || !eTime) {
        noty({ text: "起止时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    eTime = moment(eTime).format('YYYY-MM-DD HH:MM:SS');
    sTime = moment(sTime).format('YYYY-MM-DD HH:MM:SS');
    if (type == 0) {
        var result = [];
        var jcdtype = [];
        $.each(parent.Robin.Setting.GlobalSetting.MonitorType, function (i, v) {
            $.each(top.Robin.Data.monitor, function (ii, vv) {
                if (vv.BMID.substring(6, 12) == v.key) {
                    jcdtype.push(vv);
                }
            });
        });     
        $.each(jcdtype, function (ii, vv) {
            var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + vv.BMID;
            NProgress.start();
            //查询数据
            $.ajax({
                dataType: "JSONP",
                url: queryUrl,
                cache: false,              
                success: function (data) {             
                    if (ii == (jcdtype.length - 1)) {
                        NProgress.done();
                    }
                    if (data.status == 500) {
                        alert(data.data);
                        return;
                    }
                    $("#btnExcel").attr("disabled", false);
                    $("#btnExcel").removeAttr('disabled').removeAttr('title');
                    result = result.concat(data.data);
                    if (ii == (jcdtype.length - 1)) {
                        noty({ text: "数据查询完成，可以进行导出", type: "success", layout: "topCenter", timeout: 2000 });
                        bindData(result);
                    }
                },
                error: function (msg) {
                    NProgress.done();
                    alert('错误', '获取历史数据失败');
                }
            });
        });
    } else if (STATION_KEY == 0) {
        var result = [];
        var jcdtype = [];
        $.each(top.Robin.Data.monitor, function (i, v) {
            if (v.BMID.substring(6, 12) == type) {
                jcdtype.push(v);
            }
        });
        $.each(jcdtype, function (ii, vv) {
            var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + vv.BMID;
            NProgress.start();
            //查询数据
            $.ajax({
                dataType: "JSONP",
                url: queryUrl,
                cache: false,
                success: function (data) {
                    if (ii == (jcdtype.length - 1)) {
                        NProgress.done();
                    }
                    if (data.status == 500) {
                        alert(data.data);
                        return;
                    }
                    $("#btnExcel").attr("disabled", false);
                    $("#btnExcel").removeAttr('disabled').removeAttr('title');
                    result = result.concat(data.data);
                    if (ii == (jcdtype.length - 1)) {                       
                        bindData(result);
                    }
                },
                error: function (msg) {
                    NProgress.done();
                    alert('错误', '获取历史数据失败');
                }
            });
        });      
    } else if (TAG_KEY == 0) {
        var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + STATION_KEY;
            NProgress.start();
            //查询数据
            $.ajax({
                dataType: "JSONP",
                url: queryUrl,
                cache: false,
                success: function (data) {
                    NProgress.done();
                    if (data.status == 500) {
                        alert(data.data);
                        return;
                    }
                    $("#btnExcel").attr("disabled", false);
                    $("#btnExcel").removeAttr('disabled').removeAttr('title');                  
                    bindData(data.data);
                },
                error: function (msg) {
                    NProgress.done();
                    alert('错误', '获取历史数据失败');
                }
            });
    } else {
        var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + STATION_KEY + "&tagkey=" + TAG_KEY;
        NProgress.start();
        //查询数据
        $.ajax({
            dataType: "JSONP",
            url: queryUrl,
            cache: false,
            success: function (data) {
                NProgress.done();
                if (data.status == 500) {
                    alert(data.data);
                    return;
                }
                $("#btnExcel").attr("disabled", false);
                $("#btnExcel").removeAttr('disabled').removeAttr('title');              
                bindData(data.data);
            },
            error: function (msg) {
                NProgress.done();
                alert('错误', '获取历史数据失败');
            }
        });
    }
};

/**
 * @constructor 名称：bindData
 * @description 作用：绑定数据显示在表格上
 * @author codingman
 */
function bindData(data) {
    queryData = [];
    var bmmc = "", HistorytagKey = "", tagName = "", units = "", isFind = false;
    $.each(data, function (i, v) {
        //获取监测项名称 单位等信息
        $.each(top.Robin.Data.monitor, function (index, value) {
            if (v.STATION_KEY == value.BMID) {
                bmmc = value.BMMC;
                isFind = true;
                return false;
            }
        });
        $.each(top.Robin.Data.config, function (index, value) {
            if (v.TAG_KEY == value.TAG_CODE) {
                tagName = value.TAG_DESC;
                HistorytagKey = value.TAG_KEY;
                units = value.UNITS;
                return false;
            }
        });
        queryData.push({          
            BMMC: bmmc,
            SAVE_DATE: top.Robin.Utils.ToDate(v.SAVE_DATE),
            TAG_NAME: tagName,
            TAG_VALUE: v.TAG_VALUE,//需要判断工频和变频的值
            UNITS: (units != null) ? units : "无"
        });
    });
    if (queryData.length == 0) {
        noty({ text: "该时间段没有数据,请重新统计数据", type: "warning", layout: "topCenter", timeout: 2000 });
    } else {
        noty({ text: "统计数据成功,可以进行数据导出", type: "success", layout: "topCenter", timeout: 2000 });
    }
};
