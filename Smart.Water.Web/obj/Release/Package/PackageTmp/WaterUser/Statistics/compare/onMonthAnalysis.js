﻿//表格，表格数据，监测点所有数据
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
    //表格数据历史
    queryDataOld: [],
    //监测点所有数据
    jCDAllData: [],
}
var myChart;
$(function () {
    //layout布局确定
    $('body').layout({
        applyDemoStyles: true,
        north__closable: false,
        togglerTip_open: "关闭",//pane打开时，当鼠标移动到边框上按钮上，显示的提示语
        togglerTip_closed: "打开",//pane关闭时，当鼠标移动到边框上按钮上，显示的提示语
        togglerLength_open: 35,//pane打开时，边框按钮的长度
        togglerLength_closed: 35,//pane关闭时，边框按钮的长度
        togglerContent_open: " <div style='background:rgb(221, 221, 221)'><img src='../../images/wateruser/plugin/mini-left.gif' /></div>",//pane打开时，边框按钮中需要显示的内容
        togglerContent_closed: "<div style='background:rgb(221, 221, 221)'><img src='../../images/wateruser/plugin/mini-right.gif' /></div>",//pane关闭时，边框按钮中需要显示的内容
    });
    //初始化查询按钮不能点击
    $("#btnQuery").attr("disabled", true);
    var date = new Date();
    $('#txtYearTime').val(moment(date).format('YYYY'));
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
    //同比类型修改事件
    $("#compareType").change(function () {
        var value = $("#compareType").val();
        switch (value) {
            case "yearAndyear":
                $("#txtMonthTime").hide();
                $("#txtYearTime").show();
                break;
            case "monthAndmonth":
                $("#txtMonthTime").show();
                $("#txtYearTime").hide();
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
    var value = $("#compareType").val();
    switch (value) {
        case "monthAndmonth":
            var time = $("#txtMonthTime").val();
            if (time == "") {
                noty({ text: "查询时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                return;
            }
            NProgress.start();
            //执行查询，构造resultNow,resultOld数据
            var resultNow = [];
            $.getJSON(url + "/iot/report/general/month/" + jcdID + "/" + time + "?callback=?", function (data) {
                if (data.status == 500) {
                    noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                    return;
                }
                resultNow = resultNow.concat(data.data);
                initTableChart(resultNow, 'month');
            });
            //释放导出按钮点击功能
            $("#btnExport").removeAttr('disabled').removeAttr('title');
            break;
        case "yearAndyear":
            var time = $("#txtYearTime").val();
            if (time == "") {
                noty({ text: "查询时间不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                return;
            }
            NProgress.start();
            time = time + "-01";
            var resultNow = [];

            $.getJSON(url + "/iot/report/general/year/" + jcdID + "/" + time + "?callback=?", function (data) {
                if (data.status == 500) {
                    noty({ text: data.data, type: "warning", layout: "topCenter", timeout: 5000 });
                    return;
                }
                resultNow = resultNow.concat(data.data);
                initTableChart(resultNow, 'year');
            });
            $("#btnExport").removeAttr('disabled').removeAttr('title');
            break;
    }
}

//初始化表格和图表
function initTableChart(resultNow, type) {
    Report.queryData = [];
    Report.jCDAllData = [];
    switch (type) {
        case 'month':
            var month = $("#txtMonthTime").val();
            var title = jcdName + moment(month).format('YYYY年MM月') + "日环比分析";
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
                $.each(resultNow, function (ii, vv) {
                    if (vv.Time == time + "号") {
                        Report.jCDAllData.push(vv);;
                    }
                });
                if (Report.jCDAllData.length == 0) {
                    Report.queryData.push({
                        SJ: time,
                        ZDZ: "0",
                        ZDZSJ: "0",
                        ZXZ: "0",
                        ZXZSJ: "0",
                        PJZ: "0",
                        ZZ: "0",
                        FZL: "0",
                        ZZL: "0",
                    });
                } else {
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
                            Report.queryData.push({
                                SJ: time,
                                ZDZ: currentLineData.MaxValue,
                                ZDZSJ: currentLineData.MaxTime,
                                ZXZ: currentLineData.MinValue,
                                ZXZSJ: currentLineData.MinTime,
                                PJZ: currentLineData.AverageValue,
                                ZZ: currentLineData.SumValue,
                                FZL: "0",
                                ZZL: "0",
                            });
                        }
                        else {
                            Report.queryData.push({
                                SJ: time,
                                ZDZ: "0",
                                ZDZSJ: "0",
                                ZXZ: "0",
                                ZXZSJ: "0",
                                PJZ: "0",
                                ZZ: "0",
                                FZL: "0",
                                ZZL: "0",
                            });
                        }
                        isflag = false;
                    });
                }
            }
            var chartdata = [];
            var changedataFZ = [];
            var changedataZZ = [];
            for (var i = 0; i < Report.queryData.length; i++) {
                if (i == 0) {
                    Report.queryData[i].FZL = 0;
                    Report.queryData[i].ZZL = 0;
                } else {
                    if (parseFloat(Report.queryData[i - 1].ZZ) == 0) {
                        Report.queryData[i].FZL = 0;
                        Report.queryData[i].ZZL = 0;

                    } else {
                        Report.queryData[i].FZL = (parseFloat(Report.queryData[i].ZZ) / parseFloat(Report.queryData[i - 1].ZZ) * 100).toFixed(2);
                        Report.queryData[i].ZZL = (parseFloat(Report.queryData[i].ZZ - parseFloat(Report.queryData[i - 1].ZZ)) / parseFloat(Report.queryData[i - 1].ZZ) * 100).toFixed(2);
                    }

                }
                chartdata.push([Report.queryData[i].SJ + "", Report.queryData[i].ZZ]);
                changedataFZ.push([Report.queryData[i].SJ + "", Report.queryData[i].FZL]);
                changedataZZ.push([Report.queryData[i].SJ + "", Report.queryData[i].ZZL]);
            }

            initTable(Report.queryData);
            initChart(title, chartdata, changedataFZ, changedataZZ, type, units);
            break;
        case 'year':
            var title = jcdName + moment($('#txtYearTime').val()).format('YYYY年') + " 月环比分析"
            //*构造queryData
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
                $.each(resultNow, function (ii, vv) {
                    if (vv.Time == time) {
                        Report.jCDAllData.push(vv);
                    }
                });
                if (Report.jCDAllData.length == 0) {
                    Report.queryData.push({
                        SJ: time + "月",
                        ZDZ: "0",
                        ZDZSJ: "0",
                        ZXZ: "0",
                        ZXZSJ: "0",
                        PJZ: "0",
                        ZZ: "0",
                        FZL: "0",
                        ZZL: "0",
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
                            Report.queryData.push({
                                SJ: time + "月",
                                ZDZ: currentLineData.MaxValue,
                                ZDZSJ: currentLineData.MaxTime,
                                ZXZ: currentLineData.MinValue,
                                ZXZSJ: currentLineData.MinTime,
                                PJZ: currentLineData.AverageValue,
                                ZZ: currentLineData.SumValue,
                                FZL: "0",
                                ZZL: "0",
                            });
                        }
                        else {
                            Report.queryData.push({
                                SJ: time + "月",
                                ZDZ: "0",
                                ZDZSJ: "0",
                                ZXZ: "0",
                                ZXZSJ: "0",
                                PJZ: "0",
                                ZZ: "0",
                                FZL: "0",
                                ZZL: "0",
                            });
                        }
                        isflag = false;
                    });
                }
            }

            var chartdata = [];
            var changedataFZ = [];
            var changedataZZ = [];
            for (var i = 0; i < Report.queryData.length; i++) {
                if (i == 0) {
                    Report.queryData[i].FZL = 0;
                    Report.queryData[i].ZZL = 0;
                } else {
                    if (parseFloat(Report.queryData[i - 1].ZZ) == 0) {
                        Report.queryData[i].FZL = 0;
                        Report.queryData[i].ZZL = 0;

                    } else {
                        Report.queryData[i].FZL = (parseFloat(Report.queryData[i].ZZ) / parseFloat(Report.queryData[i - 1].ZZ) * 100).toFixed(2);
                        Report.queryData[i].ZZL = (parseFloat(Report.queryData[i].ZZ - parseFloat(Report.queryData[i - 1].ZZ)) / parseFloat(Report.queryData[i - 1].ZZ) * 100).toFixed(2);
                    }

                }
                chartdata.push([Report.queryData[i].SJ + "", Report.queryData[i].ZZ]);
                changedataFZ.push([Report.queryData[i].SJ + "", Report.queryData[i].FZL]);
                changedataZZ.push([Report.queryData[i].SJ + "", Report.queryData[i].ZZL]);
            }

            initTable(Report.queryData);
            initChart(title, chartdata, changedataFZ, changedataZZ, type, units);
            break;
    }
}



//初始化表格
function initTable(data) {
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
        'aaData': data,
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
                 { "mData": "SJ", "sTitle": "时间", "sWidth": "5%" },
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
                  {
                      "mData": "FZL", "sTitle": "发展率(%)", "sWidth": "10%"
                  },
                   {
                       "mData": "ZZL", "sTitle": "增长率(%)", "sWidth": "15%"
                   },
        ]
    });
    $("#btnExport").removeAttr("title");
    NProgress.done();
}
/**
* 绑定echart  折柱混合
* @author lishiwu 
* @param {string} title 图名称
* @param {string} chartdata柱状图数据
* @param {string} changedata 曲线图数据
* @param {string} type 类型根据不同的类型计算
* @param {string} units 单位
*/
var initChart = function (title, chartdata, changedataFZ, changedataZZ, type, units) {
    var myChart = echarts.init(document.getElementById('resultChart'));
    myChart.clear();
    option = {
        title: {
            text: title,
            x: 'center',
            padding: [10, 0, 0, 0]
        },
        grid: {
            left: '8%',
            right: '10%',
            top: 40,
        },
        legend: {
            data: ['当前数据', '环比发展率', '环比增长率'],
            right: 'right',
            top: 'center',
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
                var name = "时间:" + params[0].axisValue;
                var value = "值:" + params[0].data[1] + units;
                var changeFZ = "发展率" + params[1].data[1] + "%";
                var changeZZ = "增长率" + params[2].data[1] + "%";
                var marker = params[0].marker;
                return marker + name + "\<br>" + marker + value + "\<br>" + marker + changeFZ + "\<br>" + marker + changeZZ;
            },
        },
        xAxis: {

        },
        yAxis: [
            {
                name: "当前用水量(m³)",
                type: 'value',
                axisLabel: {
                    formatter: '{value}' + units,
                },
                position: "left",

            },
             {
                 name: "变化率",
                 axisLabel: {
                     formatter: '{value}' + "%",
                 },               
                 type: 'value',
                 position: "right",

             },
        ],
        series: [{
            name: "当前数据",
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 2,
            itemStyle: {
                normal: {
                    color: '#89A54E',
                    lineStyle: {
                        color: '#89A54E'
                    }
                }
            },
        }, {
            name: "环比发展率",
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#DA4F49',
                    lineStyle: {
                        color: '#DA4F49'
                    }
                }
            }
        },
        {
            name: "环比增长率",
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#41BDEE',
                    lineStyle: {
                        color: '#41BDEE'
                    }
                }
            }
        },
        ]
    };
    myChart.setOption(option);
    switch (type) {
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
                    name: '    时间',
                    type: 'category',
                    data: xdata,
                },
                series: [
                    {
                        data: chartdata
                    },
                      {
                          data: changedataFZ
                      },
                      {
                          data: changedataZZ
                      }
                ],
            }
            myChart.setOption(option);
            break;
        case "year":
            option = {
                xAxis: {
                    name: '    时间',
                    type: 'category',
                    data: xdata = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'
                    ]
                },
                series: [
                    {
                        data: chartdata
                    },
                    {
                        data: changedataFZ
                    },
                     {
                         data: changedataZZ
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
    var type = $("#compareType").val();
    var time = "";
    var title;
    switch (type) {
        case "yearAndyear":
            time = $("#txtYearTime").val();
            title = jcdName + time + "按月同比分析";
            break;
        case "monthAndmonth":
            time = $("#txtMonthTime").val();
            title = jcdName + time + "按日同比分析";
            break;
    }
    var pd = isIE();
    $("#form1").attr("action", "Handler.ashx?Action=ExportResultData&pd=" + pd + "&title=" + title);
    $("#form1").submit();
}


function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};