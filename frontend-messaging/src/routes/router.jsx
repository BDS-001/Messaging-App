import App from "../layouts/App.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import Homapage from "../pages/Homepage/Homepage.jsx";
import Login from '../pages/LoginPage/Login.jsx'
import Register from '../pages/Register/Register.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
        { index: true, element: <Homapage /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
    ],
  },
];

export default routes;