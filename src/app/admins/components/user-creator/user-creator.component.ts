import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsAuthenticationService, EIMAuth, EIMAdminAuth, EIMAdminType } from 'app/admins/shared/services/apis/authentication.service';
import { EIMUserService } from 'app/admins/shared/services/apis/user.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { SelectItem } from 'primeng/api';

/**
 * ユーザ登録コンポーネント
 * @example
 *
 *      <eim-user-creator
 *          [nameList]="nameList"
 *          [revup]="revup"
 *          [mutual]="mutual">
 *      </eim-user-creator>
 */
@Component({
    selector: 'eim-user-creator',
    templateUrl: './user-creator.component.html',
    styleUrls: ['./user-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMUserCreatorComponent) }
    ],
    standalone: false
})

export class EIMUserCreatorComponent implements OnInit, EIMCreatable {

	/** ユーザ登録フォーム */
	@ViewChild('userCreatorForm', { static: true }) userCreatorForm: NgForm;

	/** ユーザ登録属性入力項目フォーム */
	@ViewChild('userCreatorAttributeForm', { static: true }) userCreatorAttributeForm: NgForm;

	/** ID */
	@Input() userCode: string;

	/** かな */
	@Input() userKana: string;

	/** Mail */
	@Input() userMail: string;

	/** 管理者権限タイププルダウンメニューの選択中の番号 */
	@Input() selectedAdminIdx: number;

	/** パスワード */
	@Input() userPass = '';

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 言語ID */
	public langId = 'JA';

	/** 管理者権限チェックボックスリスト */
	public authorityList: { [key: string]: boolean; } = {};

	/** プルダウンメニューに設定するシステム管理者タイプリスト */
	public userAdminSelectItems: SelectItem[] = [];

	/** 使用可能権限リスト */
	public auths: EIMAuth[];

	/** 使用可能管理者権限タイプリスト */
	public adminTypeArray: EIMAdminType[] = [];

	/** 無効フラグ */
	public userDisable = '0';

	/** 受信メール言語 */
	public userLang: string;

	/** 受信メール言語リスト */
	public userLangSelectItems: SelectItem[] = [];

	/** 属性一覧 */
	public attributeList: EIMUserAttributeDTO[] = [];

	/** 登録した属性リスト */
	public attvalueList: { [key: string]: any[]; } = {};

	/** 汎用管理フラグ */
	public generalFlg = false;
	/** ドキュメント管理フラグ */
	public documentFlg = false;
	/** 帳票管理フラグ */
	public formFlg = false;
	/** タスク管理フラグ */
	public taskFlg = false;

	/** 管理者権限チェック不可フラグ */
	public adminCheckDisableFlg = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminEntryService: EIMAdminsEntryService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected authenticationService: EIMAdminsAuthenticationService,
		protected userService: EIMUserService,
		protected objectService: EIMObjectService,
		protected serverConfigService: EIMServerConfigService,

	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ユーザを登録します.
	 */
	public create(): void {
		// 権限の計算
		let userAdminValue = 0;
		for (let i = 0; i < this.auths.length; i++) {
			let auth = this.auths[i];
			if (this.authorityList[auth.authId]) {
			 userAdminValue += auth.authValue;
			}
		}
		// ユーザを登録します．
		this.adminEntryService.createUser(this.nameList, this.userCode, this.userKana, this.userMail, userAdminValue, Number(this.userDisable), this.userLang, this.attributeList, this.userPass).subscribe(
			(data: any) => {
				this.created.emit(data);

			},
			(err: any) => {
				this.errored.emit(err);
			}
		);
	}

