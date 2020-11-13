using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Xml;
using StraviaTec_Web.Models;
using System.Linq;
using StraviaTec_Web.Models.Requests;

namespace StraviaTec_Web.Helpers
{
    public static class GpxParser
    {
        public static List<Punto> Parse(string input, int idRecorrido = -1) 
        {
            var document = ToXmlDocument(input);

            var nsManager = new XmlNamespaceManager(document.NameTable);
            nsManager.AddNamespace("def", "http://www.topografix.com/GPX/1/1"); 
            nsManager.AddNamespace("gpxtpx", "http://www.garmin.com/xmlschemas/TrackPointExtension/v1");

            /*
            1. Sacar los segmentos de <trk>.
            2. Iterar sobre cada <trkseg>.
            3. Crear entidades Punto con cada <trkpt>.
            4. Devolver la lista de puntos creada.
            */

            var pointList = new List<Punto>();

            var root = document.DocumentElement;
            
            //Metadata
            var docTime = root.SelectSingleNode(@"./def:metadata/def:time[1]", nsManager);
            var docName = root.SelectSingleNode(@"./def:trk/def:name[1]", nsManager);
            var docType = root.SelectSingleNode(@"./def:trk/def:type[1]", nsManager);

            var segments = root.SelectNodes(@"./def:trk/def:trkseg", nsManager);

            for (int i = 0; i < segments.Count; i++)
            {
                var seg = segments[i];
                var points = seg.SelectNodes(@"def:trkpt", nsManager);

                for (int j = 0; j < points.Count; j++)
                {
                    var pt = points[j];
                    var lat = decimal.Parse(pt.Attributes["lat"].Value, CultureInfo.InvariantCulture);
                    var lng = decimal.Parse(pt.Attributes["lon"].Value, CultureInfo.InvariantCulture);
                    var time = DateTime.Parse(pt.SelectSingleNode(@"def:time[1]", nsManager).InnerText);
                    var elev = decimal.Parse(pt.SelectSingleNode(@"def:ele[1]", nsManager).InnerText, CultureInfo.InvariantCulture);

                    //Información extra
                    //TODO: incluir información extra en entidad Punto
                    var extensions = pt.SelectSingleNode("def:extensions/gpxtpx:TrackPointExtension[1]", nsManager); 
                    var heartRate = extensions.SelectSingleNode("gpxtpx:hr", nsManager).InnerText;
                    var temp = extensions.SelectSingleNode("gpxtpx:atemp", nsManager).InnerText;

                    pointList.Add(new Punto
                    {
                        IdRecorrido = idRecorrido,
                        Segmento = i,
                        Orden = j,
                        Tiempo = time,
                        Latitud = lat,
                        Longitud = lng,
                        Elevacion = elev
                    });
                }
            }

            return pointList;
        }
        public static List<PuntoSimple> ParseSimple(string input)
        {
            var points = Parse(input);
            var simplePoints = new List<PuntoSimple>();
            
            foreach (var punto in points)
            {
                simplePoints.Add(new PuntoSimple
                {
                    Segmento = punto.Segmento,
                    Orden = punto.Orden,
                    Lat = punto.Latitud,
                    Lng = punto.Longitud
                });
            }
            return simplePoints;
        }
        private static XmlDocument ToXmlDocument(string input) 
        {
            try
            {
                var data = Convert.FromBase64String(input[(input.IndexOf(",") + 1)..]);
                var document = new XmlDocument();
                using var stream = new MemoryStream(data);
                document.Load(stream);

                return document;
            } 
            catch (XmlException)
            {
                return null;
            } 
            catch (Exception)
            {
                return null;
            }
        }
    }
}