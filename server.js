var Hapi = require('hapi');
var server = new Hapi.Server();
console.log("process.env.IP : "+process.env.IP );
console.log("process.env.PORT : "+process.env.PORT );
console.log("process.env.OPENSHIFT_NODEJS_IP : "+process.env.OPENSHIFT_NODEJS_IP );
console.log("process.env.OPENSHIFT_NODEJS_PORT : "+process.env.OPENSHIFT_NODEJS_PORT );
var server_port = process.env.OPENSHIFT_NODEJS_PORT ||  process.env.OPENSHIFT_INTERNAL_PORT || process.env.PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP ||process.env.IP|| '127.0.0.1';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
server.connection({
	host: ip,
	port: port
});
console.log("IP :"+server_ip_address);
console.log("port :"+server_port);
console.log('Server running on http://%s:%s', ip, port);
server.register([require('inert'), require('hapi-error')], function () {

	server.route([
	  { method: 'GET', path: '/', handler: { file: "index.html" } },
		// switch these two routes for a /static handler?
	  { method: 'GET', path: '/client.js', handler: { file: './lib/client.js' } },
		{ method: 'GET', path: '/style.css', handler: { file: './css/style.css' } },
	  { method: 'GET', path: '/bootstrap.min.css', handler: { file: './css/bootstrap.min.css' } }
	]);

	server.start(function () {
		require('./lib/chat').init(server.listener, function(){
			// console.log('REDISCLOUD_URL:', process.env.REDISCLOUD_URL);
			console.log('Feeling Chatty?', 'listening on: http://127.0.0.1:' + 8000);
		});
		
	});

});

module.exports = server;
