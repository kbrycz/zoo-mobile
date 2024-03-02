export const SET_USER = 'SET_USER'

// Sets the user object
export const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
}