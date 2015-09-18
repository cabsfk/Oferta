﻿/***************
DEMANDA
****************/

function getParametroFilter() {
    legend.removeFrom(map);
    var filterOferta = turf.filter(glo.ArrayOfertas, 'FK_ID_MINERAL', parseInt($("#selecMineral").val()));
    $.each(glo.ArrayRestric, function (index, value) {
        filterOferta = turf.remove(filterOferta, value, 1);
    });
    //console.log(filterOferta);

 
    if (filterOferta.features.length>0) {
        addOferta(filterOferta);
    } else {
        addOferta(glo.pointTemp);
    }
    VerLegend();
}

$("#selecMineral").change(function () {
    getUniMate($("#selecMineral").val());
    //var filteredDemanda = turf.filter(glo.Arraycentroid, 'MINERAL', $("#selecMineral").val());
    $('#tituloMineral').empty().append(glo.textMineral[$("#selecMineral").val()]);
    //resetMapa();
    //addCentroid(filteredDemanda);
    getParametroFilter();
});

$("#selecEscala").change(function () {
    getParametroFilter();    
});

function selecEstudiochange() {
    if (glo.addlegend == true) {
        legend.removeFrom(map);
    }
    glo.Anio = 0;
    CargaOfertaDemanda();
};
/*
function calRadio(Arraycentroid) {
    //console.log(glo.DEMANDA_ANIO);
    var gmax = turf.max(glo.extend, Arraycentroid, 'DEMANDA_ANIO_' + glo.DEMANDA_ANIO, 'max');
    glo.maxDataCircle = gmax.features[0].properties.max;
    $("#valuemin").empty().append('1 ' + glo.UniMate);
    $("#valuemax").empty().append(numeral(glo.maxDataCircle).format('0,0') + ' ' + glo.UniMate);
    var pixel = 20;
    var Dem = turf.filter(glo.ArrayOfertasMun, 'FK_ID_MINERAL', parseInt($("#selecMineral").val()));
    for (i = 0; i < Arraycentroid.features.length; i++) {
        Arraycentroid.features[i].properties.RADIO = ((Arraycentroid.features[i].properties["DEMANDA_ANIO_" + glo.DEMANDA_ANIO] * pixel) / glo.maxDataCircle);
        var DemDep = turf.filter(Dem, 'FK_ID_DEPARTAMENTO', Arraycentroid.features[i].properties.DEMANDANTE_DEPARTAMENTO);
        if (DemDep.features.length > 0) {
            var DemMun = turf.filter(DemDep, 'FK_ID_MUNICIPIO', Arraycentroid.features[i].properties.DEMANDANTE_MUNICIPIO);
            if (DemMun.features.length > 0) {
                Arraycentroid.features[i].properties.ProMun = DemMun.features[0].properties.PRODUCCION;
            } else {
                Arraycentroid.features[i].properties.ProMun = 0;
            }
        } else {
            Arraycentroid.features[i].properties.ProMun = 0;
        }
        
    }
    //console.log(Arraycentroid);
    return Arraycentroid;
}
function styleCircle(feature) {
    var color;
    if (feature.properties.ProMun > feature.properties["DEMANDA_ANIO_" + glo.DEMANDA_ANIO]) {
        color = "rgb(82,168,131)"
    } else {color = "red" }
    return {
        radius: feature.properties.RADIO,
        fillColor: color,
        color: "white",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    };
}

function resetMapa() {
    $("#panel_superDerecho").hide();
    if (glo.layerStyle != "") {
        glo.lyrMate.resetStyle(glo.layerStyle);
    }
}
$("#closePanelDem").click(function () {
    resetMapa();
});

function BarsDemanda(properties) {
    var Num = parseInt(properties.ANIO_REGISTRO);
    $('#containerDemanda').highcharts({
        chart: {
            height: 300,
            marginTop: 60,
            type: 'column'
        },
        title: {
            text: 'Demanda Proyectada'  
        },
        subtitle: {
            text: properties.Nombre
        },
        credits: {
            text: 'Mineria-UPME',
            href: 'http://www.upme.gov.co'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '9px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return 'Demanda en ' + this.key + ':<br> <b>' +numeral(this.y).format('0,0')+ ' </b>';
            }
        },
        plotOptions: {
            column: {
                grouping: true,
                shadow: true,
                borderWidth: 0,
                pointPadding: 0,
                pointPlacement: -0.2

            }
        },
        series: [{
            name: 'Demanda',
            data: [
                [Num, properties.DEMANDA_ANIO_0],
                [Num + 1, properties.DEMANDA_ANIO_1],
                [Num + 2, properties.DEMANDA_ANIO_2],
                [Num + 3, properties.DEMANDA_ANIO_3],
                [Num + 4, properties.DEMANDA_ANIO_4],
                [Num + 5, properties.DEMANDA_ANIO_5],
                [Num + 6, properties.DEMANDA_ANIO_6],
                [Num + 7, properties.DEMANDA_ANIO_7],
                [Num + 8, properties.DEMANDA_ANIO_8],
                [Num + 9, properties.DEMANDA_ANIO_9]
                
            ],
            dataLabels: {
                enabled: false
            }
        }], 
         exporting: {
            filename: 'Demanda-Proyectada'
        }
    });

}


function clickToFeature(e) {
    
    if (glo.layerStyle != "") {
        glo.lyrMate.resetStyle(glo.layerStyle);
    }
    var feature = e.target.feature;
    glo.layerStyle = e.target;
    var color;
    if (feature.properties.ProMun > feature.properties["DEMANDA_ANIO_" + glo.DEMANDA_ANIO]) {
        color = "rgb(82,168,131)"
    } else { color = "red" }
    glo.layerStyle.setStyle({
        radius: feature.properties.RADIO,
        fillColor: color,
        color: "#00BFFF",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
    });
    $("#panel_superDerecho").show();
    BarsDemanda(feature.properties);
    if (!L.Browser.ie && !L.Browser.opera) {
        glo.layerStyle.bringToFront();
    }
}

function graficarDemandaMun(nomGraficaDemanda, dataGraficaDemanda, dataGraficaProduccion) {
    $('#GraficaDemanda').empty();
    if (glo.Anio != 0) {
        $('#GraficaDemanda').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Demanda'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: nomGraficaDemanda,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            credits: {
                text: 'Mineria-UPME',
                href: 'http://www.upme.gov.co'
            },
            series: [{
                name: 'Demanda',
                data: dataGraficaDemanda
            }, {
                name: 'Produccion',
                data: dataGraficaProduccion
            }
            ],
            exporting: {
                filename: 'Demanda por Sitio'
            }
        });
    }
};

function addCentroid(Arraycentroid) {
    
    Arraycentroid=calRadio(Arraycentroid);
    if (map.hasLayer(glo.lyrMate)) {
        map.removeLayer(glo.lyrMate);
    }
    var dataGraficaDemanda = [], nomGraficaDemanda = [],dataGraficaProduccion = [];
    if (map.hasLayer(glo.lyrMate)) {
        map.removeLayer(glo.lyrMate);
    }
    glo.lyrMate = L.geoJson(Arraycentroid, {
        onEachFeature: function (feature, layer) {
            layer.on({
                click: clickToFeature
            });
        },
        style: styleCircle,
        pointToLayer: function (feature, latlng) {
            //console.log(feature.properties.RADIO);
            var circle = L.circleMarker(latlng, styleCircle);
            var textlabel = '<center><b>DEMANDA</b></center>' +
                '<h6>' + feature.properties["Nombre"] + '</h6>' +
                '<small class="text-muted">Cantidad Demandada:</small> '+numeral(feature.properties["DEMANDA_ANIO_" + glo.DEMANDA_ANIO]).format('0,0') + ' ' + glo.UniMate +
                '<br><small class="text-muted">Cantidad Producida:</small> '+numeral(feature.properties.ProMun).format('0,0') + ' ' + glo.UniMate ;
            dataGraficaDemanda.push(feature.properties["DEMANDA_ANIO_" + glo.DEMANDA_ANIO]);
            dataGraficaProduccion.push(feature.properties.ProMun);
            nomGraficaDemanda.push(feature.properties["Nombre"]);
            circle.bindLabel(textlabel, { 'noHide': false });

            return circle
        }
    });
    glo.lyrMate.addTo(map).bringToFront();

    graficarDemandaMun(nomGraficaDemanda, dataGraficaDemanda, dataGraficaProduccion);
    controlcapas();
}*/


