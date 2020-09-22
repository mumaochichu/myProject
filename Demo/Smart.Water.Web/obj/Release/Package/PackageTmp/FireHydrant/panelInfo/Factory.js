var Units = "";
var StationKey = "";
var Name = "";
var oTable, queryData;
$(function () {
    StationKey = GetQueryString("StationKey");
    Name = GetQueryString("Name");
    var url = 'Handler.ashx?Action=GetInfo&Name=' + Name;
    $("#queryTime").val(moment().format('YYYY-MM'));
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        success: function (result) {
            var result = JSON.parse(result);
            if (result != null) {
                $("#txt_CODE").text(result.CODE);//管点编号
                $("#txt_CALIBER").text(result.CALIBER + "mm");//口径
                $("#txt_BURYMODE").text(result.BURYMODE);//埋设方式
                $("#txt_MANUFACTURER").text(result.MANUFACTURER);//生产厂家
                $("#txt_ACTIVATETIME").text(result.ACTIVATETIME == null ? "" : result.ACTIVATETIME.Value.ToString("yyyy-MM-dd"));//建成年月
                $("#txt_ADDRESS").text(result.ADDRESS == null ? "" : result.ADDRESS);//地址
                $("#txt_STATUS").text(result.STATUS);//使用状态
                $("#txt_X").text(result.X == null ? "" : result.X);//X坐标
                $("#txt_Y").text(result.Y == null ? "" : result.Y);//Y坐标
                $("#txt_LASTMAINTENTIME").text(result.LASTMAINTENTIME == null ? "" : result.LASTMAINTENTIME.replace("T", " "));//最后维保时间
                $("#txt_CHARGE").text(result.CHARGE == null ? "" : result.CHARGE);//负责人
                $("#txt_PHONENUMBER").text(result.PHONENUMBER == null ? "" : result.PHONENUMBER);//负责人电话
                $("#txt_MAINTENUNITNAME").text(result.MAINTENUNITNAME == null ? "" : result.MAINTENUNITNAME);//维保单位
                $("#txt_MAINTENCYCLE").text(result.MAINTENCYCLE == null ? "" : result.MAINTENCYCLE + "个月");//维保周期
                $("#txt_WELLDEPTH").text(result.WELLDEPTH == null ? "" : result.WELLDEPTH + "m");//井深
            }
        },
        error: function (e) {
            //alert(e);
        }
    });
    changeJCX(StationKey);

    //tab2
    var asTable;
    /*列表信息*/
    asTable = $('#asTable').dataTable({
        "oLanguage": {
            "sUrl": "../../js/jQuery/Plugins/DataTables/dataTables.chinese.txt"
        },
        "bServerSide": true,
        "bAutoWidth":false,
        "sAjaxSource": "Handler.ashx?Action=Maintenance",      //mvc后台ajax调用接口
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,
        "iDisplayLength": 8,  //每页显示的行数
        "bLengthChange": false,//允许用户从一个选择菜单中格式化页面大小(改变页面显示的数据数量)
        'sPaginationType': 'full_numbers',      //分页样式
        "fnServerParams": function (aoData) {
            aoData.push({
                "name": "Name", "value": Name
            });
        },
        "aoColumns": [         
            {
                "mData": "MAINTENTYPE", "sTitle": "消火栓类型", "sWidth": "12%" 
            },
            {
                "mData": "UNITNAME", "sTitle": "维保单位", "sWidth": "20%", "cellsAlign": "center",
            },
            {
                "mData": "PERSONELNAME", "sTitle": "维保人员", "sWidth": "15%"
            },
            {
                "mData": "MAINTENTIME", "sTitle": "维保时间", "sWidth": "25%",
                "mRender": function (data, type, full) {
                    if (data) {
                        var dtStart = full.WHSJ;
                        var dtStartWrapper = moment(dtStart);
                        return dtStartWrapper.format('YYYY-MM-DD');
                    }
                    else {
                        return "";
                    }
                }
            },
            { "mData": "RESULT", "sTitle": "保养结果", "sWidth": "28%" }          
        ]
    });

    $("#qx").click(function () {
        $('#lsqx_a').css({ "color": '#3d95e2' });
        $('#home_a').css({ "color": '#59626b' });
        $('#wbjl_a').css({ "color": '#59626b' });
        $('#form1').css({ "display": 'block' });
    });
    $("#homeli").click(function () {
        $('#home_a').css({ "color": '#3d95e2' });
        $('#lsqx_a').css({ "color": '#59626b' });
        $('#wbjl_a').css({ "color": '#59626b' });
        $('#form1').css({ "display": 'none' });
    });
    $("#wb").click(function () {
        $('#wbjl_a').css({ "color": '#3d95e2' });
        $('#home_a').css({ "color": '#59626b' });
        $('#lsqx_a').css({ "color": '#59626b' });
        $('#form1').css({ "display": 'none' });
    });

    //tab3





    //查询历史数据
    $("#btnQuery").click(function () {
        $('#lsqxhome').show();
        $('#charts').hide();
        query();
    });
    GetUnits();
    //取监测项单位
    $("#JCXList").change(function () {
        GetUnits();
    });
    //初始状态，默认查询出前三天的数据
    $('#lsqxhome').show();
    $('#charts').hide();
    query();
    //查询历史曲线
    $("#btnCharts").click(function () {
        $('#charts').show();
        $('#lsqxhome').hide();
        var tagKey = $("#JCXList").find('option:selected').val();
        var tagName = $("#JCXList").find('option:selected').text();
        var title = Name + '-' + $("#JCXList").find('option:selected').text();
        var monitorType = top.Robin.Setting.GlobalSetting.MonitorType;
        if (StationKey && StationKey.substr(6, 6) == '011197') {
            noty({ text: "雨量站不显示曲线", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        var queryTime = $("#queryTime").val();      
        var sTime = queryTime + "-01 00:00:00";
        var days = moment(queryTime, "YYYY-MM").daysInMonth()
        var eTime = queryTime + "-" + days + " 23:59:59";
        //var reg = /-| |:/g;
        //var sTimeCopy = sTime.replace(reg, '');
        //var eTimeCopy = eTime.replace(reg, '');
        debugger;
        historyChart(StationKey, tagKey, sTime, eTime, title, Units, $("#JCXList").find('option:selected').text());
    });
})

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var JCXArray = [];

/*查询监测项数据*/
function changeJCX(cityCode) {
    $("#JCXList").empty();
    if (cityCode != "null") {
        var ii = 0;      
        $.each(top.Robin.Data.config, function (i, v) {
            if (v.STATION_KEY == cityCode) {                
                JCXArray.push(v);
                if (ii == 0) {
                    //赋值，默认第一项
                    $("#JCXList").append('<option value="' + v.TAG_CODE + '">' + v.TAG_DESC + '</option>');
                    $("#JCXList").val(v.TAG_CODE);
                    Units = v.UNITS;
                } else {
                    $("#JCXList").append('<option value="' + v.TAG_CODE + '">' + v.TAG_DESC + '</option>');
                }
                ii++;
            }
        });
    }
};

//得到监测项单位
function GetUnits() {
    var tagKey = $("#JCXList").find('option:selected').val();
    $.each(JCXArray, function (i, v) {
        if (v.TAG_CODE == tagKey) {
            Units = (v.UNITS == null) ? "" : v.UNITS;
        }
    });
}

/*查询数据*/
function query() {
    NProgress.start();
    var TAG_KEY = $("#JCXList").val();
    var queryTime = $("#queryTime").val();   
    var sTime = queryTime + "-01 00:00:00";
    var days= moment(queryTime, "YYYY-MM").daysInMonth()
    var eTime = queryTime + "-" + days+" 00:00:00";
    if (!StationKey) {
        NProgress.done()
        parent.noty({ text: '由于历史数据较多，会造成内存不足，无法导出报表，请选择监测项！', type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    if (!TAG_KEY) {
        NProgress.done()
        parent.noty({ text: '由于历史数据较多，会造成内存不足，无法导出报表，请选择监测项！', type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    if (!sTime || !eTime) {
        NProgress.done()
        parent.noty({ text: '起止时间不能为空', type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    bindData();
};

/**
 * @constructor 名称：bindData
 * @description 作用：绑定数据显示在表格上
 * @author codingman
 */
function bindData(data) {
    queryData = [];
    var bmmc = "", tagName = "", units = "", isFind = false;
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
        //'data': queryData,
        'bPaginate': true,                      //是否分页。
        "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
        'bFilter': false,                       //是否使用内置的过滤功能。
        "bSort": false,                         //是否支持排序功能    
        'bLengthChange': false,                  //是否允许用户自定义每页显示条数。
        "iDisplayLength": 8,  //每页显示的行数
        'sPaginationType': 'full_numbers',      //分页样式    
        'bDeferRender': "bootstrap",  //渲染样式：Bootstrap和jquery-ui
        //'bServerSide': true,  //启用服务器端分页
        ajax: function (data, callback, settings) {
            NProgress.start();
            //ajax请求数据
            var TAG_KEY = $("#JCXList").val();
            var queryTime = $("#queryTime").val();
            var sTime = queryTime + "-01 00:00:00";
            var days = moment(queryTime, "YYYY-MM").daysInMonth()
            var eTime = queryTime + "-" + days + " 23:59:59";
        
            //var reg = /-| |:/g;
            //var sTimeCopy = sTime.replace(reg, '');
            //var eTimeCopy = eTime.replace(reg, '');
            var queryUrl = parent.Robin.Setting.GlobalSetting.RestAPIService + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + StationKey + "&tagkey=" + TAG_KEY;

            //查询数据
            $.ajax({
                dataType: "JSONP",
                url: queryUrl,
                cache: false,
                success: function (result) {
                    NProgress.done();
                    if (result.status == 500) {
                        //alert(result.data);
                        return;
                    }
                    //封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.data.Count;//返回数据全部记录
                    returnData.recordsFiltered = result.data.Count;//后台不实现过滤功能，每次查询均视作全部结果
                    queryData = [];
                    $.each(result.data, function (i, v) {
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
                                    tagName = value.TAG_NAME;
                                    units = value.UNITS;
                                    return false;
                                }
                            });
                        }

                        queryData.push({
                            BMMC: bmmc,
                            SAVE_DATE: top.Robin.Utils.ToDate(v.SAVE_DATE),
                            TAG_NAME: tagName,
                            TAG_VALUE: v.TAG_VALUE,//v.ConfigModel.TAG_VALUE
                            UNITS: units
                        });
                    });

                    returnData.data = queryData;//返回的数据列表
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                    //$("#btnExcel").attr("disabled", false);

                },
                error: function (msg) {
                    NProgress.done();
                    //alert('获取监测点报警信息列表失败');
                }
            });
        },
        "aoColumns": [
                {
                    "mData": "BMMC", "sTitle": "监测点名称", "sWidth": "20%",

                },
                {
                    "mData": "SAVE_DATE", "sTitle": "数据采集日期", "sWidth": "24%",
                    "mRender": function (data, type, full) {
                        return full.SAVE_DATE;
                    }
                },
                { "mData": "TAG_NAME", "sTitle": "监测项名称", "sWidth": "20%" },
                {
                    "mData": "TAG_VALUE", "sTitle": "值", "sWidth": "13%",
                    "mRender": function (data, type, full) {
                        return top.Robin.Application.retainedDecimalPlaces(full.TAG_VALUE, 2);//return Robin.Utils.retainedDecimalPlaces(data, 2);
                    }
                },
                { "mData": "UNITS", "sTitle": "单位", "sWidth": "13%" }
        ]
    });
};

/**
* 绑定chart
* @author CodingMan
* @param {string} stationKey 监测点编号
* @param {string} tagKey     监测项编号
* @param {string} title 曲线名称
*/
var historyChart = function (stationKey, tagKey, start, end, title, Units, type) {
    debugger;   
    var startTime = start;
    var endTime = end;
    if (startTime == "" || endTime == "") {
        noty({ text: "请选择时间!", type: "warning", layout: "topCenter", timeout: 2000 });
        return;
    }
    var myChart = echarts.init(document.getElementById('charts'));
    option = {
        title: {
            text: title + '(' + startTime + '至' + endTime + ')曲线图',
            x: 'center',
            padding: [20, 0, 0, 0]
        },
        grid: {
            left: '9%',
            right: 50,
            top: '20%',
            bottom: '15%'
        },
        toolbox: {
            feature: {
                dataZoom: {},
                restore: {},
                saveAsImage: {}
            },
            right: 42,
            top: 45
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
                return time + '<br/><b>' + marker + name + ":" + value +Units+ '</b>';
            },
        },     
        xAxis: [
            {
                axisLine: {
                    lineStyle: {
                        width: 2
                    }
                },
                type: 'time',
                name: '时间',
                tickPixelInterval: 150,
                tickWidth: 1,
                labels: {
                    enabled: false,
                    step: 2,
                    formatter: function () {
                        return dateFormat('%Y-%m-%d %H:%M', this.value);
                    },
                },
                //时间格式：
                dateTimeLabelFormats: {
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%l:%M',
                    day: '%H:%M <br/> %m月%e日',
                    week: '%m月 %e',
                    month: '%m \'%y',
                    year: '%Y'
                }
            }
        ],
        yAxis: {
            name: $("#JCXList").find('option:selected').text(),
            type: 'value',
            axisLabel: {
                formatter: '{value}' + Units,
            },
            left: '20px',
            scale: true,           
            nameTextStyle: {
                color: '#000',
                position: 'top'
            }
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
    var queryUrl = parent.Robin.Setting.GlobalSetting.RestAPIService + "/iot/historycharts/v1?starttime="
        + startTime + "&endtime=" + endTime + "&stationkey=" + stationKey + "&tagkey=" + tagKey;
    $.ajax({
        url: queryUrl,
        dataType: "JSONP",
        type: "get",
        success: function (result) {
            if (result.status == 200) {
                var data = result.data;
                var seriesData = [];
                $.each(data, function (i, v) {
                    if (i > 0) {
                        seriesData.push([(new Date(v.year, v.month, v.day, v.hour, v.mis, v.ss)).getTime(), parseFloat(v.value).toFixed(2)]);
                    }
                });
                if (seriesData.length <= 0) {
                    var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                    seriesData.push([new Date(startTime.replace(pattern, '$1/$2/$3 $4:$5:$6')).getTime(), 0]);
                    seriesData.push([new Date(endTime.replace(pattern, '$1/$2/$3 $4:$5:$6')).getTime(), 0]);
                    noty({ text: "暂无数据!", type: "warning", layout: "topCenter", timeout: 2000 });
                }
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
