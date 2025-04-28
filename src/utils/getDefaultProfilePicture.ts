import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const storage = getStorage();
const defaultPictureRef = ref(storage, 'profile_pictures/default/default_profile_pictures.png')

export async function getDefaultProfilePicture() {
  await getDownloadURL(defaultPictureRef)
  .then((url) => {
    return url;
  })
  .catch((err) => {
    console.error('Erro ao pegar a imagem de perfil padrão', err);
    return null;
  })
}