import { EventEmitter, Output, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMDiagramComponent } from '../../../shared/components/diagram/diagram.component';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramOptions, EIMDiagramComponentInfo } from '../../../shared/components/diagram/diagram.component.service';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMWorkflowDiagramComponent } from 'app/admins/components/workflow-diagram/workflow-diagram.component';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

/**
 * ワークフロー(トランザクション)ダイアグラムコンポーネントサービス.
 * オブジェクトタイプに設定されたステータス、イベント情報からワークフローのマスタを表示します.
 */
@Injectable()
export class EIMWorkflowDiagramComponentService extends EIMDiagramComponentService {
	/** ステータスタイプの幅 */
	static readonly STATUS_TYPE_WIDTH: number = 110;

	/** ステータスタイプの高さ */
	static readonly STATUS_TYPE_HEIGHT: number = 60;

	/** イベントタイプラベルの1行の最大文字数 */
	static readonly EVENT_TYPE_MAX_LABEL_STRING_LENGTH: number = 11;

	/** イベントタイプラベルの最大行数 */
	static readonly EVENT_TYPE_MAX_LABEL_ROW_LENGTH: number = 1;

	/** ステータスタイプラベルの1行の最大文字数 */
	static readonly MAX_LABEL_STRING_LENGTH: number = 10;

	/** ステータスタイプラベルの最大行数 */
	static readonly MAX_LABEL_ROW_LENGTH: number = 4;

	/** ステータス左上点間の距離 */
	protected unitStatusDistance = 150;

	// マウスダウンイベント中かどうか（画面ドラッグ判定用）
	private inMouseDownEvent = false;

	// 画面ドラッグイベント中かどうか（エレメント選択判定用）
	private inViewDragEvent = false;

