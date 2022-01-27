// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import ContainedButton from '../../components/buttons/ContainedButton';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import InfoModal from '../../components/modals/InfoModal';

import RNRestart from 'react-native-restart';
import Layout from '../../theme/layout';
import {loginNormal} from '../../service/app.service';
import {inserirUsuario} from '../../service/app.service';
import Logo from '../../components/logo/Logo';

const ALERT_ICON = Platform.OS === 'ios' ? 'ios-alert' : 'md-alert';

// SignInB
export default class SignInB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      telefone: '',
      telefoneed: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      modalVisible: false,
      activityIndicatorModalVisible: false,
    };
  }

  componentDidMount = async () => {
    await AsyncStorage.removeItem('@paymentselected');
    await AsyncStorage.removeItem('@loginuser');
    await AsyncStorage.removeItem('@shoppingcart');
    await AsyncStorage.removeItem('@cardsuser');
  };

  telefoneChange = (text) => {
    let textTmp = text
      .replace(/\D/g, '') //Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/g, '($1) $2') //Coloca parênteses em volta dos dois primeiros dígitos
      .replace(/(\d)(\d{4})$/, '$1-$2'); //Coloca hífen entre o quarto e o quinto dígitos

    this.setState({
      telefone: textTmp,
    });
  };

  telefone = () => {
    this.setState({
      telefoneed: true,
      passwordFocused: false,
    });
  };

  passwordChange = (text) => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  signIn = async () => {
    const {telefone, password} = this.state;

    this.setState({
      passwordFocused: false,
      telefoneed: false,
    });

    if (telefone !== '' && password !== '') {
      this.setState({activityIndicatorModalVisible: true});

      let retornoLogin = await loginNormal({
        celular: telefone,
        senha: password,
      });

      this.setState({activityIndicatorModalVisible: false});

      if (retornoLogin.status === true) {
        let jsonValue = '';

        const userLogged = {
          id: retornoLogin.row.ID,
          name: retornoLogin.row.nome,
          email: retornoLogin.row.email,
          photo: retornoLogin.row.imagem,
        };

        try {
          jsonValue = JSON.stringify(userLogged);
          await AsyncStorage.setItem('@loginuser', jsonValue);
          RNRestart.Restart();
        } catch (e) {
          console.error(e);
        }
      } else {
        this.setState({
          activityIndicatorModalVisible: false,
          modalVisible: true,
        });
      }
    }
  };

  onFacebookButtonPress = async () => {};

  saveLoginFacebook = async (user) => {
    const {navigation} = this.props;
    let jsonValue = '';

    this.setState({activityIndicatorModalVisible: true});

    const retornoUsuario = await inserirUsuario({
      nome: user.name,
      email: user.email,
      senha: '',
      celular: '',
      socialID: user.id,
      foto: user.picture.data.url,
    });

    const userLogged = {
      id: retornoUsuario.ID,
      nome: retornoUsuario.nome,
      email: retornoUsuario.email,
      imagem: retornoUsuario.imagem,
    };

    try {
      jsonValue = JSON.stringify(userLogged);
      await AsyncStorage.setItem('@loginuser', jsonValue);
      RNRestart.Restart();
    } catch (e) {
      console.error(e);
    }
    this.setState({activityIndicatorModalVisible: false});
  };

  closeModalInfoModal = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {
      telefone,
      telefoneed,
      password,
      passwordFocused,
      secureTextEntry,
      activityIndicatorModalVisible,
      modalVisible,
    } = this.state;

    return (
      <GradientContainer>
        <StatusBar backgroundColor={'#be00ff'} barStyle="light-content" />
        <SafeAreaView style={styles.screenContainer}>
          <View style={styles.logoContainer}>
            <Logo size={100} />
          </View>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.content}>
              <View />

              <View style={styles.form}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.email = r;
                  }}
                  onChangeText={this.telefoneChange}
                  onFocus={this.telefone}
                  value={telefone}
                  inputFocused={telefoneed}
                  onSubmitEditing={this.focusOn(this.password)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="number-pad"
                  placeholder="Número de telefone"
                  placeholderTextColor={'#FFF'}
                  inputTextColor={'#FFF'}
                  borderColor={'#FFF'}
                  focusedBorderColor={'#FFF'}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlinePasswordInput
                  onRef={(r) => {
                    this.password = r;
                  }}
                  onChangeText={this.passwordChange}
                  onFocus={this.passwordFocus}
                  inputFocused={passwordFocused}
                  onSubmitEditing={this.signIn}
                  returnKeyType="go"
                  placeholder="Senha"
                  placeholderTextColor={'#FFF'}
                  inputTextColor={'#FFF'}
                  secureTextEntry={secureTextEntry}
                  borderColor={'#FFF'}
                  focusedBorderColor={'#FFF'}
                  toggleVisible={password.length > 0}
                  toggleText={secureTextEntry ? 'Mostrar' : 'Esconder'}
                  onTogglePress={this.onTogglePress}
                  inputContainerStyle={styles.inputContainer}
                />

                <View style={styles.buttonContainer}>
                  <ContainedButton
                    onPress={this.signIn}
                    color={'#be00ff'}
                    titleColor={'#FFF'}
                    title={'Entrar'.toUpperCase()}
                  />
                </View>
              </View>

              <ActivityIndicatorModal
                message="Aguarde ..."
                onRequestClose={this.closeActivityIndicatorModal}
                title="Carregando"
                visible={activityIndicatorModalVisible}
              />

              <InfoModal
                iconName={ALERT_ICON}
                iconColor={'#3B5998'}
                title={'Erro ao fazer login'}
                message={
                  'Não foi possivel fazer login, usuário ou senha inválidos.'
                }
                buttonTitle="OK"
                onButtonPress={this.closeModalInfoModal}
                onRequestClose={this.closeModalInfoModal}
                visible={modalVisible}
              />

              <TouchableWithoutFeedback>
                <View style={styles.footer}></View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </GradientContainer>
    );
  }
}

// SignInB Styles
const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: 'rgba(51,11,65,0.9)',
  },
  contentContainerStyle: {flex: 1},
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  buttonContainer: {
    paddingTop: 23,
  },
  forgotPassword: {
    paddingVertical: 23,
  },
  forgotPasswordText: {
    fontWeight: '300',
    fontSize: 13,
    color: '#FFF',
    textAlign: 'center',
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: '#FFF',
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: '#FFF',
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  vSpacer: {
    height: 15,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: '#FFF',
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
