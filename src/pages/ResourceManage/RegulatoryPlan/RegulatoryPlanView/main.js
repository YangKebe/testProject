// import React from 'react';
// import { connect } from 'dva';
// import { Modal, Button, Table, Divider } from 'antd';
// import styles from './main.less';
// import colConfig from './config.json';
// import request from '/utils/request';
// import RegulatoryPlanModal from './modal.js';

// const bmapId = "bmap";

// class Main extends React.PureComponent {

//   constructor(props) {
//     super(props);
//     //控件里的地图
//     this.map = {};
//     this.state = { 
//       infoBoxVisible: false,
//       pointsList: null,
//       regPlanId: null
//     }
//   }

//   componentWillReceiveProps(nextProps){
//     this.map.clearOverlays()
//     /* regplanIdList存放所有regplanId */
//     let that = this;
//     let regplanIdList = [];
//     nextProps.pointsList.map(item => {
//       if(regplanIdList.length == 0){
//         regplanIdList.push(item.regplanId);
//       }
//       regplanIdList.map(item1 => {
//         if(!regplanIdList.includes(item.regplanId))
//         {
//           regplanIdList.push(item.regplanId);
//         }
//       })
//     })
//     regplanIdList.map(item => {
//       let curPoint = this.dealData(item,nextProps.pointsList);
//       let coordinatePointArray = [];
//       let coordinate = curPoint.map(curPointItem => {
//         coordinatePointArray.push(new BMap.Point(curPointItem.lon,curPointItem.lat));
//       });

//       var polygon = this.createArea(coordinatePointArray);
//       polygon.addEventListener("click", function (e) {
//         that.props.dispatch({
//           type: `${colConfig.pageTag}/queryModal`,
//           payload: {
//               pageNum: 1,
//               pageSize: 6,
//               regPlanId: item,
//           }
//         });

//         that.props.dispatch({
//           type: `${colConfig.pageTag}/queryPic`,
//           payload: {
//               pageNum: 1,
//               pageSize: 6,
//               regPlanId: item,
//               fileClass: '规划图',
//           }
//         });

//         that.setState({
//           infoBoxVisible: true,
//           regPlanId: item,
//         });
//       });
//       this.map.addOverlay(polygon);
//     })
//   }

//   componentDidMount() {
//     try {
//       var BMap = window.BMap;
//       console.log(1)
//       this.map = new BMap.Map(bmapId, { minZoom: 5, maxZoom: 16 });
//       console.log(2)
//       this.map.centerAndZoom(new BMap.Point(120.199301, 33.313244), 13); // 初始化地图,设置中心点坐标和地图级别
//       this.map.enableContinuousZoom(true);    // 开启连续缩放效果
//       this.map.enableInertialDragging(true);　// 开启惯性拖拽效果
//       this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
//       //this.map.addControl(new BMap.NavigationControl({ type: BMAP_NAVIGATION_CONTROL_ZOOM }));
//       // this.map.addControl(new BMap.NavigationControl({ type: BMAP_NAVIGATION_CONTROL_ZOOM }));
//       var map = this.map;

//       // var geolocation = new BMap.Geolocation();
//       // geolocation.getCurrentPosition(function (r) {
//       //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//       //         var mk = new BMap.Marker(r.point);
//       //         map.panTo(r.point);
//       //     }
//       //     else {

//       //     }
//       // });


//       var tilelayer = new BMap.TileLayer();         // 创建地图层实例
//       tilelayer.getTilesUrl = function (pixle, zoom) {             // 设置图块路径

//         return `/tiles/${zoom}/tile${pixle.x}_${pixle.y}.png`;

//         // return require("/assets/yay.jpg")
//       };
//       map.addTileLayer(tilelayer);                // 将图层添加到地图上


//       let that = this;

//       this.getAllPoints();

//     } catch (e) {
//     }
//   }

//   handleCancel = () => {
//     this.setState({
//       infoBoxVisible: false,
//     });
//   }

//   /* 获取所有的点用来画区块 */
//   getAllPoints = () => {
//     this.props.dispatch({
//       type: `${colConfig.pageTag}/queryPoints`,
//       payload:{
//        pageNum: 0,
//        pageSize: 0
//       }
//     });
//   }

//   /* 将所有的点根据regplanId区分开 */
//   dealData = (regplanId,pointList) => pointList.filter(curValue => curValue.regplanId == regplanId);
  

//   /* 创建多边形 */
//   createArea = (points) => new BMap.Polygon(points, { strokeColor: "#f50704", fillColor: "#cfcfcf", strokeWeight: 5, strokeOpacity: 0, fillOpacity: 0, });


//   render() {
//     return (
//       <div className={styles.map}>
//         <div id={bmapId} className={styles.map}>
//         </div>
//         <RegulatoryPlanModal 
//           visible={this.state.infoBoxVisible} 
//           close={this.handleCancel} 
//           dataSource={this.props.modalDataList}
//           pageSize={this.props.pageSize}
//           total={this.props.total}
//           pageNum={this.props.pageNum}
//           pagination={{pageSize: this.props.pageSize, total: this.props.total,current:this.props.pageNum,}}
//           regPlanId={this.state.regPlanId}
//           planfileId={this.props.planfileId}
//         />
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     pointsList: state[colConfig.pageTag].pointsList,
//     modalDataList: state[colConfig.pageTag].modalDataList,
//     pageSize: state[colConfig.pageTag].pageSize,
//     total: state[colConfig.pageTag].total,
//     pageNum: state[colConfig.pageTag].pageNum, 
//     planfileId: state[colConfig.pageTag].planfileId, 
//   };
// }

// export default connect(mapStateToProps)(Main);
