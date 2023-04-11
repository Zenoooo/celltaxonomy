package com.example.ct.Service;

import com.example.ct.Mapper.ConditionMapper;
import com.example.ct.Mapper.SpeciesMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class ConditionService {
    @Resource
    ConditionMapper conditionMapper;
//    public List<Map> getCondition(List<String> condition, List<String> tissue, List<String> celltype){return conditionMapper.getCondition(condition,tissue,celltype);}
    public List<Map> getCondition(){return conditionMapper.getCondition();}
    public List<Map> getConditionByID(String ID){return conditionMapper.getConditionByID(ID);}
    public List<Map> getConditionBasicByID(String ID){return conditionMapper.getConditionBasicByID(ID);}
    public List<Map> getConditionList(List<String> tissue,List<String> celltype){return conditionMapper.getConditionList(tissue,celltype);}
    public List<Map> getConditionStatistic(String item,String id){
        return conditionMapper.getConditionStatistic(item,id);
    }
}
