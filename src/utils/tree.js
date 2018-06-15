import lodash from 'lodash';

/**
 * 从URL中解析参数值
 * @param   {String}  参数名
 * @return  {String}  参数值
 */

export const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
};

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export const queryArray = (array, key, keyAlias = 'key') => {

  debugger;

  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
};

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {Array}     idsHasLeaf
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTree = (array, idsHasLeaf, id = 'id', pid = 'parent_id', children = 'children') => {
  let result = [];
  if(array) {
    let data = lodash.cloneDeep(array);
    let hash = {};
    data.forEach((item, index) => {
      hash[data[index][id]] = data[index]
    });

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
  return result
};

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {Array}     idsHasLeaf
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTreeToRoleList = (array, idsHasLeaf, roleId = 'roleId', pRoleId = 'pRoleId', children = 'children') => {
  let data = lodash.cloneDeep(array);
  let result = [];
  let hash = {};
  data.map((item, index) => {
    hash[data[index][roleId]] = data[index]
  });

  data.forEach(item => {
    let hashVP = hash[item[pRoleId]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []) && idsHasLeaf && idsHasLeaf.push(hashVP[roleId]);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result
};


