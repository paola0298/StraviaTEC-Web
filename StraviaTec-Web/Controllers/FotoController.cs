using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
using StraviaTec_Web.Models;
using System.Linq;
using System.Threading.Tasks;

namespace StraviaTec_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FotoController: ControllerBase
    {
        private readonly AppDbContext _context;

        public FotoController(AppDbContext context) {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhotoAsync(FotoUpload upload) {
            
            var user = _context.USUARIO.FirstOrDefault(p => p.User == upload.User);
            if (user == null) {
                return BadRequest();
            }
            var fotoPath = await FileHandler.SaveFileAsync(upload.Foto, upload.User);
            user.Foto = fotoPath;

            _context.Entry(user).State = EntityState.Modified;
            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();

        }

    }
}