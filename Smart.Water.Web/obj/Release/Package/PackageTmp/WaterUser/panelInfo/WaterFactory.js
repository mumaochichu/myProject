
var Id = getParam('StationKey');//监测点编码
var StationName = getParam('Name');//监测点的名称
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
//判断什么模式
var demo = parent.Robin.Setting.GlobalSetting.demo;
/*程序的入口*/
$(function () {
    $("#configDiv").slimScroll({ height: '400px' });
    if (demo == 0) {
        //演示模式
        //获取关联的监测点的用水户信息
        getYSHinfor(Id);
        //运行曲线点击事件
        democode();
       
    } else {
        //获取关联的监测点的用水户信息
        getYSHinfor(Id);
        //运行曲线点击事件
        query();
    }
});

/*查询曲线数据*/
function query() {
    var sTime = moment().add('hours', -12).format('YYYY-MM-DD HH:mm:ss');
    var eTime = moment().format('YYYY-MM-DD HH:mm:ss');

    $.each(top.Robin.Data.config, function (ii, vv) {
        if (vv.STATION_KEY == Id) {
            var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + Id + "&tagkey=" + vv.TAG_CODE;
            $.ajax({
                dataType: "JSONP",
                url: queryUrl,
                cache: false,
                success: function (data) {
                    if (data.status == 500) {
                        return;
                    }
                    normalPointChart(data.data, vv);
                },
                error: function (msg) {
                    alert("请求出错！");
                }
            });
        }
    });
};
/*绑定普通的chart*/
var normalPointChart = function (data, config) {
    var charTem = "";
    charTem = '<div id="charts' + config.TAG_CODE + '" style="width:1000px;height:300px"></div>'
    $("#configDiv").append(charTem);
    var myChart = echarts.init(document.getElementById('charts' + config.TAG_CODE));
    option = {
        title: {
            text: config.TAG_DESC + "实时曲线",
            x: 'center',
            padding: [10, 0, 0, 0]
        },
        //legend: {
        //    data: [config.TAG_DESC],
        //    x: 'center',
        //    bottom: '0px',
        //},
        grid: {
            left: 80,
            right: 20,
            top: 50,
        },
        toolbox: {
            feature: {
                dataZoom: {},
                restore: {},
                saveAsImage: {}
            },
            right: 15,
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
            symbol: 'circle',
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
//获取关联的监测点的用水户信息
function getYSHinfor(id) {
    $.ajax({
        type: "get",
        dataType: "json",
        async: false,
        url: 'Handler.ashx?Action=getYSHinfor&id=' + id,
        success: function (result) {
            $("#YSHMC").html(result.YSHHM);
            $("#YSHHH").html(result.YSHHH);
            $("#YYS").html(result.YYS);
            $("#YYSZ").html(result.YYSZ);
            $("#KHSJ").html(result.KHSJ);
            $("#LXR").html(result.LXR);
            $("#LXRDH").html(result.PHONE);
            $("#BTBH").html(result.BTBH);
            $("#DZ").html(result.DZ);
        }
    });

}
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





//------------------------------演示模式Start--------------------

function democode() {
    var charTem = "";
    charTem = '<div id="SSchart" style="width:1000px;height:300px"></div>'
    $("#configDiv").append(charTem);
    charTem = '<div id="LJchart" style="width:1000px;height:300px"></div>'
    $("#configDiv").append(charTem);
    charTem = '<div id="MXSchart" style="width:1000px;height:300px"></div>'
    $("#configDiv").append(charTem);
    var SSchart = echarts.init(document.getElementById('SSchart'));
    var LJchart = echarts.init(document.getElementById('LJchart'));
    var MXSchart = echarts.init(document.getElementById('MXSchart'));
    //取实时时间
    var nowtime, nowyear, nowmonth, nowday, nowhours, nowminutes, nowseconds;
    function getnowtime() {
        nowtime = new Date();
        nowyear = nowtime.getFullYear();
        nowmonth = nowtime.getMonth()
        nowday = nowtime.getDate();        //获取当前日(1-31)
        nowhours = nowtime.getHours();       //获取当前小时数(0-23)
        nowminutes = nowtime.getMinutes();     //获取当前分钟数(0-59)
        nowseconds = nowtime.getSeconds();     //获取当前秒数(0-59)
    }
   
    


    //瞬时流量实时曲线
    var dataSS = [], XdataSS = [];
    dataSS.push({ value: ["00：00：00", 0] }); XdataSS.push("00：00：00");
    dataSS.push({ value: ["01：00：00", 0] }); XdataSS.push("01：00：00");
    dataSS.push({ value: ["02：00：00", 0] }); XdataSS.push("02：00：00");
    dataSS.push({ value: ["03：00：00", 0] }); XdataSS.push("03：00：00");
    dataSS.push({ value: ["04：00：00", 0] }); XdataSS.push("04：00：00");
    dataSS.push({ value: ["05：00：00", 0] }); XdataSS.push("05：00：00");
    var valueSS = 2;
    function randomDataSS() {
        getnowtime();
        valueSS = Math.random() * 1;     
        XdataSS.push("" + nowhours + ":" + nowminutes + ":" + nowseconds + "");
        return {
            value: [
               "" + nowhours + ":" + nowminutes + ":" + nowseconds + "",
               valueSS.toFixed(1)
            ]
        }
    }
    //累计流量实时曲线
    var dataLJ = [], XdataLJ = [];  
    dataLJ.push({ value: ["00：00：00", 0] }); XdataLJ.push("00：00：00");
    dataLJ.push({ value: ["01：00：00", 0] }); XdataLJ.push("01：00：00");
    dataLJ.push({ value: ["02：00：00", 0] }); XdataLJ.push("02：00：00");
    dataLJ.push({ value: ["03：00：00", 0] }); XdataLJ.push("03：00：00");
    dataLJ.push({ value: ["04：00：00", 0] }); XdataLJ.push("04：00：00");
    dataLJ.push({ value: ["05：00：00", 2] }); XdataLJ.push("05：00：00");
    var valueLJ = 10;    
    function randomDataLJ() {       
        getnowtime();
        valueLJ = valueLJ +  Math.random() * 2;       
        XdataLJ.push("" + nowhours + ":" + nowminutes + ":" + nowseconds + "");
        return {
            value: [
               "" + nowhours + ":" + nowminutes + ":" + nowseconds + "",
                Math.round(valueLJ)
            ]
        }
    }


    //每小时用水量实时曲线
    var dataMXS = [], XdataMXS = [];
    var valueMXS = 4;
    getnowtime();
    var hour = parseInt(nowhours);    
    var va=[0,0,0,0,0,0,3,8,2,8,12,3,6,7,15,2,4,5,7,5,2,0,0,0,0]
    for (var i = 0;i<hour;i++){
        dataMXS.push({ value: ["" + i + "", va[i]] });
        XdataMXS.push("" + i + "");
    }

    option = {
        title: {
            x: 'center',
            padding: [10, 0, 0, 0]
        },
        grid: {
            left: 80,
            right: 20,
            top: 50,
        },
        toolbox: {
            feature: {
                dataZoom: {},
                restore: {},
                saveAsImage: {}
            },
            right: 15,
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                        
                var marker = params[0].marker;
                var time = params[0].value[0];               
                var value = params[0].value[1];
                return marker+"时间"+time + '<br/><b>' + marker +"值" + ":" + value + 'm³/h</b>';
            },
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            nameLocation: 'middle',         
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,           
        }]
    };


    SSchart.setOption(option);
    SSchart.setOption({
        title: {
            text: '瞬时流量实时曲线'
        },
        series: [{
            data: dataSS
        }],
        xAxis: {
            data: XdataSS,
        },
        yAxis: {
            axisLabel: {
                formatter: '{value}' + "m³/h",
            },
        },
    });
    LJchart.setOption(option);
    LJchart.setOption({
        title: {
            text: '累计流量实时曲线'
        },
        series: [{
            data: dataLJ
        }],
        xAxis: {
            data: XdataLJ,
        },
        yAxis: {           
            axisLabel: {
                formatter: '{value}' + "m³",
            },
        },
    });
    MXSchart.setOption(option);
    MXSchart.setOption({
        title: {
            text: '每小时用水量实时曲线'
        },
        series: [{
            data: dataMXS
        }],
        xAxis: {
            data: XdataMXS,
        },
        yAxis: {            
            axisLabel: {
                formatter: '{value}' + "m³",
            },
        },
    });

    setInterval(function () {     
        dataLJ.push(randomDataLJ());
        dataSS.push(randomDataSS());
      
        SSchart.setOption({           
            series: [{
                data: dataSS
            }],
            xAxis: {
                data: XdataSS,
            },
        });
        LJchart.setOption({           
            series: [{
                data: dataLJ
            }],
            xAxis: {
                data: XdataLJ,
            },
        });       
    }, 3000);
}


//------------------------------演示模式使用END--------------------