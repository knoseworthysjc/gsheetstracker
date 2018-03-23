var sjcArchiveOutput = Object.create(null, {
  parameters: {
    value: {},
  },
  models:{
    value:{
      "TRACKING":new tracking_model(),
    },
  },
  modules:{
    value:{
    }
  },
  authorize: {
    get: function () {
      var email = Session.getActiveUser().getEmail();
      if (email.indexOf("@stjoseph.com") !== -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  perms: {
    get: function () {
      return true;
    }
  },
  unAuthorizedTemplate: {
    value: 'html/unAuthorized'
  },
  AuthorizedTemplate: {
    value: 'html/index.html'
  },
  template: {
    get: function () {
      if (this.authorize) {
        return this.AuthorizedTemplate;
      } else {
        return this.unAuthorizedTemplate;
      }
    }
  },
  render: {
    value: function () {
      var template = HtmlService.createTemplateFromFile(this.template);
      results = template.evaluate();
      results.setFaviconUrl("https://s3.amazonaws.com/sjcarchiveassets/lib/images/favicon.ico");
      results.setTitle('SJC McKesson Archive Manager');
      results.addMetaTag('viewport', 'width=device-width, initial-scale=1');
      return results;
    }
  }
});
function doGet(e) 
{   
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  try{
    var archiveOutPut = Object.create(sjcArchiveOutput);
    archiveOutPut.parameters=e.parameter;
   return archiveOutPut.render();   
  }
  catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e.getMessage}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();  
  }
    
}
