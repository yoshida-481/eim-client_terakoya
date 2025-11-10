import { Routes } from '@angular/router';

export const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/documents/login',
		pathMatch: 'full' as 'full'
	},
	{
		// ログイン画面(ドキュメント管理)
		path: 'documents',
		loadChildren: () => import('./documents/documents-routing').then(m => m.documentsRoutes),
		title: 'Documents' ,
	},

	{
		// ログイン画面(帳票管理)
		path: 'forms',
		loadChildren: () => import('./forms/forms-routing').then(m => m.formsRoutes), 
		title: 'Forms' 
	},
	{
		// ログイン画面(システム管理)
		path: 'admins',
		loadChildren: () => import('./admins/admins-routing').then(m => m.adminsRoutes), 
		title: 'Admins' 
	},
	{
		// ログイン画面(オブジェクトエディタ)
		path: 'object-editors',
		loadChildren: () => import('./object-editors/object-editors-routing').then(m => m.objectEditorsRoutes), 
		title: 'Object-editors' 
	},
	{
		// ログイン画面(タスク管理)
		path: 'tasks',
		loadChildren: () => import('./tasks/tasks-routing').then(m => m.tasksRoutes),
		title: 'Tasks' ,
	},
	{
		// ログイン画面(ポータル)
		path: 'portals',
		loadChildren: () => import('./portals/portals-routing').then(m => m.portalsRoutes),
		title: 'Portals' ,
	},

];
