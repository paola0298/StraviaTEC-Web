using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Models;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InscripcionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InscripcionesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Inscripciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InscripcionEvento>>> GetInscripcionEvento()
        {
            return await _context.InscripcionEvento.ToListAsync();
        }

        // GET: api/Inscripciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InscripcionEvento>> GetInscripcionEvento(int id)
        {
            var inscripcionEvento = await _context.InscripcionEvento.FindAsync(id);

            if (inscripcionEvento == null)
            {
                return NotFound();
            }

            return inscripcionEvento;
        }

        // PUT: api/Inscripciones/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInscripcionEvento(int id, InscripcionEvento inscripcionEvento)
        {
            if (id != inscripcionEvento.Id)
            {
                return BadRequest();
            }

            _context.Entry(inscripcionEvento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InscripcionEventoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Inscripciones
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<InscripcionEvento>> PostInscripcionEvento(InscripcionEvento inscripcionEvento)
        {
            _context.InscripcionEvento.Add(inscripcionEvento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInscripcionEvento", new { id = inscripcionEvento.Id }, inscripcionEvento);
        }

        // DELETE: api/Inscripciones/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<InscripcionEvento>> DeleteInscripcionEvento(int id)
        {
            var inscripcionEvento = await _context.InscripcionEvento.FindAsync(id);
            if (inscripcionEvento == null)
            {
                return NotFound();
            }

            _context.InscripcionEvento.Remove(inscripcionEvento);
            await _context.SaveChangesAsync();

            return inscripcionEvento;
        }

        private bool InscripcionEventoExists(int id)
        {
            return _context.InscripcionEvento.Any(e => e.Id == id);
        }
    }
}
