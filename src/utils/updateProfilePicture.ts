import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export async function uploadDefaultProfilePicture(uid: string) {
  try {
    const assetPath = 'default_profile_picture.jpg'; // arquivo dentro de android/app/src/main/assets
    const localPath = `${RNFS.DocumentDirectoryPath}/${uid}_default.jpg`;

    // Copiar o asset nativo para o sistema de arquivos acessível
    await RNFS.copyFileAssets(assetPath, localPath);

    const ref = storage().ref(`profile_pictures/${uid}/default_profile_picture.jpg`);
    await ref.putFile(localPath);

    const url = await ref.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem padrão:', error);
    throw error;
  }
}
