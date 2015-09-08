angular.module('hackshop', [])

.controller('StepsController', [
    '$window',
    '$http',
    function($window, $http){

        this.session = function(){
            return $window.Application.session;
        }

        this.createProject = function(name) {
            name = name || 'hackshop-template'
            var me = this;

            me._getGitHubAccessToken()
            .then(function(githubAccessToken){
                
                me.forkHackshop(name, githubAccessToken)
                .then(function(){
                    console.log('forked!');
                });

            });
        }

        this.forkHackshop = function(name, accessToken){
            var user = this.session();

            var checkExistanceOfFork = function(){
                return $http.get({
                    url: 'https://api.github.com/repos/' + user.username + '/' + name,
                    params: {
                        access_token: accessToken
                    }
                }).then(function(response){
                    console.log('success', response);
                }, function(response){
                    console.log('err', response);
                })
            }

            return $http({
                url: 'https://api.github.com/repos/waffleio/hackshop-template/forks',
                method: 'post',
                params: {
                    access_token: accessToken
                }
            })
            .then(function(){
                return checkExistanceOfFork()
            });
        }

        this._getGitHubAccessToken = function(){
            user = this.session();
            return $http.get('https://api.waffle.io/providers', {
                params: {
                    access_token: user.accessToken
                }
            })
            .then (function(response){
                providers = response.data;
                githubProvider = _.find(providers, function(provider){
                    return provider.baseUrl === 'https://github.com';
                });

                githubAccessToken = _.find(user.credentials, function(cred){
                    return cred.provider === githubProvider._id;
                }).accessToken;

                return githubAccessToken;
            });
        }
    }
]);