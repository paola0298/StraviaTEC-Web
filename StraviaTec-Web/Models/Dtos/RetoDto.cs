using System;
using System.Collections;
using System.Collections.Generic;

namespace StraviaTec_Web.Models.Dtos
{
    public partial class RetoDto
    {
    
        public int Id { get; set; }
        public int IdEvento { get; set; }
        public int IdTipoReto { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        public decimal Objetivo { get; set; }
        public int Actividad {get;set;}
        public bool EsPrivado{get;set;}
    }
}