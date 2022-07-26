import { Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SignOut, ChatTeardropText } from "phosphor-react-native";
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';

import Logo from "../assets/logo_secondary.svg";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { Order, OrderProps } from "../components/Order";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from '../components/Loading';

export function Home() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState('');

    function handleNewOrder() {
        navigation.navigate('new');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId });
    }

    function handleLogout() {
        auth().signOut().catch((error) => {
            console.log(error);
            return Alert.alert('Sair', 'Não foi possivel sair!');
        });
    }

    useEffect(() => {
        const getData = async () => {
            return await AsyncStorage.getItem('uid');
        }

        getData().then((res) => {
            setUserId(res);
        });

        setIsLoading(true);

        const subscribe = firestore()
            .collection('orders')
            .where('userId', '==', userId)
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { client, service, total, description, status, created_at } = doc.data();
                    return {
                        id: doc.id,
                        client,
                        service,
                        total,
                        description,
                        status,
                        when: dateFormat(created_at)
                    }
                });

                setOrders(data);
                setIsLoading(false);
            });

        return subscribe;
    }, [userId, statusSelected]);

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack w="full" justifyContent="space-between" alignItems="center" bg="gray.600" pt={12} pb={5} px={6} >
                <Logo />
                <IconButton onPress={handleLogout} icon={<SignOut size={26} color={colors.gray[300]} />} />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">Meus Serviços</Heading>
                    <Text color="gray.200">{orders.length}</Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter
                        type="open"
                        title="em andamento"
                        onPress={() => setStatusSelected("open")}
                        isActive={statusSelected === "open"}
                    />

                    <Filter
                        type="closed"
                        title="finalizados"
                        onPress={() => setStatusSelected("closed")}
                        isActive={statusSelected === "closed"}
                    />
                </HStack>

                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={orders}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <ChatTeardropText color={colors.gray[300]} size={40} />
                                    <Text color='gray.300' fontSize="xl" mt={6} textAlign="center">
                                        Você ainda não possui {'\n'}
                                        serviços {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                                    </Text>
                                </Center>
                            )}
                        />}

                <Button title='Novo serviço' onPress={handleNewOrder} />
            </VStack>
        </VStack>
    );
}