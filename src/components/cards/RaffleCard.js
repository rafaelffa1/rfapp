// import node modules
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Box, Text, Image, Stack, Heading} from 'native-base';
import CountDown from 'react-native-countdown-component';
import {convertToSeconds} from '../../utils/utils';
import {RAFFLE_STATUS, USER_TYPE} from '../../utils/raffleStatusConstants';

export default class RaffleCard extends Component {
  showLabelForAdmin = () => {
    const {raffle, userLogged} = this.props;
    if (userLogged === undefined || userLogged.length === 0) return;
    if (userLogged.tipo === USER_TYPE.ADMIN) {
      switch (raffle.status) {
        case RAFFLE_STATUS.PENDENTE_CONFIRMAÇÃO:
          return (
            <View style={styles.labelPendente}>
              <Text>Pendente de confirmação</Text>
            </View>
          );
        case RAFFLE_STATUS.FINALIZADO_COM_GANHADOR:
          return (
            <View style={styles.labelComGanhador}>
              <Text style={styles.textLabelComGanhador}>
                RIFA SORTEADA E TEM UM GANHADOR!!
              </Text>
            </View>
          );
        case RAFFLE_STATUS.FINALIZADO_SEM_GANHADOR:
          return (
            <View style={styles.labelSemGanhador}>
              <Text>RIFA FINALIZADA MAS SEM GANHADOR =(</Text>
            </View>
          );
      }
    }
  };

  showLabel = () => {
    const {raffle} = this.props;

    switch (raffle.status) {
      case RAFFLE_STATUS.RIFA_RODANDO:
        return (
          <>
            <Text color="gray.400">Tempo de sorteio</Text>
            <CountDown
              until={convertToSeconds(raffle.data_sorteio)}
              onFinish={() => {}}
              size={20}
              running={raffle.status === 2 ? true : false}
              timeLabels={{
                d: 'Dias',
                h: 'Horas',
                m: 'Minutos',
                s: 'Segundos',
              }}
            />
          </>
        );
      case RAFFLE_STATUS.FINALIZADO_COM_GANHADOR:
        return (
          <View style={styles.labelComGanhador}>
            <Text style={styles.textLabelComGanhador}>
              RIFA SORTEADA E TEM UM GANHADOR!!
            </Text>
          </View>
        );
      case RAFFLE_STATUS.FINALIZADO_SEM_GANHADOR:
        return (
          <View style={styles.labelSemGanhador}>
            <Text>RIFA FINALIZADA MAS SEM GANHADOR =(</Text>
          </View>
        );
    }
  };

  render() {
    const {navigation, raffle, image} = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailOrder', raffle)}
        style={styles.boxCard}>
        <Box shadow={2} rounded="lg" maxWidth="100%" style={{margin: 10}}>
          <Image
            source={{
              uri: image,
            }}
            alt="image base"
            resizeMode="cover"
            height={200}
            roundedTop="md"
          />
          {this.showLabelForAdmin()}
          <Stack space={4} p={[4, 4, 8]}>
            {this.showLabel()}
            <Heading size={['md', 'lg', 'md']} noOfLines={2}>
              {raffle?.titulo_rifa}
            </Heading>
            <Text
              lineHeight={[20, 5, 7]}
              noOfLines={[4, 4, 2]}
              color="gray.700">
              {raffle?.desc_rifa}
            </Text>
          </Stack>{' '}
        </Box>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  boxCard: {backgroundColor: '#f4f3f5', marginBottom: 10, borderRadius: 10},
  labelComGanhador: {backgroundColor: 'green', padding: 10, borderRadius: 10},
  textLabelComGanhador: {fontWeight: 'bold', color: '#FFF'},
  labelSemGanhador: {backgroundColor: '#d74d4d', padding: 10, borderRadius: 10},
  labelPendente: {backgroundColor: 'yellow', padding: 10},
});
