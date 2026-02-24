import { Provider } from "react-redux";
import appStore from "./utils/appStore";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login";
import Browse from "./components/Browse";

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/browse',
    element: <Browse />,
  },
]);

function App() {
  return (
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />
    </Provider>
  )
}
export default App;