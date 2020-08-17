const Mock=require('mockjs')

let getApi1Data=(req)=>{
	return Mock.mock({
	"list|2-5":[{
		"name|1":"@name()",
		"id|+1":1,
		"isMale|1":true 
	}]
	}) 
}  
  

module.exports={
	[`GET /api2`](req,res){
		res.status(200).json(getApi1Data(req))
	}
}