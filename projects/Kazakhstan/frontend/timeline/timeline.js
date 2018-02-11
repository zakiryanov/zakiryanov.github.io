angular.module('myApp').controller('timelineCtrl',function (vmService,$sce,$location,$anchorScroll,$scope,$http,$state,$localStorage,$document) {
	var vm = this
	lastScrollTop = 0;
	vm.isShowModal = false;
	vm.currentCircle = -1;
	vm.currentText = {title:''}
	vm.circleClass = "scroll-down";
	vmService.init(vm,$scope,'timeline',func,func);

	vm.getVideoUrl = function(url) {
		return $sce.trustAsResourceUrl(url+'?autoplay=0&showinfo=0&controls=0');
	}

	vm.change = function(i){
		if(vm.isShowModal) return;
		if(vm.currentCircle+i>vm.currentText.dates.length-1 || vm.currentCircle+i<0) return;
		vm.circleClass = i>0?"scroll-up":"scroll-down";
		$scope.$apply();
		vm.currentCircle+=i;
		vm.slider.currentValue = vm.currentCircle;
		$scope.$apply();
	}

	vm.showTimelineInfo = function(){
		vm.isShowModal=true;
		$scope.$emit('openTimelineInfo',{});
	}

	$scope.$on('closeTimeLineInfo',function(){
		vm.isShowModal=false;
	})

	$('html').addClass('normalize')

	$scope.$on("$destroy", function(){
		$('.loader-bg').hide();
		$scope.$emit('isTimelineActive',false)
		$('html').removeClass('normalize')
	});

	function scrolled(e) {
		var evt = e.originalEvent || e;
    var deltaY = evt.deltaY || (-1 / 40 * evt.wheelDelta)
    vm.change(deltaY>0?-1:1);
		$(window).off('wheel');
		setTimeout(function(){
			$(window).on('wheel',scrolled)
		},500)
	}
	$(window).on('wheel',scrolled)

	// var counter = 0;
	$('body').mousemove(function(e){
		// setInterval(function(){
			var amountMovedX = (e.pageX * -1 / 10);
			var amountMovedY = (e.pageY * -1 / 10);
			$('.main-content').css('background-position',amountMovedX+ 'px ' + amountMovedY + 'px');
		// $('.main-content').css('background-position',(++counter)+ 'px ' + 1 + 'px');
		// },80)

	});

	function func(){
		vm.currentText = vm.langsTexts[vm.currentLang];
		if(vm.currentCircle==-1) vm.currentCircle = vm.langsTexts[vm.currentLang].dates.length-1;
		vm.currentText.dates.forEach(function(x){
			if(x.left_bg.indexOf('https://www.you')==-1) x.isImg = true;
			else x.isImg = false;
		})
		$scope.$emit('isTimelineActive',true)

		vm.slider = {
			currentValue:vm.currentCircle,
			options: {
				floor: 0,
				ceil: vm.currentText.dates.length-1,
				vertical: true,
				showSelectionBar: true,
				showTicksValues: true,
				onEnd: function(id) {
					setTimeout(function(){
						vm.change(vm.slider.currentValue-vm.currentCircle)
					},0)
				},
				translate:function(value){
					if(isNaN(value)) return "";
					return vm.currentText.dates[value].range;
				}
			}
		};
	}
});
