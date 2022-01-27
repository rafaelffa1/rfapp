// import dependencies
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Home from '../screens/Home/Home';
import Checkout from '../screens/checkout/CheckoutB';
import Orders from '../screens/orders/OrdersB';
import Settings from '../screens/settings/SettingsB';

// HomeNavigator Config
type Props = {
  color: string,
  focused: string,
  size: number,
};

const styles = StyleSheet.create({
  orderInative: {
    width: 20,
    height: 20,
    tintColor: '#f9e8ff',
    marginTop: 4,
  },
  orderActive: {
    width: 20,
    height: 20,
    tintColor: '#f9e8ff',
    marginTop: 4,
  },
  rafflesActive: {
    width: 20,
    height: 20,
    tintColor: '#ff9d00',
    backgroundColor: '#9000c1',
    padding: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  rafflesInative: {
    width: 20,
    height: 20,
    tintColor: '#9000c1',
    backgroundColor: '#ff9d00',
    padding: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
});

// create bottom tab navigator
const Tab = createBottomTabNavigator();

// HomeNavigator
function HomeNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}: Props) => {
          let iconName;
          let sizeI = size;

          if (route.name === 'Inicio') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'Busca') {
            iconName = 'magnify';
          } else if (route.name === 'Pedidos') {
            iconName = `cart${focused ? '' : '-outline'}`;
          } else if (route.name === 'Conta') {
            iconName = `account${focused ? '' : '-outline'}`;
          } else if (route.name === 'Carrinho') {
            iconName = `cart${focused ? '' : '-outline'}`;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={sizeI} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#ff9d00',
        inactiveTintColor: '#f9e8ff',
        showLabel: false, // hide labels
        style: {
          backgroundColor: 'rgba(51,11,65,0.9)', // TabBar background
        },
      }}>
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Carrinho" component={Checkout} />
      <Tab.Screen name="Pedidos" component={Orders} />
      <Tab.Screen name="Conta" component={Settings} />
    </Tab.Navigator>
  );
}

export default HomeNavigator;
