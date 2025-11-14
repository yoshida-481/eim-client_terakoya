import { Routes } from '@angular/router';

export const tasksAppRoutes: Routes = [
	{
		path: '',
		redirectTo: '/portals/login',
		pathMatch: 'full'
	},
	{
		// ログイン画面(ポータル)
		path: 'portals',
		loadChildren: () => import('./portals/portals-routing').then(m => m.portalsRoutes),
		title: 'Portals' ,
	},

];
