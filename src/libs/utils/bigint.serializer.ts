/**
 * Utility to serialize BigInt values to strings for JSON responses
 */

export function serializeBigInt<T>(obj: T): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (Array.isArray(obj)) {
        return obj.map(item => serializeBigInt(item));
    }

    if (typeof obj === 'object') {
        const serialized: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                serialized[key] = serializeBigInt((obj as any)[key]);
            }
        }
        return serialized;
    }

    return obj;
}

/**
 * Global BigInt JSON serialization
 * Add this to enable BigInt.toJSON() globally
 */
export function enableBigIntSerialization() {
    (BigInt.prototype as any).toJSON = function() {
        return this.toString();
    };
}
