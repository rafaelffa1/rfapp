// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';

// import components
import ContainedButton from '../../components/buttons/ContainedButton';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import LinkButton from '../../components/buttons/LinkButton';
import Logo from '../../components/logo/Logo';
import OutlinedButton from '../../components/buttons/OutlinedButton';

// WelcomeB Config

// WelcomeB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'rgba(51,11,65,0.9)',
  },
  logoContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsGroup: {
    flex: 3,
    paddingHorizontal: 32,
    width: '100%',
  },
  vspace16: {
    height: 16,
  },
  vspace32: {
    height: 32,
  },
  linkButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

// WelcomeB Screen
export default class WelcomeB extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  verificationUserLogged = async () => {
    const {navigation} = this.props;

    try {
      let loginUser = await AsyncStorage.getItem('@loginuser');

      if (loginUser !== null) {
        navigation.navigate(`HomeNavigator`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  render() {
    return (
      <GradientContainer>
        <StatusBar backgroundColor={'#be00ff'} barStyle="light-content" />
        <SafeAreaView style={styles.screenContainer}>
          <View style={styles.logoContainer}>
            <Logo size={340} />
          </View>

          <View style={styles.buttonsGroup}>
            <ContainedButton
              onPress={this.navigateTo('SignUp')}
              color={'#be00ff'}
              title={'Sou novo no app'.toUpperCase()}
              titleColor={'#FFF'}
            />

            <View style={styles.vspace16} />

            <OutlinedButton
              onPress={this.navigateTo('SignIn')}
              title={'Já sou cadastrado'.toUpperCase()}
              titleColor={'#ff9d00'}
              rippleColor={'#ff9d00'}
              borderColor={'#ff9d00'}
            />

            <View style={styles.vspace32} />

            {/* <LinkButton
              title="VISITAR"
              onPress={this.navigateTo('HomeNavigator')}
              titleStyle={styles.linkButtonText}
            /> */}
          </View>
        </SafeAreaView>
      </GradientContainer>
    );
  }
}
