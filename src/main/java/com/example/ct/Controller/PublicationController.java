package com.example.ct.Controller;

import com.example.ct.Mapper.PublicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class PublicationController {
    @Autowired
    PublicationMapper publicationMapper;

    @RequestMapping(value = "/pub_browse",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> pub_browse(){
        return publicationMapper.getPub();
    }

    @RequestMapping(value = "/pub_year",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> pub_year(){
        return publicationMapper.getPubYear();
    }

    @RequestMapping(value = "/detail_browse",method = RequestMethod.POST)
    @ResponseBody
    public List<Map> detail_browse(@RequestParam("pmid")String pmid){
        return publicationMapper.getPubDetail(pmid);
    }
}
