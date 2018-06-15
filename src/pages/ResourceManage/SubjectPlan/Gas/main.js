import React from 'react';
import { connect } from 'dva';

class Main extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const img = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3013977543,561163920&fm=27&gp=0.jpg";
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
