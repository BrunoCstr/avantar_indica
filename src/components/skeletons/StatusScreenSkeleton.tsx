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
      <View
        style={{
          flex: 1,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 40,
          }}>
          <SkeletonBox width={30} height={30} />
          <SkeletonBox width={80} height={28} borderRadius={8} />
          <View style={{width: 40}} />
        </View>

        {/* Campo de busca */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            width: '100%',
            height: 64,
            backgroundColor: '#3E0085',
            borderRadius: 12,
            paddingHorizontal: 16,
          }}
          className="border-b-4 border-l-2 border-pink rounded-xl">
          <SkeletonBox
            width={24}
            height={24}
            borderRadius={4}
            style={{backgroundColor: '#A78BFA'}}
          />
          <View style={{flex: 1, marginLeft: 16, marginRight: 16}}>
            <SkeletonBox
              width="70%"
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

        {/* Container da lista */}
        <View
          style={{
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: '#3E0085',
            alignItems: 'center',
            width: '100%',
            borderRadius: 16,
            marginTop: 16,
            height: '68%',
          }}>
          {/* Header da tabela */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 12,
              paddingLeft: 40,
              paddingRight: 40,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: '100%',
            }}>
            <SkeletonBox width={60} height={20} borderRadius={6} />
            <SkeletonBox width={60} height={20} borderRadius={6} />
          </View>

          {/* Lista de itens */}
          <View style={{width: '100%', paddingHorizontal: 16}}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
              <View
                key={item}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    width: '93%',
                    paddingHorizontal: 8,
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    alignItems: 'center',
                    borderBottomColor: '#3E0085',
                  }}>
                  <SkeletonBox width={120} height={16} borderRadius={4} />
                  <SkeletonBox width={80} height={14} borderRadius={4} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export {StatusScreenSkeleton};
