package com.example.ct.Service;

import com.example.ct.Mapper.TissueMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class TissueService {
    @Resource
    TissueMapper tissueMapper;

    public List<Map> getDescription(String tissue){return tissueMapper.getDescription(tissue);}
    public List<Map> getCellEnrichment(String tissue){return tissueMapper.getCellEnrichment(tissue);}
    public List<Map> getCellTypeCellMarkerHeatmap(String id){return tissueMapper.getCellTypeCellMarkerHeatmap(id);}
    public List<Map> getCTGEByOR(String id){return tissueMapper.getCTGEByOR(id);}
    public List<Map> getCTGEByLS(String id){return tissueMapper.getCTGEByLS(id);}

    public List<Map> getTissueStatistic(){return tissueMapper.getTissueStatistic();}
    public List<Map> getTissueSummary(String id,String tissue){return tissueMapper.getTissueSummary(id,tissue);}
    public List<Map> getTissueByName(String id){return tissueMapper.getTissueByName(id);}
    public List<Map> get_description(String id){return tissueMapper.get_description(id);}
    public List<Map> getTissueCompositionOfCell(String tissue){return tissueMapper.getTissueCompositionOfCell(tissue);}
    public List<Map> getTissueStatistic2(String item,String tissueid){
        return tissueMapper.getTissueStatistic2(item,tissueid);
    }

}
