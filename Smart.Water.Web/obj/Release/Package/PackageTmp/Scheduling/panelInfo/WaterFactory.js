var loc = window.location.href;
var Id = getParam('StationKey');
var StationName = getParam('Name');//监测点的名称
var type = 'sc';
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var queryData;
StationName = decodeURIComponent(StationName);
var WebUrl = getParam('WebUrl');
/*程序的入口*/
$(function () {
    var monitorTypeCode = '030201';
  
    /*数据列表*/
    GetInfo(Id);  
    query();
     
    $("#configDiv").slimScroll({ height: '475px' });

    videExist(monitorTypeCode, Id);//判断视频有无

    $("#videoDataList").slimScroll({ height: 475 });

    $("#videoTab").click(function () {
        GetVideoList(monitorTypeCode, Id);
    });

});
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

/*查询曲线数据*/
function query() {  
    //定义时间，将时间向前推12小时
    var sTime = moment().add('hours', -12).format('YYYY-MM-DD HH:mm:ss');
    var eTime = moment().format('YYYY-MM-DD HH:mm:ss');
    $.each(top.Robin.Data.config, function (i, v) {
        if (v.STATION_KEY == Id) {
          //  if (v.TAG_KEY != "030201_002" && v.TAG_KEY != "030201_001") {
                var queryUrl = restUrl + "/iot/historys/v1?starttime=" + sTime + "&endtime=" + eTime + "&stationkey=" + Id + "&tagkey=" + v.TAG_CODE;
                //查询数据
                $.ajax({
                    dataType: "JSONP",
                    url: queryUrl,
                    cache: false,
                    success: function (data) {
                        if (data.status == 500) {
                            
                            return;
                        }
                        //绑定曲线
                        normalPointChart(data.data, v);
                    },
                    error: function (msg) {
                        alert('错误', '获取历史数据失败');
                    }
                });

            }
        //}
    });
};
/*绑定普通的chart*/
var normalPointChart = function (data, config) {
    Highcharts.setOptions({

        global: {
            useUTC: false
        }
    });
    //动态添加Div
    var DivTem = "";
    DivTem = '<div id="charts' + config.TAG_CODE + '" role="tabpanel" style="width:100%;height:250px"></div>'
    $("#configDiv").append(DivTem);
    ///曲线图表
    $("#charts"+config.TAG_CODE).highcharts({
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
            text: config.TAG_DESC+"实时曲线",
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
            name: config.TAG_DESC,
            color: '#89A54E',
            type: 'spline',

            tooltip: {
                valueSuffix: config.UNITS
            }
        }]
    });

    var seriesData = []
    $.each(data, function (i, v) {
        var dtDate = new Date(parseInt(v.SAVE_DATE.substr(6)));
        seriesData.push([dtDate.getTime(), parseFloat(v.TAG_VALUE.toFixed(3))]);
    });
    var chart = $("#charts"+config.TAG_CODE).highcharts();
    chart.series[0].setData(seriesData, true);
    //实时更新
    setInterval(function () {
        var chart = $("#charts" + config.TAG_CODE).highcharts();
        if (chart == undefined) {
            return;
        }
        //获取值
        var series = chart.series[0];
        //获取最新数据
        var yldata = series.data[series.data.length - 1];
        $.each(top.tmodel.monitorData(), function (i, v) {
            if (v.TagCode() == config.TAG_CODE) {
                if (v.SaveTime() != null && v.SaveTime().length > 0) {
                    var dtStart = new Date(v.SaveTime());
                    dtStart = dtStart.getTime();
                    if (dtStart > parseInt(yldata.x)) {
                        chart.series[0].addPoint([dtStart, parseFloat(v.TagValue())], true, false);
                    }
                }
            }
        });
    }, 30 * 1000);
};
/*获取后台的水厂信息数据*/
function GetInfo(Id) {
    $.ajax({
        type: "GET",
        url: "InfoHandler.ashx?Action=List&Id=" + Id + "&Type=" + type,
        data: "json",
        success: function (result) {
            var data = JSON.parse(result);
            $.each(data, function (i, d) {
               // $("#SCBH").html(d.SCBH);
                $("#SCMC").html(d.SCNAME);
                $("#QHBH").html(d.CITYCODE);
                $("#QHMC").html(d.CITYNAME);
                $("#FZR").html(d.SCFZR);
                $("#FZRDH").html(d.SCFZRDH);
                $("#GSQY").html(d.GSQY);
                $("#NGSZL").html(d.SJSCNL);
                $("#SCDZ").html(d.SCLOCATION);
                $("#QSDW").html(d.QSDWMC);
            });
        },
        error: function (error) {
            //alert(error);
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
          //  alert(data.data);
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
          //  alert(data.data);
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