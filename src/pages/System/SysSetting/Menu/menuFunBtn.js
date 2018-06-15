import React from 'react';
import { connect } from 'dva';
import MyBreadcrumb from '/components/MyBreadcrumb';
import { Input, Button, Modal, message, Form } from 'antd';
import colConfig from './config.json';
import globalData from "/project.config";
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import globalConfig from '/project.config.json';

// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

/**
 *添加子菜单
 */
class MenuModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actType: '',
      modalVisible: false,
    }
  }

  onSubmit = () => {
    let fieldValues = this.props.form.getFieldsValue();
    let menuName = fieldValues.menuName;
    let cUrl = fieldValues.cUrl;
    let pMenuId = fieldValues.pMenuId;
    let menuId = fieldValues.menuId;
    let orderNo = fieldValues.orderNo;
    let operateTime = fieldValues.operateTime;

    let { actType } = this.props;

    if (!menuName) {
      message.info('请输入菜单名称', 1);
      return;
    }

    if (actType.startsWith('add') && !orderNo) {
      message.info('请输入系统序号', 1);
      return;
    }

    const payload = actType.startsWith('add') ?
      {
        menuName: menuName,
        pMenuId: pMenuId,
        menuId: menuId,
        cUrl: cUrl,
        orderNo: orderNo,
        operator: globalData.userId,
        operateTime: operateTime,
        sysCode: globalConfig.sysCode
      } : {
        menuName: menuName,
        orderNo: orderNo,
        cUrl: cUrl,
        menuId: menuId,
        operator: globalData.userId,
      };
    this.props.dispatch({
      type: `${colConfig.pageTag}/${actType.startsWith('add') ? 'queryAddChildrenMenuEffect' : 'queryUpdataMenusInfoEffect'}`,
      payload: payload
    });
    this.modalCancel();
  };

  modalCancel = () => {
    this.setState({ modalVisible: false });
  };


  /**
   * 针对新增同级菜单和新增子菜单
   * 自动生成新增的菜单ID,父菜单ID，更新时间和序号，对于同级菜单和下级子菜单有不同的规则
   */
  getDefaultOrderNoAndMenuId = () => {
    if (!this.props.menuInfo) return '';
    if (this.props.actType === 'add') { //添加子菜单
      const thisChildsOrders = this.props.menuList
        .filter(item => item.pMenuId === this.props.menuInfo.menuId)
        .map(item => item.orderNo);

      const thisChildsIds = this.props.menuList
        .filter(item => item.pMenuId === this.props.menuInfo.menuId)
        .map(item => Number(item.menuId.substring(item.menuId.length - 3, item.menuId.length)));

      let childOrderNo = thisChildsOrders.length === 0 ? 1 : Math.max(...thisChildsOrders) + 1;

      let childIdMax = Math.max(...thisChildsIds) + 1;
      let childPrefix = this.props.menuInfo.menuId;
      let childMenuId = thisChildsIds.length === 0 ? childPrefix + '001' : childPrefix + (Array(3).join('0') + childIdMax).slice(-3)
      let curlArr = this.props.menuInfo.cUrl.split('/');
      curlArr.pop();
      return {
        orderNo: childOrderNo,
        menuId: childMenuId,
        pMenuId: this.props.menuInfo.menuId,
        pMenuName: this.props.menuInfo.pMenuName,
        cUrl: [...curlArr,'????'].join('/'),
        operateTime: moment().format("YYYY-MM-DD HH:mm:ss")
      };
    }
    else if (this.props.actType === 'addInSameLevel') { //添加同级菜单
      const thisLevelOrders = this.props.menuList
        .filter(item => item.pMenuId === this.props.menuInfo.pMenuId)
        .map(item => item.orderNo);

      const thisLevelIds = this.props.menuList
        .filter(item => item.pMenuId === this.props.menuInfo.pMenuId)
        .map(item => Number(item.menuId.substring(item.menuId.length - 3, item.menuId.length)));


      const sortOrders = thisLevelOrders.sort((m, n) => {
        if (m < n) return -1
        else if (m > n) return 1
        else return 0
      });

      const myIndex = sortOrders.findIndex(item => Math.abs(item - this.props.menuInfo.orderNo) < 0.0001);
      let levelOrder = ((myIndex > 0 ? sortOrders[myIndex - 1] : 0) + this.props.menuInfo.orderNo) / 2;

      let levelIdMax = Math.max(...thisLevelIds) + 1;
      let levelPrefix = this.props.menuInfo.menuId.substring(0, this.props.menuInfo.menuId.length - 3);

      return {
        orderNo: levelOrder,
        menuId: levelPrefix + (Array(3).join('0') + levelIdMax).slice(-3),
        pMenuId: this.props.menuInfo.pMenuId,
        pMenuName: this.props.menuInfo.pMenuName,
        cUrl: this.props.menuInfo.cUrl + '/?????',
        operateTime: moment().format("YYYY-MM-DD HH:mm:ss")
      };
    }
  }

  render() {
    const { menuInfo, actType, form, dispatch, menuList, ...restForBtn } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <div style={{ display: 'inline-block' }}>
        <Button
          onClick={() => {
            this.props.form.setFieldsValue({ ...this.getDefaultOrderNoAndMenuId() });
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
          <MyBreadcrumb itemList={[actType.startsWith('add') ? "新增菜单信息" : '修改菜单信息']} />
          <Form>
            <OpenFormItemGroup hideTitleBar={true} colNumPerRow={2}>
              <FormItem {...formItemLayout} key='menuId' colSpans={1} label='菜单编号'>
                {getFieldDecorator('menuId', { rules: [{ required: true, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='menuId' disabled={true} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='menuName' colSpans={1} label='菜单名称'>
                {getFieldDecorator('menuName', { rules: [{ required: true, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='ordName' />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='pMenuId' colSpans={1} label='父菜单编号'>
                {getFieldDecorator('pMenuId', { rules: [{ required: false, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='pMenuId' disabled={true} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='pMenuName' colSpans={1} label='父菜单名称'>
                {getFieldDecorator('pMenuName', { rules: [{ required: false, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='pMenuName' disabled={true} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='orderNo' colSpans={1} label='菜单序号'>
                {getFieldDecorator('orderNo', { rules: [{ required: true, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='orderNo' />
                )}
              </FormItem>

              <FormItem {...formItemLayout} key='operateTime' colSpans={1} label='更新时间'>
                {getFieldDecorator('operateTime', { rules: [{ required: false, message: '' }], })(
                  <Input style={{ flex: '1', marginLeft: 5 }} id='operateTime' disabled={true} />
                )}
              </FormItem>

              <FormItem key='cUrl' colSpans={2} label='菜单URL'>
                {getFieldDecorator('cUrl', { rules: [{ required: false, message: '' }], })(
                  <Input.TextArea id='cUrl' style={{ flex: '1', marginLeft: 5 }} autosize={{ minRows: 2 }} />
                )}
              </FormItem>
            </OpenFormItemGroup >
          </Form>
        </Modal>
      </div>
    );
  }
}

// const WrappedDetailPage = Form.create({MenuModal});

const WrappedDetailPage = Form.create({
  mapPropsToFields: props => {
    let obj = {};
    for (var key in props.menuInfo) {
      if (!props.actType.startsWith('add')) {
        obj[key] = Form.createFormField({
          key,
          value: props.menuInfo[key],
        })
      }
    }
    return obj;
  }
})(MenuModal);

function mapStateToProps(state) {
  return {
    menuInfo: state[colConfig.pageTag].menuInfo,
    menuList: state[colConfig.pageTag].menuList,
  };
}

export default connect(mapStateToProps)(WrappedDetailPage);
