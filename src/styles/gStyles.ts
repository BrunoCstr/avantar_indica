// src/styles/globalStyles.js
import {StyleSheet} from 'react-native';
import {colors} from './colors';

const gStyles = StyleSheet.create({
  titleWaiting: {
    fontFamily: 'FamiljenGrotesk-Regular',
    fontSize: 30,
    color: colors.secondary_purple,
    fontWeight: 700
  },
  smallTextWaiting: {
    fontFamily: 'FamiljenGrotesk-Regular',
    fontSize: 15,
    color: colors.black,
    textAlign: "center",
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  avantarVoceAFrente: {
    fontFamily: 'FamiljenGrotesk-Regular',
    height: 130
  }
});

export default gStyles;
