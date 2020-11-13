using AutoMapper;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Dtos;

namespace StraviaTec_Web.Helpers
{
    public class StraviaTecProfile: Profile
    {
        public StraviaTecProfile()
        {
            //Insertar mapeo de datos de una clase a otra
            CreateMap<Carrera, CarreraDto>();
            CreateMap<TipoActividad, TipoActividadDto>();
            CreateMap<Patrocinador, PatrocinadorDto>();
            CreateMap<Categoria, CategoriaDto>();
        }
    }
}