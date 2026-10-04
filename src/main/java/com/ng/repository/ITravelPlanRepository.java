package com.ng.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ng.entity.TravelPlan;

public interface ITravelPlanRepository extends JpaRepository<TravelPlan, Integer> {

}
