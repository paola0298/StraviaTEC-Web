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
            var Usuario = await _context.Usuario.FindAsync(username);
            var res = new List<Usuario>
            {
                Usuario
            };
            var resultado = new List<Usuario>();
            foreach(var term in terminos){
                var temp = _context.Usuario.Where(u => u.Nombre.ToLower().Contains(term.ToLower()) || u.Apellido1.ToLower().Contains(term.ToLower())
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
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuario()
        {
            return await _context.Usuario.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(string id)
        {
            var Usuario = await _context.Usuario.FindAsync(id);

            if (Usuario == null)
            {
                return NotFound();
            }

            return Usuario;
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(string id, Usuario Usuario)
        {
            if (id != Usuario.User)
            {
                return BadRequest();
            }

            _context.Entry(Usuario).State = EntityState.Modified;

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
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario Usuario)
        {
            Usuario.Password = Encryption.EncryptSha256(Usuario.Password);

            _context.Usuario.Add(Usuario);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UsuarioExists(Usuario.User))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUsuario", new { id = Usuario.User }, Usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Usuario>> DeleteUsuario(string id)
        {
            var Usuario = await _context.Usuario.FindAsync(id);
            if (Usuario == null)
            {
                return NotFound();
            }

            _context.Usuario.Remove(Usuario);
            await _context.SaveChangesAsync();

            return Usuario;
        }

        private bool UsuarioExists(string id)
        {
            return _context.Usuario.Any(e => e.User == id);
        }
    }
}
