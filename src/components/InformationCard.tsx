import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {colors} from '../styles/colors';

type arrContent = {
  placeholder: string;
  content: string;
  iconName: string;
};

type InformationCardProps = {
  informationCardContent: arrContent[];
};

export function InformationCard({
  informationCardContent,
}: InformationCardProps) {
  return (
    <>
      <View className="items-center h-3/5 flex-col gap-4">
        <View className="bg-white h-[38%] w-4/5 rounded-3xl px-8 py-5 mt-9">
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Informações do usuário</Text>
            <TouchableOpacity activeOpacity={0.5}>
              <Text className="font-regular text-lg">Editar</Text>
            </TouchableOpacity>
          </View>

          {informationCardContent.map((item) => (
            <View className="flex-col mt-1">
              <View className="flex-row items-center gap-2">
                <FontAwesome name={item.iconName} size={25} color={colors.black} />
                <View className="flex-col">
                  <Text className="text-sm font-regular">
                    {item.placeholder}
                  </Text>
                  <Text className="text-base font-bold">
                    {item.content}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
