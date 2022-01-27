import React, {Component} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  LayoutAnimation,
} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {context} from '../../service/app.service';

import SafeAreaView from '../../components/SafeAreaView';
import {Heading6} from '../../components/text/CustomText';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import RaffleCard from '../../components/cards/RaffleCard';
import {configImagens} from '../../utils/utils';
import {fetchRifasPageStatus} from '../../service/rifa.service';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 250;

// HomeB Config
const imgHolder = require('../../assets/img/imgholder.png');

// HomeB
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destaqueBanner: [],
      destaqueNormal: [],
      categorias: [],
      activityIndicatorModalVisible: true,
      rafflesUser: [],
    };
    this.page = 1;
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.fetchRafflesUser();
    navigation.addListener('focus', async () => {
      this.fetchRafflesUser();
    });
  }

  async fetchRafflesUser() {
    this.showActivityIndicatorModal();
    const rafflesUser = await fetchRifasPageStatus(this.page, 2);
    if (rafflesUser) {
      let raffles = this.configImagesRaffles(rafflesUser);
      this.setState({rafflesUser: raffles});
    }

    this.closeActivityIndicatorModal();
  }

  configImagesRaffles(rafflesUser) {
    rafflesUser.forEach((raffle) => {
      raffle.imagem = configImagens(raffle.imagem);
    });
    return rafflesUser;
  }

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

  navigateTo = (screen, data = []) => {
    const {navigation} = this.props;
    navigation.navigate(screen, {data});
  };

  onPressRemove = (item) => () => {
    let {quantity} = item;
    quantity -= 1;

    const {products} = this.state;
    const index = products.indexOf(item);

    if (quantity < 0) {
      return;
    }
    products[index].quantity = quantity;

    this.setState({
      products: [...products],
    });
  };

  onPressAdd = (item) => () => {
    const {quantity} = item;
    const {products} = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState({
      products: [...products],
    });
  };

  keyExtractor = (item, index) => index.toString();

  onPressLocation = () => {
    console.warn('testeeeeee');
  };

  renderPage(destaque, index) {
    const {navigation} = this.props;
    return (
      <TouchableHighlight
        onPress={() => navigation.navigate('Featured', destaque.ID)}
        key={index}>
        <Image
          style={{width: BannerWidth, height: BannerHeight}}
          source={{uri: `${context}${destaque.imagem}`}}
        />
      </TouchableHighlight>
    );
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  highlightImageRaffle(raffle) {
    return `${context}${raffle.imagem[0][0]}`;
  }

  renderRaffles = () => {
    const {rafflesUser} = this.state;
    if (rafflesUser === undefined) return;
    return rafflesUser?.map((raffle) => {
      return (
        <RaffleCard
          raffle={raffle}
          image={this.highlightImageRaffle(raffle)}
          navigation={this.props.navigation}
        />
      );
    });
  };

  render() {
    const {activityIndicatorModalVisible} = this.state;
    LayoutAnimation.easeInEaseOut();

    return (
      <NativeBaseProvider style={styles.screenContainer}>
        <SafeAreaView>
          <StatusBar backgroundColor={'#3b5998'} barStyle="light-content" />

          <ActivityIndicatorModal
            message="Por favor, aguarde um momento ..."
            onRequestClose={this.closeActivityIndicatorModal}
            title="Carregando"
            visible={activityIndicatorModalVisible}
          />

          <View>
            <ScrollView>
              <View>
                <View style={styles.titleContainer}>
                  <Heading6 style={styles.titleText}>
                    Rifas que estão rolando
                  </Heading6>
                </View>
                <View>{this.renderRaffles()}</View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }

  static navigationOptions = {
    headerTitle: (
      <View>
        <View>
          <Text>version 2.03</Text>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: '#5073C4',
      elevation: 0,
      borderBottomWidth: 0,
    },
  };
}

// HomeB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
  },
  viewAllText: {
    color: '#1b0cab',
  },
  categoriesList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 6,
  },
  categoryContainer: {
    marginLeft: 10,
    width: 112,
    height: 62,
  },
  categoryThumbnail: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
  categoryImg: {
    borderRadius: 8,
  },
  categoryName: {
    position: 'absolute',
    top: 6,
    left: 6,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryNameText: {
    fontWeight: '700',
    color: '#FAFAFA',
    letterSpacing: 0.6,
  },
});
