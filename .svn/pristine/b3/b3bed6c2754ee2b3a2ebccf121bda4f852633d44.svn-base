import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

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

	// 以下セッションユーザ取得時のみの情報
	userAdmin?: number;
	groupPath?: string;
	approveDocument?: number;
	isPopupExists?: boolean;
	viceApprove?: boolean;
	systemSecurity?: boolean;
	textAttrMaxChars?: number;
}

/**
 * ユーザAPIサービス
 */
@Injectable()
export class EIMDocumentsUserService extends EIMUserService{

	/** 検索タイプ */
	public searchType = EIMUserService.USER_SERVICE_SEARCH_TYPE_KEYWORD;

	constructor(
			protected domainService: EIMDomainService,
			protected httpService: EIMDocumentsHttpService,
			protected jsonService: EIMJSONService,
			protected serverConfigService: EIMServerConfigService,
	) {
		super(domainService, httpService, jsonService);
	}

  public getSessionUser(displayProgressDialog = true, displayErrorDialog = true): Observable<EIMSessionInformation> {
    return this.httpService.get('/app/document/session/dspSession.jsp', null, displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {

				let info: EIMSessionInformation = {};
				let loginUser: EIMUser = this.convertToEIMUser(res.value.user);
				info.loginUser = loginUser;
				// コンフィグの値を格納する
				let keyValue: any = this.convertToConfigKeyValue(res.value.user);
				info.configKeyValue = keyValue;

				return of(info);
			}));
	}

  /**
   * キーワードでユーザを検索します.
	 * @param keyword 検索キーワード
	 * @param disableUserFilter 無効ユーザ絞り込み有無（true/false)
	 * @param systemUserFilter systemユーザ絞り込み有無（true/false)
	 * @param parentObjId 親フォルダのID（親フォルダのセキュリティで絞る場合に指定）
	 * @return ユーザリスト
	 */
  public searchUserByKeyword(keyword: string, disableUserFilter = true, systemUserFilter = true, parentObjId?: number): Observable<EIMUserDTO[]> {
    return this.httpService.postForForm('/common/user/actSearchUser.jsp',
      	{ objId: parentObjId, keyword: keyword, securityFilter: parentObjId ? true : false, disableUserFilter: disableUserFilter, systemUserFilter: systemUserFilter })
  		.pipe(mergeMap((res: any) => {
  			return of(this.jsonService.getJsonChildren(res.value.users.user, this.convertToEIMUserDTO));
  		}));
  }

  /**
   * ログインユーザのお気に入り一覧を返却します.
	 * @return お気に入り一覧
   */
	public getFavoriteList(): Observable<any> {
		return this.httpService.postForForm('/app/document/user/dspFavoriteList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.objList.object, this.convertToFavorite));
			}));
  }

  /**
   * ログインユーザのチェックアウト一覧を返却します.
	 * @return チェックアウト一覧
   */
	public getCheckoutList(): Observable<any> {
		return this.httpService.postForForm('/app/document/user/dspCheckoutList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.objList.object, this.convertToDocument));
			}));
	}

	/**
   * ログインユーザの公開ファイル比較結果一覧を返却します.
	 * @return 公開ファイル比較結果一覧
   */
	public getPublicFileCompareList(): Observable<any> {
		return this.httpService.postForForm('/app/document/user/dspMyDocument.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.objList.object, this.convertToPublicCompare));
			}));
  }

	/**
	 * 公開ファイル比較結果の削除をします.
	 * @param objId 削除対象オブジェクトID
	 * @return 削除完了対象
	 */
	public deletePublicFileCompareFile(objId: number): Observable<any> {
		return this.httpService.postForForm('/app/document/user/actDeleteMyDocument.jsp', {objId: objId})
			.pipe(mergeMap((res: any) => {
						return of(this.convertToPublicCompare(res.value.objList.object));
			}));
	}

	/**
	 * お気に入りを削除します.
	 * @param fvrtObjId 削除対象のお気に入りオブジェクトID
	 * @return 削除済みのお気に入りオブジェクトID
	 */
	public deleteFavorite(fvrtObjId: number): Observable<any> {
		return this.httpService.postForForm('/app/document/user/actDeleteFavoriteList.jsp', {objId: fvrtObjId})
			.pipe(mergeMap((res: any) => {
						return of(res);
			}));
	}

	/**
	 * お気に入りに追加します.
	 * @param id 追加するオブジェクトID
	 */
	public createFavorite(id: number): Observable<any> {
		return this.httpService.get('/app/document/user/actCreateFavorite.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * 受信確認メール送信
	 * @param objId オブジェクトID
	 */
	public sendReplyMail(objId: number): void {
		let _window = window.open((this.httpService.contextRoot ?? this.serverConfigService.getContextPath()) + '/app/document/user/actSendReplyMail.jsp?objId=' + objId, 'workFrame');
	}


	/**
	 * JSONをEIMUserに変換して返却します.
	 * @param json JSON
	 * @return EIMUser
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

			userAdmin: Number(json.attr.userAdmin),
			groupPath: json.attr.groupPath,
			approveDocument: Number(json.attr.approveDocument),
			isPopupExists: json.attr.isPopupExists === 'TRUE' ? true : false,
			viceApprove:  json.attr.viceApprove === 'true' ? true : false,
			systemSecurity:  json.attr.systemSecurity === 'true' ? true : false,
			textAttrMaxChars: Number(json.attr.textAttrMaxChars),
		}
	}

	/**
	 * JSONをEIMUserDTOに変換して返却します.
	 * @param json JSON
	 * @return EIMUserDTO
	 */
	private convertToEIMUserDTO(json: any): EIMUserDTO {
		let dto: EIMUserDTO = new EIMUserDTO();

		dto.id = Number(json.attr.userId);
		dto.code = json.attr.userCode;
		dto.name = json.attr.userName;
		dto.typeLabel = json.attr.userName;
		dto.kana = json.attr.userKana;
		dto.mail = json.attr.userMail;
		dto.groupNames = json.attr.groupName;
		dto.groupName = json.attr.groupName;
		dto.roleNames = json.attr.roleName;
		dto.roleName = json.attr.roleName;
		if ( json.attr.userDisable  ) {
			dto.userDisable = json.attr.userDisable;
		}

		return dto;
	}

	private convertToConfigKeyValue(json: any): any {
		let keyValue: any = {};
		let target: any = [
			'systemSecurity',
			'approveMenuFlag',
			'isGeneralDocVisible',
			'isGeneralFolVisible',
			'isChangePassVisible',
			'isLogoutVisible',
			'searchDetailLikeCondition',
			'searchDetailsOpen',
			'jSessionId',
			'eimanagerDocumentVersion',
			'publicCancelFlg', 'ocrFlg',
			'enableCreateCoverDocumentMenu',
			'pdfCompareFlg',
			'pdfJoinFlg',
			'searchPageFlg',
			'enableAutomaticNumbering',
			'pdfAutoRegistDocNamePrefix',
			'enableApproverCheckinFlg',
			'digitalSignatureFlg',
			'attributeTreeView',
			'signatureAndEncryptionFlag',
			'csvFileHeader',
			'csvAccessHistoryFileHeader',
			'csvCirculationFileHeader',
			'csvAccordionSearchFileHeader',
			'csvDownloadCharset',
			'csvDownloadNewLine',
			'csvMailAddressOutputFlg',
			'docAccessUrlPathFlg',
			'orgDocAccessUrlPathFlg',
			'publicDocAccessUrlPathFlg',
			'pdfOutputConf',
			'boxIntegrationFlg',
			'boxUserIntegFlg',
			'boxDialogFlg',
			'boxDefaultSettingPublic',
			'pdfConvertFileType',
			'publicDocumentFormat',
			'searchDispMode',
			'searchContentsFlg',
			'previewFileType',
			'thumbnailFileType',
			'uploadFileSizeMax',
			'isChangePasswordFlg',
			'pdfConvertFileType',
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

	/**
	 * お気に入り一覧のコンバータ
	 * @param json
	 */
	private convertToFavorite(json: any): any {
		return {
			objId: Number(json.attr.objId),
			fvrtObjId: Number(json.attr.fvrtObjId),
			path: json.attr.objName,
			objName: json.attr.objName,
			parentPath: json.attr.path,
			objTypeId: Number(json.attr.objTypeId),
			objTypeName: EIMDocumentsConstantService.FOLDER_DOCUMENT, // アイコンを他の動きと合わせるため、値は'フォルダ'固定とする
			isWorkflowFolder: json.attr.isWorkflowFolder,
		};
	}

	/**
	 * ドキュメントのコンバータ
	 * @param json
	 */
	private convertToDocument(json: any): any {
		return {
			objId: Number(json.attr.objId),
			objName: json.attr.objName,
			objTypeName: json.attr.objTypeName,
			path: json.attr.path,
			lockDate: json.attr.lockDate,
			revision: json.attr.rev,
			isDocument: true,
		};
	}

	/**
	 * 公開ファイル比較結果のコンバータ
	 * @param json
	 */
	private convertToPublicCompare(json: any): any {
		return {
			objId: Number(json.attr.objId),
			objName: json.attr.objName,
			objTypeId: Number(json.attr.objTypeId),
			objTypeName: json.attr.objTypeName,
			revision: Number(json.attr.revision),
			createUserName: json.attr.createUserName,
			createDate: json.attr.createDate,
			createDateTime: Number(json.attr.createDateTime)

		};
	}
}
