import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDTO } from 'app/admins/shared/dtos/object.dto';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * オブジェクトAPIサービス
 */
@Injectable()
export class EIMObjectService {


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
	 * 表示列のリストを取得します.
	 * @param objTypeId オブジェクトタイプID
	 * @return 表示列のリスト
	 */
	public getFormListColumn(objTypeId: number, dialogViewFlag?: boolean): Observable<any[]> {
		return this.httpService.postForForm('/admin/object/dspFormListColumn.jsp', {objTypeId: objTypeId}, dialogViewFlag)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.formListColumnInfo,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * フォーマットのリストを取得します.
	 * @param objTypeId オブジェクトタイプID
	 * @return フォーマットのリスト
	 */
	public getFormatList(objTypeId: number, relationViewFlag?: boolean): Observable<EIMFormatDTO[]> {
		return this.httpService.postForForm('/admin/object/dspFormat.jsp', {objTypeId: objTypeId}, relationViewFlag)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value.formats.format,
				(_json: any) => {
					return new EIMFormatDTO(_json);
				}));
		}));
	}

	/**
	 * ワークフローを取得します.
	 * @param objTypeId オブジェクトタイプID
	 * @param ワークフロー
	 * @return 成否
	 */
	public getWorkflow(objTypeId: number): any {
		return this.httpService.postForForm('/admin/object/dspWorkFlow.jsp', {objTypeId: objTypeId})
		.pipe(mergeMap((res: any) => {
			if (res.value.statusTypeList) {
				return of(this.domainService.createObject(res.value.statusTypeList,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			} else {
				return of(res.value);
			}
		}));
	}

	/**
	 * オブジェクトに属性を登録します.
	 * @param attTypeId 属性タイプID
	 * @param objTypeId オブジェクトタイプID
	 * @return 成否
	 */
	public createAttributeType(attTypeId?: number[], objTypeId?: number): Observable<any[]> {

		let params: any = {};
		params['attTypeId'] = attTypeId;
		params['objTypeId'] = objTypeId;
		// 登録する属性がない場合処理しない
		if (attTypeId.length <= 0) {
			return of(['OK']);
		}

		return this.httpService.postForForm('/admin/object/actApplyAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}))
	}

	/**
	 * 属性フィールドを取得します.
	 * @param objKey オブジェクトキー
	 * @param objName オブジェクト名
	 * @return 属性フィールド
	 */
	public getAttributeField(objKey: string, objName?: number): Observable<EIMUserAttributeDTO[]> {

		let params: any = {};
		params['objKey'] = objKey;
		params['objName'] = objName;

		return this.httpService.postForForm('/admin/object/dspAttributeField.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attList.attribute,
					(_json: any) => {
						return new EIMUserAttributeDTO(_json);
				}));
			}));
	}

	/**
	 * オブジェクトから属性を削除します.
	 * @param attTypeId 属性タイプID
	 * @param objTypeId オブジェクトタイプID
	 * @return 成否
	 */
	public deleteAttributeType(attTypeId?: number[], objTypeId?: number): Observable<any[]> {

		let params: any = {};
		params['attTypeId'] = attTypeId;
		params['objTypeId'] = objTypeId;
		// 削除する属性がない場合は処理しない
		if (attTypeId.length <= 0) {
			return of(['OK']);
		}

		return this.httpService.postForForm('/admin/object/actReleaseAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトにフォーマットを登録します.
	 * @param formatId フォーマットID
	 * @param objTypeId オブジェクトタイプID
	 * @return 登録したフォーマット情報
	 */
	public createFormat(formatId: number, objTypeId: number): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatId'] = formatId;
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actApplyFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.format,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクトからフォーマットを削除します.
	 * @param formatId フォーマットID
	 * @param objTypeId オブジェクトタイプID
	 * @return 削除したフォーマット情報
	 */
	public deleteFormat(formatId: number, objTypeId: number): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatId'] = formatId;
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actReleaseFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.format,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * デフォルトフォーマットを登録します.
	 * @param formatId フォーマットID
	 * @param objTypeId オブジェクトタイプID
	 * @return 成否
	 */
	public createDefaultFormat(formatId: number, objTypeId: number): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatId'] = formatId;
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actSetDefaultFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトにワークフローを登録します.
	 * @param workFlowId フォーマットID
	 * @param objTypeId オブジェクトタイプID
	 * @return 登録したワークフロー情報
	 */
	public createWorkflow(workFlowId: number, objTypeId: number): any {

		let params: any = {};
		params['workFlowId'] = workFlowId;
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actApplyWorkFlow.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトからワークフローを削除します.
	 * @param workFlowId フォーマットID
	 * @param objTypeId オブジェクトタイプID
	 * @return 成否
	 */
	public deleteWorkflow(workFlowId: number, objTypeId: number): Observable<EIMWorkflowDomain[]> {

		let params: any = {};
		params['workFlowId'] = workFlowId;
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actReleaseWorkFlow.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトを削除します.
	 * @param objTypeId オブジェクトタイプID
	 * @return 成否
	 */
	public delete(objTypeId: number): Observable<EIMObjectDTO[]> {

		return this.httpService.postForForm('/admin/object/actDeleteObjectType.jsp', {objTypeId: objTypeId})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクト(汎用)を作成します.
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param defName 定義名称
	 * @param namespace ネームスペース
	 * @return 作成したオブジェクト情報
	 */
	public create(parentObjTypeId: number, defName: string, namespace: string, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['parentObjTypeId'] = parentObjTypeId;
		params['defName'] = defName;
		params['namespace'] = namespace;
		params['otherCnt'] = lang.length;
		this.convertOtherName(params, lang);
		return this.httpService.postForForm('/admin/object/actCreateObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクト(ドキュメント)を作成します.
	 * @param formatString 付加文字列
	 * @param parentSequence 親クラス採番利用
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param namespace ネームスペース
	 * @param defName 定義名称
	 * @param numberAutoCreate 番号自動生成
	 * @return 作成したオブジェクト情報
	 */
	public createForDocument(formatString: string, parentSequence: boolean, parentObjTypeId: number,
		namespace: string, defName: string, numberAutoCreate: boolean, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatString'] = formatString;
		params['parentSequence'] = parentSequence;
		params['parentObjTypeId'] = parentObjTypeId;
		params['namespace'] = namespace;
		params['defName'] = defName;
		params['numberAutoCreate'] = numberAutoCreate;
		this.convertOtherName(params, lang);
		params['otherCnt'] = lang.length;

		return this.httpService.postForForm('/admin/object/actCreateObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクト(帳票)を作成します.
	 * @param formatString 付加文字列
	 * @param parentSequence 親クラス採番利用
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param namespace ネームスペース
	 * @param defName 定義名称
	 * @return 作成したオブジェクト情報
	 */
	public createForForm(formatString: string, parentSequence: boolean, parentObjTypeId: number,
		namespace: string, defName: string, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatString'] = formatString;
		params['parentSequence'] = parentSequence;
		params['parentObjTypeId'] = parentObjTypeId;
		params['namespace'] = namespace;
		params['defName'] = defName;
		this.convertOtherName(params, lang);
		params['otherCnt'] = lang.length;

		return this.httpService.postForForm('/admin/object/actCreateObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクト(汎用)を更新します.
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param defName 定義名称
	 * @param namespace ネームスペース
	 * @param objTypeId オブジェクトタイプID
	 * @return 更新したオブジェクト情報
	 */
	public update(parentObjTypeId: number, defName: string, namespace: string, objTypeId: number, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['parentObjTypeId'] = parentObjTypeId;
		params['defName'] = defName;
		params['namespace'] = namespace;
		params['otherCnt'] = lang.length;
		this.convertOtherName(params, lang);
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actUpdateObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクト(ドキュメント)を更新します.
	 * @param formatString 付加文字列
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param namespace ネームスペース
	 * @param defName 定義名称
	 * @param numberAutoCreate 番号自動生成
	 * @param objTypeId オブジェクトタイプID
	 * @return 更新したオブジェクト情報
	 */
	public updateForDocument(formatString: string, parentObjTypeId: number, namespace: string,
		defName: string, numberAutoCreate: boolean, objTypeId: number, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatString'] = formatString;
		params['parentObjTypeId'] = parentObjTypeId;
		params['objTypeId'] = objTypeId;
		params['namespace'] = namespace;
		params['defName'] = defName;
		params['otherCnt'] = lang.length;
		this.convertOtherName(params, lang);
		params['numberAutoCreate'] = numberAutoCreate;

		return this.httpService.postForForm('/admin/object/actUpdateObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクト(帳票)を更新します.
	 * @param formatString 付加文字列
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param objTypeId オブジェクトタイプID
	 * @param namespace ネームスペース
	 * @param defName 定義名称
	 * @return 更新したオブジェクト情報
	 */
	public updateForForm(formatString: string, parentObjTypeId: number,
		namespace: string, defName: string, objTypeId: number, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatString'] = formatString;
		params['parentObjTypeId'] = parentObjTypeId;
		params['objTypeId'] = objTypeId;
		params['namespace'] = namespace;
		params['defName'] = defName;
		params['otherCnt'] = lang.length;
		this.convertOtherName(params, lang);

		return this.httpService.postForForm('/admin/object/actUpdateObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * セキュリティを取得します.
	 * @param objId オブジェクトID
	 * @return セキュリティ情報
	 */
	public getProperty(objId: number): Observable<EIMObjectDTO[]> {
		return this.httpService.postForForm('/admin/security/dspProperty.jsp', {objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクトにセキュリティを登録します.
	 * @param objId オブジェクトID
	 * @param secId セキュリティID
	 * @return 成否
	 */
	public createSecurity(objId: number, secId: number): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['objId'] = objId;
		params['secId'] = secId;

		return this.httpService.postForForm('/admin/security/actApplySecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトタイプを取得します.
	 * @param objTypeId オブジェクトタイプID
	 * @return オブジェクトタイプ情報
	 */
	public get(objTypeId: number): Observable<EIMObjectDTO[]> {
		return this.httpService.postForForm('/admin/object/dspObjectType.jsp', {objTypeId: objTypeId})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * オブジェクトを複製します.
	 * @param formatString 付加文字列
	 * @param parentSequence 親クラス採番利用
	 * @param parentObjTypeId 親オブジェクトタイプID
	 * @param namespace ネームスペース
	 * @param defName 定義名称
	 * @param srcObjTypeId 複製元オブジェクトタイプID
	 * @return 複製されたオブジェクト情報
	 */
	public createCopyObject(formatString: string, parentSequence: boolean, parentObjTypeId: number,
		namespace: string, defName: string, srcObjTypeId: number, lang: any[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['formatString'] = formatString;
		params['parentSequence'] = parentSequence;
		params['parentObjTypeId'] = parentObjTypeId;
		params['namespace'] = namespace;
		params['defName'] = defName;
		params['otherCnt'] = lang.length;
		this.convertOtherName(params, lang);
		params['srcObjTypeId'] = srcObjTypeId;

		return this.httpService.postForForm('/admin/object/actCopyObjectType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * 属性の表示順を編集します.
	 * @param objTypeId オブジェクトタイプID
	 * @param formListColumnIds 表示列リスト
	 * @return 編集対象のオブジェクト情報
	 */
	public updateFormListColumn(objTypeId: number, formListColumnIds: string[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['objTypeId'] = objTypeId;
		params['formListColumnIds'] = formListColumnIds;

		return this.httpService.postForForm('/admin/object/actUpdateFormListColumn.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objType,
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * 複製設定をします.
	 * @param newCopyFlag 複製設定フラグ
	 * @param objTypeId オブジェクトタイプID
	 * @param attTypeId 属性タイプID
	 * @return 成否
	 */
	public createNewCopyAttributeType(newCopyFlag: boolean[], objTypeId: number, attTypeId: number[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['newCopyFlag'] = newCopyFlag;
		params['objTypeId'] = objTypeId;
		params['attTypeId'] = attTypeId;

		return this.httpService.postForForm('/admin/object/actNewCopyAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 引継ぎ・関連付け設定をします.
	 * @param attTypeId 属性タイプID
	 * @param objTypeId オブジェクトタイプID
	 * @param inheritanceFlag リビジョンアップ時引継ぎフラグ
	 * @param relationFlag 最新リビジョン関連付けフラグ
	 * @return 成否
	 */
	public createInheritanceAndRelationAttributeType(attTypeId: number[], objTypeId: number,
		inheritanceFlag: boolean[], relationFlag: boolean[]): Observable<EIMObjectDTO[]> {

		let params: any = {};
		params['attTypeId'] = attTypeId;
		params['inheritanceFlag'] = inheritanceFlag;
		params['relationFlag'] = relationFlag;
		params['objTypeId'] = objTypeId;

		return this.httpService.postForForm('/admin/object/actInheritanceAndRelationAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	private convertOtherName(params: any, lang: any[]): any {
		// 多言語リストから名称を指定します.
		for (let i = 0; i < lang.length; i++) {
			params['otherLId' + i] = lang[i].otherLId;
			params['otherName' + i] = lang[i].otherName;
		}
		return params;
	}
}
