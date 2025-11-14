import { Injectable } from '@angular/core';
import { EIMApproveDocumentDTO } from '../dtos/approve-document.dto';
import { EIMWorkflowStatusType, EIMWorkflowEventType } from './apis/workflow.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMApproveUserDTO } from '../dtos/approve-user.dto';
import { EIMDocumentsConstantService } from './documents-constant.service';
import { EIMApproveStatusDTO } from '../dtos/approve-status.dto';

/**
 * 承認情報管理サービス.
 * 承認依頼画面、承認画面にて、サーバから取得した現在の承認状態と、クライアントでの操作後の承認状態を管理し、最新の承認状態を返却します.
 */
@Injectable()
export class EIMApproveInfoManagementService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * 承認情報管理インスタンスを返却します.
	 * @param documents ドキュメントの承認情報のリスト
	 * @return 承認情報管理インスタンス
	 */
	public getManager(documents: EIMApproveDocumentDTO[]): EIMApproveInfoManagementService.EIMApproveInfoManager {
		return new EIMApproveInfoManagementService.EIMApproveInfoManager(documents);
	}
}
export namespace EIMApproveInfoManagementService {
	export class EIMApproveInfoManager {
		// 以下ドキュメントのIDと各情報のMap
		private originalDocumentMap: Map<number, EIMApproveDocumentDTO>; // dspApproveDocumentListで取得した情報
		private originalStatusTypesMap: Map<number, EIMWorkflowStatusType[]>; // getWorkFlowHistory.doで取得した情報
		private updatedStatusTypeMap: Map<number, EIMWorkflowStatusType[]>;
		private updatedRouteEventTypeMap: Map<number, EIMWorkflowEventType[]>;
		private updatedSkipStatusTypeIdSetMap: Map<number, Set<number>>;
		private updatedUserListStatusTypeIdSetMap: Map<number, Set<number>>;

		/**
		 * コンストラクタです.
		 */
		constructor(
			documents: EIMApproveDocumentDTO[]
		) {
			this.originalDocumentMap = new Map();
			for (let i = 0; i < documents.length; i++) {
				this.originalDocumentMap.set(documents[i].objId, documents[i]);
			}

			this.originalStatusTypesMap = new Map();
			this.updatedStatusTypeMap = new Map();
			this.updatedRouteEventTypeMap = new Map();
			this.updatedSkipStatusTypeIdSetMap = new Map();
			this.updatedUserListStatusTypeIdSetMap = new Map();
		}

		// ----------------------------------------
		// 公開メソッド
		// ----------------------------------------
		/**
		 * 初期表示時のステータスタイプを設定します.
		 * @param docObjId ドキュメントのID
		 * @param statusTypes ステータスタイプのリスト
		 */
		public setOriginalStatusTypes(docObjId: number, statusTypes: EIMWorkflowStatusType[]): void {
			this.originalStatusTypesMap.set(docObjId, statusTypes);
		}

