import { Injectable } from '@angular/core';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMWorkspaceTypeSingleSelectorComponent } from 'app/admins/components/workspace-type-selector/workspace-type-single-selector.component';
import { EIMFormTypeTreeNode } from 'app/admins/components/workspace-type-selector/workspace-type-single-selector.component.service';
import { EIMWorkspaceFormTypeDTO } from 'app/admins/shared/dtos/workspace-form-type.dto';


/**
 * 帳票タイプツリー複数選択コンポーネントサービス
 */
@Injectable()
export class EIMWorkspaceTypeMultipleSelectorComponentSerivce extends EIMMultipleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param info 複数選択コンポーネント情報
	 */
	public initialize(info: EIMMultipleSelectionComponentInfo): void {
		// 同一行判定関数を設定
		info.selectedList.info.equals = this.dataGridEquals;
	}


	/**
	 * 追加ボタン押下の処理
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): void {
		// 検索結果の選択行を選択一覧に追加
		let addData: EIMWorkspaceFormTypeDTO[] = (info.searchResultList.getSelectedData());

		// 未選択、又は最上位のタイプを選択している場合、追加不可
		if (addData.length === 0 || addData[0].rootTypeDefName) {
			return;
		}

		// 対象が選択済みの場合、追加不可
		let loopCnt = info.selectedList.getData().length;
		for (let idx = 0; idx < loopCnt; idx++) {
			if (info.selectedList.getData()[idx].id === addData[0].id) {
				return;
			}
		}

		info.selectedList.addRowData(addData);

		// 追加行を選択
		info.selectedList.select(addData);
		// スクロール位置を設定
		let rowIndex: number = info.selectedList.getRowIndex();
		info.selectedList.ensureIndexVisible(rowIndex);

	}


	/**
	 * 削除ボタン押下の処理
	 * @param info 複数選択コンポーネント情報
	 */
	public delete(info: EIMMultipleSelectionComponentInfo, selectedData: any[]): void {
		super.delete(info, selectedData);

	}


	/**
	 * single-selectorのデータ表示完了イベントハンドラ
	 * @param info 複数選択コンポーネント情報
	 * @param target 対象データ
	 */
	public onFetch(info: EIMMultipleSelectionComponentInfo, target: any): void {
		// 選択済帳票タイプのパスを取得する
		window.setTimeout(() => {
			let selectedData = info.selectedData;
			let treeNode = (<EIMWorkspaceTypeSingleSelectorComponent>info.searchResultList).formTypeTree.info.data[0];
			selectedData = this.getSelectedFormTypePath(selectedData, treeNode);

			info.selectedData = selectedData;
			this.setData(info);
		});

	}

	/**
	 * データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	private dataGridEquals(obj1: any, obj2: any): boolean {
		if (obj1 && obj2) {
			return (obj1.id === obj2.id);
		}
		return false;

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択済帳票タイプのパスを取得する.
	 * @param selectedData 選択済帳票タイプリスト
	 * @param formTypeTree 帳票タイプツリー
	 * @return 選択済帳票タイプリスト
	 */
	private getSelectedFormTypePath(selectedData: EIMWorkspaceFormTypeDTO[], formTypeTree: EIMFormTypeTreeNode): EIMWorkspaceFormTypeDTO[] {

		let loopCnt = selectedData.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			let path = this.getPathByIdFromChildren(selectedData[idx].id, formTypeTree.children);
			selectedData[idx].path = path;

		}

		return selectedData;
	}


	/**
	 * 指定した帳票タイプIDより、帳票タイプのパスを取得する.
	 * @param objId 帳票タイプID
	 * @param treeNodeList 帳票タイプツリー
	 * @return パス
	 */
	private getPathByIdFromChildren(objId: number, treeNodeList: EIMFormTypeTreeNode[]): string {
		let path = EIMAdminsConstantService.DELIMITER_PATH;

		let loopCnt = treeNodeList.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			let treeNode = treeNodeList[idx];
			if (objId === treeNode.objId) {
				path = treeNode.data.path;
				break;
			}

			if (treeNode.children) {
				path = this.getPathByIdFromChildren(objId, treeNode.children);
			}
			if (path !== EIMAdminsConstantService.DELIMITER_PATH) {
				break;
			}
		}

		return path;
	}

}
