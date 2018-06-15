import React from 'react';
import { Modal, Tree, Button, Icon, Tooltip } from 'antd';
import { arrayToTree } from './treeUtils';
import styles from './curdTree.css';

const TreeNode = Tree.TreeNode;

/**
 * 用于弹出窗中的输入项的显示
 */
class PopTreeSelect extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            checkedKeys: [],
            expandedKeys: []
        }
        this.leafArray = [];
        this.searchKey = '';
        this.treeArray = arrayToTree(this.props.treeData, this.leafArray, this.props.fieldMatch.id, this.props.fieldMatch.pId);
        this.treeNodes = this.getTreeNodes(this.treeArray);
    }


    static defaultProps = {
        treeData: [], //树的数据源
        fieldMatch: { id: 'id', pId: 'pId', name: 'name' },
        onSelect: () => console.log('点击节点事件'),
        onBtnClick: () => { }, //点击按钮时外面的响应事件
        title: '请选择：',
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.treeData != this.props.treeData) {
            this.treeArray = arrayToTree(nextProps.treeData, this.leafArray, nextProps.fieldMatch.id, nextProps.fieldMatch.pId);
            this.treeNodes = this.getTreeNodes(this.treeArray);
        }

        if (nextProps.selectedKeys != this.props.selectedKeys) {
            this.setState({
                checkedKeys: nextProps.selectedKeys,
            });
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


    render() {
        const { treeData, selectedKeys, onBtnClick, fieldMatch, title, onSelect, ...restProps } = this.props;

        return (
            <div style={{ display: 'inline-block' }}>
                <Button
                    size='small'
                    icon="setting"
                    {...restProps}
                    onClick={() => {
                        onBtnClick();
                        this.setState({ modalVisible: true });
                    }}
                >
                    {this.props.children || '选择'}
                </Button>
                <Modal
                    title={title}
                    cancelText='取消'
                    okText='确定'
                    visible={this.state.modalVisible}
                    onOk={() => {
                        onSelect(this.state.checkedKeys);
                        this.setState({ modalVisible: false });
                    }}
                    onCancel={() => this.setState({ modalVisible: false })}
                >
                    <div style={{ position: 'relative', height: '50vh', overflow: 'auto' }}>
                        <div className={styles.funBtns} style={{ paddingRight: '30px' }}>
                            <Tooltip title='全部展开'>
                                <Icon
                                    type="menu-fold"
                                    className={styles.headIcon}
                                    onClick={() => this.setState({ expandedKeys: this.leafArray })}
                                />
                            </Tooltip>
                            <Tooltip title='全部折叠'>
                                <Icon
                                    type="menu-unfold"
                                    className={styles.headIcon}
                                    style={{ marginLeft: '20px' }}
                                    onClick={() => this.setState({ expandedKeys: [] })}

                                />
                            </Tooltip>
                        </div>
                        <Tree
                            showLine
                            checkable={true}
                            checkedKeys={this.state.checkedKeys}
                            onExpand={keys => this.setState({ expandedKeys: keys })}
                            expandedKeys={this.state.expandedKeys}
                            onCheck={(checkedKeys, e) => this.setState({ checkedKeys })}>
                            {this.treeNodes}
                        </Tree>
                    </div>
                </Modal>
            </div>

        );
    }
}

export default PopTreeSelect;
