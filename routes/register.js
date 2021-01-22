var express = require('express');
var multer = require('multer');
var router = express.Router();
var registerSchema = require('../model/register');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
})

var fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

var upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});


router.get('/register', async function(req, res, next) {
    try{
        var records = await registerSchema.find();
        res.json(records);
    }catch(err){
        res.send('Error' + err)
    }
});



router.post("/register", async function(req,res,next){
    const { name , email ,phone, image, password } = req.body;
    try {
        var record = await new registerSchema({
            name: name,
            email: email,
            phone: phone,
            image: image,
            password : password
            
        });

        record.save();
        if(record){
            res.status(200).json({ IsSuccess: true , Data: record , Message: "User Register" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess : false , Message: error.message });
    }
});

router.post('/login', async function(req,res,next) {
    try {
        const record = await registerSchema.find({ phone: req.body.phone});

        if(record.length > 0){
            res.status(200).json({ IsSuccess: true, Data: record , Message: "Login successful!!!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0 , Message: "User Not Found!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess : false , Message: error.message });   
    }
});

router.post('/upload', upload.single('image'), async(req, res) => {
    const { name , email ,phone, password } = req.body;
    var fileinfo = req.file;
    try {
        var record = await new registerSchema({
            name: name,
            email: email,
            phone: phone,
            password : password,
            image: fileinfo == undefined ? " " : fileinfo.path,
        });
        record.save();
        
        // let a = fileinfo == undefined ? " " : fileinfo.path;
        // console.log(a);
        if(record){
            res.status(200).json({ IsSuccess: true, Data: record, Message: 'File uplaoded' });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: 'File undefined' });
        }
        
    }catch(error){
        res.status(500).json({ Message: error.message });
    }

});

module.exports = router;
 