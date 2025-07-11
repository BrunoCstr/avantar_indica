# Guia da Splash Screen - Avantar Indica

## Abordagem Atual

Este projeto agora utiliza **react-native-bootsplash**, uma biblioteca moderna e otimizada para splash screens em React Native.

### Vantagens da Nova Abordagem

1. **Performance Superior**: Carregamento nativo mais rápido
2. **Transições Suaves**: Animações fluidas com fade
3. **Configuração Simplificada**: Menos código boilerplate
4. **Suporte Moderno**: Compatível com as versões mais recentes do React Native
5. **Customização Avançada**: Controle total sobre cores, logos e animações

### Arquivos Principais

- `App.tsx`: Inicialização do app (sem gestão de splash)
- `src/routes/Router.tsx`: Gestão da splash screen com timing otimizado
- `assets/bootsplash/manifest.json`: Configuração do logo e cores
- `android/app/src/main/res/values/styles.xml`: Tema nativo Android
- `ios/avantar_indica/BootSplash.storyboard`: Configuração nativa iOS

### Como Funciona

1. **Inicialização**: O app inicia com a splash screen nativa
2. **Carregamento**: Enquanto o app carrega, a splash permanece visível
3. **Transição**: Após 500ms mínimo + carregamento completo, a splash desaparece com fade
4. **App Pronto**: O usuário vê a tela principal do app

### Configurações

#### Cores
- **Background**: `#4A04A5` (roxo da marca)
- **Logo**: 200x200px centralizado

#### Timing
- **Delay mínimo**: 500ms para transição suave
- **Duração do fade**: 300ms
- **Animação**: Fade in/out com spring animation

### Melhorias Implementadas

1. ✅ Removida biblioteca antiga `react-native-splash-screen`
2. ✅ Eliminada duplicação de código
3. ✅ Otimizado timing de transição
4. ✅ Melhorado componente Loading com animações
5. ✅ Limpeza de arquivos desnecessários

### Próximos Passos Recomendados

1. **Testar em diferentes dispositivos** para garantir performance
2. **Ajustar timing** conforme feedback dos usuários
3. **Considerar animações personalizadas** para a marca
4. **Implementar splash screen adaptativa** (dark/light mode)

### Comandos Úteis

```bash
# Reconstruir após mudanças na splash
npx react-native run-android
npx react-native run-ios

# Limpar cache se necessário
npx react-native start --reset-cache
``` 