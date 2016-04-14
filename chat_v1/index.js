// 在 DOMReady 后再开始执行实际代码
$(function() {
  var $chatroom = $('.chat'),
    $lines = $('.lines'),
    $nickname = $('.nickname'),
    $setNickname = $('.set-nickname'),
    $nicknames = $('.nicknames'),
    $messages = $('.messages'),
    $message = $('.message'),
    $nick = $('.nick'),
    $sendMessage = $('.send-message'),
    $to = $('.to'),
    $nicknameErr = $('.nickname-err'), toUser = null, myself = null
  // 如果不传递url参数，Socket.IO会自动探测地址。
  // 通常是生成的类似 /socket.io/1/?t=1371223173600 这样的地址
  var socket = io.connect();

  socket.on('announcement', function(msg) {
    $lines.append($('<p>').append($('<em>').text(msg)))
  })

  socket.on('nicknames', function(nicknames) {
    $nicknames.empty().append($('<span>当前在线: </span>'))
    $.each(nicknames, function (key, val) {
      $nicknames.append($('<b>').text(val))
    })
  })

  function message(from, msg, opt_to) {
    var label
    if (opt_to) {
      label = $('<b>').text(from + '对' + opt_to + '说：')
    } else {
      label = $('<b>').text(from + '：')
    }
    $lines.append($('<p>').append(label, msg))
  }
  
  socket.on('user:pub', message)
  socket.on('user.private', message)
  socket.on('reconnect', function() {
    $lines.remove()
    message('<i>系统消息</i>', '重连了！')
  })

  socket.on('reconnecting', function() {
    message('<i>系统消息</i>', '尝试重连中…')
  })

  socket.on('error', function(e) {
    message('<i>系统消息</i>', e ? e : '未知错误！')
  })

  function clear() {
    $message.val('').focus()
  }
  $setNickname.submit(function(e) {
    socket.emit('nickname', $nick.val(), function(set) {
      if (!set) {
        clear()
        myself = $nick.val()
        $nickname.hide()
        $messages.show()
        $sendMessage.show()
        return
      }
      $nicknameErr.css('visibility', 'visible')
    })
    return false
  })

  $sendMessage.submit(function() {
    if (toUser) {
      message('我对' + toUser + '说', $message.val())
      socket.emit('user:private', $message.val(), toUser)
    } else {
      message('我', $message.val())
      socket.emit('user:pub', $message.val())
    }
    clear()
    $lines.scrollTop(10000000)
    return false
  })
  $nicknames.on('click', 'b', function (e) {
    toUser = $(e.target).text()
    if (toUser === myself) {
      $to.find('b').text('所有人')
      toUser = null
      return
    }

    $to.find('b').text(toUser)
  })

})