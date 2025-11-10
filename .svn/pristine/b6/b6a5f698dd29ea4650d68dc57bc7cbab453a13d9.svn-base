import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMDisabledNameRendererComponent } from 'app/admins/shared/components/renderer/disabled-name-renderer.component';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';
import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { EIMAttributeComponent } from 'app/admins/components/attribute/attribute.component';
import { EIMCheckEssentialRendererComponent } from 'app/admins/shared/components/renderer/check-essential-renderer.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AngularSplitModule } from 'angular-split';


/**
 * 帳票用属性管理コンポーネント
 * @example
 *
 *      <eim-form-attribute>
 *      </eim-form-attribute>
 */
@Component({
	selector: 'eim-form-attribute',
	templateUrl: './attribute.component.html',
	styleUrls: ['./attribute.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,

		TabsModule,
		PanelModule,
		InputTextModule,
		AngularSplitModule
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormAttributeComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFormAttributeComponent extends EIMAttributeComponent implements EIMAdminMainComponent, OnInit {

	/** データ型一覧 */
	public dataTypeList: EIMDataTypeDomain[];

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		super.setState(state);
		if (state && state.dataTypeList) {
			this.dataTypeList = state.dataTypeList;
			this.createAttributeMenuItem.disabled = false;
		} else {
			this.show();
		}
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		let params = super.getState();
		params.dataTypeList = this.dataTypeList;
		return params;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 定義名称
		columns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 295});
		// 名称
		columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 295,
			cellRendererFramework: EIMAdminNameRendererComponent});
		// データ型
		columns.push({field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 130});
		// 複数値
		columns.push({field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 85});
		// UIコントロール
		columns.push({field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 150});
		// 必須項目
		columns.push({field: 'attTypeEssential', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02244'),
			cellRendererFramework: EIMCheckEssentialRendererComponent, width: 80});
		// コードタイプ
		columns.push({field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 150});
		// 初期値
		columns.push({field: 'defValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 130,
			cellRendererFramework: EIMDefaultListRendererComponent});
		this.attributeDataGrid.setColumns(columns);

		let codeTypeColumns: EIMDataGridColumn[] = [];
		// 名前
		codeTypeColumns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 645});
		this.codeTypeDataGrid.setColumns(codeTypeColumns);
		let codeColumns: EIMDataGridColumn[] = [];
		// コード
		codeColumns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02119'),
			cellRendererFramework: EIMDisabledNameRendererComponent, width: 200, suppressSorting: true, suppressFilter: true});
		// 名前
		codeColumns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'),
			cellRendererFramework: EIMDisabledNameRendererComponent, width: 350, suppressSorting: true, suppressFilter: true});
		this.codeDataGrid.setColumns(codeColumns);
	}

	/**
	 * 属性登録メニュー押下時のイベントハンドラ
	 * 属性登録ダイアログを表示します.
	 */
	onClickAttributeCreator(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showFormAttributeCreator(this.dataTypeList, {
			created: (attributeList: EIMAttributeTypeDTO[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.attributeDataGrid.addRowData(attributeList);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * 属性更新メニュー押下時のイベントハンドラ
	 * 属性更新ダイアログを表示します.
	 */
	onClickAttributeUpdator(): void {
		this.adminAttributeService.getAttributeType(this.attributeDataGrid.getSelectedData()[0].attTypeId).subscribe(
			(data: EIMAdminAttributeTypeDomain) => {
				let dialogId: string = this.adminDialogManagerComponentService.showFormAttributeUpdator(this.dataTypeList, data, {
					updated: (attributeList: EIMAttributeTypeDTO[]) => {
						this.adminDialogManagerComponentService.close(dialogId);
						this.attributeDataGrid.updateRowData(attributeList);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
					},
					errored: () => {
						this.adminDialogManagerComponentService.close(dialogId);
					}
				});
			}
		);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 */
	protected show(): void {
		if (!this.dataTypeList) {
			this.adminAttributeService.getUIControlList()
			.subscribe((object: EIMDataTypeDomain[]) => {
				this.createAttributeMenuItem.disabled = false;
				this.dataTypeList = object;
			});
		}
	}

	/**
	 * 属性選択時のボタン活性制御
	 */
	protected enableButtonSelectedAttribute(): void {
		let selectedAttribute = this.attributeDataGrid.getSelectedData();
		if (selectedAttribute.length === 0) {
			this.updateAttributeMenuItem.disabled = true;
			this.deleteAttributeMenuItem.disabled = true;
		} else {
			// UIコントロールが取得出来ていない場合は非活性
			this.updateAttributeMenuItem.disabled = !this.dataTypeList;
			this.deleteAttributeMenuItem.disabled = false;
		}
	}

}
