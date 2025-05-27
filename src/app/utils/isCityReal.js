export default function isCityReal(lat, lon, city) {
    fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
    )
        .then((response) => response.json())
        .then((data) => {
            const realCity =
                data.address.city || data.address.town || data.address.village;
            if (city !== realCity) {
                return false;
            }
            return true;
        })
        .catch((error) => console.error("Error in reverse geocoding:", error));
}
