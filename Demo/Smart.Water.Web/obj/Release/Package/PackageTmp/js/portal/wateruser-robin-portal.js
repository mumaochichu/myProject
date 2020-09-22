
//初始化Page命名空间
if (!this["Robin"]) { Robin = {}; }
if (!this["Robin.Portal"]) { Robin.Portal = {}; }
if (!this["Robin.Portal.Page"]) { Robin.Portal.Page = {}; }

//水厂 done
Robin.Portal.Page.YSH = {
    data: null,
    //查询水厂
    query: function () {
        var result = [];
        //所有监测点信息
        $.each(Robin.Data.monitor, function (i, v) {
            if (v.BMID.substring(6, 12) == "030401") {
                result.push(v);
            }
        });
        return result;
    },
    show: function (id, x, y, name) {      
        if (!id) { return; }
        Robin.Portal.Page.YSH.data = null;
        var title = name;
        name = encodeURI(encodeURI(name));
        var url = 'panelInfo/WaterFactory.html?StationKey=' + id + '&Name=' + name;
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%"frameborder="0" z-index="9999" scrolling="no"></iframe>',
            {
                id: 'scClickInfo',
                theme: '#2B3D51',
                contentSize: { width: 1000, height: 520 },
                position: 'center',
                headerControls: {
                    minimize: 'disable',
                    smallify: 'remove'
                }
            });Robin.Map.addLayer
       
    },
    locate: function (stationKey) {
        var pdall = true;
        var pd = Robin.Map.MapWindow.IsOpenByID(stationKey);
        if (pd == false) {
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "yshLayer" + stationKey
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };

            Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                Robin.Portal.Page.YSH.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
            });

            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID == stationKey) {
                    $.get("templates/yshInfo.htm", null, function (html, textStatus) {
                        point = Robin.Map.GetPoint(v.BMX, v.BMY);
                        var picurl = "../images/Scheduling/plugin/scicon.png";
                        var symbolConfig = {
                            font:
                                { 'size': "13", 'style': 'normal' },
                            color: [0, 89, 149],
                            pic: {
                                src: picurl,
                                width: 30,
                                height: 30
                            },
                            offset: {
                                x: 0,
                                y: -30
                            }
                        };
                        Robin.Map.ShowGraphic(graphicsLayer, v.BMMC, v.BMX, v.BMY, picurl, v, symbolConfig);
                        Robin.Map.MapWindow.Show(v.BMID, Robin.Map.Map2DControl, point, html, isWarn);
                        var tempModel = new Robin.Portal.RuntimeModel();
                        tempModel.StationName(v.BMMC);
                        $.each(tmodel.monitorData(), function (i, vv) {
                            if (vv.StationKey() == v.BMID) {
                                tempModel.MonitorDatas.push(vv);
                            }
                        });
                        ko.applyBindings(tempModel, document.getElementById("#mapWindow_" + v.BMID));
                        $.each(Robin.Portal.Page.YSH.query(), function (i, item) {
                            var ht = Robin.Map.MapWindow.IsOpenByID(item.BMID);
                            if (ht == false) {
                                pdall = false;
                            }
                        });
                        if (pdall == true) {
                            $("#bar_WaterFactoryLoc").find('span').find('i').attr("class", "fa-tint fa-trash");
                            $("#bar_WaterFactoryLoc").attr("title", "水厂清除");
                        }
                    }, "html");
                }
            });
        }
        $.each(Robin.Data.monitor, function (j, v) {

            if (stationKey == v.BMID) {

                var p = Robin.Map.GetPoint(v.BMX, v.BMY);
                Robin.Map.Fly2Geometry(top.Robin.Map.Map2DControl, p);
                return false;
            }
        });

    },
    clearlayer: function () {
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, "yshLayer");
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030401") {
                var id = "yshLayer" + v.BMID;
                Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);
            }
        });
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030401") {
                Robin.Map.MapWindow.CloseByID(v.BMID);
            }
        });
    }

};

Robin.Portal.addModule = function (name, containerid, css, callback, flag) {
    var path = '';
    if (name && (typeof name === 'object')) {
        flag = name.flag;
        callback = name.callback;
        css = name.css;
        containerid = name.containerid;
        path = name.path;
        name = name.name;
    }
    if (css != undefined && css != '') {
        if (css.indexOf(',') > -1) {
            $.each(css.indexOf(','), function (i, v) {
                Robin.Application.LoadCSS(v);
            });
        } else {
            Robin.Application.LoadCSS(css);
        }
    }
    if (callback == undefined) {
        callback = function () { };
    }
    Robin.Application.LoadModule(new Robin.Application.Module(name, name + ".htm",
        callback,
        $("#" + containerid), flag || true, path));
};








/*撤销处置*/
Robin.Portal.Alert = {
    alertId: '',
    stationKey: '',
    stationName: '',
    info: '',
    closeAlert: function () {
        noty({ text: "处置成功", type: 'success', layout: "center", timeout: 1000 });
        window.setTimeout(function () {
            Robin.CloseOneInfoPanel("HandleAlert");
        }, 500);
    }
}

Robin.Portal.RuntimeModel = function () {
    var self = this;
    self.StationName = ko.observable();
    self.MonitorDatas = ko.observableArray([]);
};