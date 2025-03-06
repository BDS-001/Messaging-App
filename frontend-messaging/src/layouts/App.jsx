import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../provider/AuthProvider';
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './App.module.css'

function App() {
  return (
    <AuthProvider>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.contentWrapper}>
          <Sidebar />
          <main className={styles.mainContent}>
            <Outlet />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App