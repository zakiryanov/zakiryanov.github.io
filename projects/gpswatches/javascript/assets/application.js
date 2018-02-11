$(function() {

  /*-----------------------------------------------------------------------------------*/
  /*  Anchor Link
  /*-----------------------------------------------------------------------------------*/
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
      || location.hostname == this.hostname) {

      var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);
        return false;
      }
    }
  });


     


       var modal = document.getElementById('myModal');
        var data = {};
        function closeModal() {
            modal.style.display = "none";
            data ={};
           $(".error").text('');            
        }

          $(".close").click(function () {
            closeModal();
        });

        $('.zakaz-btn').click(function(){
            data.currentProduct = $(this).siblings('h3').text().trim(); 
            console.log('data',data);
            modal.style.display = "block";
        });

        $("#mainBtn").click(function (e) {
            e.preventDefault();
             console.log('data',data);
            data.name = $("#name").val();
            data.phone = $("#phone").val();
            if(data.name==""||data.phone=="") {
                $("#formText").html('Заполните все поля :)');
                return;
            }
           $("#formText").text('Спасибо, '+data.name+'. Мы перезвоним вам в ближайшее время :)');

            $.ajax({
                type: 'POST',
                url: 'http://gpswatches.kz/endpoint',
                data: data,
                success: function(data) {
                  console.log(data);
                },
                error: function(xhr, status, error) {
                }
            });

            return false;
        });

        $("#mainBtn2").click(function (e) {
             console.log('data',data);
            e.preventDefault(); 

            data.name = $("#clientName").val();
            data.phone = $("#clientPhone").val();
          
            if(data.name==""||data.phone=="") {
                $(".error").text('Пожалуйста заполните пуcтые поля :)');
                return;
            }
           $(".error").text('Спасибо, '+data.name+'. Мы перезвоним вам в ближайшее время :)');

            $.ajax({
                type: 'POST',
                url: 'http://gpswatches.kz/endpoint',
                data: data,
                success: function(data) {
                  console.log(data);
                },
                error: function(xhr, status, error) {
                }
            });

            return false;
        });

  /*-----------------------------------------------------------------------------------*/
  /*  Tooltips
  /*-----------------------------------------------------------------------------------*/
  $('.tooltip-side-nav').tooltip();
  
});
