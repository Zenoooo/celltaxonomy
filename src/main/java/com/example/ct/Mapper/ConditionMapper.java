package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ConditionMapper {
//    List<Map> getCondition(List<String> condition, List<String> tissue, List<String> celltype);
    List<Map> getCondition();
    List<Map> getConditionByID(String ID);
    List<Map> getConditionBasicByID(String ID);
    List<Map> getConditionList(List<String> tissue,List<String> celltype);
    List<Map> getConditionStatistic(String item,String id);

}
