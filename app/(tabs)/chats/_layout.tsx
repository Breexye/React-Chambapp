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
            <StatusBar
                style="light"
                backgroundColor={ Colors.light.tabIconSelected }
            />
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen 
                        name="index" 
                        options={{ 
                            headerShown: false,
                        }} 
                    />
                    <Stack.Screen 
                        name="conversaciones" 
                        options={{ 
                            headerShown: true,
                            title: 'conversaciones',
                        }}     
                    />
                </Stack>
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </>
    );
}