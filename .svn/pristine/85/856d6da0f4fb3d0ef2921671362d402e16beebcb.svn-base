import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMComponentInfo, EIMComponent } from 'app/shared/shared.interface';
import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { TranslateService } from '@ngx-translate/core';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMObjectDTO } from 'app/admins/shared/dtos/object.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMTypePathRendererComponent } from 'app/documents/shared/components/renderer/type-path-renderer.component';

export interface EIMDialogManagerComponentInfo extends EIMComponentInfo {
	name?: string;
	data?: any;
	callbacks?: any;
}

export namespace dialogName {
	export const ENTRY_SELECTOR = 'ENTRY_SELECTOR';
	export const PROPERTY = 'PROPERTY';
	export const MULTIPLE_USER_SELECTOR = 'MULTIPLE_USER_SELECTOR';

	export const WORKFLOW_CREATOR = 'WORKFLOW_CREATOR';
	export const FORM_WORKFLOW_CREATOR = 'FORM_WORKFLOW_CREATOR';
	export const DOCUMENT_WORKFLOW_CREATOR = 'DOCUMENT_WORKFLOW_CREATOR';
	export const WORKFLOW_UPDATOR = 'WORKFLOW_UPDATOR';
	export const FORM_WORKFLOW_UPDATOR = 'FORM_WORKFLOW_UPDATOR';
	export const DOCUMENT_WORKFLOW_UPDATOR = 'DOCUMENT_WORKFLOW_UPDATOR';
	export const WORKFLOW_STATUS_EVENT_UPDATOR = 'WORKFLOW_STATUS_EVENT_UPDATOR';
	export const WORKFLOW_COPY_EXECUTOR = 'WORKFLOW_COPY_EXECUTOR';
	export const FORM_WORKFLOW_COPY_EXECUTOR = 'FORM_WORKFLOW_COPY_EXECUTOR';
	export const DOCUMENT_WORKFLOW_COPY_EXECUTOR = 'DOCUMENT_WORKFLOW_COPY_EXECUTOR';
	export const WORKFLOW_REVISION_UP_CREATOR = 'WORKFLOW_REVISION_UP_CREATOR';
	export const DOCUMENT_WORKFLOW_REVISION_UP_CREATOR = 'DOCUMENT_WORKFLOW_REVISION_UP_CREATOR';
	export const FORM_WORKFLOW_REVISION_UP_CREATOR = 'FORM_WORKFLOW_REVISION_UP_CREATOR';
	export const WORKFLOW_SELECTOR = 'WORKFLOW_SELECTOR';
	export const WORKFLOW_MAIL_KIND_SELECTOR = 'WORKFLOW_MAIL_KIND_SELECTOR';

	export const WORKFLOW_ATTRIBUTE_COPY_SETTING = 'WORKFLOW_ATTRIBUTE_COPY_SETTING';
	export const CLASS_SELECTOR = 'CLASS_SELECTOR';
	export const FORMAT_SELECTOR = 'FORMAT_SELECTOR';
	export const RELATION_SELECTOR = 'RELATION_SELECTOR';
	export const GROUP_SELECTOR = 'GROUP_SELECTOR';
	export const SINGLE_GROUP_SELECTOR = 'SINGLE_GROUP_SELECTOR';
	export const SINGLE_ROLE_SELECTOR = 'SINGLE_ROLE_SELECTOR';

	export const WORKSPACE_CREATOR = 'WORKSPACE_CREATOR';

	export const WORKSPACE_FORM_CREATOR = 'WORKSPACE_FORM_CREATOR';
	export const WORKSPACE_FORM_UPDATOR = 'WORKSPACE_FORM_UPDATOR';

	export const FORM_FOLDER_CREATOR = 'FORM_FOLDER_CREATOR';
	export const FORM_FOLDER_UPDATOR = 'FORM_FOLDER_UPDATOR';
	export const FORM_FOLDER_SELECTOR = 'FORM_FOLDER_SELECTOR';
	export const FORM_TYPE_MULTIPLE_SELECTOR = 'FORM_TYPE_MULTIPLE_SELECTOR';

	export const ATTRIBUTE_TREE_VIEW_CREATOR = 'ATTRIBUTE_TREE_VIEW_CREATOR';
	export const ATTRIBUTE_TREE_VIEW_UPDATOR = 'ATTRIBUTE_TREE_VIEW_UPDATOR';
	export const ATTRITEM_SELECTOR = 'ATTRITEM_SELECTOR';

