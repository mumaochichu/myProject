//树相关
var cityTree, treeObj, selectNode, zNodes = [];
//表格，表格数据，水表设备数据
var oTable = null, queryData = [], waterMeterData;
//服务URL
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var jcdID, jcxCode;//监测点,监测项编码
//图表、表标题、表纵轴计量单位
var myChart, title = "", units,tableTitle;

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
    var date = new Date();
    $('#startTime').val(moment(date).format('YYYY-MM'));
    //初始化查询按钮不能点击
    $("#btnQuery").attr("disabled", true);
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
                                        vvv.icon = "../../js/jQuery/Plugins/zTree/css/zTreeStyle/img/diy/2.png"
                                        if (threenote == true) {
                                            var zTree = $.fn.zTree.getZTreeObj("cityTrees");//获取ztree对象                                        
                                            zTree.selectNode(vvv);//选择点  
                                            zTree.setting.callback.onClick(null, zTree.setting.treeId, vvv);//调用事件 
                                            threenote = false;
                                        }
                                    })
                                } else {
                                    vv.icon = "../../js/jQuery/Plugins/zTree/css/zTreeStyle/img/diy/3.png"
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
    //获取页面加载时获取水表设备，执行一次
    getWaterMeterData();

    //点击查询
    $("#btnQuery").click(function () {
        if ($('#startTime').val() == "") {
            noty({ text: "时间不能为空", type: "warning", layout: "topCenter", timeout: 5000 });
            return;
        }
        $("#btnExcel").removeAttr("disabled");
        //重置表格数据
        queryData = [];
        //初始化表格
        if (oTable != null) {
            //解除点击事件绑定
            $("#psTable tbody").unbind();
            //去除行样式
            oTable.$('tr').removeClass('success');
            myChart.clear();
            oTable.fnDestroy();
            oTable = null;
        };
        query();
        
    });
    //点击导出
    $("#btnExcel").click(function () {
        if (queryData.length > 0) {        
            var temp = JSON.stringify(queryData);
            $("#hidData").val(temp);   
            $("#title").val(tableTitle);
            var pd = isIE();
            $("#form1").attr("action", "Handler.ashx?Action=ExportResultData&pd=" + pd);
            $("#form1").submit();
        } else {
            noty({ text: "请先查询数据", type: "warning", layout: "topCenter", timeout: 2000 });
        }
    })
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
    $("#btnQuery").attr("disabled", true);
    $("#btnQuery").attr("title", "请选择用水户");
    $("#btnExcel").attr("title", "请先进行查询");   
    if (treeNode.level == 3) {
        $("#btnQuery").removeAttr("disabled");
        $("#btnQuery").removeAttr("title");        
    }
}

//获取页面加载时获取水表设备，执行一次
function getWaterMeterData() {
    $.ajax({
        async: false,
        url: 'Handler.ashx?Action=getWaterMeter',
        success: function (data) {
            waterMeterData = eval('(' + data + ')');
        }
    })

}
//页面加载自动查询
function start() {
    $("#btnExcel").removeAttr("disabled");
    //重置表格数据
    queryData = [];
    //初始化表格
    if (oTable != null) {
        //解除点击事件绑定
        $("#psTable tbody").unbind();
        //去除行样式
        oTable.$('tr').removeClass('success');
        myChart.clear();
        oTable.fnDestroy();
        oTable = null;
    };
    query();
}
//点击查询
function query() {
    //获取用户ID
    var id = selectNode.id;
    //获取当前查询的用户关联的检测点编码
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
                    title = v.BMMC + "-瞬时流量";
                    tableTitle = v.BMMC;
                } else {

                }
            });
        }
    })
    //根据监测点编码获取瞬时流量检测项编码,成功后并传入参数直接构建图表
    if (jcdID == "0") {
        noty({ type: "warning", text: "该用户未关联监测点!", layout: "topCenter", timeout: 2000 });
        return;
    } else {
        getJCX(jcdID);
    }
    $("#btnExcel").removeAttr("title");
}


