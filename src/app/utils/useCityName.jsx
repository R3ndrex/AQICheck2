import { useState, useEffect } from "react";

export default function useCityName(lat, lon) {
    const [city, setCity] = useState(null);

    useEffect(() => {
        if (!lat || !lon) return;

        fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
        )
            .then((response) => response.json())
            .then((data) => {
                const realCity =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Unknown";
                setCity(realCity);
            })
            .catch((error) => {
                console.error("Error in reverse geocoding:", error);
                setCity("Unknown");
            });
    }, [lat, lon]);

    return city;
}
