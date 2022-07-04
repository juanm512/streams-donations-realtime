/* Importing the App component from the App.js file. */
import App from "./App";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);