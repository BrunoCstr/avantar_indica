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