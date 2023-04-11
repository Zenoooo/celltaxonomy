package com.example.ct.Controller;

import com.example.ct.Mapper.ConditionMapper;
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
public class ConditionController {
    @Autowired
    ConditionMapper conditionMapper;

//    @RequestMapping(value = "/getcondition", method = RequestMethod.POST)
//    @ResponseBody
//    public List<Map> cell_type_statistic(
//            @RequestParam(value = "tissue", required = false) String tissue,
//            @RequestParam(value = "condition", required = false) String condition,
//            @RequestParam(value = "celltype", required = false) String celltype
//    ) {
//
//        List<String> conditionList = new ArrayList<>();
//
//        if (condition != null && !condition.equals("null") && condition.length()>0){
//            String[] arr = condition.replace("[", "").replace("]","").split(",");
//            conditionList = Arrays.asList(arr);
//        }
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
//        List<Map> results = conditionMapper.getCondition(conditionList, tissueList, celltypeList);
//        return results;
//    }

    @RequestMapping(value = "/getcondition", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> cell_type_statistic() {

        List<Map> results = conditionMapper.getCondition();
        return results;
    }
    @RequestMapping(value = "/condition/{id}", method = RequestMethod.GET)
    public String single_condition(@PathVariable("id")String id,Model model) {
        model.addAttribute("id",id);
        return "SingleCondition";
    }

    @RequestMapping(value = "/condition_description", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> condition_description(String id) {
        List<Map> result=conditionMapper.getConditionByID(id);
        return result;
    }
    @RequestMapping(value = "/condition_basic", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> condition_basic(String id) {
        List<Map> result=conditionMapper.getConditionBasicByID(id);
        return result;
    }
    @RequestMapping(value = "/getconditionlist", method = RequestMethod.POST)
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


        List<Map> list = conditionMapper.getConditionList(tissueList,celltypeList);
        return list;
    }

    @RequestMapping(value = "/condition_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> marker_statistic(@RequestParam("type")String type,
                                      @RequestParam("conditionid")String id){

        String item;
        if(type.equals("marker")){
            item="Cell_Marker,Gene_ENTREZID,Gene_ENTREZID2";
        }
        else if(type.equals("tissue")){
            item="Tissue_standard,Tissue_UberonOntology_ID,Tissue_UberonOntology_ID2";
        }
        else if(type.equals("species")){
            item="Species,Species_tax_ID";
        }
        else if(type.equals("cell")){
            item="Cell_standard,CT_ID,Specific_Cell_Ontology_ID";
        }
        else{
            item="a.PMID,title,journalvolume";
        }
        List<Map> results=conditionMapper.getConditionStatistic(item,id);

        return results;
    }

}
