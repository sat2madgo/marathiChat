'use strict';

//var pub = require('redis-connection')();
//var sub = require('redis-connection')('subscriber');
var handleError = require('hapi-error').handleError; // libraries.io/npm/hapi-error

var SocketIO = require('socket.io');
var io;
var users=new Array();
var users3=new Array();
var sidA="";
var sidB="";
// please see: .
function sanitise (text) {
  var sanitised_text = text;

  /* istanbul ignore else */
  if (text.indexOf('<') > -1 /* istanbul ignore next */
     || text.indexOf('>') > -1) {
    sanitised_text = text.replace(/</g, '&lt').replace(/>/g, '&gt');
  }

  return sanitised_text;
}
function disconnectHandler (socket) {
  if(users[this.client.conn.id]!=null)
  {
    users[this.client.conn.id].reciever.disconnect();
    users[this.client.conn.id].sender.disconnect();
      users[this.client.conn.id]=null;
  }
  console.log('Got disconnect!');

}

function chatHandler (socket) {
  // welcome new clients
  socket.emit('io:welcome', 'hi!');
  socket.on('disconnect', disconnectHandler);
  socket.on('io:name', function (name) {
    //pub.hset('people', socket.client.conn.id, name);
     //console.log(socket.client.conn.id + " > " + name + ' joined chat!');

  if(users3.length>0)
  {
    var user=users3.pop();
    users[socket.client.conn.id]={sender:socket,reciever:user};
    users[user.client.conn.id ]={sender:user,reciever:socket};
    socket.emit('chat:people:new',"Stranger");
    user.emit('chat:people:new',"Stranger");
    console.log("Current : "+socket.client.conn.id);
console.log("user : "+user.client.conn.id);
setTimeout(function(){

  var str2 = JSON.stringify({ // store each message as a JSON object
    m: "Pratik Chutya Ahe",
    t: new Date().getTime(),
    n: "Admin"
  });


  socket.emit('chat:messages:latest',str2);
  user.emit('chat:messages:latest',str2);
},10000);
  }else {
    users3.push(socket);
    console.log("User 3 len : "+ users3.length);
  }

  /*
     if(name=="a")
     {

      // pub.publish('chat:people:new', name);
       if(sidA=="")
       {
         sidA=socket;
       }
       if(sidB!="")
       {
           sidB.emit('chat:people:new',name); // relay to all connected socket.io clients

       }
       console.log(io.clients.length);

     }
     else {
       if(sidB=="")
       {
         sidB=socket;
       }
       if(sidA!="")
       {
           sidA.emit('chat:people:new',name); // relay to all connected socket.io clients

       }
       console.log(io.clients.length);*/
    //   pub.publish('chat:people:new', name);

     //}
  });

  socket.on('io:message', function (msg) {
    // console.log('msg:', msg);
    var sanitised_message = sanitise(msg);
    var str,str2;
    str = JSON.stringify({ // store each message as a JSON object
      m: sanitised_message,
      t: new Date().getTime(),
      n: "Stranger"
    });
    str2 = JSON.stringify({ // store each message as a JSON object
      m: sanitised_message,
      t: new Date().getTime(),
      n: "You"
    });
    console.log("In MSG : "+this.client.conn.id);
    users[this.client.conn.id].reciever.emit('chat:messages:latest',str);
  users[this.client.conn.id].sender.emit('chat:messages:latest',str2);
  /*
    if(sidA!=this)
    {
        sidA.emit('chat:messages:latest',str); // relay to all connected socket.io clients

    }else {
      sidB.emit('chat:messages:latest',str);
    }

    pub.hget('people', socket.client.conn.id, function (error, name) {
      // see: https://github.com/dwyl/hapi-error#handleerror-everywhere
      handleError(error, 'Error retrieving '
        + socket.client.conn.id + ' from Redis :-( for: ' + sanitised_message);
      // console.log("io:message received: " + msg + " | from: " + name);

console.log(str);


if(name=="a"){
      pub.publish('chat1:messages:latest', str);  // latest message
}else{
      pub.publish('chat:messages:latest', str);  // latest message
}
//      pub.rpush('chat:messages', str);   // chat history


    });
    */
  });

  /* istanbul ignore next */
  socket.on('error', function (error) {
    handleError(error, error.stack);
  });
  // how should we TEST socket.io error? (suggestions please!)
}


/**
 * chat is our Public interface
 * @param {object} listener [required] - the http/hapi server object.
 * @param {function} callback - called once the socket server is running.
 * @returns {function} - returns the callback after 300ms (ample boot time)
 */
function init (listener, callback) {
  // setup redis pub/sub independently of any socket.io connections
  io = SocketIO.listen(listener);
  io.on('connection', chatHandler);




/*

  pub.on('ready', function () {
    // console.log("PUB Ready!");
    sub.on('ready', function () {
      sub.subscribe('chat:messages:latest', 'chat:people:new');
      // now start the socket.io
      io = SocketIO.listen(listener);
      io.on('connection', chatHandler);
      // Here's where all Redis messages get relayed to Socket.io clients
      sub.on('message', function (channel, message) {
         console.log(channel + ' : ' + message);
        io.emit(channel, message); // relay to all connected socket.io clients
      });

      return setTimeout(function () {
        return callback();
        console.log("In callback");
      }, 300); // wait for socket to boot
    });
  });
  */
}

module.exports = {
  init: init//,
 // pub: pub,
//  sub: sub
};
