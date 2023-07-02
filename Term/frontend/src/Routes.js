import { BrowserRouter as Router, Route, Routes as Rs} from 'react-router-dom';
import Register from './Register';
import Landing from './Landing';
import Analyser from './Analyser';
// import Login from './Login';
// import Users from './Users';

const Routes = () => {
    return (
        <Router>
            <Rs>
                <Route path="/" element={<Landing/>} />
                <Route path="/analyser" element={<Analyser/>} />
                <Route path="/register" element={<Register/>} />
                {/* <Route path="/login" element={<Login/>} />
                <Route path="/users" element={<Users/>} /> */}
            </Rs>
        </Router>
    )
}

export default Routes;