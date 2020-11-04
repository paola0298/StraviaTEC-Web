using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StraviaTec_Web.Models;
using System.Linq;
using StraviaTec_Web.Helpers;

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
        public IActionResult OnLogin(LoginData auth) {
            if (auth == null || string.IsNullOrWhiteSpace(auth.User) || string.IsNullOrWhiteSpace(auth.Password)) {
                return BadRequest();
            }

            var user = _context.Usuario.FirstOrDefault(p => p.User == auth.User);

            if (user == null) {
                return NotFound();
            }

            if (!Encryption.Equals(auth.Password, user.Password)) {
                return BadRequest();
            }

            if (user.EsOrganizador) {
                if (auth.UserType != "organizer")
                    return BadRequest();

                return Ok();
            }

            if (auth.UserType != "athlete") {
                return BadRequest();
            } 

            return Ok();
        }

    }
}