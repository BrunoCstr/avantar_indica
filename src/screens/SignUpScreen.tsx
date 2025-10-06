import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {
  collection,
  getDocs,
  getFirestore,
} from '@react-native-firebase/firestore';

import { signUpSchema, SignUpFormData } from '../schemas/validationSchema';
import images from '../data/images';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/Auth';
import { colors } from '../styles/colors';

import { BackButton } from '../components/BackButton';
import { CustomModal } from '../components/CustomModal';
import Dropdown from 'react-native-dropdown-picker';
import { withDefaultFont } from '../config/fontConfig';
import { FormInputOld } from '../components/FormInputOld';

const db = getFirestore();

export function SignUpScreen() {
  const [units, setUnits] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const { signUp } = useAuth();

  useEffect(() => {
    // Pegar as unidades do Firebase
    const fetchUnits = async () => {
      try {
        const unitsCollection = collection(db, 'units');
        const unitsSnapshot = await getDocs(unitsCollection);
        const unitsList = unitsSnapshot.docs.map(doc => doc.data());

        // Filtrar a unidade "Avantar Franqueadora" da lista
        const filteredUnits = unitsList.filter(
          unit => unit.name !== 'Avantar Franqueadora',
        );

        setUnits(filteredUnits);

        // Configurar items para o dropdown
        const dropdownItems = filteredUnits.map(unit => ({
          label: unit.name,
          value: unit.unitId,
        }));
        setItems(dropdownItems);
      } catch (error) {
        console.error('Erro ao buscar unidades:', error);
      }
    };

    fetchUnits();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      affiliated_to: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { confirmPassword, ...dataFiltred } = data;

    const unit = units.find(u => u.unitId === dataFiltred.affiliated_to);
    const unitName = unit?.name ?? '';

    setIsLoading(true);
    try {
      const errorCode = await signUp(
        dataFiltred.fullName,
        dataFiltred.email,
        dataFiltred.password,
        dataFiltred.affiliated_to,
        dataFiltred.phone,
        unitName,
      );

      if (errorCode) {
        switch (errorCode) {
          case 'auth/email-already-in-use':
            setModalMessage({
              title: 'Falha ao cadastrar o usuário',
              description: 'E-mail já cadastrado.',
            });
            break;
          case 'auth/invalid-email':
            setModalMessage({
              title: 'Falha ao cadastrar o usuário',
              description: 'E-mail inválido.',
            });
            break;
          case 'auth/weak-password':
            setModalMessage({
              title: 'Senha fraca',
              description:
                'A senha deve conter:\n• Pelo menos 8 caracteres\n• Pelo menos uma letra maiúscula\n• Pelo menos uma letra minúscula\n• Pelo menos um número\n• Pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)\n• Não pode ser uma senha comum',
            });
            break;
          case 'auth/operation-not-allowed':
            setModalMessage({
              title: 'Falha ao cadastrar o usuário',
              description:
                'Criação de conta com e-mail e senha não está habilitada.',
            });
            break;
          case 'auth/network-request-failed':
            setModalMessage({
              title: 'Falha ao cadastrar o usuário',
              description: 'Falha de conexão com a rede.',
            });
            break;
          default:
            setModalMessage({
              title: 'Falha ao cadastrar o usuário',
              description: 'Erro desconhecido, entre em contato com o suporte!',
            });
        }

        setIsModalVisible(true);
      } else {
        // Se não há erro, mostrar mensagem de sucesso
        setModalMessage({
          title: 'Quase lá!',
          description: 'Verifique seu e-mail para validar seu cadastro!',
        });
        setIsModalVisible(true);
      }
    } catch (error: any) {
      // Capturar erro de validação de senha com mensagem detalhada
      if (error.message && error.message.includes('A senha deve conter:')) {
        setModalMessage({
          title: 'Senha fraca',
          description: error.message,
        });
        setIsModalVisible(true);
        return;
      }

      setModalMessage({
        title: 'Falha ao cadastrar o usuário',
        description: 'Erro desconhecido, entre em contato com o suporte!',
      });
      setIsModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback>
        <View style={{ flexGrow: 1, justifyContent: 'center' }}>
          <ImageBackground
            source={images.bg_dark}
            className="flex-1"
            resizeMode="cover">
            <View className="pt-16 ml-10">
              <BackButton />
            </View>
            <View className="flex-1 justify-center ml-10 mr-10 pb-16">
              <View className="justify-center items-center">
                <Text className="font-semiBold text-2xl text-white mb-5">
                  Faça seu cadastro
                </Text>
              </View>

              <View className="gap-2">
                <FormInputOld
                  name="fullName"
                  placeholder="Nome e Sobrenome"
                  control={control}
                  errorMessage={errors.fullName?.message}
                  borderColor={colors.blue}
                  backgroundColor={colors.tertiary_purple_opacity}
                  placeholderColor={colors.white_opacity}
                  height={55}
                  color={colors.white}
                />
                <FormInputOld
                  name="email"
                  placeholder="E-mail"
                  control={control}
                  errorMessage={errors.email?.message}
                  borderColor={colors.blue}
                  backgroundColor={colors.tertiary_purple_opacity}
                  placeholderColor={colors.white_opacity}
                  height={55}
                  color={colors.white}
                />

                <FormInputOld
                  name="phone"
                  placeholder="Telefone (Opcional)"
                  control={control}
                  errorMessage={errors.phone?.message}
                  borderColor={colors.blue}
                  backgroundColor={colors.tertiary_purple_opacity}
                  placeholderColor={colors.white_opacity}
                  height={55}
                  color={colors.white}
                  mask={[
                    '(',
                    /\d/,
                    /\d/,
                    ')',
                    ' ',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    '-',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                />

                <View>
                  <View className="relative">
                    <FormInputOld
                      name="password"
                      placeholder="Senha"
                      secureTextEntry={showPassword}
                      control={control}
                      errorMessage={errors.password?.message}
                      borderColor={colors.blue}
                      backgroundColor={colors.tertiary_purple_opacity}
                      placeholderColor={colors.white_opacity}
                      height={55}
                      color={colors.white}
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute right-5 top-[28%]"
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}>
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <View className="relative">
                    <FormInputOld
                      name="confirmPassword"
                      placeholder="Confirme sua senha"
                      secureTextEntry={showConfirmPassword}
                      control={control}
                      errorMessage={errors.confirmPassword?.message}
                      borderColor={colors.blue}
                      backgroundColor={colors.tertiary_purple_opacity}
                      placeholderColor={colors.white_opacity}
                      height={55}
                      color={colors.white}
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute right-5 top-[28%]"
                    activeOpacity={0.8}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>

                {/* Input de Seleção da Unidade */}
                <Controller
                  control={control}
                  render={({ field: { onChange, value: fieldValue } }) => (
                    <Dropdown
                      arrowIconStyle={{
                        tintColor: colors.white,
                      }}
                      listItemLabelStyle={{
                        color: colors.white,
                      }}
                      searchPlaceholderTextColor={colors.white_opacity}
                      arrowIconColor={colors.white}
                      dropDownContainerStyle={{
                        backgroundColor: colors.fifth_purple,
                        borderColor: colors.blue,
                      }}
                      searchContainerStyle={{
                        backgroundColor: colors.fifth_purple,
                        borderColor: colors.blue,
                      }}
                      searchTextInputStyle={{
                        borderColor: colors.blue,
                      }}
                      open={open}
                      value={fieldValue}
                      items={items}
                      setOpen={setOpen}
                      setValue={(callback) => {
                        const newValue = callback(fieldValue);
                        onChange(newValue);
                      }}
                      onChangeValue={(val) => {
                        onChange(val);
                      }}
                      setItems={setItems}
                      style={{
                        borderWidth: 1,
                        borderColor: errors.affiliated_to ? 'red' : colors.blue,
                        backgroundColor: colors.tertiary_purple_opacity,
                        marginBottom: 6,
                        height: 55,
                        width: '100%',
                        padding: 15,
                        paddingLeft: 20,
                        borderRadius: 10,
                      }}
                      placeholderStyle={{
                        color: errors.affiliated_to
                          ? 'red'
                          : colors.white_opacity,
                      }}
                      textStyle={withDefaultFont({
                        color: colors.white,
                        fontSize: 14,
                      })}
                      searchable
                      maxHeight={300}
                      placeholder="Selecione uma unidade"
                      searchPlaceholder="Pesquisar..."
                    />
                  )}
                  name="affiliated_to"
                />
              </View>

              {/* Envio do Formulário de Cadastro */}
              <View className="mt-5">
                <Button
                  text="ENTRAR"
                  backgroundColor="blue"
                  onPress={handleSubmit(onSubmit)}
                  textColor="tertiary_purple"
                  height={55}
                  fontSize={25}
                  fontWeight="bold"
                  isLoading={isLoading}
                />
              </View>

              <View className="mt-5 flex-row justify-center gap-2">
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onChange(!value)}
                      className="flex-row items-center gap-1">
                      <MaterialCommunityIcons
                        name={
                          value ? 'checkbox-marked' : 'checkbox-blank-outline'
                        }
                        size={24}
                        color={errors.acceptTerms ? 'red' : colors.white}
                      />
                      <TouchableOpacity
                        onPress={() => setIsTermsModalVisible(true)}>
                        <Text
                          className="underline text-center"
                          style={{
                            color: errors.acceptTerms ? 'red' : colors.white,
                          }}>
                          Aceito termos e condições*
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                  name="acceptTerms"
                />
              </View>
              <CustomModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title={modalMessage.title}
                description={modalMessage.description}
                buttonText="FECHAR"
              />
              <Modal
                visible={isTermsModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsTermsModalVisible(false)}>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    minHeight: '100%',
                    paddingHorizontal: 16,
                  }}
                  keyboardShouldPersistTaps="handled">
                  <View
                    style={{
                      backgroundColor: '#170138',
                      borderRadius: 14,
                      padding: 24,
                      width: '95%',
                      maxWidth: 420,
                      borderWidth: 2,
                      borderColor: '#29F3DF',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 16,
                      }}>
                      Termo de Uso e Política de Privacidade
                    </Text>
                    <ScrollView
                      style={{ maxHeight: 400, marginBottom: 20 }}
                      showsVerticalScrollIndicator={true}>
                      <Text style={{ color: '#fff', fontSize: 15 }}>
                        <Text style={{ fontWeight: 'bold' }}>
                          TERMO DE USO DO APLICATIVO DE INDICAÇÕES – AVANTAR FRANCHISING{`\n`}
                          Data da última atualização: 06/10/2025{`\n\n`}
                        </Text>

                        Este Termo de Uso regula as condições gerais de utilização do aplicativo de indicações (“Aplicativo”), desenvolvido e mantido pela AVANTAR FRANCHISING, doravante denominada “Franqueadora”.{`\n\n`}
                        Ao acessar e utilizar o Aplicativo, o USUÁRIO declara ter lido, compreendido e aceito integralmente os presentes termos.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>1. OBJETIVO DO APLICATIVO{`\n`}</Text>
                        Facilitar a indicação de potenciais clientes (leads) para as unidades franqueadas da rede AVANTAR;{`\n`}
                        Permitir o acompanhamento do status das indicações pelos usuários;{`\n`}
                        Possibilitar o pagamento de comissões, cashback ou bonificações, conforme regras específicas definidas pela Franqueadora.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>2. PÚBLICOS ENVOLVIDOS{`\n`}</Text>
                        Indicadores, Franqueados, Administração da Franqueadora e Usuários Administradores.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>3. DADOS COLETADOS{`\n`}</Text>
                        Nome, e-mail, telefone, CPF ou CNPJ, chave Pix, dados bancários, dados dos leads (nome, telefone, tipo de seguro), dados de uso (histórico de propostas, status, movimentações).{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>4. FINALIDADE DO USO DOS DADOS{`\n`}</Text>
                        Direcionamento de leads, comunicação entre as partes, análise de performance, pagamentos.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>5. COMPARTILHAMENTO DE DADOS{`\n`}</Text>
                        Leads com franqueados. Usuários com parceiros como instituições de pagamento, marketing, nuvem, etc.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>6. BASE LEGAL (LGPD){`\n`}</Text>
                        Consentimento, legítimo interesse, execução de contrato, obrigações legais.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>7. SEGURANÇA DA INFORMAÇÃO{`\n`}</Text>
                        Criptografia, HTTPS, autenticação e servidores seguros.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>8. DIREITOS DO USUÁRIO{`\n`}</Text>
                        Acesso, correção, exclusão, portabilidade, revogação de consentimento (via suporte@indica.avantar.com.br).{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>9. REGRAS DE USO{`\n`}</Text>
                        Uso ilícito é vedado. Descumprimentos podem levar à suspensão/cancelamento do acesso.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>10. CONSENTIMENTO E REGISTRO{`\n`}</Text>
                        Aceite obrigatório no primeiro acesso. O fornecimento de dados de terceiros exige autorização.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>11. ARMAZENAMENTO E RETENÇÃO{`\n`}</Text>
                        Dados em nuvem, retidos conforme necessidade legal e finalidade do uso.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>12. ATUALIZAÇÕES DOS TERMOS{`\n`}</Text>
                        A Franqueadora poderá atualizar os termos com aviso prévio no app. Uso contínuo implica aceitação.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>DÚVIDAS E CONTATO:{`\n`}</Text>
                        suporte@indica.avantar.com.br{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>
                          POLÍTICA DE PRIVACIDADE – AVANTAR INDICA{`\n`}
                          Última atualização: 06/10/2025{`\n\n`}
                        </Text>

                        <Text style={{ fontWeight: 'bold' }}>1. COLETA DE DADOS{`\n`}</Text>
                        1.1. Dos Indicadores (Usuários do App):{`\n`}
                        • Nome, e-mail, telefone, CPF ou CNPJ, chave PIX{`\n`}
                        • Coletados mediante cadastro voluntário e consentimento expresso{`\n\n`}
                        1.2. Dos Leads (Terceiros Indicados):{`\n`}
                        • Coleta inicial: apenas e-mail e tipo de seguro de interesse{`\n`}
                        • Coleta posterior (mediante consentimento do próprio lead): nome completo e telefone{`\n`}
                        • Método de coleta: o próprio lead fornece seus dados através de formulário após receber e aceitar convite por e-mail{`\n\n`}
                        1.3. Dados de Uso:{`\n`}
                        • Data e horário das indicações, status da proposta{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>2. FINALIDADES{`\n`}</Text>
                        Os dados são utilizados para:{`\n`}
                        • Direcionar leads às unidades corretas{`\n`}
                        • Permitir comunicação entre franqueado, indicador e lead{`\n`}
                        • Avaliar desempenho de unidades e indicadores{`\n`}
                        • Processar pagamentos e bonificações{`\n`}
                        • Cumprir obrigações legais e operacionais{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>3. COMPARTILHAMENTO DE DADOS{`\n`}</Text>
                        3.1. Dados dos Indicadores:{`\n`}
                        • Compartilhados com unidades franqueadas para identificação da origem da indicação e processamento de bonificações{`\n`}
                        • Compartilhados com parceiros operacionais (processadores de pagamento, sistemas de auditoria) sob acordos de confidencialidade{`\n\n`}
                        3.2. Dados dos Leads:{`\n`}
                        • Nunca são compartilhados sem o consentimento prévio e explícito do próprio lead{`\n`}
                        • Após o lead confirmar seu interesse e fornecer seus dados voluntariamente, essas informações são compartilhadas exclusivamente com a unidade franqueada responsável pelo atendimento{`\n`}
                        • O lead é informado previamente sobre qual unidade receberá seus dados{`\n\n`}
                        Responsabilidade compartilhada:{`\n`}
                        • O indicador é responsável por garantir autorização verbal prévia para envio do convite ao e-mail do lead{`\n`}
                        • A Avantar garante que nenhum dado sensível (nome completo, telefone) seja processado antes da confirmação ativa do lead{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>3.1. CONSENTIMENTO DO LEAD (TERCEIRO INDICADO){`\n`}</Text>
                        Antes que qualquer dado pessoal de um lead seja armazenado:{`\n`}
                        1) Coleta Inicial Limitada: O indicador fornece apenas o e-mail e o tipo de seguro de interesse do lead{`\n`}
                        2) Verificação de Consentimento: Enviamos e-mail solicitando (i) confirmação de interesse, (ii) autorização para compartilhar dados com a unidade franqueada e (iii) aceite dos Termos e da Política{`\n`}
                        3) Fornecimento Voluntário: Somente após o clique de confirmação e o fornecimento voluntário de nome e telefone pelo lead, os dados são armazenados e compartilhados com a unidade{`\n`}
                        4) Recusa: Se o lead não confirmar ou recusar, nenhum dado adicional além do e-mail é coletado e este é excluído após 7 dias{`\n`}
                        5) Transparência: O lead é informado sobre (i) quem indica, (ii) qual unidade receberá os dados, (iii) finalidade do contato e (iv) seus direitos sob a LGPD{`\n\n`}
                        Importante: O app não permite que indicadores insiram dados completos de terceiros sem consentimento ativo do lead via e-mail.{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>4. BASE LEGAL (LGPD){`\n`}</Text>
                        4.1. Para Indicadores:{`\n`}
                        • Consentimento expresso no momento do cadastro{`\n`}
                        • Execução de contrato (programa de indicações){`\n\n`}
                        4.2. Para Leads:{`\n`}
                        • Consentimento explícito e verificável via confirmação por e-mail{`\n`}
                        • O lead fornece seus próprios dados de forma voluntária após ser informado{`\n\n`}
                        4.3. Legítimo Interesse:{`\n`}
                        • Processamento de indicações dentro do modelo de franquia{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>5. SEGURANÇA{`\n`}</Text>
                        • Dados trafegam via HTTPS e são armazenados em banco seguro{`\n`}
                        • Acesso restrito a usuários autenticados e habilitados{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>6. DIREITOS DOS USUÁRIOS{`\n`}</Text>
                        Conforme a LGPD, o usuário tem direito de:{`\n`}
                        • Acessar, corrigir ou excluir seus dados{`\n`}
                        • Solicitar portabilidade{`\n`}
                        • Revogar o consentimento, a qualquer momento, salvo obrigações legais{`\n`}
                        Solicitações: suporte@indica.avantar.com.br{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>7. ARMAZENAMENTO E RETENÇÃO{`\n`}</Text>
                        • Dados armazenados em nuvem enquanto durar a relação com o usuário ou conforme exigência legal{`\n`}
                        • Após esse período, os dados serão anonimizados ou excluídos{`\n\n`}

                        <Text style={{ fontWeight: 'bold' }}>8. ATUALIZAÇÕES{`\n`}</Text>
                        A franqueadora poderá atualizar esta Política a qualquer momento. O aviso será feito via aplicativo, e o uso contínuo após alterações implica aceite automático.{`\n\n`}
                      </Text>
                    </ScrollView>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#29F3DF',
                        borderRadius: 10,
                        paddingVertical: 12,
                        alignItems: 'center',
                      }}
                      onPress={() => setIsTermsModalVisible(false)}>
                      <Text
                        style={{
                          color: '#170138',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        FECHAR
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Modal>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
