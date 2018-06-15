import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, DatePicker, Table, Upload, Icon, Popconfirm, Modal, message } from 'antd';
import OpenFormItemGroup from '/components/OpenFormItemGroup';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData, { getSelectionsByPid, getDicNameById, getSelectionsTreeByPid, getTreePathByPid } from '/project.config';
import colConfig from './config.json';
import InputFromTree from '/components/InputFromTree'
import globalConfig from '/project.config.json';
import { indexClassConvertCh,indexClassConvertNum  } from '/utils/utils';


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
            tableData: [],
            state: null,
            SubInfoModalVisible: false,
            changeModalValue: null,
            regplanIdShow: false,
            indexClassShow: false,
            indexClassValue: null,
            regplanIdValue: null,
            fileList: [],
            previewVisible: false,
            previewImage: '',
            btnVisible: true,
        }
    }

    //在组件创建时，render渲染之前，初始化状态
    componentWillMount() {
        isFirstIn = 0;
        if (this.props.location.state.detailType === 'modify') {
            //规划快编号和指标分类作为主键不能修改
            this.state.regplanIdShow = true;
            this.state.indexClassShow = true;
            this.state.btnVisible = false;

            this.setState({
                indexClassValue: this.props.curDetail.indexClass,
                regplanIdValue: this.props.curDetail.regplanId,
            })
        }
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

                newValues = {
                    ...newValues,
                    dataStatus: 1
                }
                newValues['indexClass'] = indexClassConvertNum(newValues['indexClass']);

                const formData = new FormData();
                this.state.fileList.forEach((file) => {
                  if (!file['url']) {
                    formData.append('filePath', file);
                  }
                });
                formData.append('content', JSON.stringify(newValues))

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
            if (nextProps.picList && nextProps.picList.length > 0 && isFirstIn == 0) {
                let picListArr = nextProps.picList.filter(item => item.fileClass == '规划图');
                if(picListArr && picListArr.length > 0) {
                    isFirstIn ++;
                    let fileList = picListArr;
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
                    this.setState({
                        fileList: fileArray
                    })
                }
            }
        }
    }


    /**
    * 双击进入子表信息详情
    */
    onRowDoubleClick = (record, index, event) => {
        let chooseRecord = null;
        this.state.tableData.map((item, index) => {
            if (item.subInfoId == record.subInfoId) {
                chooseRecord = item;
            }
        });
        this.setState({
            changeModalValue: chooseRecord,
            SubInfoVisible: true
        })
    };
    

    /**
    * 关闭弹窗
    */
    closeSubInfoMoadlVisible = () => {
        this.setState({
            SubInfoModalVisible: false,
        });
    };

    /**
     * 删除一条问题记录
     * */
    onDelete(index) {
        const tableData = [...this.state.tableData];
        tableData.splice(tableData.indexOf(index), 1);//index为获取的索引，后面的 1 是删除几行
        this.setState({ tableData });
    }


    onCheck = checkedKeys => this.setState({ checkedKeys });

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        const columns = [{
            title: '地块编码',
            dataIndex: 'a',
            key: 'a',
            width: '6%',
        }, {
            title: '用地代码',
            dataIndex: 'b',
            key: 'b',
            width: '6%',
        }, {
            title: '用地性质',
            dataIndex: 'c',
            key: 'c',
            width: '6%',
        }, {
            title: '地块面积(公顷)',
            dataIndex: 'd',
            key: 'd',
            width: '8%',
        }, {
            title: '容积率',
            dataIndex: 'e',
            key: 'e',
            width: '5%',
        }, {
            title: '建筑密度',
            dataIndex: 'f',
            key: 'f',
            width: '6%',
        }, {
            title: '建筑控制高度',
            dataIndex: 'g',
            key: 'g',
            width: '8%',
        }, {
            title: '绿地率',
            dataIndex: 'h',
            key: 'h',
            width: '5%',
        }, {
            title: '建议居住人口',
            dataIndex: 'i',
            key: 'i',
            width: '8%',
        }, {
            title: '出入口方位',
            dataIndex: 'j',
            key: 'j',
            width: '7%',
        }, {
            title: '停车位',
            dataIndex: 'k',
            key: 'k',
            width: '5%',
        }, {
            title: '地下空间利用',
            dataIndex: 'l',
            key: 'l',
            width: '8%',
        }, {
            title: '现状',
            dataIndex: 'm',
            key: 'm',
            width: '4%'
        }, {
            title: '配建设施',
            dataIndex: 'n',
            key: 'n',
            width: '6%'
        }, {
            title: '　操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '6%',
            render: (text, record) => {
                return (
                    <Popconfirm title="请确认是否删除？" cancelText="取消" okText="确定" onConfirm={() => {
                        this.onDelete(record);
                    }
                    }>
                        <Button>删除</Button>
                    </Popconfirm>
                );
            },
        }];

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

        const props = {
            action: '',
            accept: 'image/*',
            onRemove: (file) => {
              if(file['url']) {
                this.props.dispatch({
                    type: `${colConfig.pageTag}/deletePic`,
                    payload: {
                        planfileId:  file.uid
                    }
                });
              }

              this.setState(({ fileList }) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return {
                  fileList: newFileList,
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
                me.setState(({ fileList }) => ({
                  fileList: [...fileList, file],
                }));
              }
              return false;
            },
            fileList: this.state.fileList,
          };

        return (

            <div>
                <MyBreadcrumb itemList={['资源管理','控制性规划', '控规管理']} >
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
                        <FormItem key='regplanId' colSpans={1} label='规划块编号'>
                            {getFieldDecorator('regplanId', { initialValue: '', rules: [{ required: true, min: 1, max: 100, message: '请正确填写规划块编号' }], })(
                                <Input id='regplanId' disabled={this.state.regplanIdShow}/>
                            )}
                        </FormItem>
                        <FormItem key='regplanName' colSpans={1} label='规划块名称'>
                            {getFieldDecorator('regplanName', { initialValue: '', rules: [{ required: true, min: 1, max: 100, message: '请正确填写规划块名称' }], })(
                                <Input id='regplanName' />
                            )}
                        </FormItem>
                        <FormItem key='siteNature' colSpans={1} label='用地性质'>
                            {getFieldDecorator('siteNature', { initialValue: '', rules: [{ required: true, max: 32, message: '请正确填写用地性质' }], })(
                                <Input id='siteNature' />
                            )}
                        </FormItem>
                        <FormItem key='indexClass' colSpans={1} label='指标分类'>
                            {getFieldDecorator('indexClass', { initialValue: '', rules: [{ required: true, max: 10, message: '请正确填写指标分类' }], })(
                                <Select disabled={this.state.indexClassShow}>
                                    <Select.Option value="1">规划指标</Select.Option>
                                    <Select.Option value="2">实施指标</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem key='siteArea' colSpans={1} label='用地面积'>
                            {getFieldDecorator('siteArea', { initialValue: '', rules: [{ required: false, message: '请正确填写用地面积' }], })(
                                <Input id='siteArea' />
                            )}
                        </FormItem>
                        <FormItem key='buildingHeightLimit' colSpans={1} label='建筑限高'>
                            {getFieldDecorator('buildingHeightLimit', { initialValue: '', rules: [{ required: false, message: '请正确填写建筑限高', pattern: /^(^\d+$)/ }], })(
                                <Input id='buildingHeightLimit' />
                            )}
                        </FormItem>
                        <FormItem key='far' colSpans={1} label='容积率'>
                            {getFieldDecorator('far', { initialValue: '', rules: [{ required: false, message: '请正确填写容积率', pattern: /^(^\d+$)/ }], })(
                                <Input id='far' />
                            )}
                        </FormItem>
                        <FormItem key='peopleNum' colSpans={1} label='人口容量'>
                            {getFieldDecorator('peopleNum', { initialValue: '', rules: [{ required: false, message: '请正确填写人口容量', pattern: /^(^\d+$)/ }], })(
                                <Input id='peopleNum' />
                            )}
                        </FormItem>
                        <FormItem key='carParkInfo' colSpans={1} label='停车指标'>
                            {getFieldDecorator('carParkInfo', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写停车指标' }], })(
                                <Input id='carParkInfo' />
                            )}
                        </FormItem>
                        <FormItem key='siteLengthWidth' colSpans={1} label='地块长宽'>
                            {getFieldDecorator('siteLengthWidth', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写地块长宽' }], })(
                                <Input id='siteLengthWidth' />
                            )}
                        </FormItem>
                        <FormItem key='buildingDensity' colSpans={1} label='建筑密度'>
                            {getFieldDecorator('buildingDensity', { initialValue: '', rules: [{ required: false, message: '请正确填写建筑密度' }], })(
                                <Input id='buildingDensity' />
                            )}
                        </FormItem>
                        <FormItem key='otherInfo' colSpans={1} label='其他信息'>
                            {getFieldDecorator('otherInfo', { initialValue: '', rules: [{ required: false, max: 50, message: '请正确填写其他信息' }], })(
                                <Input id='otherInfo' />
                            )}
                        </FormItem>
                        <FormItem key='remark' colSpans={3} label='备注'>
                            {getFieldDecorator('remark', { initialValue: '', rules: [{ required: false, max: 255, message: '请正确填写备注' }], })(
                                <Input.TextArea id='remark' autosize={{ minRows: 2, maxRows: 10 }} />
                            )}
                        </FormItem>
                    </OpenFormItemGroup>

                    <OpenFormItemGroup title='控制性规划图'>
                        <div>
                            <FormItem key='filePath' label="控制性规划图" span={24}>
                            <div>（大小不能超过3MB ，比例3*4）</div>
                                {getFieldDecorator('filePath', {
                                rules: [{ required: true, message: '请上传规划图' }],
                                })(
                                <Upload  {...props} 
                                    onPreview={this.handlePreview}
                                    listType="picture-card">
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                     <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </FormItem>
                        </div>
                    </OpenFormItemGroup>

                    <OpenFormItemGroup title='分地块管理'>
                        <Button disabled={this.state.btnVisible} onClick={() => {
                            this.props.history.push({
                                pathname: "/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanSubManage",
                                state: {
                                    indexClass: this.props.curDetail.indexClass,
                                    regplanId: this.props.curDetail.regplanId
                                }
                            });
                        }}>分地块管理</Button>
                    </OpenFormItemGroup>
                </Form>
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
                    if(key == 'indexClass') {
                        obj[key] = Form.createFormField({
                            key,
                            value: indexClassConvertCh(props.curDetail[key])
                        }) 
                    }else {
                        obj[key] = Form.createFormField({
                            key,
                            value: props.curDetail[key]
                        }) 
                    }
                }

            }

            return obj;
        }
    }
})(DetaiPage);

export default connect(mapStateToProps)(WrappedDetailPage);
