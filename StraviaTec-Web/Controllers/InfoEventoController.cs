using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("tipo/{id}")]
        public async Task<IActionResult> GetTipoActividad(int id) 
        {
            var tipo = await _context.TipoActividad
                .Where(t => t.Id == id)
                .FirstOrDefaultAsync();

            if (tipo == null)
                return NotFound();

            return Ok(tipo);
        }

        [HttpGet("patrocinadores")]
        public IActionResult GetPatrocinadores()
        {
            var patrocinadores = _context.Patrocinador.Select(p => _mapper.Map<PatrocinadorDto>(p));
            return Ok(patrocinadores);
        }

        [HttpGet("patrocinadores/{eventoId}")]
        public async Task<IActionResult> GetPatrocinadoresAsync(int eventoId)
        {
            var evento = await _context.Evento
                .Where(e => e.Id == eventoId)
                .Include(e => e.PatrocinadorEvento)
                    .ThenInclude(p => p.IdPatrocinadorNavigation)
                .FirstOrDefaultAsync();

            var patrocinadores = new List<Patrocinador>();

            foreach (var patro in evento.PatrocinadorEvento)
            {
                patrocinadores.Add(patro.IdPatrocinadorNavigation);
            }

            return Ok(patrocinadores.Select(p => _mapper.Map<PatrocinadorDto>(p)));
        }

        [HttpGet("categorias")]
        public IActionResult GetCategorias() 
        {
            var categorias = _context.Categoria.Select(c => _mapper.Map<CategoriaDto>(c));
            return Ok(categorias);
        }

        [HttpGet("categorias/{carreraId}")]
        public async Task<IActionResult> GetCategoriasAsync(int carreraId) 
        {
            var carrera = await _context.Carrera
                .Where(c => c.Id == carreraId)
                .Include(c => c.CategoriaCarrera)
                    .ThenInclude(cat => cat.IdCategoriaNavigation)
                .FirstOrDefaultAsync();

            if (carrera == null)
                return NotFound();

            var categorias = new List<Categoria>();
            
            foreach (var cat in carrera.CategoriaCarrera)
            {
                categorias.Add(cat.IdCategoriaNavigation);
            }
 
            return Ok(categorias.Select(cat => _mapper.Map<Categoria, CategoriaDto>(cat)));
        }

        [HttpGet("cuentas/{carreraId}")]
        public IActionResult GetCuentas(int carreraId)
        {
            var cuentas = _context.CuentaBancaria
                .Where(c => c.IdCarrera == carreraId);

            if (cuentas == null || cuentas.Count() == 0)
                return NotFound();

            return Ok(cuentas.Select(c => _mapper.Map<CuentaBancariaDto>(c)));
        }

        [HttpGet("retos")]
        public IActionResult GetTiposReto() 
        {
            var retos = _context.TipoReto.Select(r => _mapper.Map<TipoRetoDto>(r));
            return Ok(retos);
        }

        [HttpGet("retos/{id}")]
        public async Task<IActionResult> GetTiposReto(int id) 
        {
            var tipo = await _context.TipoReto
                .Where(t => t.Id == id)
                .FirstOrDefaultAsync();

            if (tipo == null)
                return NotFound();

            return Ok(tipo);
        }

    }
}