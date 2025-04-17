import { useState, useEffect } from "react";
import { mapArray } from "@utils/arraysUtils/arraysFunctions";

type DataType = {
    labels: Date[];
    dataValues: number[];
};

export const useSortedUniqueData = (data: DataType) => {
    const [uniqueDataMap, setUniqueDataMap] = useState<Map<Date, number>>(new Map());

    useEffect(() => {
        const newMap = new Map(uniqueDataMap);

        data.labels.forEach((label: Date, index: number) => {
            if (!newMap.has(label)) {
                newMap.set(label, data.dataValues[index]);
            }
        });

        setUniqueDataMap(newMap);
    }, [data]);

    const sortedData = [...uniqueDataMap.entries()].sort((a, b) => a[0].getTime() - b[0].getTime());

    const uniqueLabels = mapArray(sortedData, ([label]) => label);
    const uniqueDataValues = mapArray(sortedData, ([, value]) => value);

    return { uniqueLabels, uniqueDataValues };
};
