package com.example.ct.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Celltype {
    private String Species ;
    private String Tissue ;
    private String Tissue_Stage ;
    private String Tissue_UberonOntology_ID ;
    private String Germ_Layer ;
    private String Disease_Type ;
    private String Disease_Ontology_ID ;
    private String Cell_Classification_Note ;
    private String Is_New_Cell_Type ;
    private String Cell_Type ;
    private String Cell_Ontology_ID ;
    private String Specific_Cell_Type ;
    private String Specific_Cell_Ontology_ID ;
    private String Superior_Cell_Ontology_ID ;
    private String Superior_cell_type ;
    private String Cell_New_OntologyID ;
    private String New_Cell_Type_Annotation ;
    private String New_Cell_Supported_Evidence ;
    private String Cell_Line_Name ;
    private String Cell_line_Ontology_ID ;
    private String Cell_Marker ;
    private String Gene_Alias ;
    private String Gene_Ensembl_ID ;
    private String Gene_ENTREZID ;
    private String Uniprot ;
    private String PFAM ;
    private String Marker_Subcellular_Location ;
    private String Gene_Type ;
    private String PMID ;
    private String URL ;
    private String Marker_Resource ;
    private String Canonical_marker ;
    private String Gene_Function ;
    private String Additional_Information ;
    private String Expression_index ;
    private String Additional_Characteristics ;
    private String Confidence_index;
}
