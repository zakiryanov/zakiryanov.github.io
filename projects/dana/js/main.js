$('.slider').slick({
  autoplay:false,
  arrows: true,
  slidesToShow: 2,
  dots:true,
  autoplay:1500,
  responsive:[
  {
    breakpoint: 576,
    settings: {
      slidesToShow: 1 ,
    }
  }
  ]

});
$('.line .text').mouseover(function(argument) {
  $(this).addClass('show')
})
$('.line .text').mouseout(function(argument) {
  $(this).removeClass('show')
})
$('.square').click(function() {
  $('.s6 .bg-blue').css('left','200%')
})
$('.burger').click(function(){
  $('.sidebar').toggleClass('show')
  $('.burger').toggleClass('close')
  $('.bg-black').toggle()
})

$(window).scroll(function(event) {
  Scroll();
});

$('.nav-list li').click(function() {  
  console.log($(this).find('a').attr('href'))
  $('html, body').animate({scrollTop: $($(this).find('a').attr('href')).offset().top - 80}, 1000);
  return false;
});

  // User define function
  function Scroll() {
    var contentTop      =   [];
    var winTop      =   $(window).scrollTop();
    var rangeTop    =   100;
    var rangeBottom =   300;
    var htmlHeight  = ($('html').height()).toFixed();
    $('.nav-list').find('li a').each(function(){
      contentTop.push( $( $(this).attr('href') ).offset().top);
    })

    if(Math.abs(htmlHeight-(winTop+$(window).height()).toFixed())<50){
      $('.nav-list li')
      .removeClass('active')
      .eq(contentTop.length-1).addClass('active');   
      return;
    }

    if(0==winTop){
      $('.nav-list li')
      .removeClass('active')
      .eq(0).addClass('active');   
      return;
    }

    $.each( contentTop, function(i){
      if ( winTop + ($(window).height()/2) > contentTop[i] - rangeTop ){
        $('.nav-list li')
        .removeClass('active')
        .eq(i).addClass('active');      
      }
    })
  };


  $(".sendToMail").click(function (e) {
    e.preventDefault();
    var data = {};
    var name = $(this).closest('.clientInfo').find(".clientName").val();
    var phone = $(this).closest('.clientInfo').find(".clientPhone").val();

    if(name==""||phone=="") {
      $(".error").show();
      return;
    }
   
    $.ajax({
      type: 'get',
      url: './send.php?name='+name+'&phone='+phone,
      success: function(data) {
       $('.afterSended').removeClass('d-none')
     },
     error: function(xhr, status, error) {
     }
   });

    $(".congrats").show();
    return false;
  });