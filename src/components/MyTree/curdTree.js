import React from 'react';
import { Tree, Input, Icon, Tooltip } from 'antd';
import styles from './curdTree.css';
import { arrayToTree } from './treeUtils';
import PropTypes from 'prop-types';

const TreeNode = Tree.TreeNode;

class CurdTree extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            curSelectedNode: null,
            expandedKeys: [],
        }

        this.searchKey = ''; //当前的搜索关键字
        this.searchExpandKeys = [];
        this.leafArray = []; //叶子节点的key集合
        this.treeArray = arrayToTree(props.treeData, this.leafArray, this.props.fieldMatch.id, this.props.fieldMatch.pId,'children',true);
        this.initTreeNode(props);
    }

    static propTypes = {
        treeData: PropTypes.array, //树的数据源
        fieldMatch: PropTypes.object, //字段匹配规则（要求分别匹配id,pId和name）
        onClickNode: PropTypes.func,
        editFn: PropTypes.func,
        addFn: PropTypes.func,
        removeFn: PropTypes.func,
    }

    static defaultProps = {
        hideFunIcon: false, //隐藏功能图标
        treeData: [], //树的数据源
        fieldMatch: { id: 'id', pId: 'pId', name: 'name' },
        onClickNode: () => console.log('点击节点事件'),
        editFn: () => console.log('编辑节点'),
        addFn: () => console.log('增加末端节点'),
        removeFn: () => console.log('移除末端节点'),
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.treeData !== this.props.treeData) {
            this.treeArray = arrayToTree(nextProps.treeData, this.leafArray, nextProps.fieldMatch.id, nextProps.fieldMatch.pId,'children',true);
            this.initTreeNode(nextProps);
        }
    }

    initTreeNode = (props) => {
        this.treeNodes = this.treeArray.length > 0 ? this.getTreeNodes(this.treeArray, this.searchKey) : [];
    }

    /**
     * 基于树状数据生成TreeNode对象
     * @param {*} treeArray 树的平铺数据
     * @param {*} searchKey 当前搜索关键字
     */
    getTreeNodes = (treeArray, searchKey) => {
        let result = [];

        let endNodeSelected = this.state.curSelectedNode && !this.state.curSelectedNode.children;
        let leafNodeSelected = this.state.curSelectedNode && this.state.curSelectedNode.children;

        treeArray.forEach(item => {

            let titleStr = <span>{item[this.props.fieldMatch.name]}</span>;

            //搜索关键字高亮处理
            if (searchKey) {
                let index = item[this.props.fieldMatch.name].indexOf(searchKey);
                const beforeStr = item[this.props.fieldMatch.name].substr(0, index);
                const afterStr = item[this.props.fieldMatch.name].substr(index + searchKey.length);

                if (index > -1) {
                    // this.searchExpandKeys.push(item[this.props.fieldMatch.pId]);
                    this.searchExpandKeys=this.searchExpandKeys.concat(item['treePath']);
                    titleStr =
                        (<span>
                            {beforeStr}
                            <span style={{ color: '#f50' }}>{searchKey}</span>
                            {afterStr}
                        </span>);
                }
            }

            //构造标题元素
            const titleEle =
                (<div
                    style={{ verticalAlign: 'center' }}
                    onClick={() => {
                        this.setState({ curSelectedNode: { ...item } });
                        // this.props.onClickNode(item);
                    }}
                >
                    {titleStr}
                </div>);


            result.push(
                <TreeNode
                    key={item[this.props.fieldMatch.id]}
                    title={titleEle}
                >
                    {item.children && this.getTreeNodes(item.children, searchKey)}
                </TreeNode>
            );
        });
        return result;
    }

    /**
     * 搜索栏enter时
     */
    onSearch = searchKey => {
        if (this.searchKey !== searchKey) {
            this.searchKey = searchKey;
            this.searchExpandKeys = []; //重置
            this.initTreeNode(this.props);
            let newArray = this.searchExpandKeys.length > 0 ? Array.from(new Set(this.searchExpandKeys)) : [];
            this.setState({
                expandedKeys: newArray,
            });
        }
    }


    render() {
        const Search = Input.Search;
        const leafNodeSelected = this.state.curSelectedNode && !!this.state.curSelectedNode.children;
        const endNodeSelected = this.state.curSelectedNode && !this.state.curSelectedNode.children;
        return (
            <div>
                <div className={styles.headerBar}>
                    <Search
                        style={{ marginBottom: 8, marginTop: 10 }}
                        placeholder="请输入搜索内容"
                        onSearch={value => this.onSearch(value)}
                    />
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
                            onClick={() => this.setState({ expandedKeys: [] })}
                        />
                    </Tooltip>
                </div>
                <div
                    style={{ position: 'relative'}}
                >
                    <div className={styles.funBtns} style={{ visibility: this.props.hideFunIcon ? 'hidden' : 'visible' }}>
                        <Icon
                            type="edit"
                            className={styles.funBtn}
                            style={{ display: endNodeSelected ? '' : 'none' }}
                            onClick={e => this.props.editFn(e, this.state.curSelectedNode)}
                        />
                        <Icon
                            type="plus-circle-o"
                            className={styles.funBtn}
                            onClick={e => {
                                this.props.addFn(e, this.state.curSelectedNode)
                            }
                            }
                        />
                        <Icon
                            type="minus-circle-o"
                            className={styles.funBtn}
                            style={{ display: endNodeSelected ? '' : 'none' }}
                            onClick={e => this.props.removeFn(e, this.state.curSelectedNode)}
                        />
                    </div>
                    <Tree
                        showLine
                        onExpand={keys => this.setState({ expandedKeys: keys })}
                        // defaultExpandAll={!this.searchKey}
                        expandedKeys={this.state.expandedKeys}
                        onSelect={(selectedKeys, e) => {
                            let curSelectedNode = this.props.treeData.find(item => item[this.props.fieldMatch['id']] === selectedKeys[0]);

                            this.setState({ curSelectedNode: curSelectedNode });
                            this.props.onClickNode(curSelectedNode, e.selected);
                        }}
                    >
                        {this.treeNodes}
                    </Tree>
                </div>
            </div>
        );
    }
}

export default CurdTree;
