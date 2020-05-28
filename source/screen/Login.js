import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  AsyncStorage,
} from "react-native";
import firebase, { authentication } from "../firebase/config";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { Card, TextInput, Button } from "react-native-paper";
import { GoogleSignin } from "react-native-google-signin";
import { Actions } from "react-native-router-flux";
import Loader from "../view/Loader";
import DoneModal from "../view/DoneModal";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

class Login extends Component {
  state = {
    login: true,
    phoneAuthenticate: "",
    code: "",
    isLoading: false,
    buttonText: "Get OTP",
    confirm: null,
    phoneError: "",
    isPhoneError: false,
    otpError: "",
    isOtpError: false,
    isDone: false,
    isVerified: false,
  };

  componentDidMount() {
    // auth.onAuthStateChanged(user => {
    //   console.log(`User before ${user}`);
    //   if (user) {
    //     console.log(`User before ${user}`);
    //     Actions.Home();
    //   }
    // })
    AsyncStorage.getItem("logged", (err, logged) => {
      console.log(`Starting ${err}`);
      if (logged === "1") {
        console.log(`Inside if method`);
        Actions.Home();
      }
    });
  }

  onFBButtonPress = () => {
    this.setState({ isLoading: true }, () => {
      this.loginFacebook();
    });
  };

  getOTP = async () => {
    const { phoneAuthenticate, buttonText } = this.state;

    // const confirmation = await auth().signInWithPhoneNumber(phoneAuthenticate);
    // this.setState({confirm: confirmation});
    this.setState({ isLoading: true });
    this.setState({ isPhoneError: false });
    if (phoneAuthenticate.length > 0) {
      let number = phoneAuthenticate;
      firebase
        .auth()
        .signInWithPhoneNumber(number)
        .then((result) => {
          console.log("Result ", result);
          this.setState({ confirm: result });
          this.setState({ isLoading: false, isVerified: true });
        })
        .catch((err) => {
          console.log(`Error in phone auth: ${err}`);
        });
    } else {
      this.setState({ isPhoneError: true });
      this.setState({ phoneError: "Please enter valid phone number" });
      this.setState({ isLoading: false });
    }
    // firebase.auth().signInWithPhoneNumber("+91"+phoneAuthenticate)
    //   .then(confirm => this.setState({ confirm, message: 'Code has been sent!' }))
    //   .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = async () => {
    const { confirm, code, buttonText } = this.state;
    if (code.length > 0 && code.length == 6) {
      try {
        await confirm.confirm(code).then((result) => {
          console.log(`Checking the result: ${result}`);
          this.setState({ isDone: true });
          setTimeout(() => {
            this.setState({ isDone: false });
            Actions.Registration({ uid: result.uid });
          }, 2000);
        });
      } catch (error) {
        console.log(`Error after code submission: ${error}`);
        if (error.message.includes("[auth/invalid-verification-code]")) {
          Alert.alert(
            " Login Error! ",
            `Invalid OTP entered`,
            [{ text: "Ok" }],
            {
              cancelable: false,
            }
          );
        } else if (error.message.includes("[auth/session-expired]")) {
          Alert.alert(" Session Error! ", `Session expired`, [{ text: "Ok" }], {
            cancelable: false,
          });
        }
      }
    } else {
      this.setState({ isOtpError: true });
      this.setState({ phoneError: "Please enter valid OTP" });
      this.setState({ isLoading: false });
    }
  };

