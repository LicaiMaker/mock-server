const path=require('path');
const fs=require('fs');// 引入fs模块
const express=require('express');// 引入express模块
const bodyParser=require('body-parser');// body-parser中间件解析post请求

const app=express();
const mockData={};// mock数据

// www-form-urlencoded
// app.use(bodyparser.urlencoded({
	// extended:true
// }));

// application/json
app.use(bodyParser.json());

// const crossDomain = () => (req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // if (req.method === 'OPTIONS') res.status(200) // 让OPTIONS快速返回
  // next();
// }
// app.use(crossDomain())

// 判断是否是文件夹
function isFileExists(filePath){
	const stat=fs.lstatSync(filePath)
	return stat.isDirectory()
}


// 读取mock目录下的所有文件，组装mockData 
function readMockDir(dir){
	fs.readdirSync(dir).forEach(function (file){
		let _path = path.join(dir+'/'+file)
		if(isFileExists(_path)){
			readMockDir(_path)
		}else(
			Object.assign(mockData,require(_path))
		)
	})
}
readMockDir(path.join(__dirname+'/mock')) // 这些文件都放在了mock目录下

for(let key in mockData){
	let _key=key.replace(/(^\s*)|(\s*$)/g,'');// 替换空格
	let _method='get';
	// 将方法名赋给_method,并将方法名去掉的字符串赋给_url
	let _url=_key.replace(/^(get|post|delete|put)\s*/i,function(rs,$1){
		_method=$1.toLowerCase();
		return '';
	})
	// 这种写法就是 app.get 这种对象通过key来访分的方式一样，app[key]
	app[_method](_url,mockData[key])
	
	
}

app.listen('8090',function(){
	console.log("Mock Server is running at http://localhost:8090")
});