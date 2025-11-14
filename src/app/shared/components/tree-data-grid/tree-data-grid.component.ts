import { Component, EventEmitter, Input, Output, OnInit, ElementRef, DoCheck, SimpleChanges, OnChanges } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { TreeNode } from 'primeng/api';

import { EIMHierarchicalComponent, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeDataGridComponentService, EIMTreeDataGridNode } from './tree-data-grid.component.service';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';


/** ツリーデータグリッドカラム */
export interface EIMTreeDataGridColumn {
	field?: string;
	// tooltipField?: string;
	headerName: string;
	cellStyle?: any;
	width?: number;
	// valueGetter?: (any) => string;
	// valueFormatter?: (any) => string;
	// onCellClicked?: (any) => void;
	icon?: string;
	headerStyle?: any;
  tooltip?: boolean;
}

/**
 * ツリーデータグリッドコンポーネント
 * @import
 *    import { EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.module';
 * @example
 *
 *      <eim-tree-data-grid
 *          [componentService]="componentService"
 *          [(data)]="data"
 *          [(selectedData)]="selectedData"
 *          [contextMenuItems]="contextMenuItems"
 *          [enableOpenOnSelect]="false"
 *          [multiple]="false"
 *          [rowDeselection]="false"
 *          (initialized)="onInitialized($event)"
 *          (selected)="onSelected($event)"
 *          (expanded)="onExpanded($event)"
 *          (contextmenu)="onContextmenu($event)"
 *          (errored)="onErrored($event)">
 *      </eim-tree-data-grid>
 */
@Component({
    selector: 'eim-tree-data-grid',
    templateUrl: './tree-data-grid.component.html',
    styleUrls: ['./tree-data-grid.component.css'],
    providers: [],
    standalone: false
})
export class EIMTreeDataGridComponent implements OnInit, OnChanges, DoCheck, EIMHierarchicalComponent<EIMTreeDataGridNode> {

	/** コンポーネントサービス */
	@Input()
		public componentService: EIMTreeDataGridComponentService;

	/** 第1階層のノード情報配列 */
	@Input()
		public data: EIMTreeDataGridNode[];

	/** 選択ノード */
	@Input()
		public selectedData: EIMTreeDataGridNode[];

	/** コンテキストメニュー */
		public contextMenu;

	/** コンテキストメニューアイテム */
	@Input()
		public contextMenuItems: MenuItem[];

	/** ノード選択時にノードを開くかどうか */
	@Input()
		public enableOpenOnSelect = false;

	/** 複数行選択可フラグ */
	@Input()
		public multiple = false;

	/** 行選択解除可否フラグ */
	@Input()
		public rowDeselection = false;

	/** 初期化イベントエミッタ */
	@Output()
		public initialized: EventEmitter<EIMTreeDataGridNode[]> = new EventEmitter<EIMTreeDataGridNode[]>();

	/** ノード選択イベントエミッタ */
	@Output()
		public selected: EventEmitter<any> = new EventEmitter<any>();

	/** ノード選択解除イベントエミッタ */
	@Output()
		public unSelected: EventEmitter<any> = new EventEmitter<any>();

	/** ノード展開イベントエミッタ */
	@Output()
		public expanded: EventEmitter<EIMTreeDataGridNode[]> = new EventEmitter<EIMTreeDataGridNode[]>();

	/** 右クリックイベントエミッタ */
	@Output()
		public contextmenu: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラーイベントエミッタ */
	@Output()
		public errored: EventEmitter<any> = new EventEmitter<any>();

	/** コンポーネント情報 */
	public info: EIMListComponentInfo<EIMTreeDataGridNode>;

	/** ツリーデータグリッドカラム */
	public treeDataGridColumns: EIMTreeDataGridColumn[];

	/** 行の高さ */
	public rowHeight = 19;

