import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMUserService, EIMUser } from 'app/admins/shared/services/apis/user.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminsAuthenticationService, EIMAuth, EIMAdminAuth, EIMAdminType, } from 'app/admins/shared/services/apis/authentication.service';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMAdminsUserDTO } from 'app/admins/shared/dtos/admins-user.dto';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { SelectItem } from 'primeng/api';

/**
 * ユーザ更新コンポーネント
 * @example
 *
 *      <eim-user-updator
 *        [adminAppId]="data[DialogName.USER_UPDATOR].adminAppId"
 *        [userId]="data[DialogName.USER_UPDATOR].userId">
 *      </eim-user-updator>
 */
@Component({
    selector: 'eim-user-updator',
    templateUrl: './user-updator.component.html',
    styleUrls: ['./user-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMUserUpdatorComponent) }
    ],
    standalone: false
})

export class EIMUserUpdatorComponent implements OnInit, EIMUpdatable {
	/** ユーザ更新フォーム */
	@ViewChild('userUpdatorForm', { static: true }) userUpdatorForm: NgForm;

	/** パスワード入力フォーム */
	@ViewChild('passwordForm', { static: true }) passwordForm: NgForm;

	/** ユーザ登録属性入力項目フォーム */
	@ViewChild('userUpdatorAttributeForm', { static: true }) userUpdatorAttributeForm: NgForm;

	/** ユーザID */
	@Input() userId: number;

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 管理者権限タイプ プルダウンメニューの選択中の番号 */
	public selectedAdminIdx: number;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 言語ID */
	public langId = 'JA';

	/** ID */
	public userCode: string;

	/** かな */
	public userKana: string;

	/** Mail */
	public userMail: string;

	/** 無効フラグ */
	public userDisable: number;

	/** 受信メール言語 */
	public userLang: string;

	/** 受信メール言語リスト */
	public userLangSelectItems: SelectItem[] = [];

	/** 管理者権限チェックボックスリスト */
	public authorityList: { [key: string]: boolean; } = {};

	/** チェックボックス表示可能権限リスト */
	public auths: EIMAuth[];

	/** プルダウン表示可能管理者権限タイプリスト */
	public adminTypeArray: EIMAdminType[] = [];

	/** プルダウンメニューに設定するシステム管理者タイプリスト */
	public userAdminSelectItems: SelectItem[] = [];

	/** パスワード */
	public userPass = '';

	/** パスワード変更フラグ */
	public userPassUpdateFlg = false;

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 属性一覧 */
	public attributes: any[];

	/** 属性DTO一覧 */
	public attributeList: EIMUserAttributeDTO[] = [];

	/** 登録した属性リスト */
	public attvalueList: { [key: string]: any[]; } = {};

	/** 汎用 */
	public generalFlg = false;
	/** ドキュメント */
	public documentFlg = false;
	/** 帳票 */
	public formFlg = false;
	/** タスク */
	public taskFlg = false;

	/** 管理者権限チェック不可フラグ */
	public adminCheckDisableFlg = false;

	/** 編集対象外のadmin値 : 「編集中」のみ有効 */
	private userAdminNoEdit: number;

	/** 編集前のadmin値 : 「編集中」のみ有効 */
	private userAdminBefore: number;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminsEntryService: EIMAdminsEntryService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected userService: EIMUserService,
		protected objectService: EIMObjectService,
		protected authenticationService: EIMAdminsAuthenticationService,
		protected serverConfigService: EIMServerConfigService,

	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ユーザを更新します.
	 */
	public update(): void {
		// 権限の計算
		let userAdminValue: number;
		userAdminValue = 0;
		for (let i = 0; i < this.auths.length; i++) {
			let auth = this.auths[i];
			if (this.authorityList[auth.authId]) {
				userAdminValue += auth.authValue;
			}
		}

		// 編集対象外のadmin値を足す
		userAdminValue += this.userAdminNoEdit;

		// ユーザを更新します．
		this.adminsEntryService.updateUser(this.nameList, this.userId, this.userCode, this.userKana, this.userMail, userAdminValue, this.userDisable, this.userLang, this.attributeList, this.userPass).subscribe(
			(data: any) => {
				this.updated.emit(data);
			},
		);
	}

