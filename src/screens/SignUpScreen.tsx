import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
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

import {signUpSchema, SignUpFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import images from '../data/images';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {colors} from '../styles/colors';

import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';
import Dropdown from 'react-native-dropdown-picker';
import {withDefaultFont} from '../config/fontConfig';

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

  const {signUp} = useAuth();

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
    formState: {errors},
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
    const {confirmPassword, ...dataFiltred} = data;

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
        <View style={{flexGrow: 1, justifyContent: 'center'}}>
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
                <FormInput
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
                <FormInput
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

                <FormInput
                  name="phone"
                  placeholder="Telefone"
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
                    <FormInput
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
                    <FormInput
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
                  render={({field: {onChange, value: fieldValue}}) => (
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
                  render={({field: {onChange, value}}) => (
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
                      Termos de Uso do Aplicativo
                    </Text>
                    <ScrollView
                      style={{maxHeight: 400, marginBottom: 20}}
                      showsVerticalScrollIndicator={true}>
                      <Text style={{color: '#fff', fontSize: 15}}>
                        <Text style={{fontWeight: 'bold'}}>
                          1. OBJETIVO{`\n`}
                        </Text>
                        O presente Termo de Uso regula o acesso e a utilização
                        do aplicativo AVANTAR INDICA destinado a:{`\n\n`}-
                        Facilitar a indicação de potenciais clientes (leads)
                        para unidades franqueadas;{`\n`}- Permitir o
                        acompanhamento do status dessas indicações;{`\n`}-
                        Recompensar os usuários com comissões, cashback em
                        apólices ou bonificações, conforme regras específicas da
                        franqueadora.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          2. DEFINIÇÕES{`\n`}
                        </Text>
                        - Indicador: Usuário que realiza indicações de leads por
                        meio do aplicativo.{`\n`}- Franqueado: Unidade
                        autorizada que recebe os leads e realiza o atendimento.
                        {`\n`}- Administrador: Responsável pela gestão da
                        plataforma e regras operacionais.{`\n`}- Lead: Potencial
                        cliente indicado.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          3. CONDIÇÕES DE USO{`\n`}
                        </Text>
                        - O aplicativo deve ser utilizado apenas por maiores de
                        18 anos com CPF/CNPJ válido.{`\n`}- É vedado o uso para
                        fins ilegais, fraudulentos ou que violem normas legais e
                        éticas.{`\n`}- O uso do aplicativo implica na aceitação
                        integral deste termo e da Política de Privacidade.
                        {`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          4. INDICAÇÕES E RECOMPENSAS{`\n`}
                        </Text>
                        - As indicações devem conter informações verídicas e
                        atualizadas.{`\n`}- O recebimento de comissões e
                        bonificações está sujeito ao cumprimento das regras
                        definidas pela franqueadora.{`\n`}- Indicações
                        indevidas, fraudulentas ou duplicadas poderão ser
                        desconsideradas, sem prejuízo de sanções.{`\n`}- O
                        indicador é o único responsável por obter o
                        consentimento necessário do lead antes de compartilhar
                        seus dados pessoais na plataforma. A franqueadora recebe
                        essas informações de forma passiva e atua apenas como
                        intermediadora no processo.{`\n`}- A Avantar não se
                        responsabiliza por quaisquer consequências legais ou
                        pessoais decorrentes da indicação feita sem o devido
                        consentimento do lead.{`\n`}- Após a concretização da
                        proposta, o lead indicado passa a ser considerado
                        cliente da Avantar e será tratado como tal em toda a
                        rede franqueada.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          5. LIMITAÇÃO DE RESPONSABILIDADE{`\n`}
                        </Text>
                        - A franqueadora não se responsabiliza por informações
                        fornecidas incorretamente pelos usuários.{`\n`}- O
                        aplicativo funciona como intermediador das indicações e
                        não garante a concretização de negócios.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          6. MODIFICAÇÕES E ENCERRAMENTO{`\n`}
                        </Text>
                        - A franqueadora poderá alterar, suspender ou
                        descontinuar o aplicativo a qualquer momento, mediante
                        aviso prévio.{`\n`}- O uso contínuo após alterações
                        implica aceitação automática dos novos termos.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          7. ACEITE{`\n`}
                        </Text>
                        O aceite é obrigatório no primeiro acesso ao aplicativo
                        e será registrado com data e hora vinculados ao perfil
                        do usuário.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>8. FORO{`\n`}</Text>
                        Este Termo é regido pelas leis brasileiras. Fica eleito
                        o foro da comarca de Caratinga/MG da sede da
                        franqueadora, com exclusão de qualquer outro.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          POLÍTICA DE PRIVACIDADE{`\n`}
                        </Text>
                        <Text style={{fontWeight: 'bold'}}>
                          Última atualização: 18/07/2025{`\n\n`}
                        </Text>
                        <Text style={{fontWeight: 'bold'}}>
                          1. COLETA DE DADOS{`\n`}
                        </Text>
                        Coletamos os seguintes dados:{`\n\n`}- Dos Indicadores:
                        nome, e-mail, telefone, CPF ou CNPJ, chave PIX;{`\n`}-
                        Dos Leads: nome, telefone e tipo de seguro de interesse;
                        {`\n`}- De uso: data e horário das indicações, status da
                        proposta.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          2. FINALIDADES{`\n`}
                        </Text>
                        Os dados são utilizados para:{`\n\n`}- Direcionar leads
                        às unidades corretas;{`\n`}- Permitir comunicação entre
                        franqueado, indicador e lead;{`\n`}- Avaliar desempenho
                        de unidades e indicadores;{`\n`}- Processar pagamentos e
                        bonificações;{`\n`}- Cumprir obrigações legais e
                        operacionais.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          3. COMPARTILHAMENTO DE DADOS{`\n`}
                        </Text>
                        - Dados dos leads são compartilhados exclusivamente com
                        as unidades franqueadas responsáveis pelo atendimento.
                        {`\n`}- Dados dos usuários podem ser compartilhados com
                        parceiros operacionais para fins de pagamento,
                        auditoria, marketing e suporte técnico.{`\n`}- O
                        compartilhamento dos dados do lead ocorre sob a
                        responsabilidade do indicador, que declara possuir
                        autorização para fazê-lo. A Avantar atua como receptora
                        passiva dessas informações.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          4. BASE LEGAL (LGPD){`\n`}
                        </Text>
                        - Consentimento do usuário no aceite dos termos;{`\n`}-
                        Legítimo interesse da franqueadora no tratamento das
                        indicações.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          5. SEGURANÇA{`\n`}
                        </Text>
                        - Dados trafegam via HTTPS e são armazenados em banco de
                        dados seguro.{`\n`}- O acesso é restrito a usuários
                        autenticados e habilitados.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          6. DIREITOS DOS USUÁRIOS{`\n`}
                        </Text>
                        Conforme a LGPD, o usuário tem direito de:{`\n\n`}-
                        Acessar, corrigir ou excluir seus dados;{`\n`}-
                        Solicitar portabilidade;{`\n`}- Revogar o consentimento,
                        a qualquer momento, salvo obrigações legais.{`\n\n`}
                        Solicitações devem ser feitas pelo canal:
                        suporte@indica.avantar.com.br{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          7. ARMAZENAMENTO E RETENÇÃO{`\n`}
                        </Text>
                        - Os dados são armazenados em nuvem, enquanto durar a
                        relação com o usuário ou conforme exigência legal.{`\n`}
                        - Após esse período, os dados serão anonimizados ou
                        excluídos.{`\n\n`}
                        <Text style={{fontWeight: 'bold'}}>
                          8. ATUALIZAÇÕES{`\n`}
                        </Text>
                        A franqueadora poderá atualizar esta Política a qualquer
                        momento. O aviso será feito via aplicativo, e o uso
                        contínuo após alterações implica aceite automático.
                        <Text
                          style={{fontWeight: 'bold'}}
                          className="text-blue">
                          {`\n`}
                          {`\n`}Última atualização: 18/07/2025{`\n\n`}
                        </Text>
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
