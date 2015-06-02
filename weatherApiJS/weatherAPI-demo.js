/*COPYRIGHT JBEVANS 2015 - FREE TO USE MIT LICENSE*/
/*HTML TO CALL WEATHER API
$("#weatherDivID").openWeather({city:"Boston,US",backgroundimage:'../src/img/bgroundImage.jpg',animationspeed:500});
*/
/*WEATHER API*/
$.fn.openWeather = function(options){
    var settings = $.extend({
        key: "ApiKeyGoesHere",
        language: 'en',
        latitude:null,
        longitude:null,
        units: 'f',
        title: 'Title goes here',
        customIcons:'../src/img/icons/weather/',
        city:null,
        debug:true,
        backgroundimage:'../src/img/bgroundImage.jpg',
        animationspeed:1000,
        loadingimage:"../src/img/sprites.png"
    },options);
    var cSpeed=6;
    var cWidth=84;
    var cHeight=84;
    var cTotalFrames=75;
    var cFrameWidth=84;
    var currentid=null;
    var cImageTimeout=false;
    var cIndex=0;
    var cXpos=0;
    var cPreloaderTimeout=false;
    var SECONDS_BETWEEN_FRAMES=0;
    var weatherdata=null;
    var chartdata=null;
    var supportedcities=[
        {id:"",value:"--make a selection--"}
        ,{id:"7405",value:"Boston, US"}
        ,{id:"6392",value:"Cairo, EG"}
        ];
    function createselectbox(id)
    {
        var currentid=id+"_select";
        var template='<select class="cityselect" id="'+currentid+'">';
        $.each(supportedcities,function(index,value){

            template+='<option value="'+value.id+'">'+value.value+'</option>';
        })
        template+="</select>";

        return template;
    }

    function startAnimation(){
        $('#'+currentid+'_loaderImage').css('background-image','url('+settings.loadingimage+')');
        $('#'+currentid+'_loaderImage').css('width',cWidth+'px');
        $('#'+currentid+'_loaderImage').css('height',cHeight+'px');
       

        //FPS = Math.round(100/(maxSpeed+2-speed));
        FPS = Math.round(100/cSpeed);
        SECONDS_BETWEEN_FRAMES = 1 / FPS;

        cPreloaderTimeout=setTimeout(function(){continueAnimation();}, SECONDS_BETWEEN_FRAMES/1000);

    }

    function continueAnimation(){

        cXpos += cFrameWidth;
        //increase the index so we know which frame of our animation we are currently on
        cIndex += 1;

        //if our cIndex is higher than our total number of frames, we're at the end and should restart
        if (cIndex >= cTotalFrames) {
            cXpos =0;
            cIndex=0;
        }

       
        $('#'+currentid+'_loaderImage').css('background-position',(-cXpos)+'px 0');
        cPreloaderTimeout=setTimeout(function(){continueAnimation();}, SECONDS_BETWEEN_FRAMES*1000);
    }

    function stopAnimation(){//stops animation
        clearTimeout(cPreloaderTimeout);
        cPreloaderTimeout=false;
    }

    function imageLoader(s, fun)//Pre-loads the sprites image
    {
        clearTimeout(cImageTimeout);
        cImageTimeout=0;
        genImage = new Image();
        genImage.onerror=new Function('alert(\'Could not load the image\')');
        genImage.src=s;
    }

    //The following code starts the animation
    function recreategraph(id)
    {
        var currentid=id+"_select";

    }


    function geticon(icon)
    {
        if(icon===null) {
                return "";
            }
            //if customIcons isn't null
            if(settings.customIcons != null) {

                //define the default icon name
                var defaultIconFileName = icon;

                var iconName;

                var timeOfDay;


                //if default icon name contains the letter 'd'
                if(defaultIconFileName.indexOf('d') != -1) {

                    //define time of day as day
                    timeOfDay = 'day';

                } else {

                    //define time of day as night
                    timeOfDay = 'night';
                }

                //if icon is clear sky
                if(defaultIconFileName == '01d' || defaultIconFileName == '01n') {

                    iconName = 'clear';

                }

                //if icon is clouds
                if(defaultIconFileName == '02d' || defaultIconFileName == '02n' || defaultIconFileName == '03d' || defaultIconFileName == '03n' || defaultIconFileName == '04d' || defaultIconFileName == '04n') {

                    iconName = 'clouds';

                }

                //if icon is rain
                if(defaultIconFileName == '09d' || defaultIconFileName == '09n' || defaultIconFileName == '10d' || defaultIconFileName == '10n') {

                    iconName = 'rain';

                }

                //if icon is thunderstorm
                if(defaultIconFileName == '11d' || defaultIconFileName == '11n') {

                    iconName = 'storm';

                }

                //if icon is snow
                if(defaultIconFileName == '13d' || defaultIconFileName == '13n') {

                    iconName = 'snow';

                }

                //if icon is mist
                if(defaultIconFileName == '50d' || defaultIconFileName == '50n') {

                    iconName = 'mist';

                }

                //define custom icon URL
                return settings.customIcons+timeOfDay+'/'+iconName+'.png';

            } else {

                //define icon URL using default icon
                return 'apiURLgoesHere/img/w/'+icon+'.png';

            }
}

    function MonthConversion(monthval)
    {
        var month = new Array();
        month[0] = "01-01";
        month[1] = "02-15";
        month[2] = "03-15";
        month[3] = "04-15";
        month[4] = "05-15";
        month[5] = "06-15";
        month[6] = "07-15";
        month[7] = "08-15";
        month[8] = "09-15";
        month[9] = "10-15";
        month[10] = "11-15";
        month[11] = "12-31";
        return month[monthval];
    }

    function showerror()
    {
      // $('#'+id+'_stationstatus').html("Station Currently Down");

        $("#"+id+'_loaderholder').hide();
        $("#"+id+'_errorholder').show();
    }

    function changegraph(stationid,id,callback)
    {
        var unixCurrentDate = new Date();
        var unixLast30Days = unixCurrentDate.valueOf() - (30 * 24 * 60 *60 * 1000);
        var lastYear = new Date(unixCurrentDate).getFullYear()-1;
        var unixTimeStart = new Date(lastYear.toString()+"-01-01");
        var unixTimeEnd = new Date(lastYear.toString()+"-12-31");
        var timeStart = new Date(unixTimeStart);
        var timeEnd = new Date(unixTimeEnd);
        var todaysDate = $(unixCurrentDate.valueOf()/1000);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear()-1;
        var chartLine = today.getMonth();
        today = mm+'/'+15+'/'+yyyy;
        var appIDVal = "appIDGoesHEre";

        var uriCity = "apiURLgoesHere/station?id="+stationid+"&type=day&start="+(unixTimeStart.valueOf()/1000)+"&end="+(unixTimeEnd.valueOf()/1000)+"&APPID="+settings.key+"&";

        if(chartdata===null)
        {
            $("#"+id+"_num1").html("");
            $("#"+id+"_num2").html("");
            $("#"+id+"_num1").show();
            $("#"+id+"_num2").show();
            $.ajax({
            type:"Get",
            url: uriCity,
            success: function(data){

                chartdata=data;
                constructchart(data,id,"f",function(){

                    constructchart(data,id,"c",function(){
                        callback();

                        $("#"+id+"_chart_num1").css("display","none");
                        $("#"+id+"_chart_num2").css("display","none");

                        if(settings.units==='f')
                        {

                            $("#"+id+"_chart_num1").css("display","inherit");
                            
                        }
                        else{
                            $("#"+id+"_chart_num2").css("display","inherit");
                           
                        }


                    });

                });
            }
        }).fail(function(data){

                showerror();

            });
        }
        else
        {
            $("#"+id+"_chart_num1").css("display","none");
            $("#"+id+"_chart_num2").css("display","none");

            if(settings.units==='f')
            {

                $("#"+id+"_chart_num1").css("display","inherit");
               
            }
            else{
                $("#"+id+"_chart_num2").css("display","inherit");
                
            }
            callback();

        }
}

    function constructchart(data,id,unitval,callback)
    {

        var unixCurrentDate = new Date();
        var unixLast30Days = unixCurrentDate.valueOf() - (30 * 24 * 60 *60 * 1000);
        var lastYear = new Date(unixCurrentDate).getFullYear()-1;
        var unixTimeStart = new Date(lastYear.toString()+"-01-01");
        var unixTimeEnd = new Date(lastYear.toString()+"-12-31");
        var timeStart = new Date(unixTimeStart);
        var timeEnd = new Date(unixTimeEnd);
        var todaysDate = $(unixCurrentDate.valueOf()/1000);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear()-1;
        var chartLine = today.getMonth();
        today = mm+'/'+15+'/'+yyyy;
        var appIDVal = "appIDGoesHere";

        var tempholder=new Array();
        for(var g=0;g<12;g++)
        {
            var holderobject=new Object();
            holderobject.month = MonthConversion(g);
            holderobject.total = 0;
            holderobject.count = 0;
            holderobject.totalf=0;
            holderobject.year = 0;
            tempholder.push(holderobject);

        }

        if(data.list.length<=0)
        {
            showerror();
            return;

        }

        $('#'+id+'_stationstatus').html("Average Temperatures");

        $.each(data.list,function(index,element){
            var current =new Date(element.dt*1000).getMonth();
            var yearval=new Date(element.dt*1000).getFullYear();
            tempholder[current].year=yearval;
            if(unitval==='f')
            {
                tempholder[current].total+=  (element.temp.v - 273.15) * 9/5 + 32;
            }
            else
            {
                tempholder[current].total+=  element.temp.v - 273.15;
            }
            tempholder[current].count+=  1;
        });

        var MonthlyAvg=new Array();
        $.each(tempholder,function(index,element){
            MonthlyAvg.push(Math.floor(element.total/element.count));
        });

        var prevYear = [[tempholder[0].year+"-"+tempholder[0].month,MonthlyAvg[0]], [tempholder[1].year+"-"+tempholder[1].month,MonthlyAvg[1]], [tempholder[2].year+"-"+tempholder[2].month,MonthlyAvg[2]], [tempholder[3].year+"-"+tempholder[3].month,MonthlyAvg[3]], [tempholder[4].year+"-"+tempholder[4].month,MonthlyAvg[4]], [tempholder[5].year+"-"+tempholder[5].month,MonthlyAvg[5]], [tempholder[6].year+"-"+tempholder[6].month,MonthlyAvg[6]], [tempholder[7].year+"-"+tempholder[7].month,MonthlyAvg[7]], [tempholder[8].year+"-"+tempholder[8].month,MonthlyAvg[8]], [tempholder[9].year+"-"+tempholder[9].month,MonthlyAvg[9]], [tempholder[10].year+"-"+tempholder[10].month,MonthlyAvg[10]], [tempholder[11].year+"-"+tempholder[11].month,MonthlyAvg[11]]];
        //STYLE FOR CHART WITH AVERGAGE MONTHLY TEMPERATURES
        var currentMonthTemp = MonthlyAvg[chartLine];
        var colorGrad = "rgba(0,210,255, 0.6)";
        var currentMonthLine = new $.jsDate(today).getTime()
        //bground for chart if needed grid: grid
        var grid = {
            gridLineWidth: 1.5,
            gridLineColor: 'rgb(235,235,235)',
            drawGridlines: true
        };


        var numval;
        if(unitval==='f')
        {
            numval = "num1";
        }
        else{
            numval = "num2";
        }
        $("#"+id+"_"+numval).html('<div id="'+id+'_chart_'+numval+'" class="chartPos"></div>');
        var plot1 = $.jqplot(id+"_chart_"+numval, [prevYear], {
            seriesColors: ([colorGrad]),
            title: '',
            highlighter: {
                show: false,
                sizeAdjust: 1,
                tooltipOffset: 9
            },
            grid: {
                drawGridlines: false,
                background: 'rgba(57,57,57,0.0)',
                drawBorder: false,
                shadow: false,
                gridLineColor: '',
                gridLineWidth: 0
            },


            legend: {
                show: false,
                placement: 'outside'
            },
            seriesDefaults: {
                rendererOptions: {
                    smooth: true,
                    highlightMouseOver: false,
                    highlightMouseDown: false,
                    highlightColor: null,
                    animation: {
                        show: true
                    }
                },
                showMarker: false,
                pointLabels:{ show:true,  edgeTolerance: -15,  location:'n', ypadding:3 }
            },
            series: [
                {
                    fill: true,
                    label: ''
                },
                {
                    label: ''
                }
            ],
            axesDefaults: {
                rendererOptions: {
                    baselineWidth: 1.5,
                    baselineColor: '#444444',
                    drawBaseline: false
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        formatString: "%b",
                        angle: 0,
                        fontFamily: 'Yanone Kaffeesatz, sans-serif',
                        fontSize: '11pt',
                        fontWeight: 'bold',
                        textColor: '#ffffff'

                    },
                    min: "2013-01-01",
                    max: "2013-12-30",
                    tickInterval: "33 days",
                    drawMajorGridlines: false
                },

                yaxis: {
                    rendererOptions: {drawBaseline: false},
                    tickOptions: {
                        textColor: 'transparent',
                        showMark: false
                    },
                    drawMajorGridlines: false
                }
            },

            canvasOverlay: {
                show: true,


                objects: [
                    {verticalLine: {
                        name: 'currentMonth',
                        x: currentMonthLine,
                        lineWidth: 1,
                        yOffset: 0,
                        lineCap: 'butt',
                        ymax: currentMonthTemp,
                        color: '#ffffff',
                        shadow: false
                    }}
                ]
            }

        });

        callback();
    }



    function formatTime(unixTimestamp) {

        //define milliseconds using unix time stamp
        var milliseconds = unixTimestamp * 1000;

        //create a new date using milliseconds
        var date = new Date(milliseconds);

        //define hours
        var hours = date.getHours();

        //if hours are greater than 12
        if(hours > 12) {

            //calculate remaining hours in the day
            hoursRemaining = 24 - hours;

            //define hours as the reamining hours subtracted from a 12 hour day
            hours = 12 - hoursRemaining;
        }

        //define minutes
        var minutes = date.getMinutes();

        //convert minutes to a string
        minutes = minutes.toString();

        //if minutes has less than 2 characters
        if(minutes.length < 2) {

            //add a 0 to minutes
            minutes = 0 + minutes;
        }

        //construct time using hours and minutes
        var time = hours + ':' + minutes;

        return time;
    }

    function gettemperature()
    {

        if(settings.units == 'f') {

            //define temperature as fahrenheit
            return Math.round(((weatherdata.main.temp - 273.15) * 1.8) + 32) + '';

        } else {

            //define temperature as celsius
           return Math.round(weatherdata.main.temp - 273.15) + '';

        }
    }




    function fetchdata(callback) {
        var apiURL = 'http://api.openweathermap.org/data/weather?lang='+settings.language;
        //if city isn't null
        if(settings.city != null) {

            //define API url using city (and remove any spaces in city)
            apiURL += '&q='+settings.city.replace(' ', '');

        } else if(settings.latitude != null && settings.longitude != null) {

            //define API url using lat and lng
            apiURL += '&lat='+settings.latitude+'&lon='+settings.longitude;
        }

        //if api key was supplied
        if(settings.key != null) {
            //append api key paramater
            apiURL += '&APPID=' + settings.key;

        }


        if(weatherdata==null) {
            $.ajax({
                type: 'GET',
                url: apiURL,
                dataType: 'jsonp',
                success: function (data) {
                    weatherdata = data;
                    //set icon

                    callback();
                }
            }).fail(function(data){

                    showerror();

                });
        }
        else
        {
            callback();
        }


    }


    function switchtempsetting(val)
    {
        settings.units=val;


    }

    function updateweatherinterface(id)
    {
        $("#" + id + "_icon").attr("src", geticon(weatherdata.weather[0].icon));
        $("#" + id + "_temperature").html(gettemperature().toString());

    }


    var animationrunning=false;

    function createweatherholder(id)
    {
        currentid=id;
        var template='<div class="weatherholder" style="background-image:url('+settings.backgroundimage+');">';

           template+= '<div id="'+id+'_weatherholder" class="weatherholder2">';
        template+='<img src="" id="'+id+'_icon" class="weathericon"/>';
        template+='<div class="weatherdegrees"><span class="temperature" id="'+id+'_temperature"></span><a class="activeWeather" href="javascript:" id="'+id+'_changef"><span class="degreeF">O</span><span class="farH">F</span></a><a href="javascript:" id="'+id+'_changec"><span class="degreeC">O</span><span class="farC">C</span></a></div>';
        template+='<div id="'+id+'_stationstatus" class="averagetemp">Average Temperatures</div>';
        template+='<div id="'+id+'_num1" class="chartholder"></div>';
        template+='<div id="'+id+'_num2" class="chartholder"></div>';
        template+='<div class="weatherholder3" id="'+id+'_loaderholder" style="background-image:url('+settings.backgroundimage+');">';
        template+='<div id="'+id+'_loaderImage" class="loaderImage"></div>';
        template+='</div>';
        template+='<div class="weatherholder4" id="'+id+'_errorholder" style="background-image:url('+settings.backgroundimage+');display:none;">';
        template+='<div>Station Currently Down</div>';
        template+='</div>';



        return template;
    }
    var rettemplate ="<div>";
    if(settings.debug===true) {
        rettemplate = "<div><h3>" + settings.title + "</h3></div>";
    }
    var id=this.attr("id");
    if(settings.debug===true) {
        rettemplate += '<div>' + createselectbox(id) + '</div>';
    }
    rettemplate+=createweatherholder(id);
    rettemplate+="</div>";

