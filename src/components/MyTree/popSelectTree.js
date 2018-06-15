import React from 'react';
import { Form, Modal, Tree } from 'antd';
import { arrayToTree } from './treeUtils';

const TreeNode = Tree.TreeNode;

/**
 * 用于弹出窗中的输入项的显示
 */
class PopTreeSelect extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: !!this.props.showModal,
            checkedKeys: this.props.checkedKeys,
        }
    }


    static defaultProps = {
        treeData: [], //树的数据源
        fieldMatch: { id: 'id', pId: 'pId', name: 'name' },
        onOk: () => console.log('点击节点事件'),
        showModal: false,
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.checkedKeys != this.props.checkedKeys) {
            this.setState(
                {
                    checkedKeys: nextProps.checkedKeys
                }
            );
        }
        
        if (nextProps.showModal != this.state.modalVisible) {
            this.setState(
                {
                    modalVisible: !!nextProps.showModal
                }
            );
        }
    }

    /**
     * 基于树状数据生成TreeNode对象
     * @param {*} treeArray 树的平铺数据
     */
    getTreeNodes = (treeArray) => {
        let result = [];

        treeArray.forEach(item => {

            result.push(
                <TreeNode
                    key={item[this.props.fieldMatch.id]}
                    title={item[this.props.fieldMatch.name]}
                >
                    {item.children && this.getTreeNodes(item.children)}
                </TreeNode>
            );
        });
        return result;
    }


    onCheck = (checkedKeys, e) => {this.setState({checkedKeys});}

    onOk = () => {
        this.props.onOk(this.state.checkedKeys);
        this.setState({
            modalVisible: false
        })
    }

    render() {
        let treeArray = arrayToTree(this.props.treeData, null, this.props.fieldMatch.id, this.props.fieldMatch.pId);
        let treeNodes = this.getTreeNodes(treeArray);
        console.log('treeNodes',treeNodes);
        return (
            <Modal
                title={this.props.title}
                visible={this.state.modalVisible}
                onOk={this.onOk}
                onCancel={this.props.onCancel}
                cancelText="取消"
                okText="确定"
            >
                <Tree
                    showLine
                    checkable={true}
                    onCheck={this.onCheck}
                    defaultExpandAll={true}
                    checkedKeys={this.state.checkedKeys}
                    >
                    {treeNodes}
                </Tree>
            </Modal>

        );
    }
}

export default PopTreeSelect;
