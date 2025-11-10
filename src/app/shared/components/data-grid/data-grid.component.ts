import { EIMDefaultRendererComponent } from '../renderer/default-renderer.component';
import { Component, Input, OnInit, ViewChild, EventEmitter, Output, HostListener, OnDestroy, LOCALE_ID, Injector, DoCheck, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef, Column, GridApi, GridReadyEvent, IRowNode, RowClassParams, RowNode, RowSelectionOptions, ValueGetterParams } from 'ag-grid-community';
import { EIMHeaderComponent } from 'app/shared/components/header/header.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { escapePath, getProperty } from 'dot-prop';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMComponentTreeNode, EIMListComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from './data-grid.component.service';
import { EIMLargeTextRendererComponent } from 'app/shared/components/renderer/large-text-renderer.component';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';
import { EIMTreeFormatResultDTO } from 'app/shared/dtos/tree-format-result.dto';
import { EIMTreeFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/tree-format-result-dto-to-tree-nodes-converter.service';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMListFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/list-format-result-dto-to-tree-nodes-converter.service';

let clientWidth = 0;

/** データグリッドカラムタイプ */
export enum EIMDataGridColumnType {
	text,
	number,
	date,
	dateTime,
	largeText,
	object,
	user,
	code
}

/** データグリッドオプション（フラットビュー用） */
export interface EIMDataGridOptionsForFlatView {

	/** ツリー表示するかどうか */
	enableTreeView: boolean;

	/** コンポーネントサービス */
	componentService?: EIMDataGridComponentService;

	/** コンテキストメニューアイテム */
	contextMenuItems?: MenuItem[];

	/** 同一行判定関数 */
	equals?: (a: any, b: any) => boolean;

	/** 複数行選択可フラグ */
	multiple?: boolean;

	/** クリック編集可フラグ */
	suppressClickEdit?: boolean;

	/** 水平スクロール無効化フラグ */
	suppressHorizontalScroll?: boolean;

	/** ヘッダの高さ */
	headerHeight?: number;

	/** 行の高さ */
	rowHeight?: number;

	/** 行のスタイル */
	rowStyle?: string;

	/** 行のクラス */
	rowClass?: string | string[];

	/** 行のクラス返却関数 */
	rowClassFunction?: (dto: any) => string;

	/** チェックボックス表示フラグ */
	enableCheckbox?: boolean;
}

/** データグリッドオプション（ツリービュー用） */
export interface EIMDataGridOptionsForTreeView extends EIMDataGridOptionsForFlatView {
	setAdditionalPropertiesToTreeNodeFunction: (treeNode: EIMDataGridTreeNode, dto: any) => EIMDataGridTreeNode;
	setAdditionalTreeNodeRelationFunction?: (parentTreeNode: EIMDataGridTreeNode, childTreeNodes: EIMDataGridTreeNode[]) => void
}

/** データグリッドカラム */
export interface EIMDataGridColumn {
	headerName: string;
	field?: string;
	fieldPath?: string[];
	tooltipField?: string;
	tooltipFieldPath?: string[];
	cellStyle?: any;
	width?: number;
	cellRenderer?: any;
	cellRendererFramework?: any;
	cellEditorFramework?: any;
	valueGetter?: (any) => string;
	valueFormatter?: (any) => string;
	onCellClicked?: (any) => void;
	type?: EIMDataGridColumnType;
	editable?: any;
	headerClass?: string;
	/** 
	 * @deprecated AgGridのバージョンアップにより使用不可。代わりにenableCheckboxを使用すること。
	 */
	checkboxSelection?: boolean;
	suppressSorting?: boolean;
	suppressFilter?: boolean;
	suppressResize?: boolean;
	suppressMovable?: boolean;
	filter?: string;
	filterParams?: any;
	sort?: 'asc' | 'desc';
	cellRendererParams?: any;
	cellEditorParams?: any;
	param?: any;
	comparator?: (valueA: any, valueB: any, nodeA?: RowNode, nodeB?: RowNode, isInverted?: boolean) => number;
	comparators?: ((valueA: any, valueB: any, nodeA?: RowNode, nodeB?: RowNode, isInverted?: boolean) => number)[];
	pinned?: boolean | 'left' | 'right';
	lockPinned?: boolean;
}
/** データグリッドカラムグループ */
export interface EIMDataGridColumnGroup {
    headerName: string;
    children?: (EIMDataGridColumn | EIMDataGridColumnGroup)[];
}

/** データグリッドツリーノード情報 */
export interface EIMDataGridTreeNode extends EIMComponentTreeNode {
	// treeNodeId: string, // リンクも表示する場合は"<オブジェクトID>_<リレーションID>"等、必ず一意にしてください
	// dto: any,
	// leaf?: boolean,
	// expanded?: boolean,
	parentTreeNode?: EIMDataGridTreeNode,
	childTreeNodes?: EIMDataGridTreeNode[],
}

/**
 * データグリッドコンポーネント
 * @example
 *
 *      <eim-data-grid
 *          componentService="componentService"
 *          contextMenuItems="contextMenuItems"
 *          equals="equals"
 *          multiple="multiple"
 *          suppressClickEdit="suppressClickEdit"
 *          suppressHorizontalScroll="suppressHorizontalScroll"
 *          headerHeight="25"
 *          rowStyle=""
 *          initialized="initialized"
 *          selected="selected"
 *          changed="changed"
 *          contextmenu="contextmenu"
 *          cellEditingStarted="cellEditingStarted"
 *          cellEditingStopped="cellEditingStopped"
 *          selectedRowCellClicked="selectedRowCellClicked"
 *          rowDoubleClicked="rowDoubleClicked"
 *          errored="errored"
 *          onNodeSelect="onNodeSelect"
 *          showRowMoveButton="showRowMoveButton"
 *          showAllSelectButton="showAllSelectButton"
 * 			accordionActiveIndex="accordionActiveIndex"
 *      >
 *      </eim-data-grid>
 */
@Component({
    selector: 'eim-data-grid',
    templateUrl: './data-grid.component.html',
    styleUrls: ['./data-grid.component.css'],
    providers: [DecimalPipe],
    standalone: false
})
export class EIMDataGridComponent implements OnInit, OnChanges, DoCheck, OnDestroy, EIMListComponent<any> {

	@ViewChild('contextMenu') contextMenu: ContextMenu;
	@ViewChild('grid') grid: AgGridAngular;
	@ViewChild('header') header: EIMHeaderComponent;
	@ViewChild('gridContainer') gridContainer: ElementRef;

	/** コンポーネントサービス */
	@Input()
		public componentService: EIMDataGridComponentService;

	/** コンテキストメニューアイテム */
	@Input()
		public contextMenuItems: MenuItem[];

	/** 同一行判定関数 */
	@Input()
		public equals: (a: any, b: any) => boolean = this.dataGridComponentService.defaultEquals;

	/** 複数行選択可フラグ */
	@Input()
		public multiple = true;

	/** 選択詳細の表示フラグ */
	@Input()
	public showSeletDetail = true;

	/** クリック編集可フラグ */
	@Input()
		public suppressClickEdit = false;

	/** 水平スクロール無効化フラグ */
	@Input()
		public suppressHorizontalScroll = false;

	/** ヘッダの高さ */
	@Input()
		public headerHeight = 26 - 1; // ボーダー幅分マイナスする

	/** 行の高さ */
	@Input()
		public rowHeight = 26;

	/** 行のスタイル */
	@Input()
		public rowStyle: any;

	@Input() 
		accordionActiveIndex: number;

	/** 行のクラス */
	@Input()
		public rowClass: string | string[];

	/** ツリー表示するかどうか */
	@Input()
	public enableTreeView = false;

	/** ツリーノードに対して追加でプロパティ設定する関数 */
	@Input()
	public setAdditionalPropertiesToTreeNodeFunction: (treeNode: EIMDataGridTreeNode, dto: any) => EIMDataGridTreeNode;

	/** ツリーノードの親子間の関連設定関数 */
	@Input()
	public setAdditionalTreeNodeRelationFunction:
			(parentTreeNode: EIMDataGridTreeNode, childTreeNodes: EIMDataGridTreeNode[]) => void;

	/** 行のスタイルクラス設定関数 */
	@Input()
	public rowClassFunction: (dto: any) => string = null;

	/** チェックボックス表示フラグ */
	@Input()
	public enableCheckbox = false;

	/** オプション設定 */
	@Input()
	public options: EIMDataGridOptionsForFlatView | EIMDataGridOptionsForTreeView;

	/** 初期化イベントエミッタ */
	@Output()
		public initialized: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 行選択イベントエミッタ */
	@Output()
		public selected: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 行選択変更イベントエミッタ */
	@Output()
		public changed: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 右クリックイベントエミッタ */
	@Output()
		public contextmenu: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** セル編集開始イベントエミッタ */
	@Output()
		public cellEditingStarted: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** セル編集完了イベントエミッタ */
	@Output()
		public cellEditingStopped: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 選択行のセルクリックイベントエミッタ */
	@Output()
		public selectedRowCellClicked: EventEmitter<any> = new EventEmitter<any>();

	/** 行ダブルクリックイベントエミッタ doubleClickedを使用してください@deprecated */
	@Output()
		public rowDoubleClicked: EventEmitter<any> = new EventEmitter<any>();

	/** グリッド準備完了イベントエミッタ */
	@Output()
		public gridReady: EventEmitter<any> = new EventEmitter<any>();

	/** ソートチェンジイベントエミッタ */
	@Output()
		public sortChanged: EventEmitter<any> = new EventEmitter<any>();

	/** フィルターチェンジイベントエミッタ */
	@Output()
		public filterChanged: EventEmitter<any> = new EventEmitter<any>();

	/** カラムサイズ変更イベントエミッタ */
	@Output()
		public columnResized: EventEmitter<any> = new EventEmitter<any>();

	/** カラム移動イベントエミッタ */
	@Output()
		public columnMoved: EventEmitter<any> = new EventEmitter<any>();

	/** エラーイベントエミッタ */
	@Output()
		public errored: EventEmitter<any> = new EventEmitter<any>();

	@Output('onNodeSelect')
		onNodeSelect: EventEmitter<any> = new EventEmitter<any>();

	/** 行ダブルクリックイベントエミッタ */
	@Output()
	public doubleClicked: EventEmitter<{
		event: any,
		data: any,
	}> = new EventEmitter();

	/** ツリー開閉イベントエミッタ */
	@Output()
	public expanded: EventEmitter<{
		expanded: boolean,
		expandedData: EIMDataGridTreeNode,
		eventDateTime: Date
	}> = new EventEmitter();

	/** 行移動ボタン表示フラグ */
	@Input()
		public showRowMoveButton: boolean;

	/** すべて選択・すべて解除ボタン表示フラグ */
	@Input()
		public showAllSelectButton = true;
	
	/** データグリッドコンポーネント情報 */
	public info: EIMDataGridComponentInfo;

	/** 右クリックメニュー表示フラグ */
	public showContextMenu: boolean;

	/** クリックしたデータ */
	private clickedData: any;

  	/** ロケール */
  	private locale: string;

	/** カラム設定 */
	private columns: EIMDataGridColumn[];

	/** 複数選択時選択対象開始セル */
	private startColumn: Element = null;

	/** コンテキストメニュー要素のDiffer情報 */
	private menuInfo: EIMMenuChangeDetectionServiceInfo;

	/** ルートのツリーノードのリスト */
	private treeNodes: EIMDataGridTreeNode[] = null;

	/** treeNodeIdとtreeNodeのマップ */
	private treeNodeMap: Map<string, EIMDataGridTreeNode> = null;

	/** 最後にvalueGetterの対象となったカラムを退避 */
	private lastColumnUsedByValueGetter: Column = null;
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		private dataGridComponentService: EIMDataGridComponentService,
		private dateService: EIMDateService,
		private injector: Injector,
		private localStorageService: EIMLocalStorageService,
		private menuChangeDetectionService: EIMMenuChangeDetectionService,
		private listFormatResultDTOToTreeNodesConverterService: EIMListFormatResultDTOToTreeNodesConverterService<EIMDataGridTreeNode>,
		private treeFormatResultDTOToTreeNodesConverterService: EIMTreeFormatResultDTOToTreeNodesConverterService<EIMDataGridTreeNode>,
		private treeNodeService: EIMTreeNodeService

	) {
		if (!this.componentService) {
			this.componentService = dataGridComponentService;
		}
		this.info = {
			data: undefined,
			selectedData: [],
			canEmitChangeEvent: true,
			equals: this.dataGridComponentService.defaultEquals,
			rowCount: 0,
			hitCount: 0,
			selectedRowCount: 0,
			pendingActions: []
		};

		this.info.gridOptions = {
				// セルレンダラーから利用する場合もあるのでcontextにグリッド自身を格納する
				context: this,
		};

		this.info.errored = this.errored;

		this.locale = this.injector.get(LOCALE_ID);
	}

	 onGridSizeChanged(params){
	 	clientWidth = params.clientWidth;

	 }

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param serviceParam パラメータ
	 * @param isEmitEvent イベントエミットフラグ(true:エミットする、false:エミットしない)
	 */
	public initialize(serviceParam: any = {}, isEmitEvent = true): void {

		if (!this.componentService) {
			return;
		}
		if (isEmitEvent) {
			this.componentService.initialize(this.info, serviceParam, this.initialized, this.selected);
		} else {
			this.componentService.initialize(this.info, serviceParam);
		}
	}
	
	/**
	 * 行を設定します.
	 * @param data セットする行データ
	 */
	public setData(data: any[]): void {

		let inputData = null;
		// ツリー表示の場合は各ツリーノードの開閉により設定するデータを決定する
		if (this.enableTreeView) {

			// dataとしてツリーノードが指定されていることをチェック
			for (let i = 0; i < data.length; i++) {
				if (typeof data[0] === 'undefined') {
					throw Error('must be EIMDataGridTreeNode');
				}
			}

			this.treeNodes = data;
			this.initializeTreeNodeMap(this.treeNodes);
			inputData = this.getDisplayTreeNodes(this.treeNodes);
		}
		else {
			inputData = data;
		}

		this.startColumn = null;
		this.componentService.setData(this.info, inputData);
	}

	/**
	 * 行データを返却します.ツリー表示の場合はルートのツリーノードリストを返却します.
	 * @return 行データ
	 */
	public getData(): any[] {
		const rowData: any[] = this.componentService.getData(this.info);
		// 下の入れるとサムネイルにも貼り付け結果を反映できる（削除は反映できなそう）
		// this.info.data = rowData;

		if (!rowData) {
			return [];
		}
		if (this.enableTreeView === false) {
			return rowData;
		}

		let treeNodes = [];
		for (let i = 0; i < rowData.length; i++) {
			const treeNode: EIMDataGridTreeNode = rowData[i];
			if (treeNode.parentTreeNode === null) {
				treeNodes.push(treeNode);
			}
		}
		return treeNodes;
	}

	/**
	 * リスト形式の簡易結果DTOをツリーのルートに設定します.
	 * @param listFormatResult リスト形式の簡易結果DTO
	 */
	public setListFormatResult(
		listFormatResult: EIMListFormatResultDTO) {

		// フラット表示の場合
		if (this.enableTreeView === false) {

			this.setData(listFormatResult.dtos);
		}
		// ツリー表示の場合
		else {
			const treeNodes = this.listFormatResultDTOToTreeNodesConverterService.convert(
					listFormatResult, this.convertDTOToTreeNode.bind(this));

			this.setData(treeNodes);
		}
	}

	/**
	 * ツリー形式の簡易結果DTOをツリーのルートに設定します.
	 *
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 */
	public setTreeFormatResult(
			treeFormatResult: EIMTreeFormatResultDTO): void {

		this.noSupportFlatView();

		const treeNodes = this.treeFormatResultDTOToTreeNodesConverterService.convert(
				treeFormatResult, this.convertDTOToTreeNode.bind(this), this.setTreeNodeRelation.bind(this));

		this.setData(treeNodes);
	}

	/**
	 * ツリー形式の簡易結果DTOをツリーの階層に設定します.<br>
	 * treeFormatResultの1階層目のノードと同じノードに対して子階層を設定します.
	 *
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 */
	public setChildTreeFormatResult(
			treeFormatResult: EIMTreeFormatResultDTO): void {

		this.noSupportFlatView();

		// treeFormatResultの全階層のdtoをEIMDataGridTreeNode形式に変換
		const _parentTreeNodes = this.treeFormatResultDTOToTreeNodesConverterService.convert(
				treeFormatResult, this.convertDTOToTreeNode.bind(this), this.setTreeNodeRelation.bind(this));
		if (_parentTreeNodes === null || _parentTreeNodes.length === 0) {
			return;
		}

		for (const _parentTreeNode of _parentTreeNodes) {

			const parentTreeNode = this.getTreeNodeByTreeNodeId(_parentTreeNode.treeNodeId);
			// 子階層は消去
			if (parentTreeNode.childTreeNodes) {
				this.removeTreeNodes(parentTreeNode.childTreeNodes);
			}
			// this.removeDisplayChildTreeNodes(parentTreeNode);
			this.setChildTreeNodesToIndex(parentTreeNode, _parentTreeNode.childTreeNodes);

		}
		this.refreshRowsByTreeNodes(_parentTreeNodes);

	}

	/**
	 * DTOをツリーコンポーネント用のツリーノードに変換します.
	 * 
	 * @param dto DTO
	 * @return ツリーコンポーネント用のツリーノード
	 */
	public convertDTOToTreeNode(dto: any): EIMDataGridTreeNode {

		const treeNode: EIMDataGridTreeNode = {
			treeNodeId: '' + dto.id,
			dto: dto,
			leaf: false,
			expanded: false,
			parentTreeNode: null,
			childTreeNodes: null,
			options: null
		};

		if (!this.setAdditionalPropertiesToTreeNodeFunction) {
			return treeNode;
		}

		return this.setAdditionalPropertiesToTreeNodeFunction(treeNode, dto);
	}

	/**
	 * 親子の関係を設定します.
	 *
	 * @param parentTreeNode 親のツリーノード
	 * @param childTreeNodes 子のツリーノードリスト
	 */
	public setTreeNodeRelation(parentTreeNode: EIMDataGridTreeNode, childTreeNodes: EIMDataGridTreeNode[]): void {

		if (parentTreeNode != null) {
			parentTreeNode.childTreeNodes = childTreeNodes;

			// 末端かどうかわからない状態
			if (childTreeNodes === null) {
				parentTreeNode.leaf = false;
				parentTreeNode.expanded = false;

			} else {

				// 末端の場合
				if (childTreeNodes.length === 0) {
					parentTreeNode.leaf = true;
				}
				// 末端ではない場合
				else {
					parentTreeNode.leaf = false;
					parentTreeNode.expanded = true;
				}
			}

		}

		if (childTreeNodes) {
			for (let childTreeNode of childTreeNodes) {
				childTreeNode.parentTreeNode = parentTreeNode;
			}
		}

		if (!this.setAdditionalTreeNodeRelationFunction) {
			return;
		}

		this.setAdditionalTreeNodeRelationFunction(parentTreeNode, childTreeNodes);
	}

	/**
	 * ツリーノードリストを指定位置に追加します.
	 *
	 * @param parentTreeNode 追加先の親ツリーノード(ルートの場合はnullを指定)
	 * @param childTreeNodes 追加するツリーノードリスト
	 * @param indexInParentTreeNodes 親ツリーノードでのインデックス（画面表示上のインデックス。先頭に追加する場合は0、末尾に追加する場合は未指定あるいは-1を指定）
	 */
	public setChildTreeNodesToIndex(_parentTreeNode: EIMDataGridTreeNode, _childTreeNodes: EIMDataGridTreeNode[], indexInParentTreeNodes = -1): void {

		this.noSupportFlatView();

		this.setToTreeNodeMap(_childTreeNodes);

		if (_childTreeNodes === null) {
			return;
		}

		// 追加するツリーノードリストの子階層を初期化
		for (let i = 0; i < _childTreeNodes.length; i++) {
			this.setTreeNodeRelation(_childTreeNodes[i], _childTreeNodes[i].childTreeNodes);
		}

		let parentTreeNode = null;

		// 親と子をつなげる
		// ルートではない場合
		if (_parentTreeNode !== null) {
			parentTreeNode = this.getTreeNodeByTreeNodeId(_parentTreeNode.treeNodeId);

			// 子階層が存在しない場合
			if (parentTreeNode.childTreeNodes === null || parentTreeNode.childTreeNodes.length === 0) {

				this.setTreeNodeRelation(parentTreeNode, _childTreeNodes);

			}
			// 子階層が存在する場合
			else {

				let childTreeNodes: EIMDataGridTreeNode[] = [];
				for (let i = 0; i < parentTreeNode.childTreeNodes.length; i++) {
					if (i === indexInParentTreeNodes) {
						break;
					}
					childTreeNodes.push(parentTreeNode.childTreeNodes[i]);
				}
				// 指定箇所にツリーノードを追加する
				childTreeNodes = childTreeNodes.concat(_childTreeNodes);

				if (indexInParentTreeNodes !== -1) {
					for (let i = indexInParentTreeNodes; i < parentTreeNode.childTreeNodes.length; i++) {
						childTreeNodes.push(parentTreeNode.childTreeNodes[i]);
					}
				}

				this.setTreeNodeRelation(parentTreeNode, childTreeNodes);

			}
		}
		// ルートの場合
		else {

			let rootTreeNodes: EIMDataGridTreeNode[] = [];

			for (let i = 0; i < this.treeNodes.length; i++) {
				if (i === indexInParentTreeNodes) {
					break;
				}
				rootTreeNodes.push(this.treeNodes[i]);
			}
			// 指定箇所にツリーノードを追加する
			rootTreeNodes = rootTreeNodes.concat(_childTreeNodes);

			if (indexInParentTreeNodes !== -1) {
				for (let i = indexInParentTreeNodes; i < this.treeNodes.length; i++) {
					rootTreeNodes.push(this.treeNodes[i]);
				}
			}

			this.treeNodes = rootTreeNodes;
		}

		this.appendDisplayChildTreeNodes(parentTreeNode, _childTreeNodes);

	}

	/**
	 * 指定したツリーノードリストを更新します.
	 * @param treeNodes 更新するツリーノードリスト
	 */
	public updateTreeNodes(treeNodes: EIMDataGridTreeNode[]): void {

		for (let i = 0; i < treeNodes.length; i++) {

			// EIMDataGridTreeNode
			const treeTreeNode = this.getTreeNodeByTreeNodeId(treeNodes[i].treeNodeId);
			this.copyDataGridTreeNode(treeTreeNode, treeNodes[i]);

		}

		this.refreshRowsByTreeNodes(treeNodes);
	}

	/**
	 * 指定したツリーノードリストを削除します.
	 * @param treeNodes 削除するツリーノードリスト
	 */
	public removeTreeNodes(treeNodes: EIMDataGridTreeNode[]): void {

		this.noSupportFlatView();

		const deleteTreeNodes: EIMDataGridTreeNode[] = [];
		for (let i = 0; i < treeNodes.length; i++) {
			this.pushDeleteTreeNode(treeNodes[i], deleteTreeNodes);
		}

		if (deleteTreeNodes.length > 0) {
			this.info.gridApi.applyTransaction({ remove: deleteTreeNodes });
		}

		this.treeNodeService.removeTreeNodes(this.getData(), treeNodes);
		// 親子関係更新
		const parentTreeNodes: EIMDataGridTreeNode[] = [];
		for (let i = 0; i < deleteTreeNodes.length; i++) {
			const parentTreeNode = deleteTreeNodes[i].parentTreeNode;
			if (parentTreeNode) {
				this.setTreeNodeRelation(parentTreeNode, parentTreeNode.childTreeNodes);
				parentTreeNodes.push(parentTreeNode);
			}
		}

		this.refreshRowsByTreeNodes(parentTreeNodes);
	}

	/**
	 * 削除対象のツリーノードをプッシュします
	 * 
	 * @param node 削除するツリーノード
	 * @param deleteTreeNodes 削除対象のツリーノードを格納する配列
	 */
	private pushDeleteTreeNode(node: EIMDataGridTreeNode, deleteTreeNodes: EIMDataGridTreeNode[]): void {
		const targetTreeNode = this.getTreeNodeByTreeNodeId(node.treeNodeId);
		if (!targetTreeNode) {
			return;
		}
		deleteTreeNodes.push(targetTreeNode);
		if (targetTreeNode.childTreeNodes && targetTreeNode.childTreeNodes.length > 0) {
			targetTreeNode.childTreeNodes.forEach(childNode => this.pushDeleteTreeNode(childNode, deleteTreeNodes));
		}
	}

	/**
	 * 表示対象のツリーノードを上から順にリスト形式で返却します.
	 *
	 * @param treeNodes ルートのツリーノードリスト（未指定の場合は当データグリッドが保持しているルートのツリーノードを使用する）
	 * @returns 表示対象のツリーノードリスト
	 */
	public getDisplayTreeNodes(treeNodes: EIMDataGridTreeNode[] = null): EIMDataGridTreeNode[] {
		this.noSupportFlatView();

		if (!treeNodes) {
			treeNodes = this.getData();
		}
		return this.treeNodeService.getDisplayTreeNodes(treeNodes) as EIMDataGridTreeNode[];
	}

	/**
	 * 表示対象のツリーノードの内、フィルタ/ソート後のツリーノードを上から順にリスト形式で返却します.
	 * 
	 * @returns フィルタ/ソート後のツリーノードリスト
	 */
	public getDisplayTreeNodesAfterFilterAndSort(): EIMDataGridTreeNode[] {

		this.noSupportFlatView();

		const displayTreeNodes: EIMDataGridTreeNode[] = [];
		this.info.gridApi.forEachNodeAfterFilterAndSort( function (node) {
			displayTreeNodes.push(node.data);
		});

		return displayTreeNodes;
	}

	/**
	 * ツリーノードを開閉します.
	 *
	 * @param _treeNode 開閉対象のツリーノード
	 * @param expanded 開閉（展開する場合はtrue）
	 * @param isEmitEvent イベントエミットフラグ(true:エミットする、false:エミットしない)
	 */
	public expandTreeNode(_treeNode: EIMDataGridTreeNode, expanded: boolean, isEmitEvent = true): void {

		this.noSupportFlatView();

		let treeNode = this.treeNodeMap.get(_treeNode.treeNodeId);
		treeNode.expanded = expanded;

		// ツリーオープン時
		if (expanded) {

			// 子階層が初期化されている場合
			if (treeNode.childTreeNodes !== null) {
				this.appendDisplayChildTreeNodes(treeNode, treeNode.childTreeNodes);
			}
		}
		// ツリークローズ時
		else {
			this.removeDisplayChildTreeNodes(treeNode);
		}

		if (isEmitEvent) {
			this.expanded.emit({
				expanded: expanded,
				expandedData: treeNode,
				eventDateTime: new Date()
			});
		}
	}

	/**
	 * 行を選択します.
	 * @param selectedData 選択させる行データ(ツリーノード表示の場合はEIMDataGridTreeNode[]型を指定してください)
	 * @param isEmitEvent イベントエミットフラグ(true:エミットする、false:エミットしない)
	 */
	public select(selectedData: any[], isEmitEvent = true): void {

		// 親階層を開く
		if (this.enableTreeView && selectedData && selectedData.length > 0) {

			const selectedTreeNodes: EIMDataGridTreeNode[] = selectedData as EIMDataGridTreeNode[];
			for (let i = 0; i < selectedTreeNodes.length; i++) {

				const selectedTreeNode = this.getTreeNodeByTreeNodeId(selectedTreeNodes[i].treeNodeId);
				if (!selectedTreeNode) {
					continue;
				}
				let targetTreeNode = selectedTreeNode.parentTreeNode;
				while (targetTreeNode !== null) {
					targetTreeNode.expanded = true;
					this.updateTreeNodes([targetTreeNode]);

					targetTreeNode = targetTreeNode.parentTreeNode;
				}
			}
		}

		if (isEmitEvent) {
			this.componentService.select(this.info, selectedData, this.selected);
		} else {
			this.componentService.select(this.info, selectedData);
		}

		if (this.enableTreeView && selectedData && selectedData.length > 0) {
			this.scrollToTreeNode(selectedData[0] as EIMDataGridTreeNode);
		}
	}

	/**
	 * 選択行を返却します.
	 * @return 選択している行データ
	 */
	public getSelectedData(): any[] {
		if (!this.info.gridApi) {
			return [];
		}
		return this.info.gridApi.getSelectedRows();
	}

	/**
	 * カラムをセットします.
	 * @param columns セットするカラム
	 */
	public setColumns(columns: (EIMDataGridColumn | EIMDataGridColumnGroup)[]): void {

		this.columns = columns;
		this.startColumn = null;
		let columnDefs: (ColDef | ColGroupDef)[] = [];

		for (let i = 0; i < columns.length; i++) {

			if (columns[i].hasOwnProperty('children')) {
				let column: EIMDataGridColumnGroup = columns[i];
    			columnDefs.push(this.convertToColDef(column));
		    } else {
				let column: EIMDataGridColumn = columns[i];
    			columnDefs.push(this.convertToColDef(column));
		   }
		}
		// AG-Grid v31以降: 初期設定用にgridOptionsに保存（グリッド作成前の参照用）
		this.info.gridOptions.columnDefs = columnDefs;

		const action = () => {
			// 列の表示順序のみ変更した場合、画面に反映されなくなった
			// そのため一旦空配列を渡し、変更があったことを通知する
			this.info.gridApi.setGridOption('columnDefs', []);
			this.info.gridApi.setGridOption('columnDefs', columnDefs);
		};

		if (this.info.gridApi && !this.info.gridApi.isDestroyed()) {
			action();
		} 
		else {
			this.info.pendingActions.push(action);
		}
	}

	/**
	 * 行データを末尾に追加します.
	 * @param data 追加するデータ
	 */
	public addRowData(data: any[]): void {

		this.noSupportTreeView();

		this.info.gridApi.applyTransaction({ add: data });
		this.info.rowCount += (data != null ? data.length : 0);
		// サムネイル用に更新
		this.info.data = this.componentService.getData(this.info);
	}

	/**
	 * 行データを指定インデックスに追加します.
	 * @param data 追加するデータ
	 * @param index インデックス
	 */
	public addRowDataToIndex(data: any[], index: number): void {

		this.info.gridApi.applyTransaction({ add: data, addIndex: index });
		this.info.rowCount += (data != null ? data.length : 0);
		// サムネイル用に更新
		this.info.data = this.componentService.getData(this.info);
	}

	/**
	 * 行データを更新します.
	 * @param data 更新するデータ
	 */
	public updateRowData(data: any[]): void {

		this.noSupportTreeView();

		let updatedData: any[] = [];

		let nowData: any[] = this.getData();
		for (let i = 0; i < nowData.length; i++) {
			for (let j = 0; j < data.length; j++) {
				// 同一行判定関数が設定されている場合は設定された関数で判定
				// 設定されていない場合はデフォルトの同一行判定関数で判定
				if (this.equals) {
					if (this.equals(nowData[i], data[j])) {
						updatedData.push(this.updateData(nowData[i], data[j]));
					}
				} else if (this.dataGridComponentService.defaultEquals(nowData[i], data[j])) {
					updatedData.push(this.updateData(nowData[i], data[j]));
				}
			}
		}
		this.info.gridApi.redrawRows();
	}

	// /**
	//  * ドキュメント一括登録及びBoxからEIMANAGERに公開で登録した行データを更新します.
	//  * @param data 更新するデータ
	//  */
	public updateDocumentRowData(data: any[]): void {
		let updatedData: any[] = [];
		let nowData: any[] = this.getData();
		let nowDataNumber: number;
		let dataNumber: number;
		for (let i = 0; i < nowData.length; i++) {
			for (let j = 0; j < data.length; j++) {
				if (
					nowData[i].objName == data[j].objName &&
					nowData[i].isDocumentLink == data[j].isDocumentLink
				) {
					nowDataNumber = i;
					dataNumber = j;
					if (data[j].statusTypeKind != EIMConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
						updatedData.push(
							this.updateDocumentData(nowData[nowDataNumber], data[dataNumber])
						);
					} else {
						this.addRowDataToIndex([data[dataNumber]], dataNumber);
					}
				}
			}
		}
		if (nowDataNumber == null && dataNumber == null) {
			this.addRowData(data);
		}
		this.info.gridApi.redrawRows();
	}

	/**
	 * 行データを削除します.
	 * @param data 削除するデータ
	 */
	public removeRowData(data: any[]): void {

		this.noSupportTreeView();

		const srcData = this.getData();
		let deleteData: any[] = [];
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < srcData.length; j++) {
				if (this.equals(data[i], srcData[j])) {
					deleteData.push(srcData[j]);
					break;
				}
			}
		}
		if (deleteData.length > 0) {
			this.info.gridApi.applyTransaction({ remove: deleteData });
		}

		this.info.rowCount -= (deleteData != null ? deleteData.length : 0);
		// ここでgetData内のinfo.dataの更新が走るので削除後にサムネイルが消えるようになる
		// サムネイル用に更新
		this.info.data = this.componentService.getData(this.info);
	}

	/**
	 * Boxの行データを削除します.
	 * @param data 削除するデータ
	 */
	public deleteRowBoxId(data: any[]): void {
		let nowData: any[] = this.getData();
		let deleteData: any[] = [];
		for (let i = 0; i < nowData.length; i++) {
			if (nowData[i].id == data) {
				deleteData.push(nowData[i]);
				break;
			}
		}

		if (deleteData.length > 0) {
			this.info.gridApi.applyTransaction({ remove: deleteData });
		}

		this.info.rowCount -= deleteData != null ? deleteData.length : 0;
	}

	/**
	 * グリッド行の高さを設定します.
	 * @param rowHeight 行の高さ
	 */
	public setRowHeight(rowHeight: number): void {
		this.rowHeight = rowHeight;
		// AG-Grid v31以降: setGridOptionを使用
		if (this.info.gridApi && !this.info.gridApi.isDestroyed()) {
			this.info.gridApi.setGridOption('rowHeight', rowHeight);
		} else {
			this.info.gridOptions.rowHeight = rowHeight;
		}
	}

	/**
	 * グリッドをリフレッシュします.
	 */
	public refreshView(): void {
		this.info.gridApi?.redrawRows({});
	}

	/**
	 * グリッドの行を再描画します.
	 * @params rows 更新対象の行情報リスト
	 */
	public redrawRows(rows?: any): void {
		this.info.gridApi.redrawRows(rows);
	}

	/**
	 * 指定したツリーノードリストに該当する行を再描画します.
	 * @param treeNodes 再描画する対象のツリーノードリスト 
	 */
	public refreshRowsByTreeNodes(treeNodes: EIMDataGridTreeNode[]): void {

		let updateRows: any[] = [];
		for (let i = 0; i < treeNodes.length; i++) {

			// 表示更新用にAG Grid似て管理しているデータを取得
			const rowIndex = this.getTargetRowIndex(treeNodes[i]);
			updateRows.push(this.info.gridApi.getDisplayedRowAtIndex(rowIndex));
		}

		this.redrawRows({rowNodes: updateRows});
		// this.redrawRows();
	}

	/**
	 * 表示形式でフォーマットした数値を文字列で返却します.
	 * @param value 数値データ
	 */
	public numberValueFormatter(data, field, value): string {
		if (!value || value == '' || value == '-') {
			return value;
		}

		// valueが配列でない場合
		if (!Array.isArray(value)) {
			let stringValue: string = DecimalPipe.prototype.transform(value, '1.0-3', this.locale);
			return stringValue;
		}

		// valueが配列の場合
		let stringValues: string[] = [];
		for (let num of value) {
			stringValues.push(DecimalPipe.prototype.transform(num, '1.0-3', this.locale));
		}
		return stringValues.join('|');
	}
	/**
	 * 表示形式でフォーマットした日時を文字列で返却します.
	 * @param value 数値データ
	 */
	public dateTimeValueFormatter(data, field, value): string {
		if (!value || value == '') {
			return value;
		}

		// valueが配列でない場合
		if (!Array.isArray(value)) {
			return this.dateService.getDateTimeString(value);
		}

		// valueが配列の場合
		let stringValues: string[] = [];
		for (let date of value) {
			stringValues.push(this.dateService.getDateTimeString(date));
		}
		return stringValues.join('|');
	}

	/**
	 * 画面表示値を返却します.<br>
	 * valueGetterが指定されていればvalueGetterの結果、指定されてなければフィールド指定の値を返却します.
	 * 
	 * @param node AgGridノード
	 * @param colDef カラム定義
	 * @returns 画面表示値
	 */
	protected getDisplayedValue(node: IRowNode, colDef: ColDef): string {

		if (colDef.valueGetter) {

			const params: ValueGetterParams = {
				getValue: (field: string): any => {
					return this.getValue(node.data, colDef.field);
				},
				node: node,
				data: node.data,
				colDef: colDef,
				column: this.lastColumnUsedByValueGetter,
				api: this.info.gridApi,
				context: this.info.gridOptions.context

			};

			// EIMではvalueGetterに文字列は指定できない
			if (typeof colDef.valueGetter === 'string') {
				return '';
			} 
			return colDef.valueGetter(params);
		}

		return this.getValue(node.data, colDef.field);
	}

	/**
	 * 指定フィールドの値を行データから取り出します
	 * @param data 行データ
	 * @param field フィールド名
	 * @return フィールドデータ
	 */
	protected getValue(data, field): string {
		if (!data || !field) {
			return;
		}

		if (field.indexOf('.') === -1) {
				return data[field];

		} else {
			let fields = field.split('.');
			let currentObject = data;
			for (let i = 0; i < fields.length; i++) {
					currentObject = currentObject[fields[i]];
					if (!currentObject) {
							return null;
					}
			}
			return currentObject;
		}
	}

	/**
	 * 選択行の行番号を取得します.
	 * @return 選択行の行番号
	 */
	public getRowIndex(): number {

		let rowIndex = -1;
		let rowCnt = 0;
		if (this.info.gridApi) {
			this.info.gridApi.forEachNodeAfterFilterAndSort( function (node) {
				if (node.isSelected()) {
					rowIndex = rowCnt;
				}
				rowCnt++;
			});
		}
		else {
			window.setTimeout(() => {

				this.info.gridApi.forEachNodeAfterFilterAndSort( function (node) {
					if (node.isSelected()) {
						rowIndex = rowCnt;
					}
					rowCnt++;
				});
			});
		}

		return rowIndex;
	}

	/**
	 * 選択行の行番号を取得します.
	 * @return 選択行の行番号
	 */
	public getFirstRowIndex(): number {

		let rowIndex = -1;
		let rowCnt = 0;
		let flag = false;
		if (this.info.gridApi) {
			this.info.gridApi.forEachNodeAfterFilterAndSort( function (node) {

				if (node.isSelected() && !flag) {
					rowIndex = rowCnt;
					flag = true;
				}
				rowCnt++;
			});
		}
		else {
			window.setTimeout(() => {

				this.info.gridApi.forEachNodeAfterFilterAndSort( function (node) {

					if (node.isSelected() && !flag) {
						rowIndex = rowCnt;
						flag = true;
					}
					rowCnt++;
				});
			});
		}
		
		return rowIndex;
	}

	/**
	 * 表示行数を取得します.
	 * @param filter trueの場合、フィルタ後の行数を取得
	 * @return 表示行数
	 */
	public getRowCount(filter = false): number {

		let rowCnt = 0;

		if (filter) {
			this.info.gridApi.forEachNodeAfterFilterAndSort( function (node) {
				rowCnt++;
			});
		} else {
			this.info.gridApi.forEachNode( function (node) {
				rowCnt++;
			});
		}

		return rowCnt;
	}

	/**
	 * 対象行の行番号を取得します.
	 * @param target 対象行
	 * @return 対象行の行番号（取得できなければ-1）
	 */
	public getTargetRowIndex(target: any): number {
		let rowIndex = -1;
		let rowCnt = 0;
		this.info.gridApi.forEachNodeAfterFilterAndSort( (node) => {
			if (this.equals) {
				if (this.equals(node.data, target)) {
					rowIndex = rowCnt;
				}
			} else if (this.dataGridComponentService.defaultEquals(node.data, target)) {
				rowIndex = rowCnt;
			}
			rowCnt++;
		});

		return rowIndex;
	}

	/**
	 * 指定した行番号のデータを取得します.
	 * @param rowIndex 行番号
	 * @return 行データ
	 */
	public getDataByRowIndex(rowIndex: number): any {
		let rowCnt = 0;
		let rowNode: any;
		this.info.gridApi.forEachNodeAfterFilterAndSort( (node) => {
			if (rowIndex === rowCnt) {
				rowNode = node;
			}
			rowCnt++;
		});
		return rowNode.data;
	}

	/**
	 * 指定した行番号を選択行に設定する.
	 */
	public setSelectRow(rowIndex: number, scrollTop = 0) {

		// 選択対象アイテムのインデックス取得
		let selectRowIndex = -1;
		if (this.getRowCount(true) > rowIndex) {
			selectRowIndex = rowIndex;
		} else {
			selectRowIndex = this.getRowCount(true) - 1;
		}

		// 選択状態に設定
		if (selectRowIndex >= 0) {
			let cnt = 0;
			let nodes: any[] = [];
			this.info.gridApi.forEachNodeAfterFilterAndSort(
				(node) => {
					if (cnt === selectRowIndex) {
						node.setSelected(true);
					} else {
						node.setSelected(false);
					}
					cnt++;
				}
			);
		}

		// スクロール位置を設定
		this.setScrollTop(scrollTop);
	}

	/**
	 * 行を移動します.
	 * @param target 移動する行情報
	 * @param distance 移動距離（-1なら1行上、+1なら1行下に移動）
	 */
	public move(target: any, distance: number): void {

		this.noSupportTreeView();

		let rowIndex: number = this.getTargetRowIndex(target);
		if (distance < 0 && rowIndex + distance < 0) {
			return;
		}
		if (distance > 0 && rowIndex + distance > this.getData().length - 1) {
			return;
		}

		this.removeRowData([target]);
		this.addRowDataToIndex([target], rowIndex + distance);
	}

	/**
	 * 選択行を上に移動します.
	 * @return 移動したかどうか
	 */
	public moveUpSelectedData(): boolean {

		this.noSupportTreeView();

		let moveCnt = 0;
		let data: any[] = this.getData();
		let selectedData: any[] = this.getSelectedData();
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < selectedData.length; j++) {
				if (!this.equals(data[i], selectedData[j])) {
					continue;
				}
				// 移動
				let rowIndex: number = this.getTargetRowIndex(selectedData[j]);
				if (rowIndex <= moveCnt) {
					return false;
				}
				moveCnt++;
				this.move(selectedData[j], -1);
			}
		}
		// 移動行を選択
		this.select(selectedData, false);
		return moveCnt > 0;
	}

	/**
	 * 選択行を下に移動します.
	 * @return 移動したかどうか
	 */
	public moveDownSelectedData(): boolean {

		this.noSupportTreeView();

		let moveCnt = 0;
		let data: any[] = this.getData();
		let selectedData: any[] = this.getSelectedData();
		for (let i = data.length - 1; i >= 0; i--) {
			for (let j = 0; j < selectedData.length; j++) {
				if (!this.equals(data[i], selectedData[j])) {
					continue;
				}

				// 移動
				let rowIndex: number = this.getTargetRowIndex(selectedData[j]);
				if (rowIndex >= data.length - 1 - moveCnt) {
					return false;
				}
				moveCnt++;
				this.move(selectedData[j], 1);
			}
		}
		// 移動行を選択
		this.select(selectedData, false);
		return moveCnt > 0;
	}

	/**
	 * CSV形式でデータを返却します.
	 * @return CSV
	 */
	public getDataAsCsv(): string {
		let csvOutputParams: any = {
			columnSeparator: ',',
		};

		return this.info.gridApi.getDataAsCsv(csvOutputParams);
	}

	/**
	 * データグリッドの状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}

		// 復元します
		this.info.settingStateFlag = state.selectedData != null && state.selectedData.length > 0;
		if (state.data) {
			this.setData(state.data);
		}

		if (state.columns) {
			this.setColumns(state.columns);
		}
		if (state.colState && this.info.gridApi) {
			this.info.gridApi.applyColumnState({state: state.colState, applyOrder: true});
			this.setSortModelOfColumnState(state.sortState);
		}
		if (state.filterState && this.info.gridApi) {
			this.info.gridApi.setFilterModel(state.filterState);
		}
		if (this.info.gridApi && state.data) {
			this.select(state.selectedData, false);
			this.setScrollTop(state?.scrollTop ?? 0);
		}
	}

	/**
	 * データグリッドの状態を返却します.
	 * @return 状態
	 */
	public getState(): any {

		let selectedTreeNodeIdPath: string[] = null;
		const selectedTreeNodes: EIMDataGridTreeNode[] = this.getSelectedData();
		if (this.enableTreeView && selectedTreeNodes && selectedTreeNodes.length > 0) {
			selectedTreeNodeIdPath = this.treeNodeService.getTreeNodeIdPath(this.getSelectedData()[0]);
		}

		// JSON化する際、循環参照してしまうのでツリーの情報は除去
		const selectedData = Object.assign([], this.getSelectedData());
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i]?.parentTreeNode ?? null) {
				selectedData[i].parentTreeNode = null;
			}

			if (selectedData[i]?.childTreeNodes ?? null) {
				selectedData[i].childTreeNodes = null;
			}
		}

		return {
			data: this.getData(),
			columns: this.columns,
			selectedData: this.getSelectedData(),
			colState: this.info.gridApi.getColumnState(),
			sortState: this.getSortModelOfColumnState(),
			filterState: this.info.gridApi.getFilterModel(),
			scrollTop: this.getScrollTop(),
			selectedTreeNodeIdPath: selectedTreeNodeIdPath,
		}
	}



	/**
	 * カラム状態を設定します.
	 * @param columnState カラム状態
	 */
	public setColumnState(columnState: any): void {
		this.info.gridApi.applyColumnState(columnState);
	}

	/**
	 * カラムを取得します.
	 */
	public getColumns(): EIMDataGridColumn[] {
		return this.columns;
	}

	public getGridContainer(): ElementRef {
		return this.gridContainer;
	}

	/**
	 * ツリーノードを返却します.
	 *
	 * @param dto
	 * @returns
	 */
	public getTreeNodeByDTO(dto: any): EIMDataGridTreeNode {

		this.noSupportFlatView();

		const treeNode = this.convertDTOToTreeNode(dto);
		return this.treeNodeMap.get(treeNode.treeNodeId);
	}

	/**
	 * ツリーノードを返却します.
	 *
	 * @param treeNodeId ツリーノードID
	 * @returns ツリーノード
	 */
	public getTreeNodeByTreeNodeId(treeNodeId: string): EIMDataGridTreeNode {

		this.noSupportFlatView();

		return this.treeNodeMap.get(treeNodeId);
	}

	/**
	 * ツリーノードの表示階層数を返却します.
	 *
	 * @param treeNode ツリーノード
	 * @returns 表示階層数(0,1,2,…)
	 */
	public getTreeNodeLevel(treeNode: EIMDataGridTreeNode): number {

		this.noSupportFlatView();

		let level = 0;
		let parentNode = treeNode.parentTreeNode;
		// TODO: 階層制限いる？
		for (let i = 0; i < 100; i++) {
			if (!parentNode) {
				return level;
			}

			level++;
			parentNode = parentNode.parentTreeNode;
		}
		return level;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	public ngOnInit(): void {

		this.setOptions();

		// AG-Grid v31以降: グリッド作成前は gridOptions に設定、作成後は setGridOption を使用
		if (this.info.gridApi && !this.info.gridApi.isDestroyed()) {
			this.info.gridApi.setGridOption('suppressClickEdit', this.suppressClickEdit);
			this.info.gridApi.setGridOption('suppressHorizontalScroll', this.suppressHorizontalScroll);
			this.info.gridApi.setGridOption('headerHeight', this.headerHeight);
			this.info.gridApi.setGridOption('rowStyle', this.rowStyle);
			this.info.gridApi.setGridOption('rowClass', this.rowClass);
			this.info.gridApi.setGridOption('getRowClass', this.getRowClass.bind(this));
		} else {
			this.info.gridOptions.suppressClickEdit = this.suppressClickEdit;
			this.info.gridOptions.suppressHorizontalScroll = this.suppressHorizontalScroll;
			this.info.gridOptions.headerHeight = this.headerHeight;
			this.info.gridOptions.rowStyle = this.rowStyle;
			this.info.gridOptions.rowClass = this.rowClass;
			this.info.gridOptions.getRowClass = this.getRowClass.bind(this);
		}

		let rowSelection: RowSelectionOptions = {
			mode: (this.multiple === true) ? 'multiRow' : 'singleRow',
			enableClickSelection: true
		}
		if (rowSelection.mode === 'multiRow') {
			rowSelection.headerCheckbox = this.enableCheckbox;
			rowSelection.checkboxes = this.enableCheckbox;
		}
		else {
			rowSelection.checkboxes = this.enableCheckbox;
		}
		// AG-Grid v31以降: グリッド作成前は gridOptions に設定、作成後は setGridOption を使用
		if (this.info.gridApi && !this.info.gridApi.isDestroyed()) {
			this.info.gridApi.setGridOption('rowSelection', rowSelection);
		} else {
			this.info.gridOptions.rowSelection = rowSelection;
		}

		if (this.componentService) {
			this.componentService.setGridOptions(this.info.gridOptions);
		}

		// コンテキストメニュー表示可能かどうかを判定をする
		if (this.contextMenuItems) {
			this.showContextMenu = true;
		} else {
			this.showContextMenu = false;
		}

		if (this.equals) {
			this.info.equals = this.equals;
		}

		this.initialize();

		window.setTimeout(() => {

			let headerRowEements = document.getElementsByClassName('ag-header');

			// console.log(getComputedStyle(headerRowEements.item(0)).height);
			// this.info.gridOptions.headerHeight = 32;
			// this.headerHeight = 32;
		});
	}

	/**
	 * optionsに設定されたプロパティをデータグリッドコンポーネントのプロパティに設定します.
	 */
	protected setOptions(): void {

		// オプション設定を反映
		if (typeof this.options === 'undefined') {
			return;
		}


		// ツリー表示するかどうか
		if (typeof this.options.enableTreeView !== 'undefined') {
			this.enableTreeView = this.options.enableTreeView;
		}

		// コンポーネントサービス
		if (typeof this.options.componentService !== 'undefined') {
			this.componentService = this.options.componentService;
		}

		// コンテキストメニューアイテム
		if (typeof this.options.contextMenuItems !== 'undefined') {
			this.contextMenuItems = this.options.contextMenuItems;
		}

		// 同一行判定関数
		if (typeof this.options.equals !== 'undefined') {
			this.equals = this.options.equals;
		}

		// 複数行選択可フラグ
		if (typeof this.options.multiple !== 'undefined') {
			this.multiple = this.options.multiple;
		}

		// クリック編集可フラグ
		if (typeof this.options.suppressClickEdit !== 'undefined') {
			this.suppressClickEdit = this.options.suppressClickEdit;
		}

		// 水平スクロール無効化フラグ
		if (typeof this.options.suppressHorizontalScroll !== 'undefined') {
			this.suppressHorizontalScroll = this.options.suppressHorizontalScroll;
		}

		// ヘッダの高さ
		if (typeof this.options.headerHeight !== 'undefined') {
			this.headerHeight = this.options.headerHeight;
		}

		// 行の高さ
		if (typeof this.options.rowHeight !== 'undefined') {
			this.rowHeight = this.options.rowHeight;
		}

		// 行のスタイル
		if (typeof this.options.rowStyle !== 'undefined') {
			this.rowStyle = this.options.rowStyle;
		}

		// 行のクラス
		if (typeof this.options.rowClass !== 'undefined') {
			this.rowClass = this.options.rowClass;
		}

		// 行のクラス返却関数
		if (typeof this.options.rowClassFunction !== 'undefined') {
			this.rowClassFunction = this.options.rowClassFunction;
		}

		if (this.enableTreeView === true) {
			const treeViewOptions: EIMDataGridOptionsForTreeView = this.options as EIMDataGridOptionsForTreeView;
			if (typeof this.options['setAdditionalPropertiesToTreeNodeFunction'] !== 'undefined') {
				this.setAdditionalPropertiesToTreeNodeFunction = treeViewOptions.setAdditionalPropertiesToTreeNodeFunction;
			}
			if (typeof this.options['setAdditionalTreeNodeRelationFunction'] !== 'undefined') {
				this.setAdditionalTreeNodeRelationFunction = treeViewOptions.setAdditionalTreeNodeRelationFunction;
			}
		}

		// チェックボックス表示フラグ
		if (typeof this.options.enableCheckbox !== 'undefined') {
			this.enableCheckbox = this.options.enableCheckbox;
		}
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {

		// optionsが変更された場合は
		if (changes['options'] !== undefined) {

			// optionsに設定されたプロパティをデータグリッドコンポーネントのプロパティに設定
			this.setOptions();

		}

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

	ngOnDestroy()  {

	}

	/**
	 * 行選択時の処理です.
	 * @param event イベント
	 */
	public onSelect(event?: any): void {

		if (event && event.node) {
			this.componentService.onSelect(this.info, [event.node.data], this.selected);
		} else {
			this.componentService.onSelect(this.info, [], this.selected);
		}

		this.info.selectedRowCount = this.info.gridApi.getSelectedRows().length;

		this.changed.emit(event);
	}

	/**
	 * 「すべて選択」時の処理です.
	 * @param なし
	 */
	public allSelect(): void {
		this.info.gridApi.forEachNodeAfterFilterAndSort(
				(node) => {
						node.setSelected(true);
				}
			);
	}

	/**
	 * 「すべて解除」時の処理です.
	 * @param なし
	 */
	public allNotSelect(): void {
		this.info.gridApi.forEachNodeAfterFilterAndSort(
				(node) => {
						node.setSelected(false);
				}
			);
	}

	/**
	 * 右クリックイベントハンドラ.
	 * @param event イベント
	 */
	public onContextMenu(event: any): void {
		if (event.ctrlKey) {
			// Ctrl押下時はメニュー非表示とする
			window.setTimeout(() => {
				this.contextMenu.hide();
			});
			return;
		}
		let target: string = this.getTarget(event);
		if (target.indexOf('ag-cell') > -1) {
			// セルを右クリック
			// セル右クリックイベントハンドラが呼び出されるので本ハンドラでは何も処理をしない
		} else {
			// セル以外を右クリック
			// イベントをエミット
			this.contextmenu.emit();
		}
	}

	/**
	 * セル右クリックイベントハンドラ.
	 * @param event イベント
	 */
	public onCellContextMenu(event: any): void {

		if (!this.showContextMenu) { return; }

		let targetEvent: any = event;
		let isFound = false;
		// 右クリックした対象行が既に選択状態の場合、フラグを立てる
		this.info.gridApi.forEachNode( (node) => {
			if (targetEvent.rowIndex === node.rowIndex) {
				if (node.isSelected()) {
					isFound = true;
				}
			}
		});

		this.info.gridApi.forEachNode( (node) => {

			if (targetEvent.rowIndex === node.rowIndex) {
				node.setSelected(true);
				this.contextmenu.emit(node.data);

			} else {
				if (!isFound) {
					node.setSelected(false);
				}
			}

		});


	}

	/**
	 * セル編集開始イベントハンドラ.
	 * @param event イベント
	 */
	public onCellEditingStarted(event: any): void {
		this.cellEditingStarted.emit(event);
	}

	/**
	 * セル編集終了イベントハンドラ.
	 * @param event イベント
	 */
	public onCellEditingStopped(event: any): void {
		this.cellEditingStopped.emit(event);
	}

	/**
	 * セルクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onCellClicked(event: any): void {
		// シフト押下時の挙動
		if (event.event.shiftKey) {
			let endColumn: Element = window.document.activeElement;
			let selections: Selection = window.getSelection();
			selections.removeAllRanges();
			let range: Range = window.document.createRange()
			if (!this.startColumn || !this.startColumn.parentElement) {
				this.startColumn = endColumn.parentElement.parentElement.children[0].children[0];
			}
			if (this.startColumn.parentElement.offsetTop < endColumn.parentElement.offsetTop
			|| (this.startColumn.parentElement.offsetTop === endColumn.parentElement.offsetTop
			&& (<HTMLElement>this.startColumn).offsetLeft < (<HTMLElement>endColumn).offsetLeft)) {
				range.setStart(this.startColumn, 0);
				range.setEnd(endColumn, 1);
			} else {
				range.setStart(endColumn, 0);
				range.setEnd(this.startColumn, 1);
			}
			selections.addRange(range);
		} else {
			this.startColumn = window.document.activeElement;
		}

		if (this.clickedData) {

			if (this.equals) {
				if (this.equals(this.clickedData, event.data)) {
					// 選択行をクリックしたとみなす
					this.selectedRowCellClicked.emit(event);
				}
			} else if (this.dataGridComponentService.defaultEquals(this.clickedData, event.data)) {
				// 選択行をクリックしたとみなす
				this.selectedRowCellClicked.emit(event);
			}

		}

		this.clickedData = event.data;
	}

	/**
	 * 行ダブルクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onRowDoubleClicked(event: any): void {
		this.rowDoubleClicked.emit(event);
		this.doubleClicked.emit({
			event: event,
			data: event.data
		});
	}

	/**
	 * フィルターモデルを取得します.
	 * @return フィルターモデル
	 */
	public getFilterModel(): any {
		return this.info.gridApi.getFilterModel();
	}

	/**
	 * フィルターモデルを設定します.
	 * @param model フィルターモデル
	 */
	public setFilterModel(model: any): void {
		this.info.gridApi.setFilterModel(model);
	}

	/**
	 * ソートモデルを取得します.
	 * @return ソートモデル
	 */
	public getSortModel(): any {
		return this.getSortModelOfColumnState();
	}

	/**
	 * ソートモデルを設定します.
	 * @param model ソートモデル
	 */
	public setSortModel(model: any): void {
		this.setSortModelOfColumnState(model);
	}

	/**
	 * カラム情報内のソートモデルを取得します.
	 * @return ソートモデル
	 */
	private getSortModelOfColumnState(): any {

		const columnStates = this.info.gridApi.getColumnState();

		const filterStates = columnStates.filter(item => item.sort !== null);
		const sortStates = filterStates.sort(function(item1, item2) {
			return (item1.sortIndex < item2.sortIndex) ? -1 : 1;
		});

		let sortModels = [];
		for (let sortState of sortStates) {
			sortModels.push({ colId: sortState.colId, sort: sortState.sort, sortIndex: sortState.sortIndex });
		}
		return sortModels;
	};

	/**
	 * カラム情報内のソートモデルを設定します.
	 * @param sortModels ソートモデル
	 */
	private setSortModelOfColumnState(sortModels: any): void {

		const columnStates = this.info.gridApi.getColumnState();

		if (!columnStates) {
			return;
		}

		for (let columnState of columnStates) {
			if (sortModels) {
				let findModel = sortModels.find((item: { colId: string; }) => item.colId === columnState.colId);
				if (findModel) {
					columnState.sortIndex = findModel.sortIndex;
					columnState.sort = findModel.sort;
				} else {
					columnState.sortIndex = null;
					columnState.sort = null;
				}
			} else {
				columnState.sortIndex = null;
				columnState.sort = null;
			}
		}

		this.info.gridApi.applyColumnState({
			state: columnStates,
			applyOrder: true,
		});
	}

	/**
	 * スクロール位置を取得します.
	 * @return スクロール位置
	 */
	public getScrollTop(): number {
		if (!this.info.gridApi) {
            return 0;
        }
		let pos: number = 0;
		// AG-Grid v33では公式APIを使用
		const scrollElement = this.gridContainer?.nativeElement?.querySelector('.ag-body-viewport');
		if (scrollElement) {
			pos = scrollElement.scrollTop;
		}
		return pos;
	}

	/**
	 * スクロール位置を設定します.
	 * @param pos スクロール位置
	 */
	public setScrollTop(pos: number): void {
		const action = () => {
			// AG-Grid v33では公式APIを使用
			const scrollElement = this.gridContainer?.nativeElement?.querySelector('.ag-body-viewport');
			if (scrollElement) {
				scrollElement.scrollTop = pos;
			}
			this.info.gridApi.redrawRows();
		}

		if (this.info.gridApi) {
			action();
		}
		else {
			this.info.pendingActions.push(action);
		}
	}

	/**
	 * スクロール位置をインデックスで設定します.
	 * @param index インデックス
	 */
	public ensureIndexVisible(index: number): void {
		this.info.gridApi.ensureIndexVisible(index);
	}

	/**
	 * 行を上に１つ移動イベントハンドラ.
	 * @param event イベント
	 */
	private onRowUp(event: any): void {
		this.moveUpSelectedData();
	}

	/**
	 * 行を下に１つ移動イベントハンドラ.
	 * @param event イベント
	 */
	private onRowDown(event: any): void {
		this.moveDownSelectedData();
	}


	// private resizeListenerFunc = () => { this.info.gridApi.sizeColumnsToFit(); };

	/**
	 * グリッド準備完了イベントハンドラ
	 * @param event イベント
	 */
	public onGridReady(event?: GridReadyEvent): void {
		this.info.gridApi = event.api;

		// ためておいた処理を実行
		this.info.pendingActions.forEach(action => action());
		this.info.pendingActions = [];
	
		this.gridReady.emit(event);
	}

	/**
	 * ソートチェンジイベントハンドラ.
	 * @param event イベント
	 */
	public onSortChanged(event: any): void {
		this.sortChanged.emit(event);
	}

	/**
	 * フィルターチェンジイベントハンドラ.
	 * @param event イベント
	 */
	public onFilterChanged(event: any): void {
		this.filterChanged.emit(event);
	}

	/**
	 * カラムサイズ変更イベントハンドラ.
	 */
	public onColumnResized(event: any): void {
		this.columnResized.emit(event);
	}

	/**
	 * カラム移動イベントハンドラ.
	 */
	public onColumnMoved(event: any): void {
		this.columnMoved.emit(event);
	}

	/**
	 * セル編集状態を解除する.
	 */
	public stopEditing(): void {
		this.info.gridApi.stopEditing();
	}

	/**
	 * マウスダウンイベントハンドラ
	 * @param event マウスイベント
	 */
	@HostListener('mousedown', ['$event'])
	public handleMouseDownEvent(event: MouseEvent): void {
		// セル編集状態を解除する
		let target: string = this.getTarget(event);

		if (target === '') {
			// ラージテキスト内のクリックの場合、セル編集状態を解除しない
			return;
		}

		if (target !== 'ag-cell-edit-input' && target !== 'ag-large-textarea' && target !== 'ag-cell-edit-input ng-untouched ng-pristine ng-valid') {
			// セル編集状態を解除
			this.stopEditing();
		}

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * EIMのカラム情報をagGridのカラム情報に変換して返却します.
	 * @param column EIMのカラム情報
	 * @return agGridのカラム情報
	 */
	protected convertToColDef(column: EIMDataGridColumn | EIMDataGridColumnGroup): ColDef | ColGroupDef {
		if (column.hasOwnProperty('children')) {
			let _column: EIMDataGridColumnGroup = column;
			let children: (ColDef | ColGroupDef)[] = [];
			for (let i = 0; i < _column.children.length; i++) {
				children.push(this.convertToColDef(_column.children[i]));
			}
			return {
				headerName: column.headerName,
				children: children
			};
		} else {
			let _column: EIMDataGridColumn = column;

			let columnDef: ColDef =  {
				field: _column.fieldPath ? this.convertFieldPath(_column.fieldPath) : _column.field,
				tooltipField: _column.tooltipFieldPath ? this.convertFieldPath(_column.tooltipFieldPath) : _column.tooltipField,
				headerName: _column.headerName,
				cellStyle: _column.cellStyle,
				headerClass: _column.headerClass,
				width: _column.width,
				valueFormatter: _column.valueFormatter,
				onCellClicked: _column.onCellClicked,
				editable: _column.editable,
				cellRenderer: _column.cellRenderer ?? _column.cellRendererFramework,
				cellEditor: _column.cellEditorFramework,
				filter: !_column.suppressFilter,
				filterParams: _column.filterParams,
				sortable: !_column.suppressSorting,
				resizable: !_column.suppressResize,
				suppressMovable: _column.suppressMovable,
				valueGetter: this.createValueGetterWrapper(_column.valueGetter),
				sort: _column.sort,
				// comparator: _column.comparator,　// 各データ型のコンパレータを設定した後で設定する
				pinned: _column.pinned,
				lockPinned: _column.lockPinned,
				cellRendererParams: _column.cellRendererParams,
			};

			// AgGridの仕様変更により、gridOptions.rowSelectionへ移動
			// // チェックボックス
			// if (_column.checkboxSelection) {
			// 	columnDef.checkboxSelection = true;
			// 	columnDef.headerCheckboxSelection = true;
			// 	columnDef.filter = false;
			// 	columnDef.sortable = false;
			// 	columnDef.resizable = false;
			// 	columnDef.suppressMovable = true;
			// }

			// タイプ毎に出力フォーマットを変更
			switch(_column.type) {

				// 数値の場合
				case EIMDataGridColumnType.number: {
					if (!_column.valueFormatter) {
						columnDef.valueFormatter = (params) => {
							let value = null;
							if (_column.valueGetter) {
								value = _column.valueGetter(params);
							} else {
								value = this.getValue(params.data, params.colDef.field);
							}
							return this.numberValueFormatter(params.data, params.colDef.field, value);
						}
					}
					columnDef.comparator = this.numberComparator;
					columnDef.cellStyle = {'text-align': 'right'};
					columnDef.filter = 'agNumberColumnFilter';
					break;
				}

				// 日付の場合
				case EIMDataGridColumnType.date: {
					columnDef.filter = 'agDateColumnFilter';
					break;
				}

				// 日時の場合
				case EIMDataGridColumnType.dateTime: {
					if (!_column.valueFormatter) {
						columnDef.valueFormatter = (params) => {
							return this.dateTimeValueFormatter(params.data, params.colDef.field, this.getValue(params.data, params.colDef.field));
						}
					}
					if (!_column.valueGetter) {
						columnDef.valueGetter = (params) => {
							return this.dateTimeValueFormatter(params.data, params.colDef.field, this.getValue(params.data, params.colDef.field));
						}
					}
					// 日時を入力できないためtextを使用
					columnDef.filter = 'text';
					break;
				}

				// テキストの場合
				case EIMDataGridColumnType.text: {
					// if (_column.editable) {
					// 	columnDef.cellEditor = 'agLargeTextCellEditor';
					// 	columnDef.suppressKeyboardEvent =  function(event) {
					// 		if (event.editing) {
					// 			return true;
					// 		}
					// 	}
					// }

					if (!_column.valueFormatter) {
						columnDef.valueFormatter = (params) => {
							return this.getValue(params.data, params.colDef.field);
						}
					}
					// if (!columnDef.cellRendererFramework) {
					// 	columnDef.cellRendererFramework = EIMLargeTextRendererComponent;
					// }

					// if (_column) {
					// 	columnDef.cellEditorParams = _column.cellEditorParams;
					// }
					break;
				}

				// ラージテキストの場合
				case EIMDataGridColumnType.largeText: {
					if (_column.editable) {
						columnDef.cellEditor = 'agLargeTextCellEditor';
						columnDef.suppressKeyboardEvent =  function(event) {
							if (event.editing) {
								return true;
							}
						}
					}

					if (!_column.valueFormatter) {
						columnDef.valueFormatter = (params) => {
							return this.getValue(params.data, params.colDef.field);
						}
					}
					if (!columnDef.cellRenderer) {
						columnDef.cellRenderer = EIMLargeTextRendererComponent;
					}

					if (_column) {
						columnDef.cellEditorParams = _column.cellEditorParams;
					}
					break;
				}
				// オブジェクト/ユーザ/コードの場合
				case EIMDataGridColumnType.object:
				case EIMDataGridColumnType.user:
				case EIMDataGridColumnType.code: {

					if (!_column.valueFormatter) {
						columnDef.valueFormatter = (params) => {
							let values = this.getValue(params.data, params.colDef.field);
							if (!values) {
								return '';
							}

							let names: string[] = [];
							for (let value of values) {
								names.push(value['name']);
							}

							return names.join('|');
						}
					}
					break;
				}
			}

			// cellRendererがnullの場合、デフォルトのcellRendererを設定する
			if (!columnDef.cellRenderer && !columnDef.valueFormatter) {
				columnDef.cellRenderer = EIMDefaultRendererComponent;
			}

			// コンパレータ設定(comparatorsよりcomparatorを優先)
			let comparator = columnDef.comparator;
			if (_column.comparator) {
				comparator = _column.comparator;
			}
			else if (_column.comparators) {
				comparator = this.convertComparatorsToComparator(_column.comparators);
			}

			columnDef.comparator = this.createComparatorSupportTreeView(comparator);

			return columnDef;
		}
	}

	/**
	 * プロパティを更新します.
	 * @param oldObj 更新先データ
	 * @param newObj 更新元データ
	 * @return 更新されたデータ
	 */
	private updateData(oldObj: any, newObj: any): any {
		Object.assign(oldObj, newObj);
		let key: string[] = Object.keys(oldObj);
		for (let i = 0; i < key.length; i++) {
			// プロパティ値が数値の0の場合は削除しない
			if (!newObj[key[i]] && newObj[key[i]] !== 0) {
				delete oldObj[key[i]];
			}
		}
		return oldObj;
	}
	
	/**
	 * ドキュメント一括登録及びBoxからEIMANAGERに登録したドキュメントのプロパティを更新します.
	 * @param oldObj 更新先データ
	 * @param newObj 更新元データ
	 * @return 更新されたデータ
	 */
	private updateDocumentData(oldObj: any, newObj: any): any {
		Object.assign(oldObj, newObj);
		let key: string[] = Object.keys(oldObj);
		for (let i = 0; i < key.length; i++) {
			if (newObj[key[i]] === undefined || newObj[key[i]] === null) {
				// newObj に存在しないプロパティが oldObj にある場合は削除
				delete oldObj[key[i]];
			}
		}
		return oldObj;
	}

	/**
	 * ソースターゲットを取得します.
	 * @param event マウスイベント
	 * @return ソースターゲット
	 */
	private getTarget(event: MouseEvent): string {
		let target: string;
		if (event.target) {
			target = event.target['className'];
		}
		return target;
	}

	/* 行を上下キーで操作するためのハンドラ
	 * 現在未実装だが、備忘録としてコメントで残す
	private onNavigateToNextCell(params: any):GridCellDef {
		var previousCell = params.previousCellDef;
		var suggestedNextCell = params.nextCellDef;

		var KEY_UP = 38;
		var KEY_DOWN = 40;
		var KEY_LEFT = 37;
		var KEY_RIGHT = 39;

		switch (params.key) {
			case KEY_DOWN:
				previousCell = params.previousCellDef;
				// set selected cell on current cell + 1
				this.info.gridApi.forEachNode( (node) => {
					if (previousCell.rowIndex + 1 === node.rowIndex) {
						node.setSelected(true);
					}
				});
				return suggestedNextCell;
			case KEY_UP:
				previousCell = params.previousCellDef;
				// set selected cell on current cell - 1
				this.info.gridApi.forEachNode( (node) => {
					if (previousCell.rowIndex - 1 === node.rowIndex) {
						node.setSelected(true);
					}
				});
				return suggestedNextCell;
			case KEY_LEFT:
			case KEY_RIGHT:
				return suggestedNextCell;
			default:
				throw "this will never happen, navigation is always on of the 4 keys above";
		}
	}
	*/

	/**
	 * 文字列を比較します.
	 * 
	 * @param string1 比較対象1
	 * @param string2 比較対象2
	 * @return 比較結果
	 */
	public stringComparator(string1: string, string2: string): number {

		if ( !string1 && !string2 ) {
		  return 0;
		}
		if ( !string1) {
		  return -1;
		}
		if ( !string2) {
		  return 1;
		}

		if (string1.toString() < string2.toString()) {
			return -1;
		}
		if (string1.toString() > string2.toString()) {
			return 1;
		}
		return 0;
	}

	/**
	 * 数値を比較します。
	 * 
	 * @param number1 比較対象1
	 * @param number2 比較対象2
	 * @return 比較結果
	 */
	public numberComparator(number1: any, number2: any) {

		if ( !number1 && !number2 ) {
		  return 0;
		}
		if ( !number1) {
		  return -1;
		}
		if ( !number2) {
		  return 1;
		}

		return Number(number1) < Number(number2) ? -1 : 1;
	}

	/**
	 * フィールドパスをフィールド文字列に変換します.
	 *
	 * @param fieldPath フィールドパス
	 * @returns フィールド文字列
	 */
	protected convertFieldPath(fieldPath: string[]): string  {

		let encodedField: string = null;

		for (let field of fieldPath) {
			if (encodedField) {
				encodedField += '.';
			} else {
				encodedField = '';
			}

			const escapedField = escapePath(field);
			// escapePathにてインデックス指定された文字列を指定した場合誤って変換される('values[0]'→'values\[0]')
			// getPropertyで取得できないので不要な'\'を除去する
			encodedField += escapedField.replace(/\\\[/g, '[');
		}

		return encodedField;
	}

	/**
	 * 複数条件でソートするコンパレータを生成します.
	 * @param comparators コンパレータリスト
	 * @returns 複数条件でソートするコンパレータ
	 */
	protected convertComparatorsToComparator(comparators: ((valueA: any, valueB: any, nodeA?: RowNode, nodeB?: RowNode, isInverted?: boolean) => number)[]) {

		return (valueA: any, valueB: any, nodeA?: RowNode, nodeB?: RowNode, isInverted?: boolean): number =>  {
			for (let comparator of comparators) {
				let result = comparator(valueA, valueB, nodeA, nodeB, isInverted);
				if (result !== 0) {
					return result;
				}
			}

			return 0;
		}
	}

	/**
	 * ツリービューをサポートしたコンパレータを生成します.
	 * 
	 * @param comparator コンパレータ
	 * @returns ツリービューをサポートしたコンパレータ
	 */
	protected createComparatorSupportTreeView(
			comparator: ((valueA: any, valueB: any, rowNodeA?: IRowNode, rowNodeB?: IRowNode, isInverted?: boolean) => number)) {


		return (valueA: any, valueB: any, rowNodeA?: RowNode, rowNodeB?: RowNode, isInverted?: boolean): number =>  {

			// ツリービューでない場合はそのままコンパレータを戻す
			if (!this.enableTreeView) {
				if (comparator) {
					return comparator(valueA, valueB, rowNodeA, rowNodeB, isInverted);
				}
				return this.stringComparator(valueA, valueB);
			}

			const treeNodeA: EIMDataGridTreeNode = rowNodeA.data;
			const treeNodeB: EIMDataGridTreeNode = rowNodeB.data;

			// 親が同一（兄弟）の場合
			if ((treeNodeA.parentTreeNode?.treeNodeId ?? -1) === (treeNodeB.parentTreeNode?.treeNodeId ?? -1)) {
				
				if (comparator) {
					const colDef = this.lastColumnUsedByValueGetter.getColDef();
					return comparator(this.getDisplayedValue(rowNodeA, colDef), this.getDisplayedValue(rowNodeB, colDef), rowNodeA, rowNodeB, isInverted);
				}
				else {
					const colDef = this.lastColumnUsedByValueGetter.getColDef();
					return this.stringComparator(this.getDisplayedValue(rowNodeA, colDef), this.getDisplayedValue(rowNodeB, colDef));
				}
			}

			// nodeAの親をたどり、nodeBの子であるかチェックする
			let targetTreeNodeA = treeNodeA;
			const treeNodeAIdAndChildNodeMap = new Map();
			while (true) {

				// nodeAがnodeBの子階層の場合
				if ((targetTreeNodeA.parentTreeNode?.treeNodeId ?? -1) === treeNodeB.treeNodeId) {
					return 1 * (isInverted ? -1 : 1);
				}

				// ルートの場合は-1でマップに登録する
				treeNodeAIdAndChildNodeMap.set(targetTreeNodeA.parentTreeNode?.treeNodeId ?? -1, targetTreeNodeA);

				targetTreeNodeA = targetTreeNodeA.parentTreeNode;

				// nodeAのルートまで行ったら抜ける
				if (targetTreeNodeA === null) {
					break;
				}
			}

			// nodeBの親をたどり、nodeAの子であるかチェックする
			// あるいは親階層に同一の親があるかどうかチェックする
			let targetTreeNodeB = treeNodeB;
			while (true) {

				// nodeBがnodeAの子階層の場合
				if ((targetTreeNodeB.parentTreeNode?.treeNodeId ?? -1) === treeNodeA.treeNodeId) {
					return -1 * (isInverted ? -1 : 1);
				}
				
				// 親階層に同一の親が存在する場合(親階層が兄弟)
				let targetTreeNodeA = treeNodeAIdAndChildNodeMap.get(targetTreeNodeB.parentTreeNode?.treeNodeId ?? -1);
				if (targetTreeNodeA) {
					
					const targetNodeAIndex = this.getTargetRowIndex(targetTreeNodeA);
					// 画面に表示されていない場合
					if (targetNodeAIndex === -1) {
						return 0;
					}
					const targetRowNodeA = this.info.gridApi.getDisplayedRowAtIndex(targetNodeAIndex);

					const targetNodeBIndex = this.getTargetRowIndex(targetTreeNodeB);
					// 画面に表示されていない場合
					if (targetNodeBIndex === -1) {
						return 0;
					}
					const targetRowNodeB = this.info.gridApi.getDisplayedRowAtIndex(targetNodeBIndex);

					if (comparator) {
						const colDef = this.lastColumnUsedByValueGetter.getColDef();
						return comparator(this.getDisplayedValue(targetRowNodeA, colDef), 
								this.getDisplayedValue(targetRowNodeB, colDef), targetRowNodeA, targetRowNodeB, isInverted);
					}
					else {
						const colDef = this.lastColumnUsedByValueGetter.getColDef();
						return this.stringComparator(this.getDisplayedValue(targetRowNodeA, colDef), 
								this.getDisplayedValue(targetRowNodeB, colDef));
					}
				}

				targetTreeNodeB = targetTreeNodeB.parentTreeNode;

				// nodeBのルートまで行ったら抜ける
				if (targetTreeNodeB === null) {
					break;
				}
			}

			return 0;
		}
	}

	protected createValueGetterWrapper(valueGetter: (params: ValueGetterParams) => string) {

		return (params: ValueGetterParams): string => {

			// 最後にvalueGetterの対象となったカラムを退避
			this.lastColumnUsedByValueGetter = params.column;

			if (valueGetter) {
				return valueGetter(params);
			}

			return this.getValue(params.data, params.colDef.field);			
		}
	}

	/**
	 * 行に設定するCSSのクラス名を返却します.
	 * @param params
	 * @returns
	 */
	protected getRowClass(params: any): string | string[] | undefined {
		if (this.rowClassFunction) {
			return this.rowClassFunction(params?.data?.dto);
		}
	}

	/**
	 * ツリーノードのマップを初期化します.
	 * 
	 * @param treeNodes ルートのツリーノードリスト
	 */
	protected initializeTreeNodeMap(treeNodes: EIMDataGridTreeNode[]): void {

		this.treeNodeMap = new Map();
		if (this.treeNodes === null) {
			return;
		}

		this.setToTreeNodeMap(treeNodes);

	}

	/**
	 * ツリーノード情報を子孫も含めてtreeNodeMapに設定します.
	 * @param treeNodes ツリーノードリスト
	 */
	protected setToTreeNodeMap(treeNodes: EIMDataGridTreeNode[]): void {

		if (treeNodes === null) {
			return null;
		}

		for (const treeNode of treeNodes) {
			this.treeNodeMap.set(treeNode.treeNodeId, treeNode);
			if (!treeNode.childTreeNodes || treeNode.childTreeNodes.length === 0) {
				continue;
			}
			this.setToTreeNodeMap(treeNode.childTreeNodes);
		}

	}

	/**
	 * 画面表示対象の子ツリーノードリストを親ツリーノードの子に設定します.
	 * 画面表示に設定するのみでツリーに設定はしません.
	 * @param _parentTreeNode 親ツリーノード
	 * @param childTreeNodes 子ツリーノードリスト
	 * @returns 
	 */
	protected appendDisplayChildTreeNodes(_parentTreeNode: EIMDataGridTreeNode, childTreeNodes: EIMDataGridTreeNode[]): void {

		// 追加表示するツリーノードリスト
		const targetDisplayTreeNodes = this.getDisplayTreeNodes(childTreeNodes);

		// 追加表示対象が存在しない場合は何もしない
		if (targetDisplayTreeNodes === null || targetDisplayTreeNodes.length === 0) {
			return;
		}

		let displayChildTreeNodes = null;
		let insertIndex = -1;

		// ルートに追加する場合
		if (_parentTreeNode === null) {

			displayChildTreeNodes = this.getDisplayTreeNodes(this.treeNodes);
			insertIndex = 0;

		}
		// 子階層に追加する場合
		else {

			// 親ツリーノード内での表示対象子ツリーノードリスト取得
			const parentTreeNode = this.getTreeNodeByTreeNodeId(_parentTreeNode.treeNodeId);
			displayChildTreeNodes = this.getDisplayTreeNodes(parentTreeNode.childTreeNodes);
			insertIndex = this.getTargetRowIndex(parentTreeNode) + 1;
		}

		// 挿入位置決定
		for (let i = 0; i < displayChildTreeNodes.length; i++) {
			if (this.equals(displayChildTreeNodes[i], targetDisplayTreeNodes[0])) {
				break;
			}
			insertIndex++;
		}

		this.addRowDataToIndex(targetDisplayTreeNodes, insertIndex);

		// 追加行の再描画
		//this.redrawRows(targetDisplayTreeNodes);
	}

	/**
	 * 画面表示対象の子ツリーノードリストを親ツリーノードから消去します.
	 * 画面表示から消去するのみでツリーから削除はしません.
	 * @param _parentTreeNode 親ツリーノード
	 */
	protected removeDisplayChildTreeNodes(_parentTreeNode: EIMDataGridTreeNode): void {

		// 親ツリーノード内での非表示対象子ツリーノードリスト取得
		const parentTreeNode = this.getTreeNodeByTreeNodeId(_parentTreeNode.treeNodeId);
		if (!parentTreeNode.childTreeNodes || parentTreeNode.childTreeNodes.length === 0) {
			//消去対象なし
			return;
		}
		const displayChildTreeNodes = this.getDisplayTreeNodes(parentTreeNode.childTreeNodes);

		this.info.gridApi.applyTransaction({ remove: displayChildTreeNodes });

		// 追加行の再描画
		// this.redrawRows(targetData);
		// this.setScrollTop(scrollTop);

	}

	/**
	 * フラットビュー設定の場合エラーを投げます.
	 */
	protected noSupportFlatView():void {
		if (this.enableTreeView === false) {
			throw new Error('no support flat view');
		}
	}

	/**
	 * ツリービュー設定の場合エラーを投げます.
	 */
	protected noSupportTreeView():void {
		if (this.enableTreeView === true) {
			throw new Error('no support tree view');
		}
	}

	/**
	 * ツリーノードの位置までスクロールします.
	 * 
	 * @param treeNode スクロール対象のツリーノード
	 */
	protected scrollToTreeNode(treeNode: EIMDataGridTreeNode): void {

		// スクロール位置の調整
		const displayTreeNodes: EIMDataGridTreeNode[] = this.getDisplayTreeNodesAfterFilterAndSort() as EIMDataGridTreeNode[];
		let index = 0;
		for (; index < displayTreeNodes.length; index++) {

			if (displayTreeNodes[index].treeNodeId === treeNode.treeNodeId) {
				break;
			}
		}

		// 該当行が見つからなかった場合は何もしない
		if (index === displayTreeNodes.length) {
			return;
		}

		// ツリーノード追加時、画面に追加される前にスクロール位置を計算してしまうため
		// スクロールタイミングをずらす
		window.setTimeout(() => {

			// スクロール対象のエレメント（ツリーのボディ）
			const element = this.getScrollTargetElement();
			const clientHeight = element.clientHeight;
			const scrollTop = element.scrollTop;

			// 画面に表示している行インデックスのスタート/エンド
			const viewStartIndex = Math.ceil(scrollTop / this.rowHeight);
			const viewEndIndex = viewStartIndex + Math.floor(clientHeight / this.rowHeight) - 1;

			// 表示中のインデックスであれば何もしない
			if (viewStartIndex <= index && index <= viewEndIndex) {
				return;
			}

			// 選択行のインデックス番号/全体件数で割合を求める
			let ratio: number = 0;
			if (displayTreeNodes.length > 0) {
				ratio = index / (displayTreeNodes.length - 1);
			}
			// ツリー表示領域の高さ*割合でスクロール位置を求める
			const scrollPos: number = element.scrollHeight * ratio;
	
			// スクロール位置を設定する
			element.scrollTop = scrollPos;

		});
	}
	
	/**
	 * スクロールターゲットのエレメントを返却します.
	 * @return スクロールターゲットのエレメント
	 */
	protected getScrollTargetElement(): any {
		// AG-Grid v33では公式APIを使用
		return this.gridContainer?.nativeElement?.querySelector('.ag-body-viewport');
	}

	/**
	 * EIMDataGridTreeNodeをコピーします. leaf/expand/parentTreeNode/childTreeNodesはコピーしません.
	 * 
	 * @param toTreeNode コピー先のEIMDataGridTreeNode
	 * @param fromTreeNode コピー元のEIMDataGridTreeNode
	 * @returns コピー後のEIMDataGridTreeNode
	 */
	protected copyDataGridTreeNode(toTreeNode: EIMDataGridTreeNode, fromTreeNode: EIMDataGridTreeNode): EIMDataGridTreeNode {

		toTreeNode.dto = fromTreeNode.dto;
		toTreeNode.options = fromTreeNode.options;
		
		return toTreeNode;
	}
}
