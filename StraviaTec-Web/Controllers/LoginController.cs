using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StraviaTec_Web.Models;

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
            
            //TODO Verificar login
            return Ok();
        }

    }
}