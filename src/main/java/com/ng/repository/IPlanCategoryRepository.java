package com.ng.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ng.entity.PlanCategory;

public interface IPlanCategoryRepository extends JpaRepository<PlanCategory, Integer> {

}
