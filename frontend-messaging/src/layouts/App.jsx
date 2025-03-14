import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../provider/AuthProvider';
import { ChatProvider } from '../provider/ChatProvider';
import { ContactProvider } from '../provider/ContactsProvider';
import { ToastProvider } from '../provider/ToastProvider';
import Header from '../components/Header/Header';

function App() {
    return (
        <>
            <ToastProvider>
                <AuthProvider>
                    <ContactProvider>
                        <ChatProvider>
                            <Header />
                            <Outlet />
                        </ChatProvider>
                    </ContactProvider>
                </AuthProvider>
            </ToastProvider>
        </>
    );
}

export default App;