/*************************
OFERTA
**************************/

function onEachOferta(feature, layer) {

    var nombre;
    //console.log(feature);
    if ($("#selecEscala").val() == "Municipio") {
        nombre = feature.properties.MPIO_CNMBR+ ' - '+getDto(feature.properties.DPTO_CCDGO);
    } else if ($("#selecEscala").val() == "Departamento") {
        nombre = feature.properties.NOMBRE;
    }
    var textProme ='';
    if (feature.properties["CosPro_avg"]>0) {
        textProme='<br><small class="text-muted">Costo de Produccion Promedio:</small> ' +
         numeral(feature.properties["CosPro_avg"]).format('0,0') + ' $/' + glo.UniMate +
        '<br><small class="text-muted">Precio Venta Promedio:</small> ' +
                 numeral(feature.properties["PreVen_avg"]).format('0,0') + ' $/' + glo.UniMate;
    }
        
    var textlabel = '<center><b>OFERTA</b></center>' +
        '<h6>' + nombre + '</h6>';
    var htmlmapeo;
    if (glo.varMapeo == 'ProAct_sum') {
        htmlmapeo = '<small class="text-muted">Produccion Actual:</small> ' +
             numeral(feature.properties["ProAct_sum"]).format('0,0') + ' ' + glo.UniMate;
    } else {
        htmlmapeo = '<small class="text-muted">Oferta Instalada:</small> ' +
                 numeral(feature.properties["capInst_sum"]).format('0,0') + ' ' + glo.UniMate;
    }
    textlabel = textlabel + htmlmapeo;
    layer.bindLabel( textlabel,{ 'noHide': true });
}
function styleDptoOfer(feature) {
    return {
        weight: 1.5,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColor(feature.properties[glo.varMapeo]),
    };
};
function stylePoly(feature) {
    return {
        weight: 1.2,
        color: 'white',
        fillOpacity: 0.4,
        fillColor: 'white',
    };
};
function getIDMunDpt(filterOferta) {
    var idMun = [],idDepto=[],idMunDpto=[];
    //console.log(filterOferta);
    $.each(filterOferta.features, function (index, value) {
        idMun.push(value.properties.ID_DEPARTAMENTO + value.properties.ID_MUNICIPIO);
        idDepto.push(value.properties.ID_DEPARTAMENTO);
        value.properties.DPTOMUN = value.properties.ID_DEPARTAMENTO + value.properties.ID_MUNICIPIO;

    });
    
    var UniIdMun = idMun.unique();
    var UniIdDeto = idDepto.unique();
    //console.log(UniIdMun);
    //console.log(UniIdDeto);
    idMunDpto = [UniIdDeto,UniIdMun];
    return idMunDpto;
}

