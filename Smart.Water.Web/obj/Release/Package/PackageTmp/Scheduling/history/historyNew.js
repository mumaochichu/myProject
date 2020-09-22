﻿var oTable, queryData, units;
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var pd;
/**
 * 时间树对象封装
 * 引用moment.js插件设置时间格式
 * 引用Ztree.js插件
 * 引用DataPick.js插件
 * 用于历史报表查询
 * 作者：张保东
 * 时间：20171103
 */
var TimeTree = {
    YearJson: [], // 存储年份和月份的数组对象
    currentST: "",
    currentET: "",
    nodeT: '', // 获取节点的属性值时间
    howYear: '', // 获取起始年份与当前年份的年差值
    nowYear: '', // 当前年份
    nowMonth: '', // 当前月份
    monthList: [], // 当前月份集合
    treeNode: [], // 树节点数组对象
    treeChildNode: [], // 树节点数组对象
    /*根据起始年份绑定时间树*/
    GetTimeTree: function () {
        //添加滚动条
        //添加滚动条
        $("#treeContainer").slimScroll({
            height: 500
        });
        // 获取系统setting中配置的起始年份的值
        // var TimeTreeStartYear=parent.Robin.Setting.GlobalSetting.HistortyTreeStartTime
        var TimeTreeStartYear = parent.Robin.Setting.GlobalSetting.HistortyTreeStartTime;
        var nowYear = moment().year();
        TimeTree.howYear = parseInt(step.substring(0, step.indexOf("year"))) - 1;
        for (var i = 0; i < this.howYear; i++) {
            TimeTree.YearJson.push({
                'year': moment(TimeTreeStartYear).add(i, 'year').format('YYYY'),
                'month': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
            })
        }
        TimeTree.nowYear = moment().format('YYYY')
        TimeTree.nowMonth = parseInt(moment().format('MM'))
        for (var i = 1; i <= this.nowMonth; i++) {
            TimeTree.monthList.push((i < 10) ? ('0' + i) : i)
        }
        TimeTree.YearJson.push({
            'year': TimeTree.nowYear,
            'month': TimeTree.monthList
        })
        $.each(TimeTree.YearJson, function (i, v) {
            $.each(v.month, function (ii, vv) {
                TimeTree.treeChildNode.push({
                    name: vv + '月',
                    type: 'month',
                    value: v.year + '-' + vv,
                    icon: '../../js/jQuery/Plugins/ztree/css/zTreeStyle/img/diy/time.png'
                })
            });
            TimeTree.treeNode.push({
                name: v.year + '年',
                children: TimeTree.treeChildNode,
                open: false,
                icon: '../../js/jQuery/Plugins/ztree/css/zTreeStyle/img/diy/4.png',
                type: 'year'
            });
            TimeTree.treeChildNode = [];
        })
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: this.Nodeclick
            }
        }
        var tree = { name: '时间', children: this.treeNode, open: true, icon: '../../js/jQuery/Plugins/zTree/css/zTreeStyle/img/diy/1_close.png' }
        var zTreeObj = $.fn.zTree.init($('#treeContainer'), setting, tree)
    },
    /**
     * 树节点的点击事件
     * @param event 树节点的事件
     * @param treeId 树ID
     * @param treeNode 树节点
     * @param clickFlag 
     */
    Nodeclick: function (event, treeId, treeNode, clickFlag) {
        if (treeNode.type == 'month') {
            $('#dpTitle').hide()
            $('#startYear').val('01日 00点00分')
            $('#startYear').attr('disabled', false)
            // moment("2012-01", "YYYY-MM").daysInMonth()
            // 判断当前月份共有几天
            var et = moment(treeNode.value, 'YYYY-MM').daysInMonth()
            $('#endYear').val(et + '日 23点59分')
            $('#endYear').attr('disabled', false)
            TimeTree.nodeT = treeNode.value
            TimeTree.currentST = TimeTree.nodeT + '-1' + ' 00:00:00'
            TimeTree.currentET = TimeTree.nodeT + '-' + et + ' 23:59:00'
        } else {
            $('#startYear').attr('disabled', true)
            $('#startYear').val('')
            $('#endYear').attr('disabled', true)
            $('#endYear').val('')
            TimeTree.currentST = ''
            TimeTree.currentET = ''
        }
    },
    /*日期插件中选择完成时的函数*/
    ManageSTime: function () {
        TimeTree.currentST = TimeTree.nodeT + "-" + $dp.cal.getP('d') + " " + $dp.cal.getP('H') + ":" + $dp.cal.getP('m');
    },
    /*日期插件中选择完成时的函数*/
    ManageETime: function () {
        TimeTree.currentET = TimeTree.nodeT + "-" + $dp.cal.getP('d') + " " + $dp.cal.getP('H') + ":" + $dp.cal.getP('m');
    }
    
}

