/**
 * Robin UI Framework
 * 工具类.
 * @author Created by RobinChang on 2014-9-23.
 * @version 1.0
 * @license Copyright (c) 2007-2014 robin studio
 */


//初始化Utils命名空间
if (!this["Robin"]) { Robin = {}; }
if (!this["Robin.Utils"]) { Robin.Utils = {}; }

/**
 * @constructor 名称：GetScript
 * @description 作用：获取脚本数据。
 * @param {String} url 获取脚本的url地址。
 * @param {String} callback 回调函数名称。
 */
Robin.Utils.GetScript = function (url, callback) {

    // 是否包含问号
    var flag = url.indexOf('?') == -1;
    var str = url + (flag ? '?' : '') + (flag ? '' : '&') + 'callback=' + callback;

    Robin.Utils.Loading.on('数据加载中，请稍候...');

    $.getScript(str, function (response, status) {

        Robin.Utils.Loading.off();
    });
};


/**
 * @constructor 名称：ToDate
 * @description 作用：把格林尼治时间转化为普通时间格式。
 * @param {String} strDate 表示时间的字符串。
 */
Robin.Utils.ToDate = function (strDate) {

    if (!strDate) {
        return '';
    }
    function cover(s) {
        return s < 10 ? '0' + s : s;
    }

    var dtStart = new Date(parseInt(strDate.substr(6)));
    var date = dtStart.getFullYear() + '-' +
        cover(dtStart.getMonth() + 1) + '-' +
        cover(dtStart.getDate()) + ' ' +
        cover(dtStart.getHours()) + ':' +
        cover(dtStart.getMinutes()) + ":" +
        cover(dtStart.getSeconds());
    return date;
};


/**
 * @constructor 名称：ConvertDate
 * @description 作用：把数组中的格林尼治时间转化为普通时间格式。
 * @param {String} array 需要处理的数组。
 * @param {String} field 要处理的字段名。
 */
Robin.Utils.ConvertDate = function (array, field) {

    if (array && ($.isArray(array)) && field && (typeof field === 'string')) {

        var i, time;
        for (i = 0; i < array.length; i++) {

            time = array[i];
            if (time && time[field]) {

                array[i][field] = Robin.Utils.ToDate(time[field]);
            }
        }
    }

    return array;
};

/**
 * @constructor 名称：KeyboardListener
 * @description 作用：键盘监听,屏蔽一些按键。
 */
Robin.Utils.KeyboardListener = function () {
    //监听键盘
    $(document).keydown(function (event) {
        if ((event.altKey) &&
          ((event.keyCode == 37) ||   //屏蔽 Alt+ 方向键 ← 
           (event.keyCode == 39)))   //屏蔽 Alt+ 方向键 → 
        {
            event.returnValue = false;
            return false;
        }
        if (event.keyCode == 8) {
            return false; //屏蔽退格删除键  
        }
        if (event.keyCode == 116) {
            return false; //屏蔽F5刷新键 
        }
        if ((event.ctrlKey) && (event.keyCode == 82)) {
            return false; //屏蔽alt+R 
        }
    });
};

/**
 * 浏览器相关操作
 * @type {{IS_IE: boolean, IS_IE6: boolean, IS_QUIRKS: boolean, IS_NS: boolean, IS_OP: boolean, IS_SF: boolean, IS_GC: boolean, IS_SVG: boolean, IS_VML: boolean, IS_MAC: boolean, IS_TOUCH: boolean, isBrowserSupported: isBrowserSupported}}
 */
