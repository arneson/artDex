var soap = require('soap');
//example url
var url = 'https://analysis.artdatabankensoa.se/AnalysisService.svc?singleWsdl';

var soapHeader = ''//xml string for header


soap.createClient(url, function(err, client){
  client.addSoapHeader(soapHeader);

  var args = {
    StreetAddressLines: "5322 Otter Lane",
    CountrySpecificLocalityLine: "Middleberge FL 32068",
    Country: "USA"
  };

  client.BasicVerify(args, function(err, result){
   if(err){
     throw err;
   }
   console.log(result);
  });
});