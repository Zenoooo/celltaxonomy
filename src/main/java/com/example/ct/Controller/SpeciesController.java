package com.example.ct.Controller;

import com.example.ct.Mapper.SpeciesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
public class SpeciesController {
    @Autowired
    SpeciesMapper speciesMapper;

//    @RequestMapping(value = "/getspecies", method = RequestMethod.POST)
//    @ResponseBody
//    public List<Map> getspecies(
//            @RequestParam(value = "tissue", required = false) String tissue,
//            @RequestParam(value = "species", required = false) String species,
//            @RequestParam(value = "celltype", required = false) String celltype
//    ) {
//
//        List<String> speciesList = new ArrayList<>();
//
//        if (species != null && !species.equals("null") && species.length()>0){
//            String[] arr = species.replace("[", "").replace("]","").split(",");
//            speciesList = Arrays.asList(arr);
//        }
//
//        List<String> tissueList = new ArrayList<>();
//
//        if (tissue != null && !tissue.equals("null") && tissue.length()>0){
//            String[] arr = tissue.replace("[", "").replace("]","").split(",");
//            tissueList = Arrays.asList(arr);
//        }
//
//        List<String> celltypeList = new ArrayList<>();
//
//        if (celltype != null && !celltype.equals("null") && celltype.length()>0){
//            String[] arr = celltype.replace("[", "").replace("]","").split(",");
//            celltypeList = Arrays.asList(arr);
//        }
//        List<Map> results = speciesMapper.getSpecies(speciesList, tissueList, celltypeList);
//        return results;
//    }

    @RequestMapping(value = "/getspecies", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> getspecies() {

        List<Map> results = speciesMapper.getSpecies();
        return results;
    }
    @RequestMapping(value = "/species/{id}", method = RequestMethod.GET)
    public String single_condition(@PathVariable("id")String id, Model model) {
        model.addAttribute("id",id);
        return "SingleSpecies";
    }

    @RequestMapping(value = "/species_description", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> condition_description(String id) {
        List<Map> result=speciesMapper.getSpeciesByID(id);
        return result;
    }
    @RequestMapping(value = "/species_basic", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> condition_basic(String id) {
        List<Map> result=speciesMapper.getSpeciesBasicByID(id);
        return result;
    }
    @RequestMapping(value = "/getspecieslist", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> getspecieslist( @RequestParam(value = "tissue", required = false) String tissue,
                                     @RequestParam(value = "celltype", required = false) String celltype){
        List<String> tissueList = new ArrayList<>();

        if (tissue != null && !tissue.equals("null") && tissue.length()>0){
            String[] arr = tissue.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);
        }

        List<String> celltypeList = new ArrayList<>();

        if (celltype != null && !celltype.equals("null") && celltype.length()>0){
            String[] arr = celltype.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }


        List<Map> list = speciesMapper.getSpeciesList(tissueList,celltypeList);
        return list;
    }

    @RequestMapping(value = "/species_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> marker_statistic(@RequestParam("type")String type,
                                      @RequestParam("speciesid")String id){

        String item;
        if(type.equals("marker")){
            item="Cell_Marker,Gene_ENTREZID,Gene_ENTREZID2";
        }
        else if(type.equals("tissue")){
            item="Tissue_standard,Tissue_UberonOntology_ID,Tissue_UberonOntology_ID2";
        }
        else if(type.equals("condition")){
            item="Disease_Type,Disease_Ontology_ID,Disease_Ontology_ID2";
        }
        else if(type.equals("cell")){
            item="Cell_standard,CT_ID,Specific_Cell_Ontology_ID";
        }
        else{
            item="a.PMID,title,journalvolume";
        }
        List<Map> results=speciesMapper.getSpeciesStatistic(item,id);

        return results;
    }

}