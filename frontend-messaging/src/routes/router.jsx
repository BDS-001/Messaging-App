import App from '../layouts/App.jsx';
import ErrorPage from '../pages/ErrorPage/ErrorPage.jsx';
import Homapage from '../pages/Homepage/Homepage.jsx';
import Login from '../pages/LoginPage/Login.jsx';
import Signup from '../pages/SignupPage/SignupPage.jsx';
import SettingsPage from '../pages/SettingsPage/Settings.jsx';
import ContactPage from '../pages/ContactPage/Contact.jsx';
import { ProtectedRoute, AuthRoute } from '../components/ProtectedRoute/ProtectedRoute.jsx';

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <Homapage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'login',
                element: (
                    <AuthRoute>
                        <Login />
                    </AuthRoute>
                ),
            },
            {
                path: 'signup',
                element: (
                    <AuthRoute>
                        <Signup />
                    </AuthRoute>
                ),
            },
            {
                path: 'settings',
                element: (
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'contacts',
                element: (
                    <ProtectedRoute>
                        <ContactPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];

export default routes;
