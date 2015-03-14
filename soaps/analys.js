var soap = require('soap');
//example url
var url = 'https://analysis.artdatabankensoa.se/AnalysisService.svc?singleWsdl';

//var soapHeader = '<com:UserName>HackForSwedenUser</com:UserName><com:Password>Hack4Swe2</com:Password><com:ApplicationIdentifier>HackForSweden</com:ApplicationIdentifier>';//xml string for header
var soapHeader = '';

soap.createClient(url, function(err, client){
  client.addSoapHeader(soapHeader);

  var args = {
    userName: 'HackForSwedenUser',
    password: 'Hack4Swe2',
    applicationIdentifier: 'HackForSweden',
    isActiviationRequired:false
  };
  var polygons = [
    {
      LinearRings:
      [
        {
          Points:[
            {
              IsMSpecified:false,
              IsZSpecified:false,
              Y:58.004052,
              X:13.103709,
              M:13.103709,
              Z:13.103709
            },
            {
              IsMSpecified:false,
              IsZSpecified:false,
              Y:58.070934,
              X:15.355906,
              M:13.103709,
              Z:13.103709
            },
            {
              IsMSpecified:false,
              IsZSpecified:false,
              Y:57.251150,
              X:15.410838,
              M:13.103709,
              Z:13.103709
            },
            {
              IsMSpecified:false,
              IsZSpecified:false,
              Y:57.317950,
              X:13.276744,
              M:13.103709,
              Z:13.103709
            },
            {
              IsMSpecified:false,
              IsZSpecified:false,
              Y:58.004052,
              X:13.103709,
              M:13.103709,
              Z:13.103709
            }
          ]
        }
      ]
    }
  ];
  var args2 ={
    clientInformation : {
      Locale:0,
      Token: 0
    },
    searchCriteria:{
      //Polygons:polygons,
      TaxonIds:[101656],
      IncludePositiveObservations:true,
      IsAccuracySpecified:false
    },
    coordinateSystem:{
       Id: 5
     }
  };
  // var args = {
  //   parameters:{
  //     UserName:'HackForSwedenUser',
  //     Password:'Hack4Swe2',
  //     ApplicationIdentifier:'HackForSweden'
  //   }
  // };
  //var args = {input: 'UserName= HackForSwedenUser; Password=Hack4Swe2; ApplicationIdentifier=HackForSweden'};
  // var args = {
  //   WebCoordinateSystem:{
  //     Id: 'none',
  //     WKT: 'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))' 
  //   }
  // };
  client.wsdl.xml = "";
  client.xml = "";
  //console.log("client: ", Object.keys(client.AnalysisService.AnalysisServiceSOAP11Endpoint));
  //client.AnalysisService.AnalysisServiceSOAP11Endpoint.Login(args,function(err,result){
  client.AnalysisService.AnalysisServiceSOAP11Endpoint.Login(args,function(err,result){
    //console.log('err: ',err);
    //console.log('resp: ',result);
    delete result.LoginResult['User'];
    args2.clientInformation.Token = result.LoginResult.Token;
    args2.clientInformation.Locale = result.LoginResult.Locale;
   console.log("what i send: ", args2);
   /* console.log("Polygons: ", args2.searchCriteria.Polygons);
    console.log("LinearRings: ", args2.searchCriteria.Polygons[0].LinearRings);
    console.log("Points: ", args2.searchCriteria.Polygons[0].LinearRings[0].Points);*/
    client.AnalysisService.AnalysisServiceSOAP11Endpoint.GetTaxaWithSpeciesObservationCountsBySpeciesObservationSearchCriteria(args2,
    //client.AnalysisService.AnalysisServiceSOAP11Endpoint.GetStatus(args2,
      function(err,result){
          console.log("err2: ", err);
          console.log("what I receive: ",result);
      });
  });
});