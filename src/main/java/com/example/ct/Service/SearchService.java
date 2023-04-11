package com.example.ct.Service;

import com.example.ct.Mapper.SearchMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {
    @Resource
    SearchMapper searchMapper;

    public List<Map> getHomeSearchCell(String query){return searchMapper.getHomeSearchCell(query);}
    public List<Map> getHomeSearchMarker(String query){return searchMapper.getHomeSearchMarker(query);}
    public List<Map> getHomeSearchTissue(String query){return searchMapper.getHomeSearchTissue(query);}
    public List<Map> getHomeSearchSpecies(String query){return searchMapper.getHomeSearchSpecies(query);}
    public List<Map> getHomeSearchCondition(String query){return searchMapper.getHomeSearchCondition(query);}

    public List<Map> getSearchData(String query){return searchMapper.getSearchData(query);}
    public List<Map> getFilterData(String query,String tissues,String cell_types,String species){return searchMapper.getFilterData(query,tissues,cell_types,species);}
    public List<Map> getTissueList(String disease,String gene,String celltype,List<String> speciess,List<String> diseasename,List<String> genename,List<String> celltypename,String term,String title,String query,String database){return searchMapper.getTissueList(disease, gene, celltype,speciess,diseasename,genename,celltypename,term,title,query,database);}
    public List<Map> getGeneList(String tissue,String disease,String celltype,List<String> speciess,List<String> tissuename,List<String> diseasename,List<String> celltypename,String term,String title,String query,String database){return searchMapper.getGeneList(tissue, disease,celltype,speciess,tissuename,diseasename,celltypename,term,title,query,database);}
    public List<Map> getDiseaseList(String tissue,String gene,String celltype,List<String> speciess,List<String> tissuename,List<String> genename,List<String> celltypename,String term,String title,String query,String database){return searchMapper.getDiseaseList(tissue,gene, celltype,speciess,tissuename,genename,celltypename,term,title,query,database);}
    public List<Map> getSpeciesList(String tissue,String disease,String gene,String celltype,List<String> tissuename,List<String> diseasename,List<String> genename,List<String> celltypename,String term,String query,String database){return searchMapper.getSpeciesList(tissue, disease, gene, celltype,tissuename,diseasename,genename,celltypename,term,query,database);}
    public List<Map> getEnrichedMarker(String tissue,String disease,String gene,String celltype,List<String> speciess,List<String> tissuename,List<String> diseasename,List<String> genename,List<String> celltypename,String term,String query,String database){return searchMapper.getEnrichedMarker(tissue, disease, gene, celltype,speciess,tissuename,diseasename,genename,celltypename,term,query,database);}
    public List<Map> getCelltypeList(String tissue,String disease,String gene,List<String> speciess,
                                     List<String> tissuename,
                                     List<String> diseasename,
                                     List<String> genename,String term,String title,String query,String database){return searchMapper.getCelltypeList(tissue, disease, gene,speciess,tissuename,diseasename,genename,term,title,query,database);}
    public List<Map> getOtherList(String term,String title,String query){return searchMapper.getOtherList(term,title,query);}

    public List<Map> getSearchTable(){return searchMapper.getSearchTable();}

    public List<Map> updateSearchTable(
            List<String> enrichedname,
            String ordertitle,
            String orderDir,
            List<String> confidence,
            List<String> source,
            String search,
            List<String> speciess,
            List<String> tissuename,
            List<String> diseasename,
            List<String> genename,
            List<String> celltypename,
            List<String> othername,
            String species,
            String tissue,
            String disease,
            String gene,
            String celltype,
            String other,
            String query,
            String database,
            String title
    ){
        return searchMapper.updateSearchTable(
                enrichedname,
                ordertitle,
                orderDir,
                confidence,
                source,
                search,
                speciess,
                tissuename,
                diseasename,
                genename,
                celltypename,
                othername,
                species,
                tissue,
                disease,
                gene,
                celltype,
                other,
                query,
                database,
                title
        );}

}
