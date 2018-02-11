angular.module('app').directive('setBackgroundImg',function() {
	return {
		scope: {
         src: '@'
        },
	    link: function(scope, element, attr) {
	    	
	    	attr.$observe('src', function(){
	    		if(attr.setBackgroundImg=='user') element.css('background-image','url('+scope.src+')')
	    		else {
	    			var folderName = attr.setBackgroundImg=='banner'?'banner_images/':'company_images/';
     			  element.css('background-image','url(../../../../'+folderName+scope.src+')');
	    		}
			});
	    }
	}
})