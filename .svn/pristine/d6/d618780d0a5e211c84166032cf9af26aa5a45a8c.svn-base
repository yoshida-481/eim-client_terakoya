import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * サーバー設定サービス
 */
@Injectable()
export class EIMServerConfigService {

	private contextPath: string = null;

	private contextPathUrl: string = null;


	/** ログインユーザがシステムマネージャかどうか */
	public isSystemManager = false;
	/** 公開取消メニュー表示はシステムマネージャログイン時に限定するかどうか */
	public isPublicCancelMenuSystemManagerOnly = true;
	public searchDetailLikeCondition = true;
	public searchDetailsOpen = true;
	public isGeneralDocVisible = true;
	public isGeneralFolVisible = true;
	public isChangePassVisible = true;
	public isLogoutVisible = true;
	public eimanagerDocumentVersion: string;
	public pdfAutoRegistDocNamePrefix: string;
	public csvFileHeader: string;
	public csvAccessHistoryFileHeader: string;
	public csvCirculationFileHeader: string;
	public csvAccordionSearchFileHeader: string;
	public csvDownloadCharset: string;
	public csvDownloadNewLine: string;
	public csvMailAddressOutputFlg = false;
	public docAccessUrlPathFlg = false;
	public orgDocAccessUrlPathFlg = false;
	public publicDocAccessUrlPathFlg = false;

	/** オプション設定値 */
	public publicCancelFlg = false;
	public ocrFlg = false;
	public coverFlg = false;
	public pdfCompareFlg = false;
	public pdfJoinFlg = false;

	public searchPageFlg = false;
	public enableApproverCheckinFlg = false;
	public digitalSignatureFlg = false;
	public attributeTreeView = false;
	public signatureAndEncryptionFlag = false;
	public convertPaperToPDFFlg = false;
	public pdfOutputConf = false;
	public searchDispMode: number;
	public searchContentsFlg: boolean;
	/** URL挿入 */
	public insertURL = false;
	/** Box連携 */
	public boxIntegrationFlg = false;
	/** フォーマットID */
	public publicDocumentFormat: string;
	/**Boxフォーマットダイアログ表示フラグ */
	public boxDialogFlg = false;
	/**Boxフォーマットダイアログ初期値設定フラグ */
	public boxDefaultSettingPublic = false;
	/** ユーザ別Box連携利用許可設定 */
	public boxUserIntegFlg = false;
	/** PDF変換対象拡張子 */
	public pdfConvertFileTypeSet: Set<string> = null;
	/** Preview対象拡張子 */
	public previewFileTypeSet: Set<string> = null;
	/** Thumbnail対象拡張子 */
	public thumbnailFileTypeSet: Set<string> = null;
	/** キャッシュ */
	public disabledCacheFlg = false;
	/** 署名使用ツール */
	public useSignTool: String;
	/** アップロードファイルサイズ上限値 */
	public uploadFileSizeMax: number;

	/** 自動採番 */
	public enableAutomaticNumbering = false;
	public eimanagerFormVersion: string;
	public isAutoClose: boolean;
	public onlySuperiorAutoApproval: boolean;
	public showOnlySuperior: boolean;
	public isChangePasswordFlg: boolean;
	/** 帳票管理のごみ箱を表示するかどうか */
	public showFormTrash: boolean;

	/** ワークスペースホームに表示するウィジェットIDリスト */
	public workspaceHomeWidgetIds: string;

	/** 操作履歴画面表示データダウウンロード */
	public csvDownloadHistoryFileHeader: string;

	/** 除外ネームスペースリスト */
	public nameSpacesToExclude: string[];

	private configValueSet = new Subject<void>();
	public configValueSet$ = this.configValueSet.asObservable();

	constructor () {

	}

	public getContextPath(): string {
		if (!this.contextPath) {
			let pathname: string = window.location.pathname;
			this.contextPath = pathname.substring(0, pathname.lastIndexOf('/', pathname.length - 2));
		}
		return this.contextPath;
	}

	public getContextPathUrl(): string {
		let url: string;
		// 設定ファイルに定義している場合(デバッグ版の場合)
		if (environment.scheme != '' && environment.host != '' && environment.port != '') {
			url = environment.scheme + environment.host + environment.port + this.getContextPath();
		} else {
			url = window.location.origin + this.getContextPath();
		}
		return url;
	}

	public isExcelExt(ext: string): boolean {
		return (ext.toUpperCase() == '.XLS' || ext.toUpperCase() == '.XLSX' || ext.toUpperCase() == '.XLSM');
	}
	public isWordExt(ext: string): boolean {
		return (ext.toUpperCase() == '.DOC' || ext.toUpperCase() == '.DOCX' || ext.toUpperCase() == '.DOCM');
	}

