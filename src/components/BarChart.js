import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import fire from '../base';
import * as d3 from 'd3';
import '../styles/BarChart.css';

const BarChart = () => {
  const canvasRef = useRef();
  const [days, setDays] = useState([]);
  const [showChart, setShowChart] = useState();
  const [pData, setPData] = useState();
  let daysArray = [];

  let parkingData;

  const getData = () => {
    fire.database().ref('Parking Lot A/plateImg')
      .on('value', snapshot => {

        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          const timeStamp = snapshot.child(key).child('entryTime').val();
          const day = new Date(timeStamp).getDay();
          daysArray.push(day);
        });
        setDays(daysArray);
        setShowChart(true);
      });
  };

  useEffect(() => {

    getData();
    
  }, []);

  useEffect(() => {

    if (showChart) {
      const svg = d3.select(canvasRef.current)
        .append('svg')
        .attr('width', 400)
        .attr('height', 230);

      const margin = { top: 20, right: 10, bottom: 100, left: 70 };
      const graphWidth = 200 - margin.left - margin.right;
      const graphHeight = 300 - margin.top - margin.bottom;

      const graph = svg.append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${graphHeight})`);

      const yAxisGroup = graph.append('g');

      //Scales
      const y = d3.scaleLinear()
        .range([graphHeight, 0]);

      const x = d3.scaleBand()
        .range([0, 300])
        .paddingInner(0.2)
        .paddingOuter(0.2);

      //create the axes
      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y)
        .ticks(6)
        .tickFormat(d => d + ' cars')


      xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', '#05386b');

      //update chart upon data
      const update = (data) => {

        //updating scales
        y.domain([0, d3.max(data, d => d.count * 5)]);
        x.domain(data.map(item => item.day));

        //join update data to the elements
        const rect = graph.selectAll('rect')
          .data(data)

        //remove unwanted shapes 
        rect.exit().remove();

        //update current shapes in dom
        rect
          .attr('width', x.bandwidth)
          .attr('fill', '#05386b')
          .attr('x', d => x(d.day))
          .transition().duration(500)
          .attr('height', d => graphHeight - y(d.count))
          .attr('y', d => y(d.count));

        //append the enter selection to the DOM
        rect.enter()
          .append('rect')
          .attr('width', x.bandwidth)
          .attr('height', 0)
          .attr('fill', '#05386b')
          .attr('x', d => x(d.day))
          .attr('y', graphHeight)
          .transition().duration(500)
          .attr('y', d => y(d.count))
          .attr('height', d => graphHeight - y(d.count));

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
      }

      parkingData = [
        {
          "day": "Sun",
          "count": countParkingPerDays(days, 0)
        },
        {
          "day": "Mon",
          "count": countParkingPerDays(days, 1)
        },
        {
          "day": "Tues",
          "count": countParkingPerDays(days, 2)
        },
        {
          "day": "Wed",
          "count": countParkingPerDays(days, 3)
        },
        {
          "day": "Thurs",
          "count": countParkingPerDays(days, 4)
        },
        {
          "day": "Fri",
          "count": countParkingPerDays(days, 5)
        },
        {
          "day": "Sat",
          "count": countParkingPerDays(days, 6)
        }
      ];
      setPData(parkingData);
      update(parkingData);
    }
  }, [showChart]);

  const countParkingPerDays = (arr, val) => {
    return arr.reduce((acc, element) => {
      return (val === element ? acc + 1 : acc);
    }, 0);
  }

  return (
    <div className="barChart">
    <div ref={canvasRef}></div>
    </div>
  )
}

export default BarChart;