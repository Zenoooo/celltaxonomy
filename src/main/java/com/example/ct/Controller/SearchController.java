package com.example.ct.Controller;

import com.example.ct.Mapper.SearchMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class SearchController {
    @Autowired
    SearchMapper searchMapper;

    @RequestMapping(value = "/home_search",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String,Object> home_search(@RequestParam(required = false,value = "query") String query){
        HashMap<String,Object> hashMap=new HashMap<>();

        List<Map> cell=searchMapper.getHomeSearchCell(query);
        List<Map> marker=searchMapper.getHomeSearchMarker(query);
        List<Map> tissue=searchMapper.getHomeSearchTissue(query);
        List<Map> species=searchMapper.getHomeSearchSpecies(query);
        List<Map> condition=searchMapper.getHomeSearchCondition(query);


        hashMap.put("cell",cell);
        hashMap.put("marker",marker);
        hashMap.put("tissue",tissue);
        hashMap.put("species",species);
        hashMap.put("condition",condition);
        return hashMap;
    }


    @RequestMapping(value = "/searchresults",method = RequestMethod.GET)
    public String search(){
        return "SearchResults";
    }




    @RequestMapping(value = "/filter",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> FilterResults(@RequestParam(value = "query")String query,
                                   @RequestParam(value = "tissues")String tissues,
                                   @RequestParam(value = "cell_types")String cell_types,
                                   @RequestParam(value = "species")String species){
        query="\""+query+"\"";

        tissues=tissues.replace("[","(");
        tissues=tissues.replace("]",")");

        cell_types=cell_types.replace("[","(");
        cell_types=cell_types.replace("]",")");

        species=species.replace("[","(");
        species=species.replace("]",")");
        List<Map> filterresults = searchMapper.getFilterData(query,tissues,cell_types,species);


        return filterresults;
    }
    @RequestMapping(value = "/querybox",method = RequestMethod.POST)
    @ResponseBody
    public String Querybox(@RequestParam("query")String query){

        return query;
    }
    @RequestMapping(value = "/tissue_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> tissue_list(@RequestParam(value = "term",defaultValue = "null",required = false)String term,
                                 @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                 @RequestParam(value = "query",defaultValue = "null",required = false)String query,
                                 @RequestParam(value = "speciess",required = false) String speciess,
                                 @RequestParam(required = false,value = "tissue") String tissue,
                                 @RequestParam(required = false,value = "disease") String disease,
                                 @RequestParam(required = false,value = "gene") String gene,
                                 @RequestParam(required = false,value = "celltype") String celltype,
                                 @RequestParam(required = false,value = "diseasename") String diseasename,
                                 @RequestParam(required = false,value = "genename") String genename,
                                 @RequestParam(required = false,value = "celltypename") String celltypename,
                                 @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){

        query=query.replace("+"," ");
        List<String> tissues=new ArrayList<>();
        tissues.add("Tissue_Standard");
        tissues.add("Tissue_UberonOntology_ID");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");
        databases.add("ct.condition_page");

        List<String> speciesList = new ArrayList<>();
        if (speciess != null && !speciess.equals("null") && speciess.length()>0){
            String[] arr = speciess.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        List<String> diseaseList = new ArrayList<>();

        if(diseasename!=null && !diseasename.equals("null") && diseasename.length()>0){
            String[] arr = diseasename.replace("[", "").replace("]","").split(",");
            diseaseList = Arrays.asList(arr);
        }
        List<String> geneList = new ArrayList<>();

        if(genename!=null && !genename.equals("null") && genename.length()>0){
            String[] arr = genename.replace("[", "").replace("]","").split(",");
            geneList = Arrays.asList(arr);
        }
        List<String> celltypeList = new ArrayList<>();

        if(celltypename!=null && !celltypename.equals("null") && celltypename.length()>0){
            String[] arr = celltypename.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }

        if(!tissues.contains(title) || !databases.contains(database) ){
            return null;
        }
        else{
            return searchMapper.getTissueList(disease, gene, celltype,speciesList,diseaseList,geneList,celltypeList,term,title,query,database);
        }
    }
    @RequestMapping(value = "/gene_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> gene_list(@RequestParam(value = "term",defaultValue = "null",required = false)String term,
                               @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                               @RequestParam(value = "query",defaultValue = "null",required = false)String query,
                               @RequestParam(value = "speciess",required = false) String speciess,
                               @RequestParam(required = false,value = "tissuename") String tissuename,
                               @RequestParam(required = false,value = "diseasename") String diseasename,
                               @RequestParam(required = false,value = "tissue") String tissue,
                               @RequestParam(required = false,value = "disease") String disease,
                               @RequestParam(required = false,value = "gene") String gene,
                               @RequestParam(required = false,value = "celltype") String celltype,
                               @RequestParam(required = false,value = "celltypename") String celltypename,
                               @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){
        query=query.replace("+"," ");

        List<String> genes=new ArrayList<>();
        genes.add("Cell_Marker");
        genes.add("Gene_ENTREZID");
        genes.add("Gene_Alias");
        genes.add("Gene_Ensembl_ID");
        genes.add("Uniprot");
        genes.add("PFAM");
        genes.add("GO2");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        List<String> speciesList = new ArrayList<>();
        if (speciess != null && !speciess.equals("")){
            String[] arr = speciess.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        List<String> tissueList = new ArrayList<>();
        if(tissuename!=null && !tissuename.equals("")){
            String[] arr = tissuename.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);

        }
        List<String> diseaseList = new ArrayList<>();

        if(diseasename!=null && !diseasename.equals("")){
            String[] arr = diseasename.replace("[", "").replace("]","").split(",");
            diseaseList = Arrays.asList(arr);
        }

        List<String> celltypeList = new ArrayList<>();

        if(celltypename!=null && !celltypename.equals("")){
            String[] arr = celltypename.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }

        if(!genes.contains(title) || !databases.contains(database)){
            return null;
        }
        else{
            return searchMapper.getGeneList(tissue, disease,celltype,speciesList,tissueList,diseaseList,celltypeList,term,title,query,database);
        }
    }
    @RequestMapping(value = "/disease_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> disease_list(@RequestParam(value = "term",defaultValue = "null",required = false)String term,
                                  @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                  @RequestParam(value = "query",defaultValue = "null",required = false)String query,
                                  @RequestParam(value = "speciess",required = false) String speciess,
                                  @RequestParam(required = false,value = "tissuename") String tissuename,
                                  @RequestParam(required = false,value = "tissue") String tissue,
                                  @RequestParam(required = false,value = "disease") String disease,
                                  @RequestParam(required = false,value = "gene") String gene,
                                  @RequestParam(required = false,value = "celltype") String celltype,
                                  @RequestParam(required = false,value = "genename") String genename,
                                  @RequestParam(required = false,value = "celltypename") String celltypename,
                                  @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){
        query=query.replace("+"," ");

        List<String> diseases=new ArrayList<>();
        diseases.add("Disease_Type");
        diseases.add("Disease_Ontology_ID");
        diseases.add("Conditions");

        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");
        databases.add("ct.condition_page");

        List<String> speciesList = new ArrayList<>();
        if (speciess != null && !speciess.equals("null")  && speciess.length()>0){
            String[] arr = speciess.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        List<String> tissueList = new ArrayList<>();
        if(tissuename!=null && !tissuename.equals("null")  && tissuename.length()>0){
            String[] arr = tissuename.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);

        }

        List<String> geneList = new ArrayList<>();

        if(genename!=null && !genename.equals("null") && genename.length()>0 ){
            String[] arr = genename.replace("[", "").replace("]","").split(",");
            geneList = Arrays.asList(arr);
        }
        List<String> celltypeList = new ArrayList<>();

        if(celltypename!=null && !celltypename.equals("null") && celltypename.length()>0){
            String[] arr = celltypename.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }
        if(!diseases.contains(title) || !databases.contains(database)){
            return null;
        }
        else{
            return searchMapper.getDiseaseList(tissue,gene, celltype,speciesList,tissueList,geneList,celltypeList,term,title,query,database);
        }
    }
    @RequestMapping(value = "/species_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> species_list(@RequestParam(value = "term",defaultValue = "null",required = false)String term,
                                  @RequestParam(value = "query",defaultValue = "null",required = false)String query,
                                  @RequestParam(required = false,value = "tissue") String tissue,
                                  @RequestParam(required = false,value = "disease") String disease,
                                  @RequestParam(required = false,value = "gene") String gene,
                                  @RequestParam(required = false,value = "celltype") String celltype,
                                  @RequestParam(required = false,value = "tissuename") String tissuename,
                                  @RequestParam(required = false,value = "diseasename") String diseasename,
                                  @RequestParam(required = false,value = "genename") String genename,
                                  @RequestParam(required = false,value = "celltypename") String celltypename,
                                  @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){
        query=query.replace("+"," ");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        List<String> tissueList = new ArrayList<>();
        if(tissuename!=null && !tissuename.equals("null") && tissuename.length()>0){
            String[] arr = tissuename.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);

        }
        List<String> diseaseList = new ArrayList<>();

        if(diseasename!=null && !diseasename.equals("null") && diseasename.length()>0){
            String[] arr = diseasename.replace("[", "").replace("]","").split(",");
            diseaseList = Arrays.asList(arr);
        }
        List<String> geneList = new ArrayList<>();

        if(genename!=null && !genename.equals("null") && genename.length()>0){
            String[] arr = genename.replace("[", "").replace("]","").split(",");
            geneList = Arrays.asList(arr);
        }
        List<String> celltypeList = new ArrayList<>();

        if(celltypename!=null && !celltypename.equals("null") && celltypename.length()>0){
            String[] arr = celltypename.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }
        if(!databases.contains(database)){
            return null;
        }
        else{
            return searchMapper.getSpeciesList(tissue, disease, gene, celltype,tissueList,diseaseList,geneList,celltypeList,term,query,database);
        }
    }
    @RequestMapping(value = "/enriched_marker",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> enriched_marker(@RequestParam(value = "term",defaultValue = "null",required = false)String term,
                                     @RequestParam(value = "query",defaultValue = "null",required = false)String query,
                                     @RequestParam(value = "speciess",required = false) String speciess,
                                     @RequestParam(required = false,value = "tissue") String tissue,
                                     @RequestParam(required = false,value = "disease") String disease,
                                     @RequestParam(required = false,value = "gene") String gene,
                                     @RequestParam(required = false,value = "celltype") String celltype,
                                     @RequestParam(required = false,value = "tissuename") String tissuename,
                                     @RequestParam(required = false,value = "diseasename") String diseasename,
                                     @RequestParam(required = false,value = "genename") String genename,
                                     @RequestParam(required = false,value = "celltypename") String celltypename,
                                     @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){
        query=query.replace("+"," ");

        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");

        List<String> tissueList = new ArrayList<>();
        if(tissuename!=null && !tissuename.equals("null")){
            String[] arr = tissuename.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);

        }
        List<String> diseaseList = new ArrayList<>();

        if(diseasename!=null && !diseasename.equals("null")){
            String[] arr = diseasename.replace("[", "").replace("]","").split(",");
            diseaseList = Arrays.asList(arr);
        }
        List<String> geneList = new ArrayList<>();

        if(genename!=null && !genename.equals("null")){
            String[] arr = genename.replace("[", "").replace("]","").split(",");
            geneList = Arrays.asList(arr);
        }
        List<String> celltypeList = new ArrayList<>();

        if(celltypename!=null && !celltypename.equals("null")){
            String[] arr = celltypename.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }

        List<String> speciesList = new ArrayList<>();
        if (speciess != null && !speciess.equals("null")){
            String[] arr = speciess.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        if(!databases.contains(database)){
            return null;
        }
        else{
            return searchMapper.getEnrichedMarker(tissue, disease, gene, celltype,speciesList,tissueList,diseaseList,geneList,celltypeList,term,query,database);
        }
    }
    @RequestMapping(value = "/celltype_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> celltype_list(@RequestParam(value = "term",defaultValue = "null",required = false)String term,
                                   @RequestParam(value = "title",defaultValue = "null",required = false)String title,
                                   @RequestParam(value = "query",defaultValue = "null",required = false)String query,
                                   @RequestParam(value = "speciess",required = false) String speciess,
                                   @RequestParam(required = false,value = "tissuename") String tissuename,
                                   @RequestParam(required = false,value = "diseasename") String diseasename,
                                   @RequestParam(required = false,value = "genename") String genename,
                                   @RequestParam(required = false,value = "tissue") String tissue,
                                   @RequestParam(required = false,value = "disease") String disease,
                                   @RequestParam(required = false,value = "gene") String gene,
                                   @RequestParam(required = false,value = "celltype") String celltype,
                                   @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database){

        query=query.replace("+"," ");

        List<String> celltypes=new ArrayList<>();
        celltypes.add("Cell_standard");
        celltypes.add("Cell_Standard");

        celltypes.add("Specific_Cell_Ontology_ID");
        celltypes.add("Is_New_Cell_Type");
        celltypes.add("CT_ID");
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Cell_Marker=b.Cell_Marker");
        databases.add("ct.all_search_table");
        databases.add("ct.condition_page");


        List<String> speciesList = new ArrayList<>();
        if (speciess != null && !speciess.equals("null") && speciess.length()>0){
            String[] arr = speciess.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        List<String> tissueList = new ArrayList<>();
        if(tissuename!=null && !tissuename.equals("null") && tissuename.length()>0){
            String[] arr = tissuename.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);

        }
        List<String> diseaseList = new ArrayList<>();

        if(diseasename!=null && !diseasename.equals("null") && diseasename.length()>0){
            String[] arr = diseasename.replace("[", "").replace("]","").split(",");
            diseaseList = Arrays.asList(arr);
        }
        List<String> geneList = new ArrayList<>();

        if(genename!=null && !genename.equals("null") && genename.length()>0){
            String[] arr = genename.replace("[", "").replace("]","").split(",");
            geneList = Arrays.asList(arr);
        }


        if(!celltypes.contains(title)){
            return null;
        }
        else{
            return searchMapper.getCelltypeList(tissue, disease, gene,speciesList,tissueList,diseaseList,geneList,term,title,query,database);
        }
    }


    @RequestMapping(value = "/search_table",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> search_table(@RequestParam(required = false,value = "start") Integer start,
                                                @RequestParam(required = false,value = "length") Integer length,
                                                @RequestParam(required = false,value = "draw") Integer draw){
        Integer pagenum=(start/length)+1;

        PageHelper.startPage(pagenum,length);
        List<Map> results=searchMapper.getSearchTable();
        PageInfo<Map> pageInfo=new PageInfo<>(results);
        HashMap<String,Object> hashMap=new HashMap<>();
        hashMap.put("draw",draw);

        hashMap.put("data",results);
        hashMap.put("recordsTotal",pageInfo.getTotal());
        hashMap.put("recordsFiltered",pageInfo.getTotal());

        return hashMap;
    }

    @RequestMapping(value = "/search_table_update",method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> search_table_update(
            @RequestParam(required = false,value = "confidence") String confidence,
            @RequestParam(required = false,value = "source") String source,
            @RequestParam(required = false,value = "search[value]",defaultValue = "") String search,
            @RequestParam(required = false,value = "draw") Integer draw,
            @RequestParam(required = false,value = "start") Integer start,
            @RequestParam(required = false,value = "length") Integer length,
            @RequestParam(required = false,value = "speciess") String speciess,
            @RequestParam(required = false,value = "tissuename") String tissuename,
            @RequestParam(required = false,value = "diseasename") String diseasename,
            @RequestParam(required = false,value = "genename") String genename,
            @RequestParam(required = false,value = "celltypename") String celltypename,
            @RequestParam(required = false,value = "othername") String othername,
            @RequestParam(required = false,value = "enriched") String enriched,
            @RequestParam(required = false,value = "species") String species,
            @RequestParam(required = false,value = "tissue") String tissue,
            @RequestParam(required = false,value = "disease") String disease,
            @RequestParam(required = false,value = "gene") String gene,
            @RequestParam(required = false,value = "celltype") String celltype,
            @RequestParam(required = false,value = "other") String other,
            @RequestParam(required = false,value = "query") String query,
            @RequestParam(value = "database",defaultValue = "ct.all_search_table",required = false)String database,
            @RequestParam(value = "order[0][column]")Integer order,
            @RequestParam(value = "order[0][dir]")String orderDir,
            @RequestParam(value = "from")String from
    ){
        if(!orderDir.equals("desc") && !orderDir.equals("asc")){
            return null;
        }

        List<String> ordertitle=new ArrayList<>();
        if(from.equals("marker")){
            if(database.equals("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Gene_ENTREZID2=b.Gene_ENTREZID2")){
                ordertitle.add("a.Cell_Marker");
                ordertitle.add("a.Gene_ENTREZID");

            }
            else{
                ordertitle.add("Cell_Marker");
                ordertitle.add("Gene_ENTREZID");

            }
            ordertitle.add("cell_num");
            ordertitle.add("Tissue_num");
            ordertitle.add("Disease_num");
            ordertitle.add("PMID_num");
            ordertitle.add("resource_num");
            ordertitle.add("HomoloGene_num");

        }
        else if(from.equals("search")){
            ordertitle.add("Species");
            ordertitle.add("CT_ID");
//            ordertitle.add("Gene_Alias");
//            ordertitle.add("Gene_Ensembl_ID");
//            ordertitle.add("Uniprot");
//            ordertitle.add("PFAM");
//            ordertitle.add("GO2");
//            ordertitle.add("Gene_ENTREZID");
            ordertitle.add("Cell_standard");
            ordertitle.add("Tissue_standard");
            ordertitle.add("Cell_Marker");
            ordertitle.add("Disease_Type");
            ordertitle.add("PMID");
        }
        else if(from.equals("searchresults")){
            ordertitle.add("Cell_standard");
            ordertitle.add("Species");
            ordertitle.add("Cell_Marker");
            ordertitle.add("Gene_ENTREZID");
            ordertitle.add("Tissue_standard");
            ordertitle.add("Disease_Type");
            ordertitle.add("Gene_ENTREZID2");
            ordertitle.add("Tissue_UberonOntology_ID");

        }
        if(query!=null){
            query=query.replace("+"," ");
        }

        List<String> speciesList = new ArrayList<>();

        if (speciess != null && !speciess.equals("[]") && speciess.length()>0){
            String[] arr = speciess.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        List<String> enrichedList = new ArrayList<>();

        if (enriched != null && !enriched.equals("[]") && enriched.length()>0){
            String[] arr = enriched.replace("[", "").replace("]","").split(",");
            enrichedList = Arrays.asList(arr);
        }

        List<String> tissueList = new ArrayList<>();
        if(tissuename!=null && !tissuename.equals("[]") && tissuename.length()>0){
            String[] arr = tissuename.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);

        }
        List<String> diseaseList = new ArrayList<>();

        if(diseasename!=null && !diseasename.equals("[]") && diseasename.length()>0){
            String[] arr = diseasename.replace("[", "").replace("]","").split(",");
            diseaseList = Arrays.asList(arr);
        }
        List<String> geneList = new ArrayList<>();

        if(genename!=null && !genename.equals("[]") && genename.length()>0){
            String[] arr = genename.replace("[", "").replace("]","").split(",");
            geneList = Arrays.asList(arr);
        }
        List<String> celltypeList = new ArrayList<>();

        if(celltypename!=null && !celltypename.equals("[]") && celltypename.length()>0){
            String[] arr = celltypename.replace("[", "").replace("]","").split(",");
            celltypeList = Arrays.asList(arr);
        }
        List<String> otherList = new ArrayList<>();

        if(othername!=null && !othername.equals("[]") && othername.length()>0){
            String[] arr = othername.replace("[", "").replace("]","").split(",");
            otherList = Arrays.asList(arr);
        }
        List<String> confidenceList = new ArrayList<>();

        if(confidence!=null && !confidence.equals("[]")){
            String[] arr = confidence.replace("[", "").replace("]","").split(",");
            confidenceList = Arrays.asList(arr);
        }
        List<String> sourceList = new ArrayList<>();

        if(source!=null && !source.equals("[]")){
            String[] arr = source.replace("[", "").replace("]","").split(",");
            sourceList = Arrays.asList(arr);
        }

        List<String> tissues=new ArrayList<>();
        tissues.add("Tissue_Standard");
        tissues.add("Tissue_UberonOntology_ID");
        if(!tissues.contains(tissue)){
            tissue=null;
        }

        List<String> diseases=new ArrayList<>();
        diseases.add("Disease_Type");
        diseases.add("Disease_Ontology_ID");
        if(!diseases.contains(disease)){
            disease=null;
        }

        List<String> genes=new ArrayList<>();
        genes.add("Cell_Marker");
        genes.add("Gene_ENTREZID");
        genes.add("Gene_Alias");
        genes.add("Gene_Ensembl_ID");
        genes.add("Uniprot");
        genes.add("PFAM");
        genes.add("GO2");
        if(!genes.contains(gene)){
            gene=null;
        }

        List<String> celltypes=new ArrayList<>();
        celltypes.add("Cell_Standard");
        celltypes.add("Specific_Cell_Ontology_ID");
        celltypes.add("CT_ID");
        if(!celltypes.contains(celltype)){
            celltype=null;
        }
        List<String> others=new ArrayList<>();
        others.add("PMID");
        others.add("Marker_Resource2");
        others.add("Additional_Information2");
        if(!others.contains(other)){
            other=null;
        }
        List<String> databases=new ArrayList<>();
        databases.add("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Gene_ENTREZID2=b.Gene_ENTREZID2");
        databases.add("ct.all_search_table");
        if(!databases.contains(database)){
            return null;
        }
        String title="*";
        if(database.equals("ct.marker_browse_statistics as a inner join ct.all_search_table as b on a.Gene_ENTREZID2=b.Gene_ENTREZID2")){
            title="Distinct a.Cell_Marker,a.Gene_ENTREZID,a.Gene_ENTREZID2,cell_num,Tissue_num,Disease_num,PMID_num,resource_num,HomoloGene_num";
        };

        Integer pagenum=(start/length)+1;

        PageHelper.startPage(pagenum,length);

        List<Map> results= searchMapper.updateSearchTable(enrichedList,ordertitle.get(order),orderDir,confidenceList,sourceList,search,speciesList, tissueList, diseaseList, geneList, celltypeList, otherList, species, tissue, disease, gene, celltype, other, query, database, title);
        PageInfo<Map> pageInfo=new PageInfo<>(results);

        HashMap<String,Object> hashMap=new HashMap<>();
        hashMap.put("draw",draw);

        hashMap.put("data",results);
        hashMap.put("recordsTotal",pageInfo.getTotal());
        hashMap.put("recordsFiltered",pageInfo.getTotal());
        return hashMap;
    }


}
