//************************ METHOD 1**********

const asyncHandler= (requestHandler)=>{
 return   (res,req,next)=>{
        Promise.resolve(requestHandler(res,req,next)).catch((err)=>next(err))
    }
}


export {asyncHandler}







//***********METHOD 2 ********************
// const asyncHandler  =(fn)=> async(req,res,next) =>{
//     try {await fn(req,res,next)
        
//     } catch (error) {
//         req.status(err.code||500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }  //HIger order function  ()=>()=>{}