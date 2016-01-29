'use strict';


/**
 *
 * Main module of the application.
 */
angular
	.module('sampleApp', [
			'ui.router',
			'ngAnimate',
            'templates-main',
			'pascalprecht.translate',
			'ngCookies',
			'angularUtils.directives.dirPagination',
			'cgBusy',
			'satellizer',
			'toastr',
            'textAngular'
	])
	.config(function ($stateProvider, $translateProvider, $urlRouterProvider) {
		function skipIfLoggedIn($q, $auth) {
      		var deferred = $q.defer();
      		if ($auth.isAuthenticated()) {
      			console.log('skipIfLoggedIn');
        		deferred.reject();
      		} else {
        		deferred.resolve();
      		}
      		return deferred.promise;
    	}

	    function loginRequired($q, $location, $auth) {
	      	var deferred = $q.defer();
	      	if ($auth.isAuthenticated()) {
	        	deferred.resolve();
	      	} else {
	      		console.log('loginRequired');
	        	$location.path('/login');
	      	}
	      	return deferred.promise;
	    }

        $stateProvider
            // home page
	        .state('/', {
	            templateUrl: 'views/home.html',
	            controller: 'HomeController'
	        })
	        .state('menu1', {
	            templateUrl: 'views/menu1.html',
	            url : '/menu1',
	            controller: 'Menu1Controller'
	        })
	        .state('menu2', {
	            templateUrl: 'views/menu2.html',
	            url : '/menu2',
	            controller: 'Menu2Controller'
	        })
	        .state('menu3', {
	            templateUrl: 'views/menu3.html',
	            url : '/menu3',
	            controller: 'Menu3Controller'
	        })
	        .state('messages', {
		        abstract: true,
		        url: '/messages',
		        template: '<ui-view/>'
		    })
	        .state('messages.list', {
	            templateUrl: 'views/messages.html',
	            url : '',
	            controller: 'MessagesController',
		        resolve: {
		          	unreadMessages : function(ContactService) {
		          		return ContactService.getUnreadMessages();
		          	}
		        }
	        })
	        .state('messages.view', {
	        	url: '/:messageId',
	        	templateUrl: 'views/messageView.html',
	        	controller: 'MessageViewController',
	        	resolve: {
	          		message: function(ContactService,$stateParams) {
	          			console.log('$stateParams',$stateParams);
	          			return ContactService.getMessage($stateParams.messageId);
	          		}
	        	}
	      	})
	        .state('contact', {
	            templateUrl: 'views/contact.html',
	            url : '/contact',
	            controller: 'ContactController'
	        })
	        .state('login', {
	            templateUrl: 'views/login.html',
	            url : '/login',
	            controller: 'LoginController',
		        resolve: {
		          	skipIfLoggedIn: skipIfLoggedIn
		        }
	        })
	        .state('signup', {
	            templateUrl: 'views/signup.html',
	            url : '/signup',
	            controller: 'SignupController',
		        resolve: {
		          	skipIfLoggedIn: skipIfLoggedIn
		        }
	        })
	        .state('logout', {
	            template : null,
	            url : '/logout',
	            controller: 'LogoutController'
	        })
	        .state('profile', {
	            templateUrl: 'views/profile.html',
	            url : '/profile',
	            controller: 'ProfileController',
		        resolve: {
		          	loginRequired: loginRequired
		        }
	        });
	        $urlRouterProvider.otherwise('/');
        //Translations
        $translateProvider

            .useStaticFilesLoader({
                prefix: 'translations/locale-',
                suffix: '.json'
            })
            // tells angular-translate which of the registered languages is the one that should be used by default.
            .preferredLanguage('de')
            .registerAvailableLanguageKeys(['en', 'de', 'fr'], {
                'en_*': 'en',
                'de_*': 'de',
                'fr_*': 'fr'
            })
            // fallback language. If there isn't a translation id in the German translation table, angular-translate will search for it in the English or French translation table, etc.
            .fallbackLanguage(['en','fr'])
            // This method tries to determine by itself what the preferred language would be.
            .determinePreferredLanguage()
            // remember language
            .useLocalStorage();
    });