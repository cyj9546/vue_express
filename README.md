# 资金后台管理系统(vue+express)

## 描述

写这个项目主要是为了学习下element这个UI框架

## 主要技术栈

VueCli3.0

vue-router

vuex

axios

element-ui

node.js

express

mongodb

### 跨域相关

前端用了代理的方式实现跨域

```
    devServer: {
        open: true,
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                target: 'http://localhost:3000/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => { }
    }
```



### 路由拦截

```
// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
    endLoading()
    return response
}, error => {
    // 错误提醒
    endLoading()
  //  Message.error(error.response.data)
    const { status } = error.response
    if (status == 401) {
        Message.error('token值无效，请重新登录')
        // 清除token
        localStorage.removeItem('eleToken')

        // 页面跳转
        router.push('/login')
    }
    return Promise.reject(error)
})
```

```
//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})
```



### 设置请求头



```
// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
    // 加载
    startLoading()
    if (localStorage.eleToken)
        config.headers.Authorization = localStorage.eleToken
    return config
}, error => {
    return Promise.reject(error)
})
```

### 数据库连接

```
//  连接数据库
const mongoose =require('mongoose')
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true });

//连接数据库
var db = mongoose.connection;//数据库的连接对象
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db ok')
});
```

### jwt实现token

安装jwt

```
npm install jsonwebtoken
```

安装bcrypt

```
npm install bcrypt
```

密码加密

```
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
```

密码匹配返回token

```
      // 密码匹配
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
        //加密规则
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
        } else {
          return res.send({status:400,msg:"密码错误!"});
        }
      });
```

passport验证token

安装 passport

```
npm install passport-jwt passport

```

验证 token

```
 passport.authenticate('jwt', { session: false }),

```
![预览](https://github.com/cyj9546/vue_express/blob/master/screenshot/Snipaste_2019-12-11_19-19-31.png)


![预览](https://github.com/cyj9546/vue_express/blob/master/screenshot/Snipaste_2019-12-11_20-34-13.png)


