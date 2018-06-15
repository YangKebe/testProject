# 基于ant design 树组件的封装，支持以下几种
- 增删改查树:
    - 常用于对机构的管理
    - 用法：import {curdTree} from './components/MyTree'

- 多选树面板
    - 常用于人员选择，带搜索，可取消
    - 用法 import {checkedTreePanel} from './components/MyTree'

- 多选树面板-简约版
    - 封装了一个带modal的button,弹出多选树,常用于角色对菜单的选择
    - 用法 import {btnTree} from './components/MyTree'

- 单选树弹窗
    - 从树中选出一个末端节点
    - 用法 import {treeSelectModal} from './components/MyTree'