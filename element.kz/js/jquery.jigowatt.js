jQuery(document).ready(function(){

	$('#contactform').submit(function(){

		var action = $(this).attr('action');

		$("#message").slideUp(750,function() {
		$('#message').hide();

 		$('#submit')
			
			.attr('disabled','disabled');

		$.post(action, {
			name: $('#name').val(),
			email: $('#email').val(),
			phone: $('#phone').val(),
			comments: $('#comments').val()
		},
			function(data){
				document.getElementById('message').innerHTML = data;
				$('#message').slideDown('slow');
				$('#contactform img.loader').fadeOut('slow',function(){$(this).remove()});
				$('#submit').removeAttr('disabled');
				if(data.match('success') != null) $('#contactform').slideUp('slow');

			}
		);

		});

		return false;

	});



	$('#contactform_popup').submit(function(){

		var action = $(this).attr('action');

		$("#message_popup").slideUp(750,function() {
		$('#message_popup').hide();

 		$('#submit_popup')
			
			.attr('disabled','disabled');

		$.post(action, {
			name_popup: $('#name_popup').val(),
			phone_popup: $('#phone_popup').val()
		},
			function(data){
				document.getElementById('message_popup').innerHTML = data;
				$('#message_popup').slideDown('slow');
				$('#contactform_popup img.loader').fadeOut('slow',function(){$(this).remove()});
				$('#submit_popup').removeAttr('disabled');
				if(data.match('success') != null) { 
					$('#contactform_popup').slideUp('slow');
					$('#contactform_popup_head').slideUp('slow');
				};

			}
		);

		});

		return false;

	});

});