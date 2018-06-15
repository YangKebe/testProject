import React from 'react';
import { Form, Modal, Tree, List } from 'antd';
import { arrayToTree } from './treeUtils';

const TreeNode = Tree.TreeNode;

/**
 * 用于弹出窗中的输入项的显示
 */
class PopTreeSelect extends React.PureComponent {

    constructor(props) {
        super(props);
        this.checkedKeys = [];
        this.state = {
            modalVisible: !!this.props.showModal,
            checkedKeys: []
        }
    }


    static defaultProps = {
        treeData: [], //树的数据源
        fieldMatch: { id: 'id', pId: 'pId', name: 'name' },
        onOk: () => console.log('点击节点事件'),
        showModal: false,
    }

    componentWillReceiveProps(nextProps) {
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


    onCheck = (checkedKeys, e) => {
        this.setState({
            checkedKeys,
        })

    }

    onOk = () => {
        this.props.onOk(this.state.checkedKeys);
        this.setState({
            modalVisible: false
        })
    }

    getListItem = item => {
        const acItem = this.props.treeData.find(the => the[this.props.fieldMatch.id] === item);
        const itemKey = acItem[this.props.fieldMatch.id];
        return (
            <List.Item
                key={itemKey}
                onDoubleClick={() => this.setState({
                    checkedKeys: this.state.checkedKeys.filter(the => the !== itemKey),
                })}>
                {acItem[this.props.fieldMatch.name]}
            </List.Item>)
    }

    render() {
        if (!this.state.modalVisible) return null;
        let treeArray = arrayToTree(this.props.treeData, null,this.props.fieldMatch.id, this.props.fieldMatch.pId);
        let treeNodes = this.getTreeNodes(treeArray);
        return (
            <Modal
                title={this.props.title}
                visible={this.state.modalVisible}
                onOk={this.onOk}
                onCancel={() => { this.setState({ modalVisible: false }) }}
            >
                <div style={{ display: 'flex', height: '45vh' }}>
                    <div style={{ width: '45%', overflow: 'auto', border: '1px solid #DDD' }}>
                        <Tree
                            showLine
                            bordered
                            checkable={true}
                            checkedKeys={this.state.checkedKeys}
                            onCheck={this.onCheck}
                            defaultExpandAll={true}>
                            {treeNodes}
                        </Tree>
                    </div>
                    <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span>=></span></div>
                    <div style={{ width: '45%', overflow: 'auto' }}>
                        <List
                            size="small"
                            style={{ height: '100%' }}
                            bordered
                            split={false}
                            dataSource={this.state.checkedKeys}
                            renderItem={this.getListItem}
                        />
                    </div>
                </div>

            </Modal>

        );
    }
}

export default PopTreeSelect;
