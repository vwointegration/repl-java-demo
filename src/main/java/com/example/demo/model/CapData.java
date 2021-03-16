package com.example.demo.model;

public class CapData {
  String name;
  String src;
  String price;
  int stars;

  public CapData(String name, String src, String price, int stars) {
    this.name = name;
    this.src = src;
    this.price = price;
    this.stars = stars;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSrc() {
    return src;
  }

  public void setSrc(String src) {
    this.src = src;
  }

  public String getPrice() {
    return price;
  }

  public void setPrice(String price) {
    this.price = price;
  }

  public int getStars() {
    return stars;
  }

  public void setStars(int stars) {
    this.stars = stars;
  }
}
