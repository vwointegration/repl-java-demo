package com.example.demo.services;

import com.example.demo.model.CapData;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

public class CapService {

  private List<CapData> capList;


  public List<CapData> getAllCaps() {
    capList = new ArrayList<CapData>();
    capList.add(new CapData("Cap XLV", "/images/cap.svg", "$8.25", 3));
    capList.add(new CapData("Cap VIII", "/images/cap1.svg", "$11.00", 5));
    capList.add(new CapData("Cap XC", "/images/cap3.svg", "$10.50", 2));
    capList.add(new CapData("Cap LV", "/images/cap2.svg", "$7.75", 4));
    capList.add(new CapData("Cap XLV", "/images/cap4.svg", "$12.15", 5));
    capList.add(new CapData("Cap XLV", "/images/cap5.svg", "$5.55", 3));
    return capList;
  }

  public List<CapData> getRecommendedCaps() {
    capList = new ArrayList<CapData>();
    capList.add(new CapData("Cap VI", "/images/cap.svg", "10.22", 3));
    capList.add(new CapData("Cap XXII", "/images/cap1.svg", "$8.98", 4));

    return capList;
  }

}
