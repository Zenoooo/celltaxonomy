package com.example.ct.Service;

import com.example.ct.Mapper.PublicationMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class PublicationService {
    @Resource
    PublicationMapper publicationMapper;

    public List<Map> getPub(){return publicationMapper.getPub();}
    public List<Map> getPubDetail(String pmid){return publicationMapper.getPubDetail(pmid);}
    public List<Map> getPubYear(){return publicationMapper.getPubYear();}

}
