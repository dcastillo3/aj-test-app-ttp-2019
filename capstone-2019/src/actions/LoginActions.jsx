export const USER_LOGIN = "USER_LOGIN";

const userLogin = (user) => {

    return {
        type: USER_LOGIN,
        payload: user;
    };

}; // end of userLogin

export const userLoginThunk = (user) => (dispatch) => {

    // axios get request to user database

}; // end of userLoginThunk