const Mock=require('mockjs')

let settle=(req)=>{
	return Mock.mock({
	"data|1": true // 50%概率为true或false 
	})
}


module.exports={
	[`POST /api/settle`](req,res){
		res.status(200).json(settle(req))
	}
}