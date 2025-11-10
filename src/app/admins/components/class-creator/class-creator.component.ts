import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMClassService } from 'app/admins/shared/services/apis/class.service';
import { EIMRelationTypeDTO } from 'app/admins/shared/dtos/relation-type.dto';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

/**
 * クラス登録コンポーネント
 * @example
 *
 *      <eim-class-creator
 *          [adminAppId]="adminAppId"
 *          [objTypeId]="objTypeId"
 *          [objTypeName]="objTypeName"
 *          [rootObjTypeDefName]="rootObjTypeDefName">
 *      </eim-class-creator>
 */
@Component({
    selector: 'eim-class-creator',
    templateUrl: './class-creator.component.html',
    styleUrls: ['./class-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMClassCreatorComponent) }
    ],
    standalone: false
})

export class EIMClassCreatorComponent implements OnInit, EIMCreatable {
	/** リレーション登録フォーム */
	@ViewChild('classCreatorForm', { static: true }) classCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 部品表示フラグ */
	public definitionNameDispFlag = false;

	/** 採番詳細設定枠表示フラグ */
	public borderDispFlag = false;

	/** 必須フラグ */
	public requidFlag = false;

	/** ドキュメント用項目表示フラグ */
	public addDocDispFlag = false;

	/** 帳票用項目表示フラグ */
	public addFormDispFlag = false;

	/** 親ラベル */
	public parentLabel: string;

	/** ダイアログラベル */
	public selectorDialogLabel: string;

	/** 親オブジェクトタイプID */
	public parentObjTypeId: number;

	/** 定義名称 */
	public defName = '';

	/** ネームスペース */
	public namespace = '';

	/** 付加文字列(ドキュメント) */
	public documentFormatString = '';

	/** 付加文字列(帳票) */
	public formFormatString = '';

	/** 名称自動生成 */
	public nameAutoCreateCheck = true;

	/** 自動採番 */
	public numberAutoCreateCheck = false;

	/** 親クラスの採番を使用(ドキュメント) */
	public documentParentSequenceCheck = false;

	/** 親クラスの採番を使用(帳票) */
	public formParentSequenceCheck = false;

	/** 親クラス名 */
	public parentObjTypeName: string;

	/** ネームスペース作成可否 */
	public namespaceCreatable: boolean;

	/** ネームスペース一覧表示項目 */
	public namespaceItemList: SelectItem[] = [];

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** オブジェクトID */
	@Input() objTypeId: number;

	/** オブジェクト名 */
	@Input() objTypeName: string;

