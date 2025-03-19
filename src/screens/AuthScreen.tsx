import React from 'react';

import {createBox, createText, useTheme} from '@shopify/restyle';
import {ThemeProps} from '../theme';
import {
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import images from '../data/images';
import { useNavigation } from '@react-navigation/native';

const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function AuthScreen() {
  // Para usar nos componentes que nao sao do restyle
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={images.background}
      style={styles.background}
      resizeMode="cover">
      <Box style={styles.logoContainer}>
        <Image source={images.avantar_logo_branca}></Image>
      </Box>
      <Box style={styles.mainContainer}>
        {/* Texto */}
        <Box>
          <Box>
            <Text variant="title" style={{marginBottom: -15}}>
              Este é o seu
            </Text>
            <Text variant="title" style={{marginBottom: -15}}>
              novo app da
            </Text>
            <Text variant="title" style={{marginBottom: -15}}>
              Avantar
            </Text>
          </Box>
          <Box style={styles.smallText}>
            <Text>onde você indica e ganha</Text>
            <Text>comissão ou cashback.</Text>
          </Box>
        </Box>
        {/* Botões */}
        <Box style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.btnStyle}
            onPress={() => navigation.navigate('RegisterScreen')}
            activeOpacity={0.9}>
            <Text>QUERO CRIAR UMA CONTA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnStyle2}
            onPress={() => navigation.navigate("LoginScreen")}
            activeOpacity={0.9}>
            <Text>ACESSAR CONTA</Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  logoContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },

  mainContainer: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },

  smallText: {
    marginTop: 25,
  },

  buttonsContainer: {
    marginTop: 35,
    gap: 15,
  },

  btnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3E0085',
    height: 50,
    borderRadius: 50,
  },

  btnStyle2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
  },
});
