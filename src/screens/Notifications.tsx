import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import {NotificationsSkeleton} from '../components/skeletons/NotificationsSkeleton';
import {BackButton} from '../components/BackButton';

const db = getFirestore(app);

export function Notifications() {
  const {userData} = useAuth();
  const [readNotifications, setReadNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
  const [showUnread, setShowUnread] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

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
              id: data.id,
              read: data.read,
              ...data,
              createdAt: data.createdAt?.toDate(),
            };
          });

          await batch.commit();

          setReadNotifications(
            notificationsData.filter(notification => notification.read),
          );
          setUnreadNotifications(
            notificationsData.filter(notification => !notification.read),
          );

          setIsLoading(false);
        } catch (error) {
          console.error('Erro ao buscar/marcar notificações:', error);
          setIsLoading(true);
        }
      }
    };

    fetchNotifications();
  }, [userData?.uid]);

  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      {isLoading ? (
        <NotificationsSkeleton />
      ) : (
        <View className="flex-1 ml-7 mr-7 mt-20 justify-start items-center">
          <View className="items-center relative w-full flex-col">
            <View className="w-full flex-row items-center justify-between">
              <View>
                <BackButton color={colors.blue} borderColor={colors.blue} />
              </View>

              <Text className="text-blue font-bold text-2xl text-center">
                Notificações
              </Text>

              {/* Espaço de mesmo tamanho do botão para manter o centro visual por causa do justify-between */}
              <View className="h-12 w-12" />
            </View>

            <View className="w-full flex-row pt-2 gap-2 justify-end items-end mt-10">
              <TouchableOpacity
                className="bg-orange rounded-full w-24"
                activeOpacity={0.8}
                onPress={() => setShowUnread(false)}
                >
                <Text className="text-white font-bold text-sm text-center">
                  LIDAS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-orange rounded-full w-24"
                activeOpacity={0.8}
                onPress={() => setShowUnread(true)}>
                <Text className="text-white font-bold text-sm text-center">
                  NÃO LIDAS
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              className="mt-5"
              data={showUnread ? unreadNotifications : readNotifications}
              keyExtractor={item => item.id || "Não possui"}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 60}}
              renderItem={({item}) => (
                <View className="flex-row">
                  <View className="w-full h-25 flex-row items-center bg-primary_purple p-4 rounded-2xl gap-3">
                    <MaterialIcons
                      name="notifications-active"
                      size={24}
                      color={colors.white}
                    />
                    <View className="w-[90%]">
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
      )}
    </ImageBackground>
  );
}