		/**
		 * 保持している文書ごとのステータスタイプ情報を更新します.
		 * ただし、現在のステータスタイプ含め前のステータスタイプは更新しません.
		 * @param docObjId ドキュメントのID
		 * @param statusTypes 更新するステータスタイプのリスト
		 */
		public setUpdatedStatusTypes(docObjId: number, statusTypes: EIMWorkflowStatusType[], isSkipChanged: boolean, isUserListChanged: boolean): void {
			let currentStep = this.originalDocumentMap.get(docObjId).step;

			// 更新ステータスタイプMap初期化
			let updatedStatusTypes = this.updatedStatusTypeMap.get(docObjId);
			if (!updatedStatusTypes) {
				updatedStatusTypes = [];
				this.updatedStatusTypeMap.set(docObjId, updatedStatusTypes);
			}

			// skip更新ステータスタイプIDSetのMap初期化
			let updatedSkipStatusTypeIdSet = this.updatedSkipStatusTypeIdSetMap.get(docObjId);
			if (!updatedSkipStatusTypeIdSet) {
				updatedSkipStatusTypeIdSet = new Set();
				this.updatedSkipStatusTypeIdSetMap.set(docObjId, updatedSkipStatusTypeIdSet);
			}

			// userList更新ステータスタイプIDSetのMap初期化
			let updatedUserListStatusTypeIdSet = this.updatedUserListStatusTypeIdSetMap.get(docObjId);
			if (!updatedUserListStatusTypeIdSet) {
				updatedUserListStatusTypeIdSet = new Set();
				this.updatedUserListStatusTypeIdSetMap.set(docObjId, updatedUserListStatusTypeIdSet);
			}

			for (let i = 0; i < statusTypes.length; i++) {
				if (statusTypes[i].step <= currentStep) {
					// 更新対象外
					continue;
				}
				let isUpdatedStatusType = false;
				for (let j = 0; j < updatedStatusTypes.length; j++) {
					if (Number(statusTypes[i].objId) === Number(updatedStatusTypes[j].objId)) {
						// 更新情報を置き換える場合
						isUpdatedStatusType = true;
						updatedStatusTypes[j] = Object.assign({}, statusTypes[i]);
						if (isSkipChanged) {
							updatedSkipStatusTypeIdSet.add(Number(statusTypes[i].objId));
						}
						if (isUserListChanged) {
							updatedUserListStatusTypeIdSet.add(Number(statusTypes[i].objId));
						}
						break;
					}
				}

				if (!isUpdatedStatusType) {
					// 更新情報を追加する場合
					updatedStatusTypes.push(Object.assign({}, statusTypes[i]));
				}

				if (isSkipChanged) {
					updatedSkipStatusTypeIdSet.add(Number(statusTypes[i].objId));
				}
				if (isUserListChanged) {
					updatedUserListStatusTypeIdSet.add(Number(statusTypes[i].objId));
				}
			}
		}

		/**
		 * 更新したステータスタイプのリストを返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @return 更新したステータスタイプのリスト
		 */
		public getUpdatedStatusTypes(docObjId: number): EIMWorkflowStatusType[] {
			return this.updatedStatusTypeMap.get(docObjId);
		}

		/**
		 * 承認ルートのイベントタイプリストを設定します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @param eventTypes 承認ルートのイベントタイプのリスト
		 */
		public setRouteEventTypes(docObjId: number, eventTypes: EIMWorkflowEventType[]): void {
			this.updatedRouteEventTypeMap.set(docObjId, eventTypes);
		}

		/**
		 * 承認ルートが存在するかどうかを返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @return eventTypes 承認ルートのイベントタイプのリスト
		 */
		public existsApproveRoute(docObjId: number): boolean {
			let updatedSkipStatusTypeIdSet = this.updatedSkipStatusTypeIdSetMap.get(docObjId);
			if (updatedSkipStatusTypeIdSet && updatedSkipStatusTypeIdSet.size > 0) {
				// スキップを更新した場合はルートがあることを確認する
				return (this.updatedRouteEventTypeMap.get(docObjId) !== null);
			}
			// スキップを更新していない場合は承認ルートありと判断する（DB登録の状態のため承認ルートは存在する）
			return true;
		}

		/**
		 * 直近の遷移先のステータスタイプIDを返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @return 直近の遷移先のステータスタイプID
		 */
		public getForcastStatusTypeId(docObjId: number): number {
			let currentSeq = this.originalDocumentMap.get(docObjId).step;
			let eventTypes: EIMWorkflowEventType[] = this.updatedRouteEventTypeMap.get(docObjId);
			if (eventTypes) {
				for (let i = 0; i < eventTypes.length; i++) {
					if (eventTypes[i].fromStatusTypeSeq === currentSeq) {
						let toStatusType = this.getOriginalStatusTypeByStep(docObjId, eventTypes[i].toStatusTypeSeq);
						if (toStatusType.id === -1) {
							// 公開処理中の可能性がある
							// イベントのTOは公開処理中を指すが、ドキュメントのステータスタイプリストは
							// 公開済みを指すためgetOriginalStatusTypeByStepで取得できない
							continue;
						}
						if (toStatusType.statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC) {
							// 公開処理中なら次の公開済みを返却する
							toStatusType = this.getOriginalStatusTypeByStep(docObjId, eventTypes[i].toStatusTypeSeq + 1);
							if (toStatusType) {
								return Number(toStatusType.id);
							}
						}
						return eventTypes[i].toStatusTypeId;
					}
				}
			}

			return this.originalDocumentMap.get(docObjId).forcastStatusTypeId;
		}

