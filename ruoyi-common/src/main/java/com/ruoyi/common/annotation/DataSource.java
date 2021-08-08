package com.ruoyi.common.annotation;

import com.ruoyi.common.enums.DateSourceType;

import java.lang.annotation.*;

/**
 * @Author Leejiyun
 * @Date 2021/8/7
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface DataSource {
    /**
     * 切换数据源的名称
     * */
    DateSourceType value() default DateSourceType.MASTER;
}
