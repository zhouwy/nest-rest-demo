
import { BizCode } from 'src/common/enums/biz-code.enum';

export interface Response {
    /**
     * 业务状态码
     */
    code: BizCode;
	/**
     * 返回数据（如有）
     */
    data: any;
    /**
     * 错误信息
     */
    message: any;

}
