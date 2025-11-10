import { EIMSimpleObjectDTO } from "app/shared/dtos/simple-object.dto";

/**
 * 登録されたプロジェクトマスタ情報
 */
export interface EIMCreatedProjectMasterDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO,
	/** 登録されたプロジェクトマスタオブジェクト */
	createdDTO: EIMSimpleObjectDTO
}

/**
 * 更新されたプロジェクトマスタ情報
 */
export interface EIMUpdatedProjectMasterDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO, 
	/** 更新されたプロジェクトマスタオブジェクト */
	updatedDTO: EIMSimpleObjectDTO
}

/**
 * 登録されたプロセスマスタ情報
 */
export interface EIMCreatedProcessMasterDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO,
	/** 登録されたプロセスマスタオブジェクト */
	createdDTO: EIMSimpleObjectDTO
}

/**
 * 更新されたプロセスマスタ情報
 */
export interface EIMUpdatedProcessMasterDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO, 
	/** 更新されたプロセスマスタオブジェクト */
	updatedDTO: EIMSimpleObjectDTO
}

/**
 * 登録されたタスクマスタ情報
 */
export interface EIMCreatedTaskMasterDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO,
	/** 登録されたタスクマスタオブジェクト */
	createdDTO: EIMSimpleObjectDTO
}

/**
 * 更新されたタスクマスタ情報
 */
export interface EIMUpdatedTaskMasterDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO, 
	/** 更新されたタスクマスタオブジェクト */
	updatedDTO: EIMSimpleObjectDTO
}

/**
 * 登録されたプロジェクト情報
 */
export interface EIMCreatedProjectDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO,
	/** 登録されたプロジェクトオブジェクト */
	createdDTO: EIMSimpleObjectDTO
}

/**
 * 更新されたプロジェクト情報
 */
export interface EIMUpdatedProjectDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO, 
	/** 更新されたプロジェクトオブジェクト */
	updatedDTO: EIMSimpleObjectDTO
}

/**
 * 登録されたプロセス情報
 */
export interface EIMCreatedProcessDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO,
	/** 登録されたプロセスオブジェクト */
	createdDTO: EIMSimpleObjectDTO
}

/**
 * 更新されたプロセス情報
 */
export interface EIMUpdatedProcessDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO, 
	/** 更新されたプロセスオブジェクト */
	updatedDTO: EIMSimpleObjectDTO
}

/**
 * 登録されたタスク情報
 */
export interface EIMCreatedTaskDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO,
	/** 登録されたタスクオブジェクト */
	createdDTO: EIMSimpleObjectDTO
}

/**
 * 更新されたタスク情報
 */
export interface EIMUpdatedTaskDTO {
	/** 親オブジェクト */
	parentDTO: EIMSimpleObjectDTO, 
	/** 更新されたタスクオブジェクト */
	updatedDTO: EIMSimpleObjectDTO
}
