import './App.css';
import { Container } from '@mui/material';
import Metadata from './pages/metadata';
import { useAnalyzeData } from './utils/hooks/apis/analyze';
import Results from './pages/results';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function App() {

  const [results, setResults] = useState();
  const { data, mutate, isLoading } = useAnalyzeData();

  const handleSubmit = async (metadata) => {
    try {
      const data = mutate(metadata);
      setResults({ data })
    } catch (err) {
      console.error(err);
    }
  }

  // const temp = {
  //   "linear_selection_cost": 9000,
  //   "binary_selection_cost": 89.69205856195879,
  //   "indexed_selection_cost": {
  //     "employee_id": [
  //       3000,
  //       26,
  //       2974,
  //       0.8666666666666667,
  //       99.13333333333334,
  //       3
  //     ],
  //     "first_name": [
  //       4000,
  //       79,
  //       3921,
  //       1.975,
  //       98.025,
  //       4
  //     ],
  //     "last_name": [
  //       3000,
  //       47,
  //       2953,
  //       1.5666666666666667,
  //       98.43333333333334,
  //       3
  //     ],
  //     "department_id": [
  //       3000,
  //       103,
  //       2897,
  //       3.433333333333333,
  //       96.56666666666666,
  //       3
  //     ],
  //     "salary": [
  //       1000,
  //       50,
  //       950,
  //       5.0,
  //       95.0,
  //       1
  //     ]
  //   },
  //   "nested_loop_join_cost": {
  //     "employees join departments": 77000,
  //     "departments join employees": 42007
  //   },
  //   "block_nested_loop_join_cost": {
  //     "employees join departments": 14000,
  //     "departments join employees": 7007
  //   },
  //   "indexed_nested_join_cost": {
  //     "employees join departments": 147000,
  //     "departments join employees": 133
  //   }
  // }

  return (
    <div className="App">
      <Container maxWidth='100vw' className='outer-container' >
        <Metadata handleSubmit={handleSubmit} />
        {
          isLoading && <CircularProgress />
        }
        {
          data && <Results data={data} />
        }
      </Container>
    </div>
  );
}

export default App;