	export const ATTRIBUTE_TREE_VIEW_ATTRIBUTE_UPDATOR = 'ATTRIBUTE_TREE_VIEW_ATTRIBUTE_UPDATOR';
	export const ATTRIBUTE_TREE_VIEW_ATTRIBUTE_SORT_UPDATOR = 'ATTRIBUTE_TREE_VIEW_ATTRIBUTE_SORT_UPDATOR';


	export const FORMAT_CREATOR = 'FORMAT_CREATOR';
	export const FORMAT_UPDATOR = 'FORMAT_UPDATOR';
	export const DIRECTORY_CREATOR = 'DIRECTORY_CREATOR';
	export const DIRECTORY_UPDATOR = 'DIRECTORY_UPDATOR';

	export const USER_CREATOR = 'USER_CREATOR';
	export const USER_UPDATOR = 'USER_UPDATOR';
	export const USER_EXPORT_EXECUTOR = 'USER_EXPORT_EXECUTOR';
	export const USER_IMPORT_EXECUTOR = 'USER_IMPORT_EXECUTOR';
	export const USER_IMPORT_FAILED = 'USER_IMPORT_FAILED';

	export const GROUP_CREATOR = 'GROUP_CREATOR';
	export const GROUP_UPDATOR = 'GROUP_UPDATOR';

	export const ROLE_CREATOR = 'ROLE_CREATOR';
	export const ROLE_UPDATOR = 'ROLE_UPDATOR';

	export const COMPLEX_GROUP_CREATOR = 'COMPLEX_GROUP_CREATOR';
	export const COMP_GROUP_UPDATOR = 'COMP_GROUP_UPDATOR';

	export const RELATION_CREATOR = 'RELATION_CREATOR';
	export const RELATION_UPDATOR = 'RELATION_UPDATOR';

	export const SECURITY_CREATOR = 'SECURITY_CREATOR';
	export const SECURITY_UPDATOR = 'SECURITY_UPDATOR';

	export const STATUS_SECURITY_CREATOR = 'STATUS_SECURITY_CREATOR';
	export const STATUS_SECURITY_UPDATOR = 'STATUS_SECURITY_UPDATOR';
	export const STATUS_SECURITY_COPY = 'STATUS_SECURITY_COPY';

	export const ATTRIBUTE_TYPE_SORT_FORM = 'ATTRIBUTE_TYPE_SORT_FORM';
	export const ATTRIBUTE_TYPE_SORT_DOC = 'ATTRIBUTE_TYPE_SORT_DOC';
	export const ATTRIBUTE_SELECTOR = 'ATTRIBUTE_SELECTOR';
	export const WORKFLOW_EVENT_SORT = 'WORKFLOW_EVENT_SORT';

	export const ADMIN_USER_SELECTOR = 'ADMIN_USER_SELECTOR';
	export const ATTRIBUTE_CREATOR = 'ATTRIBUTE_CREATOR';
	export const ATTRIBUTE_UPDATOR = 'ATTRIBUTE_UPDATOR';
	export const CUSTOM_ATTRIBUTE_CREATOR = 'CUSTOM_ATTRIBUTE_CREATOR';
	export const CUSTOM_ATTRIBUTE_UPDATOR = 'CUSTOM_ATTRIBUTE_UPDATOR';
	export const FORM_ATTRIBUTE_CREATOR = 'FORM_ATTRIBUTE_CREATOR';
	export const FORM_ATTRIBUTE_UPDATER = 'FORM_ATTRIBUTE_UPDATER';

	export const CUSTOM_ATTRIBUTE_LIST_CREATOR = 'CUSTOM_ATTRIBUTE_LIST_CREATOR';
	export const CUSTOM_ATTRIBUTE_LIST_UPDATOR = 'CUSTOM_ATTRIBUTE_LIST_UPDATOR';
	export const CLASS_CREATOR = 'CLASS_CREATOR';
	export const CLASS_UPDATOR = 'CLASS_UPDATOR';
	export const CLASS_COPY = 'CLASS_COPY';

	export const ADMINS_SECURITY_APPLICANT = 'ADMINS_SECURITY_APPLICANT';
	export const ADMINS_SECURITY_SELECTOR = 'ADMINS_SECURITY_SELECTOR';

