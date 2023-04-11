package com.example.ct.Controller;

import com.example.ct.Mapper.TissueMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class TissueController {
    @Autowired
    TissueMapper tissueMapper;

    @RequestMapping(value = "/tissue/{id}",method = RequestMethod.GET)
    public String Tissue(@PathVariable(value = "id")String id,
                         Model model){
        List<Map> results=tissueMapper.getDescription(id);
        model.addAttribute("id",id);
        model.addAttribute("name",results.get(0).get("Tissue_standard"));
        return "Tissue";
    }


    @RequestMapping(value = "/tissue_description",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_description(@RequestParam(value = "tissue")String tissue){
        List<Map> results=tissueMapper.getDescription(tissue);
        return results;
    }

    @RequestMapping(value = "/tissue_cell_type_enrichment",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_cell_type_enrichment(@RequestParam(value = "tissue")String tissue){
        tissue=tissue.replace("_"," ");
        List<Map> results=tissueMapper.getCellEnrichment(tissue);
        return results;
    }

    @RequestMapping(value = "/cell_type_cell_marker_heatmap",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> cell_type_cell_marker_heatmap(@RequestParam(value = "id")String tissue){
        tissue=tissue.replace("_",":");
        List<Map> results=tissueMapper.getCellTypeCellMarkerHeatmap(tissue);


        HashMap<String,Object> hashMap=new HashMap<>();
        hashMap.put("results",results);

        return hashMap;
    }

    @RequestMapping(value = "/tissue_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_statistic(){

        List<Map> results=tissueMapper.getTissueStatistic();
        return results;
    }
    @RequestMapping(value = "/tissue_summary",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_summary(@RequestParam("tissue")String tissue,
                                    @RequestParam("id")String id){

        List<Map> results=tissueMapper.getTissueSummary(id,tissue);
        return results;
    }
    @RequestMapping(value = "/get_description",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> get_description(@RequestParam("id")String id){

        List<Map> results=tissueMapper.get_description(id);
        return results;
    }
    @RequestMapping(value = "/tissueid",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissueid(@RequestParam("id")String id){
        List<Map> results=tissueMapper.getTissueByName(id);

        return results;
    }

    @RequestMapping(value = "/tissue",method = RequestMethod.POST)
    public String to_cell_type(@RequestParam(value = "name")String name,
                               @RequestParam(value = "id")String id,
                               ModelMap modelmap){


        modelmap.put("name",name);
        modelmap.put("id",id);

        return "Tissue";
    }
    @RequestMapping(value = "/tissue_composition_celltype",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> celltype_composition_tissue(@RequestParam("tissue")String tissue){
        return tissueMapper.getTissueCompositionOfCell(tissue);
    }

    @RequestMapping(value = "/tissue_statistic2",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_statistic2(
            @RequestParam("type")String type,
            @RequestParam("tissueid")String tissueid
    ){
        String item;
        if(type.equals("species")){
            item="Species,Species_tax_ID";
        }
        else if(type.equals("cell")){
            item="Cell_standard,CT_ID,Specific_Cell_Ontology_ID";
        }
        else if(type.equals("condition")){
            item="Disease_Type,Disease_Ontology_ID,Disease_Ontology_ID2";
        }
        else if(type.equals("marker")){
            item="Cell_Marker,Gene_ENTREZID,Gene_ENTREZID2";
        }
        else{
            item="a.PMID,title,journalvolume";
        }
        List<Map> results=tissueMapper.getTissueStatistic2(item,tissueid);

        return results;

    }
}
