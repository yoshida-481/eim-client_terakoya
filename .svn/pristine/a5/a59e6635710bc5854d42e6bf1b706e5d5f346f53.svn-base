import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { NgForm } from '@angular/forms';
import { Component, OnInit, forwardRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMObjectNameRendererComponent } from 'app/object-editors/shared/components/renderer/object-name-renderer.component';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectTypeDTO } from 'app/object-editors/shared/dtos/object-type.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * オブジェクト選択コンポーネント
 * @example
 * 		<eim-object-selector>
 * 		</eim-object-selector>
 */
@Component({
    selector: 'eim-object-selector',
    templateUrl: './object-selector.component.html',
    styleUrls: ['./object-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMObjectSelectorComponent) }],
    standalone: false
})
export class EIMObjectSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMComponent, EIMSelectable {

	/** データグリッドコンポーネント */
	@ViewChild('objectDataGrid', { static: true }) objectDataGrid: EIMDataGridComponent;

	/** フォーム */
	@ViewChild('validForm', { static: true }) validForm: NgForm;

	/** オブジェクト選択処理完了のイベントエミッタ */
	@Output() selected: EventEmitter<EIMObjectDTO[]> = new EventEmitter<EIMObjectDTO[]>();

	/** オブジェクトID */
	public objId: string[] = [''];

	/** オブジェクト名 */
	public objName = '';

	/** オブジェクトタイプ */
	public objType = {id: null, name: ''};

	/** 定数クラス */
	public number_pattern= EIMConstantService.NUMBER_PATTERN;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return this.objectDataGrid.getSelectedData().length > 0;
	}

	/**
	 * 選択したオブジェクトをselectedエミッタで親に通知します。
	 */
	public select(): void {
		let selectedData = this.objectDataGrid.getSelectedData();
		this.selected.emit(selectedData[0]);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ
	 */
	ngOnInit(): void {
		// カラム設定
		let columns: EIMDataGridColumn[] = [];
		columns.push({field: 'id', headerName: this.translateService.instant('EIM.LABEL_02027'), width: 80}); // ID
		columns.push({field: 'typeName', headerName: this.translateService.instant('EIM.LABEL_02060'), width: 216, cellRendererFramework: EIMObjectNameRendererComponent}); // オブジェクトタイプ
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 216}); // 名前
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02064'), width: 100, cellStyle: {'text-align': 'right'}}); // リビジョン
		this.objectDataGrid.setColumns(columns);
	}

	/**
	 * オブジェクトタイプ削除アイコン選択イベントハンドラ
	 */
	onClickDeleteObjectType(): void {
		this.objType = {id: null, name: ''};
	}

	/**
	 * オブジェクトタイプ選択クリックイベントハンドラ
	 */
	onClickSelectObjectType(): void {
		let dialogId = this.objectEditorDialogManagerComponentService.showObjectTypeSelector({
			selected: (selectedData: EIMObjectTypeDTO) => {
				this.objectEditorDialogManagerComponentService.close(dialogId);
				// 選択したオブジェクトタイプ名,IDを反映する
				this.objType.name = selectedData.name;
				this.objType.id = selectedData.id;
			}
		});
	}

	/**
	 * 検索ボタンクリックイベントハンドラ
	 */
	onClickSearch(): void {
		let id: number = null
		if (this.objId[0]) {
			id = Number(this.objId[0]);
		}
		this.objectEditorsObjectService.searchObjectTypeList(id, this.objName, this.objType.id).subscribe(
			(res: EIMObjectDTO[]) => {
				this.objectDataGrid.setData(res);
			}
		);
	}

	/**
	 * クリアボタンクリックイベントハンドラ
	 */
	onClickClear(): void {
		this.objId[0] = '';
		this.objName = '';
		this.objType = {id: null, name: ''};
	}


	/**
	 * オブジェクト検索可否を返却します.
	 * @return オブジェクト検索可否
	 */
	searchable(): boolean {
		return this.validForm.valid;
	}
}
