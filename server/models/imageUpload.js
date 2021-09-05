const db =require('../configuration/config')
exports.imageUpload=(req,res,next)=>{
    const file=req.file;
    console.log(file.filename);
    var imagePath = 'https://marsaapi.herokuapp.com/uploads/' + req.file.filename;
    console.log(res.user);
    db.query('UPDATE utilisateur SET ImageUrl=? WHERE idUser=?',[imagePath,req.user.id],(err,result)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            res.status(200).send(imagePath);
        }
    })

}