$(function () {
    //左侧时间树
    TimeTree.GetTimeTree();
    $("#btnExcel").attr("disabled", true);

   // $('select').select2();

    var data = top.Robin.Data.monitor;
    $("#JCDList").empty();
    var ii = 0;
    //绑定监测点列表
    $.each(data, function (i, v) {
        if (ii == 0) {
            $('#select2-chosen-1').html(v.BMMC);
            $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
            ii++;
        } else {
            $("#JCDList").append('<option value="' + v.BMID + '">' + v.BMMC + '</option>');
            ii++;
        }

    });
    //调试  
    changeJCX($("#JCDList").val());


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
    //$("#endYear").val(moment().format('YYYY-MM-DD HH'));
    //$("#startYear").val(moment().format('YYYY-MM-DD 01'));
    /**
    * 查询历史数据
    */
    $("#btnQuery").click(function () {
        $('#charts').hide();
        $('#home').show();
        query();
    });
    /**
    * 查询历史曲线
    */
    $("#btnCharts").click(function () {

        $('#charts').show();
        $('#home').hide();
        var stationKey = $("#JCDList").find('option:selected').val();
        var tagKey = $("#JCXList").find('option:selected').val();
        var title = $("#JCDList").find('option:selected').text() + '-' + $("#JCXList").find('option:selected').text();
        //Robin.Chart.history('#charts', '#startYear', '#endYear', stationKey, tagKey, title);
        if (stationKey && stationKey.substr(6, 6) == '011197') {
            noty({ text: "雨量站不显示曲线", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        historyChart(stationKey, tagKey, TimeTree.currentST, TimeTree.currentET, title, units, $("#JCXList").find('option:selected').text());
    });
    pd = isIE();
    /**
    * 导出Excel
    */
    $("#btnExcel").click(function () {
        if (queryData != undefined && queryData.length > 0) {

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
                    alert(result.data);
                    return;
                }

                var data = result.data;
                $.each(data, function (i, v) {
                    if (i == 0) {
                        //赋值，默认第一项
                        $('#select2-chosen-2').html(v.TAG_DESC);
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
    } else {
        //$("#JCXList").attr("disabled", true);
    }
};

/**
 * @constructor 名称：query
 * @description 作用：查询历史数据
 * @author 作者
 */
function query() {
    var STATION_KEY = $("#JCDList").val();
    var TAG_KEY = $("#JCXList").val();

    var sTime = TimeTree.currentST;
    var eTime = TimeTree.currentET;




    if (!STATION_KEY) {
        noty({ text: "由于历史数据较多，会造成内存不足，无法导出报表，请选择监测点和监测项！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    if (!TAG_KEY) {
        noty({ text: "由于历史数据较多，会造成内存不足，无法导出报表，请选择监测项！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    if (!sTime || !eTime) {
        noty({ text: "起止时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    eTime = moment(eTime).format('YYYY-MM-DD HH:MM:SS');
    sTime = moment(sTime).format('YYYY-MM-DD HH:MM:SS');
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
        if (!isFind) {
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
        }
        switch (v.TAG_KEY) {

        }
        queryData.push({
            //TAG_KEY: tagKey,
            BMMC: bmmc,
            SAVE_DATE: top.Robin.Utils.ToDate(v.SAVE_DATE),
            TAG_NAME: tagName,
            TAG_VALUE: v.TAG_VALUE,//需要判断工频和变频的值
            UNITS: (units != null) ? units : "无"
        });
    });

    //初始化表格
    if (oTable != null) {
        oTable.fnDestroy();
        oTable = null;
    };

    //初始化表格
    oTable = $('#psTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },

        'aaData': queryData,
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,                         //是否支持排序功能    
        'bLengthChange': false,                  //是否允许用户自定义每页显示条数。
        "iDisplayLength": 10,  //每页显示的行数
        'sPaginationType': 'full_numbers',      //分页样式            
        "aoColumns": [

                 { "mData": "BMMC", "sTitle": "监测点名称", "sWidth": "30%" },
                {
                    "mData": "SAVE_DATE", "sTitle": "数据采集日期", "sWidth": "20%"
                },
                { "mData": "TAG_NAME", "sTitle": "监测项名称", "sWidth": "20%" },
                {
                    "mData": "TAG_VALUE", "sTitle": "值", "sWidth": "10%",
                    "mRender": function (data, type, full) {
                        switch (HistorytagKey) {
                            case "030202_006":
                                //加压站工频
                                if (full.TAG_VALUE == 1) {
                                    return "运行";

                                } else {
                                    return "停止";

                                }
                                break;
                            case "030202_007":
                                //加压站变频
                                if (full.TAG_VALUE == 1) {
                                    return "运行";

                                } else {
                                    return "停止";
                                }
                                break;
                            case "030202_002":
                                //加压站故障状态
                                if (full.TAG_VALUE == 0) {
                                    return "正常";
                                } else {
                                    return "故障";
                                }
                                break;
                            case "030199_006":
                                //水源井工频
                                if (full.TAG_VALUE == 1) {
                                    return "运行";

                                } else {
                                    return TagType = "停止";
                                }
                                break;
                            case "030199_003":
                                //水源井水泵故障状态
                                if (full.TAG_VALUE == 0) {
                                    return "正常";

                                } else {
                                    return "故障";
                                }
                                break;
                            default:
                                return top.Robin.Application.retainedDecimalPlaces(full.TAG_VALUE, 2);
                        }
                        //return Robin.Utils.retainedDecimalPlaces(data, 2);
                    }
                },
                { "mData": "UNITS", "sTitle": "单位", "sWidth": "10%" }
        ]
    });
};
/**
 * 报表对象
 * @type {{history: history, _renderChart: _renderChart}}
 */
Robin.Chart =
    {
        /**
         *  渲染历史报表
         * @param container 用于渲染报表的容器，填写jquery选择器，如'#container'
         * @param start 开始时间文本框，填写jquery选择器，如'#start'
         * @param end 结束时间文本框，填写jquery选择器，如'#end'
         * @param stationKey 监测站点主键
         * @param tagKey 检测项编码
         * @param title  图形标题
         */
        history: function (container, start, end, stationKey, tagKey, title) {

            var startTime = $(start).val();
            var endTime = $(end).val();
            var startNow, endNow;
            //为了演示系统，配置的功能
            if (top.Robin.Setting.Demo.isShowDemo == "1") {
                startTime = top.Robin.Setting.Demo.startTime;
                endTime = top.Robin.Setting.Demo.endTime;
            } else {
                startTime = new Date(startTime.replace(/-/ig, '/'));
                startTime = startTime.Format('yyyy-MM-dd');
                endTime = new Date(endTime.replace(/-/ig, '/'));
                endTime = endTime.setDate(endTime.getDate() + 1)
                endTime = (new Date(endTime)).Format('yyyy-MM-dd');
            }
            if (startTime == "" || endTime == "") {

                top.Robin.Window.Dialog.show('系统提示', '请选择开始时间和结束时间');
                return;
            }

            if (startTime != "" && endTime != "") {

                if (endTime <= startTime) {

                    top.Robin.Window.Dialog.show('系统提示', '结束时间不能小于开始时间');
                    return;
                }
            }
            startNow = startTime.split('-');
            endNow = endTime.split('-');
            title = title + ' 曲线图 (' + startTime + "至" + endTime + ')';
            var url = top.Robin.Setting.GlobalSetting.RestAPIService + top.Robin.Setting.GlobalSetting.HistoryService + stationKey + "/" + tagKey + "/" + startTime + "/" + endTime + "?callback=?";
            $.getJSON(url, function (data) {

                var seriesData = [], seriesData2 = [], seriesData3 = [];
                //最大值最小值默认值
                var max = 20, min = -20;

                $.each(data, function (i, v) {
                    //判断是否为空再进行赋值
                    if (i == 0 && v.year != undefined && v.year != null) {
                        max = v.year;
                        min = v.month;
                    } else {
                        if (v.year != undefined && v.year != null) {
                            seriesData.push([new Date(v.year, v.month, v.day, v.hour, v.mis).getTime(), parseFloat(v.value)]);
                        }
                    }
                });

                seriesData2.push([new Date(startNow[0], parseInt(startNow[1]) - 1, parseInt(startNow[2]), 0).getTime(), parseFloat(max)]);
                seriesData2.push([new Date(endNow[0], parseInt(endNow[1]) - 1, parseInt(endNow[2]) + 1, 0).getTime(), parseFloat(max)]);
                seriesData3.push([new Date(startNow[0], parseInt(startNow[1]) - 1, parseInt(startNow[2]), 0).getTime(), parseFloat(min)]);
                seriesData3.push([new Date(endNow[0], parseInt(endNow[1]) - 1, parseInt(endNow[2]) + 1, 0).getTime(), parseFloat(min)]);

                Robin.Chart._renderChart(container, title, seriesData, seriesData2, seriesData3);
            });


        },
        /**
         * 渲染图表
         * @param container 内容
         * @param title 标题
         * @param seriesData 数据
         * @param seriesData2 数据
         * @param seriesData3 数据
         * @private
         */
        _renderChart: function (container, title, seriesData, seriesData2, seriesData3) {
            Highcharts.setOptions({

                global: {
                    useUTC: false
                }
            });
            $(container).highcharts('StockChart', {
                chart: {
                    zoomType: 'xy',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    // 取消边框和背景
                    borderWidth: 0,
                    backgroundColor: null
                },
                credits: {
                    enabled: false
                },

                title: {
                    text: title
                },
                rangeSelector: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: '监 测 值'
                    }
                },
                xAxis: {
                    type: 'datetime',
                    ////刻度间隔(6小时)
                    //tickInterval:3* 3600 * 1000,
                    //时间格式：
                    dateTimeLabelFormats: {
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%l:%M',
                        day: '%H:%M <br/> %m月%e日',
                        week: '%m月 %e',
                        month: '%m \'%y',
                        year: '%Y'
                    },
                    range: 24 * 3600 * 1000, // 移动范围 1天,
                    showLastLabel: true
                },
                navigator: {
                    enabled: false
                },
                tooltip: {
                    shared: false,
                    formatter: function () {
                        return Highcharts.dateFormat('%m月%e日 %H:%M:%S', this.x) + '<br/><b>' + this.series.name + ':</b>' + this.y;
                    }
                },
                //图例
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [
                    {
                        name: '运行监测值',
                        data: seriesData
                    },
                    {
                        name: '监测项最大值',
                        data: seriesData2,
                        color: 'red',
                        dashStyle: 'shortdot'
                    },
                    {
                        name: '监测项最小值',
                        data: seriesData3,
                        color: 'hotpink',
                        dashStyle: 'shortdot'
                    }
                ]
            });
        }
    };


/**
* 绑定chart
* @author CodingMan
* @param {string} stationKey 监测点编号
* @param {string} tagKey     监测项编号
* @param {string} title 曲线名称
*/
var historyChart = function (stationKey, tagKey, start, end, title, units, type) {
    //获取当天的时间
    var TodayDate = new Date();


    var startTime = start;

    var endTime = end;
    startTime = moment(startTime).format('YYYY-MM-DD HH:MM:SS');
    endTime = moment(endTime).format('YYYY-MM-DD HH:MM:SS');
    var startNow, endNow;

    if (startTime == "" || endTime == "") {

        alert('请选择开始时间和结束时间');
        return;
    }

    if (startTime != "" && endTime != "") {

        if (endTime <= startTime) {

            alert('结束时间不能小于开始时间');
            return;
        }
    }

    var myChart = echarts.init(document.getElementById('charts'));
    option = {
        title: {
            text: title + '(' + startTime + '至' + endTime + ')',
            x: 'center',
            padding: [10, 0, 0, 0]
        },
        //legend: {
        //    data: [type],
        //    x: 'center',
        //    bottom: '0px'

        //},
        grid: {
            left: '8%',
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
        //    {
        //        type: 'inside',
        //        xAxisIndex: [0],
        //        zoomOnMouseWheel: false,
        //    },
        //     {
        //         type: 'inside',
        //         yAxisIndex: [0],
        //         zoomOnMouseWheel: false,
        //     }
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
            nameLocation: 'middle',
            axisLabel: {
                formatter: '{value}' + units,
            },
            scale: true,
        },
        series: [{
            name: type,
            type: 'line',
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
    var queryUrl = restUrl + "/iot/historycharts/v1?starttime="
        + startTime + "&endtime=" + endTime + "&stationkey=" + stationKey + "&tagkey=" + tagKey;
    $.ajax({
        url: queryUrl,
        dataType: "JSONP",
        type: "get",
        success: function (result) {
            if (result.status == 200) {
                var data = result.data;
                var seriesData = []
                $.each(data, function (i, v) {
                    if (i > 0) {
                        seriesData.push([(new Date(v.year, v.month, v.day, v.hour, v.mis, v.ss)).getTime(), parseFloat(v.value)]);
                    }
                });

                myChart.setOption({
                    series: [{
                        data: seriesData
                    }]
                });
            }
            if (result.status == 500) {
                noty({ text: result.data, type: "warning", layout: "topCenter", timeout: 2000 });
            }
        }
    });


};