function getJsonMunFil(idMun) {
    var arraymun=[];
    $.each(idMun, function (index, value) {
        var filterOferta = turf.filter(glo.jsonMun, 'MPIO_CCNCT', value);
        arraymun.push(JSON.parse(JSON.stringify(filterOferta.features[0])));
    });
    var fc = turf.featurecollection(arraymun);
    return fc;
}

function clicklistaDptoMun(IdDptoMun) {
    $('#ListaCiudad .clearfix').removeClass('active');

    $('#DptoMun' + IdDptoMun).addClass('active');
}
function ListBusquedaMunDpto(fc) {
    var active = '';
    if (glo.listDtoMun == '') {
        active = '';
    }

    if(fc.properties.MPIO_CCNCT==undefined){
        glo.listDtoMun =
        glo.listDtoMun + '<li class="left">' +
        '<div id="DptoMun' + fc.properties.CODIGO_DEP +
            '" class="clearfix ' + active + '" onclick="clicklistaDptoMun(\'' + fc.properties.CODIGO_DEP + '\')">' +
                '<h5>' +fc.properties.NOMBRE
                + '</h5>' +
            '</div>' +
        '</li>';

    }else{
        glo.listDtoMun =
        glo.listDtoMun + '<li class="left">' +
        '<div id="DptoMun' + fc.properties.MPIO_CCNCT +
            '" class="clearfix ' + active + '" onclick="clicklistaDptoMun(\'' + fc.properties.MPIO_CCNCT + '\')">' +
                '<h5>' + fc.properties.MPIO_CNMBR
                + '</h5>' +
            '</div>' +
        '</li>';
    }
    
}