	public isPowerPointExt(ext: string): boolean {
		return (ext.toUpperCase() == '.PPT' || ext.toUpperCase() == '.PPTX' || ext.toUpperCase() == '.PPTM');
	}

	public isPDFExt(ext: string): boolean {
		return (ext.toUpperCase() == '.PDF');
	}

	public isCSVExt(ext: string): boolean {
		return (ext.toUpperCase() == '.CSV');
	}

	public isTIFFExt(ext: string): boolean {
		return (ext.toUpperCase() == '.TIF' || ext.toUpperCase() == '.TIFF');
	}

	public isWebDavTargetExcelExt(ext: string): boolean {
		return (ext.toUpperCase() == '.XLS' || ext.toUpperCase() == '.XLSX');
	}

	public isWebDavTargetWordExt(ext: string): boolean {
		return (ext.toUpperCase() == '.DOC' || ext.toUpperCase() == '.DOCX');
	}

	public isWebDavTargetPowerPointExt(ext: string): boolean {
		return (ext.toUpperCase() == '.PPT' || ext.toUpperCase() == '.PPTX');
	}

	public isCadDxfExt(ext: string): boolean {
		return (ext.toUpperCase() == '.DXF');
	}

	public isCadDwgExt(ext: string): boolean {
		return (ext.toUpperCase() == '.DWG');
	}

	/**
	 * 拡張子からPreView表示対象のファイルであることを判定します.
	 * @param name ファイル名
	 * @return バリデート結果
	 */
	public checkPreviewFileExt(name: string): boolean {
		let previewFileTypeSet = this.previewFileTypeSet;
		let ext: string = name.substring(name.lastIndexOf('.') + 1);
		if (previewFileTypeSet.has(ext)) {
			return true;
		}
		return false;
	}

	/**
	 * 拡張子からThumbnailのイメージの表示対象のファイルであることを判定します.
	 * @param name ファイル名
	 * @return バリデート結果
	 */
	public checkThumbnailFileExt(name: string): boolean {
		let thumbnailFileTypeSet = this.thumbnailFileTypeSet;
		let ext: string = name.substring(name.lastIndexOf('.') + 1);
		if (thumbnailFileTypeSet.has(ext)) {
			return true;
		}
		return false;
	}