	/**
	 * ユーザ更新可否を返却します.
	 * @return ユーザ更新可否
	 */
	public updatable(): boolean {
		return (this.userUpdatorForm.dirty || this.userUpdatorAttributeForm.dirty || this.passwordForm.dirty)
			&& this.userUpdatorForm.valid && this.userUpdatorAttributeForm.valid && (!this.userPassUpdateFlg || this.passwordForm.valid)
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

		// 「受信メール言語」プルダウンメニューの選択肢を取得
		this.authenticationService.getLanguageList().subscribe((data: EIMLanguageDTO[]) => {
			let langList = data;
			if (Array.isArray(langList)) {
				const newLangList = [];
				for (let i = 0; i < langList.length; i++) {
					newLangList.push({
						label: langList[i].name,
						value: langList[i].langId,
					});
				}
				this.userLangSelectItems = newLangList
			}
		}, (err: any) => {
			// エラーの場合
			throw err;
		});

		this.authenticationService.getAdminAuth().subscribe(
			(data: EIMAdminAuth) => {
				// 管理者権限
				for (let idx in data.authListApplicationArray) {
					if (idx) {
						if (this.adminAppId === data.authListApplicationArray[idx].applicationId) {
							this.auths = data.authListApplicationArray[idx].authArray.filter(function (auth) {
								return !(auth.authId == 'attributeTree' && !attributeTreeFlg);
							});
						}
					}
				}

				// 管理権限チェックボックス初期化
				for (let idx = 0; idx < this.auths.length; idx++) {
					let auth = this.auths[idx];
					this.authorityList[auth.authId] = false;
				}

				// システム管理者タイプ プルダウンメニュー
				for (let idx in data.adminTypeListApplicationArray) {
					if (idx) {
						if (this.adminAppId === data.adminTypeListApplicationArray[idx].applicationId) {
							this.adminTypeArray = data.adminTypeListApplicationArray[idx].adminTypeArray;
							// ユーザ更新で表示する権限タイプ
							this.userAdminSelectItems = this.userService.getUserAdminItems(true, this.langId, this.adminTypeArray);
						}
					}
				}


				this.userService.getSelectedUser(this.userId).subscribe(
					(userData: any) => {
						let langs = userData.lang;
						let langsLoopCnt = langs.length;
						for (let idx = 0; idx < langsLoopCnt; idx++) {
							lang = langs[idx];

							this.nameList[lang.attr.otherLId] = lang.attr.otherName;
						}
						this.userCode = userData.attr.userCode;
						this.userKana = userData.attr.userKana;
						this.userMail = userData.attr.userMail;
						this.userDisable = userData.attr.userDisable;
						this.userLang = userData.attr.userLang;
						// ユーザの持つ権限情報が、15桁の2進数値で保持されている
						this.userAdminNoEdit = Number(userData.attr.userAdmin); // 編集対象外の権限
						this.userAdminBefore = Number(userData.attr.userAdmin); // 編集前の権限

						// 管理権限チェックボックスにユーザの持つ権限にチェックを入れていく
						for (let idx = 0; idx < this.auths.length; idx++) {
							let auth = this.auths[idx];

							// ■管理権限のビット演算が必要なため、「&」は１つが正しい
							//  下記はルール違反を無視するためのコメント
							// tslint:disable-next-line:no-bitwise
							if (auth.authValue & this.userAdminNoEdit) {
								// 管理権限の2進数値
								this.authorityList[auth.authId] = true;
								// チェックを立てた権限の２進数値を引いていく
								this.userAdminNoEdit -= auth.authValue;
							}
						}
					},
				);
			},
		);

		// アプリケーション種別ごとのフラグ
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
				// 管理者権限チェックボックスを非活性化
				this.adminCheckDisableFlg = true;
				break;
			case EIMAdminsConstantService.ADMIN_APP_ID_TASK:
				// タスク
				this.taskFlg = true;
				break;
			default:
				// どれでもない場合はドキュメント
				this.documentFlg = true;
				// 管理者権限チェックボックスを非活性化
				this.adminCheckDisableFlg = true;
		}

		this.languages = this.localStorageService.getLanguages();
		let loopCnt = this.languages.length;
		let lang: any;
		for (let idx = 0; idx < loopCnt; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		// 属性オプションの入力欄表示
		this.objectService.getAttributeField('user', this.userId).subscribe(
			(data: EIMUserAttributeDTO[]) => {
				this.attributeList = data;
				let attValue: any;
				for (let i = 0; i < data.length; i++) {
					this.attvalueList[data[i].attTypeId] = data[i].attMultipleList;
				}
			},
		);
	}

	/**
	 * 管理者権限プルダウンメニュークリックイベントハンドラ
	 */
	onChangeAdminType(): void {
		if (this.selectedAdminIdx === 0) {
			// 「権限を変更しない」の場合
			this.adminCheckDisableFlg = true;
			// 変更前のチェックボックスの状態に
			for (let idx = 0; idx < this.auths.length; idx++) {
				let auth = this.auths[idx];

				// ■管理者権限のビット演算が必要なため、「&」は１つが正しい
				//  下記はルール違反を無視するためのコメント
				// tslint:disable-next-line:no-bitwise
				if (auth.authValue & this.userAdminBefore) {
					// 管理者権限の2進数値
					this.authorityList[auth.authId] = true;
				} else {
					this.authorityList[auth.authId] = false;
				}
			}


		} else if (this.selectedAdminIdx === 1) {
			// 「一般ユーザに設定する」の場合
			this.adminCheckDisableFlg = true;
			// 全てのチェックボックスをOFFに
			for (let idx in this.authorityList) {
				if (idx) {
					this.authorityList[idx] = false;
				}
			}

		} else if (this.selectedAdminIdx === 2) {
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
								this.authorityList[authIdx] = enableAuthorityList[authIdx] === 'true' ? true : false;
							}
						}
						// 権限の設定が終わったら、これ以上のループは不要
						break;
					}
				}
			}
		}
	}

	/**
	 * パスワード変更チェックボックスクリックイベントハンドラ
	 */
	onChangeUserPassUpdate() {
		if (!this.userPassUpdateFlg) {
			this.userPass = '';
		}

	}
}
