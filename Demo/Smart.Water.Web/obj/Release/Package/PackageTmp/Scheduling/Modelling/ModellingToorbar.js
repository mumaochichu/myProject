/*MODELSQL对象*/
var modelSQL = {
    //模拟结果数据
    Data: [],
    //查询管点数据
    QueryResult: [],
    //查询管线数据
    QueryLine: [],
    //节点编号
    objectCode: "",
    //节点与数据库整理数据
    PResult: [],
    //结果数据
    TimeResult: [],
    //循环次数
    count: 0,
    max: "",
    min: "",
}

var timeRender = {
    timer: null, //全局变量,暂停用。
    num: 0, //全局变量 继续用。
    MyAutoRun: function (data, count) { //开始方法        
        var num = timeRender.num;
        timeRender.timer = setInterval(function () {
            if (num < count) {
                ShowResult(modelSQL.TimeResult[num]);
                ShowTable(modelSQL.TimeResult[num])
                num++
                timeRender.num = num; //记录次数 继续。
            } else {
                clearInterval(timeRender.timer);
            }
        }, 2000);
    },
    MyAutoRunSuspend: function () { //暂停方法
        clearInterval(timeRender.timer);
    }
}

$(function () {
    //////////////////菜单样式
    $(".model-btn").mouseenter(function () {
        $(this).css("background-color", "#25a0c2")
    });
    $(".model-btn").mouseleave(function () {
        $(this).css("background-color", "#3db9db")
    });
    ///////////////添加模拟方案-位于setting和xml文件中
    $("#selectProjectName").empty();
    $.each(Robin.Setting.SQLServices[0].item, function (i, v) {
        $("#selectProjectName").append("<option value='" + v.name + "'>" + v.name + "</option>");
    })
    $.each(Robin.Setting.SQLServices[1].item, function (i, v) {
        var parent = $("#selectProjectName").val();
        if (v.parentname == parent) {
            $("#selectObjectName").append("<option value='" + v.name + "' type='"+v.type+"'>" + v.name + "</option>");
            //$.each(v.show, function (ii, vv) {
            //    $("#selecttype").append("<option value='" + vv.showcode + "'>" + vv.showname + "</option>");
            //})
        }      
    })
    $.each(Robin.Setting.SQLServices[1].item, function (i, v) {
        var parentname = $("#selectProjectName").val();
        var name = $("#selectObjectName").val();
        if (v.name == name && v.parentname == parentname) {
            $.each(v.show, function (ii, vv) {
                $("#selecttype").append("<option value='" + vv.showcode + "'>" + vv.showname + "</option>");
            })
        }
    })
    //数据库改变
    $("#selectProjectName").change(function () {
        ShowRepair(modelSQL.PResult);
        modelSQL.Data = [];
        modelSQL.QueryResult = [];
        modelSQL.objectCode = "";
        modelSQL.PResult = [];
        modelSQL.TimeResult = [];
        var parentname = $("#selectProjectName").val();
        $("#selectObjectName").html("");
        $.each(Robin.Setting.SQLServices[1].item, function (i, v) {
            if (v.parentname == parentname) {
                $("#selectObjectName").append("<option value='" + v.name + "' type='" + v.type + "'>" + v.name + "</option>");
            }
        })
        var parentname = $("#selectProjectName").val();
        var name = $("#selectObjectName").val();
        $("#selecttype").html("");
        $.each(Robin.Setting.SQLServices[1].item, function (i, v) {
            if (v.name == name && v.parentname == parentname) {
                $.each(v.show, function (ii, vv) {
                    $("#selecttype").append("<option value='" + vv.showcode + "'>" + vv.showname + "</option>");
                })
            }
        })
    });
    //模型库改变
    $("#selectObjectName").change(function () {
        ShowRepair(modelSQL.PResult);
        modelSQL.Data = [];
        modelSQL.objectCode = "";
        modelSQL.PResult = [];
        modelSQL.TimeResult = [];
        var parentname = $("#selectProjectName").val();
        var name = $("#selectObjectName").val();
        $("#selecttype").html("");
        $.each(Robin.Setting.SQLServices[1].item, function (i, v) {
            if (v.name == name && v.parentname == parentname) {
                $.each(v.show, function (ii, vv) {
                    $("#selecttype").append("<option value='" + vv.showcode + "'>" + vv.showname + "</option>");
                })
            }
        })
    });
    //渲染类型改变
    $("#selecttype").change(function () {
        ShowRepair(modelSQL.PResult);
        timeRender.num = 0;
        if ($("#modelbar_Stop").val() == "暂停") {
            timeRender.MyAutoRunSuspend();
        } else {
            $("#modelbar_Stop").val("暂停");
            $("#modelbar_Back").attr('disabled', true);
            $("#modelbar_Go").attr('disabled', true);
            $("#modelbar_Start").attr('disabled', true);
        }
        $("#paTable").html("");
    });
    //暂停
    $("#modelbar_Stop").click(function () {
        if ($("#modelbar_Stop").val() == "暂停") {
            timeRender.num = timeRender.num - 1;
            timeRender.MyAutoRunSuspend();
            $("#modelbar_Stop").val("继续");
            $("#modelbar_Back").attr('disabled', false);
            $("#modelbar_Go").attr('disabled', false);
            $("#modelbar_Start").attr('disabled', false);
        } else {
            timeRender.num = timeRender.num + 1;
            timeRender.MyAutoRun(modelSQL.TimeResult, modelSQL.count)
            $("#modelbar_Stop").val("暂停");
            $("#modelbar_Back").attr('disabled', true);
            $("#modelbar_Go").attr('disabled', true);
            $("#modelbar_Start").attr('disabled', true);
        }      
    })
    //返回
    $("#modelbar_Back").click(function () {
        if (timeRender.num > 0) {
            timeRender.num = timeRender.num - 1;
            ShowResult(modelSQL.TimeResult[timeRender.num]);
            ShowTable(modelSQL.TimeResult[timeRender.num]);
        } else {
            noty({ text: "已达到最小时间无法后退", type: "warning", layout: "topCenter", timeout: 2000 });
        }
    })
    //前进
    $("#modelbar_Go").click(function () {
        if (timeRender.num < (modelSQL.count - 1)) {
            timeRender.num = timeRender.num + 1;
            ShowResult(modelSQL.TimeResult[timeRender.num]);
            ShowTable(modelSQL.TimeResult[timeRender.num]);
        } else {
            noty({ text: "已达到最大时间无法前进", type: "warning", layout: "topCenter", timeout: 2000 });
        }
        
    })
    //还原
    $("#modelbar_Start").click(function () {
        timeRender.num = 0;
        ShowResult(modelSQL.TimeResult[timeRender.num]);
        ShowTable(modelSQL.TimeResult[timeRender.num]);
    })
    //获取地图数据
    $("#modelbar_Selector").click(function () {
        if (Robin.ToolBar.toolbar != undefined) {
            Robin.ToolBar.toolbar.deactivate();
        }
        modelSQL.Data = [];
        modelSQL.QueryResult = [];
        modelSQL.objectCode = "";
        modelSQL.PResult = [];
        modelSQL.TimeResult = [];
        timeRender.num = 0;
        if ($("#modelbar_Stop").val() == "暂停") {
            timeRender.MyAutoRunSuspend();
        } else {
            $("#modelbar_Stop").val("暂停");
            $("#modelbar_Back").attr('disabled', true);
            $("#modelbar_Go").attr('disabled', true);
            $("#modelbar_Start").attr('disabled', true);
        }
        $("#paTable").html("");
        Robin.Map.Map2DControl.graphics.clear();
        Robin.ToolBar.toolbar = new esri.toolbars.Draw(Robin.Map.Map2DControl);
        Robin.ToolBar.toolbar.activate(esri.toolbars.Draw.EXTENT);//esri.toolbars.Draw.EXTENT);
        Robin.ToolBar.toolbar.on("draw-end", function (evt) {
            Robin.ToolBar.toolbar.deactivate();

            //框选查询结果
            Robin.ToolBar.QueryGeometry = evt.geometry;
            NProgress.start();
            //查询此区域下的图层
            var count = 0;
            var layerNames = [];
            var QueryResult = [];
            var list = [];
            var queryResultObj = [];
            var identify, identifyParams;
            $.each(Robin.Setting.ArcGISMapServices, function (i, v) {
                if (v.url == '') {
                    count++;
                    return true;
                }
                var QueryGeometry = new esri.geometry.Extent(parseFloat(Robin.Setting.MapSetting.initExtent.xmin),
                                                          parseFloat(Robin.Setting.MapSetting.initExtent.ymin),
                                                          parseFloat(Robin.Setting.MapSetting.initExtent.xmax),
                                                          parseFloat(Robin.Setting.MapSetting.initExtent.ymax),
                                                          new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
                identify = new esri.tasks.IdentifyTask(v.url);
                identifyParams = new esri.tasks.IdentifyParameters();
                //identifyParams.geometry = QueryGeometry;
                identifyParams.geometry = Robin.ToolBar.QueryGeometry;
                identifyParams.mapExtent = Robin.Map.Map2DControl.extent;
                identifyParams.width = Robin.Map.Map2DControl.width;
                identifyParams.height = Robin.Map.Map2DControl.height;
                identifyParams.returnGeometry = true;
                identifyParams.tolerance = 3;
                identifyParams.spatialReference = new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid });
                identifyParams.layerIds = [11,10,9,8];
                identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
                QueryResult = [];
                queryResultObj = [];
                list = [];
                identify.execute(identifyParams, function (result) {
                    count++;
                    $.each(result, function (ii, vv) {
                        QueryResult.push({ "layerName": vv.layerName, "attributes": vv.feature.attributes, "geometry": vv.feature.geometry });
                    });
                    $.each(Robin.Setting.ArcGISMapServices[0].item, function (i, v) {
                        list.push(v);
                    });
                    var data = [];
                    $.each(QueryResult, function (i, v) {
                        $.each(list, function (ii, vv) {
                            if (v.layerName == vv.name) {
                                data.push(v);
                            }
                        });
                    });
                    require([
                   "esri/map",
                   "esri/dijit/InfoWindowLite",
                   "esri/InfoTemplate",
                   "esri/layers/FeatureLayer",
                   "dojo/dom-construct",
                   "dojo/domReady!"], function () {
                       $.each(data, function (i, v) {
                           var tempItem = v;
                           var geometry = tempItem.geometry.setSpatialReference(new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
                           switch (geometry.type) {
                               case "point":
                                   modelSQL.QueryResult.push(v);
                                   var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                                      new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                                      new dojo.Color([255, 0, 0]), 1),
                                                      new dojo.Color([255, 0, 0, 1]));
                                   var graphic = new esri.Graphic(geometry, MarkerSymbol);
                                   Robin.Map.Map2DControl.graphics.add(graphic);
                                   break;
                               case "polygon":
                               case "polyline":
                               default:
                                   modelSQL.QueryLine.push(v);
                                   var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 3);
                                   var graphic = new esri.Graphic(geometry, polylineSymbol);
                                   Robin.Map.Map2DControl.graphics.add(graphic);
                                   break;
                           }
                       })
                       NProgress.done();
                   })
                }), function (err) {
                    alert(err);
                    /*关闭Loading*/
                    NProgress.done();
                };
            });

        });
    })
    //模型节点数据获取
    $("#model2").click(function () {
        if (!modelSQL.QueryResult.length) {
            noty({ text: "无地图数据，请先进行图层查询", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        modelSQL.PResult = [];
        modelSQL.objectCode = "";
        //var parentname = "模型测试";
        //var name = "基本节点";
        var parentname = $("#selectProjectName").val();
        var name = $("#selectObjectName").val();
        modelSQL.objectCode = "";
        $.ajax({
            type: 'POST',
            dataType: 'json',
            async: false,
            url: "../Scheduling/Modelling/Handler.ashx?Action=model&parentname=" + parentname + "&name=" + name,
            success: function (result) {
                modelSQL.object = result;
                var objectCode = "";
                var type = $("#selectObjectName").find("option:selected").attr('type')
                if (type == "point") {
                    $.each(result, function (i, v) {
                        $.each(modelSQL.QueryResult, function (ii, vv) {
                            if (vv.attributes.OBJECTID == v.V__309) {
                                modelSQL.PResult.push({ "G__OBJ_ID": v.G__OBJ_ID, "layerName": vv.layerName, "attributes": vv.attributes, "geometry": vv.geometry });
                                objectCode += v.G__OBJ_ID + ',';
                            }
                        });
                    });
                } else {
                    $.each(result, function (i, v) {
                        $.each(modelSQL.QueryLine, function (ii, vv) {
                            if (vv.attributes.OBJECTID == v.V__322) {
                                modelSQL.PResult.push({ "G__OBJ_ID": v.G__OBJ_ID, "layerName": vv.layerName, "attributes": vv.attributes, "geometry": vv.geometry });
                                objectCode += v.G__OBJ_ID + ',';
                            }
                        });
                    });
                }
               
                modelSQL.objectCode = objectCode;
                noty({ text: name + "获取成功", type: "success", layout: "topCenter", timeout: 2000 });
            },
            error: function (msg, textStatus) {
                //alert("okokokok");
                alert(msg + "   " + textStatus);
            }
        });
    });
    //模拟结果获取
    $("#modelbar_Clear").click(function () {
        if (!modelSQL.PResult.length) {
            noty({ text: "无节点数据，请进行节点数据获取", type: "warning", layout: "center", timeout: 2000 });
            return;
        }
        modelSQL.Data = [];
        var projectName = $("#selectProjectName").val();
        var layerName = $("#selectObjectName").val();
        var objectCode = modelSQL.objectCode;
        $.ajax({
            type: 'POST',
            dataType: 'json',
            async: false,
            url: "../Scheduling/Modelling/Handler.ashx?Action=SQL&projectName=" + projectName + "&layerName=" + layerName,
            data: {"objectCode": objectCode},
            success: function (result) {
                modelSQL.Data = result;
                noty({ text: "模拟结果获取成功", type: "success", layout: "topCenter", timeout: 2000 });
            },
            error: function (msg, textStatus) {
                alert(msg + "   " + textStatus);
            }
        });
    });
    //渲染
    $("#modelbar_Render").click(function () {
        if (!modelSQL.Data.length) {
            noty({ text: "无模拟结果，请先进行模拟结果获取", type: "warning", layout: "topCenter", timeout: 2000 });
            return;
        }
        modelSQL.max = "";
        modelSQL.min = "";
        modelSQL.TimeResult = [];
        $("#Slimscroll").slimscroll({
            height: '400px',
        });
        $("#modelbar_Stop").show();
        $("#modelbar_Back").show();
        $("#modelbar_Go").show();
        $("#modelbar_Start").show();
        var AllResult = [];
        var show = $("#selecttype").val();
        $.each(modelSQL.PResult, function (i, v) {
            $.each(modelSQL.Data, function (ii, vv) {
                if (v.G__OBJ_ID == vv.G__OBJ_ID) {
                    AllResult.push({ "G__OBJ_ID": v.G__OBJ_ID, "layerName": v.layerName, "attributes": v.attributes, "geometry": v.geometry, "value": vv[show], "time": vv.G__OBJ_TIME });
                }
            });
        });
        $.each(AllResult, function (i, v) {
            if (i == 0) {
                modelSQL.max = parseFloat(v.value);
                modelSQL.min = parseFloat(v.value);
            } else {
                if (modelSQL.max < parseFloat(v.value)) {
                    modelSQL.max = parseFloat(v.value);
                }
                if (modelSQL.min > parseFloat(v.value)) {
                    modelSQL.min = parseFloat(v.value);
                }
            }
        });
         $("#num1").html(modelSQL.max.toFixed(2) + "~" + (modelSQL.max - (modelSQL.max - modelSQL.min) * 1 / 5).toFixed(2));
         $("#num2").html((modelSQL.max - (modelSQL.max - modelSQL.min) * 1 / 5).toFixed(2) + "~" + (modelSQL.max - (modelSQL.max - modelSQL.min) * 2 / 5).toFixed(2));
         $("#num3").html((modelSQL.max - (modelSQL.max - modelSQL.min) * 2 / 5).toFixed(2) + "~" + (modelSQL.max - (modelSQL.max - modelSQL.min) * 3 / 5).toFixed(2));
         $("#num4").html((modelSQL.max - (modelSQL.max - modelSQL.min) * 3 / 5).toFixed(2) + "~" + (modelSQL.max - (modelSQL.max - modelSQL.min) * 4 / 5).toFixed(2));
         $("#num5").html((modelSQL.max - (modelSQL.max - modelSQL.min) * 4 / 5).toFixed(2) + "~" + modelSQL.min.toFixed(2));
         $("#legendBoard").show();
         var count = AllResult.length / modelSQL.PResult.length;
        modelSQL.count = count;
        var result = [];
        for (var i = 0; i < count; i++) {
            var result = [];
            for (var j = 0; j < modelSQL.PResult.length; j++) {
                result.push(AllResult[i + j * count]);
            }
            modelSQL.TimeResult.push(result);
        }
        timeRender.MyAutoRun(modelSQL.TimeResult, count)
    })
});
function ShowResult(data) {
    require([
           "esri/map",
           "esri/dijit/InfoWindowLite",
           "esri/InfoTemplate",
           "esri/layers/FeatureLayer",
           "dojo/dom-construct",
           "dojo/domReady!"], function () {
               $.each(data, function (i, v) {
                   var tempItem = v;
                   var geometry = tempItem.geometry.setSpatialReference(new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
                   switch (geometry.type) {
                       case "point":
                           if (v.value <= modelSQL.max && v.value > (modelSQL.max-(modelSQL.max-modelSQL.min)/5)){
                               //粉色
                               var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                            new dojo.Color([55, 249, 28]), 1),
                                            new dojo.Color([55, 249, 28, 1]));
                               var graphic = new esri.Graphic(geometry, MarkerSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) / 5) && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) * 2 / 5)) {
                               //黄色
                               var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                            new dojo.Color([47, 186, 80]), 1),
                                            new dojo.Color([47, 186, 80, 1]));
                               var graphic = new esri.Graphic(geometry, MarkerSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) * 2 / 5) && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) * 3 / 5)) {
                               //绿色
                               var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                            new dojo.Color([39, 123, 132]), 1),
                                            new dojo.Color([39, 123, 132, 1]));
                               var graphic = new esri.Graphic(geometry, MarkerSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) * 3 / 5) && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) * 4 / 5)) {
                               //蓝色
                               var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                            new dojo.Color([31, 60, 184]), 1),
                                            new dojo.Color([31, 60, 184, 1]));
                               var graphic = new esri.Graphic(geometry, MarkerSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) * 4 / 5) && v.value >= modelSQL.min) {
                               //绿色
                               var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                            new dojo.Color([23, -3, 236]), 1),
                                            new dojo.Color([23, -3, 236, 1]));
                               var graphic = new esri.Graphic(geometry, MarkerSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } 
                       case "polygon":
                       case "polyline":
                       default:
                           if (v.value <= modelSQL.max && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) / 5)) {
                               var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([55, 249, 28]), 3);
                               var graphic = new esri.Graphic(geometry, polylineSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) / 5) && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) * 2 / 5)) {
                               var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([47, 186, 80]), 3);
                               var graphic = new esri.Graphic(geometry, polylineSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) * 2 / 5) && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) * 3 / 5)) {
                               var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([39, 123, 132]), 3);
                               var graphic = new esri.Graphic(geometry, polylineSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) * 3 / 5) && v.value > (modelSQL.max - (modelSQL.max - modelSQL.min) * 4 / 5)) {
                               var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([31, 60, 184]), 3);
                               var graphic = new esri.Graphic(geometry, polylineSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           } else if (v.value <= (modelSQL.max - (modelSQL.max - modelSQL.min) * 4 / 5) && v.value >= modelSQL.min) {
                               var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([23, -3, 236]), 3);
                               var graphic = new esri.Graphic(geometry, polylineSymbol);
                               Robin.Map.Map2DControl.graphics.add(graphic);
                               break;
                           }                          
                   }
               })
           })
}

