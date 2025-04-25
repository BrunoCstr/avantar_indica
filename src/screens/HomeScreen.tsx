import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import {NotificationButton} from '../components/NotificationButton';
import {getFirstName} from '../utils/getName';
import app from '../../firebaseConfig';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../styles/colors';
import {HomeSkeleton} from '../components/skeletons/HomeSkeleton';
import {IndicateModal} from '../components/IndicateModal';
import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';

const db = getFirestore(app);

export function HomeScreen() {
  const {userData, registrationStatus} = useAuth();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      {/* Header */}
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <View className="grid-cols-3 flex-row items-center mt-10 ml-7 mr-7">
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
                  className="h-[4.375rem] w-[4.375rem] rounded-full ml-1"></Image>
              </TouchableOpacity>
            </View>
            <View>
              <View className="ml-5 flex-row">
                <Text className="text-blue text-m font-medium">Olá, </Text>
                <Text className="text-white text-m font-medium">
                  {getFirstName(userData?.displayName || '')}
                </Text>
              </View>
              <View className="ml-5">
                <Text className="text-white text-ss font-regular">
                  {welcomeMessage}
                </Text>
              </View>
            </View>
            <View className="absolute right-0 mr-4">
              <NotificationButton count={unreadNotifications} />
            </View>
          </View>

          <View className="ml-7 mr-7 h-30 items-center justify-center flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {registrationStatus ? setShowModal(true) : navigation.navigate(WaitingConfirmationScreen)}}>
              <View className="bg-transparent flex-row border-[1.5px] rounded-lg border-blue justify-center items-center pr-8 pl-8 pt-6 pb-6">
                <Image source={images.indicar_icon} />
                <Text className="text-white text-bold text-2xl ml-1.5">
                  INDICAR
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('IndicateInBulk')}>
              <View className="bg-transparent flex-row border-[1.5px] rounded-lg border-blue justify-center items-center pr-9 pl-9 pt-3 pb-3">
                <Image source={images.indicar_em_massa_icon} />
                <View>
                  <Text className="text-white text-bold text-2xl ml-1.5">
                    INDICAR
                  </Text>
                  <Text className="text-white text-bold text-s ml-2">
                    EM MASSA
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="ml-7 mr-7">
            <Button
              text="REGRAS"
              backgroundColor="orange"
              textColor="white"
              fontWeight="bold"
              fontSize={25}
              height={70}
              borderColor='second_orange'
              borderBottomWidth={4}
              borderRightWidth={2}
              onPress={() => navigation.navigate('Rules')}
            />
          </View>

          <View className="mt-6 ml-7 mr-7 bg-[#FFF] rounded-2xl h-[20rem] pt-5 pl-7 pr-7">
            <View className="flex-row items-center justify-between">
              <Text className="text-primary_purple text-m font-bold">
                Indicações
              </Text>
              <TouchableOpacity
                className="bg-primary_purple h-10 w-10 rounded-lg items-center justify-center"
                activeOpacity={0.8}>
                <FontAwesome6 name="sliders" size={21} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6 ml-7 mr-7">
            <Button
              text="STATUS DAS PROPOSTAS"
              backgroundColor="pink"
              textColor="white"
              fontWeight="bold"
              fontSize={25}
              height={70}
              borderColor='sixteen_purple'
              borderBottomWidth={4}
              borderRightWidth={2}
              onPress={() => navigation.navigate('Status')}
            />
          </View>

          <IndicateModal
            visible={showModal}
            onClose={() => setShowModal(false)}
          />
        </>
      )}
    </ImageBackground>
  );
}
