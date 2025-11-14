import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMEntry } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';

/**
 * 承認ドキュメントDTO
 */
export class EIMApproveDocumentDTO {

	/** オブジェクトナンバー */
	public objId: number;

	/** オブジェクト名称 */
	public objTypeId: number;

	/** オブジェクトタイプナンバー */
	public objTypeName: string;

	/** オブジェクトタイプ名称 */
	public objName: string;

	/** リビジョン */
	public revision: number;

	/** 最新判定 */
	public latest: boolean;

	/** 通知先 */
	public notificationType: number;

	/** セキュリティナンバー */
	public securityId: number;

	/** 作成者名 */
	public createUserName: string;

	/** 作成データ */
	public createDate: string;

	/** 変更者名 */
	public modifyUserName: string;

	/** 変更日 */
	public modifyDate: string;

	/** 変更日時 */
	public modifyDateTime: number;

	/** ドキュメント判定 */
	public isDocument: boolean;

	/**  */
	public order: number;

	/** ドキュメントまでのフルパス（ドキュメント含む） */
	public fullPath: string;

	/** ステータスナンバー */
	public statusId: number;

	/** ステータタイプスナンバー */
	public statusTypeId: number;

	/** ステータスタイプ名 */
	public statusTypeName: string;

	/** ステップナンバー */
	public step: number;

	/** ワークフローナンバー */
	public workFlowId: number;

	/** ワークフロー名 */
	public workFlowName: string;

	/** ワークフロー最終承認判定 */
	public lastEventFlag: boolean;

	/** 遷移先ステータスID */
	public forcastStatusTypeId: number;

	/** 遷移前ステータス更新日 */
	public statusMDateLong: number;

	/** 公開通知先名 */
	public publisherName: string;

	/** 公開通知先ナンバー */
	public publisherId: string;

	/** メール通知のタイミング */
	public immediate: string;

	/** 受信確認フラグ */
	public reply: number;

	/** コメント */
	public comment: string;

	/** 遷移先ステータスが公開か判定  */
	public statusKind: number;

	/** 承認ステータス  */
	public through: number;

	/** 有効期限切れ判定  */
	public expiration: boolean;

	/** 更新者の活性・非活性判定フラグ  */
	public enableFlag: boolean;

	/** ドキュメントまでのパス（ドキュメント含む）  */
	public path: string;

	/** 署名・暗号化状態  */
	public signencr: number;

	/** 部分承認判定  */
	public isPartialApproval: boolean;

	/** PDF変換対象  */
	public isChangePDF: number;

	/** 公開PDF事前登録済フラグ */
	public isPdfPreRegistered: boolean;

	/** 差戻しメール通知フラグ  */
	public sendingBackAndRegainingMail: number;

	/** メール送信タイミング */
	public timing: number;

	/** 依頼者名 */
	public requestUserName: string;

	/** 依頼日 */
	public requestDate: string;

	/** 依頼日時 */
	public requestDateLong: number;

	/** 公開通知タイミング */
	public sendNotifyMailTiming: number;

	/** メール通知なし */
	public nothingMailTypeId: number;

	/** メール送信可否 */
	public baseEventTypeId: number;

	/** メール通知即時 */
	public immediateMailTypeId: number;

	/** ステータスリスト */
	public statusList: EIMApproveStatusDTO[];

	/** 公開通知先 */
	public destination: EIMEntry[];

	/** 承認依頼先 */
	public currentApprover: EIMEntryUserDTO[] = [];

	/** PDF変換オプション */
	public localPDFOutputSet: boolean;

	// 以下クライアントでの設定値のためコンストラクタでの初期化は不要
	/** 処理タイプ */
	public functionType: string;

	/** 選択変更時用一時処理タイプ */
	public tmpFunctionType: string;

	/** 選択変更時用一時処理タイプ */
	public tmpStatusTypeId: number;

	/** 承認者不要フラグ */
	public noApprover: boolean;

	/** WF付きフォルダフラグ */
	public isWorkflowFolder: string;

	/** 電子署名設定有無 */
	public doSignPDF: string;

