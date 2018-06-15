import qs from 'qs';
import tableMockConfig from './tableConfig.json';
import mockjs from 'mockjs';  //导入mock.js的模块
const Random = mockjs.Random;  //导入mock.js的随机数

let tableMockData = {};

let exportObj = {};
let mockTag = 'api'

const dataNumber = 10;

/**
 * 支持的类型：boolean, integer, float, word,title,cword,ctitle, date, time, datetime,name,cName,email,url,area,reagion
 */
Object.keys(tableMockConfig).forEach(key => {
    //生成随机的表格数据
    tableMockData[key] = [];
    const thisConfig = tableMockConfig[key];
    for (let index = 0; index < dataNumber; index++) {
        let tempRecord = {};
        Object.keys(thisConfig.valueFormat).forEach(colKey => {
            const egValue = thisConfig.valueFormat[colKey];
            let rndValue = egValue;
            if (rndValue === 'guid') {
                rndValue = Random.guid();
            }
            else if (typeof rndValue === 'string' && egValue.endsWith('|+')) {
                rndValue = egValue.substr(0, egValue.length - 2) + index;
            }
            else if (typeof rndValue === 'string' && egValue.includes(',')) {
                rndValue = Random.pick(egValue.split(','));
            }
            tempRecord[colKey] = egValue === 'pKey' ? Random.guid() : rndValue;
        });
        tableMockData[key].push(tempRecord);
    };

    // global.tableMockData = tableMockData;

    //生成接口-查询
    let apiKey = `GET /${mockTag}/${key}/query`;
    exportObj[apiKey] = function (req, res) {
        // const param = qs.parse(req.query);
        // let menuType = param.menuType;

        let newData = tableMockData[key].concat();
        setTimeout(() => {
            res.json({      //将请求json格式返回
                success: true,
                data: {
                    resultList: newData,
                    totalRecord: newData.length,
                },
            });
        }, 200);
    };

    //生成接口-删除
    apiKey = `POST /${mockTag}/${key}/delete`;
    exportObj[apiKey] = function (req, res) {
        if (req.body && req.body.keys) {
            let arr = req.body.keys.split(',');
            const pKey = tableMockConfig[key].pKey;
            tableMockData[key] = tableMockData[key].filter(the => !arr.includes(the[pKey]))
        }
        setTimeout(() => {
            res.json({      //将请求json格式返回
                retCode: {
                    status: '0000'
                }
            });
        }, 200);
    };
});
export default exportObj;
