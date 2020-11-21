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

            if (document == null)
                return new List<Punto>();

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

        public static double PointsToDistanceInKm(List<Punto> points)
        {
            // points.OrderBy((punto) => punto.Orden);
            points.Sort(new PuntoComparator());

            Punto lastPoint;
            double totalDistance = 0.0;
            var size = points.Count();
            
            for (int i = 1; i < size; i++)
            {
                lastPoint = points[i - 1];
                var currentPoint = points[i];

                totalDistance += ComputeDistanceInKm(lastPoint.Latitud, currentPoint.Latitud, lastPoint.Longitud, currentPoint.Longitud);
            }

            return totalDistance;
        }

        public static double GetTotalTime(List<Punto> points)
        {
            if (points.Count() == 0)
                return 0.0;

            points.OrderBy((punto) => punto.Orden);

            var first = points.First();
            var last = points.Last();
            
            var initialTime = first.Tiempo;
            var finalTime = last.Tiempo;

            TimeSpan duration = finalTime - initialTime;
            
            return duration.TotalMinutes;
        }

        private static double ComputeDistanceInKm(decimal lat1, decimal lat2, decimal lng1, decimal lng2)
        {
            var earthRadiusInKm = 6371;
            var dLat = DegreeToRad(lat2 - lat1);
            var dLng = DegreeToRad(lng2 - lng1);
            lat1 = DegreeToRad(lat1);
            lat2 = DegreeToRad(lat2);

            var a1 = Math.Sin((double) dLat / 2);
            var b1 = Math.Sin((double) dLng / 2);
            var a = a1 * a1 + b1 * b1 * Math.Cos((double) lat1) * Math.Cos((double) lat2);
            var b = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var c = earthRadiusInKm * b;
            return c;
        }

        private static decimal DegreeToRad(decimal degrees)
        {
            return degrees * ((decimal) Math.PI / 180);
        }
    }
}