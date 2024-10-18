const md5=require('md5')
const jwt=require('jsonwebtoken')
const userModel=require('../models/index').user
const secret='Santai Dulu Ga Sih'

const authenticate=async(req,res)=>{
    let dataLogin={
        email: req.body.email,
        password: md5(req.body.password)
    }
    let dataUser=await userModel.findOne({where: dataLogin})
    if (dataUser) {
        let payload=JSON.stringify(dataUser)
        let token=jwt.sign(payload,secret)
        return res.json({
            success: true,
            logged: true,
            message: 'Authentication Success',
            token: token,
            data: dataUser
        })
    }else{
        return res.json({
            success: false,
            logged: false,
            message: 'Email atau password salah'
        })
    }
}
const authorize=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if (authHeader) {
        const token=authHeader.split(' ')[1];
        let verifiedUser=jwt.verify(token,secret);
        if (!verifiedUser) {
            return res.json({
                success: false,
                auth: false,
                message: 'User Unauthorized'
            })
        }
        req.user=verifiedUser;
        next();
    } else {
        return res.json({
            success: false,
            auth: false,
            message: 'User Unauthorized'
        })
    }
}
module.exports = {authenticate,authorize}