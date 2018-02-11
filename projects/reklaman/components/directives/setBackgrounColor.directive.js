angular.module('app').directive('setBackgroundColor',function() {
	return {
	    link: function(scope, element, attr) {
	    	element.css('color',''+attr['setBackgroundColor']);	    	
	    }
	}
})