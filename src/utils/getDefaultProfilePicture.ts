import storage from '@react-native-firebase/storage';

export async function getDefaultProfilePicture(): Promise<string | null> {
  try {
    const url = await storage()
      .ref('profile_pictures/default/default_profile_picture.png')
      .getDownloadURL();
    return url;
  } catch (err) {
    console.error('Erro ao pegar a imagem de perfil padrão', err);
    return null;
  }
}
