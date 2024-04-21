import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import React from 'react';
import Home from './page/Home.tsx';
import GetStarted from "./page/GetStarted.tsx";

const root = document.getElementById('root')!;
const rootReactDOM = createRoot(root);
rootReactDOM.render(
    <RouterProvider router={createBrowserRouter([{
        path: '/',
        element: <Home/>
    }])}/>
);