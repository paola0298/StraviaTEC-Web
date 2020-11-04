using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Requests;

using StraviaTec_Web.Helpers;

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
    }
}