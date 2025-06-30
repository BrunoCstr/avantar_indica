import React from 'react';
import {View, ImageBackground, Animated, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../data/images';

export const WalletSkeleton = () => {
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

  const SkeletonGradient = ({
    width,
    height,
    borderRadius = 8,
    style = {},
    children,
  }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          opacity,
          overflow: 'hidden',
        },
        style,
      ]}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          flex: 1,
          height: 100,
          borderRadius,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {children}
      </LinearGradient>
    </Animated.View>
  );

  return (
    <ImageBackground source={images.bg_white} className="flex-1">
      <View style={{flex: 1, marginTop: 40}}>
        {/* Header com botão de voltar */}
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: 20,
              marginRight: 20,
            }}>
            <SkeletonBox width={40} height={40} />
          </View>
        </View>

        <View>
          {/* Card do saldo */}
          <View
            style={{
              marginRight: 20,
              marginLeft: 20,
              backgroundColor: '#8B5CF6',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: 140,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 35,
            }}>
            <SkeletonGradient width="100%" height="100%" borderRadius={24}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}>
                {/* Título do saldo */}
                <SkeletonBox width={160} height={14} borderRadius={7} />

                {/* Valor do saldo */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    marginTop: 12,
                  }}>
                  <SkeletonBox width={25} height={18} borderRadius={4} />
                  <SkeletonBox
                    width={100}
                    height={35}
                    borderRadius={6}
                    style={{marginLeft: 6}}
                  />
                  <SkeletonBox
                    width={20}
                    height={20}
                    borderRadius={10}
                    style={{marginLeft: 10}}
                  />
                </View>
              </View>
            </SkeletonGradient>
          </View>

          {/* Lista de saques */}
          <View
            style={{
              marginRight: 20,
              marginLeft: 20,
              backgroundColor: '#FFF',
              borderWidth: 1,
              borderTopWidth: 0,
              borderBottomRightRadius: 16,
              borderBottomLeftRadius: 16,
              borderColor: '#CDCDCD',
              height: 140,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
            }}>
            {/* Simulando 3 itens de saque */}
            {[1, 2, 3].map(item => (
              <View
                key={item}
                style={{
                  backgroundColor: '#F8F4FF',
                  width: '100%',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  marginBottom: 6,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#E1D5FF',
                    borderRadius: 4,
                    width: 28,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <SkeletonBox width={65} height={8} borderRadius={4} />
                  <SkeletonBox width={55} height={8} borderRadius={4} />
                  <SkeletonBox width={45} height={8} borderRadius={4} />
                </View>
              </View>
            ))}
          </View>

          {/* Botão de saque */}
          <View style={{marginTop: 16, marginLeft: 20, marginRight: 20}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height:75,
              }}>
              <SkeletonGradient width="100%" height="100%" borderRadius={8}>
                <SkeletonBox width={60} height={20} borderRadius={5} />
              </SkeletonGradient>
            </View>
          </View>

          {/* Componente DashboardWallet skeleton */}
          <View
            style={{
              marginTop: 16,
              marginBottom: 16,
              marginLeft: 20,
              marginRight: 20,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 16,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                height:190,
              }}>
              <SkeletonBox width="100%" height={50} borderRadius={6} />
              <View
                style={{
                  marginTop: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <SkeletonBox width={70} height={14} borderRadius={4} />
                <SkeletonBox width={80} height={14} borderRadius={4} />
              </View>
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <SkeletonBox width={75} height={14} borderRadius={4} />
                <SkeletonBox width={65} height={14} borderRadius={4} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
