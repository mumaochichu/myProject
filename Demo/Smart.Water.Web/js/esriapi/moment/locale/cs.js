//>>built
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module&&"function"===typeof require?e(require("../moment")):"function"===typeof define&&define.amd?define(["../moment"],e):e(f.moment)})(this,function(f){function e(a){return 1<a&&5>a&&1!==~~(a/10)}function a(a,b,f,c){var d=a+" ";switch(f){case "s":return b||c?"p\u00e1r sekund":"p\u00e1r sekundami";case "ss":return b||c?d+(e(a)?"sekundy":"sekund"):d+"sekundami";case "m":return b?"minuta":c?"minutu":"minutou";case "mm":return b||c?d+(e(a)?
"minuty":"minut"):d+"minutami";case "h":return b?"hodina":c?"hodinu":"hodinou";case "hh":return b||c?d+(e(a)?"hodiny":"hodin"):d+"hodinami";case "d":return b||c?"den":"dnem";case "dd":return b||c?d+(e(a)?"dny":"dn\u00ed"):d+"dny";case "M":return b||c?"m\u011bs\u00edc":"m\u011bs\u00edcem";case "MM":return b||c?d+(e(a)?"m\u011bs\u00edce":"m\u011bs\u00edc\u016f"):d+"m\u011bs\u00edci";case "y":return b||c?"rok":"rokem";case "yy":return b||c?d+(e(a)?"roky":"let"):d+"lety"}}var g=[/^led/i,/^\u00fano/i,
/^b\u0159e/i,/^dub/i,/^kv\u011b/i,/^(\u010dvn|\u010derven$|\u010dervna)/i,/^(\u010dvc|\u010dervenec|\u010dervence)/i,/^srp/i,/^z\u00e1\u0159/i,/^\u0159\u00edj/i,/^lis/i,/^pro/i],h=/^(leden|\u00fanor|b\u0159ezen|duben|kv\u011bten|\u010dervenec|\u010dervence|\u010derven|\u010dervna|srpen|z\u00e1\u0159\u00ed|\u0159\u00edjen|listopad|prosinec|led|\u00fano|b\u0159e|dub|kv\u011b|\u010dvn|\u010dvc|srp|z\u00e1\u0159|\u0159\u00edj|lis|pro)/i;return f.defineLocale("cs",{months:"leden \u00fanor b\u0159ezen duben kv\u011bten \u010derven \u010dervenec srpen z\u00e1\u0159\u00ed \u0159\u00edjen listopad prosinec".split(" "),
monthsShort:"led \u00fano b\u0159e dub kv\u011b \u010dvn \u010dvc srp z\u00e1\u0159 \u0159\u00edj lis pro".split(" "),monthsRegex:h,monthsShortRegex:h,monthsStrictRegex:/^(leden|ledna|\u00fanora|\u00fanor|b\u0159ezen|b\u0159ezna|duben|dubna|kv\u011bten|kv\u011btna|\u010dervenec|\u010dervence|\u010derven|\u010dervna|srpen|srpna|z\u00e1\u0159\u00ed|\u0159\u00edjen|\u0159\u00edjna|listopadu|listopad|prosinec|prosince)/i,monthsShortStrictRegex:/^(led|\u00fano|b\u0159e|dub|kv\u011b|\u010dvn|\u010dvc|srp|z\u00e1\u0159|\u0159\u00edj|lis|pro)/i,
monthsParse:g,longMonthsParse:g,shortMonthsParse:g,weekdays:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "),weekdaysShort:"ne po \u00fat st \u010dt p\u00e1 so".split(" "),weekdaysMin:"ne po \u00fat st \u010dt p\u00e1 so".split(" "),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm",l:"D. M. YYYY"},calendar:{sameDay:"[dnes v] LT",nextDay:"[z\u00edtra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v ned\u011bli v] LT";
case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve st\u0159edu v] LT";case 4:return"[ve \u010dtvrtek v] LT";case 5:return"[v p\u00e1tek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[v\u010dera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou ned\u011bli v] LT";case 1:case 2:return"[minul\u00e9] dddd [v] LT";case 3:return"[minulou st\u0159edu v] LT";case 4:case 5:return"[minul\u00fd] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",
past:"p\u0159ed %s",s:a,ss:a,m:a,mm:a,h:a,hh:a,d:a,dd:a,M:a,MM:a,y:a,yy:a},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})});