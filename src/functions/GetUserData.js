import api from '../api/server'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gets all of the user data from api and returns a promise of the user obj
// If call has no changes, returns what is saved in AsyncStorage
export async function getlocalUserData (token) {
    try {
        const authStr = 'Bearer '.concat(token); 
        const response = await api.get('/getUserData', {headers: {Authorization: authStr}})
        if (!response.data.user) {
            let storedUser = JSON.parse(await AsyncStorage.getItem('user'));
            return storedUser
        }
        else {
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.user 
        }
    }
    catch (err) {
        console.log(err)
        return null
    }
}

// Gets all of the user data from api and returns a promise of the user obj
// Takes in the _id of the user
export async function getUserDataWithId (id) {
    try {
        const response = await api.get('/getUserDataWithId', {
            params: {
                _id: id
            }
        })

        // Unable to find the user
        if (!response && !response.data.user) {
            throw "Unable to get user by ID"
        }
        // Simply return the user
        else {
            return response.data.user 
        }
    }
    catch (err) {
        console.log(err)
        return null
    }
}