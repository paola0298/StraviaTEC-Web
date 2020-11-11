using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Requests;

using StraviaTec_Web.Helpers;
using System.Collections.Generic;
using System.Linq;

namespace StraviaTec_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AmigosController: ControllerBase
    {
        private readonly AppDbContext _context;

        public AmigosController(AppDbContext context) {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AgregarAmigoAsync(InfoAmigo info) 
        {
            if (info == null || string.IsNullOrWhiteSpace(info.User) || string.IsNullOrWhiteSpace(info.AmigoUser))
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El id del usuario y del amigo no pueden ser null."));

            var userExist = await _context.Usuario.AnyAsync(u => u.User == info.User);
            var amigoExist = await _context.Usuario.AnyAsync(u => u.User == info.AmigoUser);

            if (!userExist || !amigoExist)
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El usuario o el amigo dado no existen."));
            
            var amistad = new UsuarioAmigo {
                IdUsuario = info.User,
                IdAmigo = info.AmigoUser,
                FechaAmigos = DateTime.UtcNow
            };
            
            await _context.UsuarioAmigo.AddAsync(amistad);

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> ObtenerAmigos(string username) {
            if (username == null) {
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El id del usuario no puede ser null."));
            }

            var user = await _context.Usuario.FirstOrDefaultAsync(u => u.User == username);
            
            if (user == null)
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El usuario dado no existe."));

            try
            {
                var amigos = new List<Usuario>();
                var search = _context.UsuarioAmigo.AsNoTracking().Where(u => u.IdUsuario == username).ToList();

                foreach (var amigo in search) {
                    var amigoUser = await _context.Usuario.FirstOrDefaultAsync(p => p.User == amigo.IdAmigo);

                    if (amigoUser == null) continue;

                    amigos.Add(amigoUser);
                }

                return Ok(amigos);
            } catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}/{friendId}")]
        public async Task<ActionResult<UsuarioAmigo>> DeleteAmigoUsuario(string id, string friendId) {
            if (string.IsNullOrWhiteSpace(friendId) || string.IsNullOrWhiteSpace(id))
                return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "El id del usuario y del amigo no pueden ser null."));

            var amistad = await _context.UsuarioAmigo.FirstOrDefaultAsync(a => a.IdUsuario == id && a.IdAmigo == friendId);
            if (amistad == null) {
                 return BadRequest(new ErrorInfo(ErrorCode.BadRequest, "La amistad dada no existe."));
            }   

            _context.UsuarioAmigo.Remove(amistad);
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                return StatusCode(500);
            }

            return amistad;
        }
    }
}