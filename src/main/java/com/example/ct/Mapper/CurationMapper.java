package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CurationMapper {
    void add_curation(
            String Species,
            String Cell_original_name,
            String Cell_standard,
            String Cell_id,
            String Parent_cell_id,
            String New_cell_description,
            String Tissue,
            String Tissue_id,
            String Condition,
            String Disease_id,
            String Positive_cell_marker,
            String Negative_cell_marker,
            String Combinatorial_cell_marker,
            String Marker_description,
            String PMID,
            String Life_stage,
            String Library,
            String Datasets_id,
            String Curator,
            String Date,
            String Uncertain
    );
    void edit_curation(
            String ID,
            String Species,
            String Cell_original_name,
            String Cell_standard,
            String Cell_id,
            String Parent_cell_id,
            String New_cell_description,
            String Tissue,
            String Tissue_id,
            String Condition,
            String Disease_id,
            String Positive_cell_marker,
            String Negative_cell_marker,
            String Combinatorial_cell_marker,
            String Marker_description,
            String PMID,
            String Life_stage,
            String Library,
            String Datasets_id,
            String Curator,
            String Date,
            String Uncertain

    );
    List<Map> curationlogin(String username, String password);
    List<Map> getContributions(String username);
    void deleteCuration(String ID);
    List<Map> getCelltype(String term);
    List<Map> getCellDetail(String cellid);
    List<Map> getTissueList(String term);
    List<Map> getConditionList(String term);
    List<Map> getSpeciesList(String term);
    List<Map> getTotalCuration();
    List<Map> getProfile(String username);
    void changePassword(String username, String password);
    List<Map> getLibrary();

}
