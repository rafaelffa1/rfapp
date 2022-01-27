// import dependencies
import React, {Component} from 'react';
import {
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  TextInput,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import Carousel from 'react-native-banner-carousel';

import getImgSource from '../../utils/getImgSource.js';

// import components
import {Subtitle2} from '../../components/text/CustomText';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import InfoModal from '../../components/modals/InfoModal';
import ContainedButton from '../../components/buttons/ContainedButton';
import {TextInputMask} from 'react-native-masked-text';
import FAIcon from 'react-native-vector-icons/dist/FontAwesome';
import {
  Select,
  VStack,
  Input,
  CheckIcon,
  Center,
  NativeBaseProvider,
} from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  fetchEstadosIBGE,
  selecionarTodasCategorias,
} from '../../service/app.service';
import {insertRifa} from '../../service/rifa.service';
import {getuserLogged} from '../../utils/utils';

const WRONG_ICON =
  Platform.OS === 'ios'
    ? 'ios-close-circle-outline'
    : 'md-close-circle-outline';

const ICON_ALERT = Platform.OS === 'ios' ? 'ios-alert' : 'md-alert';

const BannerWidth = Dimensions.get('window').width;

// CheckoutB
export default class CheckoutB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoModalVisible: false,
      activityIndicatorModalVisible: false,
      feedBackIcon: null,
      feedBackTitle: null,
      feedBackDesc: null,
      feedBackTitleBtn: null,
      userLogged: null,
      titleActivityIndicatorModal: 'Carregando...',
      selectCategory: null,
      tempo_sorteio: '00:00',
      valor: '00',
      statesCitys: [],
      statePicked: '',
      quant_cotas: '10',
      quant_ganhadores: '',
      photos: [{showPhoto: false, uri: '', b64: '', mime: ''}],
      titulo_rifa: '',
      desc_rifa: '',
      categorias: [],
      categoriaSelect: null,
    };
    this.getuserLoggedFunc();
    this.setStatesField();
    this.imageTouched = null;
    this.fetchCategories();
  }

  async fetchCategories() {
    const categorias = await selecionarTodasCategorias();
    this.setState({categorias});
  }

  async setStatesField() {
    const statesCitys = await fetchEstadosIBGE();
    this.setState({statesCitys});
  }

  getuserLoggedFunc = async () => {
    try {
      const userLogged = await getuserLogged();
      this.setState({userLogged});
    } catch (e) {
      console.error(e);
    }
  };

  closeActivityIndicatorModal = () => {
    this.setState({
      activityIndicatorModalVisible: false,
    });
  };

  showActivityIndicatorModal = () => {
    this.setState({
      activityIndicatorModalVisible: true,
    });
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  showInfoModal = () => async () => {
    const {addressSelected, tipoPedido} = this.state;

    if (tipoPedido === true && addressSelected === null) {
      this.setState({
        feedBackIcon: WRONG_ICON,
        feedBackTitle: 'Endereço não cadastrado.'.toUpperCase(),
        feedBackDesc: 'Por favor, cadastre um endereço para a entrega.',
        feedBackTitleBtn: 'Fechar',
        infoModalVisible: true,
        activityIndicatorModalVisible: false,
      });
      return;
    }
  };

  closeInfoModal = (value) => () => {
    const {feedBackTitleBtn} = this.state;
    const {navigation} = this.props;

    switch (feedBackTitleBtn) {
      case 'Fechar':
        this.setState({infoModalVisible: value});
        break;
      case 'Ok, ir para home':
        this.setState(
          {
            infoModalVisible: value,
          },
          () => {
            navigation.navigate('HomeNavigator');
          },
        );
        break;
      case 'Ok, ir para minhas rifas':
        this.setState(
          {
            infoModalVisible: value,
          },
          () => {
            navigation.navigate('Pedidos');
          },
        );
        break;
      default:
        break;
    }

    if (feedBackTitleBtn === 'Fechar') {
    } else {
    }
  };

  keyExtractor = (item) => item.ID.toString();

  openBottomSheet = () => {
    this.bottomSheet.open();
  };

  openBottomSheetMedia = (imageTouchedIndex) => {
    this.imageTouched = imageTouchedIndex;
    this.RBSheet.open();
  };

  launchCameraAction = () => {
    const {photos} = this.state;
    const setImage = (receive) => {
      const photosTmp = photos;
      photosTmp[this.imageTouched].uri = receive.uri;
      photosTmp[this.imageTouched].showPhoto = true;
      photosTmp[this.imageTouched].b64 = receive.base64;
      photosTmp[this.imageTouched].mime = 'image/jpeg';
      const setPhotos = {showPhoto: false, uri: '', b64: '', mime: ''};
      const arrayPhotos = [...photosTmp, setPhotos];
      this.setState({photos: arrayPhotos});
    };

    this.props.navigation.navigate('LaunchCamera', {
      setImage: setImage,
    });
    this.RBSheet.close();
  };

  launchGaleryAction = () => {
    const {photos} = this.state;
    this.RBSheet.close();
    var options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    launchImageLibrary(options, (res) => {
      if (!res.didCancel) {
        const photosTmp = photos;
        photosTmp[this.imageTouched].uri = res.assets[0].uri;
        photosTmp[this.imageTouched].showPhoto = true;
        photosTmp[this.imageTouched].b64 = res.assets[0].base64;
        photosTmp[this.imageTouched].mime = res.assets[0].type;
        const setPhotos = {showPhoto: false, uri: '', b64: '', mime: ''};
        const arrayPhotos = [...photosTmp, setPhotos];
        this.setState({photos: arrayPhotos});
      }
    });
  };

  deletePhoto = (photoIndex) => {
    const {photos} = this.state;
    const photosTmp = photos;
    photosTmp.splice(photoIndex, 1);
    this.setState({photos: photosTmp});
  };

  renderPage(photo, index) {
    if (photo.showPhoto === false) {
      return (
        <TouchableOpacity
          onPress={() => this.openBottomSheetMedia(index)}
          style={styles.addImageButton}>
          <FAIcon name={'plus-circle'} size={20} color={'rgba(51,11,65,0.9)'} />
          <Text style={styles.textAddImageButton}>Adicionar imagem</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <ImageBackground
          key={index}
          source={getImgSource(photo.uri)}
          style={{flex: 1, position: 'relative'}}
          resizeMode="cover"
          imageStyle={styles.cardImg}>
          <TouchableOpacity
            onPress={() => this.deletePhoto(index)}
            style={styles.bxButtonDeletePhoto}>
            <FAIcon name={'trash'} size={40} color={'red'} />
          </TouchableOpacity>
        </ImageBackground>
      );
    }
  }

  renderPhotosCarousel = () => {
    const {photos} = this.state;
    return (
      <Carousel pageSize={BannerWidth} autoplay={false} loop={false} index={0}>
        {photos.map((photo, index) => this.renderPage(photo, index))}
      </Carousel>
    );
  };

  setStatePicked = (statePicked) => {
    this.setState({statePicked});
  };

  setQtdCotas = (quant_cotas) => {
    this.setState({quant_cotas});
  };

  setQtdGanhadores = (quant_ganhadores) => {
    this.setState({quant_ganhadores});
  };

  setCategories = (categoriaSelect) => {
    this.setState({categoriaSelect});
  };

  async createRifa() {
    const {
      tempo_sorteio,
      valor,
      titulo_rifa,
      desc_rifa,
      quant_cotas,
      quant_ganhadores,
      photos,
      userLogged,
    } = this.state;
    let photoObj = [];
    let sendBlock = false;

    if (tempo_sorteio === '' || desc_rifa === '' || quant_cotas === '') {
      sendBlock = true;
    }

    if (
      tempo_sorteio === '00:00' ||
      valor === '00' ||
      photos[0].showPhoto === false
    ) {
      sendBlock = true;
    }

    if (!sendBlock) {
      let tituloSplit = titulo_rifa.replace(/ /g, '_');
      let tituloTempChange = tituloSplit.toLowerCase();
      let nameImage = tituloTempChange
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      photos.forEach((photo) => {
        if (photo.b64 !== '') {
          photoObj.push({name: nameImage, mime: photo.mime, b64: photo.b64});
        }
      });

      const params = {
        titulo_rifa,
        desc_rifa,
        imagem: photoObj,
        valor,
        tempo_sorteio,
        usuarioID: userLogged.ID || userLogged.id,
        status: 1,
        quant_cotas,
        quant_ganhadores,
        categoria: 1,
      };

      const returnInserRifa = await insertRifa(params);

      if (returnInserRifa === false) {
        this.setState({
          feedBackIcon: WRONG_ICON,
          feedBackTitle: 'Problemas com nossos servidores.'.toUpperCase(),
          feedBackDesc: 'Por favor, tente novamente mais tarde.',
          feedBackTitleBtn: 'Fechar',
          infoModalVisible: true,
          activityIndicatorModalVisible: false,
        });
      } else {
        this.setState({
          feedBackIcon: ICON_ALERT,
          feedBackTitle: 'Rifa criada com sucesso!'.toUpperCase(),
          feedBackDesc:
            'O sistema irá fazer uma analise da rifa, para que tudo esteja de acordo com as normas do aplicativo.',
          feedBackTitleBtn: 'Ok, ir para minhas rifas',
          infoModalVisible: true,
          activityIndicatorModalVisible: false,
        });
      }
    } else {
      this.setState({
        feedBackIcon: WRONG_ICON,
        feedBackTitle: 'Rifa não pode ser criada.'.toUpperCase(),
        feedBackDesc:
          'Por favor, preencha todos os campos e insira imagens da rifa.',
        feedBackTitleBtn: 'Fechar',
        infoModalVisible: true,
        activityIndicatorModalVisible: false,
      });
    }
  }

  render() {
    const {
      activityIndicatorModalVisible,
      infoModalVisible,
      feedBackIcon,
      feedBackTitle,
      feedBackDesc,
      feedBackTitleBtn,
      titleActivityIndicatorModal,
      quant_cotas,
      quant_ganhadores,
      tempo_sorteio,
      valor,
      titulo_rifa,
      desc_rifa,
      categorias,
      categoriaSelect,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor={'#be00ff'} barStyle="light-content" />

        <ActivityIndicatorModal
          message="Por favor, aguarde um momento ..."
          onRequestClose={this.closeActivityIndicatorModal}
          title={titleActivityIndicatorModal}
          visible={activityIndicatorModalVisible}
        />

        <View style={styles.container}>
          <ScrollView>
            <View style={styles.bxContainer}>
              {this.renderPhotosCarousel()}

              <View style={styles.flexDirectionRow}>
                <View style={styles.bxTempoSorteio}>
                  <Subtitle2>Dias</Subtitle2>
                  <TextInputMask
                    type={'datetime'}
                    options={{format: 'DD'}}
                    value={tempo_sorteio}
                    style={styles.textTempoSorteio}
                    onChangeText={(text) => {
                      this.setState({tempo_sorteio: text});
                    }}
                  />
                </View>
                <View style={styles.bxValor}>
                  <Subtitle2>Valor da cota</Subtitle2>
                  <TextInputMask
                    type={'money'}
                    value={valor}
                    style={styles.textValor}
                    onChangeText={(text) => {
                      this.setState({
                        valor: text,
                      });
                    }}
                  />
                </View>
              </View>

              <View style={styles.bxSecoundBlockForm}>
                <NativeBaseProvider>
                  <Center>
                    <Input
                      w="100%"
                      mx={3}
                      placeholder="Titulo"
                      value={titulo_rifa}
                      onChangeText={(text) =>
                        this.setState({titulo_rifa: text})
                      }
                    />
                    <View style={styles.bxDescricaoArea}>
                      <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Descrição"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(text) =>
                          this.setState({desc_rifa: text})
                        }
                        value={desc_rifa}
                      />
                    </View>
                  </Center>

                  {/* {categorias !== null && (
                    <VStack
                      alignItems="center"
                      space={4}
                      style={{ marginTop: 10 }}>
                      <Select
                        selectedValue={categoriaSelect}
                        minWidth={'100%'}
                        accessibilityLabel="Categoria"
                        placeholder="Categoria"
                        baseStyle={{ width: '100%' }}
                        onValueChange={itemValue =>
                          this.setCategories(itemValue)
                        }
                        _selectedItem={{
                          bg: 'cyan.700',
                          endIcon: <CheckIcon size={4} />,
                        }}>
                        {categorias.map(categoria => {
                          return (
                            <Select.Item
                              label={categoria.nome_categoria}
                              value={categoria.ID}
                            />
                          );
                        })}
                      </Select>
                    </VStack>
                  )} */}

                  {/* <VStack alignItems="center" space={4} style={{marginTop: 10}}>
                    <Select
                      selectedValue={quant_cotas}
                      minWidth={'100%'}
                      accessibilityLabel="Quantidade de cotas"
                      placeholder="Quantidade de cotas"
                      baseStyle={{width: '100%'}}
                      onValueChange={(itemValue) => this.setQtdCotas(itemValue)}
                      _selectedItem={{
                        bg: 'cyan.700',
                        endIcon: <CheckIcon size={4} />,
                      }}>
                      <Select.Item label={'10'} value={'10'} />
                      <Select.Item label={'30'} value={'30'} />
                      <Select.Item label={'50'} value={'50'} />
                      <Select.Item label={'100'} value={'100'} />
                    </Select>
                  </VStack> */}

                  {/* <View style={{ paddingTop: 10 }}>
                    <Subtitle1 style={{ marginLeft: 5, marginBottom: 10 }}>Prêmio</Subtitle1>

                    <Input
                      w="100%"
                      placeholder="Titulo do Prêmio"
                      value={titulo_rifa}
                      onChangeText={text => this.setState({ titulo_rifa: text })}
                    />
                    <View style={styles.bxDescricaoArea}>
                      <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Descrição do prêmio"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={text => this.setState({ desc_rifa: text })}
                        value={desc_rifa}
                      />
                    </View>
                  </View> */}

                  {/* <VStack alignItems="center" space={4} style={{marginTop: 10}}>
                    <Select
                      selectedValue={quant_ganhadores}
                      minWidth={'100%'}
                      accessibilityLabel="Quantidade de ganhadores"
                      placeholder="Quantidade de ganhadores"
                      baseStyle={{width: '100%'}}
                      onValueChange={itemValue =>
                        this.setQtdGanhadores(itemValue)
                      }
                      _selectedItem={{
                        bg: 'cyan.700',
                        endIcon: <CheckIcon size={4} />,
                      }}>
                      <Select.Item label={'1'} value={'1'} />
                      <Select.Item label={'2'} value={'2'} />
                      <Select.Item label={'3'} value={'3'} />
                    </Select>
                  </VStack> */}

                  <RBSheet
                    ref={(ref) => {
                      this.RBSheet = ref;
                    }}
                    height={200}
                    closeOnDragDown={true}
                    customStyles={{
                      container: styles.RBSheetContainer,
                    }}>
                    <View style={styles.bxButtonsRBSheet}>
                      <TouchableOpacity
                        onPress={() => this.launchGaleryAction()}
                        style={styles.buttonGalery}>
                        <View style={styles.bxTextButtonRBSheet}>
                          <FAIcon
                            name={'image'}
                            size={20}
                            color={'rgba(51,11,65,0.9)'}
                          />
                          <Text style={styles.textButtonsRBSheet}>Galeria</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.launchCameraAction()}
                        style={styles.buttonCamera}>
                        <View style={styles.bxTextButtonRBSheet}>
                          <FAIcon
                            name={'camera'}
                            size={20}
                            color={'rgba(51,11,65,0.9)'}
                          />
                          <Text style={styles.textButtonsRBSheet}>
                            Tirar Foto
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </RBSheet>

                  <View style={styles.buttonContainer}>
                    <ContainedButton
                      onPress={() => this.createRifa()}
                      color={'#be00ff'}
                      titleColor={'#FFF'}
                      title={'Criar Rifa'.toUpperCase()}
                    />
                  </View>
                </NativeBaseProvider>
              </View>
            </View>
          </ScrollView>

          <InfoModal
            iconName={feedBackIcon}
            iconColor={'#3b5998'}
            title={feedBackTitle}
            message={feedBackDesc}
            buttonTitle={feedBackTitleBtn}
            onButtonPress={this.closeInfoModal(false)}
            onRequestClose={this.closeInfoModal(false)}
            visible={infoModalVisible}
          />
        </View>
      </SafeAreaView>
    );
  }
}

