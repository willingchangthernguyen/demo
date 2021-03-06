const AuthReducer = (state, action) => {
  if (state === undefined) 
    return {
      user: {
        first_name: "",
        surname: ""
      },
      authorization: false
    };
  
  switch (action.type) {
    case "AUTH":
      return {
        ...state
      };
    case "AUTH_FAIL":
      return {
        ...state,
        authorization: false,
        error: action.message
      };
    case "AUTH_SUCCESS":
      return {
        authorization: true,
        user: {
          auth_token: action.user.auth_token,
          first_name: action.user.first_name,
          surname: action.user.surname
        }
      };
    default:
      return state;
  }
};
export default AuthReducer;
