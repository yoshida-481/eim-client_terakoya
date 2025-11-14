import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { FileUploader, FileItem } from 'ng2-file-upload';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { SelectItem } from 'primeng/api';
import { EIMAdminsUserDTO } from 'app/admins/shared/dtos/admins-user.dto';
import { EIMAdminType } from 'app/admins/shared/services/apis/authentication.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

export interface EIMSessionInformation {
	configKeyValue?: any,
	loginUser?: EIMUser
}

export interface EIMUser {
	userId?: number;
	userCode?: string;
	userName?: string;
	userKana?: string;
	userMail?: string;
	groupName?: string;
	roleName?: string;
	userPass?: string;
	langList?: any[];
	userDisable?: number;
	userLang?: string;

	// 以下セッションユーザ取得時のみの情報
	userAdmin?: number;
	groupPath?: string;
	approveDocument?: number;
	isPopupExists?: boolean;
	viceApprove?: boolean;
	systemSecurity?: boolean;
	textAttrMaxChars?: number;
	adminAppId?: string;
}

/**
 * ユーザAPIサービス
 */
@Injectable()
export class EIMUserService {

  constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected translateService: TranslateService,
			protected serverConfigService: EIMServerConfigService,
			protected domainService: EIMDomainService,
		) {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ユーザのセッション情報を取得する
	 * @param displayProgressDialog 処理中ダイアログ出力可否
	 * @param displayErrorDialog エラーダイアログ出力可否
	 * @return セッション情報
	 */
  public getSessionUser(displayProgressDialog = true, displayErrorDialog = true): Observable<EIMSessionInformation> {
    return this.httpService.get('/admin/session/dspSession.jsp', null, displayProgressDialog, displayErrorDialog).pipe(mergeMap(
			(res: any) => {

				let info: EIMSessionInformation = {};
				let loginUser: EIMUser = this.convertToEIMUser(res.value.user);
				info.loginUser = loginUser;
				// コンフィグの値を格納する
				let keyValue: any = this.convertToConfigKeyValue(res.value.user);
				info.configKeyValue = keyValue;

				return of(info);
			}
		));
	}

  /**
   * 共通‗ユーザ選択画面／ユーザ管理画面のユーザ検索
   * @param userName 名前
   * @param userCode ID
   * @param opeName ユーザ検索以外でリクエストを行う場合のオペレーション名
   * @param userMail Mail
   * @param belongingGroupName グループ名
   * @param includingChildGroup 下位グループを含む
	 * @param dispFlag 無効フラグ
	 * @return ユーザ情報
   */
	public searchUser(userName: string, userCode: string, opeName?: string, userMail?: string, belongingGroupName?: string,
			includingChildGroup?: boolean, dispFlag?: number): Observable<EIMAdminsUserDTO[]> {

		let isNotDisplayInvalidityUser = null;
		let isNotDisplayValidityUser = null;

		if (Number(dispFlag) === 0) {
			// 無効フラグ：OFF の場合
			isNotDisplayInvalidityUser = 1;
		} else if (Number(dispFlag) === 1) {
			// 無効フラグ：ON の場合
			isNotDisplayValidityUser = 1;
		} else {
			// 無効フラグ：両方 の場合
		}

		let params: any = { userName: userName, userCode: userCode, opeName: opeName, userMail: userMail, belongingGroupName: belongingGroupName, includingChildGroup: includingChildGroup};

		if (isNotDisplayInvalidityUser !== null) {
			params['isNotDisplayInvalidityUser'] = isNotDisplayInvalidityUser ? '1' : '0';
		}
		if (isNotDisplayValidityUser !== null) {
			params['isNotDisplayValidityUser'] = isNotDisplayValidityUser ? '1' : '0';
		}
		return this.httpService.postForForm('/admin/user/actSearchUser.jsp', params).pipe(mergeMap(
			(res: any) => {
				return of(
					this.domainService.createObjectList(
						res.value.users.user,
						(_json: any) => {
							return new EIMAdminsUserDTO(_json);
						}
					)
				);
			}
		));
	}

  /**
   * ユーザ管理画面の一ユーザ検索
   * @param userId ユーザID
	 * @return ユーザ情報
   */
	public searchUserId(userId: number): Observable<EIMAdminsUserDTO> {
		let params: any = { userId: userId};
		return this.httpService.postForForm('/admin/user/actSearchUser.jsp', params).pipe(mergeMap(
			(res: any) => {
				return of(new EIMAdminsUserDTO(res.value.users.user));
			}
		));
	}

	/**
	 * 選択したユーザを取得します.
	 * @param userId ユーザID
	 * @return ユーザ
	 */
	public getSelectedUser(userId: number): Observable<any> {
		return this.httpService.postForForm('/admin/user/dspUser.jsp', {userId: userId}).pipe(mergeMap(
			(res: any) => {
				return of(res.value.user);
			}
		));
	}

	/**
	 * ユーザ一覧のエクスポート
	 * @param searchUserName 名前
	 * @param searchUserCode ID
	 * @param searchUserMail Mail
	 * @param belongingGroupName グループ名
	 * @param includingChildGroup 下位グループを含む
	 * @param isNotDisplayInvalidityUser 無効フラグ：OFF
	 * @param isNotDisplayValidityUser 無効フラグ：ON
	 * @param navigateToURLFlg
	 */
	public exportUserData(searchUserName: string, searchUserCode: string, searchUserMail: string, belongingGroupName: string,
		includingChildGroup: boolean, isNotDisplayInvalidityUser: number, isNotDisplayValidityUser: number, navigateToURLFlg: string): void {
		let form: any = window.document.getElementById('exportUserForm');
		form.action = this.serverConfigService.getContextPath() + '/eim/admin/file_io/export_user.mvc';
		form.elements.belongingGroupName.value = belongingGroupName;
		form.elements.includingChildGroup.value = includingChildGroup;
		form.elements.isNotDisplayInvalidityUser.value = isNotDisplayInvalidityUser;
		form.elements.isNotDisplayValidityUser.value = isNotDisplayValidityUser;
		form.elements.searchUserCode.value = searchUserCode;
		form.elements.searchUserMail.value = searchUserMail;
		form.elements.searchUserName.value = searchUserName;
		form.submit();
	}

	/**
	 * ユーザ一覧ファイルのアップロード
	 * @param uploader
	 * @param fileItem
	 * @return JSONにファイルのアップロード場所のパスが含まれる
	 */
  public upload(uploader: FileUploader, fileItem: FileItem): Observable<any> {
		return this.httpService.upload('/eim/admin/file_io/create_file.mvc',
			uploader, fileItem, {}, (json: any): any => {
				return { value: json };
			}, true, false
		);
  }

	/**
	 * ユーザ一覧のインポート
	 * @param filePath サーバ上のファイルパス
	 * @return JSONに完了ステータスメッセージが含まれる
	 */
  public importUserData(filePath: string): Observable<any> {
		let params: any = { filePath: filePath };
		return this.httpService.postForForm('/rest/user/importUser.mvc', params, true, false).pipe(mergeMap(
			(res: any) => {
				return of(res);
			}
		));
	}

	/**
	 * エクスポートファイルチェック
	 * @param userName 名前
	 * @param userCode ID
	 * @param userMail Mail
	 * @param belongingGroupName グループ名
	 * @param includingChildGroup 下位グループを含む
	 * @param isNotDisplayInvalidityUser 無効フラグ：OFF
	 * @param isNotDisplayValidityUser 無効フラグ：ON
	 * @param navigateToURLFlg
	 * @return 応答メッセージ
	 */
	public checkExportInfo(userName: string, userCode: string, userMail: string, belongingGroupName: string,
		includingChildGroup: boolean, isNotDisplayInvalidityUser: number, isNotDisplayValidityUser: number, navigateToURLFlg: string): Observable<any> {

		let params: any = { searchUserName: userName, searchUserCode: userCode, searchUserMail: userMail, belongingGroupName: belongingGroupName, includingChildGroup: includingChildGroup, isNotDisplayInvalidityUser: isNotDisplayInvalidityUser, isNotDisplayValidityUser: isNotDisplayValidityUser, navigateToURLFlg: navigateToURLFlg};
		return this.httpService.post('/rest/user/checkExportInfo.mvc', params).pipe(mergeMap(
			(res: any) => {
				return of(res);
			}
		));
	}

	/**
	 * システム管理者タイプのプルダウンメニュー
	 * @param userEditFlg ユーザ編集であるか
	 * @param langId 言語ID
	 * @param adminTypeArray システム管理者タイプの配列
	 * @return システム管理者タイプの一覧
	 */
	public getUserAdminItems(userEditFlg: boolean, langId: string, adminTypeArray: EIMAdminType[]): SelectItem[] {
		let userLangSelectItems: SelectItem[] = [];
		let idx = 0;
		if (userEditFlg) {
			// 「ユーザ編集」の場合、「権限を変更しない」を追加
			userLangSelectItems.push({label: this.translateService.instant('EIM_ADMINS.LABEL_02216'), value: idx++});
		}
		// 「一般ユーザに設定する」
		userLangSelectItems.push({label: this.translateService.instant('EIM_ADMINS.LABEL_02201'), value: idx++});
		// 「個別に権限を設定する」
		userLangSelectItems.push({label: this.translateService.instant('EIM_ADMINS.LABEL_02202'), value: idx++});

		// システム管理者タイプ
		for (let adminTypeIdx in adminTypeArray) {
			if (adminTypeIdx) {
				userLangSelectItems.push({label: adminTypeArray[adminTypeIdx].nameList[langId], value: idx++});
			}
		}

		return userLangSelectItems;
	}

	/**
	 * ユーザ情報のコンバート
	 * @param json JSON
	 * @return JSONからコンバートしたユーザ情報
	 */
	private convertToEIMUser(json: any): EIMUser {
		return {
			userId: Number(json.attr.userId),
			userCode: json.attr.userCode,
			userName: json.attr.userName,
			userKana: json.attr.userKana,
			userMail: json.attr.userMail,
			groupName: json.attr.groupName,
			roleName: json.attr.roleName,
			userPass: json.attr.userPass,
			langList: json.lang,
			userDisable: json.attr.userDisable,

			userAdmin: Number(json.attr.userAdmin),
			groupPath: json.attr.groupPath,
			approveDocument: Number(json.attr.approveDocument),
			isPopupExists: json.attr.isPopupExists == 'true' ? true : false,
			viceApprove:  json.attr.viceApprove == 'true' ? true : false,
			systemSecurity:  json.attr.systemSecurity == 'true' ? true : false,
			textAttrMaxChars: Number(json.attr.textAttrMaxChars),
			adminAppId: json.attr.adminAppId,

		}
	}

	/**
	 * コンフィグ値のコンバート
	 * @param json
	 * @return JSONからコンバートしたコンフィグ
	 */
	private convertToConfigKeyValue(json: any): any {
		let keyValue: any = {};
		let target: any = [
			'isGeneralDocVisible',
			'isGeneralFolVisible',
			'searchDetailLikeCondition',
			'jSessionId',
			'eimanagerDocumentVersion',
			'csvDownloadHistoryFileHeader',
			'csvDownloadCharset',
			'csvDownloadNewLine',

			'enableApproverCheckinFlg',
			'insertURL',
			'attributeTreeView',
			'digitalSignatureFlg',
			'ocrFlg',
			'searchPageFlg',
			'pdfOutputConf',
			'convertPaperToPDFFlg',
			'boxIntegrationFlg',
			'useSignTool',
			'disabledCacheFlg',
			'nameSpaceToExclude'
		];
		for (let i = 0; i < target.length; i++) {
			let key: string = target[i];
			if (json.attr.hasOwnProperty(key)) {
				keyValue[key] = json.attr[key];
			}
		}
		return keyValue;
	}
}
