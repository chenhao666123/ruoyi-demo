package com.ruoyi.common.enums;

/**
 * @Author Leejiyun
 * @Date 2021/8/7
 */
public enum UserStatus {
    OK("0", "success"), DISABLE("1", "stop"), DELETED("2", "Delete");

    private final String code;
    private final String info;

    UserStatus(String code, String info) {
        this.code = code;
        this.info = info;
    }

    public String getCode() {
        return code;
    }

    public String getInfo() {
        return info;
    }


}
