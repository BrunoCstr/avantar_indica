import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ImageBackground,
} from 'react-native';

import {colors} from '../styles/colors';
import images from '../data/images';
import {BackButton} from '../components/BackButton';
import {CommissioningParameters, RulesComponent} from '../components/RulesComponent';
import { useAuth } from '../contexts/Auth';
import { getFirestore, collection, getDocs, query, where } from '@react-native-firebase/firestore';

export function Rules() {
  const { userData } = useAuth();
  const [commissioningParameters, setCommissioningParameters] = useState<CommissioningParameters>();
  const [unitData, setUnitData] = useState<any>(null);

  function formatRule(rule: string | undefined) {
    switch (rule) {
      case 'cliente_indicador':
        return 'Cliente Indicador';
      case 'parceiro_indicador':
        return 'Parceiro Indicador';
      case 'admin_franqueadora':
        return 'Admin Franqueadora';
      case 'admin_unidade':
        return 'Admin Unidade';
      case 'nao_definida':
      default:
        return 'Não Definida';
    }
  }

  useEffect(() => {
    const fetchUnit = async () => {
      if (!userData?.affiliated_to) return;
      try {
        const db = getFirestore();
        const unitsRef = collection(db, 'units');
        const q = query(unitsRef, where('unitId', '==', userData.affiliated_to));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setUnitData(data);
          setCommissioningParameters(data.bonusParameters ?? []);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da unidade:', error);
      }
    };
    fetchUnit();
  }, [userData]);

  const userRule = formatRule(userData?.rule);
  const unitName = unitData?.name;
  const updatedAt = unitData?.updatedAt;

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
• Pode cadastrar sub-indicadores (ex: equipe de vendas).`}
            titleDescription3="Sua permissão atual:"
            description3={userRule}

            rewards={`• As recompensas variam de acordo com o produto indicado configurado pela sua unidade.
  • Cada produto possui um valor de recompensa diferente.
  • Franqueados podem personalizar os valores de cashback para campanhas específicas.
  • O sistema aceita personalização de recompensas tanto para clientes quanto para parceiros.
  • Para parceiros indicadores, saque mínimo de meio salário mínimo.`}

            bonusParameters={commissioningParameters}
            unitName={unitName}
            updatedAt={updatedAt}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
