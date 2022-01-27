/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  I18nManager,
  StatusBar,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import {Heading5, Paragraph} from '../../components/text/CustomText';
import NumericKeyboard from '../../components/keyboard/NumericKeyboard';
import SafeAreaView from '../../components/SafeAreaView';
import {inserirUsuario} from '../../service/app.service';
import RNRestart from 'react-native-restart';

// VerificationB Config
const isRTL = I18nManager.isRTL;

// VerificationB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {color: '#000'},
  instruction: {
    marginTop: 16,
    paddingHorizontal: 40,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    opacity: 0.76,
  },
  codeContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38,
  },
  digitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 48,
    height: 50,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  digit: {
    fontWeight: '400',
    fontSize: 17,
    color: '#000',
  },
  buttonContainer: {
    marginBottom: 44,
  },
});

// VerificationB
export default class VerificationB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: props.route.params.nome,
      email: props.route.params.email,
      phone: props.route.params.phone,
      password: props.route.params.password,
      numberSMS: props.route.params.numberSMS,
      modalVisible: false,
      messageModal: '',
      tituloModal: '',
      pin: '',
      flagVerification: false,
    };

    this.usuario = [];
  }

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  navigateTo = (screen) => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  pressKeyboardButton = (keyboardButton) => () => {
    let {pin} = this.state;

    if (keyboardButton === 'backspace') {
      pin = pin.slice(0, -1);
      this.setState({
        pin,
      });
      return;
    }

    if (keyboardButton === 'voltar') {
      const {navigation} = this.props;
      navigation.goBack();
      return;
    }

    if ((pin + keyboardButton).length > 4) {
      return;
    }

    this.setState({
      pin: pin + keyboardButton,
    });
  };

  submit = async () => {
    const {nome, pin, numberSMS, phone, email, password} = this.state;

    if (pin === numberSMS) {
      this.setState({
        modalVisible: true,
        flagVerification: true,
        tituloModal: 'Sucesso!',
        messageModal:
          'Código de verificação validado, \n Bem vindo ao Rabbit! ',
      });

      const retornoUsuario = await inserirUsuario({
        nome: nome,
        email: email,
        senha: password,
        celular: phone,
      });

      this.usuario = retornoUsuario;
      this.saveLogin(this.usuario);
    } else {
      this.setState({
        modalVisible: true,
        tituloModal: 'Erro!',
        messageModal:
          'Código de verificação não pode ser validado, Tente Novamente.',
      });
    }
  };

  saveLogin = async (user) => {
    let jsonValue = '';

    const userLogged = {
      id: user.ID,
      nome: user.nome,
      email: user.email,
      imagem: null,
    };

    try {
      jsonValue = JSON.stringify(userLogged);
      await AsyncStorage.setItem('@loginuser', jsonValue);
      RNRestart.Restart();
    } catch (e) {
      console.error(e);
    }
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
      pin: '',
    });
  };

  enterApp = () => {
    this.saveLogin(this.usuario);
    this.setState({modalVisible: false});
    this.navigateTo('HomeNavigator');
  };

  render() {
    const {modalVisible, pin, phone} = this.state;

    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar backgroundColor={'#FAFAFA'} barStyle="light-content" />

        <GradientContainer containerStyle={styles.container}>
          <View style={styles.instructionContainer}>
            <Heading5 style={styles.heading}>Código de verificação</Heading5>
            <Paragraph style={styles.instruction}>
              Por favor, insira o código de verificação enviado para {phone}
            </Paragraph>

            <View style={styles.codeContainer}>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[0]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[1]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[2]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[3]}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={this.submit}
              disabled={pin.length < 4}
              borderRadius={4}
              color={'#3b5998'}
              small
              title={'ENVIAR CODIGO'}
              titleColor={'white'}
            />
          </View>

          <NumericKeyboard
            actionButtonTitle="voltar"
            onPress={this.pressKeyboardButton}
          />

          <ActivityIndicatorModal
            message="Por favor, um momento. . ."
            onRequestClose={this.closeModal}
            statusBarColor={'#000'}
            title="Carregando"
            visible={modalVisible}
          />
        </GradientContainer>
      </SafeAreaView>
    );
  }
}
