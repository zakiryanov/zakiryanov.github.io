angular.module('app')
	.filter('ending', function () {
	  return function (item) {
	      if((typeof item)=='number'){
	      	if(item==1) return 'Выбрана 1 зона';
	      	else if(item>1 && item<5) return 'Выбрано '+item+' зоны';
	      	else return 'Выбрано '+item+' зон';
	      }else{
	      	return 'Все';
	      }
	      
	  };
	});