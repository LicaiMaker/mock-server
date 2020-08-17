// let Client = require('ssh2-sftp-client');
// 实现文件监听的第一种方式，使用gaze模块，
const fs=require('fs');// 引入fs模块
const path=require('path');
let gaze = require('gaze');
var client = require('scp2')
const filepath = '**/*'
console.log(`正在监听${filepath}`) 
const md5 = require('md5')
let preveMd5 = null,fsWait = false
// 首先上传所有的文件(包括文件夹)
console.log('上传中...')
put2('../mock-server','/home/mock-server/')
gaze(filepath,{
	mode:'auto'
	}, 
 function(err,watcher){  
	 let watched = this.watched();
	 //监听文件的变化,可选值all,added,deleted,changed
	 this.on('all', function(event,filename){
	 // 使用md5值对比文件修改前后，过滤掉一些无用的修改，优化
	 if(filename){ 
		var stat = fs.lstatSync(filename);
		var is_direc = stat.isDirectory();// true || false 判断是不是文件夹
		// 获取相对路径
		var remotePath=path.join('/home/mock-server',path.relative(__dirname,filename))
		console.log(remotePath) 
		if(!is_direc){ 
			if(fsWait) return 
			fsWait=setTimeout(()=>{
				fsWait=false
			},100)
			var currentMd5 = md5(fs.readFileSync(filename))
			if(currentMd5==preveMd5){ 
				return
			}
			preveMd5=currentMd5  
			// 做一些操作，前面使用md5排除了一些虚假的修改,比如添加一个字符，又把这个字符删除，实际上没有修改，所以使用md5比较修改前后
			put2(filename,remotePath,true)
		} else{
			//remotePath='/home/'+path.basename(__dirname)
			// false表示上传目录
			put2(filename, remotePath,false)
		}
		console.log(filename + ' was ' + event); 
	 }
	 })
	 
}) 


// 实现文件监听的第二种方式，直接使用fs模块，并使用了md5比对
// 但是有个缺点，就是添加文件和删除文件不能监听到，需要调整一下

// console.log("哈哈哈")
/* const path=require('path');
const fs=require('fs');// 引入fs模块 
const md5 = require('md5')
let preveMd5 = null,fsWait = false
const filepath = './'
console.log(`正在监听${filepath}`)
let watcher=fs.watch(filepath, {encoding:'utf8',recursive:true},(event,filename)=>{
	// console.log(filename) 
	if(filename){
		if(fsWait) return
		fsWait=setTimeout(()=>{
			fsWait=false
		},100)
		var currentMd5 = md5(fs.readFileSync(filepath+filename))
		if(currentMd5==preveMd5){
			return
		}
		preveMd5=currentMd5 
		console.log(`${filename}文件 `+ event) 
	}  
}) */ 

 
// 上传到服务器的方法 
// function put(localPath,romotePath,uploadFile){
    // let sftp = new Client();
    // sftp.connect({
        // host: '81.68.100.80',
        // port: '22',
        // username: 'root',
        // password: 'licaiMaker800@'
    // }).then(() => {
		// if(uploadFile){ 
			// return sftp.fastPut(localPath,romotePath);
		// } else {
			// return sftp.uploadDir(localPath,romotePath);
		// }
        
    // }).then(() =>{
        // console.log("上传完成");
		// sftp.end()
    // }).catch((err) => {
        // console.log(err, 'catch error');
    // })
// }  

// 第二种上传方法
function put2(localPath,remotePath,uploadFile){
	client.scp(localPath, 'root:licaiMaker800@@81.68.100.80:'+remotePath, function(err) {
		console.log(err)
		console.log('上传成功...')
})
}