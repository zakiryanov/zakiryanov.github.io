jQuery(function($) {'use strict';

	// Navigation Scroll
	$(window).scroll(function(event) {
		Scroll();
	});

	$('#rules .show-content').click(function(){
		$('#rules .content').slideDown('slow');
		$('#rules .btns').hide()
	})

	$('.download-info').click(function(){
		console.log('down')
	})

	$('.scroll,.scroll>a').on('click', function() {  
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 80}, 1000);
		return false;
	});

	$('.slide').slide({

    isAutoSlide: true,
     isShowArrow: true,
slideSpeed: 5000,
    switchSpeed: 200,

    isHoverStop: true,
	});


	// User define function
	function Scroll() {
		var contentTop      =   [];
		var contentBottom   =   [];
		var winTop      =   $(window).scrollTop();
		var rangeTop    =   200;
		var rangeBottom =   500;
		$('.navbar-collapse').find('.scroll a').each(function(){
			contentTop.push( $( $(this).attr('href') ).offset().top);
			contentBottom.push( $( $(this).attr('href') ).offset().top + $( $(this).attr('href') ).height() );
		})
		$.each( contentTop, function(i){
			if ( winTop > contentTop[i] - rangeTop ){
				$('.navbar-collapse li.scroll')
				.removeClass('active')
				.eq(i).addClass('active');			
			}
		})
	};

	$('#tohash').on('click', function(){
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 5}, 1000);
		return false;
	});

	// accordian
	$('.accordion-toggle').on('click', function(){
		$(this).closest('.panel-group').children().each(function(){
		$(this).find('>.panel-heading').removeClass('active');
		 });

	 	$(this).closest('.panel-heading').toggleClass('active');
	});

	//Initiat WOW JS
	new WOW().init();
	//smoothScroll
	smoothScroll.init();

	// portfolio filter
	$(window).load(function(){'use strict';
		var $portfolio_selectors = $('.portfolio-filter >li>a');
		var $portfolio = $('.portfolio-items');
		$portfolio.isotope({
			itemSelector : '.portfolio-item',
			layoutMode : 'fitRows'
		});
		
		$portfolio_selectors.on('click', function(){
			$portfolio_selectors.removeClass('active');
			$(this).addClass('active');
			var selector = $(this).attr('data-filter');
			$portfolio.isotope({ filter: selector });
			return false;
		});
	});

	$(document).ready(function() {

		$('#year').text((new Date()).getFullYear());

		$('.plan-purchase>a').click(function(argument) {
			var groupNumber = $(this).parent().prev('li').find('.price').text();
			$('#group-select').val(+groupNumber);
		})

		//Animated Progress
		$('.progress-bar').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				$(this).css('width', $(this).data('width') + '%');
				$(this).unbind('inview');
			}
		});

		//Animated Number
		$.fn.animateNumbers = function(stop, commas, duration, ease) {
			return this.each(function() {
				var $this = $(this);
				var start = parseInt($this.text().replace(/,/g, ""));
				commas = (commas === undefined) ? true : commas;
				$({value: start}).animate({value: stop}, {
					duration: duration == undefined ? 1000 : duration,
					easing: ease == undefined ? "swing" : ease,
					step: function() {
						$this.text(Math.floor(this.value));
						if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
					},
					complete: function() {
						if (parseInt($this.text()) !== stop) {
							$this.text(stop);
							if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
						}
					}
				});
			});
		};

		$('.animated-number').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
			var $this = $(this);
			if (visible) {
				$this.animateNumbers($this.data('digit'), false, $this.data('duration')); 
				$this.unbind('inview');
			}
		});
	});

	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event){
		event.preventDefault();
		var $emailSending = $('#emailSending');
		var data = {}
	$(this).find('input,select').each(function() {
				data[$(this).attr('name')] = $(this).val()
		})
	console.log(data)
		var form_status = $('<div class="form_status"></div>');
			$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			beforeSend: function(){
				$emailSending.html('<p><i class="fa fa-spinner fa-spin"></i> Заявка отправляется...</p>');
			},
			data: data,
			success: function(data) {
				$emailSending.html('<p><i class="fa fa-checked"></i> Заявка успешно отправлена!</p>');
				return;
			},
			error: function(xhr, status, error){
				return;
			}
		});
	});

	//Pretty Photo
	$("a[rel^='prettyPhoto']").prettyPhoto({
		social_tools: false
	});

	//Google Map
	// var latitude = $('#google-map').data('latitude');
	// var longitude = $('#google-map').data('longitude');
	// function initialize_map() {
	// 	var myLatlng = new google.maps.LatLng(latitude,longitude);
	// 	var mapOptions = {
	// 		zoom: 14,
	// 		scrollwheel: false,
	// 		center: myLatlng
	// 	};
	// 	var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
	// 	var marker = new google.maps.Marker({
	// 		position: myLatlng,
	// 		map: map
	// 	});
	// }
	// google.maps.event.addDomListener(window, 'load', initialize_map);

});