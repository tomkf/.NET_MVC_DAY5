using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static FoodVendorsOfYVR.Models.APIContext;

namespace FoodVendorsOfYVR.Controllers
{
    [Route("api/[controller]")]
    public class FoodVendorController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<FoodVendor> FoodVendors()
        {
            const string URL = "https://opendata.vancouver.ca/api/records/1.0/search/?dataset=food-vendors&rows=1000";
            string json = CallRestMethod(new Uri(URL));
            Rootobject obj = JsonConvert.DeserializeObject<Rootobject>(json);

            return Enumerable.Range(0, obj.records.Length).Select(index => new FoodVendor
            {
                key = obj.records[index].fields.key,
                longitude = obj.records[index].fields.geom.coordinates[0],
                latitude = obj.records[index].fields.geom.coordinates[1],
                lastSynced = DateTime.Now,
                description = obj.records[index].fields.description,
                location = obj.records[index].fields.location,
                vendor_type = obj.records[index].fields.vendor_type,
                business_name = obj.records[index].fields.business_name
            });
        }

        [HttpPost("action")]
        public IActionResult index(FoodVendor foodVendor)
        {
            return View();
        }

        static string CallRestMethod(Uri uri)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                StreamReader stream = new StreamReader(response.GetResponseStream(), Encoding.UTF8);

                string result = stream.ReadToEnd();

                response.Close();
                stream.Close();

                return result;
            }
            catch (Exception e)
            {
                string result = $"{{'Error: 'Error ocurred. Could not get {uri.LocalPath}' , 'Message':'{e.Message}'}}";
                return result;
            }

        }
    }
}