import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMObjectRoleService } from './object-role.service';

export interface EIMEntry {
	entryId?: number;
	entryName?: string;
	entryObjName?: string;
	entryTypeId?: number;
	entryTypeName?: string;
	groupName?: string;
	roleName?: string;
	userCode?: string;
	userMail?: string;
	userKana?: string;
}

/**
 * エントリAPIサービス
 */
@Injectable()
export abstract class EIMEntryService {

	/**
	 * コンストラクタです.
	 * @param httpService
	 * @param jsonService
	 * @param translateService
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected translateService: TranslateService,
		protected objectRoleService: EIMObjectRoleService,
	) { }

	/**
	 * ユーザリストを取得します.
	 * @param keyword 検索キーワード
	 * @param isDisable 無効ユーザ絞り込み有無（true/false)
	 * @param parentObjId 親フォルダのID（親フォルダのセキュリティで絞る場合に指定）
	 * @return ユーザリスト
	 */
	public getUserList(keyword: string, disableUserFilter: boolean, parentObjId?: number): Observable<any> {
		let params: any = {};
		params['objId'] = parentObjId;
		params['keyword'] = keyword;
		params['securityFilter'] = parentObjId ? true : false;
		params['disableUserFilter'] = disableUserFilter;
		params['systemUserFilter'] = false;

		return this.httpService.postForForm('/common/user/actSearchUser.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトロールリストを取得します.
	 * 予約済みオブジェクトロール「全メンバー」を含めて取得します.
	 */
	public getObjectRoleList(): Observable<any> {
		return this.objectRoleService.getList(null, true);
	}

	/**
	 * グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public abstract getGroupList(documentId: number, isFilter: boolean): Observable<any>;

	/**
	 * ロールリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public abstract getRoleList(documentId: number, isFilter: boolean): Observable<any>;

	/**
	 * 複合グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public abstract getComplexGroupList(documentId: number, isFilter: boolean): Observable<any>;

	/**
	 * ユーザ定義グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
 	 * @param viewSource 呼び出し元画面判定フラグ
	 */
	public abstract getUserDefGroupList(documentId: number, isFilter: boolean, viewSource?: string): Observable<any>;

	/**
	 * システム処理リストを取得します.
	 */
	public abstract getSysFuncEntryList(): Observable<any>;

	/**
	 * グループ所属ユーザリストを取得します.
	 * @param groupId グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public abstract getGroupUserList(groupId: number, documentId: number, isFilter: boolean): Observable<any>;

	/**
	 * ロール所属ユーザリストを取得します.
	 * @param roleId ロールId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public abstract getRoleUserList(roleId: number, documentId: number, isFilter: boolean): Observable<any>;

	/**
	 * 複合グループ所属ユーザリストを取得します.
	 * @param complexGroupId 複合グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public abstract getComplexGroupUserList(complexGroupId: number, documentId: number, isFilter: boolean): Observable<any>;

	/**
	 * ユーザリストをエントリリストに変換します.
	 * @param user ユーザリスト
	 * @return エントリリスト
	 */
	public convertUsersToEntrys(user: any): EIMEntry[] {

		let entrys: EIMEntry[] = [];

		if (user instanceof Array) {
			for (let i = 0; i < user.length; i++) {
				let userData = user[i];
				if (userData.attr) {
					userData = Object.assign({}, userData.attr);
				}
				entrys.push(this.convertUserToEntry(userData));
			}
		} else {
			entrys.push(this.convertUserToEntry(user.attr));
		}

		return entrys;
	}

	/**
	 * ユーザ定義グループリストをエントリリストに変換します.
	 * @param userDefGroup ユーザ定義グループリスト
	 * @return エントリリスト
	 */
	public convertUserDefGroupToEntrys(userDefGroup: any): EIMEntry[] {

		let entrys: EIMEntry[] = [];

		if (userDefGroup instanceof Array) {
			for (let i = 0; i < userDefGroup.length; i++) {
				entrys.push(this.convertUserDefGroupToEntry(userDefGroup[i].attr));
			}
		} else {
			entrys.push(this.convertUserDefGroupToEntry(userDefGroup.attr));
		}

		return entrys;
	}

	/**
	 * システム処理リストをエントリリストに変換します.
	 * @param systemFunc システム処理リスト
	 * @return エントリリスト
	 */
	public convertSystemFuncListToEntrys(systemFunc: any): EIMEntry[] {

		let entrys: EIMEntry[] = [];

		if (systemFunc instanceof Array) {
			for (let i = 0; i < systemFunc.length; i++) {
				entrys.push(this.convertSystemFuncToEntry(systemFunc[i].attr));
			}
		} else {
			entrys.push(this.convertSystemFuncToEntry(systemFunc.attr));
		}

		return entrys;
	}

	/**
	 * オブジェクトロールリストをエントリリストに変換します.
	 * @param objectRoles オブジェクトロールリスト
	 * @return エントリリスト
	 */
	public convertObjectRolesToEntrys(objectRoles: any): EIMEntry[] {

		let entrys: EIMEntry[] = [];

		if (objectRoles instanceof Array) {
			for (let i = 0; i < objectRoles.length; i++) {
				entrys.push(this.convertObjectRoleToEntry(objectRoles[i]));
			}
		} else {
			entrys.push(this.convertObjectRoleToEntry(objectRoles));
		}

		return entrys;
	}

	/**
	 * ユーザをエントリに変換します.
	 * @param user ユーザ
	 * @return エントリ
	 */
	public convertUserToEntry(user: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: user.userId,
			entryName: user.userName,
			entryObjName: user.userName,
			entryTypeId: EIMConstantService.ENTRY_TYPE_USER,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_USER),
			groupName: user.groupName,
			roleName: user.roleName,
			userCode: user.userCode,
			userMail: user.userMail,
			userKana: user.userKana
		}
		return entry;
	}

