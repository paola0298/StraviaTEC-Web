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
    public class RetoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RetoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Reto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reto>>> GetReto()
        {
            return await _context.Reto.ToListAsync();
        }

        // GET: api/Reto/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Reto>> GetReto(int id)
        {
            var reto = await _context.Reto.FindAsync(id);

            if (reto == null)
            {
                return NotFound();
            }

            return reto;
        }

        // PUT: api/Reto/id
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReto(int id, Reto reto)
        {
            if (id != reto.Id)
            {
                return BadRequest();
            }

            _context.Entry(reto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RetoExists(id))
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

        // POST: api/Reto
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Reto>> PostReto(Reto reto)
        {
            _context.Reto.Add(reto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReto", new { id = reto.Id }, reto);
        }

        // DELETE: api/Reto/id
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reto>> DeleteReto(int id)
        {
            var reto = await _context.Reto.FindAsync(id);
            if (reto == null)
            {
                return NotFound();
            }

            _context.Reto.Remove(reto);
            await _context.SaveChangesAsync();

            return reto;
        }

        private bool RetoExists(int id)
        {
            return _context.Reto.Any(e => e.Id == id);
        }
    }
}