		/**
		 * 指定したステータスタイプIDに設定されている承認者を取得します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @param statusTypeId ステータスタイプID
		 */
		public getApproversByStatusTypeId(docObjId: number, statusTypeId: number): EIMEntryUserDTO[] {
			// 更新データから該当ステータス情報を探す
			let updatedStatusTypes = this.updatedStatusTypeMap.get(docObjId);
			if (updatedStatusTypes) {
				for (let i = 0; i < updatedStatusTypes.length; i++) {
					if (Number(updatedStatusTypes[i].objId) === statusTypeId) {
						// 更新情報に該当ステータスタイプ情報があった場合
						return this.convertApproveUserListToEntryUserList(updatedStatusTypes[i].users);
					}
				}
			}

			// 初期データから該当ステータス情報を探す

			// ドキュメントを選択して、更新しなかった場合
			let statusTypes: EIMWorkflowStatusType[] = this.originalStatusTypesMap.get(docObjId);
			if (statusTypes) {
				for (let i = 0; i < statusTypes.length; i++) {
					if (Number(statusTypes[i].objId) === statusTypeId) {
						return this.convertApproveUserListToEntryUserList(statusTypes[i].users);
					}
				}
			}

			// ドキュメントを選択しなかった場合（更新しなかった場合）
			let document: EIMApproveDocumentDTO = this.originalDocumentMap.get(docObjId);
			let statusList = document.statusList;
			for (let i = 0; i < statusList.length; i++) {
				if (Number(statusList[i].statusTypeId) === statusTypeId) {
					return statusList[i].approver;
				}
			}

			// なかった場合
			return [];
		}

		/**
		 * doEventにて送信するskipStatusTypeId（<ステータスタイプID>:<スキップするかどうかtrue/false>のカンマ区切り）を返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @return doEventにて送信するskipStatusTypeId
		 */
		public getSkipStatusTypeId(docObjId: number): string {
			let skipStatusTypeIds = [];
			// 更新データから該当ステータス情報を探す
			let updatedStatusTypes = this.updatedStatusTypeMap.get(docObjId);
			let updatedSkipStatusTypeIdSet = this.updatedSkipStatusTypeIdSetMap.get(docObjId);
			if (updatedStatusTypes && updatedSkipStatusTypeIdSet) {
				for (let i = 0; i < updatedStatusTypes.length; i++) {
					if (!updatedSkipStatusTypeIdSet.has(Number(updatedStatusTypes[i].objId))) {
						continue;
					}
					if (!updatedStatusTypes[i].canSkip) {
						// スキップ対象外は送信しない
						continue;
					}
					// 更新情報にskipを更新したステータスタイプ情報があった場合
					skipStatusTypeIds.push(updatedStatusTypes[i].objId + ':' + updatedStatusTypes[i].skip);
				}
			}
			return skipStatusTypeIds.join(',');
		}

