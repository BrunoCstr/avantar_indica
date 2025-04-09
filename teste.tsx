import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform, Button } from 'react-native';
import Contacts from 'react-native-contacts';

const ContatoItem = ({ contato, selecionado, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{contato.givenName}</Text>
      <Text>{contato.phoneNumbers[0]?.number || 'Sem número'}</Text>
      <Text style={{ color: selecionado ? 'green' : 'gray' }}>{selecionado ? 'Selecionado' : 'Toque para selecionar'}</Text>
    </TouchableOpacity>
  );
};

const MultiselecionarContatos = () => {
  const [contatos, setContatos] = useState([]);
  const [selecionados, setSelecionados] = useState({});

  const pedirPermissao = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const carregarContatos = async () => {
    const permitido = await pedirPermissao();
    if (permitido) {
      const todos = await Contacts.getAll();
      const comTelefone = todos.filter(c => c.phoneNumbers.length > 0);
      setContatos(comTelefone);
    }
  };

  useEffect(() => {
    carregarContatos();
  }, []);

  const toggleContato = (id) => {
    setSelecionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const importarSelecionados = () => {
    const selecionadosArray = contatos.filter(c => selecionados[c.recordID]);
    console.log('Contatos importados:', selecionadosArray);
    // Aqui você pode salvar no seu backend, Firebase, state global, etc.
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Selecione os contatos:</Text>
      <FlatList
        data={contatos}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => (
          <ContatoItem
            contato={item}
            selecionado={!!selecionados[item.recordID]}
            onToggle={() => toggleContato(item.recordID)}
          />
        )}
      />
      <Button title="Importar Selecionados" onPress={importarSelecionados} />
    </View>
  );
};

export default MultiselecionarContatos;
