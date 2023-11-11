import './App.css';
import {Container} from '@mui/material';
import Metadata from './pages/metadata';


function App() {
  return (
    <div className="App">
      <Container maxWidth='100vw' className='outer-container' >
        <Metadata />
      </Container>
    </div>
  );
}

export default App;
