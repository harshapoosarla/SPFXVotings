import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './VotingsassignmentWebPart.module.scss';
import * as strings from 'VotingsassignmentWebPartStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';
import * as pnp from 'sp-pnp-js';
import Chart from 'chart.js';
import {GoogleCharts} from 'google-charts';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { SPListItem } from '@microsoft/sp-page-context';
require('bootstrap');

export interface IVotingsassignmentWebPartProps {
  description: string;
}

export default class VotingsassignmentWebPart extends BaseClientSideWebPart<IVotingsassignmentWebPartProps> {

  public render(): void {
    var URL = this.context.pageContext.web.absoluteUrl;
    var SelectedButtonID;
    var CurrentUserEmail = this.context.pageContext.user.email;
    var CurrentUserId;
    var ArrayLocation =[];
    var ArrayLocationVotes=[[]];
    var PieChartDataLegends=[['Location','Votes'] ];
    var PieChartData;
    var a;
    var PreviousSelctedOptionID;
    var PreviousSelectedOptionID;


    let url = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(url);
    this.domElement.innerHTML = `
      <div class="${ styles.votingsassignment }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }"></span>
              <p class="${ styles.subTitle }"></p>
              
              <div class="row venuesrow"></br>
                
                <div id="myvenues" class="col-md-8">
              
                </div>
              </div>


              </br>
              <button id="submitbutton" type="button" class="btn-primary btn-sm">Submit</button>
              </br>
              </br>
              
              <div id="piechart" style="background-color:powderblue">
              <h3>Voting results for Venue</h3>
              <canvas id="pie-chart" width="50%" height="50%"></canvas>
              </div>

              <div id="chart1" style="background-color:powderblue">
              
              </div>
            
            </div>
          </div>
        </div>
      </div>`;
      $(document).on("click", ".votebutton", function () {
        SelectedButtonID = 0;
        var clicked = $(this);
        if (clicked.hasClass('active')) {
          $('.votebutton').prop('disabled', false);
          clicked.removeClass('active');
        } else {
          $('.votebutton').prop('disabled', true);
          clicked.prop('disabled', false).addClass("active");
        }
      });
      $(document).ready(function(){

      //GoogleCharts.load(drawChart);
      function drawChart() {

        PieChartData=PieChartDataLegends;
    ArrayLocationVotes.forEach(element => {
      PieChartData.push(element);
    }); 
      // Standard google charts functionality is available as GoogleCharts.api after load
      const data = GoogleCharts.api.visualization.arrayToDataTable(PieChartData
    //     [
    //   ['Chart thing', 'Chart amount'],
    //   ['Lorem ipsum', 60],
    //   ['Dolor sit', 22],
    //   ['Sit amet', 18]
    // ]
    );
    const pie_1_chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('chart1'));
    pie_1_chart.draw(data);
 }

      /***********************Pie Chart**********************/
      new Chart(document.getElementById("pie-chart"), {
        type: 'pie',
        data: {
          labels: ["Hyderabad", "Visakhapatnam", "NewDelhi", "Bangalore"],
          datasets: [{
            label: "Votes (numbers)",
            backgroundColor: ["Green", "Cyan","Red","Orange"],
            data: [0,1,0,0]
          }]
        },
        options: {
          title: {
            display: true,
            //text: 'Voting results for Venue(2018)'
          }
        }
    });

    var callAssignDisplayItems = jQuery.ajax({
      url: URL+ "/_api/web/lists/getByTitle('HarshaVotes')/items?$select=Title,ID,VenueLookup/ID&$expand=VenueLookup/ID",
      type: "GET",
      dataType: "json",
      headers: {
        Accept: "application/json;odata=verbose"
      }
    });

    var call = jQuery.when(callAssignDisplayItems);
    call.done(function (data, textStatus, jqXHR) {

      jQuery.each(data.d.results, function (index, value) {

        /**---------- verifying if the user is present in the list or not------------- */
        if (value.Title == CurrentUserEmail) {
          CurrentUserId = value.ID;
          PreviousSelectedOptionID = value.VenueLookup.ID;
alert(PreviousSelectedOptionID);
          //CreateVenueButtons(SelectedBtnID);//calling button creation function
        }
        

      });
    });
    call.fail(function (jqXHR, textStatus, errorThrown) {
      var response = JSON.parse(jqXHR.responseText);
      var message = response ? response.error.message.value : textStatus;
      alert("Call failed. Error: " + message);
    });

          /********************* Display venue buttons **************/
        var call1 = jQuery.ajax({
          url:URL+ "/_api/Web/Lists/getByTitle('HarshaVenues')/Items?$select=Title,ID,TotalVotes",
           type: "GET",
           dataType: "json",
           headers: {
           Accept: "application/json; odata=verbose",
           "Content-Type": "application/json;odata=verbose"
           }
       });
       call1.done(function (data, textStatus, jqXHR) {     
       var Data = $('#myvenues');
       $.each(data.d.results, function (Title, element) {
        ArrayLocation[Title]=element.Title;
        ArrayLocationVotes[Title]=[element.Title,element.TotalVotes];
       Data.append("<button id='"+element.ID+"' type='button'class='btn active btn-lg btn-primary votebutton'>" + element.Title +  "</button></br>");
       
       
      });
      GoogleCharts.load(drawChart);
      
      if (true) {
        $('.votebutton').prop('disabled', true);
        $("#"+PreviousSelectedOptionID ).addClass("active").prop('disabled', false);
    }



      });
       call.fail(function (jqXHR, textStatus, errorThrown) {
       var response = JSON.parse(jqXHR.responseText);
       var message = response ? response.error.message.value : textStatus;
       alert("Call hutch failed. Error: " + message);
       });
       
       $(document).on("click", ".btn" , function() {
        a =  $(this).attr("id");
       alert('voting for'+ a);
     });
    }); 
     $(document).on("click", "#submitbutton" , function() {
     UpdateItem(a);

     GoogleCharts.load(drawChart1);
 
     function drawChart1() {
      PieChartData=[[]];
      var PieChartDataLegends=[['Location','Votes'] ];
      PieChartData=PieChartDataLegends;
      ArrayLocationVotes.forEach(element => {
        PieChartData.push(element);
      }); 
      
         // Standard google charts functionality is available as GoogleCharts.api after load
         const data = GoogleCharts.api.visualization.arrayToDataTable(PieChartData);
             //[ ['Chart thing', 'Chart amount'],
             // ['Lorem ipsum', 60],
             // ['Dolor sit', 22],
             // ['Sit amet', 18]
             //]
         
         const pie_1_chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('PieChart1'));
         pie_1_chart.draw(data);
     }
  });
          /*************** updating user responses into list ******************/
  function UpdateItem(a){

   alert('submit vote for'+a);
     pnp.sp.web.lists.getByTitle("HarshaVotes").items.getById(1).update({
     VenueLookupId: a
     });


     if(a!= PreviousSelectedOptionID){
      /* increase the vote count.... write function to post in venues votecount*/ 
      var OldLocationIndex= PreviousSelectedOptionID-1;
      var OldVoteCount=ArrayLocationVotes[OldLocationIndex][1]-1;
      

      var NewLocationIndex=a-1;
      var NewVoteCount=ArrayLocationVotes[NewLocationIndex][1]+1;

      /**----------- Members list updated----------------- */
      pnp.sp.web.lists.getByTitle("HarshaVenues").items.getById(PreviousSelectedOptionID).update({
        TotalVotes: OldVoteCount
        });


      pnp.sp.web.lists.getByTitle("HarshaVenues").items.getById(a).update({
      TotalVotes: NewVoteCount
      });
      /**----------- Members list updated----------------- */
      pnp.sp.web.lists.getByTitle("HarshaVotes").items.getById(1).update({
        VenueLookupId: a
      });

      }
      ArrayLocationVotes[OldLocationIndex][1]=OldVoteCount;      
      ArrayLocationVotes[NewLocationIndex][1]=NewVoteCount;
      PreviousSelectedOptionID=a;
    }
}
    //  function updateItem() {
    //       alert("entered update item");
    //       var call = jQuery.ajax({
    //           url: URL + "/_api/Web/Lists/getByTitle('HarshaVotes')/Items?$select=Title,ID",
    //           type: "GET",
    //           dataType: "json",
    //           headers: {
    //               Accept: "application/json;odata=verbose"
    //           }
    //       });
    //       call.done(function (data, textStatus, jqXHR) {
    //             var items = data.d.results;
    //             if (items.length > 0) {
    //                 var item = items[0];
    //                 updateItem(item);
    //             }
    //         });
    //         call.fail(function (jqXHR, textStatus, errorThrown) {
    //         });
    //     function updateItem(item) {
    //               var call = jQuery.ajax({
    //                   url: URL +"/_api/Web/Lists/getByTitle('HarshaVotes')/Items(" + item.Id + ")",
    //                   type: "POST",
    //                   data: JSON.stringify({
    //                       "__metadata": { type: "SP.Data.TasksListItem" },
    //                       Status: "In Progress",
    //                       PercentComplete: 0.10
    //                   }),
    //                   headers: {
    //                       Accept: "application/json;odata=verbose",
    //                       "Content-Type": "application/json;odata=verbose",
    //                       "X-Http-Method": "PATCH"
    //                   }
    //               });
    //               call.done(function (data, textStatus, jqXHR) {
    //                   var div = jQuery("#message");
    //                   div.text("Item updated");
    //               });
    //               call.fail(function (jqXHR, textStatus, errorThrown) {
    //               failHandler(jqXHR, textStatus, errorThrown);
    //               });
    //           }
    //this.getInfo();
      
    
  //   private getInfo() {
  //   let html: string = '';
  //   if (Environment.type === EnvironmentType.Local) {
  //     this.domElement.querySelector('#myvenues').innerHTML = "Sorry this does not work in local workbench";
  //   } else {
  //   this.context.spHttpClient.get
  //   (
  //     this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('HarshaVenues')?$select=Title,ID`, 
  //     SPHttpClient.configurations.v1)
  //     .then((response: SPHttpClientResponse) => {
  //       response.json().then((items: any) => {
  //         items.value.forEach(SPListItem => {
  //           html += `
  //           <button type="button" class="btn active btn-primary" value="${SPListItem.ID}">${SPListItem.Title}</button>`;
  //         });
  //         this.domElement.querySelector('#myvenues').innerHTML = html;
  //       });
  //     });        
  //   }
  // }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}