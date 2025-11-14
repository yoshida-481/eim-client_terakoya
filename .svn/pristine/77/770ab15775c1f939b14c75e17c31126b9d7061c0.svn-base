import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, ElementRef, SimpleChanges, OnChanges, ViewChildren, QueryList, Inject, TemplateRef } from '@angular/core';

import { EIMComponent, EIMComponentTreeNode, EIMListComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { SelectItem } from 'primeng/api';
import { EIMDataGridColumn, EIMDataGridColumnGroup, EIMDataGridColumnType, EIMDataGridComponent, EIMDataGridOptionsForTreeView, EIMDataGridTreeNode } from '../data-grid/data-grid.component';
import { EIMTreeFormatResultDTO } from 'app/shared/dtos/tree-format-result.dto';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { GanttItem, GanttItemType, GanttViewType, GanttViewOptions, GanttBarClickEvent, NgxGanttComponent, GanttDate, GanttStyleOptions, GANTT_GLOBAL_CONFIG, GanttGlobalConfig } from '@worktile/gantt';

/** ガントチャートタスク情報 */
export interface EIMGanttChartTreeNode extends EIMDataGridTreeNode {
	parentTreeNode?: EIMGanttChartTreeNode,
	childTreeNodes?: EIMGanttChartTreeNode[],
	type?: 'TASK' | 'TASK_GROUP' | 'MILESTONE'
	label?: string,
	startDate?: Date,
	endDate?: Date,
	className?: string, // タスクバーのクラス名。未指定時はデフォルト値を使用。
	completionPercent?: number,
}

export enum EIMGanttChartFormatItemEnum {
	QUARTER = 'quarter',
	MONTH = 'month',
	WEEK = 'week',
	DAY = 'day'
}

export interface EIMGanttChartOptions extends EIMDataGridOptionsForTreeView {
	setAdditionalPropertiesToTreeNodeFunction: (treeNode: EIMGanttChartTreeNode, dto: any) => EIMGanttChartTreeNode
	setAdditionalTreeNodeRelationFunction?: (parentTreeNode: EIMGanttChartTreeNode, childTreeNodes: EIMGanttChartTreeNode[]) => void
	defaultFormatItemValue?: EIMGanttChartFormatItemEnum
}

/**
 * ガントチャートコンポーネント
 * @example
 *
 *      <eim-gantt-chart
 *      >
 *      </eim-gantt-chart>
 */
@Component({
	selector: 'eim-gantt-chart',
	templateUrl: './gantt-chart.component.html',
	styleUrls: ['./gantt-chart.component.scss'],

	providers: [ 
		{provide: EIMComponent, useExisting: forwardRef(() => EIMGanttChartComponent)}
	],
	standalone: false
})
export class EIMGanttChartComponent implements OnInit, OnChanges, OnDestroy, EIMListComponent<any> {

	/** データグリッド */
	@ViewChild('ganttChartDataGrid', { static: true }) ganttChartDataGrid: EIMDataGridComponent;
	@ViewChild('ganttChartDataGrid', { static: false, read: ElementRef }) ganttChartDataGridElementRef: ElementRef;

	/** ガントチャートコンポーネント */
	@ViewChild('ganttComponent') ganttComponent: NgxGanttComponent;

	/** ガントチャートコンテナ */
	@ViewChild('ganttContainer') ganttContainer: ElementRef;

	/** ガントチャートコンポーネント（旧エディタ互換用） */
	// Note: @worktile/gantt has different structure, will need to refactor
	editor: any = {
		ganttEditorContainer: {
			nativeElement: document.createElement('div')
		}
	};

	/** オプション設定 */
	@Input()
	public options: EIMGanttChartOptions;

	/** 初期化イベントエミッタ */
	@Output()
	public initialized: EventEmitter<any[]> = new EventEmitter<any>();

	/** 行選択イベントエミッタ */
	@Output()
	public selected: EventEmitter<null> = new EventEmitter<any>();

	/** 行選択変更イベントエミッタ */
	@Output()
	public changed: EventEmitter<null> = new EventEmitter<any>();

	/** 行ダブルクリックイベントエミッタ */
	@Output()
	public doubleClicked: EventEmitter<{
		event: any,
		data: EIMGanttChartTreeNode,
	}> = new EventEmitter<any>();

	/** ツリー開閉イベントエミッタ */
	@Output()
	public expanded: EventEmitter<{
		expanded: boolean,
		data: any
	}> = new EventEmitter();

	/** ガントチャートの親エレメントに設定されているクラス名 */
	protected readonly GANTT_MAIN_GROUPS_CLASS_NAME = 'gantt-main-groups';

	/** 同一行判定関数 */
	public equals: (a: any, b: any) => boolean = this.defaultEquals;

	/** 複数行選択可フラグ */
	public multiple = false;

	/** ツリーノードに対して追加でプロパティ設定する関数 */
	public setAdditionalPropertiesToTreeNodeFunction: (treeNode: EIMGanttChartTreeNode, dto: any) => EIMGanttChartTreeNode;

	/** ツリーノードの親子間の関連設定関数 */
	public setAdditionalTreeNodeRelationFunction: (parentTreeNode: EIMGanttChartTreeNode, childTreeNodes: EIMGanttChartTreeNode[]) => void;

	/** 行スタイルクラス設定関数 */
	public rowClassFunction: (dto: any) => string;

	/** コンテンツツリーコンテキストメニュー */
	public contextMenuItems: EIMMenuItem[];

	/** データグリッドオプション */
	public ganttChartDataGridOptions: EIMDataGridOptionsForTreeView = null;

	/** @worktile/gantt用のタスクアイテム情報 */
	public ganttItems: GanttItem[] = [];

	public ganttViewOptions: GanttViewOptions = {};
	public ganttStyleOptions: GanttStyleOptions = {};

	/** @worktile/gantt用のビュータイプ */
	public ganttViewType: GanttViewType = GanttViewType.day;

	/** @worktile/gantt用の開始日 */
	public ganttStart: Date;

	/** @worktile/gantt用の終了日 */
	public ganttEnd: Date;

	/** Angular Gantt Editor内でのIDとツリーノードのマップ */
	protected pIdMap: Map<string, any> = null;

	/** 表示形式い（表/チャート） */
	public viewItems: SelectItem<string>[] = [
		// 表
		{ title: this.translateService.instant('EIM.LABEL_03058'), label: '', value: 'grid', icon: 'eim-icon-grid'},
		// チャート
		{ title: this.translateService.instant('EIM.LABEL_03059'), label: '', value: 'chart', icon: 'eim-icon-gantt-chart'}
	];
	/** 選択中のフォーマット（表/チャート） */
	public selectedView = 'chart';

	/** 表示フォーマット（年/週/日） */
	public formatItems: SelectItem<string>[] = [
		// 四半期
		{ label: this.translateService.instant('EIM.LABEL_03060'), value: EIMGanttChartFormatItemEnum.QUARTER },
		// 月
		{ label: this.translateService.instant('EIM.LABEL_03061'), value: EIMGanttChartFormatItemEnum.MONTH },
		// 週
		{ label: this.translateService.instant('EIM.LABEL_03062'), value: EIMGanttChartFormatItemEnum.WEEK },
		// 日
		{ label: this.translateService.instant('EIM.LABEL_03063'), value: EIMGanttChartFormatItemEnum.DAY }
	];
	/** 選択中のフォーマット（年/週/日） */
	public selectedFormat = EIMGanttChartFormatItemEnum.DAY;

	/** 前後の日数 */
	protected extraDays = 90;

	/** ガントチャートの横スクロール距離 */
	protected scrollDistance = 300;

	/** チャート表示最小日 */
	public minDate: Date = null;
	/** チャート表示最大日 */
	public maxDate: Date = null;

	/** 日単位表示時の最小日（GanttEditorComponentにて日単位表示の場合this.minDateが月曜開始に補正される） */
	protected minDateByDateFormat: Date = null;
	/** 日単位表示時の最大日（GanttEditorComponentにて日単位表示の場合this.maxDateが日曜開始に補正される） */
	protected maxDateByDateFormat: Date = null;

	/** 週末エレメントのマップ<日付のタイム値, エレメント> */
	protected weekendElementMap = new Map<number, HTMLElement>();

	/** 前回選択されたツリーノード */
	protected preSelectedTreeNode = null;

	/** チャートのセカンダリヘッダーの幅マップ */
	protected secondaryHeaderWidthMap: Map<EIMGanttChartFormatItemEnum, number> = new Map([
		[EIMGanttChartFormatItemEnum.DAY, 35],
		[EIMGanttChartFormatItemEnum.WEEK, 100],
		[EIMGanttChartFormatItemEnum.MONTH, 100],
		[EIMGanttChartFormatItemEnum.QUARTER, 100]
	]);


	/**
	 * コンストラクタです.
	 */
	constructor(
		private translateService: TranslateService,
		private datePipe: DatePipe,
		private treeNodeService: EIMTreeNodeService,
		private elementRef: ElementRef
	) {
		// オプションの初期化
		this.ganttViewOptions = {
			dateFormat: {
				week: this.translateService.instant('EIM.GANTT_CHART.week'),
				month: this.translateService.instant('EIM.GANTT_CHART.month'),
				quarter: this.translateService.instant('EIM.GANTT_CHART.quarter'),
				year: this.translateService.instant('EIM.GANTT_CHART.year'),
				yearMonth: this.translateService.instant('EIM.GANTT_CHART.yearMonth'),
				yearQuarter: this.translateService.instant('EIM.GANTT_CHART.yearQuarter')
			}
		};

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		// プロジェクトツリーの画面状態を復元
		if (state) {

			// ビュー
			if (state.selectedView) {
				this.selectedView = state.selectedView;
			}

			// フォーマット
			if (state.selectedFormat) {
				this.selectedFormat = state.selectedFormat;
				this.selectFormat(this.selectedFormat);
			}

			// チャートの横スクロール
			if (state.chartScrollLeft) {
				this.setChartScrollLeft(state.chartScrollLeft)
			}

			// データグリッド
			const ganttChartDataGridState = {
				data: state.data,
				columns: state.columns,
				selectedData: state.selectedData,
				colState: state.colState,
				sortState: state.sortState,
				filterState: state.filterState,
				scrollTop: state.scrollTop,
				selectedTreeNodeIdPath: state.selectedTreeNodeIdPath,
			}
			this.ganttChartDataGrid.setState(ganttChartDataGridState);
		}

	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {

		// データグリッドの状態
		const ganttChartDataGridState = this.ganttChartDataGrid.getState();

		return {
			selectedView: this.selectedView,
			selectedFormat: this.selectedFormat,
			chartScrollLeft: this.getChartScrollLeft(),

			data: ganttChartDataGridState.data,
			columns: ganttChartDataGridState.columns,
			selectedData: ganttChartDataGridState.selectedData,
			colState: ganttChartDataGridState.colState,
			sortState: ganttChartDataGridState.sortState,
			filterState: ganttChartDataGridState.filterState,
			scrollTop: ganttChartDataGridState.scrollTop,
			selectedTreeNodeIdPath: ganttChartDataGridState.selectedTreeNodeIdPath,
		}
	}

	/**
	 * 初期化します.
	 * @param serviceParam パラメータ
	 * @param isEmitEvent イベントエミットフラグ(true:エミットする、false:エミットしない)
	 */
	public initialize(serviceParam?: any, isEmitEvent?: boolean): void {
		throw new Error('no implementation');
	}

	/**
	 * 表示データを設定します.
	 *
	 * @param treeNodes ガントチャートツリーノードリスト
	 */
	public setData(treeNodes: EIMGanttChartTreeNode[]): void {

		// データグリッドに設定
		this.ganttChartDataGrid.setData(treeNodes);
		const displayTreeNodes: EIMGanttChartTreeNode[] = 
				this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];

		this.initializeTaskItems(displayTreeNodes);
		this.initializeDisplayRange();

		this.removeEventListener();

		window.setTimeout(() => {
			this.addEventListener();
			//this.initializePIdMap();
			this.displayWeekend();
			// this.addGanttBarLabels(); // ラベル表示処理を無効化

			//this.initializeRowClass();
		});
	}

	/**
	 * 行を取得します.
	 * @return 取得した行データ
	 */
	public getData(): any[] {
		return this.ganttChartDataGrid.getData();
	}

	/**
	 * 行を選択します.
	 * @param selectedTreeNodes 選択させる行データ
	 * @param isEmitEvent イベントエミットフラグ(true:エミットする、false:エミットしない)
	 */
	public select(selectedTreeNodes: EIMGanttChartTreeNode[], isEmitEvent: boolean = true): void {

		// データグリッドの行を選択する
		this.ganttChartDataGrid.select(selectedTreeNodes);

		// チャートの行を選択する
		this.selectChartRow(selectedTreeNodes);

		if (isEmitEvent) {
			this.selected.emit();
		}
	}


	/**
	 * 選択されているガントチャートタスク情報リストを返却します.
	 * @return ガントチャートタスク情報リスト
	 */
	public getSelectedData(): any[] {
		return this.ganttChartDataGrid.getSelectedData();
	}

	/**
	 * リスト形式簡易結果DTOを表示データとして設定します.
	 *
	 * @param listFormatResult リスト形式の簡易結果DTO
	 */
	public setListFormatResult(
			listFormatResult: EIMListFormatResultDTO) {

		// データグリッドに設定
		this.ganttChartDataGrid.setListFormatResult(listFormatResult);

		const displayTreeNodes = this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];

		this.initializeTaskItems(displayTreeNodes);
		this.initializeDisplayRange();

		this.removeEventListener();

		window.setTimeout(() => {
			this.addEventListener();
			//this.initializePIdMap();
			this.displayWeekend();
			// this.addGanttBarLabels(); // ラベル表示処理を無効化

			//this.initializeRowClass();
		});
	}

	/**
	 * ツリー形式の簡易結果DTOを表示データとして設定します.
	 *
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 */
	public setTreeFormatResult(
			treeFormatResult: EIMTreeFormatResultDTO): void {

		// データグリッドに設定
		this.ganttChartDataGrid.setTreeFormatResult(treeFormatResult);

		const displayTreeNodes = this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];

		this.initializeTaskItems(displayTreeNodes);
		this.initializeDisplayRange();

		this.removeEventListener();

		window.setTimeout(() => {
			this.addEventListener();
			//this.initializePIdMap();
			this.displayWeekend();
			// this.addGanttBarLabels(); // ラベル表示処理を無効化

			//this.initializeRowClass();
		});
	}

	/**
	 * ツリー形式の簡易結果DTOをツリーの階層に設定します.<br>
	 * treeFormatResultの1階層目のノードと同じノードに対して子階層を設定します.
	 *
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 */
	public setChildTreeFormatResult(
			treeFormatResult: EIMTreeFormatResultDTO): void {

		const scrollTop = this.getScrollTop();
		const chartScrollLeft = this.getChartScrollLeft();

		this.ganttChartDataGrid.setChildTreeFormatResult(treeFormatResult);

		const displayTreeNodes = this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];
		this.initializeTaskItems(displayTreeNodes);

		window.setTimeout(() => {
			this.setScrollTop(scrollTop);
			this.setChartScrollLeft(chartScrollLeft);
		});

	}

	/**
	 * DTOをツリーコンポーネント用のツリーノードに変換します.
	 * 
	 * @param dto DTO
	 * @return ツリーコンポーネント用のツリーノード
	 */
	public convertDTOToTreeNode(dto: any): EIMGanttChartTreeNode {

		let treeNode: EIMGanttChartTreeNode = {
			treeNodeId: '' + dto.id,
			dto: dto,
			leaf: false,
			expanded: false,
			type: 'TASK',
			label: dto.name,
			startDate: null,
			endDate: null,
			className: null,
			completionPercent: 0,
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
	 * ツリーノードに対して追加でプロパティ設定する関数です.
	 * データグリッドのconvertDTOToTreeNode()の結果をガントチャート用に上書きします.
	 * 
	 * @param treeNode ツリーノード（未使用）
	 * @param dto DTO
	 * @returns ガントチャート用ツリーノード
	 */
	public setAdditionalPropertiesToTreeNodeFunctionForGanttChart(
			treeNode: EIMGanttChartTreeNode, dto: any): EIMGanttChartTreeNode {

		return this.convertDTOToTreeNode(dto);
	}

	/**
	 * ツリーノードリストを追加します.
	 *
	 * @param parentTreeNode 追加先の親ツリーノード(ルートの場合はnullを指定)
	 * @param childTreeNodes 追加するツリーノードリスト
	 * @param indexInParentTreeNodes 親ツリーノードでのインデックス（先頭は0、末尾は未指定）
	 */
	public setChildTreeNodesToIndex(_parentTreeNode: EIMGanttChartTreeNode, childTreeNodes: EIMGanttChartTreeNode[], indexInParentTreeNodes = -1): void {

		this.ganttChartDataGrid.setChildTreeNodesToIndex(_parentTreeNode, childTreeNodes, indexInParentTreeNodes);

		this.refreshChartView();
//for (let child of childTreeNodes) {
//this.ganttItems.push(this.convertToGanttItem(child));
// }
}

	/**
	 * 指定したツリーノードリストを更新します.
	 * @param treeNodes 更新するツリーノードリスト
	 */
	public updateTreeNodes(treeNodes: EIMGanttChartTreeNode[]): void {

		for (let i = 0; i < treeNodes.length; i++) {

			// EIMGanttChartTreeNode
			const treeTreeNode = this.getTreeNodeByTreeNodeId(treeNodes[i].treeNodeId);
			this.copyGanttChartTreeNode(treeTreeNode, treeNodes[i]);

		}

		this.refreshChartView();
	}

	/**
	 * 指定したツリーノードリストを削除します.
	 * @param treeNodes 更新するツリーノードリスト
	 */
	public removeTreeNodes(treeNodes: EIMGanttChartTreeNode[]): void {

		this.ganttChartDataGrid.removeTreeNodes(treeNodes);

		this.refreshChartView();
	}

	/**
	 * カラムをセットします.
	 * @param columns セットするカラム
	 */
	public setColumns(columns: (EIMDataGridColumn | EIMDataGridColumnGroup)[]): void {
		this.ganttChartDataGrid.setColumns(columns);
	}

	/**
	 * チャートをリフレッシュします.
	 */
	public refreshChartView(): void {

		const scrollTop = this.getScrollTop();
		const chartScrollLeft = this.getChartScrollLeft();

		const displayTreeNodes = this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];
		this.initializeTaskItems(displayTreeNodes);

		this.initializeDisplayRange();

		window.setTimeout(() => {
			this.displayWeekend();
			// this.addGanttBarLabels(); // ラベル表示処理を無効化

			this.setScrollTop(scrollTop);
			this.setChartScrollLeft(chartScrollLeft);
		});

	}

	/**
	 * グリッドの行を再描画します.
	 * @params rows 更新対象の行情報リスト
	 */
	public redrawRows(rows?: any): void {
		this.ganttChartDataGrid.redrawRows(rows);
	}

	/**
	 * スクロール位置を取得します.
	 * @return スクロール位置
	 */
	public getScrollTop(): number {
		return this.ganttChartDataGrid.getScrollTop();
	}

	/**
	 * スクロール位置を設定します.
	 * @param pos スクロール位置
	 */
	public setScrollTop(pos: number): void {
		this.ganttChartDataGrid.setScrollTop(pos);
	}

	/**
	 * ツリーノードを返却します.
	 *
	 * @param dto
	 * @returns
	 */
	public getTreeNodeByDTO(dto: any): EIMGanttChartTreeNode {
		return this.ganttChartDataGrid.getTreeNodeByDTO(dto) as EIMGanttChartTreeNode;
	}

	/**
	 * ガントチャートタスク情報を返却します.
	 * @param treeNodeId id
	 * @returns ガントチャートタスク情報
	 */
	public getTreeNodeByTreeNodeId(treeNodeId: string): EIMGanttChartTreeNode {

		return this.ganttChartDataGrid.getTreeNodeByTreeNodeId(treeNodeId) as EIMGanttChartTreeNode;
	}

	/**
	 * フォーマット（表示期間単位）を選択します.
	 *
	 * @param format フォーマット（表示期間単位）
	 */
	public selectFormat(format: string): void {
		// Convert format to @worktile/gantt view type
		switch(format) {
			case EIMGanttChartFormatItemEnum.QUARTER:
				this.ganttViewType = GanttViewType.quarter;
				break;
			case EIMGanttChartFormatItemEnum.MONTH:
				this.ganttViewType = GanttViewType.month;
				break;
			case EIMGanttChartFormatItemEnum.WEEK:
				this.ganttViewType = GanttViewType.week;
				break;
			case EIMGanttChartFormatItemEnum.DAY:
			default:
				this.ganttViewType = GanttViewType.day;
				break;
		}

		// セカンダリヘッダーの幅を設定
		this.ganttViewOptions.cellWidth = this.secondaryHeaderWidthMap.get(this.selectedFormat);

		// ビュー切り替え時にstart/endが正しく更新されるようにする
		this.updateGanttStartEnd();
	}

	/**
	 * チャート横スクロール位置を取得します.
	 * @return チャート横スクロール位置
	 */
	public getChartScrollLeft(): number {
		if (this.ganttContainer && this.ganttContainer.nativeElement) {
			return this.ganttContainer.nativeElement.scrollLeft;
		}
		return 0;
	}
	
	/**
	 * チャート横スクロール位置を設定します.
	 * @param scrollLeft チャート横スクロール位置
	 */
	public setChartScrollLeft(scrollLeft: number): void {
		if (this.ganttContainer && this.ganttContainer.nativeElement) {
			this.ganttContainer.nativeElement.scrollLeft = scrollLeft;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		// オプション設定を反映
		if (typeof this.options !== 'undefined') {

			// データグリッドオプション初期化
			this.initializeGanttChartDataGridOptions();

			// 同一行判定関数
			if (typeof this.options.equals !== 'undefined') {
				this.equals = this.options.equals;
			} else {
				this.ganttChartDataGridOptions.equals = this.defaultEquals;
				this.equals = this.defaultEquals;
			}

			// 複数行選択可フラグ
			if (typeof this.options.multiple !== 'undefined') {
				this.multiple = this.options.multiple;
			}

			if (typeof this.options.setAdditionalPropertiesToTreeNodeFunction !== 'undefined') {
				this.setAdditionalPropertiesToTreeNodeFunction = this.options.setAdditionalPropertiesToTreeNodeFunction;
			}

			if (typeof this.options.setAdditionalTreeNodeRelationFunction !== 'undefined') {
				this.setAdditionalTreeNodeRelationFunction = this.options.setAdditionalTreeNodeRelationFunction;
			}

			if (typeof this.options.rowClassFunction !== 'undefined') {
				this.rowClassFunction = this.options.rowClassFunction;
			}

			if (typeof this.options.defaultFormatItemValue !== 'undefined') {
				this.selectedFormat = this.options.defaultFormatItemValue;
				this.selectFormat(this.selectedFormat);
			}

		}

		this.minDate = this.clearHours(this.addDays(new Date(), -this.extraDays - 2));
		this.minDateByDateFormat = this.getMinDateByDateFormat();
		this.maxDate = this.clearHours(this.addDays(new Date(), this.extraDays));
		this.maxDateByDateFormat = this.getMaxDateByDateFormat();

		// Initialize gantt dates for @worktile/gantt
		this.ganttStart = this.minDate;
		this.ganttEnd = this.maxDate;
	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges) {

		// optionsが変更された場合
		if (changes['options'] !== undefined) {

			// データグリッドコンポーネントのoptionsを初期化
			this.initializeGanttChartDataGridOptions();

		}

	}

	/**
	 * View初期化後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {
		// スクロール同期の設定
		this.setupScrollSync();

		window.setTimeout(() => {
			this.addEventListener();
			this.displayWeekend();
			// this.addGanttBarLabels(); // ラベル表示処理を無効化
		}, 0);
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		// Cleanup if needed
		this.cleanupScrollSync();
	}

	/**
	 * 左ペインのデータグリッド選択変更時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	onChangedDataGridRowSelection(event) {

		const selectedTreeNodes: EIMGanttChartTreeNode[] = this.ganttChartDataGrid.getSelectedData();

		// チャートの行を選択する
		this.selectChartRow(selectedTreeNodes);

		// ガントチャート側の選択も同期
		if (this.ganttComponent && selectedTreeNodes.length > 0) {
			const selectedIds = selectedTreeNodes.map(node => node.treeNodeId);
			// NgxGanttComponentの選択APIを使用（存在する場合）
			if (this.ganttComponent.selectionModel) {
				this.ganttComponent.selectionModel.clear();
				this.ganttComponent.selectionModel.select(...selectedIds);
			}
		}

		this.changed.emit(event);

	}

	/**
	 * ソート条件変更時のイベントハンドラです.
	 * 
	 * @param event イベント
	 */
	onSortChanged(event) {

		this.refreshChartView();
	}
	
	/**
	 * フィルタ変更時のイベントハンドラです.
	 * 
	 * @param event イベント
	 */
	onFilterChanged(event) {

		this.refreshChartView();
	}

	/**
	 * データグリッドの行ダブルクリック時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	onDoubleClickedDataGridRow(event): void {

		this.doubleClicked.emit(event);
	}

	/**
	 * グリッド表示/チャート表示切り替え時のハンドラです.
	 *
	 * @param event イベント
	 */
	onChangeView(event): void {
		// View change handling for @worktile/gantt
	}

	/**
	 * 月/週/日表示形式切り替え時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	onChangeFormat(event): void {
		this.selectFormat(this.selectedFormat);

//		this.removeEventListener();

		window.setTimeout(() => {
//			this.addEventListener();
			//this.initializePIdMap();
			this.displayWeekend();
			// this.addGanttBarLabels(); // ラベル表示処理を無効化

			//this.initializeRowClass();
		});

	}

	/**
	 * ツリー開閉時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	onExpanded(event): void {

		const treeNode: EIMGanttChartTreeNode = event.expandedData;
		if (treeNode.childTreeNodes !== null && treeNode.childTreeNodes.length !== 0) {

			this.refreshChartView();
		}
		this.expanded.emit(event);
	}

	/**
	 * ガントチャートマウスホイール時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
    onRightChartContainerWheel(event: WheelEvent) {
		event.preventDefault();
		// 横スクロールの実装
		const chartElement: HTMLElement = this.getChartHScrollTargetHTMLElement();

		if (chartElement) {
			const scrollAmount = event.deltaY;
			chartElement.scrollLeft += scrollAmount;
		}
    }

	/**
	 * ガントチャートのバークリック時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	onGanttBarClick(event: GanttBarClickEvent): void {
		// バークリック時にデータグリッドの選択を同期
		if (event && event.item && event.item.origin) {
			const treeNode = event.item.origin as EIMGanttChartTreeNode;
			this.ganttChartDataGrid.select([treeNode], false);
			this.selected.emit();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ガントチャート表示用のタスクアイテム情報を初期化します.
	 *
	 * @param treeNodes ガントチャートタスク情報リスト
	 */
	protected initializeTaskItems(treeNodes: EIMGanttChartTreeNode[]): void {

		let ganttItems: GanttItem[] = [];

		for (const treeNode of treeNodes) {
			ganttItems.push(this.convertToGanttItem(treeNode));
		}

		this.ganttItems = ganttItems;
		//this.weekendElementMap = new Map();
	}

	/**
	 * デフォルトの同一行判定関数です.
	 * 比較対象のIDが等しいかどうか判定します.
	 *
	 * @param a 比較対象A
	 * @param b 比較対象B
	 * @returns 比較対象A/Bが等しければtrue
	 */
	protected defaultEquals(a: any, b: any): boolean {
		return a.treeNodeId === b.treeNodeId;
	}

	/**
	 * ガントチャートタスク情報を@worktile/ganttのGanttItem情報に変換します.
	 *
	 * @param task ガントチャートタスク情報
	 * @returns @worktile/ganttのGanttItem情報
	 */
	protected convertToGanttItem(task: EIMGanttChartTreeNode): GanttItem {
		let type: GanttItemType = GanttItemType.bar;
		if (task.type === 'TASK_GROUP') {
			type = GanttItemType.range;
		}

		return {
			id: task.treeNodeId,
			title: task.label || '',
			start: task.startDate,
			end: task.endDate,
			color: task.className,
			progress: task.completionPercent ? task.completionPercent / 100 : 0,
			type: type,
			expanded: task.expanded,
			//children: task.childTreeNodes?.map(child => this.convertToGanttItem(child)),
			origin: task
		};
	}

	/**
	 * 日付に日数を追加した日付の文字列を返却します.
	 *
	 * @param date 日付
	 * @param extraDays 日数
	 * @returns 日付に日数を追加した日付の文字列
	 */
	private addDays(date: Date, extraDays) {
		let newDate = new Date();
		newDate.setTime(date.getTime());
		newDate.setDate(newDate.getDate() + extraDays);

		return newDate;
	}

	/**
	 * EIMGanttChartTreeNodeをコピーします. leaf/expand/parentTreeNode/childTreeNodesはコピーしません.
	 * 
	 * @param toTreeNode コピー先のEIMGanttChartTreeNode
	 * @param fromTreeNode コピー元のEIMGanttChartTreeNode
	 * @returns コピー後のEIMGanttChartTreeNode
	 */
	protected copyGanttChartTreeNode(toTreeNode: EIMGanttChartTreeNode, fromTreeNode: EIMGanttChartTreeNode): EIMGanttChartTreeNode {

		toTreeNode.dto = fromTreeNode.dto;
		toTreeNode.type = fromTreeNode.type;
		toTreeNode.label = fromTreeNode.label;
		toTreeNode.startDate = fromTreeNode.startDate;
		toTreeNode.endDate = fromTreeNode.endDate;
		toTreeNode.className = fromTreeNode.className;
		toTreeNode.completionPercent = fromTreeNode.completionPercent;
		toTreeNode.options = fromTreeNode.options;

		return toTreeNode;
	}

	/**
	 * データグリッドオプションを初期化します.
	 */
	protected initializeGanttChartDataGridOptions(): void {
		
		if (typeof this.options === 'undefined') {
			return;
		}

		this.ganttChartDataGridOptions = {
			// ツリー表示するかどうか
			enableTreeView: this.options.enableTreeView,

			// コンポーネントサービス
			componentService: this.options.componentService,

			// コンテキストメニューアイテム
			contextMenuItems: this.options.contextMenuItems,

			// 同一行判定関数
			equals: this.options.equals,

			// 複数行選択可フラグ
			multiple: this.options.multiple,

			// クリック編集可フラグ
			suppressClickEdit: this.options.suppressClickEdit,

			// 水平スクロール無効化フラグ
			suppressHorizontalScroll: this.options.suppressHorizontalScroll,

			// ヘッダの高さ
			headerHeight: this.options.headerHeight || undefined,

			// 行の高さ
			rowHeight: this.options.rowHeight || undefined,

			// 行のスタイル
			rowStyle: this.options.rowStyle || undefined,

			// 行のクラス
			rowClass: this.options.rowClass || undefined,

			// 行のクラス返却関数
			rowClassFunction: this.options.rowClassFunction,

			// ツリーノードに対して追加でプロパティ設定する関数
			setAdditionalPropertiesToTreeNodeFunction: this.setAdditionalPropertiesToTreeNodeFunctionForGanttChart.bind(this),

			// ツリーノードの親子間の関連設定関数
			setAdditionalTreeNodeRelationFunction: this.options.setAdditionalTreeNodeRelationFunction,
		
		}
	}

	/**
	 * 日付の時分秒をクリアします.
	 * 
	 * @param date 日付
	 * @returns 時分秒をクリアした日付
	 */
	protected clearHours(date: Date): Date {
		date.setHours(0,0,0,0);
		return date;
	}

	/**
	 * グリッドスクロール時のハンドラです.
	 * チャートの縦スクロール位置を揃えます.
	 *
	 * @param event イベント
	 */
	onScrollGrid(event): void {

		const chartElement: HTMLElement = this.getChartVScrollTargetHTMLElement();
		chartElement.scrollTop = event.srcElement.scrollTop;
	}

	/**
	 * チャートスクロール時のハンドラです.
	 * グリッドの縦スクロール位置、チャートのヘッダの横スクロール位置を揃えます.
	 *
	 * @param event イベント
	 */
	onScrollChart(event): void {

		// データグリッドの縦方向スクロール
		//const gridElement: HTMLElement = this.ganttChartDataGrid.getGridContainer().nativeElement.getElementsByClassName('ag-body-viewport')[0];
		//gridElement.scrollTop = event.srcElement.scrollTop;

		// ガントチャートヘッダの横方向スクロール
		//const chartHeaderElement: HTMLElement = this.editor.ganttEditorContainer.nativeElement.getElementsByClassName('gchartlbl')[0];
		//event.srcElement.scrollLeft = Math.min(event.srcElement.scrollLeft, chartHeaderElement.scrollLeft);

		// 週末を表示
		this.displayWeekend();
		// this.addGanttBarLabels(); // ラベル表示処理を無効化
	}

	/**
	 * チャートクリック時のハンドラです.
	 * クリックされた行を選択します.
	 *
	 * @param event イベント
	 */
	public onClickedChartRow(event): void {

		const rowElement: HTMLElement = this.getParentWithClassName(event.srcElement, 'gantt-item');

		if (!rowElement) {
			return null;
		}
		const targetTreeNode = this.getTreeNodeByChartRowElement(rowElement);

		let selectedTreeNodes = this.getSelectedData();

		// シフトキー押下時
		if (this.preSelectedTreeNode && event.shiftKey == true) {

			// 既に選択されているかどうか
			let isSelected = false;
			for (let i = 0; i < selectedTreeNodes.length; i++) {

				if (targetTreeNode.treeNodeId === selectedTreeNodes[i].treeNodeId) {
					isSelected = true;
					break;
				}
			}

			// 既に選択されている場合は選択状態を解除
			if (isSelected) {
				const index = selectedTreeNodes.indexOf(targetTreeNode);
				selectedTreeNodes.splice(index, 1);
			}
			// 選択されていない場合は選択
			else {
				selectedTreeNodes.push(targetTreeNode);
			}

		}
		// Ctrlキー押下時
		else if (this.preSelectedTreeNode && event.ctrlKey == true) {

			// 既に選択されているかどうか
			let isSelected = false;
			for (let i = 0; i < selectedTreeNodes.length; i++) {

				if (targetTreeNode.treeNodeId === selectedTreeNodes[i].treeNodeId) {
					isSelected = true;
					break;
				}
			}

			// 既に選択されている場合は選択状態を解除
			if (isSelected) {
				const index = selectedTreeNodes.indexOf(targetTreeNode);
				selectedTreeNodes.splice(index, 1);
			}
			// 選択されていない場合は選択
			else {
				selectedTreeNodes.push(targetTreeNode);
			}

		}
		// 上記以外
		else {
			selectedTreeNodes = [targetTreeNode];
		}

		this.select(selectedTreeNodes, true);

		this.preSelectedTreeNode = targetTreeNode;
	}

	/**
	 * チャートダブルクリック時のハンドラです.
	 * ダブルクリックされた行のdoubleClickedイベントをエミットします.
	 *
	 * @param event イベント
	 */
	onDoubleClickedChartRow(event): void {
		// タスクバーダブルクリック
		const taskBarElement: HTMLElement = 
			this.getParentWithClassName(event.srcElement, 'gantt-range') ??
			this.getParentWithClassName(event.srcElement, 'gantt-bar') ??
			this.getParentWithClassName(event.srcElement, 'gantt-custom');

		if (taskBarElement) {
			const rowElement: HTMLElement = this.getParentWithClassName(event.srcElement, 'gantt-item');
			if (!rowElement) {
				return null;
			}
			const selectedTreeNode = this.getTreeNodeByChartRowElement(rowElement);

			this.select([selectedTreeNode], true);

			this.doubleClicked.emit({
				event: event,
				data: selectedTreeNode,
			});

		}
	}

	/**
	 * 指定したクラス名が設定されたエレメントを取得します.
	 * 対象エレメントからルート要素の方向に確認し、最初に該当したエレメントを返却します.
	 *
	 * @param element 対象エレメント
	 * @param className クラス名
	 * @returns 指定したクラス名が設定されたエレメント
	 */
	protected getParentWithClassName(element: HTMLElement, className: string): HTMLElement {
		if (!element) {
			return null;
		}
		if (element.classList.contains(className)) {
			return element;
		}

		return this.getParentWithClassName(element.parentElement, className);
	}

	/**
	 * チャートの行のHTMLエレメントに該当するツリーノードを返却します.
	 *
	 * @param chartRowElement チャートの行のHTMLエレメント
	 * @returns ツリーノード情報
	 */
	protected getTreeNodeByChartRowElement(chartRowElement: HTMLElement): EIMGanttChartTreeNode {

		const parentElement: HTMLElement = this.getParentWithClassName(chartRowElement, this.GANTT_MAIN_GROUPS_CLASS_NAME);
		const children = Array.from(parentElement.children);
		const chartRowIndex = children.indexOf(chartRowElement);

		return this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort()[chartRowIndex];

	}

	/**
	 * ngx-ganttの行エレメントに設定されたIDから内部IDを返却します.
	 * @param rowElementId 行エレメントのID
	 * @returns 内部ID
	 */
	protected getIdFromRowElement(rowElementId: string): string {
		return rowElementId.split('_')?.[1];
	}

	/**
	 * IDに該当するngx-ganttのタスクアイテム情報を返却します.
	 * @param id タスクID
	 * @returns ngx-ganttのタスクアイテム情報
	 */
	protected getTaskItemById(id: string): GanttItem {
		// ngx-ganttではganttItemsから直接検索
		return this.ganttItems.find(item => item.id === id);
	}

	/**
	 * ガントチャートの行を選択します.
	 * 
	 * @param selectedTreeNodes 選択対象のツリーノードリスト
	 */
	protected selectChartRow(selectedTreeNodes: EIMGanttChartTreeNode[]): void {

		// 選択行のインデックスセットを設定
		let selectedIndexSet = new Set();
		for (let i = 0; i < selectedTreeNodes.length; i++) {
			const selectedIndex = this.ganttChartDataGrid.getTargetRowIndex(selectedTreeNodes[i]);
			if (selectedIndex === -1) {
				continue;
			}
			selectedIndexSet.add(selectedIndex);
		}

		// 選択行のclassスタイルを追加/削除する
		const treeNodes: EIMGanttChartTreeNode[] = 
				this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];
		for (let i = 0; i < treeNodes.length; i++) {
			if (selectedIndexSet.has(i)) {

				this.addRowClass(i, 'eim-gantt-chart-selected-row');

			} else {

				this.removeRowClass(i, 'eim-gantt-chart-selected-row');

			}
		}
	}

	/**
	 * 指定された行にクラスを追加します.
	 * 
	 * @param rowIndex 行インデックス
	 * @param className クラス名
	 */
	protected addRowClass(rowIndex: number, className: string): void {
		const rightItems = this.getChartRowHTMLElements();
		if (rightItems[rowIndex]) {
			rightItems[rowIndex].classList.add(className);
		}
	}

	/**
	 * 指定された行からクラスを削除します.
	 * 
	 * @param rowIndex 行インデックス
	 * @param className クラス名
	 */
	protected removeRowClass(rowIndex: number, className: string): void {
		const rightItems = this.getChartRowHTMLElements();
		if (rightItems[rowIndex]) {
			rightItems[rowIndex].classList.remove(className);
		}
	}

	/**
	 * ガントチャートの日単位フォーマット表示時の開始日をを返却します.
	 * 
	 * @returns 開始日
	 */
	protected getMinDateByDateFormat(): Date {

		const date = this.minDate;

		const day = date.getDay();
		let weekStartDate = null;

		// 月曜の場合
		if (day === 1) {
			// 1週間前
			weekStartDate = this.addDays(date, -7);
		} 
		// 日曜の場合
		else if (day === 0) {
			weekStartDate = this.addDays(date, -6);
		} 
		else {
			weekStartDate = this.addDays(date, -(day - 1));
		}
		return weekStartDate;
	}

	/**
	 * ガントチャートの日単位フォーマット表示時の終了日をを返却します.
	 * 
	 * @returns 終了日
	 */
	protected getMaxDateByDateFormat(): Date {

		const date = this.maxDate;

		const day = date.getDay();
		let weekEndDate = null;

		// 日曜の場合
		if (day === 0) {
			weekEndDate = this.addDays(date, 7);
		} else {
			weekEndDate = this.addDays(date, (7 - day));
		}
		return weekEndDate;
	}

	/**
	 * ガントチャートの表示範囲（チャート表示最小日、チャート表示最大日）を初期化します.
	 */
	protected initializeDisplayRange(): void {

		const displayTreeNodes: EIMGanttChartTreeNode[] = this.treeNodeService.getTreeNodes(this.ganttChartDataGrid.getData()) as EIMGanttChartTreeNode[];

		// ガントチャートに設定
		const startDates = [];
		const endDates = [];

		for (const treeNode of displayTreeNodes) {
			if (treeNode.startDate !== null) {
				const startDate = new Date(treeNode.startDate);
				if (!isNaN(startDate.getTime())) {
					startDates.push(startDate);
				}
			}
			
			if (treeNode.endDate !== null) {
				const endDate = new Date(treeNode.endDate);
				if (!isNaN(endDate.getTime())) {
					endDates.push(endDate);
				}
			}
		}

		// デフォルトの日付を設定
		if (startDates.length === 0) {
			startDates.push(new Date());
		}
		if (endDates.length === 0) {
			endDates.push(new Date());
		}

		const minStartDate = new Date(Math.min.apply(null, startDates));
		const maxEndDate = new Date(Math.max.apply(null, endDates));

		// 日付が有効か確認
		if (!isNaN(minStartDate.getTime()) && !isNaN(maxEndDate.getTime())) {
			this.minDate = this.clearHours(this.addDays(minStartDate, -this.extraDays));
			this.maxDate = this.clearHours(this.addDays(maxEndDate, this.extraDays));
		} else {
			// フォールバック：現在日付を基準に設定
			const now = new Date();
			this.minDate = this.clearHours(this.addDays(now, -this.extraDays));
			this.maxDate = this.clearHours(this.addDays(now, this.extraDays));
		}

		this.minDateByDateFormat = this.getMinDateByDateFormat();
		this.maxDateByDateFormat = this.getMaxDateByDateFormat();

		// startがendより後にならないようにチェック
		if (this.minDate >= this.maxDate) {
			this.maxDate = this.clearHours(this.addDays(this.minDate, this.extraDays * 2));
		}

		this.ganttStart = this.minDate;
		this.ganttEnd = this.maxDate;
	}

	/**
	 * ガントチャートのstart/endを更新します.
	 */
	protected updateGanttStartEnd(): void {
		if (this.minDate && this.maxDate) {
			// startがendより後にならないようにチェック
			if (this.minDate >= this.maxDate) {
				this.maxDate = this.clearHours(this.addDays(this.minDate, this.extraDays * 2));
			}
			this.ganttStart = this.minDate;
			this.ganttEnd = this.maxDate;
		}
	}

	/**
	 * 週末表示用のラッパー要素を取得します.
	 * 
	 * @param chartElement チャート要素
	 * @returns 週末表示用のラッパー要素
	 */
	protected getWeekendWrapperElement(chartElement): HTMLElement {

		// 週末表示用のラッパー要素を取得
		let weekendWrapperElement: HTMLElement = 
				this.ganttContainer.nativeElement.getElementsByClassName('eim-gantt-chart-weekend-wrapper')?.[0] ?? null;
		if (!weekendWrapperElement) {

			weekendWrapperElement = document.createElement("div");
			weekendWrapperElement.className = 'eim-gantt-chart-weekend-wrapper';
			chartElement.insertBefore(weekendWrapperElement, chartElement.firstChild);
		}

		return weekendWrapperElement;
	}

	/**
	 * ガントバーにラベルと進捗率を追加します.
	 * 注意: 現在この機能は無効化されています。バー表示に影響があるため。
	 */
	protected addGanttBarLabels(): void {
		// ラベル表示機能は一時的に無効化
		// バーの表示に影響があるため、実装を見直す必要があります
		return;
		// レンダリングを待つ
		setTimeout(() => {
			// GANTT_MAIN_GROUPS_CLASS_NAMEを使用してグループ要素を取得
			const ganttGroups = this.ganttContainer?.nativeElement?.querySelector(`.${this.GANTT_MAIN_GROUPS_CLASS_NAME}`);
			
			if (!ganttGroups) {
				console.warn('Gantt groups container not found, retrying...');
				// setTimeout(() => this.addGanttBarLabels(), 1000); // ラベル表示処理を無効化
				return;
			}
			
			// getChartRowHTMLElements()を使用して行要素を取得
			const rowElements = this.getChartRowHTMLElements();
			const displayTreeNodes = this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort() as EIMGanttChartTreeNode[];
			
			rowElements.forEach((rowElement: HTMLElement, index: number) => {
				if (index >= displayTreeNodes.length) return;
				
				const treeNode = displayTreeNodes[index];
				if (!treeNode) return;
				
				// 開始日と終了日がない場合はスキップ
				if (!treeNode.startDate || !treeNode.endDate) return;
				
				// バー要素を探す
				const barElement = rowElement.querySelector('.gantt-bar, .gantt-item-bar, [class*="gantt-bar"]') as HTMLElement;
				if (!barElement) return;
				
				// 既存のカスタムラベルをクリア
				rowElement.querySelectorAll('.custom-gantt-label-container, .custom-gantt-progress').forEach(el => el.remove());
				
				// 行要素を相対配置に
				rowElement.style.position = 'relative';
				
				// タイトルラベルを追加（バーに重ねて表示）
				if (treeNode.label) {
					// バーの位置とサイズを取得
					const barRect = barElement.getBoundingClientRect();
					const rowRect = rowElement.getBoundingClientRect();
					const barLeft = barRect.left - rowRect.left;
					const barWidth = barElement.offsetWidth;
					
					// ラベルを作成
					const label = document.createElement('div');
					label.className = 'custom-gantt-label';
					label.textContent = treeNode.label;
					
					// ラベルの位置とサイズを設定（インラインスタイルで位置のみ指定）
					label.style.position = 'absolute';
					label.style.left = `${barLeft + 4}px`;
					label.style.top = '50%';
					label.style.transform = 'translateY(-50%)';
					label.style.maxWidth = `${barWidth - 8}px`;
					label.style.width = `${barWidth - 8}px`;
					
					rowElement.appendChild(label);
				}
				
				// 進捗率ラベルを追加（バーの右側、背景透明）
				const completionPercent = treeNode.completionPercent;
				if (completionPercent !== undefined && completionPercent !== null && completionPercent > 0) {
					const barRect = barElement.getBoundingClientRect();
					const rowRect = rowElement.getBoundingClientRect();
					const barRight = barRect.right - rowRect.left;
					
					const progressLabel = document.createElement('div');
					progressLabel.className = 'custom-gantt-progress';
					progressLabel.textContent = `${Math.round(completionPercent)}%`;
					progressLabel.style.position = 'absolute';
					progressLabel.style.left = `${barRight + 5}px`;
					progressLabel.style.top = '50%';
					progressLabel.style.transform = 'translateY(-50%)';
					rowElement.appendChild(progressLabel);
				}
			});
			
		}, 500);
	}

	/**
	 * 週末を表示します.
	 */
	protected displayWeekend(): void {

		// 日単位の場合のみ週末表示対象
		if (this.selectedFormat !== EIMGanttChartFormatItemEnum.DAY) {

			// チャート要素を取得
			const chartElement: HTMLElement = this.getChartHScrollTargetHTMLElement();
			// チャート内の週末表示用ラッパー要素
			const weekendWrapperElement: HTMLElement = this.getWeekendWrapperElement(chartElement);

			for (const time of [...this.weekendElementMap.keys()]) {
	
				// 表示対象外のエレメント
				const element: HTMLElement = this.weekendElementMap.get(time);
				weekendWrapperElement.removeChild(element);
				this.weekendElementMap.delete(time);
			}

			return;
		}

		// チャート要素を取得
		const chartElement: HTMLElement = this.getChartHScrollTargetHTMLElement();
		// チャート内のテーブル要素を取得
		const chartTableElement: HTMLElement = this.getChartRowContainerHTMLElement();
		// チャート内の週末表示用ラッパー要素
		const weekendWrapperElement: HTMLElement = this.getWeekendWrapperElement(chartElement);
		// セカンダリヘッダーの1列単位の幅を設定
		const secondaryHeaderColWidth = this.secondaryHeaderWidthMap.get(this.selectedFormat);

		// チャートの表示幅
		const clientWidth = chartElement.clientWidth;
		// チャートの水平スクロール位置
		const scrollLeft = chartElement.scrollLeft;
		// チャートの全行表示時の高さ
		const displayTreeNodes = this.ganttChartDataGrid.getDisplayTreeNodesAfterFilterAndSort();
		const height = Math.min(chartElement.clientHeight, displayTreeNodes.length * 26);
		
		// 画面表示中の左端の日付を取得
		const subDisplayMinDays: number = Math.floor(scrollLeft / secondaryHeaderColWidth);
		const displayMinDate = this.addDays(this.minDateByDateFormat, subDisplayMinDays);
		const displayMinDateTime = displayMinDate.getTime();

		// 画面表示中の右端の日付を取得
		const subDisplayMaxDays: number = Math.ceil((scrollLeft + clientWidth) / secondaryHeaderColWidth);
		const displayMaxDateTime = Math.min(this.addDays(this.minDateByDateFormat, subDisplayMaxDays).getTime(), this.maxDateByDateFormat.getTime());

		// 表示対象外のエレメントを抽出
		const hideWeekendElements: HTMLElement[] = [];
		for (const time of [...this.weekendElementMap.keys()]) {
			if (displayMinDateTime <= time && time <= displayMaxDateTime) {

				// 表示中の週末エレメントの高さを調整（ツリー開閉による表示行数の増減に合わせるため）
				const weekendElement: HTMLElement = this.weekendElementMap.get(time);
				weekendElement.style.height = height + "px";
				continue;
			}

			// 表示対象外のエレメント
			const element: HTMLElement = this.weekendElementMap.get(time);
			element.style.left = "-100px";
			hideWeekendElements.push(element);
			this.weekendElementMap.delete(time);
		}

		// 画面表示中の日数
		const diffDay = ((displayMaxDateTime - displayMinDateTime) / (24 * 60 * 60 * 1000)) + 1;
		for (let i = 0; i < diffDay; i++) {
			// 表示範囲内の日数分繰り返す
			const targetDate = this.addDays(displayMinDate, i);

			// 0:日曜,6:土曜
			if (targetDate.getDay() === 0 || targetDate.getDay() === 6) {

				const targetDateTime = targetDate.getTime();
				//const targetDateElement = secondaryHeaderElements[subDisplayMinDays + i];

				let weekendElement: HTMLElement = null;

				// 週末表示済みの場合
				if (this.weekendElementMap.has(targetDateTime)) {
					continue;
				}

				// 以降、週末非表示
				
				// 未使用のエレメントが存在しない場合
				if (hideWeekendElements.length === 0) {
					// エレメントの追加が必要な場合
					weekendElement = document.createElement("div");
					weekendWrapperElement.appendChild(weekendElement);
					weekendElement.className = 'eim-gantt-chart-weekend';
					weekendElement.style.width = secondaryHeaderColWidth + "px";
				}
				// 未使用のエレメントが存在する場合
				else {
					weekendElement = hideWeekendElements.shift();
				}

				const weekendOffset = ((targetDateTime - this.minDateByDateFormat.getTime()) / (24 * 60 * 60 * 1000)) * secondaryHeaderColWidth;
				weekendElement.style.top = "0px";
				weekendElement.style.left = weekendOffset + "px";
				weekendElement.style.height = height + "px";

				this.weekendElementMap.set(targetDateTime, weekendElement);
			}
		}

		// 未使用のエレメントを削除
		hideWeekendElements.forEach(weekendElement => {
			weekendWrapperElement.removeChild(weekendElement);
		});
	}

	/**
	 * 要素にイベントハンドラを追加します.
	 */
	protected addEventListener(): void {

		// 右ペインのチャートクリックイベントハンドラ追加
		this.onClickedChartRow = this.onClickedChartRow.bind(this);
		this.getChartHScrollTargetHTMLElement().addEventListener('click', this.onClickedChartRow);

		// 右ペインのチャートダブルクリックイベントハンドラ追加
		this.onDoubleClickedChartRow = this.onDoubleClickedChartRow.bind(this);
		this.getChartHScrollTargetHTMLElement().addEventListener('dblclick', this.onDoubleClickedChartRow);

		// データグリッドスクロールイベントハンドラ追加
		const gridContainerElement: HTMLElement = this.ganttChartDataGrid.getGridContainer()?.nativeElement;
		this.onScrollGrid = this.onScrollGrid.bind(this);
		gridContainerElement?.getElementsByClassName('ag-body-viewport')?.item(0)?.addEventListener('scroll', this.onScrollGrid);

		// 右ペインのチャートスクロールイベントハンドラ追加
		this.onScrollChart = this.onScrollChart.bind(this);
		this.getChartHScrollTargetHTMLElement()?.addEventListener('scroll', this.onScrollChart);
	}

	/**
	 * 要素のイベントハンドラを除去します.<br>
	 * 再描画前に呼び出してください.再描画後はaddEventListener()を呼び出し、
	 * 新しいHTMLエレメントに対してイベントハンドラを追加してください.
	 */
	protected removeEventListener(): void {

		const rightItems = this.getChartRowHTMLElements();
		for (let i = 0; i < rightItems.length; i++) {
			// 右ペインのチャートクリックイベントハンドラ除去
//			rightItems[i].removeEventListener('click', this.onClickedChartRow);
			// 右ペインのチャートダブルクリックイベントハンドラ除去
			rightItems[i].removeEventListener('dblclick', this.onDoubleClickedChartRow);
		}
		this.getChartHScrollTargetHTMLElement().removeEventListener('click', this.onClickedChartRow);

		// データグリッドスクロールイベントハンドラ除去
		const gridContainerElement: HTMLElement = this.ganttChartDataGrid.getGridContainer()?.nativeElement;
		gridContainerElement?.getElementsByClassName('ag-body-viewport')?.item(0)?.removeEventListener('scroll', this.onScrollGrid);

		// 右ペインのチャートスクロールイベントハンドラ除去
		const chartContainerElement: HTMLElement = this.getChartHScrollTargetHTMLElement();
		this.getChartHScrollTargetHTMLElement()?.removeEventListener('scroll', this.onScrollChart);
	}

	/**
	 * ガントチャートの水平スクロール対象のHTML要素を取得します.
	 * 
	 * @returns ガントチャートの水平スクロール対象のHTML要素
	 */
	protected getChartHScrollTargetHTMLElement(): HTMLElement {
		return this.ganttContainer.nativeElement.getElementsByClassName('gantt-main-container')[0];
	}

	/**
	 * ガントチャートの垂直スクロール対象のHTML要素を取得します.
	 * 
	 * @returns ガントチャートの垂直スクロール対象のHTML要素
	 */
	protected getChartVScrollTargetHTMLElement(): HTMLElement {
		return this.ganttContainer.nativeElement.getElementsByClassName('gantt-virtual-scroll-viewport')[0];
	}

	/**
	 * ガントチャートの行のコンテナのHTML要素を取得します.
	 * 
	 * @returns ガントチャートの行のコンテナのHTML要素
	 */
	protected getChartRowContainerHTMLElement(): HTMLElement {
		return this.ganttContainer.nativeElement.getElementsByClassName(this.GANTT_MAIN_GROUPS_CLASS_NAME)[0];

	}

	/**
	 * ガントチャートの行のコンテナのHTML要素を取得します.
	 * 
	 * @returns ガントチャートの行のコンテナのHTML要素
	 */
	protected getChartRowHTMLElements(): HTMLElement[] {
		return this.convertHTMLCollectionToHTMLElementArray(
			this.ganttContainer.nativeElement.getElementsByClassName(this.GANTT_MAIN_GROUPS_CLASS_NAME)[0].children);

	}

	/**
	 * HTMLCollectionをHTMLElementリストに変換します.
	 *
	 * @param collection HTMLCollection
	 * @returns HTMLElementリスト
	 */
	protected convertHTMLCollectionToHTMLElementArray(collection: HTMLCollection): HTMLElement[] {
		return Array.prototype.slice.call(collection);
	}

	/**
	 * スクロール同期を設定します.
	 */
	private setupScrollSync(): void {
		// データグリッドとガントチャートの縦スクロールを同期
		if (this.ganttContainer && this.ganttContainer.nativeElement) {
			// TODO: データグリッドのgetScrollElementメソッドが実装されている場合のみ同期
		}
	}

	/**
	 * スクロール同期をクリーンアップします.
	 */
	private cleanupScrollSync(): void {
		// TODO: スクロールイベントリスナーのクリーンアップ
	}
}
