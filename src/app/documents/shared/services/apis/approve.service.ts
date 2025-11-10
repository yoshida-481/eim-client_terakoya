import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMEntry, EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMApproveDocumentDTO } from 'app/documents/shared/dtos/approve-document.dto';
import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * 承認APIサービス.
 */
@Injectable()
export class EIMApproveService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected entryService: EIMDocumentsEntryService) {

	}

	/**
	 * 承認依頼用オブジェクト情報を取得します.
	 * @param contentsId 取得対象のコンテンツID
	 * @param fromView どの画面から来たか(approve/)
	 * @return 承認依頼用オブジェクト情報
	 */
	public getByContentsId(contentsId: number, fromView: string): Observable<EIMApproveDocumentDTO> {
		return this.httpService.get('/app/document/approve/dspProperty.jsp',
				{objId: contentsId, fromView: fromView})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObject(res.value.object,
						(_json: any) => {
							return this.convertToAppoveRequestDocument(_json);
						}));
			}));
	}

	/**
	 * 承認依頼先を取得します.
	 * @param objId ドキュメントのオブジェクトId
	 * @param selectedCheckBox 上長のみチェックボックス初期表示設定
	 * @param statusTypeId ステータスタイプId
	 */
	public getApproverList(objId: number, selectedCheckBox: number, statusTypeId: number): Observable<any[]> {

		let params: any = {};
		params['objId'] = objId;
		params['selectedCheckBox'] = selectedCheckBox;
		params['statusTypeId'] = statusTypeId;
		return this.httpService.postForForm('/app/document/approve/dspApprover.jsp', params)
			.pipe(mergeMap((res: any) => {
				let isBoss = res.value.approverInfo.onlyBoss.attr.flag === 'true' ? true : false;
				let approvers: any = {
					isBoss: isBoss,
					users: this.jsonService.getJsonChildren(res.value.approverInfo.userList.user, this.convertToApprover)
				};
				return of(approvers);
			}));
	}

	/**
	 * ステータス通過条件を取得します.
	 * @param statusTypeId ステータスタイプId
	 */
	public getApproverThroughTerm(statusTypeId: number): Observable<any> {
		let params: any = {};
		params['StatusTypeId'] = statusTypeId;
		return this.httpService.postForForm('/app/document/approve/dspApproveThroughTerm.jsp', params)
						.pipe(mergeMap((res: any) => {
				let json: any = {};
						json.through = res.value.object.attr.through;
						return of(json);
			}));
	}

	/**
	 * 承認用オブジェクト情報リストを取得します.
	 * @param contentsId 取得対象のコンテンツID
	 * @return 承認用オブジェクト情報
	 */
	public getListByContentsId(contentsId: number): Observable<EIMApproveDocumentDTO[]> {
		return this.httpService.get('/app/document/approve/dspApproveDocumentList.jsp',
				{objId: contentsId})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objList.object,
						(_json: any) => {
							return new EIMApproveDocumentDTO(_json);
						}));
			}));
	}

	/**
	 * ログインユーザが承認対象のドキュメント情報リストを取得します.
	 * @return 承認ドキュメント情報
	 */
	public getList(): Observable<EIMApproveDocumentDTO[]> {
		return this.httpService.get('/app/document/approve/dspApproveDocumentList.jsp',
				{})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objList.object,
						(_json: any) => {
							return  new EIMApproveDocumentDTO(_json);
						}));
			}));
	}

	/**
	 * PDF出力設定を取得します.
	 * @param id オブジェクトID
	 * @param parentWin 呼び出し元画面
	 * @param document 編集済みデータ
	 * @return Observable
	 */
	public getPdfOutput(id: number, parentWin: string, document: EIMApproveDocumentDTO): Observable<EIMPDFOutputDomain> {
		if (document.localPDFOutputSet) {
			// 既にデータ編集済みの場合はdocumentから取得
			let pdfOutput: EIMPDFOutputDomain = new EIMPDFOutputDomain(document);
			pdfOutput['localPDFOutputSet'] = document.localPDFOutputSet;
			// 編集済みであることを示すパラメータを独自に追加する
			pdfOutput['edited'] = true;
			return of(pdfOutput);
		} else {
			return this.httpService.get('/app/document/approve/dspSetPDFOutput.jsp', {objId: id , parentWin: parentWin})
				.pipe(mergeMap((res: any) => {
					return of(this.domainService.createObject(res.value.setPDFOutput.attr,
						(_json: any) => {
							return new EIMPDFOutputDomain(_json);
						}));

				}));
		}
	}

	/**
	 * 公開ファイルセキュリティ情報を取得します.
	 * @param objId ドキュメントのオブジェクトID
	 * @return 公開ファイルセキュリティ情報
	 */
	public getPublicFileSecurity(objId: number): Observable<EIMPublicFileSecurityDomain> {
		return this.httpService.get('/app/document/publish/dspSetPublicFileSecurity.jsp', {objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObject(res.value.publishFileSecurity.attr,
					(_json: any) => {

						let domain: EIMPublicFileSecurityDomain = new EIMPublicFileSecurityDomain(_json);
						domain.objId = objId;
						return domain;
					}));

			}));
	}

	/**
	 * 公開ファイルセキュリティを設定します.
	 * @param publicFileSecurity 公開ファイルセキュリティ情報
	 * @return Observable
	 */
	public setPublicFileSecurity(publicFileSecurity: EIMPublicFileSecurityDomain): Observable<any> {
		return this.httpService.get('/app/document/publish/actSetPublicFileSecurity.jsp', publicFileSecurity)
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * 承認依頼者DTOに変換します.
	 * @param targets 変換対象
	 * @return 承認依頼者DTOリスト
	 */
	private convertToApprover(target: any): EIMEntryUserDTO {
		let user: EIMEntryUserDTO = new EIMEntryUserDTO();
		user.id = target.attr.userId;
		user.name = target.attr.userName;
		user.code = target.attr.userCode;
		user.kana = target.attr.userKana;
		user.roleNames = target.attr.roleName;
		user.groupNames = target.attr.groupName;
		user.isBoss = target.attr.bossFlag === 'true' ? true : false;
		return user;
	}

	/**
	 * 承認依頼対象ドキュメントに変換します.
	 * @param _json 変換対象
	 * @return 公開対象ドキュメントリスト
	 */
	private convertToAppoveRequestDocument(_json: any): EIMApproveDocumentDTO {
		let approveDocumentDTO = new EIMApproveDocumentDTO(_json);
		for (let i = 0; i < approveDocumentDTO.destination.length; i++) {
			approveDocumentDTO.destination[i].entryTypeName = this.entryService.getEntryTypeName(approveDocumentDTO.destination[i].entryTypeId);
		}
		return approveDocumentDTO;
	}

}
