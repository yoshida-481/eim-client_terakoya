import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMAccordionSearchRendererComponentService } from 'app/documents/shared/components/renderer/accordion-search-renderer.component.service';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';

import { EIMDataGridColumnType, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMBoxFileDragComponentService } from 'app/documents/components/box-file-drag/box-file-drag.component.service';
import { EIMDocumentSessionStorageService } from '../../services/apis/document-session-storage.service';
import { SafeHtml,DomSanitizer } from '@angular/platform-browser';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';

import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';

import { SelectItem } from 'primeng/api';
import { EIMStatusRendererComponentService } from './status-renderer.component.service';

/**
 * オブジェクト名称レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMObjectNameRendererComponent
 *
 */
@Component({
    selector: 'eim-accordion-search-renderer',
    template: `

		<div id="accordion-search-renderer-{{params.data.objId}}" style="table-layout:auto;width:100%;white-space:normal;display:flex;padding:1px;" [style.width.px]="getTableWidth()">

			<span>
				<i class="fa {{getIcon(params.data)}} fa-lg eim-document-main-single-clickable" style="padding-left:3px; padding-right:3px;"></i>
				<a *ngIf="showLink && !expiration" class="eim-document-main-single-clickable" href="#" style="padding-left:3px; padding-right:3px; color: #0044CC;" (click)="onClick($event, params)">{{params.data.objName}}</a>
				<a *ngIf="showLink && expiration" class="eim-document-main-single-clickable" href="#" style="padding-left:3px; padding-right:3px; color: #000000;" (click)="onClick($event, params)">{{params.data.objName}}</a>
				<span *ngIf="!showLink" href="#" style="padding-left:3px; padding-right:3px;">{{params.data.objName}}</span>
			</span>

			<span style="display:flex;margin: 0 0 0 auto;">
				<span id="page" style="width:80px;">
					<div *ngIf="params.data.isDspPageIcon" style="height:0px;">
						<label>{{'EIM_DOCUMENTS.LABEL_02097' | translate }}：</label>
						<p-select #dropdown id="drop-down"  [options]="pageList" appendTo="body" [autoDisplayFirst]="false"
								(onClick)="onGetPage()" (onChange)="onSelectedPageChange($event,dropdown)" dropdownIcon="eim-icon-page-download"
								[style]="{'width': '0px','border':'none','background-color':'transparent','margin-top':'-9px'}" >
							<ng-template let-item pTemplate="selectedItem">
								<i class="{{item.label}}"></i>
							</ng-template>
						</p-select>
					</div>
				</span>

				<span style="width:70px;">
					<div *ngIf="showPublicIcon !== ''">
						<i class="fa {{showPublicIcon}} fa-lg eim-document-main-single-clickable" pTooltip="{{toolTipString}}" (click)="onPublicClick($event, params)"></i>
						<a class="eim-document-main-single-clickable" style="color: #0044CC;" href="#" (click)="onPublicClick($event, params)">{{'EIM_DOCUMENTS.LABEL_03022' | translate }}</a>
					</div>
				</span>
				<span style="width:70px;">
					<div *ngIf="showEditIcon">
						<i class="fa fa-pencil-square-o fa-lg eim-document-main-single-clickable" [style.color]="getColor()" [style.cursor]="disabled(params.data) ? 'default' : 'pointer'" (click)="onEditClick($event, params)"></i>
						<a *ngIf="!disabled(params.data)" class="eim-document-main-single-clickable" style="color: #0044CC;" href="#" (click)="onEditClick($event, params)">{{'EIM_DOCUMENTS.LABEL_03026' | translate }}</a>
						<span *ngIf="disabled(params.data)">{{'EIM_DOCUMENTS.LABEL_03026' | translate }}</span>
					</div>
				</span>
				<span style="width:85px;">
					<div *ngIf="params.data.rev !== null">{{'EIM_DOCUMENTS.LABEL_02037' | translate }}：{{params.data.rev}}</div>
				</span>
				<span style="width:235px;white-space:nowrap;">
					<i *ngIf="statusIcon" class="fa {{statusIcon}}" style="padding-right:3px;"></i>
					{{'EIM_DOCUMENTS.LABEL_02032' | translate }}：{{status}}
				</span>
			</span>
		</div>

		<div style="display: flex; align-items: center;padding-left:25px;padding-top:5px;">
			<i class="fa fa-lg {{getPathIcon(params.data)}}" style="padding-left:3px; padding-right:3px;"></i>
			<a href="#" style="padding-left:3px; padding-right:3px;color: #0044CC;" (click)="onPathClick($event, params)">{{params.data.path}}</a>
		</div>
		<div style="padding-left:25px;padding-top:5px;">{{attributeList}}</div>

		<div style="padding-left:25px;padding-top:5px;" *ngIf="params.data.snippetFullTextList !== null" [innerHTML]='fullTextSnippet'></div>
		<div style="padding-left:25px;padding-top:5px;" *ngIf="params.data.snippetAttributeList !== null" [innerHTML]='attrSnippet'></div>
	`,
    styles: [`
		::ng-deep #page .p-select .p-select-trigger{
			border:none;
			background-color:transparent;
		}
		::ng-deep #page .p-select-label {
			background-color: transparent;
			display: none;
		}
		::ng-deep #page .p-select .p-select-label {
			padding-right:-0.6em;
			margin-left:-0.3em
		}
		::ng-deep eim-accordion-search-renderer .p-hidden-accessible {
			display: none;
		}
	`],
    standalone: false
})
export class EIMAccordionSearchRendererComponent implements AgRendererComponent, OnInit, OnDestroy {

