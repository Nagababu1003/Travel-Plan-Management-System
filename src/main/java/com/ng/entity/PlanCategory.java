package com.ng.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="JRTP_PLAN_CATEGORY")
@Data
public class PlanCategory {

	@Id
	@SequenceGenerator(name="gen1",sequenceName="category_seq",initialValue=1,allocationSize=1)
	@GeneratedValue(generator="gen1",strategy=GenerationType.SEQUENCE)
	@Column(name="CATEGORY_ID")
	private Integer categoryId;
	
	@Column(name="CATEGORY_NAME",length=30)
	private String categoryname;
	
	@Column(name="ACTIVE_SW",length=15)
	private String activeSW;
	
	
	@CreationTimestamp
	private LocalDateTime createdDate;

	
	@UpdateTimestamp
	private LocalDateTime updatedDate;
	
	@Column(name="CREATED_BY",length=20)
	private String createdBy;
	
	@Column(name="UPDATED_BY",length=20)
	private String updatedBy;
}
	
	/*
	 * @PrePersist public void beforeInsert() { LocalDateTime
	 * now=LocalDateTime.now(); if(createdDate==null) { createdDate=now; }
	 * if(updatedDate==null) { updatedDate=now; } }
	 * 
	 * @PreUpdate public void beforeUpdate() { updatedDate=LocalDateTime.now(); }
	 */

