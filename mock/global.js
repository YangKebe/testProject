import qs from 'qs';
// import mockjs from 'mockjs';  //导入mock.js的模块

const myExport = {
    'POST /api/security/loginByToken': (req, res) => {
        setTimeout(() => {
            res.json({
                "retCode":{
                    "status":"0000"
                },
                "data":{
                    "userModel":{
                        "userId":"testfb1",
                        "userName":"分包",
                        "userType":"104004",
                        "orgId":"001",
                        "orgName":"江苏省邮电规划设计院"
                    },
                    "token":"a0929fa0-87ab-460d-9cff-e768e0048959"
                }
            });
        }, 2000);
    },
    'POST /api/login/account': (req, res) => {
        setTimeout(() => {
            res.json({      //将请求json格式返回
                status: 'ok',
            });
        }, 1000);
    },
};

export default myExport;