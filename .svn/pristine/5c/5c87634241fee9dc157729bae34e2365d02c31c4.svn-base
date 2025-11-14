import { EventEmitter, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMContentsApproveWorkflowDiagramComponentService, EIMContentsApproveWorkflowDiagramComponentInfo } from './contents-approve-workflow-diagram.component.service';
import { EIMDiagramComponentInfo, EIMDiagramElement, EIMDiagramOptions, EIMDiagramNodeEx, EIMDiagramEdgeEx } from 'app/shared/components/diagram/diagram.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMWorkflow, EIMWorkflowStatusType, EIMWorkflowService, EIMWorkflowEventType } from 'app/documents/shared/services/apis/workflow.service';
import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMApproveUserDTO } from 'app/documents/shared/dtos/approve-user.dto';
import { TranslateService } from '@ngx-translate/core';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged } from './contents-approve-workflow-diagram.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

/** ダイアグラム情報 */
export interface EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo extends EIMContentsApproveWorkflowDiagramComponentInfo {
	workflow?: EIMWorkflow;
	documentObjId?: number;	// 承認者選択するには必須
	elements?: EIMDiagramElement[];
	routeEventTypes: EIMWorkflowEventType[]
	approverSelectButton?: {
		mouseOverId: number;
		ignoreMouseOut: boolean;
	};
	skipButton?: {
		mouseOverId: number;
		ignoreMouseOut: boolean;
	};
}

/** ノード拡張情報 */
export interface EIMContentsApproveForApproverSelectableWorkflowDiagramNode extends EIMDiagramNodeEx {
	documentObjId?: number;
}

/**
 * 承認画面（承認者選択可能）用ワークフローダイアグラムコンポーネントコンポーネントサービス.
 */
@Injectable()
export class EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService extends EIMContentsApproveWorkflowDiagramComponentService {
	/** ステータスタイプのボタンの高さ */
	static readonly STATUS_TYPE_BUTTON_HEIGHT: number = 15;
	/** ステータスタイプのボタンのパディング */
	static readonly STATUS_TYPE_BUTTON_PADDING: number = 2;