Robin.Utils.Browser = {
    /**
 * 验证是否是IE浏览器
*
*  如果是Internet Explorer浏览器，返回true.
*/
    IS_IE11: navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf('rv:11') > -1,
    /**
 * 验证是否是IE浏览器
*
*  如果是Internet Explorer浏览器，返回true.
*/
    IS_IE8: navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('Trident') > -1,
    /**
     * 验证是否是IE浏览器
    *
    *  如果是Internet Explorer浏览器，返回true.
    */
    IS_IE: navigator.userAgent.indexOf('MSIE') >= 0,

    /**
	 * 验证是否是IE6浏览器
	 *
	 * 如果是Internet Explorer 6.x浏览器，返回true.
	 */
    IS_IE6: navigator.userAgent.indexOf('MSIE 6') >= 0,

    /**
	 * 验证是否是IE浏览器的怪异模式
	 *
	 * 如果浏览器是Internet Explorer并且是怪异模式，返回true.
	 */
    IS_QUIRKS: navigator.userAgent.indexOf('MSIE') >= 0 && (document.documentMode == null || document.documentMode == 5),

    /**
	 * 验证浏览器是否是Netscape
	 *
	 * 如果浏览器是Netscape(包括Firefox)，返回true.
	 */
    IS_NS: navigator.userAgent.indexOf('Mozilla/') >= 0 &&
  		navigator.userAgent.indexOf('MSIE') < 0,

    /**
	 * 验证是否是Opera浏览器
	 *
	 * 如果浏览器Opera，返回true.
	 */
    IS_OP: navigator.userAgent.indexOf('Opera/') >= 0,

    /**
	 * 验证是否是Safari浏览器
	 *
	 * 如果浏览器Safari，返回true.
	 */
    IS_SF: navigator.userAgent.indexOf('AppleWebKit/') >= 0 &&
  		navigator.userAgent.indexOf('Chrome/') < 0,

    /**
	 * 验证是否是Chrome浏览器
	 *
	 * 如果浏览器Chrome，返回true.
	 */
    IS_GC: navigator.userAgent.indexOf('Chrome/') >= 0,

    /**
	 * 验证是否支持SVG
	 *
	 * 如果浏览器支持IE10，返回true.
	 */
    IS_SVG: navigator.userAgent.indexOf('Firefox/') >= 0 || // FF and Camino
	  	navigator.userAgent.indexOf('Iceweasel/') >= 0 || // Firefox on Debian
	  	navigator.userAgent.indexOf('Seamonkey/') >= 0 || // Firefox-based
	  	navigator.userAgent.indexOf('Iceape/') >= 0 || // Seamonkey on Debian
	  	navigator.userAgent.indexOf('Galeon/') >= 0 || // Gnome Browser (old)
	  	navigator.userAgent.indexOf('Epiphany/') >= 0 || // Gnome Browser (new)
	  	navigator.userAgent.indexOf('AppleWebKit/') >= 0 || // Safari/Google Chrome
	  	navigator.userAgent.indexOf('Gecko/') >= 0 || // Netscape/Gecko
        navigator.userAgent.indexOf('MSIE 10.0') >= 0 || // IE10
	  	navigator.userAgent.indexOf('Opera/') >= 0,
    /**
	 * 验证是否支持VML
	 *
	 * 如果浏览器支持VML，返回true.
	 */
    IS_VML: navigator.appName.toUpperCase() == 'MICROSOFT INTERNET EXPLORER',

    /**
	 * 验证是否是MAC系统
	 *
	 * 如果客户端为Mac，返回true.
	 */
    IS_MAC: navigator.userAgent.toUpperCase().indexOf('MACINTOSH') > 0,

    /**
	 * 验证是否是平板
	 *
	 * 如果客户端是平板设备，返回true.
	 */
    IS_TOUCH: navigator.userAgent.toUpperCase().indexOf('IPAD') > 0 ||
  			  navigator.userAgent.toUpperCase().indexOf('IPOD') > 0 ||
  			  navigator.userAgent.toUpperCase().indexOf('IPHONE') > 0 ||
  			  navigator.userAgent.toUpperCase().indexOf('ANDROID') > 0,

    /**
	 * 验证客户端浏览器是否支持图形
	 *
	 * 如果当前浏览器支持vml或svg，返回true.
	 * 
	 * Example:
	 * 
	 * (code)
	 * if (!Robin.Browser.isBrowserSupported())
	 * {
	 *   alert('浏览器不支持!');
	 * }
	 * (end)
	 */
    isBrowserSupported: function () {
        return Robin.Browser.IS_VML || Robin.Browser.IS_SVG;
    }
};

/**
 * 网站路径
 * @type {{DirectPath: DirectPath}}
 //localhost/Smart.Water.Web/FireHydrant/undefined/Smart.Water.Web/FireHydrant/proxy/proxy.ashx?http://10.168.16.248/ArcGIS/rest/services/FuYang/FYGX/MapServer/26/query
 */
