import React, {Component} from "react"
import {StyleSheet, Text, View, AsyncStorage, Modal, Dimensions} from "react-native";
import {Button, TextInput} from "react-native-paper";
import {database} from "../firebase/config"
import DoneModal from "../view/DoneModal";
import ErrorModal from "../view/ErrorModal";
import { Actions } from "react-native-router-flux";


const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
class RegisAttribute extends Component {
    state = {
        login: false, 
        isModalShow: false,
        one: "",
        two: "",
        three: "",
        four: "",
        errorMessage: "",
        isError: false,
        isDone: false,
        isCancel: false,
    }

    addAttribute = async () => {
        const {one, two, three, four} = this.state;
        if (one.length > 0 && two.length > 0 && three.length > 0 && four.length > 0) {
            this.setState({ isError: false })
            await AsyncStorage.getItem('uid', (err, uid) => {
            console.log(`UID: ${uid}`);
            database.collection('attribute').doc(uid).set({
                one: one,
                two: two,
                three: three,
                four: four
            }).then(() => {
                console.log("Added");
                this.setState({isModalShow: false})
                this.setState({isDone: true})
                this.clearTextInput()
                setTimeout(() => {
                    this.setState({isDone: false})
                }, 2000);
            }).catch(err => {
                console.log(`Error in adding attribute: ${err}`)
                this.setState({isModalShow: false})
                this.clearTextInput()
                this.setState({isCancel: true})
                setTimeout(() => {
                    this.setState({isCancel: false})
                }, 2000);
            })
        })
        }else {
            this.setState({ isError: true })
            this.setState({ errorMessage: "Please insert value in all the fields" })
        }
        
    }

    clearTextInput = () => {
            this.setState({
                one: "",
                two: "",
                three: "",
                four: "",
            })
    }

    render(){
        const {isModalShow, one, two, three, four, isError, errorMessage, isDone, isCancel, firstname} = this.state;
        return(
            <View style={styles.container}>

                <DoneModal loading={isDone} />
                <ErrorModal loading={isCancel} />

                <Button
                    icon="plus"
                    color="#45CE30"
                    uppercase = {false}
                    onPress={() => this.setState({isModalShow: true})}
                    mode="contained"> Add Attribute </Button>

                <Button
                    color="#45CE30"
                    uppercase = {false}
                    style={{marginTop: 10}}
                    onPress={() => Actions.Home()}
                    mode="contained"> Continue </Button>

                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        visible={isModalShow}>
                        <View style={{backgroundColor: "#000000aa", flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <View style={{backgroundColor: "#fff", padding: 15, borderRadius: 10, height: deviceHeight/ 1.8, width: deviceWidth / 1.1}}>

                            <View>
                            {isError && <Text style={{color: "#DB4437",fontSize: 10}}>{errorMessage}</Text>}

                                <TextInput
                                    label="One"
                                    value={one}
                                    onChangeText={(one) =>
                                        this.setState({ one })
                                    }
                                    mode="outlined"
                                    theme={theme}
                                    />

                                <TextInput
                                    label="Two"
                                    value={two}
                                    onChangeText={(two) =>
                                        this.setState({ two })
                                    }
                                    mode="outlined"
                                    theme={theme}
                                    />

                                <TextInput
                                    label="Three"
                                    value={three}
                                    onChangeText={(three) =>
                                        this.setState({ three })
                                    }
                                    mode="outlined"
                                    theme={theme}
                                    />

                                <TextInput
                                    label="Four"
                                    value={four}
                                    onChangeText={(four) =>
                                        this.setState({ four })
                                    }
                                    mode="outlined"
                                    theme={theme}
                                    />

                                    <View style={{flexDirection: "row", justifyContent: "space-between",marginTop: 10}}>
                                        <Button
                                            color="#DB4437"
                                            style={{ width: "45%", height: 48, justifyContent: "center" }}
                                            uppercase = {false}
                                            onPress={() => this.setState({ isModalShow: false })}
                                            mode="contained"> Cancel </Button>

                                        <Button
                                            color="#45CE30"
                                            style={{ width: "45%", height: 48, justifyContent: "center" }}
                                            uppercase = {false}
                                            onPress={this.addAttribute}
                                            mode="contained"> Add </Button>
                                    </View>
                                    </View>
                            </View>

                        </View>
                    </Modal>


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
    container : {
        backgroundColor: "#ffffff",
        flex: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    },
})

export default RegisAttribute;