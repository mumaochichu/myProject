var loc = window.location.href;
var Id = getParam('StationKey');
var StationName = getParam('Name');//监测点的名称
var type = 'jyz';
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var queryData;
var StationKey = Id;//监测点的编号
StationName = decodeURIComponent(StationName);
var WebUrl = getParam('WebUrl');
/*程序的入口*/
$(function () {
    var monitorTypeCode = '030202';

    $("#show").attr("src", WebUrl + "?Id=" + Id);

    $("#configDiv").slimScroll({ height: '475px' });

    GetInfo(Id);
    //查询数据
    query();
    //  videExist(monitorTypeCode, Id);//判断视频有无

    //$("#videoDataList").slimScroll({ height: 475 });

    //$("#videoTab").click(function () {
    //    GetVideoList(monitorTypeCode, Id);
    //});
    var width = $("#myTab").width();
    var height = $("body").height() - $("#myTab").height();
    $("#show").attr("width", width);
    $("#show").attr("height", height);
    $(window).resize(function () {
        width = $("#myTab").width();
        height = $("body").height() - $("#myTab").height();
        $("#show").attr("width", width);
        $("#show").attr("height", height);
    });
});
//根据参数获取传递值
function getParam(paramName) {
    paramValue = "";
    isFound = false;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&");
        i = 0;
        while (i < arrSource.length && !isFound) {
            if (arrSource[i].indexOf("=") > 0) {
                if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
};
/*查询曲线数据*/


function query() {

    var sTime = moment().add('hours', -12).format('YYYY-MM-DD HH:mm:ss');
    var eTime = moment().format('YYYY-MM-DD HH:mm:ss');

    $.each(top.Robin.Data.config, function (ii, vv) {
        if (vv.STATION_KEY == Id) {
            if (vv.TAG_KEY != "030202_001" && vv.TAG_KEY != "030202_002" && vv.TAG_KEY != "030202_007" && vv.TAG_KEY != "030202_006") {
                var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + Id + "&tagkey=" + vv.TAG_CODE;

                $.ajax({
                    dataType: "JSONP",
                    url: queryUrl,
                    cache: false,
                    success: function (data) {
                        if (data.status == 500) {
                            // alert(data.data);
                            return;
                        }
                        normalPointChart(data.data, vv);
                    },
                    error: function (msg) {
                        alert("请求出错！");
                    }
                });
            }
        }
    });
};

/*绑定普通的chart*/

var normalPointChart = function (data, config) {

    Highcharts.setOptions({

        global: {
            useUTC: false
        }
    });
    var charTem = "";
    charTem = '<div id="charts' + config.TAG_CODE + '" style="width:1000px;height:300px"></div>'
    $("#configDiv").append(charTem);
    var myChart = echarts.init(document.getElementById('charts' + config.TAG_CODE));
    option = {
        title: {
            text: config.TAG_DESC + "实时曲线",
            x: 'center',
            padding:[10,0,0,0]
        },
        //legend: {
        //    data: [config.TAG_DESC],
        //    x: 'center',
        //    bottom: '0px',
        //},
        grid: {
            left: 80,
            right: 20,
            top:50,
        },
        toolbox: {
            feature: {
                dataZoom: {},
                restore: {},
                saveAsImage: {}
            },
            right:15,
        },
        //dataZoom: [
        //{
        //    type: 'inside',
        //    xAxisIndex: [0],
        //    zoomOnMouseWheel: false,
        //},
        //{
        //    type: 'inside',
        //    yAxisIndex: [0],
        //    zoomOnMouseWheel: false,
        //}
        //],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter: function (params) {
                var date = new Date(params[0].data[0]);
                var marker = params[0].marker;
                var time = moment(date).format('MM月DD日 HH:mm:ss');
                var name = params[0].seriesName;
                var value = params[0].data[1];
                return time + '<br/><b>' + marker + name + ":" + value + '</b>';
            },
        },
        xAxis: {
            type: 'time',
        },
        yAxis: {
            type: 'value',          
            axisLabel: {             
                formatter: function (params) {                   
                    var value = params.toString();
                    var newParamsName = "";
                    var paramsNameNumber = value.length;
                    var provideNumber = 6;
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                    if (paramsNameNumber > provideNumber) {
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = "";
                            var start = p * provideNumber;
                            var end = start + provideNumber;
                            if (p == rowNumber - 1) {
                                tempStr = value.substring(start, paramsNameNumber);
                            } else {
                                tempStr = value.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;
                        }

                    } else {
                        newParamsName = params;
                    }
                    return newParamsName + config.UNITS;
                },
                margin: 15,             
            },
            scale: true,           
        },
        series: [{
            name: config.TAG_DESC,
            type: 'line',
            symbol:'circle',
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: '#89A54E',
                    lineStyle: {
                        color: '#89A54E'
                    }
                }
            },
        }]
    };
    myChart.setOption(option);
    var seriesData = [];
    $.each(data, function (i, v) {
        var dtDate = new Date(parseInt(v.SAVE_DATE.substr(6)));
        seriesData.push([dtDate.getTime(), parseFloat(v.TAG_VALUE.toFixed(3))]);
    });
    myChart.setOption({
        series: [{
            data: seriesData
        }]
    });
    //实时更新数据
    setInterval(function () {
        var chart = echarts.getInstanceByDom(document.getElementById('charts' + config.TAG_CODE));
        if (chart == undefined) {
            return;
        }
        //获取chart中的数据
        var series = chart.getOption().series[0];
        var data = series.data;
        var yldata = data[series.data.length - 1];
        //获取更新数据
        $.each(top.tmodel.monitorData(), function (i, v) {
            if (v.TagCode() == config.TAG_CODE) {
                //判断时间
                if (v.SaveTime() != null && v.SaveTime().length > 0) {
                    var dtStart = new Date(v.SaveTime());
                    dtStart = dtStart.getTime();
                    if (dtStart > parseInt(yldata[0])) {
                        //更新
                        data.push([dtStart, parseFloat(v.TagValue())]);
                        chart.setOption({
                            series: [{
                                data: data
                            }]
                        });
                    }
                }
            }
        });
    }, 30 * 1000);
};

