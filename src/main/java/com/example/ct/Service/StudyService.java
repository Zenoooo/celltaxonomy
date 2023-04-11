package com.example.ct.Service;

import com.example.ct.Mapper.StudyMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class StudyService {
    @Resource
    StudyMapper studyMapper;

    public List<Map> getTissueName(String index,Integer pagenumber,Integer pagelength){
        return studyMapper.getTissueName(index,pagenumber,pagelength);
    }
    public List<Map> getStudy(String pmid){
        return studyMapper.getStudy(pmid);
    }

    public List<Map> getFilterStudiesPMID(Integer pagenumber,String query,List<String> tissue,List<String> journal,List<String> species,List<String> celltype){
        return studyMapper.getStudies(pagenumber,query,tissue,journal,species,celltype);
    }
    public List<Map> getStudies(Integer pagenumber,String query,List<String> tissue,List<String> journal,List<String> species,List<String> celltype){
        return studyMapper.getStudies(pagenumber,query,tissue,journal,species,celltype);
    }
    public List<Map> getTissueList(List<String> journal,List<String> species,List<String> celltype,String term){
        return studyMapper.getTissueList(journal,species,celltype,term);
    }
    public List<Map> getJournalList(List<String> tissue,List<String> species,List<String> celltype,String term){
        return studyMapper.getJournalList(tissue,species,celltype,term);
    }
    public List<Map> getSpeciesList(List<String> tissue,List<String> celltype){
        return studyMapper.getSpeciesList(tissue,celltype);
    }
    public List<Map> getCellList(List<String> tissue,List<String> journal,List<String> species,String term){
        return studyMapper.getCellList(tissue,journal,species,term);
    }
    public List<Map> getMetadata(String geo,String databasename){
        return studyMapper.getMetadata(geo,databasename);
    }
    public List<Map> getDimension(String geo,String databasename,String term){
        return studyMapper.getDimension(geo,databasename,term);
    }
    public List<Map> getHeter(String geo,String databasename){
        return studyMapper.getHeter(geo,databasename);
    }
    public List<Map> getSilhouette(String geo,String databasename){
        return studyMapper.getSilhouette(geo,databasename);
    }
    public List<Map> getMEP(String geo, String gene,String databasename){
        return studyMapper.getMEP(geo,gene,databasename);
    }
    public List<Map> getMEPgenelist(String geo,String term,String databasename){
        return studyMapper.getMEPgenelist(geo,term,databasename);
    }
    public List<Map> getDataset(String pmid){
        return studyMapper.getDataset(pmid);
    }
    public List<Map> getCME(String geo,String celltype,String databasename){
        return studyMapper.getCME(geo,celltype,databasename);
    }
    public List<Map> getCME2(String geo,String marker,String databasename){
        return studyMapper.getCME2(geo,marker,databasename);
    }
    public List<Map> getCMEtable(String geo,String databasename,String marker){
        return studyMapper.getCMEtable(geo,databasename,marker);
    }
    public List<Map> getCTS(String geo,String gene,String databasename){
        return studyMapper.getCTS(geo,gene,databasename);
    }
    public List<Map> getCTS2(String geo,String tissue,String celltype,String databasename){
        return studyMapper.getCTS2(geo,tissue,celltype,databasename);
    }
    public List<Map> getCTStable(String geo,String search,String order,String orderDir,String databasename){
        return studyMapper.getCTStable(geo,search,order,orderDir,databasename);
    }
    public List<Map> getCTSGeneList(String geo,String term,String databasename){
        return studyMapper.getCTSGeneList(geo,term,databasename);
    }
    public List<Map> getCTSTissueList(String geo,String term,String databasename){
        return studyMapper.getCTSTissueList(geo,term,databasename);
    }
    public List<Map> getCTSCelltypeList(String geo,String term,String databasename){
        return studyMapper.getCTSCelltypeList(geo,term,databasename);
    }
    public List<Map> getCMETissueList(String geo,String term,String databasename){
        return studyMapper.getCMETissueList(geo,term,databasename);
    }
    public List<Map> getCMECelltypeList(String geo,String term,String databasename){
        return studyMapper.getCMECelltypeList(geo,term,databasename);
    }
    public List<Map> getCMEGeneList(String geo,String term,String databasename){
        return studyMapper.getCMEGeneList(geo,term,databasename);
    }
}
