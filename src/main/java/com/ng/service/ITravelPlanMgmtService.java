package com.ng.service;

import java.util.List;
import java.util.Map;

import com.ng.entity.TravelPlan;

public interface ITravelPlanMgmtService {

	public String registerTravelPlan(TravelPlan plan);
	public Map<Integer,String> getTravelPlanCategories();
	public List<TravelPlan> showAllTravelPlans();
	public TravelPlan showTravelPlanById(Integer planId);
	public String updateTravelPlan(TravelPlan plan);
	public String deleteTravelPlan(Integer planId);
	public String changeTravelPlanStatus(Integer planId,String status);
}
