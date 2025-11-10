import { Component, ViewChild, OnInit, AfterViewInit, forwardRef, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { EIMLoginComponent } from 'app/shared/components/login/login.component';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMPortalAuthenticationService } from 'app/portals/services/apis/portal-authentication.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMProjectMemberApplierComponent } from 'app/tasks/components/project-member-applier/project-member-applier.component';
import { EIMObjectAPIService, EIMObjectAPIServiceGetParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { CommonModule } from '@angular/common';
import { EIMPortalsModule } from 'app/portals/portals.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMTasksModule } from 'app/tasks/tasks.module';

/**
 * ワークスペースメンバーコンポーネント
 * @example
 *
 *      <eim-workspace-member>
 *      </eim-workspace-member>
 */
@Component({
	selector: 'eim-workspace-member',
	templateUrl: './workspace-member.component.html',
	styleUrls: ['./workspace-member.component.scss'],
	imports: [
		CommonModule,
		EIMPortalsModule,
		EIMTasksModule,
		EIMSharedModule,
	],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceMemberComponent)}, ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkspaceMemberComponent {

	/** プロジェクトメンバー適用コンポーネント */
	@ViewChild('projectMemberApplier', { static: true }) projectMemberApplier: EIMProjectMemberApplierComponent;

	/** 選択中のワークスペースID */
	@Input()
	public workspaceId: number = null;

	/** 編集モードか否か */
	public isMemberEditMode = false;

	/** 編集 */
	public menuEditMember: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03014'), name: 'createTask', icon: 'fa fa-pencil', visible: true,
		command: (event) => {this.setMemberEditMode(true);},
	};

	/** キャンセル */
	public menuCancelMember: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03015'), name: 'createTask', icon: 'fa fa-remove', visible: true,
		command: (event) => {this.onClickMemberCancel();},
		disabled: true
	};

	/** 保存 */
	public menuSaveMember: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03016'), name: 'createTask', icon: 'fa fa-check', visible: true,
		command: (event) => {this.onClickMemberSave();},
		disabled: true
	};

	/** メンバー一覧メニュー */
	public memberFormMenuItems: EIMMenuItem[] = [
		// 編集
		this.menuEditMember,
		// 保存
		this.menuSaveMember,
		// キャンセル
		this.menuCancelMember,
	];

	public editable = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectAPIService: EIMObjectAPIService,
		protected route: ActivatedRoute
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		if (!state) {
			return;
		}

		if (this.workspaceId) {
			if (this.projectMemberApplier && state.projectMemberApplier) {
				// メンバー情報を取得
				this.projectMemberApplier.setState(state.projectMemberApplier);
			}
		}
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			projectMemberApplier: this.projectMemberApplier.getState()
		}
	}

	/**
	 * コンポーネントを初期化します.
	 * 選択されたワークスペースIDを設定します.
	 * 
	 * @param workspaceId 選択されたワークスペースID
	 */
	public initialize(workspaceId: number): void {
		this.workspaceId = workspaceId;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

	}

	/**
	 * メンバ一覧初期化時のイベントハンドラです.
	 * @param event イベント
	 */
	onInitializedMembers(event): void {

		// プロジェクト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: this.workspaceId,
		}
		param.exParameter = {
			[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ACCESS_ROLE_TYPE_NAME_MAP]: {
				'ワークスペース': ['UPDATE']
			}
		}

		this.objectAPIService.get(param).subscribe((res: any) => {

			const formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			if (formFormatResult.dto.id !== this.workspaceId) {
				return;
			}

			// 編集権限チェック
			this.menuEditMember.disabled = formFormatResult.dto.exAttributeMap?.accessRoleTypeNameMap?.UPDATE === false;
		});
	}

	/**
	 * メンバ一覧変更時のイベントハンドラです.
	 * @param event イベント
	 */
	onChangedMembers(event): void {

		this.menuSaveMember.disabled = false;

	}

	/**
	 * メンバフォーム保存ボタンクリック時のイベントハンドラです.
	 */
	onClickMemberSave(): void {

		this.projectMemberApplier.apply();
		this.menuSaveMember.disabled = true;
	}

	/**
	 * メンバフォームキャンセルボタンクリック時のイベントハンドラです.
	 */
	onClickMemberCancel(): void {

		// 何かしら編集していればキャンセル前に警告
		let j1:string = JSON.stringify(this.projectMemberApplier.members);
		let j2:string = JSON.stringify(this.projectMemberApplier.backupMembers);
		
		if (j1 !== j2) {
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_TASKS.CONFIRM_00007'),
			() => {
				this.setMemberEditMode(false);
			});
		} else {
			this.setMemberEditMode(false);
		}

	}

	/**
	 * メンバー一覧適用完了時のイベントハンドラです.
	 * @param event イベント
	 */
	onAppliedMembers(event): void {

		// 編集モードの終了
		this.setMemberEditMode(false);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_02004')}));

	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * メンバ一覧の編集モードを設定します.
	 *
	 * 設定によりメンバメニュー、メンバの編集可否を切り替えます.
	 *
	 * @param isMemberEditMode 編集可否（true:編集可）
	 */
	protected setMemberEditMode(isMemberEditMode: boolean): void {

		this.isMemberEditMode = isMemberEditMode;

		// メニューの表示非表示を変更
		this.menuEditMember.disabled = isMemberEditMode;
		this.menuSaveMember.disabled = !isMemberEditMode;
		this.menuCancelMember.disabled = !isMemberEditMode;
	}

}
