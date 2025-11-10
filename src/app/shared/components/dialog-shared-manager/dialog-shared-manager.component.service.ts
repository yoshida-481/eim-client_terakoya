import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMComponentInfo } from 'app/shared/shared.interface';
import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMSearchMasterDisplayConfigDomain } from 'app/shared/domains/search-master-display-config.domain';

import { EIMObjectMasterDTO } from 'app/shared/dtos/object-master.dto';

import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';
import { EIMEntry } from 'app/shared/services/apis/entry.service';

export interface EIMDialogManagerComponentInfo extends EIMComponentInfo {
	name?: string;
	data?: any;
	callbacks?: any;
}

export namespace dialogName {
	export const PASSWORD_CHANGE = 'PASSWORD_CHANGE';
	export const USER_SELECTOR = 'USER_SELECTOR';
	export const USER_MULTI_SELECTOR = 'USER_MULTI_SELECTOR';
	export const MASTER_SINGLE_SELECTOR = 'MASTER_SINGLE_SELECTOR';
	export const MASTER_MULTIPLE_SELECTOR = 'MASTER_MULTIPLE_SELECTOR';
	export const VERSION_DISPLAY = 'VERSION_DISPLAY';
	export const PUBLIC_NOTIFICATION_TEMPLATE_CREATOR = 'PUBLIC_NOTIFICATION_TEMPLATE_CREATOR';
	export const PUBLIC_NOTIFICATION_TEMPLATE_UPDATER = 'PUBLIC_NOTIFICATION_TEMPLATE_UPDATER';
}

/**
 * ダイアログマネージャコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMDialogSharedManagerComponentService {

	@Output() show: EventEmitter<EIMDialogManagerComponentInfo> = new EventEmitter<EIMDialogManagerComponentInfo>();
	@Output() closed: EventEmitter<string> = new EventEmitter<string>();

	public dialogs: EIMDialogComponent[];

	constructor(
		protected localStorageService: EIMLocalStorageService,
	) {

	}

	/**
	 * パスワード変更ダイアログを表示します.
	 */
	public showPasswordChange(authenticationService: EIMAuthenticationService, trimcloseBottonFlg:boolean, headerHeight:string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PASSWORD_CHANGE,
				data: {
					authenticationService: authenticationService,
					trimcloseBottonFlg: trimcloseBottonFlg,
					headerHeight:headerHeight
				},

				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ユーザ単数選択ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @param disableUserFilter 無効ユーザ絞り込み有無（true/false)
	 * @param systemUserFilter systemユーザ絞り込み有無（true/false)
	 * @param parentObjId 親フォルダのID（親フォルダのセキュリティで絞る場合に指定）
	 * @return ダイアログID
	 */
	public showUserSelector(callbacks?: any, disableUserFilter = true, systemUserFilter = true, parentObjId?: number): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.USER_SELECTOR,
				data: {
					disableUserFilter: disableUserFilter,
					systemUserFilter: systemUserFilter,
					parentObjId: parentObjId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ユーザ複数選択ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @param disableUserFilter 無効ユーザ絞り込み有無（true/false)
	 * @param systemUserFilter systemユーザ絞り込み有無（true/false)
	 * @param parentObjId 親フォルダのID（親フォルダのセキュリティで絞る場合に指定）
	 * @return ダイアログID
	 */
	public showUserMultiSelector(selectedData, callbacks?: any, disableUserFilter = true, systemUserFilter = true, parentObjId?: number): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.USER_MULTI_SELECTOR,
				data: {
					selectedData: selectedData,
					disableUserFilter: disableUserFilter,
					systemUserFilter: systemUserFilter,
					parentObjId: parentObjId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * マスタ単数選択ダイアログを表示します.
	 */
	public showMasterSingleSelector(searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain, callbacks?: any): string {
		// ダイアログヘッダタイトル
		let header: string;
		let lang: string = this.localStorageService.getLangId();
		for (let i = 0; i < searchMasterDisplayConfig.description.length; i++) {
			if (searchMasterDisplayConfig.description[i].langId === lang) {
				header = searchMasterDisplayConfig.description[i].name;
			}
		}

		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.MASTER_SINGLE_SELECTOR,
				data: {
					header: header,
					searchMasterDisplayConfig: searchMasterDisplayConfig,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * マスタ複数選択ダイアログを表示します.
	 */
	public showMasterMultipleSelector(selectedData: EIMObjectMasterDTO[], searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain, callbacks?: any): string {
		// ダイアログヘッダタイトル
		let header: string;
		let lang: string = this.localStorageService.getLangId();
		for (let i = 0; i < searchMasterDisplayConfig.description.length; i++) {
			if (searchMasterDisplayConfig.description[i].langId === lang) {
				header = searchMasterDisplayConfig.description[i].name;
			}
		}
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.MASTER_MULTIPLE_SELECTOR,
				data: {
					header: header,
					selectedData: selectedData,
					searchMasterDisplayConfig: searchMasterDisplayConfig,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * バージョン表示ダイアログを表示します.
	 */
	public showVersionDisplay(version: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.VERSION_DISPLAY,
				data: {
					version: version,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

		/**
	 * 公開通知テンプレート登録画面を表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
		 public showPublicNotificationTemplateCreator(callbacks?: any): string {
			const info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_NOTIFICATION_TEMPLATE_CREATOR,
				callbacks: callbacks,
			};
			this.show.emit(info);
			return info.name;
		}
	
		/**
		 * 公開通知テンプレート更新画面を表示します.
		 * @param templateId テンプレートID
		 * @param templateName テンプレート名
		 * @param destination 公開通知先リスト
		 * @param callbacks コールバック関数
		 * @return ダイアログID
		 */
		public showPublicNotificationTemplateUpdater(templateId: number, templateName: string, destination: EIMEntry[], callbacks?: any): string {
			const info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_NOTIFICATION_TEMPLATE_UPDATER,
				data: {
					templateId,
					templateName,
					destination,
				},
				callbacks: callbacks,
			};
			this.show.emit(info);
			return info.name;
		}

	public close(dialogId: string): void {
		this.closed.emit(dialogId);

	}
}
