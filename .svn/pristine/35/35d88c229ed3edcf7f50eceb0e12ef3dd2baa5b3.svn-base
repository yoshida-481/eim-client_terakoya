import { Component, ViewChild, Input, EventEmitter, forwardRef, Output, SimpleChanges } from '@angular/core';

import { EIMApplicable, EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService } from 'app/shared/services/apis/object-api.service';
import { EIMTreeComponentService } from 'app/shared/components/tree/tree.component.service';
import { EIMTaskIconClassFunctionService } from 'app/tasks/services/task-icon-class-function.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTaskObjectRoleEntryInputFormItemComponentService } from '../task-object-role-entry-input-form-item/task-object-role-entry-input-form-item.component.service';
import { EIMMemberEntryDomain } from 'app/shared/domains/entity/member-entry.domain';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMMemberRoleDomain } from 'app/shared/domains/entity/member-role.domain';
import { EIMMembersService } from 'app/shared/services/apis/members.service';
import { EIMMembersDomain } from 'app/shared/domains/entity/members.domain';
import { EIMTaskObjectRoleEntryInputFormItemComponent } from '../task-object-role-entry-input-form-item/task-object-role-entry-input-form-item.component';
import { EIMTaskFormComponent } from '../task-form/task-form.component';
import { EIMResponsibleObjectRoleInputFormItemComponent } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';

/**
 * プロジェクトメンバー適用コンポーネント
 * @example
 *
 *      <eim-project-member-applier
 *      >
 *      </eim-project-member-applier>
 */
