import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import { connect } from 'dva';

class LoginControl extends React.Component {

    static propTypes = {
        welcomePage: PropTypes.element,
        loginPage: PropTypes.element,
    };

    static defaultProps = {
        welcomePage: <div>Welcome! Please wait!</div>,
        loginPage: <div>Error! Login page not founded!</div>
    };

    render() {
        
        if (!this.props.isReady) {
            return this.props.welcomePage;
        } else if (!this.props.isLogin) {
            return this.props.loginPage;
        }

        return this.props.children;
    }
}

function mapStateToProps(state) {
    return {
        isReady: state.login.isReady,
        isLogin: state.login.isLogin,
    };
}

export default withRouter(connect(mapStateToProps)(LoginControl));
