import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { UntypedFormGroup, NgForm } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  EIMDialogManagerComponentService,
  dialogName,
} from "app/documents/shared/components/dialog-manager/dialog-manager.component.service";
import { EIMHierarchicalObjectTypeDomain } from "app/documents/shared/domains/hierarchical-object-type.domain";
import { EIMDocumentFormService } from "app/documents/shared/services/apis/document-form.service";
import { EIMObjectTypeService } from "app/documents/shared/services/apis/object-type.service";
import { EIMDocumentsCacheService } from "app/documents/shared/services/documents-cache.service";
import { EIMDocumentsConstantService } from "app/documents/shared/services/documents-constant.service";
import { EIMObjectDomain } from "app/shared/domains/entity/object.domain";
import { EIMUserDomain } from "app/shared/domains/entity/user.domain";
import { EIMDateService } from "app/shared/services/date.service";
import {
  EIMMessageService,
  EIMMessageType,
} from "app/shared/services/message.service";
import { EIMComponent, EIMCreatable } from "app/shared/shared.interface";
import { SelectItem } from "primeng/api";
import { SelectModule } from "primeng/select";

import { EIMConstantService } from "app/shared/services/constant.service";
import { EIMLumpFolderCreatorConfirmationComponent } from "./lump-folder-creator-confirmation.component";

/** 画面状態定数 */
export namespace stateConst {
  export const EDITING = "editing";
  export const CREATING = "creating";
  export const COMPLETE = "complete";
}

namespace uploadStatusNumber {
  export const CAN_UPLOAD = 0;
  export const CANNOT_UPLOAD = 1;
  export const NOT_CHECKED = 2;
  export const DISABLED_CHECKED = 3;
  export const CHECKED = 5;
}

/**
 * ドキュメント一括登録コンポーネント
 * @example
 *
 *      <eim-lump-folder-creator
 *          [parentObjId]="parentObjId"
 *          [workspaceObjId]="workspaceObjId"
 *          [path]="path">
 *      </eim-lump-folder-creator>
 */
@Component({
    selector: "eim-lump-folder-creator",
    templateUrl: "./lump-folder-creator.component.html",
    styleUrls: ["./lump-folder-creator.component.css"],
    providers: [
        {
            provide: EIMComponent,
            useExisting: forwardRef(() => EIMLumpFolderCreatorComponent),
        },
        SelectModule,
    ],
    standalone: false
})
export class EIMLumpFolderCreatorComponent implements OnInit, EIMCreatable {
  /** フォーム */
  @ViewChild("lumpDocumentForm", { static: true }) lumpDocumentForm: NgForm;

  /** ドキュメントリスト */
  @ViewChild("lumpFolderCreatorConfirmation", { static: true })
  lumpFolderCreatorConfirmation: EIMLumpFolderCreatorConfirmationComponent;

  /** ワークスペースオブジェクトID */
  @Input()
  workspaceObjId: number;

  /** 親オブジェクトID */
  @Input()
  parentObjId: number;

  /** 追加ファイル（一覧画面にてドラッグした場合に指定） */
  @Input() addFileList: any[];

  /** パス */
  @Input() path = "";

  /** objId（登録時の電文用） */
  @Input() objId: number;

  /** プロパティ */
  @Input() property = "";

  /** 有効期限 */
  @Input() expirationDate = "";

  /** 作成者 */
  @Input() createUserId = "";

  /** 登録完了時のイベントエミッタ */
  @Output() created: EventEmitter<any> = new EventEmitter<any>();

  /** エラー発生時のイベントエミッタ */
  @Output() errored: EventEmitter<null> = new EventEmitter<null>();

  /** フォームグループ */
  public form: UntypedFormGroup;

  /** タイプ一覧表示データ */
  public typeSelectItems: SelectItem[] = [];

  /** 選択したタイプID */
  public selectedTypeId: number;

  /** 前回選択したタイプID */
  public preSelectedTypeId: number;

  /** 名前 */
  public name: string = null;

  /** 作成者 */
  public createUser: EIMUserDomain;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;
  
  /** ドキュメントリスト */
  public documentList: any[] = [];

  /** 状態 */
  public STATE = stateConst;
  public state = stateConst.EDITING;

