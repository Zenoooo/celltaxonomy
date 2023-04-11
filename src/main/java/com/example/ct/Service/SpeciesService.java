package com.example.ct.Service;

import com.example.ct.Mapper.SpeciesMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class SpeciesService {
    @Resource
    SpeciesMapper speciesMapper;
//    public List<Map> getSpecies(List<String> species,List<String> tissue,List<String> celltype){return speciesMapper.getSpecies(species,tissue,celltype);}
    public List<Map> getSpecies(){return speciesMapper.getSpecies();}
    public List<Map> getSpeciesByID(String ID){return speciesMapper.getSpeciesByID(ID);}
    public List<Map> getSpeciesBasicByID(String ID){return speciesMapper.getSpeciesBasicByID(ID);}
    public List<Map> getSpeciesList(List<String> tissue,List<String> celltype){return speciesMapper.getSpeciesList(tissue,celltype);}
    public List<Map> getSpeciesStatistic(String item,String id){
        return speciesMapper.getSpeciesStatistic(item,id);
    }

}
