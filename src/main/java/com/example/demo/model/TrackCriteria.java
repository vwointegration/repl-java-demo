package com.example.demo.model;

import com.vwo.VWOAdditionalParams;

public class TrackCriteria {

  String campaignKey;
  String goalIdentifier;
  String userId;
  VWOAdditionalParams vwoAdditionalParams;

  public String getCampaignKey() {
    return campaignKey;
  }

  public void setCampaignKey(String campaignKey) {
    this.campaignKey = campaignKey;
  }

  public String getGoalIdentifier() {
    return goalIdentifier;
  }

  public void setGoalIdentifier(String goalIdentifier) {
    this.goalIdentifier = goalIdentifier;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public VWOAdditionalParams getVwoAdditionalParams() {
    return vwoAdditionalParams;
  }

  public void setVwoAdditionalParams(VWOAdditionalParams vwoAdditionalParams) {
    this.vwoAdditionalParams = vwoAdditionalParams;
  }
}