/*获取后台的加压站信息数据*/
function GetInfo(Id) {
    $.ajax({
        type: "GET",
        url: "InfoHandler.ashx?Action=List&Id=" + Id + "&Type=" + type,
        data: "json",
        success: function (result) {
            var data = JSON.parse(result);
            $.each(data, function (i, d) {
                $("#txt_BFMC").html(d.BFMC);
                $("#txt_XZQ").html(d.XZQ);
                $("#txt_LXR").html(d.LXR);
                $("#txt_GSCC").html(d.GSCC);
                $("#txt_Address").html(d.BFADDRESS);
                $("#txt_GSRK").html(d.GSRK);
                $("#txt_LXDH").html(d.LXDH);
                var datetime = d.JGSJ;
                if (datetime != null) {
                    datetime = datetime.substring(0, datetime.lastIndexOf('T'));
                } else {
                    $("#jgsj").html(datetime);
                }

                $("#txt_Unit").html(d.UNIT);
                $("#txt_GSFW").html(d.GSFW);
                //新增
                $("#CSYL").html(d.CSYL);
                $("#QSCRL").html(d.QSCRL);
                $("#WYSJSL").html(d.WYSJSL);
                $("#SGSL").html(d.SGSL);
                $("#ZDRGSL").html(d.ZDRGSL);
                $("#SJRGSL").html(d.SJRGSL);
                $("#CSGC").html(d.CSGC);
            });
        },
        error: function (error) {
            // alert(error);
        }
    });
}
/**      
 * 对Date的扩展，将 Date 转化为指定格式的String      
  
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
