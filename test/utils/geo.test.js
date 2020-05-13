import { getExtentFromPoints, isLatitudeValueValid, isLongitudeValueValid, isLatLngValid, isLngLatValid } from '../../src/utils/geo';
import { Point } from '../../src/classes/Features';

test("getExtentFromPoints: restituisce le giuste coordinate che contengono l'array di punti", () => {
    expect(
        getExtentFromPoints(
            [new Point(-74, 40), new Point(-78, 42), new Point(-82, 35)]
        )
    ).toMatchObject(
        [-82, 35, -74, 42]
    )
});

test("getExtentFromPoints: parametro dev'essere un array con dei punti", () => {
    expect(
        () => getExtentFromPoints(null)
    ).toThrow();
    expect(
        () => getExtentFromPoints([new Point(-74, 40), new Point(-78, 42), new Point(-82, 35)])
    ).not.toThrow();
    expect(
        () => getExtentFromPoints([])
    ).toThrow();
    expect(
        () => getExtentFromPoints(["aaaa", "eeeee"])
    ).toThrow();
});

test("getExtentFromPoints: parametro dev'essere un array con punti validi, più di 0", () => {
});

test("isLatitudeValueValid: ritorna true solo se si passa un numero che rappresenta una latitudine valida", () => {
    expect(isLatitudeValueValid(undefined)).toBeFalsy();
    expect(isLatitudeValueValid(null)).toBeFalsy();
    expect(isLatitudeValueValid(NaN)).toBeFalsy();
    expect(isLatitudeValueValid(Infinity)).toBeFalsy();
    expect(isLatitudeValueValid(-Infinity)).toBeFalsy();
    expect(isLatitudeValueValid(false)).toBeFalsy();
    expect(isLatitudeValueValid(91)).toBeFalsy();
    expect(isLatitudeValueValid(90.0000001)).toBeFalsy();
    expect(isLatitudeValueValid(90)).toBeTruthy();
    expect(isLatitudeValueValid(-90.0000001)).toBeFalsy();
    expect(isLatitudeValueValid(-90)).toBeTruthy();
    expect(isLatitudeValueValid(0)).toBeTruthy();
    expect(isLatitudeValueValid(-0)).toBeTruthy();
});

test("isLongitudeValueValid: ritorna true solo se si passa un numero che rappresenta una longitudine valida", () => {
    expect(isLongitudeValueValid(undefined)).toBeFalsy();
    expect(isLongitudeValueValid(null)).toBeFalsy();
    expect(isLongitudeValueValid(NaN)).toBeFalsy();
    expect(isLongitudeValueValid(Infinity)).toBeFalsy();
    expect(isLongitudeValueValid(-Infinity)).toBeFalsy();
    expect(isLongitudeValueValid(false)).toBeFalsy();
    expect(isLongitudeValueValid(181)).toBeFalsy();
    expect(isLongitudeValueValid(180.0000001)).toBeFalsy();
    expect(isLongitudeValueValid(180)).toBeTruthy();
    expect(isLongitudeValueValid(-180.0000001)).toBeFalsy();
    expect(isLongitudeValueValid(-180)).toBeTruthy();
    expect(isLongitudeValueValid(0)).toBeTruthy();
    expect(isLongitudeValueValid(-0)).toBeTruthy();
});

test("isLatLngValid: ritorna true solo se si passa un vettore con una latitudine e una longitudine valida", () => {
    expect(isLatLngValid([null, 0])).toBeFalsy();
    expect(isLatLngValid([NaN, 0])).toBeFalsy();
    expect(isLatLngValid([Infinity, 0])).toBeFalsy();
    expect(isLatLngValid([-Infinity, 0])).toBeFalsy();
    expect(isLatLngValid([false, 0])).toBeFalsy();
    expect(isLatLngValid([0, 0])).toBeTruthy();

    expect(isLatLngValid([null, 0].reverse())).toBeFalsy();
    expect(isLatLngValid([NaN, 0].reverse())).toBeFalsy();
    expect(isLatLngValid([Infinity, 0].reverse())).toBeFalsy();
    expect(isLatLngValid([-Infinity, 0].reverse())).toBeFalsy();
    expect(isLatLngValid([false, 0].reverse())).toBeFalsy();
    expect(isLatLngValid([0, 0].reverse())).toBeTruthy();

    expect(isLatLngValid([90, 180])).toBeTruthy();
    expect(isLatLngValid([-90, -180])).toBeTruthy();
});

test("isLngLatValid: ritorna true solo se si passa un vettore con una latitudine e una longitudine valida", () => {
    expect(isLngLatValid([null, 0])).toBeFalsy();
    expect(isLngLatValid([NaN, 0])).toBeFalsy();
    expect(isLngLatValid([Infinity, 0])).toBeFalsy();
    expect(isLngLatValid([-Infinity, 0])).toBeFalsy();
    expect(isLngLatValid([false, 0])).toBeFalsy();
    expect(isLngLatValid([0, 0])).toBeTruthy();

    expect(isLngLatValid([null, 0].reverse())).toBeFalsy();
    expect(isLngLatValid([NaN, 0].reverse())).toBeFalsy();
    expect(isLngLatValid([Infinity, 0].reverse())).toBeFalsy();
    expect(isLngLatValid([-Infinity, 0].reverse())).toBeFalsy();
    expect(isLngLatValid([false, 0].reverse())).toBeFalsy();
    expect(isLngLatValid([0, 0].reverse())).toBeTruthy();

    expect(isLngLatValid([180, 90])).toBeTruthy();
    expect(isLngLatValid([-180, -90])).toBeTruthy();
});