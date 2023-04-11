package com.example.ct.Controller;

import com.example.ct.Mapper.StudyMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import javafx.scene.control.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import java.util.*;

@Controller
public class StudyController {
    @Autowired
    StudyMapper studyMapper;

    @GetMapping("/study/{pmid}")
    public String Study(@PathVariable("pmid")String pmid, ModelMap model){
        model.put("pmid",pmid);
        List<Map> results=studyMapper.getStudy(pmid);
        String databasename=results.get(0).get("DatabaseName").toString();
        model.put("databasename",databasename);

        return "SingleStudy";
    }

    @PostMapping("/getstudy")
    @ResponseBody
    public List<Map> getstudy(@RequestParam("pmid")String pmid){
        return studyMapper.getStudy(pmid);
    }


    @PostMapping("/study_tissue_list")
    @ResponseBody
    public HashMap study_tissue_list(@RequestParam(value = "celltype",required = false)String celltype,
                                     @RequestParam(value = "journal",required = false)String journal,
                                     @RequestParam(value = "species",required = false)String species,
                                     @RequestParam(value = "term",required = false)String term){
        HashMap<String,Object> results=new HashMap<>();
        List<String> journalList = new ArrayList<>();
        if (journal != null && !journal.equals("null")){
            String[] arr = journal.replace("[", "").replace("]","").split(",");
            journalList = Arrays.asList(arr);
        }
        List<String> speciesList = new ArrayList<>();
        if (species != null && !species.equals("null") && species.length()>0){
            String[] arr = species.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }
        List<String> celllList = new ArrayList<>();
        if (celltype != null && !celltype.equals("null")&&celltype.length()>0){

            String[] arr = celltype.replace("[", "").replace("]","").split(",");
            celllList = Arrays.asList(arr);
        }
        results.put("Tissue",studyMapper.getTissueList(journalList,speciesList,celllList,term));
        return results;
    }


    @PostMapping("/study_journal_list")
    @ResponseBody
    public HashMap study_journal_list(@RequestParam(value = "tissue",required = false)String tissue,
                                      @RequestParam(value = "celltype",required = false)String celltype,
                                      @RequestParam(value = "species",required = false)String species,
                                      @RequestParam(value = "term",required = false)String term){
        HashMap<String,Object> results=new HashMap<>();


        List<String> tissueList = new ArrayList<>();
        if (tissue != null && !tissue.equals("null")){
            String[] arr = tissue.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);
        }



