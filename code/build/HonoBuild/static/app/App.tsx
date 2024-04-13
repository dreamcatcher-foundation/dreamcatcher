import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import React from 'react';
import bootMetamaskOperator from './operator/Metamask.ts';
import bootVaultDeployment from './operator/VaultDeployment.ts';
import Home from './page/Home.tsx';

bootMetamaskOperator();
bootVaultDeployment();

const root = document.getElementById('root')!;
const rootReactDOM = createRoot(root);
rootReactDOM.render(
    <RouterProvider router={createBrowserRouter([{
        path: '/',
        element: <Home></Home>
    }])}/>
);