Robin.Utils.Host = {   
    /**
     * @constructor 名称：DirectPath
     * @description 作用：返回的路径为 url+虚拟目录的内容,如: /Robinweb http://localhost//Robinweb//
     */
    DirectPath: function () {
        var tmp = location.pathname;
        tmp = tmp.substring(0, tmp.indexOf("/", 1));
        if (tmp.substring(0, 1) != "/") tmp = "/" + tmp;
        return location.protocol + "//" + location.host + tmp + "/";
    }
};


/**
 * @constructor 名称：GetQuery
 * @description 作用：获取URL参数信息。
 * @param {String} name url的参数key。
 * @param {String} defaultValue 如果没有找到指定key的值的时候，默认返回值。
 */
Robin.Utils.GetQuery = function (name, defaultValue) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));
    return defaultValue;
};


/**
 * @constructor 名称：GetQueryObject
 * @description 作用：取得url中参数, 并以对象形式返回。
 * @param {String} query url。
 * @summary 示例: 
 *          假设url为'login.aspx?name=a&password=b',可使用以下代码取得参数name的值
 *          var params = Robin.Utils.GetQueryObject();
 *          alert(params.name);
 *          此处 params = {name:'a',password:'b'};
 */
Robin.Utils.GetQueryObject = function (query) {
    if ((query) === undefined || typeof (query) !== "string") {
        query = window.location.search;
    }
    if (query.length === 0) {
        return {};
    }
    var splittedQuery = query.substr(1).split('&'), queryArr = {}, i, entry;
    for (i = 0; i < splittedQuery.length; i += 1) {
        entry = splittedQuery[i].split('=');
        if (entry.length === 2) {
            queryArr[entry[0]] = decodeURIComponent(entry[1].replace(/\+/g, " "));
        } /* else { ignore } */
    }
    return queryArr;
};

/**
 * 对话框与提示
 * * 示例: 
 *          Robin.Utils.Tip.Info("标题","hello world");
 */
Robin.Utils.Tip = {


    /**
     * @constructor 名称：Loading
     * @description 作用：加载遮罩，依赖blockui跟spin,自行加载。
     * @param {String} elemid。
     */
    Loading: function (elemid) {
        NProgress.start();

    },


    /**
     * @constructor 名称：unLoading
     * @description 作用：取消加载遮罩。
     * @param {String} elemid。
     */
    unLoading: function (elemid) {
        NProgress.done();

    },

    ///**
    // * Confirm提示.需要提前加载noty.
    // * @param message 提示的内容
    // * @param type 类型information,alert,error,success,warning
    // * @param okCallback yes执行的方法
    // * @param cancelCallback no执行的方法
    // * @param lblok yes显示的内容
    // * @param lblcancel no显示的内容
    // * @constructor
    // */
    //Confirm: function (message, type, okCallback, cancelCallback, lblok, lblcancel) {

    //    if (message == null) message = "您确定要删除所选对象吗?";
    //    else message = message.toString();
    //    if (type == null) type = "alert";
    //    else type = type.toString();
    //    if (lblok == null) lblok = "确定";
    //    else lblok = lblok.toString();
    //    if (lblcancel == null) lblcancel = "取消?";
    //    else lblcancel = lblcancel.toString();
    //    if ((okCallback) === undefined) {
    //        okCallback = function () {
    //        };
    //    }
    //    if ((cancelCallback) === undefined) {
    //        cancelCallback = function () {
    //        };
    //    }
    //    if (noty) {
    //        var n = noty({
    //            text: message,
    //            type: type,
    //            dismissQueue: true,
    //            modal: true,//遮罩处理，防止点击多次
    //            layout: "Center",
    //            buttons: [
    //                {
    //                    addClass: 'btn btn-primary', text: lblok, onClick: function ($noty) {
    //                        $noty.close();
    //                        okCallback
    //                    }
    //                },
    //                {
    //                    addClass: 'btn btn-danger', text: lblcancel, onClick: function ($noty) {
    //                        $noty.close();
    //                        cancelCallback
    //                    }
    //                }
    //            ]
    //        });
    //    }
    //    else alert("请检查插件是否加载成功！");
    //},


    /**
     * @constructor 名称：unLoading
     * @description 作用：confirm提示.需要提前加载noty.这个方法放在utils里会报错，需要引用js/Bootstrap/Version3/css/bootstrap-button.css，js/Noty/packaged/jquery.noty.packaged.min.js
    * @param {String} message 提示的内容
    * @param {String} type 类型information,alert,error,success,warning
    * @param {Function} okCallback yes执行的方法
    * @param {Function} cancelCallback no执行的方法
    * @param {String} lblok yes显示的内容
    * @param {String} lblcancel no显示的内容
    */
    Confirm: function (message, type, okCallback, cancelCallback, lblok, lblcancel) {

        if (!noty) {

            alert("请检查插件是否加载成功！");
            return;
        }

        var _default =
        {
            text: message || "您确定要删除所选对象吗?",
            type: type || "alert",
            dismissQueue: true,
            modal: true,
            layout: "center",
            buttons: [
                {
                    addClass: 'btn btn-primary',
                    text: lblok || "确定",
                    onClick: function ($noty) {
                        $noty.close();
                        if (okCallback && $.isFunction(okCallback)) {

                            okCallback();
                        }
                    }
                },
                {
                    addClass: 'btn btn-warning',
                    text: lblcancel || "取消",
                    onClick: function ($noty) {
                        $noty.close();
                        if (cancelCallback && $.isFunction(cancelCallback)) {

                            cancelCallback();
                        }
                    }
                }
            ]
        };

        noty(_default);
    }
};


