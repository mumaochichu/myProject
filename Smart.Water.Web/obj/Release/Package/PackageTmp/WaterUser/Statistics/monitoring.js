//树相关
var cityTree, treeObj = null, selectNode, zNodes = [];
//表格，表格数据，水表设备数据
var oTable = null, tabelData = [], saveWaterData = [], addData = [];
//服务URL
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var jcdID, jcxCode;//监测点,监测项编码
//图表、表标题、表纵轴计量单位，图表数据数组，图表横坐标数组,当前时间
var myChart, title = "", units = "m³", chartData = [], chartXdata = [],timeNow;

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
       check: {
        enable: true,
        chkStyle: "checkbox",
    },
    callback: {
        onCheck: zTreeOnCheck,//选中或者取消事件

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
    //初始化树
    initTree();
    //初始化图表和表格
    if (saveWaterData.length > 0) {
        tabelData = [];
        $("#btnExcel").removeAttr("disabled");
        initTableChart(0, saveWaterData[0]);
    } else {
        bindData(tabelData);
    }
    //点击添加监测
    $("#btnMonitoring").click(function () {
        //执行添加
        addSaveWater();
    });

    //点击导出
    $("#btnExcel").click(function () {
        if (tabelData.length > 0) {
            var temp = JSON.stringify(tabelData);
            $("#hidData").val(temp);
          
            $("#title").val("(" + timeNow + ")节水监测分析结果");
            var pd = isIE();
            $("#form1").attr("action", "Handler.ashx?Action=ExportMOResultData&pd=" + pd);
            $("#form1").submit();
        } else {
            noty({ text: "数据为空", type: "warning", layout: "topCenter", timeout: 2000 });
        }
    })

    top.NProgress.done();

})




