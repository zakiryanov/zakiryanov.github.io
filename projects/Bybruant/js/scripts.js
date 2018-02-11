
$(document).ready(function () {
	window.location.href.split('#')[0];
	var modal = $("#myModal");
	var currentResnicy = "";
	$("#zakaz-2").hide();

	$(".openModal").click(function () {
		modal.show();
	});

	$(".closeModal").click(function () {
		modal.hide();
		$("#zakaz-1").show();
		$("#zakaz-2").hide();
	});

	$(".wp4-zakazat").click(function () {
		currentResnicy = $(this).siblings('.resnicy-name').text();
		modal.show();
	});

	$(".zakazSubmit").click(function (e) {
		var that = $(this);
		e.preventDefault();
		var data = {};
		data.name = $(this).siblings('.zakazName').val();
		data.phone = $(this).siblings('.zakazNumber').val();
		data.currentResnicy = currentResnicy;
		if(data.name==""||data.phone=="") {
			that.siblings(".info").text("Заполните пустые поля");
			return;
		}
		that.val("Загрузка ...");
		$.ajax({
			type: 'POST',
			url: 'http://bybruant.kz/endpoint',
			data: data,
			success: function(data) {

				$("#zakaz-1").hide();
				$("#zakaz-2").show();
				that.val("получить скорее");
				if(that.attr('id')=='done') that.val("Заявка отправлена");
				that.siblings('.info').text("");
				var currentResnicy = "";
				return;
			},
			error: function(xhr, status, error) {
				return;
			}
		});
		return false;
	});
});

/***************** Waypoints ******************/


$(document).ready(function() {

	$('.wp1').waypoint(function() {
		$('.wp1').addClass('animated fadeInLeft');
	}, {
		offset: '75%'
	});
	$('.wp2').waypoint(function() {
		$('.wp2').addClass('animated fadeInUp');
	}, {
		offset: '75%'
	});
	$('.wp3').waypoint(function() {
		$('.wp3').addClass('animated fadeInDown');
	}, {
		offset: '55%'
	});
	$('.wp4').waypoint(function() {
		$('.wp4').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});
	$('.wp5').waypoint(function() {
		$('.wp5').addClass('animated fadeInUp');
	}, {
		offset: '75%'
	});
	$('.wp6').waypoint(function() {
		$('.wp6').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});

});

/***************** Slide-In Nav ******************/

$(window).load(function() {

	$('.nav_slide_button').click(function() {
		$('.pull').slideToggle();
	});

});

/***************** Smooth Scrolling ******************/

$(function() {

	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 2000);
				return false;
			}
		}
	});

});

/***************** Nav Transformicon ******************/

document.querySelector("#nav-toggle").addEventListener("click", function() {
	this.classList.toggle("active");
});

/***************** Overlays ******************/

$(document).ready(function(){
    if (Modernizr.touch) {
        // show the close overlay button
        $(".close-overlay").removeClass("hidden");
        // handle the adding of hover class when clicked
        $(".img").click(function(e){
            if (!$(this).hasClass("hover")) {
                $(this).addClass("hover");
            }
        });
        // handle the closing of the overlay
        $(".close-overlay").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            if ($(this).closest(".img").hasClass("hover")) {
                $(this).closest(".img").removeClass("hover");
            }
        });
    } else {
        // handle the mouseenter functionality
        $(".img").mouseenter(function(){
            $(this).addClass("hover");
        })
        // handle the mouseleave functionality
        .mouseleave(function(){
            $(this).removeClass("hover");
        });
    }
});

/***************** Flexsliders ******************/

$(window).load(function() {

	$('#portfolioSlider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: true,
		touch: false,
		pauseOnHover: true,
		start: function() {
			$.waypoints('refresh');
		}
	});

	$('#servicesSlider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: true,
		touch: true,
		pauseOnHover: true,
		start: function() {
			$.waypoints('refresh');
		}
	});

	$('#teamSlider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: true,
		touch: true,
		pauseOnHover: true,
		start: function() {
			$.waypoints('refresh');
		}
	});

});