function calEstadisticasMun(polygons, points, vec,filtro) {
    var arraymun = [];
    glo.listDtoMun = '';
    $("#DivListaCiudad").empty().append('<div id="ListaCiudad"><ul class="chat"></ul></div></div>');
    $.each(vec, function (index, value) {
        var filterOferta = turf.filter(points, filtro[0], value);
        //if (value == '66') { console.log(filterOferta);}
        var aggregated = turf.aggregate(glo.extend, filterOferta, glo.aggregations);
        var filter = turf.filter(polygons, filtro[1], value);
        
        filter.features[0].properties.capInst_sum = aggregated.features[0].properties.capInst_sum
        filter.features[0].properties.numEmp_sum=aggregated.features[0].properties.numEmp_sum
        filter.features[0].properties.CosPro_avg=aggregated.features[0].properties.CosPro_avg
        filter.features[0].properties.ProAct_sum=aggregated.features[0].properties.ProAct_sum
        filter.features[0].properties.PreVen_avg=aggregated.features[0].properties.PreVen_avg
        filter.features[0].properties.point_count=aggregated.features[0].properties.point_count
        arraymun.push(JSON.parse(JSON.stringify(filter.features[0])));
        //console.log(filter.features[0]);
        ListBusquedaMunDpto(filter.features[0]);
    });
    

    var fc = turf.featurecollection(arraymun);
    
    $("#ListaCiudad .chat").empty().prepend(glo.listDtoMun).searchable({
        searchField: '#searchCiudad',
        selector: 'li',
        childSelector: '.clearfix',
        show: function (elem) {
            elem.slideDown(100);
        },
        hide: function (elem) {
            elem.slideUp(100);
        }
    });;

    var removeAggregated = turf.remove(fc, glo.varMapeo, 0);

    if (removeAggregated.features.length > 0) {
        //console.log(removeAggregated);
        if (removeAggregated.features.length > 5) {
            glo.breaks = turf.jenks(removeAggregated,  glo.varMapeo, 5);
        } else {
            glo.breaks = turf.jenks(removeAggregated,  glo.varMapeo, removeAggregated.features.length - 1);
        }
        glo.breaks = glo.breaks.unique();
        if (glo.breaks != null) {
            if (glo.breaks[0] != 0) {
                glo.breaks.unshift(0);
            }
        } else {
            glo.breaks = [];
            glo.breaks.push(0);
        }

    } else {
        glo.breaks = [];
        glo.breaks.push(0);
    }

    $.each(fc.features, function (index, value) {
        if (isNaN(value.properties.CosPro_avg)) {
            value.properties.CosPro_avg = 0;
            value.properties.PreVen_avg = 0;
        }
    });
    ///console.log(fc);
    return fc;
}



function addOferta(filterOferta) {
    var aggregados = '';
    if (map.hasLayer(glo.lyrBaseMunDpto)) {
        map.removeLayer(glo.lyrBaseMunDpto);
    }
    if ($("#selecEscala").val() == "Municipio") {
        var idMunDpt = getIDMunDpt(filterOferta);
        var idMun = idMunDpt[1];
        glo.lyrBaseMunDpto = L.geoJson(glo.jsonMun, {
            style: stylePoly
        }).addTo(map);
        aggregados = calEstadisticasMun(glo.jsonMun, filterOferta, idMun,['DPTOMUN','MPIO_CCNCT']);
        
    } else if ($("#selecEscala").val() == "Departamento") {
        var idMunDpt = getIDMunDpt(filterOferta);
        var idDpto = idMunDpt[0];
        glo.lyrBaseMunDpto = L.geoJson(glo.jsonDto, {
            style: stylePoly
        }).addTo(map);
        aggregados = calEstadisticasMun(glo.jsonDto, filterOferta, idDpto,['ID_DEPARTAMENTO','CODIGO_DEP'] );
    }
    
    
    if (map.hasLayer(glo.lyrOferta)) {
        map.removeLayer(glo.lyrOferta);
    }
    
    glo.lyrOferta = L.geoJson(aggregados, {
        onEachFeature: onEachOferta,
        style: styleDptoOfer
    });

    glo.lyrOferta.addTo(map).bringToBack();

    if (map.hasLayer(glo.lyrBaseMunDpto)) {
        glo.lyrBaseMunDpto.bringToBack();
    }
    //controlcapas();
}

/*map.on('overlayadd', function (eventLayer) {
    if (eventLayer.name === 'Demanda') {
        glo.lyrMate.bringToFront();
    }
    if (eventLayer.name === 'Oferta' ) {
        glo.lyrMate.bringToFront();
    }
});*/
