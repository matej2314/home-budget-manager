import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Tooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LegendOrdinal } from '@visx/legend';

const BarChart = ({ data, colors, width, height, margin }) => {
    const [tooltipData, setTooltipData] = React.useState(null);

    // Scales
    const xScale = scaleBand({
        domain: data.map(d => d.label),
        range: [0, width - margin * 2],
        padding: 0.2,
    });

    const yScale = scaleLinear({
        domain: [0, Math.max(...data.map(d => d.value))],
        range: [height - margin * 2, 0],
    });

    // Handle Tooltip
    const handleMouseMove = (event, datum) => {
        const { x, y } = localPoint(event);
        setTooltipData({ datum, x, y });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    return (
        <div>
            <svg width={width} height={height}>
                <Group top={margin} left={margin}>
                    {data.map((datum, index) => (
                        <g key={`bar-${datum.label}`}>
                            <Bar
                                x={xScale(datum.label)}
                                y={yScale(datum.value)}
                                width={xScale.bandwidth()}
                                height={height - margin * 2 - yScale(datum.value)}
                                fill={colors[index]}
                                onMouseMove={event => handleMouseMove(event, datum)}
                                onMouseLeave={handleMouseLeave}
                            />
                        </g>
                    ))}
                </Group>
            </svg>
            {tooltipData && (
                <Tooltip left={tooltipData.x} top={tooltipData.y}>
                    <div>{tooltipData.datum.label}: {tooltipData.datum.value}</div>
                </Tooltip>
            )}
            <LegendOrdinal scale={scaleOrdinal({ domain: data.map(d => d.label), range: colors })} />
        </div>
    );
};

BarChart.defaultProps = {
    width: 500,
    height: 300,
    margin: 40,
};

export default BarChart;
