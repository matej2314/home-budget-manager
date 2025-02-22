import { useMemo } from "react";

const useProcessedData = (data, keyMap) => {
    return useMemo(() => {
        if (!data || !data.length) {
            const emptyObj = {};
            Object.keys(keyMap).forEach(key => {
                emptyObj[key] = [];
            });
            return emptyObj;
        }

        return Object.keys(keyMap).reduce((acc, key) => {
            acc[key] = data.map(item => item[keyMap[key]]);
            return acc;
        }, {});
    }, [data, keyMap]);
};

export default useProcessedData;