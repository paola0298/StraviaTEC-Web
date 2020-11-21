using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Dtos;
using StraviaTec_Web.Models.Requests;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetoController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;


        public RetoController(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }


    // GET: api/Reto/user/id
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<CarreraDto>>> GetReto(string id)
        {
            var user = await _context.Usuario
                .Where(u => u.User == id)
                .Include(u => u.UsuarioGrupo)
                .FirstOrDefaultAsync();

            if (user == null)
                return BadRequest();
            
            var visibles = _context.Reto
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.PatrocinadorEvento)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.EventoGrupo)
                .Where(c => !c.IdEventoNavigation.EsPrivado)
                .ToList();

            var privados = _context.Reto
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.PatrocinadorEvento)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.EventoGrupo)
                .Where(c => c.IdEventoNavigation.EsPrivado);

            foreach (var reto in privados)
            {
                var evento = reto.IdEventoNavigation;
                foreach (var grupo in evento.EventoGrupo)
                {
                    if (!UserInGroup(grupo.IdGrupoNavigation, user))
                        continue;
                    visibles.Append(reto);
                }
            }
            return Ok(visibles.Select(c => _mapper.Map<CarreraDto>(c)));
        }

         private bool UserInGroup(Grupo group, Usuario user) 
        {
            var usersInGroup = _context.UsuarioGrupo
                .Where(g => g.IdGrupo == group.Id);

            return usersInGroup.Any(g => g.IdUsuario == user.User);
        }

        // GET: api/Reto
        [HttpGet]
        public IActionResult GetAllRetos()
        {
            var retos = _context.Reto
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.PatrocinadorEvento)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.EventoGrupo);
            Console.WriteLine(retos.ToString());
            return Ok(retos.Select(c => _mapper.Map<RetoDto>(c)));
        }

         // GET: api/Reto/id
        [HttpGet("{id}")]
        public async Task<ActionResult<RetoDto>> GetReto(int id)
        {
            var reto = await _context.Reto
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.PatrocinadorEvento)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.EventoGrupo)
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (reto == null)
            {
                return NotFound();
            }
            Console.WriteLine(reto.Id);
            Console.WriteLine(reto.IdTipoReto);
            Console.WriteLine(reto.Objetivo);
            var retoDto = _mapper.Map<RetoDto>(reto);
            

            return retoDto;
        }

         // PUT: api/Carreras/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReto(int id, RetoInfo retoInfo)
        {   
            if (id <= 0 || retoInfo == null)
            {
                return BadRequest();
            }

            var reto = await _context.Reto
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (reto == null) 
            {
                return NotFound();
            }

            var evento = await _context.Evento
                .Where(e => e.Id == reto.IdEvento)
                .Include(e => e.PatrocinadorEvento)
                .Include(e => e.EventoGrupo)
                .FirstOrDefaultAsync();

            if (evento == null)
            {
                return StatusCode(500);
            }

            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            reto.Inicio = retoInfo.Inicio;
            reto.Fin = retoInfo.Fin;
            reto.Objetivo = retoInfo.Objetivo;

     

            await _context.SaveChangesAsync();

         

            evento.Nombre = retoInfo.Nombre;
            evento.IdTipoActividad = retoInfo.IdActividad;
            evento.EsPrivado = retoInfo.EsPrivado;

            _context.PatrocinadorEvento.RemoveRange(evento.PatrocinadorEvento);
            _context.EventoGrupo.RemoveRange(evento.EventoGrupo);

            await _context.SaveChangesAsync();

            foreach (var patrocinador in retoInfo.Patrocinadores)
            {
                var patrocinadorData = new PatrocinadorEvento
                {
                    IdEvento = evento.Id,
                    IdPatrocinador = patrocinador
                };
                await _context.PatrocinadorEvento.AddAsync(patrocinadorData);
                await _context.SaveChangesAsync();
            }

            foreach (var grupo in retoInfo.Grupos)
            {
                var grupoEvento = new EventoGrupo
                {
                    IdEvento = evento.Id,
                    IdGrupo = grupo
                };
                await _context.EventoGrupo.AddAsync(grupoEvento);
                await _context.SaveChangesAsync();
            }

            await dbTransaction.CommitAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Reto>> PostReto(RetoInfo data)
        {
            using var dbTransaction = await _context.Database.BeginTransactionAsync();
             try
            {
           
            //Crea entidad Evento
            var idTipoEvento = (await _context.TipoEvento.FirstOrDefaultAsync(e => e.Nombre == "Reto")).Id;
            var evento = new Evento{
                IdTipoEvento = idTipoEvento,
                IdTipoActividad = data.IdActividad,
                Nombre = data.Nombre,
                EsPrivado = data.EsPrivado
            };
            Console.WriteLine(evento.IdTipoEvento);
            Console.WriteLine(evento.IdTipoActividad);
            Console.WriteLine(evento.Nombre);
            Console.WriteLine(evento.EsPrivado);

            await _context.Evento.AddAsync(evento);
            await _context.SaveChangesAsync();

            //Crea entidad Reto
            var reto = new Reto{
                IdEvento = evento.Id,
                IdTipoReto = data.IdTipoReto,
                Inicio = data.Inicio,
                Fin = data.Fin,
                Objetivo = data.Objetivo,
            };
            Console.WriteLine(reto.IdEvento);
            Console.WriteLine(reto.IdTipoReto);
            Console.WriteLine(reto.Inicio);
            Console.WriteLine(reto.Fin);
            Console.WriteLine(reto.Objetivo);

            await _context.Reto.AddAsync(reto);
            await _context.SaveChangesAsync();

           //Entidades patrocinador y grupos si es privado
           foreach (var patrocinador in data.Patrocinadores) 
                {
                    var patrocinadorEvento = new PatrocinadorEvento
                    {
                        IdEvento = evento.Id,
                        IdPatrocinador = patrocinador
                    };
            Console.WriteLine(patrocinadorEvento.IdPatrocinador);
                    await _context.PatrocinadorEvento.AddAsync(patrocinadorEvento);
                    await _context.SaveChangesAsync();
                }

                 if (data.EsPrivado) 
                {
                    foreach (var grupo in data.Grupos)
                    {
                        var grupoEvento = new EventoGrupo
                        {
                            IdEvento = evento.Id,
                            IdGrupo = grupo
                        };
                        await _context.EventoGrupo.AddAsync(grupoEvento);
                        await _context.SaveChangesAsync();
                    }
                }
                await dbTransaction.CommitAsync();
                var retoDto = _mapper.Map<RetoDto>(reto);
                return CreatedAtAction("GetReto", new { id = reto.Id }, retoDto);
                } catch (DbUpdateException ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/Reto/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reto>> DeleteReto(int id)
        {
            Console.WriteLine(id);
            var reto = await _context.Reto.FindAsync(id);
            if (reto == null)
            {
                return NotFound();
            }
            Console.WriteLine(reto.IdEvento);
            var evento = await _context.Evento.FindAsync(reto.IdEvento);
            Console.WriteLine(evento.Nombre);
            _context.Evento.Remove(evento);
            // _context.Reto.Remove(reto);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("inscripcion")]
        public async Task<IActionResult> InscripcionAsync(InscripcionReto info) {
            if (!RetoExists(info.IdReto)) {
                return BadRequest();
            }

            var userExist = _context.Usuario.FromSqlInterpolated($@"
                SELECT ""User"", ""Password"", ""Nombre"", ""Apellido1"", ""Apellido2"", ""Fecha_nacimiento"", ""Nacionalidad"", ""Foto"", ""Es_organizador"" 
                FROM ""USUARIO"" 
                WHERE ""User"" = {info.User}").Any();
            
            if (!userExist) {
                return BadRequest();
            }

            var reto = await _context.Reto.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_tipo_reto"", ""Inicio"", ""Fin"", ""Objetivo"" 
                FROM ""RETO"" WHERE ""Id"" = {info.IdReto}").FirstOrDefaultAsync();

            if (reto == null) {
                return BadRequest();
            }

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""INSCRIPCION_EVENTO"" (""Id_evento"", ""Id_usuario"", ""Estado"") 
                VALUES ({reto.IdEvento}, {info.User}, 'aprobado')");

            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool RetoExists(int id)
        {
            return _context.Reto.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_evento"", ""Id_tipo_reto"", ""Inicio"", ""Fin"", ""Objetivo"" 
                FROM ""RETO"" WHERE ""Id"" = {id}").Any();
            // return _context.Reto.Any(e => e.Id == id);
        }
    }
}