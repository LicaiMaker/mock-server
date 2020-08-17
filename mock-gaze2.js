/*
* 该文件用于监听,该文件所在的目录下所有文件/文件夹的事件，包括新增，更改，删除等操作，
* 并使用scp2模块上传到远程服务器，服务器配置请自行更改
* 环境配置：请安装nodejs，以及使用npm安装chokidar，scp2，path三个包
* 启动方法：node mock-gaze2.js即可
*/
const chokidar = require('chokidar');
const path=require('path');
var client = require('scp2')
let log = console.log.bind(console)

// 这里.表示当前目录，如需更改，请自行更换
const watcher = chokidar.watch('.', {
  ignored: ['./node_modules','./.git'], // ignore 
  persistent: true
}); 
// 这里all表示所有事件都监听，如需更改其他的事件，参考连接：https://github.com/paulmillr/chokidar
watcher.on('all', (event, filePath) => {
  // 这里的remotePath表示要上传的服务器路径，前半部分'/home/mock-server'可自行更改
  var remotePath=path.join('/home/mock-server',filePath)
  log(event, filePath);
  uploadFile(filePath,remotePath)  
});

function uploadFile(localPath,remotePath){
	// 这里的地址自行更改成自己的服务器
	client.scp(localPath, 'username:password@ip_address:'+remotePath, function(err) {
		log(`${localPath} 上传成功..`) 
})
}