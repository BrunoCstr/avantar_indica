import React from 'react';
import {
  Text,
  View,
  ImageBackground,
} from 'react-native';

import {colors} from '../styles/colors';
import images from '../data/images';
import {BackButton} from '../components/BackButton';
import {RulesComponent} from '../components/RulesComponent';

export function Rules() {

  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 ml-7 mr-7">
        <View className="pt-16">
          <BackButton
            color={colors.primary_purple}
            borderColor={colors.primary_purple}
          />
        </View>

        <View className="bg-tertiary_purple rounded-3xl mt-10 h-3/4 justify-center items-center p-10">
          <Text className="text-blue text-3xl font-bold mb-8">REGRAS</Text>
          <RulesComponent
            title="TIPOS DE USUÁRIOS"
            titleDescription="Cliente Indicador"
            description={`• Pode indicar amigos e familiares para contratação de seguros.
• Recebe cashback em forma de desconto na renovação ou contratação de novos seguros.,
• Não é possível sacar dinheiro, apenas trocar por benefícios.,
• Cadastro simples, com vinculação a uma unidade.`}
           
           titleDescription2='Parceiro Indicador'
           description2={`• Indicadores profissionais autorizados por uma unidade franqueada.
• Pode indicar normalmente e resgatar valores em dinheiro, com valor mínimo de saque equivalente a meio salário mínimo.
• Pode cadastrar sub-indicadores (ex: equipe de vendas) com permissões específicas.`}

            rewards={`• As recompensas variam de acordo com o produto indicado.
  • Cada produto possui um valor de recompensa diferente.
  • Franqueados podem personalizar os valores de cashback para campanhas específicas.
  • O sistema aceita personalização de recompensas tanto para clientes quanto para parceiros.
  • Para parceiros indicadores, saque mínimo de meio salário mínimo.`}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
