!function ($) {
	//=================================== scroll  ===================================//

$body.scrollspy({
      target: '#navbar-main',
      offset: navHeight
    });

    $window.on('load', function () {
      $body.scrollspy('refresh');
    });

    $('#navbar-main [href=#]').click(function (e) {
      e.preventDefault();
    });

};

$(document).ready(function(){

    var currentWatch = "";

        $(".showModalImg").click(function (e) {
           if(e.target.id=='item-video'){
               $("#myModal").find(".img-responsive").hide();
               $("#myModal").find(".iframe").show().width('100%');
               $("#myModal").find("#clockName").text('');
           }else{
               $("#myModal").find(".iframe").hide();
               $("#myModal").find(".img-responsive").show().attr("src",$(this).attr('src'));
               $("#myModal").find("#clockName").text($(this).prev().text());
           }
        });

    $(".zakazButton").click(function (e) {
        currentWatch = $(this).parent().siblings('.clockName').text();
    });


    $("#zakazClose").click(function () {
        $("#zakaz-1").show();
        $("#zakaz-2").hide();
    });


    $("#zakazSubmit").click(function (e) {
        var that =  $("#zakazSubmit");
        e.preventDefault();
        $("#info").text("");
        var data = {};
        data.name = $("#zakazName").val();
        data.phone = $("#zakazNumber").val();
        data.currentWatch = currentWatch;
        if(data.name==""||data.phone=="") {
            $("#info").text("Заполните пустые поля");
            return;
        }
        that.text("Загрузка ...");
        that.prop("disabled",true);
        $.ajax({
            type: 'POST',
            url: 'http://178.62.214.236/endpoint',
            data: data,
            success: function(data) {
                $("#zakaz-1").hide();
                $("#zakaz-2").show();
                that.prop("disabled",false);
                that.text("получить часы");
                return;
            },
            error: function(xhr, status, error) {
                return;
            }
        });

        return false;
    });

//    TIMER
    var clock = $('.your-clock').FlipClock(3600 * 4,{
        countdown:true
    });
});
