package com.example.demo.model;

import java.util.List;

public class LaunchResponse {
  String msg;
  List<CapData> capList;

  //getters and setters

  public String getMsg() {
    return msg;
  }

  public void setMsg(String msg) {
    this.msg = msg;
  }

  public List<CapData> getCapList() {
    return capList;
  }

  public void setCapList(List<CapData> capList) {
    this.capList = capList;
  }
}
