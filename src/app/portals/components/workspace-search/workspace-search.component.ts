import { Component, ViewChild, OnInit, AfterViewInit, forwardRef, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMMessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * ワークスペース検索コンポーネント
 * @example
 *
 *      <eim-workspace-search>
 *      </eim-workspace-search>
 */
@Component({
	selector: 'eim-workspace-search',
	templateUrl: './workspace-search.component.html',
	styleUrls: ['./workspace-search.component.scss'],
	imports: [
		CommonModule,
		FormsModule
	],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceSearchComponent)}, ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkspaceSearchComponent {

	/** 選択中のワークスペースID */
	@Input()
	public workspaceId: number = null;

	/** 編集モードか否か */
	public isMemberEditMode = false;

	/** 編集 */
	public menuEditMember: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03014'), name: 'createTask', icon: 'fa fa-pencil', visible: true,
		//command: (event) => {this.setMemberEditMode(true);},
		disabled: true};

	/** キャンセル */
	public menuCancelMember: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03015'), name: 'createTask', icon: 'fa fa-remove', visible: false,
		// command: (event) => {this.setMemberEditMode(false);}
	};

	/** 保存 */
	public menuSaveMember: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03016'), name: 'createTask', icon: 'fa fa-check', visible: false,
	//	command: (event) => {this.onClickMemberSave();}
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

	/** メンバ追加 */
	public menuAddMember: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03010'), name: 'addMember', icon: 'eim-icon-plus', disabled: true,
	//	command: (event) => {this.onAddMemberEntries();}
	};
	/** メンバ更新 */
	public menuUpdateMember: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), name: 'updateMember', icon: 'eim-icon-pencil', disabled: true,
	//	command: (event) => {this.onUpdateMemberEntries();}
	};
	/** メンバ削除 */
	public menuDeleteMember: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteMember', icon: 'eim-icon-trash', disabled: true,
	//	command: (event) => {this.onDeleteMemberEntries();}
	};
	/** メンバ一覧メニュー */
	public membersMenuItems: EIMMenuItem[] = [
		// メンバ追加
		this.menuAddMember,
		// メンバ更新
		this.menuUpdateMember,
		// メンバ削除
		this.menuDeleteMember
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected route: ActivatedRoute
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
