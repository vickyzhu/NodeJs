var http = require('http')
var fs = require('fs')


var connect = require('connect');
var app = connect.createServer(
  // 挂载当前文件所在目录
  connect.static(__dirname)
).listen(8080);
console.log("listening at the port 8080");


var sio = require('socket.io')
var io = sio.listen(app),
  // 我们的程序没有引入后端存储层，因此在程序运行期间直接将所有用户保存在内存里面
  nicknames = {}, onlines = {}

io.sockets.on('connection', function(socket) {
  socket.on('user:pub', function(msg) {
    socket.broadcast.emit('user:pub', socket.nickname, msg)
  })
  socket.on('user:private', function (msg, to) {
    if(onlines[to]) {
      // console.log("onlines[to]:"+onlines[to]);
      onlines[to].emit('user.private', socket.nickname, msg, to)
    }
  })

  socket.on('nickname', function(nick, fn) {
    // fn用于确认是否登录聊天室成功了，true表示有相同昵称的用户已经进入
    if (nicknames[nick]) {
      fn(true)
    } else {
      fn(false)
      nicknames[nick] = socket.nickname = nick
      onlines[nick] = socket
      socket.broadcast.emit('announcement', nick + ' 已连接')
      // socket.broadcast.emit('nicknames', nicknames);
      io.sockets.emit('nicknames', nicknames)
    }
  })

  socket.on('disconnect', function() {

    if (!socket.nickname) {
      return
    }

    delete nicknames[socket.nickname];
    delete onlines[socket.nickname]
    // 广播“我”已经离开聊天室了，并更新在线列表
    socket.broadcast.emit('announcement', socket.nickname + ' 断开连接了')
    socket.broadcast.emit('nicknames', nicknames)
  })
})