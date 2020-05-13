import { Point } from "../classes/Features";

/**
 * Controlla che il numero reale passato come variabile sia una latitudine valida
 * @param {Number} anyRealNumber da controllare
 */
export function isLatitudeValueValid(anyRealNumber) {
    if (typeof anyRealNumber !== "number") return false;
    if (isNaN(anyRealNumber)) return false;
    if (Math.abs(anyRealNumber) > UPPER_LATITUDE_BOUNDARY) return false;
    return true;
}

/**
 * Controlla che il numero reale passato come variabile sia una longitudine valida
 * @param {Number} anyRealNumber da controllare
 */
export function isLongitudeValueValid(anyRealNumber) {
    if (typeof anyRealNumber !== "number") return false;
    if (isNaN(anyRealNumber)) return false;
    if (Math.abs(anyRealNumber) > UPPER_LONGITUDE_BOUNDARY) return false;
    return true;
}

/**
 * Controlla che il vettore passato sia un array lat/lng valido
 * @param {[number, number]} tuple lat/lng da controllare
 */
export function isLatLngValid([lat, lng]) {
    if (!isLatitudeValueValid(lat)) return false;
    if (!isLongitudeValueValid(lng)) return false;
    return true;
}

/**
 * Controlla che il vettore passato sia un array lng/lat valido
 * @param {[number, number]} tuple lat/lng da controllare
 */
export function isLngLatValid([lng, lat]) {
    return isLatLngValid([lat, lng]);
}

/**
 * Calcola un boundary box a partire da un set di punti
 * @param  {Point[]} points i parametri della funzione sono gli array di punti intorno a cui calcolare il box
 * @returns {Array} estensione come  minX, minY, maxX, maxY
 */
export function getExtentFromPoints(points) {
    if (!Array.isArray(points)) throw "Parameter points must be an array";
    if (points.length < 1) throw "Needs at least 1 point to calculate boundary box";

    const pointsWithInvalidCoordinates = points.filter(point => !isLngLatValid(point.getCoordinates()));
    if (pointsWithInvalidCoordinates.length > 0) throw [
        "Some points have invalid coordinates",
        pointsWithInvalidCoordinates
    ];

    const longitudes = points.map(point => point.getLongitude());
    const latitudes = points.map(point => point.getLatitude());

    return [Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes)];
}

const UPPER_LATITUDE_BOUNDARY = 90;
const UPPER_LONGITUDE_BOUNDARY = 180;