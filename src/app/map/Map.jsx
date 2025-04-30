"use client";
import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ position }) {
    const [stations, setStations] = useState([]);
    const [popupData, setPopupData] = useState({});
    const [loadingPopupUid, setLoadingPopupUid] = useState(null);

    useEffect(() => {
        const bounds = `${position[0] - 0.5},${position[1] - 0.5},${
            position[0] + 0.5
        },${position[1] + 0.5}`;

        fetch(
            `https://api.waqi.info/v2/map/bounds/?latlng=${bounds}&token=${process.env.NEXT_PUBLIC_TOKEN}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    setStations(data.data);
                } else {
                    console.error("Error loading stations:", data.data);
                }
            })
            .catch((error) => {
                console.error("Error while request:", error);
            });
    }, [position]);

    function MapEvents({ setStations }) {
        const map = useMapEvents({
            moveend: () => {
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                const bbox = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;

                fetch(
                    `https://api.waqi.info/v2/map/bounds/?latlng=${bbox}&token=${process.env.NEXT_PUBLIC_TOKEN}`
                )
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === "ok") {
                            setStations(data.data);
                        } else {
                            console.error(
                                "Error loading new stations:",
                                data.data
                            );
                        }
                    })
                    .catch((error) => {
                        console.error("Error while moving map:", error);
                    });
            },
        });

        return null;
    }

    function loadPopupData(uid) {
        if (popupData[uid]) return;
        setLoadingPopupUid(uid);

        fetch(
            `https://api.waqi.info/feed/@${uid}/?token=${process.env.NEXT_PUBLIC_TOKEN}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    setPopupData((prev) => ({
                        ...prev,
                        [uid]: data.data,
                    }));
                }
            })
            .catch((error) => {
                console.error("Error while loading popup:", error);
            })
            .finally(() => {
                setLoadingPopupUid(null);
            });
    }

    return (
        <MapContainer className="map" center={position} zoom={10}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents setStations={setStations} />
            {stations.map((station) => (
                <Marker
                    key={station.uid}
                    position={[station.lat, station.lon]}
                    icon={L.icon({
                        iconUrl: `https://waqi.info/mapicon/${station.aqi}.30.png`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                    })}
                    eventHandlers={{
                        click: () => loadPopupData(station.uid),
                    }}
                >
                    <Popup>
                        {loadingPopupUid === station.uid && (
                            <div>Loading...</div>
                        )}

                        {popupData[station.uid] ? (
                            <div style={{ minWidth: "200px" }}>
                                <b>{popupData[station.uid].city.name}</b>
                                <br />
                                <b>AQI:</b> {popupData[station.uid].aqi}
                                <br />
                                <b>Updated:</b>{" "}
                                {new Date(
                                    popupData[station.uid].time.v * 1000
                                ).toLocaleTimeString()}
                                <br />
                                <br />
                                {popupData[station.uid].city.location && (
                                    <>
                                        <b>Location:</b>{" "}
                                        {popupData[station.uid].city.location}
                                        <br />
                                        <br />
                                    </>
                                )}
                                <b>Pollutants:</b>
                                <br />
                                {["pm25", "pm10", "o3", "no2", "so2", "co"].map(
                                    (pollutant) =>
                                        popupData[station.uid].iaqi?.[
                                            pollutant
                                        ] && (
                                            <div key={pollutant}>
                                                {pollutant.toUpperCase()}:{" "}
                                                {
                                                    popupData[station.uid].iaqi[
                                                        pollutant
                                                    ].v
                                                }
                                            </div>
                                        )
                                )}
                                <br />
                                <b>Source:</b>
                                <br />
                                {popupData[station.uid].attributions?.map(
                                    (attr, idx) => (
                                        <div key={idx}>
                                            <a
                                                href={attr.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {attr.name}
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            !loadingPopupUid && (
                                <div>Press on marker to load...</div>
                            )
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
