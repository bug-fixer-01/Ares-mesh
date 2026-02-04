import {useState}from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {useContext} from 'react'
import {UserContext} from '../context/AuthContext'
import axiosInstance from '../utils/axiosInstance'
import Input from '../components/Input';

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState();


  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/auth/signup", {
        username,
        password
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser(user);
        navigate("/");
      }
    }
    catch (err) {
      console.log("Error object:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong, please try again later");
      }
    }
  }

  return (
    <div className='w-screen h-screen px-12 pt-8 pb-12 bg-black'>
     <div className='lg:w-[40%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-2xl font-semibold text-green-500'>Welcome Back</h3>
        <p className='text-xs font-medium text-green-500 mt-1.25 mb-6'
        >Please enter your details to sign up</p>


        <form onSubmit={handleLogin}>
          <Input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            label="Username"
            placeholder="Enter your username"
            type="text"
          />


          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="password"
            placeholder="min 8 characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary text-black bg-green-600 mt-2 p-1 rounded-sm">SIGNUP</button>
          <p className="text-[14px] text-green-500 mt-3">Don't have an account?{""}<Link className="font-medium text-primary underline" to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login