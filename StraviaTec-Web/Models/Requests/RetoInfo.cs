using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models.Requests
{
    public class RetoInfo
    {
        public string Nombre{get;set;}
        public DateTime Inicio{get;set;}
        public DateTime Fin{get;set;}
        public int Objetivo{get;set;}
        public int IdTipoReto{get;set;}
        public int IdActividad{get;set;}
        public List<int> Patrocinadores { get; set; }
        public List<int> Grupos { get; set; }
        public bool EsPrivado { get; set; }
    }
}