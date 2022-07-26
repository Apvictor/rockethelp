import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OrderDTO = {
    client: string;
    service: string;
    total: string;
    description: string;
    status: 'open' | 'closed';
    solution?: string;
    created_at: FirebaseFirestoreTypes.Timestamp
    closed_at?: FirebaseFirestoreTypes.Timestamp
}