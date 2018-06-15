
const dics = [
    { typeId: 118, typeName: '企业类型', pTypeId: 0, orderNo: 19, },
    { typeId: 118001, typeName: '大数据', pTypeId: 118, orderNo: 1, },
    { typeId: 118002, typeName: '大健康', pTypeId: 118, orderNo: 2, },
    { typeId: 120, typeName: '产业类别', pTypeId: 0, orderNo: 21, },
    { typeId: 120001, typeName: '一产', pTypeId: 120, orderNo: 1, },
    { typeId: 120002, typeName: '二产', pTypeId: 120, orderNo: 2, },
    { typeId: 120003, typeName: '三产', pTypeId: 120, orderNo: 3, },
    { typeId: 111, typeName: '园区分类（开店区域）', pTypeId: 0, orderNo: 12, },
    { typeId: 111001, typeName: '综合保税区', pTypeId: 111, orderNo: 1, },
    { typeId: 111002, typeName: '高端装备制造园', pTypeId: 111, orderNo: 2, },
    { typeId: 111003, typeName: '大学城', pTypeId: 111, orderNo: 3, },
    { typeId: 111001001, typeName: '龙山工业园', pTypeId: 111001, orderNo: 4, },
    { typeId: 111001002, typeName: '围网内', pTypeId: 111001, orderNo: 5, },
    { typeId: 111001003, typeName: '孵化园', pTypeId: 111001, orderNo: 6, },
    { typeId: 111001004, typeName: '研发产业园', pTypeId: 111001, orderNo: 7, },
    { typeId: 111001005, typeName: '泰豪产业园', pTypeId: 111001, orderNo: 8, },
    { typeId: 111001006, typeName: '富士康产业园', pTypeId: 111001, orderNo: 9, },
    { typeId: 119, typeName: '行业分类', pTypeId: 0, orderNo: 20, },
    { typeId: 119001, typeName: '农、林、牧、渔业', pTypeId: 119, orderNo: 1, },
    { typeId: 119002, typeName: '采矿业', pTypeId: 119, orderNo: 2, },
    { typeId: 119003, typeName: '制造业', pTypeId: 119, orderNo: 3, },
    { typeId: 119004, typeName: '电力、热力、燃气及水生产和供应业', pTypeId: 119, orderNo: 4, },
    { typeId: 119005, typeName: '建筑业', pTypeId: 119, orderNo: 5, },
    { typeId: 119006, typeName: '批发和零售业', pTypeId: 119, orderNo: 6, },
    { typeId: 119007, typeName: '交通运输、仓储和邮政业', pTypeId: 119, orderNo: 7, },
    { typeId: 119008, typeName: '住宿和餐饮业', pTypeId: 119, orderNo: 8, },
    { typeId: 119009, typeName: '信息传输、软件和信息技术服务业', pTypeId: 119, orderNo: 9, },
    { typeId: 119010, typeName: '金融业', pTypeId: 119, orderNo: 10, },
    { typeId: 119011, typeName: '房地产业', pTypeId: 119, orderNo: 11, },
    { typeId: 119012, typeName: '租赁和商务服务', pTypeId: 119, orderNo: 12, },
    { typeId: 119013, typeName: '科学研究和技术服务业', pTypeId: 119, orderNo: 13, },
    { typeId: 119014, typeName: '水利、环境和公共设施管理业', pTypeId: 119, orderNo: 14, },
    { typeId: 119015, typeName: '居民服务、修理和其他服务业', pTypeId: 119, orderNo: 15, },
    { typeId: 119016, typeName: '教育', pTypeId: 119, orderNo: 16, },
    { typeId: 121, typeName: '企业实际经营情况', pTypeId: 0, orderNo: 22, },
    { typeId: 121001, typeName: '投产', pTypeId: 121, orderNo: 1, },
    { typeId: 121002, typeName: '停产', pTypeId: 121, orderNo: 2, },
    { typeId: 121003, typeName: '间歇停产', pTypeId: 121, orderNo: 3, },
]

const myExport = {
    'GET /api/v1/dicList'(req, res) {
        setTimeout(() => {
            res.json({
                "retCode":{
                    "status":"0000"
                },
                "data":[
                    {
                        "typeId":103001,
                        "typeName":"女",
                        "pTypeId":103,
                        "orderNo":2
                    },
                    {
                        "typeId":103002,
                        "typeName":"男",
                        "pTypeId":103,
                        "orderNo":1
                    },
                    {
                        "typeId":111001,
                        "typeName":"城南新区规划库管理",
                        "pTypeId":102,
                        "orderNo":1
                    },
                    {
                        "typeId":104001,
                        "typeName":"园区员工",
                        "pTypeId":104,
                        "orderNo":1
                    },
                    {
                        "typeId":104003,
                        "typeName":"个人用户",
                        "pTypeId":104,
                        "orderNo":3
                    },
                    {
                        "typeId":102,
                        "typeName":"系统名称",
                        "pTypeId":0,
                        "orderNo":3
                    },
                    {
                        "typeId":103,
                        "typeName":"性别",
                        "pTypeId":0,
                        "orderNo":4
                    },
                    {
                        "typeId":105,
                        "typeName":"业务类型（流程ID）",
                        "pTypeId":0,
                        "orderNo":6
                    },
                    {
                        "typeId":104,
                        "typeName":"用户类型",
                        "pTypeId":0,
                        "orderNo":5
                    },
                    {
                        "typeId":106,
                        "typeName":"是否",
                        "pTypeId":0,
                        "orderNo":7
                    },
                    {
                        "typeId":104002,
                        "typeName":"店铺人员",
                        "pTypeId":104,
                        "orderNo":2
                    },
                    {
                        "typeId":101,
                        "typeName":"状态",
                        "pTypeId":0,
                        "orderNo":2
                    },
                    {
                        "typeId":101001,
                        "typeName":"启用（提交）",
                        "pTypeId":101,
                        "orderNo":1
                    },
                    {
                        "typeId":101002,
                        "typeName":"冻结",
                        "pTypeId":101,
                        "orderNo":2
                    },
                    {
                        "typeId":101003,
                        "typeName":"已删除",
                        "pTypeId":101,
                        "orderNo":3
                    },
                    {
                        "typeId":101004,
                        "typeName":"暂存",
                        "pTypeId":101,
                        "orderNo":4
                    }
                ]
            });
        }, 200);
    }
}

export default myExport;