	/** ステータスタイプのボディの高さ */
	protected status_type_body_height = EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_BODY_HEIGHT_DEFAULT + EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_HEIGHT;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected workflowService: EIMWorkflowService,
		protected translateService: TranslateService,
		protected approveService: EIMApproveService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		public zone: NgZone,
		protected entryService: EIMDocumentsEntryService
	) {
		super(workflowService, translateService, approveService, dialogManagerComponentService, zone);
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
	public initialize(info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo, serviceParam?: any,
			initialize?: EventEmitter<any>, changed?: EventEmitter<any>, selected?: EventEmitter<any>, statusTypeChanged?: EventEmitter<EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged>): void {

		super.initialize(info, serviceParam, initialize, changed, selected, statusTypeChanged);

		info.cy.on('click', 'node, edge', (event): void => {

			// 承認選択ボタン押下時
			if (!event.target._private.data.params) {
				return;
			}
			if (event.target._private.data.params.type === EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_APPROVER_SELECT) {

				// 承認者選択ボタン押下時
				this.selectApproverList(event.target._private.data, info, statusTypeChanged);

			} else if (event.target._private.data.params.type === EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_SKIP) {

				// スキップボタン押下時
				let node: EIMContentsApproveForApproverSelectableWorkflowDiagramNode = event.target._private.data;
				node.documentObjId = info.documentObjId;
				this.skipStatusType(node, info, statusTypeChanged);
			}
		});

		info.cy.on('mouseover', 'node', (event): void => {
			if (!event.target._private.data.params) {
				// 何もしない
				return;
			}

			if (event.target._private.data.params.type === EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_APPROVER_SELECT) {
				if (!info.approverSelectButton) {
					// ボタンの情報を初期化
					info.approverSelectButton = {mouseOverId: null, ignoreMouseOut: false};
					info.skipButton = {mouseOverId: null, ignoreMouseOut: false};
				}
				if (!info.approverSelectButton.mouseOverId) {
					// 承認選択の場合カーソル変更
					document.body.style.cursor = 'pointer';

					// 承認者選択ボタンのスタイルをマウスオーバーに変更
					for (let i = 0; i < info.elements.length; i++) {
						if (!info.elements[i]['data']['params'] || info.elements[i]['data']['params']['type'] !== EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_APPROVER_SELECT) {
							continue;
						}
						let node: EIMDiagramNodeEx = info.elements[i];
						if (node.data.id === event.target._private.data.id) {
							node.classes = 'status-button-mouse-over';
							info.approverSelectButton.mouseOverId = node.id;
						} else {
							node.classes = 'status-button';
						}
					}
					// 再描画後マウスアウトが発生するため1回無視する
					info.approverSelectButton.ignoreMouseOut = true;
					this.clear(info);
					this.setData(info, info.elements, null);
				}
			}

			if (event.target._private.data.params.type === EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_SKIP) {
				if (!info.skipButton) {
					// ボタンの情報を初期化
					info.approverSelectButton = {mouseOverId: null, ignoreMouseOut: false};
					info.skipButton = {mouseOverId: null, ignoreMouseOut: false};
				}
				if (!info.skipButton.mouseOverId) {
					// 承認選択の場合カーソル変更
					document.body.style.cursor = 'pointer';

					// スキップボタンのスタイルをマウスオーバーに変更
					for (let i = 0; i < info.elements.length; i++) {
						if (!info.elements[i]['data']['params'] || info.elements[i]['data']['params']['type'] !== EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_SKIP) {
							continue;
						}
						let node: EIMDiagramNodeEx = info.elements[i];
						if (node.data.id === event.target._private.data.id) {
							node.classes = 'status-button-mouse-over';
							info.skipButton.mouseOverId = node.id;
						} else {
							node.classes = 'status-button';
						}
					}
					// 再描画後マウスアウトが発生するため1回無視する
					info.skipButton.ignoreMouseOut = true;
					this.clear(info);
					this.setData(info, info.elements, null);
				}
			}

		});

		info.cy.on('mouseout', 'node', (event): void => {

			if (!info.approverSelectButton && !info.skipButton) {
				// mouseoverイベント前のため何もしない
				return;
			}
			if (info.approverSelectButton.mouseOverId) {
				if (info.approverSelectButton.ignoreMouseOut) {
					info.approverSelectButton.ignoreMouseOut = false;
					return;
				}
				info.approverSelectButton.mouseOverId = null;
				document.body.style.cursor = 'default';

				// 承認者選択ボタンのマウスオーバースタイルをクリア
				for (let i = 0; i < info.elements.length; i++) {
					if (!info.elements[i]['data']['params'] || info.elements[i]['data']['params']['type'] !== EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_APPROVER_SELECT) {
						continue;
					}
					let node: EIMDiagramNodeEx = info.elements[i];
					node.classes = 'status-button';
				}
				this.clear(info);
				this.setData(info, info.elements, null);
			}
			if (info.skipButton.mouseOverId) {
				if (info.skipButton.ignoreMouseOut) {
					info.skipButton.ignoreMouseOut = false;
					return;
				}

				info.skipButton.mouseOverId = null;
				document.body.style.cursor = 'default';

				// 承認者選択ボタンのマウスオーバースタイルをクリア
				for (let i = 0; i < info.elements.length; i++) {
					if (!info.elements[i]['data']['params'] || info.elements[i]['data']['params']['type'] !== EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_SKIP) {
						continue;
					}
					let node: EIMDiagramNodeEx = info.elements[i];
					node.classes = 'status-button';
				}
				this.clear(info);
				this.setData(info, info.elements, null);
			}
		});
	}

	/**
	 * 開始シーケンスからの承認ルート(イベントタイプのリスト)を返却します.
	 * @param startSeq 開始シーケンス
	 * @param statusTypes スタータスタイプのリスト
	 * @param eventTypes イベントタイプのリスト
	 * @return 承認ルート(イベントタイプのリスト)
	 */
	public getApproveRoute(startSeq: number, statusTypes: EIMWorkflowStatusType[], eventTypes: EIMWorkflowEventType[]): EIMWorkflowEventType[] {
		// 承認方向のイベントタイプを抽出
		let approveEventTypes: EIMWorkflowEventType[] = this.getEventTypesByDirection(eventTypes, 1);
		// スキップステータスタイプにfrom/toが設定されているイベントタイプは除外（承認ルートにはならないため）
		let approveEventTypesExcludedSkipStatusTypes: EIMWorkflowEventType[] = this.getEventTypesExcludedSkipStatusType(approveEventTypes, statusTypes);
		// イベントタイプのFromのシーケンスとイベントタイプのMap取得
		let fromSeqAndEvenTypesMap = this.getFromSeqAndEventTypesMap(approveEventTypesExcludedSkipStatusTypes);
		// 最後のシーケンス取得
		let lastSeq = 1;
		for (let i = 0; i < statusTypes.length; i++) {
			if (statusTypes[i].step > lastSeq) {
				lastSeq = statusTypes[i].step;
			}
		}

		return this.getApproveRouteRecursive(startSeq, statusTypes, fromSeqAndEvenTypesMap, lastSeq);
	}

	/**
	 * ワークフローダイアグラムを描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @param events イベント履歴のリスト
	 * @param nextStatusTypeId 遷移先のステータスタイプID
	 */
	public createDiagramElement(info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo, workflow: EIMWorkflow,
			events: any[], nextStatusTypeId?: number, cyInfo?: any): EIMDiagramElement[] {

		// 現在のステータスタイプを取得
		if (!cyInfo) {
			cyInfo = this.initCyInfo(workflow);
		}

		info.workflow = workflow;
		info.events = events;
		let elements: EIMDiagramElement[] = super.createDiagramElement(info, workflow, events, nextStatusTypeId, cyInfo);
		let nodeCnt = 0;

		for (let i = 0; i < workflow.statusTypes.length; i++) {
			let statusType: EIMWorkflowStatusType = workflow.statusTypes[i];

			// 承認者選択/スキップボタン追加
			if (info.documentObjId &&
					statusType.step > cyInfo.currentStatusType.step &&		// カレントステータスより後のステータス
					statusType.step < workflow.statusTypes.length - 1) {	// 最後の2ステータス（公開処理中/公開済み）より前のステータス

				// 承認者選択ボタン追加
				let addNodeForApproverSelect = {
					id: cyInfo.globalId--,
					label: '+  ' + this.translateService.instant('EIM_DOCUMENTS.LABEL_03049'),
					documentObjId: info.documentObjId,
					domain: statusType,
					params: {
						type: EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_APPROVER_SELECT,
						// toolTip: toolTip
					},
					classes: 'status-button',
					position: {
						x: nodeCnt * (EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH + EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_SPACE_WIDTH),
						y: (EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_HEADER_HEIGHT + EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_HEIGHT) / 2 +
								EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_BODY_HEIGHT_DEFAULT -
								EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_PADDING
							},
					selectable: false
				}
				elements.push(this.createNode(addNodeForApproverSelect));

			}
			nodeCnt++;
		}

		// スキップボタン追加
		elements = elements.concat(this.createSkipButtonNodeElements(info, workflow, events, nextStatusTypeId, cyInfo));

		return elements;
	}

	/**
	 * エレメント情報を設定します.
	 * @param info ダイアグラム情報
	 * @param data エレメント
	 * @param changed 選択変更エミッタ
	 */
	public setData(info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo, data: EIMDiagramElement[], changed?: EventEmitter<any>): void {
		info.diagramName = info.workflow.objName;
		super.setData(info, data, changed);
		info.elements = data;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 承認者を選択します.
	 * @param node 承認者設定対象のステータスタイプノード
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param statusTypeChanged ステータスタイプ変更エミッタ
	 */
	private selectApproverList(node: EIMContentsApproveForApproverSelectableWorkflowDiagramNode,
			info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo,
			statusTypeChanged: EventEmitter<EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged>) {

		// 承認者選択画面に表示する全候補を取得
		let forcastStatusTypeId = Number(node.domain.objId);
		this.approveService.getApproverList(node.documentObjId, EIMDocumentsConstantService.APPROVER_SELECTED_IS_BOSS_CHECK, forcastStatusTypeId)
			.subscribe((approvers: any) => {

				for (let i = 0; i < approvers.users.length; i++) {
					if (approvers.users[i].kana === 'null') {
						approvers.users[i].kana = '';
					}
				}

				// 各ステータスタイプごとに選択済みの承認者を取得
				let selectedApprovers = [];
				let status = this.getStatusTypeById(info.workflow.statusTypes, forcastStatusTypeId);
				if (status) {
					if (!status.users) {
						status.users = [];
					}
					selectedApprovers = status.users;
				}
				this.entryService.getApproverInfo(approvers.users, status.users as any);
				let dialogId: string = this.dialogManagerComponentService.showApproverSelector(forcastStatusTypeId, approvers.users, selectedApprovers, approvers.isBoss, {
					selected: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);
						// 選択した承認者をステータス情報に設定
						for (let i = 0; i < info.workflow.statusTypes.length; i++) {
							if (info.workflow.statusTypes[i].objId !== node.domain.objId) {
								continue;
							}
							info.workflow.statusTypes[i].users = data;
							statusTypeChanged.emit({
								objId: node.documentObjId,
								routeEventTypes: info.routeEventTypes,
								statusType: info.workflow.statusTypes[i],
								isSkipChanged: false,
								isUserListChanged: true
							});
						}
						// ダイアグラムを再描画します
						this.clear(info);
						let elements: any[] = this.createDiagramElement(info, info.workflow, info.events);
						this.setData(info, elements, null);
					}
				});
			});
	}

	/**
	 * ステータスタイプのスキップする/しないを切り替えます.
	 * @param skipStusTypeNode 切り替え対象のステータスタイプのノード
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param statusTypeChanged ステータスタイプ変更エミッタ
	 */
	private skipStatusType(skipStusTypeNode: EIMContentsApproveForApproverSelectableWorkflowDiagramNode,
			info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo, statusTypeChanged:
			EventEmitter<EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged>, nextStatusTypeId?: number): void {

		skipStusTypeNode.domain.skip = !skipStusTypeNode.domain.skip;

		// ダイアグラムを再描画します
		this.clear(info);
		let elements: any[] = this.createDiagramElement(info, info.workflow, info.events);
		this.setData(info, elements, null);

		statusTypeChanged.emit({
			objId: skipStusTypeNode.documentObjId,
			routeEventTypes: info.routeEventTypes,
			statusType: skipStusTypeNode.domain,
			isSkipChanged: true,
			isUserListChanged: false
		});

	}

	/**
	 * ダイアグラムのオプションを設定します.
	 * @param options オプション
	 */
	protected setOptions(options: EIMDiagramOptions): void {
		super.setOptions(options);

		options.style.push(
			{
				selector: 'node.body',
				style: {
					'height': this.status_type_body_height,
					'text-margin-x': -105,
					'text-halign': 'right',
					'text-margin-y': -10,
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
					'text-margin-y': -10,
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
					'text-margin-y': -10,
				}
			}
		);
		options.style.push({
			selector: 'node.status-button',
			style: {
				'height': EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_HEIGHT,
				'width': EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH - EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_PADDING * 2 * 6,
				'color': '#fff',
				'background-color': '#0d98ed',
				'border-color': '#E5E5E5',
				'border-width': '0.5px',
				'transition-property': 'none',
				'shape': 'roundrectangle',
			}
		});
		options.style.push({
			selector: 'node.status-button-mouse-over',
			style: {
				'height': EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_HEIGHT,
				'width': EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH - EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_PADDING * 2 * 6,
				'color': '#fff',
				'background-color': '#41bdf5',
				'border-color': '#3dabff',
				'border-width': '0.5px',
				'transition-property': 'none',
				'shape': 'roundrectangle',
			}
		});
		options.style.push({
			selector: 'node.skip-button',
			style: {
				'height': EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_HEIGHT,
				'width': EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH - EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_PADDING * 2 * 6,
				'color': '#fff',
				'background-color': '#0d98ed',
				'border-color': '#E5E5E5',
				'border-width': '0.5px',
				'transition-property': 'none',
				'shape': 'roundrectangle',
			}
		});
	}

	/**
	 * スキップボタン描画情報リストを返却します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @param events イベントリスト
	 * @param nextStatusTypeId 遷移先のステータスタイプID
	 * @return イベントタイプの矢印描画情報リスト
	 */
	protected createSkipButtonNodeElements(info: EIMContentsApproveWorkflowDiagramComponentInfo, workflow: EIMWorkflow,
			events: any[], nextStatusTypeId?: number, cyInfo?: any): EIMDiagramEdgeEx[] {

		let nodeCnt = -1;
		let elements: EIMDiagramNodeEx[] = [];
		for (let i = 0; i < workflow.statusTypes.length; i++) {
			nodeCnt++;
			let statusType: EIMWorkflowStatusType = workflow.statusTypes[i];
			if (statusType.step <= cyInfo.currentStatusType.step ||		// カレントステータスまでのステータス
					statusType.step >= workflow.statusTypes.length - 1) {	// 最後の2ステータス（公開処理中/公開済み）から先のステータス
				continue;
			}

			if (statusType.canSkip) {
				let type;
				let classes;
				type = EIMContentsApproveWorkflowDiagramComponentService.NODE_TYPE_SKIP;
				classes = 'skip-button';

				let label = statusType.skip ? '+  ' + 'スキップ解除' : '-  ' + 'スキップ';
				let addNodeForStatusSkip = {
					id: cyInfo.globalId--,
					label: label,
					domain: statusType,
					params: {
						type: type,
					},
					classes: classes,
					position: {
						x: nodeCnt * (EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_WIDTH + EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_SPACE_WIDTH),
						y: -(EIMContentsApproveWorkflowDiagramComponentService.STATUS_TYPE_HEADER_HEIGHT + EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_HEIGHT) / 2 - EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService.STATUS_TYPE_BUTTON_PADDING
					},
					selectable: false
				};
				elements.push(this.createNode(addNodeForStatusSkip));
			}
		}
		return elements;
	}

	/**
	 * イベントタイプの矢印描画情報リストを返却します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @param events イベントリスト
	 * @param nextStatusTypeId 遷移先のステータスタイプID
	 * @return イベントタイプの矢印描画情報リスト
	 */
	protected createEventTypeEdgeElemants(info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo, workflow: EIMWorkflow,
			events: any[], nextStatusTypeId?: number, cyInfo?: any): EIMDiagramEdgeEx[] {
		let elements: EIMDiagramEdgeEx[] = [];

		// 承認方向のイベントタイプを抽出
		let approveEventTypes = this.getEventTypesByDirection(info.workflow.eventTypes, 1);

		// 公開処理中ステータスタイプをスキップする矢印を除去
		approveEventTypes = this.getEventTypesExcludedSkipProcessingPublic(approveEventTypes);

		let routeEventTypes: EIMWorkflowEventType[] = this.getApproveRoute(1, info.workflow.statusTypes, info.workflow.eventTypes);
		info.routeEventTypes = routeEventTypes;

		let routeEventTypeIdSet = new Set();
		if (routeEventTypes) {
			for (let i = 0; i < routeEventTypes.length; i++) {
				routeEventTypeIdSet.add(routeEventTypes[i].objId);
			}
		}

		// 最後のシーケンス取得
		let lastSeq = 1;
		for (let i = 0; i < workflow.statusTypes.length; i++) {
			if (workflow.statusTypes[i].step > lastSeq) {
				lastSeq = workflow.statusTypes[i].step;
			}
		}

		// イベントタイプの矢印追加
		let yDistance = 4;
		approveEventTypes.sort(
			function(a, b) {
				if (a.fromStatusTypeSeq < b.fromStatusTypeSeq) {return -1};
				if (a.fromStatusTypeSeq > b.fromStatusTypeSeq) {return 1};
				return 0;
			}
		);

		let routeElements = [];
		for (let i = 0; i < approveEventTypes.length; i++) {
			let distance = 0
			if (approveEventTypes[i].toStatusTypeSeq - approveEventTypes[i].fromStatusTypeSeq >= 2) {
				distance = yDistance++;
			}
			if (approveEventTypes[i].toStatusTypeSeq === lastSeq && approveEventTypes[i].fromStatusTypeSeq === lastSeq - 2) {
				// 最終承認から公開済みへのスキップイベントタイプは表示しない（PDF変換しない場合のイベントタイプだがユーザが選択できないため）
				continue;
			}
			let fromStatusTypeId = this.getStatusTypeBySeq(info.workflow.statusTypes, approveEventTypes[i].fromStatusTypeSeq).objId;
			let toStatusTypeId = this.getStatusTypeBySeq(info.workflow.statusTypes, approveEventTypes[i].toStatusTypeSeq).objId;
			let edgeClasses = '';
			if (routeEventTypeIdSet.has(approveEventTypes[i].objId)) {
				// 承認ルート上のイベントタイプは優先表示したいため最後に追加する
				edgeClasses = 'selected';
				routeElements.push(this.createEdge({id: cyInfo.globalId--, label: '', classes: edgeClasses, sourceId: fromStatusTypeId, targetId: toStatusTypeId, selectable: false, distance: distance}));
			} else {
				elements.push(this.createEdge({id: cyInfo.globalId--, label: '', classes: edgeClasses, sourceId: fromStatusTypeId, targetId: toStatusTypeId, selectable: false, distance: distance}));
			}
		}
		return elements.concat(routeElements);
	}

	/**
	 * ノードを生成します.
	 * @param node ノード情報
	 */
	protected createNode(node: any): EIMDiagramNodeEx {
		let retNode: EIMDiagramNodeEx = node;
		retNode.data = {
			id: node.id,
			label: node.label,
			documentObjId: node.documentObjId,
			domain: node.domain,
			params: node.params
		};
		return node;
	}

