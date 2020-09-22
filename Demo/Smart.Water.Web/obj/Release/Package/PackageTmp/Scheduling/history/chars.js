var option = {
    baseOption: {
        timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 1000,
            data: [
                '水位1', '水位2'
            ],
            tooltip: {
                show: false
            }
        },
        title: {
            x: 'center',
            padding: [10, 0, 0, 0]
        },
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
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            enabled: false
        },

        grid: {
            top: '4%',
            left: '3%',
            right: '3%',
            bottom: '3%',

            containLabel: true
        },
        xAxis: [
            {
                axisLine: {
                    lineStyle: {
                        color: '#0087ED',
                        width: 2
                    }
                },
                boundaryGap: false,
                type: 'time',
                tickPixelInterval: 150,
                tickColor: '#000',
                tickWidth: 1,
                lineColor: '#000'

            }
        ],
        yAxis: {
            type: 'value',
            nameLocation: 'middle',
            axisLabel: {
                formatter: '{value}' + units,
            },
            axisLine: {
                lineStyle: {
                    color: '#0087ED',
                    width: 2
                }
            },
            scale: true,
        },
        series: [
            {
                name: '水位',
                type: 'line',
            },
            {
                name: '雨量',
                type: 'line',
            }

        ]
    },
    options: [
{
    series: [
{
    smooth: true,
    itemStyle: {
        normal: {
            areaStyle: {
                type: 'default'
            },
            color: '#1874CD',
        }
    },
    markLine: {
        name: '级别',
        data: [
             {
                 name: '一般积水',
                 yAxis: 0.2,
                 lineStyle: {
                     normal: {
                         color: '#fcff00 ',
                         width: 4
                     }
                 }
             },
             {
                 name: '较大积水',
                 yAxis: 0.3,
                 lineStyle: {
                     normal: {
                         color: '#ff840d',
                         width: 4
                     }
                 }
             },
             {
                 name: '严重积水',
                 yAxis: 0.5,
                 lineStyle: {
                     normal: {
                         color: '#ff0000',
                         width: 4
                     }
                 }
             }]
    }
}
    ]
},
{
    series: [
               {
                   smooth: true,
                   itemStyle: {
                       normal: {
                           areaStyle: {
                               type: 'default'
                           },
                           color: '#1874CD',
                       }
                   },
                   markLine: {
                       name: '级别',
                       data: [
                            {
                                name: '一般积水',
                                yAxis: 0.2,
                                lineStyle: {
                                    normal: {
                                        color: '#fcff00 ',
                                        width: 4
                                    }
                                }
                            },
                            {
                                name: '较大积水',
                                yAxis: 0.3,
                                lineStyle: {
                                    normal: {
                                        color: '#ff840d',
                                        width: 4
                                    }
                                }
                            },
                            {
                                name: '严重积水',
                                yAxis: 0.5,
                                lineStyle: {
                                    normal: {
                                        color: '#ff0000',
                                        width: 4
                                    }
                                }
                            }]
                   }
               }
    ]
}]
}


myChart.setOption(option);

//水位数据
var url = resturl + "/iot/historycharts/v1"
+ "?starttime=" + startTime + "&endtime=" + endTime + "&stationkey=" + monitorId + "&tagkey=" + tagkey;
var seriesData = [];
var seriesData2 = [];
$.ajax({
    url: url,
    dataType: "JSONP",
    type: "get",
    async: false,
    success: function (result) {

        if (result.status == 200) {
            var data = result.data;
            $.each(data, function (i, v) {
                if (i > 0) {
                    seriesData.push([(new Date(v.year, v.month, v.day, v.hour, v.mis, v.ss)).getTime(), parseFloat(v.value)]);
                    seriesData2.push([(new Date(v.year, v.month, v.day, v.hour, v.mis, v.ss)).getTime(), parseFloat(v.value + 1.2)]);
                }
            });
            if (seriesData.length <= 0) {
                seriesData.push([new Date().getTime(), 0]);
            }
        }
        if (result.status == 500) {
            noty({
                text: result.data, type: "warning", layout: "topCenter", timeout: 2000
            });
        }

        myChart.setOption({
            options: [{
                title: { text: '水位1' },
                series: [
                  { data: seriesData },
                ]
            },
            {
                title: { text: '水位2' },
                series: [
                  { data: seriesData2 },
                ]
            }
            ]
        });

                  
    }
});
