package com.example.ct.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Boxplot {
    private String source;
    private String dataset ;
    private String ID;
    private String Tissue;
    private String Tissue_ID ;
    private String Cell_Type;
    private String Cell_standard ;
    private String cell_id ;
    private String Gene	 ;
    private double Min ;
    private double Q1 ;
    private double Q2 ;
    private double Q3 ;
    private double Max;
    private Study studyList;

}
