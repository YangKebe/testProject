import moment from 'moment';
import { Select, Radio, Button } from 'antd';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === '4month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).subtract(4, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`), moment(moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

export function strEndWith(str, value) {
  let pos = str.lastIndexOf(value);
  if (pos === -1) {
    return false;
  } else {
    return pos + value.length === str.length;
  }
}

export function getOption(options) {
  return options.map((item, index) =>
    <Select.Option value={item.value} key={index}>{item.lable}</Select.Option>
  );
}

export function getRadio(options) {
  return options.map((item, index) =>
    <Radio value={item.value} key={index}>{item.lable}</Radio>
  );
}

/**
 * form验证输入内容
 * @param value 输入的值
 * @param callback 回调
 * @param type 类型
 * @param massage 提示信息
 */
export function checkValue(value, callback, type, massage = '请输入正确内容') {
  let reg = '';
  //正则用//包起来
  if (type === 'tel') {
    reg = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/;
  } else if (type === 'idCardNo') {
    reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
  } else if (type === 'money') {
    reg = /^(^\d+$)|(^\d+(\.\d+)?$)/
  }

  if (value) {
    //react使用正则表达式变量的test方法进行校验，直接使用value.match(regex)显示match未定义
    if (reg.test(value)) {
      callback();
    } else {
      callback(massage);
    }
  } else {
    //这里的callback函数会报错
    callback();
  }
}

export function getStateListSelect(stateList) {
  let result = [];
  if (stateList) {
    result=stateList.map(
      (item, index) => <Select.Option value={item.nodeId} key={index}>{item.nodeName}</Select.Option>
    );
  return result;
  }
}

export function getShowBnt(bntList, bntOnClick, style = { marginLeft: '5px' }) {
  let result = [];
  if (bntList) {
    result = bntList.map((item, index) =>
      <Button
        style={style}
        type="primary"
        key={index}
        onClick={() => bntOnClick(item)}>
        {item.nodeAliasName + item.handleType}
      </Button>
    )
    return result;
  }
}


    /* indexClass规划指标转成中文 */
  export function indexClassConvertCh(indexClass){
      if(indexClass === '1') {
          return '规划指标';
      }else if(indexClass === '2') {
          return '实施指标';
      }else return indexClass;
  }


  /* indexClass规划指标转成数字 */
  export function indexClassConvertNum(indexClass){
      if(indexClass === '规划指标') {
          return '1';
      }else if(indexClass === '实施指标') {
          return '2';
      }else return indexClass;
  }


