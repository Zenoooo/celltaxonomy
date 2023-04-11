package com.example.ct.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface PublicationMapper {
    List<Map> getPub();
    List<Map> getPubDetail(String pmid);
    List<Map> getPubYear();

}
