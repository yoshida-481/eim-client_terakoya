import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMClassService } from 'app/admins/shared/services/apis/class.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

/**
 * クラス更新コンポーネント
 * @example
 *
 *      <eim-class-updator
 *          [adminAppId]="adminAppId"
 *          [objTypeId]="objTypeId"
 *          [rootObjTypeDefName]="rootObjTypeDefName">
 *      </eim-class-updator>
 */
@Component({
    selector: 'eim-class-updator',
    templateUrl: './class-updator.component.html',
    styleUrls: ['./class-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMClassUpdatorComponent) }
    ],
    standalone: false
})

export class EIMClassUpdatorComponent implements OnInit, EIMUpdatable {
	/** フォーマット更新フォーム */
	@ViewChild('classUpdatorForm', { static: true }) classUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** オブジェクトID */
	@Input() objTypeId: number;

	/** ルートタイプ名 */
	@Input() rootObjTypeDefName: string;

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 部品表示フラグ */
	public definitionNameDispFlag = false;
	public borderDispFlag = false;
	public addDocumentFlag = false;
	public addFormFlag = false;
	public requidFlag = false;

	public parentLabel: string;
	public selectorDialogLabel: string;

	public parentObjTypeId: number = null;
	public parentObjTypeName = '';
	public defName: string;
	public namespace: string;

	public nameAutoCreateCheck: boolean;
	public numberAutoCreateCheck: boolean;
	public documentPublicClassName: string;
	public formPublicClassName: string;
	public documentFormatString: string;
	public formFormatString: string;


	public namespaceCreatable: boolean;
	/** ネームスペース一覧表示項目 */
	public namespaceItemList: SelectItem[] = [];

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
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * クラスを更新します.
	 */
	public update(): void {

		let lang: any[] = [];
		for (let i = 0; i < this.languages.length; i++) {
			lang.push({otherLId: this.languages[i].lang, otherName: this.nameList[this.languages[i].lang]});
		}
		let otherCnt = this.languages.length;
		// クラスを更新します．
		if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
			this.objectService.updateForDocument(this.documentFormatString, this.parentObjTypeId, this.namespace, this.defName, this.numberAutoCreateCheck, this.objTypeId, lang).subscribe(
				(data: any) => {
					this.updated.emit(data);
				},
				(err: any) => {
					// エラーの場合
			});
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
			// ネームスペースを設定
			this.namespace = 'app.form.user';
			this.objectService.updateForForm(this.formFormatString, this.parentObjTypeId, this.namespace, this.defName, this.objTypeId, lang).subscribe(
				(data: any) => {
					this.updated.emit(data);
				},
				(err: any) => {
					// エラーの場合
			});
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_TASK) {
			// ネームスペースを設定
			this.namespace = EIMAdminsConstantService.NAMESPACE_TASK_USER;
			this.objectService.update(this.parentObjTypeId, this.defName, this.namespace, this.objTypeId, lang).subscribe(
				(data: any) => {
					this.updated.emit(data);
				},
				(err: any) => {
					// エラーの場合
			});
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
			this.objectService.update(this.parentObjTypeId, this.defName, this.namespace, this.objTypeId, lang).subscribe(
				(data: any) => {
					this.updated.emit(data);
				},
				(err: any) => {
					// エラーの場合
			});
		} else {
		}
	}

	/**
	 * クラス更新可否を返却します.
	 * @return クラス更新可否
	 */
	public updatable(): boolean {
		return this.classUpdatorForm.dirty && this.classUpdatorForm.valid;
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

		if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
			// 表示設定(ドキュメント)
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02292');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01252');
			this.requidFlag = true;
			if ( this.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
				this.borderDispFlag = true;
				this.addDocumentFlag = true;
			} else {
				this.borderDispFlag = false;
				this.addDocumentFlag = false;
			}
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
			// 表示設定(帳票)
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01221');
			this.requidFlag = true;
			this.definitionNameDispFlag = true;
			this.borderDispFlag = true;
			this.addFormFlag = true;
			this.nameAutoCreateCheck = true;
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_TASK) {
			// 表示設定(タスク)
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01221');
			this.requidFlag = true;
			this.definitionNameDispFlag = true;
		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
			// 表示設定(汎用)
			this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
			this.selectorDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_01221');
			this.definitionNameDispFlag = true;
			this.securityService.getNamespaceList().subscribe(
				(namespaceList: EIMSpnameDTO[]) => {
					this.setNamespaceItemList(namespaceList);
					this.namespaceCreatable = true;
				},
				(err: any) => {
					// エラーの場合
					this.errored.emit(err);
			});
		} else {
			this.namespaceItemList = [];
		}

		this.objectService.get(this.objTypeId).subscribe(
			(data: any) => {
				let langs = data[0].lang;
				for (let idx in langs) {
					if (idx) {
						lang = langs[idx];
						this.nameList[lang.attr.otherLId] = lang.attr.otherName;
					} else {
					}
				}
				if (data[0].parentObjTypeId) {
					this.parentObjTypeId = data[0].parentObjTypeId;
					this.parentObjTypeName = data[0].parentObjTypeName;
				}
				if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
					this.numberAutoCreateCheck = data[0].numberAutoCreate;
					this.documentFormatString = data[0].formatString;
					this.documentPublicClassName = data[0].publicClassName;
				} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
					this.formPublicClassName = data[0].publicClassName;
					this.defName = data[0].defNameWhichExceptedNamespace;
					this.formFormatString = data[0].formatString;
				} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL ||
						this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_TASK) {
					this.namespace = data[0].namespace;
					this.defName = data[0].defNameWhichExceptedNamespace;
				}
			},
			(err: any) => {
				// エラーの場合
				this.errored.emit(err);
			}
		);
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickShowObjectTypeSelector(event: any): void {
		// ドキュメントタイプツリーを表示する
		let objTypeId = this.objTypeId;
		// タイプ選択画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassSelector(
				this.adminAppId,
				this.parentObjTypeName,
				this.selectorDialogLabel,
				objTypeId,
				{
					selected: (documentType: any) => {
						// タイプ選択画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
						this.parentObjTypeName = documentType.name;
						this.parentObjTypeId = documentType.id;
					},
					errored: () => {
						// タイプ選択画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					}
				});
				this.classUpdatorForm.form.markAsDirty();
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
