// import dependencies
import React from 'react';
import {StyleSheet, TextStyle} from 'react-native';

// import components
import {ButtonText} from '../text/CustomText';

// LinkButton Styles
const styles = StyleSheet.create({
  title: {
    padding: 2,
    color: '#000',
  },
});

// LinkButton Props
type Props = {
  onPress: () => void,
  title: string,
  titleStyle: TextStyle,
};

// LinkButton
const LinkButton = ({onPress, title, titleStyle}: Props) => (
  <ButtonText onPress={onPress} style={[styles.title, titleStyle]}>
    {title || 'Link Button'}
  </ButtonText>
);

export default LinkButton;
