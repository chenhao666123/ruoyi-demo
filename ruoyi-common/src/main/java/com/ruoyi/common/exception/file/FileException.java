package com.ruoyi.common.exception.file;

import com.ruoyi.common.exception.BaseException;

/**
 * @Author Leejiyun
 * @Date 2021/8/7
 */
public class FileException extends BaseException {
    private static final long serialVersionUID = 1L;

    public FileException(String code, Object[] args) {
        super("file", code, args, null);
    }

}
