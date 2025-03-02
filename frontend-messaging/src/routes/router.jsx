import App from "../layouts/App.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import Homapage from "../pages/Homepage/Homepage.jsx";
import Login from '../pages/LoginPage/Login.jsx'
import Signup from '../pages/SignupPage/SignupPage.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
        { index: true, element: <Homapage /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Signup /> },
    ],
  },
];

export default routes;