	// マウスアウトイベント中かどうか（エレメント選択判定用）
	private inMouseOutEvent = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public zone: NgZone,
		protected localStorageService: EIMLocalStorageService) {
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
	 * @param selected 選択エミッタ
	 */
	public initialize(info: EIMDiagramComponentInfo, serviceParam?: any, initialize?: EventEmitter<any>, changed?: EventEmitter<any>,  selected?: EventEmitter<any>): void {
		super.initialize(info, serviceParam, initialize, changed, selected);
		info.cy.on('mousedown', (event): void => {
			this.inMouseDownEvent = true;
			this.inViewDragEvent = false;
			this.inMouseOutEvent = false;
		});
		info.cy.on('viewport', (event): void => {
			if (this.inMouseDownEvent) {
				// マウスダウンした場合のみドラッグと判定
				// フィット、拡大、縮小の場合はドラッグと判定しないため
				this.inViewDragEvent = true;
			}
		});
		info.cy.on('mouseout', (event): void => {
			this.inMouseOutEvent = true;
		});
		info.cy.on('mouseup', (event): void => {
			if (this.inViewDragEvent) {
				// 画面ドラッグの場合は選択が変更されないため何もしない
				return;
			}
			if (this.inMouseOutEvent) {
				// エレメントから外れた場合は選択が変更されないため何もしない
				return;
			}
			if (event.target.length) {
				// エレメント選択
				(info.component as EIMWorkflowDiagramComponent).onSelectElement(event.target.data());
			} else {
				// エレメント非選択
				(info.component as EIMWorkflowDiagramComponent).onUnSelectElement(null);
			}
		});
	}

	/**
	 * 画面描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param param ワークフローダイアグラムコンポーネントパラメータ
	 */
	public show(info: EIMDiagramComponentInfo, param: any): void {
		this.update(info, param.workflow);
		info.cy.resize();
		// 再度描画後にフィットする
		setTimeout(function() {
			let panX = 100;
			let statusTypeHeight: number = EIMWorkflowDiagramComponentService.STATUS_TYPE_HEIGHT;
			let panY = info.cy.height() / 2 - statusTypeHeight * info.cy.zoom() / 3;
			info.cy.pan({
				x: panX,
				y: panY
			});
		});
	}

	/**
	 * ワークフローダイアグラムを描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @return ワークフローダイアグラムコンポーネント要素リスト
	 */
	public createDiagramElement(info: EIMDiagramComponentInfo, workflow: EIMWorkflowDomain): EIMDiagramElement[] {

		let langId: string = this.localStorageService.getLangId();
		info.diagramName = workflow.nameList[langId];

		// 現行ステータスの遷移先となるステータスタイプ、イベントタイプを抽出
		let targetEventTypeList: EIMEventTypeDomain[] = workflow.eventTypeList;
		let targetStatusTypeList: EIMStatusTypeDomain[] = workflow.statusTypeList;

		// ステータスタイプIDと左からの位置（インデックス）のマップ生成
		let statusTypeIDAndXIndexMap = {};
		for (let i = 0; i < targetStatusTypeList.length; i++) {
			statusTypeIDAndXIndexMap[targetStatusTypeList[i].id] = targetStatusTypeList[i].seq - 1;
		}

		// ステータスタイプのノードを追加
		let elements: EIMDiagramElement[] = [];
		for (let i = 0; i < targetStatusTypeList.length; i++) {
			let statusType: EIMStatusTypeDomain = targetStatusTypeList[i];

			let xIndex: number = statusTypeIDAndXIndexMap[statusType.id];
			elements.push(this.createNode({
				id: statusType.seq, label: this.getLabel(statusType.name, EIMWorkflowDiagramComponentService.MAX_LABEL_STRING_LENGTH, EIMWorkflowDiagramComponentService.MAX_LABEL_ROW_LENGTH),
				domain: statusType, classes: '',
				position: { x: xIndex * this.unitStatusDistance, y: 20 }, selectable: true }));
		}

		targetEventTypeList.sort(function(a: EIMEventTypeDomain, b: EIMEventTypeDomain) {
			// イベントタイプを横の距離が短い順にソート
			// （横の距離が短いほど内側にするため）
			let distanceA: number = statusTypeIDAndXIndexMap[a.fromStatusTypeId] - statusTypeIDAndXIndexMap[a.toStatusTypeId];
			let distanceB: number = statusTypeIDAndXIndexMap[b.fromStatusTypeId] - statusTypeIDAndXIndexMap[b.toStatusTypeId];
			if ( Math.abs(distanceA) < Math.abs(distanceB) ) {return -1};
			if ( Math.abs(distanceA) > Math.abs(distanceB) ) {return 1};

			// 右向きを優先する
			if ( distanceA < distanceB ) {return -1};
			if ( distanceA > distanceB ) {return 1};

			// イベントシーケンスの順にソート
			if ( a.sequence < b.sequence ) {return -1};
			if ( a.sequence > b.sequence ) {return 1};

			return 0;
		});

		// イベントタイプのエッジを追加
		let fromToStatusTypeIdMap = {};
		for (let i = 0; i < targetEventTypeList.length; i++) {
			let targetEventType: EIMEventTypeDomain = targetEventTypeList[i];
			let fromStatusId: number = targetEventType.fromStatusTypeId;
			let toStatusId: number = targetEventType.toStatusTypeId;

			let yDistance: number = this.getMaxYDistance(fromStatusId, toStatusId, statusTypeIDAndXIndexMap, fromToStatusTypeIdMap);
			if (yDistance === -1) {
				// まだエッジがない場合
				if (this.getMaxYDistance(toStatusId, fromStatusId, statusTypeIDAndXIndexMap, fromToStatusTypeIdMap) === -1) {
					// 逆向きもなければ0（真ん中の線）
					yDistance = 0;
				} else {
					// 逆向きがあればずらす
					yDistance = 1;
				}
			} else {
				yDistance++;
			}
			this.setMaxYDistance(fromStatusId, toStatusId, yDistance, fromToStatusTypeIdMap);

			// イベントタイプ（矢印）追加
			let eventType: EIMEventTypeDomain = targetEventType;
			// ステータスのシーケンスと重複する可能性があるためIDをマイナスにしている
			let elementId = eventType.id;
			if (elementId > 0) {
				// 既存のイベントタイプの場合はステータスのIDと重複しないようマイナスにする
				elementId = -elementId;
			}
			let element = this.createEdge({
				id: elementId, label: '',
				domain: eventType,
				sourceId: eventType.fromStatusTypeSequence, targetId: eventType.toStatusTypeSequence, selectable: true, distance: yDistance * 1.5});
			elements.push(element);
		}

		return elements;
	}

	/**
	 * ワークフロー表示内容を更新します.
	 * @param info インフォ
	 * @param workflow ワークフロー
	 */
	public update(info: EIMDiagramComponentInfo, workflow: EIMWorkflowDomain): void {
		if (!info.cy) {
			return;
		}

		this.clear(info);
		if (!workflow) {
			return;
		}
		let elements: EIMDiagramElement[] = this.createDiagramElement(info, workflow);
		this.setData(info, elements, null);
	}

	/**
	 * ステータスタイプを追加します.
	 * @param info インフォ
	 * @param statusType ステータスタイプ
	 * @return 追加したステータスタイプエレメント
	 */
	public addStatusType(info: EIMDiagramComponentInfo, statusType: EIMStatusTypeDomain): EIMDiagramElement {

		let element: EIMDiagramElement = this.createNode({
			id: statusType.seq,
			label: this.getLabel(statusType.name, EIMWorkflowDiagramComponentService.MAX_LABEL_STRING_LENGTH, EIMWorkflowDiagramComponentService.MAX_LABEL_ROW_LENGTH),
			domain: statusType,
			classes: '',
			position: { x: (statusType.seq - 1) * this.unitStatusDistance, y: 20 }, selectable: true });
		info.options.elements.push(element);

		// 追加分
		info.cy.add(element);
		info.cy.getElementById(element.id).animate({
			style: {opacity: 1}
		}, {
			duration: 300
		});

		return element;
	}

	/**
	 * イベント遷移元のステータスタイプ表示を更新します.
	 * @param info インフォ
	 * @param fromStatusType 遷移元ステータスタイプ
	 * @param select 選択するかどうか
	 */
	public updateFromStatusType(info: EIMDiagramComponentInfo, fromStatusType: EIMStatusTypeDomain, select: boolean): void {

		let element: any = info.cy.nodes('#' + fromStatusType.seq);
		if (select) {
			element.addClass('fromStatusType');
		} else {
			element.removeClass('fromStatusType');
		}
	}

	/**
	 * エレメントを返却します.
	 * @param info インフォ
	 * @param id エレメントID
	 * @return エレメント
	 */
	public getElement(info: EIMDiagramComponentInfo, id: number): EIMDiagramElement {
		return info.cy.$('#' + id).data();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ダイアグラムのオプションを設定します.
	 * @param options オプション
	 */
	protected setOptions(options: EIMDiagramOptions): void {
		super.setOptions(options);
		options.zoom = 1;
		options.maxZoom = 1.5;
		options.style = [];

		options.style.push(
			{
				selector: 'node',
				style: {
					width: EIMWorkflowDiagramComponentService.STATUS_TYPE_WIDTH,
					height: EIMWorkflowDiagramComponentService.STATUS_TYPE_HEIGHT,
					'shape': 'rectangle',
					'background-color': '#fff',
					'border-width': 2,
					'border-style': 'solid',
					'border-color': '#208c16',
					'label': 'data(label)',
					'text-valign': 'center',
					'font-size': 10,
					'text-wrap': 'wrap',
				}
			}
		);
		options.style.push(
			{
				selector: 'node.fromStatusType',
				style: {
					'background-color': '#ffc000',
					'border-color': '#ffc000',
				}
			}
		);
		options.style.push(
				{
					selector: 'node.current',
					style: {
						'background-color': '#2e9633',
						'border-color': '#f4f022',
						'color': '#fff',
					}
				}
			);
		options.style.push(
			{
				selector: 'node:selected',
				style: {
					'background-color': '#a8e8fd',
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
				selector: 'edge:loop',
				style: {
					'curve-style': 'bezier',
					'loop-direction': '60deg',
					'loop-sweep': '-30deg',
					'control-point-step-size': 60
				}
			}
		);
		options.style.push(
			{
				selector: 'edge:selected',
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
	 * 表示対象となるステータスタイプを返却します.
	 * @param workflow ワークフロー情報
	 * @param targetEventTypeList 表示対象のイベントタイプ配列
	 * @return ステータスタイプ配列
	 */
	protected getStatusTypeList(workflow: EIMWorkflowDomain, targetEventTypeList: EIMEventTypeDomain[]): EIMStatusTypeDomain[] {
		let targetStatusTypeList: EIMStatusTypeDomain[] = [];

		for (let i = 0; i < workflow.statusTypeList.length; i++) {
			for (let j = 0; j < targetEventTypeList.length; j++) {
				if (workflow.statusTypeList[i].id === targetEventTypeList[j].fromStatusTypeId
						|| workflow.statusTypeList[i].id === targetEventTypeList[j].toStatusTypeId) {
					targetStatusTypeList.push(workflow.statusTypeList[i]);
					break;
				}
			}
		}

		return targetStatusTypeList;
	}

	/**
	 * from,toステータスタイプ間の縦方向の最大距離を返却します.
	 * @param fromStatusTypeId fromのステータスタイプID
	 * @param toStatusTypeId toのステータスタイプID
	 * @param statusTypeIDAndXIndexMap ステータスタイプIDと横方向のインデックスのマップ
	 * @return 縦方向の最大距離
	 */
	protected getMaxYDistance(fromStatusTypeId: number, toStatusTypeId: number, statusTypeIDAndXIndexMap: any, fromToStatusTypeIdMap: any): number {

		let xDistance: number = this.getXDistance(fromStatusTypeId, toStatusTypeId, statusTypeIDAndXIndexMap);
		let yDistance = -1;

		// イベントタイプ（矢印）の間にあるステータスタイプIDのリストを取得
		let targetStatusTypeIds: number[] = this.getStatusTypeIdsWithinRange(fromStatusTypeId, toStatusTypeId, statusTypeIDAndXIndexMap);
		if (xDistance < 0) {
			targetStatusTypeIds = targetStatusTypeIds.reverse();
		}

		// from、toがイベントタイプ（矢印）の間にある内の最大のY距離を取得
		for (let i = 0; i < targetStatusTypeIds.length; i++) {
			let myFromStatusTypeId: number = targetStatusTypeIds[i]
			let toStatusTypeIdMap: any = fromToStatusTypeIdMap[myFromStatusTypeId];
			if (!toStatusTypeIdMap) {
				continue;
			}

			for (let j = 0; j < targetStatusTypeIds.length; j++) {
				let myToStatusTypeId: number = targetStatusTypeIds[j]
				if (!toStatusTypeIdMap.hasOwnProperty(myToStatusTypeId)) {
					continue;
				}

				if (xDistance < 0 && this.getXDistance(Number(myFromStatusTypeId), Number(myToStatusTypeId), statusTypeIDAndXIndexMap) < 0) {
					yDistance = Math.max(yDistance, toStatusTypeIdMap[myToStatusTypeId]);
				} else if (xDistance > 0 && this.getXDistance(Number(myFromStatusTypeId), Number(myToStatusTypeId), statusTypeIDAndXIndexMap) > 0) {
					yDistance = Math.max(yDistance, toStatusTypeIdMap[myToStatusTypeId]);
				}
			}
		}

		// ステータスタイプのノードを飛び越える場合は、ノードにかぶらない距離に変更
		if ((xDistance > 1 || xDistance < -1) && yDistance < 2) {
			yDistance = 2;
		}

		return yDistance;
	}

	/**
	 * from,toステータスタイプ間の縦方向の最大距離を設定します.
	 * @param fromStatusTypeId fromのステータスタイプID
	 * @param toStatusTypeId toのステータスタイプID
	 * @param yDistance 縦方向の最大距離
	 * @param statusTypeIDAndXIndexMap ステータスタイプIDと横方向のインデックスのマップ
	 */
	protected setMaxYDistance(fromStatusTypeId: number, toStatusTypeId: number, yDistance: number, fromToStatusTypeIdMap): void {
		if (!fromToStatusTypeIdMap[fromStatusTypeId]) {
			fromToStatusTypeIdMap[fromStatusTypeId] = {};
		}

		let toStatusTypeIdMap = fromToStatusTypeIdMap[fromStatusTypeId];
		if (!toStatusTypeIdMap[toStatusTypeId]) {
			toStatusTypeIdMap[toStatusTypeId] = {};
		}
		toStatusTypeIdMap[toStatusTypeId] = yDistance;
	}

	/**
	 * from,toステータスタイプ間の横方向の距離を返却します.
	 * @param fromStatusTypeId fromのステータスタイプID
	 * @param toStatusTypeId toのステータスタイプID
	 * @param statusTypeIDAndXIndexMap ステータスタイプIDと横方向のインデックスのマップ
	 * @return 横方向の距離
	 */
	protected getXDistance(fromStatusTypeId: number, toStatusTypeId: number, statusTypeIDAndXIndexMap): number {
		return statusTypeIDAndXIndexMap[toStatusTypeId] - statusTypeIDAndXIndexMap[fromStatusTypeId];
	}

	/**
	 * From,Toのステータスタイプの間に表示されているステータスタイプのリストを返却します.
	 * @param fromStatusTypeId fromのステータスタイプID
	 * @param toStatusTypeId toのステータスタイプID
	 * @param statusTypeIDAndXIndexMap ステータスタイプIDと横方向のインデックスのマップ
	 * @return ステータスタイプのリスト
	 */
	protected getStatusTypeIdsWithinRange(fromStatusTypeId: number, toStatusTypeId: number, statusTypeIDAndXIndexMap): number[] {
		let list: number[] = [];

		let fromXIndex: number = statusTypeIDAndXIndexMap[fromStatusTypeId];
		let xDistance: number = statusTypeIDAndXIndexMap[toStatusTypeId] - fromXIndex;
		for ( let statusTypeIdStr in statusTypeIDAndXIndexMap) {
			if (statusTypeIDAndXIndexMap.hasOwnProperty(statusTypeIdStr)) {
				let statusTypeId: number = Number(statusTypeIdStr);
				let targetXDistance: number = statusTypeIDAndXIndexMap[statusTypeId] - fromXIndex;
				if (xDistance >= 0 && targetXDistance >= 0 && targetXDistance <= xDistance) {
					list.push(statusTypeId);
				} else if (xDistance <= 0 && targetXDistance <= 0 && targetXDistance >= xDistance) {
					list.push(statusTypeId);
				}
			}
		}
		return list;
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
			sub = '...';
		}
		let label: string = labels.join('\n');
		if (sub != null) {
			label = label.substr(0, label.length - 1) + sub;
		}
		return label;
	}

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
}
