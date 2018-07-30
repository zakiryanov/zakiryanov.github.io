<!DOCTYPE html>
<html lang="ru" data-livestyle-extension="available">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0" /> -->
    <meta name=”description” content=”Cтройтельная компания ИП Джакупов, ЖК Болашак”/>
    <meta name=”robots” content=”noindex, nofollow” />
    <title>Cтройтельная компания ИП Джакупов, ЖК "Болашак"</title>
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <link rel="stylesheet" href="./css/reset.css" />
    <link rel="stylesheet" href="./css/slick.css" />
    <link rel="stylesheet" href="./css/slick-theme.css">
    <link rel="stylesheet" href="./css/animate.min.css" />
    <link rel="stylesheet" href="./css/fonts.css" />
    <link rel="stylesheet" href="./css/bootstrap.min.css" />
    <link rel="stylesheet" href="./css/commmon.css" />
    <link rel="stylesheet" href="./css/index.css">
    <style>

        .bg-img-black{
            background-color: rgba(0,0,0,.6);
        }

        .showModal{
            padding: 15px 25px
        }

        .contacts{
          font-weight: bold;
          padding-bottom: 1rem;
      }

      .contacts .address{
          font-size: 25px;
          font-weight: bold;
          margin-bottom: 20px;
      }

      .contacts .email{
          font-size: 30px;
          font-weight: bold;
      }
      .contacts .phone-number{
          font-size: 35px;
          font-weight: bold;
          margin-bottom: 20px;
          display: block;
      }
      footer{
          margin-top: 150px;
      }
      footer p{
          margin-top: 30px;
          margin-left: 50px;
      }

      .modal-body input {
          width: 100%;
          margin-top: 20px;
          outline: none;
          border: none;
          border-bottom: 1px solid #e38800;
          padding: 7px;
      }

      .modal-body button{
          display: block;
          text-transform: none;
          font-size: 16px;
          padding: 15px 25px;
          margin-top: 50px;
      }

      .modal-title{
        color: #e38800
    }


</style>
</head>
<body>

    <div class="bg-img main-bg-img">
        <div class="bg-img-black"></div>
        <div class="content">
           <?php
            include 'header.php';
            ?>
            <section class="contacts container">
                <div class="row">
                    <div class="col-md-6 d-flex flex-column justify-content-between align-items-start wow fadeInLeft">
                        <p class="address">Наш офис расположен по <br> ул.Акана серэ 70 <br>
                           пересечение Куйбышева <br>
                           <span class="email">almira9090@bk.ru</span>
                           <br>
                           Пн-сб 10:00 - 18:00
                       </p>
                       <div>
                        <a class="phone-number" href="tel: 8(778) 517-04-39 ">8(778) 517-04-39</a>
                        <button  data-toggle="modal" data-target="#myModal">оставить заявку</button>
                    </div>

                </div>
                <div class="col-md-6  wow fadeInRight">
                    <script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Aba65b29f5199da2b03c4b1ce758ebe043549816575fd9e2c6ab18b8500a69b41&amp;width=110%&amp;height=400&amp;lang=ru_RU&amp;scroll=true"></script>
                </div>
            </div>
            <footer class="d-flex flex-column align-items-center justify-content-center">
                <p>ИП ДЖАКУПОВ &copy; Все права защищены.</p>
            </footer>

        </section>

    </div>
</div>

</div>

<!-- The Modal -->
<div class="modal mt-5" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
          <h4 class="modal-title">Обратная связь</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
        <input type="text" id="clientName" placeholder="Ваше имя">
        <input type="text" id="clientPhone" placeholder="Ваш номер телефона">
        <button id="sendToMail">оставить завку</button>
    </div>
    <div class="congrats">
        Спасибо за заявку!
        <br>
        Мы обязательно свяжемся с вами в ближайшее время!
    </div>

</div>
</div>
</div>

<script src="./js/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
<script src="./js/bootstrap.min.js"></script>
<script>
    $(document).ready(function() {
        $('#sendToMail').click(function(){
            $('.congrats').show();
            $('.modal-body').hide()
        })
        
    })
</script>
</body>
</html>
