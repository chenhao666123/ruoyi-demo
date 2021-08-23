package com.ruoyi.system.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.annotation.Excel.ColumnType;
import com.ruoyi.common.core.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * 系统访问记录表 sys_logininfor
 *
 * @author ruoyi
 */

@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Data
public class SysLoginInfo extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * ID
     */
    @Excel(name = "序号", cellType = ColumnType.NUMERIC)
    private Long infoId;

    /**
     * 用户账号
     */
    @Excel(name = "用户账号")
    private String userName;

    /**
     * 登录状态 0成功 1失败
     */
    @Excel(name = "登录状态", readConverterExp = "0=成功,1=失败")
    private String status;

    /**
     * 登录IP地址
     */
    @Excel(name = "登录地址")
    private String ipAddress;

    /**
     * 登录地点
     */
    @Excel(name = "登录地点")
    private String loginLocation;

    /**
     * 浏览器类型
     */
    @Excel(name = "浏览器")
    private String browser;

    /**
     * 操作系统
     */
    @Excel(name = "操作系统")
    private String os;

    /**
     * 提示消息
     */
    @Excel(name = "提示消息")
    private String msg;

    /**
     * 访问时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "访问时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date loginTime;

   /* public Long getInfoId() {
        return infoId;
    }

    public SysLoginInfo setInfoId(Long infoId) {
        this.infoId = infoId;
        return this;
    }

    public String getUserName() {
        return userName;
    }

    public SysLoginInfo setUserName(String userName) {
        this.userName = userName;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public SysLoginInfo setStatus(String status) {
        this.status = status;
        return this;
    }

    public String getIpaddr() {
        return ipaddr;
    }

    public SysLoginInfo setIpaddr(String ipaddr) {
        this.ipaddr = ipaddr;
        return this;
    }

    public String getLoginLocation() {
        return loginLocation;
    }

    public SysLoginInfo setLoginLocation(String loginLocation) {
        this.loginLocation = loginLocation;
        return this;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Date getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Date loginTime) {
        this.loginTime = loginTime;
    }*/
}
