import auth from "@react-native-firebase/auth";
import Logo from "../assets/logo_primary.svg";

import { useState } from 'react';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { alerts } from "../utils/alerts";

export function SignIn() {
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleSingIn() {
        if (!email || !password) {
            return alerts('Entrar', 'Informe e-mail e senha!');
        }
        
        setIsLoading(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.error("ERRO: ", error);
                setIsLoading(false);
                return signInErrors(error.code);
            });
    }

    function signInErrors(error) {
        switch (error) {
            case 'auth/invalid-email':
                alerts('Entrar', 'E-mail ou senha inválida.');
                break;
            case 'auth/wrong-password':
                alerts('Entrar', 'E-mail ou senha inválida.');
                break;
            case 'auth/user-not-found':
                alerts('Entrar', 'Usuário não cadastrado.');
                break;
            default:
                alerts('Entrar', 'Não foi possível acessar!');
                break;
        }
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px="8" pt="24">
            <Logo />

            <Heading color="gray.100" fontSize="xl" mt="20" mb="6">
                Acesse sua conta
            </Heading>

            <Input placeholder="E-mail" mb="4"
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml="4" />}
                onChangeText={setEmail}
            />
            <Input placeholder="Senha" mb="8"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml="4" />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                onPress={handleSingIn}
                isLoading={isLoading} />
        </VStack>
    );
}