	/**
	 * ユーザ登録可否を返却します.
	 * @return ユーザ登録可否
	 */
	public creatable(): boolean {
		return this.userCreatorForm.valid && this.userCreatorAttributeForm.valid && this.userPass.length > 0;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		this.langId = this.localStorageService.getLangId();
		let attributeTreeFlg = this.serverConfigService.attributeTreeView;
	
		this.authenticationService.getAdminAuth().subscribe(
			(data: EIMAdminAuth) => {
				// 管理者権限
				for (let idx in data.authListApplicationArray) {
					if (idx) {
						if (this.adminAppId === data.authListApplicationArray[idx].applicationId) {
							this.auths = data.authListApplicationArray[idx].authArray.filter(function( auth ) {
								return !(auth.authId == 'attributeTree' && !attributeTreeFlg);
							});
						}
					}
				}

				// 管理権限チェックボックス初期化
				for (let idx = 0; idx < this.auths.length; idx++ ) {
					let auth = this.auths[idx];
					this.authorityList[auth.authId] = false;
				}

				// システム管理者タイプ
				for (let idx in data.adminTypeListApplicationArray) {
					if (idx) {
						if (this.adminAppId === data.adminTypeListApplicationArray[idx].applicationId) {
							this.adminTypeArray = data.adminTypeListApplicationArray[idx].adminTypeArray;
							// ユーザ登録で表示するタイプ
							this.userAdminSelectItems = this.userService.getUserAdminItems(false, this.langId, this.adminTypeArray);
						}
					}
				}

			}, (err: any) => {
				this.errored.emit(err);
			}
		);

		this.formFlg = false;
		this.documentFlg = false;
		this.generalFlg = false;
		// 管理権限チェックボックスを活性化
		this.adminCheckDisableFlg = false;
		switch (this.adminAppId) {
			case EIMAdminsConstantService.ADMIN_APP_ID_FORM:
			// 帳票
				this.formFlg = true;
				// 管理者権限チェックボックスを非活性化
				this.adminCheckDisableFlg = true;
				break;
			case EIMAdminsConstantService.ADMIN_APP_ID_GENERAL:
			// 汎用
				this.generalFlg = true;
				break;
			case EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT:
			// ドキュメント
				this.documentFlg = true;
				// 管理権限チェックボックスを非活性化
				this.adminCheckDisableFlg = true;
				break;
			case EIMAdminsConstantService.ADMIN_APP_ID_TASK:
			// タスク
				this.taskFlg = true;
				break;
			default:
			// どれでもない場合は、ドキュメント
				this.documentFlg = true;
				// 管理権限チェックボックスを非活性化
				this.adminCheckDisableFlg = true;
		}

		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		// 「受信メール言語」プルダウンメニューの選択肢を取得
		this.authenticationService.getLanguageList().subscribe(
			(data: EIMLanguageDTO[]) => {
				let langList = data;

				if (Array.isArray(langList)) {
					const newLangList = [];
					for ( let i = 0; i < langList.length; i++ ) {
						newLangList.push({
							label: langList[i].name,
							value: langList[i].langId,
						});
						if (i === 0) {
							this.userLang = langList[i].langId.toString();
						}
					}
					this.userLangSelectItems = newLangList
				}
			}, (err: any) => {
				this.errored.emit(err);
			}
		);

		// 属性オプションの入力欄表示
		let attribute: any;
		this.objectService.getAttributeField('user').subscribe(
			(data: EIMUserAttributeDTO[]) => {
				this.attributeList = data;
				let attValue: any;
				for (let i = 0; i < data.length; i++) {
					this.attvalueList[data[i].attTypeId] = [];
				}
			}, (err: any) => {
				this.errored.emit(err);
			}
		);
	}

	/**
	 * 管理者権限プルダウンメニュークリックイベントハンドラ
	 */
	onChangeAdminType(): void {
		if (this.selectedAdminIdx === 0) {
			// 「一般ユーザに設定する」の場合
			this.adminCheckDisableFlg = true;
			// 全てのチェックボックスをOFFに
			for (let idx in this.authorityList) {
				if (idx) {
					this.authorityList[idx] = false;
				}
			}

		} else if (this.selectedAdminIdx === 1) {
			// 「個別に権限を設定する」の場合
			this.adminCheckDisableFlg = false;
		} else {
			// それ以外の権限設定プリセットの場合
			this.adminCheckDisableFlg = true;
			for (let idx in this.adminTypeArray) {
				if (idx) {
					if (this.userAdminSelectItems[this.selectedAdminIdx].label === this.adminTypeArray[idx].nameList[this.langId]) {
						// プルダウンメニューの記載名と、システム管理者タイプの名前が一致した場合
						for (let authIdx in this.authorityList) {
							if (authIdx) {
								let enableAuthorityList = this.adminTypeArray[idx].authorityList;
								this.authorityList[authIdx] =  enableAuthorityList[authIdx] === 'true' ? true : false;
							}
						}
						// 権限の設定が終わったら、これ以上のループは不要
						break;
					}
				}
			}
		}
	}

}
