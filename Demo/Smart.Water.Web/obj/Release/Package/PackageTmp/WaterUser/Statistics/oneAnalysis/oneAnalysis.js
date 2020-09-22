//表格，表格数据，监测点所有数据
var oTable = null;
//树相关
var cityTree, treeObj, selectNode, zNodes = [];
//树的配置项
var setting = {
    view: {
        showLine: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: zTreeOnClick
    }
};
//服务URL
var url = parent.Robin.Setting.GlobalSetting.RestAPIService;
var jcdID, jcxCode, jcdName, units = "m³";//监测点,监测项编码
//判断是否IE
var pd;
/*创建日报对象*/
var Report = {

    //目前的监测项
    CurrentTags: [],
    CurrentDataSet: [],
    //目前的列
    CurrentColumns: [],  
    //表格数据
    queryData: [],
    //监测点所有数据
    jCDAllData: [],
}
var myChart;
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
    //初始化查询按钮不能点击
    $("#btnQuery").attr("disabled", true);  
    var date = new Date();
    $('#txtDayTime').val(moment(date).format('YYYY-MM-DD'));
    //获取树
    $.ajax({
        type: 'POST',
        dataType: 'json',
        async: false,
        url: 'Handler.ashx?Action=Tree',
        success: function (result) {
            $.each(result, function (i, v) {
                zNodes.push({
                    id: v.JDID, pId: v.PCID, name: v.NAME, code: v.CODE
                });
            });
            cityTree = $.fn.zTree.init($("#cityTrees"), setting, zNodes);
            treeObj = $.fn.zTree.getZTreeObj("cityTrees");
            var nodes = treeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) { //设置节点展开
                treeObj.expandNode(nodes[i], true, false, true);
            }
            //节点初始化
            var hinodes = [];
            var count = 0;
            var threenote = true;
            $.each(nodes, function (ni, nv) {
                //判断是否创建营业所
                if (nv.isParent) {
                    $.each(nv.children, function (i, v) {
                        //判断营业所是否创建组，如果不创建不显示该营业所节点。
                        if (v.isParent) {
                            $.each(v.children, function (ii, vv) {
                                if (vv.isParent) {
                                    $.each(vv.children, function (iii, vvv) {
                                        vvv.icon = "../../../js/jQuery/Plugins/zTree/css/zTreeStyle/img/diy/2.png"
                                        if (threenote == true) {
                                            var zTree = $.fn.zTree.getZTreeObj("cityTrees");//获取ztree对象                                        
                                            zTree.selectNode(vvv);//选择点  
                                            zTree.setting.callback.onClick(null, zTree.setting.treeId, vvv);//调用事件 
                                            threenote = false;
                                        }
                                    })
                                } else {
                                    vv.icon = "../../../js/jQuery/Plugins/zTree/css/zTreeStyle/img/diy/3.png"
                                }
                            })
                        } else {
                            hinodes.push(v);
                            count++;
                        }
                    })
                }
            })
            if (count == 0) {
            } else {
                $.each(hinodes, function (i, v) {
                    treeObj.removeNode(v);
                });
            }

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

    //查询按钮点击事件
    $("#btnQuery").click(function () {
        btnQuery();
    });
    pd = isIE();
    //导出
    $("#btnExport").click(function (i, v) {
        Export();
    });
    //停止进度条，初始化点击空白处，收缩二级菜单事件
    $(".ui-layout-container").click(function () {
        if (top.$("#user-nav > ul >li").hasClass("open")) {
            top.$("#user-nav > ul >li").removeClass("open");
        }
    });
    start();
})

//树的点击事件
function zTreeOnClick(event, treeId, treeNode) {
    selectNode = treeNode;
    //获取当前查询的用户关联的检测点编码
    getJCDID();
    selectNode = treeNode;
    $("#btnQuery").attr("disabled", true);
    $("#btnQuery").attr("title", "请选择用水户");
    $("#btnExcel").attr("title", "请先进行查询");
    if (treeNode.level == 3) {
        $("#btnQuery").removeAttr("disabled");
        $("#btnQuery").removeAttr("title");
    }
}
//页面加载自动查询
function start() {
    btnQuery();
}
//获取当前查询的用户关联的检测点编码
function getJCDID() {
    //获取用户ID
    var id = selectNode.id;
    $.ajax({
        type: "post",
        async: false,
        dataType: 'Text',
        url: 'Handler.ashx?Action=getJCD&id=' + id,
        success: function (data) {
            jcdID = data;
            //根据监测点编码获取监测点名称,构造title
            $.each(top.Robin.Data.monitor, function (i, v) {
                if (v.BMID == jcdID) {
                    jcdName = v.BMMC;
                } else {

                }
            });
            //匹配瞬时流量查询，801平台配置变化，此处也要变化
            $.each(top.tmodel.monitorData(), function (ii, vv) {
                if (vv.StationKey() == jcdID && vv.TagName() == "瞬时流量") {
                    Report.CurrentTags.push(vv);
                }
            });
        
        }
    })
}

