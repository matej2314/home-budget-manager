import { useState } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Tooltip } from '@visx/tooltip';
import { scaleOrdinal } from '@visx/scale';
import { localPoint } from '@visx/event';
import PieChartLegend from './PieChartLegend';

const PieChart = ({ data, colors, width, height, margin, showLabel, legendPosition }) => {
    const [tooltipData, setTooltipData] = useState(null);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">Brak danych do wyświetlenia</p>;
    }

    const colorScale = scaleOrdinal({
        domain: data.map(d => d.label),
        range: colors,
    });

    const handleMouseMove = (event, datum) => {
        const coords = localPoint(event);
        if (coords) {
            setTooltipData({ datum, x: coords.x, y: coords.y });
        }
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    const radius = Math.min(width, height) / 2 - margin;

    const flexDirection = legendPosition === 'top' || legendPosition === 'bottom' ? 'flex-col' : 'flex-row';

    return (
        <div className={`relative flex ${flexDirection} items-center`}>
            {legendPosition === 'top' && <PieChartLegend colorScale={colorScale} position="top" />}

            <div className="flex items-center">
                {legendPosition === 'left' && <PieChartLegend colorScale={colorScale} position="left" />}

                <div className="relative">
                    <svg width={width} height={height}>
                        <Group top={height / 2} left={width / 2}>
                            <Pie
                                data={data}
                                pieValue={d => d.value}
                                outerRadius={radius}
                                innerRadius={radius / 3}
                                padAngle={0.03}
                                cornerRadius={5}
                            >
                                {(pie) => pie.arcs.map((arc) => {
                                    const [centroidX, centroidY] = pie.path.centroid(arc);
                                    return (
                                        <g
                                            key={`arc-${arc.data.label}`}
                                            onMouseMove={(event) => handleMouseMove(event, arc.data)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <path d={pie.path(arc)} fill={colorScale(arc.data.label)} />
                                            {showLabel && (
                                                <text
                                                    x={centroidX}
                                                    y={centroidY}
                                                    dy=".33em"
                                                    fill="white"
                                                    fontSize={12}
                                                    textAnchor="middle"
                                                >
                                                    {arc.data.label}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </Pie>
                        </Group>
                    </svg>

                    {tooltipData && (
                        <Tooltip left={tooltipData.x} top={tooltipData.y}>
                            <div className="p-2 bg-white shadow-md rounded">
                                <strong>{tooltipData.datum.label}</strong>: {tooltipData.datum.value}
                            </div>
                        </Tooltip>
                    )}
                </div>
                {legendPosition === 'right' && <PieChartLegend colorScale={colorScale} position="right" />}
            </div>
            {legendPosition === 'bottom' && <PieChartLegend colorScale={colorScale} position="bottom" />}
        </div>
    );
};

export default PieChart;
