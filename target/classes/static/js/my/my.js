function nav_side_bar_set(){
    $(".table-title").each(function(){
            if($(this).parent().parent().css("display")=="block"){
                $("#nav-side").append(
                    "<li class='nav-side-item'><a href='#"+$(this).find("span").eq(0).text().replace(/ /g,"_").replace(/-/g,"_").toLowerCase()+"/'>"+$(this).find("span").eq(0).text()+"</a></li>"
                )
            }



    })

    $("#nav-side").parent().css("height",$("#nav-side").parent().siblings().height())
    $("#nav-side").css("width",$("#nav-side").parent().width())
}
function nav_side_bar_scroll(){
    var scrollTop = $(window).scrollTop()+$(window).innerHeight()/2;
    var n=1;
    var nav_length=0
    $(".table-title").each(function(){
        if($(this).parent().parent().css("display")=="block"){
            nav_length+=1
        }
    })
    $(".table-title").each(function(){
        if($(this).parent().parent().css("display")=="block"){
            if($(this).offset().top>scrollTop){
                if(n==1){
                    $("#nav-side").children().eq(n).addClass("active")
                    $("#nav-side").children().eq(n).siblings().removeClass("active")

                    return false
                }
                else{
                    $("#nav-side").children().eq(n-1).addClass("active")
                    $("#nav-side").children().eq(n-1).siblings().removeClass("active")

                    return false
                }


            }
            else{
                if(n==nav_length){
                    $("#nav-side").children().eq(n).addClass("active")
                    $("#nav-side").children().eq(n).siblings().removeClass("active")
                }
                else{
                    n=n+1
                }
            }
        }

    })
}
function post(URL,params) {
    var temp_form = document.createElement("form");
    temp_form .action = URL;
    temp_form .method = "post";
    temp_form .style.display = "none";
    for (var x in params){
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = params[x];
        temp_form .appendChild(opt);
    }

    document.body.appendChild(temp_form);
    temp_form .submit();
};

function makeStudyList(data){
    var cell=""
    if(data.Cell!=null){
        var celllist=data.Cell.split(";")

        for(var i=0;i<celllist.length;i++){
            cell=cell+
                "<a target='_blank' href='/celltaxonomy/celltype/"+celllist[i].split("|")[1]+"'>"+celllist[i].split("|")[0]+"</a>; "
        }
    }


    var tissue=""
    if(data.Tissue!=null){
        var tissuelist=data.Tissue.split(";")
        for(var i=0;i<tissuelist.length;i++){
            if(tissuelist[i].split("|")[1]=="-"||tissuelist[i].split("|")[1]=="NA"){
                tissue=tissue+"<span>"+tissuelist[i].split("|")[0]+"; </span>"
            }
            else{
                tissue=tissue+
                    "<a target='_blank' href='/celltaxonomy/tissue/"+tissuelist[i].split("|")[1]+"'>"+tissuelist[i].split("|")[0]+"</a>; "
            }
        }
    }

    if(cell.length>0){
        if(tissue.length>0){
            if(data.PubmedID.indexOf("doi")>=0) {
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.GEOID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">DOI: "+data.PubmedID.split(" ")[1]+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/,/g,", ")+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Tissue</td>\n" +
                    "                                        <td class=\"tissue\">"+tissue.substring(0,tissue.length-2)+"</td>\n" +
                    "                                    </tr>\n" +

                    "<tr>\n" +
                    "<td>Cell type</td>\n" +
                    "<td class=\"celltype\">"+
                    cell.substring(0,cell.length-2)+
                    "</td>\n"+
                    "</tr>\n"+
                    "                           </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
            else{
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.PubmedID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">PMID: "+data.PubmedID+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/;/g,"; ")+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Tissue</td>\n" +
                    "                                        <td class=\"tissue\">"+tissue.substring(0,tissue.length-2)+"</td>\n" +
                    "                                    </tr>\n" +

                    "<tr>\n" +
                    "<td>Cell type</td>\n" +
                    "<td class=\"celltype\">"+
                    cell.substring(0,cell.length-2)+
                    "</td>\n"+
                    "</tr>\n"+
                    "                            </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
        }
        else{
            if(data.PubmedID.indexOf("doi")>=0) {
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.GEOID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">DOI: "+data.PubmedID.split(" ")[1]+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/,/g,", ")+"</td>\n" +
                    "                                    </tr>\n" +
                    "<tr>\n" +
                    "<td>Cell type</td>\n" +
                    "<td class=\"celltype\">"+
                    cell.substring(0,cell.length-2)+
                    "</td>\n"+
                    "</tr>\n"+
                    "                           </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
            else{
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.PubmedID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">PMID: "+data.PubmedID+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/;/g,"; ")+"</td>\n" +
                    "                                    </tr>\n" +

                    "<tr>\n" +
                    "<td>Cell type</td>\n" +
                    "<td class=\"celltype\">"+
                    cell.substring(0,cell.length-2)+
                    "</td>\n"+
                    "</tr>\n"+
                    "                            </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
        }
    }
    else{
        if(tissue.length>0){
            if(data.PubmedID.indexOf("doi")>=0) {
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.GEOID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">DOI: "+data.PubmedID.split(" ")[1]+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/,/g,", ")+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Tissue</td>\n" +
                    "                                        <td class=\"tissue\">"+tissue.substring(0,tissue.length-2)+"</td>\n" +
                    "                                    </tr>\n" +


                    "                           </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
            else{
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.PubmedID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">PMID: "+data.PubmedID+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/;/g,"; ")+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Tissue</td>\n" +
                    "                                        <td class=\"tissue\">"+tissue.substring(0,tissue.length-2)+"</td>\n" +
                    "                                    </tr>\n" +

                    "                            </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
        }
        else{
            if(data.PubmedID.indexOf("doi")>=0) {
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.GEOID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">DOI: "+data.PubmedID.split(" ")[1]+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/,/g,", ")+"</td>\n" +
                    "                                    </tr>\n" +

                    "                           </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
            else{
                $(".study-cards").append(
                    "<div class=\"study-card\" >\n" +
                    "                        <div>\n" +
                    "                            <h3 class=\"study-title\"><a href='/celltaxonomy/study/"+data.PubmedID+"'>"+data.Title+"</a></h3>\n" +
                    "                        </div>\n" +
                    "                        <div>\n" +
                    "                            <ul>\n" +
                    "                               <li class=\"journal\">Journal: "+data.Journal+"</li>\n" +
                    "                               <li class=\"years\">Year: "+data.Years+"</li>\n" +
                    "                               <li class=\"pmid\">PMID: "+data.PubmedID+"</li>\n" +

                    "                            </ul>\n" +
                    "                        </div>\n" +
                    "                        <div style='padding:0 1.25rem'>\n" +
                    "                           <table class=\"table table-hover table-striped\">\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Library</td>\n" +
                    "                                        <td class=\"library\">"+data.Library+"</td>\n" +
                    "                                    </tr>\n" +
                    "                                    <tr>\n" +
                    "                                        <td>Species</td>\n" +
                    "                                        <td class=\"species\">"+data.Species.replace(/;/g,"; ")+"</td>\n" +
                    "                                    </tr>\n" +

                    "                            </table>"+
                    "                        </div>\n" +
                    "                    </div>"
                )
            }
        }
    }

}