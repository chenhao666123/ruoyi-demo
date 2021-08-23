package com.ruoyi.framework.manager.factory;

import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.utils.LogUtils;
import com.ruoyi.common.utils.ServletUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.ip.AddressUtils;
import com.ruoyi.common.utils.ip.IpUtils;
import com.ruoyi.common.utils.spring.SpringUtils;
import com.ruoyi.system.domain.SysLoginInfo;
import com.ruoyi.system.domain.SysOperLog;
import com.ruoyi.system.service.ISysLoginInfoService;
import com.ruoyi.system.service.ISysOperLogService;
import eu.bitwalker.useragentutils.UserAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.TimerTask;

/**
 * 异步工厂(产生任务用)
 *
 * @Author Leejiyun
 * @Date 2021/8/21
 */
public class AsyncFactory {
    private static final Logger sys_user_logger = LoggerFactory.getLogger("sys-user");

    /**
     * 记录登录信息
     *
     * @param username 用户名
     * @param status   状态
     * @param message  消息
     * @param args     列表
     * @return 任务task
     */
    public static TimerTask recordLoginInfo(final String username, final String status, final String message,
                                            final Object... args) {
        final UserAgent userAgent = UserAgent.parseUserAgentString(ServletUtils.getRequest().getHeader("User-Agent"));
        final String ip = IpUtils.getIpAddress(ServletUtils.getRequest());
        return new TimerTask() {
            @Override
            public void run() {
                String address = AddressUtils.getRealAddressByIP(ip);
                StringBuilder sb = new StringBuilder();
                sb.append(LogUtils.getBlock(ip));
                sb.append(address);
                sb.append(LogUtils.getBlock(username));
                sb.append(LogUtils.getBlock(status));
                sb.append(LogUtils.getBlock(message));
                // 打印信息到日志
                sys_user_logger.info(sb.toString(), args);
                // 获取客户端操作系统
                String os = userAgent.getOperatingSystem().getName();
                // 获取客户端浏览器
                String brower = userAgent.getBrowser().getName();
                // 封装对象
                SysLoginInfo loginInfo = new SysLoginInfo();
                loginInfo.setUserName(username)
                        .setIpAddress(ip)
                        .setLoginLocation(address)
                        .setBrowser(brower)
                        .setOs(os)
                        .setMsg(message);
                // 日志状态
                if (StringUtils.equalsAny(status, Constants.LOGIN_SUCCESS, Constants.LOGOUT, Constants.REGISTER)) {
                    loginInfo.setStatus(Constants.SUCCESS);
                } else if (Constants.LOGIN_FAIL.equals(Constants.FAIL)) {
                    loginInfo.setStatus(Constants.FAIL);
                }
                SpringUtils.getBean(ISysLoginInfoService.class).insertLoginInfo(loginInfo);
            }
        };
    }

    /**
     * 操作日志记录
     *
     * @param operLog 操作日志信息
     * @return 任务task
     */
    public static TimerTask recordOper(final SysOperLog operLog) {
        return new TimerTask() {
            @Override
            public void run() {
                // 远程查询操作地点
                operLog.setOperLocation(AddressUtils.getRealAddressByIP(operLog.getOperIp()));
                SpringUtils.getBean(ISysOperLogService.class).insertOperlog(operLog);
            }
        };
    }
}
