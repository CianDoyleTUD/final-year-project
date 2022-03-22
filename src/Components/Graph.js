import React, { PureComponent } from 'react';
import { Area, LineChart, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart } from 'recharts';

const data = [
  {
    date: '2022-03-15',
    price: 4000,
  },
  {
    date: '2022-03-16',
    price: 3000,
  },
  {
    date: '2022-03-17',
    price: 2000,
  },
  {
    date: '2022-03-18',
    price: 2780,
  },
  {
    date: '2022-03-19',
    price: 1890,
  },
  {
    date: '2022-03-20',
    price: 2390,
  },
  {
    date: '2022-03-21',
    price: 3490,
  },
];

export default class Graph extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';

  render() {
    return (
      <>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianAxis x="date" />
            <XAxis dataKey="date" stroke='white'/>
            <YAxis dataKey="price" stroke='white' />
            <Tooltip />
            <Legend />
            <Line type="step" dataKey="price" stroke="#0c0c0c" activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke='white'/>
          <YAxis dataKey="price" stroke='white' />
          <Tooltip wrapperStyle={{ color : "#2c3e50", backgroundColor: 'red'}}/>
          <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={0.5} fill="url(#colorUv)" />
          
          </AreaChart>
        </ResponsiveContainer></>
    );
  }
}
