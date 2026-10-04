package com.ng.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ng.config.AppConfigProperties;
import com.ng.constants.TravelPlanConstants;
import com.ng.entity.PlanCategory;
import com.ng.entity.TravelPlan;
import com.ng.repository.IPlanCategoryRepository;
import com.ng.repository.ITravelPlanRepository;

@Service
public class TravelPlanMgmtServiceImpl implements ITravelPlanMgmtService {

	
	private final ITravelPlanRepository travelPlanRepo;
	
	private final IPlanCategoryRepository planCategoryRepo;
	
	private Map<String,String> messages;
	
	public TravelPlanMgmtServiceImpl(ITravelPlanRepository travelPlanRepo,IPlanCategoryRepository planCategoryRepo,AppConfigProperties props) {
		
		this.travelPlanRepo = travelPlanRepo;
		this.planCategoryRepo = planCategoryRepo;
		this.messages=props.getMessages();
	}

	
	
	
	
	@Override
	public String registerTravelPlan(TravelPlan plan) {
		// TODO Auto-generated method stub
		TravelPlan saved=travelPlanRepo.save(plan);
		if(saved.getPlanId()!=null)
			return "TravelPlan is saved with id value:"+saved.getPlanId();
		else
			return saved.getPlanId()!=null?messages.get(TravelPlanConstants.SAVE_SUCCESS)+saved.getPlanId():messages.get(TravelPlanConstants.SAVE_FAILURE);
	}

	@Override
	public Map<Integer, String> getTravelPlanCategories() {
		// TODO Auto-generated method stub
		List<PlanCategory> list=planCategoryRepo.findAll();
		Map<Integer,String> categoriesMap=new HashMap<Integer,String>();
		list.forEach(category->{
			categoriesMap.put(category.getCategoryId(),category.getCategoryname());
		});
		return categoriesMap;
	}

	@Override
	public List<TravelPlan> showAllTravelPlans(){
		// TODO Auto-generated method stub
		return travelPlanRepo.findAll();
	}

	@Override
	public TravelPlan showTravelPlanById(Integer planId) {
		// TODO Auto-generated method stub
		return travelPlanRepo.findById(planId).orElseThrow(()->new IllegalArgumentException(messages.get(TravelPlanConstants.FIND_BY_ID_FAILURE)));
	}

	@Override
	public String updateTravelPlan(TravelPlan plan) {
		// TODO Auto-generated method stub
		Optional<TravelPlan> opt=travelPlanRepo.findById(plan.getPlanId());
		if(opt.isPresent()){
			travelPlanRepo.save(plan);
			return plan.getPlanId()+messages.get(TravelPlanConstants.UPDATE_SUCCESS);
		}
		else {
			return plan.getPlanId()+messages.get(TravelPlanConstants.UPDATE_FAILURE);
		}
	}

	@Override
	public String deleteTravelPlan(Integer planId) {
		// TODO Auto-generated method stub
		Optional<TravelPlan> opt=travelPlanRepo.findById(planId);
		if(opt.isPresent()){
			travelPlanRepo.deleteById(planId);
			return planId+messages.get(TravelPlanConstants.DELETE_SUCCESS);
		}
		else {
			return planId+messages.get(TravelPlanConstants.DELETE_FAILURE);
		}
	}

	@Override
	public String changeTravelPlanStatus(Integer planId, String status) {
		// TODO Auto-generated method stub
		Optional<TravelPlan> opt=travelPlanRepo.findById(planId);
		if(opt.isPresent()){
			TravelPlan plan=opt.get();
			plan.setActivateSW(status);
			travelPlanRepo.save(plan);
			return planId+messages.get(TravelPlanConstants.STATUS_CHANGE_SUCCESS);
		}
		else {
			return planId+messages.get(TravelPlanConstants.STATUS_CHANGE_FAILURE);
		}
	}

}
