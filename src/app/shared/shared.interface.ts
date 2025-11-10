import { EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';

//
// コンポーネント
//
/**
 * コンポーネントインタフェース
 */
export abstract class EIMComponent {
	disabled? = false;
}

/**
 * 一覧コンポーネントインタフェース
 */
export interface EIMListComponent<T> extends EIMComponent {
	multiple: boolean;
	initialized:EventEmitter<any>;
	selected: EventEmitter<any>;
	changed?: EventEmitter<any>;
	equals?: (a: T, b: T) => boolean;

	initialize(serviceParam?: any, isEmitEvent?: boolean): void;
	setData(data: T[]): void;
	select(selectedData: T[], isEmitEvent: boolean): void;
	getSelectedData(): T[];
}

/**
 * 階層コンポーネントインタフェース
 */
export interface EIMHierarchicalComponent<T> extends EIMListComponent<T> {
	setChildren(selectedData: T, children: T[]): void;
}

/**
 * 詳細コンポーネントインタフェース
 */
export interface EIMDetailComponent<T> extends EIMComponent {
	initialize(): void;
	setData(data: T): void;
}

/**
 * 選択コンポーネントインタフェース
 */
export interface EIMSelectorComponent<T> extends EIMComponent {
// initialize(serviceParam?: any, isEmitEvent?: boolean): void;
	getData(): T[];
	setData(data: T[]): void;
	getSelectedData(): T[];
}

/**
 * メニューインタフェース
 */
export interface EIMMenuItem extends MenuItem {
	name?: string;
	items?: EIMMenuItem[];
	rKey?: string;
	isUnavailable?: boolean; // 使用不可フラグ
}

/**
 * 登録インタフェース
 */
export interface EIMCreatable extends EIMComponent {
	visibleCreate?: boolean;
	created: EventEmitter<any>;
	create(): void;
	creatable(): boolean;
}

/**
 * 更新インタフェース
 */
export interface EIMUpdatable extends EIMComponent {
	visibleUpdate?: boolean;
	updated: EventEmitter<any>;
	update(): void;
	updatable(): boolean;
}

/**
 * 削除インタフェース
 */
export interface EIMDeletable extends EIMComponent {
	visibleDelete?: boolean;
	deleted: EventEmitter<any>;
	delete(): void;
	deletable(): boolean;
}

/**
 * 実行インタフェース
 */
export interface EIMExecutable extends EIMComponent {
	visibleExecute?: boolean;
	executed: EventEmitter<any>;
	execute(): void;
	executable(): boolean;
}

/**
 * 適用インタフェース
 */
export interface EIMApplicable extends EIMComponent {
	visibleApply?: boolean;
	applied: EventEmitter<any>;
	apply(): void;
	applicable(): boolean;
}

/**
 * 選択インタフェース
 */
export interface EIMSelectable extends EIMComponent {
	visibleSelect?: boolean;
	selected: EventEmitter<any>;
	select(): void;
	selectable(): boolean;
}

//
// コンポーネントサービス
//


/**
 * 一覧コンポーネントサービスインタフェース
 */
export interface EIMListComponentService<T> {
	initialize(info: EIMListComponentInfo<T>, serviceParam?: any, initialized?: EventEmitter<T>, selected?: EventEmitter<T>): void;
	setData(info: EIMListComponentInfo<T>, data: T[], change?: EventEmitter<any>): void;
	select(info: EIMListComponentInfo<T>, selectedData: T[], selected?: EventEmitter<T>): void;
}

/**
 * 階層コンポーネントサービスインタフェース
 */
export interface EIMHierarchicalComponentService<T> extends EIMListComponentService<T> {
	setChildren(info: EIMListComponentInfo<T>, selectedData: T, children: T[]): void;
}

/**
 * 詳細コンポーネントサービスインタフェース
 */
export interface EIMDetailComponentService<T> {
	setData(info: EIMDetailComponentInfo<T>, data: T): void;
}

//
// コンポーネント情報
//
/**
 * コンポーネント情報インタフェース
 */
export interface EIMComponentInfo {
	// ダミーパラメータ
	dummy?: any;
}

/**
 * 一覧コンポーネント情報インタフェース
 */
export interface EIMListComponentInfo<T> {
	data?: T[];
	hitCount?: number;
	selectedData?: T[];
	errored?: EventEmitter<any>;
	equals?: (a: any, b: any) => boolean;
}

/**
 * 詳細コンポーネント情報インタフェース
 */
export interface EIMDetailComponentInfo<T> {
	selectedData: T;
}

/**
 * 選択コンポーネント情報インタフェース
 */
export interface EIMSelectorComponentInfo<T> {
	data?: T[];
	selectedData?: T[];
}

//
// ドメイン
//
/**
 * 階層構造ドメインインタフェース
 * 
 */
export interface EIMHierarchicalDomain {
	children?: EIMHierarchicalDomain[];
	parent?: EIMHierarchicalDomain;
}

/**
 * 階層構造ドメインインタフェース
 */
export interface EIMBaseTreeNode {
	dto?: any,
	childTreeNodes?: EIMBaseTreeNode[],
}

/**
 * コンポーネント使用時の階層構造ドメインインタフェース
 */
export interface EIMComponentTreeNode extends EIMBaseTreeNode {
	childTreeNodes?: EIMComponentTreeNode[],
	treeNodeId: string, // リンクも表示する場合は"<オブジェクトID>_<リレーションID>"等、必ず一意にしてください
	leaf?: boolean,
	expanded?: boolean,
	parentTreeNode?: EIMComponentTreeNode,
	options?: any
}