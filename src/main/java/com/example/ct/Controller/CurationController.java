package com.example.ct.Controller;

import com.example.ct.Mapper.CurationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class CurationController {

    @Autowired
    CurationMapper curationMapper;


    @GetMapping("/curationlogin")
    public String curationlogin(){
        return "CurationLogin";
    }

    @RequestMapping(value = "/curation_submit",method = RequestMethod.POST)
    public String curation_submit(
            @RequestParam(value="Species")String Species,
            @RequestParam(value="Cell_original_name")String Cell_original_name,
            @RequestParam(value="Cell_standard")String Cell_standard,
            @RequestParam(value="Cell_id")String Cell_id,
            @RequestParam(value="Parent_cell_id")String Parent_cell_id,
            @RequestParam(value="New_cell_description")String New_cell_description,
            @RequestParam(value="Tissue")String Tissue,
            @RequestParam(value="Tissue_id")String Tissue_id,
            @RequestParam(value="Condition")String Condition,
            @RequestParam(value="Disease_id")String Disease_id,
            @RequestParam(value="Positive_cell_marker")String Positive_cell_marker,
            @RequestParam(value="Negative_cell_marker")String Negative_cell_marker,
            @RequestParam(value="Combinatorial_cell_marker")String Combinatorial_cell_marker,
            @RequestParam(value="Marker_description")String Marker_description,
            @RequestParam(value="PMID")String PMID,
            @RequestParam(value="Life_stage")String Life_stage,
            @RequestParam(value="Library")String Library,
            @RequestParam(value="Datasets_id")String Datasets_id,
            @RequestParam(value="Curator")String Curator,
            @RequestParam(value="Uncertain")String Uncertain

    ){
        Date dNow = new Date( );
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss");


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
                ft.format(dNow),
                Uncertain
                );
        return "Curation";
    }
    @RequestMapping(value = "/curation_edit",method = RequestMethod.POST)
    public String curation_edit(
            @RequestParam(value="ID")String ID,
            @RequestParam(value="Species")String Species,
            @RequestParam(value="Cell_original_name")String Cell_original_name,
            @RequestParam(value="Cell_standard")String Cell_standard,
            @RequestParam(value="Cell_id")String Cell_id,
            @RequestParam(value="Parent_cell_id")String Parent_cell_id,
            @RequestParam(value="New_cell_description")String New_cell_description,
            @RequestParam(value="Tissue")String Tissue,
            @RequestParam(value="Tissue_id")String Tissue_id,
            @RequestParam(value="Condition")String Condition,
            @RequestParam(value="Disease_id")String Disease_id,
            @RequestParam(value="Positive_cell_marker")String Positive_cell_marker,
            @RequestParam(value="Negative_cell_marker")String Negative_cell_marker,
            @RequestParam(value="Combinatorial_cell_marker")String Combinatorial_cell_marker,
            @RequestParam(value="Marker_description")String Marker_description,
            @RequestParam(value="PMID")String PMID,
            @RequestParam(value="Life_stage")String Life_stage,
            @RequestParam(value="Library")String Library,
            @RequestParam(value="Datasets_id")String Datasets_id,
            @RequestParam(value="Curator")String Curator,
            @RequestParam(value="Uncertain")String Uncertain
    ){
        Date dNow = new Date( );
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss");

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
                ft.format(dNow),
                Uncertain
        );
        return "Curation";
    }
    @RequestMapping(value="/curator")
    public String curationlogin(
            @RequestParam(value="username")String username,
            @RequestParam(value="password")String password,
            RedirectAttributes model, HttpSession session
            ){
        model.addFlashAttribute("username",username);

        List<Map> result=curationMapper.curationlogin(username,password);
        if(result.size()>0){
            session.setAttribute("loginUser",username);
            return "redirect:/curation";
        }
        else{
            model.addFlashAttribute("warn","Username or password is incorrect");

            return "CurationLogin";
        }
    }

    @RequestMapping(value="/contributions",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> contribution(@RequestParam(value="curator")String username){
        return curationMapper.getContributions(username);
    }

    @RequestMapping(value="/delete_curation",method = RequestMethod.POST)
    public String delete_curation(@RequestParam(value="ID")String ID){

        curationMapper.deleteCuration(ID);
        return "Curation";
    }

    @RequestMapping(value="/curation_cell_type",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> curation_cell_type(@RequestParam(value="term",required = false)String term){

        List<Map> result=curationMapper.getCelltype(term);
        return result;
    }


    @RequestMapping(value="/curation_cell_detail",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> curation_cell_detail(@RequestParam(value="ID")String ID){

        List<Map> result=curationMapper.getCellDetail(ID);
        return result;
    }
    @RequestMapping(value="/curation_tissue",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> curation_tissue(@RequestParam(value="term",required = false)String term){

        List<Map> result=curationMapper.getTissueList(term);
        return result;
    }
    @RequestMapping(value="/curation_condition",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> curation_condition(@RequestParam(value="term",required = false)String term){

        List<Map> result=curationMapper.getConditionList(term);
        return result;
    }
    @RequestMapping(value="/curation_species",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> curation_species(@RequestParam(value="term",required = false)String term){

        List<Map> result=curationMapper.getSpeciesList(term);
        return result;
    }
    @RequestMapping(value="/total_curation",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> total_curation(@RequestParam(value="term",required = false)String term){

        List<Map> result=curationMapper.getTotalCuration();
        return result;
    }

    @RequestMapping(value="/profile",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> profile(@RequestParam(value="user",required = false)String username){

        List<Map> result=curationMapper.getProfile(username);
        return result;
    }

    @RequestMapping(value="/change_password",method = RequestMethod.POST)
    @ResponseBody
    public void change_password(@RequestParam(value="username",required = false)String username,
                                     @RequestParam(value="password",required = false)String password){

        curationMapper.changePassword(username,password);

    }
    @RequestMapping(value="/library_list",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> library_list(){

        return curationMapper.getLibrary();

    }
}