	export const CLASS_ATTRIBUTE_TYPE_INHERITANCE_AND_RELATION_UPDATOR = 'CLASS_ATTRIBUTE_TYPE_INHERITANCE_AND_RELATION_UPDATOR';

	export const CODETYPE_SELECTOR = 'CODETYPE_SELECTOR';
	export const CODETYPE_CREATOR = 'CODETYPE_CREATOR';
	export const CODETYPE_UPDATOR = 'CODETYPE_UPDATOR';
	export const CODETYPE_COPY = 'CODETYPE_COPY';

	export const CODE_CREATOR = 'CODE_CREATOR';
	export const CODE_UPDATOR = 'CODE_UPDATOR';
	export const CODE_SORT = 'CODE_SORT';
	export const LIST_VALUE_SORT = 'LIST_VALUE_SORT';

	export const CLASS_DISPLAY_COLUMN_EDITOR = 'CLASS_DISPLAY_COLUMN_EDITOR';

}

@Directive()
@Injectable()
export class EIMAdminDialogManagerComponentService {

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
					objectRole: selectTarget.hasOwnProperty('objectRole') ? selectTarget.objectRole : true,
				},
				destination: destination,
				viewSource: viewSource
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	public showpublishNotifySelector(documentId: number, destination: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ENTRY_SELECTOR,
			data: {
				documentId: documentId,
				selectTarget: {
					user: true,
					group: true,
					role: true,
					compGroup: true,
					userDefGroup: false,
					system: false,
				},
					destination: destination
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 複数ユーザ選択ダイアログを表示します.
	 */
	public showMultipleUserSelector(destination: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.MULTIPLE_USER_SELECTOR,
			data: {
				documentId: '',
				selectTarget: {
					user: true,
					group: false,
					role: false,
					compGroup: false,
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
	 * ワークフロー登録ダイアログを表示します.
	 */
	public showWorkflowCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー登録(帳票管理)ダイアログを表示します.
	 */
	public showFormWorkflowCreator(namespace: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_WORKFLOW_CREATOR,
			data: {
				namespace: namespace,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ドキュメント用ワークフロー登録ダイアログを表示します.
	 */
	public showDocumentWorkflowCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DOCUMENT_WORKFLOW_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー更新(汎用)ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showWorkflowUpdator(workflow: EIMWorkflowDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_UPDATOR,
			data: {
				workflow: workflow,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー更新(帳票)ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showFormWorkflowUpdator(workflow: EIMWorkflowDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_WORKFLOW_UPDATOR,
			data: {
				workflow: workflow,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー属性複製設定ダイアログを表示します.
	 * @param selectedData 属性データ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showWorkflowAttributeCopySetting(selectedData, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_ATTRIBUTE_COPY_SETTING,
			data: {
				selectedData: selectedData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ドキュメント用ワークフロー更新ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showDocumentWorkflowUpdator(workflow: EIMWorkflowDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DOCUMENT_WORKFLOW_UPDATOR,
			data: {
				// DeepCopy
				workflow: JSON.parse(JSON.stringify(workflow)),
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ドキュメント用ワークフローステータス/イベント更新ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showWorkflowStatusEventUpdator(workflow: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_STATUS_EVENT_UPDATOR,
			data: {
				// DeepCopy
				workflow: JSON.parse(JSON.stringify(workflow)),
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー流用作成ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showWorkflowCopyExecutor(workflow: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_COPY_EXECUTOR,
			data: {
				workflow: workflow,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー流用作成ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showFormWorkflowCopyExecutor(workflow: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_WORKFLOW_COPY_EXECUTOR,
			data: {
				workflow: workflow,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー流用作成ダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showDocumentWorkflowCopyExecutor(workflow: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DOCUMENT_WORKFLOW_COPY_EXECUTOR,
			data: {
				workflow: workflow,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフローリビジョンアップダイアログを表示します.
	 * @param workflowId ワークフローID
	 */
	public showWorkflowRevisionUpCreator(workflow: EIMWorkflowDomain, isRevisionUpRegist: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_REVISION_UP_CREATOR,
			data: {
				workflow: workflow,
				isRevisionUpRegist: isRevisionUpRegist,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフローリビジョンアップダイアログ(帳票)を表示します.
	 * @param workflowId ワークフローID
	 */
	public showFormWorkflowRevisionUpCreator(workflow: EIMWorkflowDomain, isRevisionUpRegist: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_WORKFLOW_REVISION_UP_CREATOR,
			data: {
				workflow: workflow,
				isRevisionUpRegist: isRevisionUpRegist,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフローリビジョンアップダイアログ(ドキュメント)を表示します.
	 * @param workflowId ワークフローID
	 */
	public showDocumentWorkflowRevisionUpCreator(workflow: EIMWorkflowDomain, isRevisionUpRegist: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DOCUMENT_WORKFLOW_REVISION_UP_CREATOR,
			data: {
				workflow: workflow,
				isRevisionUpRegist: isRevisionUpRegist,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * グループ・ロール選択ダイアログを表示します.
	 * @param activeTab 選択ダイアログに表示するコンテンツを選ぶ
	 * @param destination 選択済み一覧
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showGroupSelector(activeTab: number, destination: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.GROUP_SELECTOR,
			data: {
				activeTab: activeTab,
				destination: destination
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 単一のグループ選択画面を表示します.
	 * @param callbacks コールバック関数
	 * @param displayAccordionNum グループ表示形式
	 * @return ダイアログID
	 */
	public showSingleGroupSelector(displayAccordionNum: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.SINGLE_GROUP_SELECTOR,
			data: {
				displayAccordionNum: displayAccordionNum
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 単一のロール選択画面を表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showSingleRoleSelector(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.SINGLE_ROLE_SELECTOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークフロー選択ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID	 *
	 */
	public showWorkflowSelector(callbacks?: any, disableOldRevision = false): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_SELECTOR,
			data: {
				disableOldRevision: disableOldRevision,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}
	/**
	 * フォーマット選択ダイアログを表示します.
	 * @param selectedData フォーマットデータ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showFormatSelector(selectedData, callbacks?: any): string {
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i].hasOwnProperty('id')) {
				selectedData[i]['formatId'] = selectedData[i].id;
			}
		}
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORMAT_SELECTOR,
			data: {
				selectedData: selectedData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * メール種別選択ダイアログを表示します.
	 * @param selectedData 選択レコード配列
	 * @param idMin メール種別ID最小値
	 * @param idMax メール種別ID最大値
	 * @param callbacks コールバック関数
	 */
	public showWorkflowMailKindSelector(selectedData, idMin: number, idMax: number, callbacks?: any): string {
		let leftLabel = this.translateService.instant('EIM_ADMINS.LABEL_02309');
		let rightLabel = this.translateService.instant('EIM_ADMINS.LABEL_02310');
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_MAIL_KIND_SELECTOR,
			data: {
				selectedData: selectedData,
				idMin, idMax,
				columns: [
					{ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02112'), width: 369, suppressSorting: true, suppressFilter: true }
				],
				leftLabel: leftLabel,
				rightLabel: rightLabel,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性ツリービュー登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttributeTreeCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_TREE_VIEW_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性ツリービュー更新ダイアログを表示します.
	 * @param attrId 属性ID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttributeTreeUpdator(attrId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_TREE_VIEW_UPDATOR,
			data: {
				attrId: attrId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性選択ダイアログを表示します.
	 * @param selectedData データグリッド情報
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttrItemSelector(selectedData, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRITEM_SELECTOR,
			data: {
				selectedData: selectedData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性階層順序詳細設定ダイアログを表示します.
	 * @param attrId 属性ID
	 * @param viewNoValuesFlag 属性値有無フラグ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttrbuteTreeViewAttributeUpdator(attrId: number, viewNoValuesFlag: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_TREE_VIEW_ATTRIBUTE_UPDATOR,
			data: {
				attrId: attrId,
				viewNoValuesFlag: viewNoValuesFlag,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性階層並べ替え登録ダイアログを表示します.
	 * @param sortTarget ソート対象情報
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttrbuteTreeViewAttributeSortUpdator(sortTarget: any[], callbacks?: any): string {

		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_TREE_VIEW_ATTRIBUTE_SORT_UPDATOR,
			data: {
				sortTarget: sortTarget,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * リレーション選択ダイアログを表示します.
	 */
	public showRelationSelector(selectedData, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.RELATION_SELECTOR,
			data: {
				selectedData: selectedData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * クラス選択ダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param parentObjTypeName 親タイプ名
	 * @param dialogLabel ダイアログ名
	 * @param objTypeId 選択タイプID
	 * @param callbacks コールバック関数
	 * @return ダイアログ名
	 */
	public showClassSelector(adminAppId: string, parentObjTypeName: string, dialogLabel: string, objTypeId?: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CLASS_SELECTOR,
			data: {
				adminAppId: adminAppId,
				parentObjTypeName: parentObjTypeName,
				dialogLabel: dialogLabel,
				objTypeId: objTypeId
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * フォーマット登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showFormatCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORMAT_CREATOR,
			data: {

			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * フォーマット更新ダイアログを表示します.
	 * @param formatId フォーマットID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showFormatUpdator(formatId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORMAT_UPDATOR,
			data: {
				formatId: formatId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 新規ディレクトリ作成ダイアログを表示します.
	 * @param formatId フォーマットID
	 * @param formatLabel フォーマット名
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showDirectoryCreator(formatId: number, formatLabel: String, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DIRECTORY_CREATOR,
			data: {
				formatId: formatId,
				formatLabel: formatLabel,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ディレクトリ更新ダイアログを表示します.
	 * @param formatId フォーマットID
	 * @param dirId ディレクトリID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showDirectoryUpdator(formatId: number, dirId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.DIRECTORY_UPDATOR,
			data: {
				formatId: formatId,
				dirId: dirId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ユーザ登録ダイアログを表示します.
	 */
	public showUserCreator(adminAppId: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.USER_CREATOR,
			data: {
				adminAppId: adminAppId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ユーザ更新ダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param userId ユーザID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showUserUpdator(adminAppId: string, userId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.USER_UPDATOR,
			data: {
				adminAppId: adminAppId,
				userId: userId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ユーザエクスポートダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param userName ユーザ名称
	 * @param userCode ユーザコード
	 * @param userMail メールアドレス
	 * @param belongingGroupName 所属グループ
	 * @param includingChildGroup 子グループを含むかどうか
	 * @param dispFlag 無効フラグ表示有無
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showUserExportExecutor(adminAppId: string, userName: string, userCode: string, userMail: string, belongingGroupName: string, includingChildGroup: boolean, dispFlag: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.USER_EXPORT_EXECUTOR,
			data: {
				adminAppId: adminAppId,
				userName: userName,
				userCode: userCode,
				userMail: userMail,
				belongingGroupName: belongingGroupName,
				includingChildGroup: includingChildGroup,
				dispFlag: dispFlag,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ユーザインポートダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showUserImportExecutor(adminAppId: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.USER_IMPORT_EXECUTOR,
			data: {
				adminAppId: adminAppId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ユーザインポート失敗ダイアログを表示します.
	 * @param errorMessage エラーメッセージ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showUserImportFailed(errorMessage: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.USER_IMPORT_FAILED,
			data: {
				errorMessage: errorMessage,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * グループ登録ダイアログを表示します.
	 * @param groupId グループID
	 * @param groupName グループ名称
	 * @param displayAccordionNum グループ一覧表示方法
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showGroupCreator(groupId: number, groupName: string, displayAccordionNum: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.GROUP_CREATOR,
			data: {
				groupId: groupId,
				groupName: groupName,
				displayAccordionNum: displayAccordionNum,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * グループ更新ダイアログを表示します.
	 * @param groupId グループID
	 * @param groupName グループ名称
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showGroupUpdator(groupId: number, displayAccordionNum: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.GROUP_UPDATOR,
			data: {
				groupId: groupId,
				displayAccordionNum: displayAccordionNum,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ロール登録ダイアログを表示します.
	 * @param roleId ロールID
	 * @param roleName ロール名称
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showRoleCreator(roleId: number, roleName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ROLE_CREATOR,
			data: {
				roleName: roleName,
				roleId: roleId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * ロール更新ダイアログを表示します.
	 * @param roleId ロールID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showRoleUpdator(roleId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ROLE_UPDATOR,
			data: {
				roleId: roleId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 複合グループ登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCompGroupCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.COMPLEX_GROUP_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * リレーション登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showRelationCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.RELATION_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * リレーション更新ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showRelationUpdator(relationTypeId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.RELATION_UPDATOR,
			data: {
				relationTypeId: relationTypeId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * セキュリティ登録ダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showSecurityCreator(adminAppId: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.SECURITY_CREATOR,
			data: {
				adminAppId: adminAppId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * セキュリティ更新ダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param secId セキュリティID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showSecurityUpdator(adminAppId: string, secId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.SECURITY_UPDATOR,
			data: {
				adminAppId: adminAppId,
				secId: secId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ステータス別セキュリティ登録ダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param secId セキュリティID
	 * @param secLabel セキュリティラベル
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showStatusSecurityCreator(adminAppId: string, workflowId: number, workflowLabel: string, secId: number, secLabel: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.STATUS_SECURITY_CREATOR,
			data: {
				adminAppId: adminAppId,
				workflowId: workflowId,
				workflowLabel,
				secId: secId,
				secLabel: secLabel,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ステータス別セキュリティ更新ダイアログを表示します.
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param secId セキュリティID
	 * @param secLabel セキュリティラベル
	 * @param workflowId ワークフローID
	 * @param workflowLabel ワークフローラベル
	 * @param stTypeId ステータスタイプID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showStatusSecurityUpdator(adminAppId: string, secId: number, secLabel: string, workflowId: number, workflowLabel: string, stTypeId: number, stSecId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.STATUS_SECURITY_UPDATOR,
			data: {
				adminAppId: adminAppId,
				secId: secId,
				secLabel: secLabel,
				workflowId: workflowId,
				workflowLabel: workflowLabel,
				stTypeId: stTypeId,
				stSecId: stSecId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ステータス別セキュリティ流用登録ダイアログを表示します.
	 * @param secId セキュリティID
	 * @param secLabel セキュリティラベル
	 * @param workflowId ワークフローID
	 * @param workflowLabel ワークフローラベル
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showStatusSecurityCopy(secId: number, secLabel: string, workflowId: number, workflowLabel: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.STATUS_SECURITY_COPY,
			data: {
				secId: secId,
				secLabel: secLabel,
				workflowId: workflowId,
				workflowLabel: workflowLabel,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ワークスペース登録ダイアログを表示します.
	 * @param objId オブジェクトID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
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
	 * プロパティダイアログを表示します.
	 * @param content 表示対象オブジェクト
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showProperty(content: any, disabled: false, callbacks?: any): string {
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
	 * 属性タイプ並べ替え登録ダイアログを表示します.
	 * @param objTypeId 対象オブジェクトタイプID
	 * @param adminAppId 呼び出し元管理画面情報
	 * @param selectedData データグリッド情報
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showAttTypeSortUpdator(objTypeId: number, adminAppId: string, selectedData?: any[], callbacks?: any): string {
		let dialogViewName = dialogName.ATTRIBUTE_TYPE_SORT_FORM;
		if (EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT === adminAppId) {
			dialogViewName = dialogName.ATTRIBUTE_TYPE_SORT_DOC;
		}

		let info: EIMDialogManagerComponentInfo = {
			name: dialogViewName,
			data: {
				objTypeId: objTypeId,
				selectedData: selectedData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性選択ダイアログを表示します.
	 * @param selectedData データグリッド情報
	 * @param adminAppId システム管理アプリケーション種別ID
	 * @param relationFlag リレーションフラグ
	 * @param attrTreeFlag 属性ツリービューフラグ
	 * @param callbacks コールバック関数
	 * @return name ダイアログID
	 */
	public showAttributeSelector(selectedData, adminAppId, relationFlag, attrTreeFlag, documentTypeFlag, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_SELECTOR,
			data: {
				selectedData: selectedData,
				adminAppId: adminAppId,
				relationFlag: relationFlag,
				attrTreeFlag: attrTreeFlag,
				documentTypeFlag: documentTypeFlag,
				columns: [
					{ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 275, cellRendererFramework: EIMAttributeTypeNameRendererComponent, suppressFilter: true },
					{ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 275, suppressFilter: true }
				],
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * イベント優先度並べ替え登録ダイアログを表示します.
	 * @param selectedData データグリッド情報
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showEventSortCreator(selectedData?: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKFLOW_EVENT_SORT,
			data: {
				selectedData: selectedData,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 帳票ワークスペース登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showFormWorkspaceCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKSPACE_FORM_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 帳票ワークスペース更新ダイアログを表示します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showFormWorkspaceUpdator(formWorkspaceId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.WORKSPACE_FORM_UPDATOR,
			data: {
				formWorkspaceId: formWorkspaceId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 帳票フォルダ登録ダイアログを表示します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @param parentFormFolderId 親帳票フォルダID
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showFormFolderCreator(formWorkspaceId: number, formTypeId: number, parentFormFolderId: number, parentFormFolderName: string, parentFormFolderHierarchy: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_FOLDER_CREATOR,
			data: {
				formWorkspaceId: formWorkspaceId,
				formTypeId: formTypeId,
				parentFormFolderId: parentFormFolderId,
				parentFormFolderName: parentFormFolderName,
				parentFormFolderHierarchy: parentFormFolderHierarchy,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 帳票フォルダ更新ダイアログを表示します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @param formFolderId 帳票フォルダID
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showFormFolderUpdator(formWorkspaceId: number, formTypeId: number, formFolderId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_FOLDER_UPDATOR,
			data: {
				formWorkspaceId: formWorkspaceId,
				formTypeId: formTypeId,
				formFolderId: formFolderId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 帳票フォルダ選択ダイアログを表示します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showFormFolderSelector(formWorkspaceId: number, formTypeId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_FOLDER_SELECTOR,
			data: {
				formWorkspaceId: formWorkspaceId,
				formTypeId: formTypeId
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * 帳票タイプ複数選択ダイアログを表示します.
	 * @param selectedData : 選択された帳票タイプリスト
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showFormTypeMultiSelector(selectedData: any[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_TYPE_MULTIPLE_SELECTOR,
			data: {
				selectedData: selectedData,
				columns: [
					{ field: 'formTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 180, suppressFilter: true },
					{ field: 'path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02017'), width: 272, suppressFilter: true }
				],
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * アクセスセキュリティ変更画面ダイアログを表示します.
	 * @param adminAppId システム管理区分
	 * @param accessSecurity : アクセスセキュリティ情報を設定 null設定の場合は初期作成を表示します.
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showAccessSecurityApplicant(adminAppId: string, accessSecurity: EIMSecurity, callbacks: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ADMINS_SECURITY_APPLICANT,
			data: {
				adminAppId: adminAppId,
				accessSecurity: accessSecurity,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}


	/**
	 * セキュリティ選択ダイアログを表示します.
	 * @param adminAppId システム管理区分
	 * @param content : セキュリティ情報
	 * @param displaySearch : セキュリティ検索部表示フラグ
	 * @param callbacks コールバック関数
	 * @return name ダイアログ名
	 */
	public showAdminSecuritySelector(adminAppId: string, displaySearch = true, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ADMINS_SECURITY_SELECTOR,
			data: {
				adminAppId: adminAppId,
				displaySearch: displaySearch,
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
	 * 属性登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttributeCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_CREATOR,
			data: {

			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票用属性登録ダイアログを表示します.
	 * @param dataTypeList データ型一覧
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showFormAttributeCreator(dataTypeList: EIMDataTypeDomain[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_ATTRIBUTE_CREATOR,
			data: {
				dataTypeList: dataTypeList,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 属性更新ダイアログを表示します.
	 * @param attributeType 更新対象属性タイプ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showAttributeUpdator(attributeType: EIMAdminAttributeTypeDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.ATTRIBUTE_UPDATOR,
			data: {
				attributeType: attributeType,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票用属性更新ダイアログを表示します.
	 * @param dataTypeList データ型一覧
	 * @param attributeType 更新対象属性タイプ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showFormAttributeUpdator(dataTypeList: EIMDataTypeDomain[], attributeType: EIMAdminAttributeTypeDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_ATTRIBUTE_UPDATER,
			data: {
				dataTypeList: dataTypeList,
				attributeType: attributeType,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	* 属性登録ダイアログを表示します.
	* @param dataTypeList データ型一覧
	* @param callbacks コールバック関数
	* @return ダイアログID
	*/
	public showDocumentAttributeCreator(dataTypeList: EIMDataTypeDomain[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CUSTOM_ATTRIBUTE_CREATOR,
			data: {
				dataTypeList: dataTypeList,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);
		return info.name;
	}

	/**
	 * 属性更新ダイアログを表示します.
	 * @param dataTypeList データ型一覧
	 * @param attributeType 更新対象属性タイプ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showDocumentAttributeUpdator(dataTypeList: EIMDataTypeDomain[], attributeType: EIMAdminAttributeTypeDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CUSTOM_ATTRIBUTE_UPDATOR,
			data: {
				dataTypeList: dataTypeList,
				attributeType: attributeType,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);
		return info.name;
	}

	/**
	 * リスト値登録ダイアログを表示します.
	 * @param attribute 属性タイプ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showDocumentAttributeListCreator(attribute: EIMAttributeTypeDTO, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CUSTOM_ATTRIBUTE_LIST_CREATOR,
			data: {
				attribute: attribute,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);
		return info.name;
	}

	/**
	 * リスト値更新ダイアログを表示します.
	 * @param attribute 属性タイプ
	 * @param listValue 更新対象リスト値
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showDocumentAttributeListUpdator(attribute: EIMAttributeTypeDTO, listValue: EIMListValueDTO, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CUSTOM_ATTRIBUTE_LIST_UPDATOR,
			data: {
				attribute: attribute,
				listValue: listValue,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);
		return info.name;
	}

	/**
	 * クラス登録ダイアログを表示します.
	 */
	public showClassCreator(adminAppId: string, dialogLabel: string, objTypeId: number, objTypeName: string, rootObjTypeDefName: string, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CLASS_CREATOR,
			data: {
				adminAppId: adminAppId,
				dialogLabel: dialogLabel,
				objTypeId: objTypeId,
				objTypeName: objTypeName,
				rootObjTypeDefName: rootObjTypeDefName,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * クラス更新ダイアログを表示します.
	 */
	public showClassUpdator(adminAppId: any, dialogLabel: any, objTypeId: any, rootObjTypeDefName: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CLASS_UPDATOR,
			data: {
				adminAppId: adminAppId,
				dialogLabel: dialogLabel,
				objTypeId: objTypeId,
				rootObjTypeDefName: rootObjTypeDefName,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * クラス流用作成ダイアログを表示します.
	 */
	public showClassCopy(objTypeId: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CLASS_COPY,
			data: {
				objTypeId: objTypeId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 引継ぎ・関連付け設定ダイアログを表示します.
	 */
	public showClassAttributeTypeInheritanceAndRelationUpdator(objTypeId: any, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CLASS_ATTRIBUTE_TYPE_INHERITANCE_AND_RELATION_UPDATOR,
			data: {
				objTypeId: objTypeId,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コードタイプ選択画面を表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeTypeSelector(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODETYPE_SELECTOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コードタイプ登録ダイアログを表示します.
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeTypeCreator(callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODETYPE_CREATOR,
			data: {
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コードタイプ更新（更新）ダイアログを表示します.
	 * @param codeTypeId 更新対象コードタイプID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeTypeUpdator(codeTypeId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODETYPE_UPDATOR,
			data: {
				codeTypeId
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コードタイプ更新（複写）ダイアログを表示します.
	 * @param codeTypeId 更新対象コードタイプID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeTypeCopy(codeTypeId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODETYPE_COPY,
			data: {
				codeTypeId
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コード登録ダイアログを表示します.
	 * @param codeType コードタイプ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeCreator(codeType: EIMCodeTypeDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODE_CREATOR,
			data: {
				codeType
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コード更新（更新）ダイアログを表示します.
	 * @param id コードID
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeUpdator(id: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODE_UPDATOR,
			data: {
				id
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * コード並べ替えダイアログを表示します.
	 * @param codeType コードタイプ
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showCodeSort(codeType: EIMCodeTypeDomain, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CODE_SORT,
			data: {
				codeType: codeType,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * リスト値並べ替えダイアログを表示します.
	 * @param attribute 属性タイプ
	 * @param listValueList リスト値一覧
	 * @param callbacks コールバック関数
	 * @return ダイアログID
	 */
	public showListValueSort(attribute: EIMAttributeTypeDTO, listValueList: EIMListValueDTO[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.LIST_VALUE_SORT,
			data: {
				attribute: attribute,
				listValueList: listValueList,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 表示列更新ダイアログを表示します.
	 * @param objTypeId オブジェクトタイプID
	 * @param adminFormType 表示列
	 * @param callback コールバック関数
	 * @return ダイアログID
	 */
	public showClassDisplayColumnEditor(objTypeId: number, adminFormType: EIMObjectDTO[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.CLASS_DISPLAY_COLUMN_EDITOR,
			data: {
				objTypeId: objTypeId,
				adminFormType: adminFormType,
			},
			callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}
}

