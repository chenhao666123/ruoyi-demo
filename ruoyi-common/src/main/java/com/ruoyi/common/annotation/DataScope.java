package com.ruoyi.common.annotation;

import java.lang.annotation.*;

/**
 * @Author Leejiyun
 * @Date 2021/8/7
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataScope {
    /**
     * 部门表的别名
     * */
    String deptAlias() default "";
    /**
     * 用户表的别名
     * */
    String userAlias() default "";

}