//初始化树,刷新
function initTree() {
    zNodes = [];
    if (treeObj != null) {
        treeObj.destroy();
    }
    //获取SaveWater数据, 为saveWaterData变量初始化
    getSaveWater();
    //获取树，初始化树，需要先执行getSaveWater   
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
            $.each(nodes, function (ni, nv) {
                //判断是否创建营业所
                if (nv.isParent) {
                    $.each(nv.children, function (i, v) {
                        //判断营业所是否创建组，如果不创建不显示该营业所节点。
                        if (v.isParent) {
                            $.each(v.children, function (ii, vv) {
                                if (vv.isParent) {
                                    $.each(vv.children, function (iii, vvv) {
                                        if (saveWaterData.length > 0) {
                                            $.each(saveWaterData, function (iiii, vvvv) {
                                                if (vvvv.YSHID == vvv.id) {
                                                    treeObj.checkNode(vvv, true, true);
                                                    vvv.checkedOld = true;
                                                }
                                            })
                                        }
                                        vvv.icon = "../../js/jQuery/Plugins/zTree/css/zTreeStyle/img/diy/2.png"
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
            };


        }
    });

}
//获取SaveWater数据,为saveWaterData变量初始化
function getSaveWater() {
    saveWaterData = [];
    $.ajax({
        async: false,
        dataType: 'json',
        url: "Handler.ashx?Action=getSaveWater",
        success: function (result) {
            saveWaterData = result;
        }
    })
}

//分析树的变化，选出要新添加的用水户节点添加监测
function addSaveWater() {
   
    addData = [];
    var upLimit = $("#upLimit").val();   
    if (upLimit == "") {
        noty({ text: "请填写监测上限。", type: "warning", layout: "topCenter", timeout: 2000 });
    } else {
        var selectChanges = treeObj.getChangeCheckedNodes();
        $.each(selectChanges, function (i, v) {
            if (v.level == 3 && v.checked == true) {
                //备注字段1存储营业所组ID，备注字段2存储营业所ID,备注字段3存储根节点ID
                addData.push({ YSHID: v.id, YSHMC: v.name, SFJC: "", JCSX: upLimit, BYZD1: v.pId, BYZD2: v.getParentNode().pId, BYZD3: v.getParentNode().getParentNode().pId })
            }
        });

        if (addData.length > 0) {
            var temp = JSON.stringify(addData);
            $.ajax({
                async: false,               
                type:"Post",
                url: "Handler.ashx?Action=addSaveWater",
                data: { "temp": temp },
                success: function (result) {
                    if (result == "true") {
                        noty({ text: "监测添加成功。", type: "success", layout: "topCenter", timeout: 2000 });
                        //添加完成后刷新，树和从数据库重新取数据分析
                        initTree();
                        //初始化表格
                        if (oTable != null) {
                            if (myChart != null) {
                                myChart.clear();
                            }
                            oTable.fnDestroy();
                            oTable = null;
                        };
                        //初始化图表和表格
                        if (saveWaterData.length > 0) {
                            initTableChart(0, saveWaterData[0]);
                        } else {
                            bindData(tabelData);
                        }
                    } else {
                        noty({ text: "监测添加失败。", type: "warning", layout: "topCenter", timeout: 2000 });
                    }
                }
            })
        } else {
            noty({ text: "未添加新的用水户监测！。", type: "warning", layout: "topCenter", timeout: 2000 });
        }
    };
}

//根据传入的参数，取消监测，删除节水监测的表
function delSaveWater(id, level) {
    var notytext = "";
    switch (level) {
        case 0:
            notytext = "确定要取消所有监测吗？";
            break
        case 1:
            notytext = "确定要取消该营业所下所有用户的监测吗？";
            break
        case 2:
            notytext = "确定要取消该营业所组下所有用户的监测吗？";
            break
        case 3:
            notytext = "确定要取消该用户的监测吗？";
            break
    }

    confirm("<div class='notyContent'>" + notytext + "</div>",
        "information", function () {
            $.ajax({
                async: false,
                dataType: 'text',
                url: "Handler.ashx?Action=delSaveWater&id=" + id + "&level=" + level,
                success: function (result) {
                    if (result == "true") {
                        noty({ text: "监测取消成功。", type: "success", layout: "topCenter", timeout: 2000 });
                        //重新绘制树
                        initTree();
                        //初始化表格
                        if (oTable != null) {
                            if (myChart != null) {
                                myChart.clear();
                            }
                            oTable.fnDestroy();
                            oTable = null;
                        };
                        //初始化图表和表格
                        if (saveWaterData.length > 0) {

                            initTableChart(0, saveWaterData[0]);
                        } else {
                            bindData(tabelData);
                        }
                    } else {
                        noty({ text: "监测取消失败。", type: "warning", layout: "topCenter", timeout: 2000 });
                    }
                }
            })
        }, function () {
            //重新绘制树
            initTree()
        },
    '确定', '取消');

}

//节点点击事件，用于取消监测
function zTreeOnCheck(event, treeId, treeNode) {
    //根据点击的不同节点，判断是否已经监测并提示取消提示
  
    var nodeChanges = treeObj.getChangeCheckedNodes();
    var isback=false;
    if (nodeChanges.length != 0) {
        $.each(nodeChanges, function (i, v) {
            if (v.level == 3 && v.checked == false) {
                isback = true;
            }
        })        
    }
    if (isback) {
        var level = treeNode.level;
        if (level == 0) {
            if (treeNode.checked == false) {
                //取消所有监测
                delSaveWater(treeNode.id, level);
            }
        } else if (level == 1) {
            if (treeNode.checked == false) {
                //取消营业所监测
                delSaveWater(treeNode.id, level);
            }
        } else if (level == 2) {
            if (treeNode.checked == false) {
                //取消营业所组监测
                delSaveWater(treeNode.id, level);
            }
        } else if (level == 3) {
            if (treeNode.checked == false) {
                //取消用户监测
                delSaveWater(treeNode.id, level);
            }
        }
    }
   
};



/**
 *遍历监测的数据，查询并初始化、刷新，表格图表，自调用方式，遍历每个检测的用水户
 * @constructor 名称：initTableChart
 * @description 作用：绑定数据显示在表格和图表上,
 * @author lishiwu
 */
function initTableChart(i, v) {    
    //获取当前查询的用户关联的检测点编码
    $.ajax({
        type: "post",
        async: false,
        dataType: 'Text',
        url: 'Handler.ashx?Action=getJCD&id=' + v.YSHID,
        success: function (data) {
            jcdID = data;
            if (jcdID == "null") {
                //此处需提示当用户没有关联监测点时候提示
                //noty({ text: "", type: "warning", layout: "topCenter", timeout: 2000 });
            } else {
                chartXdata[i] = v.YSHMC;
                //获取监测项ID，成功后计算表格和图表数据
                var url = restUrl + "/iot/configs/v1?stationkey=" + jcdID;
                $.ajax({
                    dataType: "JSONP",
                    url: url,
                    async: false,
                    success: function (result) {                     
                        if (result.status == 500) {
                            noty({ text: "监测数据为空！", type: "warning", layout: "topCenter", timeout: 2000 });
                            return;
                        }
                        var data = result.data;
                        //匹配瞬时流量查询，801平台配置变化，此处也要变化
                        $.each(data, function (iii, vvv) {
                            if (vvv.TAG_DESC == "瞬时流量") {
                                jcxCode = vvv.TAG_CODE;
                                //units = vvv.UNITS;
                            } else {
                            }
                        });
                        var STATION_KEY = jcdID;
                        var TAG_KEY = jcxCode;
                        //取今天的时间
                        var sTime = moment().format('YYYY-MM-DD');
                        timeNow = sTime;
                        sTime = sTime + " 00:00:00";                      
                        var eTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        
                        //测试用时间                       
                        //var sTime = "2017-11-23 00:00:00"
                        //var eTime = "2017-11-23 18:59:59";
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
                        var queryUrl = restUrl + "/iot/historycharts/v1?starttime="
                              + sTime + "&endtime=" + eTime + "&stationkey=" + STATION_KEY + "&tagkey=" + TAG_KEY;
                        $.ajax({
                            url: queryUrl,
                            dataType: "JSONP",
                            type: "get",
                            success: function (result) {                           
                                if (result.status == 200) {
                                    var data = result.data;
                                    var value = 0;                                 
                                    if (data.length > 1) {
                                        value = parseFloat(data[1].value);
                                    }
                                    $.each(data, function (ii, vv) {
                                        if (ii > 1) {
                                            value += parseFloat(vv.value);
                                        }
                                    });
                                   
                                    chartData[i] = [v.YSHMC, value,v.JCSX];
                                    tabelData[i] = { YSHMC: v.YSHMC, STIME: sTime, ETIME: eTime, VALUE: value, UPLIMITI: v.JCSX, ISCB: "" };
                                    if (parseFloat(v.JCSX) < value) {
                                        tabelData[i].ISCB = "超标";
                                    } else {
                                        tabelData[i].ISCB = "未超标";
                                    }
                                    if (i == saveWaterData.length - 1) {
                                        //绑定图表
                                        bindChart(chartXdata, chartData);
                                        //绑定表格
                                        bindData(tabelData);
                                        //重新初始化值
                                        chartData = []; chartXdata = [];
                                    } else {                                      
                                        ++i;
                                        initTableChart(i, saveWaterData[i]);
                                    }
                                }
                                if (result.status == 500) {
                                    noty({ text: result.data, type: "warning", layout: "topCenter", timeout: 2000 });
                                }
                            }
                        });
                    },
                    error: function (msg) {
                        return "";
                    }
                });
            }

        }
    });
    //停止进度条，初始化点击空白处，收缩二级菜单事件
    $(".ui-layout-container").click(function () {
        if (top.$("#user-nav > ul >li").hasClass("open")) {
            top.$("#user-nav > ul >li").removeClass("open");
        }
    });
    top.NProgress.done();
}

/**
* 绑定chart
* @author CodingMan
* @param {string} stationKey 监测点编号
* @param {string} tagKey     监测项编号
* @param {string} title 曲线名称
*/

function bindChart(chartXdata, chartData) {
    //初次初始化
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
                var data = params[0].data[1];
                var jcsx = params[0].data[2]
                return marker + "名称：" + axisValue + "<br/>"+marker+"监测上限:"+jcsx+units+'<br/>' + marker + seriesName + ":" + data + units ;
            },
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                //magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis:
            {
                type: 'category',
                data: chartXdata,
            }
        ,
        yAxis:
            {
                type: 'value',
                nameLocation: 'middle',
                axisLabel: {
                    formatter: '{value}' + units,
                },
                scale: true,
                min: 0,
            }
        ,
        series: [{
            type: "bar",
            name: "日累计流量",
            barMaxWidth: "20px",
            itemStyle: {
                normal: {
                    color: '#89A54E',
                    lineStyle: {
                        color: '#89A54E'
                    }
                }
            },
            data: chartData,

        }]
    };
    myChart.setOption(option);
    //去重复计算markLine数组,并将最大监测上限存储到markline[0]中；
    var markline = [];
    var ishave = false;
    if (tabelData.length > 0) {
        markline[0] = parseFloat(tabelData[0].UPLIMITI);
        $.each(tabelData, function (i, v) {
            if (i > 0) {
                $.each(markline, function (ii, vv) {
                    if (parseFloat(v.UPLIMITI) == vv) {
                        ishave = true
                    }
                })
                if (!ishave) {
                    if (parseFloat(v.UPLIMITI) > markline[0]) {
                        var a = markline[0];
                        markline[0] = parseFloat(v.UPLIMITI);
                        markline[i] = a;
                    } else { markline[i] = parseFloat(v.UPLIMITI) }
                }
            }
        })
    }
    //计算监测数据中最大的一个值   
    var maxValue;
    if (chartData.length > 0) {
        maxValue = parseFloat(chartData[0][1]);
        $.each(chartData, function (i, v) {
            if (i > 0) {
                if (maxValue > parseFloat(v[1])) {

                } else {
                    maxValue = parseFloat(v[1]);
                }
            }

        })
    }

    var max = markline[0];
    max = max < maxValue ? maxValue : max;
    if (markline.length > 0) {
        option = {
            yAxis: {
                max: max,
            },
            series: [
                {
                    markLine: {
                        silent: true,
                        data: function () {
                            var datas = [];
                            $.each(markline, function (i, v) {
                                datas.push({
                                    yAxis: v, itemStyle: { normal: { color: '#dc143c' } }, label: {
                                        normal: {
                                            formatter: v + units + '/参考上限',
                                        }
                                    },
                                });
                            })
                            return datas;
                        }(),

                    }

                }
            ],
        }
        myChart.setOption(option);
    }

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
                { "mData": "YSHMC", "sTitle": "用户名称", "sWidth": "20%" },
                 { "mData": "STIME", "sTitle": "起始时间", "sWidth": "15%" },
                {
                    "mData": "ETIME", "sTitle": "结束时间", "sWidth": "15%"
                },
                {
                    "mData": "VALUE", "sTitle": "日累计水量(m³)", "sWidth": "10%",
                },
                { "mData": "UPLIMITI", "sTitle": "参考上限(m³)", "sWidth": "10%" },
                { "mData": "ISCB", "sTitle": "是否超标", "sWidth": "10%" }
        ],
        "rowCallback": function (row, data, index) {
            if (data.ISCB == "超标") {
                $(row).css('background-color', '#ebaeac');
            }
        }
    });
};







//判断是否为IE浏览器
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return "true";
    else
        return "false";
};

/*
 * 装载模块到主页面中。
 * @author Robin
 * @param {String} id 主键ID。
 * @param {String} category 文件大类是必须和ftppathxml.xml中的pathtype对应的，且必须要对应Upload下的文件夹名称，三者一致
 * @param {String} SMALLNAME 子文件类别。
 */
/**
* confirm提示.需要提前加载noty.这个方法放在utils里会报错
* 需要引用js/Bootstrap/Version3/css/bootstrap-button.css，js/Noty/packaged/jquery.noty.packaged.min.js
* @param message 提示的内容
* @param type 类型information,alert,error,success,warning
* @param okCallback yes执行的方法
* @param cancelCallback no执行的方法
* @param lblok yes显示的内容
* @param lblcancel no显示的内容
* @constructor
*/
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