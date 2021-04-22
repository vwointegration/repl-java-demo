package com.example.demo.model;

import java.util.List;

public class ActivateResponse {
  String msg;
  List<CapData> recommendations;
  String variationName;
  boolean status;


  //getters and setters
  public List<CapData> getRecommendations() {
    return recommendations;
  }

  public void setRecommendations(List<CapData> recommendations) {
    this.recommendations = recommendations;
  }

  public String getVariationName() {
    return variationName;
  }

  public void setVariationName(String variationName) {
    this.variationName = variationName;
  }

  public String getMsg() {
    return msg;
  }

  public void setMsg(String msg) {
    this.msg = msg;
  }

  public boolean getStatus() {
    return status;
  }

  public void setStatus(boolean status) {
    this.status = status;
  }
}
