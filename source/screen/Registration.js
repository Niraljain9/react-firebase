import React, {Component} from "react";
import {StyleSheet, View, Text, AsyncStorage ,ToastAndroid} from "react-native";
import { Card, TextInput, Button } from "react-native-paper";
import Loader from "../view/Loader";
import firebase, { database } from "../firebase/config";
import { Actions } from "react-native-router-flux";

class Registration extends Component {
    state = {
        userInfo: this.props.userInfo,
        authUID: "",
        firstname: "", 
        lastname: "",
        isLoading: false,
        username: "",
        userCollection: database.collection('userInfo'),
        errorMessage: "",
        isError: false
    }

    componentDidMount(){
        const {userInfo} = this.state;
        if (userInfo != undefined) {
            this.setState({isLoading: true})
            console.log(`User Info: ${JSON.stringify(userInfo)}`);
            const newObj = userInfo.user;
            const authUID = newObj.uid;
            const name = newObj.displayName;
            const firstname = name.split(' ')[0].trim();
            const lastname = name.split(' ')[1].trim();
            console.log(`first name: ${firstname}, last name: ${lastname}, uid: ${authUID}`)
            this.setState({firstname});
            this.setState({lastname});
            this.setState({authUID});
            this.setState({isLoading: false});
        }
    }

    saveUserInfo = async () => {
        const {firstname, lastname, username, authUID, userCollection} = this.state;
        this.setState({isLoading: true});
        if (firstname.length > 0 && lastname.length > 0) {
            this.setState({ isError: false })
            await AsyncStorage.setItem('uid', authUID);
            await AsyncStorage.setItem('firstname', firstname);
            userCollection.doc(authUID).set({
                    firstname: firstname,
                    lastname: lastname,
                    username: username
            }).then(() => {
            console.log("Data set");
            Actions.RegisAttribute({uid: authUID});
            this.setState({isLoading: false});
        }).catch(error => {
            const {message, code} = this.state;
            console.log(`Error in setting data ${error}`);
            this.setState({isLoading: false});
        })
        }else{
            this.setState({ isError: true })
            this.setState({ errorMessage: "Please insert necessary fields" })
            this.setState({isLoading: false});
        }
    }

    render(){
        const {userInfo, isLoading, firstname, lastname, username, isError, errorMessage} = this.state;
        return (
            <View style={styles.container}>

                <Loader loading={isLoading} /> 

                {isError && <Text style={{color: "#DB4437"}}>{errorMessage}</Text>}

                <TextInput
                    label="First name"
                    value={firstname}
                    onChangeText={(firstname) =>
                        this.setState({ firstname })
                    }
                    mode="outlined"
                    theme={theme}
                />

                <TextInput
                    label="Last name"
                    value={lastname}
                    onChangeText={(lastname) =>
                        this.setState({ lastname })
                    }
                    mode="outlined"
                    theme={theme}
                />

                <TextInput
                    label="User Name (optional)"
                    value={username}
                    onChangeText={(username) =>
                        this.setState({ username })
                    }
                    mode="outlined"
                    theme={theme}
                />

                <View style={{justifyContent: "space-between",  height: 48, width: "100%", marginTop: 20, alignSelf: 'center'}}>
                    <Button
                        color="#45CE30"
                        uppercase = {false}
                        onPress={this.saveUserInfo}
                        mode="contained"><Text style={{color: "#fff"}}> Continue </Text></Button>
                </View>
            </View>
        )
    }
}

const theme = {
    colors: {
        primary: "#45CE30",
        accent: "#45CE30",
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF", 
        flex: 1,
        padding: 10,
        justifyContent: "center"
    }
})

export default Registration;