import axios from "axios";
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL , REGISTER_USER_REQUEST ,REGISTER_USER_SUCCESS ,REGISTER_USER_FAIL, 
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL
} from "../constants/userContants";

export const login = (email, password) =>{
    return async (dispatch) =>{
        try {
            dispatch({ type: LOGIN_REQUEST });
            const link = `http://localhost:4000/api/v1/login`;
            const body = {
                email,
                password
            };
            
            const config = { headers: { "Content-Type": "application/json",
                'Accept': 'application/json'
                } ,
                withCredentials: true 
            };

            const {data} = await axios.post(link, body, config);
            console.log("data : ",data);
            dispatch({
                type : LOGIN_SUCCESS,
                payload : data.user
            })

        } catch (error) {
          console.log("error.response.data.message : ",error.response.data.message);
            dispatch({ 
                type : LOGIN_FAIL,
                payload : error.response.data.message
            });
        }
    }
};

export const register = (myForm)=>{
    return async (dispatch) => {
        try {
            dispatch({ type : REGISTER_USER_REQUEST});

            const link = `http://localhost:4000/api/v1/register`;
        
            const config = { headers: { "Content-Type": "application/json" } };

            const {data} = await axios.post(link, myForm, config);
          console.log("register : ",data);
            dispatch({
                type : REGISTER_USER_SUCCESS,
                payload : data.user
            });
        } catch (error) {
          console.log("register error : ",error);

            dispatch({
                type : REGISTER_USER_FAIL,
                payload : error.response.data.message
            });
        }
    }
};

export const loadUser = () => async (dispatch) => {
    try {
      dispatch({ type: LOAD_USER_REQUEST });
  
      const { data } = await axios.get(`http://localhost:4000/api/v1/me`);
        
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
    }
  };
  
  // Logout User
  export const logout = () => async (dispatch) => {
    try {
      await axios.get(`http://localhost:4000/api/v1/logout`, {
          withCredentials : true
      });
  
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
      dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
    }
  };

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = { 
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' } ,
            withCredentials: true,
        };
        const { data } = 
            await axios.put(`http://localhost:4000/api/v1/me/profile/update`,userData, config);
        
        dispatch({
            type : UPDATE_PROFILE_SUCCESS,
            payload : data.user
        });
        
    } catch (error) {
        dispatch({
            type : UPDATE_PROFILE_FAIL,
            payload : error.response.data.message
        })
    }
};

export const updatePassword = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" }, 
        withCredentials : true };
        const { data } = 
            await axios.put(`http://localhost:4000/api/v1/me/profile/update`,userData, config);

        dispatch({
            type : UPDATE_PASSWORD_SUCCESS,
            payload : data.user
        });
    } catch (error) {
        dispatch({
            type : UPDATE_PASSWORD_FAIL,
            payload : error.response.data.message
        });
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST});

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post('http://localhost:4000/api/v1/password/forgot', email, config);
        
        dispatch({
            type : FORGOT_PASSWORD_SUCCESS,
            payload : data.message
        });

    } catch (error) {
        dispatch({
            type : FORGOT_PASSWORD_FAIL,
            payload : error.response.data.message
        });
    }
};

export const resetPassword = (token, password, confirmPasswod) => async (dispatch) =>{
    try {
        dispatch({ type : RESET_PASSWORD_REQUEST });

        const config = { headers: {
                "Content-Type": "application/json" ,
                'token': `Basic ${token}` 
            } 
        };

        const { data } = await axios.put(
            `http://localhost:4000/api/v1/password/reset/${token}`, 
            { password, confirmPasswod}, 
            config
        );

        dispatch({
            type : RESET_PASSWORD_SUCCESS,
            payload : data.success
        })

    } catch (error) {
        dispatch({
            type : RESET_PASSWORD_FAIL,
            payload : error.response.data.message
        })
    }
};

export const getAllUsers = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_USERS_REQUEST });
      const { data } = await axios.get(`http://localhost:4000/api/v1/admin/users`,
        { withCredentials : true }
      );
  
      dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
    } catch (error) {
      dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
    }
  };
  
  // get  User Details
  export const getUserDetails = (id) => async (dispatch) => {
    try {
      dispatch({ type: USER_DETAILS_REQUEST });
      const { data } = await axios.get(`http://localhost:4000/api/v1/admin/user/${id}`,
      { withCredentials : true });
  
      dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
    }
  };
  
  // Update User
  export const updateUser = (id, userData) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_USER_REQUEST });
  
      const config = { headers: { "Content-Type": "application/json" },
       withCredentials : true     
    };
  
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/admin/user/${id}`,
        userData,
        config
      );
  
      dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_FAIL,
        payload: error.response.data.message,
      });
    }
  };
  
  // Delete User
  export const deleteUser = (id) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_USER_REQUEST });
  
      const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/user/${id}`,
      { withCredentials : true });
  
      dispatch({ type: DELETE_USER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: DELETE_USER_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const clearError = () =>{
    dispatch({
        type : CLEAR_ERRORS
    })
};