Robin.Utils.Loading = {

    /**
     * @constructor 名称：on
     * @description 作用：加载遮罩
     * @param {String} message 加载提示。
     */
    on: function (message) {

        NProgress.start();
    },

    /**
     * @constructor 名称：off
     * @description 作用：取消遮罩
     */
    off: function () {

        NProgress.done();
    }
};
/**
* 对于cookie的操作，请直接加载jquery.cookie进行操作
* 示例请参见官方例子
* https://github.com/carhartl/jquery-cookie:
*/

/**
* 名称: AddFavorite
* 作用: 添加收藏  
*/
Robin.Utils.AddFavorite = function (name) {
    var sHref = window.location.href;
    window.external.AddFavorite(sHref, name);
};

/**
* 名称: SetPage
* 作用: 设为主页  
*/
Robin.Utils.SetPage = function (obj) {
    var sHref = window.location.href;
    obj.style.behavior = 'url(#default#homepage)';
    obj.setHomePage(sHref);
};



/**
 * @constructor 名称：MergeArray
 * @description 作用：将两个数组(只适合简单数组，不适合对象对比)整合为一个数组（求并集）
 * @param {Array} arr1 第一个数组
 * @param {Array} arr2 第二个数组
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.MergeArray = function (arr1, arr2) {
    var arr = [];
    for (var i = 0; i < arr1.length; i++) {
        arr.push(arr1[i]);
    }
    var dup;
    for (var i = 0; i < arr2.length; i++) {
        dup = false;
        for (var i = 0; i < arr1.length; i++) {
            if (arr2[i] == arr1[i]) {
                dup = true;
                break;
            }
        }
        if (!dup) {
            arr.push(arr2[i]);
        }
    }
    return arr;
};


/**
 * @constructor 名称：GetDateDiff
 * @description 作用：返回当前时间距传入时间的间隔（返回时间间隔：秒）
 * @param {String} datetime 时间字符串 2015/03/03T12:34:34
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.GetDateDiff = function (datetime) {
    if (datetime == null) return 10000000;
    // 可以将2012 - 12 - 12 12 : 12 : 12字符串转为JS中的时期对象, 
    // 因为默认情况下只把持2000 / 05 / 05这样形式的字符串转为时间对象 
    var strTime = datetime.replace('T', " ").replace(/-/g, "/");
    var dateBegin = new Date(strTime);
    var dateEnd = new Date();
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();
    // 计算相差的天数 
    return Math.floor(dateDiff / 1000);
}



/**
 * @constructor 名称：Date2String
 * @description 作用：将数据库中返回的时间类型转化为时间字符串(yyyy-MM-dd hh:mm:ss)
 * @param {String} datetime 时间字符串 2015/03/03T12:34:34
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.Date2String = function (datetime) {
    if (datetime == null) return "";
    var strTime = datetime.replace('T', " ").replace(/-/g, "/");
    var dtStart = new Date(strTime);
    function cover(s) {
        return s < 10 ? '0' + s : s;
    }
    var dateString = dtStart.getFullYear() + '-' +
        cover(dtStart.getMonth() + 1) + '-' +
        cover(dtStart.getDate()) + ' ' +
        cover(dtStart.getHours()) + ':' +
        cover(dtStart.getMinutes()) + ":" +
        cover(dtStart.getSeconds());
    return dateString;
}


/**
 * @constructor 名称：Date2TimeString
 * @description 作用：将数据库中返回的时间类型转化为时间字符串(hh:mm)
 * @param {String} datetime 时间字符串 2015/03/03T12:34:34
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.Date2TimeString = function (datetime) {
    if (datetime == null) return "";
    var strTime = datetime.replace('T', " ").replace(/-/g, "/");
    var dtStart = new Date(strTime);
    function cover(s) {
        return s < 10 ? '0' + s : s;
    }
    var dateString = cover(dtStart.getHours()) + ':' +
        cover(dtStart.getMinutes());
    return dateString;
}


/**
 * @constructor 名称：Date2DateString
 * @description 作用：将时间格式日期转化为字符串(yyyy-MM-dd)
 * @param {Date} date 时间
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.Date2DateString = function (date) {
    function cover(s) {
        return s < 10 ? '0' + s : s;
    }
    var dateString = date.getFullYear() + '-' +
        cover(date.getMonth() + 1) + '-' +
        cover(date.getDate());
    return dateString;
}


/**
 * @constructor 名称：GetBeginDateOfWeek
 * @description 作用：获取某年某周的开始日期
 * @param {Int} paraYear 年份
 * @param {Int} weekIndex 第几周
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.GetBeginDateOfWeek = function (paraYear, weekIndex) {
    var firstDay = Robin.Utils.GetFirstWeekBegDay(paraYear);
    //7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)
    var time = (weekIndex - 1) * 7 * 24 * 3600000;
    var beginDay = firstDay;
    //为日期对象 date 重新设置成时间 time
    beginDay.setTime(firstDay.valueOf() + time);
    return beginDay;
}



/**
 * @constructor 名称：GetEndDateOfWeek
 * @description 作用：获取某年某周的结束日期
 * @param {Int} paraYear 年份
 * @param {Int} weekIndex 第几周
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.GetEndDateOfWeek = function (paraYear, weekIndex) {
    var firstDay = Robin.Utils.GetFirstWeekBegDay(paraYear);
    //7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)
    var time = (weekIndex - 1) * 7 * 24 * 3600000;
    var weekTime = 6 * 24 * 3600000;
    var endDay = firstDay;
    //为日期对象 date 重新设置成时间 time
    endDay.setTime(firstDay.valueOf() + weekTime + time);
    return endDay;
}



/**
 * @constructor 名称：GetWeekIndex
 * @description 作用：获取日期为某年的第几周
 * @param {Date} dateobj 时间
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.GetWeekIndex = function (dateobj) {
    var firstDay = Robin.Utils.GetFirstWeekBegDay(dateobj.getFullYear());
    if (dateobj < firstDay) {
        firstDay = Robin.Utils.GetFirstWeekBegDay(dateobj.getFullYear() - 1);
    }
    d = Math.floor((dateobj.valueOf() - firstDay.valueOf()) / 86400000);
    return Math.floor(d / 7) + 1;
}

/**
 * @constructor 名称：GetFirstWeekBegDay
 * @description 作用：获取某年的第一天
 * @param {Int} year 年份
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.GetFirstWeekBegDay = function (year) {
    var tempdate = new Date(year, 0, 1);
    var temp = tempdate.getDay();
    if (temp == 1) {
        return tempdate;
    }
    temp = temp == 0 ? 7 : temp;
    tempdate = tempdate.setDate(tempdate.getDate() + (8 - temp));
    return new Date(tempdate);
}

/**
* 名称: 窗体高度宽度
* 作用: 获取页面元素高度宽度
* 示例: 
*          
*/
Robin.Utils.Size = {

    /**
    * 获取浏览器显示区域的高度 ，随窗口大小改变而改变  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.WindowHieght();
    * (end)
    */
    WidowHeight: function () {
        return $(window).height();
    },
    /**
    *获取浏览器显示区域的宽度 ，随窗口大小改变而改变  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.WidowWidth();
    * (end)
    */
    WidowWidth: function () {
        return $(window).width();
    },
    /**
    * 获得屏幕分辨率宽度  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScreenWidth();
    * (end)
    */
    ScreenWidth: function () {
        return window.screen.width;
    },
    /**
    * 获得屏幕分辨率高度  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScreenHeight();
    * (end)
    */
    ScreenHeight: function () {
        return window.screen.height;
    },
    /**
    * 屏幕可用工作区高度
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScreenAvailHeight();
    * (end)
    */
    ScreenAvailHeight: function () {
        return window.screen.availHeight;
    },
    /**
    * 屏幕可用工作区宽度  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScreenAvailWidth();
    * (end)
    */
    ScreenAvailWidth: function () {
        return window.screen.availWidth;
    },
    /**
    * 获得网页正文距离屏幕上部的高度  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScreenTop();
    * (end)
    */
    ScreenTop: function () {
        return window.screenTop;
    },
    /**
    * 获得网页正文距离屏幕左部的高度  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScreenLeft();
    * (end)
    */
    ScreenLeft: function () {
        return window.screenLeft;
    },
    /**
    * 获取页面的文档高度，随窗口大小改变而改变  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.DocumentHeight();
    * (end)
    */
    DocumentHeight: function () {
        return $(document).height();
    },
    /**
    * 获取页面的文档宽度 ，随窗口大小改变而改变  
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.DocumentWidth();
    * (end)
    */
    DocumentWidth: function () {
        return $(document).width();
    },
    /**
    * 获得浏览器窗口页面body高度
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.BodyHeight();
    * (end)
    */
    BodyHeight: function () {
        return $(document.body).height();
    },
    /**
    * 获得浏览器窗口页面body宽度
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.BodyWidth();
    * (end)
    */
    BodyWidth: function () {
        return $(document.body).width();
    },
    /**
    * 获得浏览器窗口页面body总高度（包括padding,margin,border）
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.BodyOuterHeight();
    * (end)
    */
    BodyOuterHeight: function () {
        return $(document.body).outerHeight(true);
    },
    /**
    * 获得浏览器窗口页面body总宽度（包括padding,margin,border）
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.BodyOuterWidth();
    * (end)
    */
    BodyOuterWidth: function () {
        return $(document.body).outerWidth(true);
    },

    /**
    * 获取滚动条到顶部的垂直高度 
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScrollTop();
    * (end)
    */
    ScrollTop: function () {
        return $(document).scrollTop();
    },
    /**
    * 获取滚动条到左边的垂直宽度 
    * 
    * Example:
    * 
    * (code)
    * Robin.Utils.Size.ScrollLeft();
    * (end)
    */
    ScrollLeft: function () {
        return $(document).scrollLeft();
    }
};


