import { Directive, EventEmitter, Injectable, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { EIMTypePathRendererComponent } from 'app/documents/shared/components/renderer/type-path-renderer.component';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMComponent, EIMComponentInfo } from 'app/shared/shared.interface';


export interface EIMDialogManagerComponentInfo extends EIMComponentInfo {
	name?: string;
	data?: any;
	callbacks?: any;
}

export namespace dialogName {
	export const DOCUMENT_CREATOR = 'DOCUMENT_CREATOR';
	export const DOCUMENT_CREATOR_CONFIRMATION = 'DOCUMENT_CREATOR_CONFIRMATION';
	export const FOLDER_CREATOR = 'FOLDER_CREATOR';
	export const TAG_CREATOR = 'TAG_CREATOR';
	export const WORKSPACE_CREATOR = 'WORKSPACE_CREATOR';
	export const WORKSPACE_ADMINISTRATOR_SELECTOR = 'WORKSPACE_ADMINISTRATOR_SELECTOR';
	export const SELECTABLE_SECURITY_SELECTOR = 'SELECTABLE_SECURITY_SELECTOR';
	export const LUMP_DOCUMENT_CREATOR = 'LUMP_DOCUMENT_CREATOR';
	export const LUMP_DOCUMENT_CREATOR_CONFIRMATION = 'LUMP_DOCUMENT_CREATOR_CONFIRMATION';
	export const LUMP_FOLDER_CREATOR = 'LUMP_FOLDER_CREATOR';
	export const LUMP_FOLDER_CREATOR_CONFIRMATION = 'LUMP_FOLDER_CREATOR_CONFIRMATION';
	export const COVER_CREATOR = 'COVER_CREATOR';
	export const CHECK_IN = 'CHECK_IN';
	export const APPROVE_EXECUTOR = 'APPROVE_EXECUTOR';
	export const APPROVE_REQUEST_EXECUTOR = 'APPROVE_REQUEST_EXECUTOR';
	export const APPROVER_SELECTOR = 'APPROVER_SELECTOR';
	export const PUBLIC = 'PUBLIC';
	export const PUBLIC_DESTINATION_SELECTOR = 'PUBLIC_DESTINATION_SELECTOR';
	export const SEARCH = 'SEARCH';
	export const SEARCH_CONTENTS = 'SEARCH_CONTENTS';
	export const SINGLE_SEARCH_CONTENTS = 'SINGLE_SEARCH_CONTENTS';
	export const PROPERTY = 'PROPERTY';
	export const RELATION_FILE_PROPERTY = 'RELATION_FILE_PROPERTY';
	export const REVISION_HISTORY = 'REVISION_HISTORY';
	export const ACCESS_HISTORY = 'ACCESS_HISTORY';
	export const SECURITY_CHANGE = 'SECURITY_CHANGE';
	export const TABLE_CREATOR = 'TABLE_CREATOR';
	export const TABLE_CONFIG = 'TABLE_CONFIG';
	export const ATTRIBUTE_TYPE_SELECTOR = 'ATTRIBUTE_TYPE_SELECTOR';
	export const OCR_SETTING_UPDATOR = 'OCR_SETTING_UPDATOR';
	export const SECURITY_SELECTOR = 'SECURITY_SELECTOR';
	export const OBJECT_TYPE_TREE_SELECTOR = 'OBJECT_TYPE_TREE_SELECTOR';
	export const FOLDER_TREE_SELECTOR = 'FOLDER_TREE_SELECTOR';
	export const OBJECT_TYPE_MULTIPLE_SELECTOR = 'OBJECT_TYPE_MULTIPLE_SELECTOR';
	export const CONTENTS_PUBLIC_CANCEL_EXECUTOR = 'CONTENTS_PUBLIC_CANCEL_EXECUTOR';
	export const CONTENTS_STATUS_PROPERTY = 'CONTENTS_STATUS_PROPERTY';
	export const PUBLIC_FILE_COMBINE_EXECUTOR = 'PUBLIC_FILE_COMBINE_EXECUTOR';
	export const PUBLIC_FILE_COMPARE_EXECUTOR = 'PUBLIC_FILE_COMPARE_EXECUTOR';
	export const PUBLIC_FILE_SECURITY_UPDATER = 'PUBLIC_FILE_SECURITY_UPDATER';
	export const FAVORITE_LIST = 'FAVORITE_LIST';
	export const PUBLIC_FILE_COMPARE_LIST = 'PUBLIC_FILE_COMPARE_LIST';
	export const CHECKOUT_LIST = 'CHECKOUT_LIST';
	export const LINK_UPDATOR = 'LINK_UPDATOR';
	export const FOLDER_CONFIGURATION_SECURITY_APPLICABLE = 'FOLDER_CONFIGURATION_SECURITY_APPLICABLE';
	export const ACCESS_SECURITY_APPLICABLE = 'ACCESS_SECURITY_APPLICABLE';
	export const ACCESS_SECURITY_EDIT = 'ACCESS_SECURITY_EDIT';
	export const FILE_REPLACEMENT_EXECUTOR = 'FILE_REPLACEMENT_EXECUTOR';
	export const TAG_ALLOCATION_APPLICANT = 'TAG_ALLOCATION_APPLICANT';
	export const PDF_SETTING_UPDATOR = 'PDF_SETTING_UPDATOR';
	export const PDF_ELECTRONIC_SIGNATURE_APPLICABLE = 'PDF_ELECTRONIC_SIGNATURE_APPLICABLE';
	export const ACCESS_SECURITY_CHECKED_USER_SELECTOR = 'ACCESS_SECURITY_CHECKED_USER_SELECTOR';
	export const NOTFIED_USER_SELECTOR = 'NOTFIED_USER_SELECTOR';
	export const ENTRY_SELECTOR = 'ENTRY_SELECTOR';
	export const PUBLIC_FILE_PRE_SETTER = 'PUBLIC_FILE_PRE_SETTER';
	export const BOX_SELECTOR = 'BOX_SELECTOR';
}

