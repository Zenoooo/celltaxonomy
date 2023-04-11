package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface StudyMapper {
    List<Map> getTissueName(String index,Integer pagenumber,Integer pagelength);
    List<Map> getStudy(String pmid);
    List<Map> getStudies(Integer pagenumber,String query,List<String> tissue,List<String> journal,List<String> species,List<String> celltype);
    List<Map> getFilterStudiesPMID(Integer pagenumber,String query,List<String> tissue,List<String> journal,List<String> species,List<String> celltype);
    List<Map> getTissueList(List<String> journal,List<String> species,List<String> celltype,String term);
    List<Map> getJournalList(List<String> tissue,List<String> species,List<String> celltype,String term);
    List<Map> getSpeciesList(List<String> tissue,List<String> celltype);
    List<Map> getCellList(List<String> tissue,List<String> journal,List<String> species,String term);
    List<Map> getMetadata(String geo,String databasename);
    List<Map> getDimension(String geo,String databasename,String term);
    List<Map> getHeter(String geo,String databasename);
    List<Map> getSilhouette(String geo,String databasename);
    List<Map> getMEP(String geo,String gene,String databasename);
    List<Map> getMEPgenelist(String geo,String term,String databasename);
    List<Map> getDataset(String pmid);
    List<Map> getCME(String geo,String celltype,String databasename);
    List<Map> getCME2(String geo,String marker,String databasename);

    List<Map> getCMEtable(String geo,String databasename,String marker);
    List<Map> getCTS(String geo,String gene,String databasename);
    List<Map> getCTS2(String geo,String tissue,String celltype,String databasename);

    List<Map> getCTStable(String geo,String search,String order,String orderDir,String databasename);
    List<Map> getCTSGeneList(String geo,String term,String databasename);
    List<Map> getCTSTissueList(String geo,String term,String databasename);
    List<Map> getCTSCelltypeList(String geo,String term,String databasename);
    List<Map> getCMETissueList(String geo,String term,String databasename);
    List<Map> getCMECelltypeList(String geo,String term,String databasename);
    List<Map> getCMEGeneList(String geo,String term,String databasename);


}
