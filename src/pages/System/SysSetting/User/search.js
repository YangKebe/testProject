import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, DatePicker, TreeSelect } from 'antd';
import OpenSearchPanel from '/components/OpenSearchPanel';
import globalData, { getSelectionsByPid, GetOption,getSelectionsTreeByPid } from '/project.config.js';
import colConfig from './config.json';
import { arrayToTree } from '/components/MyTree/treeUtils';


const FormItem = Form.Item;

class SearchGroup extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            userType: null
        };

        //预先查询好所有的部门信息
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryOrganizationTreeListEffect`,
            payload: {},
        });
    }

    componentDidMount() {
        this.onSearch();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.organizationList != this.props.organizationList) {
            nextProps.organizationList.forEach(item => {
                item['label'] = item.orgName;
                item['value'] = item.orgId;
            });
            this.treeData = arrayToTree(nextProps.organizationList, null, 'orgId', 'pOrgId');
        }
    }


    /**
     * 按条件进行搜索，搜索成功后，搜索条件会放置到store的curQueryStr变量中
     */
    onSearch = () => {
        let whereCond = {
            rows: colConfig.cacheMode ? 9999 : globalData.pageSize, //如使用缓存模式，则一次性全部查询完，不分页
            page: 1 //每次点击按钮查询，当前查询页置为1
        };
        let fieldValues = this.props.form.getFieldsValue();
        Object.keys(fieldValues)
            .filter(key => !!fieldValues[key])
            .forEach(key => {
                const isTreeSelect = colConfig.fieldInfo[key].controlType === '下拉列表-级联' && Array.isArray(fieldValues[key])
                whereCond[key] = isTreeSelect ? fieldValues[key][fieldValues[key].length - 1] : fieldValues[key];
            });
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryByWhere`,
            payload: whereCond,
        });
    }


    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <OpenSearchPanel
                    form={this.props.form}
                    onSearch={this.onSearch}
                    expand={false}
                    displayNum={5}
                >
                    <FormItem {...formItemLayout} key='key_userId' colSpans={1} label='用户账号'>
                        {getFieldDecorator('userId')(
                            <Input id='userId' />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} key='key_userName' colSpans={1} label='姓名'>
                        {getFieldDecorator('userName')(
                            <Input id="userName" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} key='key_status' colSpans={1} label='账号状态'>
                        {getFieldDecorator('status', { initialValue: 101001 })(
                            <Select id="status" allowClear={true}>
                                {GetOption(getSelectionsByPid(101))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} key='key_userType' colSpans={1} label='账号类型'>
                        {getFieldDecorator('userType')(
                            <Select id="userType" allowClear={true} onChange={(value) => {
                                this.setState({
                                    userType: value
                                });
                            }}>
                                {GetOption(getSelectionsByPid(104))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem  {...formItemLayout} key='key_orgId' colSpans={1} label='所在部门'>
                        {getFieldDecorator('orgId')(
                            <TreeSelect
                                allowClear={true}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.state.userType == 104001 || !this.state.userType ? this.treeData : null}
                                treeDefaultExpandAll
                            />
                        )}
                    </FormItem>
                </OpenSearchPanel>

            </div>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create()(SearchGroup);


function mapStateToProps(state) {
    return {
        organizationList: state[colConfig.pageTag].organizationList,
    };
}

export default connect(mapStateToProps)(WrappedAdvancedSearchForm);