//查询
function btnQuery() { 
    var value = $("#ReportType").val();
    switch (value) {
        case "day":
            var time = $("#txtDayTime").val();
            if (time == "") {
                noty({ text: "查询时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                return;
            }
            NProgress.start();
            $.getJSON(url + "/iot/dayreport/" + jcdID + "/" + time + "?callback=?", function (data) {
                if (data.status == 500) {
                    noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                    NProgress.done();
                    return;
                }
                var result = [];
                result = result.concat(data.data);               
                initTable(result, 'day');
                $("#btnExport").removeAttr('disabled').removeAttr('title');
            });
            break;

        case "month":
            var time = $("#txtMonthTime").val();
            if (time == "") {
                noty({ text: "查询时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                return;
            }
            NProgress.start();
            $.getJSON(url + "/iot/report/general/month/" + jcdID + "/" + time + "?callback=?", function (data) {
                if (data.status == 500) {
                    noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                    return;
                }
                var result = [];
                result = result.concat(data.data);              
                initTable(result, 'month');
                $("#btnExport").removeAttr('disabled').removeAttr('title');
            });
            break;
        case "year":
            var time = $("#txtYearTime").val();
            if (time == "") {
                noty({ text: "查询时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                return;
            }
            NProgress.start();
            time = time + "-01";
            //var test = url + "/iot/report/general/year/" + v.BMID + "/" + time + "?callback=?";
            $.getJSON(url + "/iot/report/general/year/" + jcdID + "/" + time + "?callback=?", function (data) {
                if (data.status == 500) {
                    noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                    return;
                }
                var result = [];
                result = result.concat(data.data);              
                initTable(result, 'year');
                $("#btnExport").removeAttr('disabled').removeAttr('title');
            });
            break;
    }
}

//初始化表格
function initTable(dataSet, type) {   
    Report.queryData = [];
    Report.jCDAllData = [];
    var chartdata = [];
    var day = $("#txtDayTime").val();
    switch (type) {
        case 'day':
            /*构造queryData*/
            for (var i = 1; i <= 24; i++) {
                Report.jCDAllData = [];
                //时间
                var time = '';
                if (i.toString().length == 1) {
                    time = "0" + i + ":00";
                }
                else {
                    time = i + ":00";
                }
                //获取这个点的瞬时流量检测数据
                $.each(dataSet, function (i, v) {
                    if (v.PERIOD == time) {
                        Report.jCDAllData.push(v);
                       
                    }
                });
                if (Report.jCDAllData.length == 0) {
                    chartdata.push([time,'0']);
                    Report.queryData.push({
                        SJ: day + " " + time,
                        ZDZ: "0",
                        ZDZSJ: "0",
                        ZXZ: "0",
                        ZXZSJ: "0",
                        PJZ: "0",
                        ZZ: "0",
                    });
                }
                else {                 
                    var isflag = false;
                    var currentLineData = [];
                    //检测项目类别
                    $.each(Report.CurrentTags, function (i, v) {
                        $.each(Report.jCDAllData, function (ii, vv) {
                            if (v.TagCode() == vv.TAGKEY) {                        
                                isflag = true;
                                currentLineData = vv;
                                return false;
                            }
                        });
                        //如果存在数据
                        if (isflag) {
                            chartdata.push([time,parseFloat(currentLineData.SUMVALUE).toFixed(2)]);
                            Report.queryData.push({
                                SJ: day + " " + time,
                                ZDZ: parseFloat(currentLineData.MAXTAGVALUE).toFixed(2),
                                ZDZSJ: currentLineData.MAXTAGVALUETIME,
                                ZXZ: parseFloat(currentLineData.MINTAGVALUE).toFixed(2),
                                ZXZSJ: currentLineData.MINTAGVALUETIME,
                                PJZ: parseFloat(currentLineData.AVETAGVALUE).toFixed(2),
                                ZZ: parseFloat(currentLineData.SUMVALUE).toFixed(2),
                            });
                        }
                        else {
                            chartdata.push([time,'0']);
                            Report.queryData.push({
                                SJ: day + " " + time,
                                ZDZ: "0",
                                ZDZSJ: "0",
                                ZXZ: "0",
                                ZXZSJ: "0",
                                PJZ: "0",
                                ZZ: "0",
                            });
                        }
                        isflag = false;
                    });
                }
            }
            var title = jcdName+day + " 日用水量统计"
            initChart(title, chartdata, "day", units);
            break;
        case 'month':
            var month = $("#txtMonthTime").val();            
            var dayCount = new Date(month.split("-")[0], month.split("-")[1], 0).getDate();
            /*构造queryData*/
            for (var i = 1; i <= dayCount; i++) {
                //某一点的所有检测项数据
                Report.jCDAllData = [];
                if (i < 10) {
                    var time = "0" + i.toString();
                }
                else {
                    var time = i;
                }

                //获取这个点的所有检测项数据
                $.each(dataSet, function (ii, vv) {
                    if (vv.Time == time + "号") {
                        Report.jCDAllData.push(vv);;
                    }
                });
                if (Report.jCDAllData.length == 0) {
                    chartdata.push([time, '0']);
                    Report.queryData.push({
                        SJ: time,
                        ZDZ: "0",
                        ZDZSJ: "0",
                        ZXZ: "0",
                        ZXZSJ: "0",
                        PJZ: "0",
                        ZZ: "0",
                    });
                }
                else {
                    var isflag = false;
                    var currentLineData;
                    //检测项目类别
                    $.each(Report.CurrentTags, function (i, v) {
                        $.each(Report.jCDAllData, function (ii, vv) {                        
                            if (v.TagCode() == vv.TagKey) {
                                isflag = true;
                                currentLineData = vv;
                                return false;
                            }
                        });
                        if (isflag) {
                            chartdata.push([time, currentLineData.SumValue]);
                            Report.queryData.push({
                                SJ: time,
                                ZDZ: currentLineData.MaxValue,
                                ZDZSJ: currentLineData.MaxTime,
                                ZXZ: currentLineData.MinValue,
                                ZXZSJ: currentLineData.MinTime,
                                PJZ: currentLineData.AverageValue,
                                ZZ: currentLineData.SumValue
                            });
                        }
                        else {
                            chartdata.push([time, '0']);
                            Report.queryData.push({
                                SJ: time,
                                ZDZ: "0",
                                ZDZSJ: "0",
                                ZXZ: "0",
                                ZXZSJ: "0",
                                PJZ: "0",
                                ZZ: "0",
                            });
                        }
                        isflag = false;
                    });
                }
            }
            var title =jcdName+ month + " 月用水量统计"
            initChart(title, chartdata, "month", units);
            break;
        case 'year':
            /*构造queryData*/
            for (var i = 1; i <= 12; i++) {
                //某一点的所有检测项数据               
                Report.jCDAllData = [];
                if (i < 10) {
                    var time = "0" + i.toString();
                }
                else {
                    var time = i;
                }
                //获取这个点的所有检测项数据
                $.each(dataSet, function (ii, vv) {
                    if (vv.Time == time) {
                        Report.jCDAllData.push(vv);
                    }
                });
                if (Report.jCDAllData.length == 0) {
                    chartdata.push([time + "月", '0']);
                    Report.queryData.push({
                        SJ: time+"月",
                        ZDZ: "0",
                        ZDZSJ: "0",
                        ZXZ: "0",
                        ZXZSJ: "0",
                        PJZ: "0",
                        ZZ: "0",
                    });
                }
                else {
                    var isflag = false;
                    var currentLineData;
                    //检测项目类别
                    $.each(Report.CurrentTags, function (i, v) {
                        $.each(Report.jCDAllData, function (ii, vv) {
                            if (v.TagCode() == vv.TagKey) {
                                isflag = true;
                                currentLineData = vv;
                                return false;
                            }
                        });
                        if (isflag) {
                            chartdata.push([time + "月", currentLineData.SumValue]);
                            Report.queryData.push({
                                SJ: time + "月",
                                ZDZ: currentLineData.MaxValue,
                                ZDZSJ: currentLineData.MaxTime,
                                ZXZ: currentLineData.MinValue,
                                ZXZSJ: currentLineData.MinTime,
                                PJZ: currentLineData.AverageValue,
                                ZZ: currentLineData.SumValue,
                            });
                        }
                        else {
                            chartdata.push([time+"月", '0']);
                            Report.queryData.push({
                                SJ: time + "月",
                                ZDZ: "0",
                                ZDZSJ: "0",
                                ZXZ: "0",
                                ZXZSJ: "0",
                                PJZ: "0",
                                ZZ: "0",
                            });
                        }
                        isflag = false;
                    });
                }
            }
            
            var title =jcdName+ $('#txtYearTime').val() + " 年用水量统计"
            initChart(title, chartdata, "year", units);
            break;
    }

    //初始化表格
    if (oTable != null) {       
        oTable.fnDestroy();
        oTable = null;
    };
    oTable = $('#psTable').dataTable({
        "oLanguage": {
            "sUrl": "../../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },
        "bJQueryUI": true,
        "sDom": '<""l>t<"F"fp>',
        'aaData': Report.queryData,
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,                         //是否支持排序功能    
        'bLengthChange': false,                  //是否允许用户自定义每页显示条数。
        "iDisplayLength": 10,  //每页显示的行数
        'sPaginationType': 'full_numbers',      //分页样式      
        "sScrollY": 100, //DataTables的高  
        "aaSorting": [[1, "asc"]], //默认的排序方式，第2列，升序排列  
        "aoColumns": [
                 { "mData": "SJ", "sTitle": "时间", "sWidth": "20%" },
                 { "mData": "ZDZ", "sTitle": "最大值(m³/h)", "sWidth": "10%" },
                 {
                     "mData": "ZDZSJ", "sTitle": "最大值时间", "sWidth": "10%"
                 },
                 { "mData": "ZXZ", "sTitle": "最小值(m³/h)", "sWidth": "10%" },
                 {
                     "mData": "ZXZSJ", "sTitle": "最小值时间", "sWidth": "10%"
                 },
                { "mData": "PJZ", "sTitle": "平均值(m³/h)", "sWidth": "10%" },
                 {
                     "mData": "ZZ", "sTitle": "总值(m³)", "sWidth": "10%"
                 },
        ]
    });
    $("#btnExport").removeAttr("title");
    NProgress.done();
}


/**
* 绑定chart
* @author CodingMan
* @param {string} stationKey 监测点编号
* @param {string} tagKey     监测项编号
* @param {string} title 曲线名称
*/
var initChart = function (title, chartdata, type, units) {
    var myChart = echarts.init(document.getElementById('resultChart'));
    myChart.clear();
    option = {
        title: {
            text: title,
            x: 'center',
            padding: [10, 0, 0, 0]
        },
        //legend: {
        //    data: [type],
        //    x: 'right',
        //    y: 'center'
        //},
        grid: {
            left: '8%',
            right: '8%',
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
            axisPointer: {
                type: 'line'
            },
            formatter: function (params) {
                var name ="时间:"+ params[0].axisValue;
                var value = "值:" + params[0].data[1] + units;
                var marker = params[0].marker;
                return marker+name + "\<br>" +marker+ value;
            },
        },
        xAxis: {
          
        },
        yAxis: {
            type: 'value',
            name:'用水量(m³)',
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
    switch (type) {
        case "day":
            option = {
                xAxis: {
                    name: '时间',
                    type: 'category',                  
                    data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
                        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
                    ]
                },              
                   series: [
                       {
                           data: chartdata
                       }
                    ],
            }
            myChart.setOption(option);
            break;
        case "month":
            var xdata = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
                      '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '26', '27', '28', '29', '30', '31'
            ];           
            switch (chartdata.length) {
                case 30:
                    xdata = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
                      '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '26', '27', '28', '29', '30'
                    ];
                    break;
                case 29:
                    xdata = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
                      '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '26', '27', '28', '29'
                    ];
                    break;
                case 29:
                    xdata = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
                      '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '26', '27', '28'
                    ];
                    break;

            }
            option = {
                xAxis: {
                    name: '时间',
                    type: 'category',
                    data: xdata,
                },
                series: [
                    {
                        data: chartdata
                    }
                ],
            }
            myChart.setOption(option);
            break;
        case "year":
            option = {
                xAxis: {
                    name: '时间',
                    type: 'category',
                    data: xdata = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'
                    ]    
                },
                series: [
                    {
                        data: chartdata
                    }
                ],
            }
            myChart.setOption(option);
            break;

    }


};




/*导出*/
function Export() {   
    var temp = JSON.stringify(Report.queryData);
    $("#hidData").val(temp);
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
    var pd = isIE();
    $("#form1").attr("action", "Handler.ashx?Action=ExportResultData&pd=" + pd + "&name=" + jcdName + "&time=" + time);
    $("#form1").submit();
}



function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};