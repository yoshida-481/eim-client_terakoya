import {
  Component,
  EventEmitter,
  ViewChild,
  Output,
  Input,
  forwardRef,
} from "@angular/core";
import {
  EIMDataGridColumn,
  EIMDataGridComponent,
} from "app/shared/components/data-grid/data-grid.component";
import { TranslateService } from "@ngx-translate/core";
import { EIMCheckboxRendererComponent } from "app/shared/components/renderer/checkbox-renderer.component";
import { EIMComponent } from "app/shared/shared.interface";
import { Dropdown, DropdownModule } from "primeng/dropdown";
import {
  dialogName,
  EIMDialogManagerComponentService,
} from "app/documents/shared/components/dialog-manager/dialog-manager.component.service";
import {
  EIMMessageService,
  EIMMessageType,
} from "app/shared/services/message.service";
import { EIMBoxContentsListComponentService } from "../box-contents-list/box-contents-list.component.service";
import { EIMDropdownInputRendererComponent } from "app/documents/shared/components/renderer/dropdown-input-renderer.component";
import { EIMServerConfigService } from "app/shared/services/server-config.service";

@Component({
  providers: [
    {
      provide: EIMComponent,
      useExisting: forwardRef(() => BoxSelectorComponent),
    },
    DropdownModule,
  ],
  selector: "eim-box-selector", // コンポーネントのセレクタ名
  templateUrl: "./box-selector.component.html", // HTMLテンプレート
  styleUrls: ["./box-selector.component.css"], // CSSスタイル
  standalone: false, 
})
export class BoxSelectorComponent {
  @Input() selectedData: any[];

  @Input() boxData: any[];

  @Output() closeDialog = new EventEmitter<boolean>(); // ダイアログの閉じるイベント

  // 選択したデータリスト
  public selectedDataList = [];

  // フォーマット選択用のプルダウンリスト
  public options = [
    {
      label: this.translateService.instant("EIM_DOCUMENTS.LABEL_03134"),
      value: "0",
    },
    {
      label: this.translateService.instant("EIM_DOCUMENTS.LABEL_03022"),
      value: "1",
    },
  ];

  // フォーマットダイアログのデータグリッド
  @ViewChild("formSelectDataGrid", { static: true })
  formSelectDataGrid: EIMDataGridComponent;

  /** コンテンツリスト */
  @ViewChild("contentsList", { static: true })
  contentsList: EIMDataGridComponent;

  // フォーマットの初期値
  private initialFormatValue: any;

  // フォーマットの初期値設定(公開を選択可)
  private boxDefaultSettingPublic: boolean;

  // 公開ドキュメント
  private publicDocumentID: string =
    this.serverConfigService.publicDocumentFormat;

  /**
   * コンストラクタです.
   */
  constructor(
    protected translateService: TranslateService,
    protected dialogManagerComponentService: EIMDialogManagerComponentService,
    protected messageService: EIMMessageService,
    public componentService: EIMBoxContentsListComponentService,
    protected serverConfigService: EIMServerConfigService
  ) {}

  public optionsFunction(selectData: any): any {
    let readOnly: boolean = selectData.data.readOnly;
    const statusTypeKind = selectData.data.statusTypeKind;
    const publicFileName = selectData.data.publicFileName;
    if (readOnly === true) {
      return (this.options = [selectData.dropdown[1]]);
    } else {
      if (!(statusTypeKind.length > 0) || publicFileName === undefined) {
        return (this.options = [selectData.dropdown[0]]);
      } else {
        return (this.options = selectData.dropdown);
      }
    }
  }

  public create(): void {
    let dataList: String[] = [];
    let format_Id = "";

    this.selectedDataList.forEach((selectData) => {
      if (selectData.checked) {
        if (selectData.format == 0) {
          format_Id = "";
        } else {
          format_Id = this.publicDocumentID;
        }
        selectData.data = { ...selectData.data, formatId: format_Id };
        dataList.push(selectData.data);
      }
    });
    this.createBox(dataList);

    this.dialogManagerComponentService.close(dialogName.BOX_SELECTOR);
  }

  public creatable(): boolean {
    return true;
  }

