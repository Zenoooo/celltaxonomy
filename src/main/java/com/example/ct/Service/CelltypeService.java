package com.example.ct.Service;

import com.example.ct.Mapper.CelltypeMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class CelltypeService {
    @Resource
    CelltypeMapper celltype;

    public List<Map> getDescription(String ontology){return celltype.getDescription(ontology);}
    public List<Map> getCellMarkerTable(String ontology){return celltype.getCellMarkerTable(ontology);}
    public List<Map> getCellByCT(String id){return celltype.getCellByCT(id);}


    public List<Map> getIdCard(String ontology){return celltype.getIdCard(ontology);}
    public List<Map> getGO(String markers){return celltype.getGO(markers);}
    public List<Map> getTissueEnrichmentOR(String ontology){return celltype.getTissueEnrichmentOR(ontology);}
    public List<Map> getTissueEnrichmentLS(String ontology){return celltype.getTissueEnrichmentLS(ontology);}
    public List<Map> getOverallCellLiteratureSupport(String ontology){return celltype.getOverallCellLiteratureSupport(ontology);}
    public List<Map> getSingleCellLiteratureSupport(String ontology){return celltype.getSingleCellLiteratureSupport(ontology);}

    public List<Map> getCellCompositionInTissue(String ontology){return celltype.getCellCompositionInTissue(ontology);}


    public List<Map> getCME(List<String> ontology,String marker,String database){return celltype.getCME(ontology,marker,database);}
    public List<Map> getCMEList(String ontology,String marker,String database){return celltype.getCMEList(ontology,marker,database);}
    public List<Map> getCMEJudge(String ontology){return celltype.getCMEJudge(ontology);}

    public List<Map> getCellMarkerDE(String ontology,String species,String tissue,List<String> datasetlist,String database){
        return celltype.getCellMarkerDE(ontology,species,tissue,datasetlist,database);
    }
    public List<Map> getCellMarkerDESelect(String ontology,String tissue,String database){
        return celltype.getCellMarkerDESelect(ontology,tissue,database);
    }
    public List<Map> getCellMarkerDEAll(String ontology,String species,String tissue,String database){
        return celltype.getCellMarkerDEAll(ontology,species,tissue,database);
    }
    public List<Map> getCellSEScore(List<String> datasetlist,String id,String species,String tissue,String database){
        return celltype.getCellSEScore(datasetlist,id,species,tissue,database);
    }
    public List<Map> getCellSEScoreSelect(String id,String tissue,String database){
        return celltype.getCellSEScoreSelect(id,tissue,database);
    }
    public List<Map> getCellSEScoreAll(String id,String species,String tissue,String database){
        return celltype.getCellSEScoreAll(id,species,tissue,database);
    }
    public List<Map> getCellMarkerDEtable(String ontology,String species,String tissue,List<String> datasetlist){
        return celltype.getCellMarkerDEtable(ontology,species,tissue,datasetlist);
    }
    public List<Map> getCellMarkerDEBar(String ontology,String threshold,String species,List<String> datasetlist,String tissue,String fdr,String database){
        return celltype.getCellMarkerDEBar(ontology,threshold,species,datasetlist,tissue,fdr,database);
    }
    public List<Map> getCellMarkerDEBarAll(String ontology,String threshold,String species,String tissue,String fdr,String database){
        return celltype.getCellMarkerDEBarAll(ontology,threshold,species,tissue,fdr,database);
    }
    public List<Map> getCellMarkerDEList(String ontology,String species,String tissue){return celltype.getCellMarkerDEList(ontology,species,tissue);}
    public List<Map> getCellMarkerDETissueList(String ontology,String species){return celltype.getCellMarkerDETissueList(ontology,species);}
    public List<Map> getCellMarkerTotalBar(String genelist,String id,String species,String tissue,String database){
        return celltype.getCellMarkerTotalBar(genelist,id,species,tissue,database);
    }



    public List<Map> getDatasetsBySpecies(List<String> datasetlist,String species){
        return celltype.getDatasetsBySpecies(datasetlist,species);
    }

    public List<Map> getCellTypeStatistic(){return celltype.getCellTypeStatistic();}
    public List<Map> getSummary(String id){return celltype.getSummary(id);}
    public List<Map> getCellTypeStatistic2(){return celltype.getCellTypeStatistic2();}
    public List<Map> getSimilarity(String id){return celltype.getSimilarity(id);}
    public List<Map> getSpeciesSimilarity(String id){return celltype.getSpeciesSimilarity(id);}
    public List<Map> getSameCellSimilarity(String id){return celltype.getSpeciesSimilarity(id);}
    public List<Map> getSpeciesSimilarityMarker(String id,String tissue){return celltype.getSpeciesSimilarityMarker(id,tissue);}
    public List<Map> getSingleCellLSGeneList(String ontology){return celltype.getSingleCellLSGeneList(ontology);}
    public List<Map> getStudyTable(String id){return celltype.getStudyTable(id);}
    public List<Map> getCellByName(String id){return celltype.getCellByName(id);}
    public List<Map> getSurfaceMarker(String id){return celltype.getSurfaceMarker(id);}
    public List<Map> getRecommendDatasets(String id,String species){return celltype.getRecommendDatasets(id,species);}
    public List<Map> getRecommendMarkers(String id,String species){return celltype.getRecommendMarkers(id,species);}

    public List<Map> getSummaryFilter(String species,String cell,double fc,double ss,Integer tc,Integer pc,double dr){
        return celltype.getSummaryFilter(species,cell,fc,ss,tc,pc,dr);
    }

    public List<Map> getTissueDistribution(String id){return celltype.getTissueDistribution(id);}
    public List<Map> getConservedPub(String species,String tissue,String marker,String cellid){
        return celltype.getConservedPub(species,tissue,marker,cellid);
    }
    public List<Map> getCellStatistic(String item,String cellid){
        return celltype.getCellStatistic(item,cellid);
    }
}
