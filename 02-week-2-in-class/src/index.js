import * as d3 from 'd3';
//Install bootstrap first, using npm install bootstrap --save
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import parse from './parse';

console.log('Week 2 in class');

//Part 1: review d3-selection
//https://github.com/d3/d3-selection

//Select elements

const moduleSelection = d3.select('.module'); // Selection
const divSelection = d3.select('div');



//Selection vs DOMNode

//Modifying selection
const redNode = moduleSelection
  .append('div')
  .attr('class', 'new new-div ')
  .style('width', '100px')
  .style('height', '200px')
  .style('background', 'red');

console.log(redNode);

//Handle events

redNode.on('click', function(){
  console.log('red box has been clicked');
});

//Control flow: .each and .call

//Data binding


//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){

	//Data transformation, discovery, and mining

  const tripsByStation0 = d3.nest()
    .key(function(d){ return d.station0 })
    .entries(trips);

  const tripVolumebyStation0 = tripsByStation0.map(function(d){
    return {
      station:d.key,
      volume:d.values.length
    };
  });

  console.log(tripsByStation0);

  //Mine for maximum
  const maxVolume = d3.max(tripVolumebyStation0, function(d){return d.volume});
  console.log(maxVolume);

  // visual space mesausrements
  const margin = {t: 100, r: 300, b:100, l:300};
  const padding = 3;
  const w = d3.select('.module').node().clientWidth;
  const h = d3.select('.module').node().clientHeight;
  const graph_w = w - margin.l - margin.r;
  const graph_h = h - margin.t - margin.b;


  console.log(w,h);

  //Scale

  const scaleX = d3.scaleLinear()
                    .domain([0, maxVolume])
                    .range([0, graph_w]);


	//Represent / DOM manipulation

  const svgNode = d3.select('.module')
    .append('svg')
    .attr('width', w)
    .attr('height', h); //selection

  const plot = svgNode
    .append('g')
    .attr('class', 'chart')
    .attr('transform', `translate(${margin.l}, ${margin.t})`); //selection of <g.chart>

  console.log(plot);
  console.log(svgNode.node());

  const stationNodes = plot.selectAll('.station') //selection of 0 elements
      .data(tripVolumebyStation0)
      .enter() //special selection of deficit between DOM and data points in the array size = 142
      .append('g')
      .attr('class', 'station') //
      .attr('transform', function(d,i){
        return `translate(0, ${i*h/tripsByStation0.length})`
      });  //selection of <g.station> x 142

  stationNodes
      .append('rect')
      .attr('width', function(d){
          return scaleX(d.volume);
      })
      .attr('height', graph_h/tripVolumebyStation0.length - padding)
      .style('fill', 'red');

  stationNodes
      .append('text')
      .text(function(d){
        return d.station;
      })
      .attr('text-anchor', 'end')
      .style('font-size', '6px');


});
