angular.module('app').directive('setBackgroundImg',function() {
	return {
		scope: {
         src: '@'
        },
	    link: function(scope, element, attr) {
	    	attr.$observe('src', function(){
     			element.css('background-image','url('+scope.src+')');
			});
	    	
	    }
	}
})