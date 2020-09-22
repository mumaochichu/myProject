var loc = window.location.href;
var urlParams = Robin.Utils.GetQueryObject();
var Id = urlParams.StationKey;
var StationName = urlParams.Name;//监测点的名称
var StationKey = Id;//监测点的编号
var restUrl = parent.Robin.Setting.GlobalSetting.RestAPIService;
var queryData;
var type = 'syj';
StationName = decodeURIComponent(StationName);
var WebUrl = urlParams.WebUrl;
/*程序的入口*/
$(function () {
    var monitorTypeCode = '030199';
    $("#configDiv").slimScroll({ height: '475px' });
    /*数据列表*/
    GetInfo(Id);
    $("#show").attr("src", WebUrl + "?Id=" + Id + "&timespane=" + new Date());

    //执行查询     
    QureyTagInfo();
    /*视频*/
    //   videExist(monitorTypeCode, Id);//判断视频有无

    //$("#videoDataList").slimScroll({ height: 475 });
    //$("#videoTab").click(function () {
    //    GetVideoList(monitorTypeCode, Id);       
    //});
    var width = $("#myTab").width();
    var height = $("body").height() - $("#myTab").height();
    $("#show").attr("width", width);
    $("#show").attr("height", height);
    $(window).resize(function () {
        width = $("#myTab").width();
        height = $("body").height() - $("#myTab").height();
        $("#show").attr("width", width);
        $("#show").attr("height", height);
    });
});

/*获取过滤后的检测项信息*/
function QureyTagInfo() {
    //定义时间，将时间向前推12小时
    var sTime = moment().add('hours', -12).format('YYYY-MM-DD HH:mm:ss');
    var eTime = moment().format('YYYY-MM-DD HH:mm:ss');

    $.each(top.Robin.Data.config, function (ii, vv) {
        if (vv.STATION_KEY == Id) {
            //过滤工频、变频和故障状态
            if (vv.TAG_KEY != "030199_002" && vv.TAG_KEY != "030199_003" && vv.TAG_KEY != "030199_006") {
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
        }
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
/*获取后台的水源井信息数据*/
function GetInfo(Id) {
    $.ajax({
        type: "GET",
        url: "InfoHandler.ashx?Action=List&Id=" + Id + "&Type=" + type,
        data: "json",
        success: function (result) {
            var data = JSON.parse(result);
            $.each(data, function (i, d) {
                $("#BFMC").html(d.BFMC);
                $("#BFDZ").html(d.BFDZ);
                $("#LXR").html(d.LXR);
                $("#LXDH").html(d.LXDH);
                $("#QSDW").html(d.QSDW);
                $("#XZQ").html(d.XZQ);
                $("#GSCC").html(d.GSCC);
                $("#GSRK").html(d.GSRK);
                var jgTime = d.JGSJ;
                if (jgTime != null) {
                    jgTime = jgTime.substring(0, jgTime.lastIndexOf('T'));
                }
                else {
                    $("#JGSJ").html(jgTime);
                }
                $("#GSFW").html(d.GSFW);
                $("#JSW").html(d.JSW);
                $("#JS").html(d.JS);
                var cjTime = d.CJSJ;
                if (cjTime != null) {
                    cjTime = cjTime.substring(0, cjTime.lastIndexOf('T'));
                }
                else {
                    $("#CJSJ").html(cjTime);
                }

                $("#JJ").html(d.JJ);
                $("#BX").html(d.BX);
                $("#YC").html(d.YC);
                $("#EDLL").html(d.EDLL);
                $("#SJLL").html(d.SJLL);
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
