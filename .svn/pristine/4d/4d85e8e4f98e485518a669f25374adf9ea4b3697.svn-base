import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMComponentInfo, EIMComponent } from 'app/shared/shared.interface';
import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';

export interface EIMDialogManagerComponentInfo extends EIMComponentInfo {
	name?: string;
	data?: any;
	callbacks?: any;
}

export namespace dialogName {
	export const OBJECT_CREATOR = 'OBJECT_CREATOR';
	export const RELATION_CREATOR = 'RELATION_CREATOR';
	export const RELATION_CREATOR_MODAL = 'RELATION_CREATOR_MODAL';
	export const OBJECT_UPDATOR = 'OBJECT_UPDATOR';
	export const EVENT_UPDATOR = 'EVENT_UPDATOR';
	export const STATUS_UPDATOR = 'STATUS_UPDATOR';
	export const USER_SELECTOR = 'USER_SELECTOR';
	export const SECURITY_SELECTOR = 'SECURITY_SELECTOR';
	export const ASSIGN_UPDATOR = 'ASSIGN_UPDATOR';
	export const ASSIGN_SELECTOR = 'ASSIGN_SELECTOR';
	export const EVENT_HISTORY = 'EVENT_HISTORY';
	export const LOCK = 'LOCK';
	export const FILE_UPLOADER = 'FILE_UPLOADER';
	export const OBJECT_SELECTOR = 'OBJECT_SELECTOR';
	export const OBJECT_TYPE_SELECTOR = 'OBJECT_TYPE_SELECTOR';
	export const RELATION_UPDATOR = 'RELATION_UPDATOR';
}

@Directive()
@Injectable()
export class EIMObjectEditorDialogManagerComponentService {

	@Output() show: EventEmitter<EIMDialogManagerComponentInfo> = new EventEmitter<EIMDialogManagerComponentInfo>();
	@Output() closed: EventEmitter<string> = new EventEmitter<string>();

	public dialogs: any = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * オブジェクト登録ダイアログを表示します.
	 * @param selectedObjTypeId 選択オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showObjectCreator(selectedObjTypeId: number, callbacks?: any): string {

		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OBJECT_CREATOR,
				data: {
					selectedObjTypeId: selectedObjTypeId,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * オブジェクト更新ダイアログを表示します.
	 * @param id オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showObjectUpdator(id: number, callbacks?: any): string {

		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OBJECT_UPDATOR,
				data: {
					id: id,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * イベント更新ダイアログを表示します.
	 * @param id イベントID
	 * @param objId オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showEventUpdator(id: number, objId: number, callbacks?: any): string {

		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.EVENT_UPDATOR,
				data: {
					id: id,
					objId: objId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ステータス更新ダイアログを表示します.
	 * @param id ステータスID
	 * @param objId オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showStatusUpdator(id: number, objId: number, title: string, callbacks?: any): string {

		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.STATUS_UPDATOR,
			data: {
				id: id,
				objId: objId,
				title: title,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * セキュリティ選択ダイアログを表示します.
	 * @param content : セキュリティ情報
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showObjectEditorsSecuritySelector(secId?: Number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SECURITY_SELECTOR,
				data: {
					secId: secId,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * アサイン一覧ダイアログを表示します.
	 * @param objData オブジェクト
	 * @param objName オブジェクト名
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAssignUpdator(objData: EIMObjectDTO, objName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ASSIGN_UPDATOR,
				data: {
					objData: objData,
					objName: objName,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * リレーション登録ダイアログを表示します.
	 * @param selectedData 選択データ
	 * @param mode ダイアログ表示モード：モーダル or 非モーダル
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showRelationCreator(selectedData: EIMObjectDTO[], modal: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: modal ? dialogName.RELATION_CREATOR_MODAL : dialogName.RELATION_CREATOR,
			data: {
				selectedData: selectedData,
				modal: modal,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * アサイン選択ダイアログを表示します.
	 * @param destination 選択済みデータ
	 * @param selectTarget 選択可能タブ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAssignSelector(destination: any[], selectTarget: any = {}, callbacks?: any): string {

		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ASSIGN_SELECTOR,
				data: {
					documentId: null,
					selectTarget: {
						user: selectTarget.hasOwnProperty('user') ? selectTarget.user : true,
						group: selectTarget.hasOwnProperty('group')  ? selectTarget.group : false,
						role: selectTarget.hasOwnProperty('role')  ? selectTarget.role : false,
						compGroup: selectTarget.hasOwnProperty('compGroup')  ? selectTarget.compGroup : false,
						userDefGroup: selectTarget.hasOwnProperty('userDefGroup')  ? selectTarget.userDefGroup : false,
						system: selectTarget.hasOwnProperty('system')  ? selectTarget.system : true,
					},
					destination: destination
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * イベント履歴ダイアログを表示します.
	 * @param objData オブジェクト情報
	 * @param objName オブジェクト名
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showEventHistory(objData: EIMObjectDTO, objName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.EVENT_HISTORY,
				data: {
					objData: objData,
					objName: objName,
				},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ロックダイアログを表示します.
	 * @param objData 選択オブジェクト情報
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showLock(objData: EIMObjectDTO, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.LOCK,
			data: {
				objData: objData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ファイル一覧ダイアログを表示します.
	 * @param objData オブジェクト情報
 	 * @param objName オブジェクト名
	 * @param callbacks コールバック関数
 	 * @return ダイアログID
	 */
	public showFileUploader(objData: EIMObjectDTO, objName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FILE_UPLOADER,
				data: {
					objData: objData,
					objName: objName,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * オブジェクト選択ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showObjectSelector(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OBJECT_SELECTOR,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * オブジェクトタイプ選択ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showObjectTypeSelector(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OBJECT_TYPE_SELECTOR,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ダイアログを閉じます.
	 * @param dialogId ダイアログID
	 */
	public close(dialogId: string): void {
		this.closed.emit(dialogId);
	}

	/**
	 * 指定されたダイアログのビューを取得します.
	 * @param dialogId ダイアログID
	 */
	public getView(dialogId: string): EIMComponent {
		if (this.dialogs[dialogId]) {
			return (this.dialogs[dialogId] as EIMDialogComponent).content;
		}
		return null;
	}

	/**
	 * リレーション更新のビューを取得します.
	 * @param relId : リレーションID
	 * @param parentObjId : 親オブジェクトID
	 * @param childObjId : 子オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showRelation(relId: number, parentObjId: number, childObjId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.RELATION_UPDATOR,
			data: {
				relId: relId,
				parentObjId: parentObjId,
				childObjId: childObjId,
			},
			callbacks: callbacks,
	}
	this.show.emit(info);
	return info.name;
	}
}
