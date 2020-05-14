import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreenRouteProp, LoginScreenNavigationProp } from '../../utils/types';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import google_services from '../../../android/app/google-services.json';
import ActionBar from '../../components/organisms/ActionBar';
import { ActivityIndicator } from 'react-native-paper';

GoogleSignin.configure({
  webClientId: google_services.client[0].oauth_client[2].client_id,
  offlineAccess: true
});

type Props = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp;
};

type State = {
  isSigninInProgress: boolean;
}

export default class Login extends Component<Props, State>
{
  disposeAuthStateChanged: () => void = () => { };

  constructor(props: Props) {
    super(props);

    this.state = { isSigninInProgress: false }
  }

  render() {
    if (!this.state.isSigninInProgress)
      return (
        <View>
          <ActionBar title="WOSSC Connect" subtitle="please sign in" />
          <View style={styles.buttonCentreAlign}>
            <GoogleSigninButton
              onPress={async () => await this.sign_in_with_google()}
              disabled={this.state.isSigninInProgress}
              style={{ margin: 20, width: 150 }} />
          </View>
        </View>);
    else
      return (<View style={{flex:1}}>
        <ActionBar title="WOSSC Connect" subtitle="please sign in" />
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}} >
          <ActivityIndicator animating={true} size='large'/>
        </View>
      </View>);
  }

  async sign_in_with_google() {
    try{
      this.setState({isSigninInProgress: true});
      const { idToken } = await GoogleSignin.signIn();

      if (idToken) {
        await (firebase as any).login({ credential: firebase.auth.GoogleAuthProvider.credential(idToken) });
      }
    }
    catch(ex)
    {
      console.log("Failed to log user in because of exception: " + ex);
      this.setState({isSigninInProgress: false});
    }

  }

  componentDidMount() {
    this.disposeAuthStateChanged = auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.replace('Tabs');
      }
    });
  }

  componentWillUnmount() {
    this.disposeAuthStateChanged();
  }

}

const styles = StyleSheet.create({
  buttonCentreAlign: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});