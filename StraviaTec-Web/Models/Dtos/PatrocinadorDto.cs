
using System;
namespace StraviaTec_Web.Models.Dtos
{
    public class PatrocinadorDto
    {
        public int Id { get; set; }
        public string NombreComercial { get; set; }
        public string NombreRepresentante { get; set; }
        public string TelRepresentante { get; set; }
        public string Logo { get; set; }
    }
}