        List<String> speciesList = new ArrayList<>();
        if (species != null && !species.equals("null")){
            String[] arr = species.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }
        List<String> celllList = new ArrayList<>();
        if (celltype != null && !celltype.equals("null")){
            String[] arr = celltype.replace("[", "").replace("]","").split(",");
            celllList = Arrays.asList(arr);
        }
        results.put("Journal",studyMapper.getJournalList(tissueList,speciesList,celllList,term));
        return results;
    }
    @PostMapping("/study_celltype_list")
    @ResponseBody
    public HashMap study_celltype_list(@RequestParam(value = "tissue",required = false)String tissue,
                                       @RequestParam(value = "journal",required = false)String journal,
                                       @RequestParam(value = "species",required = false)String species,
                                       @RequestParam(value = "term",required = false)String term){
        HashMap<String,Object> results=new HashMap<>();


        List<String> tissueList = new ArrayList<>();
        if (tissue != null && tissue.length()>0){
            String[] arr = tissue.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);
        }
        List<String> speciesList = new ArrayList<>();
        if (species != null && species.length()>0){
            String[] arr = species.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }
        List<String> journalList = new ArrayList<>();
        if (journal != null && journal.length()>0){
            String[] arr = journal.replace("[", "").replace("]","").split(",");
            journalList = Arrays.asList(arr);
        }


        results.put("Cell_ID",studyMapper.getCellList(tissueList,journalList,speciesList,term));

        return results;
    }
    @PostMapping("/tissue_list_update")
    @ResponseBody
    public List<Map> tissue_name_update(@RequestParam("index")String index,
                                        @RequestParam("pagenumber")Integer pagenumber){
        Integer start=(pagenumber-1)*30;
        List<Map> results=studyMapper.getTissueName(index,start,30);
        return results;
    }

    @PostMapping("/study_list")
    @ResponseBody
    public List<Map> get_study_list(@RequestParam(value = "query",required = false)String query,
                                    @RequestParam(value = "tissues",required = false)String tissues,
                                    @RequestParam(value = "journal",required = false)String journal,
                                    @RequestParam(value = "species",required = false)String species,
                                    @RequestParam(value = "celltype",required = false)String celltype,
                                    @RequestParam("pagenumber")Integer pagenumber){



        List<String> tissueList = new ArrayList<>();
        if (tissues != null && !tissues.equals("null") && tissues.length()>0){
            String[] arr = tissues.replace("[", "").replace("]","").split(",");
            tissueList = Arrays.asList(arr);
        }
        List<String> journalList = new ArrayList<>();
        if (journal != null && !journal.equals("null") && journal.length()>0){
            String[] arr = journal.replace("[", "").replace("]","").split(",");
            journalList = Arrays.asList(arr);
        }

        List<String> speciesList = new ArrayList<>();
        if (species != null && !species.equals("null") && species.length()>0 && !species.equals("[]")){

            String[] arr = species.replace("[", "").replace("]","").split(",");
            speciesList = Arrays.asList(arr);
        }

        List<String> celllList = new ArrayList<>();
        if (celltype != null && !celltype.equals("null") && celltype.length()>0){
            String[] arr = celltype.replace("[", "").replace("]","").split(",");
            celllList = Arrays.asList(arr);
        }
        List<Map> filterresults = studyMapper.getStudies(pagenumber*10,query,tissueList,journalList,speciesList,celllList);

//        List<Map> filterPMID = studyMapper.getFilterStudiesPMID(pagenumber*10,query,tissueList,journalList,speciesList,celllList);
//        for (Map i : filterPMID){
//
//        }
//
//        List<Map> filterresults = studyMapper.getFilterStudies();


        return filterresults;
    }
    @PostMapping("/metadata")
    @ResponseBody
    public List<Map> metadata(
            @RequestParam("GEO")String geo,
            @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333");
        if(databasenames.contains(databasename)){
            databasename="Dataset.GTEx_MCA_TabulasMS_TabulasMX_meta";
        }
        else if(databasename.equals("Tabula_mouse") || databasename.equals("E-MTAB-11536") || databasename.equals("E-MTAB-11343")){
            databasename="Dataset.`"+databasename+"_cell_type_number`";

        }
        else{
            databasename="ct."+databasename+"_cell_type_number_forthis";

        }
        return studyMapper.getMetadata(geo,databasename);

    }
    @PostMapping("/dimension")
    @ResponseBody
    public HashMap<String, Object> dimension(@RequestParam("GEO")String geo,
                                             @RequestParam("databasename")String databasename,
                                             @RequestParam("method")String method){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_cells_df`";

        }
        else{
            databasename="ct."+databasename+"_cells_df";
        }
        String term;
        HashMap<String,Object> hashMap=new HashMap<>();
        if(method.equals("tSNE")){
            term="tSNE_1,tSNE_2";
        }
        else if(method.equals("tSNE 3D")){

            term="tSNE3D_1,tSNE3D_2,tSNE3D_3";
        }
        else if(method.equals("UMAP")){
            term="UMAP_1,UMAP_2";
        }
        else if(method.equals("UMAP 3D")){
            term="UMAP3D_1,UMAP3D_2,UMAP3D_3";
        }
        else{
            return null;
        }
        List<Map> results=studyMapper.getDimension(geo,databasename,term);

        List<String> celltype = new ArrayList<>();
        for (Map v : results){
//            System.out.println(v.get("Cell_standard"));

            celltype.add(v.get("Cell_standard").toString());
        }
        hashMap.put("results",results);
        hashMap.put("celltype",celltype);
        return hashMap;
    }

    @PostMapping("/heter")
    @ResponseBody
    public List<Map> heter(@RequestParam("GEO")String geo,@RequestParam("databasename")String databasename){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");

        if(databasenames.contains(databasename)) {
            databasename = "Dataset.`" + databasename + "_se_score`";
        }
        else{
            databasename = "ct." + databasename + "_se_score";
        }
        return studyMapper.getHeter(geo,databasename);
    }

    @PostMapping("/silhouette")
    @ResponseBody
    public List<Map> silhouette(
            @RequestParam("GEO")String geo,
            @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","Tabula_mouse");
        List<String> databasenames2=Arrays.asList("E-MTAB-11536","E-MTAB-11343","GSE201333");


        if(databasenames2.contains(databasename)){
            return null;
        }
        else{
            if(databasenames.contains(databasename)){
                databasename="Dataset.`"+databasename+"_cluter_mean_silhouette`";
            }
            else{
                databasename="ct."+databasename+"_cluter_mean_silhouette";
            }
            return studyMapper.getSilhouette(geo,databasename);
        }

    }

    @PostMapping("/mep_gene")
    @ResponseBody
    public List<Map> mep_gene(@RequestParam("GEO")String geo,
                              @RequestParam(value = "term",required = false)String term,
                              @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_boxplot_long`";
        }
        else{
            databasename="ct."+databasename+"_boxplot_long";
        }

        return studyMapper.getMEPgenelist(geo,term,databasename);
    }

    @PostMapping("/mep")
    @ResponseBody
    public HashMap<String, Object> mep(@RequestParam("GEO")String geo,
                                       @RequestParam(value = "Gene",required = false)String gene,
                                       @RequestParam("databasename")String databasename
                                       ){
        HashMap<String,Object> hashMap=new HashMap<>();
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_boxplot_long`";
        }
        else{
            databasename="ct."+databasename+"_boxplot_long";
        }
        List<Map> results=studyMapper.getMEP(geo,gene,databasename);

        hashMap.put("results",results);


        return hashMap;
    }

    @PostMapping("/dataset")
    @ResponseBody
    public List<Map> dataset(@RequestParam("pmid")String pmid){
        return studyMapper.getDataset(pmid);
    }
    @PostMapping("/cme_table")
    @ResponseBody
    public List<Map> cme_table(@RequestParam("GEO")String geo,
//                                             @RequestParam("draw")Integer draw,
//                                             @RequestParam("start")Integer start,
//                                             @RequestParam("length")Integer length,
//                                             @RequestParam("search[value]")String search,
//                                             @RequestParam("order[0][column]")Integer order,
//                                             @RequestParam(value = "order[0][dir]")String orderDir,
                                             @RequestParam("marker")String marker,
                                             @RequestParam("databasename")String databasename
    ){
//        HashMap<String,Object> results=new HashMap<>();
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)) {
            databasename="Dataset.`"+databasename+"_findmarkers`";

        }
        else{
            databasename="ct."+databasename+"_findmarkers_notissue";

        }

//        List<String> title=new ArrayList<String>(){
//            {
//                this.add("ID");
//                this.add("Tissue_tmp");
//                this.add("Cell_standard");
//                this.add("markers");
//                this.add("p_val");
//                this.add("avg_log2FC");
//                this.add("pct_1");
//                this.add("pct_2");
//                this.add("p_val_adj");
//            }
//        };
//        if(!orderDir.equals("desc") && !orderDir.equals("asc")){
//            return null;
//        }
//        Integer pagenum=(start/length)+1;

//        PageHelper.startPage(pagenum,length);
        List<Map> result=studyMapper.getCMEtable(geo,databasename,marker);
//        PageInfo<Map> pageInfo=new PageInfo<>(result);
//        results.put("draw",draw);
//        results.put("data",result);
//        results.put("recordsTotal",pageInfo.getTotal());
//        results.put("recordsFiltered",pageInfo.getTotal());
        return result;
    }
    @PostMapping("/cme")
    @ResponseBody
    public List<Map> cme(@RequestParam("GEO")String geo,
                         @RequestParam("celltype")String celltype,
                         @RequestParam("databasename")String databasename
    ){

        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)) {
            databasename="Dataset.`"+databasename+"_findmarkers`";

        }
        else{
            databasename="ct."+databasename+"_findmarkers_notissue";

        }        return studyMapper.getCME(geo,celltype,databasename);

    }

    @PostMapping("/cme2")
    @ResponseBody
    public List<Map> cme2(@RequestParam("GEO")String geo,
                         @RequestParam("marker")String marker,
                         @RequestParam("databasename")String databasename
    ){

        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)) {
            databasename="Dataset.`"+databasename+"_findmarkers`";

        }
        else{
            databasename="ct."+databasename+"_findmarkers_notissue";

        }        return studyMapper.getCME2(geo,marker,databasename);

    }

    @PostMapping("/cts")
    @ResponseBody
    public List<Map> cts(@RequestParam("GEO")String geo,
                         @RequestParam(value = "Gene",required = false)String Gene,
//                         @RequestParam(value = "Tissue",required = false)String Tissue,
                         @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_cell_specificity`";
        }
        else{
            databasename="ct."+databasename+"_cell_specificity";
        }

        return studyMapper.getCTS(geo,Gene,databasename);
    }
    @PostMapping("/cts2")
    @ResponseBody
    public List<Map> cts2(@RequestParam("GEO")String geo,
                          @RequestParam(value = "Tissue",required = false)String Tissue,
                          @RequestParam(value = "Celltype",required = false)String Celltype,
                          @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_cell_specificity`";
        }
        else{
            databasename="ct."+databasename+"_cell_specificity";
        }
        return studyMapper.getCTS2(geo,Tissue,Celltype,databasename);
    }
    @PostMapping("/cts_table")
    @ResponseBody
    public HashMap<String, Object> cts_table(@RequestParam("GEO")String geo,
                                             @RequestParam("draw")Integer draw,
                                             @RequestParam("start")Integer start,
                                             @RequestParam("length")Integer length,
                                             @RequestParam("search[value]")String search,
                                             @RequestParam("order[0][column]")Integer order,
                                             @RequestParam(value = "order[0][dir]")String orderDir,
                                             @RequestParam("databasename")String databasename

    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_cell_specificity`";
        }
        else{
            databasename="ct."+databasename+"_cell_specificity";
        }
        HashMap<String,Object> results=new HashMap<>();
        List<String> title=new ArrayList<String>(){
            {
                this.add("ID");
                this.add("Gene");
                this.add("Cell_type");
                this.add("Tissue");
                this.add("Cell_specific_score");
            }
        };
        Integer pagenum=(start/length)+1;

        PageHelper.startPage(pagenum,length);
        List<Map> result=studyMapper.getCTStable(geo,search,title.get(order),orderDir,databasename);
        PageInfo<Map> pageInfo=new PageInfo<>(result);
        results.put("draw",draw);
        results.put("data",result);
        results.put("recordsTotal",pageInfo.getTotal());
        results.put("recordsFiltered",pageInfo.getTotal());
        return results;
    }
    @PostMapping("/cts_gene")
    @ResponseBody
    public List<Map> cts_gene(@RequestParam("GEO")String geo,
                              @RequestParam(value = "term",required = false)String term,
                              @RequestParam("databasename")String databasename
                              ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
//            databasename="Dataset.`"+databasename+"_cell_specificity`";
            databasename="Dataset.`"+databasename+"_CTSselect`";
        }
        else{
            databasename="ct."+databasename+"_CTSselect";
        }
        return studyMapper.getCTSGeneList(geo,term,databasename);
    }
    @PostMapping("/cts_tissue")
    @ResponseBody
    public List<Map> cts_tissue(@RequestParam("GEO")String geo,
                                @RequestParam(value = "term",required = false)String term,
                                @RequestParam("databasename")String databasename){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_cell_specificity`";
        }
        else{
            databasename="ct."+databasename+"_cell_specificity";
        }
        return studyMapper.getCTSTissueList(geo,term,databasename);
    }
    @PostMapping("/cts_cell")
    @ResponseBody
    public List<Map> cts_cell(@RequestParam("GEO")String geo,
                                @RequestParam(value = "term",required = false)String term,
                              @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)){
            databasename="Dataset.`"+databasename+"_cell_specificity`";
        }
        else{
            databasename="ct."+databasename+"_cell_specificity";
        }        return studyMapper.getCTSCelltypeList(geo,term,databasename);
    }

    @PostMapping("/cme_tissue")
    @ResponseBody
    public List<Map> cme_tissue(@RequestParam("GEO")String geo,
                                @RequestParam(value = "term",required = false)String term,
                                @RequestParam("databasename")String databasename
    ){
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)) {
            databasename="Dataset.`"+databasename+"_findmarkers`";

        }
        else{
            databasename="ct."+databasename+"_findmarkers_notissue";

        }
        return studyMapper.getCMETissueList(geo,term,databasename);
    }
    @PostMapping("/cme_cell")
    @ResponseBody
    public List<Map> cme_cell(@RequestParam("GEO")String geo,
                              @RequestParam(value = "term",required = false)String term,
                              @RequestParam("databasename")String databasename){

        System.out.println(databasename);
        System.out.println(geo);
        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)) {
            databasename="Dataset.`"+databasename+"_findmarkers`";

        }
        else{
            databasename="ct."+databasename+"_MEPCellselect";

        }        return studyMapper.getCMECelltypeList(geo,term,databasename);
    }

    @PostMapping("/cme_gene")
    @ResponseBody
    public List<Map> cme_gene(@RequestParam("GEO")String geo,
                              @RequestParam(value = "term",required = false)String term,
                              @RequestParam("databasename")String databasename){

        List<String> databasenames=Arrays.asList("GTEx","MCA","GSE201333","E-MTAB-11536","E-MTAB-11343","Tabula_mouse");
        if(databasenames.contains(databasename)) {
            databasename="Dataset.`"+databasename+"_findmarkers`";

        }
        else{
            databasename="ct."+databasename+"_findmarkers_notissue";

        }        return studyMapper.getCMEGeneList(geo,term,databasename);
    }


    @RequestMapping(value = "/study_species_list", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> study_species_list( @RequestParam(value = "tissue", required = false) String tissue,
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


        List<Map> list = studyMapper.getSpeciesList(tissueList,celltypeList);
        return list;
    }
}

