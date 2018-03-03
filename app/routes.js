const Router = Use('Router');

Router.get('/', 'HomeController');
Router.get('/user/:id', 'HomeController@test');