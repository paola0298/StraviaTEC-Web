using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
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
            return await _context.InscripcionEvento.FromSqlInterpolated($@"
            SELECT ""Id"", ""Id_evento"", ""Id_usuario"", ""Estado"", ""Progreso"", ""Comprobante_pago"", ""IdCategoriaCarrera""
            FROM ""INSCRIPCION_EVENTO""").ToListAsync();
            // return await _context.InscripcionEvento.ToListAsync();
        }

         // GET: api/Inscripciones/carrera
        [HttpGet("carrera")]
        public async Task<ActionResult<IEnumerable<InscripcionEvento>>> GetInscripcionCarrera()
        {
            return await _context.InscripcionEvento.FromSqlInterpolated($@"
            SELECT ""INSCRIPCION_EVENTO"".""Id"", ""Id_evento"", ""Id_usuario"", ""Estado"", ""Progreso"", ""Comprobante_pago"", ""IdCategoriaCarrera""
            FROM ""INSCRIPCION_EVENTO""
            JOIN ""EVENTO"" ON ""Id_evento"" = ""EVENTO"".""Id""
            JOIN ""TIPO_EVENTO"" ON ""TIPO_EVENTO"".""Id"" = ""Id_tipo_evento""
            WHERE ""TIPO_EVENTO"".""Nombre"" = 'Carrera'
            ").ToListAsync();
            // return await _context.InscripcionEvento.ToListAsync();
        }

        // GET: api/Inscripciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InscripcionEvento>> GetInscripcionEvento(int id)
        {
            // var inscripcionEvento = await _context.InscripcionEvento.FindAsync(id);
            var inscripcionEvento = await _context.InscripcionEvento.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_usuario"", ""Estado"", ""Progreso"", ""Comprobante_pago"", ""IdCategoriaCarrera""
                FROM ""INSCRIPCION_EVENTO""
                WHERE ""Id"" = {id}").FirstOrDefaultAsync();

            if (inscripcionEvento == null)
            {
                return NotFound();
            }

            return inscripcionEvento;
        }

        [HttpGet("carrera/{id}")]
        public async Task<ActionResult<Carrera>> GetCarreraEvento(int id) {
            var carrera = await _context.Carrera.FromSqlInterpolated($@"
                SELECT ""CARRERA"".""Id"", ""Nombre"", ""Id_recorrido"", ""Id_evento"", ""Fecha"", ""Costo""
                FROM ""CARRERA"" JOIN ""CATEGORIA_CARRERA"" 
                ON ""CARRERA"".""Id"" = ""Id_carrera""
                WHERE ""CATEGORIA_CARRERA"".""Id"" = {id}
            ").FirstOrDefaultAsync();

            if (carrera == null) {
                return NotFound();
            }

            return Ok(carrera);
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

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                UPDATE ""INSCRIPCION_EVENTO""
                SET ""Id_evento"" = {inscripcionEvento.IdEvento}, ""Id_usuario"" = {inscripcionEvento.IdUsuario}, 
                ""Estado"" = {inscripcionEvento.Estado}, ""Progreso"" = {inscripcionEvento.Progreso}, 
                ""Comprobante_pago"" = {inscripcionEvento.ComprobantePago}, ""IdCategoriaCarrera"" = {inscripcionEvento.IdCategoriaCarrera}
                WHERE ""Id"" = {id}
            ");
            // _context.Entry(inscripcionEvento).State = EntityState.Modified;

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
            var userExist = _context.Usuario.FromSqlInterpolated($@"
                SELECT ""User"", ""Password"", ""Nombre"", ""Apellido1"", ""Apellido2"", ""Fecha_nacimiento"", ""Nacionalidad"", ""Foto"", ""Es_organizador"" 
                FROM ""USUARIO"" 
                WHERE ""User"" = {inscripcionEvento.IdUsuario}").Any();
            var eventExist = _context.Evento.FromSqlInterpolated($@"
                SELECT ""Id""
                FROM ""EVENTO""
                WHERE ""Id"" = {inscripcionEvento.IdEvento}
            ").Any();

            if (!userExist || !eventExist) {
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El usuario o el evento dado no existen."));
            }

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""INSCRIPCION_EVENTO"" (""Id_evento"", ""Id_usuario"", ""Estado"", 
                ""Comprobante_pago"", ""IdCategoriaCarrera"")
                VALUES ({inscripcionEvento.IdEvento}, {inscripcionEvento.IdUsuario}, 
                'pendiente', {inscripcionEvento.ComprobantePago}, {inscripcionEvento.IdCategoriaCarrera})
            ");

            // inscripcionEvento.Estado = "pendiente";
            // _context.InscripcionEvento.Add(inscripcionEvento);
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                return StatusCode(500);
            }

            return Ok();

            // return CreatedAtAction("GetInscripcionEvento", new { id = inscripcionEvento.Id }, inscripcionEvento);
        }

        // DELETE: api/Inscripciones/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<InscripcionEvento>> DeleteInscripcionEvento(int id)
        {
            // var inscripcionEvento = await _context.InscripcionEvento.FindAsync(id);
            var inscripcionEvento = await _context.InscripcionEvento.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_usuario"", ""Estado"", ""Progreso"", ""Comprobante_pago"", ""IdCategoriaCarrera""
                FROM ""INSCRIPCION_EVENTO""
                WHERE ""Id"" = {id}").FirstOrDefaultAsync();
            if (inscripcionEvento == null)
            {
                return NotFound();
            }

            // _context.InscripcionEvento.Remove(inscripcionEvento);
            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                DELETE FROM ""INSCRIPCION_EVENTO"" WHERE ""Id"" = {id}");
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                return StatusCode(500);
            }

            return inscripcionEvento;
        }

        private bool InscripcionEventoExists(int id)
        {
            return _context.InscripcionEvento.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_usuario"", ""Estado"", ""Progreso"", ""Comprobante_pago"", ""IdCategoriaCarrera""
                FROM ""INSCRIPCION_EVENTO""
                WHERE ""Id"" = {id}").Any();
            // return _context.InscripcionEvento.Any(e => e.Id == id);
        }
    }
}