	style = {
		height: '100%'
	  }

	public params: any;
	public showLink = true;
	public expiration = false;

	public modifyDateTime: string;

	public showPublicIcon: string;
	public isOldRevLink: boolean;
	public toolTipString = '';

	public showEditIcon = false;
	public attributeList :string = '';

	private attrSnippet: SafeHtml;
	private fullTextSnippet: SafeHtml;

	public status :string = '';
	public statusIcon :string = '';

	/** 選択可能データ型リスト */
	public pageList: SelectItem[];
	public selectedPage: any;

	/**
	 * コンストラクタです.
	 */
	constructor(
			private accordionSearchRendererComponentService: EIMAccordionSearchRendererComponentService,
			private serverConfigService: EIMServerConfigService,
			private fileService: EIMFileService,
			private userService: EIMDocumentsUserService,
			private boxFileDragComponentService: EIMBoxFileDragComponentService,
			private documentSessionStorageService: EIMDocumentSessionStorageService,
			private domSanitizer: DomSanitizer,
			private dateService: EIMDateService,
			private placeRendererComponentService:EIMPlaceRendererComponentService,
			private translateService: TranslateService,
			private publicFileRendererComponentService: EIMPublicFileRendererComponentService,
			private webDAVService: EIMWebDAVService,
			private documentFormService: EIMDocumentFormService,
			private statusRendererComponentService: EIMStatusRendererComponentService,

	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * アイコンを取得する.
	 * @param value オブジェクト名称
	 * @return アイコンクラス
	 */
	public getIcon(value: any): string {
		return this.accordionSearchRendererComponentService.getIcon(value);
	}

	/**
	 * 場所のアイコンを取得する.
	 * @param value オブジェクト名称
	 * @return アイコンクラス
	 */
	 public getPathIcon(value: any): string {
		return this.accordionSearchRendererComponentService.getPathIcon(value);
	}
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit() {
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;

		let customAttributeItems = this.params.colDef.cellRendererParams.customAttributeItems;
		// 属性表示
		for (let prop in params.data){
			// 自動採番が有効で番号属性を有する場合は先頭に挿入
			if (prop === 'number' && params.data[prop] !== null && params.data[prop] !== '' && this.serverConfigService.enableAutomaticNumbering) {
				const attName = this.translateService.instant('EIM_DOCUMENTS.LABEL_02098')
				this.attributeList = attName + "：" + params.data[prop] + "　　" + this.attributeList;
				continue;
			}

			for (let i=0; i < customAttributeItems.length; i++){
				if (prop === 'objId' && customAttributeItems[i].attName === this.translateService.instant('EIM_DOCUMENTS.LABEL_03126')) {
					this.attributeList = this.attributeList + this.translateService.instant('EIM_DOCUMENTS.LABEL_03126')+ "：" +　params.data[prop] + "　　";
				}

				if (customAttributeItems[i].attType === prop && params.data[prop] !== null && params.data[prop] !== ''){
					if (customAttributeItems[i].dataType === EIMDataGridColumnType.dateTime || customAttributeItems[i].dataType === EIMDataGridColumnType.date){
						// 複数値属性は「|」で区切って表示
						if (prop.indexOf('multivalue') > -1) {
							let values: any[] = params.data[prop];
							if (values) {
								this.attributeList = this.attributeList + customAttributeItems[i].attName + "：" + values.join('|') + "　　";
							}
						} else {
							this.attributeList = this.attributeList + customAttributeItems[i].attName + "："
								+ this.dateService.getDateTimeString(params.data[prop]).replace("00:00:00","") + "　　";
						}
					} else {
						// ファイルサイズ属性で値が0の場合は表示しないようにする
						if (customAttributeItems[i].attName !== this.translateService.instant('EIM_DOCUMENTS.LABEL_02214') || params.data[prop] !== 0) {
							let data;
							if (Array.isArray(params.data[prop])) {
								params.data[prop].forEach(function(elem, index) {
									if (index === 0) {
										data = elem;
									} else {
										// 複数値属性は「|」で区切ってまとめる
										data = data + "|" + elem;
									}
								});
							} else {
								if (customAttributeItems[i].attName === this.translateService.instant('EIM_DOCUMENTS.LABEL_02214')) {
									// サイズの場合は3桁区切りカンマを設定する
									data = Number(params.data[prop]).toLocaleString();
								} else {
									data = params.data[prop];
								}
							}
							this.attributeList = this.attributeList + customAttributeItems[i].attName + "：" + data + "　　";
						}

					}
				}
			}
		}

		// スニペット表示
		// 属性スニペット
		if (params.data.snippetAttributeList !== null && params.data.snippetAttributeList !== undefined){
			let str: string = '';
			for (let i=0; i< Object.keys(params.data.snippetAttributeList).length; i++) {
				str = str + params.data.snippetAttributeList[i] + "　　　　";
			}
			this.attrSnippet = this.domSanitizer.bypassSecurityTrustHtml(str);
		}
		// 本文スニペット
		if (params.data.snippetFullTextList !== null && params.data.snippetFullTextList !== undefined){
			let str: string = '';
			for (let i=0; i< Object.keys(params.data.snippetFullTextList).length; i++) {
				str = str + "..." + params.data.snippetFullTextList[i] + "...<br>";
			}
			this.fullTextSnippet = this.domSanitizer.bypassSecurityTrustHtml(str);
		}

		this.modifyDateTime = this.dateService.getDateTimeString(params.data.modifyDate);

		if (params.data.hasOwnProperty('isNoLink') && params.data.isNoLink) {
			this.showLink = false;
		}
		if (params.data.hasOwnProperty('readOnly') && (params.data.readOnly === 'true' || params.data.readOnly === true)) {
			this.showLink = false;
		}

		for (let i = 0; i < this.params.context.columns.length; i++) {
			let column: any = this.params.context.columns[i];
			if (params.column.colDef.field !== column.field
					|| params.column.colDef.headerName !== column.headerName) {
				continue;
			}

			if (column.param && !column.param.isLink) {
				this.showLink = false;
			}
		}

		// 有効期限切れの場合は黒表示とする
		if (params.data.hasOwnProperty('expiration') && (params.data.expiration === 'true' || params.data.expiration === true)) {
			this.expiration = true;
		}

		// 公開rendererから拝借--------------------------------------------------------------------------------------------------------
		this.isOldRevLink = false;
		if (params.data.hasOwnProperty('isDocumentLink') && params.data.hasOwnProperty('isDspLatestLink')) {
			if (params.data.isDocumentLink === 'true' || params.data.isDocumentLink === true) {
				if (params.data.isDspLatestLink === 'true' || params.data.isDspLatestLink === true) {
					this.isOldRevLink = true;
					this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02188');
				}
			}
		}

		// 事前登録された公開ファイルかどうか
		if (!this.isOldRevLink
			&& (params.data.isPdfPreRegistered === true || params.data.isPdfPreRegistered === 'true')){
			this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02222');
		}

		// PDF変換完了(原本更新有)かどうか判定
		if (params.data.hasOwnProperty('pdfConversionStatus')) {
			if (Number(params.data.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL) {
				this.isOldRevLink = true;
				if (params.data.isPdfPreRegistered === true || params.data.isPdfPreRegistered === 'true'){
					this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02221');
				} else {
					this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02209');
				}
			}
		}

		this.showPublicIcon = this.publicFileRendererComponentService.getIcon(params.data, this.isOldRevLink);
		// ----------------------------------------------------------------------------------------------------------------------------
		// 編集rendererから拝借-
		if (this.editable(params.data)) {
			this.showEditIcon = true;
		}

		// ステータス
		if (this.params.data.lockUserName && this.params.data.lockUserName != '') {
			this.statusIcon = 'eim-icon-lock eim-icon-lock-color';
		} else {
			this.statusIcon = '';
		}
		this.status = this.statusRendererComponentService.getLabel(this.params.data);

	}

	/**
 	 * 編集アイコン表示判定
	 * @param obj params.data
	 */
	private editable(obj: any): boolean {
		if (obj.isDocument === 'false' || obj.isDocument === false) {
			return false;
		}
		if (!this.webDAVService.editable(obj.objName)) {
			return false;
		}
		return true;
	}

	/**
	 * リンククリックイベントハンドラ
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, params) {
		// リンククリックイベントのバブリングを止める（選択行クリックでセルが編集状態になるため）
		event.preventDefault();
		event.stopPropagation();

		// メインの一覧のデータが文字のため
		let isDocument: boolean = params.data.isDocument;
		if (params.data.isDocument === 'true' || params.data.isDocument === true) {
			isDocument = true;
		} else if (params.data.isDocument === 'false' || params.data.isDocument === false) {
			isDocument = false;
		}
		if (isDocument) {
			if(this.serverConfigService.checkPreviewFileExt(params.data.objName)){
				this.accordionSearchRendererComponentService.openPreviewWindowByFileName(params.data);
			}else{
				this.fileService.downloadPrivateDocument(params.data.objId);
			}
			this.userService.sendReplyMail(params.data.objId);
		} else {
			//
			let nodeData: any = {};
			nodeData.objId = params.data.objId;
			if (params.data.isWorkflowFolder === 'true' || params.data.isWorkflowFolder === true) {
				nodeData.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
			} else {
				nodeData.objTypeName = params.data.objTypeName;
			}

			if (params.data.hasOwnProperty('attrTreeId')) {
				nodeData.attrTreeId = params.data.attrTreeId
				nodeData.attrTreeValues = params.data.attrTreeValues
				nodeData.value = params.data.value
			}
			this.params.context.onNodeSelect.emit(nodeData);
		}
	}

	/**
	 * ページプルダウン選択時のハンドラです.
	 */
	onGetPage() {
		let params: {key?: String} = {};

		params['keyword'] = this.documentSessionStorageService.getSearchCondition().keyword;
		params['objId'] = this.params.data.objId;

		// 検索
		this.documentFormService.pageSearch(params).
			subscribe( (resultList: any) => {
				this.pageList = [];
				for (let i=0; i<resultList.length; i++){
					this.pageList.push({label:"P." + resultList[i], value:resultList[i]});
				}
			}, (err: any) => {
			}
		);
	}

  	/**
	 * ページプルダウン変更時のハンドラです.
	 * @param event イベント
	 */
	onSelectedPageChange(event,dropdown) {
		this.accordionSearchRendererComponentService.onClickPage(this.params, event.value);

		dropdown.updateSelectedOption(null);
		dropdown.value = "";
	}

  	/**
	 * クリックイベントのハンドラです.
	 * @param event イベント
	 * @param params 行データ
	 */
	onPathClick(event, params) {
		event.preventDefault();
		this.placeRendererComponentService.clicked(this.params.data);
	}

	/**
	 * 公開アイコン選択イベントハンドラ
	 * @param event イベント
	 * @param params 行データ
	 */
	onPublicClick(event, params) {
		event.preventDefault();

		if (this.showPublicIcon != null) {
			if(this.serverConfigService.checkPreviewFileExt(params.data.objName)){
				this.accordionSearchRendererComponentService.openPreviewWindowByPublicIcon(params.data);
			}else{
				this.fileService.downloadPublicDocument(params.data.objId);
			}
			this.userService.sendReplyMail(params.data.objId);
		}

	}

	/**
	 * 編集アイコン選択イベントハンドラ
	 * @param event イベント
	 * @param params 行データ
	 */
	onEditClick(event, params) {
		event.preventDefault();
		if (!this.disabled(this.params.data)) {
			this.webDAVService.checkStatus(params.data.objId).subscribe(
				(editable: boolean) => {
					this.webDAVService.edit(params.data.objId, params.data.objName);
			});
		}
	}

	/**
	 * ドラッグ開始イベントハンドラ
	 * @param event イベント
	 */
	onDragStart(event: DragEvent) {
		const context: EIMDataGridComponent = this.params.context;
		const selectedData = context.getSelectedData();
		const find = selectedData.find(sel => sel === this.params.data);
		const draggableData = (find ? selectedData : [this.params.data])
			.filter(data => data.isDocument === true || data.isDocument === 'true');
		const dragData = draggableData
			.map(data => ({
				objId: Number(data.objId),
				objName: String(data.objName),
				icon: this.getIcon(data),
			}));
		if (!find || selectedData.length !== draggableData.length) {
			context.select(draggableData);
		}
		this.boxFileDragComponentService.dragStart(event, dragData);
	}

	/**
	 * ドラッグ終了イベントハンドラ
	 * @param event イベント
	 */
	onDragEnd(event: DragEvent) {
		this.boxFileDragComponentService.dragEnd(event);
	}

	/**
	 * dataGridのウィンドウサイズ内の幅を取得する
	 */
	getTableWidth(): number {
		let tableWidth = document.getElementById('dataGridDiv').clientWidth;
		let columnWidth = document.getElementsByClassName('ag-header-cell')[0].clientWidth;
		return Math.min(tableWidth, columnWidth);
	}

	/**
	 * 編集アイコンの使用可否により色を変える
	 */
	private getColor(): string {
		let color = '';
		if (!this.disabled(this.params.data)) {
			color = '#007700';
		}
		return color;
	}

	/**
	 * 編集アイコンの使用可否判定
	 */
	private disabled(obj: any): boolean {
		if (obj.hasOwnProperty('readOnly') && (obj.readOnly == 'true' || obj.readOnly == true)) {
			return true;
		}

		if (this.isLocked(obj)) {
			return true;
		}

		// 承認中チェックイン可能オプションが設定されていない場合
		if (!this.serverConfigService.enableApproverCheckinFlg) {
			// WFあり、かつ、ステータスが編集中以外の場合非活性
			if (obj.statusTypeKind && obj.statusTypeName !== '-' &&
				Number(obj.statusTypeKind) !== (EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING)) {
				return true;
			}
		}

		if (!obj.statusTypeKind && obj.statusTypeName == '-') {
			return false;
		} else if (obj.statusTypeKind && (Number(obj.statusTypeKind) != EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING &&
				Number(obj.statusTypeKind) != EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST)) {
			return true;
		}

		return false;
	}

	/**
	 * WebDAVロック状態を判定します.
	 *
	 * @param obj オブジェクト
	 * @return WebDAVロック状態
	 */
	private isLocked(obj: any): boolean {
		// 引数チェック
		if (!obj) {
			// ロック状態とみなす
			return true;
		}

		if (obj.lockDate && (obj.isWebDAVLock == 'false' || obj.isWebDAVLock == false)) {
			return true;
		}

		if ((obj.isWebDAVLock == 'true' || obj.isWebDAVLock == true) && (obj.isLockedMyself == 'false' || obj.isLockedMyself == false)) {
			return true;
		}

		return false;
	}
}
