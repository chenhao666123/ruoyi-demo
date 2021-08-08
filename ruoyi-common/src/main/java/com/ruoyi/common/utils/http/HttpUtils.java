package com.ruoyi.common.utils.http;

import com.ruoyi.common.constant.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @Author Leejiyun
 * @Date 2021/8/8
 */
public class HttpUtils {
    public static final Logger log = LoggerFactory.getLogger(HttpUtils.class);

    /**
     * 指定 URL 发送 GET 方法的请求
     *
     * @param url 发送指定的 URL
     * @param param 请求参数, 全球参数应该是name1=value1 的形式
     * @return 所代表的资源的响应结果
     * */
    public static String sendGet(String url, String param) {
        return sendGet(url, param, Constants.UTF8);
    }

    /**
     * 向指定 URL 发送GET方法的请求
     *
     * @param url         发送请求的 URL
     * @param param       请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @param contentType 编码类型
     * @return 所代表远程资源的响应结果
     */
    private static String sendGet(String url, String param, String contentType) {
        return null;
    }
}
