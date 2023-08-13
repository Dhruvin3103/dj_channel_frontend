import  Register  from './components/Register';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import StartPage from './components/StartPage';
import Home from './components/Home';
function App() {
  return (
    <main className="App">
      <Routes>
        <Route path='/' element={<StartPage/>}/>
        <Route exact path='/signup' element={<Register/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/home' element={<Home/>}/>
      </Routes>   
    </main>
  );
}

export default App;
