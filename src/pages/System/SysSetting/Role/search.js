import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, DatePicker } from 'antd';
import OpenSearchPanel from '/components/OpenSearchPanel';
import globalData, { getSelectionsByPid, getSelectionsTreeByPid } from '/project.config.js';
import InputFromTree from '/components/InputFromTree';
import colConfig from './config.json';

const FormItem = Form.Item;

class SearchGroup extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
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

    /**
     * 生成下拉选项
     * @param {*可以为带typeId和typeName属性的数组，也可以是,分隔的字符串} option 
     */
    GetOption(option) {
        let arr = Array.isArray(option) ? option : option.split(',');
        return arr.map(
            optionValue => {
                const value = optionValue.typeId || optionValue;
                const displayName = optionValue.typeName || optionValue;
                return (<Select.Option value={value} key={Math.random()} style={{ height: '32px' }}>
                    {displayName}
                </Select.Option>)
            }
        );
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
                    displayNum={2}
                >
                    <FormItem {...formItemLayout} label='用户账号'>
                        {getFieldDecorator('userId')(
                            <Input id='userId' />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label='用户姓名'>
                        {getFieldDecorator('userName')(
                            <Input id='userName' />)}
                    </FormItem>
                </OpenSearchPanel>

            </div>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create()(SearchGroup);


function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(WrappedAdvancedSearchForm);
