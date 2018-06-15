import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, DatePicker } from 'antd';
import OpenSearchPanel from '/components/OpenSearchPanel';
import globalData from '/project.config.js';
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
                return (<Select.Option value={value} key={'select_'+value} style={{ height: '32px' }}>
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
                    <FormItem {...formItemLayout} label='角色编号'>
                        {getFieldDecorator('roleId')(
                            <Input id='roleId' />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label='角色名称'>
                        {getFieldDecorator('roleName')(
                            <Input id='roleName' />)}
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
