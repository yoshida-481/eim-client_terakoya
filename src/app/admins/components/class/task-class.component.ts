import { Component, forwardRef, AfterViewInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService } from 'app/shared/services/message.service';

import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';

import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMFormClassTreeComponentService } from 'app/admins/components/class-tree/form-class-tree.component.service';
import { EIMFormClassComponent } from './form-class.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { EIMDocumentsModule } from 'app/documents/documents.module';

/** タブインデックス */
export namespace tabIndexConst {
	export const TAB_INDEX_ATTRIBUTE = 0;
	export const TAB_INDEX_FORMAT = 1;
	export const TAB_INDEX_FORMCOLUMN = 2;
}

/**
 * クラス(タスク)コンポーネント<br>
 * クラス(帳票)コンポーネントをベースに変更点のみ実装
 * 
 * @example
 *
 *      <eim-task-class>
 *      </eim-task-class>
 */
@Component({
	selector: 'eim-task-class',
	templateUrl: './class.component.html',
	styleUrls: ['./class.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 

		AngularSplitModule,
		PanelModule, 
		TabsModule,
		EIMDocumentsModule
	],
	providers: [
		EIMFormClassTreeComponentService,
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMTaskClassComponent) }
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMTaskClassComponent extends EIMFormClassComponent implements EIMAdminMainComponent, AfterViewInit, OnDestroy {

	/** ラベル設定 */
	public classPanelHeader = this.translateService.instant('EIM_ADMINS.LABEL_02037');

	/** 表示列タブ非表示 */
	public override visibleFormListColumn = false;
	/** ステータス属性表示 */
	public override visibleStatusDataGrid = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected classTreeComponentService: EIMFormClassTreeComponentService,
		protected translateService: TranslateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected attributeTypeService: EIMAttributeTypeService,
		protected objectService: EIMObjectService,
		protected messageService: EIMMessageService,
		protected workflowService: EIMAdminsWorkflowService,
		protected securityService: EIMAdminsSecurityService,
	) {
		super(classTreeComponentService, translateService, adminDialogManagerComponentService,
			attributeTypeService, objectService, messageService, workflowService, securityService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 * 表示列、ステータス属性一覧で *ngIf を設定しているため、ngAfterViewInitを利用.
	 */
	ngAfterViewInit(): void {
		super.ngAfterViewInit();
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_TASK;
	}

	/**
	 * クラス登録メニュー押下時のイベントハンドラ
	 * クラス登録ダイアログを表示します.
	 */
	onClickClassCreator(): void {
		let selectedDataList = this.classTree.getSelectedData();
		let selectedData = selectedDataList[0];
		let id: number = null;
		let name: string = null;
		if (selectedDataList.length === 1) {
			id = selectedData.objTypeId;
			name = selectedData.label;
		}
		// クラス登録画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassCreator(
			this.adminAppId,
			this.createDialogLabel,
			id,
			name,
			null,
			{
				created: (data) => {
					// クラス登録画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// クラス一覧最新化
					this.classTreeComponentService.updateLatest(this.classTree.info, data[0].objTypeId, [], null, this.selected);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02273') }));
				},
				errored: () => {
					// クラス登録画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * クラスメニューバーの活性制御処理
	 * @param setValue 設定値 true: 非活性 false: 活性
	 */
	protected setClassMenuItemEnable(): void {
		// クラス一覧のメニュー活性制御
		let selectedClassTree = this.classTree.getSelectedData();
		if (selectedClassTree.length > 0) {
			// 選択したオブジェクトがルートタイプの場合は非活性
			if (selectedClassTree[0].parent === null ||
				typeof selectedClassTree[0].parent === 'undefined') {
				this.updateAndCopyClassMenuItem.disabled = true;
				this.updateClassMenuItem.disabled = true;
				this.copyClassMenuItem.disabled = true;
				this.deleteClassMenuItem.disabled = true;
			} else {
				this.updateAndCopyClassMenuItem.disabled = false;
				this.updateClassMenuItem.disabled = false;
				this.copyClassMenuItem.disabled = false;
				this.deleteClassMenuItem.disabled = false;
			}
		} else {
			this.updateAndCopyClassMenuItem.disabled = true;
			this.updateClassMenuItem.disabled = true;
			this.copyClassMenuItem.disabled = true;
			this.deleteClassMenuItem.disabled = true;
		}
	}
}