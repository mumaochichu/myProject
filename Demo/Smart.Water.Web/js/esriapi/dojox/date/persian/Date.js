//>>built
define(["dojo/_base/lang","dojo/_base/declare","dojo/date"],function(h,g,k){var f=g("dojox.date.persian.Date",null,{_date:0,_month:0,_year:0,_hours:0,_minutes:0,_seconds:0,_milliseconds:0,_day:0,_GREGORIAN_EPOCH:1721425.5,_PERSIAN_EPOCH:1948320.5,daysInMonth:[31,31,31,31,31,31,30,30,30,30,30,29],constructor:function(){var a=arguments.length;a?1==a?(a=arguments[0],"number"==typeof a&&(a=new Date(a)),a instanceof Date?this.fromGregorian(a):""==a?this._date=new Date(""):(this._year=a._year,this._month=
a._month,this._date=a._date,this._hours=a._hours,this._minutes=a._minutes,this._seconds=a._seconds,this._milliseconds=a._milliseconds)):3<=a&&(this._year+=arguments[0],this._month+=arguments[1],this._date+=arguments[2],this._hours+=arguments[3]||0,this._minutes+=arguments[4]||0,this._seconds+=arguments[5]||0,this._milliseconds+=arguments[6]||0):this.fromGregorian(new Date)},getDate:function(){return this._date},getMonth:function(){return this._month},getFullYear:function(){return this._year},getDay:function(){return this.toGregorian().getDay()},
getHours:function(){return this._hours},getMinutes:function(){return this._minutes},getSeconds:function(){return this._seconds},getMilliseconds:function(){return this._milliseconds},setDate:function(a){a=parseInt(a);if(!(0<a&&a<=this.getDaysInPersianMonth(this._month,this._year))){var b;if(0<a)for(b=this.getDaysInPersianMonth(this._month,this._year);a>b;a-=b,b=this.getDaysInPersianMonth(this._month,this._year))this._month++,12<=this._month&&(this._year++,this._month-=12);else for(b=this.getDaysInPersianMonth(0<=
this._month-1?this._month-1:11,0<=this._month-1?this._year:this._year-1);0>=a;b=this.getDaysInPersianMonth(0<=this._month-1?this._month-1:11,0<=this._month-1?this._year:this._year-1))this._month--,0>this._month&&(this._year--,this._month+=12),a+=b}this._date=a;return this},setFullYear:function(a){this._year=+a},setMonth:function(a){this._year+=Math.floor(a/12);this._month=0<a?Math.floor(a%12):Math.floor((a%12+12)%12)},setHours:function(){var a=arguments.length,b=0;1<=a&&(b=parseInt(arguments[0]));
2<=a&&(this._minutes=parseInt(arguments[1]));3<=a&&(this._seconds=parseInt(arguments[2]));4==a&&(this._milliseconds=parseInt(arguments[3]));for(;24<=b;)this._date++,a=this.getDaysInPersianMonth(this._month,this._year),this._date>a&&(this._month++,12<=this._month&&(this._year++,this._month-=12),this._date-=a),b-=24;this._hours=b},_addMinutes:function(a){a+=this._minutes;this.setMinutes(a);this.setHours(this._hours+parseInt(a/60));return this},_addSeconds:function(a){a+=this._seconds;this.setSeconds(a);
this._addMinutes(parseInt(a/60));return this},_addMilliseconds:function(a){a+=this._milliseconds;this.setMilliseconds(a);this._addSeconds(parseInt(a/1E3));return this},setMinutes:function(a){this._minutes=a%60;return this},setSeconds:function(a){this._seconds=a%60;return this},setMilliseconds:function(a){this._milliseconds=a%1E3;return this},toString:function(){if(isNaN(this._date))return"Invalidate Date";var a=new Date;a.setHours(this._hours);a.setMinutes(this._minutes);a.setSeconds(this._seconds);
a.setMilliseconds(this._milliseconds);return this._month+" "+this._date+" "+this._year+" "+a.toTimeString()},toGregorian:function(){var a,b;b=this.persian_to_jd(this._year,this._month+1,this._date);a=this.jd_to_gregorian(b,this._month+1);weekday=this.jwday(b);return new Date(a[0],a[1]-1,a[2],this._hours,this._minutes,this._seconds,this._milliseconds)},fromGregorian:function(a){a=new Date(a);var b=a.getFullYear(),c=a.getMonth(),d=a.getDate(),b=this.calcGregorian(b,c,d);this._date=b[2];this._month=
b[1];this._year=b[0];this._hours=a.getHours();this._minutes=a.getMinutes();this._seconds=a.getSeconds();this._milliseconds=a.getMilliseconds();this._day=a.getDay();return this},calcGregorian:function(a,b,c){a=this.gregorian_to_jd(a,b+1,c)+Math.floor(.5)/86400;perscal=this.jd_to_persian(a);a=this.jwday(a);return[perscal[0],perscal[1],perscal[2],a]},jd_to_persian:function(a){var b,c,d;a=Math.floor(a)+.5;c=a-this.persian_to_jd(475,1,1);b=Math.floor(c/1029983);d=this._mod(c,1029983);1029982==d?c=2820:
(c=Math.floor(d/366),d=this._mod(d,366),c=Math.floor((2134*c+2816*d+2815)/1028522)+c+1);b=c+2820*b+474;0>=b&&b--;c=a-this.persian_to_jd(b,1,1)+1;c=186>=c?Math.ceil(c/31):Math.ceil((c-6)/30);a=a-this.persian_to_jd(b,c,1)+1;return[b,c-1,a]},persian_to_jd:function(a,b,c){var d;a-=0<=a?474:473;d=474+this._mod(a,2820);return c+(7>=b?31*(b-1):30*(b-1)+6)+Math.floor((682*d-110)/2816)+365*(d-1)+1029983*Math.floor(a/2820)+(this._PERSIAN_EPOCH-1)},gregorian_to_jd:function(a,b,c){return this._GREGORIAN_EPOCH-
1+365*(a-1)+Math.floor((a-1)/4)+-Math.floor((a-1)/100)+Math.floor((a-1)/400)+Math.floor((367*b-362)/12+(2>=b?0:this.leap_gregorian(a)?-1:-2)+c)},jd_to_gregorian:function(a,b){var c,d,e;a=Math.floor(a-.5)+.5;c=a-this._GREGORIAN_EPOCH;b=Math.floor(c/146097);d=this._mod(c,146097);c=Math.floor(d/36524);e=this._mod(d,36524);d=Math.floor(e/1461);e=this._mod(e,1461);e=Math.floor(e/365);b=400*b+100*c+4*d+e;4!=c&&4!=e&&b++;c=a-this.gregorian_to_jd(b,1,1);d=a<this.gregorian_to_jd(b,3,1)?0:this.leap_gregorian(b)?
1:2;month=Math.floor((12*(c+d)+373)/367);day=a-this.gregorian_to_jd(b,month,1)+1;return[b,month,day]},valueOf:function(){return this.toGregorian().valueOf()},jwday:function(a){return this._mod(Math.floor(a+1.5),7)},_yearStart:function(a){return 354*(a-1)+Math.floor((3+11*a)/30)},_monthStart:function(a,b){return Math.ceil(29.5*b)+354*(a-1)+Math.floor((3+11*a)/30)},leap_gregorian:function(a){return 0==a%4&&!(0==a%100&&0!=a%400)},isLeapYear:function(a,b,c){return!(0>a||32767<a||1>b||12<b||1>c||c>this.daysInMonth[b-
1]+(12==b&&!((a-979)%33%4)))},getDaysInPersianMonth:function(a,b){var c=this.daysInMonth[a];11==a&&this.isLeapYear(b,a+1,30)&&c++;return c},_mod:function(a,b){return a-b*Math.floor(a/b)}});f.getDaysInPersianMonth=function(a){return(new f).getDaysInPersianMonth(a.getMonth(),a.getFullYear())};return f});