import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, TreeSelect } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData, { getSelectionsByPid, getDicNameById, getSelectionsTreeByPid, getTreePathByPid } from '/project.config';
import colConfig from './config.json';
import { arrayToTree } from '/components/MyTree/treeUtils';


// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

class DetaiPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            userType: null
        };

        this.props.dispatch({
            type: `${colConfig.pageTag}/queryOrganizationTreeListEffect`,
            payload: {},
        });
    }


    componentWillReceiveProps(nextProps) {
        if (!this.state.userType) {
            if (nextProps.curDetail) {
                this.state.orgId = nextProps.curDetail.orgId;
            }
            if (nextProps.curDetail) {
                this.state.userType = parseInt(nextProps.curDetail.userType);
            }
        }
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

                if (this.props.location.state.detailType === 'modify') {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/modifyRecord`,
                        payload: {
                            newValues,
                            pathname: this.props.location.pathname,
                        }
                    });
                } else {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/submitNew`,
                        payload: {
                            newValues,
                            pathname: this.props.location.pathname,
                        }
                    });
                }
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


    changeUserType = (value) => {
        this.setState({
            userType: value,
            orgId: null
        });
        this.props.form.resetFields(['orgId']);
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        return (

            <div>
                <MyBreadcrumb itemList={['系统管理', '系统设置', '用户管理']} >
                    <Button
                        key='btnAdd'
                        style={{ marginLeft: '5px' }}
                        type="primary"
                        icon="upload"
                        onClick={this.handleSubmit}>
                        提交</Button>
                </MyBreadcrumb>

                <Form>

                    <OpenFormItemGroup title='基本信息'>
                        <FormItem key='userId' colSpans={1} label='用户账号'>
                            {getFieldDecorator('userId', { initialValue: '', rules: [{ required: true, min: 1, max: 100, message: '请正确填写用户账号' }], })(
                                <Input id='userId' />
                            )}
                        </FormItem>
                        <FormItem key='userName' colSpans={1} label='用户姓名'>
                            {getFieldDecorator('userName', { initialValue: '', rules: [{ required: true, min: 1, max: 100, message: '请正确填写用户姓名' }], })(
                                <Input id='userName' />
                            )}
                        </FormItem>
                        <FormItem key='userType' colSpans={1} label='用户类型'>
                            {getFieldDecorator('userType', { initialValue: '', rules: [{ required: true, message: '请正确填写用户类型' }], })(
                                <Select id='userType' allowClear={true} onChange={(value) => this.changeUserType(value)}>
                                    {this.GetOption(getSelectionsByPid(104))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem key='key_orgId' colSpans={1} label='所在部门'>
                            {getFieldDecorator('orgId', { rules: [{ required: this.state.userType == 104001 ? true : false }], })(
                                <TreeSelect
                                    allowClear={true}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={arrayToTree(this.props.organizationList, null, 'orgId', 'pOrgId')}
                                    disabled={this.state.userType == 104001 ? false : true}
                                    treeDefaultExpandAll
                                />
                            )}
                        </FormItem>
                        <FormItem key='mobilePhone' colSpans={1} label='手机号码'>
                            {getFieldDecorator('mobilePhone', { initialValue: '', rules: [{ required: true, max: 12, message: '请正确填写移动电话' }], })(
                                <Input id='mobilePhone' />
                            )}
                        </FormItem>
                        <FormItem key='idCardNo' colSpans={1} label='身份证号码'>
                            {getFieldDecorator('idCardNo', { initialValue: '', rules: [{ required: true, max: 18, message: '请正确填写身份证号码' }], })(
                                <Input id='idCardNo' />
                            )}
                        </FormItem>
                        <FormItem key='sex' colSpans={1} label='性别'>
                            {getFieldDecorator('sex', { initialValue: '', rules: [{ required: true, message: '请正确填写性别' }], })(
                                <Select id='sex' allowClear={true}>
                                    {this.GetOption(getSelectionsByPid(103))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem key='email' colSpans={1} label='邮箱'>
                            {getFieldDecorator('email', { initialValue: '', rules: [{ required: true, max: 50, message: '请正确填写邮箱' }], })(
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
        organizationList: state[colConfig.pageTag].organizationList,
    };
}

const WrappedDetailPage = Form.create({

    mapPropsToFields: props => {
        if (props.location.state && props.location.state.detailType !== 'add') { //新增的时候不进行数据链接
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
    }
})(DetaiPage);

export default connect(mapStateToProps)(WrappedDetailPage);
