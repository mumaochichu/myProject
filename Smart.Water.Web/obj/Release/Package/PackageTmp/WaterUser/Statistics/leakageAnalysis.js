//树相关
var cityTree, treeObj, selectNode, zNodes = [];
//表格，表格数据，水表设备数据
var oTable = null, queryData = []
//服务URL
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;

var jcdID, jcxCode,jcdName;//监测点,监测项编码
//图表、表标题、表纵轴计量单位
var myChart, title = "", units = "m³", upLimit = '100';
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
    //初始化查询按钮不能点击
    $("#btnQuery").attr("disabled", true);
    var date = new Date();
    $('#startTime').val(moment(date).format('YYYY-MM'));
    $('#upLimit').val("10");
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

    $("#btnQuery").click(function () {
        if ($("#startTime").val() == "") {
            noty({ text: "时间不能为空", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        NProgress.start();
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
                        title = v.BMMC + "（" + $("#startTime").val() + "）漏水分析";
                        jcdName = v.BMMC;
                    } else {

                    }
                });
            }
        });

        //重置表格数据
        queryData = [];
        //初始化表格
        if (oTable != null) {
            myChart.clear();
            oTable.fnDestroy();
            oTable = null;
        };       
        if ($("#upLimit").val() != "") {
            upLimit = $("#upLimit").val();
        } else {
            upLimit = '100'
        }
        //根据监测点编码获取累计流量检测项编码,并执行查询，初始化表格
        getJCX(jcdID);
    });

    //导出分析结果
    $("#btnExcel").click(function () {
        if (queryData.length > 0) {
            var temp = JSON.stringify(queryData);
            $("#hidData").val(temp);
            $("#title").val(title);
            var pd = isIE();
            $("#form1").attr("action", "Handler.ashx?Action=ExportanylisisResultData&pd=" + pd);
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
    $("#btnExcel").attr("disabled", true);
    $("#btnQuery").attr("title", "请先选择用水户");
    $("#btnExcel").attr("title", "请先进行查询");
    if (treeNode.level == 3) {
        $("#btnQuery").removeAttr("disabled");
        $("#btnQuery").removeAttr("title");
        $("#btnExcel").attr("title", "请先进行查询");
    }
}

//页面加载自动查询
function start() {
    if ($("#startTime").val() == "") {
        noty({ text: "时间不能为空", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    NProgress.start();
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
                    title = v.BMMC + "（" + $("#startTime").val() + "）漏水分析";
                    jcdName = v.BMMC;
                } else {

                }
            });
        }
    });

    //重置表格数据
    queryData = [];
    //初始化表格
    if (oTable != null) {
        myChart.clear();
        oTable.fnDestroy();
        oTable = null;
    };
    if ($("#upLimit").val() != "") {
        upLimit = $("#upLimit").val();
    } else {
        upLimit = '100'
    }
    //根据监测点编码获取累计流量检测项编码,并执行查询，初始化表格
    getJCX(jcdID);
}

//根据监测点编码获取瞬时流量检测项编码,并执行查询，初始化表格
function getJCX(jcdCode) {
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
                        //units = v.UNITS;
                    } else {
                    }
                });
                query();
            },
            error: function (msg) {
                return "";
            }
        });
    } else {
        return;
    }
};
/**
 * @constructor 名称：query
 * @description 作用：查询历史数据
 * @author 作者
 */
