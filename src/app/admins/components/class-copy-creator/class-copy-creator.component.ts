import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * クラス流用作成コンポーネント
 * @example
 *
 *      <eim-class-copy-creator
 *          [objTypeId]="objTypeId">
 *      </eim-class-copy-creator>
 */
@Component({
    selector: 'eim-class-copy-creator',
    templateUrl: './class-copy-creator.component.html',
    styleUrls: ['./class-copy-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMClassCopyCreatorComponent) }
    ],
    standalone: false
})

export class EIMClassCopyCreatorComponent implements OnInit, EIMCreatable {
	/** クラス流用作成フォーム */
	@ViewChild('classCopyCreatorForm', { static: true }) classCopyCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** オブジェクトID */
	@Input() objTypeId: number;

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};
	public newNameList: { [key: string]: string; } = {};

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ラベル設定 */
	public parentLabel: string;

	/** ダイアログラベル */
	public dialogLabel: string;

	/** 親オブジェクトタイプID */
	public parentObjTypeId: number;

	/** ネームスペース */
	public namespace: string;

	/** 親オブジェクトタイプ名 */
	public parentObjTypeName: string;

	/** 定義名称 */
	public definitionName: string;

	/** 新定義名称 */
	public newDefinitionName: string;

	/** 公開クラス名 */
	public publicClassName: string;

	/** フォーマット名 */
	public formatString: string;

	/** 名称自動生成 */
	public nameAutoCreateCheck: boolean;

	/** 親クラスの採番を使用 */
	public parentSequenceCheck: boolean;

	/** ネームスペース作成可否 */
	public namespaceCreatable: boolean;

	/** ネームスペース一覧表示項目 */
	public namespaceItemList: SelectItem[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected securityService: EIMAdminsSecurityService,
		protected objectService: EIMObjectService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * クラスをコピー登録します.
	 */
	public create(): void {
		let lang: any[] = [];
		for (let i = 0; i < this.languages.length; i++) {
			lang.push({otherLId: this.languages[i].lang, otherName: this.newNameList[this.languages[i].lang]});
		}
		// クラスをコピー登録します．
		this.objectService.createCopyObject(this.formatString, this.parentSequenceCheck, this.parentObjTypeId,
			this.namespace, this.newDefinitionName, this.objTypeId, lang).subscribe(
				(data: any) => {
					this.created.emit(data);
				},
				(err: any) => {
					// エラーの場合
					this.errored.emit(err);
				});
	}

	/**
	 * クラス登録可否を返却します.
	 * @return クラス登録可否
	 */
	public creatable(): boolean {
		return this.classCopyCreatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}
		this.namespaceCreatable = false;

		// 表示設定
		this.parentLabel = this.translateService.instant('EIM_ADMINS.LABEL_02286');
		this.nameAutoCreateCheck = true;

		this.securityService.getNamespaceList().subscribe(
			(namespaceList: EIMSpnameDTO[]) => {
				this.setNamespaceItemList(namespaceList);
				this.namespaceCreatable = true;
			}, (err: any) => {
				// エラーの場合
				this.errored.emit(err);
		});
		// 名前取得
		this.objectService.get(this.objTypeId).subscribe(
			(data: any) => {
				let langs = data[0].lang;
				for (let idx in langs) {
					if (idx) {
						lang = langs[idx];
						this.nameList[lang.attr.otherLId] = lang.attr.otherName;
						this.newNameList[lang.attr.otherLId] = lang.attr.otherName;
					} else {
					}
				}
				this.parentObjTypeName = data[0].parentObjTypeName;
				this.parentObjTypeId = data[0].parentObjTypeId;
				this.publicClassName = data[0].publicClassName;
				this.newDefinitionName = this.translateService.instant('EIM_ADMINS.LABEL_02278') + data[0].defNameWhichExceptedNamespace;
				this.definitionName = data[0].defNameWhichExceptedNamespace;
				this.formatString = data[0].formatString;
				this.namespace = data[0].namespace;
			}, (err: any) => {
				// エラーの場合
				this.errored.emit(err);
			}
		);
	}

	/**
	 * 親クラスの採番を使用チェックボックス押下時のイベント
	 * @param event 設定値
	 */
	public parentSequenceChangeCheckbox(event: any): void {
		if (event === true) {
			this.nameAutoCreateCheck = false;
		} else {
			this.nameAutoCreateCheck = true;
		}
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
