import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";

export function Routes() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    const storeData = async (userId) => {
        await AsyncStorage.setItem('uid', userId)
    }

    useEffect(() => {
        const subscribe = auth()
            .onAuthStateChanged(response => {
                setUser(response);
                setLoading(false);
            });

        return subscribe;
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            {user ? storeData(user.uid) && <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    );
}