  // /** 日付フォーマット */
  public dateFormat: string = this.translateService.instant(
    "EIM.CALENDAR.DATE_FORMAT"
  );

  /** カレンダー年範囲 */
  public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

  /**
   * コンストラクタです.
   */
  constructor(
    protected translateService: TranslateService,
    protected documentFormService: EIMDocumentFormService,
    protected documentsCacheService: EIMDocumentsCacheService,
    protected messageService: EIMMessageService,
    protected objectTypeService: EIMObjectTypeService,
    protected dialogManagerComponentService: EIMDialogManagerComponentService,

    protected dateService: EIMDateService
  ) {
    this.createUser = this.documentsCacheService.getLoginUser();
  }

  // ----------------------------------------
  // 公開メソッド
  // ----------------------------------------

  /**
   * 今日ボタンクリックイベントハンドラ
   * @param value 選択した値
   * @param calendar 選択したカレンダー
   */
  onClickToday(value, calendar): void {
    let crrentDate = new Date();
    calendar.currentMonth = crrentDate.getMonth();
    calendar.currentYear = crrentDate.getFullYear();
  }

  /**
   * クリアボタンクリックイベントハンドラ
   * @param value 選択した値
   * @param calendar 選択したカレンダー
   */
  onClickClear(value, calendar): void {
    calendar.currentMonth = calendar.months[0].month;
    calendar.currentYear = calendar.months[0].year;
  }

  /**
   * カレンダーボタンクリックイベントハンドラ
   * @param calendar 選択したカレンダー
   */
  openCalendar(calendar) {
    if (calendar.value) {
      const date: Date = calendar.value;
      // 設定値と選択しているカレンダーの日にちが異なる場合は、合わせる。
      if (
        date.getMonth() !== calendar.currentMonth ||
        date.getFullYear() !== calendar.currentYear
      ) {
        calendar.currentMonth = date.getMonth();
        calendar.currentYear = date.getFullYear();
      }
    }
  }

  /**
   * フォルダとドキュメントを一括登録します.
   */
  public create(): void {
    let dataList = this.documentList;
    let objectDataMap: Map<any, any> = new Map();
    let lumpList = [];

    for (let i = 0; i < dataList.length; i++) {
      objectDataMap.set(dataList[i].objName, dataList[i]);

      if (
        dataList[i].uploadStatus === uploadStatusNumber.CAN_UPLOAD ||
        dataList[i].uploadStatus === uploadStatusNumber.DISABLED_CHECKED ||
        dataList[i].uploadStatus === uploadStatusNumber.CHECKED
      ) {
        lumpList.push(dataList[i]);
      }
    }
    
    const formData = new FormData();
    let fileList: File[] = [];
    // 先にファイルの情報をリストに詰める
    const rootPathLength = this.path.length;
    lumpList.forEach((document) => {
      if (document.file) {
        // ファイルの情報としてfileListとfolderPathListは同じインデックスでペアとする必要がある
        formData.append("fileList", document.file, document.file.name);
        formData.append("folderPathList", document.path.slice(rootPathLength));
      }
    });
    // 次にフォルダの情報をリストに詰める
    lumpList.forEach((document) => {
      if (!document.file) {
        const folderPath =
          document.path.slice(rootPathLength) + document.objName + "/";
        formData.append("folderPathList", folderPath);
      }
    });
    formData.append("objId", this.parentObjId.toString());
    formData.append("documentTypeId", this.selectedTypeId.toString());

    formData.append("createUserId", this.createUser.id.toString());
    if (this.property && this.property != "") {
      formData.append("property", this.property);
    }
    if (this.expirationDate && this.expirationDate != "") {
      formData.append("expirationDate", this.expirationDate);
    }

    // 一括登録確認画面へ
    this.documentFormService.uploadFolder(formData).subscribe(
      (data: EIMObjectDomain[]) => {
        let createdData: any[] = [];
        let updatedData: any[] = [];
        data.forEach((folder) => {
          createdData.push({ objId: folder.id });
        });

        this.created.emit({
          createdData: createdData,
          updatedData: updatedData,
        });
      },
      (err: any) => {
        window.setTimeout(() => {
          this.errored.emit();
        });
        // エラー発生時
        this.dialogManagerComponentService.close(
          dialogName.LUMP_DOCUMENT_CREATOR
        );
        dataList[0].isError = true;
      }
    );
  }

