package com.example.ct.Controller;

import com.example.ct.Mapper.MarkerMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.*;

@Controller
public class MarkerController {
    @Autowired
    MarkerMapper markerMapper;

    @RequestMapping(value = "/marker",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> getMarkerStatistic(
            @RequestParam(value = "start",required = false)Integer start,
            @RequestParam(value = "length",required = false)Integer length,
            @RequestParam(value = "search[value]",defaultValue = "",required = false)String search,
            @RequestParam(value = "draw",required = false)Integer draw,
            @RequestParam(value = "order[0][column]")Integer order,
            @RequestParam(value = "order[0][dir]")String orderDir){

        if(!orderDir.equals("desc") && !orderDir.equals("asc")){
            return null;
        }
        List<String> title=new ArrayList<String>(){
            {
                this.add("Cell_Marker");
                this.add("cell_num");
                this.add("Tissue_num");
                this.add("Disease_num");
                this.add("PMID_num");
                this.add("HomoloGene_num");

            }
        };

        Integer pagenum=(start/length)+1;
        PageHelper.startPage(pagenum,length);
        List<Map> allmarkers = markerMapper.getAllMarkers(search,title.get(order),orderDir);
        PageInfo<Map> pageInfo= new PageInfo<>(allmarkers);
        HashMap<String,Object> hashMap= new HashMap<>();
        hashMap.put("draw",draw);
        hashMap.put("data",allmarkers);
        hashMap.put("recordsTotal",pageInfo.getTotal());
        hashMap.put("recordsFiltered",pageInfo.getTotal());
        return hashMap;
    }
//    @RequestMapping(value = "/SingleMarker/{id}",method = RequestMethod.GET)
//    public String SingleMarkerGET(@PathVariable("id")String id,
//                               @RequestParam("marker")String marker,
//                               @RequestParam(value = "type",required = false)String type,
//                               Model model,
//                               ModelMap modelMap){
//        modelMap.put("markername",marker);
//        modelMap.put("type",type);
//
//        model.addAttribute("markeridcard",markerMapper.getMarkerIdCard(id)) ;
//
//        return "SingleMarker";
//    }

//    @RequestMapping(value = "/SingleMarker",method = RequestMethod.POST)
//    public String SingleMarker(@RequestParam("id")String id,
//                               @RequestParam("marker")String marker,
//                               @RequestParam(value = "type",required = false)String type,
//                               Model model,
//                               ModelMap modelMap){
//        modelMap.put("markername",marker);
//        modelMap.put("type",type);
//        System.out.println(id);
//
//        System.out.println(id.length());
//        model.addAttribute("markeridcard",markerMapper.getMarkerIdCard(id)) ;
//
//        return "SingleMarker";
//    }

    @RequestMapping(value = "/marker/{id}",method = RequestMethod.GET)
    public String SingleMarkerGET(@PathVariable("id")String id,
                               @RequestParam(value = "type",required = false)String type,
                               Model model,
                               ModelMap modelMap){
        List<Map> mapList=markerMapper.getMarkerIdCard(id);

        model.addAttribute("markeridcard",mapList) ;
        model.addAttribute("markername",mapList.get(0).get("Cell_Marker")) ;
        model.addAttribute("markerid",id) ;


        return "SingleMarker";
    }

    @RequestMapping(value = "/marker_table",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> marker_table(@RequestParam(value = "marker")String marker){
        List<Map> marker_table=markerMapper.getMarkerTable(marker);
        return marker_table;
    }

    @RequestMapping(value = "/marker_figure",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> Marker_Figure(@RequestParam(value = "marker")String marker,
                                   @RequestParam(value = "value_type")String value_type,
                                   @RequestParam(value = "tissue")String tissue){
        List<Map> marker_figure=markerMapper.getMarkerFigureData(tissue,value_type,marker);
        return marker_figure;
    }
    @RequestMapping(value = "/cell_type_enrichment",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> cell_type_enrichment(@RequestParam(value = "marker")String marker,
                                          @RequestParam(value = "tissue",required = false,defaultValue = "")String tissue){
        List<Map> results=markerMapper.getCellTypeEnrichment(marker,tissue);
        return results;
    }
    @RequestMapping(value = "/cell_tissue_enrichment",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> cell_tissue_enrichment(@RequestParam(value = "marker")String marker,
                                          @RequestParam(value = "entrezid")String entrezid){
        List<Map> results=markerMapper.getCellTissueEnrichment(marker,entrezid);
        List<Map> genelist=markerMapper.getCTEGenelist(marker,entrezid);
        List<Map> genelistByLS=markerMapper.getCTEGenelistByLS(marker,entrezid);

        HashMap<String,Object> hashMap = new HashMap<>();
        hashMap.put("results",results);
        hashMap.put("genelist",genelist);
        hashMap.put("genelistByLS",genelistByLS);
        return hashMap;
    }

    @RequestMapping(value = "/search_marker",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> search_marker(@RequestParam(value = "marker")String marker){

        List<Map> results=markerMapper.SingleMarkerSearch(marker);
        return results;
    }

    @RequestMapping(value = "/markerid",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> markerid(@RequestParam(value = "marker")String marker){
        List<Map> results=markerMapper.getMarkerByName(marker);
        return results;
    }

    @RequestMapping(value = "/marker_cell_markerDE",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> marker_cell_markerDE(@RequestParam(value = "marker")String marker){
        HashMap<String,Object> hashMap=new HashMap<>();
        long startTime=System.currentTimeMillis();   //获取开始时间

        hashMap.put("plot",markerMapper.getCellMarkerDE(marker));
        long endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间1： "+(endTime-startTime)+"ns");


        startTime=System.currentTimeMillis();   //获取开始时间
        hashMap.put("score",markerMapper.getMarkerSS(marker));
        endTime=System.currentTimeMillis();
        System.out.println("程序运行时间2： "+(endTime-startTime)+"ns");

        return hashMap;
    }
    @RequestMapping(value = "/marker_cell_ss",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> marker_cell_ss(@RequestParam(value = "marker")String marker,
                                                        @RequestParam(value = "species")String species,
                                                        @RequestParam(value = "tissue")String tissue){
        HashMap<String,Object> hashMap=new HashMap<>();

        hashMap.put("score",markerMapper.getMarkerSS(marker));
        return hashMap;
    }

    @RequestMapping(value = "/marker_getspecieslist", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> getspecieslist( @RequestParam(value = "tissue", required = false) String tissue,
                                     @RequestParam(value = "celltype", required = false) String celltype,
                                     @RequestParam(value = "condition", required = false) String condition){
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
        List<String> conditionList = new ArrayList<>();

        if (celltype != null && !celltype.equals("null") && celltype.length()>0){
            String[] arr = condition.replace("[", "").replace("]","").split(",");
            conditionList = Arrays.asList(arr);
        }

        List<Map> list = markerMapper.getSpeciesList(tissueList,celltypeList,conditionList);
        return list;
    }
    @RequestMapping(value = "/exp_celltype_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> exp_celltype_list(@RequestParam(value = "marker")String marker,
                                       @RequestParam(value = "species")String species){

        String database;
        if(species.equals("Homo sapiens")){
            database="ct.filter_boxplot_long_human";
        }
        else if(species.equals("Mus musculus")){
            database="ct.filter_boxplot_long_mouse";
        }
        else{
            return null;
        }

        List<Map> results =markerMapper.getCMECellList(marker,database);

        return results;
    }

    @RequestMapping(value = "/marker_cell_markerDE_bar",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> marker_cell_markerDE_bar(@RequestParam("marker")String marker,
                                                            @RequestParam("threshold")String threshold,
                                                            @RequestParam("fdr")String fdr){

        HashMap<String,Object> hashMap=new HashMap<>();
        String database="";
        if(threshold.equals("0.25")){
            if(fdr.equals("0.05")){
                database="A";
            }
            else if(fdr.equals("0.01")){
                database="F";
            }
            else if(fdr.equals("0.001")){
                database="K";
            }
        }
        else if(threshold.equals("0.5")){
            if(fdr.equals("0.05")){
                database="B";
            }
            else if(fdr.equals("0.01")){
                database="G";
            }
            else if(fdr.equals("0.001")){
                database="L";
            }
        }
        else if(threshold.equals("1")){
            if(fdr.equals("0.05")){
                database="C";
            }
            else if(fdr.equals("0.01")){
                database="H";
            }
            else if(fdr.equals("0.001")){
                database="M";
            }
        }
        else if(threshold.equals("1.5")){
            if(fdr.equals("0.05")){
                database="D";
            }
            else if(fdr.equals("0.01")){
                database="I";
            }
            else if(fdr.equals("0.001")){
                database="N";
            }
        }
        else if(threshold.equals("2")){
            if(fdr.equals("0.05")){
                database="E";
            }
            else if(fdr.equals("0.01")){
                database="J";
            }
            else if(fdr.equals("0.001")){
                database="O";
            }
        }

        List<Map> results=markerMapper.getMarkerCellDEBar(marker,database);
        hashMap.put("result",results);
        if(results.size()>0){
            List<String> datasetList = new ArrayList<>();
            String[] arr = new String[results.size()];
            Integer n =0;

            for (Map i :results){
                arr[n]=i.get("CT_ID").toString();
                n++;
            }
            datasetList = Arrays.asList(arr);
            hashMap.put("total",markerMapper.getMarkerCellTotalBar(datasetList,marker));
        }
        else{
            hashMap.put("total","[]");
        }
        return hashMap ;
    }
    @RequestMapping(value = "/recommend_cells",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> recommend_markers(@RequestParam("id")String id,
                                       @RequestParam("species")String species){

        return markerMapper.getRecommendCells(id,species);

    }
    @RequestMapping(value = "/marker_summary_filter",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> summary_filter(
                                    @RequestParam("id")String markerid,
                                    @RequestParam("fc")double fc,
                                    @RequestParam("ss")double ss,
                                    @RequestParam("dr")double dr,
                                    @RequestParam("tc")Integer tc,
                                    @RequestParam("pc")Integer pc){
        List<Map> results=markerMapper.getSummaryFilter(markerid,fc,ss,tc,pc,dr);

        return results;

    }
    @RequestMapping(value = "/marker_species_similarity",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> species_similarity(@RequestParam(value = "id")String id){
        List<Map> results =markerMapper.getSpeciesSimilarity(id);
        return results;
    }

    @RequestMapping(value = "/marker_surface_marker",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> surface_marker(@RequestParam("id")String id){

        return markerMapper.getSurfaceMarker(id);
    }

    @RequestMapping(value = "/marker_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> marker_statistic(@RequestParam("type")String type,
                                    @RequestParam("marker")String id){

        String item;
        if(type.equals("species")){
            item="Species,Species_tax_ID";
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
        List<Map> results=markerMapper.getMarkerStatistic2(item,id);

        return results;
    }

    @RequestMapping(value = "/marker_homo_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> marker_homo_statistic(
                                      @RequestParam("marker")String id){


        List<Map> results=markerMapper.getMarkerHomoStatistic(id);

        return results;
    }
}
