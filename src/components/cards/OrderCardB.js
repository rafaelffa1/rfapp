// import dependencies
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text
} from 'react-native';

// import utils
import getImgSource from '../../utils/getImgSource';

const testeFoto = require('../../assets/img/about_1.jpg');

// OrderItemB Styles
const styles = StyleSheet.create({
  container: {
    margin: 15
  },
  bxData: {
    width: '100%',
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2
  },
  textData: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  bxOrder: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA'
  },
  bxImageOrder: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  imageOrder: {
    width: '100%',
    height: 90
  },
  boxInfo: {
    width: '65%'
  },
  boxInInfo: {
    flexDirection: 'row'
  },
  boxInInfo2: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 2,
    marginLeft: -5
  },
  boxTextInfo: {
    width: '48%',
    backgroundColor: '#EDEDED',
    padding: 5,
    marginTop: 12
  },
  boxTextInfo2: {
    width: '48%',
    backgroundColor: '#EDEDED',
    padding: 5,
    marginTop: 12,
    marginLeft: 4
  },
  boxTextInfoTipo1: {
    width: '48%',
    backgroundColor: '#ffbc40',
    padding: 5,
    marginTop: 12,
    marginLeft: 4
  },
  boxTextInfoTipo2: {
    width: '48%',
    backgroundColor: '#fff940',
    padding: 5,
    marginTop: 12,
    marginLeft: 4
  },

  boxTextInfoTipo3: {
    width: '48%',
    backgroundColor: '#b6ff40',
    padding: 5,
    marginTop: 12,
    marginLeft: 4
  },

  boxTextInfoTipo4: {
    width: '48%',
    backgroundColor: '#77D353',
    padding: 5,
    marginTop: 12,
    marginLeft: 4
  },

  boxTextInfoTipo5: {
    width: '48%',
    backgroundColor: '#ef6969',
    padding: 5,
    marginTop: 12,
    marginLeft: 4
  },

  bxBtnDetalhar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#77D353',
    height: 35
  },
  textBtnDetalhar: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  },
  btnAcao: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4D75C3',
    height: 35
  },
  btnTextAcao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  }
});

// OrderItemB Props
type Props = {
  onPress: () => {},
  onPressDetail: () => {},
  item: Object,
  logo: String
};

function formatNumber(amount, decimalCount = 2, decimal = ",", thousands = ".") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    // console.log(e)
  }
};

function configDate(data) {

  let dataSplit = data.split(' ');
  let dataPTArray = dataSplit[0].split('-');

  let dataString = `${dataPTArray[2]}/${dataPTArray[1]}/${dataPTArray[0]} ${dataSplit[1]}`

  return dataString;
}

// OrderItemB
const OrderCardB = ({
  onPress,
  onPressDetail,
  logo,
  item
}: Props) => (

  <View style={styles.container}>
    <View style={styles.bxData}>
      {/* {item.ID}#  */}
      <Text style={styles.textData}>{configDate(item.dataPedido)}</Text>
    </View>
    <View style={styles.bxOrder}>
      <View style={styles.bxImageOrder}>
        <Image source={getImgSource(logo)}
          style={{ width: '100%', height: 80, resizeMode: "contain" }} >
        </Image>
      </View>
      <View style={styles.boxInfo}>
        <View style={styles.boxInInfo}>
          <View style={styles.boxTextInfo}>
            <View><Text>Tipo do pedido</Text></View>
            {item.tipo === 0 ?
              <View><Text style={{ fontWeight: 'bold' }}>Retirada</Text></View>
              :
              <View><Text style={{ fontWeight: 'bold' }}>Entrega</Text></View>
            }
          </View>

          {item.status === 1 &&
            <View style={styles.boxTextInfoTipo1}>
              <View><Text style={{ color: 'white' }}>Status</Text></View>
              <View><Text style={{ fontWeight: 'bold', color: 'white' }}>Confirmando...</Text></View>
            </View>
          }

          {item.status === 2 &&
            <View style={styles.boxTextInfoTipo2}>
              <View><Text style={{ color: 'rgba(0,0,0,0.5)' }}>Status</Text></View>
              <View><Text style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}>Preparando...</Text></View>
            </View>
          }

          {item.status === 3 &&
            item.tipo === 1 &&
            <View style={styles.boxTextInfoTipo3}>
              <View><Text style={{ color: 'rgba(0,0,0,0.5)' }}>Status</Text></View>
              <View><Text style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}>A caminho...</Text></View>
            </View>
          }

          {item.status === 3 &&
            item.tipo === 0 &&
            <View style={styles.boxTextInfoTipo3}>
              <View><Text style={{ color: 'rgba(0,0,0,0.5)' }}>Status</Text></View>
              <View><Text style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}>P/ Retirada...</Text></View>
            </View>
          }

          {item.status === 4 &&
            <View style={styles.boxTextInfoTipo4}>
              <View><Text style={{ color: '#FAFAFA' }}>Status</Text></View>
              <View><Text style={{ fontWeight: 'bold', color: '#FAFAFA' }}>Finalizado</Text></View>
            </View>
          }

          {item.status === 5 &&
            <View style={styles.boxTextInfoTipo5}>
              <View><Text style={{ color: '#FAFAFA' }}>Status</Text></View>
              <View><Text style={{ fontWeight: 'bold', color: '#FAFAFA' }}>Cancelado</Text></View>
            </View>
          }

        </View>
        <View style={styles.boxInInfo2}>
          {
            item.tipo === 1 &&
            <View style={styles.boxTextInfo2}>
              <View><Text>Taxa de entrega</Text></View>
              <View><Text style={{ fontWeight: 'bold' }}>R$ {formatNumber(item.tx_entrega)}</Text></View>
            </View>
          }

          <View style={styles.boxTextInfo2}>
            <View><Text>Total</Text></View>
            <View><Text style={{ fontWeight: 'bold' }}>R$ {formatNumber(item.valorTotal)}</Text></View>
          </View>
        </View>
      </View>
    </View>
    <View style={{ flexDirection: 'row' }}>

      {
        item.status <= 3 ?
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => onPress()} style={styles.btnAcao}>
              <Text style={styles.btnTextAcao}>Acompanhar</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => onPressDetail()} style={styles.bxBtnDetalhar}>
              <Text style={styles.textBtnDetalhar}>Detalhar</Text>
            </TouchableOpacity>
          </View>
      }


    </View>
  </View>
);

export default OrderCardB;
