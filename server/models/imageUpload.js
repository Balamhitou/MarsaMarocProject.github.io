const db =require('../configuration/config')
const fs=require('fs');

const path=require('path')
exports.imageUpload=(req,res,next)=>{
    const ancien=req.body.ancien;
    const file=req.file;
    let newPath=ancien.replace("https://marsaapi.herokuapp.com/",'public/');
    let nnPath=path.resolve(__dirname+"../../../"+newPath);
    

        fs.unlink(path.resolve(nnPath),(err)=>{
            console.log(err);
        })



    var imagePath = 'https://marsaapi.herokuapp.com/uploads/' + req.file.filename;
    console.log(res.user);
    db.query('UPDATE utilisateur SET ImageUrl=? WHERE idUser=?',[imagePath,req.user.id],(err,result)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            res.status(200).json({"url":imagePath});
        }
    })

}