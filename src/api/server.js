import axios from 'axios'
import {serverName} from './serverName'

// Creates the axios server with the server name
export default axios.create({
    baseURL: serverName,
    timeout: 15000
})