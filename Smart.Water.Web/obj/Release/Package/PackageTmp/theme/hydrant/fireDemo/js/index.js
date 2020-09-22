
$(document).ready(function () {
    //规定body宽高
    var _width = $(window).width();
    var _height = $(window).height();

    $("body").css({
        "width": _width + "px",
        "height": _height + "px",
    })
    //搜索列表头部删选
    jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
    //菜单列表
    $(".fire-list-content li").click(function () {
        $(".fire-list-content li.active").removeClass("active")
        $(this).addClass("active");
    })
    $('.fire-toggle-btn').off('click')
    $('.fire-toggle-btn').on('click', function () {
        $('.jquery-accordion-menu').slideToggle()
        if (parseInt($('.jquery-accordion-menu').height()) > 32) {
            $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
        } else {
            $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
    });
    //导航
    $('.fire-nav-item').on('click', function (event) {
        $(this).addClass('nav-active').siblings().removeClass('nav-active');
        event.stopPropagation();
    });
    //点击其他导航active状态消失
    $(document).on('click', function () {
        $('.fire-nav-item').removeClass('nav-active');
    })

    //退出
    $('._logout').on('click', function () {
        $('.pop-tooltip').css('display', 'block').removeClass('zoomOut').addClass('animated zoomIn')
    });
    $('.toolbtn-quit').on('click', function () {
        $('.pop-tooltip').removeClass('zoomIn').addClass('animated zoomOut');
    });
    $('.toolbtn-sure').on('click', function () {
        $('.pop-tooltip').removeClass('zoomIn').addClass('animated zoomOut');
    });


    //工具栏
    $('.toolbar-btn').on('click', function () {
        $('.fire-toolbar').toggleClass('_open');
        if ($(this).find('i').attr('class') == 'fa fa-bars') {
            $(this).find('i').removeClass('fa-bars').addClass('fa-close')
        } else {
            $(this).find('i').removeClass('fa-close').addClass('fa-bars')
        }
        $('.toolbar-list>li').removeClass('toolbar-active');
    });
    $('.toolbar-list>li').on('click', function () {
        var index = $(this).index();
        $(this).addClass('toolbar-active').siblings().removeClass('toolbar-active');
    });
});


