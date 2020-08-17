const Mock=require('mockjs')

let getApi1Data=(req)=>{
	return Mock.mock({
	"data|3-10":[{
		"id|+1": 1,
		"title": '@ctitle()',
		"price|100-9999.2": 1.00,
		"sku|6-20": 100
	}]
	})
}


module.exports={
	[`GET /api/getProducts`](req,res){
		res.status(200).json(getApi1Data(req))
	}
}