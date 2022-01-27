// import dependencies
import React, {Component} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import {Paragraph} from '../../components/text/CustomText';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import {AddAddress} from '../../service/app.service';

// AddAddressB Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';

// AddAddressB
export default class AddAddressB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressType: 'casa',
      number: '',
      numberFocused: false,
      street: '',
      streetFocused: false,
      district: '',
      districtFocused: false,
      zip: '',
      zipFocused: false,
      city: '',
      cityFocused: false,
      address: '',
      addressFocused: false,
      ref: '',
      refFocused: false,
      complement: '',
      complementFocused: false,
      modalVisible: false,
      selectedAddress: true,
      userLogged: [],
    };
  }

  componentDidMount = () => {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
    this.getuserLogged();
  };

  getuserLogged = async () => {
    try {
      const userLoggedString = await AsyncStorage.getItem('@loginuser');
      const user = JSON.parse(userLoggedString);
      this.setState({
        userLogged: user,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidHideListener.remove();
  };

  keyboardDidHide = () => {
    this.setState({
      numberFocused: false,
      streetFocused: false,
      districtFocused: false,
      zipFocused: false,
      cityFocused: false,
    });
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  setAddressType = (type) => () => {
    this.setState({
      addressType: type,
    });
  };

  onChangeText = (key) => (text) => {
    this.setState({
      [key]: text,
    });
  };

  onFocus = (key) => () => {
    let focusedInputs = {
      numberFocused: false,
      streetFocused: false,
      districtFocused: false,
      zipFocused: false,
      cityFocused: false,
    };
    focusedInputs[key] = true;

    this.setState({
      ...focusedInputs,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  saveAddress = async () => {
    const {userLogged} = this.state;
    Keyboard.dismiss();

    const {
      addressType,
      number,
      street,
      district,
      zip,
      city,
      ref,
      address,
      complement,
      selectedAddress,
    } = this.state;

    this.setState({
      modalVisible: true,
      emailFocused: false,
    });

    const addressFinal = `${address} / ${complement} / ${ref}`;

    const objectAddress = {
      cep: zip,
      estado: null,
      cidade: city,
      bairro: district,
      endereco: addressFinal,
      numero: number,
    };

    const serviceAddress = await AddAddress(userLogged.id, objectAddress);

    this.setState({
      modalVisible: false,
    });

    if (serviceAddress) {
      Alert.alert(
        'Sucesso!',
        `O endereço foi cadastrado com sucesso!\nagora prossiga com a compra da cota e boa sorte!`,
        [{text: 'OK', onPress: () => this.goBack()}],
      );
    } else {
      Alert.alert(
        'Opa! Algo deu errado...',
        `Não foi possivel comprar a cota, tente novamente mais tarde.`,
        [{text: 'OK', onPress: () => this.goBack()}],
      );
    }
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        this.goBack();
      },
    );
  };

  storeData = async (value) => {
    // await AsyncStorage.removeItem('@addressuser');
    try {
      let jsonAddress = '';
      let jsonValue = await AsyncStorage.getItem('@addressuser');
      if (jsonValue !== null) {
        let objectAddress = this.configAddress(jsonValue);
        for (let index = 0; index < objectAddress.length; index++) {
          let address = objectAddress[index];
          address.selectedAddress = false;
          jsonAddress += JSON.stringify(address) + `;`;
        }
        value.id = objectAddress.length + 1;
      } else {
        value.id = 1;
      }

      jsonAddress += JSON.stringify(value) + ';';
      await AsyncStorage.setItem('@addressuser', jsonAddress);
      this.closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  configAddress = (itens) => {
    let objectOptions = itens;
    let indexList = 0;
    let indexOf = null;
    let extras = [];

    for (let index = false; index !== true; ) {
      indexOf = objectOptions.indexOf(';');
      if (indexOf !== -1) {
        let sliceObject = objectOptions.slice(0, indexOf);
        if (extras.length === 0) {
          let sliceTemp = sliceObject.slice(0, sliceObject.length);
          let object = JSON.parse(sliceTemp);
          extras.push(object);
        } else {
          let object = JSON.parse(sliceObject);
          extras.push(object);
        }
        objectOptions = objectOptions.slice(indexOf + 1, objectOptions.length);
      } else {
        index = true;
      }
      indexList++;
    }

    return extras;
  };

  render() {
    const {
      addressType,
      numberFocused,
      streetFocused,
      districtFocused,
      zipFocused,
      cityFocused,
      modalVisible,
      complementFocused,
      refFocused,
      city,
      address,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor={'#3b5998'} barStyle="light-content" />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.instructionContainer}>
            <Paragraph style={styles.instruction}>
              Digite os detalhes do seu endereço de entrega
            </Paragraph>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.small]}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.zip = r;
                  }}
                  onChangeText={this.onChangeText('zip')}
                  onFocus={this.onFocus('zipFocused')}
                  inputFocused={zipFocused}
                  onSubmitEditing={this.focusOn(this.city)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholder="CEP"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                />
              </View>

              <View style={[styles.inputContainer, styles.large]}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.city = r;
                  }}
                  onChangeText={this.onChangeText('city')}
                  onFocus={this.onFocus('cityFocused')}
                  inputFocused={cityFocused}
                  onSubmitEditing={this.saveAddress}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  placeholder="Cidade"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  value={city}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.large]}>
                <UnderlineTextInput
                  onChangeText={this.onChangeText('address')}
                  onFocus={this.onFocus('numberFocused')}
                  inputFocused={numberFocused}
                  onSubmitEditing={this.focusOn(this.street)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholder="Endereço"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  value={address}
                />
              </View>

              <View style={[styles.inputContainer, styles.small]}>
                <UnderlineTextInput
                  onChangeText={this.onChangeText('number')}
                  onFocus={this.onFocus('numberFocused')}
                  inputFocused={numberFocused}
                  onSubmitEditing={this.focusOn(this.street)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholder="Número"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.district = r;
                }}
                onChangeText={this.onChangeText('district')}
                onFocus={this.onFocus('districtFocused')}
                inputFocused={districtFocused}
                onSubmitEditing={this.focusOn(this.zip)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Bairro"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.large]}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.street = r;
                  }}
                  onChangeText={this.onChangeText('complement')}
                  onFocus={this.onFocus('complementFocused')}
                  inputFocused={complementFocused}
                  onSubmitEditing={this.focusOn(this.erf)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholder="Complemento(Lote,Bloco,Quadra)"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.large]}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.street = r;
                  }}
                  onChangeText={this.onChangeText('ref')}
                  onFocus={this.onFocus('refFocused')}
                  inputFocused={refFocused}
                  onSubmitEditing={this.focusOn(this.erf)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholder="Referência"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{
                backgroundColor: '#3b5998',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => this.saveAddress()}>
              <View>
                <Text style={{color: '#FAFAFA', fontSize: 18}}>SALVAR</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ActivityIndicatorModal
            statusBarColor={'#000'}
            message="Aguarde um momento . . ."
            onRequestClose={this.closeModal}
            title="Salvando endereço"
            visible={modalVisible}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

// AddAddressB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 104,
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
    bottom: 0,
    width: '100%',
  },
  touchArea: {
    marginHorizontal: 16,
    marginBottom: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(35, 47, 52, 0.12)',
    overflow: 'hidden',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  instruction: {
    marginTop: 32,
    paddingHorizontal: 40,
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  inputContainer: {
    margin: 8,
  },
  small: {
    flex: 2,
  },
  large: {
    flex: 5,
  },
});
