var oTable, queryData, units;
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var pd;
var jcdtype = [];
$(function () {
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
    pd = isIE();
    /**
    * 导出Excel
    */
    $("#btnExcel").click(function () {
        var sTime = $("#startYear").val();
        var eTime = $("#endYear").val();
        sTime = moment(sTime).format('YYYY-MM-DD HH:MM:SS');
        eTime = moment(eTime).format('YYYY-MM-DD HH:MM:SS');
        var newsTime = moment(sTime).format('YYYY-MM-DD HH');
        var time = moment(eTime).subtract(1, "days").format("YYYY-MM-DD HH");
        if (sTime > eTime) {
            noty({ text: "结束日期超过开始日期，请重新选择时间", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        if (time > newsTime) {
            noty({ text: "时间范围超过一天，请查询一天内的数据", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        confirm("<div class='notyContent'>数据量过多时导出时间很长，确定要导出吗</div>",
             "information", function () {
                 var type = $("#allList").find('option:selected').val();
                 var stationKey = $("#JCDList").find('option:selected').val();//监测项
                 var tagKey = $("#JCXList").find('option:selected').val();//监测点                
                 var temp = JSON.stringify(queryData);
                 var monitor = JSON.stringify(top.Robin.Data.monitor);
                 var config = JSON.stringify(top.Robin.Data.config);
                 var monitortype = JSON.stringify(parent.Robin.Setting.GlobalSetting.MonitorType);
                 $("#monitortype").val(monitortype);
                 $("#tagKey").val(tagKey); $("#sTime").val(sTime); $("#eTime").val(eTime); $("#monitor").val(monitor); $("#config").val(config);
                 //$("#form1").attr("action", "History.ashx?Action=ExportHistory&stationKey=" + stationKey + "&TagKey=" + tagKey + "&StartDate=" + sTime + "&EndDate=" + eTime);
                 $("#form1").attr("action", "allHistory.ashx?Action=ExportHistory&stationKey=" + stationKey + "&pd=" + pd + "&restUrl=" + restUrl + "&type=" + type);
                 $("#form1").submit();
             }, null,
         '确定', '取消');      
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
}