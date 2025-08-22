import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {CustomModal} from './CustomModal';
import {withdrawalAmountSchema} from '../schemas/validationSchema';

interface WithdrawalAmountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  balance: number;
  isLoading: boolean;
}

export function WithdrawalAmountModal({
  visible,
  onClose,
  onConfirm,
  balance,
  isLoading,
}: WithdrawalAmountModalProps) {
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });

  // Formatar o valor digitado
  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');

    if (numericValue === '') {
      return '';
    }

    // Converte para centavos
    const cents = parseInt(numericValue, 10);
    
    // Verifica se é um número válido
    if (isNaN(cents)) {
      return '';
    }
    
    const reais = cents / 100;

    // Formata para moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);
  };

  // Função para validar e processar o input
  const handleAmountChange = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    // Limita o valor a um máximo razoável (R$ 999.999,99)
    if (numericValue.length > 8) {
      return;
    }
    
    setAmount(numericValue);
  };

  // Atualiza o valor formatado quando o usuário digita
  useEffect(() => {
    setFormattedAmount(formatCurrency(amount));
  }, [amount]);

  // Função para adicionar valor rápido
  const addQuickAmount = (value: number) => {
    const currentAmount = parseFloat(amount) / 100 || 0;
    const newAmount = currentAmount + value;
    const newAmountCents = Math.floor(newAmount * 100);
    setAmount(newAmountCents.toString());
  };

  // Função para definir valor máximo
  const setMaxAmount = () => {
    setAmount(Math.floor(balance * 100).toString());
  };

  // Função para limpar valor
  const clearAmount = () => {
    setAmount('');
  };

  // Função para obter o valor numérico atual
  const getCurrentNumericAmount = (): number => {
    const numericAmount = parseFloat(amount) / 100;
    return isNaN(numericAmount) ? 0 : numericAmount;
  };

  // Função para validar o valor usando o schema
  const validateAmount = (amount: number) => {
    try {
      withdrawalAmountSchema.parse({ amount });
      return { isValid: true, error: null };
    } catch (error: any) {
      return { isValid: false, error: error.errors[0]?.message || 'Valor inválido' };
    }
  };

  // Função para confirmar saque
  const handleConfirm = () => {
    const numericAmount = getCurrentNumericAmount();

    // Validação usando o schema
    const validation = validateAmount(numericAmount);
    if (!validation.isValid) {
      setIsModalVisible(true);
      setModalMessage({
        title: 'Valor inválido',
        description: validation.error || 'Digite um valor válido para o saque',
      });
      return;
    }

    // Validação adicional: valor máximo (saldo disponível)
    if (numericAmount > balance) {
      setIsModalVisible(true);
      setModalMessage({
        title: 'Saldo insuficiente',
        description: 'O valor solicitado é maior que seu saldo disponível',
      });
      return;
    }

    onConfirm(numericAmount);
  };

  // Verifica se o botão deve estar habilitado
  const isButtonEnabled = () => {
    const numericAmount = getCurrentNumericAmount();
    const validation = validateAmount(numericAmount);
    return amount.length > 0 && validation.isValid && numericAmount <= balance && !isLoading;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-fifth_purple rounded-t-3xl min-h-[70%]">
            {/* Header */}
            <View className="flex-row justify-between items-center p-6">
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.gray}
                />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-white">
                Valor do Saque
              </Text>
              <View style={{width: 24}} />
            </View>

            {/* Saldo disponível */}
            <View className="p-6">
              <Text className="text-white text-sm mb-2">
                Saldo disponível
              </Text>
              <View className="flex-row items-start justify-start">
                <Text className="text-2xl font-bold text-white">
                  {showBalance ? (
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(balance)
                  ) : (
                    'R$ ******'
                  )}
                </Text>
                <TouchableOpacity
                  className="ml-3 justify-center items-center"
                  activeOpacity={0.8}
                  onPress={() => setShowBalance(!showBalance)}>
                  <Ionicons
                    name={showBalance ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input do valor */}
            <View className="px-6 mb-6">
              <Text className="text-white text-sm mb-2">Digite o valor</Text>
              <View className="border-2 border-primary_purple rounded-xl p-4">
                <TextInput
                  className="text-3xl font-bold text-white text-center"
                  value={formattedAmount}
                  onChangeText={handleAmountChange}
                  placeholder="R$ 0,00"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                  autoFocus
                  maxLength={20}
                />
              </View>
              {/* Indicador de valor mínimo */}
              <Text className="text-white text-xs mt-2 text-center">
                Valor mínimo: R$ 700,00
              </Text>
            </View>

            {/* Botões de valor rápido */}
            <View className="px-6 mb-6">
              <Text className="text-white text-sm mb-3">
                Valores rápidos
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[700, 1000, 1500, 2000].map(value => (
                  <TouchableOpacity
                    key={value}
                    className="bg-primary_purple px-4 py-2 rounded-lg"
                    onPress={() => addQuickAmount(value)}>
                    <Text className="text-white font-medium">
                      +R$ {value.toLocaleString('pt-BR')}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  className="bg-primary_purple px-4 py-2 rounded-lg"
                  onPress={setMaxAmount}>
                  <Text className="text-white font-medium">Máximo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="border-[1px] border-primary_purple px-4 py-2 rounded-lg"
                  onPress={clearAmount}>
                  <Text className="text-white font-medium">Limpar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Informações importantes */}
            <View className="px-6 mb-6">
              <View className="p-4 rounded-lg border border-primary_purple">
                <Text className="text-white text-sm">
                  • Valor mínimo para saque: R$ 700,00.{'\n'}• O saque será
                  processado pela sua unidade.{'\n'}• Você receberá uma
                  notificação no APP e em seu e-mail quando o pagamento for
                  realizado.
                </Text>
              </View>
            </View>

            {/* Botão confirmar */}
            <View className="px-6 pb-6 mb-6">
              <TouchableOpacity
                style={{
                  height: 64,
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: colors.blue,
                  opacity: !isButtonEnabled() ? 0.5 : 1,
                }}
                onPress={handleConfirm}
                disabled={!isButtonEnabled()}>
                <LinearGradient
                  style={{
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  colors={['#9743F8', '#4F00A9']}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}>
                  <Text className="text-white font-bold text-lg">
                    {isLoading ? 'Processando...' : 'Confirmar Saque'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
      />
    </Modal>
  );
}
