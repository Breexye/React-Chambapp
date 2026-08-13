import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
    return (
        <>
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen 
                        name="index" 
                        options={{ 
                            headerShown: false,
                        }} 
                    />
                    <Stack.Screen 
                        name="conversations" 
                        options={{ 
                            headerShown: false,
                            title: 'conversaciones',
                        }}     
                    />
                </Stack>
            </SafeAreaProvider>
        </>
    );
}