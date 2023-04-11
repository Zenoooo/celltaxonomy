package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface TissueMapper {
    List<Map> getDescription(String tissue);
    List<Map> getCellEnrichment(String tissue);
    List<Map> getCellTypeCellMarkerHeatmap(String id);
    List<Map> getCTGEByOR(String id);
    List<Map> getCTGEByLS(String id);

    List<Map> getTissueStatistic();
    List<Map> getTissueSummary(String id,String tissue);
    List<Map> get_description(String id);
    List<Map> getTissueByName(String id);
    List<Map> getTissueCompositionOfCell(String tissue);

    List<Map> getTissueStatistic2(String item,String tissueid);

}
