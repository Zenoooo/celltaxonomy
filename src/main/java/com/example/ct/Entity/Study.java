package com.example.ct.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Study {
    private String DatasetsID ;
    private String GEOID	;
    private String DatabaseName	;
    private String PubmedID		;
    private String Journal		;
    private String Years		;
    private String Title		;
    private String Abstract	;
    private String Library		;
    private String Species		;
    private String Tissue	;
    private Integer Cell_number;
}
