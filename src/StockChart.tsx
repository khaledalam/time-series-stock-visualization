import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StockData {
    date: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}

interface Props {
    data: { [idx: number]: StockData };
}

const StockChart: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data) return;

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const dates = Object.keys(data).map((key, idx) => data[idx]?.date)

        console.log("dates", dates);
        const prices = Object.keys(data).map((key, idx) => parseFloat(data[idx].open));
        
        const xScale = d3.scaleBand()
            .domain(dates)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(prices) || 0])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.selectAll(".bar")
            .data(dates)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d) || 0)
            .attr("width", xScale.bandwidth())
            .attr("y", (d, idx) => {
                console.log("> data" , data)
                console.log("> d" , d)
                console.log("> idx" , idx)
                console.log("> data[idx]" , data[idx])

                return yScale(parseFloat(data[idx].open)) || 0;
            })
            .attr("height", (d, idx) => height - (yScale(parseFloat(data[idx].open)) || 0))
            .attr("fill", "steelblue");
            

    }, [data]);

    return <svg className='m-auto' ref={svgRef}></svg>;
};

export default StockChart;