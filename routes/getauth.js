const router=require('express').Router();
const verify=require('./verifyToken');

router.get('/',verify,(req,res)=>{
    
    res.send(req.user);
    // res.json({
    //     posts:{
    //         title:"verified token",
    //         description:'not delivered if not verified'
    //     }
    // });
})
module.exports=router;