import { useState, useEffect } from "react";
import { mapArray } from "../utils/arraysUtils/arraysFunctions";

export const useSortedUniqueData = (data) => {
    const [uniqueDataMap, setUniqueDataMap] = useState(new Map());

    useEffect(() => {
        const newMap = new Map(uniqueDataMap);

        data.labels.forEach((label, index) => {
            if (!newMap.has(label)) {
                newMap.set(label, data.dataValues[index]);
            }
        });

        setUniqueDataMap(newMap);
    }, [data]);

    const sortedData = [...uniqueDataMap.entries()].sort((a, b) => new Date(a[0]) - new Date(b[0]));

    const uniqueLabels = mapArray(sortedData, (e) => e[0]);
    const uniqueDataValues = mapArray(sortedData, (e) => e[1]);

    return { uniqueLabels, uniqueDataValues };
};