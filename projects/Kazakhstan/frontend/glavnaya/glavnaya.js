angular.module('myApp').controller('glavnayaCtrl',function (vmService,$scope,$http,$state,$localStorage,$document) {
	
  var vm = this,
  lastScrollTop = 0;
  vm.scrollCards = {'news':'3','about':'4','president':'5','kz2050':'6','expo':'7'};
  vm.selectedSection = vm.scrollCards['news'];
  vm.isShowVideo = false;
  vm.initSlider = false;
  vmService.init(vm,$scope,'glavnaya',reloadPage,initSlider)

  function reloadPage(){
    $state.go($state.current, {}, {reload: true});
  }

  function initSlider(){
    vm.initSlider = true;
    vm.slickConfig = {
      slidesToShow:2,
      initialSlide: 4
    }
  }

  vm.goToSection = function (sect) {
   vm.selectedSection = sect;
   $document.scrollToElement(angular.element(document.getElementById('section-'+sect)), 0,1000);
 }

 $('.slider').carousel({
  // the number of images to display
  num: 5, 
  // max width of the active image
  maxWidth: 600,
  // min width of the active image
  maxHeight: 400, 
  autoPlay: false,
  // 0.0 - 1.0
  scale: 0.8,
  // the distance between images
  distance: 120
});

});
