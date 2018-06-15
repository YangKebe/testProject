import React from 'react';
import { connect } from 'dva';

class Main extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const img = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4211649129,236010593&fm=200&gp=0.jpg";
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