	public setConfigValue(keyValue: any): void {
		// 文書管理
		this.isSystemManager = true;
		this.isPublicCancelMenuSystemManagerOnly = true;
		this.searchDetailLikeCondition = keyValue['searchDetailLikeCondition'] == 'on' ? true : false;
		this.searchDetailsOpen = keyValue['searchDetailsOpen'] == 'true' ? true : false;
		this.isGeneralDocVisible = keyValue['isGeneralDocVisible'] == 'true' ? true : false;
		this.isGeneralFolVisible = keyValue['isGeneralFolVisible'] == 'true' ? true : false;
		this.isChangePassVisible = keyValue['isChangePassVisible'] == 'false' ? false : true; // 空の場合デフォルトtrue
		this.isLogoutVisible = keyValue['isLogoutVisible'] == 'false' ? false : true; // 空の場合デフォルトtrue
		this.eimanagerDocumentVersion = keyValue['eimanagerDocumentVersion'];
		this.contextPathUrl = keyValue['contextPathUrl'];
		this.enableAutomaticNumbering = keyValue['enableAutomaticNumbering'] === 'on' ? true : false;
		this.pdfAutoRegistDocNamePrefix = keyValue['pdfAutoRegistDocNamePrefix'];
		this.csvFileHeader = keyValue['csvFileHeader'];
		this.csvAccessHistoryFileHeader = keyValue['csvAccessHistoryFileHeader'];
		this.csvCirculationFileHeader = keyValue['csvCirculationFileHeader'];
		this.csvAccordionSearchFileHeader = keyValue['csvAccordionSearchFileHeader'];
		this.csvDownloadCharset = keyValue['csvDownloadCharset'];
		this.csvDownloadNewLine = keyValue['csvDownloadNewLine'];
		this.csvMailAddressOutputFlg = keyValue['csvMailAddressOutputFlg'] === 'true' ? true : false;
		this.docAccessUrlPathFlg = keyValue['docAccessUrlPathFlg']  === 'true' ? true : false;
		this.orgDocAccessUrlPathFlg = keyValue['orgDocAccessUrlPathFlg'] === 'true' ? true : false;
		this.publicDocAccessUrlPathFlg = keyValue['publicDocAccessUrlPathFlg'] === 'true' ? true : false;
		this.nameSpacesToExclude = (keyValue?.['nameSpaceToExclude']?.split(',') ?? []);
		for (let i = 0; i < this.nameSpacesToExclude.length; i++) {

			this.nameSpacesToExclude[i] = this.nameSpacesToExclude[i].trim();
		}


		// オプション設定
		this.publicCancelFlg = true;
		this.ocrFlg = true;
		this.coverFlg = true;
		this.pdfCompareFlg = true;
		this.pdfJoinFlg = true;

		this.searchPageFlg = keyValue['searchPageFlg'] === 'true' ? true : false;
		this.enableApproverCheckinFlg = keyValue['enableApproverCheckinFlg'] === 'true' ? true : false;
		this.digitalSignatureFlg = keyValue['digitalSignatureFlg'] === 'true' ? true : false;
		this.attributeTreeView = keyValue['attributeTreeView'] === 'true' ? true : false;
		this.pdfOutputConf = true;
		this.signatureAndEncryptionFlag = true;
		this.convertPaperToPDFFlg = keyValue['convertPaperToPDFFlg'] === 'true' ? true : false;
		this.boxIntegrationFlg = keyValue['boxIntegrationFlg'] === 'true' ? true : false;
		this.publicDocumentFormat = keyValue["publicDocumentFormat"];
		this.boxDialogFlg = keyValue["boxDialogFlg"] === "true" ? true : false;
		this.boxDefaultSettingPublic =keyValue["boxDefaultSettingPublic"] === "true" ? true : false;
		this.boxUserIntegFlg = keyValue['boxUserIntegFlg'] === 'true' ? true : false;
		this.searchDispMode = keyValue['searchDispMode'] 
			=== '0' ? 0 : keyValue['searchDispMode']
			=== '1' ? 1 : 2;
		this.searchContentsFlg = keyValue['searchContentsFlg'] === 'true' ? true : false;
		this.pdfConvertFileTypeSet = new Set();
		if (keyValue['pdfConvertFileType']) {
			let exts: string[] = keyValue['pdfConvertFileType'].split(',');
			for (let i = 0; i < exts.length; i++) {
				this.pdfConvertFileTypeSet.add(exts[i].trim());
			}
		}
		this.disabledCacheFlg = keyValue['disabledCacheFlg'] === 'true' ? true : false;
		this.previewFileTypeSet = new Set();
		if (keyValue['previewFileType']) {
			let exts: string[] = keyValue['previewFileType'].split(',');
			for (let i = 0; i < exts.length; i++) {
				this.previewFileTypeSet.add(exts[i].trim());
			}
		}
		this.thumbnailFileTypeSet = new Set();
		if (keyValue['thumbnailFileType']) {
			let exts: string[] = keyValue['thumbnailFileType'].split(',');
			for (let i = 0; i < exts.length; i++) {
				this.thumbnailFileTypeSet.add(exts[i].trim());
			}
		}
		this.uploadFileSizeMax = keyValue['uploadFileSizeMax'] 

		// 帳票管理
		this.eimanagerFormVersion = keyValue['eimanagerFormVersion'];
		this.isAutoClose = keyValue['isAutoClose'];
		this.onlySuperiorAutoApproval = keyValue['onlySuperiorAutoApproval'];
		this.showOnlySuperior = keyValue['showOnlySuperior'];
		this.showFormTrash = keyValue['showFormTrash'];
		this.isChangePasswordFlg = keyValue['isChangePasswordFlg'];

		// システム管理
		this.csvDownloadHistoryFileHeader = keyValue['csvDownloadHistoryFileHeader'];
		this.csvDownloadCharset = keyValue['csvDownloadCharset'];
		this.csvDownloadNewLine = keyValue['csvDownloadNewLine'];

		this.insertURL = keyValue['insertURL'] === 'true' ? true : false;

		this.useSignTool = keyValue['useSignTool'];

		this.configValueSet.next();
		this.configValueSet.complete();
	}

	/**
	 * サーバConfigファイルの設定値をキャッシュします.
	 * 
	 * @param keyValue 設定値のキー/バリュー
	 */
	public setConfigValueForTask(keyValue: any): void {

		this.isGeneralDocVisible = keyValue['isGeneralDocVisible'] == 'true' ? true : false;
		this.workspaceHomeWidgetIds = keyValue['workspaceHomeWidgetIds'];

		this.configValueSet.next();
		this.configValueSet.complete();
	}
}
