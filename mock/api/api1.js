const Mock=require('mockjs')

let getApi1Data=(req)=>{
	return Mock.mock({
	"data|1-9":[{
		"name|5-8":/[a-zA-Z]/,
		"id|+1":1,
		"value|0-400":0 
	}]
	}) 
}  
  

module.exports={
	[`GET /api1`](req,res){
		res.status(200).json(getApi1Data(req))
	}
}