// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Alert,
} from 'react-native';

import ImageView from 'react-native-image-view';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import {getLinkImageRaffle, configImagens} from '../../utils/utils';
import Button from '../../components/buttons/Button';
import {
  fetchUsuarioID,
  acceptRaffle,
  buyQuoata,
  updateFichaUsuario,
  fetchUserWinnerRaffle,
} from '../../service/app.service';

import {fetchRifasID} from '../../service/rifa.service';

// import components
import {
  Heading5,
  Heading6,
  Subtitle1,
  Paragraph,
} from '../../components/text/CustomText';

import {RAFFLE_STATUS} from '../../utils/raffleStatusConstants';

const {width} = Dimensions.get('window');

// CheckoutB
export default class DetailOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      raffle: props.route.params,
      imageIndex: 0,
      isImageViewVisible: false,
      images: [],
      userLogged: [],
      showByQuoata: false,
      showWinner: false,
      quoataWinner: [],
    };
    this.constructorArrayImagens();
    this.getuserLogged();
    this.showWinnerRaffle();
  }

  async componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.getuserLogged();
    });
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  showWinnerRaffle = async () => {
    const {raffle} = this.state;
    if (raffle.status === RAFFLE_STATUS.FINALIZADO_COM_GANHADOR) {
      const quoataWinner = await fetchUserWinnerRaffle(raffle.cota_venc);
      this.setState({showWinner: true, quoataWinner});
    }
  };

  renderShowWinnerRaffle = () => {
    const {userLogged, raffle, quoataWinner} = this.state;
    if (raffle.status !== 3) return;
    if (
      userLogged.ID === raffle.usuarioID ||
      userLogged.ID === quoataWinner[0]?.usuario_comprador
    ) {
      return (
        <View
          style={{
            margin: 5,
            backgroundColor: '#bbe9bb',
            padding: 20,
            borderRadius: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text color="gray.400">Código Ganhador</Text>
              <Text style={styles.textTitle20} color="black">
                {quoataWinner[0]?.cotaHash}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text color="gray.400">Nome do Ganhador</Text>
              <Text style={styles.textTitle16} color="black">
                {quoataWinner[0]?.nome}
              </Text>
            </View>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <View style={{width: '30%', height: 1, backgroundColor: 'black'}} />
            <View>
              <Text style={{width: 150, textAlign: 'center'}}>
                Contato/Endereço
              </Text>
            </View>
            <View style={{width: '30%', height: 1, backgroundColor: 'black'}} />
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{flex: 1}}>
              <Text color="gray.400">Telefone</Text>
              <Text style={styles.textTitle20} color="black">
                {quoataWinner[0]?.celular}
              </Text>
            </View>
            <View style={{width: '30%'}}>
              <Text color="gray.400">CEP</Text>
              <Text style={styles.textTitle20} color="black">
                {quoataWinner[0]?.cep}
              </Text>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={{flex: 1}}>
              <Text color="gray.400">Endereço</Text>
              <Text style={styles.textTitle16} color="black">
                {quoataWinner[0]?.cidade} / {quoataWinner[0]?.bairro} /{' '}
                {quoataWinner[0]?.endereco} / {quoataWinner[0]?.numero}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  getuserLogged = async () => {
    try {
      const userLoggedString = await AsyncStorage.getItem('@loginuser');
      const user = JSON.parse(userLoggedString);
      const userLogged = await fetchUsuarioID(user.id);
      this.setState({
        userLogged,
      });
    } catch (e) {
      console.error(e);
    }
  };

  actionAcceptRaffle = async (rifaID, tempoSorteio) => {
    let textAlert = '';
    const accept = await acceptRaffle(rifaID, tempoSorteio);

    accept === true
      ? (textAlert = 'Rifa aceita')
      : (textAlert = 'Rifa não aceita, tente novamente mais tarde');

    Alert.alert('Aceite da rifa', `${textAlert}`, [
      {text: 'OK', onPress: () => this.goBack()},
    ]);
  };

  showButtonsAcceptRaffle = () => {
    const {userLogged, raffle} = this.state;
    if (userLogged.tipo === 1 && raffle.status === 1) {
      return (
        <View style={styles.bxButton}>
          <Button
            onPress={() =>
              this.actionAcceptRaffle(raffle.ID, raffle.tempo_sorteio)
            }
            color={'green'}
            title="ACEITAR A RIFA"
            titleColor={'white'}
          />
        </View>
      );
    }
  };

  actionBuyQuota = async (rifaID, usuarioComprador) => {
    const {userLogged, raffle} = this.state;
    const {navigation} = this.props;
    let textBuyAlert;
    let number = raffle.valor.slice(2);

    if (userLogged.ficha < parseFloat(number)) {
      textBuyAlert =
        'Você não tem ficha suficiente para comprar a cota, compre mais ficha para continuar.';
      Alert.alert('Opa!', `${textBuyAlert}`, [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Comprar ficha',
          onPress: () => {},
        },
      ]);
      return;
    }

    if (userLogged.enderecoID === null) {
      textBuyAlert =
        'Antes de comprar a cota, você precisa cadastrar o endereço para receber o prêmio.';
      Alert.alert('Opa!', `${textBuyAlert}`, [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Cadastrar Endereço',
          onPress: () => {
            navigation.navigate('AddAddress');
          },
        },
      ]);
      return;
    }

    const buy = await buyQuoata(rifaID, usuarioComprador);

    if (buy === true) {
      const updateFicha = userLogged.ficha - parseFloat(number);
      await updateFichaUsuario(userLogged.ID, updateFicha);
      textBuyAlert = 'Cota foi comprada com sucesso!\nBoa sorte!';
    } else {
      textBuyAlert = 'Cota não pode ser comprada, tente novamente mais tarde';
    }

    Alert.alert('Opa!', `${textBuyAlert}`, [
      {text: 'OK', onPress: () => this.goBack()},
    ]);
  };

  showButtonBuyQuota = () => {
    const {userLogged, raffle} = this.state;
    if (userLogged === undefined) return;
    if (raffle === undefined) return;

    if (userLogged.ID != raffle.usuarioID && userLogged.tipo !== 1) {
      return (
        <View style={styles.bxButton}>
          <Button
            onPress={() => this.actionBuyQuota(raffle.ID, userLogged.ID)}
            borderRadius={4}
            color={'#3b5998'}
            small
            title="COMPRAR COTA"
            titleColor={'white'}
          />
        </View>
      );
    }
  };

  constructorArrayImagens = async () => {
    const {raffle} = this.state;
    const raffleReceive = await fetchRifasID(raffle.ID);
    const raffleDetail = this.configImagesRaffles(raffleReceive);

    let images = [];
    raffleDetail[0].imagem[0].forEach((raffleImagem) => {
      if (raffleImagem !== '') {
        images.push({
          source: {
            uri: getLinkImageRaffle(raffleImagem),
          },
          title: 'Paris',
          width: 400,
          height: 800,
        });
      }
    });

    this.setState({
      raffle: raffleDetail[0],
    });

    setTimeout(() => {
      this.setState({images});
    }, 500);
  };

  configImagesRaffles(raffle) {
    raffle.forEach((raffle) => {
      raffle.imagem = configImagens(raffle.imagem);
    });
    return raffle;
  }

  renderImagesRaffles = () => {
    const {images} = this.state;
    if (images.length !== 0) {
      return images.map((image, index) => (
        <TouchableOpacity
          key={image.title}
          onPress={() => {
            this.setState({
              imageIndex: index,
              isImageViewVisible: true,
            });
          }}>
          <Image
            style={{width, height: 300}}
            source={image.source}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ));
    }
    return <></>;
  };

  render() {
    const {isImageViewVisible, imageIndex, raffle, images, showByQuoata} =
      this.state;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor={'#3b5998'} barStyle="light-content" />
        <ScrollView>
          <ScrollView horizontal>{this.renderImagesRaffles()}</ScrollView>

          {this.renderShowWinnerRaffle()}
          <View style={styles.bxContent}>
            <Heading5>{raffle.titulo_rifa}</Heading5>
            <View style={styles.bxInfoRaffle}>
              <View style={styles.bl1InfoRaffle}>
                <FAIcon name={'clock-o'} size={24} color={'darkgrey'} />
                <Text style={styles.fontBold}>Duração</Text>
                <Subtitle1>{raffle.tempo_sorteio} Dias</Subtitle1>
              </View>
              <View style={styles.bl2InfoRaffle}>
                <MAIcon name={'attach-money'} size={24} color={'darkgrey'} />
                <Text style={styles.fontBold}>Valor da cota</Text>
                <Subtitle1>{raffle.valor}</Subtitle1>
              </View>
            </View>
            <View style={styles.pd10}>
              <Heading6>Descrição</Heading6>
              <Paragraph>{raffle.desc_rifa}</Paragraph>
            </View>
          </View>
          {this.showButtonBuyQuota()}
          {this.showButtonsAcceptRaffle()}
        </ScrollView>

        <ImageView
          glideAlways
          images={images}
          imageIndex={imageIndex}
          animationType="fade"
          isVisible={isImageViewVisible}
          onClose={() => this.setState({isImageViewVisible: false})}
          onImageChange={(imageIndex) => {
            this.setState({imageIndex});
          }}
        />
      </SafeAreaView>
    );
  }
}

// CheckoutB Styles
const styles = StyleSheet.create({
  space: {marginTop: 20, marginBottom: 20},
  pt16: {paddingTop: 16},
  titleContainer: {
    paddingHorizontal: 16,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  bxContent: {
    padding: 20,
  },
  bxInfoRaffle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#ececec',
    borderRadius: 4,
    padding: 10,
  },
  bl1InfoRaffle: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  bl2InfoRaffle: {
    flex: 1,
    alignItems: 'center',
  },
  bl3InfoRaffle: {
    flex: 1,
    alignItems: 'center',
  },
  fontBold: {
    fontWeight: 'bold',
  },
  pd10: {
    padding: 10,
  },
  button: {
    width: '82%',
  },
  bxButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textTitle20: {fontSize: 20, fontWeight: 'bold'},
  textTitle16: {fontSize: 16, fontWeight: 'bold', marginTop: 5},
});
