import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../contexts/Auth';
import {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  writeBatch,
} from '@react-native-firebase/firestore';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import app from '../../firebaseConfig';
import {colors} from '../styles/colors';
import images from '../data/images';

const db = getFirestore(app);

export function Notifications() {
  const {userData} = useAuth();
  const [notificationsList, setNotificationsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userData?.uid) {
        try {
          const notificationsRef = collection(
            db,
            'users',
            userData.uid,
            'notifications',
          );
          const q = query(notificationsRef, orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const batch = writeBatch(db);
          const notificationsData = querySnapshot.docs.map(doc => {
            const data = doc.data();

            if (!data.read) {
              batch.update(doc.ref, {read: true});
            }

            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
            };
          });

          await batch.commit();
          setNotificationsList(notificationsData);
        } catch (error) {
          console.error('Erro ao buscar/marcar notificações:', error);
        }
      }
    };

    fetchNotifications();
  }, [userData?.uid]);

  const navigation = useNavigation();

  return (
    <ImageBackground
      source={images.bg_status}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 ml-7 mr-7 mt-20 justify-start items-center">
        <View className="items-center relative w-full flex-col">
          <View className="w-full flex-row items-center justify-between">
            <TouchableOpacity
              className="border-[1px] rounded-md border-white h-15 w-15 justify-center items-center p-1"
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}>
              <Feather name="x" size={21} color={colors.white} />
            </TouchableOpacity>

            <Text className="text-white font-bold text-2xl text-center">
              Notificações
            </Text>

            {/* Espaço de mesmo tamanho do botão para manter o centro visual por causa do justify-between */}
            <View className="h-12 w-12" />
          </View>

          <FlatList
            className="mt-5"
            data={notificationsList}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 60}}
            renderItem={({item}) => (
              <View className="flex-row">
                <View className="w-full flex-row items-center border-b-[1px] border-b-white pb-5 pt-5">
                  <MaterialIcons
                    className="mr-3"
                    name="notifications-active"
                    size={24}
                    color={colors.white}
                  />
                  <View className="w-full">
                    <Text className="text-white font-bold">{item.title}</Text>
                    <Text className="text-white text-sm font-regular">
                      {item.body}
                    </Text>
                    <Text className="text-blue font-regular">
                      {item.createdAt
                        ? formatDistanceToNow(item.createdAt, {
                            addSuffix: true,
                            locale: ptBR,
                          })
                        : 'Data não encontrada'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
