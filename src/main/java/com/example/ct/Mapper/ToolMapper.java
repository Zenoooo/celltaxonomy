package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ToolMapper {
    List<Map> getTissueList(String term, String title, String species, String condition,String database,String cellA,String cellB);
    List<Map> getDiseaseList(String term,String title,String species,String tissue,String database,String cellA,String cellB);
    List<Map> getSpeciesList(String term,String database,String tissue,String condition,String cellA,String cellB);
    List<Map> getCelltypeList(String term,String title,String species,String tissue,String condition);

    List<Map> getTissueList2(String term, String title, String species, String condition,String database,String cell);
    List<Map> getDiseaseList2(String term,String title,String species,String database,String cell,String tissueA,String tissueB);
    List<Map> getSpeciesList2(String term,String database,String condition,String cell,String tissueA,String tissueB);
    List<Map> getCelltypeList2(String term,String title,String species,String condition,String tissueA,String tissueB);

    List<Map> getCompare(String cellA,String cellB,String species,String tissue,String condition);
    List<Map> getCompare2(String tissueA,String tissueB,String species,String cell,String condition);
    List<Map> getCellSearch(List<String> genes,String species);
    List<Map> getMarkerByCT(String id,String species);

    List<Map> getExpList(String term,String title ,String species,String tissue,String celltype);
    List<Map> getExpCelltypeList(String term,String species,String tissue,String celltype);
    List<Map> getDatasetList(String species,String tissue,String celltype,String marker);
    List<Map> getDatasetList2(String species,String celltype,String term);
    List<Map> getExpMarkerList(String term,List<String> datasetlist);


    List<Map> getExpression(String dataset,String marker,String database);
    List<Map> getExpressionList(String celltype,String marker);
    List<Map> getFCPlot(String species,String tissue,String celltype,String marker,String database);
    List<Map> getSSPlot(String species,String tissue,String celltype,String marker,String database);

    List<Map> getCellMarkerList(String species,String id);
    List<Map> getDatasets(List<String> datasetlist,String tissue,String species,String celltype);
    List<Map> getMarkerByName(String species,String id);


}
