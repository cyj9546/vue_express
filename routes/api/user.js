const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../db/models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/key')
router.get("/test",(req,res)=>{
    res.json({msg:'login works'})
})



router.post("/register",(req,res)=>{
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.send({status:400,msg:"邮箱已被注册"});
        } else {
          const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });
    
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password,
            identity: req.body.identity
          });
    
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
    
              newUser.password = hash;
    
              newUser
                .save()
                .then(user => res.json({status:200,msg:user}))
                .catch(err => console.log(err));
            });
          });
        }
      });
    });

// @route  POST api/users/login
// @desc   返回token jwt passport
// @access public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    console.log('email :', email);
    console.log('password :', password);
    User.findOne({ email }).then(user => {
      if (!user) {
        console.log('user :', user);
        return res.send({status:500,msg:'用户不存在'});
      }
  
      // 密码匹配
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const rule = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            identity: user.identity
          };
          jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
              status:200,
              success: true,
              token: 'Bearer ' + token
            });
          });
          // res.json({msg:"success"});
        } else {
          return res.send({status:400,msg:"密码错误!"});
        }
      });
    });
  });
  
  // @route  GET api/users/current
  // @desc   return current user
  // @access Private
  router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
      });
    }
  );

module.exports = router