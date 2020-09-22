$(function () {
    var endDate, startDate;
    var unitData = '', personData = '';
   
    //所有维修数据
      var   statisticsData = '';
    /*初始化时间、页面和数据*/
    initDate();
   
    



    //设置初始人员不可选
    $("#personList").prop("disabled", true);
    //当人员或部门发生变化时
    $("#partmentList").change(function () {
        //填充数据
        $("#personList").html('');
        var personHtml = "<option value='personalAll'>全部</option>"
        for (var i = 0; i < personData.length; i++) {
            if ($("#partmentList").find('option:selected').val() == personData[i].UNITID)
                personHtml += '<option value="' + personData[i].ID + '">' + personData[i].NAME + '</option>';
        }
        //设置默认值
        $("#personList").append(personHtml);
        $("#personList").select2();
        $("#personList").val("personalAll").trigger("change");   //设置默认值
        selectPart();
    });
    $("#personList").change(function () {
        if ($("#partmentList").find('option:selected').val() == "partAll") {
            $("#personList").prop("disabled", true);
        } else {
            $("#personList").prop("disabled", false);
        }
        selectPart();
    });
    $(".slimscrollDiv").slimScroll({
        height: '320px', 
    });
    ///*切换tab页面*/
    //$(".nav-item").click(function () {
    //    selectTab();
    //})
    //判断显示单位统计时，左侧表格显示
    function selectPart() {
        //如果点击部门维修标签
        //统计所有单位的维修信息,统计每个单位的维修总数
        var unitName = $("#partmentList").find('option:selected').text();
        var unitVal = $("#partmentList").find('option:selected').val();
        var keyWord = $("#statisicsKeyWord").val();
        //全部单位的
        if (unitVal == "partAll") {
            var title = "从" + startDate + "到" + endDate + "所有部门的维修统计";
            $("#partmentTitle").html(title);
            statisticsPersonUnit(statisticsData, unitVal, keyWord);
        }
            //某一单位的
        else if (unitVal != "partAll" && unitVal != "personAll") {
            var title = "从" + startDate + "到" + endDate + "" + unitName + "的维修统计";
            $("#partmentTitle").html(title);
            statisticsPersonUnit(statisticsData, unitVal, keyWord)
        }
            //全部人的
        else if (unitVal == "personAll") {
            var title = "从" + startDate + "到" + endDate + "全部人员的维修统计";
            $("#partmentTitle").html(title);
            statisticsPersonUnit(statisticsData, unitVal, keyWord);
        }
    }
    /*初始化时间*/
    function initDate() {
        var date = new Date();
        endDate = moment().format("YYYY-MM-DD");
        startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
        $(".startTime").val(startDate);
        $(".endTime").val(endDate);
        selectPart();

        //设置时间并加载数据
        var title = "从" + startDate + "到" + endDate + "维修故障统计";
        $("#troubleShootingTitle").text(title);

        //设置时间并加载数据
        var title = "从" + startDate + "到" + endDate + "设备故障统计";
        $("#troubleFacilityTitle").html(title);
        //添加数据
        initUintAndPerson();


    }
    //查询触发事件
    $(".select2").select2();
    $(".select2").on("select2:select", function () {
        var data = $(this).val();
    });

    //获取单位和用户以及维修信息
    function initUintAndPerson() {
        var url = "../../Handler/StatisticsHandler.ashx?Action=QueryUnitPersonData&startDate=" + startDate + "&endDate=" + endDate;
        $.ajax({
            url: url,
            dataType: "text",
            type: "get",
            cache: false,
            success: function (result) {
                var unitPersonDataJson = $.parseJSON(result);
                //单位信息
                unitData = unitPersonDataJson[0].unitData;
                //员工信息
                personData = unitPersonDataJson[0].personData;
                //维修信息
                statisticsData = unitPersonDataJson[0].statisticsData;
                var unitHtml = "";
                //填充维修单位
                for (var i = 0; i < unitData.length; i++) {
                    unitHtml += '<option value="' + unitData[i].ID + '">' + unitData[i].UNITNAME + '</option>';
                }
                $("#partmentList").append(unitHtml);
                //填充人员，默认第一个
                var personHtml = '';
                for (var i = 0; i < personData.length; i++) {
                    if (unitData[0].ID == personData[i].UNITID)
                        personHtml += '<option value="' + personData[i].ID + '">' + personData[i].NAME + '</option>';
                }
                $("#personList").append(personHtml);

                //对信息进行统计处理
                //统计所有单位的维修信息,统计每个单位的维修总数
                statisticsPersonUnit(statisticsData, "partAll", '');
                ////以故障类型统计
                //maintainTypeSta(statisticsData);
                ////以故障设备统计
                //facilitySta(statisticsData);
            }
        });
    }

    //统计所有单位维修故障
    function statisticsPersonUnit(maintainData, unitID,keyWord) {
        //  图表的x和y轴
        var chartDataList =[];
        //对数据进行筛选
       
        var allPartmentData = dataFilter(maintainData, keyWord, unitID);
        //用于页面表格填充的
        var personOrUnit = "单位名称";
        if (unitID != 'partAll') {
            personOrUnit = "人员名称";
        }
        //判断数据是否存在
        if (allPartmentData.length>0) {
            //右侧图表
            for (var i = 0; i < allPartmentData.length; i++) {
                chartDataList.push({
                    xName: allPartmentData[i].name,
                    yData: allPartmentData[i].number
                })
            }
            if (unitID != 'partAll') {
                selectChartData(chartDataList, "chartAllDepartment", "bar");
            } else {
                selectChartData(chartDataList, "chartAllDepartment", 'pie');
            }
            //左侧表格填充内容
            $("#allDepartmentHead>div").remove();
            $("#allDepartmentHead").append('<div class="tableContent_div"><p class="col-md-6">' + personOrUnit + '</p><p class="col-md-6 p_right_border">维修次数</p></div>');
            var maintainAllUnitHtml = '';
            //总计
            var sumType1 = 0, sumType2 = 0, sumType3 = 0, sum = 0;
            for (var i = 0; i < allPartmentData.length; i++) {
                var unitName, maintainNumber = 0;
                unitName = allPartmentData[i].name;
                maintainNumber = allPartmentData[i].number;
                sum += maintainNumber;
                maintainAllUnitHtml += '<div class="tableContent_div"><p class="col-md-6">' + unitName + '</p><p class="col-md-6 p_right_border">' + maintainNumber + '</p></div>';
            }
            $("#allDepartmentContent>div").remove();
            $("#allDepartmentContent").append(
                maintainAllUnitHtml
              );
        }
        else {
            $("#allDepartmentHead>div").remove();
            $("#allDepartmentContent>div").remove();
            $("#allDepartmentHead").append(
                '<div class="tableContent_div">'
                    + '<div class="tableContent_div"><p class="col-md-6">' + personOrUnit + '</p><p class="col-md-6 p_right_border">维修次数</p></div>'
                    + '</div><div class="tableContent_div"><p class="col-md-12 p_right_border" style="left:0;text-align:center;padding-top: 5px;">该时间段暂无维修数据！</p></div>');
            clearCharts("chartAllDepartment");
        }
    }
    //统计指定单位的维修信息
    function statisticsUnit(maintainData, unitID,keyWord,isExport) {
        //  图表的x和y轴
        var chartDataList = [];
        var unitData = [], unitStatisticsData = [];
        //筛选部门
        if (unitID&&unitID!="partAll"&&unitID!="personAll") {
            for (var i = 0; i < maintainData.length; i++) {
                if (maintainData[i].UNITID == unitID) {
                    unitStatisticsData.push(maintainData[i]);
                }
            }
        } else {
            unitStatisticsData = maintainData;
        }
        //筛选关键字
        //for(var )
        var keywordData = unitStatisticsData;
        unitStatisticsData = [];
        if (keyWord) {
            for (var i = 0; i < keywordData.length; i++) {
                if (keywordData[i].PERSONELNAME.indexOf(keyWord) > -1) {
                    unitStatisticsData.push(keywordData[i]);
                }
            }
        } else {
            unitStatisticsData = keywordData;
        }
            if (unitStatisticsData.length > 0) {
                unitData.push({
                    personID: unitStatisticsData[0].PERSONELID,
                    personName: unitStatisticsData[0].PERSONELNAME,
                    number: 0
                });
                var isExiced, isTypeExiced;
                for (var i = 0; i < unitStatisticsData.length; i++) {
                    //用于判断该员工和故障类型是否已存在
                    isExiced = false;
                    isTypeExiced = false;
                    for (var j = 0; j < unitData.length; j++) {
                        //如果员工存在
                        if (unitData[j].personID == unitStatisticsData[i].PERSONELID) {
                            unitData[j].number++;
                            isExiced = true;
                            break;
                        }
                    }
                    //该员工不存在
                    if (isExiced == false) {
                        unitData.push({
                            personID: unitStatisticsData[i].PERSONELID,
                            personName: unitStatisticsData[i].PERSONELNAME,
                            number: 1
                        });
                    }
                }
                //右侧图表
                for (var i = 0; i < unitData.length; i++) {
                    chartDataList.push({
                        xName: unitData[i].personName,
                        yData: unitData[i].number
                    })
                }
                selectChartData(chartDataList, "chartAllDepartment",'bar');
                //填充信息
                $("#allDepartmentHead>div").remove();
                $("#allDepartmentHead").append('<div class="tableContent_div"><p class="col-md-6">人员名称</p><p class="col-md-6 p_right_border">维修次数</p></div>');
                var maintainUnitHtml =  '';
                //总计
                var sumType1 = 0, sumType2 = 0, sumType3 = 0, sum = 0;
                for (var i = 0; i < unitData.length; i++) {
                    var personName, personMaintainNumber = 0;
                    personName = unitData[i].name;
                    personMaintainNumber = unitData[i].number;
                    sum += personMaintainNumber;
                    maintainUnitHtml += '<div class="tableContent_div"><p class="col-md-6">' + personName + '</p><p class="col-md-6 p_right_border">' + personMaintainNumber + '</p></div>';
                }
                //maintainUnitHtml += '<div class="tableContent_div"><p class="col-md-6">统计</p><p class="col-md-6 p_right_border">' + sum + '</p></div>';
                $("#allDepartmentContent>div").remove();
                $("#allDepartmentContent").append(
                    maintainUnitHtml
                  );
                if (isExport) {

                }
               
            } else {
                $("#allDepartmentHead>div").remove();
                $("#allDepartmentContent>div").remove();
                $("#allDepartmentHead").append(
                    '<div class="tableContent_div">'
                    + '<p class="col-md-6">人员名称</p><p class="col-md-6 p_right_border">维修次数</p>'
                    + '</div><div class="tableContent_div"><p class="col-md-12 p_right_border" style="left:0;text-align:center;padding-top: 5px;">该时间段暂无维修数据！</p></div>');
                clearCharts("chartAllDepartment");
            }
    }
    //统计员工的维修信息
    function statisyicsPerson(maintainData, personID) {
        //  图表的x和y轴
        var chartDataList = [];
        var personMaintainData = [], personData = [];

        for (var i = 0; i < maintainData.length; i++) {
            if (maintainData[i].PERSONELID == personID) {
                personMaintainData.push(maintainData[i]);
            }
        }

        if (personMaintainData.length > 0) {
            personData.push({
                maintainTime: personMaintainData[0].MAINTENTIME.substring(0, 10),
                number: 0,
                statisticsType: [
                    { type: personMaintainData[0].MAINTENTYPE, number: 0 }
                ]
            });
            var isExiced, isTypeExiced;
            for (var i = 0; i < personMaintainData.length; i++) {
                //用于判断该时间和故障类型是否已存在
                isExiced = false;
                isTypeExiced = false;
                for (var j = 0; j < personData.length; j++) {
                    //如果维修时间存在
                    if (personData[j].maintainTime == personMaintainData[i].MAINTENTIME.substring(0, 10)) {
                        for (var z = 0; z < personData[j].statisticsType.length; z++) {
                            //如果该故障类型存在
                            if (personMaintainData[i].MAINTENTYPE == personData[j].statisticsType[z].type) {
                                personData[j].statisticsType[z].number++;
                                isTypeExiced = true;
                                break;
                            }
                        }
                        //该故障类型不存在
                        if (isTypeExiced == false) {
                            personData[j].statisticsType.push({
                                type: personMaintainData[i].MAINTENTYPE,
                                number: 1
                            })
                        }
                        personData[j].number++;
                        isExiced = true;
                        break;
                    }
                }
                //该时间维修不存在
                if (isExiced == false) {
                    personData.push({
                        maintainTime: personMaintainData[i].MAINTENTIME.substring(0, 10),
                        number: 1,
                        statisticsType: [
                            { type: personMaintainData[i].MAINTENTYPE, number: 1 }
                        ]
                    });
                }
            }
            //右侧图表
            for (var i = 0; i < personData.length; i++) {
                chartDataList.push({
                    xName: personData[i].maintainTime,
                    yData: personData[i].number
                })
            }
            selectChartData(chartDataList, "chartAllDepartment");
            //填充左侧表格数据
            var maintainPersonHtml = "";
            $("#allDepartment>div").remove();
            $("#allDepartment").append(
                '<div class="tableContent_div">'
                + '<p class="col-md-4"style="width:27%" >时间</p><p class="col-md-2">检查</p><p class="col-md-2">修理</p><p class="col-md-2">保养</p><p class="col-md-2 p_right_border"style="width:16.75%">总计</p>'
                + '</div>');
            //总计
            var sumType1 = 0, sumType2 = 0, sumType3 = 0, sum = 0;
            for (var i = 0; i < personData.length; i++) {
                var maintainTime, personMaintainNumber = 0, type1 = 0, type2 = 0, type3 = 0;
                maintainTime = personData[i].maintainTime;
                personMaintainNumber = personData[i].number;

                var bb = personData[i].statisticsType;
                for (var j = 0; j < personData[i].statisticsType.length; j++) {
                    if (personData[i].statisticsType[j].type == "检查") {
                        type1 = personData[i].statisticsType[j].number;
                        sumType1 += type1;
                    }
                    if (personData[i].statisticsType[j].type == "修理") {
                        type2 = personData[i].statisticsType[j].number;
                        sumType2 += type2;
                    }
                    if (personData[i].statisticsType[j].type == "保养") {
                        type3 = personData[i].statisticsType[j].number;
                        sumType3 += type3;
                    }
                }
                sum += personMaintainNumber;
                maintainPersonHtml += '<div class="tableContent_div">';
                maintainPersonHtml += '<p class="col-md-4" style="text-align:left;width:27%">' + maintainTime + '</p><p class="col-md-2">' + type1 + '</p><p class="col-md-2">' + type2 + '</p><p class="col-md-2">' + type3 + '</p><p class="col-md-2 p_right_border"style="width:16.75%">' + personMaintainNumber + '</p>'
                maintainPersonHtml += ' </div>';
            }
            //maintainPersonHtml += '<div class="tableContent_div"><p class="col-md-4" style="text-align:left;width:27%">统计</p><p class="col-md-2">' + sumType1 + '</p><p class="col-md-2">' + sumType2 + '</p><p class="col-md-2">' + sumType3 + '</p><p class="col-md-2 p_right_border"style="width:16.75%">' + sum + '</p></div>';
            $("#allDepartment").append(
                maintainPersonHtml
              );
        } else {
            $("#allDepartment>div").remove();
            $("#allDepartment").append(
                '<div class="tableContent_div">'
                + '<p class="col-md-4" >单位名称</p><p class="col-md-2">检查</p><p class="col-md-2">修理</p><p class="col-md-2">保养</p><p class="col-md-2 p_right_border">总计</p>'
                + '</div><div class="tableContent_div"><p class="col-md-12 p_right_border" style="left:0;text-align:center;padding-top: 5px;">该时间段暂无维修数据！</p></div>');
            clearCharts("chartAllDepartment");
        }

    }

    //柱状图表
    function initBarEcharts(chartDataList, chartId) {
        var xName = [];
        var yData = [];
        for (var i = 0; i < chartDataList.length; i++) {
            xName.push(chartDataList[i].xName);
            yData.push(chartDataList[i].yData);

        }
        //var myChart = echarts.init(document.getElementById('chartAllDepartment'));
        var myChart = echarts.init(document.getElementById(chartId));

        // 指定图表的配置项和数据
        myChart.setOption({
            color: ['#3398DB'],
            title: {
                text: '维保统计柱状图',
                x: 'center',
                textStyle: {
                    fontWeight: 500,
                    fontSize:'16'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '6%',
                right: '4%',
                bottom: '6%',
                top: '12%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xName,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        rotate: -35
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: "数量/次",
                    nameLocation: "end",
                  //  nameGap: -55,
                   // nameRotate: -90,
                }
            ],
            series: [
                {
                    name: '故障数量',
                    type: 'bar',
                   // barWidth: '60%',
                    barMaxWidth: '35',
                    data: yData
                }
            ]
        });

    }
    //饼形图
    function initPieEcharts(chartDataList, chartId) {
        var xName = [];
        var yData = [];
        var data = [];
        for (var i = 0; i < chartDataList.length; i++) {
            data.push({
                value: chartDataList[i].yData,
                name: chartDataList[i].xName
            })
        }
        //var myChart = echarts.init(document.getElementById('chartAllDepartment'));
        var myChart = echarts.init(document.getElementById(chartId));

        // 指定图表的配置项和数据
        myChart.setOption({
            title: {
                text: '全部单位维修统计饼图',
                x: 'center',
                textStyle: {
                    fontWeight: 500,
                    fontSize:'16'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            series: [
                {
                    name: '维修数量/次',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });

    }

    //以故障类型为统计
    function maintainTypeSta(maintainData) {
        var maintainTypeData = [];
        var chartDataList = [];
        var statisticsData = maintainData;
        if (statisticsData.length > 0) {
            maintainTypeData.push({
                maintainType: statisticsData[0].MAINTENTYPE,
                number: 0
            });
            var isExiced;
            for (var i = 0; i < statisticsData.length; i++) {
                //用于判断故障类型是否已存在
                isExiced = false;
                for (var j = 0; j < maintainTypeData.length; j++) {
                    //如果该单位存在
                    if (maintainTypeData[j].maintainType == statisticsData[i].MAINTENTYPE) {
                        maintainTypeData[j].number++;
                        isExiced = true;
                        break;
                    }
                }
                //该单位不存在
                if (isExiced == false) {
                    maintainTypeData.push({
                        maintainType: statisticsData[i].MAINTENTYPE,
                        number: 1
                    });
                }
            }

            //右侧图表
            for (var i = 0; i < maintainTypeData.length; i++) {
                chartDataList.push({
                    xName: maintainTypeData[i].maintainType,
                    yData: maintainTypeData[i].number
                })
            }
            selectChartData(chartDataList, "chartTroubleShooting");
            //左侧表格填充内容
            $("#maintainTable>div").remove();
            $("#maintainTable").append(
                ' <div class="tableContent_div"><p class="col-md-6">故障类型</p><p class="col-md-6 p_right_border">维保次数</p></div>');
            var maintainTypeHtml = "";

            //总计
            var sumType1 = 0, sumType2 = 0, sumType3 = 0, sum = 0;
            for (var i = 0; i < maintainTypeData.length; i++) {
                var maintainType, maintainNumber = 0, type1 = 0, type2 = 0, type3 = 0;

                maintainType = maintainTypeData[i].maintainType;
                maintainNumber = maintainTypeData[i].number;

                //sum += maintainNumber;
                maintainTypeHtml += '<div class="tableContent_div"><p class="col-md-6">' + maintainType + '</p><p class="col-md-6 p_right_border">' + maintainNumber + '</p></div>';
            }
            // maintainAllUnitHtml += '<div class="tableContent_div"><p class="col-md-4" style="text-align:left">统计</p><p class="col-md-2">' + sumType1 + '</p><p class="col-md-2">' + sumType2 + '</p><p class="col-md-2">' + sumType3 + '</p><p class="col-md-2 p_right_border">' + sum + '</p></div>';
            $("#maintainTable").append(
                maintainTypeHtml
              );
        }
        else {
            $("#maintainTable>div").remove();
            $("#maintainTable").append(
                ' <div class="tableContent_div"><p class="col-md-6">故障类型</p><p class="col-md-6 p_right_border">维修次数</p></div>'
                +'<div class="tableContent_div"><p class="col-md-12 p_right_border" style="left:0;text-align:center;padding-top: 5px;">该时间段暂无维修数据！</p></div>'
                );
            clearCharts("chartTroubleShooting");
        }
    }

    //以故障设备为统计
    function facilitySta(maintainData) {
        var facilityData = [];
        var chartDataList = [];
        var statisticsData = maintainData;
        if (statisticsData.length > 0) {
            facilityData.push({
                facilityCode: statisticsData[0].HYDRANTCODE,
                facilityId: statisticsData[0].HYDRANTID,
                number: 0
            });
            var isExiced;
            for (var i = 0; i < statisticsData.length; i++) {
                //用于判断故障设备是否已存在
                isExiced = false;
                for (var j = 0; j < facilityData.length; j++) {
                    //如果该设备存在
                    if (facilityData[j].facilityId == statisticsData[i].HYDRANTID) {
                        facilityData[j].number++;
                        isExiced = true;
                        break;
                    }
                }
                //该单位不存在
                if (isExiced == false) {
                    facilityData.push({
                        facilityCode: statisticsData[i].HYDRANTCODE,
                        facilityId: statisticsData[i].HYDRANTID,
                        number: 1
                    });
                }
            }

            //右侧图表
            for (var i = 0; i < facilityData.length; i++) {
                chartDataList.push({
                    xName: facilityData[i].facilityCode,
                    yData: facilityData[i].number
                })
            }
            selectChartData(chartDataList, "chartTroubleFacility");
            //左侧表格填充内容
            $("#faclityTable>div").remove();
            $("#faclityTable").append(
                ' <div class="tableContent_div"><p class="col-md-6">设备编号</p><p class="col-md-6 p_right_border">维修次数</p></div>');
            var maintainFacilityHtml = "";

            //总计
            var sumType1 = 0, sumType2 = 0, sumType3 = 0, sum = 0;
            for (var i = 0; i < facilityData.length; i++) {
                var facilityCode, maintainNumber = 0, type1 = 0, type2 = 0, type3 = 0;

                facilityCode = facilityData[i].facilityCode;
                maintainNumber = facilityData[i].number;

                //sum += maintainNumber;
                maintainFacilityHtml += '<div class="tableContent_div"><p class="col-md-6">' + facilityCode + '</p><p class="col-md-6 p_right_border">' + maintainNumber + '</p></div>';
            }
            // maintainAllUnitHtml += '<div class="tableContent_div"><p class="col-md-4" style="text-align:left">统计</p><p class="col-md-2">' + sumType1 + '</p><p class="col-md-2">' + sumType2 + '</p><p class="col-md-2">' + sumType3 + '</p><p class="col-md-2 p_right_border">' + sum + '</p></div>';
            $("#faclityTable").append(
                maintainFacilityHtml
              );
        }
        else {
            $("#faclityTable>div").remove();
            $("#faclityTable").append(
                ' <div class="tableContent_div"><p class="col-md-6">故障类型</p><p class="col-md-6 p_right_border">维修次数</p></div>'
                + '<div class="tableContent_div"><p class="col-md-12 p_right_border" style="left:0;text-align:center;padding-top: 5px;">该时间段暂无维修数据！</p></div>'
                );
            clearCharts("chartTroubleFacility");
        }
    }

    function getStatisticsData(startDate,endDate,unitInfo,isExport) {
        var url = "../../Handler/StatisticsHandler.ashx?Action=QueryUnitPersonData&startDate=" + startDate + "&endDate=" + endDate;
        $.ajax({
            url: url,
            dataType: "text",
            type: "get",
            cache: false,
            success: function (result) {
                var unitPersonDataJson = $.parseJSON(result);
                //维修信息
                statisticsData = unitPersonDataJson[0].statisticsData;
                //对信息进行统计处理
                //统计所有单位的维修信息,统计每个单位的维修总数
                selectPart();
                if (isExport) {
                    //导出的数据
                    var exportData = '';
                    exportData = dataFilter(statisticsData, null, unitInfo);
                    if (exportData.length > 0) {
                        var title = $("#partmentTitle").html();
                        exportDataFun(exportData, title, unitInfo);
                        //noty({ text: "数据已导出！", type: "alert", layout: "center", timeout: 1500 });
                    } else {
                        noty({ text: "此时间段暂无数据！", type: "alert", layout: "center", timeout: 1500 });
                    }
                }
            }
        });
    }
    //清除图表
    function clearCharts(chartId) {
        var myChart = echarts.init(document.getElementById(chartId));
        myChart.clear();
    }

    //排序筛选前六个数据
    function selectChartData(chartData, chartId,chartType) {
        var chartData = chartData;
        var tempData = '';
        for (var j = 0; j < chartData.length - 1; j++) {
            for (var i = j; i < chartData.length - 1; i++) {
                if (chartData[i + 1].yData > chartData[i].yData) {
                    tempData = chartData[i + 1];
                    chartData[i + 1] = chartData[i];
                    chartData[i] = tempData;
                }
            }
        }
        clearCharts(chartId);
        if (chartData.length > 6) {
            var list = [];
            for (var i = 0; i < 6; i++) {
                list.push(chartData[i]);
            }
            if (chartType == 'bar') {
                initBarEcharts(list, chartId);
            } else if (chartType == 'pie') {
                initPieEcharts(list, chartId);
            }
          
        } else {
            if (chartType == 'bar') {
                initBarEcharts(chartData, chartId);
            } else if (chartType == 'pie') {
                initPieEcharts(chartData, chartId);
            }
        }
       
    }

    /*数据查询*/
    $("#btnQueryData").click(function () {
        startDate = $("div.active").children().find(".startTime").val();
        endDate = $("div.active").children().find(".endTime").val();
        var sTime, eTime;
        sTime = startDate.replace(/-/g, '');
        eTime = endDate.replace(/-/g, '')
        if (startDate >= endDate) {
            alert("开始时间不能大于结束时间！");
            return;
        }
        //设置其他的时间
       $(".startTime").val(startDate);
       $(".endTime").val(endDate);
        var unitInfo = '', personInfo = '';
        var unitInfo = $("#partmentList").find('option:selected').val();
   
        getStatisticsData(startDate, endDate, unitInfo);
    });
    /*数据导出*/
    $("#btnQueryExport").click(function () {
        var exportStartDate = $("div.active").children().find(".startTime").val();
        var exportEndDate = $("div.active").children().find(".endTime").val();
        var unitId = $("#partmentList").find('option:selected').val();
        if (exportStartDate >= exportEndDate) {
            alert("开始时间不能大于结束时间！");
            return;
        }
        if (exportStartDate == startDate && exportEndDate == endDate) {
            //当时间一致时，不需要重新查询
            //导出的数据
            var exportData ='';
            exportData = dataFilter(statisticsData,null, unitId);
            if (exportData.length > 0) {
                var title = $("#partmentTitle").html();
                exportDataFun(exportData, title, unitId);
            } else {
                noty({ text: "此时间段暂无数据！", type: "alert", layout: "center", timeout: 1500 });
            }
            //var length = exportData.length;
               
        } else {
            //设置其他的时间
            $(".startTime").val(exportStartDate);
            $(".endTime").val(exportEndDate);
            var unitInfo = '', personInfo = '';
            var unitInfo = $("#partmentList").find('option:selected').val();
            getStatisticsData(exportStartDate, exportEndDate, unitInfo,true);
        }
    })




    /*关键字查询*/
    var lastKeyWord;
    $(document).keyup(function (event) {
        var keyWord = $("#statisicsKeyWord").val();
        var selectStatisticsData = statisticsData;
        var unitVal = $("#partmentList").find('option:selected').val();
        if (keyWord) {
            statisticsPersonUnit(statisticsData, unitVal, keyWord);
            lastKeyWord = keyWord;
        } 
        if (lastKeyWord && !keyWord) {
            statisticsPersonUnit(statisticsData, unitVal, keyWord);
            lastKeyWord = keyWord;
        }
    })


    /*依据条件对数据进行筛选*/
    function dataFilter(data,keyWord,unitId) {
        //筛选后的维保数据
        var statisticsData = [];
        //保存部门和人员的数据
        var unitPersonData = [];
        //筛选部门和人员,并对数据进行整理
        if (unitId && unitId != "partAll" && unitId != "personAll") {
            for (var i = 0; i < data.length; i++) {
                if (data[i].UNITID == unitId) {
                    unitPersonData.push(data[i]);
                }
            }
            statisticsData = keywordData(unitPersonData, keyWord, unitId);
        } else if (unitId == 'partAll'||unitId == 'personAll') {
            statisticsData = keywordData(data, keyWord, unitId);
        } 
        return statisticsData;
    }

    /*筛选关键字数据*/
    function keywordData(data, kWord, unitId) {
        var keywordData = [];
       
        if (kWord) {
            if (unitId == 'partAll') {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].UNITNAME.indexOf(kWord) > -1) {
                        keywordData.push(data[i]);
                    }
                }
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PERSONELNAME.indexOf(kWord) > -1) {
                        keywordData.push(data[i]);
                    }
                }
            }
        } else {
            keywordData = data;
        }

        var jsonData = [];
        if (keywordData.length > 0) {
            //依据unitId区分
            if (unitId == 'partAll') {
                jsonData.push({
                    id: keywordData[0].UNITID,
                    name: keywordData[0].UNITNAME,
                    number: 0
                });
                //整理数据
                var isExiced;
                for (var i = 0; i < keywordData.length; i++) {
                    //用于判断该单位和故障类型是否已存在
                    isExiced = false;
                    for (var j = 0; j < jsonData.length; j++) {
                        //如果该单位存在
                        if (jsonData[j].id == keywordData[i].UNITID) {
                            jsonData[j].number++;
                            isExiced = true;
                            break;
                        }
                    }
                    //该单位不存在
                    if (isExiced == false) {
                        jsonData.push({
                            id: keywordData[i].UNITID,
                            name: keywordData[i].UNITNAME,
                            number: 1
                        });
                    }
                }
            } else {
                jsonData.push({
                    id: keywordData[0].PERSONELID,
                    name: keywordData[0].PERSONELNAME,
                    unitName:keywordData[0].UNITNAME,
                    number: 0
                });
                //整理数据
                var isExiced;
                for (var i = 0; i < keywordData.length; i++) {
                    //用于判断该单位和故障类型是否已存在
                    isExiced = false;
                    for (var j = 0; j < jsonData.length; j++) {
                        //如果该单位存在
                        if (jsonData[j].id == keywordData[i].PERSONELID) {
                            jsonData[j].number++;
                            isExiced = true;
                            break;
                        }
                    }
                    //该单位不存在
                    if (isExiced == false) {
                        jsonData.push({
                            id: keywordData[i].PERSONELID,
                            name: keywordData[i].PERSONELNAME,
                            unitName: keywordData[i].UNITNAME,
                            number: 1
                        });
                    }
                }
            }
        }
        return jsonData;
    }

    /*数据导出方法*/
    function exportDataFun(data, title, unitId) {
        debugger
        var isPersonal = 'false';
        if (unitId != 'partAll') {
            isPersonal = 'true';
        }
        var temp = JSON.stringify(data);
        $("#stastisticsData").val(temp);
        title = escape(title);
        $("#excelForm").attr("action", "../../Handler/StatisticsHandler.ashx?Action=exportStatistics&excelTitle=" + title + '&isPersonal=' + isPersonal);
        $("#excelForm").submit();
        // noty({ text: "数据已导出！" + title, type: "alert", layout: "center", timeout: 1500 });
    }
});