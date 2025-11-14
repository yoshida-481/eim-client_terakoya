import { EventEmitter, Output, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramOptions, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';

import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';

/**
 * ワークフローダイアグラムコンポーネントサービス.
 */
@Injectable()
export class EIMTaskWorkflowDiagramComponentService extends EIMDiagramComponentService {

	/** ステータスタイプラベルの1行の最大文字数 */
	static readonly MAX_LABEL_STRING_LENGTH: number = 10;
	/** ステータスタイプラベルの最大行数 */
	static readonly MAX_LABEL_ROW_LENGTH: number = 4;

	/** ステータスタイプの幅 */
	static readonly STATUS_TYPE_WIDTH: number = 130;
	/** ステータスタイプの高さ */
	static readonly STATUS_TYPE_HEIGHT: number = 60;
	/** ステータスタイプ間の距離 */
	static readonly STATUS_TYPE_SPACE_WIDTH: number = 15;

	/** 高さ調整値 */
	public adjustHeightValue: number = 104;

	/**
	 * コンストラクタです.
	 */
	constructor(zone: NgZone) {
		super(zone);
	}

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

		let workflow: EIMWorkflowDomain = param.dto.exAttributeMap.workflow;
		if (!workflow) {
			this.clear(info);
			return;
		}
		let elements: EIMDiagramElement[] = this.createDiagramElement(info, workflow, {currentStatus: param.dto.status});
		this.setData(info, elements, null);
		info.cy.resize();

		let viewWidth: number = info.component.element.clientWidth;
		let renderedPosition: any = info.cy.$("#" + param.dto.status.type.id).renderedPosition();
		let panX: number = 100;
		let targetRightX: number = renderedPosition.x + EIMTaskWorkflowDiagramComponentService.STATUS_TYPE_WIDTH * info.cy.zoom() + panX;
		if (viewWidth < targetRightX) {
			// 現行ステータスタイプが画面からはみ出す場合
			panX = -renderedPosition.x + viewWidth / 2;
		}
		let panY = info.cy.height() - this.adjustHeightValue;
		info.cy.pan({
			x: panX,
			y: panY
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

		let id:number = -1;
		let nodeCnt:number = 0;
		let preId:number = -1;

		let elements: EIMDiagramElement[] = [];
		for (let i = 0; i < workflow.statusTypeList.length; i++) {
			// タスク追加
			let statusType: EIMStatusTypeDomain = workflow.statusTypeList[i];
			let classes: string = "";

			if (currentStatus.type.id == statusType.id) {
				classes = "current"
			}
			elements.push(this.createNode({id: statusType.id, label: this.getLabel(
					statusType.name, EIMTaskWorkflowDiagramComponentService.MAX_LABEL_STRING_LENGTH, EIMTaskWorkflowDiagramComponentService.MAX_LABEL_ROW_LENGTH),
					domain: statusType, classes: classes,
					position: {
						x: nodeCnt * (EIMTaskWorkflowDiagramComponentService.STATUS_TYPE_WIDTH + EIMTaskWorkflowDiagramComponentService.STATUS_TYPE_SPACE_WIDTH),
						y: 65 },
					selectable: true }));
			nodeCnt++;

			// フロー追加
			if (nodeCnt != 1) {
				elements.push(this.createEdge({id: id--, label: '', sourceId: preId, targetId: statusType.id, selectable: false}));
			}
			preId = statusType.id;
		}

		return elements;
	}

	/**
	 * ダイアグラムのオプションを設定します.
	 * @param options オプション
	 */
	protected setOptions(options: EIMDiagramOptions): void {
		super.setOptions(options);
		options.zoom = 1;
		options.maxZoom = 2;
		options.style = [];
		options.style.push(
			{
				selector: 'node',
				style: {
					width: EIMTaskWorkflowDiagramComponentService.STATUS_TYPE_WIDTH,
					height: EIMTaskWorkflowDiagramComponentService.STATUS_TYPE_HEIGHT,
					'shape': 'rectangle',
					'background-color': '#fff',
					'border-width': 2,
					'border-style': 'solid',
					'border-color': '#208c16',
					'label': 'data(label)',
					'text-valign': 'center',
					'font-size': 12,
					'color': '#555',
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
					'width': 1,
					'line-color': '#555555',
					'target-arrow-color': '#555555',
					'target-arrow-shape': 'triangle',
					'arrow-scale': 2,
					'font-size': 12,
					'color': '#fff',
					'label': 'data(label)',
					'text-outline-width': 2,
					'text-outline-color': '#555555',
				}
			}
		);
		options.style.push(
				{
					selector: 'edge:selected',
					style: {
						'line-color': '#a8e8fd',
						'target-arrow-color': '#a8e8fd',
						'text-outline-color': '#a8e8fd',
					}
				}
			);
	}

	/**
	 * エッジの各ポイントの距離
	 */
	protected getDistances(element): any[] {
		return [0, 0];
	}

	/**
	 * エッジの各ポイントの重み
	 */
	protected getWeights(element): any[] {
		return [0.1, 0.8, 0.1];
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
			sub = "..."
		}
		let label: string = labels.join("\n");
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
