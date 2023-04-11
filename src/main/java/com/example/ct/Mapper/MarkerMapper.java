package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MarkerMapper {
    List<Map> getAllMarkers(String search,String title,String direction);
    List<Map> getMarkerIdCard(String marker);
    List<Map> getSingleMarker(String marker);
    List<Map> getMarkerFigureData(String tissue,String value_type,String marker);
    List<Map> getCellTypeEnrichment(String marker,String tissue);
    List<Map> getCellTissueEnrichment(String marker,String entrezid);
    List<Map> getCTEGenelist(String marker,String entrezid);
    List<Map> getCTEGenelistByLS(String marker,String entrezid);

    List<Map> getMarkerStatistic();
    List<Map> SingleMarkerSearch(String marker);
    List<Map> getMarkerTable(String marker);
    List<Map> getMarkerByName(String marker);
    List<Map> getMarkerByID(String id);


    List<Map> getCellMarkerDE(String marker);
    List<Map> getCellMarkerDEtable(String marker);
    List<Map> getHomologene(String marker);
    List<Map> getCMECellList(String marker,String database);
    List<Map> getSpeciesList(List<String> tissue,List<String> celltype,List<String> condition);
    List<Map> getMarkerCellDEBar(String marker,String database);

    List<Map> getMarkerCellDETissueList(String marker,String species);
    List<Map> getMarkerCellTotalBar(List<String> datasetlist,String marker);

    List<Map> getMarkerSS(String marker);
    List<Map> getRecommendCells(String id,String species);
    List<Map> getSummaryFilter(String markerid,double fc,double ss,Integer tc,Integer pc,double dr);

    List<Map> getSpeciesSimilarity(String id);
    List<Map> getSurfaceMarker(String id);
    List<Map> getMarkerStatistic2(String item,String id);
    List<Map> getMarkerHomoStatistic(String id);



}
