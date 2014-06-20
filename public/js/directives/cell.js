app.directive('cell', function(){
	return{
		restrict: 'E',
		scope:{
			val: '=',
			flip:'&'
		},
		template:"<div class='col-xs-4 col-sm-4 col-md-4 cell' ng-class='getActiveClass()'>{{val}}</div>",
		link: function(scope,elem,attrs){

		  elem.bind('click', function(){
        scope.flip();
        scope.$apply();
      });

      scope.getActiveClass = function(){
      	if (scope.$parent.$eval(attrs.val) == scope.$parent.humanChar){
      		return 'red';
      	}else{
      		return 'blue';
      	}
      }
	  }
	}
});