

import React from 'react';
import PropTypes from 'prop-types'

class RandomImg extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            vCode: Math.random(),
        }
    }

    render() {
        const { rootUrl } = this.props;
        return (
            <img
                style={{ marginLeft: '3px', verticalAlign: 'middle', height: '32px' }}
                src={rootUrl + this.state.vCode}
                alt={'无图片'}
                onClick={() => this.setState({ vCode: Math.random() })}
            />
        );
    }
}


RandomImg.propTypes = {
    rootUrl: PropTypes.string,
  };

export default RandomImg;