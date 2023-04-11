package com.example.ct.Controller;

import com.example.ct.Mapper.CelltypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class CelltypeController {
    @Autowired
    CelltypeMapper celltype;

//    @GetMapping("/Cell_type/{id}")
//    public String getcelltype(@PathVariable("id")String id,ModelMap model){
//        model.put("id",id);
//        return "Celltype";
//    }
    @RequestMapping(value = "/celltype/{id}",method = RequestMethod.GET)
    public String singlecell(@PathVariable("id")String id,
                             Model model){
        List<Map> mapList = celltype.getCellByCT(id);
        model.addAttribute("id",mapList.get(0).get("Specific_Cell_Ontology_ID"));
        model.addAttribute("name",mapList.get(0).get("Cell_standard"));

        return "Celltype";
    }


    @RequestMapping(value = "/description",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public List<Map> Description(@RequestParam(value = "id",required = true)String ontology){
        List<Map> ct_results =celltype.getDescription(ontology);
        return ct_results;
    }

    @RequestMapping(value = "/cellid",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> cellid(@RequestParam(value = "id")String ontology){
        List<Map> ct_results =celltype.getCellByName(ontology);
        return ct_results;
    }


    @RequestMapping(value = "/idcard",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> IdCard(@RequestParam(value = "id")String ontology){

        List<Map> idcard =celltype.getIdCard(ontology);
        return idcard;
    }
    @RequestMapping(value = "/cell_tissue_pie",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public List<Map> cellpie(Model model,
                                       @RequestParam(value = "id",required = true)String ontology){
        List<Map> ct_results =celltype.getTissueEnrichmentOR(ontology);


        return ct_results;
    }
    @RequestMapping(value = "/cell_condition_pie",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public List<Map> tissue_enrichmentLS(Model model,
                                       @RequestParam(value = "id",required = true)String ontology){
        List<Map> ct_results =celltype.getTissueEnrichmentLS(ontology);


        return ct_results;
    }
    @RequestMapping(value = "/cell_marker_overall",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public List<Map> cell_marker_overall(Model model,
                                       @RequestParam(value = "id",required = true)String ontology){
        List<Map> ct_results =celltype.getOverallCellLiteratureSupport(ontology);

        return ct_results;
    }

    @RequestMapping(value = "/cell_marker_single",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public HashMap<String,Object> cell_marker_single(@RequestParam(value = "id",required = true)String ontology){

        List<Map> ct_results =celltype.getSingleCellLiteratureSupport(ontology);
        HashMap<String,Object> results=new HashMap<>();
        results.put("results",ct_results);
        return results;
    }



    @RequestMapping(value = "/cell_type_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> cell_type_statistic(){
        List<Map> ct_results =celltype.getCellTypeStatistic();

        return ct_results;
    }

    @RequestMapping(value = "/celltype_summary",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public List<Map> celltype_summary(@RequestParam(value = "id",required = true)String ontology){
        List<Map> ct_results =celltype.getSummary(ontology);
        return ct_results;
    }

    @RequestMapping(value = "/cell_type_statistic2",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> cell_type_statistic2(){
        List<Map> ct_results =celltype.getCellTypeStatistic2();

        return ct_results;
    }
    @RequestMapping(value = "/similarity",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> similarity(@RequestParam(value = "id")String id){
        List<Map> results =celltype.getSimilarity(id);

        return results;
    }
    @RequestMapping(value = "/species_similarity_marker",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> species_similarity_marker(
            @RequestParam(value = "id")String id){

        System.out.println(id);
        List<Map> results =celltype.getSpeciesSimilarity(id);


        return results;
    }
    @RequestMapping(value = "/same_cell_similarity",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> same_cell_similarity(
            @RequestParam(value = "id")String id){
        List<Map> results =celltype.getSameCellSimilarity(id);

        return results;
    }

    @RequestMapping(value = "/study_table",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> study_table(@RequestParam("id")String id){
        return celltype.getStudyTable(id);
    }

    @RequestMapping(value = "/recommend_datasets",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> recommend_datasets(@RequestParam("id")String id,
                                        @RequestParam("species")String species){
        return celltype.getRecommendDatasets(id,species);
    }
    @RequestMapping(value = "/recommend_markers",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> recommend_markers(@RequestParam("id")String id,
                                       @RequestParam("species")String species){

        return celltype.getRecommendMarkers(id,species);

    }


    @RequestMapping(value = "/cell_marker_expression",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> cell_marker_expression(@RequestParam("id")String id,
                                                          @RequestParam("marker")String marker,
                                                          @RequestParam("species")String species){

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


//        List<Map> judge=celltype.getCMEJudge(id);
//        if(judge.size()==0){
//            return null;
//        }

        List<Map> datasets=celltype.getCMEList(id,marker,database);
        if(datasets.size()==0){
            return null;
        }

        List<String> datasetList = new ArrayList<>();
        String[] arr = new String[datasets.size()];
        Integer n =0;
        for (Map i :datasets){
            arr[n]=i.get("ID").toString();
            n++;
        }
        datasetList = Arrays.asList(arr);


        List<Map> result=celltype.getCME(datasetList,marker,database);
        HashMap<String,Object> results=new HashMap<>();
        results.put("results",result);
        results.put("list",datasetList);
        return results;
    }
    @RequestMapping(value = "/celltype_cell_markerDE_select",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerDE_select(@RequestParam(value = "id",required = true)String ontology,
                                                          @RequestParam(value="name")String cell){
        HashMap<String,Object> hashMap=new HashMap<>();
        String tissue="All";

        String database="total_findmarker_short_"+cell.split("")[0];
        String database2="total_cell_specificities_short_"+cell.split("")[0];

        long startTime=System.currentTimeMillis();   //获取开始时间
        List<Map> plot =celltype.getCellMarkerDESelect(ontology,tissue,database);
        long endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间3-1： "+(endTime-startTime)+"ms");

        startTime=System.currentTimeMillis();   //获取开始时间
        List<Map> score =celltype.getCellSEScoreSelect(ontology,tissue,database2);
        endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间3-2： "+(endTime-startTime)+"ms");

        hashMap.put("plot",plot);
        hashMap.put("score",score);

        return hashMap;
    }
    @RequestMapping(value = "/celltype_cell_markerDE",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerDE(@RequestParam(value = "id",required = true)String ontology,
                                                          @RequestParam(value="name")String cell,
                                                          @RequestParam(value = "species",required = true)String species){
        HashMap<String,Object> hashMap=new HashMap<>();
        String tissue="All";
        long startTime=System.currentTimeMillis();   //获取开始时间
        List<Map> datasets=celltype.getCellMarkerDEList(ontology,species,tissue);
        long endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间2-1： "+(endTime-startTime)+"ns");

        startTime=System.currentTimeMillis();   //获取开始时间

        List<String> datasetList = new ArrayList<>();
        String[] arr = new String[datasets.size()];
        Integer n =0;
        for (Map i :datasets){
            arr[n]=i.get("Gene_ENTREZID2").toString();
            n++;
        }
        String database="total_findmarker_short_"+cell.split("")[0];
        String database2="total_cell_specificities_short_"+cell.split("")[0];

        datasetList = Arrays.asList(arr);
        endTime=System.currentTimeMillis();

        System.out.println("程序运行时间2-1-2： "+(endTime-startTime)+"ns");


        List<Map> plot =new ArrayList<>();
        List<Map> score =new ArrayList<>();
        if(datasetList.size()>0){


            startTime=System.currentTimeMillis();   //获取开始时间

            plot =celltype.getCellMarkerDE(ontology,species,tissue,datasetList,database);



            endTime=System.currentTimeMillis();
            System.out.println("程序运行时间2-2-1： "+(endTime-startTime)+"ns");

            startTime=System.currentTimeMillis();   //获取开始时间

            score =celltype.getCellSEScore(datasetList,ontology,species,tissue,database2);

            endTime=System.currentTimeMillis();
            System.out.println("程序运行时间2-2-2： "+(endTime-startTime)+"ns");

            hashMap.put("plot",plot);
            hashMap.put("score",score);

        }
        else{
            hashMap.put("plot",plot);
            hashMap.put("score",score);
        }


        return hashMap;
    }

    @RequestMapping(value = "/celltype_cell_markerDE_all",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerDE_all(@RequestParam(value = "id",required = true)String ontology,
                                                          @RequestParam(value="name")String cell,
                                                          @RequestParam(value = "species",required = true)String species){
        HashMap<String,Object> hashMap=new HashMap<>();
        String tissue="All";

        String database="total_findmarker_short_"+cell.split("")[0];


        List<Map> plot =celltype.getCellMarkerDEAll(cell,species,tissue,database);

        hashMap.put("plot",plot);

        return hashMap;
    }
    @RequestMapping(value = "/celltype_cell_markerSS_all",method = RequestMethod.POST, params={"id"})
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerSS_all(@RequestParam(value = "id",required = true)String ontology,
                                                              @RequestParam(value="name")String cell,
                                                              @RequestParam(value = "species",required = true)String species){
        HashMap<String,Object> hashMap=new HashMap<>();
        String tissue="All";



        String database2="total_specificities_short_"+cell.split("")[0];



        List<Map> score =celltype.getCellSEScoreAll(cell,species,tissue,database2);



        hashMap.put("score",score);


        return hashMap;
    }
    @RequestMapping(value = "/celltype_cell_markerDE_bar",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerDE_bar(@RequestParam("id")String id,
                                                              @RequestParam("name")String name,
                                                              @RequestParam("threshold")String threshold,
                                                              @RequestParam("species")String species,
                                                              @RequestParam("fdr")String fdr){

        HashMap<String,Object> result=new HashMap<>();

        String tissue="All";
        long startTime=System.currentTimeMillis();   //获取开始时间
        List<Map> datasets=celltype.getCellMarkerDEList(id,species,tissue);
        long endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间1： "+(endTime-startTime)+"ns");


        String database="";
        String database2="total_boxplotlong_count_"+name.split("")[0];
        List<String> datasetList = new ArrayList<>();
        String[] arr = new String[datasets.size()];
        Integer n =0;
        for (Map i :datasets){
            arr[n]=i.get("Gene_ENTREZID2").toString();
            n++;
        }
        datasetList = Arrays.asList(arr);

        startTime=System.currentTimeMillis();   //获取开始时间

        if(threshold.equals("0.25")){
            if(fdr.equals("0.05")){
                database="A";
            }
            else if(fdr.equals("0.01")){
                database="B";
            }
            else if(fdr.equals("0.001")){
                database="C";
            }
        }
        else if(threshold.equals("0.5")){
            if(fdr.equals("0.05")){
                database="D";
            }
            else if(fdr.equals("0.01")){
                database="E";
            }
            else if(fdr.equals("0.001")){
                database="F";
            }
        }
        else if(threshold.equals("1")){
            if(fdr.equals("0.05")){
                database="G";
            }
            else if(fdr.equals("0.01")){
                database="H";
            }
            else if(fdr.equals("0.001")){
                database="I";
            }
        }
        else if(threshold.equals("1.5")){
            if(fdr.equals("0.05")){
                database="J";
            }
            else if(fdr.equals("0.01")){
                database="K";
            }
            else if(fdr.equals("0.001")){
                database="L";
            }
        }
        else if(threshold.equals("2")){
            if(fdr.equals("0.05")){
                database="M";
            }
            else if(fdr.equals("0.01")){
                database="N";
            }
            else if(fdr.equals("0.001")){
                database="O";
            }
        }


        List<Map> results=celltype.getCellMarkerDEBar(id,threshold,species,datasetList,tissue,fdr,database);
        endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间2： "+(endTime-startTime)+"ns");


        result.put("result",results);

        if(results.size()>0){
//            arr = new String[results.size()];
//            n =0;
//
//            for (Map i :results){
//                arr[n]=i.get("markers").toString().replace("\r","");
//                n++;
//            }
//            datasetList = Arrays.asList(arr);
            startTime=System.currentTimeMillis();   //获取开始时间
            String genelist="(";
            for (String i :datasetList){
                genelist+="\""+i+"\",";
            }
            genelist=genelist.substring(0,genelist.length()-1);
            genelist+=")";
            result.put("total",celltype.getCellMarkerTotalBar(genelist,id,species,tissue,database2));
            endTime=System.currentTimeMillis(); //获取结束时间
            System.out.println("程序运行时间3： "+(endTime-startTime)+"ns");
        }
        else{
            result.put("total","[]");
        }
        return result;
    }
    @RequestMapping(value = "/celltype_cell_markerDE_bar_all",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerDE_bar_all(@RequestParam("id")String id,
                                                              @RequestParam("name")String name,
                                                              @RequestParam("threshold")String threshold,
                                                              @RequestParam("species")String species,
                                                              @RequestParam("fdr")String fdr){

        HashMap<String,Object> result=new HashMap<>();
        String tissue="All";



        String database="";
        String database2="total_boxplot_count_"+name.split("")[0];


        if(threshold.equals("0.25")){
            if(fdr.equals("0.05")){
                database="A";
            }
            else if(fdr.equals("0.01")){
                database="B";
            }
            else if(fdr.equals("0.001")){
                database="C";
            }
        }
        else if(threshold.equals("0.5")){
            if(fdr.equals("0.05")){
                database="D";
            }
            else if(fdr.equals("0.01")){
                database="E";
            }
            else if(fdr.equals("0.001")){
                database="F";
            }
        }
        else if(threshold.equals("1")){
            if(fdr.equals("0.05")){
                database="G";
            }
            else if(fdr.equals("0.01")){
                database="H";
            }
            else if(fdr.equals("0.001")){
                database="I";
            }
        }
        else if(threshold.equals("1.5")){
            if(fdr.equals("0.05")){
                database="J";
            }
            else if(fdr.equals("0.01")){
                database="K";
            }
            else if(fdr.equals("0.001")){
                database="L";
            }
        }
        else if(threshold.equals("2")){
            if(fdr.equals("0.05")){
                database="M";
            }
            else if(fdr.equals("0.01")){
                database="N";
            }
            else if(fdr.equals("0.001")){
                database="O";
            }
        }

        List<Map> results=celltype.getCellMarkerDEBarAll(name,threshold,species,tissue,fdr,database);



        result.put("result",results);

        if(results.size()>0){
            String[]arr = new String[results.size()];
            Integer n =0;

            for (Map i :results){
                arr[n]=i.get("markers").toString();
                n++;
            }
            List<String> datasetList = Arrays.asList(arr);
            String genelist="(";
            for (String i :datasetList){
                genelist+="\""+i+"\"";
            }
            genelist+=")";
            genelist=genelist.substring(0,genelist.length()-1);
            result.put("total",celltype.getCellMarkerTotalBar(genelist,id,species,tissue,database2));
        }
        else{
            result.put("total","[]");
        }
        return result;
    }
    @RequestMapping(value = "/celltype_cell_markerDE_SS",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> celltype_cell_markerDE_SS(@RequestParam("id")String id,
                                                              @RequestParam("name")String name,
                                                              @RequestParam("species")String species
                                                              ){

        HashMap<String,Object> hashMap=new HashMap<>();
        String tissue="All";
        List<Map> datasets=celltype.getCellMarkerDEList(id,species,tissue);
        List<String> datasetList = new ArrayList<>();
        String[] arr = new String[datasets.size()];
        Integer n =0;
        for (Map i :datasets){
            arr[n]=i.get("Gene_ENTREZID2").toString();
            n++;
        }
        datasetList = Arrays.asList(arr);

        String database2="total_cell_specificities_short_"+name.split("")[0];

        if(datasetList.size()>0){
            List<Map> score =new ArrayList<>();

            score =celltype.getCellSEScore(datasetList,id,species,tissue,database2);

            hashMap.put("score",score);
        }
        else{
            hashMap.put("score","[]");
        }
        return hashMap;
    }
    @RequestMapping(value = "/celltype_composition_tissue",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> celltype_composition_tissue(@RequestParam("id")String id){

        return celltype.getCellCompositionInTissue(id);
    }

    @RequestMapping(value = "/surface_marker",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> surface_marker(@RequestParam("id")String id){

        return celltype.getSurfaceMarker(id);
    }

    @RequestMapping(value = "/summary_filter",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> summary_filter(@RequestParam("species")String species,
                                    @RequestParam("cell")String cell,
                                    @RequestParam("fc")double fc,
                                    @RequestParam("ss")double ss,
                                    @RequestParam("dr")double dr,
                                    @RequestParam("tc")Integer tc,
                                    @RequestParam("pc")Integer pc){
        List<Map> results=celltype.getSummaryFilter(species,cell,fc,ss,tc,pc,dr);

        return results;

    }
    @RequestMapping(value = "/tissue_distribution",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_distribution(@RequestParam("id")String id){
        List<Map> results=celltype.getTissueDistribution(id);

        return results;

    }
    @RequestMapping(value = "/conserved_pub",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> conserved_pub(
            @RequestParam("species")String species,
            @RequestParam("tissue")String tissue,
            @RequestParam("marker")String marker,
            @RequestParam("cellid")String cellid
            ){
        List<Map> results=celltype.getConservedPub(species,tissue,marker,cellid);

        return results;

    }

    @RequestMapping(value = "/cell_statistic",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> cell_statistic(
            @RequestParam("type")String type,
            @RequestParam("cellid")String cellid
    ){
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
        else if(type.equals("marker")){
            item="Cell_Marker,Gene_ENTREZID,Gene_ENTREZID2";
        }
        else{
            item="a.PMID,title,journalvolume";
        }
        List<Map> results=celltype.getCellStatistic(item,cellid);

        return results;

    }



}
