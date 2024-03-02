import { SET_USER } from "./actions";

// Initial state
const initialState = {
    user: {}
}

// Reducer for functions on the state
const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_USER:
            return {...state, user: action.payload}
        default:
            return state
    }
}

export default userReducer