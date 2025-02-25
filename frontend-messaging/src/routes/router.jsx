import App from "../layouts/App.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
        { index: true, element: <ErrorPage /> },
    ],
  },
];

export default routes;