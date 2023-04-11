const bigd_site = "https://bigd.big.ac.cn/";

$(document).ready(function () {
    prependHeaderSection();
    appendFooterSection();

    $('li.bigd-dropdown').hover(function () {
        $(this).find('.bigd-dropdown-menu').first().stop(true, true).delay(50).fadeIn();
    }, function () {
        $(this).find('.bigd-dropdown-menu').first().stop(true, true).delay(50).fadeOut();
    });

    $('.bigd-collapsed').click(function () {
        $('#bigd-coll').toggle();
        var display = $('#bigd-coll').css("display");
        if (display == 'block') {
            $('.bigd-navbar').css("height", "200px");
        } else {
            $('.bigd-navbar').css("height", "30px");
        }

    });
});

function prependHeaderSection() {
    $('head').append("<link rel='stylesheet' type='text/css' href='/celltaxonomy/static/css/page.min.css'>");
    var header = "<header>" +
        "<nav class='bigd-navbar-default bigd-navbar'>" +
        // "<div class='bigd-container'>" +
        "<div class='bigd-navbar-header'>" +
        "<button type='button' class='bigd-navbar-toggle bigd-collapsed'> <span class='bigd-sr-only'>Toggle navigation</span>" +
        "<span class='bigd-icon-bar'></span>" +
        "<span class='bigd-icon-bar'></span> " +
        "<span class='bigd-icon-bar'></span> " +
        "</button> " +
        "<a href='" + bigd_site + "' class='bigd-navbar-brand'><img src='/celltaxonomy/static/img/NGDC/CNCB-NGDC-white.png' class='bigd-img-responsive'/></a>" +
        "</div>" +

        "<div class='bigd-collapse bigd-navbar-collapse' id='bigd-coll'>" +
        "<ul class='bigd-nav bigd-navbar-nav bigd-navbar-right'>" +
        // "<li><a href='" + bigd_site + "'> Home</a></li>" +
        "<li><a href='" + bigd_site + "databases'> Databases</a></li>" +
        "<li><a href='" + bigd_site + "tools'>Tools</a></li> " +
        "<li><a href='" + bigd_site + "standards'>Standards</a></li> " +
        "<li><a href='" + bigd_site + "publications'>Publications</a></li>" +
        "<li><a href='" + bigd_site + "about'>About</a></li>" +
        // "<li><a href='http://sso.big.ac.cn'>Sign in</a></li>" +
        "</ul>" +
        "</div>" +
        // "</div>" +
        "</nav>" +
        "</header>";
    $("body").prepend(header);
}

