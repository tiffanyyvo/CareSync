import Login from './components/Login/Login';
import CreateAccount from './components/CreateAccount/CreateAccount';
import TasksPage from './pages/TasksPage';
import MedicationsPage from './pages/MedicationsPage';
import HomePage from './pages/HomePage';
import FamilyPage from './pages/FamilyPage';
import DeletePage from './pages/DeletePage';
import UpdatePage from './pages/UpdatePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/settings" element={<FamilyPage />} />
        <Route path="/delete-account" element={<DeletePage />} />
        <Route path="/update-account" element={<UpdatePage />} />
        <Route path="/medications" elment={<MedicationsPage />} />
      </Routes>
    </Router>
  );
}
export default App;
