export const mapArray= <T, U = T>(arr: T[], callback: (item: T, index: number, array: T[]) => U, condition: boolean = true): U[] => {
    if (condition) {
        return arr.map(callback);
    }
    return [];
};

export const filterArray = <T>(arr: T[], callback: (item: T, index: number, array: T[]) => boolean, condition:boolean = true): T[] => {
    if (condition) {
        return arr.filter(callback);
    }
    return arr;
};

