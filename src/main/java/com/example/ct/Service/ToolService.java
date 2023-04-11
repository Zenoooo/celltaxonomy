package com.example.ct.Service;

import com.example.ct.Mapper.ToolMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class ToolService {
    @Resource
    ToolMapper toolMapper;

    public List<Map> getTissueList(String term, String title, String species,String condition, String database,String cellA,String cellB){return toolMapper.getTissueList(term,title,species,condition,database,cellA,cellB);}
    public List<Map> getDiseaseList(String term,String title,String species,String tissue,String database,String cellA,String cellB){return toolMapper.getDiseaseList(term,title,species,tissue,database,cellA,cellB);}
    public List<Map> getCelltypeList(String term,String title,String species,String tissue,String condition){return toolMapper.getCelltypeList(term,title,species,tissue,condition);}
    public List<Map> getSpeciesList(String term,String database,String tissue,String condition,String cellA,String cellB){return toolMapper.getSpeciesList(term,database,tissue,condition,cellA,cellB);}

    public List<Map> getTissueList2(String term, String title, String species, String condition,String database,String cell){return toolMapper.getTissueList2(term,title,species,condition,database,cell);}
    public List<Map> getDiseaseList2(String term,String title,String species,String database,String cell,String tissueA,String tissueB){return toolMapper.getDiseaseList2(term,title,species,database,cell,tissueA,tissueB);}
    public List<Map> getCelltypeList2(String term,String title,String species,String condition,String tissueA,String tissueB){return toolMapper.getCelltypeList2(term,title,species,condition,tissueA,tissueB);}
    public List<Map> getSpeciesList2(String term,String database,String condition,String cell,String tissueA,String tissueB){return toolMapper.getSpeciesList2(term,database,condition,cell,tissueA,tissueB);}


    public List<Map> getCompare(String cellA,String cellB,String species,String tissue,String condition){return toolMapper.getCompare(cellA,cellB,species,tissue,condition);}
    public List<Map> getCompare2(String tissueA,String tissueB,String species,String cell,String condition){return toolMapper.getCompare2(tissueA,tissueB,species,cell,condition);}
    public List<Map> getCellSearch(List<String> genes,String species){return toolMapper.getCellSearch(genes,species);}
    public List<Map> getMarkerByCT(String id,String species){return toolMapper.getMarkerByCT(id,species);}
    public List<Map> getExpList(String term,String title,String species,String tissue,String celltype){
        return toolMapper.getExpList(term,title,species,tissue,celltype);
    }
    public List<Map> getExpCelltypeList(String term,String species,String tissue,String celltype){return toolMapper.getExpCelltypeList(term,species,tissue,celltype);}
    public List<Map> getDatasetList(String species,String tissue,String celltype,String marker){
        return toolMapper.getDatasetList(species,tissue,celltype,marker);
    }
    public List<Map> getDatasetList2(String species,String celltype,String term){
        return toolMapper.getDatasetList2(species,celltype,term);
    }
    public List<Map> getExpMarkerList(String term,List<String> datasetlist){
        return toolMapper.getExpMarkerList(term,datasetlist);
    }
    public List<Map> getExpression(String dataset,String marker,String database){
        return toolMapper.getExpression(dataset,marker,database);
    }
    public List<Map> getExpressionList(String celltype,String marker){return toolMapper.getExpressionList(celltype,marker);}
    public List<Map> getFCPlot(String species,String tissue,String celltype,String marker,String database){
        return toolMapper.getFCPlot(species,tissue,celltype,marker,database);
    }
    public List<Map> getSSPlot(String species,String tissue,String celltype,String marker,String database){
        return toolMapper.getSSPlot(species,tissue,celltype,marker,database);
    }
    public List<Map> getCellMarkerList(String species,String id){return toolMapper.getCellMarkerList(species,id);}
    public List<Map> getDatasets(List<String> datasetlist,String tissue,String species,String celltype){
        return toolMapper.getDatasets(datasetlist,tissue,species,celltype);
    }
    public List<Map> getMarkerByName(String species,String id){return toolMapper.getMarkerByName(species,id);}

}
