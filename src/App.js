import  Register  from './components/Register';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import StartPage from './components/StartPage';
import Home from './components/Home';
import VideoApp from './VideoApp';
import { VideoProvider } from './context/VideoContext';
function App() {
  return (
    <main className="App">
      <VideoProvider>
      <Routes>
        <Route path='/' element={<StartPage/>}/>
        <Route exact path='/signup' element={<Register/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/home' element={<Home/>}/>
        <Route exact path='/videochat' element={<VideoApp/>}/>
      </Routes>   
      </VideoProvider>
    </main>
  );
}

export default App;
