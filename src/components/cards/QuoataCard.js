// import node modules
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Box, Text, Stack, Heading} from 'native-base';

export default class QuoataCard extends Component {
  showLabelQuoataWinner = () => {
    const {quotasUser} = this.props;
    if (quotasUser.ID === quotasUser.cota_sorteio) {
      return (
        <View style={styles.labelComGanhador}>
          <Text style={styles.textLabelComGanhador}>
            VOCÊ GANHOU!! A SUA COTA FOI SORTEADA!
          </Text>
        </View>
      );
    }
  };

  render() {
    const {navigation, quotasUser} = this.props;
    const raffle = {
      ID: quotasUser.rifaID,
      titulo_rifa: quotasUser.titulo_rifa,
      desc_rifa: quotasUser.desc_rifa,
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailOrder', raffle)}
        style={styles.boxCard}>
        <Box shadow={2} rounded="lg" maxWidth="100%" style={{margin: 10}}>
          <Stack space={4} p={[4, 4, 8]}>
            {this.showLabelQuoataWinner()}
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text color="gray.400">Código da cota</Text>
                <Text style={styles.textTitle20} color="black">
                  {quotasUser?.cotaHash}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold'}} color="gray.400">
                  Valor
                </Text>
                <Text style={styles.textTitle16} color="black">
                  {quotasUser?.valor}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text color="gray.400">Data da compra</Text>
                <Text style={styles.textTitle16} color="black">
                  {quotasUser?.data_sorteio}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold'}} color="gray.400">
                  Data do sorteio
                </Text>
                <Text style={styles.textTitle16} color="black">
                  {quotasUser?.data_sorteio}
                </Text>
              </View>
            </View>

            <Text color="gray.400">Titulo da Rifa</Text>
            <Heading size={['md', 'lg', 'md']} noOfLines={2}>
              {quotasUser?.titulo_rifa}
            </Heading>
            <Text
              lineHeight={[20, 5, 7]}
              noOfLines={[4, 4, 2]}
              color="gray.700">
              {quotasUser?.desc_rifa}
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
  textTitle20: {fontSize: 20, fontWeight: 'bold'},
  textTitle16: {fontSize: 16, fontWeight: 'bold'},
});
