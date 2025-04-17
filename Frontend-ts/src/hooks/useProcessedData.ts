import { useMemo } from "react";

type KeyMap = Record<string, string>;
type DataItem = Record<string, any>;

const useProcessedData = (data: DataItem[], keyMap: KeyMap): Record<string, any[]> => {
    return useMemo(() => {
        if (!data || !data.length) {
            const emptyObj: Record<string, any[]> = {};
            Object.keys(keyMap).forEach(key => {
                emptyObj[key] = [];
            });
            return emptyObj;
        }

        return Object.keys(keyMap).reduce((acc: Record<string, any[]>, key: string) => {
            acc[key] = data.map(item => item[keyMap[key]]);
            return acc;
        }, {});
    }, [data, keyMap]);
};

export default useProcessedData;