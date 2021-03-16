package com.example.demo.model;

import com.vwo.VWOAdditionalParams;

public class TrackCriteria {

  String camapignKey;
  String goalIdentifier;
  String userId;
  VWOAdditionalParams vwoAdditionalParams;

  public String getCamapignKey() {
    return camapignKey;
  }

  public void setCamapignKey(String camapignKey) {
    this.camapignKey = camapignKey;
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