	/** ルートタイプ名 */
	@Input() rootObjTypeDefName: string;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected securityService: EIMAdminsSecurityService,
			protected objectService: EIMObjectService,
			protected classService: EIMClassService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
			protected messageService: EIMMessageService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * クラスを登録します.
	 */
	public create(): void {
		let lang: any[] = [];
		for (let i = 0; i < this.languages.length; i++) {
			lang.push({otherLId: this.languages[i].lang, otherName: this.nameList[this.languages[i].lang]});
		}
		if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
		// クラス(ドキュメント)を登録します．
		this.objectService.createForDocument(this.documentFormatString, this.documentParentSequenceCheck, this.parentObjTypeId,
			this.namespace, this.defName, this.numberAutoCreateCheck, lang)
				.subscribe(
					(data: any) => {
						this.created.emit(data);
					}
				);
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
			// ネームスペースを設定
			this.namespace = 'app.form.user';
			// クラス(帳票)を登録します．
			this.objectService.createForForm(this.formFormatString, this.formParentSequenceCheck, this.parentObjTypeId,
				this.namespace, this.defName, lang)
					.subscribe(
						(data: any) => {
						this.created.emit(data);
						}
					);
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_TASK) {
			// ネームスペースを設定
			this.namespace = EIMAdminsConstantService.NAMESPACE_TASK_USER;
			// クラス(タスク)を登録します．
			this.objectService.create(this.parentObjTypeId, this.defName, this.namespace, lang)
					.subscribe(
						(data: any) => {
						this.created.emit(data);
						}
					);
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
			// クラス(汎用)を登録します．
			this.objectService.create(this.parentObjTypeId, this.defName, this.namespace, lang)
				.subscribe(
					(data: any) => {
						this.created.emit(data);
					}
				);
		} else {
			return;
		}
	}

	/**
	 * クラス登録可否を返却します.
	 * @return クラス登録可否
	 */
	public creatable(): boolean {
		if (this.requidFlag) {
			return this.parentObjTypeId && this.classCreatorForm.valid;
		} else {
			return this.classCreatorForm.valid;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		this.languages = this.localStorageService.getLanguages();
		if (this.languages) {
			this.errored.emit();
		}
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}
		this.namespaceCreatable = false;

		if (this.objTypeId !== null) {
			// 親画面で選択したオブジェクトを親オブジェクトに設定
			this.parentObjTypeName = this.objTypeName;
			this.parentObjTypeId = this.objTypeId;
			if (this.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
				this.borderDispFlag = true;
				this.addDocDispFlag = true;
			} else {
				this.borderDispFlag = false;
				this.addDocDispFlag = false;
			}
		} else {
			if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
				this.borderDispFlag = true;
				this.addDocDispFlag = true;
			}
		}

		if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
			// 表示設定
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02292');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01252');
			this.requidFlag = true;
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
			// 表示設定
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01221');
			this.definitionNameDispFlag = true;
			this.borderDispFlag = true;
			this.addFormDispFlag = true;
			this.requidFlag = true;
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_TASK) {
			// 表示設定
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01221');
			this.definitionNameDispFlag = true;
			this.requidFlag = true;
		} else if (EIMAdminsConstantService.ADMIN_APP_ID_GENERAL === this.adminAppId) {
			// 表示設定
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01221');
			this.definitionNameDispFlag = true;

			this.securityService.getNamespaceList().subscribe(
				(namespaceList: EIMSpnameDTO[]) => {
					this.setNamespaceItemList(namespaceList);
					this.namespaceCreatable = true;
				}, (err: any) => {
					// エラーの場合
					this.errored.emit(err);
			});
		} else {
			this.namespaceItemList = [];
		}
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickShowObjectTypeSelector(event: any): void {
		// ドキュメントタイプツリーを表示する
		let dialogId: string = this.adminDialogManagerComponentService.showClassSelector(
				this.adminAppId,
				this.parentObjTypeName,
				this.selectorDialogLabel,
				null,
				{
					selected: (documentType: any) => {
						// タイプ選択画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
						this.parentObjTypeName = documentType.name;
						this.parentObjTypeId = documentType.id;
						if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
							if (documentType.definitionName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
								this.borderDispFlag = true;
								this.addDocDispFlag = true;
							} else {
								this.borderDispFlag = false;
								this.addDocDispFlag = false;
							}
						}
					},
					errored: () => {
						// タイプ選択画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * 親クラスの採番を使用チェックボックス押下時イベントハンドラ
	 * @param event 設定値
	 */
	private formParentSequenceChangeCheckbox(event: any): void {
			if (event.checked === true) {
				this.nameAutoCreateCheck = false;
			} else {
				this.nameAutoCreateCheck = true;
			}
	}

	/**
	 * 親クラスの採番を使用チェックボックス押下時イベントハンドラ
	 * @param event 設定値
	 */
	private documentParentSequenceChangeCheckbox(event: any): void {
		this.documentParentSequenceCheck = true;
		if (event.checked === true && this.numberAutoCreateCheck === true) {
			this.numberAutoCreateCheck = false;
		} else if (event.checked === false) {
			this.documentParentSequenceCheck = false;
		}
	}

	/**
	 * 番号自動生成チェックボックス押下時イベントハンドラ
	 * @param event 設定値
	 */
	private numberAutoCreateChangeCheckbox(event: any): void {
		this.numberAutoCreateCheck = true;
		if (event.checked === true && this.documentParentSequenceCheck === true) {
			this.documentParentSequenceCheck = false;
		} else if (event.checked === false) {
			this.numberAutoCreateCheck = false;
		}
	}

	/**
	 * 親グループ削除ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDeletePrentType(event: any): void {
		this.parentObjTypeId = null;
		this.parentObjTypeName = null;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ネームスペースのドロップダウンリスト用のデータを生成します.
	 * @param namespaceList ネームスペース配列
	 */
	protected setNamespaceItemList(namespaceList: any[]): void {
		this.namespaceItemList = [];
		let loopCnt = namespaceList.length;
		let namespace: any;
		this.namespaceItemList.push({label: this.translateService.instant('EIM_ADMINS.LABEL_02065'), value: ''});
		for (let idx = 0; idx < loopCnt; idx++) {
			namespace = namespaceList[idx];
			this.namespaceItemList.push({label: namespace.name, value: namespace.name});
		}
	}
}
