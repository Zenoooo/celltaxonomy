package com.example.ct.Service;

import com.example.ct.Mapper.MarkerMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class MarkerService {
    @Resource
    MarkerMapper markerMapper;

    public List<Map> getAllMarkers(String search,String title,String direction){return markerMapper.getAllMarkers(search,title,direction);}
    public List<Map> getMarkerIdCard(String marker){return markerMapper.getMarkerIdCard(marker);}
    public List<Map> getSingleMarker(String marker){return markerMapper.getSingleMarker(marker);}
    public List<Map> getMarkerFigureData(String tissue,String value_type,String marker){return markerMapper.getMarkerFigureData(tissue,value_type,marker);}
    public List<Map> getCellTypeEnrichment(String marker,String tissue){return markerMapper.getCellTypeEnrichment(marker,tissue);}
    public List<Map> getCellTissueEnrichment(String marker,String entrezid){return markerMapper.getCellTissueEnrichment(marker,entrezid);}
    public List<Map> getCTEGenelist(String marker,String entrezid){return markerMapper.getCTEGenelist(marker,entrezid);}
    public List<Map> getCTEGenelistByLS(String marker,String entrezid){return markerMapper.getCTEGenelistByLS(marker,entrezid);}
    public List<Map> getMarkerStatistic(){return markerMapper.getMarkerStatistic();}
    public List<Map> SingleMarkerSearch(String marker){return markerMapper.SingleMarkerSearch(marker);}
    public List<Map> getMarkerTable(String marker){return markerMapper.getMarkerTable(marker);}
    public List<Map> getMarkerByName(String marker){return markerMapper.getMarkerByName(marker);}
    public List<Map> getMarkerByID(String id){return markerMapper.getMarkerByID(id);}
    public List<Map> getCellMarkerDE(String marker){return markerMapper.getCellMarkerDE(marker);}
    public List<Map> getCellMarkerDEtable(String marker){return markerMapper.getCellMarkerDE(marker);}
    public List<Map> getHomologene(String marker){return markerMapper.getHomologene(marker);}
    public List<Map> getCMECellList(String marker,String database){return markerMapper.getCMECellList(marker,database);}
    public List<Map> getSpeciesList(List<String> tissue,List<String> celltype,List<String> condition){return markerMapper.getSpeciesList(tissue,celltype,condition);}
    public List<Map> getMarkerCellDEBar(String marker,String database){
        return markerMapper.getMarkerCellDEBar(marker,database);
    }
    public List<Map> getMarkerCellDETissueList(String marker,String species){
        return markerMapper.getMarkerCellDETissueList(marker,species);
    }
    public List<Map> getMarkerCellTotalBar(List<String> datasetlist,String marker){
        return markerMapper.getMarkerCellTotalBar(datasetlist,marker);
    }
    public List<Map> getMarkerSS(String marker){
        return markerMapper.getMarkerSS(marker);
    }
    public List<Map> getRecommendCells(String id,String species){
        return markerMapper.getRecommendCells(id,species);
    }
    public List<Map> getSummaryFilter(String markerid,double fc,double ss,Integer tc,Integer pc,double dr){
        return markerMapper.getSummaryFilter(markerid,fc,ss,tc,pc,dr);
    }
    public List<Map> getSpeciesSimilarity(String id){return markerMapper.getSpeciesSimilarity(id);}
    public List<Map> getSurfaceMarker(String id){return markerMapper.getSurfaceMarker(id);}
    public List<Map> getMarkerStatistic2(String item,String cellid){
        return markerMapper.getMarkerStatistic2(item,cellid);
    }
    public List<Map> getMarkerHomoStatistic(String id){
        return markerMapper.getMarkerHomoStatistic(id);
    }
}
