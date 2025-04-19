// src/styles/globalStyles.js
import {StyleSheet} from 'react-native';
import {colors} from './colors';

const gStyles = StyleSheet.create({
  anchorTextSingUp: {
    fontFamily: 'FamiljenGrotesk-regular',
    color: colors.primary_purple,
    marginBottom: 80,
    fontWeight: 500
  },
  anchorLinkSingUp: {
    fontFamily: 'FamiljenGrotesk-regular',
    color: colors.secondary_purple,
    marginBottom: 80,
    fontWeight: 800
  },
  anchorText2SingIn: {
    fontFamily: 'FamiljenGrotesk-regular',
    color: colors.secondary_lillac,
    fontWeight: 500,
  },
  anchorLinkSingIn: {
    fontFamily: 'FamiljenGrotesk-regular',
    color: colors.blue,
    fontWeight: 700,
  },
  titleWaiting: {
    fontFamily: 'FamiljenGrotesk-regular',
    fontSize: 30,
    color: colors.secondary_purple,
    fontWeight: 700
  },
  smallTextWaiting: {
    fontFamily: 'FamiljenGrotesk-regular',
    fontSize: 15,
    color: colors.black,
    textAlign: "center",
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  avantarVoceAFrente: {
    fontFamily: 'FamiljenGrotesk-regular',
    height: 130
  }
});

export default gStyles;
