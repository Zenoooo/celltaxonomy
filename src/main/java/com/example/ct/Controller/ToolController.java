package com.example.ct.Controller;

import com.example.ct.Mapper.CelltypeMapper;
import com.example.ct.Mapper.MarkerMapper;
import com.example.ct.Mapper.ToolMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

@Controller
public class ToolController {
    @Autowired
    ToolMapper toolMapper;
    @Autowired
    MarkerMapper markerMapper;
    @Autowired
    CelltypeMapper celltypeMapper;


    @RequestMapping(value = "/tool/tissue_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_list(@RequestParam(value = "term",required = false)String term,
                                 @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                 @RequestParam(value = "species",required = false)String species,
                                 @RequestParam(value = "condition",required = false)String condition,
                                 @RequestParam(value = "cellA",required = false)String cellA,
                                 @RequestParam(value = "cellB",required = false)String cellB,
                                 @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){
        List<String> tissues=new ArrayList<>();
        tissues.add("Tissue_Standard");
        tissues.add("Tissue_UberonOntology_ID");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        if(!tissues.contains(title) || !databases.contains(database) ){
            return null;
        }
        else{
            List<Map> tissueA=toolMapper.getTissueList(term,title,species,condition,database,cellA,null);
            List<Map> tissueB=toolMapper.getTissueList(term,title,species,condition,database,null,cellB);
            tissueA.retainAll(tissueB);
            return tissueA;
        }
    }

    @RequestMapping(value = "/tool/disease_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> disease_list(@RequestParam(value = "term",required = false)String term,
                                  @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                  @RequestParam(value = "species",required = false)String species,
                                  @RequestParam(value = "tissue",required = false)String tissue,
                                  @RequestParam(value = "cellA",required = false)String cellA,
                                  @RequestParam(value = "cellB",required = false)String cellB,
                                  @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){

        List<String> diseases=new ArrayList<>();
        diseases.add("Disease_Type");
        diseases.add("Disease_Ontology_ID");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        if(!diseases.contains(title) || !databases.contains(database)){
            return null;
        }
        else{
            List<Map> conditionA=toolMapper.getDiseaseList(term,title,species,tissue,database,cellA,null);
            List<Map> conditionB=toolMapper.getDiseaseList(term,title,species,tissue,database,null,cellB);
            conditionA.retainAll(conditionB);
            return conditionA;
        }
    }
    @RequestMapping(value = "/tool/species_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> species_list(@RequestParam(value = "term",required = false)String term,
                                  @RequestParam(value = "cellA",required = false)String cellA,
                                  @RequestParam(value = "cellB",required = false)String cellB,
                                  @RequestParam(value = "tissue",required = false)String tissue,
                                  @RequestParam(value = "condition",required = false)String condition,
                                  @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){

        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");
        if(!databases.contains(database)){
            return null;
        }
        else{
            List<Map> speciesA=toolMapper.getSpeciesList(term,database,tissue,condition,cellA,null);
            List<Map> speciesB=toolMapper.getSpeciesList(term,database,tissue,condition,null,cellB);
            speciesA.retainAll(speciesB);
            return speciesA;
        }
    }
    @RequestMapping(value = "/tool/celltype_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> celltype_list(@RequestParam(value = "term",required = false)String term,
                                   @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                   @RequestParam(value = "species",required = false)String species,
                                   @RequestParam(value = "tissue",required = false)String tissue,
                                   @RequestParam(value = "condition",required = false)String condition){

        return toolMapper.getCelltypeList(term,title,species,tissue,condition);

    }

