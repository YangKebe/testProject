import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, DatePicker } from 'antd';
import OpenSearchPanel from '/components/OpenSearchPanel';
import globalData, { getSelectionsByPid, getSelectionsTreeByPid } from '/project.config.js';
import InputFromTree from '/components/InputFromTree';
import colConfig from './config.json';
import { indexClassConvertCh } from '/utils/utils';

const FormItem = Form.Item;

class SearchGroup extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.regplanName && this.props.indexClass)
            this.props.form.setFieldsValue({
                regplanName: this.props.regplanName,
                indexClass: indexClassConvertCh(this.props.indexClass),
            });
    }

    /**
     * 按条件进行搜索，搜索成功后，搜索条件会放置到store的curQueryStr变量中
     */
    onSearch = () => {
        let whereCond = {
            pageSize: colConfig.cacheMode ? 9999 : globalData.pageSize, //如使用缓存模式，则一次性全部查询完，不分页
            pageNum: 1, //每次点击按钮查询，当前查询页置为1
            regPlanId: '',
            indexClass: ''
        };
        let fieldValues = this.props.form.getFieldsValue();
        Object.keys(fieldValues)
            .filter(key => !!fieldValues[key])
            .forEach(key => {
                const isTreeSelect = colConfig.fieldInfo[key] && colConfig.fieldInfo[key].controlType === '下拉列表-级联' && Array.isArray(fieldValues[key])
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
                    onSearch={() => { this.onSearch() }}
                    expand={false}
                    displayNum={2}
                >
                    <FormItem {...formItemLayout} label='规划块名称'>
                        {getFieldDecorator('regplanName')(
                            <Input id='regplanName' />)}
                    </FormItem>

                    {<FormItem {...formItemLayout} label='指标分类'>
                        {getFieldDecorator('indexClass', { initialValue: '' })(
                            <Select>
                                <Select.Option value="">请选择</Select.Option>
                                <Select.Option value="1">规划指标</Select.Option>
                                <Select.Option value="2">实施指标</Select.Option>
                            </Select>
                        )}
                    </FormItem>}
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
