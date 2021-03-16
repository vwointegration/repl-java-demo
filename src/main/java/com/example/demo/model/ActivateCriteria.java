package com.example.demo.model;

import com.vwo.VWOAdditionalParams;

public class ActivateCriteria {
  String campaignKey = "";
  String userId = "";
  VWOAdditionalParams additionalParams;
  String msg;

  public String getMsg() {
    return msg;
  }

  public void setMsg(String msg) {
    this.msg = msg;
  }

  public String getCampaignKey() {
    return campaignKey;
  }

  public void setCampaignKey(String campaignKey) {
    this.campaignKey = campaignKey;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public VWOAdditionalParams getAdditionalParams() {
    return additionalParams;
  }

  public void setAdditionalParams(VWOAdditionalParams additionalParams) {
    this.additionalParams = additionalParams;
  }
}
