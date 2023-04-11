package com.example.ct.Service;

import com.example.ct.Mapper.CurationMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class CurationService {
    @Resource
    CurationMapper curationMapper;

    public void add_curation(
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
    ){
        curationMapper.add_curation(
                Species,
                Cell_original_name,
                Cell_standard,
                Cell_id,
                Parent_cell_id,
                New_cell_description,
                Tissue,
                Tissue_id,
                Condition,
                Disease_id,
                Positive_cell_marker,
                Negative_cell_marker,
                Combinatorial_cell_marker,
                Marker_description,
                PMID,
                Life_stage,
                Library,
                Datasets_id,
                Curator,
                Date,
                Uncertain
        );
    }
    public void edit_curation(
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
    ){
        curationMapper.edit_curation(
                ID,
                Species,
                Cell_original_name,
                Cell_standard,
                Cell_id,
                Parent_cell_id,
                New_cell_description,
                Tissue,
                Tissue_id,
                Condition,
                Disease_id,
                Positive_cell_marker,
                Negative_cell_marker,
                Combinatorial_cell_marker,
                Marker_description,
                PMID,
                Life_stage,
                Library,
                Datasets_id,
                Curator,
                Date,
                Uncertain
        );
    }

    public List<Map> curationlogin(String username,String password){
        return curationMapper.curationlogin(username,password);
    }
    public List<Map> getContributions(String username){
        return curationMapper.getContributions(username);
    }
    public void deleteCuration(String ID){
        curationMapper.deleteCuration(ID);
    }

    public List<Map> getCelltype(String term){
        return curationMapper.getCelltype(term);
    }
    public List<Map> getCellDetail(String cellid){
        return curationMapper.getCellDetail(cellid);
    }

    public List<Map> getTissueList(String term){
        return curationMapper.getTissueList(term);
    }
    public List<Map> getConditionList(String term){
        return curationMapper.getConditionList(term);
    }
    public List<Map> getSpeciesList(String term){
        return curationMapper.getSpeciesList(term);
    }
    public List<Map> getTotalCuration(){
        return curationMapper.getTotalCuration();
    }
    public List<Map> getProfile(String username){
        return curationMapper.getProfile(username);
    }
    public void changePassword(String username,String password){
        curationMapper.changePassword(username,password);
    }
    public List<Map> getLibrary(){
        return curationMapper.getLibrary();
    }

}
