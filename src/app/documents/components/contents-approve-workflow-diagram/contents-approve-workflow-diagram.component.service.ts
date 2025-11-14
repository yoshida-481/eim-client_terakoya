import cytoscape from "cytoscape";

import { EventEmitter, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramOptions, EIMDiagramComponentInfo, EIMDiagramEdgeEx, EIMDiagramNodeEx } from 'app/shared/components/diagram/diagram.component.service';

import { EIMWorkflowService, EIMWorkflow, EIMWorkflowStatusType, EIMWorkflowEventType } from 'app/documents/shared/services/apis/workflow.service';
import { EIMApproveUserDTO } from 'app/documents/shared/dtos/approve-user.dto';
import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged } from './contents-approve-workflow-diagram.component';

/** ダイアグラム情報 */
export interface EIMContentsApproveWorkflowDiagramComponentInfo extends EIMDiagramComponentInfo {
	workflow?: EIMWorkflow;
	events?: any;
	statusList?: EIMApproveStatusDTO[];
}

/** ダイアグラム情報 */
export interface EIMContentsApproveWorkflowDiagramComponentCyInfo {
	globalId: number;
	firstStatusType: EIMWorkflowStatusType;
	currentStatusType: EIMWorkflowStatusType;
}

/**
 * 承認画面用ワークフローダイアグラムコンポーネントコンポーネントサービス.
 */
@Injectable()
export class EIMContentsApproveWorkflowDiagramComponentService extends EIMDiagramComponentService {
	/** ステータスタイプラベルの1行の最大文字数 */
	static readonly MAX_LABEL_STRING_LENGTH: number = 10;
	/** ステータスタイプヘッダラベルの最大行数 */
	static readonly MAX_HEADER_LABEL_ROW_LENGTH: number = 2;
	/** ステータスタイプボディラベルの最大行数 */
	static readonly MAX_BODY_LABEL_ROW_LENGTH: number = 2;

	/** ステータスタイプの幅 */
	static readonly STATUS_TYPE_WIDTH: number = 110;
	/** ステータスタイプのヘッダの高さ */
	static readonly STATUS_TYPE_HEADER_HEIGHT: number = 25;
	/** ステータスタイプのボディのデフォルト高さ */
	static readonly STATUS_TYPE_BODY_HEIGHT_DEFAULT: number = 50;
	/** イベントタイプラベルの1行の最大文字数 */
	static readonly EVENT_TYPE_MAX_LABEL_STRING_LENGTH: number = 11;
	/** イベントタイプラベルの最大行数 */
	static readonly EVENT_TYPE_MAX_LABEL_ROW_LENGTH: number = 1;
	/** ステータスタイプ間の距離 */
	static readonly STATUS_TYPE_SPACE_WIDTH: number = 30;

	/** ボディの表示可能行数 */
	static readonly BODY_ROW_LENGTH: number = 3;
	/** 承認依頼者・承認者の1行の最大文字数 */
	static readonly USERNAME_MAX_LABEL_STRING_LENGTH: number = 11;

	/** デフォルトズーム値 */
	static readonly DEFAULT_ZOOM: number = 1.5;

	/** ステータスタイプラベルの1行の表示限界範囲 */
	static readonly MAX_LABEL_PIXEL_LENGTH: number = EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH - 4;

	/** ノードタイプ（ヘッダ） */
	static readonly NODE_TYPE_HEADER = 'header';
	/** ノードタイプ（ボディ） */
	static readonly NODE_TYPE_BODY = 'body';
	/** ノードタイプ（承認者選択） */
	static readonly NODE_TYPE_APPROVER_SELECT = 'approver-select';
	/** ノードタイプ（スキップ） */
	static readonly NODE_TYPE_SKIP = 'skip';
	/** ノードタイプ（スキップ不可） */
	static readonly NODE_TYPE_DISABLED_SKIP = 'disable-skip';

