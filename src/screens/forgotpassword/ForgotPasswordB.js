import React, { Component } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/dist/FontAwesome';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import { Paragraph } from '../../components/text/CustomText';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import InfoModal from '../../components/modals/InfoModal';
import { redefinirSenha } from '../../service/app.service'

const ALERT_ICON = Platform.OS === 'ios'
  ? 'ios-alert'
  : 'md-alert';

export default class ForgotPasswordB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      tituloModal: '',
      messageModal: '',
      modalVisibleInfo: false,
      emailFocused: false,
      modalVisible: false,
    };
  }

  componentDidMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  keyboardDidShow = () => {
    this.setState({
      emailFocused: true,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      emailFocused: false,
    });
  };

  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  navigateTo = screen => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  resetPassword = async () => {
    const { email } = this.state;
    Keyboard.dismiss();

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    this.setState({
      modalVisible: true,
      emailFocused: false
    });


    if (email === '') {
      this.setState({
        tituloModal: 'Campo email em branco.',
        messageModal: 'Por favor, preencha o campo.',
        modalVisible: false,
        modalVisibleInfo: true,
      })
    } else {
      if (reg.test(email) === false) {
        this.setState({
          tituloModal: 'Email não e valido.',
          messageModal: 'Por favor, preencha um email valido.',
          modalVisible: false,
          modalVisibleInfo: true,
        })
      } else {
        const retornoRedefinirSenha = await redefinirSenha(email);
        console.warn(retornoRedefinirSenha);

        this.timeout = setTimeout(() => {
          if (retornoRedefinirSenha.status === false) {
            this.setState({
              tituloModal: 'Erro ao enviar email',
              messageModal: `${retornoRedefinirSenha.text}`,
              modalVisible: false,
              modalVisibleInfo: true,
            })
          } else {
            this.setState({
              tituloModal: 'Email enviado',
              messageModal: `${retornoRedefinirSenha.text}`,
              modalVisible: false,
              modalVisibleInfo: true,
            })
          }
        }, 3000);
      }
    }
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
      modalVisibleInfo: false
    });
  };

  render() {
    const { emailFocused, modalVisible, modalVisibleInfo, tituloModal, messageModal } = this.state;

    return (
      <GradientContainer>
        <SafeAreaView
          forceInset={{ top: 'never' }}
          style={styles.screenContainer}>

          <StatusBar
            backgroundColor={'#be00ff'}
            barStyle="light-content"
          />

          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.instructionContainer}>
              <View style={styles.iconContainer}>
              <FAIcon name={'envelope-square'} size={50} color={'#FFF'} />
              </View>
              <Paragraph style={styles.instruction}>
                Digite seu endereço de e-mail abaixo para receber sua redefinição de senha
              </Paragraph>
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onChangeText={this.emailChange}
                inputFocused={emailFocused}
                onSubmitEditing={this.resetPassword}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="email-address"
                placeholder="Endereço de e-mail"
                placeholderTextColor={'#FFF'}
                inputTextColor={'#FFF'}
                borderColor={'#FFF'}
                focusedBorderColor={'#FFF'}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                onPress={this.resetPassword}
                disabled={false}
                color={'#be00ff'}
                small
                title={'enviar'.toUpperCase()}
                titleColor={"#FAFAFA"}
              />
            </View>

            <InfoModal
              iconName={ALERT_ICON}
              iconColor={"#3b5998"}
              title={tituloModal.toUpperCase()}
              message={messageModal}
              buttonTitle="OK"
              onButtonPress={this.closeModal}
              onRequestClose={this.closeModal}
              visible={modalVisibleInfo}
            />

            <ActivityIndicatorModal
              statusBarColor={'#3b5998'}
              message="Aguarde um momento . . ."
              onRequestClose={this.closeModal}
              title="Enviando redefinição de senha"
              visible={modalVisible}
            />

          </ScrollView>
        </SafeAreaView>
      </GradientContainer>
    );
  }
}

// ForgotPasswordB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'rgba(51,11,65,0.9)',
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#be00ff',
  },
  instruction: {
    marginTop: 32,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#FFF",
    textAlign: 'center',
  },
  inputContainer: {
    paddingTop: 16,
  },
  inputStyle: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 22,
  },
});
