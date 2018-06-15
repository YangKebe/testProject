import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'dva/router';


/**
 * 说明LoginControl组件，在系统中只能出现一次
 */
export var stateControl = null;

class LoginControl extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            isLogin: false,
        }
        this.refresh = this.refresh.bind(this);
        stateControl = this.refresh;
    };

    static propTypes = {
        welcomePage: PropTypes.element,
        loginPage: PropTypes.element,
    };

    static defaultProps = {
        welcomePage: <div>Welcome! Please wait!</div>,
        loginPage: <div>Error! Login page not founded!</div>
    };

    refresh(newState) {
        this.setState(newState);
    }

    render() {
        if (!this.state.isReady) {
            return this.props.welcomePage;
        } else if (!this.state.isLogin) {
            return this.props.loginPage
        }
        return this.props.children;
    }
}

export default withRouter(LoginControl);