this.html(rettemplate);

    $.support.cors = true;

    new imageLoader(settings.loadingimage, startAnimation());
if(settings.city!=null)
{

    var found =false;

    $.each(supportedcities,function(index,value){

        if(settings.city == value.value)
        {
          
            weatherdata=null;
            chartdata=null;
            fetchdata(function(){

                changegraph(value.id,id,function(){
                    updateweatherinterface(id);
                    $('#'+id+'_loaderholder').fadeOut(settings.animationspeed, function() {
                   
                    });

                });
            });
            found=true;
            return false;
        }
    });


    if(!found)
    {
        showerror();
    }

}
        $("#"+id+"_select").on("change", function(){
        $("#"+id+'_errorholder').hide();
        $('#'+id+'_loaderholder').fadeIn(settings.animationspeed, function() {
        var cityid=$("#"+id+"_select").val();
        settings.city=$("#"+id+"_select  option:selected").text();
        weatherdata=null;
        chartdata=null;
        fetchdata(function(){

            changegraph(cityid,id,function(){
                updateweatherinterface(id);
                $('#'+id+'_loaderholder').fadeOut(settings.animationspeed, function() {

                });

            });
        });
        });
      });

    $("#"+id+"_changef").on("click", function(){



        if(settings.units!='f') {

            if(animationrunning === true)
            {
                return;
            }
            animationrunning=true;


            $.each(supportedcities,function(index,value){

                if(settings.city == value.value) {

                    switchtempsetting('f');
                    $("#"+id+"_temperature").fadeOut(settings.animationspeed);
                    $("#"+id+"_num2").fadeOut(settings.animationspeed,function() {
                        fetchdata(function () {
                            changegraph(value.id, id, function () {

                                updateweatherinterface(id);
                                $("#" + id + "_changef").addClass("activeWeather");
                                $("#" + id + "_changec").removeClass("activeWeather");
                                $("#"+id+"_temperature").fadeIn(settings.animationspeed);
                                $("#"+id+"_num1").fadeIn(settings.animationspeed,function(){
                                    animationrunning=false;
                                });
                            });
                        });
                    });

                }
            });
        }

    });

    $("#"+id+"_changec").on("click", function(){

        if(settings.units!='c') {

            if(animationrunning === true)
            {
                return;
            }
            animationrunning=true;

            $.each(supportedcities,function(index,value){

                if(settings.city == value.value) {

                    switchtempsetting('c');
                    $("#"+id+"_temperature").fadeOut(settings.animationspeed);
                    $("#"+id+"_num1").fadeOut(settings.animationspeed,function(){
                    fetchdata(function(){
                        changegraph(value.id, id,function(){


                            updateweatherinterface(id);
                            $("#"+id+"_changec").addClass("activeWeather");
                            $("#"+id+"_changef").removeClass("activeWeather");
                            $("#"+id+"_temperature").fadeIn(settings.animationspeed);
                            $("#"+id+"_num2").fadeIn(settings.animationspeed,function(){
                                animationrunning=false;
                            });
                        });
                    });
                    });
                }
            });
        }
    });


    return this;

}
