/* 装载系统启动所用脚本 */
RequireJS(["Framework/robin"], function () {
    Robin.Data.ViewModel = {
        //监测数据集合
        monitorData: []
    };
    //@constructor 名称：viewmodel的映射文件
    //@description 作用：实时显示监测数据
    Robin.Data.Mapping ={ };
    //根据监测点编号获得监测点信息
    Robin.Data.getBasicMonitor = function (stationKey) {
        var model;
        $.each(Robin.Data.monitor, function (i, v) {
            if (v.BMID == stationKey) {
                model = v;
                return false;
            }
        });
        return model;
    };
    Robin.Data.onInit = function () {
        $.each(Robin.Data.config, function (i, v) {
            //将实时保存到viewmodel 对象中，便于实时展示
            var monitorModel = Robin.Data.getBasicMonitor(v.STATION_KEY);
            var stationName = '';
            if (monitorModel != undefined) {
                stationName = monitorModel.BMMC;
            }
            var level = "0";
            if (v.TAG_VALUE >= v.L1_START && v.TAG_VALUE <= v.L1_END) {
                level = "1";
            }
            if (v.TAG_VALUE >= v.L2_START && v.TAG_VALUE <= v.L2_END) {
                level = "2";
            }
            if (v.TAG_VALUE >= v.L3_START && v.TAG_VALUE <= v.L3_END) {
                level = "3";
            }
            var time = v.SAVE_DATE;
            if (time != undefined) {
                if (time.indexOf('Date') > -1) {
                    time = Robin.Utils.ToDate(time);
                }
            }
            else {
                time = " ";
            }
            Robin.Data.ViewModel.monitorData.push(
            {
                  stationKey: v.STATION_KEY,
                  stationName: stationName,
                  tagKey: v.TAG_CODE,
                  tagName: v.TAG_DESC,
                  value: v.TAG_VALUE == null ? '' : v.TAG_VALUE.toFixed(2),
                  time: time,
                  level: level,
                  unit: v.UNITS,
                  message: ''
            });
        });
    };
});
