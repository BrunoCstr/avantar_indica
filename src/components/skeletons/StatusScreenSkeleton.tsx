import React from 'react';
import {View, ImageBackground, Animated, Easing} from 'react-native';
import images from '../../data/images';

const StatusScreenSkeleton = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({width, height, borderRadius = 8, style = {}}) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E1E9EE',
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );

  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 px-5 pt-4 pb-32">
        {/* Header */}
        <View className="items-center flex-row justify-between w-full mt-12">
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <SkeletonBox width={100} height={36} borderRadius={8} />
          <View style={{width: 40}} />
        </View>

        {/* Barra de Pesquisa */}
        <View className="flex-row items-center w-full h-16 bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-pink px-4 mt-8">
          <SkeletonBox
            width={24}
            height={24}
            borderRadius={4}
            style={{backgroundColor: '#A78BFA'}}
          />
          <View style={{flex: 1, marginLeft: 16, marginRight: 16}}>
            <SkeletonBox
              width="60%"
              height={18}
              borderRadius={6}
              style={{backgroundColor: '#A78BFA'}}
            />
          </View>
          <SkeletonBox
            width={24}
            height={24}
            borderRadius={4}
            style={{backgroundColor: '#A78BFA'}}
          />
        </View>

        {/* Cards de Estatísticas */}
        <View className="mt-4 mb-1 w-full h-20">
          <View className="flex-row justify-between gap-3 px-1 w-full space-x-2">
            {[1, 2, 3, 4].map((item, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-3 shadow-lg flex-1"
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <SkeletonBox width="100%" height={24} borderRadius={6} />
                <SkeletonBox 
                  width="80%" 
                  height={12} 
                  borderRadius={4} 
                  style={{marginTop: 4, alignSelf: 'center'}}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Lista de Status */}
        <View className="rounded-2xl flex-1 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <View
              key={item}
              className="bg-white rounded-xl mb-2 mx-2"
              style={{
                shadowColor: '#000',
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <View className="flex-row items-center p-4">
                {/* Avatar */}
                <SkeletonBox
                  width={48}
                  height={48}
                  borderRadius={24}
                  style={{marginRight: 16}}
                />

                {/* Informações */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <SkeletonBox width="60%" height={16} borderRadius={4} />
                    <SkeletonBox width={40} height={12} borderRadius={4} />
                  </View>
                  <SkeletonBox 
                    width="80%" 
                    height={14} 
                    borderRadius={4} 
                    style={{marginBottom: 8}}
                  />
                  <SkeletonBox 
                    width="40%" 
                    height={20} 
                    borderRadius={10}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

export {StatusScreenSkeleton};