		/**
		 * doEventにて送信するapproverId（<ステータスタイプID>:1:<ユーザID>のカンマ区切り、但し、承認者0件の場合はユーザIDに-1を設定する）を返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @return doEventにて送信するapproverId
		 */
		public getApproverId(docObjId: number): string {
			let approverIds = [];
			let updatedStatusTypeIdSet = new Set();

			// 更新データから該当ステータス情報を探す
			let updatedStatusTypes = this.updatedStatusTypeMap.get(docObjId);
			let updatedUserListStatusTypeIdSet = this.updatedUserListStatusTypeIdSetMap.get(docObjId);
			if (updatedStatusTypes && updatedUserListStatusTypeIdSet) {
				for (let i = 0; i < updatedStatusTypes.length; i++) {
					// 更新されたステータスタイプごとに承認者IDを追加する
					if (!updatedUserListStatusTypeIdSet.has(Number(updatedStatusTypes[i].objId))) {
						continue;
					}
					if (!updatedStatusTypes[i].users || updatedStatusTypes[i].users.length === 0) {
						// 承認者0件の場合はユーザーIDに-1を設定する
						approverIds.push(updatedStatusTypes[i].objId + ':1:-1');
						updatedStatusTypeIdSet.add(Number(updatedStatusTypes[i].objId));
					} else {
						for (let j = 0; j < updatedStatusTypes[i].users.length; j++) {
							// 更新情報にuserListを更新したステータスタイプ情報があった場合
							approverIds.push(updatedStatusTypes[i].objId + ':1:' + updatedStatusTypes[i].users[j].id);
						}
						updatedStatusTypeIdSet.add(Number(updatedStatusTypes[i].objId));
					}
				}
			}
			// 次の遷移先の承認者がapproverIdsに含まれていなければ追加する
			let original = this.originalDocumentMap.get(docObjId);
			let forcastStatusTypeId = this.getForcastStatusTypeId(docObjId)
			if (!updatedStatusTypeIdSet.has(forcastStatusTypeId)) {
				let originalStatusTypes = this.originalStatusTypesMap.get(docObjId);
				if (originalStatusTypes) {
					// ワークフローの情報を取得している場合（承認対象のドキュメントを選択した場合）
					// 画面でのスキップ変更を考慮して、次のステータスタイプの承認者を設定する
					for (let i = 0; i < originalStatusTypes.length; i++) {
						if (Number(originalStatusTypes[i].objId) !== forcastStatusTypeId) {
							continue;
						}
						if (!originalStatusTypes[i].users) {
							continue;
						}
						for (let j = 0; j < originalStatusTypes[i].users.length; j++) {
							approverIds.push(originalStatusTypes[i].objId + ':1:' + originalStatusTypes[i].users[j].id);
						}
					}
				} else {
					// ワークフローの情報を取得していない場合（承認対象のドキュメントを選択していない場合）
					// 承認一覧取得時のデフォルトの遷移先承認者を設定する
					for (let i = 0; i < original.statusList.length; i++) {
						if (Number(original.statusList[i].statusTypeId) !== forcastStatusTypeId) {
							continue;
						}
						if (!original.statusList[i].approver) {
							continue;
						}
						for (let j = 0; j < original.statusList[i].approver.length; j++) {
							approverIds.push(original.statusList[i].statusTypeId + ':1:' + original.statusList[i].approver[j].id);
						}
					}
				}
			}
			return approverIds.join(',');
		}

		/**
		 * 最終承認ステータスタイプかどうかを返却します.
		 *
		 * @param docObjId ドキュメントのオブジェクトID
		 * @return 最終承認ステータスタイプかどうか(最終承認ならtrue)
		 */
		public isLastApproveStatusType(docObjId: number): boolean {
			let forcastStatusTypeId = this.getForcastStatusTypeId(docObjId);
			let forcastStatusType = this.getOriginalStatusTypeByStatusTypeId(docObjId, forcastStatusTypeId);
			if (forcastStatusType.statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC ||
				forcastStatusType.statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				return true;
			}
			return false;
		}
		// ----------------------------------------
		// 非公開メソッド
		// ----------------------------------------
		/**
		 * ワークフロー履歴.ステータスタイプ.承認者リストをエントリユーザリストに変換します.
		 * @param users ワークフロー履歴.ステータスタイプ.承認者リスト
		 * @return 承認者のエントリユーザリスト
		 */
		private convertApproveUserListToEntryUserList(users: EIMApproveUserDTO[]): EIMEntryUserDTO[] {
			let entryUsers = [];
			if (!users) {
				return entryUsers;
			}
			for (let i = 0; i < users.length; i++) {
				let user: EIMEntryUserDTO = this.convertApproveUserToEntryUser(users[i]);
				entryUsers.push(user);
			}
			return entryUsers;
		}

