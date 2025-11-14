import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';


import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';


/**
 * セキュリティ更新コンポーネント
 * @example
 *
 *      <eim-security-updator
 *          [adminAppId]="adminAppId"
 *          [secId]="secId">
 *      </eim-security-updator>
 */
@Component({
    selector: 'eim-security-updator',
    templateUrl: './security-updator.component.html',
    styleUrls: ['./security-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMSecurityUpdatorComponent) }
    ],
    standalone: false
})

export class EIMSecurityUpdatorComponent implements OnInit, EIMUpdatable {
	/** セキュリティ更新フォーム */
	@ViewChild('securityUpdatorForm', { static: true }) securityUpdatorForm: NgForm;

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** セキュリティID */
	@Input() secId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** ネームスペース */
	public namespace: string;

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** ネームスペース一覧表示項目 */
	public namespaceItemList: SelectItem[] = [];

	/** ネームスペース選択可否 */
	public namespaceCreatable: boolean;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected adminsSecurityService: EIMAdminsSecurityService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * セキュリティを更新します.
	 */
	public update(): void {
		// セキュリティを更新します．
		if (EIMAdminsConstantService.ADMIN_APP_ID_FORM === this.adminAppId) {
			this.namespace = EIMAdminsConstantService.NAMESPACE_FORM_USER;
		}
		this.adminsSecurityService.update(this.nameList, this.secId, this.namespace).subscribe(
			(data: any) => {
				this.updated.emit(data);
				this.adminDialogManagerComponentService.close(dialogName.SECURITY_UPDATOR);
			}
		);
	}


	/**
	 * セキュリティ更新可否を返却します.
	 * @return セキュリティ更新可否
	 */
	public updatable(): boolean {
		return this.securityUpdatorForm.valid && this.securityUpdatorForm.dirty;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let loopCnt = this.languages.length;
		let lang: any;
		for (let idx = 0; idx < loopCnt; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		let langs: any[];
		this.adminsSecurityService.get(this.secId).subscribe(
			(data: any) => {
				if (data.lang !== undefined) {
					langs = data.lang;
					loopCnt = langs.length === undefined ? 1 : langs.length;
					
					if (loopCnt === 1) {
						this.nameList[data.lang.attr.otherLId] = data.lang.attr.otherName;
					} else {
						for (let i in langs) {
							lang = langs[i];
							this.nameList[lang.attr.otherLId] = lang.attr.otherName;
						}
					}
				}
				// ネームスペース
				this.namespace = data.attr.namespace;
			}, (err: any) => {
				// エラーの場合、ダイアログを閉じる
				this.adminDialogManagerComponentService.close(dialogName.SECURITY_UPDATOR);
			}
		);

		this.namespaceCreatable = false;
		if (EIMAdminsConstantService.ADMIN_APP_ID_GENERAL === this.adminAppId) {
			this.adminsSecurityService.getNamespaceList().subscribe(
				(namespaceList: EIMSpnameDTO[]) => {
					this.setNamespaceItemList(namespaceList);
					this.namespaceCreatable = true;

				}, (err: any) => {
					// エラーの場合、ダイアログを閉じる
					this.adminDialogManagerComponentService.close(dialogName.SECURITY_UPDATOR);
			});
		} else {
			this.namespaceItemList = [];
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
