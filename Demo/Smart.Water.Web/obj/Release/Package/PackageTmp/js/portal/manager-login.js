RequireJS.config({
    baseUrl: "js",
    paths: {
        "Framework": "Framework",     
        "RequireDomReady": "RequireJS/domReady",
        "RequireText": "RequireJS/text"
    },
    waitSeconds: 20
});

RequireJS(["Noty/noty", "jQuery/Plugins/jquery.cookie"],
    function () {
        RequireJS(["Noty/layouts/bottomRight", "Noty/layouts/topCenter", "Noty/themes/default"], function () { }); // 先载入noty 避免崩溃现象
      
       
        Application_Start();
    }
  );

/* 程序启动 */
function Application_Start() {
    var name = $.cookie("loginUserName");
    var pwd = $.cookie("loginUserPassword");
    if (name && pwd) {
        $('#chkRemember').attr('checked', 'checked');
        $("#txtUserName").val(name);
        $("#txtPassword").val(pwd);
    }else {
        $("#txtUserName").val("");
        $("#txtPassword").val("");
        $("#chkRemember").attr("checked", false);
    }
    $(document).keypress(function (e) {
        if (e.which == 13)
            LoginSend();
    });
}
var name, passW;

/* 登录 */
var LoginSend = function (n, p) {
    //var isSilverlightInstalled = false;
    //try {
    //    try {
    //        var slControl = new ActiveXObject('AgControl.AgControl'); //检查IE   
    //        isSilverlightInstalled = true;
    //    }
    //    catch (e) {
    //        if (navigator.plugins["Silverlight Plug-In"]) //检查非IE   
    //        {
    //            isSilverlightInstalled = true;
    //        }
    //    }
    //}
    //catch (e) { }
    debugger;
    name = $.trim($("#txtUserName").val() || n);
    passW = $.trim($("#txtPassword").val() || p);
    if (!name) {
        alert('请输入用户名');
        return false;
    } else if (!passW) {
        alert('请输入密码');
        return false;
    }
    if ($("#chkRemember").is(':checked')) {
        $.cookie("loginUserName", name, { expires: 7 });
        $.cookie("loginUserPassword", passW, { expires: 7 });
    }
    else {
        $.removeCookie('loginUserName');
        $.removeCookie('loginUserPassword');
    }
    $.getScript(SystemService + "/Handler/Login.ashx?un=" + name + "&pw=" + passW + "&f=json&cb=LoginCallback");
};

/* 取消登录 */
var LoginCancle = function () {
    $("#password").val("");
    $("#username").val("");
};

//登录回调函数
function LoginCallback(reply) {
    if (reply == "yes") {
        $.getScript(SystemService + "/Handler/LoginWithBack.ashx?f=json&cb=GetUserInfoCallback");
    }
    else {
        alert("对不起,无法进行系统登陆,请检查用户名或密码输入是否正确,如果确认无误,请联系管理员启用账户!");
    }
}

//UserInfo回调函数
function GetUserInfoCallback(reply) {
    var obj = reply;
    var lastTime = obj.UserModelBack.UserModel.LastLogTime;
    var Times = "";
    if (lastTime == null) {
        Times = "";
    }
    else {
        Times = lastTime.toString().substring(0, 4) + "-";
        Times += lastTime.toString().substring(4, 6) + "-";
        Times += lastTime.toString().substring(6, 8) + " ";
        Times += lastTime.toString().substring(8, 10) + ":";
        Times += lastTime.toString().substring(10, 12) + ":";
        Times += lastTime.toString().substring(12, 14);
    }
    $.cookie("userName", obj.UserModelBack.UserModel.UserName);
    $.cookie("pwd", passW);
    $.cookie("goodName", obj.UserModelBack.UserModel.AliasName);
    var adress = obj.UserModelBack.UserModel.Address;
    if (adress == null) {
        adress = "";
    }
    $.cookie("address", adress);
    var phone = obj.UserModelBack.UserModel.Phone;
    if (phone == null) {
        phone = "";
    }
    $.cookie("phone", phone);
    var mail = obj.UserModelBack.UserModel.Email;
    if (mail == null) {
        mail = "";
    }
    $.cookie("mail", mail);
    $.cookie("lastTime", Times);
    $.ajax({
        type: 'POST',
        url: 'Handler/LoginAuthorize.ashx?Action=Login',
        data: {
            UserId: obj.UserModelBack.UserModel.UserID,
            UserName: obj.UserModelBack.UserModel.UserName,
            AliasName: obj.UserModelBack.UserModel.AliasName,
            Adress: obj.UserModelBack.UserModel.Address,
            Phone: obj.UserModelBack.UserModel.Phone,
            Email: obj.UserModelBack.UserModel.Email,
            Times: Times
        },
        success: function () {
            if (window.IndexUrl == "gov/index.htm") {
                location.href = "gov/switch/switch.htm";
            } else {
                username = encodeURI(encodeURI(obj.UserModelBack.UserModel.AliasName));
                location.href = window.IndexUrl + "?name=" + username;
            }
        }
    });
}


