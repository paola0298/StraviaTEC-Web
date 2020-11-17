using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Requests;

namespace StraviaTec_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecorridosController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RecorridosController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{carreraId}")]
        public async Task<IActionResult> GetRecorridoAsync(int carreraId)
        {
            var carrera = await _context.Carrera
                .Where(c => c.Id == carreraId)
                .Include(c => c.IdRecorridoNavigation)
                    .ThenInclude(r => r.Punto)
                .FirstOrDefaultAsync();
            
            if (carrera == null)
                return NotFound();

            var puntos = carrera.IdRecorridoNavigation.Punto;

            var puntosSimples = new List<PuntoSimple>();

            foreach (var punto in puntos)
            {
                puntosSimples.Add(new PuntoSimple
                {
                    Lat = punto.Latitud,
                    Lng = punto.Longitud,
                    Orden = punto.Orden,
                    Segmento = punto.Segmento
                });
            }

            var response = new 
            {
                km = GpxParser.PointsToDistanceInKm(puntos.ToList()),
                duration = GpxParser.GetTotalTime(puntos.ToList()),
                points = puntosSimples
            };
            
            return Ok(response);
        }

        
    }
}