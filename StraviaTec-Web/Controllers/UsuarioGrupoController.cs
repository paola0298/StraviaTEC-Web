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
    public class UsuarioGrupoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuarioGrupoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UsuarioGrupo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioGrupo>>> GetUsuarioGrupo()
        {
            var usuarioGrupo = await _context.UsuarioGrupo.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_usuario"", ""Id_grupo"" 
                FROM ""USUARIO_GRUPO""").ToListAsync();
            // return await _context.UsuarioGrupo.ToListAsync();
            return usuarioGrupo;
        }

        // GET: api/UsuarioGrupo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioGrupo>> GetUsuarioGrupo(int id)
        {
            // var usuarioGrupo = await _context.UsuarioGrupo.FindAsync(id);
            var usuarioGrupo = await _context.UsuarioGrupo.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_usuario"", ""Id_grupo"" 
                FROM ""USUARIO_GRUPO"" 
                WHERE ""Id"" = {id}").FirstOrDefaultAsync();
            
            if (usuarioGrupo == null)
            {
                return NotFound();
            }

            return usuarioGrupo;
        }

        // PUT: api/UsuarioGrupo/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuarioGrupo(int id, UsuarioGrupo usuarioGrupo)
        {
            if (id != usuarioGrupo.Id)
            {
                return BadRequest();
            }

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                UPDATE ""GRUPO""
                SET ""Id_grupo"" = {usuarioGrupo.IdGrupo}, ""Id_usuario"" = {usuarioGrupo.IdUsuario}
                WHERE ""Id"" = {usuarioGrupo.Id}
            ");
            // _context.Entry(usuarioGrupo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioGrupoExists(id))
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

        // POST: api/UsuarioGrupo
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<UsuarioGrupo>> PostUsuarioGrupo(UsuarioGrupo usuarioGrupo)
        {
            if (usuarioGrupo == null || string.IsNullOrWhiteSpace(usuarioGrupo.IdUsuario)) 
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El id del usuario y id del grupo no pueden ser null."));

            var userExist = _context.Usuario.FromSqlInterpolated($@"
                SELECT ""User"", ""Password"", ""Nombre"", ""Apellido1"", ""Apellido2"", ""Fecha_nacimiento"", ""Nacionalidad"", ""Foto"", ""Es_organizador"" 
                FROM ""USUARIO"" 
                WHERE ""User"" = {usuarioGrupo.IdUsuario}").Any();
            var groupExist = _context.Grupo.FromSqlInterpolated($@"
                SELECT ""Id"", ""Nombre"", ""Id_admin"" 
                FROM ""GRUPO"" 
                WHERE ""Id"" = {usuarioGrupo.IdGrupo}").Any();
            // var userExist = await _context.Usuario.AnyAsync(u => u.User == usuarioGrupo.IdUsuario);
            // var groupExist = await _context.Grupo.AnyAsync(g => g.Id == usuarioGrupo.IdGrupo);

            if (!userExist || !groupExist)
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El usuario o el grupo dado no existen."));


            // await _context.UsuarioGrupo.AddAsync(usuarioGrupo);
            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""USUARIO_GRUPO"" (""Id_grupo"", ""Id_usuario"") 
                VALUES ({usuarioGrupo.IdGrupo}, {usuarioGrupo.IdUsuario})");
            
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpGet("grupo/{username}")]
        public async Task<ActionResult<Grupo>> GetGruposUsuario(string username) {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El id del usuario no puede ser null."));

            var user = await _context.Usuario.FirstOrDefaultAsync(u => u.User == username);

            if (user == null)
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El usuario dado no existe."));

            try 
            {

                /**
                SELECT "GRUPO"."Id", "GRUPO"."Nombre", "GRUPO"."Id_admin"
                FROM "USUARIO_GRUPO" 
                JOIN "GRUPO" 
                ON "Id_grupo" = "GRUPO"."Id"
                WHERE "Id_usuario" = 'paola2'
                **/
                var grupos1 = await _context.Grupo.FromSqlInterpolated($@"
                    SELECT ""GRUPO"".""Id"", ""GRUPO"".""Nombre"", ""GRUPO"".""Id_admin""
                    FROM ""USUARIO_GRUPO""
                    JOIN ""GRUPO"" 
                    ON ""Id_grupo"" = ""GRUPO"".""Id""
                    WHERE ""Id_usuario"" = {username}
                ").ToListAsync();

                // var grupos = new List<Grupo>();
                // var search = await _context.UsuarioGrupo.FromSqlInterpolated($@"
                //     SELECT ""Id"", ""Id_grupo"", ""Id_usuario"" FROM ""USUARIO_GRUPO"" WHERE ""Id_usuario"" = {username}").ToListAsync();
                // // var search = _context.UsuarioGrupo.AsNoTracking().Where(u => u.IdUsuario == username).ToList();

                // foreach (var grupo in search) {
                //     // var grupoUser = await _context.Grupo.FirstOrDefaultAsync(g => g.Id == grupo.IdGrupo);
                //     var grupoUser = await _context.Grupo.FromSqlInterpolated(
                // $@"SELECT ""Id"", ""Nombre"", ""Id_admin"" FROM ""GRUPO"" WHERE ""Id"" = {grupo.Id}").FirstOrDefaultAsync();
                //     if (grupoUser == null) continue;

                //     grupos.Add(grupoUser);
                // }
                return Ok(grupos1);
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500);
            }

        }

        [HttpGet("usuarios/{idGrupo}")]
        public async Task<ActionResult<Usuario>> GetUsuariosGrupo(int idGrupo) {
            
            try {

                /**
                SELECT "User", "Password", "Nombre", "Apellido1", "Apellido2", "Fecha_nacimiento", "Nacionalidad", "Foto", "Es_organizador"
                FROM "USUARIO_GRUPO" 
                JOIN "USUARIO" 
                ON "Id_usuario" = "USUARIO"."User"
                WHERE "Id_grupo" = 4
                **/

                var usuarios = await _context.Usuario.FromSqlInterpolated($@"
                    SELECT ""User"", ""Password"", ""Nombre"", ""Apellido1"", ""Apellido2"", ""Fecha_nacimiento"", ""Nacionalidad"", ""Foto"", ""Es_organizador""
                    FROM ""USUARIO_GRUPO"" 
                    JOIN ""USUARIO"" 
                    ON ""Id_usuario"" = ""USUARIO"".""User""
                    WHERE ""Id_grupo"" = {idGrupo}
                ").ToListAsync();
                // var usuarios = new List<Usuario>();
                // var search = _context.UsuarioGrupo.AsNoTracking().Where(u => u.IdGrupo == idGrupo).ToList();

                // foreach (var grupo in search) {
                //     var user = await _context.Usuario.FirstOrDefaultAsync(u => u.User == grupo.IdUsuario);
                //     if (user == null) continue;

                //     usuarios.Add(user);
                // }

                return Ok(usuarios);
            } catch (Exception ex) {
                Console.WriteLine(ex.Message);
                return StatusCode(500);
            }
        }

        // DELETE: api/UsuarioGrupo/5
        [HttpDelete("{idGrupo}/{idUsuario}")]
        public async Task<ActionResult<UsuarioGrupo>> DeleteUsuarioGrupo(int idGrupo, string idUsuario)
        {
            if (string.IsNullOrWhiteSpace(idUsuario))
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El id del usuario no puede ser null."));

            // var usuarioGrupo = await _context.UsuarioGrupo.FirstOrDefaultAsync(g => g.IdGrupo == idGrupo && g.IdUsuario == idUsuario);
            var usuarioGrupo = await _context.UsuarioGrupo.FromSqlInterpolated(
                $@"SELECT ""Id"", ""Id_grupo"", ""Id_usuario"" 
                FROM ""USUARIO_GRUPO"" 
                WHERE ""Id_grupo"" = {idGrupo} AND ""Id_usuario"" = {idUsuario}").FirstOrDefaultAsync();
            if (usuarioGrupo == null) 
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El usuario no pertence al grupo dado."));

            // _context.UsuarioGrupo.Remove(usuarioGrupo);
            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                DELETE FROM ""USUARIO_GRUPO"" WHERE ""Id"" = {usuarioGrupo.Id}");
            
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                return StatusCode(500);
            }

            return usuarioGrupo;
        }

        private bool UsuarioGrupoExists(int id)
        {
            return _context.UsuarioGrupo.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_grupo"", ""Id_usuario"" 
                FROM ""USUARIO_GRUPO"" WHERE ""Id"" = {id}").Any();
            // return _context.UsuarioGrupo.Any(e => e.Id == id);
        }
    }
}