		/**
		 * ワークフロー履歴.ステータスタイプ.承認者をエントリユーザに変換します.
		 * @param users ワークフロー履歴.ステータスタイプ.承認者
		 * @return 承認者のエントリユーザ
		 */
		private convertApproveUserToEntryUser(user: EIMApproveUserDTO): EIMEntryUserDTO {
			let entryUser: EIMEntryUserDTO = new EIMEntryUserDTO();
			entryUser.id = user.id;
			entryUser.name = user.name;
			return entryUser;
		}

		/**
		 * 指定ステップ数に該当するステータスタイプの情報を返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @param step ステップ数
		 * @return ステータスタイプ
		 */
		private getOriginalStatusTypeByStep(docObjId: number, step: number): {id: number, statusTypeKindId: number} {
			// まずはドキュメント取得時の情報からスタータスタイプを検索
			// （複数ドキュメント選択時等、ワークフロー情報未取得の可能背があるため）
			let originalDocument: EIMApproveDocumentDTO = this.originalDocumentMap.get(docObjId);
			for (let i = 0; i < originalDocument.statusList.length; i++) {
				if (originalDocument.statusList[i].step === step) {
					let statusType = originalDocument.statusList[i];
					return {id: statusType.statusTypeId, statusTypeKindId: statusType.statusKind};
				}
			}

			// ワークフロー情報のステータスタイプから検索
			let statusTypes: EIMWorkflowStatusType[] = this.originalStatusTypesMap.get(docObjId);
			if (!statusTypes) {
				return {id: -1, statusTypeKindId: -1};
			}
			for (let i = 0; i < statusTypes.length; i++) {
				if (statusTypes[i].step === step) {
					let statusType = statusTypes[i];
					return {id: statusType.objId, statusTypeKindId: statusType.statusTypeKindId};
				}
			}

			return {id: -1, statusTypeKindId: -1};
		}

		/**
		 * 指定IDに該当するステータスタイプの情報を返却します.
		 * @param docObjId ドキュメントのオブジェクトID
		 * @param id ステータスタイプID
		 * @return ステータスタイプ
		 */
		private getOriginalStatusTypeByStatusTypeId(docObjId: number, id: number): {id: number, statusTypeKindId: number} {
			// まずはドキュメント取得時の情報からスタータスタイプを検索
			// （複数ドキュメント選択時等、ワークフロー情報未取得の可能背があるため）
			let originalDocument: EIMApproveDocumentDTO = this.originalDocumentMap.get(docObjId);
			for (let i = 0; i < originalDocument.statusList.length; i++) {
				if (Number(originalDocument.statusList[i].statusTypeId) === id) {
					let statusType = originalDocument.statusList[i];
					return {id: Number(statusType.statusTypeId), statusTypeKindId: Number(statusType.statusKind)};
				}
			}

			// ワークフロー情報のステータスタイプから検索
			let statusTypes: EIMWorkflowStatusType[] = this.originalStatusTypesMap.get(docObjId);
			if (!statusTypes) {
				return {id: -1, statusTypeKindId: -1};
			}
			for (let i = 0; i < statusTypes.length; i++) {
				if (Number(statusTypes[i].objId) === id) {
					let statusType = statusTypes[i];
					return {id: Number(statusType.objId), statusTypeKindId: Number(statusType.statusTypeKindId)};
				}
			}

			return {id: -1, statusTypeKindId: -1};
		}
	}
}
