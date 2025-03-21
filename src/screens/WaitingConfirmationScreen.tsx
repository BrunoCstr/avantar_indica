import React from 'react';
import {createBox, createText} from '@shopify/restyle';
import {ThemeProps} from '../theme';

const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function WaitingConfirmationScreen() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor='black' padding='l'>
      <Text variant="title">Agora é só aguardar!</Text>
      <Text mt='m' textAlign='center'>
        Seu cadastro foi enviado para a unidade escolhida, assim que seu
        cadastro for aprovado chegará em seu e-mail uma notificação!
      </Text>
    </Box>
  );
}