//根据传入的设备数据参数和查询的监测结果数据计算百分比,并初始化表格
function analysis(waterMeterData, queryJCdata) {
    var countZXYX, countZXFJ, countFJCY, countCYZD, countZDYS;
    var count = queryJCdata.length - 1;
   
    $.each(waterMeterData, function (i, v) {
        countZXYX = countZXFJ = countFJCY = countCYZD = countZDYS = 0;        
        $.each(queryJCdata, function (ii, vv) {
            if (ii > 0) {
                if (parseFloat(vv.value) > parseFloat(v.ZDLL)) {
                    countZDYS++;
                } else if (parseFloat(vv.value) > parseFloat(v.CYLL)) {
                    countCYZD++;
                } else if (parseFloat(vv.value) > parseFloat(v.FJLL)) {
                    countFJCY++;
                } else if (parseFloat(vv.value) > parseFloat(v.ZXLL)) {
                    countZXFJ++;
                } else {
                    countZXYX++;
                }
            }
        });
       
        queryData.push({
            BMXH: waterMeterData[i].SBXH,
            ZXYX: roundFun(countZXYX, count),
            ZXFJ: roundFun(countZXFJ, count),
           
            FJCY: roundFun(countFJCY, count),
            CYZD: roundFun(countCYZD, count),
            ZDYS: roundFun(countZDYS, count),
            KJ: waterMeterData[i].GCKJ,
            JL: function () {
                var result = ""
                if (parseFloat(waterMeterData[i].GCKJ) > 50) {
                    result="大口径"
                } else if (parseFloat(waterMeterData[i].GCKJ) > 40) {
                    result = "中口径"
                } else{
                    result = "小口径"
                }
                
                if (countZXYX > countZXFJ && countZXYX > countFJCY && countZXYX > countCYZD && countZXYX > countZDYS) { result += "小流量" }
                else if (countZXFJ >= countZXYX && countZXFJ > countFJCY && countZXFJ > countCYZD && countZXFJ > countZDYS) { result += "小流量" }
                else if (countFJCY >= countZXFJ && countFJCY > countZXYX && countFJCY > countCYZD && countFJCY > countZDYS) { result += "中流量" }
                else if (countCYZD > countZXFJ && countCYZD >= countFJCY && countCYZD > countZXYX && countCYZD > countZDYS) { result += "大流量" } else { result += "大流量" }
                return result;
            }(),
        });
    });

    oTable = $('#psTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },
        "bJQueryUI": true,
        "sDom": '<""l>t<"F"fp>',
        'aaData': queryData,
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
                 { "mData": "BMXH", "sTitle": "表具型号", "sWidth": "15%" },
                 {
                     "mData": "KJ", "sTitle": "口径(mm)", "sWidth": "10%"
                 },
                 {
                     "mData": "ZXYX", "sTitle": "最小以下", "sWidth": "10%"
                 },
                 { "mData": "ZXFJ", "sTitle": "最小-分界", "sWidth": "10%" },
                 {
                     "mData": "FJCY", "sTitle": "分界-常用", "sWidth": "10%"
                 },
                { "mData": "CYZD", "sTitle": "常用-最大", "sWidth": "10%" },
                 {
                     "mData": "ZDYS", "sTitle": "最大以上", "sWidth": "10%"
                 },
                 { "mData": "JL", "sTitle": "结论", "sWidth": "15%" },
        ]
    });
    //添加行点击事件
    $("#psTable tbody").on('click', 'tr', function (event) {
        if ($(this).hasClass('success')) {
            $(this).removeClass('success');
        } else {
            oTable.$('tr.success').removeClass('success');
            $(this).addClass('success');
        }
        var aData = oTable.fnGetData(event.target.parentNode);
        var SBXH = aData.BMXH;
        $.each(waterMeterData, function (i, v) {
            if (SBXH == v.SBXH) {
                myChart.setOption({
                    yAxis: {
                        max: v.ZDLL
                    },
                    series: [{
                        markLine: {
                            silent: true,
                            data: [
                                {
                                    name: "最大流量", yAxis: v.ZDLL, itemStyle: { normal: { color: '#7FFF00' } }, label: {
                                        normal: {
                                            formatter: v.ZDLL +units+ '/最大流量'
                                        }
                                    }
                                },
                                {
                                    name: "最小流量", yAxis: v.ZXLL, itemStyle: { normal: { color: '#dc143c' } }, label: {
                                        normal: {
                                            formatter: v.ZXLL + units + '/最小流量'
                                        }
                                    },
                                },
                                {
                                    name: "常用流量", yAxis: v.CYLL, itemStyle: { normal: { color: '#1e90ff' } }, label: {
                                        normal: {
                                            formatter: v.CYLL + units + '/常用流量'
                                        }
                                    },
                                },
                                {
                                    name: "分界流量", yAxis: v.FJLL, itemStyle: { normal: { color: '#4B0082' } }, label: {
                                        normal: {
                                            formatter: v.FJLL + units + '/分界流量'
                                        }
                                    },
                                },
                            ],
                        }
                    }],

                });
            }
        })
    });
}

