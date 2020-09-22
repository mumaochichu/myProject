var loc = window.location.href;
var urlParams = Robin.Utils.GetQueryObject();
var Id = urlParams.StationKey;
var StationName = urlParams.Name;//监测点的名称
var StationKey = Id;//监测点的编号
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var queryData;
var type = 'jcd';
/*程序的入口*/

$(function () {
    var monitorTypeCode = '030304';
    $("#home").slimScroll({ height: '420px' });
    //数据列表(空)
    GetInfo(Id);
    /*绑定监测项数据*/
    changeJCX(Id);
    if (top.Robin.Setting.Demo) {
        if (top.Robin.Setting.Demo.isShowDemo == "1") {
            sTime = top.Robin.Setting.Demo.startTime + ' 00:00:00';
            eTime = top.Robin.Setting.Demo.endTime + ' 23:59:59';
            $("#endYear").val(eTime);
            $("#startYear").val(sTime);
        } else {
            var dt = new Date();
            var eTime = $("#endYear").val(dt.Format("yyyy-MM-dd HH:mm:ss"));
            dt.setDate(dt.getDate() - 1);
            var sTime = $("#startYear").val(dt.Format("yyyy-MM-dd HH:mm:ss"));
        }
    }
    //执行查询     
    QureyTagInfo();
    ///*曲线*/
    //$("#btnCharts").click(function () {
    //    query();
    //});
    //$("#configDiv").slimScroll({ height: '475px' });

    //videExist(monitorTypeCode, Id);//判断视频有无

    //$("#videoDataList").slimScroll({ height: 475 });

    //$("#videoTab").click(function () {
    //    GetVideoList(monitorTypeCode, Id);
    //});
});

/*查询曲线数据*/
function query() {
    var TAG_KEY = $("#JCXList").val();
    var sTime = $("#startYear").val();
    var eTime = $("#endYear").val();

    if (!TAG_KEY) {
        noty({ text: "无法生成曲线图,请选择监测项。", type: "warning", layout: "topCenter", timeout: 2000 });
        return;

    }
    if (!sTime || !eTime) {
        // alert("起止时间不能为空！");
        return;
    }
    sTime = sTime.replace(/-/ig, '/');
    sTime = (new Date(sTime)).Format("yyyyMMddHHmmss");
    eTime = eTime.replace(/-/ig, '/');
    eTime = (new Date(eTime)).Format("yyyyMMddHHmmss");

    var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + Id + "&tagkey=" + TAG_KEY;
    //查询数据
    $.ajax({
        dataType: "JSONP",
        url: queryUrl,
        cache: false,
        success: function (data) {
            if (data.status == 500) {
                alert(data.data);
                return;
            }
            bindData(data.data);

        },
        error: function (msg) {
            alert('错误', '获取历史数据失败');
        }
    });
};

