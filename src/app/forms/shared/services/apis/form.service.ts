import { EIMOperationHistoryDTO } from '../../../../shared/dtos/operation-history.dto';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';
import { EIMFormDTO } from 'app/shared/dtos/form.dto';
import { EIMAttributeDTO } from 'app/shared/dtos/attribute.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormEventExecDomain } from "app/shared/domains/form-event-exec.domain";
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

@Injectable()
export class EIMFormService {

	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {
	}


	/**
	 * 帳票一覧を取得します.
	 */
	public getList(criteria, displayProgressDialog: boolean = true):Observable<EIMFormDTO[]> {
		return this.httpService.post('/rest/form/getList.mvc', criteria, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			let data:any[] = this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormDTO(json);});
			return of(this.copyListToProperty(data));
		}));
	}

	/**
	 * 帳票を取得します.
	 * @param id 帳票ID
	 * @return 帳票
	 */
	public getByIdForNewCopy(id:number):Observable<EIMFormDomain> {
		return this.httpService.get('/rest/form/getByIdForNewCopy.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 帳票を取得します.
	 * @param id 帳票ID
	 * @return 帳票
	 */
	public getById(id:number):Observable<EIMFormDomain> {
		return this.httpService.get('/rest/form/getById.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 帳票を取得します.
	 * 帳票レイアウト情報は含まれません.
	 * @param id 帳票ID
	 * @return 帳票
	 */
	public getByIdForTemporaryObject(id:number):Observable<EIMFormDomain> {
		return this.httpService.get('/rest/form/getByIdForTemporaryObject.mvc', {id: id})
		.pipe(mergeMap((res: any) => {
			let json:any = res.value;
			if (json.id) {
				return of(new EIMFormDomain(json));
			} else {
				return of(null);
			}

		}));
	}

	/**
	 * 帳票を登録します
	 * @param form 帳票
	 * @return 帳票
	 */
	public create(form: EIMFormDomain): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/create.mvc', form)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 帳票を更新します
	 * @param form 帳票
	 * @return 帳票
	 */
	public update(form: EIMFormDomain): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/update.mvc', form)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 帳票を移動します
	 * @param sourceFormList 帳票ドメインリスト
	 * @param targetFormTypeFolderId 移動先帳票タイプ、または帳票フォルダのID
	 * @return null
	 */
	public moveFormList(sourceFormList: EIMFormDomain[], targetFormTypeFolderId: number): Observable<null> {
		return this.httpService.post('/rest/form/moveFormList.mvc', {sourceFormList: sourceFormList, targetFormTypeFolderId: targetFormTypeFolderId})
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}

	/**
	 * 帳票を物理削除します
	 * @param formList 帳票ドメインリスト
	 * @return null
	 */
	public delete(formList: EIMFormDomain[]): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/delete.mvc', formList)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 帳票詳細の内容をExcelに出力します。<br>
	 * @param form 帳票
	 * @return ファイルパス
	 */
	public createExcelFile(form: EIMFormDomain): Observable<string> {
		return this.httpService.post('/rest/form/createExcelFile.mvc', form)
			.pipe(mergeMap((res: any) => {
				return of(res.value.filePath);
			}));
	}

	/**
	 * 帳票を論理削除します
	 * @param formList 帳票ドメインリスト
	 * @return null
	 */
	public setInvalidate(formList: EIMFormDomain[]): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/setInvalidate.mvc', formList)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 帳票を有効にします
	 * @param formList 帳票ドメインリスト
	 * @return null
	 */
	public setValidate(formList: EIMFormDomain[]): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/setValidate.mvc', formList)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormDomain(res.value));
			}));
	}

	/**
	 * 処理待ち帳票一覧を取得します.
	 */
	public getProcessingList(criteria, displayProgressDialog: boolean = true):Observable<EIMFormDTO[]> {
		return this.httpService.post('/rest/form/getProcessingList.mvc', criteria, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			let data:any[] = this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormDTO(json);});
			return of(this.copyListToProperty(data));
		}));
	}

	/**
	 * アクセス履歴を取得します.
	 */
	public getAccessHistoryList(formId: number): Observable<EIMOperationHistoryDTO[]> {
		return this.httpService.get('/rest/form/getAccessHistoryList.mvc', { objId: formId })
		.pipe(mergeMap((res: any) => {
			let data: any[] = this.domainService.createObjectList(res.value, (json:any) => {return new EIMOperationHistoryDTO(json);});
			return of(data);
		}));
	}

	/**
	 * 帳票に紐づくワークフローを取得します
	 * @param form 帳票
	 * @return ワークフロー
	 */
	public getWorkflow(form: EIMFormDomain, displayProgressDialog: boolean = true): Observable<EIMWorkflowDomain> {
		return this.httpService.post('/rest/form/getWorkflow.mvc', form, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(new EIMWorkflowDomain(res.value));
		}));
	}

	/**
	 * 指定された条件で帳票に対しイベントを実行します
	 * @param formEventExec 帳票のイベント実行に関する情報
	 * @return 帳票
	 */
	public doEvent(formEventExec: EIMFormEventExecDomain): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/doEvent.mvc', formEventExec)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormDomain(res.value));
		}));
	}

	/**
	 * 指定された条件で帳票に対して取戻しイベントを実行します
	 * @param formEventExec 帳票のイベント実行に関する情報
	 * @return 帳票
	 */
	public doRegainEvent(formEventExec: EIMFormEventExecDomain): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/doRegainEvent.mvc', formEventExec)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormDomain(res.value));
		}));
	}

	/**
	 * 帳票流用処理を実行します
	 * @param form 帳票
	 * @return 帳票
	 */
	public newCopy(form: EIMFormDomain): Observable<EIMFormDomain> {
		return this.httpService.post('/rest/form/newCopy.mvc', form)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormDomain(res.value));
		}));
	}

	/**
	 * 帳票検索条件を取得します.
	 */
	public getSearchFormJson(): Observable<string> {
		return this.httpService.get('/rest/form/getSearchFromJson.mvc')
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * 帳票タイプリストを取得します.
	 */
	public getFormTypeDomainList(): Observable<EIMFormTypeDTO[]> {
		return this.httpService.get('/rest/form/getFormTypeDomainList.mvc')
		.pipe(mergeMap((res: any) => {
			let data: any[] = this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormTypeDTO(json);});
			return of(data);
		}));
	}

	public setListToWorkspaceId(data:any[], formWorkspaceId):void {
		// 詳細画面を開くために各行にワークスペースIDを設定する
		for (let i = 0; i < data.length; i++) {
			let dto: EIMFormDTO = data[i];
			dto['_workspaceId'] = formWorkspaceId;
		}
	}

	public copyListToProperty(srcList:any[]):any[] {
		let targetList:any[] = [];

		for (let i = 0; i < srcList.length; i++) {
			let target:any = {};
			let src:any = srcList[i];
			Object.assign(target, src);
			for (let j = 0; j < src.attributeList.length; j++) {
				let attribute:EIMAttributeDTO = src.attributeList[j];
				target['attType_' + attribute.attributeType.id] = attribute;
			}
			targetList.push(target);
		}

		return targetList;
	}

}

