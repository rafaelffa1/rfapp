import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

// TouchableItem config
const ANDROID_VERSION_LOLLIPOP = 21;

// TouchableItem
const TouchableItem = props => {
  if (
    Platform.OS === 'android' &&
    Platform.Version >= ANDROID_VERSION_LOLLIPOP
  ) {
    const {
      borderless = false,
      rippleColor = 'rgba(0, 0, 0, 0.16)',
      children,
      style,
      ...rest
    } = props;
    return (
      <TouchableNativeFeedback
        {...rest}
        style={null}
        background={TouchableNativeFeedback.Ripple(rippleColor, borderless)}>
        <View style={style}>{React.Children.only(children)}</View>
      </TouchableNativeFeedback>
    );
  }

  const {children} = props;
  return (
    <TouchableOpacity activeOpacity={0.85} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableItem;
