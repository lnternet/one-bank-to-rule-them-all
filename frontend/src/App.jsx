import { Route, Routes } from 'react-router-dom';
import Homepage from './Homepage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}
