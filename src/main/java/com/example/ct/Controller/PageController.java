package com.example.ct.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    @GetMapping("/celltype") public String celltype(){ return "Celltype"; }
    @GetMapping("/marker") public String marker(){ return "Marker"; }
    @GetMapping("/tissue") public String tissue(){ return "Tissue"; }
    @GetMapping("/study") public String study(){ return "Study"; }
    @GetMapping("/help") public String help(){ return "Help"; }
    @GetMapping("/publication") public String publication(){ return "Publication"; }
    @GetMapping("/download") public String download(){ return "Download"; }
    @GetMapping("/ctc") public String cellcompare(){ return "CellCompare"; }
    @GetMapping("/ctp") public String cellsearch(){ return "CellSearch"; }
//    @GetMapping("/cellexpression") public String tool3(){ return "CellExpression"; }

    @GetMapping("/advanced") public String SearchPage(){ return "Search"; }
    @GetMapping("/species") public String species(){ return "Species"; }
    @GetMapping("/condition") public String condition(){ return "Condition"; }
    @GetMapping("/species_similarity") public String species_similarity(){ return "SpeciesSimilarity"; }
    @GetMapping("/ortholog") public String homologene(){ return "HomoloGene"; }

}
