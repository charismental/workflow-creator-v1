import "dotenv/config";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "routes/error-page";
import SharedLink from "routes/sharedLink";

const doc = document.getElementById("root");
if (!doc) throw new Error("Failed to find root element");

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/sharedLink/:id",
        element: <SharedLink />,
    },
]);

const root = createRoot(doc)
    .render(<RouterProvider router={router} />);
