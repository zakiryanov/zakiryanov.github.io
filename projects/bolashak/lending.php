<!DOCTYPE html>
<!--[if lt IE 7]><html lang="ru" class="lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html lang="ru" class="lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html lang="ru" class="lt-ie9"><![endif]-->
<!--[if gt IE 8]><!-->
<html lang="ru" data-livestyle-extension="available">
<!--<![endif]-->
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
    <link rel="stylesheet" href="./css/lending.css">
</head>
<body>

    <section class="section-1">
     <?php
            include 'header.php';
            ?>
    <div class="side-block wow fadeIn">
        ЖК "БОЛАШАК"
        <br>
        НОВЫЕ КВАРТИРЫ ПО ВЫГОДНОЙ ЦЕНЕ!
        <br>
        от 175.000 тг/ м²  до 200.000 тг/ м²
    </div>
</section>

<section class="section-2">
    <div class="bg-img-white"></div>
    <div class="wow fadeInDown">
      <h2 class="title"></h2>
      <p class="descr">Объект расположен в центре города и находится в окружении всех необходимых объектов инфраструктуры – детских садов, школ, детских площадок, магазинов, ресторанов и др. Мы предлагаем 2,3,4 комнатные квартиры , относящиеся к высокому плану жилья благодаря большому выбору площадей и планировок, и самое главное доступной цене. Дом состоит из 3х подъездов и 9 этажей, с подземным паркингом. Концепцией безопасности жилого комплекса предусмотрено круглосуточное видеонаблюдение на территории комплекса, в подъездах и паркингах. Большую часть придомовой территории охватывают внешние видеокамеры, установленные на фасадах зданий, а перемещения людей между этажами фиксируются видеокамерами внутри подъездов.</p>
  </div>
  <div class="wow fadeInUp d-flex justify-content-sm-between">
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
</div>
</section>

<section class="section-3">
    <script id="mapScript" type="text/javascript" charset="utf-8" async></script>
</section>

<section class="section-4">
    <h2 class="title wow fadeInDown">Планировки</h2>
    <ul>
        <li>
            <div class="slider wow fadeIn">
            </div> 
        </li>

        <li class="prev"></li>
        <li class="next"></li>
    </ul>
</section>

<section class="section-5">
    <div class="bg-img-white"></div>

    <div class="side-block">

    </div>

    <div class="d-flex justify-content-around">
        <div class="my-card  wow fadeInUp" data-wow-delay=".2s">
            <div class="bg-img"></div>
            <p class="descr">Дети - наше будущее! Мы оснастили дворы современными БЕЗОПАСНЫМИ детскими площадками. Территория полностью облагорожена! </p>
        </div>
        <div class="my-card  wow fadeInUp" data-wow-delay=".4s">
            <div class="bg-img"></div>
            <p class="descr">Имеется подземный паркинг, который оборудован дистанционной системой контроля доступа и осуществляется с помощью индивидуального брелка водителя </p>
        </div>
    </div>
    <div class="d-flex justify-content-around">
        <div class="my-card  wow fadeInUp" data-wow-delay=".6s">
            <div class="bg-img"></div>
            <p class="descr">Подъем на этаж в каждой парадной осуществляется с помощью лестниц и лифта Система автоматической эвакуации до ближайшего этажа. </p>
        </div>
        <div class="my-card  wow fadeInUp" data-wow-delay=".8s">
            <div class="bg-img"></div>
            <p class="descr">В жилом комплексе будет оборудована системами видеонаблюдения, позволяющими 24 часа в сутки обеспечивать безопасность как самого комплекса, так и его жителей. </p>
        </div>
    </div>
    <div class="text-center">
        <button class="showModal">оставить заявку</button>
    </div>
</section>

