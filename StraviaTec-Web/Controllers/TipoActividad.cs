using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
using StraviaTec_Web.Models;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoActividadController : ControllerBase
    {
       
        private readonly AppDbContext _context;

        public TipoActividadController(AppDbContext context)
        {
            _context = context;
        } 
         [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoActividad>>> GetActividad()
        {
            return await _context.TipoActividad.ToListAsync();
        }
    }
}