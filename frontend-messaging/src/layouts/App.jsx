import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../provider/AuthProvider';
import { ChatProvider } from '../provider/ChatProvider';
import { ContactProvider } from '../provider/ContactsProvider';
import Header from '../components/Header/Header';

function App() {
    return (
        <>
            <AuthProvider>
                <ContactProvider>
                    <ChatProvider>
                        <Header />
                        <Outlet />
                    </ChatProvider>
                </ContactProvider>
            </AuthProvider>
        </>
    );
}

export default App;
