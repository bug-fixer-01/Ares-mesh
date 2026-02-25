import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserProvider from './context/AuthContext.jsx'
// import Test from './components/test.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
    {/* <Test /> */}
  </UserProvider>
)
