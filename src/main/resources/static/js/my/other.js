function getpie(id,results,term){
    var plotwidth=$("#width").width();
    $("#"+id).css("width",plotwidth/2-20)

    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom);
    var option;
    var data=[];
    results.map(function(e){
        data.push({value:e.counts,name:e[term]})
    })
    var name;
    if(term=="Tissue_standard"){
        name="Tissue"
    }
    else{
        name="Condition"
    }
    option = {
        color:[
            "rgb(182,146,145)","rgb(169,202,84)","rgb(86,176,167)","rgb(118,129,145)","rgb(209,169,68)","rgb(181,147,145)",
            "rgb(242,222,186)","rgb(153,187,150)","rgb(166,48,43)","rgb(182,47,130)","rgb(110,148,230)","rgb(142,116,210)",
            "rgb(94,55,147)","rgb(96,177,123)","rgb(216,187,142)","rgb(250,227,195)","rgb(223,176,71)","rgb(203,156,65)",
            "rgb(131,189,182)","rgb(62,132,137)","rgb(181,119,136)","rgb(137,68,87)","rgb(170,166,194)","rgb(173,212,201)",
            "rgb(212,196,186)","rgb(84,164,202)","rgb(82,75,130)","rgb(245,198,189)","rgb(226,146,132)","rgb(223,145,76)",
            "rgb(169,147,136)","rgb(171,145,178)","rgb(52,130,120)","rgb(178,211,207)","rgb(217,152,178)","rgb(46,134,177)",
            "rgb(222,186,186)","rgb(245,217,193)","rgb(113,134,172)","rgb(192,200,212)","rgb(165,153,187)","rgb(210,210,203)",
        ],
        title: {
            text: '',
            left: 'center'
        },

        tooltip: {
            trigger: 'item'
        },

        series: [
            {
                name: "Number of entries",
                type: 'pie',
                radius: '70%',
                center:['50%','50%'],
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    option && myChart.setOption(option);

}
