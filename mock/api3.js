const Mock=require('mockjs')

let getApi3Data=(req)=>{
	return Mock.mock({
	"total|10-300":1
	})
}


module.exports={
	// 这种写法就是 app.get 这种对象通过key来访分的方式一样 ，app[key],`GET /api3`就是key
	[`GET /api3`](req,res){
		res.status(200).json(getApi3Data(req))
	}
}