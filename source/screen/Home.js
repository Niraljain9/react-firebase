import React, {Component} from "react";
import {StyleSheet, Text, View, AsyncStorage} from "react-native";
import firebase, {database} from "../firebase/config";
class Home extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            userRef: database.collection("userInfo")
        }
    }

    componentDidMount(){
        AsyncStorage.setItem("logged", "1")
        this.getName();
    }

    getName = async () => {
        console.log(`Document`);
        const {userRef} = this.state;
        // AsyncStorage.getItem('uid' ,(err, uid) => {
        //     console.log(`UID: ${uid}`);
        //     userRef.doc(`${uid}`).get().then(doc => {
        //         console.log(`chck`);
        //         if (doc.exists) {
        //             console.log(`Doc ${JSON.stringify(doc.data())}`);
        //             this.setState({name: doc.data().firstname});
        //         }
        //     }).catch(error => {
        //         console.log(`Error in fetching first name: ${error}`);
        //     })
        // })
        await AsyncStorage.getItem('firstname', (err, firstname) => {
            this.setState({name: firstname});
        })
    }

    render(){
        const {name} = this.state;
        return(
            <View style={styles.container}>
                <Text style={{marginTop: 10, fontSize: 25, fontWeight: "bold"}}>Logged in as: {name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        alignItems: "center"
    }
})

export default Home;