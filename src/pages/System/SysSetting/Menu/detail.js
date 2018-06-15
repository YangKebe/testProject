import React from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import colConfig from './config.json';

const FormItem = Form.Item;

class DetaiPage extends React.PureComponent {

    render() {
        const { getFieldDecorator } = this.props.form;
        const { menuInfo } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        return (
            <div>
                <Form>
                    <OpenFormItemGroup hideTitleBar={true} colNumPerRow={2}>
                        <FormItem {...formItemLayout} key='menuId' colSpans={1} label='菜单编号'>
                            {getFieldDecorator('menuId', { initialValue: menuInfo != null ? menuInfo.menuId : '', rules: [{ required: false, message: '' }], })(
                                <Input id='menuId' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='menuName' colSpans={1} label='菜单名称'>
                            {getFieldDecorator('menuName', { initialValue: menuInfo != null ? menuInfo.menuName : '', rules: [{ required: false, message: '' }], })(
                                <Input id='menuName' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='pMenuId' colSpans={1} label='父菜单编号'>
                            {getFieldDecorator('pMenuId', { initialValue: menuInfo != null ? menuInfo.pMenuId : '', rules: [{ required: false, message: '' }], })(
                                <Input id='pMenuId' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='pMenuName' colSpans={1} label='父菜单名称'>
                            {getFieldDecorator('pMenuName', { initialValue: menuInfo != null ? menuInfo.pMenuName : '', rules: [{ required: false, message: '' }], })(
                                <Input id='pMenuName' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='orderNo' colSpans={1} label='菜单序号'>
                            {getFieldDecorator('orderNo', { initialValue: menuInfo != null ? menuInfo.orderNo : '', rules: [{ required: false, message: '' }], })(
                                <Input id='orderNo' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='operateTime' colSpans={1} label='更新时间'>
                            {getFieldDecorator('operateTime', { initialValue: menuInfo != null ? menuInfo.operateTime : '', rules: [{ required: false, message: '' }], })(
                                <Input id='operateTime' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem key='cUrl' colSpans={2} label='菜单URL'>
                            {getFieldDecorator('cUrl', { initialValue: menuInfo != null ? menuInfo.cUrl : '', rules: [{ required: false, message: '' }], })(
                                <Input.TextArea autosize={{ minRows: 2 }} disabled={true} />
                            )}
                        </FormItem>
                    </OpenFormItemGroup >
                </Form>
            </div>
        );
    }

}


const WrappedDetailPage = Form.create()(DetaiPage);

function mapStateToProps(state) {
    return {
        menuInfo: state[colConfig.pageTag].menuInfo,
    };
}

export default connect(mapStateToProps)(WrappedDetailPage);
