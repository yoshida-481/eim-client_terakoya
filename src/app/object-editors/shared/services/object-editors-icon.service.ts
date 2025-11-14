import { Injectable, Output } from '@angular/core';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * アイコンサービス
 */
@Injectable()
export class EIMObjectEditorsIconService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService) {
	}

	/**
	 * オブジェクトタイプ名から対応するアイコンを返却します.
	 * @param typeName オブジェクトタイプ名
	 * @return アイコン
	 */
	public getIcon(typeName: string): string {
		// デフォルトアイコン
		let defaultIcon = 'fa-cube eim-icon-object-color';
		let icon;
		// ワークスペース
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_WORKSPACE')) {
			icon = 'eim-icon-workspace eim-icon-workspace-color';
		}

		// ドキュメント
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_DOCUMENT')) {
			icon = 'eim-icon-document eim-icon-document-color';
		}

		// ゴミ箱
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_GARBAGE_BOX')) {
			icon = 'eim-icon-trash eim-icon-trash-color';
		}

		// フォルダ
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_FOLDER')) {
			icon = 'eim-icon-folder eim-icon-folder-color';
		}

		// PDF変換
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_PDF_CONVERSION')) {
			icon = 'eim-icon-pdf';
		}

		// お気に入り
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_FAVORITE')) {
			icon = 'fa-star';
		}

		// グループ
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_GROUP')) {
			icon = 'eim-icon-group';
		}

		// マイドキュメント
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_MY_DOCUMENT')) {
			icon = 'fa-folder-open';
		}

		// ユーザ
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_USER')) {
			icon = 'eim-icon-user';
		}

		// ロール
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_ROLE')) {
			icon = 'eim-icon-role';
		}

		// 受信確認
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_RECEIVE_CONFIRMATION')) {
			icon = 'fa-envelope';
		}

		// タグ
		if (typeName === this.translateService.instant('EIM_OBJECT_EDITORS.OBJECT_TYPE_TAG')) {
			icon = 'eim-icon-tag eim-icon-tag-color';
		} 
		if(!icon){
			icon = defaultIcon;
		}
		return 'fa fw fa-lg ' + icon;
	}

}
