/* 
 * AngularJS RouteRage
 * 
 * Use $routeParams variables directly in your view 
 *
 * Project started on: Thu, 25 Sep 2014 - 09:21:54 
 * Current version: 1.0.0
 * 
 * Released under the MIT License
 * --------------------------------------------------------------------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ignatius Steven (https://github.com/isteven)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions: 
 *
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 * --------------------------------------------------------------------------------
 */

angular.module( 'isteven-rr', ['ng'] ).directive( 'istevenRr' , [ 
    '$routeParams', 
    '$compile',
    '$interpolate',
    function ( $routeParams, $compile, $interpolate ) {
 
    return {

        // !Important: attribute only
        restrict: 'A',

        link: function( $scope, element, attrs ) {

            // We can't work with DOM, so we need to translate the DOM element 
            // into a string.             
            var oSerializer = new XMLSerializer();
            var domString = oSerializer.serializeToString( element[ 0 ] );

            // !Important: We need to remove the original directive declaration 
            // or else it will be parsed infinitely
            domString = domString.replace( 'isteven-rr=""' , '' );    

            // We also remove the xml attribute added automatically 
            // by the XMLSerializer
            domString = domString.replace( /xmlns="[^"]+"/g , '' );

            // Just copy $routeParams into array. Easier to work with.
            var arrRouteParams = Object.keys( $routeParams );
            
            // Find the "route tokens"( those [[...]] ) from this domString 
            var scopePars = domString.match( /\[\[[^\]\]]+\]\]/g );     
            
            angular.forEach( scopePars, function( value, key ) {

                // We need to check if the variable in the [[ ]] bracket is just a normal variable
                // or an expression. 
                // - Normal variable will be replaced
                // - Expression will be evaluated using $eval
                var isExpression = true;

                // Some clean ups
                var tempVal = value.replace( /\[\[/, '' );
                tempVal = tempVal.replace( /\]\]/, '' );             

                // Find matches in route params                
                for ( var i = 0; i < arrRouteParams.length ; i++ ) {    

                    // If it's not an expression (I know, a very weak checking here)
                    if ( tempVal.toString().trim().length === arrRouteParams[ i ].toString().trim().length ) {                        
                        isExpression = false;                        
                    }

                    // Replace the vars with the $routeParams
                    var regex = new RegExp( arrRouteParams[ i ] , 'g' );
                    tempVal = tempVal.replace( regex, $routeParams[ arrRouteParams[ i ] ] );                    
                };                

                // We evaluate the expression only if it's.. well, an expression
                var processedVar = tempVal;                
                if ( isExpression ) {

                    try {
                        
                        // Parse the $scope variables first before we eval, if any.
                        tempVal = $interpolate( tempVal )( $scope );                                           
                        // $eval() it..
                        processedVar = $scope.$eval( tempVal );  

                    } catch (e) {                        
                        // On error, do nothing. Just keep going.
                    }                                  
                }
            
                // Replace the token with the processed result                
                domString = domString.replace( value, processedVar );                                
            });                            
                                                
            // Attach back the domString in the view - or 'replacing'            
            element[0].outerHTML = $interpolate( domString )( $scope );                                           

            // Compile it
            $compile( element.contents() )( $scope );
        }
    } 
}]);
