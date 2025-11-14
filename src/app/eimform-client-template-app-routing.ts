import { Routes } from '@angular/router';

export const formsAppRoutes: Routes = [
	{
		path: '',
		redirectTo: '/forms/login',
		pathMatch: 'full' as 'full'
	},
	{
		// ログイン画面(帳票管理)
		path: 'forms',
		loadChildren: () => import('./forms/forms-routing').then(m => m.formsRoutes), 
		title: 'Forms' 
	}
];
