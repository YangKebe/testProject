import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, Upload, UploadButton, Icon, Modal, message } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData, { getSelectionsByPid, getDicNameById, getSelectionsTreeByPid, getTreePathByPid } from '/project.config';
import colConfig from './config.json';
import InputFromTree from '/components/InputFromTree';
import RegPlanModal from './modal';
import globalConfig from '/project.config.json';


// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
let isFirstIn = 0;

class DetaiPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            infoBoxVisible: false,
            indexClass: null,
            btnVisible: true,
            indexClassShow: true,
            previewVisible: false,
            previewImage: '',
            totalPlaneFileList: [],
            birdsViewFileList: [],
            singleEffectFileList: [],
            planFileList: [],
            scenePicFileList: [],
            keyPlanFileList: [],
            otherFileList: [],
            picType: [],
        }
    }

    //在组件创建时，render渲染之前，初始化状态
    componentWillMount() {
        isFirstIn = 0;
    }


    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let newValues = {};

                Object.keys(values).forEach(key => {
                    const config = colConfig.fieldInfo[key];
                    if (config) {
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
                    }
                });

                const formData = new FormData();
                this.state.totalPlaneFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '总平',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                this.state.birdsViewFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '鸟瞰',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                this.state.singleEffectFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '单体效果',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                this.state.planFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '规划图',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                this.state.scenePicFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '现场照片',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                this.state.keyPlanFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '重点规划',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                this.state.otherFileList.forEach((file) => {
                    if (!file['url']) {
                        this.state.picType.push({
                            regplanId: values['regplanId'],
                            remark: values['remark'],
                            fileClass: '其他',
                            fileName: file.name,
                        });
                        formData.append('filePath', file);
                    }
                });

                if(formData.get('filePath') != null) {
                    formData.append('content', JSON.stringify(this.state.picType));
                }else {
                    formData.append('content', JSON.stringify([{
                        regplanId: values['regplanId'],
                        remark: values['remark'],
                    }]));
                }
                

                if (this.props.location.state.detailType === 'modify') {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/modifyRecord`,
                        payload: {
                            formData,
                            pathname: this.props.location.pathname,
                        }
                    });
                } else {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/submitNew`,
                        payload: {
                            formData,
                            pathname: this.props.location.pathname,
                        }
                    });
                }
            }
        });
    }


    //当props发生变化时执行（更新state）
    componentWillReceiveProps(nextProps) {
        if (this.props.location.state.detailType === 'modify') {
            //双击进入修改页面，增删附件
            if (nextProps.curDetail && nextProps.curDetail.length > 0 && isFirstIn == 0) {
                let totalPlaneListArr = [];
                let birdsViewListArr = [];
                let singleEffectListArr = [];
                let planListArr = [];
                let scenePicListArr = [];
                let keyPlanListArr = [];
                let otherListArr = [];
                nextProps.curDetail.map(item => {
                    if (item.fileClass == '总平') {
                        totalPlaneListArr.push(item);
                    } else if (item.fileClass == '鸟瞰') {
                        birdsViewListArr.push(item);
                    } else if (item.fileClass == '单体效果') {
                        singleEffectListArr.push(item);
                    } else if (item.fileClass == '规划图') {
                        planListArr.push(item);
                    } else if (item.fileClass == '现场照片') {
                        scenePicListArr.push(item);
                    } else if (item.fileClass == '重点规划') {
                        keyPlanListArr.push(item);
                    } else if (item.fileClass == '其他') {
                        otherListArr.push(item);
                    }
                })

                let totalPlaneFileArray = this.toFileList(totalPlaneListArr);
                let birdsViewFileArray = this.toFileList(birdsViewListArr);
                let singleEffectFileArray = this.toFileList(singleEffectListArr);
                let planFileArray = this.toFileList(planListArr);
                let scenePicFileArray = this.toFileList(scenePicListArr);
                let keyPlanFileArray = this.toFileList(keyPlanListArr);
                let otherFileArray = this.toFileList(otherListArr);

                if (totalPlaneFileArray.length > 0) {
                    this.setState({
                        totalPlaneFileList: totalPlaneFileArray
                    })
                }
                if (birdsViewFileArray.length > 0) {
                    this.setState({
                        birdsViewFileList: birdsViewFileArray
                    })
                }
                if (singleEffectFileArray.length > 0) {
                    this.setState({
                        singleEffectFileList: singleEffectFileArray
                    })
                }
                if (planFileArray.length > 0) {
                    this.setState({
                        planFileList: planFileArray
                    })
                }
                if (scenePicFileArray.length > 0) {
                    this.setState({
                        scenePicFileList: scenePicFileArray
                    })
                }
                if (keyPlanFileArray.length > 0) {
                    this.setState({
                        keyPlanFileList: keyPlanFileArray
                    })
                }
                if (otherFileArray.length > 0) {
                    this.setState({
                        otherFileList: otherFileArray
                    })
                }
            }
        }
    }

    /* 传入数组，返回整理好的对应的附件数组 */
    toFileList = fileArr => {
        if (fileArr && fileArr.length > 0) {
            isFirstIn++;
            let fileList = fileArr;
            let fileArray = [];
            for (let i = 0; i < fileList.length; i++) {
                fileArray.push(
                    {
                        uid: fileList[i].planfileId,
                        name: fileList[i].fileName,
                        status: 'done',
                        url: globalConfig.upLoadUrl + fileList[i].planfileId,
                    }
                )
            }
            return fileArray;
        } else {
            return fileArr;
        }
    }

    //regPlan弹窗
    closeModal = (obj = null) => {
        this.setState({
            infoBoxVisible: false,
        });
        if (obj) {
            this.props.form.setFieldsValue({
                regplanId: obj.regplanId + '',
            });
            this.state.indexClass = obj.indexClass;
        }
    };



    handleCancel = () => {
        this.setState({
            infoBoxVisible: false,
        });
    }

    picModalHandleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, totalPlaneFileList, birdsViewFileList, singleEffectFileList, planFileList, scenePicFileList, keyPlanFileList, otherFileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

        const totalPlaneProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        totalPlaneFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ totalPlaneFileList }) => ({
                        totalPlaneFileList: [...totalPlaneFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.totalPlaneFileList,
        };

        const birdsViewProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        birdsViewFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ birdsViewFileList }) => ({
                        birdsViewFileList: [...birdsViewFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.birdsViewFileList,
        };

        const singleEffectProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        singleEffectFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ singleEffectFileList }) => ({
                        singleEffectFileList: [...singleEffectFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.singleEffectFileList,
        };

        const planProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        planFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ planFileList }) => ({
                        planFileList: [...planFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.planFileList,
        };

        const scenePicProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        scenePicFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ scenePicFileList }) => ({
                        scenePicFileList: [...scenePicFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.scenePicFileList,
        };

        const keyPlanProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        keyPlanFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ keyPlanFileList }) => ({
                        keyPlanFileList: [...keyPlanFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.keyPlanFileList,
        };

        const otherProps = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
                if (file['url']) {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/deletePic`,
                        payload: {
                            planfileId: file.uid
                        }
                    });
                }

                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        otherFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                const fileSize = file.size / 1024 / 1024 < 3;
                if (!fileSize) {
                    message.error('文件必须小于3M!');
                    return false;
                }
                var me = this;

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    file.thumbUrl = this.result;
                    me.setState(({ otherFileList }) => ({
                        otherFileList: [...otherFileList, file],
                    }));
                }
                return false;
            },
            fileList: this.state.otherFileList,
        };



        return (

            <div>
                <MyBreadcrumb itemList={['规划成果', '成果管理', '项目详情']} >
                    <Button
                        key='btnAdd'
                        style={{ marginLeft: '5px' }}
                        type="primary"
                        icon="upload"
                        onClick={this.handleSubmit}>
                        提交</Button>
                </MyBreadcrumb>

                <Form>
                    <OpenFormItemGroup title='规划块信息'>
                        <FormItem key='regplanId' colSpans={1} label='规划块编号'>
                            {getFieldDecorator('regplanId', { initialValue: '', rules: [{ required: true, max: 50, message: '请正确填写规划块编号' }], })(
                                <Input id='regplanId' onClick={() => {
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


                        <FormItem key='remark' colSpans={3} label='备注'>
                            {getFieldDecorator('remark', { initialValue: '', rules: [{ required: false, max: 255, message: '请正确填写备注' }], })(
                                <Input.TextArea id='remark' autosize={{ minRows: 2, maxRows: 10 }} />
                            )}
                        </FormItem>
                    </OpenFormItemGroup>

                    <OpenFormItemGroup title='成果图展示'>
                        <Modal visible={previewVisible} footer={null} onCancel={this.picModalHandleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                        <FormItem key='totalPlaneFile' label="总平图" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('totalPlaneFile', {
                                rules: [{ required: this.state.totalPlaneFileList ? false : true, message: '请上传总平图' }],
                            })(
                                <Upload  {...totalPlaneProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {totalPlaneFileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem key='birdsViewFile' label="鸟瞰图" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('birdsViewFile', {
                                rules: [{ required: this.state.birdsViewFileList ? false : true, message: '请上传鸟瞰图' }],
                            })(
                                <Upload  {...birdsViewProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {birdsViewFileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem key='singleEffectFile' label="单体效果图" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('singleEffectFile', {
                                rules: [{ required: this.state.singleEffectFileList ? false : true, message: '请上传单体效果图' }],
                            })(
                                <Upload  {...singleEffectProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {singleEffectFileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem key='planFile' label="规划图" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('planFile', {
                                rules: [{ required: this.state.planFileList ? false : true, message: '请上传规划图' }],
                            })(
                                <Upload  {...planProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {planFileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem key='scenePicFile' label="现场照片" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('scenePicFile ', {
                                rules: [{ required: this.state.scenePicFileList ? false : true, message: '请上传现场照片' }],
                            })(
                                <Upload  {...scenePicProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {scenePicFileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem key='keyPlanFile' label="重点规划" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('keyPlanFile ', {
                                rules: [{ required: this.state.keyPlanFileList ? false : true, message: '请上传重点规划图' }],
                            })(
                                <Upload  {...keyPlanProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {keyPlanFileList.length >= 5 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem key='otherFile' label="其他" colSpans={3}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                            {getFieldDecorator('otherFile', {
                                rules: [{ required: this.state.otherFileList ? false : true, message: '请上传其他种类图片' }],
                            })(
                                <Upload  {...otherProps}
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {otherFileList.length >= 5 ? null : uploadButton}
                                </Upload>
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
        picList: state[colConfig.pageTag].picList,
    };
}

const WrappedDetailPage = Form.create({

    mapPropsToFields: props => {
        if (props.location.state && props.location.state.detailType !== 'add') { //新增的时候不进行数据链接
            let obj = {};
            let detailData = props.curDetail[0];
            for (let key in detailData) {
                const config = colConfig.fieldInfo[key];
                if (!config) continue;
                if (config.dataType === '日期' || config.dataType === '时间') {
                    obj[key] = Form.createFormField({
                        key,
                        value: moment(detailData[key])
                    })
                }
                else if (config.controlType === '下拉列表-级联') {
                    obj[key] = Form.createFormField({
                        key,
                        value: getTreePathByPid(detailData[key])
                    })
                }
                else {
                    obj[key] = Form.createFormField({
                        key,
                        value: detailData[key]
                    })
                }

            }

            return obj;
        }
    }
})(DetaiPage);

export default connect(mapStateToProps)(WrappedDetailPage);
