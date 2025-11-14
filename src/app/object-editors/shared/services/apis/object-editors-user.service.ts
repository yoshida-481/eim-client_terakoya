import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMUserCriteriaDTO } from 'app/shared/dtos/criteria/user-criteria.dto';
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

	// 以下セッションユーザ取得時のみの情報
	userAdmin?: number;
	groupPath?: string;
	approveDocument?: number;
	isPopupExists?: boolean;
	viceApprove?: boolean;
	textAttrMaxChars?: number;
}

/**
 * ユーザAPIサービス
 */
@Injectable()
export class EIMObjectEditorsUserService extends EIMUserService {

	/** 検索タイプ */
	public searchType = EIMUserService.USER_SERVICE_SEARCH_TYPE_KEYWORD;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected domainService: EIMDomainService,
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected serverConfigService: EIMServerConfigService,
	) {
		super(domainService, httpService, jsonService);
	}

  public getSessionUser(displayProgressDialog = true, displayErrorDialog = true): Observable<EIMSessionInformation> {
	return this.httpService.postForForm('/rest/session/getLoginUserInfo.mvc')
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
	 * ユーザを検索します.
	 * @param criteria 検索条件
	 * @return ユーザ一覧
	 */
	public searchUser(criteria: EIMUserCriteriaDTO): Observable<EIMUserDTO[]> {
		return this.httpService.post('/jsp/common/actSearchUser.jsp', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.jsonService.getJsonChildren(res.value.users.user
				, this.convertToEIMUserDTO));
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
  public searchUserByKeyword(keyword: string, disableUserFilter, systemUserFilter, parentObjId?: number): Observable<EIMUserDTO[]> {
    return this.httpService.postForForm('/jsp/common/actSearchUser.jsp',
      	{ objId: parentObjId, keyword: keyword, securityFilter: false, disableUserFilter: false, systemUserFilter: false })
  		.pipe(mergeMap((res: any) => {
  			return of(this.jsonService.getJsonChildren(res.value.users.user, this.convertToEIMUserDTO));
  		}));
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
		dto.kana = json.attr.userKana;
		dto.mail = json.attr.userMail;
		dto.groupNames = json.attr.groupName;
		dto.roleNames = json.attr.roleName;

		return dto;
	}

	private convertToConfigKeyValue(json: any): any {
		let keyValue: any = {};
		let target: any = [
			'approveMenuFlag',
			'isGeneralDocVisible',
			'isGeneralFolVisible',
			'searchDetailLikeCondition',
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
