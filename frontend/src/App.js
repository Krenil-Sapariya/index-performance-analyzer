import './App.css';
import {Container} from '@mui/material';
import Metadata from './pages/metadata';
import { useAnalyzeData } from './utils/hooks/apis/analyze';
import Results from './pages/results';
import { useState } from 'react';

function App() {
  
  const [results, setResults] = useState();
  const {mutate, isLoading} = useAnalyzeData();
  
  const handleSubmit = async (metadata) => {
    try{
      const data = await mutate(metadata);
      setResults({data, isLoading: false})
    }catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="App">
      <Container maxWidth='100vw' className='outer-container' >
        <Metadata handleSubmit={handleSubmit}/>
        <Results results={results}/>
      </Container>
    </div>
  );
}

export default App;
