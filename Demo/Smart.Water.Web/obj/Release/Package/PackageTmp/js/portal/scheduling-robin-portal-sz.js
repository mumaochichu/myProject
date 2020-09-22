
//初始化Page命名空间
if (!this["Robin"]) { Robin = {}; }
if (!this["Robin.Portal"]) { Robin.Portal = {}; }
if (!this["Robin.Portal.Page"]) { Robin.Portal.Page = {}; }


//水厂 done
Robin.Portal.Page.SC = {
    data: null,
    //查询水厂
    query: function () {

        var result = [];
        //所有监测点信息
        $.each(Robin.Data.monitor, function (i, v) {

            if (v.BMID.substring(6, 12) == "030201") {
                result.push(v);
            }
        });

        return result;
    },
    show: function (id, x, y, name, WebUrl) {
        if (!id) { return; }
        Robin.Portal.Page.SC.data = null;
        var title = name;
        name = encodeURI(encodeURI(name));
        var url = 'panelInfo/WaterFactory.html?StationKey=' + id + '&Name=' + name + '&WebUrl=' + WebUrl;
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
            });
    },

    locate: function (stationKey) {
        var pdall = true;
        var pd = Robin.Map.MapWindow.IsOpenByID(stationKey);
        if (pd == false) {
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "scLayer" + stationKey
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };

            Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                Robin.Portal.Page.SC.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
            });

            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID == stationKey) {
                    $.get("templates/scInfo.htm", null, function (html, textStatus) {
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
                        $.each(Robin.Portal.Page.SC.query(), function (i, item) {
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
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, "scLayer");
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030201") {
                var id = "scLayer" + v.BMID;
                Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);
            }
        });
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030201") {
                Robin.Map.MapWindow.CloseByID(v.BMID);
            }
        });
    }

};
//加压站 done
Robin.Portal.Page.JYZ = {

    //查询加压站
    data: null,
    query: function () {

        var result = [];
        //所有监测点信息
        $.each(Robin.Data.monitor, function (i, v) {

            if (v.BMID.substring(6, 12) == "030202") {
                result.push(v);
            }
        });

        return result;
    },

    show: function (id, x, y, name, WebUrl) {
        if (!id) { return; }
        Robin.Portal.Page.JYZ.data = null;
        var title = name;
        name = encodeURI(encodeURI(name));
        var url = 'panelInfo/PressureStation.html?StationKey=' + id + '&Name=' + name + '&WebUrl=' + WebUrl;
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%"frameborder="0" scrolling="no"></iframe>',
            {
                id: 'jyzClickInfo',
                theme: '#2B3D51',
                contentSize: { width: 1000, height: 520 },
                position: 'center',
                //  headerControls: { controls: "closeonly" }, controls: { iconfont: 'font-awesome' }
                headerControls: {
                    minimize: 'disable',
                    smallify: 'remove'
                }
            });
    },
    locate: function (stationKey) {
        var pdall = true;
        var pd = Robin.Map.MapWindow.IsOpenByID(stationKey);
        if (pd == false) {
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "jyzLayer" + stationKey
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };

            Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                Robin.Portal.Page.JYZ.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC, evt.attributes.WebUrl);
            });
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID == stationKey) {
                    $.get("templates/jyzInfo.htm", null, function (html, textStatus) {
                        point = Robin.Map.GetPoint(v.BMX, v.BMY);
                        var picurl = "../images/Scheduling/plugin/jyzicon.png";
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
                        $.each(Robin.Portal.Page.JYZ.query(), function (i, item) {
                            var ht = Robin.Map.MapWindow.IsOpenByID(item.BMID);
                            if (ht == false) {
                                pdall = false;
                            }
                        });
                        if (pdall == true) {
                            $("#bar_PressureStationLoc").find('span').find('i').attr("class", "fa-plus-square fa-trash");
                            $("#bar_PressureStationLoc").attr("title", "加压站清除");
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
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, "jyzLayer");
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030202") {
                var id = "jyzLayer" + v.BMID;
                Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);
            }
        });
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030202") {
                Robin.Map.MapWindow.CloseByID(v.BMID);
            }
        });
    },
};
//水源井 done
Robin.Portal.Page.SYJ = {
    data: null,
    query: function () {

        var result = [];
        $.each(Robin.Data.monitor, function (i, v) {

            if (v.BMID.substring(6, 12) == "030199") {
                result.push(v);
            }
        });
        return result;
    },
    show: function (id, x, y, name, WebUrl) {
        if (!id) { return; }
        Robin.Portal.Page.SYJ.data = null;
        var title = name;
        name = encodeURI(encodeURI(name));
        var url = 'panelInfo/WaterWell.html?StationKey=' + id + '&Name=' + name + '&WebUrl=' + WebUrl;
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%"frameborder="0" scrolling="no"></iframe>',
            {
                id: 'jyzClickInfo',
                theme: '#2B3D51',
                contentSize: { width: 1000, height: 520 },
                position: 'center',
                // headerControls: { controls: "closeonly" }, controls: { iconfont: 'font-awesome' }
                headerControls: {
                    minimize: 'disable',
                    smallify: 'remove'
                }
            });
    },
    locate: function (stationKey) {
        var pdall = true;
        var pd = Robin.Map.MapWindow.IsOpenByID(stationKey);
        if (pd == false) {
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "syjLayer" + stationKey
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                Robin.Portal.Page.SYJ.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC, evt.attributes.WebUrl);
            });
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID == stationKey) {
                    $.get("templates/syjInfo.htm", null, function (html, textStatus) {
                        point = Robin.Map.GetPoint(v.BMX, v.BMY);
                        var picurl = "../images/Scheduling/plugin/syjicon.png";
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
                        $.each(Robin.Portal.Page.SYJ.query(), function (i, item) {
                            var ht = Robin.Map.MapWindow.IsOpenByID(item.BMID);
                            if (ht == false) {
                                pdall = false;
                            }
                        });
                        if (pdall == true) {
                            $("#bar_WaterWellLoc").find('span').find('i').attr("class", "fa-database fa-trash");
                            $("#bar_WaterWellLoc").attr("title", "水源井清除");
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
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, "syjLayer");
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030199") {
                var id = "syjLayer" + v.BMID;
                Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);
            }
        });
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030199") {
                Robin.Map.MapWindow.CloseByID(v.BMID);
            }
        });
    }
};
//管网监测点 done
Robin.Portal.Page.WGJCD = {
    data: null,
    query: function () {

        var result = [];
        $.each(Robin.Data.monitor, function (i, v) {

            if (v.BMID.substring(6, 12) == "030304") {
                result.push(v);
            }
        });
        return result;
    },
    show: function (id, x, y, name) {
        if (!id) { return; }
        Robin.Portal.Page.WGJCD.data = null;
        var title = name;
        var url = 'panelInfo/PipeMonitor.html?StationKey=' + id + '&Name=' + name;
        Robin.Window.InfoPanel(title, '<iframe src="' + url + '" width="100%" height="100%"frameborder="0" scrolling="no"></iframe>',
            {
                id: 'gwjcdClickInfo',
                theme: '#2B3D51',
                contentSize: { width: 1000, height: 430 },
                position: 'center',
                headerControls: { controls: "closeonly" }, controls: { iconfont: 'font-awesome' }
            });
    },
    locate: function (stationKey) {
        var pdall = true;
        var pd = Robin.Map.MapWindow.IsOpenByID(stationKey);
        if (pd == false) {
            var point;
            var isWarn = false;
            var graphicsLayer = Robin.Map.addLayer({
                id: "pipeLayer" + stationKey
            });
            var _default = {
                font: { 'size': "12", 'style': 'normal', 'family': "微软雅黑" },
                color: [0, 89, 149]
            };
            Robin.Map.Event.bindClickEvent(graphicsLayer, function (evt) {
                Robin.Portal.Page.WGJCD.show(evt.attributes.BMID, evt.attributes.BMX, evt.attributes.BMY, evt.attributes.BMMC);
            });
            $.each(Robin.Data.monitor, function (i, v) {
                if (v.BMID == stationKey) {
                    $.get("templates/PipeInfo.htm", null, function (html, textStatus) {
                        point = Robin.Map.GetPoint(v.BMX, v.BMY);
                        var picurl = "../images/Scheduling/plugin/jcdicon.png";
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
                        $.each(Robin.Portal.Page.WGJCD.query(), function (i, item) {
                            var ht = Robin.Map.MapWindow.IsOpenByID(item.BMID);
                            if (ht == false) {
                                pdall = false;
                            }
                        });
                        if (pdall == true) {
                            $("#bar_PipeMonitorLoc").find('span').find('i').attr("class", "fa-instagram fa-trash");
                            $("#bar_PipeMonitorLoc").attr("title", "监测点清除");
                        }
                    }, "html");
                }
            });

        }
        $.each(Robin.Data.monitor, function (j, v) {

            if (stationKey == v.BMID) {

                var p = Robin.Map.GetPoint(v.BMX, v.BMY);
                Robin.Map.Fly2Geometry(Robin.Map.Map2DControl, p);
                return false;
            }
        });
    },
    clearlayer: function () {
        Robin.Map.ClearLayer(Robin.Map.Map2DControl, "pipeLayer");
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030304") {
                var id = "pipeLayer" + v.BMID;
                Robin.Map.ClearLayer(Robin.Map.Map2DControl, id);
            }
        });
        $.each(Robin.Data.monitor, function (j, v) {
            if (v.BMID.substring(6, 12) == "030304") {
                Robin.Map.MapWindow.CloseByID(v.BMID);
            }
        });
    }
};



//查询任务
Robin.Portal.Page.QueryTask = {

    //查询管线
    GX: function (callback) {
        NProgress.start();
        var url = Robin.Setting.GlobalSetting.BaseMapServices.WSGX.url;
        var queryTask = new esri.tasks.QueryTask(url);
        // 创建查询
        var query = new esri.tasks.Query();
        query.outFields = ["*"];
        query.returnGeometry = true;
        //query.geometry = Robin.Map.Map2DControl.extent;
        // 执行查询任务
        query.where = "FID > 0";
        queryTask.execute(
            query,

             // 查询成功
            function (data) {

                NProgress.done();
                callback(data);
            },
            function (err) {

                NProgress.done();
                callback(null);

            });
    }
}

Robin.Portal.QueryAlert = function (type) {
    tmodel.monitorType(type);
}


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


Robin.CloseOneInfoPanel = function (a) {
    $.each(Robin.Window.instances,
    function (c, d) {
        if (d && d.id == a) {
            var b = d.obj;
            b.close();
            return
        }
    })
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