@Component({
	selector: 'eim-project-member-applier',
	templateUrl: './project-member-applier.component.html',
	styleUrls: ['./project-member-applier.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProjectMemberApplierComponent)}, ],
	standalone: false
})
export class EIMProjectMemberApplierComponent implements EIMApplicable {

	/** メンバフォーム */
	@ViewChild('memberForm', { static: true }) memberForm: EIMTaskFormComponent;

	/** メンバデータグリッド */
	@ViewChild('memberDataGrid', { static: true }) memberDataGrid: EIMDataGridComponent;

	/** 選択中のプロジェクトID */
	@Input() projectId: number = null;

	/** メンバ一覧が編集モードか否か */
	@Input() isMemberEditMode = false;

	/** プロジェクト情報取得完了時のイベントエミッタ */
	@Output() initialized: EventEmitter<EIMMembersDomain> = new EventEmitter<EIMMembersDomain>();

	/** メンバ変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();

	/** メンバー適用完了時のイベントエミッタ */
	@Output() applied: EventEmitter<EIMMembersDomain> = new EventEmitter<EIMMembersDomain>();

	/** メンバーズが修正済みかどうか */
	public isChangedMembers = false;

	/** メンバ編集モード時に選択した役割リスト */
	public selectedObjectRoleSelectItems: SelectItem[] = [];

	/** メンバ編集モード時に選択したエントリリスト */
	public selectedEntryElementSelectItems: SelectItem[] = [];

	/** メンバーズ */
	public members: EIMMembersDomain;
	/** メンバーズ（バックアップ） */
	public backupMembers: EIMMembersDomain;

	/* ==========================================================================
     メニューの定義
     ========================================================================== */
	/** メンバ追加 */
	public menuAddMember: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03010'), name: 'addMember', icon: 'eim-icon-plus', disabled: true,
		command: (event) => {this.onClickAddMemberEntries();}};
	/** メンバ更新 */
	public menuUpdateMember: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), name: 'updateMember', icon: 'eim-icon-pencil', disabled: true,
		command: (event) => {this.onClickUpdateMemberEntries();}};
	/** メンバ削除 */
	public menuDeleteMember: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteMember', icon: 'eim-icon-trash', disabled: true,
		command: (event) => {this.onClickDeleteMemberEntries();}};
	/** メンバ一覧メニュー */
	public membersMenuItems: EIMMenuItem[] = [
		// メンバ追加
		this.menuAddMember,
		// メンバ更新
		this.menuUpdateMember,
		// メンバ削除
		this.menuDeleteMember
	];

	/** 未保存時のメンバエントリID */
	protected memberEntryId = -1;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public treeComponentService: EIMTreeComponentService,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected membersService: EIMMembersService,
		protected taskIconClassFunctionService: EIMTaskIconClassFunctionService,
		protected messageService: EIMMessageService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected taskObjectRoleEntryInputFormItemComponentService: EIMTaskObjectRoleEntryInputFormItemComponentService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * プロジェクト情報を更新します.
	 */
	public apply(): void {

		this.membersService.update(this.members).subscribe(() => {

			this.setChangedMembers(false);
			this.backupMembers = JSON.parse(JSON.stringify(this.members));

			// 完了イベントを通知
			this.applied.emit();
		});
	}

	/**
	 * プロジェクト更新可否を返却します.
	 * @return プロジェクト更新可否
	 */
	public applicable(): boolean {
		return true;
	}
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		if (this.projectId) {
			// メンバー情報を取得
			this.initMembers(this.projectId);
		}
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngOnInit(): void {

		this.memberDataGrid.setColumns(
			this.getMemberDataGridColumns());

	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges) {

		if (!this.projectId) {
			return;
		}

		// プロジェクトID変更の場合
		if (changes.projectId) {

			// if (changes.projectId.currentValue === this.projectId) {
			// 	// プロジェクトIDの変更がなければ何もしない
			// 	return;
			// }

			// メンバー情報を取得
			this.initMembers(Number(changes.projectId.currentValue));
		}

		// 編集モード変更の場合
		if (changes.isMemberEditMode) {

			if (this.isMemberEditMode || this.memberForm.inputFormItems === null) {

				// window.setTimeout(() => {
					// メンバフォーム初期化
					this.memberForm.setInputFormItems(
						this.createMemberFormInputFormItems());
				// });
			}

			if (this.isMemberEditMode){
				this.backupMembers = this.members ? JSON.parse(JSON.stringify(this.members)) : [];
			} else {
				this.members = this.backupMembers ? JSON.parse(JSON.stringify(this.backupMembers)) : [];
				this.memberDataGrid.setData(this.members?.memberEntryList);
				this.memberDataGrid.refreshView();
			}

			this.setEnableMemberMenuButton();
		}
	}

	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		// this.viewDialogName = null;
	}

	/**
	 * メンバ一覧上部の入力項目変更時のイベントハンドラです.
	 *
	 * @param event
	 */
	public onChangedMemberForm(event): void {

		if (event.name === 'responsibleObjectRole') {
			this.selectedObjectRoleSelectItems = event.component.objectRoleSelectItems;
		} else
		if (event.name === 'taskObjectRoleEntry') {
			this.selectedEntryElementSelectItems = event.component.entries;
		}

		this.setEnableMemberMenuButton();
	}

	/**
	 * メンバエントリ追加ボタン押下のイベントハンドラです.
	 * メンバーグリッドにメンバエントリを追加します.
	 */
	public onClickAddMemberEntries(): void {

		// 操作対象のメンバエントリを取得
		let targetMemberEntry: EIMMemberEntryDomain = null;
		let addMemberEntries: EIMMemberEntryDomain[] = [];
		for (let entryElementSelectItem of this.selectedEntryElementSelectItems) {

			// 画面表示中のメンバエントリ情報を取得
			targetMemberEntry = this.getMemberEntry(Number(entryElementSelectItem.value.entryId));

			// 新規追加の場合
			if (!targetMemberEntry) {
				let entryTypeId = entryElementSelectItem.value.entryTypeId;
				let entryType: string = null;
				if (entryTypeId === 1) {
					entryType = 'USER';
				} else if (entryTypeId === 2) {
					entryType = 'GROUP';
				}
				targetMemberEntry = {
					id: this.createMemberEntryId(),
					entryType: entryType,
					entryElement: {
						id: Number(entryElementSelectItem.value.entryId), name: entryElementSelectItem.value.entryName
					},
					memberRoleList: []
				};

				// TODO entryElmentDomainに加えるか
				targetMemberEntry.entryElement['code'] = entryElementSelectItem.value.userCode;
				targetMemberEntry.entryElement['mail'] = entryElementSelectItem.value.userMail;

				this.members.memberEntryList.push(targetMemberEntry);
				addMemberEntries.push(targetMemberEntry);
			}

			// オブジェクトロールリストを設定
			let memberRoles: EIMMemberRoleDomain[] = targetMemberEntry.memberRoleList;

			for (let objectRoleSelectItem of this.selectedObjectRoleSelectItems) {
				let selectedObjectRole: EIMObjectRoleDomain = objectRoleSelectItem.value;
				if (this.hasObjectRole(memberRoles, selectedObjectRole)) {
					continue;
				}

				memberRoles.push({
					id: 0,
					objectRole: selectedObjectRole});
			}

			if (addMemberEntries.length === 0) {
				// let updateMember = this.members.memberEntryList.find(e => e.entryElement.id === targetMemberEntry.entryElement.id);

			}
		}
		// TODO 追加後に入力欄をクリアしたい
		// メンバフォーム初期化
		this.memberForm.setInputFormItems(
			this.createMemberFormInputFormItems());
		this.selectedObjectRoleSelectItems = [];
		this.selectedEntryElementSelectItems = [];

		// 画面反映
		// this.memberDataGrid.addRowData(addMemberEntries);
		this.memberDataGrid.setData(this.members.memberEntryList);
		this.setChangedMembers(true);

		this.setEnableMemberMenuButton();

		this.changed.emit(this.members);
	}

	/**
	 * メンバ更新ボタン押下のイベントハンドラです.
	 * メンバーグリッドの選択行レコードを更新します.
	 * @param event イベント
	 */
	public onClickUpdateMemberEntries() {

		// 単一選択以外はreturn
		if (this.memberDataGrid.getSelectedData().length !== 1 ) {
			return;
		}

		let targetMemberEntry = this.memberDataGrid.getSelectedData()[0];

		// 更新の場合はレコードをDELETE&INSERTする

		// グリッドの選択行削除
		this.memberDataGrid.removeRowData(targetMemberEntry);
		// memberEntryListから削除
		for (let i = 0; i < this.members.memberEntryList.length; i++) {
			if (this.members.memberEntryList[i].entryElement.id === targetMemberEntry.entryElement.id) {
				this.members.memberEntryList.splice(i, 1);
			}
		}

		// memberEntryListに追加
		for (let entryElementSelectItem of this.selectedEntryElementSelectItems) {
			// 画面表示中のメンバエントリ情報を取得
			targetMemberEntry = this.getMemberEntry(Number(entryElementSelectItem.value.entryId));

			// 新規追加の場合
			if (!targetMemberEntry) {
				let entryTypeId = entryElementSelectItem.value.entryTypeId;
				let entryType: string = null;
				if (entryTypeId === 1) {
					entryType = 'USER';
				} else if (entryTypeId === 2) {
					entryType = 'GROUP';
				}
				targetMemberEntry = {
					id: 0,
					entryType: entryType,
					entryElement: {
						id: Number(entryElementSelectItem.value.entryId), name: entryElementSelectItem.value.entryName
					},
					memberRoleList: []
				};

				targetMemberEntry.entryElement['code'] = entryElementSelectItem.value.userCode;
				targetMemberEntry.entryElement['mail'] = entryElementSelectItem.value.userMail;

				this.members.memberEntryList.push(targetMemberEntry);
				
			}

			// オブジェクトロールリストを設定
			let memberRoles: EIMMemberRoleDomain[] = targetMemberEntry.memberRoleList;

			for (let objectRoleSelectItem of this.selectedObjectRoleSelectItems) {
				let selectedObjectRole: EIMObjectRoleDomain = objectRoleSelectItem.value;
				if (this.hasObjectRole(memberRoles, selectedObjectRole)) {
					continue;
				}

				memberRoles.push({
					id: 0,
					objectRole: selectedObjectRole});

			}
		}

		this.memberDataGrid.setData(this.members.memberEntryList);

		// メンバフォーム初期化
		this.memberForm.setInputFormItems(
			this.createMemberFormInputFormItems());
		this.selectedObjectRoleSelectItems = [];
		this.selectedEntryElementSelectItems = [];
		
		this.setChangedMembers(true);

		this.setEnableMemberMenuButton();

		this.changed.emit(this.members);
	}

	/**
	 * メンバーグリッド選択イベントハンドラです.
	 * @param event イベント
	 */
	public onSelectedMemberDataGrid(event: any): void {
		this.setEnableMemberMenuButton();

		let selectedData = this.memberDataGrid.getSelectedData()[0];

		let objectRoleDomains: EIMObjectRoleDomain[] = selectedData.memberRoleList.map(memberRole => memberRole.objectRole);

		this.getComponentByName('responsibleObjectRole', (instance: EIMResponsibleObjectRoleInputFormItemComponent) => {
			instance.onSelectedObjectRole(objectRoleDomains);
		});
		  
		let entryTypeId = selectedData.entryType === 'USER' ? 1 : 2;
		let entryTypeName = selectedData.entryType === 'USER' ? 'ユーザ' : 'グループ';

		this.getComponentByName('taskObjectRoleEntry', (instance: EIMTaskObjectRoleEntryInputFormItemComponent) => {
			instance.onSelectedEntries([{
				entryId: selectedData.entryElement.id
				,entryName:selectedData.entryElement.name
				,entryTypeId:entryTypeId
				,entryTypeName:entryTypeName
				,userCode:selectedData.entryElement.code,userKana:selectedData.entryElement.kana}]);
		});

	}

	/**
	 * 入力コンポーネントの取得を行います
	 * @param event イベント
	 */
	getComponentByName(definitionName: string, handler: (component: any) => void): void {
		const component = this.memberForm.getItemResolvers().find((comp) =>
			comp.inputFormItem && comp.inputFormItem.name === definitionName
		);
		if (component) {
			const dynamicComponentInstance = component.getDynamicComponentInstance();
			if (dynamicComponentInstance) {
				handler(dynamicComponentInstance);
			}
		}
	}

	/**
	 * メンバ削除ボタン押下のイベントハンドラです.
	 * メンバーグリッドの選択行レコードを削除します.
	 * @param event イベント
	 */
	public onClickDeleteMemberEntries() {
		if (this.memberDataGrid.getSelectedData().length === 0 ) {
			return;
		}

		let selectedDataList = this.memberDataGrid.getSelectedData();
		// グリッドの選択行削除
		this.memberDataGrid.removeRowData(selectedDataList);
		// memberEntryListから削除
		for (let i = 0; i < this.members.memberEntryList.length; i++) {
			for (let selectedData of selectedDataList) {
				if (this.members.memberEntryList[i].id === selectedData.id) {
					this.members.memberEntryList.splice(i, 1);
				}
			}
		}

		// メンバフォーム初期化
		this.memberForm.setInputFormItems(
			this.createMemberFormInputFormItems());
		this.selectedObjectRoleSelectItems = [];
		this.selectedEntryElementSelectItems = [];

		this.setChangedMembers(true);
		this.setEnableMemberMenuButton();

		this.changed.emit(this.members);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * メンバー一覧を初期化します.
	 * @param projectId プロジェクトID
	 */
	protected initMembers(projectId: number): void {

		// メンバーズ取得
		this.membersService.getByObjectId(projectId).subscribe((res: any) => {

			// 選択中のプロジェクトと異なる場合はメンバ一覧に反映しない
			if (projectId !== this.projectId) {
				return;
			}

			this.members = new EIMMembersDomain(res);

			this.memberDataGrid.setData(this.members?.memberEntryList);
			this.memberDataGrid.refreshView();

			this.initialized.emit(this.members);

		});
	}

	/**
	 * メンバフォームの入力フォームリストを生成します.
	 * @returns メンバフォームの入力フォームリスト
	 */
	protected createMemberFormInputFormItems(): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];

		// 業務役割
		inputFormItems.push(this.responsibleObjectRoleInputFormItemComponentService.createInputFormDomain({
			name: 'responsibleObjectRole', label: this.translateService.instant('EIM_TASKS.LABEL_02035'),
			value: [], definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE, multiple: true,
			selectedObjectRoles: []
		}));

		// エントリの名前
		inputFormItems.push(this.taskObjectRoleEntryInputFormItemComponentService.createInputFormDomain({
			name: 'taskObjectRoleEntry', label: this.translateService.instant('EIM.LABEL_02002'),
			value: [], targetObjectId: this.projectId, multiple: true
		}));

		return inputFormItems;
	}

	/**
	 * メンバ一覧のデータグリッドカラムを初期化します.
	 */
	protected getMemberDataGridColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// 業務役割
		columns.push({headerName: this.translateService.instant('EIM_TASKS.LABEL_02035'), width: 300,
			cellRendererFramework: EIMValueRendererComponent,
			// // headerClass: 'eim-editable-column-header',
			valueGetter(params) {
				let label = '';
				for (let memberRole of params.data.memberRoleList) {
					label += label.length > 0 ? ', ' : '';
					label += memberRole.objectRole.name;
				}

				return label;
			},
			cellRendererParams: {
			// 	iconClassFunctions: [
			// 		this.taskIconClassFunctionService.iconClassFunction.bind(this.taskIconClassFunctionService)
			// 	],
			// 	linkableFunction: (dto: EIMSimpleObjectDTO): boolean => { return true; },
			// 	onClickLinkFunction: this.onClickTask.bind(this),
			}
		});

		// 名前
		columns.push({fieldPath: ['entryElement', 'name'], headerName: this.translateService.instant('EIM.LABEL_02002'), width: 300,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				iconClassFunctions: [
						(memberEntry: EIMMemberEntryDomain): string => {
						if (memberEntry.entryType === 'USER') {
							return 'fa fa-lg eim-icon-user';
						} else if (memberEntry.entryType === 'GROUP') {
							return 'fa fa-lg eim-icon-group';
						}
					}
				]
			}
		});

		// ユーザID
		columns.push({fieldPath: ['entryElement', 'code'], headerName: this.translateService.instant('EIM.LABEL_02001'), width: 120});

		// メール
		columns.push({fieldPath: ['entryElement', 'mail'], headerName: this.translateService.instant('EIM.LABEL_02042'), width: 200});

		return columns;
	}

	/**
	 * メンバー編集の追加、更新、削除ボタンの活性/非活性を設定します.
	 */
	private setEnableMemberMenuButton(): void {
		// 追加ボタン
		if (this.selectedEntryElementSelectItems.length === 0 || this.selectedObjectRoleSelectItems.length === 0) {
			this.getMenuItem(this.membersMenuItems, 'addMember').disabled = true;
		} else {
			this.getMenuItem(this.membersMenuItems, 'addMember').disabled = false;
		}
		// 更新ボタン
		if (this.selectedEntryElementSelectItems.length === 0 || this.selectedObjectRoleSelectItems.length === 0
			|| this.memberDataGrid.getSelectedData().length === 0) {
			this.getMenuItem(this.membersMenuItems, 'updateMember').disabled = true;
		} else {
			this.getMenuItem(this.membersMenuItems, 'updateMember').disabled = false;
		}
		// 削除ボタン
		if (this.memberDataGrid.getSelectedData().length === 0 ) {
			this.getMenuItem(this.membersMenuItems, 'deleteMember').disabled = true;
		} else {
			this.getMenuItem(this.membersMenuItems, 'deleteMember').disabled = false;
		}
	}

	/**
	 * メンバーズ修正済みを設定します.
	 *
	 * @params isChangedMembers メンバーズ修正済みかどうか
	 */
	protected setChangedMembers(isChangedMembers: boolean): void {
		// TODO
		//		this.menuSaveMember.disabled = !isChangedMembers;

		this.isChangedMembers = isChangedMembers;
	}

	/**
	 * エントリIDを指定してメンバエントリ情報一覧から該当のメンバエントリ情報を返却します.
	 *
	 * @param entryId エントリＩＤ
	 * @returns 該当のメンバエントリ情報（該当が存在しなければnull）
	 */
	protected getMemberEntry(entryId: number): EIMMemberEntryDomain {

		for (let memberEntry of this.members.memberEntryList) {
			if (memberEntry.entryElement.id !== entryId) {
				continue;
			}

			return memberEntry;
		}

	}

	/**
	 * メンバロール情報リストの中に対象のオブジェクトロール情報が含まれるかどうかを返却します.
	 *
	 * @param objectRoles オブジェクトロール情報リスト
	 * @param targetObjectRole 検索対象のオブジェクトロール情報
	 * @returns 検索対象のオブジェクトロール情報が含まれる場合true
	 */
	protected hasObjectRole(memberRoles: EIMMemberRoleDomain[], targetObjectRole: EIMObjectRoleDomain): boolean {

		for (let memberRole of memberRoles) {
			if (memberRole?.objectRole?.id === targetObjectRole.id) {
				return true;
			}
		}
		return false;

	}

	/**
	 * メニューアイテムリストから名前を元に対象アイテムを取得します.
	 * @param menuItems 対象メニューアイテムリスト
	 * @param name 選択対象メニュー名称
	 * @return 選択対象メニューアイテム
	 */
	protected getMenuItem(menuItems: EIMMenuItem[], name: string): EIMMenuItem {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].name === name) {
				return menuItems[i];
			}
		}
		return null;
	}

	/**
	 * メンバエントリIDを生成します.
	 * 
	 * @returns メンバエントリID
	 */
	protected createMemberEntryId(): number {
		return --this.memberEntryId;
	}
}