	/** セキュリティ設定有無 */
	public doSetSecurity: string;

	/** 電子署名・セキュリティ設定有無 */
	public doSignPDFAndSetSecurity: string;

	/** 承認日付挿入 */
	public insertApproveDate: string;

	/** 承認者名挿入 */
	public insertApproveUser: string;

	/** 挿入ページ */
	public insertPage: string;

	/** 挿入位置 */
	public insertPlace: string;

	/** 挿入位置 (基準点からX) */
	public insertPlaceX: string;

	/** 挿入位置 (基準点からY) */
	public insertPlaceY: string;

	/** セキュリティパスワード設定 */
	public doSetSecurityPassword: string;

	/** セキュリティパスワード */
	public securityPassword: string;

	/** 参照用パスワード設定 */
	public doSetReferencePassword: string;

	/** 参照用パスワード */
	public referencePassword: string;

	/** 印刷を許可しない */
	public forbidPrint: string;

	/** 編集を許可しない */
	public forbidEdit: string;

	/** 注釈追加を許可しない */
	public forbidAnnotate: string;

	/** 転載を許可しない */
	public forbidReproduce: string;

	/** 公開通知コメント */
	public publicComment: string;

	constructor(json?: any) {

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.objId = Number(json.attr.objId);
		this.objTypeId = Number(json.attr.objTypeId);
		this.objTypeName = json.attr.objTypeName;
		this.objName = json.attr.objName;
		this.revision = Number(json.attr.rev);
		this.latest = json.attr.latest === 'true' ? true : false;
		this.securityId = Number(json.attr.securityId);
		this.createUserName = json.attr.createUserName;
		this.createDate = json.attr.createDate;
		this.modifyUserName = json.attr.modifyUserName;
		this.modifyDate = json.attr.modifyDate;
		this.modifyDateTime = json.attr.modifyDateTime;
		this.isDocument = json.attr.isDocument === 'true' ? true : false;
		this.order = Number(json.attr.order);
		this.fullPath = json.attr.fullPath;
		this.statusId = Number(json.attr.statusId);
		this.statusTypeId = Number(json.attr.statusTypeId);
		this.statusTypeName = json.attr.statusTypeName;
		this.step = Number(json.attr.step);
		this.workFlowId = Number(json.attr.workFlowId);
		this.workFlowName = json.attr.workFlowName;
		this.lastEventFlag = json.attr.lastEventFlag === 'true' ? true : false;
		this.forcastStatusTypeId = Number(json.attr.forcastStatusTypeId);
		this.statusMDateLong = Number(json.attr.statusMDateLong);
		this.publisherName = json.attr.publisherName;
		this.publisherId = json.attr.publisherId;
		this.immediate = json.attr.immediate;
		// 通知タイプ
		let notificationType = -1;
		switch (json.attr.immediate) {
			case 'immediate':
				notificationType = 0;
				break;
			case 'scheduled':
				notificationType = 1;
				break;
			case 'off':
				notificationType = 2;
				break;
			default:
		}
		this.notificationType = notificationType;
		this.reply = Number(json.attr.reply);
		this.comment = json.attr.comment;
		this.statusKind = Number(json.attr.statusKind);
		this.through = Number(json.attr.through);
		this.expiration = json.attr.expiration === 'true' ? true : false;
		this.enableFlag = json.attr.enableFlag === 'true' ? true : false;
		this.path = json.attr.path;
		this.signencr = Number(json.attr.signencr);
		this.isPartialApproval = json.attr.isPartialApproval === 'true' ? true : false;
		this.isChangePDF = Number(json.attr.isChangePDF);
		this.isPdfPreRegistered = json.attr.isPdfPreRegistered === 'true' ? true : false;
		this.sendingBackAndRegainingMail = Number(json.attr.sendingBackAndRegainingMail);
		this.timing = Number(json.attr.timing);
		this.requestUserName = json.attr.requestUserName;
		this.requestDate = json.attr.requestDate;
		this.requestDateLong = Number(json.attr.requestDateLong);
		// 公開通知タイプ
		let sendNotifyMailTiming = undefined;
		switch (json.attr.immediatePublic) {
			case 'immediate':
				sendNotifyMailTiming = 0;
				break;
			case 'scheduled':
				sendNotifyMailTiming = 1;
				break;
			case 'off':
				sendNotifyMailTiming = 2;
				break;
			default:
		}
		this.sendNotifyMailTiming = sendNotifyMailTiming;
		this.nothingMailTypeId = Number(json.attr.nothingMailTypeId);
		this.baseEventTypeId = Number(json.attr.baseEventTypeId);
		this.immediateMailTypeId = Number(json.attr.immediateMailTypeId);
		this.localPDFOutputSet = false;
		this.publicComment = json.attr.publicComment;
		// 遷移先ステータスリスト生成
		let statusList: EIMApproveStatusDTO[] = [];
		if (json.statusList != null && json.statusList.status != null) {
			statusList = domainService.createObjectList(json.statusList.status,
					(_json: any) => {
						return new EIMApproveStatusDTO(_json);
					});
		}
		this.statusList = statusList;
		if (statusList.length > 0 && statusList[0].approver != null) {
			this.currentApprover = statusList[0].approver;
		}
		// 公開通知先リスト生成
		let destinations: EIMEntry[] = [];
		let publisherIds: string[] = [];
		if (json.attr.publisherId != null && json.attr.publisherId.length > 0) {
			publisherIds = (json.attr.publisherId).split(',');
		}
		let publisherNames: string[] = [];
		if (json.attr.publisherName != null && json.attr.publisherName.length > 0) {
			publisherNames = (json.attr.publisherName).split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
		}

		if (publisherIds.length > 0 && publisherNames.length > 0) {
			for (let i = 0; i < publisherIds.length; i++) {

				let publisherIdElements: string[] = publisherIds[i].split(':');
				publisherNames[i] = publisherNames[i].slice(1).slice(0 ,-1).replace( /""/g, '"' );
			
				let destination: EIMEntry = {
					entryId: Number(publisherIdElements[1]),
					entryName: publisherNames[i],
					entryTypeId: Number(publisherIdElements[0]),
					// entryTypeName: this.entryService.getEntryTypeName(Number(publisherIdElements[0])),
				}
				switch (destination.entryTypeId) {
					case 1:
					destination.entryTypeName = 'ユーザ';
						break;
					case 2:
					destination.entryTypeName = 'グループ';
						break;
					case 3:
					destination.entryTypeName = 'ロール';
						break;
					case 4:
					destination.entryTypeName = '複合グループ';
						break;
					default:
				}

				destinations.push(destination);
			}
		}
		this.destination = destinations;
	}

