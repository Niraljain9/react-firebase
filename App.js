import React, { Component } from "react";
import Login from "./source/screen/Login";
import Registration from "./source/screen/Registration";
import RegisAttribute from "./source/screen/RegisAttribute";
import Home from "./source/screen/Home";
import { Actions, Router, Scene, Stack } from "react-native-router-flux";
import {decode, encode} from 'base-64';

const pages = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "gray" }}>
      <StatusBar backgroundColor="#45CE30" barStyle="#45CE30" />
      <View style={{ backgroundColor: "gray", height: 200 }}>
        <Text>hhii</Text>
      </View>
    </View>
  );
};

class App extends Component {
  render() {
    if (!global.btoa) {  global.btoa = encode }

    if (!global.atob) { global.atob = decode }
    return (
      <Router>
        <Stack key="main" contentComponent={pages} panHandlers={null}>
          <Scene key="Login" component={Login} hideNavBar />
          <Scene key="Registration" component={Registration} hideNavBar />
          <Scene key="RegisAttribute" component={RegisAttribute} hideNavBar />
          <Scene key="Home" component={Home} hideNavBar />
        </Stack>
      </Router>
    );
  }
}
export default App;
