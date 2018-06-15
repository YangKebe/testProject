import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData, { getSelectionsByPid, getDicNameById, getSelectionsTreeByPid, getTreePathByPid } from '/project.config';
import colConfig from './config.json';
import InputFromTree from '/components/InputFromTree'


// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

class DetaiPage extends React.PureComponent {

    render() {
        const { getFieldDecorator } = this.props.form;
        const { organizationInfo } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        return (
            <div>
                <Form>
                    <OpenFormItemGroup hideTitleBar={true} colNumPerRow={2}>
                        <FormItem {...formItemLayout} key='orgId' colSpans={1} label='部门编号'>
                            {getFieldDecorator('orgId', { initialValue: organizationInfo != null ? organizationInfo.orgId : '', rules: [{ required: false, message: '' }], })(
                                <Input id='orgId' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='orgName' colSpans={1} label='部门名称'>
                            {getFieldDecorator('orgName', { initialValue: organizationInfo != null ? organizationInfo.orgName : '', rules: [{ required: false, message: '' }], })(
                                <Input id='orgName' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='pOrgId' colSpans={1} label='父部门编号'>
                            {getFieldDecorator('pOrgId', { initialValue: organizationInfo != null ? organizationInfo.pOrgId : '', rules: [{ required: false, message: '' }], })(
                                <Input id='pOrgId' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} key='pOrgName' colSpans={1} label='父部门名称'>
                            {getFieldDecorator('pOrgName', { initialValue: organizationInfo != null ? organizationInfo.pOrgName : '', rules: [{ required: false, message: '' }], })(
                                <Input id='pOrgName' disabled={true} />
                            )}
                        </FormItem>

                        <FormItem key='remark' colSpans={2} label='部门描述'>
                            {getFieldDecorator('remark', { initialValue: organizationInfo != null ? organizationInfo.remark : '', rules: [{ required: false, message: '' }], })(
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
        organizationInfo: state[colConfig.pageTag].organizationInfo,
    };
}


export default connect(mapStateToProps)(WrappedDetailPage);