	/**
	 * グループをエントリに変換します.
	 * @param group グループ
	 * @return エントリ
	 */
	public convertGroupToEntry(group: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: group.groupId,
			entryName: group.label,
			entryTypeId: EIMConstantService.ENTRY_TYPE_GROUP,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_GROUP),
		}
		return entry;
	}

	/**
	 * ロールをエントリに変換します.
	 * @param role ロール
	 * @return エントリ
	 */
	public convertRoleToEntry(role: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: role.roleId,
			entryName: role.label,
			entryTypeId: EIMConstantService.ENTRY_TYPE_ROLE,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_ROLE),
		}
		return entry;
	}

	/**
	 * 複合グループをエントリに変換します.
	 * @param complexGroup 複合グループ
	 * @return エントリ
	 */
	public convertComplexGroupToEntry(complexGroup: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: complexGroup.compId,
			entryName: complexGroup.label,
			entryTypeId: EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP),
		}
		return entry;
	}

	/**
	 * ユーザ定義グループをエントリに変換します.
	 * @param complexGroup 複合グループ
	 * @return エントリ
	 */
	public convertUserDefGroupToEntry(userDefGroup: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: userDefGroup.userDefGroupId,
			entryName: userDefGroup.label,
			entryObjName: userDefGroup.label,
			entryTypeId: EIMConstantService.ENTRY_TYPE_USER_DEF_GROUP,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_USER_DEF_GROUP),
		}
		return entry;
	}

	/**
	 * システム処理リストをエントリに変換します.
	 * @param complexGroup 複合グループ
	 * @return エントリ
	 */
	public convertSystemFuncToEntry(systemFunc: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: systemFunc.sysFuncId,
			entryName: systemFunc.name,
			entryObjName: systemFunc.name,
			entryTypeId: EIMConstantService.ENTRY_TYPE_SYSTEM_FUNC,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_SYSTEM_FUNC),
		}
		return entry;
	}

	/**
	 * オブジェクトロールをエントリに変換します.
	 * @param objectRole オブジェクトーる
	 * @return エントリ
	 */
	public convertObjectRoleToEntry(objectRole: any): EIMEntry {
		let entry: EIMEntry = {
			entryId: objectRole.id,
			entryName: objectRole.name,
			entryObjName: objectRole.name,
			entryTypeId: EIMConstantService.ENTRY_TYPE_OBJECT_ROLE,
			entryTypeName: this.getEntryTypeName(EIMConstantService.ENTRY_TYPE_OBJECT_ROLE),
		}
		return entry;
	}

	/**
	 * エントリタイプ名を取得します.
	 * @param entryTypeId エントリタイプId
	 * @return エントリタイプ名
	 */
	public getEntryTypeName(entryTypeId: number): string {

		let entryTypeName = '';

		switch (entryTypeId) {
			case EIMConstantService.ENTRY_TYPE_USER:
				entryTypeName = this.translateService.instant('EIM.LABEL_02017');
				break;
			case EIMConstantService.ENTRY_TYPE_GROUP:
				entryTypeName = this.translateService.instant('EIM.LABEL_02003');
				break;
			case EIMConstantService.ENTRY_TYPE_ROLE:
				entryTypeName = this.translateService.instant('EIM.LABEL_02004');
				break;
			case EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP:
				entryTypeName = this.translateService.instant('EIM.LABEL_02018');
				break;
			case EIMConstantService.ENTRY_TYPE_USER_DEF_GROUP:
				entryTypeName = this.translateService.instant('EIM.LABEL_02043');
				break;
			case EIMConstantService.ENTRY_TYPE_SYSTEM_FUNC:
				entryTypeName = this.translateService.instant('EIM.LABEL_02055');
				break;
			case EIMConstantService.ENTRY_TYPE_OBJECT_ROLE:
				entryTypeName = this.translateService.instant('EIM.LABEL_02054');
				break;

		}
		return entryTypeName;
	}

	/**
	 * 初期設定された承認依頼先ユーザの情報を付与します.
	 * @param approvers 承認依頼先一覧
	 * @param currentApprover 設定されている依頼先一覧
	 */
	public getApproverInfo(approvers: EIMEntryUserDTO[], currentApprover: EIMEntryUserDTO[]): void {
		for (let i = 0; i < currentApprover.length; i++) {
			for (let j = 0; j < approvers.length; j++) {
				if (approvers[j].id === currentApprover[i].id) {
					currentApprover[i].code = approvers[j].code;
					currentApprover[i].groupNames = approvers[j].groupNames;
					currentApprover[i].roleNames = approvers[j].roleNames;
				}
			}
		}
	}
}
