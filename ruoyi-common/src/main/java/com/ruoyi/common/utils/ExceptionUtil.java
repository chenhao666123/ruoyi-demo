package com.ruoyi.common.utils;

import org.apache.commons.lang3.exception.ExceptionUtils;

import java.io.StringWriter;

/**
 * @Author Leejiyun
 * @Date 2021/8/8
 */
public class ExceptionUtil {
    /**
     * 获取exception的详情错误信息
     * */
    public static String getExceptionMessage(Throwable e) {
        StringWriter sw = new StringWriter();
        e.printStackTrace();
        String str = sw.toString();
        return str;
    }

    public static String getRootErrorMessage(Exception e) {
        Throwable root = ExceptionUtils.getRootCause(e);
        root = (root == null ? e : root);
        if (root == null) {
            return "";
        }
        String msg = root.getMessage();
        if (msg == null) {
            return "null";
        }
        return StringUtils.defaultString(msg);
    }
}
