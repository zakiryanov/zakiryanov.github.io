(function($) {
  "use strict";
  $(window).on("load", function() { // makes sure the whole site is loaded
    //preloader
    $("#status").fadeOut(); // will first fade out the loading animation
    $("#preloader").delay(450).fadeOut("slow"); // will fade out the white DIV that covers the website.

  });

  var langDict = {
    'en':{
      'typedCursor': ["Hello, my name is Anuarbek", "And I can create powerful websites.", "Want proof? Jus sroll down"],
      'aboutTitle': 'A little bit about myself',
      'aboutDescr': 'I have been doing web development for more then 3 years now. All my free time I am developing in this direction, without stoping to learn something new. <br> And at one point, I realized that I was ready to create cool web applications that can be benefit to people. <br> It`s only the beginning. <br>',
      'aboutTable .title':['Name','Phone','Email','Address'],
      'aboutTable .data':['Anuarbek','+7 777 415 81 57','anuarbek.zak@gmail.com','Almaty'],
      'workTitle': 'My recent works',
      'workMiniTitle': 'Each work is done quickly and efficiently. <br>Absolutely <span>all<span> customers are satisfied with the result.',
      'workList .link-div p': ['Platform for creating powerfull web plugins (RoR, React, Mobx, SCSS, JQuery)',
      'Website of programming school ELEMENT  (HTML,CSS,WoW.js,JQuery,Gulp)',
      'Modern CRM-system with great functionality. (Angular 4, Django)',
      'Multi-page website dedicated to native Kazakhstan and short information about it. (HTML, CSS, AngularJs, Jquery)',
      'Advertising service with big functionality. (HTML, CSS, AngularJs)',
      'Page of the marketing agency. (HTML, CSS, jQuery, Bootstrap 4)',
      'Fully responsive website for the sale of foam blocks. (HTML, CSS, Jquery, Gulp)',
      'Selling landing page dedicated to the sale of false eyelashes. There is an admin panel for adding and modifying a product. (JQuery, PHP, MySQL)',
      'Online store for selling furniture with categories and functional admin panel. (AngularJS, NodeJs, MongoDB)',
      "Landing Page for Summer Camp SDU Children's Campus (HTML, CSS, Jquery, Gulp)",
      "Beautiful landing page created for selling children's watches on the Internet. (HTML, CSS, Jquery, Gulp)",
      "Simple demo internet shop. (React, Redux, Lodash)",
      ],
      'able .title-small span': 'What I can do',
      'able .head-sm': ['code','design','html and css','js','back-end'],
      'able .text-grey': [
      'Over 3 years of active learning web programming I have learned to write clean and optimized code and to google anything to solve different tasks (stack overflow is my best friend).'
      ,'Have an understanding of common design concepts, as well as experience in working with a team designer and the ability to work with Photoshop, Figma, Zeplin.',
      'With HTML and CSS I communicate on "you". I love and am able to make beautiful animations. The words "adaptive", "cross-browser" layout do not cause shaking at the knees. I can use in my work such assembly systems as Webpack and Gulp. Sign with SCSS, LESS preprocessors for CSS.',
      'I know JS "like the back of my hand". I have a lot of experience in using React, JQuery and AngularJS. He also worked with modern frameworks and libraries, such as Angular 2 +, Vue 2.',
      'I like front-end more, but I also know the back-end quite well. I worked with Ruby on Rails, PHP , and I do all projects on my favorite Node.js using the Express framework and the Mongo database.'],
      'skill .title-small span': 'Skills',
      'skill .content-detail':'I have been studying the web for more than 3 years and during this time I learned a lot.',
      'contact .title-small span':'Contacts',
      'contact .content-detail':'If you want to contact me, you can call the number <br> <span class="number">+7 777 415 81 57</span> or fill out the form. I will call you back shortly.',
      'labelName': 'Enter your name',
      'labelNumber': 'Enter your phone',
      'sendMessage': 'Request a call',
      'developedBy': 'Site developed by zakiryanov.github.io'

    },
    'ru':{
      'typedCursor':["Здравствуйте, меня зовут Ануарбек.", "И я умею создавать эффективные сайты.", "Хотите доказательств? Тогда листайте ниже."]
    }
  }
  var selectedLang = ''

  function translate() {
    selectedLang = 'en';
    var selectedLangObj = langDict[selectedLang];
    Object.keys(selectedLangObj).forEach(function(key, index) {
      if(index==0) return;
      var value = selectedLangObj[key];
      if(typeof value === 'string') $('#'+key).html(value);
      else{
        $('#'+key).each(function(i) {
          $(this).html(value[i])
        })
      }

    })
  }


  $(document).ready(function(){
    var urlArr = window.location.href.split('#')
    selectedLang = 'en';

    // if(urlArr.length>0 && urlArr[1]=='hh'){
    $('.hh-show').show();
    $('.hh-hide').hide();
    translate()
    // }else{
    //   $('.hh-show').hide();
    // }

        //typed js
    $("#typed_main").typed({
      strings: langDict[selectedLang]['typedCursor'],
      typeSpeed: 35,
      backDelay: 900,
        // loop
        loop: true
      });
    //typed js

    $("#typed").typed({
      strings: ["Мы создаем эффективные сайты.", "Продвигаем ваш бизнес в интернете.", "Привлекаем клиентов через интернет."],
      typeSpeed: 35,
      backDelay: 900,
        // loop
        loop: true
      });

     // $('.hh-show').show();
     //  $('.hh-hide').hide()
    //active menu
    $(document).on("scroll", onScroll);




    $('.work').click(function(){
      window.open($(this).find('.link-to-site a').attr('href'),'_blank')
    })

    $('a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      $(document).off("scroll");

      $('a').each(function () {
        $(this).removeClass('active');
      })
      $(this).addClass('active');

      var target = this.hash;
      $target = $(target);
      $('html, body').stop().animate({
        'scrollTop': $target.offset().top+2
      }, 500, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
      });
    });


    //scroll js
    smoothScroll.init({
      selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
      selectorHeader: '[data-scroll-header]', // Selector for fixed headers (must be a valid CSS selector)
      speed: 500, // Integer. How fast to complete the scroll in milliseconds
      easing: 'easeInOutCubic', // Easing pattern to use
      updateURL: true, // Boolean. Whether or not to update the URL with the anchor hash on scroll
      offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
      callback: function ( toggle, anchor ) {} // Function to run after scrolling
    });

    //menu
    var bodyEl = document.body,
    content = document.querySelector( '.content-wrap' ),
    openbtn = document.getElementById( 'open-button' ),
    closebtn = document.getElementById( 'close-button' ),
    isOpen = false;

    function inits() {
      initEvents();
    }

    function initEvents() {
      if( closebtn ) {
        closebtn.addEventListener( 'click', toggleMenu );
      }

      // close the menu element if the target it´s not the menu element or one of its descendants..
      content.addEventListener( 'click', function(ev) {
        var target = ev.target;
        if( isOpen && target !== openbtn ) {
          toggleMenu();
        }
      } );
    }

    function toggleMenu() {
      if( isOpen ) {
        classie.remove( bodyEl, 'show-menu' );
      }
      else {
        classie.add( bodyEl, 'show-menu' );
      }
      isOpen = !isOpen;
    }

    inits();




    //owl carousel
    $('.owl-carousel').owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds

      items : 1,
      itemsDesktop : [1199,1],
      itemsDesktopSmall : [979,1],
      itemsTablet : [768,1],
      itemsMobile : [479,1],

      // CSS Styles
      baseClass : "owl-carousel",
      theme : "owl-theme"
    });

    $('.owl-carousel2').owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds

      items : 1,
      itemsDesktop : [1199,1],
      itemsDesktopSmall : [979,1],
      itemsTablet : [768,1],
      itemsMobile : [479,1],
      autoPlay : false,

      // CSS Styles
      baseClass : "owl-carousel",
      theme : "owl-theme"
    });

    //contact
    $('input').blur(function() {
      // check if the input has any value (if we've typed into it)
      if ($(this).val())
        $(this).addClass('used');
      else
        $(this).removeClass('used');
    });


    //Skill
    jQuery('.skillbar').each(function() {
      jQuery(this).appear(function() {
        jQuery(this).find('.count-bar').animate({
          width:jQuery(this).attr('data-percent')
        },3000);
        var percent = jQuery(this).attr('data-percent');
        jQuery(this).find('.count').html('<span>' + percent + '</span>');
      });
    });


  });


  //header
  function inits() {
    window.addEventListener('scroll', function(e){
      var distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 300,
      header = document.querySelector(".for-sticky");
      if (distanceY > shrinkOn) {
        classie.add(header,"opacity-nav");
      } else {
        if (classie.has(header,"opacity-nav")) {
          classie.remove(header,"opacity-nav");
        }
      }
    });
  }

  // window.onload = inits();

  //nav-active
  function onScroll(event){
    var scrollPosition = $(document).scrollTop();
    $('.menu-list a').each(function () {
      var currentLink = $(this);
      var refElement = $(currentLink.attr("href"));
      if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
        $('.menu-list a').removeClass("active");
        currentLink.addClass("active");
      }
      else{
        currentLink.removeClass("active");
      }
    });
  }

// my own code
var currentProduct = '';

$("#sendMessage").click(function (e) {
  var error = $(".error");
  error.text("");
  e.preventDefault();
  var name = $("#name").val();
  var number = $("#number").val();
  if(name=="" || number=="") {
   error.text("Заполните пожалуйста все поля");
   return;
 }
 error.text("Отправка ...");
 var data = {name:name,number:number,currentProduct:currentProduct};

 emailjs.send("gmail","template_1pVkLrKH",data)
 .then(
  function(response) {
    error.text("Спасибо "+name.charAt(0).toUpperCase()+name.substr(1).toLocaleLowerCase()+", ожидайте звонка,я обязательно вам презвоню !").show();
    return false;
  }, 
  function(error) {
    console.log("FAILED", error);
  }
  );

});

$(".zakazat").click(function () {
  currentProduct = $(this).siblings(".title").html();
});

})(jQuery);