  /**
     * 子コンポーネントのビュー生成後のイベントハンドラです.
     * データグリッド列の初期化を行います.
  //    */
  ngOnInit(): void {
    let formSelectColumns: EIMDataGridColumn[] = [];
    formSelectColumns = [];
    // チェックボックス
    formSelectColumns.push({
      width: 50,
      field: "checked",
      headerName: "",
      cellRendererFramework: EIMCheckboxRendererComponent,
      param: { displayCenter: true },
    });
    // 名前
    formSelectColumns.push({
      field: "name",
      headerName: this.translateService.instant("EIM_DOCUMENTS.LABEL_02000"),
      width: 160,
    });
    // Format
    formSelectColumns.push({
      field: "format",
      headerName: this.translateService.instant("EIM_ADMINS.LABEL_02023"),
      width: 120,
      cellRendererFramework: EIMDropdownInputRendererComponent,
      cellRendererParams: {
        options: this.options,
        optionsFunction: this.optionsFunction,
        editableFunction: (data: any) => true, // 編集可能
      },
    });
    this.formSelectDataGrid.setColumns(formSelectColumns);
    this.boxDefaultSettingPublic =
      this.serverConfigService.boxDefaultSettingPublic;

    if (this.selectedData.length > 0) {
      this.selectedDataList = this.selectedData.map((data) => {
        // フォーマットの初期値設定
        // 公開ドキュメントのみ
        if (data.readOnly === true) {
          this.initialFormatValue = this.options[1];
        } else {
          // 原本ドキュメントのみ
          if (
            !(data.statusTypeKind.length > 0) ||
            data.publicFileName === undefined
          ) {
            this.initialFormatValue = this.options[0];
            // 原本/公開ドキュメント 初期値はconfigで設定(boxDefaultSettingPublic)
          } else {
            this.initialFormatValue = this.boxDefaultSettingPublic
              ? this.options[1]
              : this.options[0];
          }
        }
        return {
          data: data,
          displayCenter: true,
          checked: true,
          name: data.objName,
          format: [this.initialFormatValue.value],
          dropdown: this.options,
        };
      });
    }
    this.formSelectDataGrid.setData(this.selectedDataList);
  }

  // Box共通公開メソッド
  /**
   * Boxにファイルを作成します.
   * @param data EIMドキュメントオブジェクトのid,objNameのリスト
   */
  private createBox(data: any[]) {
    if (!data || !data.length) {
      return;
    }
    const boxCopyFiles = data.map((obj) => ({
      id: obj.objId,
      name: obj.formatId === "" ? obj.objName : obj.publicFileName,
      formatId: obj.formatId,
      boxFileId: null,
    }));
    if (!this.boxData || this.boxData.length === 0) {
      this.componentService.boxSelectCreate(boxCopyFiles);
      return;
    }

    // コピー対象のEIMストレージファイルに同名ファイルがないかチェック
    const fileNameSet = new Set();
    for (let i = 0; i < boxCopyFiles.length; i++) {
      if (fileNameSet.has(boxCopyFiles[i].name)) {
        // 同名ファイルはコピーできない
        this.messageService.show(
          EIMMessageType.error,
          this.translateService.instant("EIM_DOCUMENTS.ERROR_00123")
        );
        return;
      }
      fileNameSet.add(boxCopyFiles[i].name);
    }
    // Box領域に同名ファイルがないかチェック
    const boxFileNameAndDataMap = new Map();
    for (let i = 0; i < this.boxData.length; i++) {
      boxFileNameAndDataMap.set(this.boxData[i].name, this.boxData[i]);
    }
    let existsSameName = false;
    for (let i = 0; i < boxCopyFiles.length; i++) {
      if (boxFileNameAndDataMap.get(boxCopyFiles[i].name)) {
        existsSameName = true;
        boxCopyFiles[i].boxFileId = boxFileNameAndDataMap.get(
          boxCopyFiles[i].name
        ).id;
      }
    }
    if (!existsSameName) {
      this.componentService.boxSelectCreate(boxCopyFiles);
      return;
    }

    // 同名ファイル上書き確認
    this.messageService.show(
      EIMMessageType.confirm,
      this.translateService.instant("EIM_DOCUMENTS.CONFIRM_00038"),
      () => {
        this.componentService.boxSelectCreate(boxCopyFiles);
      }
    );
  }
}