<!--MODAL-->
<div id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-header">
            <span class="close">&#10006;</span>
        </div>
        <div class="modal-body">
         <div class="row d-flex">
             <div class="col-7">
                 <div class="d-flex justify-content-between form-group">
                     <span>Выбрать объект</span>
                     <div class="styled-select">
                     <select id="">
                         <option value="bolashak" selected>ЖК БОЛАШАК</option>
                         <option disabled value="">ЖК БРИЛЛИАНТ</option>
                         <option disabled value="">ЖК ТРИУМФ</option>
                         <option disabled value="">ЖК САЙРАН</option>
                         <option disabled value="">РЕСТОРАН АЙША</option>
                     </select>
                     </div>
                 </div>
                 <div class="d-flex justify-content-between form-group">
                     <span>Количество комнат</span>
                      <div class="styled-select">
                     <select id="roomsCount">
                         <option selected disabled value="">Количество комнат</option>
                         <option value="2">2 комнатная</option>
                         <option value="3">3 комнатная</option>
                         <option value="4">4 комнатная</option>
                     </select>
                     </div>
                 </div>
                 <div class="d-flex justify-content-between form-group">
                     <span>Жилая площадь</span>
                      <div class="styled-select">
                     <select id="areaCount">

                     </select>
                     </div>
                 </div>
                 <input type="text" id="clientName" placeholder="Ваше имя">
                 <input type="text" id="clientPhone" placeholder="Ваш номер телефона">
                 <div class="d-flex justify-content-between">
                     <button id="sendToMail">оставить завку</button>
                     <button id="reset">сброс</button>
                 </div>
             </div>
             <div class="col-5">
                 <div class="area-info">
                     <table>
                         <thead>
                             <tr>
                                 <th>этаж</th>
                                 <th>цена за 1 кв/м<sup>2</sup></th>
                             </tr>
                         </thead>
                         <tbody>
                             <tr>
                                 <td>2</td>
                                 <td>200.000</td>
                             </tr>
                             <tr>
                                 <td>3</td>
                                 <td>200.000</td>
                             </tr>
                             <tr>
                                 <td>4</td>
                                 <td>200.000</td>
                             </tr>
                             <tr>
                                 <td>5</td>
                                 <td>200.000</td>
                             </tr>
                             <tr>
                                 <td>6</td>
                                 <td>195.000</td>
                             </tr>
                             <tr>
                                 <td>7</td>
                                 <td>190.000</td>
                             </tr>
                             <tr>
                                 <td>8</td>
                                 <td>185.000</td>
                             </tr>
                             <tr>
                                 <td>9</td>
                                 <td>175.000</td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
             </div>
         </div>
     </div>
     <div class="congrats">
        Спасибо за заявку!
        <br>
        Мы обязательно свяжемся с вами в ближайшее время!
    </div>

</div>
</div>

<script src="./js/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
<script src="./js/bootstrap.min.js"></script>
<script src="./js/slick.min.js"></script>
<script src="./js/wow.min.js"></script>


