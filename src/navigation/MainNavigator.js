import React from 'react';
import {Platform, View, AsyncStorage, Image} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeNavigator from '../screens/HomeNavigator';
import Welcome from '../screens/welcome/WelcomeB';
import SignUp from '../screens/signup/SignUpB';
import SignIn from '../screens/signin/SignInB';
import ForgotPassword from '../screens/forgotpassword/ForgotPasswordB';
import Checkout from '../screens/checkout/CheckoutB';
import DetailOrder from '../screens/detailorder/DetailOrder';
import AcceptRaffles from '../screens/acceptRaffles/AcceptRaffles';
import LaunchCamera from '../screens/LaunchCamera';
import Verification from '../screens/verification/VerificationB';
import AddAddress from '../screens/address/AddAddressB';

// create stack navigator
const Stack = createStackNavigator();

async function loginuser() {
  // AsyncStorage.removeItem('@loginuser');
  try {
    let loginuserAsyc = await AsyncStorage.getItem('@loginuser');
    if (loginuserAsyc !== null) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
}

function LogoTitle() {
  if (Platform.OS === 'ios') {
    return (
      <View style={{width: 60, height: 50}}>
        <Image
          style={{width: 60, height: 50}}
          resizeMode={'contain'}
          source={require('../assets/logo_trans_2.png')}
        />
      </View>
    );
  } else {
    return (
      <View style={{width: 120, height: 70}}>
        <Image
          style={{width: '100%', height: 70}}
          resizeMode={'contain'}
          source={require('../assets/logo_trans_2.png')}
        />
      </View>
    );
  }
}

// MainNavigatorA
function MainNavigator() {
  const [data, updateData] = React.useState();
  React.useEffect(() => {
    const getData = async () => {
      const json = await loginuser();
      updateData(json);
    };
    getData();
  }, []);

  if (data !== undefined) {
    return (
      <View
        style={[
          {flex: 1},
          Platform.OS === 'android' && {backgroundColor: '#FFF'},
        ]}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              cardOverlayEnabled: false,
              cardShadowEnabled: false,
              // FIX ME: added to prevent some minor navigation glitches
              cardStyle: {
                backgroundColor: '#FFF',
              },
              headerStyle: {
                elevation: 1,
                shadowOpacity: 0,
              },
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTintColor: 'rgba(0,0,0,0.5)',
              headerTitleAlign: 'center',
            }}
            headerMode="float"
            animation="spring"
            initialRouteName={data === true ? 'HomeNavigator' : 'Welcome'}>
            <Stack.Screen
              name="LaunchCamera"
              component={LaunchCamera}
              options={{
                headerTintColor: '#FFF',
                headerStyle: {
                  backgroundColor: '#8400b1',
                  elevation: 0,
                  shadowOpacity: 0,
                },
                title: 'Camera',
              }}
            />

            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                title: 'Nova conta',
                headerTintColor: '#FFF',
                headerStyle: {
                  backgroundColor: '#8400b1',
                  elevation: 0,
                  shadowOpacity: 0,
                },
              }}
            />

            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{
                headerTintColor: '#FFF',
                headerStyle: {
                  backgroundColor: '#8400b1',
                  elevation: 0,
                  shadowOpacity: 0,
                },
                title: 'Entrar',
              }}
            />

            <Stack.Screen
              name="HomeNavigator"
              component={HomeNavigator}
              options={{
                headerStyle: {
                  backgroundColor: 'rgba(51,11,65,0.9)',
                },
                swipeEnabled: false,
                headerLeft: null,
                headerTitle: <LogoTitle />,
                headerTintColor: 'rgba(51,11,65,0.9)',
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{
                headerTintColor: '#FFF',
                headerStyle: {
                  backgroundColor: '#8400b1',
                  elevation: 0,
                  shadowOpacity: 0,
                },
                title: 'Esqueceu a senha?',
              }}
            />

            <Stack.Screen
              name="Checkout"
              component={Checkout}
              options={{
                title: 'Finalizando o pedido',
                headerStyle: {
                  backgroundColor: '#FFF',
                  elevation: 0,
                  shadowOpacity: 0,
                },
              }}
            />

            <Stack.Screen
              name="DetailOrder"
              component={DetailOrder}
              options={{
                headerStyle: {
                  backgroundColor: '#FFF',
                },
                title: 'Detalhes da Rifa',
              }}
            />

            <Stack.Screen
              name="AcceptRaffles"
              component={AcceptRaffles}
              options={{
                headerStyle: {
                  backgroundColor: '#FFF',
                },
                title: 'Aceite das Rifas',
              }}
            />

            <Stack.Screen
              name="Verification"
              component={Verification}
              options={{
                headerStyle: {
                  backgroundColor: '#FFF',
                },
                title: 'Verificação',
              }}
            />

            <Stack.Screen
              name="AddAddress"
              component={AddAddress}
              options={{
                headerStyle: {
                  backgroundColor: '#FFF',
                },
                title: 'Endereço',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="top" />
      </View>
    );
  } else {
    return <View></View>;
  }
}

export default MainNavigator;
