import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsSecurityService, EIMSecurity } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMSecurityDTO } from 'app/admins/shared/dtos/security.dto';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';


/**
 * セキュリティ登録コンポーネント
 * @example
 *
 *      <eim-security-creator
 *          [adminAppId]="adminAppId">
 *      </eim-security-creator>
 */
@Component({
    selector: 'eim-security-creator',
    templateUrl: './security-creator.component.html',
    styleUrls: ['./security-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMSecurityCreatorComponent) }
    ],
    standalone: false
})

export class EIMSecurityCreatorComponent implements OnInit, EIMCreatable {
	/** セキュリティフォーム */
	@ViewChild('securityCreatorForm', { static: true }) securityCreatorForm: NgForm;

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** ネームスペース */
	public namespace = '';

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** ネームスペース一覧表示項目 */
	public namespaceItemList: SelectItem[] = [];

	/** ネームスペース選択可否 */
	public namespaceCreatable: boolean;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected securityService: EIMAdminsSecurityService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * セキュリティを登録します.
	 */
	public create(): void {
		// セキュリティを登録します．
		let statusType: string;
		if (EIMAdminsConstantService.ADMIN_APP_ID_FORM === this.adminAppId) {
			this.namespace = EIMAdminsConstantService.NAMESPACE_FORM_USER;
		}
		else if (EIMAdminsConstantService.ADMIN_APP_ID_TASK === this.adminAppId) {
			this.namespace = EIMAdminsConstantService.NAMESPACE_TASK_USER;
		}

		this.securityService.create(this.nameList, this.namespace).subscribe(
			(data: any) => {
				this.created.emit(data);
				this.adminDialogManagerComponentService.close(dialogName.SECURITY_CREATOR);
			},
		);
	}


	/**
	 * セキュリティ登録可否を返却します.
	 * @return セキュリティ登録可否
	 */
	public creatable(): boolean {
		return this.securityCreatorForm.valid;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		this.namespaceCreatable = false;
		if (EIMAdminsConstantService.ADMIN_APP_ID_GENERAL === this.adminAppId) {
			this.securityService.getNamespaceList().subscribe((namespaceList: EIMSpnameDTO[]) => {
				this.setNamespaceItemList(namespaceList);
				this.namespaceCreatable = true;
			}, (err: any) => {
				// エラーの場合
				this.adminDialogManagerComponentService.close(dialogName.SECURITY_CREATOR);
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