function ShowTable(data) {
    var type = $("#selectObjectName").find("option:selected").attr('type');
    if (type == "point") {
        var html = "";
        html += "<tr>";
        html += "<th>图上点号</th>";
        html += "<th>地面高程</th>";
        html += "<th>" + $("#selecttype").find("option:selected").text() + "</th>";
        html += "<th>时间</th>";
        html += "<th>曲线</th>";
        html += "</tr>";
        $.each(data, function (i, v) {
            html += "<tr>";
            html += "<td>" + v.attributes["图上点号"] + "</td>";
            html += "<td>" + v.attributes["地面高程"] + "</td>";
            html += "<td>" + v.value + "</td>";
            html += "<td>" + v.time + "</td>";
            html += "<td><a href='#' title='图像' onclick='Char(\"" + i + "\")'><i class='fa fa-bar-chart-o'></i>&nbsp&nbsp</a></td>";
            html += "</tr>";
        })
        $("#paTable").html(html);
        $('#paTable tbody tr').bind('dblclick', function () {
            var rIndex = this.rowIndex;
            if (rIndex != 0) {
                ShowPoint(rIndex);
            }
        });
    } else {
        var html = "";
        html += "<tr>";
        html += "<th>起始点号</th>";
        html += "<th>起点埋深</th>";
        html += "<th>终点埋深</th>";
        html += "<th>管线材质</th>";
        html += "<th>管径</th>";
        html += "<th>" + $("#selecttype").find("option:selected").text() + "</th>";
        html += "<th>时间</th>";
        html += "<th>曲线</th>";
        html += "</tr>";
        $.each(data, function (i, v) {
            html += "<tr>";
            html += "<td>" + v.attributes["起始点号"] + "</td>";
            html += "<td>" + v.attributes["起点埋深"] + "</td>";
            html += "<td>" + v.attributes["终点埋深"] + "</td>"; 
            html += "<td>" + v.attributes["管线材质"] + "</td>";
            html += "<td>" + v.attributes["管径"] + "</td>";
            html += "<td>" + v.value + "</td>";
            html += "<td>" + v.time + "</td>";
            html += "<td><a href='#' title='图像' onclick='Char(\"" + i + "\")'><i class='fa fa-bar-chart-o'></i>&nbsp&nbsp</a></td>";
            html += "</tr>";
        })
        $("#paTable").html(html);
        $('#paTable tbody tr').bind('dblclick', function () {
            var rIndex = this.rowIndex;
            if (rIndex != 0) {
                ShowPoint(rIndex);
            }
        });
    }
}

