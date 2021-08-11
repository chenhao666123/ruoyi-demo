package com.ruoyi;

import com.ruoyi.RuoYiApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * @Author Leejiyun
 * @Date 2021/8/10
 */
public class RuoYiServletInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(RuoYiApplication.class);
    }

}
