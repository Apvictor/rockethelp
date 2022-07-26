import { useState } from 'react';
import { VStack } from 'native-base';
import { useNavigation } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { alerts } from "../utils/alerts";

export function Register() {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [client, setClient] = useState('');
    const [service, setService] = useState('');
    const [total, setTotal] = useState('');
    const [description, setDescription] = useState('');

    async function handleNewOrderRegister() {
        const userId = await AsyncStorage.getItem('uid');

        if (!client || !service || !total || !description) {
            return alerts("Resgistrar", "Preencha todos os campos!");
        }

        setIsLoading(true);

        firestore().collection('orders').add({
            userId: userId,
            client,
            service,
            total,
            description,
            status: 'open',
            created_at: firestore.FieldValue.serverTimestamp()
        }).then(() => {
            navigation.goBack();
        }).catch((error) => {
            console.log(error);
            setIsLoading(false);
            return alerts("Serviço", "Não foi possivel registrar!");
        });
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title='Novo serviço' />

            <Input placeholder='Nome do Cliente' mb={5} onChangeText={setClient} />
            <Input placeholder='Nome do Serviço' mb={5} onChangeText={setService} />
            <Input placeholder='Valor Cobrado' mb={5} keyboardType="number-pad" onChangeText={setTotal} />
            <Input placeholder='Descrição do Problema' flex={1} multiline textAlignVertical='top' onChangeText={setDescription} />
            <Button isLoading={isLoading} onPress={handleNewOrderRegister} title='Cadastrar' mt={5} />
        </VStack>
    );
}