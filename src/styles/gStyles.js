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
  },
  titleWaiting: {
    fontSize: 30,
    color: colors.secondary_purple,
    fontWeight: 700
  },
  smallTextWaiting: {
    fontSize: 15,
    color: colors.black,
    textAlign: "center",
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  avantarVoceAFrente: {
    height: 130
  }
});

export default gStyles;
