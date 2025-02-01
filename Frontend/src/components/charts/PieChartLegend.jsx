import { LegendOrdinal } from "@visx/legend";

export default function PieChartLegend({ colorScale, position }) {
    const isVertical = position === 'left' || position === 'right';

    return (
        <div className={`p-2 ${isVertical ? 'flex flex-col' : 'flex flex-row'} gap-2`}>
            <LegendOrdinal
                scale={colorScale}
                direction={isVertical ? 'column' : 'row'}
                itemDirection="row"
                labelMargin={isVertical ? '0 10px 10px 0' : '0 15px 0 0'}
            />
        </div>
    );
};