    @RequestMapping(value = "/tool/tissue_list2",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_list2(@RequestParam(value = "term",required = false)String term,
                                 @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                 @RequestParam(value = "species",required = false)String species,
                                 @RequestParam(value = "condition",required = false)String condition,
                                 @RequestParam(value = "cell",required = false)String cell,
                                 @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){
        List<String> tissues=new ArrayList<>();
        tissues.add("Tissue_Standard");
        tissues.add("Tissue_UberonOntology_ID2");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        if(!tissues.contains(title) || !databases.contains(database) ){
            return null;
        }
        else{
            List<Map> tissueA=toolMapper.getTissueList2(term,title,species,condition,database,cell);
            List<Map> tissueB=toolMapper.getTissueList2(term,title,species,condition,database,cell);
            tissueA.retainAll(tissueB);
            return tissueA;
        }
    }

    @RequestMapping(value = "/tool/disease_list2",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> disease_list2(@RequestParam(value = "term",required = false)String term,
                                  @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                  @RequestParam(value = "species",required = false)String species,
                                  @RequestParam(value = "cell",required = false)String cell,
                                  @RequestParam(value = "tissueA",required = false)String tissueA,
                                  @RequestParam(value = "tissueB",required = false)String tissueB,
                                  @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){

        List<String> diseases=new ArrayList<>();
        diseases.add("Disease_Type");
        diseases.add("Disease_Ontology_ID");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        if(!diseases.contains(title) || !databases.contains(database)){
            return null;
        }
        else{
            List<Map> conditionA=toolMapper.getDiseaseList2(term,title,species,database,cell,tissueA,null);
            List<Map> conditionB=toolMapper.getDiseaseList2(term,title,species,database,cell,null,tissueB);
            conditionA.retainAll(conditionB);
            return conditionA;
        }
    }
    @RequestMapping(value = "/tool/species_list2",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> species_list2(@RequestParam(value = "term",required = false)String term,
                                  @RequestParam(value = "tissueA",required = false)String tissueA,
                                  @RequestParam(value = "tissueB",required = false)String tissueB,
                                  @RequestParam(value = "cell",required = false)String cell,
                                  @RequestParam(value = "condition",required = false)String condition,
                                  @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){

        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");
        if(!databases.contains(database)){
            return null;
        }
        else{
            List<Map> speciesA=toolMapper.getSpeciesList2(term,database,condition,cell,tissueA,null);
            List<Map> speciesB=toolMapper.getSpeciesList2(term,database,condition,cell,null,tissueB);
            speciesA.retainAll(speciesB);
            return speciesA;
        }
    }
    @RequestMapping(value = "/tool/celltype_list2",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> celltype_list2(@RequestParam(value = "term",required = false)String term,
                                   @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                   @RequestParam(value = "species",required = false)String species,
                                    @RequestParam(value = "tissueA",required = false)String tissueA,
                                    @RequestParam(value = "tissueB",required = false)String tissueB,
                                   @RequestParam(value = "condition",required = false)String condition){

        return toolMapper.getCelltypeList2(term,title,species,condition,tissueA,tissueB);

    }



    @RequestMapping(value = "/tool/compare",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> compare(@RequestParam("cellA")String cellA,
                                          @RequestParam("cellB")String cellB,
                                          @RequestParam(value = "species",required = false)String species,
                                          @RequestParam(value = "tissue",required = false)String tissue,
                                          @RequestParam(value = "condition",required = false)String condition){
        HashMap<String,Object> hashMap=new HashMap<>();



        hashMap.put("cellA",toolMapper.getCompare(cellA,null,species,tissue,condition));
        hashMap.put("cellB",toolMapper.getCompare(null,cellB,species,tissue,condition));

        hashMap.put("common",toolMapper.getCompare(cellA,cellB,species,tissue,condition));

        return hashMap;
    }

    @RequestMapping(value = "/tool/compare2",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> compare2(@RequestParam("tissueA")String tissueA,
                                          @RequestParam("tissueB")String tissueB,
                                          @RequestParam(value = "species",required = false)String species,
                                          @RequestParam(value = "cell",required = false)String cell,
                                          @RequestParam(value = "condition",required = false)String condition){
        HashMap<String,Object> hashMap=new HashMap<>();



        hashMap.put("tissueA",toolMapper.getCompare2(tissueA,null,species,cell,condition));
        hashMap.put("tissueB",toolMapper.getCompare2(null,tissueB,species,cell,condition));

        hashMap.put("common",toolMapper.getCompare2(tissueA,tissueB,species,cell,condition));
        return hashMap;
    }


    @RequestMapping(value = "/tool/cellsearch_file",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> cellsearch_file(@RequestParam("file") MultipartFile multipartFile,
                                                  @RequestParam(value = "species",required = false) String species
                                                  ) throws IOException {
        File file = null;

        file=File.createTempFile("temp",".txt");
        String path=file.getAbsolutePath();
        multipartFile.transferTo(file);

        BufferedReader in = new BufferedReader(new FileReader(path));
        String str;
        List<String> genelists = new ArrayList<>();
        while ((str = in.readLine()) != null) {
            genelists.add(str.replace("\n","").replace("\r",""));
        }

        HashMap<String,Object> hashMap=new HashMap<>();
        HashMap<String,Object> hashMap2=new HashMap<>();

        List<String> genelists2=new ArrayList<>();
        for(String v : genelists){
            if(v.length()>0){
                System.out.println(species);

                List<Map> temp=toolMapper.getMarkerByName(species,v);

                if(temp.size()>0){

                    String id=temp.get(0).get("ENTREZID").toString().replace("\r","");
                    genelists2.add(id);

                    hashMap2.put(v,temp.get(0).get("ENTREZID"));
                }
            }
        }

        if(genelists2.size()>0){
            List<Map> results=toolMapper.getCellSearch(genelists2,species);

            hashMap.put("results",results);
            List<Map> cellmarker=new ArrayList<>();
            for (Integer i=0;i<results.size();i++){
                cellmarker=toolMapper.getMarkerByCT(results.get(i).get("CT_ID").toString(),species);
                List<String> markers=new ArrayList<>(Arrays.asList(cellmarker.get(0).get("Markers").toString().split(","))) ;
                List<String> markers2=new ArrayList<>(Arrays.asList(cellmarker.get(0).get("Markers").toString().split(","))) ;

                markers.removeAll(genelists);
                markers.addAll(genelists);

                markers2.retainAll(genelists);

                results.get(i).put("MarkerNumber",cellmarker.get(0).get("MarkerNumber"));
                results.get(i).put("TotalNumber",markers.size());
                results.get(i).put("IntersectNumber",markers2.size());

            }

            hashMap.put("listlength",genelists.size());
            hashMap.put("marker",hashMap2);
            hashMap.put("cellmarker",cellmarker);
            return hashMap;
        }
        else{
            return hashMap;
        }

    }
    @RequestMapping(value = "/tool/cellsearch_list",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> cellsearch_list(@RequestParam("list") String genelist,
                                                  @RequestParam(value = "species",required = false) String species){
        String[] list=genelist.split("\n");
        List<String> genelists;
        genelists = new ArrayList<>(Arrays.asList(list)) ;

        HashMap<String,Object> hashMap=new HashMap<>();
        HashMap<String,Object> hashMap2=new HashMap<>();
        List<String> genelists2=new ArrayList<>();
        for(String v : genelists){
            if(v.length()>0){
                List<Map> temp=toolMapper.getMarkerByName(species,v);

                if(temp.size()>0){

                    String id=temp.get(0).get("ENTREZID").toString().replace("\r","");
                    genelists2.add(id);

                    hashMap2.put(v,temp.get(0).get("ENTREZID"));
                }
            }

        }
        if(genelists2.size()>0){
            List<Map> results=toolMapper.getCellSearch(genelists2,species);
            hashMap.put("results",results);
            List<Map> cellmarker=new ArrayList<>();
            for (Integer i=0;i<results.size();i++){
                cellmarker=toolMapper.getMarkerByCT(results.get(i).get("CT_ID").toString(),species);
                List<String> markers=new ArrayList<>(Arrays.asList(cellmarker.get(0).get("Markers").toString().split(","))) ;
                List<String> markers2=new ArrayList<>(Arrays.asList(cellmarker.get(0).get("Markers").toString().split(","))) ;

                markers.removeAll(genelists2);
                markers.addAll(genelists2);

                markers2.retainAll(genelists2);


                results.get(i).put("MarkerNumber",cellmarker.get(0).get("MarkerNumber"));
                results.get(i).put("TotalNumber",markers.size());
                results.get(i).put("IntersectNumber",markers2.size());
                results.get(i).put("Total",markers);
                results.get(i).put("Intersect",markers2);

            }

            hashMap.put("listlength",genelists.size());
            hashMap.put("marker",hashMap2);
            hashMap.put("cellmarker",cellmarker);

            return hashMap;
        }
        else{
            return hashMap;
        }

    }

    @RequestMapping(value = "/tool/exp_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> exp_list(@RequestParam(value = "term",required = false)String term,
                              @RequestParam(value = "title")String title,
                              @RequestParam(value="species",required = false)String species,
                              @RequestParam(value="tissue",required = false)String tissue,
                              @RequestParam(value="celltype",required = false)String celltype
                              ){
        return toolMapper.getExpList(term,title,species,tissue,celltype);

    }
    @RequestMapping(value = "/tool/exp_celltype_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> exp_celltype_list(@RequestParam(value = "term",required = false)String term,
                                       @RequestParam(value="species",required = false)String species,
                                       @RequestParam(value="tissue",required = false)String tissue,
                                       @RequestParam(value="celltype",required = false)String celltype){


        return toolMapper.getExpCelltypeList(term,species,tissue,celltype);

    }

    @RequestMapping(value = "/tool/exp_marker_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> exp_marker_list(@RequestParam(value = "term",required = false)String term,
                                       @RequestParam(value="species",required = false)String species,
                                       @RequestParam(value="celltype",required = false)String celltype){
        System.out.println(celltype);
        return toolMapper.getDatasetList2(species,celltype,term);

    }
//    @RequestMapping(value = "/tool/exp_marker_list",method = RequestMethod.POST)
//    @ResponseBody
//    public List<Map> exp_marker_list(@RequestParam(value = "term",required = false)String term){
//
//        return toolMapper.getCellMarkerList(species,id,term);
//
//    }
    @RequestMapping(value = "/tool/tool_expression",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> tool_expression(@RequestParam(value = "species")String species,
                                                   @RequestParam(value = "tissue",required = false)String tissue,
                                                   @RequestParam(value = "celltype")String celltype,
                                                   @RequestParam(value = "marker")String marker,
                                                   @RequestParam(value="expression")boolean expression,
                                                   @RequestParam(value="dataset",required = false)String dataset){
        HashMap<String,Object> results=new HashMap<>();

        if(expression==true){
            String database="total_boxplot_long";

            List<Map> result=toolMapper.getExpression(dataset,marker,database);
            results.put("results",result);

        }
        else{
            long startTime=System.currentTimeMillis();   //获取开始时间

            List<Map> datasets=toolMapper.getDatasetList(species,tissue,celltype,marker);
            long endTime=System.currentTimeMillis(); //获取结束时间
            System.out.println("程序运行时间1： "+(endTime-startTime)+"ns");

            startTime=System.currentTimeMillis();   //获取开始时间

            List<String> datasetList = new ArrayList<>();
            String[] arr = new String[datasets.size()];
            Integer n =0;
            for (Map i :datasets){
                arr[n]=i.get("ID").toString();
                n++;
            }
            datasetList = Arrays.asList(arr);

            endTime=System.currentTimeMillis(); //获取结束时间
            System.out.println("程序运行时间2： "+(endTime-startTime)+"ns");



            startTime=System.currentTimeMillis();   //获取开始时间

            List<Map> table=toolMapper.getDatasets(datasetList,tissue,species,celltype);
            endTime=System.currentTimeMillis(); //获取结束时间
            System.out.println("程序运行时间4： "+(endTime-startTime)+"ns");

            startTime=System.currentTimeMillis();   //获取开始时间
            String database2="total_findmarkers_"+celltype.split("")[0];


            List<Map> plot1=toolMapper.getFCPlot(species,tissue,celltype,marker,database2);
            endTime=System.currentTimeMillis(); //获取结束时间
            System.out.println("程序运行时间5： "+(endTime-startTime)+"ns");

            startTime=System.currentTimeMillis();   //获取开始时间
            String database3="total_cell_specificity_"+celltype.split("")[0];

            List<Map> plot2=toolMapper.getSSPlot(species,tissue,celltype,marker,database3);
            endTime=System.currentTimeMillis(); //获取结束时间
            System.out.println("程序运行时间6： "+(endTime-startTime)+"ns");

            results.put("list",datasetList);
            results.put("plot1",plot1);
            results.put("plot2",plot2);
            results.put("table",table);

        }
        return results;


    }
}