/**
 * ステータスタイプリストの中から、指定ステータスタイプIDのステータスタイプを返却します.
 * @param statusTypes ステータスタイプのリスト
 * @param statusTypeId ステータスタイプID
 */
	protected getStatusTypeById(statusTypes: EIMWorkflowStatusType[], statusTypeId: number): EIMWorkflowStatusType {
		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(statusTypes[i].objId) === statusTypeId) {
				return statusTypes[i];
			}
		}
		return null;
	}

/**
 * ステータスタイプリストの中から、指定シーケンスのステータスタイプを返却します.
 * @param statusTypes ステータスタイプのリスト
 * @param statusTypeId シーケンス
 */
protected getStatusTypeBySeq(statusTypes: EIMWorkflowStatusType[], seq: number): EIMWorkflowStatusType {
		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(statusTypes[i].step) === seq) {
				return statusTypes[i];
			}
		}
		return null;
	}

	/**
	 * 指定方向のイベントタイプを返却します.
	 * @param eventTypes イベントタイプのリスト
	 * @param direction 方向(1:進む方向、-1:戻る方向)
	 * @return 指定方向のイベントタイプのリスト
	 */
	protected getEventTypesByDirection(eventTypes: any[], direction: number): any[] {
		let list = [];
		for (let i = 0; i < eventTypes.length; i++) {
			let sub = Number(eventTypes[i].toStatusTypeSeq) - Number(eventTypes[i].fromStatusTypeSeq);
			if (sub > 0 && direction > 0) {
				list.push(eventTypes[i]);
			}
			if (sub < 0 && direction < 0) {
				list.push(eventTypes[i]);
			}
		}
		return list;
	}

	/**
	 * 公開処理中ステータスタイプをスキップするエベントタイプを除いたイベントタイプリストを返却します.
	 * toが公開済みであるイベントタイプリストのうち、fromが公開処理中以外をフィルタします.
	 * @param eventTypes イベントタイプのリスト
	 * @return 公開処理中ステータスタイプをスキップするエベントタイプを除いたイベントタイプリスト
	 */
	 protected getEventTypesExcludedSkipProcessingPublic(eventTypes: any[]): any[] {

		let list = [];

		// 公開処理中→公開済みのイベントタイプを取得
		let publicEventType = null;
		for (let i = 0; i < eventTypes.length; i++) {
			let eventType = eventTypes[i];
			if (eventType.baseEventTypeId !== EIMConstantService.BASE_EVENT_TYPE_ID_PUBLIC) {
				continue;
			}

			publicEventType = eventType;
		}

		if (!publicEventType) {
			return list.concat(eventTypes);
		}

		// 公開済みへのイベントタイプのうち、公開処理中→公開済み以外のイベントタイプを除去
		let lastSeq = publicEventType.toStatusTypeSeq;
		for (let i = 0; i < eventTypes.length; i++) {
			let eventType = eventTypes[i];
			if (eventType.toStatusTypeSeq === lastSeq && eventType.fromStatusTypeSeq !== publicEventType.fromStatusTypeSeq) {
				continue;
			}
			list.push(eventType);
		}
		return list;
	}

	/**
	 * スキップ指定したステータスタイプをfrom/to指定されたイベントタイプを除いたイベントタイプリストを返却します.
	 * @param eventTypes イベントタイプのリスト
	 * @param statusTypes ステータスタイプのリスト
	 * @return スキップ指定したステータスタイプをfrom/to指定されたイベントタイプを除いたイベントタイプリスト
	 */
	protected getEventTypesExcludedSkipStatusType(eventTypes: any[], statusTypes: EIMWorkflowStatusType[]): any[] {
		let skipSeqSet = new Set();
		for (let i = 0; i < statusTypes.length; i++) {
			if (statusTypes[i].skip) {
				skipSeqSet.add(statusTypes[i].step)
			}
		}
		let list = [];
		for (let i = 0; i < eventTypes.length; i++) {
			if (skipSeqSet.has(Number(eventTypes[i].fromStatusTypeSeq))) {
				continue;
			}
			if (skipSeqSet.has(Number(eventTypes[i].toStatusTypeSeq))) {
				continue;
			}
			list.push(eventTypes[i]);
		}
		return list;
	}

	/**
	 * イベントタイプのリストから作成した、開始ステータスタイプのシーケンスと該当イベントリストのMapを返却します.
	 * @param eventTypes イベントタイプのリスト
	 * @return イベントタイプのリストから作成した、開始ステータスタイプのシーケンスと該当イベントリストのMap
	 */
	private getFromSeqAndEventTypesMap(eventTypes: any[]): Map<number, any[]> {
		let map: Map<number, any[]> = new Map();
		for (let i = 0; i < eventTypes.length; i++) {
			let fromSeq = eventTypes[i].fromStatusTypeSeq;
			let list = map.get(fromSeq);
			if (!list) {
				list = [];
			}
			list.push(eventTypes[i]);
			map.set(fromSeq, list);
		}
		return map;
	}

	/**
	 * イベントタイプのリストから作成した、開始ステータスタイプのシーケンスと該当イベントリストのMapを返却します.
	 * getFromSeqAndEventTypesMapから再帰的に呼ばれます.
	 * @param startSeq 開始シーケンス
	 * @param statusTypes ステータスタイプのリスト
	 * @param eventTypes イベントタイプのリスト
	 * @param fromSeqAndEventTypes シーケンスと該当イベントリストのMap
	 * @param lastSeq 終了（公開済み）シーケンス
	 * @return イベントタイプのリストから作成した、開始ステータスタイプのシーケンスと該当イベントリストのMap
	 */
	private getApproveRouteRecursive(startSeq: number, statusTypes: EIMWorkflowStatusType[],
			fromSeqAndEventTypes: Map<number, EIMWorkflowEventType[]>, lastSeq: number): EIMWorkflowEventType[] {

		// 開始シーケンスから伸びるイベントタイプを取得（イベントタイプは短いルートが優先になるようソート）
		let nextEventTypes: EIMWorkflowEventType[] = fromSeqAndEventTypes.get(startSeq);
		if (!nextEventTypes) {
			return null;
		}

		let nextStatusType = null;
		for (let seq = startSeq + 1; seq <= lastSeq; seq++) {
			let statusType: EIMWorkflowStatusType = this.getStatusTypeBySeq(statusTypes, seq);
			if (!statusType || statusType.skip) {
				continue;
			}
			nextStatusType = statusType;
			break;
		}
		if (!nextStatusType) {
			return null;
		}

		let routes = null;
		for (let i = 0; i < nextEventTypes.length; i++) {
			if (nextEventTypes[i].toStatusTypeSeq !== nextStatusType.step) {
				continue;
			}
			if (nextStatusType.step === lastSeq) {
				routes = [nextEventTypes[i]];
			} else {
				routes = this.getApproveRouteRecursive(Number(nextEventTypes[i].toStatusTypeSeq), statusTypes, fromSeqAndEventTypes, lastSeq);
				if (routes) {
					routes.push(nextEventTypes[i]);
				}
			}
		}

		return routes;
	}
}
