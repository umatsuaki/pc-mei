import React from 'react';

import InstallManualPage from './routes/InstallManualPage';
import TopPage from './routes/TopPage';
import KeichoPage from './routes/KeichoPage';

export const router = [
    {
        path: '/dist/install-manual',
        element: <InstallManualPage />
    },
    {
        path: '/dist/',
        element: <TopPage />
    },
    {
        path: '/dist/keicho',
        element: <KeichoPage />
    }
];