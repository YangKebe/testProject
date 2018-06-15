import React from 'react';
import { connect } from 'dva';
import MyBreadcrumb from '/components/MyBreadcrumb';
import { Input, Button, Modal, message, Row, Col, Form } from 'antd';
import colConfig from './config.json';
import globalData from "/project.config";
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import globalConfig from '/project.config.json';


const FormItem = Form.Item;

const getNowFormatDate = () => {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}


class OrgModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actType: '',
      modalVisible: false,
    }
  }

  onSubmit = () => {
    let fieldValues = this.props.form.getFieldsValue();
    let orgName = fieldValues.orgName;
    let remark = fieldValues.remark;
    let pOrgId = fieldValues.pOrgId;
    let orgId = fieldValues.orgId;

    let { actType } = this.props;

    if (!orgName) {
      message.info('请输入部门名称', 1);
      return;
    }


    const payload = actType.startsWith('add') ?
      {
        orgName: orgName,
        pOrgId: pOrgId,
        orgId: orgId,
        remark: remark,
        operator: globalData.userId,
        sysCode: globalConfig.sysCode
      } : {
        orgName: orgName,
        remark: remark,
        orgId: orgId,
        operator: globalData.userId,
      };
    this.props.dispatch({
      type: `${colConfig.pageTag}/${actType.startsWith('add') ? 'queryAddChildrenOrganizationEffect' : 'queryUpDataOrganizationInfoEffect'}`,
      payload: payload
    });
    this.modalCancel();
  };

  modalCancel = () => {
    this.setState({ modalVisible: false })
  };


  getDefaultOrderNoAndOrgId = () => {
    if (!this.props.organizationInfo) return '';
    if (this.props.actType === 'addInSameLevel') {
      const thisLevelIds = this.props.organizationList
        .filter(item => item.pOrgId === this.props.organizationInfo.pOrgId)
        .map(item => Number(item.orgId.substring(item.orgId.length - 3, item.orgId.length)));

      let levelIdMax = Math.max(...thisLevelIds) + 1;
      let levelPrefix = this.props.organizationInfo.orgId.substring(0, this.props.organizationInfo.orgId.length - 3);

      return {
        orgId: levelPrefix + (Array(3).join('0') + levelIdMax).slice(-3)
      };
    }
  }

  render() {
    const { organizationInfo, actType, form, dispatch, organizationList, ...restForBtn } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <div style={{ display: 'inline-block' }}>
        <Button
          onClick={() => {
            this.props.form.setFieldsValue({ ...this.getDefaultOrderNoAndOrgId() });
            this.setState({ modalVisible: true });
          }}
          {...restForBtn} >
          {this.props.children}
        </Button>
        <Modal
          visible={this.state.modalVisible}
          // wrapClassName="vertical-center-modal"
          width='60%'
          onOk={() => this.onSubmit(actType)}
          onCancel={this.modalCancel}
          cancelText="取消"
          okText="确定"
        >
          <MyBreadcrumb itemList={[actType.startsWith('add') ? "新增部门信息" : '修改部门信息']} />
          <Form>
            <OpenFormItemGroup hideTitleBar={true} colNumPerRow={2}>
              <FormItem {...formItemLayout} key='orgId' colSpans={1} label='部门编号'>
                {getFieldDecorator('orgId', { rules: [{ required: true, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='orgId' disabled={true} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='orgName' colSpans={1} label='部门名称'>
                {getFieldDecorator('orgName', { rules: [{ required: true, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='ordName' />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='pOrgId' colSpans={1} label='父部门编号'>
                {getFieldDecorator('pOrgId', { rules: [{ required: false, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='pOrgId' disabled={true} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='pOrgName' colSpans={1} label='父部门名称'>
                {getFieldDecorator('pOrgName', { rules: [{ required: false, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='pOrgName' disabled={true} />
                )}
              </FormItem>

              <FormItem key='remark' colSpans={2} label='部门描述'>
                {getFieldDecorator('remark', { rules: [{ required: false, message: '' }], })(
                  <Input.TextArea id='remark' style={{ flex: '1', marginLeft: 5 }} autosize={{ minRows: 2 }} />
                )}
              </FormItem>
            </OpenFormItemGroup >
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedDetailPage = Form.create({
  mapPropsToFields: props => {
    let obj = {};
    for (var key in props.organizationInfo) {
      if (props.actType === 'add') {
        if (key == 'orgName' || key == 'remark') continue;
        if (key == 'orgId') {
          obj[key] = Form.createFormField({
            key,
            value: '系统自动生成',
          })
        } else if (key == 'pOrgId') {
          obj[key] = Form.createFormField({
            key,
            value: props.organizationInfo['orgId'],
          })
        } else if (key == 'pOrgName') {
          obj[key] = Form.createFormField({
            key,
            value: props.organizationInfo['orgName'],
          })
        }
      } else if (props.actType === 'addInSameLevel') {
        if (key === 'remark' || key === 'orgName') continue;

        obj[key] = Form.createFormField({
          key,
          value: props.organizationInfo[key],
        })
      } else
        obj[key] = Form.createFormField({
          key,
          value: props.organizationInfo[key],
        })
    }
    return obj;
  }
})(OrgModal);

function mapStateToProps(state) {
  return {
    organizationInfo: state[colConfig.pageTag].organizationInfo,
    organizationList: state[colConfig.pageTag].organizationList,
  };
}

export default connect(mapStateToProps)(WrappedDetailPage);
