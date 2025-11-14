import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { Subscription } from 'rxjs';

const IGNORE_UI_CONTROL = 'uIControlFile';
const PERMIT_VAL_TYPE = 6;

/**
 * 引継ぎ・関連付け更新コンポーネント
 * @example
 *
 *      <eim-class-updator
 *          [objTypeId]="objTypeId">
 *      </eim-class-updator>
 */
@Component({
    selector: 'eim-class-attribute-type-inheritance-and-relation-updator',
    templateUrl: './class-attribute-type-inheritance-and-relation-updator.component.html',
    styleUrls: ['./class-attribute-type-inheritance-and-relation-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMClassAttributeTypeInheritanceAndRelationUpdatorComponent) }
    ],
    standalone: false
})

export class EIMClassAttributeTypeInheritanceAndRelationUpdatorComponent implements OnInit, EIMUpdatable, OnDestroy {
	/** フォーマット更新フォーム */
	@ViewChild('classAttributeTypeInheritanceAndRelationUpdatorForm', { static: true }) classAttributeTypeInheritanceAndRelationUpdatorForm: NgForm;

	@ViewChild('classAttributeTypeInheritanceAndRelationUpdatorDataGrid', { static: true }) classAttributeTypeInheritanceAndRelationUpdatorDataGrid: EIMDataGridComponent;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** オブジェクトID */
	@Input() objTypeId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 全選択・解除用カウント */
	public totalRelationCount = 0;

	/** チェックボックス変更サブスクリプション */
	private checked: Subscription;

	/** 引継ぎ全選択解除チェックボックス */
	public allInheritanceCheck: boolean;

	/** 関連付け全選択解除チェックボックス */
	public allRelatiionCheck: boolean;

	public filterString = '';

	public dataGrid: any[];

	public updateFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected securityService: EIMAdminsSecurityService,
		protected objectService: EIMObjectService,
		protected attributeTypeService: EIMAttributeTypeService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected checkboxRendererComponentService: EIMCheckboxRendererComponentService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
		this.checked = checkboxRendererComponentService.changed.subscribe((target: any) => {
			window.setTimeout(() => {
				this.onChangeFlag();
			});
		});

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 引継ぎ・関連付けを更新します.
	 */
	public update(): void {
		let attTypeId: number[] = [];
		let inheritanceFlag: boolean[] = [];
		let relationFlag: boolean[] = [];
		// 現在表示されてるグリッド取得
		let tmpDataGrid = this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.getData();
		// 現在表示されてるグリッドの変更取り込み
		for (let i = 0; i < this.dataGrid.length; i++) {
			for (let j = 0; j < tmpDataGrid.length; j++) {
				if (this.dataGrid[i].attTypeId === tmpDataGrid[j].attTypeId) {
					this.dataGrid[i].inheritanceFlag = tmpDataGrid[j].inheritanceFlag;
					this.dataGrid[i].relationFlag = tmpDataGrid[j].relationFlag;
				}
			}
			attTypeId.push(this.dataGrid[i].attTypeId);
			inheritanceFlag.push(this.dataGrid[i].inheritanceFlag);
			relationFlag.push(this.dataGrid[i].relationFlag);
		}
		// 引継ぎ・関連付け更新処理
		this.objectService.createInheritanceAndRelationAttributeType(attTypeId, this.objTypeId, inheritanceFlag, relationFlag)
			.subscribe(
				(data: any) => {
					this.updated.emit(data);
				},
				(err: any) => {
					this.errored.emit(err);
				}
			);
	}