function ShowPoint(rIndex) {
    var data = modelSQL.TimeResult[timeRender.num][rIndex - 1];
    Robin.Map.Map2DControl.infoWindow.hide();
    var temInfo = parent.Robin.Map.Map2DControl.infoWindow;
    var tempItem = modelSQL.TimeResult[timeRender.num][rIndex - 1];
    var geometry = tempItem.geometry.setSpatialReference(new esri.SpatialReference({ wkid: parent.Robin.Setting.GlobalSetting.wkid }));
    Robin.Map.Map2DControl.infoWindow.resize(300, 180);
    temInfo.setTitle("<center><b>详细信息<b></center>");
    var htmlcontent = '';
    var type = $("#selectObjectName").find("option:selected").attr('type');
    if (type == "point") {
        htmlcontent += "<tr><td width='100'>物探点号</td><td width='210'>" + tempItem.attributes["物探点号"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>图上点号</td><td width='210'>" + tempItem.attributes["图上点号"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>地面高程</td><td width='210'>" + tempItem.attributes["地面高程"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>特征</td><td width='210'>" + tempItem.attributes["特征"] + "</td></tr>";
    } else {
        htmlcontent += "<tr><td width='100'>起始点号</td><td width='210'>" + tempItem.attributes["起始点号"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>起点埋深</td><td width='210'>" + tempItem.attributes["起点埋深"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>终点埋深</td><td width='210'>" + tempItem.attributes["终点埋深"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>管线材质</td><td width='210'>" + tempItem.attributes["管线材质"] + "</td></tr>";
        htmlcontent += "<tr><td width='100'>管径</td><td width='210'>" + tempItem.attributes["管径"] + "</td></tr>";
    }  
    temInfo.setContent("<center><table class='bordered'>" + htmlcontent + "</table></center>");
    Robin.Map.Map2DControl.infoWindow = temInfo;
    switch (geometry.type) {
        case "point":
            Robin.Map.Map2DControl.infoWindow.show(geometry);
            Robin.Map.Map2DControl.centerAndZoom(geometry, parent.Robin.Map.Map2DControl.getMaxZoom());
            break;
        case "polygon":
        case "polyline":
        default:
            var extent = geometry.getExtent().expand(1.3);
            Robin.Map.Map2DControl.infoWindow.show(geometry.getExtent().getCenter());
            Robin.Map.Map2DControl.setExtent(extent);
            break;
    }
            Robin.Portal.Page.IsShowInfo = true;
}

function Char(rIndex) {
    Robin.Window.InfoPanel("结果曲线图", '<iframe src="../Scheduling/Modelling/ModellingStatistics.html?rIndex=' + rIndex + '" width="100%" height="100%" frameborder="0"   tabindex="9999"></iframe>',
     {
         id: 'Char',
         contentSize: { width: 850, height: 350 },
         minimizeOthers: false,
         paneltype: 'hint',
         theme: '#2B3D51'
     });
}

function ShowRepair(data) {
    require([
           "esri/map",
           "esri/dijit/InfoWindowLite",
           "esri/InfoTemplate",
           "esri/layers/FeatureLayer",
           "dojo/dom-construct",
           "dojo/domReady!"], function () {
               $.each(data, function (i, v) {
                   var tempItem = v;
                   var geometry = tempItem.geometry.setSpatialReference(new esri.SpatialReference({ wkid: Robin.Setting.GlobalSetting.wkid }));
                   switch (geometry.type) {
                       case "point":
                           modelSQL.QueryResult.push(v);
                           var MarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
                                              new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                              new dojo.Color([255, 0, 0]), 1),
                                              new dojo.Color([255, 0, 0, 1]));
                           var graphic = new esri.Graphic(geometry, MarkerSymbol);
                           Robin.Map.Map2DControl.graphics.add(graphic);
                       case "polygon":
                       case "polyline":
                       default:
                           modelSQL.QueryLine.push(v);
                           var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 3);
                           var graphic = new esri.Graphic(geometry, polylineSymbol);
                           Robin.Map.Map2DControl.graphics.add(graphic);
                           break;
                   }
               })
           })
}