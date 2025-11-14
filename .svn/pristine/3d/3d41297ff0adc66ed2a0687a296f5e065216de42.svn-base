import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMAdminsComplexGroupService } from 'app/admins/shared/services/apis/admins-complex-group.service';
import { EIMAdminsUserDTO } from 'app/admins/shared/dtos/admins-user.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';

/**
 * エントリAPIサービス
 */
@Injectable()
export class EIMAdminsEntryService extends EIMEntryService {

	constructor(
		httpService: EIMHttpService,
		jsonService: EIMJSONService,
		translateService: TranslateService,
		protected dateService: EIMDateService,
		protected domainService: EIMDomainService,
		protected adminsGroupService: EIMAdminsGroupService,
		protected adminsRoleService: EIMAdminsRoleService,
		protected adminsComplexGroupService: EIMAdminsComplexGroupService,
		protected objectRoleService: EIMObjectRoleService,
	) {
		super(httpService, jsonService, translateService, objectRoleService);

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * グループリストを取得します.
	 */
	public getGroupList(): Observable<any> {
		return this.adminsGroupService.getGroupList();
	}

	/**
	 * グループリストをパス形式で取得します.
	 * @param serchGroupName グループ名検索文字列
	 */
	public getGroupListPath(serchGroupName: string): Observable<any> {
		return this.adminsGroupService.getGroupListPath(serchGroupName);
	}

	/**
	 * グループを取得します.
	 * @param groupId グループID
	 * @return グループ情報
	 */
	public getGroup(groupId: number): Observable<any> {
		return this.adminsGroupService.getGroup(groupId);
	}

	/**
	 * ロールリストを取得します.
	 */
	public getRoleList(): Observable<any> {
		return this.adminsRoleService.getRoleList();
	}

	/**
	 * ロールを取得します.
	 * @param roleId ロールID
	 * @return ロール情報
	 */
	public getRole(roleId: number): Observable<any> {
		return this.adminsRoleService.getRole(roleId);
	}

	/**
	 * 複合グループリストを取得します.
	 */
	public getComplexGroupList(): Observable<any> {
		return this.adminsComplexGroupService.getComplexGroupList();
	}

	/**
	 * ユーザ定義グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 * @param viewSource 呼び出し元画面判定フラグ 0:セキュリティ画面、1:ワークフロー画面
	 */
	public getUserDefGroupList(documentId: number, isFilter: boolean, viewSource?: string): Observable<any> {

		let params: any = {};
		params['objId'] = documentId;
		params['isFilter'] = isFilter;
		if (viewSource !== 'undefined' && viewSource !== null) {
			params['viewSource'] = viewSource;
		}
		return this.httpService.postForForm('/admin/userDefGroup/dspUserDefGroupList.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * システム処理リストを取得します.
	 */
	public getSysFuncEntryList(): Observable<any> {

		return this.httpService.postForForm('/admin/workflow/dspSystemFunc.jsp')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}



	/**
	 * グループ所属ユーザリストを取得します.
	 * @param groupId グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getGroupUserList(groupId: number, documentId: number, isFilter: boolean): Observable<any> {

		let params: any = {};
		params['groupId'] = groupId;
		params['objId'] = documentId;
		params['isNotDisplayInvalidityUser'] = 1;

		return this.httpService.postForForm('/admin/group/dspGroupUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ロール所属ユーザリストを取得します.
	 * @param roleId ロールId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getRoleUserList(roleId: number, documentId: number, isFilter: boolean): Observable<any> {

		let params: any = {};
		params['roleId'] = roleId;
		params['objId'] = documentId;
		params['isNotDisplayInvalidityUser'] = 1;

		return this.httpService.postForForm('/admin/role/dspRoleUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 複合グループ所属ユーザリストを取得します.
	 * @param complexGroupId 複合グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getComplexGroupUserList(complexGroupId: number, documentId: number, isFilter: boolean): Observable<any> {

		let params: any = {};
		params['compId'] = complexGroupId;
		params['objId'] = documentId;
		params['isNotDisplayInvalidityUser'] = 1;

		return this.httpService.postForForm('/admin/comp/dspCompUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}


	/**
	 * ユーザ新規作成します.
	 * @param nameList 言語リスト
	 * @param userCode ID
	 * @param userKana かな
	 * @param userMail Mail
	 * @param userAdmin 管理者権限
	 * @param userDisable 無効フラグ
	 * @param userLang 受信メール言語
	 * @param attributeList 属性情報
	 * @param userPass パスワード
	 */
	public createUser(nameList: any, userCode: string, userKana: string, userMail: string, userAdmin: number,
		userDisable: number, userLang: string, attributeList: any, userPass: string): Observable<EIMAdminsUserDTO> {

		let params: any = this.nameListToParam(nameList)
		if (attributeList) {
			// 属性情報が存在する場合
			for (let i = 0; i < attributeList.length; i++) {
				for (let j = 0; j < attributeList[i].attMultipleList.length; j++) {
					if (attributeList[i].valTypeId === 3) {
						params['attType_' + attributeList[i].attTypeId + '_' + j] = this.dateService.getDateString(attributeList[i].attMultipleList[j]);
					} else {
						params['attType_' + attributeList[i].attTypeId + '_' + j] = attributeList[i].attMultipleList[j];
					}
				}
			}
		}
		params['userCode'] = userCode;
		params['userKana'] = userKana;
		params['userMail'] = userMail;
		params['userAdmin'] = userAdmin;
		params['userDisable'] = userDisable;
		params['userLang'] = userLang;
		params['userPass'] = userPass;

		return this.httpService.postForForm('/admin/user/actCreateUser.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMAdminsUserDTO(res.value.user));
			}));
	}

	/**
	 * ユーザを更新します.
	 * @param nameList 言語リスト
	 * @param userId ユーザId
	 * @param userCode ID
	 * @param userKana かな
	 * @param userMail Mail
	 * @param userAdmin 管理者権限
	 * @param userDisable 無効フラグ
	 * @param userLang 受信メール言語
	 * @param attributes 属性情報
	 * @param userPass パスワード
	 */
	public updateUser(nameList: any, userId: number, userCode: string, userKana: string, userMail: string, userAdmin: number,
		userDisable: number, userLang: string, attributes: any, userPass?: string): Observable<EIMAdminsUserDTO> {

		let params: any = this.nameListToParam(nameList)
		params['userId'] = userId;
		params['userCode'] = userCode;
		params['userKana'] = userKana;
		params['userMail'] = userMail;
		params['userAdmin'] = userAdmin;
		params['userDisable'] = userDisable;
		params['userLang'] = userLang;
		for (let i = 0; i < attributes.length; i++) {
			for (let j = 0; j < attributes[i].attMultipleList.length; j++) {
				if (attributes[i].valTypeId === 3) {
					params['attType_' + attributes[i].attTypeId + '_' + j] = this.dateService.getDateString(attributes[i].attMultipleList[j]);
				} else {
					params['attType_' + attributes[i].attTypeId + '_' + j] = attributes[i].attMultipleList[j];
				}
			}
		}
		if (userPass) {
			// パスワードは、変更する場合だけ、パラメータを用意する
			params['userPass'] = userPass;
		}

		return this.httpService.postForForm('/admin/user/actUpdateUser.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMAdminsUserDTO(res.value.user));
			}));
	}

	/**
	 * ユーザを削除します.
	 * @param userId ユーザId
	 */
	public deleteUser(userId: number): Observable<any> {

		let params: any = {};
		params['userId'] = userId;

		return this.httpService.postForForm('/admin/user/actDeleteUser.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザ情報をインポートします。
	 * @param compId ユーザId
	 */
	public importFile(compId: number): Observable<any> {

		let params: any = {};
		params['compId'] = compId;

		return this.httpService.postForForm('/admin/comp/actDeleteComp.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザ情報をエクスポートします。
	 * @param userCode ID
	 * @param userName 名称
	 * @param userMail Mail
	 */
	public exportFile(userCode: string, userName: string, userMail: string): Observable<any> {

		let params: any = {};
		params['userCode'] = userCode;

		return this.httpService.postForForm('/admin/comp/actDeleteComp.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザにグループ、ロールをアサインする(add,remove)
	 * @param userId ユーザにグループ、ロールをアサインする(add, remove)
	 * @param addGroupIds 追加グループリスト
	 * @param addRoleIds 追加ロールリスト
	 * @param removeGroupIds 除去グループリスト
	 * @param removeRoleIds 除去ロールリスト
	 */
	public assignGroupRole(userId: number, addGroupIds: number[], addRoleIds: number[], removeGroupIds: number[], removeRoleIds: number[]): Observable<any> {
		let params: any = {};
		params['userId'] = userId;
		params['addGroupIds'] = addGroupIds.join(',');
		params['removeGroupIds'] = removeGroupIds.join(',');
		params['addRoleIds'] = addRoleIds.join(',');
		params['removeRoleIds'] = removeRoleIds.join(',');
		return this.httpService.postForForm('/admin/user/actAssignGroupRole.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return フォーマット
	 */
	private nameListToParam(nameList: any): {} {
		let params: any = {};
		let languageId = 'otherLId';
		let languageName = 'otherName';
		let languageIdTmp: string;
		let languageNameTmp: string;
		let keys = Object.keys(nameList);
		let languageCnt = keys.length;

		params['otherCnt'] = languageCnt;

		for (let idx = 0; idx < languageCnt; idx++) {
			languageIdTmp = languageId + idx;
			languageNameTmp = languageName + idx;
			params[languageIdTmp] = keys[idx];
			params[languageNameTmp] = nameList[keys[idx]];

		}
		return params;
	}

	/**
	 * 属性情報データ変換
	 * @param attributeList 属性情報リスト
	 * @return 属性情報
	 */
	private attributeListToParam(attributeList: any): {} {
		let params: any = {};
		let attributeTypeId = 'attType_';
		let attributeTypeIdUnder = '_';
		let attributeTypeIdTmp: string;
		let keys = Object.keys(attributeList);
		let attributeCnt = keys.length;

		for (let idx = 0; idx < attributeCnt; idx++) {
			attributeTypeIdTmp = attributeTypeId + keys[idx] + attributeTypeIdUnder + idx;
			params[attributeTypeIdTmp] = attributeList[keys[idx]];

		}
		return params;
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

}
