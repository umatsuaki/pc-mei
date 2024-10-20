import { RouteObject } from 'react-router-dom';

import InstallManualPage from './routes/InstallManualPage';
import TopPage from './routes/TopPage';
import KeichoPage from './routes/KeichoPage';
import StreetViewPage from './routes/StreetViewPage';

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
    },
    {
        path: '/street-view',
        element: <StreetViewPage />
    }
];