import { Point, Polygon, LineString } from "../../src/classes/Features";

test("Point.constructor crea una istanza di un punto come feature di GeoJSON", () => {
    const pointInstance = new Point(1, 1, {});
    expect(pointInstance).toBeTruthy();
});

test("Point.constructor richiede un id: string e due punti: number", () => {
    expect(() => new Point(10, 20, {})).not.toThrow();
    expect(() => new Point("1", "2", {})).toThrow();
    expect(() => new Point("1", "2", {})).toThrow();
    expect(() => new Point(null, 2, {})).toThrow();
    expect(() => new Point(2, undefined, {})).toThrow();
});

test("Point.constructor accetta solo numeri in un range valido per la latitudine", () => {
    expect(() => new Point(10, 20, {})).not.toThrow();
    expect(() => new Point(0, 0, {})).not.toThrow();
    expect(() => new Point(-90, 0, {})).not.toThrow();
    expect(() => new Point(90, 0, {})).not.toThrow();
    expect(() => new Point(-180, -90, {})).not.toThrow();
    expect(() => new Point(180, 90, {})).not.toThrow();

    expect(() => new Point(Infinity, 100, {})).toThrow();
    expect(() => new Point(10, 10000, {})).toThrow();
});


const lineStringInstance = new LineString([
    [100, 0],
    [100, 90]
]);

test("LineString.constructor restituisce segmento valido secondo lo standard GeoJSON", () => {
    expect(
        JSON.stringify(lineStringInstance)
    ).toStrictEqual(
        JSON.stringify({
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [100, 0],
                    [100, 90]
                ]
            },
            "properties": {}
        })
    );
});

test("LineString.isEastOfPoint restituisce true se un punto si trova a ovest del segmento", () => {
    expect(
        lineStringInstance.isEastOfPoint(new Point(-100, 50))
    ).toBeTruthy();
    expect(
        lineStringInstance.isEastOfPoint(new Point(160, 90))
    ).toBeFalsy();
    expect(
        lineStringInstance.isEastOfPoint(new Point(160, 0))
    ).toBeFalsy();
});

const polygonInstance = new Polygon([
    [
        [100, 0],
        [100, 70],
        [0, 70],
        [0, 0],
        [100, 0]
    ]
]);

test("Polygon.constructor restituisce poligono valido secondo lo standard GeoJSON", () => {
    expect(
        JSON.stringify(polygonInstance)
    ).toStrictEqual(
        JSON.stringify({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [100, 0],
                        [100, 70],
                        [0, 70],
                        [0, 0],
                        [100, 0]
                    ]
                ]
            },
            "properties": {}
        })
    );
});

test("Polygon.wrapsThisPoint(point: Point): ritorna true se il poligono avvolge il punto (e il punto non è tangente)", () => {
    const pointToCheck = new Point(90, 10, {});
    expect(
        polygonInstance.wrapsThisPoint(pointToCheck)
    ).toBeTruthy();
    const pointToCheck2 = new Point(35, 67, {});
    expect(
        polygonInstance.wrapsThisPoint(pointToCheck2)
    ).toBeTruthy();
    const pointToCheck3 = new Point(-35, -67, {});
    expect(
        polygonInstance.wrapsThisPoint(pointToCheck3)
    ).toBeFalsy();
});