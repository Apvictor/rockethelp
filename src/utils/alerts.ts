import { Alert } from "react-native";

export function alerts(title: string, message: string) {
    return Alert.alert(title, message);
}