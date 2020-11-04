using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StraviaTec_Web.Models;
using System.Linq;

namespace StraviaTec_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController: ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context) {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> OnLoginAsync(LoginData auth) {
            if (auth == null || string.IsNullOrWhiteSpace(auth.User) || string.IsNullOrWhiteSpace(auth.Password)) {
                return BadRequest();
            }

            var user = _context.USUARIO.FirstOrDefault(p => p.User == auth.User);

            if (user == null) {
                return NotFound();
            }

            if (user.)
            
            //TODO Verificar login
            return Ok();
        }

    }
}