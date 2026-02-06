import { AuthProvider } from './components/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';
import Accommodations from './pages/Accommodations';
import AccommodationDetail from './pages/AccommodationDetail';
import OAuthCallback from './components/OAuthCallback';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oauth/kakao/callback" element={<OAuthCallback />} />
            <Route path="/oauth/google/callback" element={<OAuthCallback />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/accommodations/:accommodationNo" element={<AccommodationDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
