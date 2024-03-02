import { createStore, combineReducers, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
import userReducer from './reducers';
// import { setUser } from './actions';

// const rootReducer = combineReducers({userReducer});
// export const Store = createStore(userReducer, applyMiddleware(thunk));
export const Store = createStore(userReducer);