	/** コンテキストメニュー要素のDiffer情報 */
	private menuInfo: EIMMenuChangeDetectionServiceInfo;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected treeDataGridComponentService: EIMTreeDataGridComponentService,
		protected el: ElementRef,
		protected menuChangeDetectionService: EIMMenuChangeDetectionService,
		) {
		if (!this.componentService) {
			this.componentService = treeDataGridComponentService;
		}

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * データリストを初期化します.
	 */
	public initialize(serviceParam: any = {}, isEmitEvent = true): void {
		this.info = {
				data: (this.data === undefined) ? [] : this.data,
				selectedData: (this.selectedData === undefined) ? [] : this.selectedData
		};

		if (!this.info.errored) {
			this.info.errored = this.errored;
		}

		if (isEmitEvent) {
			this.componentService.initialize(this.info, serviceParam, this.initialized, this.selected);
		} else {
			this.componentService.initialize(this.info, serviceParam);
		}
	}

	/**
	 * カラムをセットします.
	 * @param columns セットするカラム
	 */
	public setColumns(columns: EIMTreeDataGridColumn[]): void {
		for (let i = 0; i < columns.length; i++) {
			let column: EIMTreeDataGridColumn = columns[i];

			if (i === 0 && !column.icon) {
				// 先頭カラムはアイコンありにしないと改行されてしまう。
				column.icon = 'dummy';
			}

			// セルスタイル設定
			let cellStyle: any = column.cellStyle ? column.cellStyle : {};
			cellStyle.height = this.rowHeight + 'px';
			column.cellStyle = cellStyle;

			// ヘッダスタイル設定
			let headerStyle: any = column.headerStyle ? column.headerStyle : {};
			headerStyle.width = column.width + 'px';
			column.headerStyle = headerStyle;

		}
		this.treeDataGridColumns = columns;
	}

	/**
	 * ノード情報を設定します.
	 * @param data 第1階層のノード配列
	 */
	public setData(data: EIMTreeDataGridNode[]): void {
		let method = (node: EIMTreeDataGridNode) => {
			if (node.children) {
				for (let i = 0; i < node.children.length; i++) {
					node.children[i]['hierarchy'] = node['hierarchy'] + 1;
					node.children[i]['hierarchyStyle'] = '(1em * ' + node.children[i]['hierarchy'] + ') + 3px';
					method(node.children[i]);
				}
			}
		}

		for (let i = 0; i < data.length; i++) {
			data[i]['hierarchy'] = 1;
			data[i]['hierarchyStyle'] = '(1em * ' + data[i]['hierarchy'] + ') + 3px';
			method(data[i]);
		}

		this.componentService.setData(this.info, data);
	}

	/**
	 * ノード情報を返却します.
	 * @return ノード情報
	 */
	public getData(): EIMTreeDataGridNode[] {
		return this.info.data;
	}

	/**
	 * ノードを選択します.
	 */
	public select(selectedData: EIMTreeDataGridNode[], isEmitEvent = true): void {
		if (isEmitEvent) {
			this.componentService.select(this.info, selectedData, this.selected, {multiple: this.multiple});
		} else {
			this.componentService.select(this.info, selectedData, null, {multiple: this.multiple});
		}
	}

	/**
	 * 選択ノードを返却します.
	 * @return 選択ノード
	 */
	public getSelectedData(): EIMTreeDataGridNode[] {
		if (this.multiple) {
			// 複数選択可能な場合
			return this.info.selectedData;
		} else {
			// 複数選択不可能な場合
			if (this.info.selectedData && Array.isArray(this.info.selectedData)) {
				// 未バインド時
				return this.info.selectedData;
			} else if (this.info.selectedData) {
				// バインド時
				return [this.info.selectedData as any];
			} else {
				return [];
			}
		}
	}

	/**
	 * 親ノードに子ノードを設定します.
	 * 親ノード、子ノードが空の場合は、何もしません.
	 * 親ノードが空の場合は、ルートに設定します.
	 * 子ノードが空の場合は、親ノードをリーフノードに変更します.
	 * @param parentNode 親ノード
	 * @param childNodes 子ノード配列
	 */
	public setChildren(parentNode: EIMTreeDataGridNode, childNodes: EIMTreeDataGridNode[]): void {
		this.componentService.setChildren(this.info, parentNode, childNodes);

		this.info.data = this.info.data.concat();

		this.select([parentNode]);
	}

	/**
	 * ノードを全展開します.
	 */
	public expandAll(): void {
		this.info.data.forEach( (node: any) => {
			this.expandRecursive(node, true);
		});
		let selectedData = null;
		if (this.multiple) {
			selectedData = this.info.selectedData;
		} else {
			selectedData = [this.info.selectedData];
		}
		this.setData(Object.assign([], this.info.data));
		this.select(selectedData, false);
	}

	/**
	 * ノードを全縮小します.
	 */
	public collapseAll(): void {
		this.info.data.forEach( (node: any) => {
			this.expandRecursive(node, false);
		});
		let selectedData = null;
		if (this.multiple) {
			selectedData = this.info.selectedData;
		} else {
			selectedData = [this.info.selectedData];
		}

		this.setData(Object.assign([], this.info.data));
		this.select(selectedData, false);
	}

	/**
	 * ツリーの状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}

		// 復元します
		this.setData(state.data);
		if (state.selectedData && state.selectedData.length > 0) {
			this.select(state.selectedData, false);
		}

		window.setTimeout(() => {
			this.setScrollTop(state.offsetTop);
		});

	}

	/**
	 * ツリーの状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			data: this.getData(),
			selectedData: this.getSelectedData(),
			offsetTop: this.getScrollTop()
		}
	}

	/**
	 * スクロール位置を設定します.
	 * @param targetNode ノード
	 */
	public ensureIndexVisible(targetNode: EIMTreeDataGridNode): void {

		let info: any = {
			count: 0,
			targetIndex: -1,
			targetNode: targetNode
		};

		let countFunc: (node: EIMTreeDataGridNode, info: any) => void = (node: EIMTreeDataGridNode, _info: any): void => {
			_info.count++;

			if (this.componentService.defaultEquals(node, _info.targetNode)) {
				_info.targetIndex = _info.count;
			}

			if ( node.children && node.children.length > 0 && node.expanded) {
				for (let i = 0; i < node.children.length; i++) {
					countFunc(node.children[i], _info);
				}
			}
		}

		for (let i = 0; i < this.info.data.length; i++) {
			let workspaceTreeNode: EIMTreeDataGridNode = this.info.data[i];
			countFunc(workspaceTreeNode, info);
		}

		let element = this.getScrollTargetElement();
		if (element) {
			// 選択行のインデックス番号/全体件数で割合を求める
			let ratio: number = (info.targetIndex - 1) / info.count;
			// ツリー表示領域の高さ*割合でスクロール位置を求める
			let scrollPos: number = element.scrollHeight * ratio;

			// スクロール位置を設定する
			window.setTimeout(() => {
				this.setScrollTop(scrollPos);
			});
		}
	}

	/**
	 * 縦スクロール位置を返却します.
	 * @return 縦スクロール位置
	 */
	public getScrollTop(): number {
		let element = this.getScrollTargetElement();
		if (!element) {
			return 0;
		}
		return element.scrollTop;
	}

	/**
	 * 縦スクロール位置を設定します.
	 * @param scrollTop 縦スクロール位置
	 */
	public setScrollTop(scrollTop: number): void {
		let element = this.getScrollTargetElement();
		if (element) {
			element.scrollTop = scrollTop;
		}
	}

	/**
	 * ノードを追加します.
	 * @param parentNode 親ノード
	 * @param nodes 追加するノード
	 */
	public addNode(parentNode: EIMTreeDataGridNode, nodes: EIMTreeDataGridNode[]): void {
		this.componentService.addNode(this.info, parentNode, nodes);
	}

	/**
	 * ノードを削除します.
	 * @param nodes 削除するノード
	 */
	public deleteNode(nodes: EIMTreeDataGridNode[]): void {
		this.componentService.deleteNode(this.info, nodes);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		this.initialize();
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (this.contextMenuItems) {
			this.menuInfo = this.menuChangeDetectionService.createDifferInfo(this.contextMenuItems);
		}
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	 ngDoCheck(): void {
		if (!this.menuInfo) {
			return;
		}

		// メニューの変更アリなら再描画
		if (this.menuChangeDetectionService.isChanged(this.menuInfo, this.contextMenuItems)) {
			this.contextMenuItems = this.contextMenuItems.filter(item => item);
		}
	}

	/**
	 * ノード選択時の処理です.
	 */
	public onSelect(node: EIMTreeDataGridNode, event?: MouseEvent): void {

		// シフト押下時、IEのみ不正な選択範囲が生じるので解除処理を行う
		if (event.shiftKey) {
			let selections: Selection = window.getSelection();
			selections.removeAllRanges();
		}

		// イベント発生日時
		let eventDateTime: Date = new Date();

		if (this.enableOpenOnSelect) {
			if (!node.expanded && node.children.length > 0) {
				node.expanded = true;
			} /* else if (node.expanded) {
				node.expanded = false;
			}*/

		}
		if (this.componentService.canSelect(node)) {
			this.selected.emit({selectedData: [node], eventDateTime: eventDateTime});
		} else {
			// 参照を切らずに配列をクリアする
			if (this.multiple) {
				let index = this.info.selectedData.indexOf(node);
				if (index !== -1) {
					this.info.selectedData.splice(index, 1);
				}
			} else {
				this.info.selectedData = null;
			}
			this.selected.emit({selectedData: [], eventDateTime: eventDateTime});
		}
	}

	/**
	 * ノード選択解除時の処理です.
	 * @param node ノード
	 * @param event イベント
	 */
	public onUnselect(node: EIMTreeDataGridNode, event?: MouseEvent): void {
		event.preventDefault();

		if (this.rowDeselection) {
			this.unSelected.emit({selectedData: node});
		} else {
			window.setTimeout(() => {
				// 再選択する
				if (this.multiple) {
					let index = this.info.selectedData.indexOf(node);
					if (index !== -1) {
						this.info.selectedData.splice(index, 1);
					}
					this.info.selectedData.push(node);
				} else {
					(this.info.selectedData as any) = node;
				}
			});
		}
	}

	/**
	 * ノード展開時の処理です.
	 */
	public onExpand(node: EIMTreeDataGridNode): void {
		this.expanded.emit([node]);
	}

	/**
	 * 右クリックイベントハンドラ.
	 * @param event マウスイベント
	 */
	public onContextMenu(event: MouseEvent): void {
		if (this.contextMenuItems && this.contextMenuItems.length > 0) {
			event.preventDefault();
			event.stopPropagation();
			this.contextmenu.emit([]);
		}
	}

	/**
	 * ノード右クリック選択時の処理です.
	 * ノードを右クリックした場合、onNodeContextMenuSelect()⇒onContextMenu()の順で呼び出される.
	 * 何もない箇所をクリックした場合、onContextMenu()が呼び出される.
	 */
	public onNodeContextMenuSelect(event: any): void {
		// 本イベントハンドラの後、右クリックイベントハンドラが呼び出されるのでキャンセルする
		event.originalEvent.preventDefault();
		event.originalEvent.stopPropagation();

		let node: EIMTreeDataGridNode = event.node;
		this.selected.emit({selectedData: [node], eventDateTime: new Date()});
		this.contextmenu.emit([node]);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 指定ノード配下を再帰的に開閉します.
	 * @param node ノード
	 * @param isExpand ノードを開くか、閉じるか
	 */
	private expandRecursive(node: TreeNode, isExpand: boolean): void {
		node.expanded = isExpand;
		if (node.children) {
			node.children.forEach( childNode => {
				this.expandRecursive(childNode, isExpand);
			});
		}
	}

	/**
	 * ノードの階層数からインデントスタイルを生成します.
	 * @param node 対象ノード
	 * @return インデントスタイル
	 */
	private getHierarchy(node: EIMTreeDataGridNode): number {
		let hierarchy = 0;

		let method = (node: EIMTreeDataGridNode): number => {
			hierarchy++;
			if (node.parent) {
				return method(node.parent);
			} else {
				return hierarchy;
			}
		}
		method(node);
		return hierarchy;
	}

	/**
	 * スクロールターゲットのエレメントを返却します.
	 * @return スクロールターゲットのエレメント
	 */
	private getScrollTargetElement(): any {
		let elements = this.el.nativeElement.getElementsByClassName('p-treetable-scrollable-body');
		return elements.length ? elements[0] : null;
	}
}