// CheckoutB Styles
const styles = StyleSheet.create({
  space: {marginTop: 20, marginBottom: 20},
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  addImageButton: {
    height: 250,
    width: '95%',
    borderRadius: 15,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: 'rgba(51,11,65,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAddImageButton: {
    color: 'rgba(51,11,65,0.9)',
    fontSize: 20,
  },
  RBSheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bxButtonsRBSheet: {
    flexDirection: 'row',
    padding: 20,
    height: 100,
  },
  buttonGalery: {
    width: '50%',
    borderRadius: 10,
    borderWidth: 3,
    height: 100,
    borderStyle: 'dashed',
    borderColor: 'rgba(51,11,65,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  buttonCamera: {
    width: '50%',
    borderRadius: 10,
    borderWidth: 3,
    height: 100,
    borderStyle: 'dashed',
    borderColor: 'rgba(51,11,65,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonsRBSheet: {
    fontSize: 20,
  },
  bxTextButtonRBSheet: {
    alignItems: 'center',
  },
  cardImg: {
    borderRadius: 8,
    width: '96%',
  },
  bxButtonDeletePhoto: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 5,
    height: 50,
    width: 50,
    position: 'absolute',
    top: 10,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerStates: {
    borderRadius: 5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    marginTop: 10,
  },
  bxTempoSorteio: {
    marginTop: 20,
    paddingLeft: 5,
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  textTempoSorteio: {
    color: '#000',
    fontSize: 35,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  bxContainer: {
    padding: 10,
    paddingTop: 20,
  },
  bxValor: {
    marginTop: 20,
    marginLeft: 10,
    paddingLeft: 5,
    width: '70%',
  },
  textValor: {
    color: '#000',
    fontSize: 35,
  },
  bxSecoundBlockForm: {
    marginTop: 15,
  },
  bxDescricaoArea: {
    marginTop: 10,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    padding: 5,
    width: '100%',
    borderRadius: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    color: '#000',
    fontSize: 16,
    marginLeft: 5,
  },
});
