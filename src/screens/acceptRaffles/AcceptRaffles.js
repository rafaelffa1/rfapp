// import node modules
import React, {Component} from 'react';
import {
  StatusBar,
  View,
  Dimensions,
  Animated,
  Pressable,
  ScrollView,
  AsyncStorage,
} from 'react-native';

import {NativeBaseProvider, Box} from 'native-base';
import {TabView, SceneMap} from 'react-native-tab-view';

import RaffleCard from '../../components/cards/RaffleCard';
import {context} from '../../service/app.service';
import OrderCardB from '../../components/cards/OrderCardB';
import {getuserLogged, configImagens} from '../../utils/utils';
import {fetchRifasPageStatus} from '../../service/rifa.service';
import {fetchUsuarioID} from '../../service/app.service';
const initialLayout = {width: Dimensions.get('window').width};

// FavoritesB
export default class AcceptRaffles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      activityIndicatorModalVisible: false,
      index: 0,
      routes: [
        {key: 'verificacao', title: 'Verificação'},
        {key: 'consulta', title: 'Consulta'},
      ],
      rafflesUser: [],
      userLogged: [],
    };
    this.page = 1;
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.fetchRaffles();
    this.fetchUserLogged();
    this.getuserLogged();
    navigation.addListener('focus', async () => {
      this.fetchRaffles();
    });
  }

  async fetchRaffles() {
    const rafflesUser = await fetchRifasPageStatus(this.page, 1);
    this.configImagesRaffles(rafflesUser);
  }

  async fetchUserLogged() {
    const userLooged = await getuserLogged();
    console.error(userLooged);
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

  firstRoute = () => {
    const {rafflesUser, userLogged} = this.state;
    return (
      <ScrollView>
        <View>
          {rafflesUser &&
            rafflesUser?.map((raffle) => {
              return (
                <RaffleCard
                  raffle={raffle}
                  userLogged={userLogged}
                  image={this.highlightImageRaffle(raffle)}
                  navigation={this.props.navigation}
                />
              );
            })}
        </View>
      </ScrollView>
    );
  };
  SecondRoute = () => <Box flex={1} bg="violet.400" />;

  renderScene = SceneMap({
    verificacao: this.firstRoute,
    consulta: this.SecondRoute,
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