@Directive()
@Injectable()
export class EIMDialogManagerComponentService {

	@Output() show: EventEmitter<EIMDialogManagerComponentInfo> = new EventEmitter<EIMDialogManagerComponentInfo>();
	@Output() closed: EventEmitter<string> = new EventEmitter<string>();

	public dialogs: any = {};

	constructor(
			protected translateService: TranslateService,
	) {

	}

	
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * エントリ選択ダイアログを表示します.
	 */
	 public showEntrySelector(documentId: number, destination: any[], selectTarget: any = {}, viewSource?: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ENTRY_SELECTOR,
			data: {
				documentId: documentId,
				selectTarget: {

					user: selectTarget.hasOwnProperty('user') ? selectTarget.user : true,
					group: selectTarget.hasOwnProperty('group') ? selectTarget.group : true,
					role: selectTarget.hasOwnProperty('role') ? selectTarget.role : true,
					compGroup: selectTarget.hasOwnProperty('compGroup') ? selectTarget.compGroup : true,
					userDefGroup: selectTarget.hasOwnProperty('userDefGroup') ? selectTarget.userDefGroup : true,
					system: selectTarget.hasOwnProperty('system') ? selectTarget.system : false,
				},
				destination: destination,
				viewSource: viewSource
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 差換え画面を表示します.
	 * @param parentObjId 選択データの親オブジェクトID
	 * @param content 選択データ
	 * @param callbacks コールバック
	 * @return ダイアログID
	 */
	public showFileReplacementExecutor(parentObjId: number, content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FILE_REPLACEMENT_EXECUTOR,
				data: {
					parentObjId: parentObjId,
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ドキュメント登録ダイアログを表示します.
	 */
	public showDcoumentCreator(workspaceObjId: number, parentObjId: number, addFileList: any[], path: string, documentTypeId?: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.DOCUMENT_CREATOR,
				data: {
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					addFileList: addFileList,
					path: path,
					documentTypeId: documentTypeId, // Box→EIM用
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ドキュメント登録確認ダイアログを表示します.（Box連携用）
	 * @param workspaceObjId ワークスペースID
	 * @param parentObjId 親オブジェクトID
	 * @param content ドキュメント情報
	 * @param path パス
	 * @param callbacks コールバック関数
	 */
	public showDocumentCreatorConfirmation(workspaceObjId: number, parentObjId: number, content: any, addFileList: any[], path: string,	callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DOCUMENT_CREATOR_CONFIRMATION,
			data: {
				workspaceObjId: workspaceObjId,
				parentObjId: parentObjId,
				content: content,
				addFileList: addFileList,
				path: path,
			},
			callbacks: callbacks,
		};
		this.show.emit(info);

		return info.name;
	}

	/**
	 * リンク設定ダイアログを表示します.
	 */
	public showLinkUpdator(objId: number, parentObjId: number, isDocumentLink: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.LINK_UPDATOR,
				data: {
					objId: objId,
					parentObjId: parentObjId,
					isDocumentLink: isDocumentLink
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開取消ダイアログを表示します.
	 */
	public showContentsPublicCancelExecutor(addFileList: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.CONTENTS_PUBLIC_CANCEL_EXECUTOR,
				data: {
					addFileList: addFileList,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * フォルダ登録ダイアログを表示します.
	 */
	public showFolderCreator(workspaceObjId: number, parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FOLDER_CREATOR,
				data: {
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * タグ登録ダイアログを表示します.
	 * @param workspaceObjId ワークスペースID
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param callbacks コールバック関数
	 */
	public showTagCreator(workspaceObjId: number, parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.TAG_CREATOR,
				data: {
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークスペース登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 */
	public showWorkspaceCreator(objId: number, callbacks?: any): string {
		let title = this.translateService.instant('EIM_DOCUMENTS.LABEL_01023');
		if (objId === null) {
			title = this.translateService.instant('EIM_DOCUMENTS.LABEL_01022');
		}
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.WORKSPACE_CREATOR,
				data: {
					objId: objId,
					title: title
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークスペース管理者選択画面を表示します.
	 */
	public showWorkspaceAdministratorSelector(documentId: number, destination: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.WORKSPACE_ADMINISTRATOR_SELECTOR,
				data: {
					documentId: documentId,
					selectTarget: {
						user: true,
						group: true,
						role: true,
						compGroup: true,
						userDefGroup: false
					},
					destination: destination
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 使用可能セキュリティ選択画面を表示します.
	 * @param selectedData 選択済みセキュリティ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showSelectableSecuritySelector(selectedData: any[], searchResult: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SELECTABLE_SECURITY_SELECTOR,
				data: {
					selectedData: selectedData,
					searchResult: searchResult,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ドキュメント一括登録ダイアログを表示します.
	 * @param workspaceObjId ワークスペースID
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param callbacks コールバック関数
	 */
	public showLumpDocumentCreator(workspaceObjId: number, parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.LUMP_DOCUMENT_CREATOR,
				data: {
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ドキュメント一括登録確認ダイアログを表示します.
	 * @param objId 親オブジェクトID
	 * @param content コンテンツ情報
	 * @param property プロパティ
	 * @param expirationDate 有効期限
	 * @param createUserId 作成者ID
	 * @param documentTypeId ドキュメントタイプID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showLumpDocumentCreatorConfirmation(objId: number, content: any, property: any, expirationDate: any, createUserId: any, documentTypeId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.LUMP_DOCUMENT_CREATOR_CONFIRMATION,
				data: {
					objId: objId,
					content: content,
					property: property,
					expirationDate: expirationDate,
					createUserId: createUserId,
					documentTypeId: documentTypeId,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * フォルダアップロードダイアログを表示します.
	 * @param workspaceObjId ワークスペースID
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param callbacks コールバック関数
	 */
	public showLumpFolderCreator(workspaceObjId: number, parentObjId: number, addFileList: any[],path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.LUMP_FOLDER_CREATOR,
				data: {
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					addFileList: addFileList,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * スキャン用表紙登録ダイアログを表示します.
	 * @param workspaceObjId 選択ワークスペースID
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCoverCreator(workspaceObjId: number, parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.COVER_CREATOR,
				data: {
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * チェックインダイアログを表示します.
	 */
	public showCheckIn(contents: any[], workspaceObjId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.CHECK_IN,
				data: {
					contents: contents,
					workspaceObjId: workspaceObjId,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 承認ダイアログを表示します.
	 * @param functionType 選択処理初期値
	 * @param contentsObjs コンテンツ情報リスト
	 * @param workspaceId ワークスペースID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showApprove(functionType: string, contentsObjs: any[], workspaceObjId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.APPROVE_EXECUTOR,
				data: {
					functionType: functionType,
					contentsObjs: contentsObjs,
					workspaceObjId: workspaceObjId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 承認依頼ダイアログを表示します.
	 * @param contentsObjs コンテンツ情報リスト
	 * @param workspaceId ワークスペースID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showApproveRequest(contentsObjs: any[], workspaceObjId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.APPROVE_REQUEST_EXECUTOR,
				data: {
					contentsObjs: contentsObjs,
					workspaceObjId: workspaceObjId

				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 承認者一覧選択ダイアログを表示します.
	 */
	public showApproverSelector(statusTypeId: number, allColumns: EIMUserDTO[], selectedData: EIMUserDTO[], onlyBoss = false, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.APPROVER_SELECTOR,
				data: {
					allColumns: allColumns,
					selectedData: selectedData,
					onlyBoss: onlyBoss,
					statusTypeId: statusTypeId,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開ダイアログを表示します.
	 */
	public showPublic(documentObjs: any[], workspaceObjId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC,
				data: {
					documentObjs: documentObjs,
					workspaceObjId: workspaceObjId

				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開通知先選択ダイアログを表示します.
	 */
	public showDocumentPublicDestinationSelector(documentId: number, destination: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_DESTINATION_SELECTOR,
				data: {
					documentId: documentId,
					destination: destination
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 検索ダイアログを表示します.
	 */
	public showSearch(parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SEARCH,
				data: {
					parentObjId: parentObjId,
					selectFlg: false,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コンテンツ選択画面（複数選択）を表示します.
	 * 呼び出し元画面を閉じる際は、次の処理を実行し検索キャッシュをクリアしてください.
	 * this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param targetObj 検索種別{document: boolean, folder: boolean, tag: boolean}
	 * @param selectedData 選択データ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showContentsMultipleSelector(parentObjId: number, path: string, targetObj: any, visibleDocumentLink: boolean, selectedData: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SEARCH_CONTENTS,
				data: {
					parentObjId: parentObjId,
					multiple: true,
					selectFlg: true,
					targetObj: targetObj,
					visibleDocumentLink: visibleDocumentLink,
					selectedData: selectedData,
					widthBalance: 75,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コンテンツ選択画面を表示します.
	 * 呼び出し元画面を閉じる際は、次の処理を実行し検索キャッシュをクリアしてください.
	 * this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param targetObj 検索種別{document: boolean, folder: boolean, tag: boolean}
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showContentsSingleSelector(parentObjId: number, path: string, targetObj: any, visibleDocumentLink: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SINGLE_SEARCH_CONTENTS,
				data: {
					parentObjId: parentObjId,
					multiple: false,
					selectFlg: true,
					targetObj: targetObj,
					visibleDocumentLink: visibleDocumentLink,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * プロパティダイアログを表示します.
	 */
	public showProperty(content: any, disabled = false, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PROPERTY,
				data: {
					content: content,
					disabled: disabled
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 関連ファイルプロパティダイアログを表示します.
	 * @param content コンテンツ情報
	 * @param disabled 非活性フラグ
	 * @param callbacks コールバック処理
	 * @return ダイアログID
	 */
	public showRelationFileProperty(content: any, disabled = false, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.RELATION_FILE_PROPERTY,
				data: {
					content: content,
					disabled: disabled
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 改訂履歴ダイアログを表示します.
	 */
	public showRevisionHistory(content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.REVISION_HISTORY,
				data: {
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 回付状況/履歴ダイアログを表示します.
	 */
	public showAccessHistory(content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ACCESS_HISTORY,
				data: {
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * OCR処理設定画面を表示します.
	 * @param content OCR処理対象ドキュメント
	 * @param collbacks コールバック関数
	 * @return ダイアログID
	 */
	public showOCRSettingUpdator(content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OCR_SETTING_UPDATOR,
				data: {
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * セキュリティ変更ダイアログを表示します.
	 */
	public showSecurityChange(content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SECURITY_CHANGE,
				data: {
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * テーブル登録ダイアログを表示します.
	 */
	public showTableCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.TABLE_CREATOR,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * テーブル管理ダイアログを表示します.
	 */
	public showTableConfig(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.TABLE_CONFIG,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性選択ダイアログを表示します.
	 */
	public showAttributeTypeSelector(selectedData, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ATTRIBUTE_TYPE_SELECTOR,
				data: {
					selectedData: selectedData,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * セキュリティ選択ダイアログを表示します.
	 */
	public showSecuritySelector(content: any, displaySearch = true, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.SECURITY_SELECTOR,
				data: {
					content: content,
					displaySearch: displaySearch,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * お気に入り一覧ダイアログを表示します.
	 * @param callbacks コールバック関数
	 */
	public showFavoriteList(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FAVORITE_LIST,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * チェックアウト一覧ダイアログを表示します.
	 * @param callbacks コールバック関数
	 */
	public showCheckoutList(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.CHECKOUT_LIST,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開ファイル比較結果一覧ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCompareFileList(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_FILE_COMPARE_LIST,
				data: {
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * オブジェクトタイプツリー選択ダイアログを表示します.
	 */
	public showObjectTypeTreeSelector(content: any, workspaceObjId: number, typeName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OBJECT_TYPE_TREE_SELECTOR,
				data: {
					content: content,
					workspaceObjId: workspaceObjId,
					typeName: typeName,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * フォルダツリー選択ダイアログを表示します.
	 */
	public showFolderTreeSelector(content: any, typeName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FOLDER_TREE_SELECTOR,
				data: {
					content: content,
					typeName: typeName,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * オブジェクトタイプ複数選択ダイアログを表示します.
	 * @param workspaceObjId 選択ワークスペースID
	 * @param typeName 対象オブジェクトタイプ種別
	 * @param selectedData 選択オブジェクトタイプ一覧
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showObjectTypeMultipleSelector(workspaceObjId: number, typeName: string, selectedData: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.OBJECT_TYPE_MULTIPLE_SELECTOR,
				data: {
					workspaceObjId: workspaceObjId,
					typeName: typeName,
					selectedData: selectedData,
					columns: [
						{field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 210, suppressFilter: true},
						{field: '_path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02051'), width: 240, cellRendererFramework: EIMTypePathRendererComponent, suppressFilter: true}
					],
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コンテンツステータスプロパティダイアログを表示します.
	 */
	public showContentsStatusProperty(content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.CONTENTS_STATUS_PROPERTY,
				data: {
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開ファイル結合ダイアログを表示します.
	 * @param workspaceObjId ワークスペースID
	 * @param parentObjId 親オブジェクトID
	 * @param path パス
	 * @param callbacks コールバック関数
	 */
	public showPublicFileCombineExecutor(contents: any[], workspaceObjId: number, parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_FILE_COMBINE_EXECUTOR,
				data: {
					contents: contents,
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 公開ファイル比較ダイアログを表示します.
	 * @param contents コンテントリスト
	 * @param callbacks コールバック関数
	 */
	public showPublicFileCompareExecutor(contents: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_FILE_COMPARE_EXECUTOR,
				data: {
					contents: contents
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開ファイルセキュリティダイアログを表示します.
	 * @param activityFlag 活性表示フラグ
	 * @param objId 操作対象オブジェクトID
	 * @param publicFileSecurity 操作対象セキュリティ情報
	 * @param callbacks コールバック関数
	 */
	public showPublicFileSecurityUpdater(activityFlag: boolean, objId: number, publicFileSecurity: EIMPublicFileSecurityDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_FILE_SECURITY_UPDATER,
				data: {
					activityFlag: activityFlag,
					objId: objId,
					publicFileSecurity: publicFileSecurity,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	public close(dialogId: string): void {
		this.closed.emit(dialogId);
	}

	public getView(dialogId: string): EIMComponent {
		if (this.dialogs[dialogId]) {
			return (this.dialogs[dialogId] as EIMDialogComponent).content;
		}
		return null;
	}

	/**
	 * アクセスセキュリティ変更画面ダイアログを表示します.
	 * accessSecurity : アクセスセキュリティ情報を設定　null設定の場合は初期作成を表示します.
	 */
	public showAccessSecurityApplicable(content: any, accessSecurity: EIMSecurity, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ACCESS_SECURITY_APPLICABLE,
				data: {
					content: content,
					accessSecurity: accessSecurity,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * アクセスセキュリティ編集画面ダイアログを表示します.
	 * accessSecurity : アクセスセキュリティ情報を設定　null設定の場合は初期作成を表示します.
	 * editable : 編集可能かどうか
	 */
	 public showAccessSecurityEdit(content: any, accessSecurity: EIMSecurity, callbacks?: any, editable = true): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ACCESS_SECURITY_EDIT,
				data: {
					content: content,
					accessSecurity: accessSecurity,
					editable: editable,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * フォルダ構成管理セキュリティ変更ダイアログを表示します.
	 * folderSecurity : フォルダ構成管理セキュリティ情報を設定　null設定の場合は初期作成を表示します.
	 */
	public showFolderConfigurationSecurityApplicable(content: any, folderSecurity: EIMSecurity, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FOLDER_CONFIGURATION_SECURITY_APPLICABLE,
				data: {
					content: content,
				folderSecurity: folderSecurity,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * タグ割当ダイアログを表示します.
	 */
	public showAssignTag(content: any, workspaceObjId: number, parentObjId: number, path: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.TAG_ALLOCATION_APPLICANT,
				data: {
					content: content,
					workspaceObjId: workspaceObjId,
					parentObjId: parentObjId,
					path: path
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * PDF出力設定ダイアログを表示します.
	 * @param activityFlag アクティビティフラグ
	 * @param objId オブジェクトID
	 * @param pdfOutput PDF出力設定情報
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showPDFSettingUpdater(activityFlag: boolean, objId: number, pdfOutput: EIMPDFOutputDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PDF_SETTING_UPDATOR,
				data: {
					activityFlag: activityFlag,
					objId: objId,
					pdfOutput: pdfOutput
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 電子署名ダイアログを表示します.
	 * @param contents コンテントリスト
	 * @param callbacks コールバック関数
	 */
	public showPDFElectronicSignatureApplicable(activityFlag: boolean, objId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PDF_ELECTRONIC_SIGNATURE_APPLICABLE,
				data: {
					activityFlag: activityFlag,
					objId: objId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * アクセス権限チェック済みのユーザ選択画面を表示します.
	 * @param parentObjId 親オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAccessCheckedUserSelector(parentObjId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ACCESS_SECURITY_CHECKED_USER_SELECTOR,
				data: {
					parentObjId: parentObjId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 公開通知先参照画面を表示します.
	 * @param objId オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showNotfiedUserSelector(objId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.NOTFIED_USER_SELECTOR,
				data: {
					objId: objId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}
	
	/**
	 * 公開PDFの事前設定画面を表示します.
	 * @param parentObjId 選択データの親オブジェクトID
	 * @param content 選択データ
	 * @param callbacks コールバック
	 * @return ダイアログID
	 */
	 public showPreSettingsPublicPdf(parentObjId: number, content: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.PUBLIC_FILE_PRE_SETTER,
				data: {
					parentObjId: parentObjId,
					content: content,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/** Box公開 フォーマット設定 */
	public showBoxFormat(
		selectedData: any,
		boxData: any,
		content: any,
		callbacks?: any
	): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.BOX_SELECTOR,
			data: {
				selectedData: selectedData,
				boxData: boxData,
				content: content,
			},
			callbacks: callbacks,
		};
		this.show.emit(info);
		return info.name;
	}
}
