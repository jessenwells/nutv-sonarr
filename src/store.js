import firebase from 'firebase/app'
import 'firebase/firestore'

var config = {
 apiKey: process.env.REACT_APP_API_KEY,
 authDomain: process.env.REACT_APP_AUTH,
 databaseURL: process.env.REACT_APP_DB_URL,
 projectId: process.env.REACT_APP_PROJ,
 storageBucket: process.env.REACT_APP_STOR,
 messagingSenderId: process.env.REACT_APP_MSG,
 appId: process.env.REACT_APP_ID
}

firebase.initializeApp(config)

var store = firebase.firestore()
export default store
