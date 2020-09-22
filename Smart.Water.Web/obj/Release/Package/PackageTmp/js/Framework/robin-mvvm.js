/**
 * 默认mvvm
 *
 */

/*初始化mvvm命名空间*/
if (!this["Robin.MVVM"]) { Robin.MVVM = {}; }

//监测模型
Robin.MVVM.RuntimeModel = function () {

    this.StationKey = ko.observable();
    this.StationName = ko.observable();
    this.TagKey = ko.observable();
    this.TagCode = ko.observable();
    this.TagName = ko.observable();
    this.TagValue = ko.observable();
    this.Message = ko.observable();
    this.Level = ko.observable();
    this.SaveTime = ko.observable();
    this.StationType = ko.observable();
    this.Units = ko.observable();


};

//报警模型
Robin.MVVM.AlertModel = function () {

    this.StationKey = ko.observable();
    this.StationName = ko.observable();
    //唯一编号
    this.TagKey = ko.observable();
    //监测项描述
    this.TagName = ko.observable();
    this.TagValue = ko.observable();
    //描述信息
    this.Message = ko.observable();
    this.JDTime=ko.observable();
    this.Level = ko.observable();
    this.SaveTime = ko.observable();
    this.StationType = ko.observable();
    this.Units = ko.observable();
    //报警id
    this.AlertId = ko.observable();
};


Robin.MVVM.ViewModel = function () {
    var self = this;
    self.monitorData = ko.observableArray([]);
    self.alertData=ko.observableArray([]);
    self.monitorType = ko.observable('');
    self.filteredRecords = ko.computed(function () {

        return ko.utils.arrayFilter(self.monitorData(), function (rec) {
            return (
                      (self.monitorType().length == 0 || rec.StationType() == self.monitorType())
                   )
        });
    });

    self.filteredRecordsWithAlert = ko.computed(function () {
        return ko.utils.arrayFilter(self.alertData(), function (rec) {
            return (
                      (self.monitorType().length == 0 || rec.StationType() == self.monitorType())
                   )
        });
    });
    //WHY添加
    self.filteredRecordsWithAlertNum = ko.computed(function () {
        return ko.utils.arrayFilter(self.alertData(), function (rec) {
            return (
                       //rec.Level() != null && Number(rec.Level()) > 0
                 rec
                   )
        }).length;
    });
};

//创建模型
Robin.MVVM.CreateRuntimeModel = function (model) {

    var result = new Robin.MVVM.RuntimeModel();
    result.StationKey(model.STATION_KEY);
    result.StationName(model.JCDNAME);
    result.TagKey(model.TAG_KEY);
    result.TagCode(model.TAG_CODE);
    result.TagName(model.TAG_DESC);
    result.TagValue(model.TAG_VALUE);
    result.Message("");
    result.Level(model.ALERTLEVEL);

    if (model.SAVE_DATE) {
        result.SaveTime(moment(model.SAVE_DATE).format("YYYY-MM-DD HH:mm:ss"));
    } else {
        result.SaveTime("");
    }

    result.StationType(model.STATION_KEY.substring(6, 12));
    result.Units(model.UNITS);
    return result;

};

//创建报警模型
Robin.MVVM.CreateAlertModel = function (model,stationName,tagDesc,unit) {

    var result = new Robin.MVVM.AlertModel();
    result.AlertId(model._id);
    result.StationKey(model.STATION_KEY);
    result.StationName(stationName);
    result.TagKey(model.TAG_KEY); 
    result.TagName(tagDesc);
    result.TagValue(model.TAG_VALUE);
    result.Message(model.EXTENDCODE);
    result.JDTime(model.EXTENDCODE2);
    //result.Level(model.ALERTLEVEL);
    if (model.SAVE_DATE) {
        result.SaveTime(moment(model.SAVE_DATE).format("YYYY-MM-DD HH:mm:ss"));
    } else {
        result.SaveTime("");
    }
    result.StationType(model.STATION_KEY.substring(6, 12));
    result.Units(unit);
    return result;

};

//更新模型
Robin.MVVM.UpdateRuntimeModel = function (model, collection) {

    $.each(collection, function (i, v) {

        if (v.TagCode() == model.TagKey) {
            v.TagValue(model.TagValue);
            v.Level(model.Level);
            if (model.SaveTime) {
                v.SaveTime(moment(model.SaveTime).format("YYYY-MM-DD HH:mm:ss"));
            } else {
                v.SaveTime("");
            }
            return false;
        }
    });

};
