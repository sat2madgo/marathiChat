var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
	host: process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
	port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
});

server.register([require('inert'), require('hapi-error')], function () {

	server.route([
	  { method: 'GET', path: '/', handler: { file: "index.html" } },
		// switch these two routes for a /static handler?
	  { method: 'GET', path: '/client.js', handler: { file: './lib/client.js' } },
		{ method: 'GET', path: '/style.css', handler: { file: './css/style.css' } },
	  { method: 'GET', path: '/bootstrap.min.css', handler: { file: './css/bootstrap.min.css' } },
	  { method: 'GET', path: '/load',      handler: require('./lib/load_messages').load }
	]);

	server.start(function () {
		require('./lib/chat').init(server.listener, function(){
			// console.log('REDISCLOUD_URL:', process.env.REDISCLOUD_URL);
			console.log('Feeling Chatty?', 'listening on: http://127.0.0.1:' + 8000);
		});
	});

});

module.exports = server;
