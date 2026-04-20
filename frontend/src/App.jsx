import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Admin/dash'; 
import Resouces from './components/Admin/resouces';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resouces />} /> 
      </Routes>
    </Router>
  );
}

export default App;