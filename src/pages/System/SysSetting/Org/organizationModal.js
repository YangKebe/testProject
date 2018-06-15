import React from 'react';
import { connect } from 'dva';
import MyBreadcrumb from '/components/MyBreadcrumb';
import { Input, Button, Modal, message, Row, Col, Form } from 'antd';
import colConfig from './config.json';
import globalData from "/project.config";
import OpenFormItemGroup from '/components/OpenFormItemGroup';


const FormItem = Form.Item;
/**
 *添加子部门
 */
class OrganizationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actType: '',
  }
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(actType){
    let fieldValues = this.props.form.getFieldsValue();
    let orgName = fieldValues.orgName;
    let remark = fieldValues.remark;
    let orgId = fieldValues.orgId;

    if (orgName == '' || orgName == null) {
      message.info('请输入部门名称', 1);
      return;
    }

    if (actType === 'add' && (remark == '' || remark == null)) {
      message.info('请输入部门描述', 1);
      return;
    }

    const url = actType === 'add' ? 'queryAddChildrenOrganizationEffect' : 'queryUpDataOrganizationInfoEffect';
    const payload = actType === 'add' ?
      {
        orgName: orgName,
        pOrgId: this.props.organizationInfo.orgId,
        remark: remark,
        operator: globalData.userId,
        status: '101001',
      } : {
        orgName: orgName,
        orgId: orgId,
        remark: remark,
        operator: globalData.userId,
      };
    this.props.dispatch({
      type: `${colConfig.pageTag}/${url}`,
      payload: payload
    });
    this.modalCancel();
  };

  modalCancel = () => {
    this.props.form.setFieldsValue({
      orgName: '',
      remark: '',
    });
    this.props.closeModal();
  };

  render() {
    const { openModal, organizationInfo, actType } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <Modal
        visible={openModal}
        wrapClassName="vertical-center-modal"
        width='60%'
        onOk={() => this.onSubmit(actType)}
        onCancel={this.modalCancel}
        cancelText="取消"
        okText="确定"
      >
        <MyBreadcrumb itemList={[actType === 'add' ? "新增部门信息" : '修改部门信息']} />
        <Form>
          <OpenFormItemGroup hideTitleBar={true} colNumPerRow={2}>
            <FormItem {...formItemLayout} key='orgId' colSpans={1} label='部门编号'>
              {getFieldDecorator('orgId', { rules: [{ required: false, message: '' }], })(
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
    );
  }
}

const WrappedDetailPage = Form.create({
  mapPropsToFields: props => {
      let obj = {};
      for (var key in props.organizationInfo) {
        if (props.actType === 'add'){
          if(key == 'orgName' || key == 'remark') continue;
          if(key == 'orgId') {
            obj[key] = Form.createFormField({
              key,
              value: '系统自动生成',
            })
          } else if(key == 'pOrgId') {
            obj[key] = Form.createFormField({
              key,
              value: props.organizationInfo['orgId'],
            })
          } else if(key == 'pOrgName') {
            obj[key] = Form.createFormField({
              key,
              value: props.organizationInfo['orgName'],
            })
          }
        }else 
        obj[key] = Form.createFormField({
          key,
          value: props.organizationInfo[key],
        })
      }
      return obj;
  }
})(OrganizationModal);

function mapStateToProps(state) {
  return {
    organizationInfo: state[colConfig.pageTag].organizationInfo
  };
}

export default connect(mapStateToProps)(WrappedDetailPage);