<script>
    $(document).ready(function(){


        $(window).bind('hashchange', function() {
            console.log('hi')
            window.location.reload(false); 
        });

        var selectedProject = location.href.split('#')[1];
        var modal = document.getElementById('myModal');
        var currentClock = "";
        var mainMap = {
            'bolashak':{
                translate:'болашак',
                map:'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6aaa9285e375d4b2cace82371b2b23df629fa9207d2629184747be3fdad6fcf4&amp;width=100%&amp;height=600&amp;lang=ru_RU&amp;scroll=true',
                showButton:true,
                card:'.png',
                planirovka:'.jpg',
                planirovkaNum:4,
                text:`Объект  расположен в центре города и находится в окружении всех необходимых объектов инфраструктуры – детских садов, школ, детских площадок, магазинов, ресторанов и др.
                Мы предлагаем  2,3,4 комнатные квартиры , относящиеся к высокому плану жилья благодаря большому выбору площадей и планировок, и самое главное доступной цене.
                Дом состоит из 3х подъездов и 9 этажей, с подземным паркингом. 
                Концепцией безопасности жилого комплекса предусмотрено круглосуточное видеонаблюдение на территории комплекса, в подъездах и паркингах. Большую часть придомовой территории охватывают внешние видеокамеры, установленные на фасадах зданий, а перемещения людей между этажами фиксируются видеокамерами внутри подъездов.`
            },
            'sairan':{
                translate:'сайран',
                map:'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ac652ea263af0e099aef2f1c0050fc7ea17cc63664f12301a7f89953001a3bc1d&amp;width=100%&amp;height=466&amp;lang=ru_RU&amp;scroll=true',
                showButton:false,
                card:'.png',
                planirovka:'.png',
                planirovkaNum:5,
                text:`ЖК Сайран состоит их 2х домов, один из первых построенных домов, был построен в 2015 году, сдан сентябрь 2015год. Дом состоит из 2х подьездов и 5 этажей. Также с подземным паркингом, детская площадка из тартанового покрытия. Второй был построен в 2016 году. Сдан сентябрь 2016год`
            },
            'brilliant':{
                translate:'бриллиант',
                map:'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A264fdb1ad57b4581fa9c6b2150139c6fed5eff25a8815e4091213163ef9a69d8&amp;width=100%&amp;height=516&amp;lang=ru_RU&amp;scroll=true',
                showButton:false,
                card:'.jpeg',
                planirovka:'.png',
                planirovkaNum:7,
                text:`Объект  расположен в центре города и находится в окружении всех необходимых объектов инфраструктуры – детских садов, школ, детских площадок, магазинов, ресторанов и др.
                Мы предлагаем  2,3,4 комнатные квартиры , относящиеся к высокому плану жилья благодаря большому выбору площадей и планировок, и самое главное доступной цене.
                ЖК Бриллиант планируема сдача  объекта сентябрь 2019год.
                `
            },
            'triumf':{
                translate:'триумф',
                map:'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A701c54cb6a94004a53656fd210db0cfd5fa51d7ed5a57d6dd8b20b6fac1f343f&amp;width=100%&amp;height=453&amp;lang=ru_RU&amp;scroll=true',
                showButton:false,
                card:'.jpg',
                planirovka:'.png',
                planirovkaNum:6,
                text:`ЖК Триумф расположен по адресу Ауельбекова 38,  сдан в эксплуатацию сентябрь 2017 год. Дом состоит из трех подьездов и девяти этажей, с подземным паркингом наверху детская площадка из тартанового покрытия, имеется отдельное футбольное поле для детей. Закрытый безопасный двор огорожден шлагбаумами, видеонаблюдение со всех сторон.`
            },
        };
        var roomsMap = {'2':[69,70,72],'3':[91],'4':[121]};
        var project = mainMap[selectedProject]
        console.log(project)
        if(!project) project = mainMap['bolashak'];

        $('.section-1').css('background-image', 'url(./assets/img/'+selectedProject+'/main'+project.card+')')

        $('.section-2 .title').text('о проекте жк '+project.translate)

        $('.section-2 .descr').text(project.text)

        $('.section-3 #mapScript').attr('src',project.map)

        $('.section-5 .side-block').text('Преимущество ЖК "'+(project.translate.toUpperCase())+'"')

        if(!project.showButton) $('.section-1 .side-block,.section-5 button').hide()

            for(var i=0;i<project.planirovkaNum;i++){
                var $slide = $('<div class="slide"/>').css('background-image','url(./assets/img/'+selectedProject+'/planirovka-'+(i+1)+project.planirovka);
                $('.section-4 .slider').append($slide);
            }

            $('.card').each(function(index){
                $(this).css('background-image','url(./assets/img/'+selectedProject+'/card-'+(index+1)+project.card)
            })

            $('.my-card .bg-img').each(function(index){
                $(this).css('background-image','url(./assets/img/advantage-'+(index+1)+'.jpg)')
            })

            $(".close").click(function () {
                closeModal();
            });

            $('.showModal').click(openModal)

            $("#reset").click(function(){
                $('#roomsCount').val('')
                $('#areaCount').empty();
                $('#clientName').val('')    
                $('#clientPhone').val('')    
            })

            $('#roomsCount').change(function(){
                $('#areaCount').empty();
                roomsMap[$(this).val()].forEach(function(item){
                    $('#areaCount').append('<option value="'+item+'" >'+item+'кв.м</option>')
                })
            })

            function closeModal() {
                modal.style.display = "none";
                $(".modal-body").show();
                $(".congrats").hide();
            }

            function openModal() {
                modal.style.display = "flex";
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal();
                }
            };

            $("#sendToMail").click(function (e) {
                e.preventDefault();
                var data = {};
                var name = $("#clientName").val();
                var phone = $("#clientPhone").val();
                if(name==""||phone=="") {
                    $(".error").show();
                    return;
                }
                data.setFrom = 'dzhakupov.company@gmail.com';
                data.addAddress = 'dzhakupov.company@gmail.com';
                data.subject = 'Письмо с сайта';
                data.username = "dzhakupov.company@gmail.com";
                data.password = "dzhakupovkz";
                data.msg = "Пришла завяка с сайта от "+name+". Номер "+phone;

                $.ajax({
                    type: 'POST',
                    url: './phpmailer/mailer.php',
                    data: data,
                    success: function(data) {
                        console.log(data)
                    },
                    error: function(xhr, status, error) {
                    }
                });

                $(".modal-body").hide();
                $(".congrats").show();
                return false;
            });

            $('.slider').slick({
                autoplay:false,
                arrows: true
            });

            var wow = new WOW({
                boxClass:     'wow',
                animateClass: 'animated',
                offset:       0,
                mobile:       true,
                live:         true,
                scrollContainer: null
            });
            wow.init();
        });
    </script>
</body>
</html>
