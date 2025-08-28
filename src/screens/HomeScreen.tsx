import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import IndicarIcon from '../assets/images/indicar_icon.svg';
import IndicarEmMassaIcon from '../assets/images/indicar_em_massa_icon.svg';

type RootStackParamList = {
  IndicateInBulk: undefined;
  Rules: undefined;
  Status: undefined;
  WaitingConfirmationScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
import {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
  where,
} from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import {NotificationButton} from '../components/NotificationButton';
import {getFirstName} from '../utils/getName';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../styles/colors';
import {HomeSkeleton} from '../components/skeletons/HomeSkeleton';
import {IndicateModal} from '../components/IndicateModal';
import DashboardIndications from '../components/DashboardIndications';
import {indicationsDataArray} from '../components/DashboardIndications';
import {FilterDropdown} from '../components/FilterDropdown';
import {useBottomNavigationPadding} from '../hooks/useBottomNavigationPadding';
import {useResponsive} from '../hooks/useResponsive';

const db = getFirestore();

export function HomeScreen() {
  const {userData, registrationStatus} = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const {paddingBottom} = useBottomNavigationPadding();
  const {isSmallScreen, fontSize, horizontalPadding} = useResponsive();

  const [isLoading, setIsLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<indicationsDataArray>([]);
  const [allProducts, setAllProducts] = useState<indicationsDataArray>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const isFirstLogin = userData?.isFirstLogin;
  const welcomeMessage = isFirstLogin
    ? 'Seja bem-vindo!'
    : 'Seja bem-vindo de volta!';

  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const {uri} = asset;

        if (uri) {
          const uploadTask = storage()
            .ref(`profile_pictures/${userData?.uid}/profile_picture.jpg`)
            .putFile(uri);

          uploadTask.on('state_changed', async snapshot => {
            if (snapshot.state === 'success') {
              const downloadUrl = await snapshot.ref.getDownloadURL();

              if (userData?.uid) {
                await updateDoc(doc(db, 'users', userData.uid), {
                  profilePicture: downloadUrl,
                });
              }
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    if (!userData?.uid && !userData?.profilePicture) return;

    setIsLoading(true);

    // Listeners em tempo real para indicações e oportunidades
    const indicationsQuery = query(
      collection(db, 'indications'),
      where('indicator_id', '==', userData.uid),
    );
    const opportunitiesQuery = query(
      collection(db, 'opportunities'),
      where('indicator_id', '==', userData.uid),
    );

    let allIndications: any[] = [];
    let allOpportunities: any[] = [];

    const updateDashboard = () => {
      // Junta tudo e filtra trash/archived
      const all = [
        ...allIndications.filter(
          item => item.trash !== true && item.archived !== true,
        ),
        ...allOpportunities.filter(
          item => item.trash !== true && item.archived !== true,
        ),
      ];
      // Agrupa por produto
      const productMap = new Map();
      all.forEach(item => {
        if (!item.product) return;
        if (!productMap.has(item.product)) {
          productMap.set(item.product, 0);
        }
        productMap.set(item.product, productMap.get(item.product) + 1);
      });
      const total = all.length;
      const result = Array.from(productMap.entries())
        .map(([product, count]) => ({
          product,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          totalIndications: total,
        }))
        .sort((a, b) => b.count - a.count);
      setAllProducts(result);
      setTopProducts(result);
      setSelectedFilters(result.map(p => p.product));
      setIsLoading(false);
    };

    const unsubIndications = onSnapshot(indicationsQuery, snapshot => {
      allIndications = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      updateDashboard();
    });
    const unsubOpportunities = onSnapshot(opportunitiesQuery, snapshot => {
      allOpportunities = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      updateDashboard();
    });

    return () => {
      unsubIndications();
      unsubOpportunities();
    };
  }, [userData?.uid]);

  const handleSelectFilter = (option: string) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter(item => item !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  const availableProducts = allProducts.map(product => product.product);

  // Filtra os produtos baseado nos filtros selecionados
  useEffect(() => {
    if (selectedFilters.length === 0) {
      setTopProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        selectedFilters.includes(product.product),
      );
      setTopProducts(filtered);
    }
  }, [selectedFilters, allProducts]);

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        if (userData?.uid) {
          const notificationsRef = collection(
            db,
            'users',
            userData.uid,
            'notifications',
          );
          const q = query(notificationsRef, orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const notificationsData = querySnapshot.docs.map(doc => doc.data());
          setUnreadNotifications(
            notificationsData.filter(notification => !notification.read).length,
          );
        }
      };

      fetchNotifications();
    }, [userData?.uid]),
  );

  useEffect(() => {
    if (!userData?.uid) return;

    const unsubscribe = onSnapshot(doc(db, 'users', userData.uid), snapshot => {
      const data = snapshot.data();

      if (data?.profilePicture) {
        setProfilePicture(data.profilePicture);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userData?.uid]);

  const [refreshing, setRefreshing] = useState(false);

  // Função do Pull Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Recarrega as notificações
      if (userData?.uid) {
        const notificationsRef = collection(
          db,
          'users',
          userData.uid,
          'notifications',
        );
        const q = query(notificationsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const notificationsData = querySnapshot.docs.map(doc => doc.data());
        setUnreadNotifications(
          notificationsData.filter(notification => !notification.read).length,
        );
      }
      
      // Recarrega dados do perfil
      if (userData?.uid) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userData.uid)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          if (userData?.profilePicture) {
            setProfilePicture(userData.profilePicture);
          }
        }
      }
      
      console.log("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setRefreshing(false);
    }
  }, [userData?.uid]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#820AD1"]}
          tintColor="#820AD1"
        />
      }
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={images.bg_home_purple}
        className="flex-1"
        resizeMode="cover">
        {/* Header */}
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <View className="flex-1 justify-center" style={{paddingBottom, marginHorizontal: horizontalPadding}}>
            <View
              className={`flex-row items-center ${isSmallScreen ? 'mt-14' : 'mt-10'}`}
              >
              <View>
                <TouchableOpacity
                  onPress={() => selectImage()}
                  activeOpacity={0.8}>
                  <Image
                    source={
                      profilePicture
                        ? {uri: profilePicture}
                        : images.default_profile_picture
                    }
                    className={`${isSmallScreen ? 'h-16 w-16' : 'h-[4.375rem] w-[4.375rem]'} rounded-full ml-1`}></Image>
                </TouchableOpacity>
              </View>
              <View>
                <View className="ml-5 flex-row">
                  <Text
                    className={`text-blue ${isSmallScreen ? 'text-lg' : fontSize.xlarge} font-medium`}>
                    Olá,{' '}
                  </Text>
                  <Text
                    className={`text-white ${isSmallScreen ? 'text-lg' : fontSize.xlarge} font-medium`}>
                    {getFirstName(userData?.displayName || '')}
                  </Text>
                </View>
                <View className="ml-5">
                  <Text className={`text-white ${fontSize.small} font-regular`}>
                    {welcomeMessage}
                  </Text>
                </View>
              </View>
              <View className="absolute right-0 mr-4">
                <NotificationButton count={unreadNotifications} />
              </View>
            </View>

            <View
              className={`${isSmallScreen ? 'h-16' : 'h-24'} flex flex-row items-center justify-center gap-3 mt-5 mb-5 w-full`}>
              <TouchableOpacity
                className="flex-1"
                activeOpacity={0.8}
                onPress={() => {
                  registrationStatus
                    ? setShowModal(true)
                    : navigation.navigate('WaitingConfirmationScreen');
                }}>
                <View
                  className={`bg-transparent flex-row border-[1.5px] rounded-lg border-blue justify-center items-center h-full`}>
                  <IndicarIcon />
                  <Text
                    className={`text-white font-regular ${isSmallScreen ? 'text-lg' : fontSize.xlarge} ml-1`}>
                    INDICAR
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                activeOpacity={0.8}
                onPress={() => navigation.navigate('IndicateInBulk')}>
                <View
                  className={`bg-transparent flex-row border-[1.5px] rounded-lg border-blue justify-center items-center h-full`}>
                  <IndicarEmMassaIcon />
                  <View>
                    <Text
                      className={`text-white text-bold font-regular ${isSmallScreen ? 'text-lg' : fontSize.xlarge} ml-0.5`}>
                      INDICAR
                    </Text>
                    <Text
                      className={`text-white text-bold font-regular ${fontSize.small} ml-1`}>
                      EM MASSA
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <Button
                text="REGRAS"
                backgroundColor="orange"
                textColor="white"
                fontWeight="bold"
                fontSize={isSmallScreen ? 22 : 25}
                height={isSmallScreen ? 60 : 80}
                borderColor="second_orange"
                borderBottomWidth={4}
                borderRightWidth={2}
                onPress={() => navigation.navigate('Rules')}
              />
            </View>

            <View
              className={`mt-5 bg-[#FFF] rounded-2xl ${isSmallScreen ? 'h-64' : 'h-[20rem]'} pt-4`}
              style={{
                paddingHorizontal: horizontalPadding,
              }}>
              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-primary_purple ${isSmallScreen ? 'text-lg' : fontSize.xlarge} font-bold`}>
                  Indicações
                </Text>
                <TouchableOpacity
                  className="bg-primary_purple h-10 w-10 rounded-lg items-center justify-center"
                  activeOpacity={0.8}
                  onPress={() => setShowFilter(!showFilter)}>
                  <FontAwesome6
                    name={showFilter ? 'xmark' : 'sliders'}
                    size={21}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
                className="flex-1 pt-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 6}}>
                <DashboardIndications
                  data={topProducts}
                  isLoading={isLoading}
                />
              </ScrollView>

              <FilterDropdown
                visible={showFilter && topProducts.length > 0}
                onClose={() => setShowFilter(false)}
                options={availableProducts}
                selectedOptions={selectedFilters}
                onSelectOption={handleSelectFilter}
                position={{
                  top: isSmallScreen ? 320 : 370,
                  right: isSmallScreen ? horizontalPadding : 40,
                }}
              />
            </View>

            <View
              className="mt-5"
              >
              <Button
                text="STATUS DAS PROPOSTAS"
                backgroundColor="pink"
                textColor="white"
                fontWeight="bold"
                fontSize={isSmallScreen ? 22 : 25}
                height={isSmallScreen ? 60 : 80}
                borderColor="sixteen_purple"
                borderBottomWidth={4}
                borderRightWidth={2}
                onPress={() => navigation.navigate('Status')}
              />
            </View>

            <IndicateModal
              visible={showModal}
              onClose={() => setShowModal(false)}
            />
          </View>
        )}
      </ImageBackground>
    </ScrollView>
  );
}