	/** ステータスタイプのボディの高さ */
	protected status_type_body_height = EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_BODY_HEIGHT_DEFAULT;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected workflowService: EIMWorkflowService,
			protected translateService: TranslateService,
			protected approveService: EIMApproveService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			public zone: NgZone
	) {
		super(zone);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param info ダイアグラム情報
	 * @param serviceParam パラメータ
	 * @param initialize 初期化完了エミッタ
	 * @param changed 選択変更エミッタ
	 * @param statusTypeChanged ステータスタイプ変更エミッタ
	 */
	public initialize(info: EIMDiagramComponentInfo, serviceParam?: any, initialize?: EventEmitter<any>, changed?: EventEmitter<any>, selected?: EventEmitter<any>, statusTypeChanged?: EventEmitter<EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged>): void {
		// DOM要素の存在確認
		if (!info.cy) {
			console.warn('Container element not found for Cytoscape initialization');
			return;
		}

		// info.cyがDOM要素の場合、containersに保存
		const containerElement = info.cy;
		info.options.container = containerElement;
		this.setOptions(info.options);

		// Angularとは無関係なのでChange Detectionを発生させないようにする
		this.zone.runOutsideAngular( () => {
			try {
				// Cytoscapeインスタンスを作成
				const cyInstance = cytoscape(info.options as cytoscape.CytoscapeOptions);
				// 成功したらinfo.cyを更新
				info.cy = cyInstance;
			} catch (error) {
				console.error('Failed to initialize Cytoscape:', error);
				// エラー時はinfo.cyをDOM要素に戻す
				info.cy = containerElement;
				return;
			}
		});

		// Cytoscapeインスタンスが正常に作成されたか確認
		if (!info.cy || typeof info.cy.on !== 'function') {
			console.error('Cytoscape instance not properly initialized');
			return;
		}

		info.cy.on('select', 'node, edge', (event): void => {
			if (!this.isChangeSelectedData(info)) {
				return;
			}

			if (event.target._private.data.params && event.target._private.data.params.bodyId) {
				// ヘッダ選択時
				if (info.cy && typeof info.cy.$ === 'function') {
					const allElements = info.cy.$('*');
					if (allElements && typeof allElements.unselect === 'function') {
						allElements.unselect();
					}

					// ボディを選択
					const bodyElement = info.cy.$('#' + event.target._private.data.params.bodyId);
					if (bodyElement && typeof bodyElement.select === 'function') {
						bodyElement.select();
					}
				}
			}

			if (info.canEmitChangeEvent) {
				info.preSelectedData = this.getSelectedData(info);
				changed.emit();
			}

			selected.emit();
		});

		info.cy.on('click', 'node, edge', (event): void => {

			selected.emit();
		});

		info.cy.on('unselect', 'node, edge', (event): void => {
			if (this.isChangeSelectedData(info) && info.canEmitChangeEvent) {
				info.preSelectedData = this.getSelectedData(info);
				changed.emit();
			}

		});

		info.cy.on('cxttap', (event): void => {
			info.onContextMenu(info, event.target._private);
		});

		info.cy.on('mouseover', 'node', (event): void => {
			if (!event.target._private.data.params.toolTip) {
				return;
			}

			// Cytoscapeインスタンスの確認
			if (!info.cy || typeof info.cy.zoom !== 'function' || typeof info.cy.$ !== 'function') {
				return;
			}

			// ダイアグラムの絶対位置＋ツールチップ表示の相対位置
			const element = info.cy.$('#' + event.target[0]._private.data.id);
			if (!element || typeof element.renderedPosition !== 'function') {
				return;
			}
			let position = element.renderedPosition();
			let currentZoom = info.cy.zoom();
			let x: number = event.cy._private.renderer.containerBB[0] + position.x - 50 * currentZoom +
					(EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH) * currentZoom;
			let y: number = event.cy._private.renderer.containerBB[1] + position.y - 20 * currentZoom;
			let o = document.createElement('div');
			o.setAttribute('id', 'workflowToolTip');
			o.innerHTML     = '' + event.target._private.data.params.toolTip;
			this.setToolTipStyle(o, 0, 0);
			let ele = document.getElementById('eim-body');
			ele.appendChild(o);

			// ツールチップ位置調整
			let tooltip = document.defaultView.getComputedStyle(o, '');

			let tooltipWidth: number = Number(tooltip.width.slice(0, -2));
			if (window.innerWidth < x + tooltipWidth) {
				// 右端が切れる場合、左側に表示
				x = event.cy._private.renderer.containerBB[0] + position.x - 60 * currentZoom - tooltipWidth;
				x = (x < 0) ? 0 : x;
			}

			let tooltipHeight: number = Number(tooltip.height.slice(0, -2));
			if (window.innerHeight < y + tooltipHeight + 10) {
				// 下端が切れる場合、上側に表示
				y = window.innerHeight - tooltipHeight - 10;
				y = (y < 0) ? 0 : y;
			}
			this.setToolTipStyle(o, x, y);
		});

		info.cy.on('mouseout', '*', (event): void => {
			this.clearToolTip();
		});
	}

	/**
	 * 画面描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param param ワークフローダイアグラムコンポーネントパラメータ
	 */
	public show(info: EIMDiagramComponentInfo, param: any): void {
		// Cytoscapeインスタンスの存在確認
		if (!info.cy || typeof info.cy.zoom !== 'function' || typeof info.cy.resize !== 'function') {
			console.warn('Cytoscape instance not properly initialized');
			return;
		}

		if (param.zoom) {
			info.cy.zoom(param.zoom);
		} else {
			info.cy.zoom(EIMContentsApproveWorkflowDiagramComponentService.DEFAULT_ZOOM);
		}

		info.cy.resize();
		let viewWidth: number = info.component.element.clientWidth;
		let renderedPosition: any;
		let isLastStatusType = false;
		if (param['currentStatusTypeId']) {
			// 現行ステータスを強調表示する場合
			if (param.data) {
				let statusTypes: any[] = param.data.statusTypes;
				if (statusTypes
					&& statusTypes.length > 0
					&& Number(statusTypes[statusTypes.length - 1].objId) === Number(param['currentStatusTypeId'])) {
						isLastStatusType = true;
					}
			}
			// Cytoscapeインスタンスのメソッドを確認
			if (info.cy && typeof info.cy.$ === 'function') {
				const element = info.cy.$('#' + param['currentStatusTypeId']);
				if (element && typeof element.renderedPosition === 'function') {
					renderedPosition = element.renderedPosition();
				}
			}
		} else {
			let elements: any[] = this.getData(info);
			if (elements.length === 0) {
				return;
			}
			// Cytoscapeインスタンスのメソッドを確認
			if (info.cy && typeof info.cy.$ === 'function') {
				const element = info.cy.$('#' + elements[0].id);
				if (element && typeof element.renderedPosition === 'function') {
					renderedPosition = element.renderedPosition();
				}
			}
		}

		if (!renderedPosition) {
			return;
		}

		// Cytoscapeインスタンスの再確認
		if (!info.cy || typeof info.cy.zoom !== 'function' || typeof info.cy.pan !== 'function' || typeof info.cy.height !== 'function') {
			console.warn('Cytoscape instance methods not available');
			return;
		}

		let panX = 100;
		let currentZoom = info.cy.zoom();
		let targetRightX: number = renderedPosition.x + EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH * currentZoom + panX;
		if (viewWidth < targetRightX) {
			// 現行ステータスタイプが画面からはみ出す場合
			if (isLastStatusType) {
				// 最後のステータスタイプなら右端に表示
				panX = -renderedPosition.x + viewWidth - EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH * currentZoom / 2 - 10 * currentZoom;

			} else {
				// 最後のステータスタイプでなければ中心に表示
				panX = -renderedPosition.x + viewWidth / 2;
			}
		}
		let statusTypeHeight: number = EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_HEADER_HEIGHT + this.status_type_body_height;
		let panY = info.cy.height() / 2 - statusTypeHeight * currentZoom / 3;
		info.cy.pan({
			x: panX,
			y: panY
		});

	}

	/**
	 * ワークフローダイアグラムを描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @param events イベント履歴のリスト
	 * @param nextStatusTypeId 遷移先のステータスタイプID
	 */
	public createDiagramElement(info: EIMContentsApproveWorkflowDiagramComponentInfo, workflow: EIMWorkflow,
			events: any[], nextStatusTypeId?: number, cyInfo?: EIMContentsApproveWorkflowDiagramComponentCyInfo): EIMDiagramElement[] {

		if (!cyInfo) {
			cyInfo = this.initCyInfo(workflow);
		}

		info.diagramName = workflow.objName;
		let skipEventList = this.createSkipEventList(events);
		let nodeCnt = 0;
		let elements: EIMDiagramElement[] = [];

		for (let i = 0; i < workflow.statusTypes.length; i++) {
			// ヘッダとボディのスタイルクラスを設定
			let headerClasses = '';
			let bodyClasses = '';
			let statusType: EIMWorkflowStatusType = workflow.statusTypes[i];
			if (statusType.currentStatus) {
				headerClasses = 'currentHeader';
				bodyClasses = 'currentBody';
			} else {
				headerClasses = 'header';
				bodyClasses = 'body';
			}

			// ヘッダラベル
			let headerLabel: string = statusType.objName;
			if (this.isAll(statusType)) {
				headerLabel = this.translateService.instant('EIM_DOCUMENTS.LABEL_02088') + headerLabel;
			}
			let shortHeaderLabel = this.getLabel(
					headerLabel, EIMContentsApproveWorkflowDiagramComponentService.MAX_LABEL_STRING_LENGTH, EIMContentsApproveWorkflowDiagramComponentService.MAX_HEADER_LABEL_ROW_LENGTH);

			// ユーザ名称
			let userNames: string[] = this.getApproveUserNames(workflow.statusTypes[i], cyInfo.currentStatusType);
			let reshapedUserNames: string[] = [];
			let subStringFlg = false;
			for (let j = 0; j < userNames.length; j++) {
				let offsetWidthCheck: HTMLElement = document.getElementById('offsetWidthCheck');
				if (!offsetWidthCheck) {
					return [];
				}
				offsetWidthCheck.innerText = userNames[j];
				let maxLength = EIMContentsApproveWorkflowDiagramComponentService.MAX_LABEL_PIXEL_LENGTH;
				let ua = window.navigator.userAgent.toLowerCase();
				if (0 <= ua.indexOf('firefox')) {
					maxLength = maxLength - 20;
				}
				if (maxLength < offsetWidthCheck.offsetWidth) {
					reshapedUserNames.push(this.adjustObjectName(offsetWidthCheck, userNames[j], maxLength));
					subStringFlg = true;
				} else {
					reshapedUserNames.push(userNames[j]);
				}
			}

			let shortUserNameLabel: string;
			let toolTip: string;
			if (userNames.length > EIMContentsApproveWorkflowDiagramComponentService.BODY_ROW_LENGTH) {
				shortUserNameLabel = reshapedUserNames.slice(0, EIMContentsApproveWorkflowDiagramComponentService.BODY_ROW_LENGTH).
						join('\n') + '\n...';
				toolTip = headerLabel + '<br/>' + userNames.join('<br/>');
			} else if (headerLabel.length >
					EIMContentsApproveWorkflowDiagramComponentService.MAX_LABEL_STRING_LENGTH *
					EIMContentsApproveWorkflowDiagramComponentService.MAX_HEADER_LABEL_ROW_LENGTH) {
				shortUserNameLabel = reshapedUserNames.join('\n');
				toolTip = headerLabel + '<br/>' + userNames.join('<br/>');
			} else {
				shortUserNameLabel = reshapedUserNames.join('\n');
				if (subStringFlg) {
					toolTip = headerLabel + '<br/>' + userNames.join('<br/>');
				} else {
					toolTip = undefined;
				}
			}

			// ヘッダ追加
			elements.push(this.createNode({id: cyInfo.globalId--, label: shortHeaderLabel,
				domain: statusType, params: {
					type: EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_HEADER,
					bodyId: statusType.objId, toolTip: toolTip
				},
				classes: headerClasses,
				position: {
					x: nodeCnt * (EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH + EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_SPACE_WIDTH),
					y: 0 },
				selectable: true }));

			// ボディ追加
			// スキップしたステータスタイプの場合、ボディに承認者名を表示せず、グレーアウト表示する
			let selectableFlag = true;
			if (this.isSkipStatusType(skipEventList, statusType)) {
				if (statusType.step <= Number(events[events.length - 1].toStatusStep)) {
					// カレントのステータスより前のステータスはグレーアウト
					bodyClasses = 'skip'
					shortUserNameLabel = '';
					selectableFlag = false;
				}
			}
			if (statusType.skip) {
				// 承認予定でスキップ指定の場合はグレーアウト
				// 但し、承認予定は承認ルートが変わる可能性があるためユーザ名は表示する
				bodyClasses = 'skip'
				selectableFlag = false;
			}
			let addNode = {
				id: statusType.objId,
				label: shortUserNameLabel,
				domain: statusType,
				params: {
					type: EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_BODY,
					toolTip: toolTip},
				classes: bodyClasses,
				position: {
					x: nodeCnt * (EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH + EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_SPACE_WIDTH),
					y: (EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_HEADER_HEIGHT + this.status_type_body_height) / 2 },
				selectable: selectableFlag }
			elements.push(this.createNode(addNode));
			nodeCnt++;

		}

		// イベントタイプの矢印を追加する
		elements = elements.concat(this.createEventTypeEdgeElemants(info, workflow, events, nextStatusTypeId, cyInfo));

		return elements;
	}

	/**
	 * ツールチップを消去します.
	 */
	public clearToolTip(): void {
		let tooltipElement: any = document.getElementById('workflowToolTip');
		if (tooltipElement) {
			tooltipElement.parentNode.removeChild(tooltipElement);
		}
	}

	/**
	 * イベントタイプの矢印描画情報リストを返却します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @param events イベントリスト
	 * @param nextStatusTypeId 遷移先のステータスタイプID
	 * @return イベントタイプの矢印描画情報リスト
	 */
	protected createEventTypeEdgeElemants(info: EIMContentsApproveWorkflowDiagramComponentInfo, workflow: EIMWorkflow,
			events: any[], nextStatusTypeId?: number, cyInfo?: EIMContentsApproveWorkflowDiagramComponentCyInfo): EIMDiagramEdgeEx[] {
		let elements: EIMDiagramNodeEx[] = [];

		let preStatusTypsId = -1;
		for (let i = 0; i < workflow.statusTypes.length; i++) {
			let statusType: EIMWorkflowStatusType = workflow.statusTypes[i];

			// 次STEPへの矢印追加
			if (preStatusTypsId !== -1) {
				let edgeClasses = '';
				if (cyInfo.currentStatusType && preStatusTypsId === cyInfo.currentStatusType.objId && Number(statusType.objId) === nextStatusTypeId) {
					edgeClasses = 'selected';
				}
				elements.push(this.createEdge({id: cyInfo.globalId--, label: '', classes: edgeClasses, sourceId: preStatusTypsId, targetId: statusType.objId, selectable: false, distance: 0}));

			}
			preStatusTypsId = statusType.objId;
		}
		return elements;
	}

	/**
	 * ダイアグラムのオプションを設定します.
	 * @param options オプション
	 */
	protected setOptions(options: EIMDiagramOptions): void {
		super.setOptions(options);
		options.zoom = EIMContentsApproveWorkflowDiagramComponentService.DEFAULT_ZOOM;
		options.maxZoom = 2;
		options.style = [];
		options.style.push(
			{
				selector: 'node',
				style: {
					width: EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH,
					'shape': 'rectangle',
					'background-color': '#fff',
					'border-width': 2,
					'border-style': 'solid',
					'border-color': '#b4c7e7',
					'label': 'data(label)',
					'text-valign': 'center',
					'font-size': 10,
					'color': '#000',
					'text-wrap': 'wrap',

				}
			}
		);
		options.style.push(
				{
					selector: 'node.header',
					style: {
						'height': EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_HEADER_HEIGHT,
						'background-color': '#b4c7e7',
					}
				}
			);
		options.style.push(
				{
					selector: 'node.currentHeader',
					style: {
						'height': EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_HEADER_HEIGHT,
						'background-color': '#ffc000',
						'border-color': '#ffc000',
					}
				}
			);
		options.style.push(
				{
					selector: 'node.body',
					style: {
						'height': this.status_type_body_height,
						'text-margin-x': -105,
						'text-halign': 'right',
					}
				}
			);
		options.style.push(
				{
					selector: 'node.currentBody',
					style: {
						'height': this.status_type_body_height,
						'background-color': '#fff2cc',
						'border-color': '#ffc000',
						'text-margin-x': -105,
						'text-halign': 'right',
					}
				}
			);
			options.style.push(
				{
					selector: 'node.skip',
					style: {
						'height': this.status_type_body_height,
						'background-color': '#cfcfcf',
						'text-margin-x': -105,
						'text-halign': 'right',
					}
				}
			);
		options.style.push(
			{
				selector: 'node:selected',
				style: {
					'background-color': '#a8e8fd',
					'color': '#555',
				}
			}
		);
		options.style.push(
			{
				selector: 'edge',
				style: {
					'curve-style': 'segments',
					'segment-distances': ( ele ) => { return this.getDistances(ele); },
					'segment-weights': ( ele ) => { return this.getWeights(ele); },
					'width': 3,
					'line-color': '#ddd',
					'target-arrow-color': '#ddd',
					'target-arrow-shape': 'triangle',
					'font-size': 10,
					'color': '#fff',
					'label': 'data(label)',
					'text-outline-width': 1,
					'text-outline-color': '#ddd',
				}
			}
		);
		options.style.push(
				{
					selector: 'edge.selected',
					style: {
						'line-color': '#555555',
						'target-arrow-color': '#555555',
						'text-outline-color': '#555555',
					}
				}
			);
	}


	/**
	 * エッジの各ポイントの距離
	 * @param element エレメント
	 * @return ポイントの距離
	 */
	protected getDistances(element): any[] {
		let distance: number = element._private.data.distance;
		return [distance * 10, distance * 10];

	}

	/**
	 * エッジの各ポイントの重み
	 * @param element エレメント
	 * @return ポイントの重み
	 */
	protected getWeights(element): any[] {
		let sourceX: number = element._private.source._private.position.x;
		let targetX: number = element._private.target._private.position.x;
		let distance: number = Math.abs(targetX - sourceX);
		let a = 10 / distance;

		return [a, 1 - 2 * a, a];
	}

	/**
	 * 名前をラベルに変換（改行）して返却します.
	 * @param text 名前
	 * @param rowStrLength 行の最大文字数
	 * @param rowLength 最大行数
	 * @return 改行つきラベル
	 */
	protected getLabel(text: string, rowStrLength: number, rowLength: number): string {
		let labels: string[] =  this.getLabels(text, rowStrLength);
		let sub: string = null;
		if (labels.length > rowLength) {
			labels.splice(rowLength, labels.length - rowLength);
			sub = '...'
		}
		let label: string = labels.join('\n');
		if (sub != null) {
			label = label.substr(0, label.length - 1) + sub;
		}
		return label;
	}

	/**
	 * ステータスの承認実施者、予定者のラベルリストを返却します.
	 * @param statusType ステータスタイプ
	 * @param currentStatusType 現在のステータスタイプ
	 * @return ステータスの承認実施者、予定者のラベルリスト
	 */
	protected getApproveUserNames(statusType: EIMWorkflowStatusType, currentStatusType: EIMWorkflowStatusType): string[] {
		let userNames: string[] = [];

		if (!statusType.users) {
			return userNames;
		}

		for (let i = 0; i < statusType.users.length; i++) {
			let user: EIMApproveUserDTO = statusType.users[i];

			if (statusType.step === 1) {
				// 登録者
				userNames.push(this.translateService.instant('EIM_DOCUMENTS.LABEL_02062', {value: statusType.users[i].name}));
			} else if (user.approve) {
				// 承認ユーザ
				userNames.push(this.translateService.instant('EIM_DOCUMENTS.LABEL_02060', {value: statusType.users[i].name}));
			} else if (statusType.step >= currentStatusType.step) {
				// 未承認ユーザ
				userNames.push(this.translateService.instant('EIM_DOCUMENTS.LABEL_02061', {value: statusType.users[i].name}));
			}
		}

		return userNames;
	}

	/**
	 * ツールチップエレメントにスタイルを適用します.
	 * @param element ツールチップエレメント
	 * @param x 表示位置のx座標（絶対値）
	 * @param y 表示位置のy座標（絶対値）
	 */
	protected setToolTipStyle(element: any, x: number, y: number): void {
		element.style.cssText = 'font-weight: bold;'
			+ 'font-size: 8pt;'
			+ 'position: absolute;'
			+ 'top: ' + y + 'px;'
			+ 'left: ' + x + 'px;'
			+ 'z-index: 9000;'
			+ 'border: solid 1px #4c4c4c;'
			+ 'border-radius: 3px;'
			+ 'color: #fff;'
			+ 'background: #4c4c4c;'
			+ 'word-wrap: normal;'
			+ 'overflow-wrap: normal;';
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 名前を表示幅に合わせて配列に変換して返却します.
	 * @param text 名前
	 * @param rowStrLength 行の最大文字数
 	 * @return ラベルの配列
	 */
	private getLabels(text: string, rowStrLength: number): string[] {
		let labels: string[] = [];

		labels.push(text.slice(0, rowStrLength));
		if (text.length > rowStrLength) {
			Array.prototype.push.apply(labels, this.getLabels(text.slice(rowStrLength), rowStrLength));
		}
		return labels;
	}

	/**
	 * 全員承認かどうか返却します.
	 * @param statusType ステータスタイプ
	 */
	private isAll(statusType: EIMWorkflowStatusType): boolean {
		if (statusType.users && statusType.users.length > 0
				&& statusType.users[0].must) {
			return true;
		}

		return false;
	}

	/**
	 * スキップイベントリストを返却します．
	 * @param events ワークフローイベント
	 * @return skipEventList スキップイベントリスト
	 */
	private createSkipEventList(events): any[] {
		if (events === null || events.length === 0) {
			return null;
		}

		let skipEventList: any[] = [];
		let toStatusId: number;
		let fromStatusId: number;
		let statusId: Object = new Object();
		// イベントリストを後ろから順に調べる
		for (let i: number = events.length - 1 ; i > -1 ; i--) {
			// 承認依頼の場合
			if (Number(events[i].baseEvtTypeId) === EIMConstantService.BASE_EVENT_TYPE_ID_REQ_APPROVE) {
				// 最後のステータスは必ず表示
				if (toStatusId === 0) {
					skipEventList.push(events[i]);
					continue;
				}
				// 取消しと対になる承認依頼でないか判定
				toStatusId = events[i].toStatusId;
				fromStatusId = events[i].fromStatusId;
				let reverseKey: string = ' ' + fromStatusId + toStatusId  + ' ';
				if (statusId[reverseKey] != null && statusId[reverseKey] === 'false') {
					statusId[reverseKey] = 'true';
					continue;
				} else if (statusId[reverseKey] == null || statusId[reverseKey] === 'true') {
					skipEventList.push(events[i]);
					// fromとtoのIdが同じ場合は無視
				} else if (events[i].fromStatusId === events[i].toStatusId) {
					continue;
				}
				// 承認依頼取消の場合
			} else if (Number(events[i].baseEvtTypeId) === EIMConstantService.BASE_EVENT_TYPE_ID_CANCEL_REQ_APPROVE) {
				// fromとtoのIdが違う場合はIdを保持
				if (events[i].fromStatusId !== events[i].toStatusId) {
					toStatusId = events[i].toStatusId;
					fromStatusId = events[i].fromStatusId;
					let key: string = ' ' + toStatusId + fromStatusId + ' ';
					statusId[key] = 'false';
				// fromとtoのIdが同じ場合は無視
				} else if (events[i].fromStatusId === events[i].toStatusId) {
					continue;
				}
				// 差戻しの場合
			} else if (Number(events[i].baseEvtTypeId) === EIMConstantService.BASE_EVENT_TYPE_ID_SEND_BACK) {
				break;
			// 取戻しの場合
			} else if (Number(events[i].baseEvtTypeId) === EIMConstantService.BASE_EVENT_TYPE_ID_TAKE_BACK) {
				break;
			// 承認の場合
			} else if (Number(events[i].baseEvtTypeId) === EIMConstantService.BASE_EVENT_TYPE_ID_APPROVAL) {
				// 最後のステータスは必ず表示
				if (toStatusId === 0) {
					skipEventList.push(events[i]);
					continue;
				}
				// 取消しと対になる承認依頼でないか判定
				toStatusId = events[i].toStatusId;
				fromStatusId = events[i].fromStatusId;
				let reverseKey: string = ' ' + fromStatusId + toStatusId  + ' ';
				if (statusId[reverseKey] != null && statusId[reverseKey] === 'false') {
					statusId[reverseKey] = 'true';
					continue;
				} else if (statusId[reverseKey] == null || statusId[reverseKey] === 'true') {
					skipEventList.push(events[i]);
					// fromとtoのIdが同じ場合は無視
				} else if (events[i].fromStatusId === events[i].toStatusId) {
					continue;
				}
			}
		}
		return skipEventList;
	}

	/**
	 * スキップ対象かどうか判定します．
	 * @param skipEventList スキップイベントリスト
	 * @param statusType ステータスタイプ
	 */
	private isSkipStatusType(skipEventList, statusType): boolean {

		let isSkip = false;
		if (skipEventList === null || skipEventList.length === 0) {
			return isSkip;
		}
		for (let j = 0 ; j < skipEventList.length; j++ ) {
			if ((statusType.objId === skipEventList[j].toStatusId) || (statusType.objId === skipEventList[j].fromStatusId)) {
				// ステータスタイプIDとスキップイベントの遷移元・遷移先のステータスタイプIDが一致する場合スキップではない
				isSkip = false;
				break;
			} else {
				isSkip = true;
			}
		}
		return isSkip;
	}
		/**
	 * オブジェクト名の長さを調整します.
	 * 表示限界以上の長さの場合は途中で切り出し
	 * @param user ユーザ情報
	 * @return 調整後オブジェクト名
	 */
	private adjustObjectName(element: HTMLElement, name: string, maxLength: number): string {
		let result = name;
		let subStringName = name;
		for (let i = 0; i < name.length; i++) {
			subStringName = subStringName.substring(0, subStringName.length - 1);
			element.innerText = subStringName;
			if (element.offsetWidth <= maxLength) {
				break;
			}
		}
	return subStringName;
	}

	protected initCyInfo(workflow: EIMWorkflow): any {
		let firstStatusType: EIMWorkflowStatusType;
		let currentStatusType: EIMWorkflowStatusType;
		for (let i = 0; i < workflow.statusTypes.length; i++) {
			let statusType: EIMWorkflowStatusType = workflow.statusTypes[i];
			if (i === 0) {
				firstStatusType = statusType;
			}
			if (statusType.currentStatus) {
				currentStatusType = statusType;
			}
		}
		return {globalId: -1, firstStatusType: firstStatusType, currentStatusType: currentStatusType};

	}
}
