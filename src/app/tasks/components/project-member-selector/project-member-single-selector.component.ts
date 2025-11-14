import { Component, Input, OnInit, forwardRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMMessageService } from 'app/shared/services/message.service';


import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMProjectMemberSingleSelectorComponentService } from './project-member-single-selector.component.service';
import { EIMMembersService } from 'app/shared/services/apis/members.service';
import { EIMMembersDomain } from 'app/shared/domains/entity/members.domain';
import { EIMMemberEntryDomain } from 'app/shared/domains/entity/member-entry.domain';
import { EIMUser } from 'app/shared/services/apis/authentication.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';

/**
 * プロジェクトメンバー単数選択コンポーネント
 */
@Component({
	selector: 'eim-project-member-single-selector',
	templateUrl: './project-member-single-selector.component.html',
	styleUrls: ['./project-member-single-selector.component.scss'],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMProjectMemberSingleSelectorComponent)},
	            {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMProjectMemberSingleSelectorComponent)}],
	standalone: false
})
export class EIMProjectMemberSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable, OnInit {

	/** ワークスペースId */
	@Input() public workspaceId: number = null;

	/** 複数行選択可フラグ */
	@Input()
		public multiple = false;

	/** 検索条件 */
	public condition: any = {
		keyword: '',
		users: [] // プロジェクト全ユーザ（メンバー）。フィルタリングで取得した全メンバーを絞る
	};

	/** 表示カラムリスト */
	public columns: any[] = [];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,

		protected membersService: EIMMembersService,
		public projectMemberSingleSelectorComponentService: EIMProjectMemberSingleSelectorComponentService
	) {
		super(projectMemberSingleSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択します.
	 */
	public override select(): void {
		this.selected.emit(this.template.searchResultList.getSelectedData());
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {

		super.ngOnInit();

		// 検索対象ラベル、一覧表示カラム設定
		let columns: any[] = [];
		columns.push({fieldPath: ['code'], headerName: this.translateService.instant("EIM.LABEL_02001"), width: 200});
		columns.push({fieldPath: ['name'], headerName: this.translateService.instant("EIM.LABEL_02002"), width: 300});
		this.columns = columns;
		this.setColumns();

		this.condition.workspaceId = this.workspaceId;

		// メンバーズ取得
		this.membersService.getByObjectId(this.workspaceId).subscribe((res: any) => {

			const members = new EIMMembersDomain(res);

			// 通知先ユーザ一覧を取得
			const userIdSet = new Set();
			let users: EIMUserDTO[] = [];
			for (const member of members.memberEntryList) {
				if (member.entryType === 'USER') {
					const userDTO: EIMUserDTO = this.convertToUserDTO(member.entryElement);
					if (userIdSet.has(userDTO.id)) {
						continue;
					}
					users.push(userDTO);
					userIdSet.add(userDTO.id);
				} else if (member.entryType === 'GROUP') {
					for (const groupUser of member.entryElement['userList']) {
						const userDTO: EIMUserDTO = this.convertToUserDTO(groupUser);
						if (userIdSet.has(userDTO.id)) {
							continue;
						}
						users.push(userDTO);
						userIdSet.add(userDTO.id);
					}
				}
			}

			// ユーザIDでソート
			users = users.sort((a: EIMUserDTO, b: EIMUserDTO) => {
				if (a.code > b.code) {
					return 1;
				}
				if (a.code < b.code) {
					return -1;
				}
				return 0;
			});

			// メールアドレス未設定のユーザは除外する
			const filteredUsers = users.filter((user) => user['mail'] !== null);
			this.condition.users = filteredUsers;

			this.info.dataGrid.setData(this.condition.users);
			this.info.dataGrid.refreshView();
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * DTOをDomainに変換して変換します.
	 * @params dto DTO
	 * @return Domain
	 */
	protected convertDtoToDomain(dto: EIMMembersDomain): EIMMembersDomain {

		return dto;
	}

	/**
	 * ユーザメンバーをEIMUserDTOに変換します.
	 * 
	 * @param user ユーザメンバー
	 * @return EIMUserDTO型のユーザ情報
	 */
	private convertToUserDTO(user: any): EIMUserDTO {

		const dto: EIMUserDTO = new EIMUserDTO();
		dto.id = user.id;
		dto.code = user.code;
		dto.name = user.name;
		dto.mail = user.mail;
	
		return dto;
	}
	
	
}
