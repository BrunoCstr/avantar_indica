import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ExpandableSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="rounded-lg mb-4 overflow-hidden">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="flex-row justify-between items-center px-4 py-3 bg-white">
        <Text className="text-black font-bold text-2xl">{title}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setExpanded(!expanded)}>
          <View className="bg-tertiary_purple rounded-full p-1">
            <AntDesign
              name={expanded ? 'minus' : 'plus'}
              size={20}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </Pressable>

      {expanded && (
        <View className="bg-transparent border-2 border-pink rounded-br-lg border-t-0 rounded-bl-lg px-4 py-3">
          {children}
        </View>
      )}
    </View>
  );
};

interface RulesComponentProps {
  title: string;
  titleDescription: string;
  description: string;
  titleDescription2: string;
  description2: string;
  rewards: string;
}
export function RulesComponent({
  title,
  titleDescription,
  description,
  titleDescription2,
  description2,
  rewards,
}: RulesComponentProps) {
  return (
    <ScrollView className="flex-1 bg-gray-100 w-full">
      <ExpandableSection title={title}>
        {description2 ? (
          <>
            <Text className="text-white font-bold text-base">
              {titleDescription}
            </Text>
            <Text className="text-white font-regular mt-1 text-sm">
              {description}
            </Text>
            <Text className="text-white font-bold text-base">
              {titleDescription2}
            </Text>
            <Text className="text-white font-regular mt-1 text-sm">
              {description2}
            </Text>
          </>
        ) : (
          <>
            <Text className="text-white font-bold text-base">
              {titleDescription}
            </Text>
            <Text className="text-white font-regular mt-1 text-sm">
              {description}
            </Text>
          </>
        )}
      </ExpandableSection>

      <ExpandableSection title="RECOMPENSAS">
        <Text className="text-white font-regular text-sm">
        {rewards}
        </Text>
      </ExpandableSection>
    </ScrollView>
  );
}
