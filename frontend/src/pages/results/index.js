import React from 'react';
import { Card, Box } from '@mui/material';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart, Pie, Cell, Label,
  ResponsiveContainer,
} from 'recharts';

import "./index.css"

const Results = ({ data }) => {

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const selection_without_idx = [
    {
      name: 'Linear Selection Cost',
      value: data['linear_selection_cost'],
    },
    {
      name: 'Binary Selection Cost',
      value: data['binary_selection_cost']
    },
  ]

  const selection_with_idx = Object.entries(data['indexed_selection_cost']).map(
    ([key, value]) => {
      return {
        name: key,
        value: value[2],
      };
    }
  );

  const selection_with_idx_pie = Object.entries(data['indexed_selection_cost']).map(
    ([key, value]) => {
      return {
        name: key,
        value: value[5],
      };
    }
  );

  const selection_performance = Object.entries(data['indexed_selection_cost']).map(
    ([key, value]) => {
      return {
        name: key,
        value: value[4],
      };
    }
  );
  selection_performance.push({ name: 'linear scan', value: 100 })

  const nested_join_cost = Object.entries(data['nested_loop_join_cost']).map(
    (itm) => {
      console.log(itm)
      return {
        name: itm[0],
        value: itm[1],
      };
    }
  );

  const block_nested_join_cost = Object.entries(data['block_nested_loop_join_cost']).map(
    (itm) => {
      return {
        name: itm[0],
        value: itm[1],
      };
    }
  );

  const index_nested_join_cost = Object.entries(data['indexed_nested_join_cost']).map(
    (itm) => {
      return {
        name: itm[0],
        value: itm[1],
      };
    }
  );

  return (
    <div className='result-div'>
      <Card className='result-card'>
        Selection Cost without index
        <ResponsiveContainer>
          <ComposedChart
            width={50}
            height={40}
            data={selection_without_idx}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Box sx={{ display: 'flex' }}>
        <Card className='result-card'>
          Selection Cost with Index On Each Column
          <ResponsiveContainer>
            <ComposedChart
              width={50}
              height={40}
              data={selection_with_idx}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="value" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card sx={{ width: 'fit-content', margin: '1em' }}>
          No. of queries affacted by index per column
          <PieChart width={400} height={200}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={selection_with_idx_pie}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        </Card>
      </Box>

      <Card className='result-card'>
        Performance comparison of selection queries in %
        <ResponsiveContainer>
          <ComposedChart
            width={50}
            height={40}
            data={selection_performance}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Box sx={{display:'flex'}}>
      <Card className='result-card'>
        Nested Loop join Cost
        <ResponsiveContainer>
          <ComposedChart
            width={50}
            height={40}
            data={nested_join_cost}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card className='result-card'>
        Block Nested Loop join Cost
        <ResponsiveContainer>
          <ComposedChart
            width={50}
            height={40}
            data={block_nested_join_cost}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      </Box>

      <Card className='result-card'>
        Index Nested Loop join Cost
        <ResponsiveContainer>
          <ComposedChart
            width={50}
            height={40}
            data={index_nested_join_cost}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>


    </div>
  )
}

export default Results