function appendFooterSection() {
    var myDate = new Date();

    var year = myDate.getFullYear();
    var footer = "" +
        "<footer class='bigd-footer' style='font-family: Arial'>" +
        "<div class='bigd-panel bigd-panel-default'>" +
        "<div class='bigd-panel-body'>" +
        // "<div class='bigd-container'>" +
        "<div class='bigd-row'> " +
        "<div class='bigd-col-md-2'> " +
        "<a href='" + bigd_site + "'><img src='/celltaxonomy/static/img/NGDC/CNCB-NGDC.png' class='bigd-img-responsive' style='margin-top: 15px;'/></a>" +
        "<ul class='bigd-list-unstyled'> " +
        "<li><a href='" + bigd_site + "about'>About NGDC</a></li> " +
        "<li><a href='" + bigd_site + "people'>People</a></li> " +
        "<li><a href='" + bigd_site + "mission'>Mission</a></li> " +
        "<li><a href='" + bigd_site + "board'>Advisory Board</a></li> " +
        "<li><a href='" + bigd_site + "structure'>Organizational Structure</a></li> " +
        "<li><a href='" + bigd_site + "history'>History</a></li> " +
        "<li><a href='" + bigd_site + "annual-report'>Annual Reports</a></li> " +
        "</ul>" +
        "</div>" +

        "<div class='bigd-col-md-2'> " +
        "<h3>Research & Resources</h3> " +
        "<ul class='bigd-list-unstyled'> " +
        "<li><a href='" + bigd_site + "databases'>Databases</a></li> " +
        "<li><a href='" + bigd_site + "tools'>Tools</a></li> " +
        "<li><a href='" + bigd_site + "standards'>Standards</a></li> " +
        "<li><a href='" + bigd_site + "research'>Topics & Projects</a></li> " +
        "<li><a href='" + bigd_site + "publications'>Publications</a></li> " +
        "</ul> " +
        "</div> " +

        "<div class='bigd-col-md-2'> " +
        "<h3>Featured</h3> " +
        "<ul class='bigd-list-unstyled'> " +
        "<li><a href='https://bigd.big.ac.cn/databasecommons' target='_blank'>Database Commons</a></li> " +
        "<li><a href='https://bigd.big.ac.cn/ewas' target='_blank'>EWAS Atlas</a></li> " +
        "<li><a href='https://bigd.big.ac.cn/gsa' target='_blank' title='Genome Sequence Archive'>GSA</a></li> " +
        "<li><a href='https://bigd.big.ac.cn/gvm' target='_blank' title='Genome Variation Map'>GVM</a></li> " +
        "<li><a href='http://ic4r.org' target='_blank' title='Information Commons for Rice'>IC4R</a></li>" +
        "<li><a href='https://bigd.big.ac.cn/idog' target='_blank'>iDog</a></li> " +
        "<li><a href='https://bigd.big.ac.cn/methbank' target='_blank' title='Methylation DataBank'>MethBank</a></li> " +
        "</ul> " +
        "</div> " +

        "<div class='bigd-col-md-2'> " +
        "<h3>Conference & Outreach</h3> " +
        "<ul class='bigd-list-unstyled'> " +
        "<li><a href='" + bigd_site + "conference'>Conferences</a></li> " +
        "<li><a href='" + bigd_site + "education'>Education</a></li> " +
        "<li><a href='" + bigd_site + "training'>Training</a></li> " +
        "<li><a href='https://www.sciencedirect.com/journal/genomics-proteomics-and-bioinformatics' target='_blank'>GPB</a></li> " +
        "</ul> " +
        "</div> " +

        "<div class='bigd-col-md-2'> " +
        "<h3>Alliance & Collaboration</h3> " +
        "<ul class='bigd-list-unstyled'> " +
        "<li><a href='http://bhbd-alliance.org' target='_blank'>BHBD</a></li> " +
        "<li><a href='https://bigd.big.ac.cn/p10k/' target='_blank'>P10K</a></li> " +
        "<li><a href='" + bigd_site + "partners'>Partners</a></li> " +
        "<li><a href='" + bigd_site + "collaborations'>Collaborations</a></li> " +
        "<li><a href='" + bigd_site + "funding'>Funding</a></li> " +
        "<li><a href='" + bigd_site + "contact'>Contact Us</a></li> " +
	"<li><a href='https://bigd.big.ac.cn/news/80'>Join Us</a></li> " +
        "</ul> " +
        "</div> " +
        "</div> " +

        "<hr class='footer-hr'>" +
        "<div class='bigd-row'>" +
        "<div class='bigd-col-md-8'>" +
        "<p class='bigd-text-muted'>" +
        "&copy; " + year + " National Genomics Data Center, <span><a href='http://english.big.cas.cn' target='_blank'>China National Center for Bioinformation / Beijing Institute of Genomics</a></span>, <span><a href='http://english.cas.cn' target='_blank'>Chinese Academy of Sciences</a></span><br/>" +
        "No.1 Beichen West Road, Chaoyang District, Beijing 100101, China<br>" +
        "Tel: +86 (10) 8409-7340 | " +
        "Fax: +86 (10) 8409-7200 | ngdc(AT)big.ac.cn <br>" +
        "<span><a href='"+bigd_site+"policies'>Policies and Disclaimers</a></span>"+
        "</p>"+
        "<p class='bigd-text-muted'><span><a rel='license' target='_blank' href='http://creativecommons.org/licenses/by/3.0/cn/'><img alt='Creative Commons License' style='border-width:0;height: 15px' src='/celltaxonomy/static/img/NGDC/cc.png'/></a></span> This work is licensed under a <span><a rel='license' href='http://creativecommons.org/licenses/by/3.0/cn/' target='_blank'>Creative Commons Attribution 3.0 China Mainland License.</a> <br><a href='https://beian.miit.gov.cn' target='_blank'>京ICP备10050270号</a></span>" +
        "</p>" +
        "</div>" +
        "<div class='bigd-col-md-4'> <div class='pull-right'>" +
        "<ul class='bigd-list-inline'>" +
        "<li><a href='http://english.big.cas.cn' target='_blank'><img src='/celltaxonomy/static/img/NGDC/big_logo.png' style='width: 32px'></a></li>" +
        "<li><a href='https://www.picb.ac.cn/picben/#/' target='_blank'><img src='/celltaxonomy/static/img/NGDC/picb.png' style='height: 32px;'></a></li>" +
        "<li><a href='http://english.ibp.cas.cn/' target='_blank'><img src='/celltaxonomy/static/img/NGDC/ibp.png' style='height: 32px;'></a></li>" +
        "<li><a href='http://english.cas.cn/' target='_blank'><img src='/celltaxonomy/static/img/NGDC/cas.png' style='height: 32px;'></a></li>" +
        "</ul>" +
        "</div>" +
        "</div>" +
        // "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</footer>";
    $("body").append(footer);
}

