import Analyser from "./Analyser";
import Landing from "./Landing";
import Routes from "./Routes";
import { Navbar } from 'react-bootstrap';


function App() {
  return (
    <div className="App">
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand style={{ marginLeft: '20px', fontSize: '24px', color: 'white' }}>
        Image Analyser
      </Navbar.Brand>
    </Navbar>
    <Routes>
      <Landing></Landing>
   </Routes>
    </div>
  );
}

export default App;