  onLoginGoogle = () => {
    GoogleSignin.configure({
      webClientId:
        "1074404306415-msfvu2uj3e5d98hp7t7n3ouspeqf90ts.apps.googleusercontent.com",
      offlineAccess: false,
    });

    GoogleSignin.signIn()
      .then((data) => {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          data.accessToken
        );

        return firebase.auth().signInWithCredential(credential);
      })
      .then((currentUser) => {
        console.log(`Google signin successful ${JSON.stringify(currentUser)}`);
        Actions.Registration({ userInfo: currentUser });
      })
      .catch((error) => {
        const { message, code } = error;
        console.log(`Google signin error: ${message}, error code: ${code}`);
        if (code === "auth/account-exists-with-different-credential") {
          Alert.alert(" Login Error! ", `${message}`, [{ text: "Ok" }], {
            cancelable: false,
          });
        }
      });
  };

  loginFacebook = () => {
    console.log("Facebook started");
    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error("The user cancelled the request"));
        }
        // Retrieve the access token
        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        // Create a new Firebase credential with the token
        console.log("Facebook getting data");
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken
        );
        // Login with the credential
        return firebase.auth().signInWithCredential(credential);
      })
      .then((user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        console.log("User: ", user);
        this.setState({ isLoading: false }, () => {
          Actions.Registration({ userInfo: user });
        });
      })
      .catch((error) => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
        console.log(`Facebook login fail with error: ${message} code: ${code}`);
        if (code === "auth/account-exists-with-different-credential") {
          Alert.alert(" Login Error! ", `${message}`, [{ text: "Ok" }], {
            cancelable: false,
          });
        }
        this.setState({ isLoading: false });
      });
  };

  render() {
    const {
      phoneAuthenticate,
      code,
      isLoading,
      buttonText,
      isPhoneError,
      phoneError,
      isOtpError,
      otpError,
      isDone,
      isVerified,
    } = this.state;

    return (
      <View style={styles.container}>
        <Loader loading={isLoading} />
        <DoneModal loading={isDone} />
        <Card
          style={{
            height: 150,
            width: 150,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text>Logo</Text>
        </Card>

        {!isVerified && (
          <View>
            {isPhoneError && (
              <Text style={{ color: "#DB4437" }}>{phoneError}</Text>
            )}
            <TextInput
              label="Phone Authenticate"
              value={phoneAuthenticate}
              onChangeText={(phoneAuthenticate) =>
                this.setState({ phoneAuthenticate })
              }
              keyboardType="phone-pad"
              mode="outlined"
              theme={theme}
            />
            <View
              style={{
                justifyContent: "space-between",
                height: 48,
                width: "100%",
                marginTop: 20,
                alignSelf: "center",
              }}
            >
              <Button
                color="#45CE30"
                uppercase={false}
                mode="contained"
                onPress={this.getOTP}
              >
                <Text style={{ color: "#fff" }}> Get OTP </Text>
              </Button>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Button
                icon="google"
                onPress={this.onLoginGoogle}
                color="#DB4437"
                style={{ width: "45%", height: 48, justifyContent: "center" }}
                uppercase={false}
                mode="contained"
              >
                {" "}
                Google{" "}
              </Button>

              <Button
                icon="facebook"
                onPress={this.onFBButtonPress}
                color="#4267B2"
                uppercase={false}
                style={{
                  width: "45%",
                  height: 48,
                  alignSelf: "flex-end",
                  justifyContent: "center",
                }}
                mode="contained"
              >
                {" "}
                Facebook{" "}
              </Button>
            </View>
          </View>
        )}

        {isVerified && (
          <View>
            {isOtpError && <Text style={{ color: "#DB4437" }}>{otpError}</Text>}
            <TextInput
              label="Passode"
              value={code}
              onChangeText={(code) => this.setState({ code })}
              mode="outlined"
              keyboardType="number-pad"
              theme={theme}
            />
            <View
              style={{
                justifyContent: "space-between",
                height: 48,
                width: "100%",
                marginTop: 20,
                alignSelf: "center",
              }}
            >
              <Button
                color="#45CE30"
                uppercase={false}
                mode="contained"
                onPress={this.confirmCode}
              >
                <Text style={{ color: "#fff" }}> Verify OTP </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const theme = {
  colors: {
    primary: "#45CE30",
    accent: "#45CE30",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
});

export default Login;
