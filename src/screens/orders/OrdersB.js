// import node modules
import React, {Component} from 'react';
import {
  StatusBar,
  View,
  Dimensions,
  Animated,
  Pressable,
  ScrollView,
} from 'react-native';

import {NativeBaseProvider, Box} from 'native-base';
import {TabView, SceneMap} from 'react-native-tab-view';

// import components
import RaffleCard from '../../components/cards/RaffleCard';
import QuoataCard from '../../components/cards/QuoataCard';
import {context} from '../../service/app.service';
import OrderCardB from '../../components/cards/OrderCardB';
import {getuserLogged, configImagens} from '../../utils/utils';
import {
  fetchRifasUsuarioPage,
  fetchCotasUsuarioPage,
} from '../../service/rifa.service';
const initialLayout = {width: Dimensions.get('window').width};

// FavoritesB
export default class OrdersB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      activityIndicatorModalVisible: false,
      index: 0,
      routes: [
        {key: 'minharifas', title: 'Minhas rifas'},
        {key: 'minhascotas', title: 'Mihas cotas'},
      ],
      rafflesUser: [],
      quotasUser: [],
    };
    this.page = 1;
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const userLogged = await getuserLogged();
    this.fetchRafflesUser(userLogged);
    this.fetchQuotasUser(userLogged);
    navigation.addListener('focus', async () => {
      this.fetchRafflesUser(userLogged);
      this.fetchQuotasUser(userLogged);
    });
  }

  async fetchRafflesUser(userLogged) {
    const rafflesUser = await fetchRifasUsuarioPage(userLogged.id, this.page);
    this.configImagesRaffles(rafflesUser);
  }

  async fetchQuotasUser(userLogged) {
    const quotasUser = await fetchCotasUsuarioPage(userLogged.id, this.page);
    this.setState({quotasUser});
  }

  configImagesRaffles(rafflesUser) {
    rafflesUser.forEach((raffle) => {
      raffle.imagem = configImagens(raffle.imagem);
    });
    this.setState({rafflesUser});
  }

  highlightImageRaffle(raffle) {
    return `${context}${raffle.imagem[0][0]}`;
  }

  firstRoute = () => {
    const {rafflesUser} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#FFF', paddingTop: 20}}>
        {rafflesUser &&
          rafflesUser?.map((raffle) => {
            return (
              <RaffleCard
                raffle={raffle}
                image={this.highlightImageRaffle(raffle)}
                navigation={this.props.navigation}
              />
            );
          })}
      </ScrollView>
    );
  };
  SecondRoute = () => {
    const {quotasUser} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#FFF', paddingTop: 20}}>
        {quotasUser &&
          quotasUser?.map((quota) => {
            return (
              <QuoataCard
                navigation={this.props.navigation}
                quotasUser={quota}
              />
            );
          })}
      </ScrollView>
    );
  };

  renderScene = SceneMap({
    minharifas: this.firstRoute,
    minhascotas: this.SecondRoute,
  });

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  toTrackOrder = (pedidoID) => () => {
    const {navigation} = this.props;
    navigation.navigate('TrackOrder', {pedidoID});
  };

  toDetailOrder = (pedidoID) => () => {
    const {navigation} = this.props;
    navigation.navigate('OrderDetailFinished', {pedidoID});
  };

  renderOrderItem = ({item}) => {
    return (
      <OrderCardB
        item={item}
        onPress={this.toTrackOrder(item.ID)}
        onPressDetail={this.toDetailOrder(item.ID)}
        logo={`${context}${item.logo}`}
      />
    );
  };

  setIndex(index) {
    this.setState({index});
  }

  renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5,
            ),
          });

          return (
            <Box flex={1} alignItems="center" p={2}>
              <Pressable
                onPress={() => {
                  console.log(i);
                  this.setIndex(i);
                }}>
                <Animated.Text style={{opacity}}>{route.title}</Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
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

  render() {
    const {index, routes} = this.state;
    return (
      <NativeBaseProvider>
        <TabView
          navigationState={{index, routes}}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={(index) => this.setIndex(index)}
          initialLayout={initialLayout}
          style={{marginTop: StatusBar.currentHeight}}
        />
      </NativeBaseProvider>
    );
  }
}
