using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Dtos;

namespace StraviaTec_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InfoEventoController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public InfoEventoController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("tipos")]
        public IActionResult GetTiposActividad()
        {
            var tipos = _context.TipoActividad.Select(t => _mapper.Map<TipoActividadDto>(t));
            return Ok(tipos);
        }

        [HttpGet("patrocinadores")]
        public IActionResult GetPatrocinadores()
        {
            var patrocinadores = _context.Patrocinador.Select(p => _mapper.Map<PatrocinadorDto>(p));
            return Ok(patrocinadores);
        }

        [HttpGet("categorias")]
        public IActionResult GetCategorias() 
        {
            var categorias = _context.Categoria.Select(c => _mapper.Map<CategoriaDto>(c));
            return Ok(categorias);
        }

        [HttpGet("retos")]
        public IActionResult GetTiposReto() 
        {
            var retos = _context.TipoReto.Select(r => _mapper.Map<TipoRetoDto>(r));
            return Ok(retos);
        }

    }
}