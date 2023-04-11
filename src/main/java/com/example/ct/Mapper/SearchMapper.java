package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SearchMapper {
    List<Map> getHomeSearchCell(String query);
    List<Map> getHomeSearchMarker(String query);
    List<Map> getHomeSearchTissue(String query);
    List<Map> getHomeSearchSpecies(String query);
    List<Map> getHomeSearchCondition(String query);

    List<Map> getSearchData(String query);
    List<Map> getFilterData(String query,String tissues,String cell_types,String species);
    List<Map> updateSearchTable(
            List<String> enrichedname,
            String ordertitle,
            String direction,
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
            String title);
    List<Map> getTissueList(String disease,String gene,String celltype,List<String> speciess,List<String> diseasename,List<String> genename,List<String> celltypename,String term,String title,String query,String database);
    List<Map> getGeneList(String tissue,String disease,String celltype,List<String> speciess,List<String> tissuename,List<String> diseasename,List<String> celltypename,String term,String title,String query,String database);
    List<Map> getDiseaseList(String tissue,String gene,String celltype,List<String> speciess,List<String> tissuename,List<String> genename,List<String> celltypename,String term,String title,String query,String database);
    List<Map> getSpeciesList(String tissue,String disease,String gene,String celltype,List<String> tissuename,List<String> diseasename,List<String> genename,List<String> celltypename,String term,String query,String database);
    List<Map> getEnrichedMarker(String tissue,String disease,String gene,String celltype,List<String> speciess,List<String> tissuename,List<String> diseasename,List<String> genename,List<String> celltypename,String term,String query,String database);
    List<Map> getCelltypeList(String tissue,String disease,String gene,
                              List<String> speciess,
                              List<String> tissuename,
                              List<String> diseasename,
                              List<String> genename,String term,String title,String query,String database);
    List<Map> getOtherList(String term,String title,String query);

    List<Map> getSearchTable();


}
