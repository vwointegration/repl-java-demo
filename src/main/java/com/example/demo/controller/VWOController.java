package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.services.CapService;
import com.vwo.VWO;
import com.vwo.VWOAdditionalParams;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class VWOController {
  VWO vwoInstance;
  String variationAssigned;
  String settingsFile;


  @PostMapping("/get/settings")
  public ResponseEntity<?> getVWOSettings(@Validated @RequestBody SettingsCriteria settingsCriteria, Errors errors) {
    SettingsResponse response = new SettingsResponse();
    if (errors.hasErrors()) {
      response.setMsg(errors.getAllErrors().stream().map(x -> x.getDefaultMessage()).collect(Collectors.joining(",")));
      return ResponseEntity.badRequest().body(response);
    }

    settingsFile = VWO.getSettingsFile(settingsCriteria.getAccountId(), settingsCriteria.getApiKey());
    if (settingsFile == null || settingsFile.isEmpty()) {
      return ResponseEntity.status(400).body("Settings file could not be fetched. Please pass a valid accountId and apikey");
    } else {
      return ResponseEntity.ok(settingsFile);
    }
  }

  @PostMapping("/activate")
  public ResponseEntity<?> activateCampaign(@Validated @RequestBody ActivateCriteria activateCriteria, Errors errors) {
    ActivateResponse activateResponse = new ActivateResponse();
    activateResponse.setStatus(false);
    if (errors.hasErrors()) {
      activateResponse.setMsg("Something went wrong. Please try again");
      return ResponseEntity.ok(activateResponse);
    }

    if (vwoInstance == null) {
      activateResponse.setMsg("VWO is not initialized yet. Initialize it to activate a campaign");
      return ResponseEntity.ok(activateResponse);
    }

    if (activateCriteria.getCampaignKey().isEmpty() || activateCriteria.getUserId().isEmpty()) {
      activateResponse.setMsg("Pass a valid campaignKey and userId");
      return ResponseEntity.ok(activateResponse);
    }

    if (activateCriteria.getAdditionalParams() == null) {
      variationAssigned = vwoInstance.activate(activateCriteria.getCampaignKey(), activateCriteria.getUserId());
    } else {
      variationAssigned = vwoInstance.activate(activateCriteria.getCampaignKey(), activateCriteria.getUserId(), activateCriteria.getAdditionalParams());
    }

    if (variationAssigned == null) {
      activateResponse.setRecommendations(new ArrayList<CapData>());
      activateResponse.setVariationName(null);
      activateResponse.setMsg("No Variation Assigned to the user " + activateCriteria.getUserId());
      return ResponseEntity.ok(activateResponse);
    }

    if (variationAssigned.equals("Control")) {
      activateResponse.setRecommendations(new ArrayList<CapData>());
    } else {
      activateResponse.setRecommendations(new CapService().getRecommendedCaps());
    }
    activateResponse.setVariationName(variationAssigned);
    activateResponse.setMsg("success");
    activateResponse.setStatus(true);

    return ResponseEntity.ok(activateResponse);
  }

  @PostMapping("/track")
  public ResponseEntity<?> trackGoal(@Validated @RequestBody TrackCriteria trackCriteria, Errors errors) {
    TrackResponse trackResponse = new TrackResponse();
    if (errors.hasErrors()) {
      trackResponse.setMsg("Something went wrong. Please try again");
      return ResponseEntity.ok(trackResponse);
    }

    if (vwoInstance == null) {
      trackResponse.setMsg("VWO is not initialized yet. Initialize it to activate a campaign");
      return ResponseEntity.ok(trackResponse);
    }

    Map<String, Boolean> isGoalTracked;
    if (trackCriteria.getVwoAdditionalParams() != null) {
      isGoalTracked = vwoInstance.track(trackCriteria.getCampaignKey(), trackCriteria.getUserId(), trackCriteria.getGoalIdentifier(), trackCriteria.getVwoAdditionalParams());
    } else {
      isGoalTracked = vwoInstance.track(trackCriteria.getCampaignKey(), trackCriteria.getUserId(), trackCriteria.getGoalIdentifier());
    }

    if (!isGoalTracked.get(trackCriteria.getCampaignKey())) {
      trackResponse.setMsg("Goal not triggered");
    } else {
      trackResponse.setMsg("Goal triggered");
    }

    trackResponse.setResult("success");
    return ResponseEntity.ok(trackResponse);
  }

  @PostMapping("/launch")
  public ResponseEntity<?> launchVWO(@Validated @RequestBody SettingsCriteria settingsCriteria, Errors errors) {
    SettingsResponse response = new SettingsResponse();

    if (errors.hasErrors()) {
      response.setMsg("Something went wrong. Please try again.");
      return ResponseEntity.badRequest().body(response);
    }

    settingsFile = VWO.getSettingsFile(settingsCriteria.getAccountId(), settingsCriteria.getApiKey());
    if (settingsFile == null || settingsFile.isEmpty()) {
      response.setMsg("VWO could not be launched. Please try again");
      return ResponseEntity.status(400).body("Settings file could not be fetched. Please pass a valid accountId and apikey");
    } else {
      response.setMsg("Settings fetched from VWO.");
      response.setSettings(settingsFile);
      vwoInstance = VWO.launch(settingsFile).build();
      return ResponseEntity.ok(response);
    }
  }
}
