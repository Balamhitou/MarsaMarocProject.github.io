exports.imageUpload=(req,res,next)=>{
    const file=req.file;
    console.log(file.filename);
    res.send(file);
}