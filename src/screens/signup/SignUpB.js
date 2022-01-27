// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import ContainedButton from '../../components/buttons/ContainedButton';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import InfoModal from '../../components/modals/InfoModal';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';
import Logo from '../../components/logo/Logo';

import {
  inserirUsuario,
  validarUsuarioCelular,
  validarUsuarioEmail,
} from '../../service/app.service';

import Layout from '../../theme/layout';

const ALERT_ICON = Platform.OS === 'ios' ? 'ios-alert' : 'md-alert';

// SignUpB
export default class SignUpB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nome: '',
      nomeFocused: false,
      email: '',
      emailFocused: false,
      phone: '',
      phoneFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      textModal: '',
      activityIndicatorModalVisible: false,
      modalVisible: false,
    };
  }

  componentDidMount = async () => {
    await AsyncStorage.removeItem('@paymentselected');
    await AsyncStorage.removeItem('@loginuser');
    await AsyncStorage.removeItem('@shoppingcart');
    await AsyncStorage.removeItem('@cardsuser');
  };

  nomeChange = (text) => {
    this.setState({
      nome: text,
    });
  };

  nomeFocus = () => {
    this.setState({
      nomeFocused: true,
      emailFocused: false,
      phoneFocused: false,
      passwordFocused: false,
    });
  };

  emailChange = (text) => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      phoneFocused: false,
      nomeFocused: false,
      passwordFocused: false,
    });
  };

  phoneChange = (text) => {
    let textTmp = text
      .replace(/\D/g, '') //Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/g, '($1) $2') //Coloca parênteses em volta dos dois primeiros dígitos
      .replace(/(\d)(\d{4})$/, '$1-$2'); //Coloca hífen entre o quarto e o quinto dígitos

    this.setState({
      phone: textTmp,
    });
  };

  phoneFocus = () => {
    this.setState({
      phoneFocused: true,
      emailFocused: false,
      nomeFocused: false,
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
      nomeFocused: false,
      phoneFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  navigateTo = (screen, params) => {
    const {navigation} = this.props;
    navigation.navigate(screen, params);
  };

  createAccount = async (login = 'default') => {
    const {nome, email, phone, password} = this.state;

    if (nome !== '' && email !== '' && phone !== '' && password !== '') {
      this.setState({
        activityIndicatorModalVisible: true,
      });

      const retornoValidacaoCelular = await validarUsuarioCelular(phone);
      const retornoValidacaoEmail = await validarUsuarioEmail(email);

      if (retornoValidacaoCelular === '' && retornoValidacaoEmail === '') {
        let numberSMS = '1234';
        // for (let index = 0; index < 4; index++) {
        //   let number = Math.floor(Math.random() * 10);
        //   numberSMS += number;
        // }

        // this.setState({activityIndicatorModalVisible: true});
        // // await enviarSMS({ "text": `MercadoMineiro: Confirme o codigo: ${numberSMS}`, "phone": phone });
        // console.warn(numberSMS);

        this.setState(
          {
            activityIndicatorModalVisible: false,
            emailFocused: false,
            phoneFocused: false,
            passwordFocused: false,
          },
          this.navigateTo('Verification', {
            nome,
            email,
            phone,
            password,
            numberSMS,
          }),
        );
      } else {
        this.setState({
          textModal: 'Já existe um usuário com esse numero de celular ou email',
          modalVisible: true,
        });
      }

      this.setState({
        activityIndicatorModalVisible: false,
      });
    }
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  onFacebookButtonPress = async () => {};

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  saveLoginFacebook = async (user) => {
    this.setState({activityIndicatorModalVisible: true});
    let jsonValue = '';

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

  closeActivityIndicatorModal = () => {
    this.setState({
      activityIndicatorModalVisible: false,
    });
  };

  closeModal = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {
      emailFocused,
      phoneFocused,
      password,
      passwordFocused,
      secureTextEntry,
      activityIndicatorModalVisible,
      textModal,
      nomeFocused,
      modalVisible,
      phone,
    } = this.state;

    return (
      <GradientContainer>
        <StatusBar backgroundColor={'#be00ff'} barStyle="light-content" />

        <SafeAreaView style={styles.screenContainer}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Logo size={100} />
              </View>

              <View style={styles.form}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.nome = r;
                  }}
                  onChangeText={this.nomeChange}
                  onFocus={this.nomeFocus}
                  inputFocused={nomeFocused}
                  onSubmitEditing={this.focusOn(this.phone)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Nome"
                  placeholderTextColor={'#FFF'}
                  inputTextColor={'#FFF'}
                  borderColor={'#FFF'}
                  focusedBorderColor={'#FFF'}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.email = r;
                  }}
                  onChangeText={this.emailChange}
                  onFocus={this.emailFocus}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.focusOn(this.phone)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="email-address"
                  placeholder="E-mail"
                  placeholderTextColor={'#FFF'}
                  inputTextColor={'#FFF'}
                  borderColor={'#FFF'}
                  focusedBorderColor={'#FFF'}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.phone = r;
                  }}
                  onChangeText={this.phoneChange}
                  onFocus={this.phoneFocus}
                  inputFocused={phoneFocused}
                  onSubmitEditing={this.focusOn(this.password)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="phone-pad"
                  placeholder="Celular"
                  value={phone}
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
                  onSubmitEditing={this.createAccount}
                  returnKeyType="done"
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
                    onPress={this.createAccount}
                    color={'#be00ff'}
                    titleColor={'#FFF'}
                    title={'CRIAR CONTA'}
                  />
                </View>

                {/* <View style={styles.separator}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>ou</Text>
                  <View style={styles.line} />
                </View> */}

                {/* <View style={styles.buttonsGroup}>
                  <ContainedButton
                    onPress={() => this.onFacebookButtonPress()}
                    color={'#3B5998'}
                    socialIconName="facebook-square"
                    iconColor="#FFF"
                    title="LOGIN COM FACEBOOK"
                    titleColor="#FFF"
                  />
                </View> */}
              </View>

              <ActivityIndicatorModal
                message="Aguarde ..."
                onRequestClose={this.closeActivityIndicatorModal}
                title="Carregando"
                visible={activityIndicatorModalVisible}
              />

              <InfoModal
                iconName={ALERT_ICON}
                iconColor={'#3b5998'}
                title={'Erro ao cadastrar'}
                message={textModal}
                buttonTitle="OK"
                onButtonPress={this.closeModal}
                onRequestClose={this.closeModal}
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

// SignUpB Styles
const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: 'rgba(51,11,65,0.9)',
  },
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
  },
  buttonsGroup: {
    paddingTop: 23,
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
    color: 'white',
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
