using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Models;
using System.Linq;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("buscar/{username}/{parametro}")]
        public async Task<IActionResult> GetBusquedaAsync(string username, string parametro) {
            var terminos = parametro.Split(" ", System.StringSplitOptions.RemoveEmptyEntries);
            var usuario = await _context.USUARIO.FindAsync(username);
            var res = new List<Usuario>();
            res.Add(usuario);
            var resultado = new List<Usuario>();
            foreach(var term in terminos){
                var temp = _context.USUARIO.Where(u => u.Nombre.ToLower().Contains(term.ToLower()) || u.Apellido1.ToLower().Contains(term.ToLower())
                  || u.Apellido2.ToLower().Contains(term.ToLower()) || u.User.ToLower().Contains(term.ToLower()));

                var unique = temp.Where(t => !resultado.Contains(t));
                resultado.AddRange(unique);
            }

            if (resultado.Count == 0) {
                return NotFound();
            }

            return Ok(resultado.Except(res));
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUSUARIO()
        {
            return await _context.USUARIO.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(string id)
        {
            var usuario = await _context.USUARIO.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(string id, Usuario usuario)
        {
            if (id != usuario.User)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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

        // POST: api/Usuarios
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _context.USUARIO.Add(usuario);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UsuarioExists(usuario.User))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUsuario", new { id = usuario.User }, usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Usuario>> DeleteUsuario(string id)
        {
            var usuario = await _context.USUARIO.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.USUARIO.Remove(usuario);
            await _context.SaveChangesAsync();

            return usuario;
        }

        private bool UsuarioExists(string id)
        {
            return _context.USUARIO.Any(e => e.User == id);
        }
    }
}