/**
 * @constructor 名称：retainedDecimalPlaces
 * @description 作用：截取小数位
 * @param {Double} num 浮点型数字
 * @param {Int} del 截取位数
 * @author Modify by <a href="http://www.52develop.com">JohnLiu</a> on 2015-10-20
 */
Robin.Utils.retainedDecimalPlaces = function (num, del) {
    try {
        if (!num) {
            return "0";
        }
        num = parseFloat(num).toFixed(del); //保留小数并四舍五入
        return num;
    }
    catch (e) {
        return num;
    }
};



/**
 * @constructor 名称：isPosInt
 * @description 作用：验证是否为正整数 。IsPositiveInteger
 * @param {String} num 字符串。
 * @return {Boolean}
 */
Robin.Utils.isPosInt = function (num) {

    var ex = /^[0-9]*[1-9][0-9]*$/;
    return ex.test(num);
};

/**
 * @constructor 名称：parsePosInt
 * @description 作用：转换为正整数。 
 * @param {String} num 字符串。
 * @return  如果是正整数返回一个正整数，否则返回false
 */
Robin.Utils.parsePosInt = function (num) {

    var isPosInt = Robin.Utils.isPosInt(num);

    if (isPosInt) {
        return parseFloat(num);
    } else {
        return false;
    }
}