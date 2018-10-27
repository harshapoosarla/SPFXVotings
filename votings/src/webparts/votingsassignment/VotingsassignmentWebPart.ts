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

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { SPListItem } from '@microsoft/sp-page-context';
require('bootstrap');

export interface IVotingsassignmentWebPartProps {
  description: string;
}

export default class VotingsassignmentWebPart extends BaseClientSideWebPart<IVotingsassignmentWebPartProps> {

  public render(): void {
    var URL = this.context.pageContext.web.absoluteUrl;
    let url = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(url);
    this.domElement.innerHTML = `
      <div class="${ styles.votingsassignment }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }"></span>
              <p class="${ styles.subTitle }"></p>
              
              <div id="myvenues">
              
              </div></br>
              <button id="submitbutton" type="button" class="btn-primary btn-sm">Submit</button>
              
            
            </div>
          </div>
        </div>
      </div>`;
      $(document).ready(function(){
        

        var call = jQuery.ajax({
          url:URL+ "/_api/Web/Lists/getByTitle('HarshaVenues')/Items?$select=Title,ID",
           type: "GET",
           dataType: "json",
           headers: {
           Accept: "application/json; odata=verbose",
           "Content-Type": "application/json;odata=verbose"
           }
       });
       call.done(function (data, textStatus, jqXHR) {     
       var Data = $('#myvenues');
       $.each(data.d.results, function (Title, element) {
              
        Data.append("<button id='"+element.ID+"' type='button'class='btn active btn-lg btn-primary'>" + element.Title +  "</button>");
       });
       });
       call.fail(function (jqXHR, textStatus, errorThrown) {
       var response = JSON.parse(jqXHR.responseText);
       var message = response ? response.error.message.value : textStatus;
       alert("Call hutch failed. Error: " + message);
       });
       var a;
       $(document).on("click", ".btn" , function() {
        a =  $(this).attr("id");
       alert('voting for'+ a);
     });

     $(document).on("click", "#submitbutton" , function() {
      //var a =  $(this).attr("id");
      UpdateItem(a);
  });
  function UpdateItem(a){
    alert('voting for         '+ a);
     pnp.sp.web.lists.getByTitle("HarshaVotes").items.getById(1).update({
     VenueLookupId: a
     });

  }

      });
     
     
  
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
    //                       "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
    //                       "IF-MATCH": item.__metadata.etag,
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
