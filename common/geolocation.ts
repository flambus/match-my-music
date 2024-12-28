import { GeoLocation, User } from "./user_types.ts";

export async function getGeoLocation(user: User){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        throw new Error('Geolocation not supported or no permission.');
    }

    function onSuccess(position: GeolocationPosition){
        user.location = {lat: position.coords.latitude, lon: position.coords.longitude};
        console.log(user.location);
    }
    
    function onError(err: GeolocationPositionError){
        throw new Error(err.message);
    }
}

/**
 * 
 * getLocationDistance - Calculates the distance between two coordinates in kilometres.
 * 
 * @param loc1 
 * @param loc2 
 * @returns The Distance between two coordinates in kilometres.
 */
function getLocationDistance(loc1: GeoLocation, loc2: GeoLocation){
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const R = 6371; // Earth's radius in kilometers
    const lat1 = toRadians(loc1.lat);
    const long1 = toRadians(loc1.lon);
    const lat2 = toRadians(loc2.lat);
    const long2 = toRadians(loc2.lon);

    const dLat = lat2 - lat1;
    const dLong = long2 - long1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLong / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export function getUsersInRadius(user_location: GeoLocation, users: Set<User>, radius: number, max_amount: number){
    let found_users = 0;
    return [...users].filter((far_user: User) => {
        if(!far_user.location || found_users >= max_amount) return false;

        if(getLocationDistance(user_location, far_user.location) <= radius) {
            found_users += 1;
            return true
        }
    } )
}