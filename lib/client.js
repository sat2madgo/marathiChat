'use strict';

 /* global $ io Cookies */
var socket= io(); // initialise socket.io connection;
function cancelChat(){
  if(socket.disconnected)
  {
    socket.connect();
    socket.emit('io:name', "sTRANGER");
    $("#c").prop("disabled",true).removeClass("btn-success").text("Cancel");
    $("#messages").html("");
    $("#m").attr("placeholder","Waiting For MCian to Join...");
  }
  else{
    socket.disconnect();

  }
  return false;
}

function disconnectHandler (socket) {
  $(".form-control").prop("disabled",true);
  $("#c").prop("disabled",false).addClass("btn-success").text("Start");
  $("#m").attr("placeholder","Disconnected. Click Start to find new MCian.");
  console.log('Got disconnect!');

}
$(document).ready(function () {
socket.on('disconnect', disconnectHandler);
  $("#chalu").click(function(){
  socket.emit('io:name', "sTRANGER");
        //getName();
        //  loadMessages();
          $("#welcome").hide('slow');
          $("#mainChat").show('slow');
  });


  function getName () {
    // prompt for person's name before allowing to post
    var name = Cookies.get('sid');

    if (!name || name === 'null') {
      name = window.prompt('What is your name/handle?'); // eslint-disable-line
      Cookies.set('name', name);
    }
    socket.emit('io:name', name);
    $('#m').focus(); // focus cursor on the message input

    return name;
  }

  function leadZero (number) {
    return (number < 10) ? '0' + number : number;
  }

  function getTime (timestamp) {
    var t, h, m, s;

    t = new Date(timestamp);
    h = leadZero(t.getHours());
    m = leadZero(t.getMinutes());
    s = leadZero(t.getSeconds());

    return String(h) + ':' + m + ':' + s;
  }

  /**
   * renders messages to the DOM. nothing fancy. want fancy? ask!
   * @param {String} message - the message (stringified object) to be displayed.
   * @returns {Boolean} false;
   */
  function renderMessage (message) {
    var msg = JSON.parse(message);
    var html = '<li class=\'row\'>';

    html += '<small class=\'time\'>' + getTime(msg.t) + ' </small>';
    html += '<span class=\'name\'>' + msg.n + ': </span>';
    html += '<span class=\'msg\'>' + msg.m + '</span>';
    html += '</li>';
    $('#messages').append(html);  // append to list
  }

  $('form').submit(function () {
    var msg;
msg = $('#m').val();
    // if input is empty or white space do not send message
    if (msg.match(/^[\s]*$/) !== null) {
      $('#m').val('');
      $('#m').attr('placeholder', 'please enter your message here');
      return false;
    }

    socket.emit('io:message', msg);
    $('#m').val(''); // clear message form ready for next/new message
    $('#m').attr('placeholder', ''); // clears placeholder once a msg is successfully sent
/*
    if (!Cookies.get('name') || Cookies.get('name').length < 1
      || Cookies.get('name') === 'null') {
      getName();
    } else {
      msg = $('#m').val();
      socket.emit('io:message', msg);
      $('#m').val(''); // clear message form ready for next/new message
      $('#m').attr('placeholder', ''); // clears placeholder once a msg is successfully sent
    }
*/
    return false;
  });

  // keeps latest message at the bottom of the screen
  // http://stackoverflow.com/a/11910887/2870306
  function scrollToBottom () {
    $(window).scrollTop($('#messages').height());
  }

  window.onresize = function () {
    scrollToBottom();
  };

  socket.on('chat:messages:latest', function (msg) {
    // console.log('>> ' + msg);
    renderMessage(msg);
    scrollToBottom();
  });

  socket.on('chat:people:new', function (name) {
    $('#joiners').show();
    $('#joined').text(name);
    $(".form-control").prop("disabled",false);
    $("#m").attr("placeholder","Type your message here");
    $('#joiners').fadeOut(5000);
  });



  function loadMessages () {
    $.get('/load', function (data) {
      // console.log(data);
      data.forEach(function (msg) {
        renderMessage(msg);
      });
      scrollToBottom();
    });
  }

});
