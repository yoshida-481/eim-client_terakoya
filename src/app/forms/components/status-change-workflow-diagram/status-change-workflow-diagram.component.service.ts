import { EventEmitter, Output, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMDiagramComponent } from '../../../shared/components/diagram/diagram.component';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramOptions, EIMDiagramComponentInfo } from '../../../shared/components/diagram/diagram.component.service';

import { EIMWorkflowDiagramComponentService } from '../workflow-diagram/workflow-diagram.component.service';

import { EIMFormService } from '../../shared/services/apis/form.service';

import { EIMEventTypeDomain } from '../../../shared/domains/entity/event-type.domain';
import { EIMFormDomain } from '../../../shared/domains/form.domain';
import { EIMStatusDomain } from '../../../shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from '../../../shared/domains/entity/status-type.domain';
import { EIMWorkflowDomain } from '../../../shared/domains/entity/workflow.domain';

/**
 * ワークフロー(トランザクション)ダイアグラムコンポーネントサービス.
 * オブジェクトタイプに設定されたステータス、イベント情報からワークフローのマスタを表示します.
 */
@Injectable()
export class EIMStatusChangeWorkflowDiagramComponentService extends EIMWorkflowDiagramComponentService {

	/** ステータスタイプの幅 */
	static readonly STATUS_TYPE_WIDTH: number = 110;
	/** ステータスタイプの高さ */
	static readonly STATUS_TYPE_HEIGHT: number = 60;
	/** イベントタイプラベルの1行の最大文字数 */
	static readonly EVENT_TYPE_MAX_LABEL_STRING_LENGTH: number = 11;
	/** イベントタイプラベルの最大行数 */
	static readonly EVENT_TYPE_MAX_LABEL_ROW_LENGTH: number = 1;
	
	/**
	 * コンストラクタです.
	 */
	constructor(
			protected formService: EIMFormService, zone: NgZone) {
		super(zone);
	}

	/** ステータス左上点間の距離 */
	protected unitStatusDistance: number = 250;

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param param ワークフローダイアグラムコンポーネントパラメータ
	 */
	public show(info: EIMDiagramComponentInfo, param: any): void {
		if (!info.cy) {
			return;
		}
		
		let workflow = param.workflow;
		if (!workflow) {
			this.clear(info);
			return;
		}
		let elements: EIMDiagramElement[] = this.createDiagramElement(info, workflow, {currentStatus: param.form.status, eventTypeList: param.eventTypeList});
		this.setData(info, elements, null);
		info.cy.resize();
		info.cy.fit();
		// 再度描画後にフィットする
		setTimeout(function(){
			info.cy.fit();
		});
	}

