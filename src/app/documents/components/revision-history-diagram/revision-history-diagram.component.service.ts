import { EventEmitter, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramOptions, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMRevisionHistoryService, EIMHierarchicalRevisionHistory } from 'app/documents/shared/services/apis/revision-history.service';

/**
 * 改訂履歴ダイアグラムサービス
 *
 * @example
 *
 *      <eim-diagram [componentService]="revisionHistoryDiagramComponentService">
 *      </eim-diagram>
 */
@Injectable()
export class EIMRevisionHistoryDiagramComponentService extends EIMDiagramComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService, zone: NgZone
	) {
		super(zone);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期表示処理です.
	 * @param info ダイアグラム情報
	 * @param serviceParam パラメータ
	 * @param initialize 初期化エミッタ
	 * @param changed 変更エミッタ
	 * @param selected 選択エミッタ
	 */
	public initialize(info: EIMDiagramComponentInfo, serviceParam?: any, initialize?: EventEmitter<any>, changed?: EventEmitter<any>, selected?: EventEmitter<any>): void {
		super.initialize(info, serviceParam, initialize, changed, selected);
		info.cy.pan({
		  x: 100,
		  y: info.cy.height() - 100
		});
		// 再度描画後にパンする
		setTimeout(function() {
			info.cy.pan({
			  x: 100,
			  y: info.cy.height() - 100
			});
		}, 500);
	}

	/**
	 * ダイアグラムのエレメントを生成します.
	 * @param info インフォ
	 * @param revisionHistories 改訂履歴階層情報
	 * @return 生成したエレメント
	 */
	public createDiagramElement(info: EIMDiagramComponentInfo, revisionHistories: EIMHierarchicalRevisionHistory[]): EIMDiagramElement[] {

		// 生成するエレメント配列
		let elements: EIMDiagramElement[] = [];

		// 各リビジョングループのルートIDとそのリビジョンリストのMap
		let rootIdAndHistoriesMap: any = this.getRootIdAndHistoriesMap(revisionHistories);

		// 各リビジョングループのX座標
		let root: EIMHierarchicalRevisionHistory =
				<EIMHierarchicalRevisionHistory>this.hierarchicalDomainService.getRoot(revisionHistories[0]);
		let branchXPosition: any[] = this.getBranchXPosition(root.rootId, rootIdAndHistoriesMap);

		// 各リビジョングループのX座標とひとつ前のリビジョンのオブジェクトIDのMap（同一ブランチグループ内の1つ前のリビジョン取得用）
		let parentMap: any = {};

		// 画面下部（履歴番号の小さい履歴）から描画します。
		for (let i = revisionHistories.length - 1; i >= 0; i--) {
			let revisionHistory: EIMHierarchicalRevisionHistory = revisionHistories[i];

			// ノードの追加
			let nodeClasses = '';
			if (!revisionHistory.isTargetPath) {

				// 対象以外のパスの場合
				nodeClasses += ' excluded';

			} else if (revisionHistory.isTargetElement) {

				// 初期選択したノードの場合
				nodeClasses += ' target';

			}
			elements.push(super.createNode(
				{
					id: revisionHistory.objId,
					label: '' + revisionHistory.rev,
					classes: nodeClasses,
					selectable: true,
					position: { x: this.getXIndex(revisionHistory, branchXPosition) * 40, y: -(revisionHistories.length - 1 - i) * 25 },
					domain: revisionHistory
				}
			));

			// 同一リビジョングループ内のエッジ（縦の線）の追加
			if (revisionHistory.rev != 0) {
				let parentId: number = parentMap[this.getXIndex(revisionHistory, branchXPosition)];
				if (parentId) {
					// フロー追加
					elements.push(super.createEdge(
							{
								id: -revisionHistory.objId,
								sourceId: parentId,
								targetId: revisionHistory.objId,
								classes: (!revisionHistory.isTargetPath) ? ' excluded' : '',
								selectable: false
							}));
				}
			}
			parentMap[this.getXIndex(revisionHistory, branchXPosition)] = revisionHistory.objId;
		}

		// 各リビジョングループ間のエッジ（横の線）の追加
		for (let key in rootIdAndHistoriesMap) {
			if (key) {
				let rootId: number = Number(key);
				let rootObj = rootIdAndHistoriesMap[key][0];

				if (!rootObj.parent) {
					continue;
				}

				// フロー追加
				elements.push(super.createEdge(
					{
						id: -rootId,
						sourceId: rootObj.parent.objId,
						targetId: rootId,
						classes: (!rootObj.isTargetPath) ? ' branch excluded' : ' branch',
						selectable: false
					}
				));
			}
		}
		return elements;
	}

	/**
	 * ダイアグラムのデータを設定します.
	 * @param info インフォ
	 * @param data データ
	 * @param change 変更イベントエミッタ（未使用）
	 */
	public setData(info: EIMDiagramComponentInfo, data: EIMDiagramElement[], change?: EventEmitter<any>): void {

		let elements: EIMDiagramElement[] = data;
		info.options.elements = elements;
		let elementIdSet: any = {};

		// エレメントを移動するためにロックを外す
		info.cy.autolock( false );
		for (let i = 0; i < elements.length; i++) {
			let element: EIMDiagramElement = elements[i];
			let elementHashId: string = '#' + element.id;
			elementIdSet[element.id] = true;

			if (info.cy.$(elementHashId).length == 0) {
				// 追加分
				info.cy.add(element);
				info.cy.$(elementHashId).animate({
					style: {opacity: 1}
				}, {
				  duration: 300
				});
			} else {
				// 更新分
				if (element['position']) {
// アニメーションさせるとIE11で描画が追い付かない（移動しない）場合が頻繁にあるため
// アニメーションはしないよう修正。
// 					info.cy.$(elementHashId).animate({
// 					position: {x: element['position'].x, y: element['position'].y}
// 					}, {
// 					  duration: 300
// 					});
					info.cy.$(elementHashId).position({x: element['position'].x, y: element['position'].y});
				}
			}
		}

		// 削除判定
		let displayData: any[] = info.cy.$('*');
		for (let i = 0; i < displayData.length; i++) {
			if (!elementIdSet[displayData[i].id()]) {
				// 削除分
				info.cy.$('#' + displayData[i].id()).animate({
					style: {opacity: 0}
				}, {
				  duration: 300
				}, {
					complete: info.cy.$('#' + displayData[i].id()).remove()
				});
			}
		}

		// エレメントをドラック移動できないようにするためにロックする
		setTimeout(function() {
			info.cy.autolock( true );
		}, 300);

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ダイアグラムのオプション情報を設定します.
	 * @param options デフォルトオプション情報
	 */
	protected setOptions(options: EIMDiagramOptions): void {
		super.setOptions(options);
		options.zoom = 2.5;
		options.maxZoom = 5;
		options.style = [];
		options.style.push(
			{
				selector: 'node',
				style: {
				  width: 15,
					height: 15,
					'background-color': '#fff',
					'border-width': 2,
					'border-style': 'solid',
					'border-color': '#88bffb',
					'label': 'data(label)',
					'text-valign': 'center',
					'text-halign': 'center',
					'font-size': 10,
					'color': '#555555',
					'opacity': .3,
					'z-index': 200,
				}
			}
		);
		options.style.push(
				{
					selector: 'node.excluded',
					style: {
						'border-color': '#c0c0c0',
					}
				}
			);
		options.style.push(
				{
					selector: 'node.target',
					style: {
						'border-color': '#0553a9',
					}
				}
			);
		options.style.push(
			{
				selector: 'node:selected',
				style: {
					'background-color': '#B0E0E6',
				}
			}
		);
		options.style.push(
			{
				selector: 'edge',
				style: {
					'curve-style': 'haystack',
					'width': 5,
					'line-color': '#88bffb',
					'source-endpoint': 'inside-to-node',
					'target-endpoint': 'inside-to-node',
					'z-index': 100,
					'opacity': .3,
				}
			}
		);
		options.style.push(
				{
					selector: 'edge.branch',
					style: {
						'curve-style': 'haystack',
						'width': 2,
					}
				}
			);
		options.style.push(
				{
					selector: 'edge.excluded',
					style: {
						'line-color': '#c0c0c0',
						'z-index': 0,
					}
				}
			);
	}

	/**
	 * ルートIDとそのブランチ内のヒストリのマップを返却します。
	 * @param revisionHistories 改訂履歴情報
	 * @return ルートIDとそのブランチ内のヒストリのマップ
	 */
	private getRootIdAndHistoriesMap(revisionHistories: EIMHierarchicalRevisionHistory[]): any {
		let map: any = {};
		// 画面下部（履歴番号の小さい履歴）から順に処理します。
		for (let i = revisionHistories.length - 1; i >= 0; i--) {
			let revisionHistory: EIMHierarchicalRevisionHistory = revisionHistories[i];
			if (!map[revisionHistory.rootId]) {
				map[revisionHistory.rootId] = [];
			}
			map[revisionHistory.rootId].push(revisionHistory);
		}

		return map;
	}

	/**
	 * 各ブランチの表示X位置をルートIDの配列で返却します。
	 * @param rootId ルートのID
	 * @param rootIdAndHistoriesMap ルートIDとそのブランチ内のヒストリのマップ
	 * @param rootIds ルートIDの配列
	 * @return [左から1番目のルートID, 左から2番目のルートID, …]
	 */
	private getBranchXPosition(rootId: number, rootIdAndHistoriesMap: any, rootIds: any[] = []): any[] {
		rootIds.push(rootId);

		let revisionHistories: EIMHierarchicalRevisionHistory[] = rootIdAndHistoriesMap[rootId.toString()];
		if (!revisionHistories) {
			return rootIds;
		}

		// 上部が内側に来るよう履歴の大きい方から処理していく
		for (let i = revisionHistories.length - 1; i >= 0; i--) {
			let revisionHistory = revisionHistories[i];

			// ID順にソート
			// 線が重ならないよう更新日が新しいブランチほど左側に来るように
			revisionHistory.children.sort((a: EIMHierarchicalRevisionHistory, b: EIMHierarchicalRevisionHistory): number => {
				return (a.objId - b.objId);
			});

			for (let j = revisionHistory.children.length - 1; j >= 0; j--) {
				if (revisionHistory.children[j]['rootId'] === rootId) {
					continue;
				}
				// ブランチを追加
				this.getBranchXPosition(revisionHistory.children[j]['rootId'], rootIdAndHistoriesMap, rootIds);
			}
		}

		return rootIds;
	}

	/**
	 * インデックスを取得します.
	 * @param revisionHistory リビジョンヒストリー
	 * @param branchXPosition ブランチ位置
	 * @return 要素の位置
	 *
	*/
	private getXIndex(revisionHistory: EIMHierarchicalRevisionHistory, branchXPosition: any): number {
		return branchXPosition.indexOf(revisionHistory.rootId);
	}

}
