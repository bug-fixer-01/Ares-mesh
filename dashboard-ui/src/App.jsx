import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './context/AuthContext.jsx';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Admin from './pages/Admin.jsx';

const App = () => {
  const { user } = useContext(UserContext)
  console.log(user)
  return (
     <main>
        <Router>
          <Routes>
            <Route path='/' element={user ? <Dashboard /> : <Navigate to="/Login" />} />
            <Route path='/login' element={user ? <Navigate to="/" /> : <Login />} />
            <Route path='/signup' element={user ? <Navigate to='/' /> : <SignUp />} />
            <Route path='/Admin' element={user ? <Admin /> : <Navigate to="/Login" />} />
          </Routes>
        </Router>
     </main>
  )
}

export default App