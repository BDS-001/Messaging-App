import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../provider/AuthProvider';
import Header from '../components/Header/Header'
import './App.css'

function App() {
  return (
    <>
    <AuthProvider>
      <Header />
        <Outlet/>
    </AuthProvider>
    </>
  )
}

export default App