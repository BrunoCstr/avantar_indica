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
  anchorTextSingUp: {
    color: colors.primary_purple,
    marginBottom: 80,
    fontWeight: 500
  },
  anchorLinkSingUp: {
    color: colors.secondary_purple,
    marginBottom: 80,
    fontWeight: 800
  },
  anchorTextSingIn: {
    color: colors.secondary_lillac,
    fontWeight: 500,
    paddingLeft: 10,
    marginTop: 10
  },
  anchorText2SingIn: {
    color: colors.secondary_lillac,
    fontWeight: 500,
  },
  anchorLinkSingIn: {
    color: colors.blue,
    fontWeight: 700,
  }
});

export default gStyles;