	/**
	 * 承認情報コピー貼り付け用.
	 * @ return EIMApproveDocumentDTO
	 */
	public makeCopy(): EIMApproveDocumentDTO {
		let copyDTO = new EIMApproveDocumentDTO();
		copyDTO.comment = this.comment;
		copyDTO.publicComment = this.publicComment;
		copyDTO.sendNotifyMailTiming = this.sendNotifyMailTiming;
		copyDTO.notificationType = this.notificationType;
		copyDTO.isDocument = this.isDocument;
		copyDTO.statusList = [];
		for (let i = 0; i < this.statusList.length; i++) {
			copyDTO.statusList.push(this.statusList[i].makeStatusClone());
		}
		copyDTO.currentApprover = [];
		for (let i = 0; i < this.currentApprover.length; i++) {
			copyDTO.currentApprover.push(this.currentApprover[i].makeEntryUserClone());
		}
		copyDTO.destination = [];
		for (let i = 0; i < this.destination.length; i++) {
			copyDTO.destination[i] = Object.assign({}, this.destination[i]);
		}
		copyDTO.forcastStatusTypeId = this.forcastStatusTypeId;
		copyDTO.functionType = this.functionType;
		copyDTO.statusTypeId = this.statusTypeId;
		copyDTO.securityId = this.securityId;
		copyDTO.reply = this.reply;
		copyDTO.noApprover = this.noApprover;
		return copyDTO;
	}
}