//根据监测点编码获取瞬时流量检测项编码,成功后并传入参数直接构建图表
function getJCX(jcdCode) {
    NProgress.start();
    if (jcdCode != "null") {
        var url = restUrl + "/iot/configs/v1?stationkey=" + jcdCode;
        $.ajax({
            dataType: "JSONP",
            url: url,
            cache: false,
            async: false,
            success: function (result) {
                if (result.status == 500) {
                    alert(result.data);
                    return;
                }
                var data = result.data;
                //匹配瞬时流量查询，801平台配置变化，此处也要变化
                $.each(data, function (i, v) {
                    if (v.TAG_DESC == "瞬时流量") {
                        jcxCode = v.TAG_CODE;
                        units = v.UNITS;
                    } else {
                    }
                });
                var type = "瞬时流量";
                historyChart(jcdID, jcxCode, "#startTime", "#endTime", title, units, type);
            },
            error: function (msg) {
                alert("获取监测项列表失败!");
                return "";
            }
        });
    } else {
        return;
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
    var startTime = $(start).val();
    var dayCount = new Date(startTime.split("-")[0], startTime.split("-")[1], 0).getDate();
    startTime += "-01";
    var endTime = $(start).val() + "-" + dayCount;
    var startNow, endNow;
    if (startTime == "" || endTime == "") {
        noty({ text: "请选择开始时间和结束时间", type: "warning", layout: "topCenter", timeout: 2000 });
        NProgress.done();
        return;
    }
    startTime = moment(startTime).format('YYYY-MM-DD');
    endTime = moment(endTime).format('YYYY-MM-DD');

    if (startTime != "" && endTime != "") {
        if (endTime <= startTime) {
            noty({ text: "结束时间不能小于开始时间", type: "warning", layout: "topCenter", timeout: 2000 });
            NProgress.done();
            return;
        }
    }

    myChart = echarts.init(document.getElementById('resultChart'));
    option = {
        title: {
            text: title + '(' + startTime + '至' + endTime + ')',
            x: 'center',
            padding: [10, 0, 0, 0]
        },      
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
            name: '时间',
        },
        yAxis: {
            type: 'value',
            name: '瞬时流量(' + units + ')',
            nameLocation: 'end',
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
                if (data.length>1) {
                    //传入监测数据和，设备数据，进行分析并初始化表格
                    analysis(waterMeterData, data);

                    var seriesData = []
                    $.each(data, function (i, v) {
                        if (i > 0) {
                            seriesData.push([(new Date(v.year, v.month, v.day, v.hour, v.mis, v.ss)).getTime(), parseFloat(v.value)]);
                        }
                    });
                    myChart.setOption({
                        series: [{
                            data: seriesData,
                        }]
                    });
                   
                } else {
                    data = [];
                    analysis(waterMeterData, data);
                    noty({ text:"当前月份无数据！", type: "warning", layout: "topCenter", timeout: 2000 });
                }
                NProgress.done();
            }
            if (result.status == 500) {
                NProgress.done();
                noty({ text: result.data, type: "warning", layout: "topCenter", timeout: 2000 });
            }
        }
    });
};
//传入两个数计算百分比，四舍五入，
function roundFun(a, b) {
    numberRound = a / b; 
    var s=numberRound.toFixed(2)
    numberRound = s * 100 + "%";
    return numberRound;   
}


//判断是否为IE浏览器
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};