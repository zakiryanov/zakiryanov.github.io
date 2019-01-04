new WOW().init();

$("#sendToMail").click(function (e) {
	e.preventDefault();
	$(this).attr('disabled',true);

	var data = {};
	var name = $("#clientName").val();
	var phone = $("#clientPhone").val();
	var email = $("#clientMail").val();

	if(name==""||phone=="") {
		return;
	}

	$('.afterSended').removeClass('d-none');

	$.ajax({
		type: 'get',
		url: './phpmailer/mailer.php?name='+name+'&phone='+phone+'&email='+email,
		success: function(data) {
			console.log(data)
			$(".sendToMail").attr('disabled',false);
		},
		error: function(xhr, status, error) {
		}
	});

});

$('#top').click(function() {
	$("html, body").animate({ scrollTop: 0 }, "normal");
})

$('.menu_link').on('click', function(){
	$('html, body').animate({scrollTop: $(this.hash).offset().top}, 1000);
	return false;
});

$('#phone_btn').click(function(argument) {
	$('#menu_phone').slideToggle('normal')
})

$('#portfoliolist').mixItUp({selectors:{target:".portfolio",filter:".filter"},load:{filter:".app"}});