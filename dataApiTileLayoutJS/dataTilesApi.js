$.myevents = $.myevents || {};
var showdata = new Array();
var partitions=0;
var maxsize=0;
var lipergrid=8;
var groupid=1;
var maxslide=0;
$(function($){

$.fn.myeventsapitiles =function(options){
      var settings= $.extend({
          data:new Array(),
          ratio:0
      },options);

        var data = settings.data;

        this.each(function() {
            var me = $(this);
            me.html("");

            //SHOW DIALOG
            function showdialog(value)
            {
                $("#largedescription").html(value.description);
                $("#largetitle").html(value.title);
                $("#largeimage").attr("src",value.images[displayratiolarge]);
                $("#largeimagedialog").css("display","inherit");
                $("#overlayBG").removeClass("hidden");

            }

            function rendercurrent(currentslide,currentslidemin) {
                $(".carousel-wrapper").css("width", ((Math.floor((showdata.length) / lipergrid)+1) * 1100).toString() + "px");
                maxslide = (Math.floor(showdata.length / lipergrid) * 1100) * -1;
                me.html("");
                $(".carousel-wrapper").css("left", "0px");
                $("#previous").hide();

                if (showdata.length < lipergrid)
                {
                    $("#next").hide();
                }
                else
                {
                    $("#next").show();
                }

                $.each(showdata, function (index, value) {
                  
                    if(index==0 || index%lipergrid==0) {
                        var templategroupul='<div class="tile-group"><ul id="group-'+groupid+'" class="capi-tiles"></ul></div>';
                        me.append(templategroupul);
                        groupid++;
                    }
                            var tile = '<li id="myeventsitemholderitem_' + index.toString() + '" class="myeventslistitem"><ul id="myeventsitemholder_' + index.toString() + '"></ul></li>' +
                                '</li>';
                            $('#group-'+(groupid-1).toString()).append(tile);
                            var loader = $('#myeventsitemholder_' + index.toString());
                            //console.log(loader);
                            loader.append('<li><img id="myeventsimgindex_' + index.toString() + '" class="currentratio" src="' + value.images[displayratio] + '"></li>');
                         //need a callback after html has loaded
                            $('ul#capi-tiles-main > li:nth-child(2)').addClass("newrow");
                            switch(value.cat)
                            {
                                case "music":
                                {
                                    loader.append('<li class="overlaymusic">&nbsp;</li>');
                                    break;
                                }
                                case "sports":
                                {
                                    loader.append('<li class="overlaysport">&nbsp;</li>');
                                    break;
                                }
                                case "complimentary":
                                {
                                    loader.append('<li class="overlaycomp">&nbsp;</li>');
                                    break;
                                }
                                case "family":
                                {
                                    loader.append('<li class="overlayfamily">&nbsp;</li>');
                                    break;
                                }
                            }
                            loader.append('<li class="myeventsitemtitle">' + value.title + '</li>');

                            $('#myeventsitemholderitem_' + index.toString()).on("click", function () {


                                showdialog(value);

                            });
                });
            }

            this.shuffle=function(array) {
                var currentIndex = array.length, temporaryValue, randomIndex ;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

            this.applydatafilter = function (filter) {
                showdata = new Array();

               // current=8;
                switch (filter) {
                    case "EventTitle1":
                    {
                        $.each(data.results.sports,function(index,value){
                            value.cat="EventTitle1";
                            showdata.push(value);
                        });
                        break;
                    }
                    case "EventTitle2":
                    {
                        $.each(data.results.hero,function(index,value){
                            value.cat="EventTitle2";
                            showdata.push(value);
                        });
                        break;
                    }
                    case "EventTitle3":
                    {
                        $.each(data.results.family,function(index,value){
                            value.cat="EventTitle3";
                            showdata.push(value);
                        });

                        break;
                    }
                    case "EventTitle4":
                    {
                        $.each(data.results.music,function(index,value){
                            value.cat="EventTitle4";
                            showdata.push(value);
                           
                        });
                        break;
                    }
                    case "all":
                    {
                        showdata=new Array();
                        $.each(data.results.sports,function(index,value){
                            value.cat="EventTitle1";
                            showdata.push(value);
                        });
                        $.each(data.results.hero,function(index,value){
                            value.cat="EventTitle2";
                            showdata.push(value);
                        });
                        $.each(data.results.family,function(index,value){
                            value.cat="EventTitle3";
                            showdata.push(value);
                        });
                        $.each(data.results.music,function(index,value){
                            value.cat="EventTitle4";
                            showdata.push(value);
                        });

                        showdata = this.shuffle(showdata);

                        break;
                    }


                }

                rendercurrent(32,0);
             }
        });
        return this;

    };

}(jQuery));