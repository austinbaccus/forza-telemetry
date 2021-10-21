import React, { useEffect } from 'react'
import * as d3 from 'd3'

function PieChart(props) {
    const { data, outerRadius, innerRadius } = props

    const margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    }

    const width = 2 * outerRadius + margin.left + margin.right
    const height = 2 * outerRadius + margin.top + margin.bottom

    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateCool)
        .domain([0, data.length])

    useEffect(() => {
        drawChart()
    }, [data])

    function drawChart() {
        // Remove the old svg
        d3.select('#pie-container').select('svg').remove()

        // Create new svg
        const svg = d3
            .select('#pie-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value)

        const arc = svg.selectAll().data(pieGenerator(data)).enter()

        // Append arcs
        arc.append('path')
            .attr('d', arcGenerator)
            .style('fill', (_, i) => colorScale(i))
            .style('stroke', '#ffffff')
            .style('stroke-width', 0)

        // Append text labels
        arc.append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.label)
            .style('fill', (_, i) => colorScale(data.length - i))
            .attr('transform', (d) => {
                const [x, y] = arcGenerator.centroid(d)
                return `translate(${x}, ${y})`
            })
    }

    return <div id="pie-container" />
}

const cos = Math.cos
const sin = Math.sin
const π = Math.PI
const fMatrixTimes = ([[a, b], [c, d]], [x, y]) => [
    a * x + b * y,
    c * x + d * y,
]
const fRotateMatrix = (x) => [
    [cos(x), -sin(x)],
    [sin(x), cos(x)],
]
const fVecAdd = ([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]

/* returns a SVG path element that represent a ellipse.
cx,cy → center of ellipse
rx,ry → major minor radius
t1 → start angle, in radian.
delta → angle to sweep, in radian. positive.
phi → rotation on the whole, in radian */
function setSvgProps(phi, rx, ry, t1, cx, cy, delta) {
    delta = delta % (2 * π)
    const rotMatrix = fRotateMatrix(phi)
    const [sX, sY] = fVecAdd(
        fMatrixTimes(rotMatrix, [rx * cos(t1), ry * sin(t1)]),
        [cx, cy]
    )
    const [eX, eY] = f_vec_add(
        fMatrixTimes(rotMatrix, [rx * cos(t1 + delta), ry * sin(t1 + delta)]),
        [cx, cy]
    )
    const fA = delta > π ? 1 : 0
    const fS = delta > 0 ? 1 : 0
    return ` M ${sX} ${sY} A ${rx} ${ry} ${
        (phi / (2 * π)) * 360
    } ${fA} ${fS} ${eX} ${eY}`
}

function Tachometer(props) {
    // var rpm = Math.min(1, props.Rpm / props.MaxRpm) * 360;

    const arc = arc()
        .size(80)
        .innerRadius(70)
        .outerRadius(90)
        .startAngle(10)
        .endAngle(250)

    return (
        <div>
            <svg>
                <path
                    d={setSvgProps(0, 100, 100, 0, 200, 200, 240)}
                    stroke="yellow"
                    strokeWidth="5"
                    fill="none"
                />
                <PieChart
                    data={[1, 3, 4, 2]}
                    outerRadius={90}
                    innerRadius={80}
                />
            </svg>
        </div>
    )
}

export default Tachometer
