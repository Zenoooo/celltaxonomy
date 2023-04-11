package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SpeciesMapper {
//    List<Map> getSpecies(List<String> species,List<String> tissue,List<String> celltype);
    List<Map> getSpecies();
    List<Map> getSpeciesByID(String ID);
    List<Map> getSpeciesBasicByID(String ID);
    List<Map> getSpeciesList(List<String> tissue,List<String> celltype);
    List<Map> getSpeciesStatistic(String item,String id);

}
