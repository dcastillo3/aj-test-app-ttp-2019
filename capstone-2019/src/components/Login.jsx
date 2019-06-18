import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import NavBar from './NavBar';
import {userLoginThunk} from '../actions/LoginActions';


const mapStates = (state) => {
    return {
        user: state.loginReducer.user,
        login: state.loginReducer.login
    };

}; // end of mapStates


const mapDispatch = (dispatch) => {

    return {
        userLogin: (user) => {
            dispatch(userLoginThunk(user));
        }
    };

}; // end of mapDispatch


class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: ''
        };

    }; // end of constructor


    handleChange = event => {

        this.setState({[event.target.name]: event.target.value })

    }; // end of handleChange


    handleSubmit = () => {

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.userLogin(user);

    }; // end of handleSubmit


    render() {

        return (
            <div>

                <NavBar/>

                <h1> Please Login Below </h1>

                <form name='Login'>
                    <input type='text' name='email' placeholder='Email'
                        onChange={this.handleChange}/> <br/>

                    <input type='password' name='password' placeholer='Password'
                        onChange={this.handleChange}/> <br/>
                </form>

                <button type='submit' onClick={this.handleSubmit}> Submit </button>

                this.props.login && <Redirect to='/'/>

            </div>
        );

    }; // end of render

}; // end of Login class

export default connect(mapStates, mapDispatch)(Login);
