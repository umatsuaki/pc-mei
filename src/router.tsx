import React from 'react';
import { RouteObject } from 'react-router-dom';

import InstallManualPage from './routes/InstallManualPage';
import TopPage from './routes/TopPage';
import KeichoPage from './routes/KeichoPage';

export const router: RouteObject[] = [
    {
        path: '/install-manual',
        element: <InstallManualPage />
    },
    {
        path: '/',
        element: <TopPage />
    },
    {
        path: '/keicho',
        element: <KeichoPage />
    }
];