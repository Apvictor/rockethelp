import { HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from "@react-native-firebase/firestore";

import { OrderProps } from '../components/Order';
import { Header } from '../components/Header';
import { OrderDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, DesktopTower, Hourglass, Clipboard, User, ClipboardText } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { alerts } from '../utils/alerts';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const route = useRoute();
    const navigation = useNavigation();

    const { colors } = useTheme();
    const { orderId } = route.params as RouteParams;

    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);


    function handleOrderClose() {
        if (!solution) {
            return alerts('Serviço', 'Informe a solução para encerrar o serviço');
        }

        firestore()
            .collection<OrderDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            }).then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
                return alerts('Serviços', 'Não foi possivel encerrar o serviço');
            });
    }


    useEffect(() => {
        firestore()
            .collection<OrderDTO>('orders')
            .doc(orderId)
            .get().then((doc) => {
                const { client, description, service, total, created_at, solution, status, closed_at } = doc.data();

                const closed = closed_at ? dateFormat(closed_at) : null;

                setOrder({
                    id: doc.id,
                    client,
                    description,
                    service,
                    total,
                    closed,
                    status,
                    solution,
                    when: dateFormat(created_at)
                });

                setIsLoading(false);
            });
    }, []);


    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Header p={6} title='Serviço' />

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>

                <CardDetails
                    title="Datalhes do Serviço"
                    description={`${order.service} \nR$${parseInt(order.total).toFixed(2)}`}
                    icon={DesktopTower}
                />

                <CardDetails
                    title="Dados do Cliente"
                    description={order.client}
                    icon={User}
                />

                <CardDetails
                    title="Descrição do Problema"
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}
                />

                <CardDetails
                    title="Solução"
                    description={order.solution}
                    icon={CircleWavyCheck}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        order.status === 'open' &&
                        <Input
                            h={24}
                            textAlignVertical='top'
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            multiline
                        />
                    }
                </CardDetails>

            </ScrollView>
            {
                order.status === 'open' &&
                <Button m={5} title='Encerrar serviço' onPress={handleOrderClose} />
            }
        </VStack>
    );
}