/*查询监测项数据*/
function changeJCX(cityCode) {
    $("#JCXList").empty();
    $('#select2-chosen-2').html('');
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
                JCXArray = result.data;

                $.each(data, function (i, v) {
                    if (i == 0) {
                        //赋值，默认第一项
                        $('#select2-chosen-2').html(v.TAG_NAME);
                        $("#JCXList").append('<option value="' + v.TAG_CODE + '">' + v.TAG_NAME + '</option>');
                        $("#JCXList").val(v.TAG_CODE);
                        Units = v.UNITS;
                    } else {
                        $("#JCXList").append('<option value="' + v.TAG_CODE + '">' + v.TAG_NAME + '</option>');//TAG_DESC
                    }
                });
                //加载默认监测项历史曲线
                var TAG_KEY_EXIST = $("#JCXList").find('option:selected').val();
                if (TAG_KEY_EXIST) {
                    query();
                }
            },
            error: function (msg) {
                noty({ text: "获取监测项列表失败!", type: "warning", layout: "topCenter", timeout: 2000 });
            }
        });
    } else {
        //  $("#JCXList").attr("disabled", true);
    }
};
/*获取监测点基本信息*/
function GetBasicInfo(StationKey) {

    $("#configList").empty();

    var serviceUrl = top.Robin.Setting.GlobalSetting.RestAPIService + top.Robin.Setting.GlobalSetting.PumpStationService;

    $.ajax({
        dataType: "JSONP",
        url: serviceUrl + StationKey,
        cache: false,
        success: function (result) {
            if (result.status == 500) {
                alert(result.data);
                return;
            }
            var configData = result.data.configList;
            var pumpData = result.data.pumpList;

            var configHtml = '';
            $.each(configData, function (i, item) {
                configHtml += '<tr><td> ' + item.TAG_DESC + ' </td><td> ' + item.TAG_VALUE + ' </td><td> ' + item.UNITS + ' </td></tr>';
            });

            var pumpHtml = '';
            $.each(pumpData, function (i, item) {
                pumpHtml += '<tr><td> ' + item.NAME + ' </td><td> ' + item.WORKSTATE + ' </td><td> ' + top.Robin.Utils.ToDate(item.REPORTDATE) + ' </td></tr>';
            });

            $("#configList").html(configHtml);
            $("#pumpList").html(pumpHtml);

        }
    });

}

/*绑定普通的chart*/
var normalPointChart = function (data, title) {

    if (data == undefined || data.length == 0) {
        noty({ text: "未查询数据或查不到数据，无法生成曲线图。", type: "warning", layout: "topCenter", timeout: 2000 });
        // $('#charts').html('');
        HeightChart(Id, StationName);//在未查询到数据的时候显示曲线图
        return;
    }
    var tagName = data[0].TAG_NAME;
    var units = data[0].UNITS;

    var startTime = $("#startYear").val();
    var endTime = $("#endYear").val();
    var startNow, endNow;

    if (startTime == "" || endTime == "") {

        alert('系统提示', '请选择开始时间和结束时间');
        return;
    }

    if (startTime != "" && endTime != "") {

        if (endTime <= startTime) {

            alert('结束时间不能小于开始时间');
            return;
        }
    }
    var chartTitle = title + ' 曲线图(' + startTime + '至' + endTime + ')';

    Highcharts.setOptions({

        global: {
            useUTC: false
        }
    });
    ///曲线图表
    $('#charts').highcharts({
        chart: {
            zoomType: 'xy',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            // 取消边框和背景
            borderWidth: 0,
            backgroundColor: null
        },
        title: {
            text: chartTitle,
            style: { 'color': '#000', "text-shadow": "1px 1px 1px rgba(0,0,0,0.5)" },
            margin: 1
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            column: {
                events: {
                    click: function (e) {
                        //改变积水点和雨量站水位
                    }
                }
            }
        },
        xAxis: [{
            type: 'datetime',
            //tickPixelInterval: 150,
            tickColor: '#000',
            tickWidth: 1,

            lineColor: '#000',
            labels: {

                style: {
                    color: '#000'
                }
            },
            //时间格式：
            dateTimeLabelFormats: {
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M <br/> %m月%e日',
                week: '%m月 %e',
                month: '%m \'%y',
                year: '%Y'
            },
            opposite: false,
            plotLines: [{ color: '#000' }]
        }],
        yAxis: [{
            labels: {
                format: '{value}' + units,
                style: {
                    color: '#000'
                }
            },
            lineColor: '#000', tickColor: '#000',
            title: {
                text: tagName,
                style: {
                    color: '#000'
                }
            }
        }],
        tooltip: {

            //shared: true 
            shared: false,
            formatter: function () {
                return Highcharts.dateFormat('%m月%e日 %H:%M:%S', this.x) + '<br/><b>' + this.series.name + ':</b>' + this.y;
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: tagName,
            color: '#89A54E',
            type: 'spline',

            tooltip: {
                valueSuffix: units
            }
        }]
    });

    var seriesData = []
    $.each(data, function (i, v) {

        var strTime = v.SAVE_DATE.replace('T', " ").replace(/-/g, "/");
        var dtDate = new Date(strTime);
        seriesData.push([dtDate.getTime(), parseFloat(v.TAG_VALUE.toFixed(3))]);
    });
    if (seriesData.length <= 0) {
        seriesData.push([TodayDate.getTime(), 0]);
    }
    var chart = $('#charts').highcharts();
    chart.series[0].setData(seriesData, true);

};

