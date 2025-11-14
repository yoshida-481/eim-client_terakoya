import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMEntryService} from 'app/shared/services/apis/entry.service';
import { EIMDocumentsConstantService} from 'app/documents/shared/services/documents-constant.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';

export interface EIMEntry {
	entryId?: number;
	entryName?: string;
	entryTypeId?: number;
	entryTypeName?: string;
	groupName?: string;
	roleName?: string;
	userCode?: string;
	userKana?: string;
	userMail?: string;
}

/**
 * エントリAPIサービス
 */
@Injectable()
export class EIMDocumentsEntryService extends EIMEntryService {

	constructor(
			protected httpService: EIMDocumentsHttpService,
			protected jsonService: EIMJSONService,
			protected translateService: TranslateService,
			protected objectRoleService: EIMObjectRoleService,
	) {
		super(httpService, jsonService, translateService, objectRoleService);
	}

	/**
	 * グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getGroupList(documentId: number, isFilter: boolean): Observable<any> {

		let params: any = {};
		params['objId'] = documentId;
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/app/document/publish/dspGroupTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ロールリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getRoleList(documentId: number, isFilter: boolean): Observable<any> {

		let params: any = {};
		params['objId'] = documentId;
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/app/document/publish/dspRoleTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 複合グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getComplexGroupList(documentId: number, isFilter: boolean): Observable<any> {

		let params: any = {};
		params['objId'] = documentId;
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/app/document/publish/dspCompTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザ定義グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getUserDefGroupList(documentId: number, isFilter: boolean): Observable<any> {
		// 未使用のため未実装
		return of();
	}

	/**
	 * システム処理リストを取得します.
	 */
	public getSysFuncEntryList(): Observable<any> {
		// 未使用のため未実装
		return of();
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
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/app/document/publish/dspGroupUser.jsp', params, false)
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
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/app/document/publish/dspRoleUser.jsp', params, false)
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
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/app/document/publish/dspCompUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザリストをエントリリストに変換します.
	 * @param user ユーザリスト
	 * @return エントリリスト
	 */
	public convertUsersToEntrys(user: any): EIMEntry[] {

		let entrys: EIMEntry[] = [];

		if (user instanceof Array) {
			for (let i = 0; i < user.length; i++) {
				entrys.push(this.convertUserToEntry(user[i].attr));
			}
		} else {
			entrys.push(this.convertUserToEntry(user.attr));
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
				entryTypeId: EIMDocumentsConstantService.ENTRY_TYPE_USER,
				entryTypeName: this.getEntryTypeName(EIMDocumentsConstantService.ENTRY_TYPE_USER),
				groupName: user.groupName,
				roleName: user.roleName,
				userCode: user.userCode,
				userKana: user.userKana,
				userMail: user.userMail
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
				entryTypeId: EIMDocumentsConstantService.ENTRY_TYPE_GROUP,
				entryTypeName: this.getEntryTypeName(EIMDocumentsConstantService.ENTRY_TYPE_GROUP),
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
				entryTypeId: EIMDocumentsConstantService.ENTRY_TYPE_ROLE,
				entryTypeName: this.getEntryTypeName(EIMDocumentsConstantService.ENTRY_TYPE_ROLE),
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
				entryTypeId: EIMDocumentsConstantService.ENTRY_TYPE_COMPLEX_GROUP,
				entryTypeName: this.getEntryTypeName(EIMDocumentsConstantService.ENTRY_TYPE_COMPLEX_GROUP),
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
			case EIMDocumentsConstantService.ENTRY_TYPE_USER:
				entryTypeName = this.translateService.instant('EIM.LABEL_02017');
				break;
			case EIMDocumentsConstantService.ENTRY_TYPE_GROUP:
				entryTypeName = this.translateService.instant('EIM.LABEL_02003');
				break;
			case EIMDocumentsConstantService.ENTRY_TYPE_ROLE:
				entryTypeName = this.translateService.instant('EIM.LABEL_02004');
				break;
			case EIMDocumentsConstantService.ENTRY_TYPE_COMPLEX_GROUP:
				entryTypeName = this.translateService.instant('EIM.LABEL_02018');
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
				if (approvers[j].id == currentApprover[i].id) {
					currentApprover[i].code = approvers[j].code;
					currentApprover[i].groupNames = approvers[j].groupNames;
					currentApprover[i].roleNames = approvers[j].roleNames;
					currentApprover[i].kana = approvers[j].kana;
				}
			}
		}
	}
	/**
	 * 公開通知先を取得します.
	 * @param objId オブジェクトID
	 */
	public getNotfiedUser(objId: number): Observable<any> {
		return this.httpService.postForForm('/app/document/publish/dspPublisherList.jsp', {objId: objId})
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}))
	}
}
