import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMWorkflowDTO } from 'app/admins/shared/dtos/workflow.dto';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMMailTypeDTO } from 'app/admins/shared/dtos/mail-type.dto';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ワークフローAPIサービス
 */
@Injectable()
export class EIMAdminsWorkflowService {

  constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected localStorageService: EIMLocalStorageService,
			protected domainService: EIMDomainService) {}

	/**
	 * ワークフロー情報を取得します.
	 * @param id ワークフローID
	 * @return ワークフロー情報
	 */
	public getWorkFlowDefById(id: number): Observable<EIMWorkflowDomain> {
		return this.httpService.postForForm('/rest/admin/workflow/getWorkFlowDefAdminById.mvc', {id: id}, false)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value;
				return of(this.domainService.createObject( workFlow,
					(_json: any) => {
						return new EIMWorkflowDomain(_json);
					}));
		}));
	}

	/**
	 * ワークフロー情報（ドキュメント）を取得します.
	 * @param id ワークフローID
	 * @return ワークフロー情報
	 */
	public getWorkFlowDefByIdForDocument(id: number): Observable<EIMWorkflowDomain> {
		return this.httpService.postForForm('/rest/app/document/workflow/getWorkFlowDefDocById.mvc', {id: id}, false)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value;
				return of(this.domainService.createObject( workFlow,
					(_json: any) => {
						return new EIMWorkflowDomain(_json);
					}));
		}));
	}

	/**
	 * ワークフロー登録をチェックします.
	 * @param workflowId ワークフローID
	 * @return ワークフロー情報登録結果
	 */
	public checkWorkFlowObj(workflowId: number): Observable<any[]> {
		let param: any = {};
		param['workflowId'] = workflowId;
		return this.httpService.postForForm('/admin/workflow/dspCheckWorkFlowObj.jsp', param)
			.pipe(mergeMap((res: any) => {
				let data = res.value.workflow_exist;
				return of(this.domainService.createObjectList(data,
						(_json: any) => {
							return  _json;
						}));
		}));
	}

	/**
	 * ステータスをチェックします.
	 * @param workflowId ワークフローID
	 * @return ステータスチェック結果
	 */
	public checkStatusExist(workflowId: number): Observable<any[]> {
		let param: any = {};
		param['workFlowId'] = workflowId;
		return this.httpService.postForForm('/admin/workflow/actCheckStatusExist.jsp', param)
			.pipe(mergeMap((res: any) => {
				let data = res.value.status_exist;
				return of(this.domainService.createObjectList(data,
						(_json: any) => {
							return  _json;
						}));
		}));
	}

	/**
	 * ワークフロー情報のステータス/イベントを更新します.
	 * @param workflow ワークフロー情報
	 * @return 空のObservable
	 */
	public workflowRegist(workflow: EIMWorkflowDomain): Observable<null> {
		let params: any = {};
		params['workFlowId'] = workflow.id;
		params['workFlowXml'] = this.makeWorkflowRegistXml( workflow );

		return this.httpService.postForForm('/rest/admin/workflow/updateWorkFlowDefAdmin.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(null);
		}));
	}

	/**
	 * ワークフロー情報（ドキュメント用）のステータス/イベントを更新します.
	 * @param workflow ワークフロー情報
	 * @return 空のObservable
	 */
	public workflowRegistForDocument(workflow: EIMWorkflowDomain, updateFlag = true, newWorkflowId?: number, ): Observable<null> {
		let params: any = {};
		if ( newWorkflowId ) {
			params['workFlowId'] = newWorkflowId;
		} else {
			params['workFlowId'] = workflow.id;
		}
		params['updateFlag'] = updateFlag;
		params['workFlowDefXml'] = this.makeWorkflowRegistXmlForDocument( workflow );

		return this.httpService.postForForm('/rest/app/document/workflow/updateStatusNameAndAssigns.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(null);
		}));
	}

	/**
	 * ワークフローを削除します.
	 * @param id ワークフローID
	 * @return 空のObservable
	 */
	public delete(id: number): Observable<null> {
		return this.httpService.postForForm('/admin/workflow/actDeleteWorkFlow.jsp', {workFlowId: id})
			.pipe(mergeMap((res: any) => {
				return of(null);
		}));
	}

	/**
	 * ワークフロー（ドキュメント用）を削除します.
	 * @param params ワークフローID
	 * @return 空のObservable
	 */
	public deleteForDocument(id: number): Observable<null> {
		return this.httpService.postForForm('/rest/app/document/workflow/deleteWorkFlowDef.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(null);
		}));
	}

	/**
	 * ワークフロー（汎用）を登録します.
	 * @param params 日本語名、英語名
	 * @param namespace ネームスペース
	 * @return  ワークフロー（汎用）登録結果
	 */
	public create(nameList: any, namespace = ''): Observable<EIMWorkflowDomain> {
		let params: any = {};
		let keys = Object.keys(nameList);
		for ( let m = 0; m < keys.length; m++ ) {
			let key = keys[m];
			params['otherName' + m] = nameList[key];
			params['otherLId' + m] = key;
		}
		params['otherCnt'] = keys.length;
		params['namespace'] = namespace;

		return this.httpService.postForForm('/admin/workflow/actCreateWorkFlow.jsp', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value.workFlow;
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							let workflow: EIMWorkflowDomain = new EIMWorkflowDomain();
							workflow.id = Number(_json.attr.workFlowId);
							workflow.name = _json.attr.workFlowName;
							return workflow;
						}));
		}));
	}

	/**
	 * ワークフロー（ドキュメント）を登録します.
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー（ドキュメント）登録結果
	 */
	public createForDocument(workflow: EIMWorkflowDomain): Observable<EIMWorkflowDomain> {
		let params: any = {};
		params['workFlowDefXml'] = this.makeWorkFlowDefXmlforDocumentCreator(workflow);

		return this.httpService.postForForm('/rest/app/document/workflow/createWorkFlowDef.mvc', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							return new EIMWorkflowDomain(_json);
				}));
		}));
	}

	/**
	 * ワークフロー（汎用）を更新します.
	 * @param workflow ワワークフロー情報
	 * @return  ワワークフロー（汎用）更新結果
	 */
	public update(workflow: EIMWorkflowDomain): Observable<EIMWorkflowDomain> {
		let params: any = {};
		let keys = Object.keys(workflow.nameList);
		for ( let m = 0; m < keys.length; m++ ) {
			let key = keys[m];
			params['otherName' + m] = workflow.nameList[key];
			params['otherLId' + m] = key;
		}
		params['workFlowId'] = workflow.id;
		params['otherCnt'] = keys.length;
		params['namespace'] = workflow.namespace;

		return this.httpService.postForForm('/admin/workflow/actUpdateWorkFlow.jsp', params)
			.pipe(mergeMap((res: any) => {
				let orgWorkFlow = res.value.workFlow;
				return of(this.domainService.createObject(orgWorkFlow,
						(_json: any) => {
							let reWorkflow: EIMWorkflowDomain = new EIMWorkflowDomain();
							reWorkflow.id = Number(_json.attr.workFlowId);
							reWorkflow.name = _json.attr.workFlowName;
							return reWorkflow;
						}));
		}));
	}

	/**
	 * ワークフロー（ドキュメント）を更新します.
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー（ドキュメント）更新結果
	 */
	public updateForDocument(workflow: EIMWorkflowDomain): Observable<EIMWorkflowDomain> {
		let params: any = {};
		params['workFlowDefXml'] = this.makeWorkFlowDefXmlforDocumentUpdate(workflow);

		return this.httpService.postForForm('/rest/app/document/workflow/updateWorkFlowDef.mvc', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value;
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							return new EIMWorkflowDomain(_json);
				}));
		}));
	}


	/**
	 * ワークフロー（ドキュメント）を更新します.
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー（ドキュメント）更新結果
	 */
	public updateStatusEventForDocument(workflow: EIMWorkflowDomain): Observable<EIMWorkflowDomain> {
		let params: any = {};
		params['workFlowDefXml'] = this.makeWorkFlowDefXmlForUpdateStatusEvent(workflow);

		return this.httpService.postForForm('/rest/app/document/workflow/updateConfigurationStatus.mvc', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value;
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							return new EIMWorkflowDomain(_json);
				}));
		}));
	}

	/**
	 * ワークフローを流用作成します.
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー流用作成結果
	 */
	public copy(workflow: EIMWorkflowDomain): Observable<EIMWorkflowDomain> {
		let params: any = {};
		params['workFlowId'] = workflow.id;
		params['workFlowXml'] = this.makeWorkflowXmlForCopy( workflow );

		return this.httpService.postForForm('/rest/admin/workflow/copyWorkFlowDefAdmin.mvc', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value;
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							return new EIMWorkflowDomain(_json);
						}));
		}));
	}

	/**
	 * ワークフロー(ドキュメント)を流用作成します.
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー流用作成結果
	 */
	public copyForDocument(workflow: EIMWorkflowDomain): Observable<EIMWorkflowDomain> {
		let params: any = {};
		params['workFlowDefXml'] = this.makeWorkflowXmlForDocumentCopy( workflow );

		return this.httpService.postForForm('/rest/app/document/workflow/createWorkFlowDef.mvc', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value;
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							return new EIMWorkflowDomain(_json);
						}));
		}));
	}

	/**
	 * ワークフローをリビジョンアップします.
	 * @param params ワークフローID、ワークフロー情報
	 * @return  ワークフローリビジョンアップ結果
	 */
	public revisionUp(params: any): Observable<EIMWorkflowDomain> {
		return this.httpService.postForForm('/admin/workflow/actRevisionUp.jsp', params)
			.pipe(mergeMap((res: any) => {
				let workFlow = res.value.workFlow;
				return of(this.domainService.createObject(workFlow,
						(_json: any) => {
							let workflow: EIMWorkflowDomain = new EIMWorkflowDomain();
							workflow.id = Number(_json.attr.workFlowId);
							return workflow;
						}));
		}));
	}

	/**
	 * ワークフローリビジョンアップ情報を取得します.
	 * @param id ワークフローID
	 * @return  ワークフローリビジョンアップ情報
	 */
	public getWorkFlowForRevisionUpById(id: number): Observable<any[]> {
		let params: any = {workflowId: id};
		return this.httpService.postForForm('/admin/workflow/dspRenameRevisionUp.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value,
						(_json: any) => {
							return  _json;
						}));
		}));
	}

  /**
	 * ワークフロー最新版リストを取得します.
	 * @return ワークフロー最新版リスト
	 */
	public getLatestList(): Observable<EIMWorkflowDTO[]> {
    return this.httpService.get('/admin/workflow/dspWorkFlowTree.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.workflows.workflow,
						(_json: any) => {
							return  new EIMWorkflowDTO(_json);
						}));
			}));
	}

  /**
	 * ワークフロー設定リストを取得します.
	 * @return ワークフローの設定リスト
	 */
	public getConfList(): Observable<any[]> {
		return this.httpService.get('/rest/common/workflow/getWorkFlowConfList.mvc')
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return  _json;
					}));
		}));
	}

  /**
	 * ステータスタイプリストを取得します.
	 * @return ワークフローリスト
	 */
	public getDefaultStatusTypeList(): Observable<any[]> {
    return this.httpService.get('/admin/workflow/dspDefaultStatusTypeList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.workFlow.statusTypeList.statusType,
						(_json: any) => {
							return  _json;
						}));
			}));
	}

  /**
	 * ステータス属性リストを取得します.
	 * @param statusTypeId ステータスタイプID
	 * @return ステータス属性リスト
	 */
	public getAttributeTypeList(statusTypeId: number): Observable<EIMAttributeTypeDTO[]> {
    return this.httpService.postForForm('/admin/workflow/dspAttributeTypeList.jsp', {statusTypeId: statusTypeId}, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attTypeList.attType,
						(_json: any) => {
							return new EIMAttributeTypeDTO(_json);
						}));
			}));
	}

  /**
	 * ネームスペースリストを取得します.
	 * @return ネームスペースリスト
	 */
	public getNamespaceList(): Observable<any[]> {
    return this.httpService.get('/admin/conf/dspNamespaceXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.namespaceConf.namespaceList.namespace,
						(_json: any) => {
							return  _json;
						}));
			}));
	}

  /**
	 * ワークフローリビジョンリストを取得します.
	 * @param id ワークフローID
	 * @param groupId ワークフローグループID
	 * @return ワークフローリビジョンリスト
	 */
	public getRevisionList(id: number, groupId?: number): Observable<EIMWorkflowDTO[]> {
		let params: any = {workflowId: id};
		if (groupId) {
			params.workflowGroupId = groupId;
		}
		return this.httpService.get('/admin/workflow/dspWorkFlowRevisionList.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.workFlowList.workFlow,
						(_json: any) => {
							return  new EIMWorkflowDTO(_json);
						}));
			}));
	}

  /**
	 * ワークフローリストを取得します.
	 * @return ワークフローリスト
	 */
	public getList(): Observable<EIMWorkflowDTO[]> {
    return this.httpService.get('/admin/workflow/dspWorkFlowList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.workFlowList.workFlow,
						(_json: any) => {
							return  new EIMWorkflowDTO(_json);
						}));
			}));
	}

  /**
	 * メール種別リストを取得します.
	 * @return メール種別リスト
	 */
	public getMailTypeList(): Observable<EIMMailTypeDTO[]> {
		return this.httpService.get('/rest/common/workflow/getMailTypeList.mvc')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.mailTypeList.mailType,
						(_json: any) => {
							return  new EIMMailTypeDTO(_json);
						}));
			}));
	}

  /**
	 * XML文字をエスケープして返却します.
	 * @return エスケープ後のXML
	 */
	public escapeXML(name: string): any {
		name = name.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/'/g,'&apos;')
			.replace(/"/g,'&quot;');

		return name;
	}

	/**
	 * ワークフロー情報登録電文を作成する。
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー情報登録電文
	 */
	protected makeWorkflowRegistXml( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workflow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '">';

		// ステータスタイプ処理
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' id="' + statusType.id + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' auto="' + statusType.auto + '">';

			// nameList
			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// asEntryList
			if ( statusType.asEntryList && statusType.asEntryList.length > 0 ) {
				xml += '<asEntryList>';
				for ( let m = 0; m < statusType.asEntryList.length; m++ ) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[m].entryId + '"';
					xml += ' type="' + statusType.asEntryList[m].entryType + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList/>';
			}

			// attTypes
			xml += '<attTypes>';
			let attTypeList = workflow.statusTypeList[i].attTypeList;
			for ( let n = 0; n < attTypeList.length; n++ ) {
				xml += '<attType';
				xml += ' attTypeId="' + attTypeList[n].attTypeId + '"';
				xml += ' newCopyFlag="' + attTypeList[n].newCopyFlag + '"';
				if ( attTypeList[n].dispOrder ) {
					xml += ' dispOrder="' + attTypeList[n].dispOrder + '"/>';
				} else {
					xml += ' dispOrder=""/>';
				}
			}

			xml += '</attTypes>';

			xml += '</statusType>';
		}

		xml += '</statusTypeList>';

		// イベントタイプ処理
		xml += '<eventTypeList>';
		for ( let i = 0; i < workflow.eventTypeList.length; i++ ) {
			let eventType = workflow.eventTypeList[i];
			xml += '<eventType';
			xml += ' seq="' + eventType.sequence + '"';
			xml += ' fromStatusTypeSeq="' + eventType.fromStatusTypeSequence + '"';
			xml += ' toStatusTypeSeq="' + eventType.toStatusTypeSequence + '"';
			xml += ' baseEventTypeId="' + eventType.baseEventTypeId + '"';
			xml += ' guardConditionId="' + eventType.guardConditionId + '">';

			// nameList
			xml += '<nameList>';
			let nameList = eventType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// mailList
			let mailList = eventType.mailList;
			xml += '<mailList>';
			for ( let n = 0; n < mailList.length; n++ ) {
				xml += '<mail';
				xml += ' id="' + mailList[n].id + '"';
				xml += ' method="' + mailList[n].method + '"/>';

			}
			xml += '</mailList>';

			xml += '</eventType>';

		}

		xml += '</eventTypeList>';

		xml += '</workflow>';

		return xml;
	}

	/**
	 * ワークフロー情報登録電文を作成する。
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー情報登録電文
	 */
	protected makeWorkflowRegistXmlForDocument( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workflow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"';
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"';
		xml += ' defApproveRequest="' + (workflow.defApproveRequest === true ? 1 : 0) + '"';
		xml += ' processWaitPopup="' + (workflow.processWaitPopup === true ? 1 : 0) + '"';
		xml += ' backMail="' + (workflow.backMail === true ? 1 : 0) + '"';
		xml += ' defOcr="' + (workflow.defOcr === true ? 1 : 0) + '"';
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail === true ? 1 : 0) + '"';
		xml += ' namespace="' + workflow.namespace + '">';

		// nameList
		xml += '<nameList>';
		let nameList = workflow.nameList;
		let keys = Object.keys(nameList);
		for ( let m = 0; m < keys.length; m++ ) {
			xml += '<name';
			let key = keys[m];
			xml += ' lang="' + key + '"';
			xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
		}
		xml += '</nameList>';


		// ステータスタイプ処理
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' id="' + statusType.id + '"';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' auto="' + statusType.auto + '"';
			xml += ' through="' + statusType.through + '"';
			xml += ' enableCheckIn="' + statusType.enableCheckIn + '"';
			xml += ' defBossOnly="' + statusType.defBossOnly + '">';

			// nameList
			xml += '<nameList>';
			nameList = statusType.nameList;
			keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// asEntryList
			if ( statusType.asEntryList && statusType.asEntryList.length > 0 ) {
				xml += '<asEntryList>';
				for ( let m = 0; m < statusType.asEntryList.length; m++ ) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[m].entryId + '"';
					xml += ' type="' + statusType.asEntryList[m].entryType + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList/>';
			}
			xml += '</statusType>';
		}

		xml += '</statusTypeList>';

		// イベントタイプ処理
		xml += '<eventTypeList>';
		for ( let i = 0; i < workflow.eventTypeList.length; i++ ) {
			let eventType = workflow.eventTypeList[i];
			xml += '<eventType';
			xml += ' id="' + eventType.id + '"';
			xml += ' seq="' + eventType.sequence + '"';
			xml += ' fromStatusTypeSeq="' + eventType.fromStatusTypeSequence + '"';
			xml += ' toStatusTypeSeq="' + eventType.toStatusTypeSequence + '"';
			xml += ' fromStatusTypeId="' + eventType.fromStatusTypeId + '"';
			xml += ' toStatusTypeId="' + eventType.toStatusTypeId + '"';
			xml += ' baseEventTypeId="' + eventType.baseEventTypeId + '"';
			xml += ' skipFlag="' + eventType.skipFlag + '"';
			xml += ' guardConditionId="' + eventType.guardConditionId + '">';

			// nameList
			xml += '<nameList>';
			nameList = eventType.nameList;
			keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// mailList
			let mailList = eventType.mailList;
			xml += '<mailList>';
			for ( let n = 0; n < mailList.length; n++ ) {
				xml += '<mail';
				xml += ' id="' + mailList[n].id + '"';
				xml += ' name="' + this.escapeXML(mailList[n].name) + '"';
				xml += ' method="' + mailList[n].method + '"/>';

			}
			xml += '</mailList>';

			xml += '</eventType>';

		}

		xml += '</eventTypeList>';

		// 電子署名設定情報取得
		let pdfOutputDomain: EIMPDFOutputDomain = workflow.publishSettingInfo;
		let publicFileSecurityDomain: EIMPublicFileSecurityDomain = workflow.publishSettingInfo;
		// PDFSignature処理
		xml += '<pdfsignature';
		xml += ' doPDFConvert="' + workflow.publishSettingInfo.doPDFConvert + '"';
		xml += ' doPDFURL="' + workflow.publishSettingInfo.doPDFURL + '"';
		xml += ' doSetTerm="' + workflow.publishSettingInfo.doSetTerm + '"';
		xml += ' termNumParam="' + workflow.publishSettingInfo.termNumParam + '"';
		xml += ' termUnitParam="' + workflow.publishSettingInfo.termUnitParam + '"';
		xml += ' doSignAndSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? true : '') + '"'; // 電子署名／セキュリティ設定を行う
		xml += ' doSignPDF="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.doSignPDF : '') + '"'; // 電子署名設定　する／しない
		xml += ' insertApproveDate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveDate : '') + '"'; // 承認日付挿入
		xml += ' insertApproveUser="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveUser : '') + '"'; // 承認者名挿入
		xml += ' insertPage="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPage : '') + '"'; // 挿入ページ
		xml += ' insertPlace="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlace : '') + '"'; // 挿入位置
		xml += ' insertPlaceX="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceX : '') + '"'; // 座標X
		xml += ' insertPlaceY="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceY : '') + '"'; // 座標Y
		xml += ' approveNamelang="' + (workflow.publishSettingInfo.approveNamelang ?  pdfOutputDomain.approveNamelang : '') + '"'; // 承認者名言語(HGPScan用)
		xml += ' signJobName="' + ( workflow.publishSettingInfo.signJobName ? pdfOutputDomain.signJobName : '') + '"'; // 署名ジョブ名(HGPScan用)
		xml += ' doSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurity : '') + '"'; // セキュリティ設定　する／しない
		xml += ' doSetSecurityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurityPassword : '') + '"'; // セキュリティパスワード　ON/OFF
		xml += ' securityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.securityPassword) : '') + '"'; // セキュリティパスワード
		xml += ' doSetReferencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetReferencePassword : '') + '"'; // 参照用パスワード　ON/OFF
		xml += ' referencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.referencePassword) : '') + '"'; // 参照用パスワード
		xml += ' forbidPrint="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidPrint : '') + '"'; // 印刷を許可しない
		xml += ' forbidEdit="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidEdit : '') + '"'; // 編集を許可しない
		xml += ' forbidAnnotate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidAnnotate : '') + '"'; // 注釈追加を許可しない
		xml += ' forbidReproduce="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidReproduce : '') + '"'; // 転載を許可しない

		xml += '/>';

		// 公開通知先
		if ( workflow.publishNotifyList && workflow.publishNotifyList.length > 0 ) {
			xml += '<publishNotifyList>';
			for (let i = 0; i < workflow.publishNotifyList.length; i++ ) {
				xml += '<asEntry';
				xml += ' id="' + workflow.publishNotifyList[i].entryId + '"';
				xml += ' type="' + workflow.publishNotifyList[i].entryType + '"';
				xml += ' name="' + this.escapeXML(workflow.publishNotifyList[i].entryName) + '"/>';
			}

			xml += '</publishNotifyList>';
		} else {
			xml += '<publishNotifyList/>';
		}

		xml += '</workflow>';


		return xml;
	}


	/**
	 * ワークフロー流用作成電文を作成する。
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー流用作成電文
	 */
	protected makeWorkflowXmlforCopy( workflow: EIMWorkflowDomain ): string {
		let languages = this.localStorageService.getLanguages();
		if (!languages) {
			return;
		}
		let lang: any;

		let xml = '';
		xml += '<workflow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"';
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"';

		xml += ' defApproveRequest="' + (workflow.defApproveRequest === true ? 1 : 0) + '"';
		xml += ' processWaitPopup="' + (workflow.processWaitPopup === true ? 1 : 0) + '"';
		xml += ' backMail="' + (workflow.backMail === true ? 1 : 0) + '"';
		xml += ' defOcr="' + (workflow.defOcr === true ? 1 : 0) + '"';
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail === true ? 1 : 0) + '"';
		xml += ' nameSpace="' + workflow.namespace + '"';
		xml += ' isCreateCopy="true"';
		xml += ' originWorkflowId="' + workflow.id + '"';
		xml += ' namespace="' + workflow.namespace + '">';

		xml += '<nameList>';
		{

			for (let idx = 0; idx < languages.length; idx++) {
				lang = languages[idx];

				xml += '<name';
				xml += ' lang="' + lang.lang + '"';
				xml += ' value="' + this.escapeXML(workflow.nameList[lang.lang]) + '"/>';
			}

		}
		xml += '</nameList>';

		// ステータスタイプ処理
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' id="' + statusType.id + '"';
			xml += ' name="' + this.escapeXML(statusType.name) + '"';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' auto="' + statusType.auto + '"';
			if ( statusType.through === null ) {
				xml += ' through="">';
			} else {
				xml += ' through="' + statusType.through + '">';
			}


			// nameList
			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// asEntryList
			if ( statusType.asEntryList && statusType.asEntryList.length > 0 ) {
				xml += '<asEntryList>';
				for ( let m = 0; m < statusType.asEntryList.length; m++ ) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[m].entryId + '"';
					xml += ' type="' + statusType.asEntryList[m].entryType + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList/>';
			}

			// attTypes
			xml += '<attTypes>';
			let attTypeList = workflow.statusTypeList[i].attTypeList;
			for ( let n = 0; n < attTypeList.length; n++ ) {
				xml += '<attType';
				xml += ' attTypeId="' + attTypeList[n].attTypeId + '"';
				xml += ' newCopyFlag="' + attTypeList[n].newCopyFlag + '"';
				xml += ' dispOrder="' + attTypeList[n].dispOrder + '"/>';
			}
			xml += '</attTypes>';
			xml += '</statusType>';
		}
		xml += '</statusTypeList>';

		// イベントタイプ処理
		xml += '<eventTypeList>';
		for ( let i = 0; i < workflow.eventTypeList.length; i++ ) {
			let eventType = workflow.eventTypeList[i];
			xml += '<eventType';
			xml += ' id="' + eventType.id + '"';
			xml += ' seq="' + eventType.sequence + '"';
			xml += ' fromStatusTypeSeq="' + eventType.fromStatusTypeSequence + '"';
			xml += ' toStatusTypeSeq="' + eventType.toStatusTypeSequence + '"';
			xml += ' baseEventTypeId="' + eventType.baseEventTypeId + '"';
			xml += ' guardConditionId="' + eventType.guardConditionId + '"';
			xml += ' skipFlag="' + eventType.skipFlag + '"';
			xml += ' fromStatusTypeId="' + eventType.fromStatusTypeId + '"';
			xml += ' toStatusTypeId="' + eventType.toStatusTypeId + '">';

			// nameList
			xml += '<nameList>';
			let nameList = eventType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// mailList
			let mailList = eventType.mailList;
			xml += '<mailList>';
			for ( let n = 0; n < mailList.length; n++ ) {
				xml += '<mail';
				xml += ' id="' + mailList[n].id + '"';
				xml += ' name="' + this.escapeXML(mailList[n].name) + '"';
				xml += ' method="' + mailList[n].method + '"/>';

			}
			xml += '</mailList>';

			xml += '</eventType>';
		}
		xml += '</eventTypeList>';
		xml += '<pdfsignature/>';
		xml += '<publishNotifyList/>';

		xml += '</workflow>';

		return xml;
	}
	/**
	 * 登録用xml(ドキュメント)を作成します.
	 * @param workflow ワークフロー情報
	 * @return 登録用xml
	 */
	private makeWorkFlowDefXmlforDocumentCreator( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workFlow';
		xml += ' id=""';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"'; // 上長承認
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"'; // メール通知方法のデフォルト設定
		xml += ' defApproveRequest="' + (workflow.defApproveRequest ? '1' : '0') + '"'; // 承認依頼先のデフォルト設定
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail ? '1' : '0') + '"'; // 公開通知先のデフォルト設定
		xml += ' processWaitPopup="' + (workflow.processWaitPopup ? '1' : '0') + '"'; // 処理待ちポップアップ通知
		xml += ' backMail="' + (workflow.backMail ? '1' : '0') + '"'; // 差戻し・取消しメール通知
		xml += ' defOcr="' + (workflow.defOcr ? '1' : '0') + '"'; // OCR処理のデフォルト設定
		xml += ' nameSpace=""';
		xml += '>';

		if (workflow.nameList) {
			xml += '<nameList>';
			let keys = Object.keys(workflow.nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(workflow.nameList[key]) + '"/>';
			}
			xml += '</nameList>';
		} else {
			xml += '<nameList />';
		}

		// ステータスタイプ
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' id="' + statusType.id + '"';
			xml += ' name="' + this.escapeXML(statusType.name) + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' through="' + statusType.through + '"';
			xml += ' auto="' + statusType.auto + '">';

			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';
			xml += '<asEntryList />';
			xml += '<attTypes />';
			xml += '</statusType>';
		}
		xml += '</statusTypeList>';

		// スキップイベント
		let eventList = workflow.eventTypeList;
		if (eventList.length > 0) {
			xml += '<eventTypeList>';
			for ( let i = 0; i < eventList.length; i++ ) {
				if ( eventList[i].skipFlag ) {
					xml += '<eventType';
					xml += ' id=""';
					xml += ' seq=""';
					xml += ' fromStatusTypeSeq="' +  eventList[i].fromStatusTypeSequence + '"';
					xml += ' toStatusTypeSeq="' + eventList[i].toStatusTypeSequence + '"';
					xml += ' baseEventTypeId=""';
					xml += ' guardConditionId=""';
					xml += ' skipFlag="true"';
					xml += ' fromStatusTypeId="' + eventList[i].fromStatusTypeId + '"';
					xml += ' toStatusTypeId="' + eventList[i].toStatusTypeId + '">';
					xml += '<nameList />';
					xml += '<mailList />';
					xml += '</eventType>';
				}
			}
			xml += '</eventTypeList>';
		} else {
			xml += '<eventTypeList />';
		}

		// 公開処理設定
		// 基本設定
		xml += '<pdfsignature'
		xml += ' doPDFURL="' + workflow.publishSettingInfo.doPDFURL + '"'; // URLを挿入する
		xml += ' doPDFConvert="' + workflow.publishSettingInfo.doPDFConvert + '"'; // 公開ファイルをPDF化
		xml += ' doSetTerm="' + workflow.publishSettingInfo.doSetTerm + '"'; // 有効期限設定
		xml += ' termNumParam="' + workflow.publishSettingInfo.termNumParam + '"'; // 有効期限数
		xml += ' termUnitParam="' + workflow.publishSettingInfo.termUnitParam + '"'; // 有効期限単位

		// 電子署名設定情報取得
		let pdfOutputDomain: EIMPDFOutputDomain = workflow.publishSettingInfo;
		let publicFileSecurityDomain: EIMPublicFileSecurityDomain = workflow.publishSettingInfo;

		xml += ' doSignAndSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? true : '') + '"'; // 電子署名／セキュリティ設定を行う

		// 電子署名設定
		xml += ' doSignPDF="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.doSignPDF : '') + '"'; // 電子署名設定　する／しない
		xml += ' insertApproveDate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveDate : '') + '"'; // 承認日付挿入
		xml += ' insertApproveUser="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveUser : '') + '"'; // 承認者名挿入
		xml += ' insertPage="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPage : '') + '"'; // 挿入ページ
		xml += ' insertPlace="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlace : '') + '"'; // 挿入位置
		xml += ' insertPlaceX="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceX : '') + '"'; // 座標X
		xml += ' insertPlaceY="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceY : '') + '"'; // 座標Y
		xml += ' approveNamelang="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.approveNamelang : '') + '"'; // 電子署名用言語(HGPScan用)
		xml += ' signJobName="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.signJobName : '') + '"'; // 署名用ジョブ名(HGPScan用)

		// セキュリティ設定
		xml += ' doSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurity : '') + '"'; // セキュリティ設定　する／しない
		xml += ' doSetSecurityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurityPassword : '') + '"'; // セキュリティパスワード　ON/OFF
		xml += ' securityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.securityPassword) : '') + '"'; // セキュリティパスワード
		xml += ' doSetReferencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetReferencePassword : '') + '"'; // 参照用パスワード　ON/OFF
		xml += ' referencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.referencePassword) : '') + '"'; // 参照用パスワード
		xml += ' forbidPrint="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidPrint : '') + '"'; // 印刷を許可しない
		xml += ' forbidEdit="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidEdit : '') + '"'; // 編集を許可しない
		xml += ' forbidAnnotate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidAnnotate : '') + '"'; // 注釈追加を許可しない
		xml += ' forbidReproduce="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidReproduce : '') + '"'; // 転載を許可しない
		xml += ' />';

		// 公開通知先
		let publishNotifyEntryList = workflow.publishNotifyList;
		if (publishNotifyEntryList.length > 0) {
			xml += '<publishNotifyList>';
			for (let i = 0; i < publishNotifyEntryList.length; i++) {
				xml += '<asEntry';
				xml += ' id="' + publishNotifyEntryList[i].entryId + '"';
				xml += ' type="' + EIMAdminsConstantService.ENTRY_TYPE_EN[publishNotifyEntryList[i].entryTypeId] + '"';
				xml += ' name="' + this.escapeXML(publishNotifyEntryList[i].entryName) + '" />';
			}
			xml += '</publishNotifyList>';
		} else {
			xml += '<publishNotifyList />';
		}
		xml += '</workFlow>';

		return xml;
	}

	/**
	 * 更新xmlを作成します.
	 * @param workflow ワークフロー情報
	 * @return 更新用xml
	 */
	private makeWorkFlowDefXmlForUpdateStatusEvent( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workFlow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"'; // 上長承認
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"'; // メール通知方法のデフォルト設定
		xml += ' defApproveRequest="' + (workflow.defApproveRequest ? '1' : '0') + '"'; // 承認依頼先のデフォルト設定
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail ? '1' : '0') + '"'; // 公開通知先のデフォルト設定
		xml += ' processWaitPopup="' + (workflow.processWaitPopup ? '1' : '0') + '"'; // 処理待ちポップアップ通知
		xml += ' backMail="' + (workflow.backMail ? '1' : '0') + '"'; // 差戻し・取消しメール通知
		xml += ' defOcr="' + (workflow.defOcr ? '1' : '0') + '"'; // OCR処理のデフォルト設定
		xml += ' nameSpace=""';
		xml += '>';

		if (workflow.nameList) {
			xml += '<nameList>';
			let keys = Object.keys(workflow.nameList);
			for ( let i = 0; i < keys.length; i++ ) {
				xml += '<name';
				let key = keys[i];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(workflow.nameList[key]) + '"/>';
			}
			xml += '</nameList>';
		} else {
			xml += '<nameList />';
		}

		// ステータスタイプ
		xml += '<statusTypeList>';

		for (let i = 0; i < workflow.statusTypeList.length; i++) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' id="' + statusType.id + '"';
			xml += ' name="' + this.escapeXML(statusType.name) + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' through="' + statusType.through + '"';
			xml += ' auto="' + statusType.auto + '">';

			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for (let j = 0; j < keys.length; j++) {
				xml += '<name';
				let key = keys[j];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';
			if (statusType.asEntryList.length > 0) {
				xml += '<asEntryList>';
				for (let j = 0; j < statusType.asEntryList.length; j++) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[j].entryId + '"';
					xml += ' type="' + statusType.asEntryList[j].entryType + '"';
					xml += ' name="' + this.escapeXML(statusType.asEntryList[j].entryName) + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList />';
			}
			xml += '<attTypes />';
			xml += '</statusType>';
		}
		xml += '</statusTypeList>';

		// スキップイベント
		let eventList = workflow.eventTypeList;
		if (eventList.length > 0) {
			xml += '<eventTypeList>';
			for ( let i = 0; i < eventList.length; i++ ) {
				if ( eventList[i].skipFlag ) {
					xml += '<eventType';
					xml += ' id=""';
					xml += ' seq=""';
					xml += ' fromStatusTypeSeq="' +  eventList[i].fromStatusTypeSequence + '"';
					xml += ' toStatusTypeSeq="' + eventList[i].toStatusTypeSequence + '"';
					xml += ' baseEventTypeId=""';
					xml += ' guardConditionId=""';
					xml += ' skipFlag="true"';
					xml += ' fromStatusTypeId="' + eventList[i].fromStatusTypeId + '"';
					xml += ' toStatusTypeId="' + eventList[i].toStatusTypeId + '">';
					xml += '<nameList />';
					xml += '<mailList />';
					xml += '</eventType>';
				}
			}
			xml += '</eventTypeList>';
		} else {
			xml += '<eventTypeList />';
		}

		// 公開処理設定
		// 基本設定
		xml += '<pdfsignature'
		xml += ' doPDFURL="' + workflow.publishSettingInfo.doPDFURL + '"'; // URLを挿入する
		xml += ' doPDFConvert="' + workflow.publishSettingInfo.doPDFConvert + '"'; // 公開ファイルをPDF化
		xml += ' doSetTerm="' + workflow.publishSettingInfo.doSetTerm + '"'; // 有効期限設定
		xml += ' termNumParam="' + workflow.publishSettingInfo.termNumParam + '"'; // 有効期限数
		xml += ' termUnitParam="' + workflow.publishSettingInfo.termUnitParam + '"'; // 有効期限単位

		// 電子署名設定情報取得
		let pdfOutputDomain: EIMPDFOutputDomain = workflow.publishSettingInfo;
		let publicFileSecurityDomain: EIMPublicFileSecurityDomain = workflow.publishSettingInfo;

		// 公開処理設定
		xml += ' doSignAndSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? true : '') + '"'; // 電子署名／セキュリティ設定を行う
		// 電子署名設定
		xml += ' doSignPDF="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.doSignPDF : '') + '"'; // 電子署名設定　する／しない
		xml += ' insertApproveDate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveDate : '') + '"'; // 承認日付挿入
		xml += ' insertApproveUser="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveUser : '') + '"'; // 承認者名挿入
		xml += ' insertPage="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPage : '') + '"'; // 挿入ページ
		xml += ' insertPlace="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlace : '') + '"'; // 挿入位置
		xml += ' insertPlaceX="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceX : '') + '"'; // 座標X
		xml += ' insertPlaceY="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceY : '') + '"'; // 座標Y
		xml += ' approveNamelang="' + (workflow.publishSettingInfo.approveNamelang ? pdfOutputDomain.approveNamelang : '') + '"'; // 承認者名言語(HGPScan用)
		xml += ' signJobName="' +  (workflow.publishSettingInfo.signJobName ? pdfOutputDomain.signJobName : '') + '"'; // 署名用ジョブ名(HGPScan用)

		// セキュリティ設定
		xml += ' doSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurity : '') + '"'; // セキュリティ設定　する／しない
		xml += ' doSetSecurityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurityPassword : '') + '"'; // セキュリティパスワード　ON/OFF
		xml += ' securityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.securityPassword) : '') + '"'; // セキュリティパスワード
		xml += ' doSetReferencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetReferencePassword : '') + '"'; // 参照用パスワード　ON/OFF
		xml += ' referencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.referencePassword) : '') + '"'; // 参照用パスワード
		xml += ' forbidPrint="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidPrint : '') + '"'; // 印刷を許可しない
		xml += ' forbidEdit="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidEdit : '') + '"'; // 編集を許可しない
		xml += ' forbidAnnotate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidAnnotate : '') + '"'; // 注釈追加を許可しない
		xml += ' forbidReproduce="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidReproduce : '') + '"'; // 転載を許可しない
		xml += ' />';

		// 公開通知先
		let publishNotifyEntryList = workflow.publishNotifyList;
		if (publishNotifyEntryList.length > 0) {
			xml += '<publishNotifyList>';
			for (let i = 0; i < publishNotifyEntryList.length; i++) {
				xml += '<asEntry';
				xml += ' id="' + publishNotifyEntryList[i].entryId + '"';
				xml += ' type="' + EIMAdminsConstantService.ENTRY_TYPE_EN[publishNotifyEntryList[i].entryTypeId] + '"';
				xml += ' name="' + this.escapeXML(publishNotifyEntryList[i].entryName) + '" />';
			}
			xml += '</publishNotifyList>';
		} else {
			xml += '<publishNotifyList />';
		}
		xml += '</workFlow>';

		return xml;
	}

	/**
	 * 更新用xml(ドキュメント)を作成します.
	 * @param workflow ワークフロー情報
	 * @return 更新用xml
	 */
	private makeWorkFlowDefXmlforDocumentUpdate( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workFlow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"'; // 上長承認
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"'; // メール通知方法のデフォルト設定
		xml += ' defApproveRequest="' + (workflow.defApproveRequest ? '1' : '0') + '"'; // 承認依頼先のデフォルト設定
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail ? '1' : '0') + '"'; // 公開通知先のデフォルト設定
		xml += ' processWaitPopup="' + (workflow.processWaitPopup ? '1' : '0') + '"'; // 処理待ちポップアップ通知
		xml += ' backMail="' + (workflow.backMail ? '1' : '0') + '"'; // 差戻し・取消しメール通知
		xml += ' defOcr="' + (workflow.defOcr ? '1' : '0') + '"'; // OCR処理のデフォルト設定
		xml += ' nameSpace=""';
		xml += '>';

		if (workflow.nameList) {
			xml += '<nameList>';
			let keys = Object.keys(workflow.nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(workflow.nameList[key]) + '"/>';
			}
			xml += '</nameList>';
		} else {
			xml += '<nameList />';
		}

		// ステータスタイプ
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' id="' + statusType.id + '"';
			xml += ' name=""';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' through="' + statusType.through + '"';
			xml += ' auto="' + statusType.auto + '">';

			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';
			if (statusType.asEntryList.length > 0) {
				xml += '<asEntryList>';
				for (let j = 0; j < statusType.asEntryList.length; j++) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[j].entryId + '"';
					xml += ' type="' + statusType.asEntryList[j].entryType + '"';
					xml += ' name="' + this.escapeXML(statusType.asEntryList[j].entryName) + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList />';
			}
			xml += '<attTypes />';
			xml += '</statusType>';
		}
		xml += '</statusTypeList>';

		xml += '<eventTypeList>';
		for ( let i = 0; i < workflow.eventTypeList.length; i++ ) {
			let eventType = workflow.eventTypeList[i];
			xml += '<eventType';
			xml += ' id="' + eventType.id + '"';
			xml += ' seq="' + eventType.sequence + '"';
			xml += ' fromStatusTypeSeq="' + eventType.fromStatusTypeSequence + '"';
			xml += ' toStatusTypeSeq="' + eventType.toStatusTypeSequence + '"';
			xml += ' baseEventTypeId="' + eventType.baseEventTypeId + '"';
			xml += ' guardConditionId="' + eventType.guardConditionId + '"';
			xml += ' skipFlag="' + eventType.skipFlag + '"';
			xml += ' fromStatusTypeId="' + eventType.fromStatusTypeId + '"';
			xml += ' toStatusTypeId="' + eventType.toStatusTypeId + '">';

			// nameList
			xml += '<nameList>';
			let nameList = eventType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// mailList
			let mailList = eventType.mailList;
			xml += '<mailList>';
			for ( let n = 0; n < mailList.length; n++ ) {
				xml += '<mail';
				xml += ' id="' + mailList[n].id + '"';
				xml += ' name="' + this.escapeXML(mailList[n].name) + '"';
				xml += ' method="' + mailList[n].method + '"/>';

			}
			xml += '</mailList>';

			xml += '</eventType>';
		}
		xml += '</eventTypeList>';
		// 公開処理設定
		// 基本設定
		xml += '<pdfsignature'
		xml += ' doPDFURL="' + workflow.publishSettingInfo.doPDFURL + '"'; // URLを挿入する
		xml += ' doPDFConvert="' + workflow.publishSettingInfo.doPDFConvert + '"'; // 公開ファイルをPDF化
		xml += ' doSetTerm="' + workflow.publishSettingInfo.doSetTerm + '"'; // 有効期限設定
		if ( workflow.publishSettingInfo.termNumParam || workflow.publishSettingInfo.termNumParam === '0' ) {
			xml += ' termNumParam="' + workflow.publishSettingInfo.termNumParam + '"'; // 有効期限数
		} else {
			xml += ' termNumParam=""'; // 有効期限数
		}
		xml += ' termUnitParam="' + workflow.publishSettingInfo.termUnitParam + '"'; // 有効期限単位

		let doSignAndSetSecurity = false;

		// 電子署名設定情報取得
		let pdfOutputDomain: EIMPDFOutputDomain = workflow.publishSettingInfo;
		let publicFileSecurityDomain: EIMPublicFileSecurityDomain = workflow.publishSettingInfo;

		xml += ' doSignAndSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? true : '') + '"'; // 電子署名／セキュリティ設定を行う

		// 電子署名設定
		xml += ' doSignPDF="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.doSignPDF : '') + '"'; // 電子署名設定　する／しない
		xml += ' insertApproveDate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveDate : '') + '"'; // 承認日付挿入
		xml += ' insertApproveUser="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveUser : '') + '"'; // 承認者名挿入
		xml += ' insertPage="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPage : '') + '"'; // 挿入ページ
		xml += ' insertPlace="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlace : '') + '"'; // 挿入位置
		xml += ' insertPlaceX="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceX : '') + '"'; // 座標X
		xml += ' insertPlaceY="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceY : '') + '"'; // 座標Y
		xml += ' approveNamelang="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.approveNamelang : '') + '"'; // 電子署名用言語(HGPScan用)
		xml += ' signJobName="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.signJobName : '') + '"'; // 署名用ジョブ名(HGPScan用)

		// セキュリティ設定
		xml += ' doSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurity : '') + '"'; // セキュリティ設定　する／しない
		xml += ' doSetSecurityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurityPassword : '') + '"'; // セキュリティパスワード　ON/OFF
		xml += ' securityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.securityPassword) : '') + '"'; // セキュリティパスワード
		xml += ' doSetReferencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetReferencePassword : '') + '"'; // 参照用パスワード　ON/OFF
		xml += ' referencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.referencePassword) : '') + '"'; // 参照用パスワード
		xml += ' forbidPrint="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidPrint : '') + '"'; // 印刷を許可しない
		xml += ' forbidEdit="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidEdit : '') + '"'; // 編集を許可しない
		xml += ' forbidAnnotate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidAnnotate : '') + '"'; // 注釈追加を許可しない
		xml += ' forbidReproduce="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidReproduce : '') + '"'; // 転載を許可しない
		xml += ' />';

		// 公開通知先
		let publishNotifyEntryList = workflow.publishNotifyList;

		if (publishNotifyEntryList.length > 0) {
			xml += '<publishNotifyList>';
			for (let i = 0; i < publishNotifyEntryList.length; i++) {
				xml += '<asEntry';
				xml += ' id="' + publishNotifyEntryList[i].entryId + '"';
				xml += ' type="' + EIMAdminsConstantService.ENTRY_TYPE_EN[publishNotifyEntryList[i].entryTypeId] + '"';
				xml += ' name="' + this.escapeXML(publishNotifyEntryList[i].entryName) + '" />';
			}
			xml += '</publishNotifyList>';
		} else {
			xml += '<publishNotifyList />';
		}
		xml += '</workFlow>';

		return xml;
	}

	/**
	 * ワークフロー流用作成電文を作成する。
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー流用作成電文
	 */
	protected makeWorkflowXmlForCopy( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workflow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"';
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"';

		xml += ' defApproveRequest="' + (workflow.defApproveRequest === true ? 1 : 0) + '"';
		xml += ' processWaitPopup="' + (workflow.processWaitPopup === true ? 1 : 0) + '"';
		xml += ' backMail="' + (workflow.backMail === true ? 1 : 0) + '"';
		xml += ' defOcr="' + (workflow.defOcr === true ? 1 : 0) + '"';
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail === true ? 1 : 0) + '"';
		xml += ' nameSpace="' + workflow.namespace + '"';
		xml += ' isCreateCopy="true"';
		xml += ' originWorkflowId="' + workflow.id + '"';
		xml += ' namespace="' + workflow.namespace + '">';

		xml += '<nameList>';
		{
			let keys = Object.keys(workflow.nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(workflow.nameList[key]) + '"/>';
			}
		}
		xml += '</nameList>';

		// ステータスタイプ処理
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' id="' + statusType.id + '"';
			xml += ' name="' + this.escapeXML(statusType.name) + '"';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' auto="' + statusType.auto + '"';
			if ( statusType.through === null ) {
				xml += ' through="">';
			} else {
				xml += ' through="' + statusType.through + '">';
			}


			// nameList
			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// asEntryList
			if ( statusType.asEntryList && statusType.asEntryList.length > 0 ) {
				xml += '<asEntryList>';
				for ( let m = 0; m < statusType.asEntryList.length; m++ ) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[m].entryId + '"';
					xml += ' type="' + statusType.asEntryList[m].entryType + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList/>';
			}

			// attTypes
			xml += '<attTypes>';
			let attTypeList = workflow.statusTypeList[i].attTypeList;
			for ( let n = 0; n < attTypeList.length; n++ ) {
				xml += '<attType';
				xml += ' attTypeId="' + attTypeList[n].attTypeId + '"';
					xml += ' newCopyFlag="' + attTypeList[n].newCopyFlag + '"';
					xml += ' dispOrder="' + attTypeList[n].dispOrder + '"/>';
			}
			xml += '</attTypes>';
			xml += '</statusType>';
		}
		xml += '</statusTypeList>';

		// イベントタイプ処理
		xml += '<eventTypeList>';
		for ( let i = 0; i < workflow.eventTypeList.length; i++ ) {
			let eventType = workflow.eventTypeList[i];
			xml += '<eventType';
			xml += ' id="' + eventType.id + '"';
			xml += ' seq="' + eventType.sequence + '"';
			xml += ' fromStatusTypeSeq="' + eventType.fromStatusTypeSequence + '"';
			xml += ' toStatusTypeSeq="' + eventType.toStatusTypeSequence + '"';
			xml += ' baseEventTypeId="' + eventType.baseEventTypeId + '"';
			xml += ' guardConditionId="' + eventType.guardConditionId + '"';
			xml += ' skipFlag="' + eventType.skipFlag + '"';
			xml += ' fromStatusTypeId="' + eventType.fromStatusTypeId + '"';
			xml += ' toStatusTypeId="' + eventType.toStatusTypeId + '">';

			// nameList
			xml += '<nameList>';
			let nameList = eventType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// mailList
			let mailList = eventType.mailList;
			xml += '<mailList>';
			for ( let n = 0; n < mailList.length; n++ ) {
				xml += '<mail';
				xml += ' id="' + mailList[n].id + '"';
				xml += ' name="' + this.escapeXML(mailList[n].name) + '"';
				xml += ' method="' + mailList[n].method + '"/>';

			}
			xml += '</mailList>';

			xml += '</eventType>';
		}
		xml += '</eventTypeList>';
		xml += '<pdfsignature/>';
		xml += '<publishNotifyList/>';

		xml += '</workflow>';

		return xml;
	}

	/**
	 * ワークフロー流用作成電文(ドキュメント)を作成する。
	 * @param workflow ワークフロー情報
	 * @return  ワークフロー流用作成電文
	 */
	protected makeWorkflowXmlForDocumentCopy( workflow: EIMWorkflowDomain ): string {
		let xml = '';
		xml += '<workflow';
		xml += ' id="' + workflow.id + '"';
		xml += ' name="' + this.escapeXML(workflow.name) + '"';
		xml += ' defBossApproval="' + workflow.defBossApproval + '"';
		xml += ' defNotifyMail="' + workflow.defNotifyMail + '"';
		xml += ' defApproveRequest="' + (workflow.defApproveRequest === true ? 1 : 0) + '"';
		xml += ' publishNotifyMail="' + (workflow.publishNotifyMail === true ? 1 : 0) + '"';
		xml += ' processWaitPopup="' + (workflow.processWaitPopup === true ? 1 : 0) + '"';
		xml += ' backMail="' + (workflow.backMail === true ? 1 : 0) + '"';
		xml += ' defOcr="' + (workflow.defOcr === true ? 1 : 0) + '"';
		xml += ' nameSpace="' + workflow.namespace + '"';
		xml += ' isCreateCopy="true"';
		xml += ' originWorkflowId="' + workflow.id + '"';
		xml += ' namespace="' + workflow.namespace + '">';

		xml += '<nameList>';
		{
			let keys = Object.keys(workflow.nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(workflow.nameList[key]) + '"/>';
			}
		}
		xml += '</nameList>';

		// ステータスタイプ処理
		xml += '<statusTypeList>';

		for ( let i = 0; i < workflow.statusTypeList.length; i++ ) {
			let statusType = workflow.statusTypeList[i];
			xml += '<statusType';
			xml += ' id="' + statusType.id + '"';
			xml += ' name="' + this.escapeXML(statusType.name) + '"';
			xml += ' seq="' + statusType.seq + '"';
			xml += ' kind="' + statusType.kind + '"';
			xml += ' auto="' + statusType.auto + '"';
			if ( statusType.through === null ) {
				xml += ' through="">';
			} else {
				xml += ' through="' + statusType.through + '">';
			}

			// nameList
			xml += '<nameList>';
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// asEntryList
			if ( statusType.asEntryList && statusType.asEntryList.length > 0 ) {
				xml += '<asEntryList>';
				for ( let m = 0; m < statusType.asEntryList.length; m++ ) {
					xml += '<asEntry';
					xml += ' id="' + statusType.asEntryList[m].entryId + '"';
					xml += ' type="' + statusType.asEntryList[m].entryType + '"/>';
					xml += ' name="' + this.escapeXML(statusType.asEntryList[m].entryName) + '"/>';
				}
				xml += '</asEntryList>';
			} else {
				xml += '<asEntryList/>';
			}

			// attTypes
			let attTypeList = workflow.statusTypeList[i].attTypeList;
			if ( attTypeList && attTypeList.length > 0 ) {
				xml += '<attTypes>';
				for ( let n = 0; n < attTypeList.length; n++ ) {
					xml += '<attType';
					xml += ' attTypeId="' + attTypeList[n].attTypeId + '"';
					xml += ' newCopyFlag=""';
					xml += ' dispOrder=""/>';
				}
				xml += '</attTypes>';
			} else {
				xml += '<attTypes/>';
			}

			//
			xml += '</statusType>';
		}
		xml += '</statusTypeList>';

		// イベントタイプ処理
		xml += '<eventTypeList>';
		for ( let i = 0; i < workflow.eventTypeList.length; i++ ) {
			let eventType = workflow.eventTypeList[i];
			xml += '<eventType';
			xml += ' id="' + eventType.id + '"';
			xml += ' seq="' + eventType.sequence + '"';
			xml += ' fromStatusTypeSeq="' + eventType.fromStatusTypeSequence + '"';
			xml += ' toStatusTypeSeq="' + eventType.toStatusTypeSequence + '"';
			xml += ' baseEventTypeId="' + eventType.baseEventTypeId + '"';
			xml += ' guardConditionId="' + eventType.guardConditionId + '"';
			xml += ' skipFlag="' + eventType.skipFlag + '"';
			xml += ' fromStatusTypeId="' + eventType.fromStatusTypeId + '"';
			xml += ' toStatusTypeId="' + eventType.toStatusTypeId + '">';

			// nameList
			xml += '<nameList>';
			let nameList = eventType.nameList;
			let keys = Object.keys(nameList);
			for ( let m = 0; m < keys.length; m++ ) {
				xml += '<name';
				let key = keys[m];
				xml += ' lang="' + key + '"';
				xml += ' value="' + this.escapeXML(nameList[key]) + '"/>';
			}
			xml += '</nameList>';

			// mailList
			let mailList = eventType.mailList;
			xml += '<mailList>';
			for ( let n = 0; n < mailList.length; n++ ) {
				xml += '<mail';
				xml += ' id="' + mailList[n].id + '"';
				xml += ' name="' + this.escapeXML(mailList[n].name) + '"';
				xml += ' method="' + mailList[n].method + '"/>';

			}
			xml += '</mailList>';

			xml += '</eventType>';
		}
		xml += '</eventTypeList>';

		// 電子署名設定情報取得
		let pdfOutputDomain: EIMPDFOutputDomain = workflow.publishSettingInfo;
		let publicFileSecurityDomain: EIMPublicFileSecurityDomain = workflow.publishSettingInfo;
		//
		// PDFSignature処理
		xml += '<pdfsignature';
		xml += ' doPDFConvert="' + workflow.publishSettingInfo.doPDFConvert + '"';
		xml += ' doPDFURL="' + workflow.publishSettingInfo.doPDFURL + '"';
		xml += ' doSetTerm="' + workflow.publishSettingInfo.doSetTerm + '"';
		xml += ' termNumParam="' + workflow.publishSettingInfo.termNumParam + '"';
		xml += ' termUnitParam="' + workflow.publishSettingInfo.termUnitParam + '"';
		xml += ' doSignAndSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? true : '') + '"'; // 電子署名／セキュリティ設定を行う
		xml += ' doSignPDF="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.doSignPDF : '') + '"'; // 電子署名設定　する／しない
		xml += ' insertApproveDate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveDate : '') + '"'; // 承認日付挿入
		xml += ' insertApproveUser="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertApproveUser : '') + '"'; // 承認者名挿入
		xml += ' insertPage="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPage : '') + '"'; // 挿入ページ
		xml += ' insertPlace="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlace : '') + '"'; // 挿入位置
		xml += ' insertPlaceX="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceX : '') + '"'; // 座標X
		xml += ' insertPlaceY="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? pdfOutputDomain.insertPlaceY : '') + '"'; // 座標Y
		xml += ' approveNamelang="' + (workflow.publishSettingInfo.approveNamelang ? pdfOutputDomain.approveNamelang : '') + '"'; // 承認者名言語(HGPScan用)
		xml += ' signJobName="' + (workflow.publishSettingInfo.signJobName ? pdfOutputDomain.approveNamelang : '') + '"'; // 署名用ジョブ名(HGPScan用)
		xml += ' doSetSecurity="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurity : '') + '"'; // セキュリティ設定　する／しない
		xml += ' doSetSecurityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetSecurityPassword : '') + '"'; // セキュリティパスワード　ON/OFF
		xml += ' securityPassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.securityPassword) : '') + '"'; // セキュリティパスワード
		xml += ' doSetReferencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.doSetReferencePassword : '') + '"'; // 参照用パスワード　ON/OFF
		xml += ' referencePassword="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? this.escapeXML(publicFileSecurityDomain.referencePassword) : '') + '"'; // 参照用パスワード
		xml += ' forbidPrint="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidPrint : '') + '"'; // 印刷を許可しない
		xml += ' forbidEdit="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidEdit : '') + '"'; // 編集を許可しない
		xml += ' forbidAnnotate="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidAnnotate : '') + '"'; // 注釈追加を許可しない
		xml += ' forbidReproduce="' + (workflow.publishSettingInfo.doSignPDFAndSetSecurity ? publicFileSecurityDomain.forbidReproduce : '') + '"'; // 転載を許可しない

		xml += '/>';

		//
		// 公開通知先
		if ( workflow.publishNotifyList && workflow.publishNotifyList.length > 0 ) {
			xml += '<publishNotifyList>';
			for (let i = 0; i < workflow.publishNotifyList.length; i++ ) {
				xml += '<asEntry';
				xml += ' id="' + workflow.publishNotifyList[i].entryId + '"';
				xml += ' type="' + workflow.publishNotifyList[i].entryType + '"';
				xml += ' name="' + this.escapeXML(workflow.publishNotifyList[i].entryName) + '"/>';
			}

			xml += '</publishNotifyList>';
		} else {
			xml += '<publishNotifyList/>';
		}

		xml += '</workflow>';

		return xml;
	}


}
