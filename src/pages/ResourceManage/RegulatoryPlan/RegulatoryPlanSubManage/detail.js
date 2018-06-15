import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData, { getSelectionsByPid, getDicNameById, getSelectionsTreeByPid, getTreePathByPid } from '/project.config';
import colConfig from './config.json';
import InputFromTree from '/components/InputFromTree';
import RegPlanModal from './modal';



// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

class DetaiPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            infoBoxVisible: false,
            indexClass: null,
            btnVisible: true,
        }
    }

    //在组件创建时，render渲染之前，初始化状态
    componentWillMount() {
        if (this.props.location.state.detailType === 'modify') {
            /* 跳转按钮只在查看时点击 */
            this.state.btnVisible = false;
        }
    }

    handleCancel = () => {
        this.setState({
            infoBoxVisible: false,
        });
    }


    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let newValues = {};

                Object.keys(values).forEach(key => {
                    const config = colConfig.fieldInfo[key];
                    if (key != 'regplanName') {
                        newValues[key] = values[key];
                    }

                    if (colConfig.fieldInfo[key]) {
                        if (config.dataType === '日期') {
                            newValues[key] = values[key].format("YYYY-MM-DD");
                        }
                        else if (config.dataType === '时间') {
                            newValues[key] = values[key].format("YYYY-MM-DD HH:mm:ss");
                        }
                        else if (config.controlType === '下拉列表-级联') {
                            newValues[key] = values[key].length && values[key][values[key].length - 1] || 0;
                        }
                    }
                });

                if (this.props.location.state.detailType === 'modify') {
                    newValues = {
                        ...this.props.curDetail,
                        ...newValues,
                        updateUser: globalData.userId,
                    }
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/modifyRecord`,
                        payload: {
                            newValues,
                            pathname: this.props.location.pathname,
                        }
                    });
                } else {
                    newValues = {
                        ...this.props.curDetail,
                        ...newValues,
                        createUser: globalData.userId,
                        indexClass: this.state.indexClass,
                        dataStatus: 1,
                    }
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

    //regPlan弹窗
    closeModal = (obj = null) => {
        this.setState({
            infoBoxVisible: false,
        });
        if (obj) {
            this.props.form.setFieldsValue({
                regplanId: obj.regplanId + '',
                regplanName: obj.regplanName + '',
            });
            this.state.indexClass = obj.indexClass;
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (

            <div>
                <MyBreadcrumb itemList={['资源管理', '分地块管理', '项目详情']} >
                    <Button
                        key='btnAdd'
                        style={{ marginLeft: '5px' }}
                        type="primary"
                        icon="upload"
                        onClick={this.handleSubmit}>
                        提交</Button>
                </MyBreadcrumb>

                <Form>
                    <OpenFormItemGroup title='控规信息'>
                        <FormItem key='regplanName' colSpans={1} label='规划块名称'>
                            {getFieldDecorator('regplanName', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写规划块名称' }], })(
                                <Input id='regplanName' onClick={() => {

                                    this.setState({
                                        infoBoxVisible: true,
                                    });
                                    this.props.dispatch({
                                        type: `${colConfig.pageTag}/queryModalData`,
                                        payload: {
                                            pageSize: globalData.pageSize,
                                            pageNum: 1,
                                            regPlanId: '',
                                            indexClass: ''
                                        }
                                    });
                                }} />
                            )}
                        </FormItem>


                        <FormItem key='regplanId' colSpans={1} label='规划块编号'>
                            {getFieldDecorator('regplanId', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写规划块编号' }], })(
                                <Input id='regplanId' />
                            )}
                        </FormItem>

                        <FormItem colSpans={1} label=''>
                            <Button disabled={this.state.btnVisible} onClick={() => {
                                this.props.history.push({
                                    pathname: "/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanManage",
                                    state: {
                                        indexClass: this.props.curDetail.indexClass,
                                        regplanName: this.props.curDetail.regplanName
                                    }
                                });
                            }}>规划块详情</Button>
                        </FormItem>
                    </OpenFormItemGroup>

                    <OpenFormItemGroup title='基本信息'>
                        <FormItem key='planCode' colSpans={1} label='地块编码'>
                            {getFieldDecorator('planCode', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写地块编码' }], })(
                                <Input id='planCode' />
                            )}
                        </FormItem>
                        <FormItem key='siteCode' colSpans={1} label='用地代码'>
                            {getFieldDecorator('siteCode', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写用地代码' }], })(
                                <Input id='siteCode' />
                            )}
                        </FormItem>
                        <FormItem key='siteNature' colSpans={1} label='用地性质'>
                            {getFieldDecorator('siteNature', { initialValue: '', rules: [{ required: false, max: 255, message: '请正确填写用地性质' }], })(
                                <Input id='siteNature' />
                            )}
                        </FormItem>
                        <FormItem key='siteArea' colSpans={1} label='地块面积（公顷）'>
                            {getFieldDecorator('siteArea', { initialValue: '', rules: [{ required: false, message: '请正确填写地块面积（公顷）' }], })(
                                <Input id='siteArea' />
                            )}
                        </FormItem>
                        <FormItem key='far' colSpans={1} label='容积率'>
                            {getFieldDecorator('far', { initialValue: '', rules: [{ required: false, message: '请正确填写容积率' }], })(
                                <Input id='far' />
                            )}
                        </FormItem>
                        <FormItem key='buildingDensity' colSpans={1} label='建筑密度(%)'>
                            {getFieldDecorator('buildingDensity', { initialValue: '', rules: [{ required: false, message: '请正确填写建筑密度(%)' }], })(
                                <Input id='buildingDensity' />
                            )}
                        </FormItem>
                        <FormItem key='buildingHeightLimit' colSpans={1} label='建筑控制高度'>
                            {getFieldDecorator('buildingHeightLimit', { initialValue: '', rules: [{ required: false, message: '请正确填写建筑控制高度' }], })(
                                <Input id='buildingHeightLimit' />
                            )}
                        </FormItem>
                        <FormItem key='greeningRate' colSpans={1} label='绿地率(%)'>
                            {getFieldDecorator('greeningRate', { initialValue: '', rules: [{ required: false, message: '请正确填写绿地率(%)' }], })(
                                <Input id='greeningRate' />
                            )}
                        </FormItem>
                        <FormItem key='peopleNum' colSpans={1} label='建议居住人口'>
                            {getFieldDecorator('peopleNum', { initialValue: '', rules: [{ required: false, message: '请正确填写建议居住人口' }], })(
                                <Input id='peopleNum' />
                            )}
                        </FormItem>
                        <FormItem key='entrances' colSpans={1} label='出入口方位'>
                            {getFieldDecorator('entrances', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写出入口方位' }], })(
                                <Input id='entrances' />
                            )}
                        </FormItem>
                        <FormItem key='carParkInfo' colSpans={1} label='配建停车位'>
                            {getFieldDecorator('carParkInfo', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写配建停车位' }], })(
                                <Input id='carParkInfo' />
                            )}
                        </FormItem>
                        <FormItem key='undergroundSpaceUsed' colSpans={1} label='地下空间利用'>
                            {getFieldDecorator('undergroundSpaceUsed', { initialValue: '', rules: [{ required: false, max: 100, message: '请正确填写地下空间利用' }], })(
                                <Input id='undergroundSpaceUsed' />
                            )}
                        </FormItem>
                        <FormItem key='buildingStatus' colSpans={1} label='现状建设情况'>
                            {getFieldDecorator('buildingStatus', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写现状建设情况' }], })(
                                <Input id='buildingStatus' />
                            )}
                        </FormItem>
                        <FormItem key='supporting' colSpans={1} label='配建设施'>
                            {getFieldDecorator('supporting', { initialValue: '', rules: [{ required: false, max: 100, message: '请正确填写配建设施' }], })(
                                <Input id='supporting' />
                            )}
                        </FormItem>
                        <FormItem key='remark' colSpans={3} label='备注'>
                            {getFieldDecorator('remark', { initialValue: '', rules: [{ required: false, max: 255, message: '请正确填写备注' }], })(
                                <Input.TextArea rows={4} />
                            )}
                        </FormItem>
                    </OpenFormItemGroup>

                </Form>
                <RegPlanModal
                    visible={this.state.infoBoxVisible}
                    close={this.handleCancel}
                    dataSource={this.props.modalDataList}
                    pageSize={this.props.pageSize}
                    total={this.props.total}
                    pageNum={this.props.pageNum}
                    pagination={{ pageSize: this.props.pageSize, total: this.props.total, current: this.props.pageNum, }}
                    regPlanId={this.state.regPlanId}
                    planfileId={this.props.planfileId}
                    close={this.closeModal}
                />
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        curDetail: state[colConfig.pageTag].curDetail,
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
