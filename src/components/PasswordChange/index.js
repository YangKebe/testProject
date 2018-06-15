import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import PopupItemGroup from '../PopupItemGroup';

const FormItem = Form.Item;

/**
 * 通用密码修改弹出窗
 */
class PasswordChange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userId: ''
        }
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('modal_newPassword')) {
            callback('2次密码输入不一致!');
        } else {
            callback();
        }
    };
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && form.getFieldValue('modal_okPassword')) {
            form.validateFields(['modal_okPassword'], { force: true });
        }
        callback();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.showModal !== this.props.showModal) {
            this.setState({
                showModal: nextProps.showModal
            });
        }
    }

    modalCancel = () => {
        this.props.form.setFieldsValue({
            modal_oldPassword: '',
            modal_newPassword: '',
            modal_okPassword: '',
        });

        this.setState({
            showModal: false,
        });
    }

    /**
     * 生成子项
     */
    getFields() {
        const subControls = React.Children.map(this.props.children, (formItem, index) => {
            return (
                <div key={`groupItem_${index}`}>
                    {formItem}
                </div>
            );
        });
        return subControls;
    }

    onOk = () => {
        const userId = this.props.form.getFieldValue('modal_userId');
        const oldPwd = this.props.form.getFieldValue('modal_oldPassword');
        const newPwd = this.props.form.getFieldValue('modal_newPassword');

        this.props.onOk(userId, oldPwd, newPwd);
        this.modalCancel();
    }

    onClick = () => {
        this.state.userId = this.props.myClick();
        this.setState({ showModal: true });
    }


    render() {
        const formStyle = {
            padding: '12px',
            background: 'white'
        };
        const { onOk, disabled, myClick } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <div style={{ display: 'inline-block' }}>
                <Button
                    icon={this.props.icon}
                    size={this.props.size}
                    type="primary"
                    disabled={disabled}
                    style={this.props.style}
                    onClick={this.onClick}>修改密码</Button>
                <Modal
                    visible={this.state.showModal}
                    title='修改密码'
                    onOk={this.onOk}
                    onCancel={this.modalCancel}
                    okText='确定'
                    cancelText='取消'
                >
                    <Form>
                        <PopupItemGroup>
                            <FormItem label='用户账号'>
                                {getFieldDecorator('modal_userId', { initialValue: this.state.userId, rules: [{ required: true }], })(
                                    <Input placeholder="" disabled={true} />
                                )}
                            </FormItem>
                            <FormItem label='原密码'>
                                {getFieldDecorator('modal_oldPassword', { rules: [{ required: true, message: '请输入' }] })(
                                    <Input placeholder="请输入原密码" type="password" />
                                )}
                            </FormItem>
                            <FormItem label='新密码'>
                                {getFieldDecorator('modal_newPassword', {
                                    rules: [{ required: true, message: '请输入' }, {
                                        validator: this.checkConfirm,
                                    }]
                                })(
                                    <Input placeholder="请输入新密码" type="password" />
                                )}
                            </FormItem>

                            <FormItem colSpans={2} label='确认密码'>
                                {getFieldDecorator('modal_okPassword', {
                                    rules: [{ required: true, message: '请输入' }, {
                                        validator: this.checkPassword,
                                    }]
                                })(
                                    <Input placeholder="请确认新密码" type="password" />
                                )}
                            </FormItem>
                        </PopupItemGroup>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const WrappedPasswordChangeForm = Form.create()(PasswordChange);

export default WrappedPasswordChangeForm;
