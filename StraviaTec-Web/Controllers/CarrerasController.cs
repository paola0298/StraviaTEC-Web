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
    public class CarrerasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CarrerasController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Carreras
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<CarreraDto>>> GetCarrera(string id)
        {
            var user = await _context.Usuario
                .Where(u => u.User == id)
                .Include(u => u.UsuarioGrupo)
                .FirstOrDefaultAsync();

            if (user == null)
                return BadRequest();
            
            var visibles = _context.Carrera
                .Include(c => c.CuentaBancaria)
                .Include(c => c.CategoriaCarrera)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.PatrocinadorEvento)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.EventoGrupo)
                .Where(c => !c.IdEventoNavigation.EsPrivado)
                .ToList();

            var privados = _context.Carrera
                .Include(c => c.CuentaBancaria)
                .Include(c => c.CategoriaCarrera)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.PatrocinadorEvento)
                .Include(c => c.IdEventoNavigation)
                    .ThenInclude(e => e.EventoGrupo)
                .Where(c => c.IdEventoNavigation.EsPrivado);

            foreach (var carrera in privados)
            {
                var evento = carrera.IdEventoNavigation;
                foreach (var grupo in evento.EventoGrupo)
                {
                    if (!UserInGroup(grupo.IdGrupoNavigation, user))
                        continue;
                    visibles.Append(carrera);
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

        // GET: api/Carreras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CarreraDto>> GetCarrera(int id)
        {
            var carrera = await _context.Carrera.FindAsync(id);

            if (carrera == null)
            {
                return NotFound();
            }

            var carreraDto = _mapper.Map<CarreraDto>(carrera);

            return carreraDto;
        }

        // PUT: api/Carreras/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCarrera(int id, CarreraInfo carreraInfo)
        {   
            if (id <= 0 || carreraInfo == null)
            {
                return BadRequest();
            }

            var carrera = await _context.Carrera
                .Where(c => c.Id == id)
                .Include(c => c.CategoriaCarrera)
                .Include(c => c.CuentaBancaria)
                .FirstOrDefaultAsync();

            if (carrera == null) 
            {
                return NotFound();
            }

            // var evento = await _context.Evento.FindAsync(carrera.IdEvento);
            var evento = await _context.Evento
                .Where(e => e.Id == carrera.IdEvento)
                .Include(e => e.PatrocinadorEvento)
                .Include(e => e.EventoGrupo)
                .FirstOrDefaultAsync();

            if (evento == null)
            {
                return StatusCode(500);
            }

            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            carrera.Nombre = carreraInfo.Nombre;
            carrera.Fecha = carreraInfo.Fecha;
            carrera.Costo = carreraInfo.Costo;

            _context.CategoriaCarrera.RemoveRange(carrera.CategoriaCarrera);
            _context.CuentaBancaria.RemoveRange(carrera.CuentaBancaria);

            await _context.SaveChangesAsync();

            foreach (var cat in carreraInfo.Categorias)
            {
                var categoria = new CategoriaCarrera
                {
                    IdCarrera = carrera.Id,
                    IdCategoria = cat
                };
                await _context.CategoriaCarrera.AddAsync(categoria);
                await _context.SaveChangesAsync();
            }

            foreach (var cuenta in carreraInfo.CuentasBancarias)
            {
                var cuentaBancaria = new CuentaBancaria
                {
                    IdCarrera = carrera.Id,
                    Nombre = cuenta
                };
                await _context.CuentaBancaria.AddAsync(cuentaBancaria);
                await _context.SaveChangesAsync();
            }

            evento.Nombre = carreraInfo.Nombre;
            evento.IdTipoActividad = carreraInfo.TipoActividad;
            evento.EsPrivado = carreraInfo.EsPrivado;

            _context.PatrocinadorEvento.RemoveRange(evento.PatrocinadorEvento);
            _context.EventoGrupo.RemoveRange(evento.EventoGrupo);

            await _context.SaveChangesAsync();

            foreach (var patrocinador in carreraInfo.Patrocinadores)
            {
                var patrocinadorData = new PatrocinadorEvento
                {
                    IdEvento = evento.Id,
                    IdPatrocinador = patrocinador
                };
                await _context.PatrocinadorEvento.AddAsync(patrocinadorData);
                await _context.SaveChangesAsync();
            }

            foreach (var grupo in carreraInfo.Grupos)
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

        // POST: api/Carreras
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Carrera>> PostCarrera(CarreraInfo data)
        {
            /*
            1. Crear entidad Recorrido.
            2. Crear entidades Punto y asignales Id de Recorrido.
            3. Crear entidad Evento y asignarle el Id de TipoEvento y el Id de TipoActividad.
            4. Crear entidad Carrera y asignarle el Id de Evento y el Id de Recorrido.
            5. Crear todas las entidades de PatrocinadorEvento y asignarles el Id de Evento y patrocinador.
            6. Crear todas las entidades de EventoGrupo y asignarles el Id de Evento y grupo.
            7. Crear todas las entidades de CategoriaCarrera y asignarles el Id de Carrera y categoria.
            8. Crear todas las entidades de CuentaBancaria y asignarles el Id de Carrera y nombre.
            */
            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var recorrido = new Recorrido 
                {
                    Nombre = data.Nombre,
                    FechaHora = data.Fecha
                };
                await _context.Recorrido.AddAsync(recorrido);
                await _context.SaveChangesAsync();

                //DEBUG: cargar archivo gpx localmente

                var recorridoData = await System.IO.File.ReadAllTextAsync("C:/Users/Marlo/Desktop/Lunch_Ride.gpx");
                data.ArchivoRecorrido = Convert.ToBase64String(Encoding.UTF8.GetBytes(recorridoData));

                //END_DEBUG

                var puntos = GpxParser.Parse(data.ArchivoRecorrido, recorrido.Id);
                await _context.Punto.AddRangeAsync(puntos);
                await _context.SaveChangesAsync();

                var idTipoEvento = (await _context.TipoEvento.FirstOrDefaultAsync(e => e.Nombre == "Carrera")).Id;
                var evento = new Evento 
                {
                    IdTipoEvento = idTipoEvento,
                    IdTipoActividad = data.TipoActividad,
                    Nombre = data.Nombre,
                    EsPrivado = data.EsPrivado
                };
                await _context.Evento.AddAsync(evento);
                await _context.SaveChangesAsync();

                var carrera = new Carrera
                {
                    IdRecorrido = recorrido.Id,
                    IdEvento = evento.Id,
                    Nombre = data.Nombre,
                    Fecha = data.Fecha,
                    Costo = data.Costo
                };
                await _context.Carrera.AddAsync(carrera);
                await _context.SaveChangesAsync();

                foreach (var patrocinador in data.Patrocinadores) 
                {
                    var patrocinadorEvento = new PatrocinadorEvento
                    {
                        IdEvento = evento.Id,
                        IdPatrocinador = patrocinador
                    };
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

                foreach (var categoria in data.Categorias) 
                {
                    var categoriaEvento = new CategoriaCarrera
                    {
                        IdCarrera = carrera.Id,
                        IdCategoria = categoria
                    };
                    await _context.CategoriaCarrera.AddAsync(categoriaEvento);
                    await _context.SaveChangesAsync();
                }
                

                foreach (var cuenta in data.CuentasBancarias)
                {
                    var cuentaBancaria = new CuentaBancaria
                    {
                        IdCarrera = carrera.Id,
                        Nombre = cuenta
                    };
                    await _context.CuentaBancaria.AddAsync(cuentaBancaria);
                    await _context.SaveChangesAsync();
                }

                await dbTransaction.CommitAsync();

                var response = new {
                    carrera.Id,
                    carrera.Nombre,
                    carrera.Costo,
                    carrera.CuentaBancaria,
                    carrera.CategoriaCarrera
                };

                var carreraDto = _mapper.Map<CarreraDto>(carrera);
                // return CreatedAtAction("GetCarrera", new { id = carrera.Id }, new { carrera.Id, carrera.Nombre, carrera.Costo });
                return CreatedAtAction("GetCarrera", new { id = carrera.Id }, carreraDto);
            
            } catch (DbUpdateException ex)
            {
                return StatusCode(500, ex.Message);
            }      
        }

        // DELETE: api/Carreras/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Carrera>> DeleteCarrera(int id)
        {
            var carrera = await _context.Carrera.FindAsync(id);
            if (carrera == null)
            {
                return NotFound();
            }

            var evento = await _context.Evento.FindAsync(carrera.IdEvento);

            _context.Evento.Remove(evento);
            // _context.Carrera.Remove(carrera);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool CarreraExists(int id)
        {
            return _context.Carrera.Any(e => e.Id == id);
        }
    }
}
