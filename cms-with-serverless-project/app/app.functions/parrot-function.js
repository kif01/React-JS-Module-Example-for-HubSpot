const hubspot = require('@hubspot/api-client');
//require('dotenv').config();

exports.main = async (context) => {

  const tableId = "19596981";
  const hubspotClient = new hubspot.Client({"accessToken": "ADD TOKEN HERE"});


  if (context.method === 'GET') {
    let topicOptions =[];
    let typeOptions =[];
    let industryOptions =[];
    let audienceOptions =[];
   

    try {
      const apiResponse = await hubspotClient.cms.hubdb.tablesApi.getTableDetails(tableId);
      console.log(JSON.stringify(apiResponse.columns[2])); 

      
      let topicsCol = apiResponse.columns[2]; //accesss topic column
      let typesCol = apiResponse.columns[3]; //access types column
      let industriesCol = apiResponse.columns[4]; //access industries column
      let audienceCol = apiResponse.columns[5] //access audience column
     
      

      for (let i = 0; i < topicsCol.options.length; i++) {

        topicOptions.push(topicsCol.options[i].name);
        }

      for (let i = 0; i < typesCol.options.length; i++) {

          typeOptions.push(typesCol.options[i].name);
        }

        for (let i = 0; i < industriesCol.options.length; i++) {

          industryOptions.push(industriesCol.options[i].name);
        }

        for (let i = 0; i < audienceCol.options.length; i++) {

          audienceOptions.push(audienceCol.options[i].name);
        }

        let result = {types: typeOptions, industries: industryOptions, topics: topicOptions, audience: audienceOptions}
        console.log("FINAL:" + result);



        return{
       
          statusCode: 200,
          //body: JSON.stringify(topicOptions)
          //body: topicOptions
          body: {types: typeOptions, industries: industryOptions, topics: topicOptions, audience: audienceOptions}
      };
      


    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }

   
   
   

}else if (context.method === 'POST'){

  

  //const { name, email } = context.body;
  const { title, link, topics, industry, type, audience } = context.body;

  
  
  let values = "";
  

 

  // Input validation
  if (!title || !link) {
    console.log("PARROOT!!");
    return {
      
      statusCode: 400,
      body: JSON.stringify({ message: `Missing required fields!!!!!${name}` }),
    };
  }

  
  let topicArray = topics;
  console.log("HERE"+topicArray.length+" "+topicArray);
  let topicOptions = [];

  for (let i = 0; i < topicArray.length; i++) {
    let option = { "name": topicArray[i], "type":"option"};
    topicOptions.push(option);
    }

  

  values = {"title": title, 
            "link":link,
            "category": topicOptions,
            "industry": {"name":industry, "type": "option"},
            "type": {"name":type, "type":"option"},
            "audience": {"name": audience, "type":"option"},          
          };


console.log("Topics: "+ values["category"]);

  const HubDbTableRowV3Request = { path: "", childTableId: 0, values, name: "", displayIndex: 0 };
  try {
    const apiResponse = await hubspotClient.cms.hubdb.rowsApi.createTableRow(tableId, HubDbTableRowV3Request);
    console.log(JSON.stringify(apiResponse, null, 2));
    hubspotClient.cms.hubdb.tablesApi.publishDraftTable(tableId, false);
    return{
      body: JSON.stringify({ message: 'Data added successfully' })
    };  
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }

 

    return{
     
      body: JSON.stringify({ message: 'Topics:'+ values["category"] }),
    };

}
};





