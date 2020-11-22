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

            return Ok(resultado.Except(res).Where(p => !p.EsOrganizador));
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

        [HttpGet("actividades/{username}")]
        public async Task<ActionResult<Actividad>> GetActividadesUsuario(string username) {

            if (!UsuarioExists(username)) {
                return BadRequest();
            }

            var amigos = new List<Usuario>();
            var search = _context.UsuarioAmigo.AsNoTracking().Where(u => u.IdUsuario == username).ToList();

            foreach (var amigo in search) {
                var amigoUser = await _context.Usuario.FirstOrDefaultAsync(p => p.User == amigo.IdAmigo);

                if (amigoUser == null) continue;

                amigos.Add(amigoUser);
            }

            var actividadesUsuarios = new List<List<Actividad>>();
            foreach (var amigo in amigos)
            {
                var actividades = await _context.Actividad.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_usuario"", ""Id_tipo_actividad"", ""Id_recorrido"", ""Fecha"", 
                ""Duracion"", ""Kilometros"", ""Es_evento"", ""Id_evento""
                FROM ""ACTIVIDAD""
                WHERE ""Id_usuario"" = {amigo.User}")
                .Include(a => a.IdEventoNavigation)
                .Include(a => a.IdRecorridoNavigation)
                .Include(a => a.IdTipoActividadNavigation)
                .Include(a => a.IdUsuarioNavigation)
                .ToListAsync();

                if (actividades == null) continue;

                actividadesUsuarios.Add(actividades);
            }


            return Ok(actividadesUsuarios);
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
