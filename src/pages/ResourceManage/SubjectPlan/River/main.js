import React from 'react';
import { connect } from 'dva';

class Main extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const img = "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3478411035,1346596543&fm=200&gp=0.jpg";
    return (
      <div className="infoImg">
        <img src={img} style={{height:'800px',width:'1600px'}}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Main);
