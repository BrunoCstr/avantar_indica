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
} from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import {NotificationButton} from '../components/NotificationButton';
import {getFirstName} from '../utils/getName';
import app from '../../firebaseConfig';

const db = getFirestore(app);

export function HomeScreen() {
  const {userData} = useAuth();
  const navigation = useNavigation();

  const isFirstLogin = userData?.isFirstLogin;
  const welcomeMessage = isFirstLogin
    ? 'Seja bem-vindo!'
    : 'Seja bem-vindo de volta!';

  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

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

                setProfilePicture(downloadUrl);
              }
            }
          });
        }
      }
    });
  };

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
    if (userData?.profilePicture) {
      setProfilePicture(userData.profilePicture);
    }
  }, [userData?.profilePicture]);

  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      {/* Header */}
      <View className="grid-cols-3 flex-row items-center mt-10 ml-7 mr-7">
        <View>
          <TouchableOpacity onPress={() => selectImage()} activeOpacity={0.8}>
            <Image
              source={
                profilePicture
                  ? {uri: profilePicture}
                  : images.default_profile_picture
              }
              className="h-14 w-14 rounded-full"></Image>
          </TouchableOpacity>
        </View>
        <View>
          <View className="ml-2.5 flex-row">
            <Text className="text-blue text-m font-medium">Olá, </Text>
            <Text className="text-white text-m font-medium">
              {getFirstName(userData?.displayName)}
            </Text>
          </View>
          <View className="ml-2.5">
            <Text className="text-white text-ss font-regular">
              {welcomeMessage}
            </Text>
          </View>
        </View>
        <View className="absolute right-0">
          <NotificationButton count={unreadNotifications} />
        </View>
      </View>
      <View className="ml-7 mr-7 mt-10 h-30 items-center justify-center flex-row gap-3">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Indicate')}>
          <View className="bg-transparent flex-row border-[2.5px] rounded-lg border-blue justify-center items-center p-8">
            <Image source={images.indicar_icon} />
            <Text className="text-white text-regular text-2xl ml-1.5">
              INDICAR
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('IndicateInBulk')}>
          <View className="bg-transparent flex-row border-[2.5px] rounded-lg border-secondary_purple justify-center items-center p-8 pt-5 pb-5">
            <Image source={images.indicar_em_massa_icon} />
            <View>
              <Text className="text-white text-bold text-2xl ml-1.5">
                INDICAR
              </Text>
              <Text className="text-white text-bold text-s ml-2">EM MASSA</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="h-[50%] mt-7 rounded-[30px] bg-white">
        <View className="p-5">
          <View className="gap-2">
            <Button
              text="STATUS DA PROPOSTA"
              backgroundColor="blue"
              textColor="primary_purple"
              fontWeight="bold"
              fontSize={22}
              onPress={() => navigation.navigate('Status')}
            />
            <Button
              text="REGRAS"
              textColor="white"
              backgroundColor="orange"
              fontWeight="bold"
              fontSize={22}
              onPress={() => navigation.navigate('Rules')}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
