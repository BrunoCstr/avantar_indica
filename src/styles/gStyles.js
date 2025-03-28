// src/styles/globalStyles.js
import {StyleSheet} from 'react-native';
import {colors} from './colors';

const gStyles = StyleSheet.create({
  title: {
    fontSize: 35,
    color: colors.white,
  },
  smallText: {
    color: colors.white,
  },
  btnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tertiary_purple,
    height: 50,
    borderRadius: 50,
  },
  btnStyleTransparent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
  },
});

export default gStyles;
