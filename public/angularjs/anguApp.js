var airBnB = angular.module('airBnB', [ 'ngAnimate', 'focus-if', 'ngAutocomplete', 'ngMessages', 'ngRangeSlider', 'ngMap' ])
	.config([ '$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	}])
	.controller("searchBarController", function($scope, $http, $window) {
		$scope.city = '';
		$scope.options = {};
		$scope.options.watchEnter = true;

		$scope.$watch('city', function() {
			if ($scope.city !== undefined && typeof $scope.city !== 'string') {
				$window.location.href = '/searchListing?where='+$scope.city.formatted_address;
			}
		});
	})
	.controller('homepage', function() {
		
	})
	.controller('login', function($scope, $http, Random) {
		$scope.login = function() {
			console.log($scope.email);

			$http({
				method : "POST",
				url : '/login',
				data : {
					"email" : $scope.email,
					"password" : $scope.password
				}
			}).then((results) => {
				console.log("Results", results);
			}, (error) => {
				console.log("Error", error);
			})
		};
	})
	.controller('viewListing', function($scope, $http, Random, Date) {
		$scope.init = function(retrievedData) {
			var data = JSON.parse(retrievedData);
			$scope.data = JSON.parse(retrievedData);	
			console.log('$scope.data', $scope.data);
				

		}
		
		$scope.requestBooking = function() {
			$http({
				method : "POST",
				url : '/placeBidOnListing',
				data : {
					"checkin" : Date.formatToSQLWorthy($scope.chkInOutDate.split("-")[0].trim()),
					"checkout" : Date.formatToSQLWorthy($scope.chkInOutDate.split("-")[1].trim()), 
					"bid_amount" : $scope.bid_amount,
					"listing_id" : $scope.data.listing_id,
					"userId" : 1,
					"guests" : $scope.noOfGuests
				}
			}).then((results) => {
				if(results.data.statusCode === 200) {
					console.log("Results", results);
				}
			}, (error) => {
				console.log("Error", error);
			})
		}
		
		$scope.instantBooking = function() {
			$http({
				method : "POST",
				url : '/instantBook',
				data : {
					"checkin" : Date.formatToSQLWorthy($scope.chkInOutDate.split("-")[0].trim()),
					"checkout" : Date.formatToSQLWorthy($scope.chkInOutDate.split("-")[1].trim()), 
					"listing_id" : $scope.data.listing_id,
					"userId" : 1,
					"guests" : $scope.noOfGuests,
					"trip_amount" : $scope.data.daily_price
				}
			}).then((results) => {
				if(results.data.statusCode === 200) {
					console.log("Results", results);
				}
			}, (error) => {
				console.log("Error", error);
			})
		}
	})
	.controller('profile', ($scope, $http) => {
		$scope.init = function(profileDetails) {
			$scope.rating_test = 3;
			$scope.data = JSON.parse(profileDetails);
			$scope.active_tab = 'profile_tab';
			$scope.genders = ['Male', 'Female', 'Other'];
			$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			$scope.dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
			$scope.years = ['2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005',
			                '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993',
			                '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981',
			                '1980', '1979', '1978', '1977', '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969',
			                '1968', '1967', '1966', '1965', '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957'];
			if($scope.data[0][0].dob !== null) {
				$scope.birth_month = $scope.months[new Date($scope.data.dob).getMonth() + 1];
				$scope.birth_year = new Date($scope.data.dob).getFullYear();
				$scope.birth_date = new Date($scope.data.dob).getDate();
			} else {
				$scope.birth_month = $scope.months[0];
				$scope.birth_year = $scope.years[0];
				$scope.birth_date = $scope.dates[0];
			}
		}
		
		$scope.updateHostRating = function(trip, rating) {
			$http({
				method : "POST",
				url : '/updateRating',
				data : {
					"rating" : rating,
					"trip" : trip, 
					"is_host" : true
				}
			}).then((results) => {
				if(results.data.statusCode === 200) {
					console.log("Results", results);
				}
			}, (error) => {
				console.log("Error", error);
			})
		}
		
		$scope.updateTravellerRating = function(trip, rating) {
			$http({
				method : "POST",
				url : '/updateRating',
				data : {
					"rating" : rating,
					"trip" : trip, 
					"is_host" : false
				}
			}).then((results) => {
				if(results.data.statusCode === 200) {
					console.log("Results", results);
				}
			}, (error) => {
				console.log("Error", error);
			})
		}
		
	})
	.controller('addProperty', ($scope, $http) => {
		$scope.page = 1;
		$scope.fetchRoomTypes = () => {
			$http({
				method : "POST",
				url : "/fetchRoomTypes"
			}).then((result) => {
				$scope.room_types = result.data.room_types;
			}, (error) => {
				$scope.room_types = [];
			})
		}

		$scope.fetchPropertyTypes = () => {
			$http({
				method : "POST",
				url : "/fetchPropertyTypes"
			}).then((result) => {
				$scope.property_types = result.data.property_types;
			}, (error) => {
				$scope.property_types = [];
			})
		}
		$scope.addProperty = () => {
			console.log($scope.house_rules);
			$http({
				method : "POST",
				url : "/addProperty",
				data : {
					'property_type' : $scope.property_type,
					'house_rules' : $scope.house_rules,
					'location' : {
						'longitude' : $scope.addressDetails.geometry.location.lng(),
						'latitude' : $scope.addressDetails.geometry.location.lat(),
						'st_address' : $scope.addressDetails.address_components[0].long_name + ' ' + $scope.addressDetails.address_components[1].long_name,
						'apt' : $scope.apt,
						'city' : $scope.addressDetails.address_components[3].long_name,
						'state' : $scope.addressDetails.address_components[5].long_name,
						'zip' : $scope.addressDetails.address_components[7].long_name
					}
				}
			}).then((result) => {
				if (result.data.statusCode === 200) {

				}
			}, (error) => {

			})
		}

		$scope.$watch('addressDetails', function() {
			if ($scope.addressDetails !== undefined && typeof $scope.addressDetails != 'string') {
				$scope.city = $scope.addressDetails.address_components[3].long_name;
				$scope.state = $scope.addressDetails.address_components[5].long_name;
				$scope.zip = $scope.addressDetails.address_components[7].long_name;
			}
		});

		$scope.fetchPropertyTypes();
		$scope.fetchRoomTypes();

	})
	.controller('addListing', ($scope, $http, $location, Date) => {
		$scope.page = 1;
		$scope.fetchAmenities = () => {
			$http({
				method : "POST",
				url : "/fetchAmenities"
			}).then((result) => {
				$scope.amenities = result.data.amenities;
			}, (error) => {
				$scope.amenities = [];
			})
		}

		$scope.fetchRoomTypes = () => {
			$http({
				method : "POST",
				url : "/fetchRoomTypes"
			}).then((result) => {
				$scope.room_types = result.data.room_types;
			}, (error) => {
				$scope.room_types = [];
			})
		}

		$scope.addListing = () => {
			$http({
				method : "POST",
				url : "/addListing",
				data : {
					'property_id' : $location.search().property,
					'room_type' : $scope.room_type,
					'title' : $scope.title,
					'is_bid' : Boolean($scope.is_bid),
					'start_date' : Date.formatToSQLWorthy($scope.dates.split("-")[0].trim()),
					'end_date' : Date.formatToSQLWorthy($scope.dates.split("-")[1].trim()),
					'daily_price' : $scope.price,
					'bedrooms' : $scope.number_of_bedrooms,
					'accommodations' : $scope.number_of_guests,
					'description' : $scope.description,
					'bathrooms' : $scope.number_of_bathrooms,
					'beds' : $scope.number_of_beds,
					'checkin' : '2:00',
					'checkout' : '11:00'
				}
			}).then((result) => {
				if (result.data.statusCode === 200) {

				}
			}, (error) => {

			})
		}

		$scope.fetchRoomTypes();
		$scope.fetchAmenities();
	})
	.controller('signUpController', function($scope, $http, Random) {
		$scope.emailSignUp = false;
		$scope.beforeSignUp = true;
		$scope.signUpWithEmail = function() {
			$scope.emailSignUp = true;
			$scope.beforeSignUp = false;
		};

		$scope.signUp = function(){
			//sending new user data to node
			$http({

				url: '/register',
				method: 'POST',
				data : {
					'email'    : $scope.email,
					'firstname': $scope.f_name,
					'lastname' : $scope.l_name,
					'password' : $scope.password,
					'month'    : $scope.month,
					'day'      : $scope.day,
					'year'     : $scope.year
				}

			}).then(function mySuccess(response){
				console.log("Sign Up Done !!");
			}, function myError(response){
				console.log("Could not register !!");
			});			
		};



	})
	.controller('navBarController', function($scope, $http, Random) {
		$scope.getHomePage = function(){
			window.location.assign('/');
		};
	})
	.controller('searchListingController', function($scope, $http, Random, $interval, NgMap) {
		
		$scope.init = function(retrievedData) {
  		  
  		  var data = JSON.parse(retrievedData);
  		  // console.log("Data: ", data);

			$scope.data = JSON.parse(retrievedData);

			// console.log(" >>><<<  >>><<<  >>><<< ");
			// console.log('$scope.data', $scope.data);
			// console.log('$scope.data', $scope.data.results.length);

			var maxRange = 0;

			for(var j = 0 ; j < $scope.data.results.length; j++){

				if($scope.data.results[j].daily_price > maxRange){
					maxRange = $scope.data.results[j].daily_price;
				}

			}

			// console.log('maxRange', maxRange);



			$scope.range = { from: 0, to: maxRange };
	       	$scope.max = maxRange;


	       	var min,max;

	       	$scope.from = function(){
	       		min = ($scope.min);       		
	       	}
	       	$scope.to = function(){
	       		max = ($scope.max);       		
	       	}

	       	$scope.$watch('range', function(){
	       		
	       		console.log();
	        	// console.log('$scope.range', $scope.range);

	        	// $scope.data
	        	// console.log('$scope.data', $scope.data);

	        	$scope.propertyArray = $scope.data.results;
	        	// console.log('$scope.propertyArray', $scope.propertyArray);

	        	$scope.filteredResults  = $scope.propertyArray.filter(function(elem, index, array){

	        		return (elem.daily_price >= $scope.range.from && elem.daily_price <= $scope.range.to);
	        		
	        	});
	        		// console.log('$scope.filteredResults', $scope.filteredResults);

	       	});
		
		}
		
	})
	.directive('ngEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown keypress", function(event) {
				if (event.which === 13) {
					scope.$apply(function() {
						scope.$eval(attrs.ngEnter);
					});
					event.preventDefault();
				}
			});
		};
	})
	.directive('starRating', function starRating() {
		return {
			restrict : 'EA',
			template : '<ul class="star-rating" ng-class="{readonly: readonly}">' +
				'  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled, low_rating: ratingValue === 1, high_rating: ratingValue === 5}" ng-click="toggle($index)">' +
				'    <i class="fa fa-star"></i>' + // or &#9733
				'  </li>' +
				'</ul>',
			scope : {
				ratingValue : '=ngModel',
				max : '=?', // optional (default is 5)
				onRatingSelect : '&?',
				readonly : '=?'
			},
			link : function(scope, element, attributes) {
				if(scope.ratingValue == null) {
					scope.ratingValue = 1;
				}
				if (scope.max == undefined) {
					scope.max = 5;
				}
				function updateStars() {
					scope.stars = [];
					for (var i = 0; i < scope.max; i++) {
						scope.stars.push({
							filled : i < scope.ratingValue
						});
					}
				};
				scope.toggle = function(index) {
					if (scope.readonly == undefined || scope.readonly === false) {
						scope.ratingValue = index + 1;
						scope.onRatingSelect({
							rating : index + 1
						});
					}
				};
				scope.$watch('ratingValue', function(oldValue, newValue) {
					if (newValue) {
						updateStars();
					}
				});
			}
		};
	})
	.directive('ngEncrypt', function() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, elem, attrs, ngModel) {
				ngModel.$parsers.push(function(value) {
					return sjcl.encrypt(scope.randomPassword, value);
				});
			}
		};
	})
	.service('Random', function() {
		this.randomString = function(length) {
			var generatedString = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (var i = 0; i < length; i++) {
				generatedString += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return generatedString;
		};
	})
	.service('Validation', function() {
		this.validateTextArea = function(value) {
			if(value.length > 10000) {
				return false;
			} else {
				return true;
			}
		};

		this.validateTextBox = function(value) {
			if(value.length > 100) {
				return false;
			} else {
				return true;
			}
		};
		this.validateCount = function(value) {
			var count_validator = new RegExp(/^\d$/);
			if(value.match(count_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validatePrice = function(value) {
			var price_validator = new RegExp(/^\d+(,\d{1,2})?$/);
			if(value.match(price_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validateDateRange = function(value) {
			var date_range_validator = new RegExp(/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d\s-\s(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d$/);
			if(value.match(date_range_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validateCity = function(value) {
			var city_validator = new RegExp(/^[a-zA-Z]+(?:(?:\\s+|-)[a-zA-Z]+)*$/);
			if(value.match(city_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validateZip = function(value) {
			var zip_validator = new RegExp(/^\d{5}([\-]?\d{4})?$/);
			if(value.match(zip_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validateState = function(value) {
			var state_validator = new RegExp(/^(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming)$/);
			if(value.match(state_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validateEmail = function(value) {
			var email_validator = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
			if(value.match(email_validator) !== null) {
				return true;
			} else {
				return false;
			}
		};
		this.validateYear = function(value) {
			var year_validator = new RegExp(/^\d{4}$/);
			if(value.match(email_validator) !== null) {
				if(Number(value) > new Date().getFullYear()) {
					return false;
				} else {
					return true;

				}
			} else {
				return false;
			}
		};
		this.validatePassword = function(value) {
			var password_validator = new RegExp(/^[A-Za-z0-9_-]{6,18}$/);
			if(value.match(password_validator) !== null) {
				return true;
			} else {
				return false;
			}
		}
	})
	.service('Date', function() {
		this.formatToSQLWorthy = function(dateString) {
			var date = new Date(dateString);
			var day = date.getDate();
			var month = date.getMonth();
			var year = date.getFullYear();
			return year + '-' + (month + 1) + '-' + day;
		}
	});
