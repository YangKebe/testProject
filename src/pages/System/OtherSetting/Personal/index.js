import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, TreeSelect } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData, { getSelectionsByPid, getDicNameById, getSelectionsTreeByPid, getTreePathByPid } from '/project.config';
import colConfig from './config.json';
import ChangePassword from '/components/PasswordChange';


// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

class DetaiPage extends React.PureComponent {

  componentWillMount() {
    this.props.dispatch({
      type: `${colConfig.pageTag}/goToDetail`,
      payload: {
        userId: globalData.userId,
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newValues = {};

        Object.keys(values).forEach(key => {
          const config = colConfig.fieldInfo[key];
          newValues[key] = values[key];
          if (config.dataType === '日期') {
            newValues[key] = values[key].format("YYYY-MM-DD");
          }
          else if (config.dataType === '时间') {
            newValues[key] = values[key].format("YYYY-MM-DD HH:mm:ss");
          }
          else if (config.controlType === '下拉列表-级联') {
            newValues[key] = values[key].length && values[key][values[key].length - 1] || 0;
          }
        });

        newValues = {
          ...this.props.curDetail,
          ...newValues,
          operator: globalData.userId,
          roleId: '111001002',
        }


        this.props.dispatch({
          type: `${colConfig.pageTag}/modifyRecord`,
          payload: {
            newValues,
            pathname: this.props.location.pathname,
          }
        });

      }
    });
  }


  /**
   * 生成下拉选项
   * @param {*可以为带typeId和typeName属性的数组，也可以是,分隔的字符串} option 
   */
  GetOption(option, typeIsNumber = true) {
    let arr;
    if (!Array.isArray(option)) {
      arr = option.split(',').map(the => {
        const tempArr = the.split('|');
        return {
          typeId: typeIsNumber ? Number(tempArr[0]) : tempArr[0],
          typeName: tempArr.length > 0 ? tempArr[1] : tempArr[0],
        }
      });
    } else {
      arr = option;
    }
    return arr.map(
      optionValue => {
        const value = optionValue.typeId;
        const displayName = optionValue.typeName;
        return (<Select.Option value={value} key={Math.random()} style={{ height: '32px' }}>
          {displayName}
        </Select.Option>)
      }
    );
  }


  //修改密码
  amendPassword = (userId, oldPwd, newPwd) => {
    this.props.dispatch({
      type: `${colConfig.pageTag}/queryPasswordModifyEffect`,
      payload: {
        userId: userId,
        oldPassword: oldPwd,
        newPassword: newPwd,
        operator: globalData.userId
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;

    return (

      <div>
        <MyBreadcrumb itemList={['系统管理', '其他设置', '个人信息']} >
          <ChangePassword
            icon="edit"
            style={{ margin: '5px' }}
            myClick={() => globalData.userId}
            onOk={(userId, oldPwd, newPwd) => {
              this.amendPassword(userId, oldPwd, newPwd);
            }}
          />

          <Button
            key='btnAdd'
            style={{ marginLeft: '5px' }}
            type="primary"
            icon="upload"
            onClick={this.handleSubmit}>
            提交</Button>
        </MyBreadcrumb>

        <Form>

          <OpenFormItemGroup title='用户信息'>
            <FormItem key='userId' colSpans={1} label='用户账号'>
              {getFieldDecorator('userId', { initialValue: '', rules: [{ required: false, min: 1, max: 100, message: '请正确填写用户账号' }], })(
                <Input id='userId' disabled={true}/>
              )}
            </FormItem>
            <FormItem key='userName' colSpans={1} label='用户姓名'>
              {getFieldDecorator('userName', { initialValue: '', rules: [{ required: false, min: 1, max: 100, message: '请正确填写用户姓名' }], })(
                <Input id='userName' disabled={true}/>
              )}
            </FormItem>
            <FormItem key='mobilePhone' colSpans={1} label='手机号码'>
              {getFieldDecorator('mobilePhone', { initialValue: '', rules: [{ required: false, max: 12, message: '请正确填写移动电话' }], })(
                <Input id='mobilePhone' />
              )}
            </FormItem>
            <FormItem key='sex' colSpans={1} label='性别'>
              {getFieldDecorator('sex', { initialValue: '', rules: [{ required: false, message: '请正确填写性别' }], })(
                <Select id='sex' allowClear={true}>
                  {this.GetOption(getSelectionsByPid(103))}
                </Select>
              )}
            </FormItem>
            <FormItem key='email' colSpans={1} label='邮箱'>
              {getFieldDecorator('email', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写邮箱' }], })(
                <Input id='email' />
              )}
            </FormItem>
          </OpenFormItemGroup>

        </Form>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    curDetail: state[colConfig.pageTag].curDetail,
  };
}

const WrappedDetailPage = Form.create({

  mapPropsToFields: props => {

    let obj = {};
    for (let key in props.curDetail) {
      const config = colConfig.fieldInfo[key];
      if (!config) continue;
      if (config.dataType === '日期' || config.dataType === '时间') {
        obj[key] = Form.createFormField({
          key,
          value: moment(props.curDetail[key])
        })
      }
      else if (config.controlType === '下拉列表-级联') {
        obj[key] = Form.createFormField({
          key,
          value: getTreePathByPid(props.curDetail[key])
        })
      }
      else {
        obj[key] = Form.createFormField({
          key,
          value: props.curDetail[key]
        })
      }

    }

    return obj;

  }
})(DetaiPage);

export default connect(mapStateToProps)(WrappedDetailPage);