	/**
	 * 引継ぎ・関連付け更新可否を返却します.
	 * @return 引継ぎ・関連付け更新可否
	 */
	public updatable(): boolean {
		return this.updateFlag;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		let columns: EIMDataGridColumn[] = [];
		// リビジョンアップ時に引継ぐ
		columns.push({field: 'inheritanceFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02294'), cellStyle: {'padding-left': '90px'}, width: 200, cellRendererFramework: EIMCheckboxRendererComponent});
		// 最新のリビジョンに関連付け
		columns.push({field: 'relationFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02295'), cellStyle: {'padding-left': '90px'}, width: 200, cellRendererFramework: EIMCheckboxRendererComponent,
				param: {
					visibleFunction: (data: any): boolean => {
						if (data.uiControlId !== IGNORE_UI_CONTROL) {
							return true;
						} else {
							return false;
						}
					}
				}
		});
		// 名前
		columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 200});
		this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.setColumns(columns);
		// リスト作成
		this.attributeTypeService.getList(this.objTypeId).subscribe(
			(data: any[]) => {
				let objData: any[] = [];
				for (let i = 0; i < data.length; i++) {
					if (data[i].valTypeId === EIMAdminsConstantService.VALUE_TYPE_OBJECT) {
						objData.push(data[i]);
					}
				}
				this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.setData(objData);
				// relationFlagの件数取得
				for (let j = 0; j < objData.length; j++) {
					if (objData[j].uiControlId !== IGNORE_UI_CONTROL) {
						this.totalRelationCount++;
					}
				}
				// リスト保持
				this.dataGrid = this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.getData();
				// 引継ぎ・関連付け全選択解除設定
				this.onChangeFlag(true);
			}, (err: any) => {
				// エラーの場合
				this.errored.emit(err);
			}
		);
	}

	/**
	 * 引継ぎ・関連付けフラグ変更イベント
	 */
	public onChangeFlag(initFlag?: boolean): void {
		if (!initFlag) {
			this.updateFlag = true;
		}
		let nowInheritanceCount = 0;
		let nowRelationCount = 0;
		let gridData = this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.getData();
		// 現在のチェック数カウント
		for (let i = 0; i < gridData.length; i++) {
			if (gridData[i].inheritanceFlag === true) {
				nowInheritanceCount++;
			}
			if (gridData[i].relationFlag === true) {
				nowRelationCount++;
			}
		}
		// 現在のチェック数によって全選択解除チェックボックス設定
		if (gridData.length !== 0 && nowInheritanceCount === gridData.length) {
			this.allInheritanceCheck = true;
		} else {
			this.allInheritanceCheck = false;
		}
		if (this.totalRelationCount !== 0 && nowRelationCount === this.totalRelationCount) {
			this.allRelatiionCheck = true;
		} else {
			this.allRelatiionCheck = false;
		}
	}

	/**
	 * 引継ぎ全選択解除チェックボックス押下イベントハンドラ
	 * @param event 設定値
	 */
	public onChangeAllInheritanceCheck(event: any): void {
		this.updateFlag = true;
		let gridData = this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.getData();
		if (event === true) {
			for (let i = 0; i < gridData.length; i++) {
				gridData[i].inheritanceFlag = true;
			}
		} else {
			for (let i = 0; i < gridData.length; i++) {
				gridData[i].inheritanceFlag = false;
			}
		}
		this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.refreshView();
	}

	/**
	 * 関連付け全選択解除チェックボックス押下イベントハンドラ
	 * @param event 設定値
	 */
	public onChangeAllRelationCheck(event: any): void {
		this.updateFlag = true;
		let gridData = this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.getData();
		if (event === true) {
			for (let i = 0; i < gridData.length; i++) {
				// UIコントロールがファイル以外にチェック
				if (gridData[i].uiControlId !== IGNORE_UI_CONTROL) {
					gridData[i].relationFlag = true;
				}
			}
		} else {
			for (let i = 0; i < gridData.length; i++) {
				gridData[i].relationFlag = false;
			}
		}
		this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.refreshView();
	}

	/**
	 * フィルターボタン押下イベントハンドラ
	 */
	public onClickFilter(): void {
		// 現在表示されているグリッド取得
		let tmpDataGrid = this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.getData();
		// 現在表示されているグリッドの変更取り込み
		for (let i = 0; i < this.dataGrid.length; i++) {
			for (let j = 0; j < tmpDataGrid.length; j++) {
				if (this.dataGrid[i].attTypeId === tmpDataGrid[j].attTypeId) {
					this.dataGrid[i].inheritanceFlag = tmpDataGrid[j].inheritanceFlag;
					this.dataGrid[i].relationFlag = tmpDataGrid[j].relationFlag;
				}
			}
		}
		tmpDataGrid = [];
		// 絞り込み表示
		tmpDataGrid = this.filter();
		this.classAttributeTypeInheritanceAndRelationUpdatorDataGrid.setData(tmpDataGrid);
		this.totalRelationCount = 0;
		// 関連付け全選択解除にて利用するカウント取得
		for (let i = 0; i < tmpDataGrid.length; i++) {
			if (tmpDataGrid[i].uiControlId !== IGNORE_UI_CONTROL) {
				this.totalRelationCount++;
			}
		}
		this.onChangeFlag();
	}

	ngOnDestroy() {
		if (!this.checked.closed) {
			this.checked.unsubscribe();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 絞り込み
	 */
	private filter(): any[] {
		let tmpDataGrid: any[] = [];
		if (this.filterString === null || this.filterString.length === 0) {
			return this.dataGrid;
		}
		for (let i = 0; i < this.dataGrid.length; i++) {
			if (this.dataGrid[i].attTypeName.indexOf(this.filterString) !== -1) {
				tmpDataGrid.push(this.dataGrid[i]);
			}
		}
		return tmpDataGrid;
	}
}
