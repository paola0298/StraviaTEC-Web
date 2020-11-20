using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Requests;

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

        [HttpPost("inscripcion")]
        public async Task<IActionResult> InscripcionAsync(InscripcionReto info) {
            if (!RetoExists(info.IdReto)) {
                return BadRequest();
            }

            var userExist = _context.Usuario.FromSqlInterpolated($@"
                SELECT ""User"", ""Password"", ""Nombre"", ""Apellido1"", ""Apellido2"", ""Fecha_nacimiento"", ""Nacionalidad"", ""Foto"", ""Es_organizador"" 
                FROM ""USUARIO"" 
                WHERE ""User"" = {info.User}").Any();
            
            if (!userExist) {
                return BadRequest();
            }

            var reto = await _context.Reto.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_tipo_reto"", ""Inicio"", ""Fin"", ""Objetivo"" 
                FROM ""RETO"" WHERE ""Id"" = {info.IdReto}").FirstOrDefaultAsync();

            if (reto == null) {
                return BadRequest();
            }

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""INSCRIPCION_EVENTO"" (""Id_evento"", ""Id_usuario"", ""Estado"") 
                VALUES ({reto.IdEvento}, {info.User}, 'aprobado')");

            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool RetoExists(int id)
        {
            return _context.Reto.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_tipo_reto"", ""Inicio"", ""Fin"", ""Objetivo"" 
                FROM ""RETO"" WHERE ""Id"" = {id}").Any();
            // return _context.Reto.Any(e => e.Id == id);
        }
    }
}
