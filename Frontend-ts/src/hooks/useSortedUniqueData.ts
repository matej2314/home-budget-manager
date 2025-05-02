import { useState, useEffect } from "react";
import { mapArray } from "@utils/arraysUtils/arraysFunctions";

type DataType = {
    labels: Date[] | string[];
    dataValues: number[];
};

export const useSortedUniqueData = (data: DataType) => {
    const [uniqueDataMap, setUniqueDataMap] = useState<Map<Date, number>>(new Map());

    const convertedLabels: Date[] = data.labels.map(label => typeof label === 'string' ? new Date(label) : label);

    useEffect(() => {
        const newMap = new Map(uniqueDataMap);

        convertedLabels.forEach((label: Date, index: number) => {
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
