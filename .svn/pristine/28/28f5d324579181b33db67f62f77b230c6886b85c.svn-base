import cytoscape from "cytoscape";

import { EventEmitter, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';

import { EIMDiagramComponent } from './diagram.component';

/** エレメント情報 */
export interface EIMDiagramElement {
	id?: number,
	selectable?: boolean,
	position?: any,
}
/** ノード情報 */
export interface EIMDiagramNode extends EIMDiagramElement {
	label?: string;
	position?: { x: number, y: number },
	renderedPosition?: { x: number, y: number },
	classes?: string,

	domain?: any,
	params?: any
}

/** エッジ情報 */
export interface EIMDiagramEdge extends EIMDiagramElement {
	sourceId?: number,
	targetId?: number
	classes?: string,
	label?: string,
	distance?: number,

	domain?: any,
	params?: any
}

/** スタイル情報 */
export interface EIMDiagramStyle {
	selector: string,
	style: any,
}

/** オプション情報 */
export interface EIMDiagramOptions {
	container?: HTMLElement,
	elements?: EIMDiagramElement[],
	style?: EIMDiagramStyle[],
	zoom?: number,
	maxZoom?: number,
	minZoom?: number,
	pan?: any,
	autolock?: any,
	layout?: any,
}

/** ダイアグラム情報 */
export interface EIMDiagramComponentInfo extends EIMListComponentInfo<EIMDiagramElement> {
	component?: EIMDiagramComponent,
	options?: EIMDiagramOptions;
	cy?: any;
	zoomLevel?: number;
	minZoom?: number;
	maxZoom?: number;
	diagramName?: string;
	param?: any;
	preSelectedData?: EIMDiagramElement[];
	canEmitChangeEvent?: boolean;
	contextMenuItems?: MenuItem[];
	onContextMenu?: (info: EIMDiagramComponentInfo, data: any) => void;
	multiple?: boolean;
}

/** ノード拡張情報 */
export interface EIMDiagramNodeEx extends EIMDiagramNode {
	data?: any,
}

/** エッジ拡張情報 */
export interface EIMDiagramEdgeEx extends EIMDiagramEdge {
	data?: any,
}

/**
 * ダイアグラムコンポーネントサービス
 */
@Injectable()
export class EIMDiagramComponentService implements EIMListComponentService<EIMDiagramElement> {

	/**
	 * コンストラクタです.
	 */
	constructor(public zone: NgZone) {
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
		// DOM要素の存在確認
		if (!info.cy) {
			console.warn('Container element not found for Cytoscape initialization');
			return;
		}

		// info.cyがDOM要素の場合、containersに保存
		const containerElement = info.cy;
		info.options.container = containerElement;
		this.setOptions(info.options);

		// Cytoscapeインスタンス化前のチェック
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

			// 選択変更がなかった場合の選択エミッタ発火
			selected.emit();

			if (info.multiple == false) {
				// シングル選択のみ許容の場合
				let selectedData: any = event.target._private.data;
				let selectedAll: any[] = this.getSelectedData(info);
				let unselectTargetIdCSV = '';
				for (let i = 0; i < selectedAll.length; i++) {
					if (selectedData.id != selectedAll[i].id) {
						if (unselectTargetIdCSV != '') {
							unselectTargetIdCSV += ',';
						}
						unselectTargetIdCSV += ' #' + selectedAll[i].id;
					}
				}
				if (unselectTargetIdCSV != '') {
					if (info.cy && typeof info.cy.$ === 'function') {
						const elements = info.cy.$(unselectTargetIdCSV);
						if (elements && typeof elements.unselect === 'function') {
							elements.unselect();
						}
					}
				}
			}

			if (info.canEmitChangeEvent) {
				info.preSelectedData = this.getSelectedData(info);
				changed.emit();
			}

		});

		info.cy.on('unselect', 'node, edge', (event): void => {
			if (this.isChangeSelectedData(info) && info.canEmitChangeEvent) {
				info.preSelectedData = this.getSelectedData(info);
				changed.emit();
			}
		});

		info.cy.on('mouseup', 'node, edge', (event): void => {

			// selectイベントは選択エレメントの変更がなければ発火されない
			// 同じエレメントを選択した際もハンドリングしたいため
			// 選択変更がなかった場合mouseupイベントでハンドリングする

			// 選択変更があった場合は処理対象外
			if (event.originalEvent.ctrlKey || event.originalEvent.shiftKey) {
				// Ctrl,Shiftキーは選択解除（選択変更）のため対象外
				return;
			}
			let isChanged = true;
			let preSelectedData: EIMDiagramElement[] = info.preSelectedData;
			if (preSelectedData.length == 1) {
				// マウスアップ前1件選択の場合
				// 同じエレメントをクリックしても選択は変わらない
				if (preSelectedData[0].id == event.target._private.data.id) {
					isChanged = false;
				}
			}
			// マウスアップ前複数件選択の場合
			// 選択が複数から1件に変更されるため変更ありとなる

			if (isChanged) {
				return;
			}

			// 選択変更がなかった場合の選択エミッタ発火
			selected.emit();
		});

		info.cy.on('cxttap', (event): void => {
			info.onContextMenu(info, event.target._private);
		});

	}

	/**
	 * 選択情報を取得します.
	 * @param info ダイアグラム情報
	 */
	public getSelectedData(info: EIMDiagramComponentInfo): EIMDiagramElement[] {
		let selectedData: EIMDiagramElement[] = [];

		// Cytoscapeインスタンスが初期化されているか確認
		if (!info.cy || typeof info.cy.$ !== 'function') {
			return selectedData;
		}

		let elements: EIMDiagramElement[] = info.options.elements
		for (let i = 0; i < elements.length; i++) {
			let element: EIMDiagramElement = elements[i];
			if (info.cy && typeof info.cy.$ === 'function') {
				const el = info.cy.$('#' + element.id);
				if (el && typeof el.selected === 'function' && el.selected()) {
					selectedData.push(element);
				}
			}
		}
		return selectedData;
	}

	/**
	 * 画面を描画します.
	 * @param info ダイアグラム情報
	 * @param param パラメータ
	 */
	public show(info: EIMDiagramComponentInfo, param?: any): void {
		// 拡張側で実装
	}

	/**
	 * エレメント情報を設定します.
	 * @param info ダイアグラム情報
	 * @param data エレメント
	 * @param changed 選択変更エミッタ
	 */
	public setData(info: EIMDiagramComponentInfo, data: EIMDiagramElement[], changed?: EventEmitter<any>): void {
		info.options.elements = data;
		// info.cyがCytoscapeインスタンスであることを確認
		if (info.cy && typeof info.cy.add === 'function') {
			info.cy.add(data);
		} else {
			console.warn('Cytoscape instance not initialized. Cannot add elements.');
		}
	}

	/**
	 * エレメント情報を取得します.
	 * @param info ダイアグラム情報
	 */
	public getData(info: EIMDiagramComponentInfo): any[] {
		return info.options.elements;
	}

	/**
	 * エレメントを選択します.
	 * @param info ダイアグラム情報
	 * @param selectedData 選択するエレメント
	 * @param selected 選択エミッタ
	 */
	public select(info: EIMDiagramComponentInfo, selectedData: EIMDiagramElement[], selected?: EventEmitter<any>): void {
		// Cytoscapeインスタンスが初期化されているか確認
		if (!info.cy || typeof info.cy.$ !== 'function') {
			console.warn('Cytoscape instance not initialized. Cannot select elements.');
			return;
		}

		if (!selected) {
			info.canEmitChangeEvent = false;
		}
		if (info.cy && typeof info.cy.$ === 'function') {
			const allElements = info.cy.$('*');
			if (allElements && typeof allElements.unselect === 'function') {
				allElements.unselect();
			}
		}

		let selectedElementIds = '';
		if (selectedData) {
			for (let i = 0; i < selectedData.length; i++) {
				if (selectedElementIds != '') {
					selectedElementIds += ',';
				}
				selectedElementIds += ' #' + selectedData[i].id;
			}
		}

		if (selectedElementIds == '') {
			if (info.cy && typeof info.cy.$ === 'function') {
				const allElements = info.cy.$('*');
				if (allElements && typeof allElements.unselect === 'function') {
					allElements.unselect();
				}
			}
		} else {
			if (info.cy && typeof info.cy.$ === 'function') {
				const elements = info.cy.$(selectedElementIds);
				if (elements && typeof elements.select === 'function') {
					elements.select();
				}
			}
		}

		info.preSelectedData = this.getSelectedData(info);
		info.canEmitChangeEvent = true;
	}

	/**
	 * 画面を消去します.
	 * @param info ダイアグラム情報
	 */
	public clear(info: EIMDiagramComponentInfo): void {
		info.diagramName = '';
		if (info.cy && typeof info.cy.$ === 'function') {
			info.cy.$('*').remove();
		}
	}

	/**
	 * ドメインから描画するエレメントを生成します.
	 * @param info ダイアグラム情報
	 * @param domain ドメイン
	 * @param params パラメータ
	 * @return エレメント情報
	 */
	public createDiagramElement(info: EIMDiagramComponentInfo, domain: any, params?: any): EIMDiagramElement[] {
			return [];
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択情報が変更されたかどうかを返却します.
	 * @param info ダイアグラム情報
	 * @return 選択情報が変更されたかどうか
	 */
	protected isChangeSelectedData(info: EIMDiagramComponentInfo): boolean {
		let selectedData: EIMDiagramElement[] = this.getSelectedData(info);
		let preSelectedData: EIMDiagramElement[] = info.preSelectedData;

		if (selectedData.length != preSelectedData.length) {
			return true;
		}
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i] != preSelectedData[i]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * オプション情報を設定します.
	 * @param options オプション情報
	 */
	protected setOptions(options: EIMDiagramOptions): void {
		options.elements = [];
		options.style = [];
		options.zoom = 1;
		options.minZoom = 0.5;
		options.maxZoom = 3;
		options.autolock = true;
		options.layout = {
			name: 'preset',
			positions: undefined
		};

	}

	/**
	 * ノードを生成します.
	 * @param node ノード情報
	 */
	protected createNode(node: EIMDiagramNode): EIMDiagramNode {
		let retNode: EIMDiagramNodeEx = node;
		retNode.data = {
			id: node.id,
			label: node.label,
			domain: node.domain,
			params: node.params
		};
		return node;
	}

	/**
	 * エッジを生成します.
	 * @param edge エッジ情報
	 */
	protected createEdge(edge: EIMDiagramEdge): EIMDiagramEdge {
		let retEdge: EIMDiagramEdgeEx = edge;
		retEdge.data = {
			id: edge.id,
			source: edge.sourceId,
			target: edge.targetId,
			label: edge.label,
			distance: edge.distance,
			domain: edge.domain,
			params: edge.params
		};
		return retEdge;
	}

	/**
	 * エレメントがノードかどうか判定します.
	 * @param element エレメント
	 */
	protected isNodeElement(element: any): element is EIMDiagramNode {
		return !this.isEdgeElement(element);
	}

	/**
	 * エレメントがエッジかどうか判定します.
	 * @param element エレメント
	 */
	protected isEdgeElement(element: any): element is EIMDiagramEdge {
		return element !== null &&
			typeof element === 'object' &&
			typeof element.sourceId === 'number' &&
			typeof element.targetId === 'number';
	}

}