	/**
	 * ワークフローダイアグラムを描画します.
	 * @param info ワークフローダイアグラムコンポーネントインフォメーション
	 * @param workflow ワークフロー情報
	 * @param params パラメータ{currentStatus: EIMStatusDomain}
	 */
	public createDiagramElement(info: EIMDiagramComponentInfo, workflow: EIMWorkflowDomain, params: any): EIMDiagramElement[] {

		info.diagramName = workflow.name;
		let currentStatus: EIMStatusDomain = params.currentStatus;
		
		// 現行ステータスの遷移先となるステータスタイプ、イベントタイプを抽出
		let targetEventTypeList: EIMEventTypeDomain[] = params.eventTypeList;
		let targetStatusTypeList: EIMStatusTypeDomain[] = this.getStatusTypeList(workflow, targetEventTypeList);

		// ステータスタイプIDと左からの位置（インデックス）のマップ生成
		let statusTypeIDAndXIndexMap = {};
		for (let i = 0; i < targetStatusTypeList.length; i++) {
			statusTypeIDAndXIndexMap[targetStatusTypeList[i].id] = i;
		}
		
		// ステータスタイプのノードを追加
		let elements: EIMDiagramElement[] = [];
		for (let i = 0; i < targetStatusTypeList.length; i++) {
			let statusType: EIMStatusTypeDomain = targetStatusTypeList[i];

			let classes: string = '';
			if (currentStatus.type.id == statusType.id) {
				classes = 'current';
			}
			let xIndex: number = statusTypeIDAndXIndexMap[statusType.id];
			elements.push(this.createNode({
				id:statusType.id, label: this.getLabel(statusType.name, EIMWorkflowDiagramComponentService.MAX_LABEL_STRING_LENGTH, EIMWorkflowDiagramComponentService.MAX_LABEL_ROW_LENGTH), 
				domain: statusType, classes: classes, 
				position: { x: xIndex * this.unitStatusDistance, y: 20 }, selectable: false }));
		}
		
		targetEventTypeList.sort(function(a: EIMEventTypeDomain,b: EIMEventTypeDomain){
			// イベントタイプを横の距離が短い順にソート
			// （横の距離が短いほど内側にするため）
			let distanceA = statusTypeIDAndXIndexMap[a.fromStatusType.id] - statusTypeIDAndXIndexMap[a.toStatusType.id];
			let distanceB = statusTypeIDAndXIndexMap[b.fromStatusType.id] - statusTypeIDAndXIndexMap[b.toStatusType.id];
			if( Math.abs(distanceA) < Math.abs(distanceB) ) return -1;
			if( Math.abs(distanceA) > Math.abs(distanceB) ) return 1;

			// 右向きを優先する
			if( distanceA < distanceB ) return -1;
			if( distanceA > distanceB ) return 1;
			
			return 0;
		});

		// イベントタイプのエッジを追加
		let fromToStatusTypeIdMap = {};
		for (let i = 0; i < targetEventTypeList.length; i++) {
			let targetEventType = targetEventTypeList[i];
			let fromStatusId: number = targetEventType.fromStatusType.id;
			let toStatusId: number = targetEventType.toStatusType.id;
			
			let yDistance: number = this.getMaxYDistance(fromStatusId, toStatusId, statusTypeIDAndXIndexMap, fromToStatusTypeIdMap);
			if (yDistance == -1) {
				// まだエッジがない場合
				if (this.getMaxYDistance(toStatusId, fromStatusId, statusTypeIDAndXIndexMap, fromToStatusTypeIdMap) == -1) {
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
			let element = this.createEdge({
						id: eventType.id, 
						label: this.getLabel(eventType.name, EIMStatusChangeWorkflowDiagramComponentService.EVENT_TYPE_MAX_LABEL_STRING_LENGTH, EIMStatusChangeWorkflowDiagramComponentService.EVENT_TYPE_MAX_LABEL_ROW_LENGTH), 
						domain: eventType, 
            sourceId: eventType.fromStatusType.id, targetId: eventType.toStatusType.id, selectable: true, distance: yDistance * 1.5});
			elements.push(element);
		}

		return elements;
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
					width: EIMStatusChangeWorkflowDiagramComponentService.STATUS_TYPE_WIDTH,
					height: EIMStatusChangeWorkflowDiagramComponentService.STATUS_TYPE_HEIGHT,
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
				if (workflow.statusTypeList[i].id == targetEventTypeList[j].fromStatusType.id 
						|| workflow.statusTypeList[i].id == targetEventTypeList[j].toStatusType.id) {
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
		let yDistance: number = -1;

		// イベントタイプ（矢印）の間にあるステータスタイプIDのリストを取得
		let targetStatusTypeIds: number[] = this.getStatusTypeIdsWithinRange(fromStatusTypeId, toStatusTypeId, statusTypeIDAndXIndexMap);
		if (xDistance < 0) {
			targetStatusTypeIds = targetStatusTypeIds.reverse();
		}
		
		// from、toがイベントタイプ（矢印）の間にある内の最大のY距離を取得
		for(let i = 0; i < targetStatusTypeIds.length; i++) {
			let myFromStatusTypeId: number = targetStatusTypeIds[i]
			let toStatusTypeIdMap: any = fromToStatusTypeIdMap[myFromStatusTypeId];
			if (!toStatusTypeIdMap) {
				break;
			}

			for(let j = 0; j < targetStatusTypeIds.length; j++) {
				let toStatusTypeId: number = targetStatusTypeIds[j]
				if (!toStatusTypeIdMap.hasOwnProperty(toStatusTypeId)) {
					continue;
				}
				
				if (xDistance < 0 && this.getXDistance(Number(myFromStatusTypeId), Number(toStatusTypeId), statusTypeIDAndXIndexMap) < 0) {
					yDistance = Math.max(yDistance, toStatusTypeIdMap[toStatusTypeId]);
				} else if (xDistance > 0 && this.getXDistance(Number(myFromStatusTypeId), Number(toStatusTypeId), statusTypeIDAndXIndexMap) > 0) {
					yDistance = Math.max(yDistance, toStatusTypeIdMap[toStatusTypeId]);
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
		for( let statusTypeIdStr in statusTypeIDAndXIndexMap) {
			let statusTypeId: number = Number(statusTypeIdStr);
			let targetXDistance: number = statusTypeIDAndXIndexMap[statusTypeId] - fromXIndex;
			if (xDistance >= 0 && targetXDistance >= 0 && targetXDistance <= xDistance) {
				list.push(statusTypeId);
			} else if (xDistance <= 0 && targetXDistance <= 0 && targetXDistance >= xDistance) {
				list.push(statusTypeId);
			}
		}
		
		return list;
	}
}