  /**
   * 一括登録可否を返却します.
   * @return フォルダ登録可否
   */
  public creatable(): boolean {
    return (
      this.documentList &&
      this.documentList.length > 0 &&
      this.lumpDocumentForm.valid &&
      this.documentList.some(doc => doc.uploadStatus === uploadStatusNumber.CAN_UPLOAD || doc.uploadStatus === uploadStatusNumber.CHECKED)
    );
  }

  /**
   * ダイアログを閉じます.
   * 変更がある場合は破棄確認ダイアログを表示します。
   * @param event イベント
   * @param close クローズエミッタ
   */
  public close(event: any, close: EventEmitter<null>): void {
    event.preventDefault();
    if (this.lumpDocumentForm.dirty) {
      // 破棄確認ダイアログ
      this.messageService.show(
        EIMMessageType.confirm,
        this.translateService.instant("EIM.CONFIRM_00003"),
        () => {
          close.emit();
        }
      );
    } else {
      close.emit();
    }
  }

  // ----------------------------------------
  // イベントハンドラ
  // ----------------------------------------

  /**
   * 作成者選択ボタンクリックイベントハンドラ
   * @param event イベント
   */
  public displayUserSelector(event: any): void {
    let dialogId: string =
      this.dialogManagerComponentService.showAccessCheckedUserSelector(
        this.parentObjId,
        {
          selected: (createUser: any[]) => {
            this.dialogManagerComponentService.close(dialogId);
            this.onSelectCreateUser(createUser);
          },
        }
      );
  }

  /**
   * 作成者選択イベントハンドラ
   * @param users 選択されたユーザ情報
   */
  public onSelectCreateUser(users: any[]): void {
    let createUser: EIMUserDomain = new EIMUserDomain();
    createUser.id = users[0].id;
    createUser.name = users[0].name;
    createUser.code = users[0].code;
    createUser.kana = users[0].kana;
    createUser.mail = users[0].mail;
    this.createUser = createUser;
  }

  /**
   * 入力値初期化後のイベントハンドラです.
   */
  ngOnInit(): void {
    // ドキュメントタイプ一覧取得
    this.objectTypeService
      .getHierarchical(
        this.workspaceObjId,
        EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT
      )
      .subscribe(
        (hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
          this.setTypeSelectItems(hierarchicalContentsType, null);
        },
        (err: any) => {
          window.setTimeout(() => {
            this.errored.emit();
          });
          this.dialogManagerComponentService.close(
            dialogName.LUMP_FOLDER_CREATOR
          );
        }
      );
    window.setTimeout(() => {
      let resultList = [];
      this.addFileList.forEach((file) => {
        // ファイル
        if (file.isFile) {
          const fileName = file.fullPath.substring(
            file.fullPath.lastIndexOf("/") + 1
          );
          const folderPath = file.fullPath.substring(
            1,
            file.fullPath.lastIndexOf("/") + 1
          );

          resultList.push({
            checkinFlag: "false",
            objName: fileName,
            objType: "document",
            path: this.path + folderPath,
            reason: "",
            uploadStatus: -1, // デフォルトはチェックイン列に何も表示しない
            objTypeName: EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
            file: file.file,
            sortKey: file.fullPath
          });
        }
        // ディレクトリ
        else {
          const folderName = file.fullPath
            .substring(1)
            .substring(file.fullPath.lastIndexOf("/"));
          const folderPath = file.fullPath.substring(
            1,
            file.fullPath.lastIndexOf("/") + 1
          );

          resultList.push({
            checkinFlag: "false",
            objName: folderName,
            objType: "folder",
            path: this.path + folderPath,
            reason: "",
            uploadStatus: -1, // デフォルトはチェックイン列に何も表示しない
            objTypeName: EIMDocumentsConstantService.OBJECT_TYPE_FOLDER,
            sortKey: file.fullPath
          });
        }
      });

      // ソート処理
      resultList.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

      this.documentList = resultList;
    }, 500);
  }