function query() {

    var STATION_KEY = jcdID;
    var TAG_KEY = jcxCode;
    var sTime = $("#startTime").val();
    var year = sTime.substring(0, 4);
    var month = sTime.substring(5, 7);
    var dayCount = getLastDay(year, month);
    eTime = sTime + " " + dayCount;
    sTime = sTime + " 01";


    if (!STATION_KEY) {
        noty({ text: "监测点参数为空！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    if (!TAG_KEY) {
        noty({ text: "检测项参数为空！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    if (!sTime || !eTime) {
        noty({ text: "时间参数不能为空！", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    eTime = moment(eTime).format('YYYY-MM-DD HH:MM:SS');
    sTime = moment(sTime).format('YYYY-MM-DD HH:MM:SS');
    //初始化图表以后调用初始化表格
    bindChart(jcdID, jcxCode, sTime, eTime, title, units, "一天用水量", dayCount);
    $("#btnExcel").removeAttr("title");
    $("#btnExcel").removeAttr("disabled");
};

/**
 * @constructor 名称：bindData
 * @description 作用：绑定数据显示在表格上
 * @author codingman
 */
function bindData(Data) {
    //初始化表格
    oTable = $('#psTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },
        "bJQueryUI": true,
        "sDom": '<""l>t<"F"fp>',
        'aaData': Data,
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,                         //是否支持排序功能    
        'bLengthChange': false,                  //是否允许用户自定义每页显示条数。
        "iDisplayLength": 10,  //每页显示的行数
        "sScrollY": 100, //DataTables的高  
        'sPaginationType': 'full_numbers',      //分页样式            
        "aoColumns": [

                 { "mData": "BMMC", "sTitle": "监测点名称", "sWidth": "15%" },
                   { "mData": "YHNAME", "sTitle": "用户名称", "sWidth": "20%" },
                {
                    "mData": "TIME", "sTitle": "时间", "sWidth": "15%"
                },              
                {
                    "mData": "VALUE", "sTitle": "一天用水量(m³)", "sWidth": "10%",
                },
                { "mData": "UPLIMITI", "sTitle": "参考上限(m³)", "sWidth": "10%" },
                { "mData": "ISLS", "sTitle": "是否漏水", "sWidth": "10%" }
        ],
        "rowCallback": function (row, data, index) {
            if (data.ISLS == "泄露") {
                //$(row).css('background-color', '#D27B76');
                $(row).css('background-color', '#ebaeac');
            } 
        }
    });
    NProgress.done();
};


/**
* 绑定chart
* @author CodingMan
* @param {string} stationKey 监测点编号
* @param {string} tagKey     监测项编号
* @param {string} title 曲线名称
*/
var bindChart = function (stationKey, tagKey, start, end, title, units, type, dayCount) { 
    myChart = echarts.init(document.getElementById('resultChart'));
    option = {
        title: {
            text: title,
            x: 'center',
            padding: [10, 0, 0, 0]
        },
        grid: {
            left: '8%',
            right: '8%',
            top: 50,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter: function (params) {
                var marker = params[0].marker;
                var axisValue = params[0].axisValue;
                var seriesName = params[0].seriesName;
                var data = params[0].data;
                return marker + "时间：" + axisValue + '<br/><b>' + marker + seriesName + ":" + data + units+'</b>';
            },
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis:
            {
                type: 'category',
                name: '时间',
            }
        ,
        yAxis:
            {
                type: 'value',
                name:'用水量(m³)',
                nameLocation: 'end',
                axisLabel: {
                    formatter: '{value}' + units,
                },
                scale: true,
            }
        ,
        series: [{
            type: "bar",
            name: type,
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
           + start + "&endtime=" + end + "&stationkey=" + stationKey + "&tagkey=" + tagKey;
    $.ajax({
        url: queryUrl,
        dataType: "JSONP",
        type: "get",
        success: function (result) {
            if (result.status == 200) {
                var data = result.data;
                var seriesData = [];
                var nanysisData = [];
                var xlist = [];
                for (var j = 0; j < dayCount; j++) {
                    nanysisData[j] = { value: 0 }
                }
                var y, m;
                if (data.length >1) {
                    y = data[1].year;
                    m = parseFloat(data[1].month) + 1;

                    $.each(data, function (i, v) {
                        if (i > 0) {
                            for (var j = 0; j < dayCount; j++) {
                                if (v.day == '' + j + '') {
                                    var s = parseFloat(v.value);
                                    nanysisData[j].value += s;
                                }
                            }

                        }
                    });
                    for (var i = 0; i < dayCount; i++) {
                        xlist[i] = m + "-" + (i + 1);
                    }
                    var max = 0;
                    for (var k = 0; k < nanysisData.length; k++) {
                        max = max > parseFloat(nanysisData[k].value) ? max : parseFloat(nanysisData[k].value);
                        seriesData.push(parseFloat(nanysisData[k].value));
                        //构造表格数据                 
                        queryData.push({
                            BMMC: jcdName,
                            YHNAME: selectNode.name,
                            TIME: xlist[k],
                            VALUE: parseFloat(nanysisData[k].value),
                            UPLIMITI: upLimit,
                            ISLS: parseFloat(nanysisData[k].value) > parseFloat(upLimit) ? "泄露" : "正常"
                        });
                    }
                    if (max > parseFloat(upLimit)) {

                    } else {
                        max = parseFloat(upLimit);
                    }
                    option = {
                        xAxis: {
                            data: xlist,
                        },
                        yAxis: {
                            max: max,
                        },
                        series: [
                            {
                                data: seriesData,
                                markLine: {
                                    silent: true,
                                    data: [
                                        {
                                            name: "分界流量", yAxis: upLimit, itemStyle: { normal: { color: '#dc143c' } }, label: {
                                                normal: {
                                                    formatter: upLimit + units + '/参考上限',
                                                }
                                            },
                                        },
                                    ],
                                }

                            }
                        ],
                    }
                    myChart.setOption(option);                   
                } else {
                    NProgress.done();
                    noty({ text: "监测数据为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                    queryData = [];                    
                }               
                //初始化表格               
                bindData(queryData);
            }
            if (result.status == 500) {
                NProgress.done();
                noty({ text: result.data, type: "warning", layout: "topCenter", timeout: 2000 });
            }
        }
    });
};





//获取每个月最后一天
function getLastDay(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}
//判断是否为IE浏览器
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};