/*绑定数据到表格上*/
function bindData(data) {
    queryData = [];
    var bmmc = "", tagName = "", units = "", isFind = false;
    $.each(data, function (i, v) {
        //获取监测项名称 单位等信息
        if (!isFind) {
            $.each(top.Robin.Data.monitor, function (index, value) {
                if (v.STATION_KEY = value.BMID) {
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
    //初始化chart图并绑定数据显示
    var title = StationName + '-' + $("#JCXList").find('option:selected').text();
    normalPointChart(queryData, title);
};

/*在没有数据的前提下显示曲线图表*/
function HeightChart(StationKey, StationName) {
    var startTime = $("#startYear").val();
    var endTime = $("#endYear").val();
    var startNow, endNow;
    var title = $("#JCXList").find('option:selected').text();
    var units = "";
    if (startTime == "" || endTime == "") {

        alert('系统提示', '请选择开始时间和结束时间');
        return;
    }

    if (startTime != "" && endTime != "") {

        if (endTime <= startTime) {

            alert('系统提示', '结束时间不能小于开始时间');
            return;
        }
    }
    var chartTitle = title + ' 曲线图(' + startTime + '至' + endTime + ')';

    Highcharts.setOptions({

        global: {
            useUTC: false
        }
    });
    ///曲线图表
    $('#charts').highcharts({
        chart: {
            zoomType: 'xy',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            // 取消边框和背景
            borderWidth: 0,
            backgroundColor: null
        },
        title: {
            text: chartTitle,
            style: { 'color': '#000', "text-shadow": "1px 1px 1px rgba(0,0,0,0.5)" },
            margin: 1
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            column: {
                events: {
                    click: function (e) {
                        //改变积水点和雨量站水位
                    }
                }
            }
        },
        xAxis: [{
            type: 'datetime',
            //tickPixelInterval: 150,
            tickColor: '#000',
            tickWidth: 1,

            lineColor: '#000',
            labels: {

                style: {
                    color: '#000'
                }
            },
            title: {
                text: title,
                style: {
                    color: '#000'
                }
            },
            //时间格式：
            dateTimeLabelFormats: {
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M <br/> %m月%e日',
                week: '%m月 %e',
                month: '%m \'%y',
                year: '%Y'
            },
            opposite: false,
            plotLines: [{ color: '#000' }]
        }],
        yAxis: [{
            labels: {
                format: '{value}' + units,
                style: {
                    color: '#000'
                }
            },
            lineColor: '#000', tickColor: '#000',
            title: {
                text: title,
                style: {
                    color: '#000'
                }
            }
        }],
        tooltip: {

            //shared: true 
            shared: false,
            formatter: function () {
                return Highcharts.dateFormat('%m月%e日 %H:%M:%S', this.x) + '<br/><b>' + this.series.name + ':</b>' + this.y;
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: StationName,
            color: '#89A54E',
            type: 'spline',

            tooltip: {
                valueSuffix: units
            }
        }]
    });
}

/*获取过滤后的检测项信息*/
function QureyTagInfo() {
    //定义时间，将时间向前推12小时
    var sTime = moment().add('hours', -12).format('YYYY-MM-DD HH:mm:ss');
    var eTime = moment().format('YYYY-MM-DD HH:mm:ss');

    $.each(top.Robin.Data.config, function (ii, vv) {
        if (vv.STATION_KEY == Id) {
            //过滤工频、变频和故障状态
            //if (vv.TAG_KEY != "030199_002" && vv.TAG_KEY != "030199_003" && vv.TAG_KEY != "030199_006") {
                var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + Id + "&tagkey=" + vv.TAG_CODE;
                NProgress.start();
                $.ajax({
                    dataType: "JSONP",
                    url: queryUrl,
                    cache: false,
                    success: function (data) {
                        NProgress.done();
                        if (data.status == 500) {
                            // alert(data.data);
                            return;
                        }

                        //绑定图表
                        normalPointChart(data.data, vv);
                    },
                    error: function (msg) {
                        alert("获取数据失败");
                    }
                });
            }
        //}
    });
}
/*绑定普通的chart*/
var normalPointChart = function (data, config) {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    var divTem = "";
    divTem += '<div id="charts' + config.TAG_CODE + '"  role="tabpanel" style="width:100%;height:250px"></div>';
    $("#configDiv").append(divTem);
    ///曲线图表    
    $("#charts" + config.TAG_CODE).highcharts({
        chart: {
            zoomType: 'xy',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            // 取消边框和背景
            borderWidth: 0,
            backgroundColor: null
        },
        title: {
            text: config.TAG_DESC + "实时曲线图",
            style: { 'color': '#000', "text-shadow": "1px 1px 1px rgba(0,0,0,0.5)" },
            margin: 1
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            column: {
                events: {
                    click: function (e) {
                        //改变积水点和雨量站水位
                    }
                }
            }
        },
        xAxis: [{
            type: 'datetime',
            //tickPixelInterval: 150,
            tickColor: '#000',
            tickWidth: 1,

            lineColor: '#000',
            labels: {

                style: {
                    color: '#000'
                }
            },
            //时间格式：
            dateTimeLabelFormats: {
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M <br/> %m月%e日',
                week: '%m月 %e',
                month: '%m \'%y',
                year: '%Y'
            },
            opposite: false,
            plotLines: [{ color: '#000' }]
        }],
        yAxis: [{
            labels: {
                format: '{value}' + config.UNITS,
                style: {
                    color: '#000'
                }
            },
            lineColor: '#000', tickColor: '#000',
            title: {
                text: config.TAG_DESC,
                style: {
                    color: '#000'
                }
            }
        }],
        tooltip: {
            shared: false,
            formatter: function () {
                return Highcharts.dateFormat('%H:%M', this.x) + '<br/><b>' + this.series.name + '</b>' + this.y;
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: config.TAG_DESC,
            color: '#89A54E',
            type: 'spline',
            tooltip: {
                valueSuffix: config.UNITS
            }
        }]
    });
    var seriesData = [];
    $.each(data, function (i, v) {

        var dtDate = new Date(parseInt(v.SAVE_DATE.substr(6)));

        seriesData.push([dtDate.getTime(), parseFloat(v.TAG_VALUE.toFixed(3))]);
    });
    //if (seriesData.length <= 0) {
    //    seriesData.push([TodayDate.getTime(), 0]);
    //}  
    var chart = $("#charts" + config.TAG_CODE).highcharts();
    chart.series[0].setData(seriesData, true);//绑定数据  


    //实时更新数据
    setInterval(function () {
        var chart = $("#charts" + config.TAG_CODE).highcharts();
        if (chart == undefined) {
            return;
        }
        //雨量
        var series = chart.series[0];
        //获取雨量最新数据
        var yldata = series.data[series.data.length - 1];

        $.each(parent.tmodel.monitorData(), function (i, v) {
            if (v.TagCode() == config.TAG_CODE) {//判断时间
                if (v.SaveTime() != null && v.SaveTime().length > 0) {
                    var dtStart = new Date(v.SaveTime());
                    dtStart = dtStart.getTime();
                    if (dtStart > parseInt(yldata.x)) {
                        //更新
                        chart.series[0].addPoint([dtStart, parseFloat(v.TagValue())], true, false);
                    }
                }
            }
        });

    }, 10 * 1000);
};

/*获取后台的管网监测点信息数据*/
function GetInfo(Id) {
    $.ajax({
        type: "GET",
        url: "InfoHandler.ashx?Action=List&Id=" + Id + "&Type=" + type,
        data: "json",
        success: function (result) {
            var data = JSON.parse(result);
            $.each(data, function (i, d) {
                $("#GWJCDMC").html(d.GWJCDMC);               
                $("#LXR").html(d.LXR);
                $("#LXDH").html(d.LXDH);
                $("#GWJCDDZ").html(d.GWJCDDZ);
                $("#BZ").html(d.BZ);        
            });
        },
        error: function (error) {
            alert(error);
        }
    });
}

/*判断有无视频信息*/
function videExist(monitorTypeCode, Id) {
    $.getJSON(top.Robin.Setting.GlobalSetting.RestAPIService + '/business/basic/MonitorLinkVideo/v1/' + monitorTypeCode, function (data) {
        //if (data.status == 500) {
        //    $("#videoDisplay").css('display', 'none');
        //    return;
        //} else {
        //    $("#videoDisplay").css('display', 'block');
        //}
        data = data.data;
        var isHasData = false;
        $.each(data, function (i, item) {
            if (Id == item.JCDBH) {
                isHasData = true;
            }
        });
        //if (!isHasData) {
        //    $("#videoDisplay").css('display', 'none');
        //} else {
        //    $("#videoDisplay").css('display', 'block');
        //}

    });
}

/*获取视频的列表*/
function GetVideoList(monitorTypeCode, Id) {
    $.getJSON(top.Robin.Setting.GlobalSetting.RestAPIService + '/business/basic/MonitorLinkVideo/v1' + monitorTypeCode, function (data) {
        if (data.status == 500) {
            alert(data.data);
            return;
        }
        data = data.data;
        var videoArray = [];
        var isHasData = false;
        $.each(data, function (i, item) {
            isHasData = false;
            $.each(videoArray, function (index, itemVideo) {
                if (itemVideo.SPBM == item.SPBM) {
                    isHasData == true;
                }
            });
            if (!isHasData && item.JCDBH == Id) {
                videoArray.push(item);
            }
        });
        if (videoArray.length == 0) {
            $("#videoDataList").empty();
            top.noty({
                text: "获取视频列表为空",
                type: 'warning',
                layout: 'topCenter',
                timeout: 2000
            });
            return;
        }
        var html = "";
        $.each(videoArray, function (index, itemVideo) {
            html += '<li class="mt-list-item" style="padding-left: 15px">';
            html += '<div class="list-icon-container" style="padding-top:8px;"><i class="fa fa-video-camera"></i></div>';
            html += '<div class="list-item-content">';
            html += '<h5 class="uppercase">';
            html += '<a href="javascript::" style="text-decoration:none" onclick=openVideo("' + itemVideo.SPBM + '","' + itemVideo.BFMC + '")>' + itemVideo.BFMC + '</a>';
            html += '</h5></div></li>';
        });
        $("#videoDataList").html(html);
    });
}

/*根据网址打开视频*/
var openVideo = function (spbm, bfmc) {
    $.getJSON("http://172.30.16.49:801/gcloud" + '/iot/monitors/v1/' + spbm + "/video", function (data) {
        if (data.status == 500) {
            alert(data.data);
            return;
        }
        var url = data.data[0].JXCS;
        var checkVLC = top.Robin.Portal.Page.Video.checkVideoControl();
        if (checkVLC) {
            return;
        }

        var vlc = getVLC("vlc");

        if (vlc) {
            vlc.playlist.items.clear();

            var options = [":rtsp-tcp"];
            var itemId = vlc.playlist.add(url, "", options);
            options = [];
            if (itemId != -1) {
                vlc.playlist.playItem(itemId);
            }
            else {
                alert("cannot play at the moment !");
            }
        }
    });
    function getVLC(name) {
        if (window.document[name]) {
            return window.document[name];
        }
        if (navigator.appName.indexOf("Microsoft Internet") == -1) {
            if (document.embeds && document.embeds[name])
                return document.embeds[name];
        }
        else {
            return document.getElementById(name);
        }
    }
}

/*定义Farmat函数*/
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