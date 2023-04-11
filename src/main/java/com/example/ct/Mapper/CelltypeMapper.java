package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CelltypeMapper {
    List<Map> getDescription(String ontology);
    List<Map> getCellMarkerTable(String ontology);
    List<Map> getCellByCT(String id);

    List<Map> getIdCard(String ontology);
    List<Map> getGO(String markers);
    List<Map> getTissueEnrichmentOR(String ontology);
    List<Map> getTissueEnrichmentLS(String ontology);
    List<Map> getOverallCellLiteratureSupport(String ontology);
    List<Map> getSingleCellLiteratureSupport(String ontology);

    List<Map> getCellCompositionInTissue(String ontology);

    List<Map> getCME(List<String> ontology,String marker,String database);
    List<Map> getCMEList(String ontology,String marker,String database);
    List<Map> getCMEJudge(String ontology);

    //    List<Map> getCellMarkerDE(String ontology,String species,String tissue,String marker,String database);
    List<Map> getCellMarkerDE(String ontology,String species,String tissue,List<String> datasetlist,String database);
    List<Map> getCellMarkerDESelect(String ontology,String tissue,String database);
    List<Map> getCellMarkerDEAll(String ontology,String species,String tissue,String database);
    List<Map> getCellMarkerDEtable(String ontology,String species,String tissue,List<String> datasetlist);
    List<Map> getCellMarkerDEBar(String ontology,String threshold,String species,List<String> datasetlist,String tissue,String fdr,String database);
    List<Map> getCellMarkerDEBarAll(String ontology,String threshold,String species,String tissue,String fdr,String database);
    List<Map> getCellMarkerDEList(String ontology,String species,String tissue);
    List<Map> getCellMarkerDETissueList(String ontology,String species);
    List<Map> getCellMarkerTotalBar(String genelist,String id,String species,String tissue,String database);

//    List<Map> getCellSEScore(String marker,String id,String species,String tissue,String database);
    List<Map> getCellSEScore(List<String> datasetlist,String id,String species,String tissue,String database);

    List<Map> getCellSEScoreSelect(String id,String tissue,String database);
    List<Map> getCellSEScoreAll(String id,String species,String tissue,String database);



    List<Map> getDatasetsBySpecies(List<String> datasetlist,String species);


    List<Map> getCellTypeStatistic();
    List<Map> getSummary(String id);
    List<Map> getCellTypeStatistic2();
    List<Map> getSimilarity(String id);
    List<Map> getSpeciesSimilarity(String id);
    List<Map> getSameCellSimilarity(String id);
    List<Map> getSpeciesSimilarityMarker(String id,String tissue);
    List<Map> getSingleCellLSGeneList(String ontology);
    List<Map> getStudyTable(String id);
    List<Map> getCellByName(String id);

    List<Map> getSurfaceMarker(String id);
    List<Map> getRecommendDatasets(String id,String species);
    List<Map> getRecommendMarkers(String id,String species);
    List<Map> getSummaryFilter(String species,String cell,double fc,double ss,Integer tc,Integer pc,double dr);
    List<Map> getTissueDistribution(String id);
    List<Map> getConservedPub(String species,String tissue,String marker,String cellid);
    List<Map> getCellStatistic(String item,String cellid);

}
