import {USER_LOGIN} from '../actions/LoginActions';

function loginReducer(state = {
    user: {
        email: '',
        password: ''
    },
    login: false
}, action) {

    switch(action.type) {

        case USER_LOGIN: {
            return {
                ...state,
                login: true
            };
            console.log(state);
        }
        default:
            return state;
    };

}; // end of  loginReducer

export default loginReducer;
