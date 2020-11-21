namespace StraviaTec_Web.Models.Requests
{
    public class InscripcionCarrera
    {
        public string User { get; set; }
        public int IdCarrera { get; set; }
        public string ComprobantePago { get; set; }
        public int IdCategoriaCarrera { get; set;}
    }
}