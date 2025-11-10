import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMFormWorkspaceDTO } from 'app/admins/shared/dtos/form-workspace.dto';
import { EIMWorkspaceFormTypeDTO } from 'app/admins/shared/dtos/workspace-form-type.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormFolderDTO } from 'app/admins/shared/dtos/form-folder.dto'
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMOtherNameDomain } from 'app/shared/domains/entity/other-name.domain';
import { EIMWorkspaceFormCriteria } from 'app/shared/domains/criteria/workspace-form.criteria'
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


/**
 * 帳票ワークスペースツリーノードインタフェース.
 */
export interface EIMWorkspaceTreeNode extends EIMTreeNode {
	id?: number;
	formWorkspaceId?: number;
	formTypeId?: number;
	formTypeFolderId?: number;
	isTrash?: boolean;
	formCount?: number;
	uniqueKey?: string;
	securityId?: number;
}


/**
 * 帳票ワークスペースAPIサービス
 */
@Injectable()
export class EIMAdminsFormWorkspaceService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected domainService: EIMDomainService) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票ワークスペースを取得します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @return 帳票ワークスペース
	 */
	public getById(formWorkspaceId: number, displayProgressDialog?: boolean): Observable<EIMFormWorkspaceDTO> {
		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formWorkspaceId = formWorkspaceId;
		return this.httpService.post('/rest/admin/form-workspace/getById.mvc', criteria, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormWorkspaceDTO(res.value));
			}
		));
	}


	/**
	 * 帳票ワークスペース一覧を取得します.
	 * @return 帳票ワークスペース一覧
	 */
	public getList(): Observable<EIMFormWorkspaceDTO[]> {

		return this.httpService.post('/rest/admin/form-workspace/getList.mvc')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (json: any) => {return new EIMFormWorkspaceDTO(json); }));
			}
		));
	}


	/**
	 * 帳票ワークスペースを登録します.
	 * @param nameList 言語リスト
	 * @return 帳票ワークスペース
	 */
	public create(nameList: any): Observable<EIMFormWorkspaceDTO> {
		let criteria = new EIMWorkspaceFormCriteria();
		let otherName = new EIMOtherNameDomain();
		let paramNameList = this.nameListToArray(nameList);
		criteria.name = paramNameList[0];
		criteria.nameList.push(criteria.name);
		criteria.nameList.push(paramNameList[1]);

		let otherNameDomain = this.nameListToOtherNameDomain(nameList);
		criteria.nameListDomain = otherNameDomain;

		return this.httpService.post('/rest/admin/form-workspace/create.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				// return of(res.value);
				return of(new EIMFormWorkspaceDTO(res.value));
			}
		));
	}


	/**
	 * ワークスペースを更新します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param nameList 言語リスト
	 * @return 更新結果
	 */
	public update(formWorkspaceId: number, nameList: any): Observable<string> {
		let criteria = new EIMWorkspaceFormCriteria();
		let paramNameList = this.nameListToArray(nameList);
		criteria.formWorkspaceId = formWorkspaceId;
		criteria.name = paramNameList[0];
		criteria.nameList.push(criteria.name);
		criteria.nameList.push(paramNameList[1]);

		let otherNameDomain = this.nameListToOtherNameDomain(nameList);
		criteria.nameListDomain = otherNameDomain;

		return this.httpService.post('/rest/admin/form-workspace/update.mvc', criteria)
			.pipe(mergeMap((res: any) => {
					return of(res.value.result);
			}));
	}


	/**
	 * 帳票ワークスペースを削除します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @return 帳票ワークスペース
	 */
	public delete(formWorkspaceId: number): Observable<string> {
		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formWorkspaceId = formWorkspaceId;

		return this.httpService.post('/rest/admin/form-workspace/delete.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(res.value.result);
			}
		));
	}


	/**
	 * 帳票ワークスペースの帳票タイプ一覧を取得します.
	 * @param formTypeIds 帳票タイプIDリスト
	 * @return 帳票タイプ一覧
	 */
	public getFormTypeList(formTypeIds: number[]): Observable<EIMFormTypeDTO[]> {
		let criteria = new EIMWorkspaceFormCriteria();

		criteria.ids = formTypeIds;

		return this.httpService.post('/rest/admin/form-workspace/getFormTypeList.mvc', criteria, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (json: any) => {return new EIMFormTypeDTO(json); }));
			}
		));
	}


	/**
	 * 帳票タイプ一覧を取得します.
	 * @param definitionName 定義名称
	 * @return 帳票タイプ一覧
	 */
	public getFormTypeListByDefName(definitionName?: string): Observable<EIMWorkspaceFormTypeDTO> {
		let criteria = new EIMWorkspaceFormCriteria();
		if (!definitionName) {
			definitionName = EIMAdminsConstantService.OBJECT_TYPE_NAME_FORM; // 帳票タイプ

		}
		criteria.definitionName = definitionName;

		return this.httpService.post('/rest/admin/form-workspace/getByDefinitionName.mvc', criteria)
		.pipe(mergeMap((res: any) => {
				return of(new EIMWorkspaceFormTypeDTO(res.value));
		}));
	}


	/**
	 * 帳票タイプを削除します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeIds 帳票タイプIDリスト
	 * @return 削除結果
	 */
	public addFormType(formWorkspaceId: number, formTypeIds: number[]): Observable<string> {
		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formWorkspaceId = formWorkspaceId;
		criteria.ids = formTypeIds;
		return this.httpService.post('/rest/admin/form-workspace/addFormType.mvc', criteria)
			.pipe(mergeMap((res: any) => {
					return of(res.value.result);
			}
		));
	}

	/**
	 * 帳票タイプを削除します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeIds 帳票タイプIDリスト
	 * @return 削除結果
	 */
	public deleteFormType(formWorkspaceId: number, formTypeIds: number[]): Observable<string> {
		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formWorkspaceId = formWorkspaceId;
		criteria.ids = formTypeIds;
		return this.httpService.post('/rest/admin/form-workspace/setFormType.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(res.value.result);
			}
		));
	}


	/**
	 * 帳票フォルダを取得します.
	 * @param formFolderId 帳票フォルダID
	 * @return 帳票フォルダ
	 */
	public getFormTypeFolderById(formFolderId: number): Observable<EIMFormFolderDTO> {
		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formFolderId = formFolderId;
		return this.httpService.post('/rest/admin/form-workspace/getFormFolderById.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormFolderDTO(res.value));
			}
		));
	}


  /**
	 * 帳票フォルダ一覧を返却します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @return 帳票フォルダ一覧
	 */
	public getFormFolderList(formWorkspaceId: number, formTypeId: number, displayProgressDialog?: boolean): Observable<EIMFormFolderDTO[]> {

		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formWorkspaceId = formWorkspaceId;
		criteria.formTypeId = formTypeId;

		return this.httpService.post('/rest/admin/form-workspace/getFormTypeFolderList.mvc', criteria, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (json: any) => {return new EIMFormFolderDTO(json); }));
			}
		));
	}


	/**
	 * 帳票フォルダを登録します.
	 * @param formFolderInfo 帳票フォルダ情報
	 * @return 帳票フォルダ
	 */
	public createFormFolder(formFolderInfo: any): Observable<EIMFormFolderDTO> {
		let criteria = new EIMWorkspaceFormCriteria();
		let otherName = new EIMOtherNameDomain();
		let paramNameList = this.nameListToArray(formFolderInfo.nameList);
		criteria.name = paramNameList[0];
		criteria.nameList.push(criteria.name);
		criteria.nameList.push(paramNameList[1]);

		criteria.formWorkspaceId = formFolderInfo.formWorkspaceId;
		criteria.formTypeId = formFolderInfo.formTypeId;
		criteria.parentFormFolderId = formFolderInfo.parentFormFolderId;

		let otherNameDomain = this.nameListToOtherNameDomain(formFolderInfo.nameList);
		criteria.nameListDomain = otherNameDomain;

		return this.httpService.post('/rest/admin/form-workspace/formFolderCreate.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormFolderDTO(res.value));
			}
		));
	}


	/**
	 * 帳票フォルダを更新します.
	 * @param formFolderId 帳票フォルダID
	 * @param nameList 言語リスト
	 * @return 更新結果
	 */
	public updateFormFolder(formFolderId: number, nameList: any): Observable<string> {
		let criteria = new EIMWorkspaceFormCriteria();
		let paramNameList = this.nameListToArray(nameList);
		criteria.formFolderId = formFolderId;
		criteria.name = paramNameList[0];
		criteria.nameList.push(criteria.name);
		criteria.nameList.push(paramNameList[1]);

		let otherNameDomain = this.nameListToOtherNameDomain(nameList);
		criteria.nameListDomain = otherNameDomain;

		return this.httpService.post('/rest/admin/form-workspace/formFolderUpdate.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(res.value.result);
			}
		));
	}


	/**
	 *  帳票フォルダを削除します.
	 * @param formFolderId 帳票フォルダID
	 * @return 削除結果
	 */
	public deleteFormFolder(formFolderId: number): Observable<string> {
		let criteria = new EIMWorkspaceFormCriteria();
		criteria.formFolderId = formFolderId;

		return this.httpService.post('/rest/admin/form-workspace/formFolderDelete.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(res.value.result);
			}
		));
	}


	/**
	 * 帳票フォルダの階層数を取得する.
	 * @param node 選択したノード
	 * @return ノッド階層数
	 */
	public countNodeHierarchy( node: EIMTreeNode ): number {
		let num = 1;
		if ( node.parent ) {
				return 1 +  this.countNodeHierarchy(node.parent);
		}
		return num;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return ワークスペース
	 */
	private nameListToArray(nameList: any): any[] {
		let params: any = []
		let keys = Object.keys(nameList);

		let languageCnt = keys.length;
		for (let idx = 0; idx < languageCnt; idx++) {
			params.push(nameList[keys[idx]]);

		}
		return params;
	}


	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return 多言語ドメイン
	 */
	private nameListToOtherNameDomain(nameList: any): EIMOtherNameDomain[] {
		let params: EIMOtherNameDomain[] = []
		let keys = Object.keys(nameList);

		let languageCnt = keys.length;
		for (let idx = 0; idx < languageCnt; idx++) {
			let otherNameDomain = new EIMOtherNameDomain();
			otherNameDomain.langId = keys[idx];
			otherNameDomain.name = nameList[keys[idx]];
			params.push(otherNameDomain);

		}
		return params;
	}

}
