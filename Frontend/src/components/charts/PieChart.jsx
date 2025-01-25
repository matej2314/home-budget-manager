import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Tooltip } from '@visx/tooltip';
import { scaleOrdinal } from '@visx/scale';
import { localPoint } from '@visx/event';
import { LegendOrdinal } from '@visx/legend';

const PieChart = ({ data, colors, width, height, margin }) => {
    const [tooltipData, setTooltipData] = React.useState(null);

    // Scale for colors
    const colorScale = scaleOrdinal({
        domain: data.map(d => d.label),
        range: colors,
    });

    // Handle Tooltip
    const handleMouseMove = (event, datum) => {
        const { x, y } = localPoint(event);
        setTooltipData({ datum, x, y });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    // Pie chart radius
    const radius = Math.min(width, height) / 2 - margin;

    return (
        <div>
            <svg width={width} height={height}>
                <Group top={height / 2} left={width / 2}>
                    <Pie
                        data={data}
                        pieValue={d => d.value}
                        outerRadius={radius}
                        innerRadius={0}
                        padAngle={0.02}
                        cornerRadius={3}
                        startAngle={0}
                        endAngle={2 * Math.PI}
                    >
                        {pie => pie.arcs.map(arc => (
                            <g
                                key={`arc-${arc.data.label}`}
                                onMouseMove={event => handleMouseMove(event, arc.data)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <path
                                    d={arc.path}
                                    fill={colorScale(arc.data.label)}
                                />
                            </g>
                        ))}
                    </Pie>
                </Group>
            </svg>
            {tooltipData && (
                <Tooltip left={tooltipData.x} top={tooltipData.y}>
                    <div>{tooltipData.datum.label}: {tooltipData.datum.value}</div>
                </Tooltip>
            )}
            <LegendOrdinal scale={colorScale} />
        </div>
    );
};

PieChart.defaultProps = {
    width: 400,
    height: 400,
    margin: 40,
};

export default PieChart;
