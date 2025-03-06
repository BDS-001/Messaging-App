import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../provider/AuthProvider';
import { ChatProvider } from '../provider/ChatProvider'
import Header from '../components/Header/Header'

function App() {
  return (
    <>
    <AuthProvider>
      <ChatProvider>
        <Header />
        <Outlet/>
      </ChatProvider>
    </AuthProvider>
    </>
  )
}

export default App