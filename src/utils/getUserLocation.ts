import { Platform } from 'react-native';
import { versionApp } from '../screens/Settings';

export async function getUserLocation() {
    try{
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user location:', error);
        return null;
    }
}

export function getDeviceInfo() {
    return {
        platform: Platform.OS,
        versionApp: versionApp.version,
        dateVersionApp: versionApp.date,
        userAgent: `React Native ${Platform.OS}`,
        timestamp: new Date().toISOString(),
    };
}