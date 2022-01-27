// import dependencies
import React from 'react';
import { Modal, StatusBar, StyleSheet, Text, View } from 'react-native';

// import components
import Button from '../buttons/Button';
import Icon from '../icon/Icon';

import Layout from '../../theme/layout';

// InfoModal Config

// InfoModal Styles
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: Layout.SCREEN_WIDTH - 3 * Layout.MEDIUM_MARGIN,
    borderRadius: 4,
    backgroundColor: '#FAFAFA',
  },
  title: {
    paddingVertical: 4,
    fontWeight: '700',
    fontSize: 18,
    color: '#3b5998',
  },
  message: {
    marginBottom: 16,
    padding: 8,
    fontWeight: '400',
    color: '#3b5998',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 12,
    width: '100%',
  },
});

// InfoModal Props
type Props = {
  message: string,
  onRequestClose: () => {},
  iconName: string,
  iconColor: string,
  statusBarColor: string,
  title: string,
  buttonTitle: string,
  onButtonPress: () => {},
  visible: boolean,
};

// InfoModal
const InfoModal = ({
  message,
  onRequestClose = () => { },
  iconName,
  iconColor,
  statusBarColor = 'rgba(0, 0, 0, 0.52)',
  title,
  buttonTitle,
  onButtonPress,
  visible = false,
}: Props) => (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}>
      <StatusBar backgroundColor={statusBarColor} />
      <View style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          <Icon name={iconName} size={72} color={iconColor} />
          <Text style={styles.title}>{title}</Text>

          {message !== '' && message !== undefined && (
            <Text style={styles.message}>{message}</Text>
          )}

          <View style={styles.buttonContainer}>
            <Button onPress={onButtonPress} title={buttonTitle} />
          </View>
        </View>
      </View>
    </Modal>
  );

export default InfoModal;
