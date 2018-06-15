import lodash from 'lodash';

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {Array}     idsHasLeaf
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTree = (array, idsHasLeaf, id = 'id', pid = 'pId', children = 'children', addPath = false) => {
    let result = [];
    if (array) {
        let data = lodash.cloneDeep(array);
        let hash = {};
        data.forEach(item => hash[item[id]] = item);
        data.forEach((item) => {
            let hashVP = hash[item[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []) && idsHasLeaf && idsHasLeaf.push(hashVP[id]);
                hashVP[children].push(item);
            } else {
                result.push(item);
            }
        });
    }
    return addPath ? pathToTree(result, [], id, pid, children) : result;
};

/**
 * 为数对象增加path属性
 * @param {*} treeData 
 * @param {*} fPath 父节点的path属性
 * @param {*} id 
 * @param {*} pid 
 * @param {*} children 
 */
export function pathToTree(treeData, fPath = [], id = 'id', pid = 'pId', children = 'children') {
    treeData.forEach(the => {
        !the['treePath'] && (the['treePath'] = []);

        the['treePath'] = the['treePath'].concat(fPath);

        if (the[children]) {
            let newPathArr = [...the['treePath'], the[id]];
            pathToTree(the[children], newPathArr, id, pid, children);
        }
    });
    return treeData;
}