export const mapArray = (arr, callback, condition = true) => {
    if (condition) {
        return arr.map(callback);
    }
    return [];
};

export const filterArray = (arr, callback, condition = true) => {
    if (condition) {
        return arr.filter(callback);
    }
    return arr;
};

export const reduceArray = () => {

};