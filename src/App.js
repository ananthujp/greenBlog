import './App.css';
import Login from './Login';
import useAuth from './hooks/userAuth'
import "antd/dist/antd.css";
import Home from './Home';

function App() {
  const  {user}=useAuth();
  return (
    <div className="">
      {user?
      <Home/>
      :
      <Login/>
      }
      
    </div>
  );
}

export default App;
