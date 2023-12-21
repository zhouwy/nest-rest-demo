import { BizCode } from 'src/common/enums/biz-code.enum';

export class BizException extends Error {
    public readonly code: BizCode;
    public readonly message: string;

    constructor(code: BizCode = BizCode.FAILURE, message: string = 'System Error') {
        super(message);
        this.code = code;
    }
}
