import { isLngLatValid, getExtentFromPoints } from "../utils/geo";

const GEO_JSON_TYPES = [
    "Point",
    "LineString",
    "Polygon"
]

/**
 * Classe madre di tutte le feature supportate da GeoJSON
 */
export class Feature {
    /**
     * Crea una feature geografica nel formato GeoJSON (RFC 7946)
     * @param {String} type stringa che identifica il tipo
     * @param {Number[]} coordinates array di coordinate incluse nella feature geografica
     */
    constructor(type = null, coordinates = []) {

        if (!GEO_JSON_TYPES.includes(type)) console.warn("Feature being created directly without an existing subclass.")
        if (type === null) console.warn("Feature being created without a type.");

        this.type = "Feature";
        this.geometry = {
            type, // Valorizzato dalle classi figlie in una tipologia valida
            coordinates  // Valorizzato dalle classi figlie rispettando una forma stabile
        }

    }
}

/**
 * Punto generico abbinato a coordinate, id e payload
 */
export class Point extends Feature {
    /**
     * Crea un punto
    * @param {Number} longitude punto sull'asse longitudinale
    * @param {Number} latitude punto sull'asse latitudinale
    * @param {Object} payload oggetto JavaScript libero di payload
     */
    constructor(longitude, latitude, payload = {}) {
        const coordinates = [longitude, latitude];
        if (!isLngLatValid(coordinates)) {
            throw "new Point requires two valid float/integers as coordinates lng/lat";
        }
        super("Point", coordinates);
        this.properties = { ...this.properties, ...payload };
    }

    /**
     * Ritorna la longitudine del punto
     */
    getLongitude() {
        return this.getCoordinates()[0];
    }

    /**
     * Ritorna la latitudine del punto
     */
    getLatitude() {
        return this.getCoordinates()[1];
    }

    /**
     * Ritorna l'array di coordinate del punto
     */
    getCoordinates() {
        return this.geometry.coordinates;
    }
}

/**
 * LineStringa semplice da A a B
 */
export class LineString extends Feature {
    /**
     * Crea una LineString
     * @param {Array.Number[]} coordinates array di coordinate del Poligono di dimensione minima di 4 (triangolo)
     * @param {Object} payload oggetto JavaScript libero di payload
     */
    constructor(coordinates, payload = {}) {
        super("LineString", coordinates);
        this.properties = { ...this.properties, ...payload };
    }

    /**
     * Ritorna la prima coordinata
     */
    getStartPoint() {
        const index = 0;
        const coordinate = this.geometry.coordinates[index];
        return new Point(coordinate[0], coordinate[1]);
    }

    /**
     * Ritorna la seconda coordinata
     */
    getEndPoint() {
        const index = 1;
        const coordinate = this.geometry.coordinates[index];
        return new Point(coordinate[0], coordinate[1]);
    }

    /**
     * Algoritmo di ray casting - controlla se il punto si trova a ovest del segmento a->b
     * https://rosettacode.org/wiki/Ray-casting_algorithm#JavaScript
     * @param {Point} point Punto da confrontare con questo segmento
     * @return {boolean} Vero se (lngT, latT) è a ovest di pointA -> pointB
     */
    isEastOfPoint(
        target = new Point(0, 0), pointA = this.getStartPoint(), pointB = this.getEndPoint()
    ) {
        const [lngA, latA] = pointA.getCoordinates();
        const [lngB, latB] = pointB.getCoordinates();
        const [lngTarget, latTarget] = target.getCoordinates();
        // Scambia i due punti e chiama invertendoli
        if (latA <= latB) {
            // (latTarget <= latA): Se retta è sotto o tangente ad A, non attraversa il poligono
            // (latTarget > latB): Se retta è più in alto di B, non attraversa il poligono
            // (lngTarget >= lngA): Se retta è più a sinistra del punto a sinistra del segmento, è a sinistra
            // (lngTarget >= lngB): Se retta è più a sinistra del punto B, è a sinistra
            if ((latTarget <= latA) || (latTarget > latB) || (lngTarget >= lngA) && (lngTarget >= lngB)) {
                return false;
            } else if (lngTarget < lngA && lngTarget < lngB) {
                return true;
            } else {
                // Confronta le normali dall'origine
                return (latTarget - latA) / (lngTarget - lngA) > (latB - latA) / (lngB - lngA);
            }
        } else {
            return this.isEastOfPoint(target, this.getEndPoint(), this.getStartPoint());
        }
    }
}

/**
 * Poligono generico abbinato a piu' di una coordinata
 */
export class Polygon extends Feature {
    /**
     * Crea un Poligono
     * @param {Array.Number[]} coordinates array di coordinate del Poligono di dimensione minima di 4 (triangolo)
     * @param {Object} payload oggetto JavaScript libero di payload
     */
    constructor(coordinates, payload = {}) {
        super("Polygon", coordinates);
        this.properties = { ...this.properties, ...payload };
    }

    /**
     * Restituisce i segmenti del poligono
     */
    getSegments() {
        // ogni coordinata è unita a quella successiva
        return this.geometry.coordinates.map((coords, index, array) => (
            index < array.length
                ? new LineString([coords[index], coords[index + 1]], {})
                : new LineString([coords[index], coords[0]], {}) // L'ultimo si unisce col primo
        ));
    }

    /** Controlla se il punto si trova nel poligono (raycasting)
     * @param {Point} point da cercare nell'area del poligono
     * @return {Boolean} true: contiene; false: è al di fuori
     */
    wrapsThisPoint(point) {
        const bounds = this.getSegments();
        const count = bounds
            .map(bound => bound.isEastOfPoint(point)) // ogni segmento è confrontato col punto
            .reduce((accumulator, bool) => bool ? accumulator + 1 : accumulator, 0) // aumenta count per ogni true
        return !((count % 2) === 0);
    }

    /**
     * Genera un poligono rettangolare a partire da un set di points generici
     * @param {String} id univoco del nuovo Polygon
     * @param {Point[]} points array di punti
     * @return {Polygon} poligono rettangolare
     */
    static getRectPolygonFromPoints(id, points) {
        if (points.length === 5) {
            throw "Reactangular polygon has exactly 5 points - https://tools.ietf.org/html/rfc7946#section-3.1.6";
        }
        const [minX, minY, maxX, maxY] = getExtentFromPoints(points);
        return new Polygon([[minX, minY], [minX, maxY], [maxX, maxY], [minX, maxY], [minX, minY]], { id });
    }
}