  /**
   * タイプ変更イベントハンドラ
   * @param event イベント
   */
  onChangeType(event: any): void {
    this.changeType();
    if (this.lumpFolderCreatorConfirmation.documentList.getRowCount() != 0) {
      this.confirmUploadTarget();
    }
  }

  // ドラッグオーバーイベントハンドラ
  public handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // ドラッグリーブイベントハンドラ
  public handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // ドロップイベントハンドラ
  public async handleDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
  
    if (!event.dataTransfer?.items) return;
  
    const addFileList = [];
    const fileProcessList: Promise<void>[] = [];
    const folderPaths = new Set<string>();
  
    // すべてのルートアイテムを処理
    const rootPromises = Array.from(event.dataTransfer.items).map((item) => {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        return this.addFileInfo(addFileList, fileProcessList, entry, '', folderPaths);
      }
      return Promise.resolve();
    });
  
    await Promise.all(rootPromises);
    await Promise.all(fileProcessList);
  
    const existingEntries = new Set(
      this.documentList.map((item) => `${item.objName}|${item.path}|${item.objType}`)
    );
  
    const list = [];
  
    // フォルダの処理
    folderPaths.forEach(fullPath => {
      const pathParts = fullPath.split('/').filter(Boolean);
      let currentPath = this.path;
      
      // パスの各部分を処理してフォルダエントリを作成
      pathParts.forEach(folderName => {
        const folderEntry = {
          checkinFlag: 'false',
          objName: folderName,
          objType: 'folder',
          path: currentPath,
          reason: '',
          size: 0,
          uploadStatus: null,
          objTypeName: EIMDocumentsConstantService.OBJECT_TYPE_FOLDER,
          file: null,
          sortKey: currentPath + folderName
        };
  
        // 重複チェック
        const entryKey = `${folderEntry.objName}|${folderEntry.path}|${folderEntry.objType}`;
        if (!existingEntries.has(entryKey)) {
          list.push(folderEntry);
          existingEntries.add(entryKey);
        }
  
        currentPath += folderName + '/';
      });
    });
  
    // ファイルの処理
    addFileList.forEach(item => {
      if (item.isFile) {
        const pathParts = item.fullPath.split('/').filter(Boolean);
        const fileName = pathParts.pop(); // 最後の部分がファイル名
        const filePath = this.path + pathParts.join('/');
  
        const fileEntry = {
          checkinFlag: 'false',
          objName: fileName,
          objType: 'document',
          path: filePath + (pathParts.length > 0 ? '/' : ''),
          reason: '',
          size: item.file.size,
          uploadStatus: null,
          objTypeName: EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
          file: item.file,
          sortKey: filePath + '/' + fileName
        };
  
        const entryKey = `${fileEntry.objName}|${fileEntry.path}|${fileEntry.objType}`;
        if (!existingEntries.has(entryKey)) {
          list.push(fileEntry);
        }
      }
    });
  
    // パスでソート
    list.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  
    this.documentList = [...this.documentList, ...list];
  
    // サーバーへの登録可否確認
    if (this.selectedTypeId !== undefined && this.selectedTypeId !== 0) {
      await this.confirmUploadTarget();
    }
  }

  private async addFileInfo(
    fileList: any[], 
    fileProcessList: Promise<void>[], 
    item: any, 
    path: string,
    folderPaths: Set<string>
  ): Promise<void> {
    if (item.isFile) {
      if (item.fullPath !== '/' + item.name) {  // 直下へのファイルのアップロードは対象外
        const process = this.getFile(item).then((file) => {
          fileList.push({ isFile: true, fullPath: item.fullPath, file });
        });
        fileProcessList.push(process);
      }
    } else if (item.isDirectory) {
      // フォルダパスを追加（先頭のスラッシュを除去）
      const fullPath = item.fullPath.startsWith('/') ? item.fullPath.substring(1) : item.fullPath;
      folderPaths.add(fullPath);
  
      const dirReader = item.createReader();
      const entries = await this.readDirectoryEntries(dirReader);
  
      const subDirPromises = entries.map((entry) =>
        this.addFileInfo(fileList, fileProcessList, entry, path + item.name + '/', folderPaths)
      );
  
      await Promise.all(subDirPromises);
    }
  }
  
  private async readDirectoryEntries(dirReader: any): Promise<any[]> {
    const allEntries: any[] = [];
  
    await new Promise<void>((resolve) => {
      const readNext = () => {
        dirReader.readEntries((results) => {
          if (!results.length) {
            resolve();
          } else {
            allEntries.push(...results);
            readNext();
          }
        });
      };
      readNext();
    });
  
    return allEntries;
  }
  
  private getFile(item: any): Promise<File> {
    return new Promise((resolve, reject) => {
      item.file(
        (file: File) => resolve(file),
        (error: any) => reject(error)
      );
    });
  }

  /**
   * アップロードイベントハンドラ
   */
  public async handleDirectoryUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
  
    const files = Array.from(input.files) as File[];
    const folderSet = new Set<string>(); // フォルダ情報を一意に記録
    const existingEntries = new Set(
      this.documentList.map((item) => `${item.objName}|${item.path}|${item.objType}`) // 現在のリストの一意キー
    );
  
    const list = files.map((file) => {
        const relativePath = (file as any).webkitRelativePath; // 相対パスを取得
        const folderPath = this.path + relativePath.slice(0, relativePath.lastIndexOf('/')); // フォルダパス
  
        folderSet.add(folderPath); // フォルダパスを記録
  
        return {
          checkinFlag: 'false',
          objName: file.name,
          objType: 'document',
          path: folderPath + '/',
          reason: '',
          size: file.size,
          uploadStatus: null,
          objTypeName: EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
          file: file,
          sortKey: folderPath + '/' + file.name
        };
    }).filter(
        (item) => !existingEntries.has(`${item.objName}|${item.path}|${item.objType}`) // 重複を排除
    );
  
    // 親フォルダから孫フォルダまで追加
    folderSet.forEach((folderPath) => {
      const folderName = folderPath.split('/').filter(Boolean).pop(); // フォルダ名を抽出
      const folderItem = {
        checkinFlag: 'false',
        objName: folderName,
        objType: 'folder',
        path: folderPath.slice(0, folderPath.lastIndexOf('/') + 1),
        reason: '',
        size: 0,
        uploadStatus: null,
        objTypeName: EIMDocumentsConstantService.OBJECT_TYPE_FOLDER,
        file: null,
        sortKey: folderPath
      };
  
      if (!existingEntries.has(`${folderItem.objName}|${folderItem.path}|${folderItem.objType}`)) {
        list.push(folderItem);
      }
    });
  
    list.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    this.documentList = [...this.documentList, ...list];
  
    // サーバーへの登録可否確認
    if (this.selectedTypeId !== undefined && this.selectedTypeId !== 0) {
      await this.confirmUploadTarget();
    }
  
    // 入力をリセットして再度変更イベントを検出できるようにする
    input.value = '';
  }

  /**
   * クリアボタンクリックイベントハンドラ
   */
  public clearUploadFile(){
	  this.documentList = [];
  }

  /**
   * タイプ選択画面表示ボタンクリックイベントハンドラ
   * @param event イベント
   */
  onClickShowObjectTypeSelector(event: any): void {
    // ドキュメントタイプツリーを表示する
    let dialogId: string =
      this.dialogManagerComponentService.showObjectTypeTreeSelector(
        null,
        this.workspaceObjId,
        EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
        {
          selected: (documentType: any) => {
            this.dialogManagerComponentService.close(dialogId);
            this.selectedTypeId = documentType.id;
            this.changeType();
          },
        }
      );
  }

  // /**
  //  * ワークフローダイアグラムエラー時イベントハンドラ
  //  */
  // workflowDiagramErroed(): void {
  // 	this.selectedTypeId = null;
  // }

  // ----------------------------------------
  // 非公開メソッド
  // ----------------------------------------

  /**
   * ドキュメントタイプ変更処理です.
   * ワークフローを更新します.
   */
  private changeType(): void {
    // // ワークフロー表示初期化
    // let objTypeId: number = this.selectedTypeId;
    // this.workflowDiagram.clear();
    // this.workflowDiagram.show({createType: 'document', objTypeId: objTypeId, workspaceId: this.parentObjId});
    this.preSelectedTypeId = this.selectedTypeId;
  }

  /**
   * タイプコンボボックス用のデータを生成します.
   * @param objectTypes オブジェクトタイプ情報
	 * @param typeSelectItems オブジェクトタイプ情報配列
   */
  private setTypeSelectItems(
    objectTypes: EIMHierarchicalObjectTypeDomain[], 
    typeSelectItems: SelectItem[]
  ): void {

    // 再帰呼び出しでは、typeSelectItemsにリストを追加していく
		let tmp:SelectItem[] = (typeSelectItems == null) ? [] : typeSelectItems;

    for (let i = 0; i < objectTypes.length; i++) {
      let objectType: EIMHierarchicalObjectTypeDomain = objectTypes[i];
      if (objectType.children && objectType.children.length === 0) {
        // 末端
        tmp.push({
          label: objectType.name,
          value: objectType.id,
        });
      } else {
        this.setTypeSelectItems(objectType.children, tmp);
      }
    }

		// 変更通知を出すため、再帰呼び出しではない最初の呼び出しの最後で、this.typeSelectItemsに設定する
		if(typeSelectItems == null){
			this.typeSelectItems = tmp;
		}
  }

  /**
   * アップロード対象のフォルダとドキュメントの登録可否チェックを行います。
   */
  private confirmUploadTarget() {
    const formData = new FormData();

    // 先にファイルの情報をリストに詰める
    const rootPathLength = this.path.length;
    this.documentList.forEach((document) => {
      if (document.file) {
        // ファイルの情報としてfileListとfolderPathListは同じインデックスでペアとする必要がある
        formData.append("fileList", document.file, document.file.name);
        formData.append("folderPathList", document.path.slice(rootPathLength));
      }
    });
    // 次にフォルダの情報をリストに詰める
    this.documentList.forEach((document) => {
      if (!document.file) {
        const folderPath =
          document.path.slice(rootPathLength) + document.objName + "/";
        formData.append("folderPathList", folderPath);
      }
    });

    formData.append("documentTypeId", this.selectedTypeId.toString());
    formData.append("parentPath", this.path.toString());

    this.documentFormService.confirmUploadTarget(formData).subscribe(
      (data: any) => {
        // 登録可否結果の反映
        this.setCheckData(data);
      },
      (error) => {
        console.error("Error occurred", error);
      }
    );
  }

  /**
   * フォルダとドキュメントの登録可否チェック結果をグリッドに反映します。
   */
  private setCheckData(data: any) {
    let listData = data;
    let okData = [];

    // 現在のドキュメントリストの状態を保持
    const currentDocuments = new Map(
      this.documentList.map((doc) => [`${doc.path}${doc.objName}`, doc])
    );

    if (listData) {
      if (listData.length && listData.length > 0) {
        for (let n = 0; n < listData.length; n++) {
          const convertedData = this.convertList(listData[n]);
          // 同じパスとファイル名を持つ既存のドキュメントを探す
          const existingDoc = currentDocuments.get(
            `${convertedData.path}${convertedData.objName}`
          );

          if (existingDoc) {
            // 既存のファイル参照を維持
            convertedData.file = existingDoc.file;
          }

          okData.push(convertedData);
        }
      } else if (listData.attr) {
        const convertedData = this.convertList(listData.attr);
        const existingDoc = currentDocuments.get(
          `${convertedData.path}${convertedData.objName}`
        );

        if (existingDoc) {
          convertedData.file = existingDoc.file;
        }

        okData.push(convertedData);
      }
    }

    this.documentList = okData;
  }

  /**
   * 登録可否結果リストの型変換を行います。
   */
  private convertList(obj: any): any {
    if (!obj) return null;

    let objTypeName = "";
    if (obj.objType === "folder") {
      objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
    } else if (obj.objType === "document") {
      objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT;
    }

    return {
      checkinFlag: obj.checkinFlag,
      objName: obj.objName,
      objType: obj.objType,
      path: obj.path,
      reason: obj.reason,
      uploadStatus: Number(obj.uploadStatus),
      objTypeName: objTypeName,
      sameNameObjId: obj.sameNameObjId,
    };
  }
}
